'use client';

import React, { useEffect, useState } from 'react';
import { ListOrdered } from 'lucide-react';

const initialTrades = [
  { pair: 'EURNZD', type: 'SHORT', strategy: 'Breakout', date: 'Thursday, 25th Aug 2026 - Friday, 26th Aug 2026', rr: -1.01, percent: -1.04, amount: -188.21 },
  { pair: 'MSFT', type: 'LONG', strategy: 'Pattern Play', date: 'Wednesday, 10th Aug 2026 - Friday, 12th Aug 2026', rr: 2.54, percent: 2.69, amount: 472.15 },
  { pair: 'AAPL', type: 'SHORT', strategy: 'Power Move', date: 'Friday, 5th Aug 2026 - Sunday, 7th Aug 2026', rr: -1.00, percent: -1.03, amount: -182.00 },
  { pair: 'EURNZD', type: 'SHORT', strategy: 'Pattern Play', date: 'Saturday, 23rd Jul 2026 - Friday, 29th Jul 2026', rr: -1.01, percent: -1.04, amount: -187.15 },
  { pair: 'GBPUSD', type: 'LONG', strategy: 'Breakout', date: 'Tuesday, 26th Jul 2026 - Thursday, 21st Jul 2026', rr: 4.11, percent: 3.99, amount: 714.43 },
  { pair: 'USDCAD', type: 'SHORT', strategy: 'Breakout', date: 'Monday, 18th Jul 2026 - Wednesday, 20th Jul 2026', rr: -1.01, percent: -1.04, amount: -188.21 },
];

export function TradeListWidget() {
  const [trades, setTrades] = useState(initialTrades);
  const [balance, setBalance] = useState(17832.95);
  const [activeTab, setActiveTab] = useState<'OPEN' | 'CLOSED'>('CLOSED');

  useEffect(() => {
    const interval = setInterval(() => {
      setBalance(prev => prev + (Math.random() - 0.5) * 10);

      setTrades(prevTrades => {
        const newTrades = [...prevTrades];
        // Randomly update the most recent trade to simulate an open position closing or shifting
        if (Math.random() > 0.8) {
          const firstTrade = { ...newTrades[0] };
          firstTrade.rr += (Math.random() - 0.5) * 0.1;
          firstTrade.percent += (Math.random() - 0.5) * 0.1;
          firstTrade.amount += (Math.random() - 0.5) * 10;
          newTrades[0] = firstTrade;
        }

        // Randomly add a new trade
        if (Math.random() > 0.95) {
          const isLong = Math.random() > 0.5;
          const newTrade = {
            pair: ['BTCUSD', 'ETHUSD', 'SOLUSD', 'NVDA'][Math.floor(Math.random() * 4)],
            type: isLong ? 'LONG' : 'SHORT',
            strategy: ['Breakout', 'Mean Reversion', 'Trend Follow'][Math.floor(Math.random() * 3)],
            date: 'Just Now',
            rr: (Math.random() - 0.5) * 5,
            percent: (Math.random() - 0.5) * 5,
            amount: (Math.random() - 0.5) * 500,
          };
          newTrades.unshift(newTrade);
          if (newTrades.length > 20) newTrades.pop();
        }

        return newTrades;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-card overflow-hidden group">
      <div className="flex flex-col p-4 border-b border-border gap-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Account Balance</span>
          <span className="text-emerald-500 transition-colors duration-300">${balance.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Trade Risk</span>
          <span className="text-foreground">1%</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Risk Value</span>
          <span className="text-emerald-500 transition-colors duration-300">${(balance * 0.01).toFixed(2)}</span>
        </div>
      </div>

      <div className="flex gap-4 px-4 pt-4 border-b border-border text-xs font-medium">
        <button
          onClick={() => setActiveTab('OPEN')}
          className={`pb-2 transition-colors ${activeTab === 'OPEN' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          OPEN
        </button>
        <button
          onClick={() => setActiveTab('CLOSED')}
          className={`pb-2 transition-colors ${activeTab === 'CLOSED' ? 'text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'}`}
        >
          CLOSED
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {(activeTab === 'OPEN' ? trades.slice(0, 2) : trades).map((trade, i) => {
          const isPositive = trade.rr >= 0;
          const colorClass = isPositive ? 'text-emerald-500' : 'text-red-500';

          return (
            <div key={i} className="flex justify-between p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-colors">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{trade.pair}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${trade.type === 'SHORT' ? 'bg-red-500/20 text-red-500' : 'bg-emerald-500/20 text-emerald-500'}`}>
                    {trade.type}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">{trade.strategy}</span>
                <span className="text-[10px] text-muted-foreground/70">{trade.date}</span>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className={`${colorClass} transition-colors duration-300`}>{trade.rr > 0 ? '+' : ''}{trade.rr.toFixed(2)} R:R</span>
                <span className={`${colorClass} transition-colors duration-300`}>{trade.percent > 0 ? '+' : ''}{trade.percent.toFixed(2)} %</span>
                <span className={`${colorClass} transition-colors duration-300`}>{trade.amount > 0 ? '+' : '-'}${Math.abs(trade.amount).toFixed(2)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
