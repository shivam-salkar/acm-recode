'use client';

import React, { useEffect, useState, useRef } from 'react';
import { rxBus, MarketTick } from '@/lib/rx-bus';
import { WhisperWrapper } from './WhisperWrapper';
import { useTerminalStore } from '@/hooks/useTerminalStore';

interface OrderLevel {
  price: number;
  size: number;
  total: number;
}

export const OrderBookWidget = React.memo(() => {
  const symbol = useTerminalStore((state) => state.symbol);

  const [tick, setTick] = useState<MarketTick | null>(null);
  const [bids, setBids] = useState<OrderLevel[]>([]);
  const [asks, setAsks] = useState<OrderLevel[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let ctx: CanvasRenderingContext2D | null = null;
    if (canvasRef.current) {
      ctx = canvasRef.current.getContext('2d', { alpha: false });
      if (ctx) {
        ctx.fillStyle = '#09090b'; // shadcn background
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
    }

    const sub = rxBus.getTicks(symbol).subscribe((newTick) => {
      setTick(newTick);

      // Simulate order book depth based on current price
      const newBids: OrderLevel[] = [];
      const newAsks: OrderLevel[] = [];
      let bidTotal = 0;
      let askTotal = 0;

      // Generate dense order book for heatmap
      for (let i = 0; i < 40; i++) {
        const bidPrice = newTick.price - (i * 0.25);
        // "Big players" hiding: random spikes in size
        const bidSize = Math.random() > 0.9 ? Math.random() * 50 + 20 : Math.random() * 5 + 1;
        bidTotal += bidSize;
        newBids.push({ price: bidPrice, size: bidSize, total: bidTotal });

        const askPrice = newTick.price + (i * 0.25);
        const askSize = Math.random() > 0.9 ? Math.random() * 50 + 20 : Math.random() * 5 + 1;
        askTotal += askSize;
        newAsks.push({ price: askPrice, size: askSize, total: askTotal });
      }

      setBids(newBids.slice(0, 15)); // Only show top 15 in the text list
      setAsks(newAsks.slice(0, 15));

      // Draw Heatmap
      if (ctx && canvasRef.current) {
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;

        // Shift image left by 1 pixel
        ctx.drawImage(canvasRef.current, 1, 0, width - 1, height, 0, 0, width - 1, height);

        // Clear the new rightmost column
        ctx.fillStyle = '#09090b';
        ctx.fillRect(width - 1, 0, 1, height);

        const priceRange = 20; // +/- 10 from current price
        const minPrice = newTick.price - priceRange / 2;

        // Draw Asks (Red)
        newAsks.forEach(ask => {
          const y = height - ((ask.price - minPrice) / priceRange) * height;
          if (y >= 0 && y <= height) {
            const intensity = Math.min(1, ask.size / 40);
            ctx!.fillStyle = `rgba(239, 68, 68, ${intensity})`;
            ctx!.fillRect(width - 1, y - 1, 1, 3);
          }
        });

        // Draw Bids (Green)
        newBids.forEach(bid => {
          const y = height - ((bid.price - minPrice) / priceRange) * height;
          if (y >= 0 && y <= height) {
            const intensity = Math.min(1, bid.size / 40);
            ctx!.fillStyle = `rgba(16, 185, 129, ${intensity})`;
            ctx!.fillRect(width - 1, y - 1, 1, 3);
          }
        });

        // Draw Current Price Line (White)
        const yPrice = height - ((newTick.price - minPrice) / priceRange) * height;
        if (yPrice >= 0 && yPrice <= height) {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
          ctx.fillRect(width - 1, yPrice, 1, 1);
        }
      }
    });

    return () => sub.unsubscribe();
  }, [symbol]);

  if (!tick) return <div className="p-4 text-muted-foreground font-mono text-xs">Loading depth...</div>;

  const maxTotal = Math.max(
    bids[bids.length - 1]?.total || 0,
    asks[asks.length - 1]?.total || 0
  );

  return (
    <WhisperWrapper symbol={symbol}>
      <div className="flex h-full bg-card text-xs font-mono overflow-hidden">
        {/* Left: Order Book Text */}
        <div className="flex-1 flex flex-col min-w-[200px] border-r border-border">
          <div className="flex justify-between p-2 border-b border-border text-muted-foreground">
            <span>PRICE</span>
            <span>SIZE</span>
            <span>TOTAL</span>
          </div>

          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Asks (Red) */}
            <div className="flex flex-col-reverse">
              {asks.map((ask, i) => (
                <div key={`ask-${i}`} className="relative flex justify-between px-2 py-0.5 hover:bg-muted group cursor-pointer">
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-red-500/10 transition-all duration-200"
                    style={{ width: `${(ask.total / maxTotal) * 100}%` }}
                  />
                  <span className="text-red-500 z-10">{ask.price.toFixed(2)}</span>
                  <span className="text-muted-foreground z-10">{ask.size.toFixed(3)}</span>
                  <span className="text-muted-foreground/50 z-10">{ask.total.toFixed(3)}</span>
                </div>
              ))}
            </div>

            {/* Spread / Current Price */}
            <div className="py-2 px-2 border-y border-border flex items-center justify-between bg-muted/30">
              <span className={`text-lg font-bold ${tick.type === 'trade' ? 'text-emerald-500' : 'text-red-500'}`}>
                {tick.price.toFixed(2)}
              </span>
              <span className="text-muted-foreground">Spread: {(asks[0]?.price - bids[0]?.price).toFixed(2)}</span>
            </div>

            {/* Bids (Green) */}
            <div>
              {bids.map((bid, i) => (
                <div key={`bid-${i}`} className="relative flex justify-between px-2 py-0.5 hover:bg-muted group cursor-pointer">
                  <div
                    className="absolute right-0 top-0 bottom-0 bg-emerald-500/10 transition-all duration-200"
                    style={{ width: `${(bid.total / maxTotal) * 100}%` }}
                  />
                  <span className="text-emerald-500 z-10">{bid.price.toFixed(2)}</span>
                  <span className="text-muted-foreground z-10">{bid.size.toFixed(3)}</span>
                  <span className="text-muted-foreground/50 z-10">{bid.total.toFixed(3)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Hardware-Accelerated Heatmap */}
        <div className="flex-1 relative hidden md:block min-w-[200px]">
          <div className="absolute top-2 left-2 z-10 text-xs text-muted-foreground font-bold bg-background/80 px-2 py-1 rounded">
            DEEP INSIGHT HEATMAP
          </div>
          <canvas
            ref={canvasRef}
            width={400}
            height={600}
            className="w-full h-full object-fill"
          />
        </div>
      </div>
    </WhisperWrapper>
  );
});

OrderBookWidget.displayName = 'OrderBookWidget';
