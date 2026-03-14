'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, Time, LineSeries, ISeriesApi } from 'lightweight-charts';
import { Wallet } from 'lucide-react';

export function AccountBalanceWidget() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Line'> | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: 'transparent' },
        textColor: '#a1a1aa',
      },
      grid: {
        vertLines: { color: '#27272a' },
        horzLines: { color: '#27272a' },
      },
      timeScale: {
        borderColor: '#27272a',
        timeVisible: true,
        secondsVisible: true,
      },
      rightPriceScale: {
        borderColor: '#27272a',
      },
      autoSize: true,
    });

    const series = chart.addSeries(LineSeries, {
      color: '#10b981', // emerald-500
      lineWidth: 2,
    });

    let baseTime = Math.floor(Date.now() / 1000) - 100;
    let baseValue = 18500.00;
    
    const initialData = [];
    for (let i = 0; i < 100; i++) {
      baseValue += (Math.random() - 0.5) * 50;
      initialData.push({ time: (baseTime + i) as Time, value: baseValue });
    }

    series.setData(initialData);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = series;

    let lastTime = baseTime + 100;
    let currentValue = baseValue;

    const intervalId = setInterval(() => {
      if (!seriesRef.current) return;
      currentValue += (Math.random() - 0.5) * 10;
      lastTime += 1; // 1 second
      seriesRef.current.update({ time: lastTime as Time, value: currentValue });
    }, 1000);

    return () => {
      clearInterval(intervalId);
      chart.remove();
    };
  }, []);

  return (
    <div className="flex flex-col h-full w-full bg-background group">
      <div className="flex items-center justify-end p-2 border-b border-border">
        <div className="flex gap-2 text-xs text-muted-foreground">
          <button className="hover:text-foreground transition-colors">H</button>
          <button className="hover:text-foreground transition-colors">D</button>
          <button className="hover:text-foreground transition-colors">W</button>
          <button className="hover:text-foreground transition-colors">M</button>
          <button className="hover:text-foreground transition-colors">3M</button>
          <button className="hover:text-foreground transition-colors">Y</button>
        </div>
      </div>
      <div ref={chartContainerRef} className="flex-1 w-full" />
    </div>
  );
}
