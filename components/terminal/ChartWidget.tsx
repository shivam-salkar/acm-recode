'use client';

import React, { useEffect, useRef, useState } from 'react';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, ColorType, CandlestickSeries, BarSeries, LineSeries } from 'lightweight-charts';
import { rxBus } from '@/lib/rx-bus';
import { WhisperWrapper } from './WhisperWrapper';
import { useTerminalStore } from '@/hooks/useTerminalStore';

export const ChartWidget = React.memo(() => {
  const symbol = useTerminalStore((state) => state.symbol);
  const timeframe = useTerminalStore((state) => state.timeframe);
  const chartType = useTerminalStore((state) => state.chartType);

  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<any> | null>(null);
  const currentCandleRef = useRef<any | null>(null);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#a1a1aa',
      },
      grid: {
        vertLines: { color: '#27272a' },
        horzLines: { color: '#27272a' },
      },
      crosshair: {
        mode: 0,
        vertLine: {
          color: '#a1a1aa',
          width: 1,
          style: 1,
          labelBackgroundColor: '#27272a',
        },
        horzLine: {
          color: '#a1a1aa',
          width: 1,
          style: 1,
          labelBackgroundColor: '#27272a',
        },
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
        lineWidth: 2,
      });
    } else if (chartType === 'bar') {
      series = chart.addSeries(BarSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
      });
    } else {
      series = chart.addSeries(CandlestickSeries, {
        upColor: '#10b981',
        downColor: '#ef4444',
        borderVisible: false,
        wickUpColor: '#10b981',
        wickDownColor: '#ef4444',
      });
    }

    chartRef.current = chart;
    seriesRef.current = series;

    // Generate initial historical data
    const initialData: any[] = [];
    let basePrice = symbol.includes('BTC') ? 65000 : 3500;
    let time = Math.floor(Date.now() / 1000) - 100 * 60; // 100 minutes ago
    for (let i = 0; i < 100; i++) {
      const open = basePrice + (Math.random() - 0.5) * 10;
      const close = open + (Math.random() - 0.5) * 20;
      const high = Math.max(open, close) + Math.random() * 10;
      const low = Math.min(open, close) - Math.random() * 10;

      if (chartType === 'line') {
        initialData.push({
          time: time as Time,
          value: close,
        });
      } else {
        initialData.push({
          time: time as Time,
          open,
          high,
          low,
          close,
        });
      }
      basePrice = close;
      time += 60; // 1 minute
    }
    series.setData(initialData);
    currentCandleRef.current = initialData[initialData.length - 1];

    // Restore state memory (Fluid Workspaces)
    const stateKey = `deeptrade-chart-state-${symbol}`;
    const savedState = localStorage.getItem(stateKey);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.logicalRange) {
          setTimeout(() => {
            chart.timeScale().setVisibleLogicalRange(parsed.logicalRange);
          }, 50);
        }
      } catch (e) {
        console.error('Failed to restore chart state', e);
      }
    }

    // Save state memory
    chart.timeScale().subscribeVisibleLogicalRangeChange((logicalRange) => {
      if (logicalRange) {
        localStorage.setItem(stateKey, JSON.stringify({ logicalRange }));
      }
    });

    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth, height: chartContainerRef.current.clientHeight });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [symbol, chartType]);

  useEffect(() => {
    const sub = rxBus.getTicks(symbol).subscribe((tick) => {
      if (!seriesRef.current || !currentCandleRef.current) return;

      const currentCandle = currentCandleRef.current;
      const tickTime = Math.floor(tick.timestamp / 1000);
      const candleTime = currentCandle.time as number;

      // Update current candle or create new one if 1 minute passed
      if (tickTime >= candleTime + 60) {
        let newCandle: any;
        if (chartType === 'line') {
          newCandle = {
            time: tickTime as Time,
            value: tick.price,
          };
        } else {
          newCandle = {
            time: tickTime as Time,
            open: currentCandle.close || currentCandle.value, // fallback for lines -> candle switches mid-tick
            high: Math.max(currentCandle.close || currentCandle.value, tick.price),
            low: Math.min(currentCandle.close || currentCandle.value, tick.price),
            close: tick.price,
          };
        }
        seriesRef.current.update(newCandle);
        currentCandleRef.current = newCandle;
      } else {
        let updatedCandle: any;
        if (chartType === 'line') {
          updatedCandle = {
            ...currentCandle,
            value: tick.price,
          };
        } else {
          updatedCandle = {
            ...currentCandle,
            high: Math.max(currentCandle.high, tick.price),
            low: Math.min(currentCandle.low, tick.price),
            close: tick.price,
          };
        }
        seriesRef.current.update(updatedCandle);
        currentCandleRef.current = updatedCandle;
      }
    });

    return () => sub.unsubscribe();
  }, [symbol, chartType]);

  return (
    <WhisperWrapper symbol={symbol}>
      <div className="w-full h-full relative bg-card">
        <div className="absolute top-2 left-2 z-10 flex items-center space-x-2">
          <span className="text-foreground font-mono font-bold">{symbol}</span>
          <span className="text-muted-foreground text-xs">{timeframe}</span>
        </div>
        <div ref={chartContainerRef} className="w-full h-full" />
      </div>
    </WhisperWrapper>
  );
});

ChartWidget.displayName = 'ChartWidget';
