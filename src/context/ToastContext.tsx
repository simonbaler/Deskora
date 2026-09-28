/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useCallback, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, CheckCircle2, Info, Sparkles } from 'lucide-react';
import { ToastItem } from '../types';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';

interface ToastContextType {
  showToast: (message: string, type?: 'info' | 'success' | 'favorite') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const prefersReduced = usePrefersReducedMotion();
  const timersRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      timersRef.current.forEach((t) => window.clearTimeout(t));
      timersRef.current = [];
    };
  }, []);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'favorite' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts((prev) => [...prev.slice(-3), { id, message, type }]); // Keep at most 4 active toasts

    const timerId = window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
      timersRef.current = timersRef.current.filter((t) => t !== timerId);
    }, 3200);

    timersRef.current.push(timerId);
  }, []);

  const getIcon = (type?: 'info' | 'success' | 'favorite') => {
    if (type === 'favorite') {
      return <Heart className="w-4 h-4 fill-[#F39A8C] text-[#F39A8C] shrink-0" />;
    }
    if (type === 'success') {
      return <CheckCircle2 className="w-4 h-4 text-[#34D399] shrink-0" />;
    }
    return <Sparkles className="w-4 h-4 text-[#EFA7B5] shrink-0" />;
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast floating container: bottom-center on mobile, bottom-right on desktop */}
      <div
        id="deskora-toast-container"
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed z-[100] bottom-[calc(5.25rem+env(safe-area-inset-bottom))] md:bottom-8 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-8 flex flex-col gap-2 items-center md:items-end w-full max-w-sm px-4 md:px-0"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.95 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] as const }}
              className="pointer-events-auto flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#252126]/95 backdrop-blur-md text-white text-xs font-medium border border-white/10 shadow-lg"
            >
              {getIcon(toast.type)}
              <span className="leading-snug">{toast.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
