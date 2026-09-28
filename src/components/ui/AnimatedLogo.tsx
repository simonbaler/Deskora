/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  animateEntrance?: boolean;
}

export function AnimatedLogo({
  size = 'md',
  showTagline = false,
  className = '',
  animateEntrance = false,
}: AnimatedLogoProps) {
  const prefersReduced = usePrefersReducedMotion();

  const markSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-13 h-13',
  }[size];

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl sm:text-4xl',
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Symbolic Mark: Architectural arched workspace desk & sun portal */}
      <div className={`relative flex items-center justify-center ${markSizes}`}>
        {/* Soft background ambient glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[#F4A6B5] via-[#F7C3A3] to-[#CDBDEB] opacity-35 blur-xs" />

        {/* Minimalist modern geometric badge */}
        <div className="relative w-full h-full rounded-2xl bg-white border border-[#F0E8EA] shadow-xs flex items-center justify-center p-1.5 overflow-hidden">
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full"
          >
            <defs>
              <linearGradient id="deskoraGrad" x1="2" y1="2" x2="30" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F4A6B5" />
                <stop offset="0.5" stopColor="#F39A8C" />
                <stop offset="1" stopColor="#B79FE4" />
              </linearGradient>
            </defs>
            {/* Elegant curved workspace arch */}
            <path
              d="M7 23V15C7 10.0294 11.0294 6 16 6C20.9706 6 25 10.0294 25 15V23"
              stroke="url(#deskoraGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Sleek desk plane */}
            <path
              d="M5 23H27"
              stroke="#252126"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            {/* Focus core dot / spark */}
            <circle cx="16" cy="14" r="2.5" fill="url(#deskoraGrad)" />
          </svg>
        </div>
      </div>

      {/* Wordmark */}
      <div className="flex flex-col">
        <span
          className={`font-extrabold tracking-tight text-[#252126] font-sans flex items-center gap-1 ${textSizes}`}
        >
          deskora
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#F4A6B5] to-[#F39A8C]" />
        </span>
        {showTagline && (
          <span className="text-[10px] tracking-wider uppercase text-[#9C949B] font-semibold">
            Work • Focus • Create
          </span>
        )}
      </div>
    </div>
  );

  if (animateEntrance && !prefersReduced) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] as const }}
      >
        {content}
      </motion.div>
    );
  }

  return content;
}
