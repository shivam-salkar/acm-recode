'use client';

import React, { useEffect, useState } from 'react';
import { CalendarDays } from 'lucide-react';

const initialStats = [
  {
    year: '2026',
    months: [
      { rr: -0.94, amount: -150.54, percent: 25.00 },
      { rr: 7.51, amount: 1175.10, percent: 83.33 },
      { rr: 3.72, amount: 580.14, percent: 50.00 },
      { rr: -0.36, amount: -79.23, percent: 25.00 },
      { rr: 3.46, amount: 581.32, percent: 75.00 },
      { rr: 3.10, amount: 548.99, percent: 80.00 },
      { rr: 0.08, amount: -20.41, percent: 20.00 },
      { rr: 0.52, amount: 101.30, percent: 33.33 },
      null, null, null, null
    ],
    total: { rr: 17.10, amount: 2736.67, percent: 51.28 }
  },
  {
    year: '2025',
    months: [
      { rr: 0.66, amount: 62.62, percent: 50.00 },
      { rr: 4.73, amount: 458.25, percent: 33.33 },
      { rr: 1.12, amount: 116.38, percent: 50.00 },
      { rr: 4.20, amount: 452.83, percent: 75.00 },
      { rr: 2.42, amount: 270.40, percent: 50.00 },
      { rr: 8.82, amount: 985.35, percent: 100.00 },
      { rr: -2.42, amount: -301.29, percent: 25.00 },
      { rr: 6.86, amount: 856.26, percent: 75.00 },
      { rr: 0.47, amount: 65.95, percent: 33.33 },
      { rr: 11.33, amount: 1569.94, percent: 100.00 },
      { rr: 1.34, amount: 186.04, percent: 50.00 },
      { rr: 2.60, amount: 373.55, percent: 50.00 }
    ],
    total: { rr: 42.12, amount: 5096.28, percent: 59.18 }
  }
];

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function MonthlyStatsWidget() {
  const [stats, setStats] = useState(initialStats);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const dt = now - lastTime;
      
      if (dt > 100) { // Update every 100ms
        setStats(prevStats => {
          const newStats = [...prevStats];
          // Modify the most recent month (2026, August - index 7)
          const currentYear = { ...newStats[0] };
          const currentMonths = [...currentYear.months];
          const currentMonth = currentMonths[7];
          
          if (currentMonth) {
            currentMonths[7] = {
              ...currentMonth,
              rr: currentMonth.rr + (Math.random() - 0.5) * 0.05,
              amount: currentMonth.amount + (Math.random() - 0.5) * 5,
              percent: Math.min(100, Math.max(0, currentMonth.percent + (Math.random() - 0.5) * 0.1))
            };
            
            // Update total
            currentYear.total = {
              ...currentYear.total,
              rr: currentYear.total.rr + (Math.random() - 0.5) * 0.05,
              amount: currentYear.total.amount + (Math.random() - 0.5) * 5,
            };
            
            currentYear.months = currentMonths;
            newStats[0] = currentYear;
          }
          
          return newStats;
        });
        lastTime = now;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-card overflow-auto text-xs p-4 group">
      <div className="flex justify-end items-center mb-4">
        <div className="flex gap-2">
          <button className="px-2 py-1 bg-muted text-foreground rounded transition-colors">R:R</button>
          <button className="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">NET %</button>
          <button className="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">PROFIT</button>
          <button className="px-2 py-1 text-muted-foreground hover:text-foreground transition-colors">STRIKE RATE</button>
        </div>
      </div>
      
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-muted-foreground border-b border-border">
            <th className="pb-2 font-medium">Year</th>
            {monthNames.map(m => <th key={m} className="pb-2 font-medium">{m}</th>)}
            <th className="pb-2 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {stats.map(row => (
            <tr key={row.year} className="border-b border-border hover:bg-muted/30 transition-colors">
              <td className="py-4 font-medium text-foreground align-top">{row.year}</td>
              {row.months.map((m, i) => (
                <td key={i} className="py-4 align-top">
                  {m ? (
                    <div className="flex flex-col gap-1">
                      <span className={`${m.rr >= 0 ? 'text-emerald-500' : 'text-red-500'} transition-colors duration-300`}>
                        {m.rr > 0 ? '+' : ''}{m.rr.toFixed(2)} R:R
                      </span>
                      <span className={`${m.amount >= 0 ? 'text-emerald-500' : 'text-red-500'} transition-colors duration-300`}>
                        {m.amount > 0 ? '+' : '-'}${Math.abs(m.amount).toFixed(2)}
                      </span>
                      <span className="text-muted-foreground transition-colors duration-300">{m.percent.toFixed(2)}%</span>
                    </div>
                  ) : null}
                </td>
              ))}
              <td className="py-4 align-top">
                <div className="flex flex-col gap-1">
                  <span className={`${row.total.rr >= 0 ? 'text-emerald-500' : 'text-red-500'} transition-colors duration-300`}>
                    {row.total.rr > 0 ? '+' : ''}{row.total.rr.toFixed(2)} R:R
                  </span>
                  <span className={`${row.total.amount >= 0 ? 'text-emerald-500' : 'text-red-500'} transition-colors duration-300`}>
                    {row.total.amount > 0 ? '+' : '-'}${Math.abs(row.total.amount).toFixed(2)}
                  </span>
                  <span className="text-muted-foreground transition-colors duration-300">{row.total.percent.toFixed(2)}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
