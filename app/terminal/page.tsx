'use client';

import React from 'react';
import { TerminalLayout } from '@/components/terminal/TerminalLayout';
import {
  LineChart,
  BarChart2,
  Activity,
  Settings,
  Maximize,
  Search,
  Bell,
  User,
  PenTool,
  Crosshair,
  TrendingUp,
  Type,
  Ruler
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useTerminalStore } from '@/hooks/useTerminalStore';

export default function Home() {
  const { 
    symbol, setSymbol,
    timeframe, setTimeframe, 
    activeTool, setActiveTool,
    isSearchOpen, setSearchOpen,
    isSettingsOpen, setSettingsOpen,
    isNotificationsOpen, setNotificationsOpen,
    isProfileOpen, setProfileOpen
  } = useTerminalStore();

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <main className="flex flex-col h-screen w-screen bg-[#0B0E11] text-gray-200 overflow-hidden font-sans">
      {/* Top Navigation Bar */}
      <header className="h-12 border-b border-[#2A2E39] bg-[#131722] flex items-center justify-between px-4 shrink-0 z-20 relative">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2 text-[#A0AEC0] font-bold tracking-widest uppercase text-sm">
            <Activity size={18} />
            <span>DeepTrade</span>
          </div>

          <div 
            onClick={() => setSearchOpen(true)}
            className="flex items-center space-x-1 bg-[#0B0E11] rounded px-3 py-1.5 border border-[#2A2E39] hover:border-[#A0AEC0]/50 transition-colors cursor-pointer group"
          >
            <Search size={14} className="text-gray-500 group-hover:text-[#A0AEC0] transition-colors" />
            <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">{symbol} - Search</span>
          </div>

          <div className="flex items-center space-x-4 text-xs font-semibold text-gray-400">
            {['1m', '5m', '1h', 'D'].map((tf) => (
              <button 
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`transition-colors ${timeframe === tf ? 'text-[#A0AEC0]' : 'hover:text-gray-200'}`}
              >
                {tf}
              </button>
            ))}
            <div className="w-px h-4 bg-[#2A2E39]" />
            <button className="flex items-center space-x-1 hover:text-gray-200 transition-colors">
              <BarChart2 size={14} />
              <span>Indicators</span>
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-gray-400">
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setNotificationsOpen(!isNotificationsOpen)}
            className={`transition-colors relative ${isNotificationsOpen ? 'text-[#A0AEC0]' : 'hover:text-gray-200'}`}
          >
            <Bell size={16} />
            {isNotificationsOpen && <div className="absolute top-6 right-0 w-48 bg-[#131722] border border-[#2A2E39] p-2 text-xs rounded shadow-xl text-left z-50">No new notifications</div>}
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setSettingsOpen(!isSettingsOpen)}
            className={`transition-colors relative ${isSettingsOpen ? 'text-[#A0AEC0]' : 'hover:text-gray-200'}`}
          >
            <Settings size={16} />
            {isSettingsOpen && <div className="absolute top-6 right-0 w-32 bg-[#131722] border border-[#2A2E39] p-2 text-xs rounded shadow-xl text-left z-50 cursor-pointer hover:text-white">Preferences</div>}
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={handleFullscreen}
            className="hover:text-gray-200 transition-colors"
          >
            <Maximize size={16} />
          </motion.button>
          
          <div className="w-px h-4 bg-[#2A2E39]" />
          
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.95 }} 
            onClick={() => setProfileOpen(!isProfileOpen)}
            className={`transition-colors relative ${isProfileOpen ? 'text-[#A0AEC0]' : 'hover:text-gray-200'}`}
          >
            <User size={16} />
            {isProfileOpen && <div className="absolute top-6 right-0 w-32 bg-[#131722] border border-[#2A2E39] p-2 text-xs rounded shadow-xl text-left z-50 cursor-pointer hover:text-white">Sign Out</div>}
          </motion.button>
        </div>
      </header>

      {/* Main Workspace */}
      <div className="flex flex-1 overflow-hidden relative z-10">
        {/* Left Drawing Toolbar */}
        <aside className="w-12 border-r border-[#2A2E39] bg-[#131722] flex flex-col items-center py-4 space-y-6 shrink-0 z-20">
          {[Crosshair, TrendingUp, PenTool, Type, Ruler].map((Icon, i) => (
            <motion.button
              key={i}
              onClick={() => setActiveTool(i)}
              whileHover={{ scale: 1.1, color: '#A0AEC0' }}
              whileTap={{ scale: 0.9 }}
              className={`transition-colors relative group ${activeTool === i ? 'text-[#A0AEC0]' : 'text-gray-500'}`}
            >
              <Icon size={18} />
              <div className="absolute left-full ml-2 px-2 py-1 bg-[#2A2E39] text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
                {['Crosshair', 'Trend Line', 'Brush', 'Text', 'Measure'][i]}
              </div>
            </motion.button>
          ))}
        </aside>

        {/* FlexLayout Container */}
        <div className="flex-1 relative">
          {isSearchOpen && (
            <div className="absolute top-4 left-4 z-50 bg-[#131722] border border-[#2A2E39] rounded shadow-2xl p-4 w-64">
              <input 
                autoFocus
                type="text" 
                placeholder="Search symbol..." 
                className="w-full bg-[#0B0E11] text-gray-200 border border-[#2A2E39] rounded px-3 py-2 text-sm focus:outline-none focus:border-[#A0AEC0]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value) {
                    setSymbol(e.currentTarget.value.toUpperCase());
                    setSearchOpen(false);
                  }
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
              />
              <p className="text-xs text-gray-500 mt-2">Press Enter to select, Esc to close</p>
            </div>
          )}
          <TerminalLayout />
        </div>
      </div>
    </main>
  );
}
