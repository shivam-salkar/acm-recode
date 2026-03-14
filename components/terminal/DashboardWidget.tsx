'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const DashboardWidget = React.memo(() => {
  return (
    <div className="flex flex-col h-full bg-[#131722] text-sm font-sans overflow-hidden p-4 space-y-4">
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          className="bg-[#0B0E11] border border-[#2A2E39] rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute inset-0 scanlines opacity-20 group-hover:opacity-40 transition-opacity" />
          <span className="text-gray-400 text-xs uppercase tracking-widest mb-2">This Week</span>
          <span className="text-3xl font-mono text-[#f23645] font-bold">-1.01 RR</span>
          <span className="text-gray-500 text-xs mt-1">-$188.21</span>
        </motion.div>

        <motion.div
          className="bg-[#0B0E11] border border-[#2A2E39] rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute inset-0 scanlines opacity-20 group-hover:opacity-40 transition-opacity" />
          <span className="text-gray-400 text-xs uppercase tracking-widest mb-2">This Month</span>
          <span className="text-3xl font-mono text-[#089981] font-bold">+0.52 RR</span>
          <span className="text-gray-500 text-xs mt-1">+$101.30</span>
        </motion.div>

        <motion.div
          className="bg-[#0B0E11] border border-[#2A2E39] rounded-lg p-4 flex flex-col items-center justify-center relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
        >
          <div className="absolute inset-0 scanlines opacity-20 group-hover:opacity-40 transition-opacity" />
          <span className="text-gray-400 text-xs uppercase tracking-widest mb-2">This Year</span>
          <span className="text-3xl font-mono text-[#089981] font-bold">+17.10 RR</span>
          <span className="text-gray-500 text-xs mt-1">+$2,736.67</span>
        </motion.div>
      </div>

      <div className="flex-1 bg-[#0B0E11] border border-[#2A2E39] rounded-lg p-4 flex flex-col">
        <h3 className="text-gray-400 text-xs uppercase tracking-widest mb-4">Trade Log</h3>
        <div className="flex-1 overflow-y-auto font-mono text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2A2E39] text-gray-500">
                <th className="py-2 font-normal">Asset</th>
                <th className="py-2 font-normal">Type</th>
                <th className="py-2 font-normal text-right">PnL</th>
              </tr>
            </thead>
            <tbody>
              {[
                { asset: 'EURNZD', type: 'SHORT', pnl: -188.21 },
                { asset: 'MSFT', type: 'LONG', pnl: 472.15 },
                { asset: 'AAPL', type: 'SHORT', pnl: -182.00 },
                { asset: 'GBPUSD', type: 'LONG', pnl: 714.43 },
              ].map((trade, i) => (
                <tr key={i} className="border-b border-[#2A2E39]/50 hover:bg-[#131722] transition-colors cursor-pointer">
                  <td className="py-3 text-gray-200 font-bold">{trade.asset}</td>
                  <td className="py-3">
                    <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${trade.type === 'LONG' ? 'bg-[#089981]/20 text-[#089981]' : 'bg-[#f23645]/20 text-[#f23645]'}`}>
                      {trade.type}
                    </span>
                  </td>
                  <td className={`py-3 text-right font-bold ${trade.pnl > 0 ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                    {trade.pnl > 0 ? '+' : ''}{trade.pnl.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
});

DashboardWidget.displayName = 'DashboardWidget';
