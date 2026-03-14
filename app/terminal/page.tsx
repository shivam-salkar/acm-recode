'use client';

import React, { useState } from 'react';
import { TerminalLayout, AVAILABLE_WIDGETS } from '@/components/terminal/TerminalLayout';
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
  Ruler,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useTerminalStore } from '@/hooks/useTerminalStore';

export default function Home() {
  const {
    symbol, setSymbol,
    timeframe, setTimeframe,
    activeTool, setActiveTool,
    isSearchOpen, setSearchOpen,
    isSettingsOpen, setSettingsOpen,
    isNotificationsOpen, setNotificationsOpen,
    isProfileOpen, setProfileOpen,
    setLayoutAction
  } = useTerminalStore();

  const [activeSettingsTab, setActiveSettingsTab] = useState<string | null>(null);
  const [isAddWidgetOpen, setIsAddWidgetOpen] = useState(false);

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
          <Link href="/" className="flex items-center space-x-2 text-[#A0AEC0] font-bold tracking-widest uppercase text-sm hover:text-white transition-colors cursor-pointer">
            <Activity size={18} />
            <span>DeepTrade</span>
          </Link>

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
            <div className="w-px h-4 bg-[#2A2E39]" />

            <div className="relative">
              <button
                onClick={() => setIsAddWidgetOpen(!isAddWidgetOpen)}
                className="flex items-center space-x-1 hover:text-gray-200 transition-colors"
              >
                <span>+ Add Widget</span>
              </button>
              {isAddWidgetOpen && (
                <div className="absolute top-8 left-0 w-48 bg-[#131722] border border-[#2A2E39] text-xs rounded shadow-2xl text-left z-50 py-1 overflow-hidden">
                  <div className="px-3 py-2 text-gray-500 font-semibold border-b border-[#2A2E39]">Widgets</div>
                  <div className="flex flex-col max-h-64 overflow-y-auto">
                    {AVAILABLE_WIDGETS.map((w, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setLayoutAction({ type: 'ADD_WIDGET', widget: w });
                          setIsAddWidgetOpen(false);
                        }}
                        className="px-3 py-2 text-left hover:bg-[#2A2E39] cursor-pointer transition-colors text-gray-300 hover:text-white"
                      >
                        {w.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setLayoutAction({ type: 'RESET_LAYOUT' })}
              className="flex items-center space-x-1 hover:text-red-400 transition-colors text-gray-400"
              title="Reset Layout"
            >
              <span>Reset Layout</span>
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
            {isSettingsOpen && (
              <div className="absolute top-6 right-0 w-48 bg-[#131722] border border-[#2A2E39] text-xs rounded shadow-2xl text-left z-50 py-1 overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="px-3 py-2 text-gray-500 font-semibold border-b border-[#2A2E39]">Settings</div>
                <div className="flex flex-col">
                  <div onClick={() => { setActiveSettingsTab('trading'); setSettingsOpen(false); }} className="px-3 py-2 hover:bg-[#2A2E39] cursor-pointer transition-colors text-gray-300 hover:text-white flex justify-between">Trading Defaults <span>❯</span></div>
                  <div onClick={() => { setActiveSettingsTab('theme'); setSettingsOpen(false); }} className="px-3 py-2 hover:bg-[#2A2E39] cursor-pointer transition-colors text-gray-300 hover:text-white flex justify-between">Theme & Colors <span>❯</span></div>
                  <div onClick={() => { setActiveSettingsTab('data'); setSettingsOpen(false); }} className="px-3 py-2 hover:bg-[#2A2E39] cursor-pointer transition-colors text-gray-300 hover:text-white flex justify-between">Data Sources <span>❯</span></div>
                  <div onClick={() => { setActiveSettingsTab('performance'); setSettingsOpen(false); }} className="px-3 py-2 hover:bg-[#2A2E39] cursor-pointer transition-colors text-gray-300 hover:text-white flex justify-between">Performance <span>❯</span></div>
                  <div onClick={() => { setActiveSettingsTab('audio'); setSettingsOpen(false); }} className="px-3 py-2 hover:bg-[#2A2E39] cursor-pointer transition-colors text-gray-300 hover:text-white flex justify-between">Audio & Alerts <span>❯</span></div>
                  <div onClick={() => { setActiveSettingsTab('security'); setSettingsOpen(false); }} className="px-3 py-2 hover:bg-[#2A2E39] cursor-pointer transition-colors text-gray-300 hover:text-white flex justify-between">Security <span>❯</span></div>
                  <div className="w-full h-px bg-[#2A2E39] my-1" />
                  <div
                    onClick={() => {
                      localStorage.removeItem('deeptrade-layout-v3');
                      window.location.reload();
                    }}
                    className="px-3 py-2 hover:bg-[#2A2E39] cursor-pointer transition-colors text-red-400 hover:text-red-300"
                  >
                    Reset Layout
                  </div>
                </div>
              </div>
            )}
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

          <AnimatePresence>
            {activeSettingsTab && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={() => setActiveSettingsTab(null)}
              >
                <motion.div
                  initial={{ scale: 0.95, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.95, y: 20 }}
                  className="w-full max-w-3xl h-[600px] bg-[#131722] border border-[#2A2E39] rounded-xl shadow-2xl flex overflow-hidden flex-col"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="h-14 border-b border-[#2A2E39] px-6 flex items-center justify-between shrink-0 bg-[#0B0E11]">
                    <div className="flex items-center space-x-2 text-gray-200 font-bold">
                      <Settings size={18} className="text-[#A0AEC0]" />
                      <span>Platform Settings</span>
                    </div>
                    <button
                      onClick={() => setActiveSettingsTab(null)}
                      className="text-gray-500 hover:text-gray-200 transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="flex flex-1 overflow-hidden">
                    <div className="w-48 border-r border-[#2A2E39] bg-[#0B0E11] p-4 flex flex-col gap-2 shrink-0">
                      {[
                        { id: 'trading', label: 'Trading Defaults' },
                        { id: 'theme', label: 'Theme & Colors' },
                        { id: 'data', label: 'Data Sources' },
                        { id: 'performance', label: 'Performance' },
                        { id: 'audio', label: 'Audio & Alerts' },
                        { id: 'security', label: 'Security' },
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveSettingsTab(tab.id)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSettingsTab === tab.id ? 'bg-[#2A2E39] text-[#A0AEC0]' : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1e2b]'}`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <div className="flex-1 p-8 overflow-y-auto bg-[#131722]">
                      {activeSettingsTab === 'trading' && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-bold text-gray-200 border-b border-[#2A2E39] pb-4">Trading Defaults</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-gray-400 block mb-2">Default Order Size (USD)</label>
                              <input type="number" defaultValue={100} className="bg-[#0B0E11] border border-[#2A2E39] rounded px-3 py-2 text-gray-200 w-full max-w-xs focus:outline-none focus:border-[#A0AEC0]" />
                            </div>
                            <div>
                              <label className="text-sm text-gray-400 block mb-2">Max Slippage Tolerance (%)</label>
                              <input type="number" defaultValue={0.1} step={0.1} className="bg-[#0B0E11] border border-[#2A2E39] rounded px-3 py-2 text-gray-200 w-full max-w-xs focus:outline-none focus:border-[#A0AEC0]" />
                            </div>
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input type="checkbox" defaultChecked className="form-checkbox bg-transparent border-[#2A2E39] text-[#A0AEC0] rounded focus:ring-0 w-4 h-4" />
                              <span className="text-gray-300">Enable One-Click Execution</span>
                            </label>
                          </div>
                        </div>
                      )}
                      {activeSettingsTab === 'data' && (
                        <div className="space-y-6">
                          <h3 className="text-xl font-bold text-gray-200 border-b border-[#2A2E39] pb-4">Data Sources</h3>
                          <div className="space-y-4">
                            <div>
                              <label className="text-sm text-gray-400 block mb-2">Primary Exchange Feed</label>
                              <select className="bg-[#0B0E11] border border-[#2A2E39] rounded px-3 py-2 text-gray-200 w-full max-w-xs focus:outline-none focus:border-[#A0AEC0]">
                                <option>Binance (WebSockets)</option>
                                <option>Coinbase Pro (FIX)</option>
                                <option>Kraken (WebSockets)</option>
                              </select>
                            </div>
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input type="checkbox" defaultChecked className="form-checkbox bg-transparent border-[#2A2E39] text-[#A0AEC0] rounded focus:ring-0 w-4 h-4" />
                              <span className="text-gray-300">Use Aggregated Multi-Exchange Index</span>
                            </label>
                            <label className="flex items-center space-x-3 cursor-pointer">
                              <input type="checkbox" defaultChecked className="form-checkbox bg-transparent border-[#2A2E39] text-[#A0AEC0] rounded focus:ring-0 w-4 h-4" />
                              <span className="text-gray-300">Parse Mempool for Unconfirmed TXs (Pro Only)</span>
                            </label>
                          </div>
                        </div>
                      )}
                      {(activeSettingsTab !== 'trading' && activeSettingsTab !== 'data') && (
                        <div className="space-y-6 opacity-60">
                          <h3 className="text-xl font-bold text-gray-200 border-b border-[#2A2E39] pb-4 capitalize">{activeSettingsTab} Options</h3>
                          <p className="text-gray-400 text-sm">Advanced configuration options for {activeSettingsTab} are actively being developed for the production applet. Default optimized settings are currently active.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <TerminalLayout />
        </div>
      </div>
    </main>
  );
}
