/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LoadingRing } from './LoadingRing';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface AppLoaderProps {
  onComplete: () => void;
}

export function AppLoader({ onComplete }: AppLoaderProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [stage, setStage] = useState<1 | 2 | 3 | 4>(1);

  useEffect(() => {
    if (prefersReduced) {
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }

    // Stage 1: 0 - 250ms
    const t2 = setTimeout(() => setStage(2), 250);
    // Stage 2: 250 - 550ms
    const t3 = setTimeout(() => setStage(3), 550);
    // Stage 3: 550 - 950ms
    const t4 = setTimeout(() => setStage(4), 950);
    // Stage 4: Finish at 1250ms
    const finish = setTimeout(() => {
      onComplete();
    }, 1250);

    return () => {
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(finish);
    };
  }, [onComplete, prefersReduced]);

  const particles = [
    { x: '18%', y: '28%', delay: 0, duration: 4 },
    { x: '82%', y: '22%', delay: 0.5, duration: 4.5 },
    { x: '75%', y: '72%', delay: 0.2, duration: 3.8 },
    { x: '24%', y: '76%', delay: 0.7, duration: 4.2 },
    { x: '48%', y: '15%', delay: 0.4, duration: 5 },
    { x: '88%', y: '48%', delay: 0.1, duration: 3.6 },
  ];

  return (
    <motion.div
      id="deskora-loader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] as const }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFCFA] dark:bg-[#0D0B0F] select-none overflow-hidden transition-colors"
    >
      {/* Background soft ambient radial gradient */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.8, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none absolute inset-0 radial-glow-hero"
      />

      {/* Micro floating particles */}
      {!prefersReduced &&
        particles.map((p, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#F4A6B5] to-[#CDBDEB] opacity-25"
            style={{ left: p.x, top: p.y }}
            animate={{
              y: [0, -14, 0],
              opacity: [0.15, 0.4, 0.15],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

      {/* Center Cinematic Stage Container */}
      <div className="relative z-10 flex flex-col items-center justify-center px-6 text-[#252126] dark:text-[#FAF5F7]">
        {/* Stage 1 & 2: Deskora Logo Mark & Brand Name */}
        <motion.div
          animate={
            stage === 4
              ? { y: -18, opacity: 0.8 }
              : stage >= 2
              ? { scale: 1, y: 0 }
              : { scale: 0.92, y: 6 }
          }
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          className="flex flex-col items-center gap-3"
        >
          {/* Logo Mark */}
          <div className="relative w-14 h-14 rounded-3xl bg-white dark:bg-[#151218] border border-[#F0E8EA] dark:border-[#28212D] shadow-md flex items-center justify-center p-2.5">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <svg viewBox="0 0 32 32" fill="none" className="w-full h-full">
                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="32" y2="32">
                    <stop stopColor="#F4A6B5" />
                    <stop offset="0.5" stopColor="#F39A8C" />
                    <stop offset="1" stopColor="#B79FE4" />
                  </linearGradient>
                </defs>
                <path
                  d="M7 23V15C7 10.0294 11.0294 6 16 6C20.9706 6 25 10.0294 25 15V23"
                  stroke="url(#loadGrad)"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                />
                <path d="M5 23H27" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                <circle cx="16" cy="14" r="2.5" fill="url(#loadGrad)" />
              </svg>
            </motion.div>
          </div>

          {/* Brand Name reveal in Stage 2+ */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={stage >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 6 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="flex flex-col items-center text-center mt-1"
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-[#252126] dark:text-[#FAF5F7] font-sans flex items-center gap-1.5">
              deskora
              <span className="w-2 h-2 rounded-full bg-gradient-to-r from-[#F4A6B5] to-[#F39A8C]" />
            </h1>
            <p className="text-xs text-[#9C949B] dark:text-[#827A84] tracking-wider uppercase font-medium mt-0.5">
              Work • Focus • Create
            </p>
          </motion.div>
        </motion.div>

        {/* Stage 3: Animated Ring & Progress Shimmer */}
        <div className="h-16 mt-6 flex flex-col items-center justify-center">
          <AnimatePresence>
            {stage >= 3 && stage < 4 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center gap-3"
              >
                <LoadingRing size={40} />
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-xs font-medium text-[#6F6870] dark:text-[#B5ADB7] tracking-wide"
                >
                  Preparing your space...
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Accessible skip button */}
      <button
        type="button"
        onClick={onComplete}
        className="absolute bottom-6 text-xs text-[#9C949B] dark:text-[#827A84] hover:text-[#252126] dark:hover:text-[#FAF5F7] underline underline-offset-4 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
      >
        Skip intro
      </button>
    </motion.div>
  );
}
