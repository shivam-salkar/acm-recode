'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart2, Cpu, Crosshair, ExternalLink, ShieldAlert, Zap, LayoutGrid } from 'lucide-react';
import { InteractiveHoverButton } from '@/components/ui/interactive-hover-button';
import Link from 'next/link';

export default function LandingPage() {
  const [candles, setCandles] = useState<{ x: number, o: number, c: number, h: number, l: number, up: boolean }[]>([]);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    // Force a scroll calculation on any event
    const handleScroll = () => {
      // Get the current scroll position relative to the viewport
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
      // Get total scrollable height
      const docHeight = Math.max(
        document.body.scrollHeight, document.documentElement.scrollHeight,
        document.body.offsetHeight, document.documentElement.offsetHeight,
        document.body.clientHeight, document.documentElement.clientHeight
      );
      const winHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      const totalHeight = docHeight - winHeight;
      
      const progress = totalHeight > 0 ? scrollTop / totalHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    
    // Initial calculation
    handleScroll();
    
    // Fallback runner to ensure it updates even if events miss
    const interval = setInterval(handleScroll, 100);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    async function fetchMarketData() {
      try {
        // Fetch 200 days of real BTC/USDT data from public API
        const res = await fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=200');
        const rawData = await res.json();

        // Parse Open, High, Low, Close
        const parsed = rawData.map((d: any) => ({
          o: parseFloat(d[1]),
          h: parseFloat(d[2]),
          l: parseFloat(d[3]),
          c: parseFloat(d[4])
        }));

        // To make the background perfectly loop infinitely, we smoothly interpolate 
        // the last 30 candles to end exactly at the first candle's opening price.
        const firstPrice = parsed[0].o;
        for (let i = 170; i < 200; i++) {
          const progress = (i - 170) / 30; // 0.0 to 1.0
          const shift = (firstPrice - parsed[i].c) * progress;
          parsed[i].o += shift;
          parsed[i].h += shift;
          parsed[i].l += shift;
          parsed[i].c += shift;
        }

        // Find min and max for scaling
        const minPrice = Math.min(...parsed.map((d: any) => d.l));
        const maxPrice = Math.max(...parsed.map((d: any) => d.h));
        const range = maxPrice - minPrice;

        const newCandles = parsed.map((d: any, i: number) => {
          // Scale price to SVG Y-coordinates (SVG 0 is top, 400 is bottom)
          // We constrain it between Y: 40 and Y: 360 to leave padding
          const scaleY = (val: number) => 360 - ((val - minPrice) / range) * 320;

          const openY = scaleY(d.o);
          const closeY = scaleY(d.c);
          const highY = scaleY(d.h);
          const lowY = scaleY(d.l);
          const isUp = d.c >= d.o; // Real price went up

          return {
            x: i * 20, // 200 candles * 20px spacing = 4000 total width
            o: Math.min(openY, closeY),  // The physical top of the candle body
            c: Math.abs(closeY - openY), // The height of the candle body
            h: highY, // High is the physically HIGHEST point (lowest Y)
            l: lowY,  // Low is the physically LOWEST point (highest Y)
            up: isUp
          };
        });

        // Small delay to prevent synchronous setState strict mode warnings
        setTimeout(() => setCandles(newCandles), 0);
      } catch (err) {
        console.error("Failed to fetch realistic data:", err);
      }
    }

    fetchMarketData();
  }, []);

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <main className="min-h-screen bg-[#0B0E11] text-gray-200 font-sans selection:bg-[#A0AEC0] selection:text-[#0B0E11] overflow-x-hidden relative">
      {/* Dynamic Gradient Scrollbar Replacement */}
      <div className="fixed right-0 top-0 bottom-0 w-3 z-[100] pointer-events-none hidden md:block">
        <div
          className="absolute top-0 right-0 left-0 bg-[#A0AEC0]/5 h-full"
        />
        <div
          className="absolute right-0 left-0 bg-gradient-to-b from-transparent via-[#A0AEC0] to-transparent transition-all duration-300 ease-out"
          style={{
            height: '25vh',
            top: `${scrollProgress * 0.75}%`,
            boxShadow: '0 0 40px 4px rgba(160, 174, 192, 0.6)'
          }}
        />
        {/* Extra intense core line */}
        <div
          className="absolute right-[5px] w-[2px] bg-white transition-all duration-300 ease-out"
          style={{
            height: '15vh',
            top: `${(scrollProgress * 0.75) + 5}%`,
            boxShadow: '0 0 20px 2px white'
          }}
        />
      </div>

      <div className="absolute top-0 w-full h-[120vh] z-0 overflow-hidden pointer-events-none">
        {/* Animated Candlestick Chart SVG Background */}
        <motion.div
          className="absolute inset-x-0 top-32 h-[600px] w-[200vw]"
          animate={{ x: [0, "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 80 }}
        >
          <svg
            width="200%"
            height="100%"
            viewBox="0 0 8000 400"
            preserveAspectRatio="none"
            className="w-full h-full opacity-70"
          >
            <g>
              {candles.map((c, i) => (
                <g key={`candle-${i}`}>
                  {/* Candlestick Wick */}
                  <line x1={c.x + 6} y1={c.h} x2={c.x + 6} y2={c.l} stroke={c.up ? "#10B981" : "#EF4444"} strokeWidth="2" strokeOpacity="1" />
                  {/* Candlestick Body */}
                  <rect x={c.x} y={c.o} width="12" height={Math.max(c.c, 2)} fill={c.up ? "#10B981" : "#EF4444"} fillOpacity="1" rx="2" />
                </g>
              ))}
              {/* Duplicate Candlesticks for infinite looping */}
              {candles.map((c, i) => (
                <g key={`candle-dup-${i}`} transform="translate(4000, 0)">
                  <line x1={c.x + 6} y1={c.h} x2={c.x + 6} y2={c.l} stroke={c.up ? "#10B981" : "#EF4444"} strokeWidth="2" strokeOpacity="1" />
                  <rect x={c.x} y={c.o} width="12" height={Math.max(c.c, 2)} fill={c.up ? "#10B981" : "#EF4444"} fillOpacity="1" rx="2" />
                </g>
              ))}
            </g>
          </svg>
        </motion.div>

        {/* Fade Out Gradient to blend into below sections */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0B0E11]/80 to-[#0B0E11]" />
      </div>

      <div className="absolute top-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#A0AEC0]/5 via-transparent to-transparent z-0 pointer-events-none" />

      {/* Intense Center Highlight Glow */}
      <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#A0AEC0]/20 rounded-full blur-[100px] md:blur-[150px] pointer-events-none z-0 mix-blend-screen" />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-[#2A2E39] bg-[#0B0E11]/80 backdrop-blur-md z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center space-x-2 text-[#A0AEC0] font-bold tracking-widest uppercase text-lg">
          <Activity size={24} />
          <span>DeepTrade</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="#features" className="text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors hidden sm:block">Features</Link>
          <Link href="/terminal">
            <InteractiveHoverButton text="Launch App" className="h-10 text-sm" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="pt-40 pb-20 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col items-center text-center relative z-10"
      >
        <motion.div
          variants={fadeIn}
          className="mb-8 tracking-[0.2em] md:tracking-[0.4em] uppercase text-sm md:text-base text-[#A0AEC0] font-semibold"
        >
          Next-Generation Market Intelligence
        </motion.div>

        <motion.h1
          variants={fadeIn}
          className="text-7xl sm:text-9xl md:text-[12rem] lg:text-[15rem] font-black tracking-[-0.05em] mb-8 leading-[0.85] text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-200 to-gray-500 drop-shadow-2xl font-[family-name:var(--font-compact)]"
        >
          DEEPTRADE
        </motion.h1>

        <motion.p variants={fadeIn} className="text-lg md:text-2xl text-gray-400 max-w-3xl mb-12 font-light leading-relaxed">
          Harness the power of real-time multi-asset parsing, adaptive AI anomaly detection, and fully customizable drag-and-drop workspaces engineered for high-frequency trading.
        </motion.p>

        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-6">
          <Link href="/terminal">
            <InteractiveHoverButton text="Launch Terminal" className="w-56" />
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-2 border border-[#2A2E39] text-gray-300 rounded-full font-semibold text-sm hover:border-gray-500 hover:bg-[#131722] transition-colors text-center">
            Explore Features
          </a>
        </motion.div>

        {/* Hero Visual */}
        <motion.div
          variants={fadeIn}
          className="mt-20 w-full max-w-5xl relative rounded-xl border border-[#2A2E39] overflow-hidden shadow-2xl bg-[#131722]"
        >
          {/* Mock Terminal Header */}
          <div className="h-10 border-b border-[#2A2E39] bg-[#0B0E11] flex items-center px-4 space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
            <div className="ml-4 pl-4 border-l border-[#2A2E39] text-xs font-mono text-gray-500">deep-trade/terminal</div>
          </div>
          {/* Mock Terminal Body */}
          <div className="aspect-[16/9] w-full bg-[linear-gradient(rgba(42,46,57,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(42,46,57,0.5)_1px,transparent_1px)] bg-[size:30px_30px] opacity-20 relative flex items-center justify-center">
            <Activity size={120} className="text-[#A0AEC0] opacity-50 absolute" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-transparent to-transparent pointer-events-none" />
        </motion.div>
      </motion.section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 lg:px-12 max-w-7xl mx-auto z-10 relative">
        <div className="mb-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-gray-200">Engineered for Performance</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">Everything you need to analyze, trace, and execute efficiently—built directly into your browser with zero latency compromise.</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            { icon: LayoutGrid, title: 'Flexible Workspaces', desc: 'Drag, drop, tear-out, and resize panes infinitely to fit your unique dual-monitor workflow.', color: 'text-blue-400', glow: 'shadow-blue-500/20' },
            { icon: Zap, title: 'Real-time WebSocket', desc: 'Ultra-low latency data streaming powered by highly optimized RxJS internal messaging.', color: 'text-yellow-400', glow: 'shadow-yellow-500/20' },
            { icon: ShieldAlert, title: 'AI Whisper Warnings', desc: 'Real-time anomaly detection identifying spoofing, massive dumps, or erratic behavior automatically.', color: 'text-red-400', glow: 'shadow-red-500/20' },
            { icon: BarChart2, title: 'Advanced Charting', desc: 'Hardware-accelerated rendering utilizing native APIs for unmatched frame rates.', color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
            { icon: Cpu, title: 'Global State Management', desc: 'Synced timeframes and active symbols across every widget locally via Zustand.', color: 'text-purple-400', glow: 'shadow-purple-500/20' },
            { icon: Crosshair, title: 'Precision Tools', desc: 'Pixel-perfect measuring, trend spotting, and annotation tools embedded right into the UI.', color: 'text-orange-400', glow: 'shadow-orange-500/20' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.01 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="relative p-[1px] rounded-xl group h-full flex flex-col"
            >
              {/* Spinning Glow Border Layer */}
              <div className="absolute inset-0 rounded-xl overflow-hidden pointer-events-none">
                <div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_60%,#A0AEC0_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-[-150%] animate-[spin_3s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,transparent_60%,#A0AEC0_100%)] opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
              </div>

              {/* Background Glow (Aura) */}
              <div className="absolute inset-0 bg-[#A0AEC0] opacity-0 group-hover:opacity-20 blur-[60px] rounded-full scale-110 transition-opacity duration-700 pointer-events-none -z-10" />

              {/* Card Content Container */}
              <div className="relative p-6 rounded-xl bg-[#131722]/95 backdrop-blur border border-[#2A2E39] group-hover:border-transparent group-hover:bg-[#1a1e2b]/95 transition-all h-full flex flex-col z-10 m-[1px]">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-xl bg-[#2A2E39]/50 flex items-center justify-center mb-6 ${feature.color} group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 ease-in-out`}>
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 text-gray-200">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm flex-grow">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Custom Global Scrollbar */}
      <div 
        className="fixed right-0 top-0 bottom-0 w-1 sm:w-2 z-[99999] pointer-events-none"
        aria-hidden="true"
      >
        <div 
          className="w-full absolute rounded-full transition-all duration-300 ease-out"
          style={{ 
            height: '15vh',
            transform: `translate3d(0, ${scrollProgress * 85}vh, 0)`,
            background: 'linear-gradient(to bottom, transparent, #FFFFFF 50%, transparent)',
            boxShadow: '0 0 20px 2px rgba(255, 255, 255, 0.4)',
          }}
        />
      </div>

      {/* Footer */}
      <footer className="border-t border-[#2A2E39] py-12 px-6 lg:px-12 text-center text-gray-500 z-10 relative bg-[#0B0E11]">
        <div className="flex items-center justify-center space-x-2 text-[#A0AEC0] font-bold tracking-widest uppercase text-sm mb-6">
          <Activity size={16} />
          <span>DeepTrade</span>
        </div>
        <p>© {new Date().getFullYear()} DeepTrade Technologies. All rights reserved.</p>
      </footer>
    </main>
  );
}
