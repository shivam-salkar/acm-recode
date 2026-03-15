'use client';

import React, { useEffect, useRef } from 'react';
import { createChart, IChartApi, Time, HistogramSeries, AreaSeries, LineSeries, ISeriesApi } from 'lightweight-charts';
import { Target } from 'lucide-react';
import { useTerminalStore } from '@/hooks/useTerminalStore';

export function RewardRiskWidget() {
  const chartType = useTerminalStore((state) => state.chartType);
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);

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

    let series: ISeriesApi<any>;
    if (chartType === 'line') {
      series = chart.addSeries(LineSeries, {
        color: '#10b981',
      });
    } else if (chartType === 'candle') {
      series = chart.addSeries(AreaSeries, {
        lineColor: '#10b981',
        topColor: 'rgba(16, 185, 129, 0.4)',
        bottomColor: 'rgba(16, 185, 129, 0.0)',
      });
    } else {
      series = chart.addSeries(HistogramSeries, {
        color: '#10b981',
      });
    }

    let baseTime = Math.floor(Date.now() / 1000) - 100;

    const initialData = [];
    for (let i = 0; i < 100; i++) {
      const val = (Math.random() - 0.3) * 10;
      initialData.push({
        time: (baseTime + i) as Time,
        value: val,
        color: val >= 0 ? '#10b981' : '#ef4444' // color applies to histogram
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
  }, [chartType]);

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
