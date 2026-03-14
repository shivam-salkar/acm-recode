import { useEffect, useRef } from 'react';
import { rxBus, MarketTick, AnomalyEvent } from '@/lib/rx-bus';

const SYMBOLS = ['BTC/USD', 'ETH/USD', 'NIFTY50', 'RELIANCE'];

export function useMarketData() {
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const prices: Record<string, number> = {
      'BTC/USD': 65000,
      'ETH/USD': 3500,
      'NIFTY50': 22500,
      'RELIANCE': 2900,
    };

    const intervals = SYMBOLS.map(symbol => {
      // High-frequency tick generator (every 16ms for 60fps smooth motion)
      return setInterval(() => {
        const volatility = symbol.includes('BTC') ? 2 : 0.5;
        const change = (Math.random() - 0.5) * volatility;
        prices[symbol] += change;
        
        const tick: MarketTick = {
          symbol,
          price: prices[symbol],
          volume: Math.random() * 10,
          timestamp: Date.now(),
          type: 'trade',
          bid: prices[symbol] - 0.5,
          ask: prices[symbol] + 0.5,
        };
        
        rxBus.publishTick(tick);

        // Simulate random anomalies (Whispers) - slightly less frequent so it's not overwhelming
        if (Math.random() > 0.999) {
          const anomaly: AnomalyEvent = {
            symbol,
            type: Math.random() > 0.5 ? 'volume_spike' : 'price_shock',
            severity: Math.random() * 0.5 + 0.5,
            timestamp: Date.now(),
          };
          rxBus.publishAnomaly(anomaly);
        }
      }, 16); // 60fps
    });

    return () => {
      intervals.forEach(clearInterval);
      initialized.current = false;
    };
  }, []);
}
