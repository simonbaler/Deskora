/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function LoadingRing({ size = 48 }: { size?: number }) {
  const prefersReduced = usePrefersReducedMotion();

  if (prefersReduced) {
    return (
      <div
        style={{ width: size, height: size }}
        className="rounded-full border-2 border-[#EFA7B5]/30 border-t-[#F39A8C]"
      />
    );
  }

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background track */}
      <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F4A6B5" />
            <stop offset="50%" stopColor="#F7C3A3" />
            <stop offset="100%" stopColor="#CDBDEB" />
          </linearGradient>
        </defs>

        <circle
          cx="24"
          cy="24"
          r="19"
          stroke="#F6D8DF"
          strokeWidth="2.5"
          fill="none"
          opacity="0.5"
        />

        {/* Animated gradient progress ring */}
        <motion.circle
          cx="24"
          cy="24"
          r="19"
          stroke="url(#ringGradient)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="119.38"
          initial={{ strokeDashoffset: 119.38 }}
          animate={{ strokeDashoffset: [119.38, 20, 0] }}
          transition={{
            duration: 1.2,
            ease: [0.65, 0, 0.35, 1] as const,
            repeat: Infinity,
            repeatType: 'loop',
          }}
        />
      </svg>

      {/* Gentle center pulse spark */}
      <motion.div
        className="absolute w-1.5 h-1.5 rounded-full bg-[#F39A8C]"
        animate={{ scale: [0.8, 1.3, 0.8], opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </div>
  );
}
