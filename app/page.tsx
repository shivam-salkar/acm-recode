'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, BarChart2, Cpu, Crosshair, ExternalLink, ShieldAlert, Zap, LayoutGrid } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [candles, setCandles] = useState<{x: number, o: number, c: number, h: number, l: number, up: boolean}[]>([]);
  
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
        for(let i = 170; i < 200; i++) {
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

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } }
  };

  return (
    <main className="min-h-screen bg-[#0B0E11] text-gray-200 font-sans selection:bg-[#A0AEC0] selection:text-[#0B0E11] overflow-x-hidden relative">
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

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 h-16 border-b border-[#2A2E39] bg-[#0B0E11]/80 backdrop-blur-md z-50 flex items-center justify-between px-6 lg:px-12">
        <div className="flex items-center space-x-2 text-[#A0AEC0] font-bold tracking-widest uppercase text-lg">
          <Activity size={24} />
          <span>DeepTrade</span>
        </div>
        <div className="flex items-center space-x-6">
          <Link href="#features" className="text-sm font-medium text-gray-400 hover:text-gray-200 transition-colors hidden sm:block">Features</Link>
          <Link
            href="/terminal"
            className="flex items-center space-x-2 bg-[#2A2E39] hover:bg-[#A0AEC0] text-gray-200 hover:text-[#0B0E11] transition-all px-4 py-2 rounded-md font-semibold text-sm group"
          >
            <span>Launch App</span>
            <ExternalLink size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
        <motion.div variants={fadeIn} className="inline-flex items-center justify-center space-x-2 px-4 py-1.5 rounded-full border border-[#2A2E39] bg-[#131722]/80 backdrop-blur-sm text-sm text-gray-400 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A0AEC0] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A0AEC0]"></span>
          </span>
          <span>v2.0 Beta Terminal is live</span>
        </motion.div>

        <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight">
          Next-Generation Market <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">
            Intelligence Terminal
          </span>
        </motion.h1>

        <motion.p variants={fadeIn} className="text-lg lg:text-xl text-gray-400 max-w-2xl mb-12 font-light leading-relaxed">
          Harness the power of real-time multi-asset parsing, adaptive AI anomaly detection, and fully customizable drag-and-drop workspaces engineered for high-frequency trading.
        </motion.p>

        <motion.div variants={fadeIn} className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/terminal"
            className="w-full sm:w-auto px-8 py-4 bg-[#A0AEC0] text-[#0B0E11] rounded-lg font-bold text-lg hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(160,174,192,0.2)] hover:shadow-[0_0_30px_rgba(160,174,192,0.4)]"
          >
            Launch Terminal
          </Link>
          <a href="#features" className="w-full sm:w-auto px-8 py-4 border border-[#2A2E39] text-gray-300 rounded-lg font-semibold text-lg hover:border-gray-500 hover:bg-[#131722] transition-colors text-center">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: LayoutGrid, title: 'Flexible Workspaces', desc: 'Drag, drop, tear-out, and resize panes infinitely to fit your unique dual-monitor workflow.' },
            { icon: Zap, title: 'Real-time WebSocket', desc: 'Ultra-low latency data streaming powered by highly optimized RxJS internal messaging.' },
            { icon: ShieldAlert, title: 'AI Whisper Warnings', desc: 'Real-time anomaly detection identifying spoofing, massive dumps, or erratic behavior automatically.' },
            { icon: BarChart2, title: 'Advanced Charting', desc: 'Hardware-accelerated rendering utilizing native APIs for unmatched frame rates.' },
            { icon: Cpu, title: 'Global State Management', desc: 'Synced timeframes and active symbols across every widget locally via Zustand.' },
            { icon: Crosshair, title: 'Precision Tools', desc: 'Pixel-perfect measuring, trend spotting, and annotation tools embedded right into the UI.' },
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-6 rounded-xl bg-[#131722]/80 backdrop-blur border border-[#2A2E39] hover:border-[#A0AEC0]/40 hover:bg-[#1a1e2b] transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#2A2E39]/50 flex items-center justify-center mb-6 text-gray-400 group-hover:text-[#A0AEC0] group-hover:scale-110 transition-all">
                <feature.icon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-gray-200">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

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
