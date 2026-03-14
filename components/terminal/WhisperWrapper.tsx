'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { rxBus, AnomalyEvent } from '@/lib/rx-bus';
import { AlertTriangle } from 'lucide-react';

interface WhisperWrapperProps {
  symbol?: string;
  children: React.ReactNode;
}

export function WhisperWrapper({ symbol, children }: WhisperWrapperProps) {
  const [anomaly, setAnomaly] = useState<AnomalyEvent | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    const sub = symbol
      ? rxBus.getAnomalies(symbol).subscribe((event) => {
        setAnomaly(event);
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => setAnomaly(null), 2500);
      })
      : null;

    return () => {
      sub?.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [symbol]);

  return (
    <div
      className="relative w-full h-full overflow-hidden transition-all duration-700 ease-in-out"
      style={{
        opacity: 1,
        filter: 'none',
        transform: anomaly ? 'scale(1.01)' : 'scale(1)',
        zIndex: anomaly ? 50 : 1
      }}
    >
      <AnimatePresence mode="popLayout">
        {anomaly && (
          <motion.div
            key={anomaly.timestamp}
            initial={{ opacity: 0, boxShadow: 'inset 0 0 0px rgba(239, 68, 68, 0)' }}
            animate={{
              opacity: 1,
              boxShadow: [
                'inset 0 0 20px rgba(239, 68, 68, 0.4)',
                'inset 0 0 100px rgba(239, 68, 68, 0.8)',
                'inset 0 0 20px rgba(239, 68, 68, 0.4)'
              ]
            }}
            exit={{ opacity: 0, boxShadow: 'inset 0 0 0px rgba(239, 68, 68, 0)' }}
            transition={{ duration: 1.5, ease: "easeInOut", repeat: 1 }}
            className="absolute inset-0 pointer-events-none z-50 border-2 border-red-500 flex flex-col items-center justify-center p-4 bg-red-900/10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 10 }}
              className="bg-red-500/90 text-white px-4 py-2 rounded-md font-mono text-sm font-bold shadow-[0_0_20px_rgba(239,68,68,0.7)] border border-red-400 flex items-center gap-2"
            >
              <AlertTriangle className="w-5 h-5 animate-pulse" />
              <span className="uppercase tracking-wider">
                {anomaly.type.replace('_', ' ')}
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
}
