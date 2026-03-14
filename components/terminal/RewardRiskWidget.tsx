'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, Time, HistogramSeries, ISeriesApi } from 'lightweight-charts';
import { Target } from 'lucide-react';

export function RewardRiskWidget() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

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

    const series = chart.addSeries(HistogramSeries, {
      color: '#10b981', // emerald-500
    });

    let baseTime = Math.floor(Date.now() / 1000) - 100;
    
    const initialData = [];
    for (let i = 0; i < 100; i++) {
      const val = (Math.random() - 0.3) * 10;
      initialData.push({ 
        time: (baseTime + i) as Time, 
        value: val,
        color: val >= 0 ? '#10b981' : '#ef4444' // emerald-500 or red-500
      });
    }

    series.setData(initialData);
    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = series;

    let lastTime = baseTime + 100;

    const intervalId = setInterval(() => {
      if (!seriesRef.current) return;
      const val = (Math.random() - 0.3) * 10;
      lastTime += 1; // 1 second
      seriesRef.current.update({ 
        time: lastTime as Time, 
        value: val,
        color: val >= 0 ? '#10b981' : '#ef4444' // emerald-500 or red-500
      });
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
