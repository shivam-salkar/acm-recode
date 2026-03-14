'use client';

import React, { useEffect, useState } from 'react';
import { rxBus, MarketTick } from '@/lib/rx-bus';
import { motion } from 'framer-motion';
import { useTerminalStore } from '@/hooks/useTerminalStore';

const SYMBOLS = ['BTC/USD', 'ETH/USD', 'NIFTY50', 'RELIANCE'];

export const WatchlistWidget = React.memo(() => {
  const [ticks, setTicks] = useState<Record<string, MarketTick>>({});
  const [prevTicks, setPrevTicks] = useState<Record<string, MarketTick>>({});
  const setSymbol = useTerminalStore((state) => state.setSymbol);

  useEffect(() => {
    const sub = rxBus.getTicks().subscribe((tick) => {
      setTicks((prev) => {
        setPrevTicks((old) => ({ ...old, [tick.symbol]: prev[tick.symbol] }));
        return { ...prev, [tick.symbol]: tick };
      });
    });

    return () => sub.unsubscribe();
  }, []);

  // Generate stable random changes for demo purposes
  const getChange = (symbol: string) => {
    const hash = symbol.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return ((hash % 100) / 50 - 1) * 2; // -2 to 2
  };

  return (
    <div className="flex flex-col h-full bg-[#131722] text-xs font-mono overflow-hidden">
      <div className="flex justify-between p-2 border-b border-[#2A2E39] text-gray-400 uppercase font-sans font-semibold tracking-wider">
        <span>Symbol</span>
        <span>Last</span>
        <span>Chg%</span>
      </div>

      <div className="flex-1 overflow-y-auto">
        {SYMBOLS.map((symbol) => {
          const tick = ticks[symbol];
          const prevTick = prevTicks[symbol];

          if (!tick) return null;

          const isUp = prevTick ? tick.price > prevTick.price : true;
          const isDown = prevTick ? tick.price < prevTick.price : false;
          const colorClass = isUp ? 'text-[#089981]' : isDown ? 'text-[#f23645]' : 'text-gray-300';
          const bgClass = isUp ? 'bg-[#089981]/10' : isDown ? 'bg-[#f23645]/10' : 'bg-transparent';

          return (
            <motion.div
              key={symbol} onClick={() => setSymbol(symbol)} className={`flex justify-between px-3 py-2 border-b border-[#2A2E39]/50 hover:bg-[#2A2E39] cursor-pointer transition-colors duration-200`}
              initial={false}
              animate={{ backgroundColor: bgClass }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex flex-col">
                <span className="text-gray-200 font-bold">{symbol}</span>
                <span className="text-gray-500 text-[10px]">Vol: {tick.volume.toFixed(1)}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className={`${colorClass} font-bold`}>{tick.price.toFixed(2)}</span>
                <span className={`${colorClass} text-[10px]`}>
                  {isUp ? '+' : ''}{getChange(symbol).toFixed(2)}%
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
});

WatchlistWidget.displayName = 'WatchlistWidget';
