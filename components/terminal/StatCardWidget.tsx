import React, { useEffect, useState } from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  rr: number;
  percent: number;
  amount: number;
  progress: number;
  counts: [number, number, number, number]; // blue, green, yellow, red
}

export function StatCardWidget({ title, rr: initialRr, percent: initialPercent, amount: initialAmount, progress, counts }: StatCardProps) {
  const [rr, setRr] = useState(initialRr);
  const [percent, setPercent] = useState(initialPercent);
  const [amount, setAmount] = useState(initialAmount);

  useEffect(() => {
    let animationFrameId: number;
    let lastTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const dt = now - lastTime;
      
      if (dt > 50) { // Update every 50ms for smooth but not crazy fast changes
        setRr(prev => prev + (Math.random() - 0.5) * 0.05);
        setPercent(prev => prev + (Math.random() - 0.5) * 0.05);
        setAmount(prev => prev + (Math.random() - 0.5) * 2.5);
        lastTime = now;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const isPositive = rr >= 0;
  const colorClass = isPositive ? 'text-emerald-500' : 'text-red-500';

  return (
    <div className="flex flex-col h-full w-full bg-card p-4 text-foreground text-sm group">
      <div className="flex justify-between items-center flex-1">
        <div className="flex flex-col gap-1">
          <div className={`text-xl font-medium flex items-center gap-2 ${colorClass} transition-colors duration-300`}>
            {rr > 0 ? '+' : ''}{rr.toFixed(2)} <span className="text-xs text-muted-foreground">R:R</span>
            {isPositive ? <TrendingUp className="w-4 h-4 animate-bounce" style={{ animationDuration: '3s' }} /> : <TrendingDown className="w-4 h-4 animate-bounce" style={{ animationDuration: '3s' }} />}
          </div>
          <div className={`${colorClass} transition-colors duration-300`}>
            {percent > 0 ? '+' : ''}{percent.toFixed(2)} %
          </div>
          <div className={`${colorClass} transition-colors duration-300`}>
            {amount > 0 ? '+' : '-'}${Math.abs(amount).toFixed(2)}
          </div>
        </div>
        
        <div className="relative w-16 h-16 group-hover:scale-105 transition-transform duration-500">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-muted"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="text-primary transition-all duration-1000 ease-out"
              strokeDasharray={`${progress}, 100`}
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-primary">
            {progress.toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <div className="w-6 h-6 rounded-full border border-blue-500/50 flex items-center justify-center text-xs text-blue-400">{counts[0]}</div>
        <div className="w-6 h-6 rounded-full border border-emerald-500/50 flex items-center justify-center text-xs text-emerald-500">{counts[1]}</div>
        <div className="w-6 h-6 rounded-full border border-yellow-500/50 flex items-center justify-center text-xs text-yellow-400">{counts[2]}</div>
        <div className="w-6 h-6 rounded-full border border-red-500/50 flex items-center justify-center text-xs text-red-500">{counts[3]}</div>
      </div>
    </div>
  );
}
