/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface WorkspaceFavoriteProps {
  workspaceId: string;
  workspaceName: string;
  className?: string;
}

// 6 radial micro particle directions (60deg spacing)
const PARTICLES = [
  { x: 0, y: -18 },
  { x: 15, y: -9 },
  { x: 15, y: 9 },
  { x: 0, y: 18 },
  { x: -15, y: 9 },
  { x: -15, y: -9 },
];

export function WorkspaceFavorite({
  workspaceId,
  workspaceName,
  className = '',
}: WorkspaceFavoriteProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const prefersReduced = usePrefersReducedMotion();
  const [showBurst, setShowBurst] = useState(false);
  const burstTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (burstTimerRef.current) window.clearTimeout(burstTimerRef.current);
    };
  }, []);

  const active = isFavorite(workspaceId);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const nextState = toggleFavorite(workspaceId, workspaceName);

    if (nextState && !prefersReduced) {
      setShowBurst(true);
      if (burstTimerRef.current) window.clearTimeout(burstTimerRef.current);
      burstTimerRef.current = window.setTimeout(() => setShowBurst(false), 650);
    }
  };

  return (
    <div className={`relative ${className}`} data-cursor="favorite">
      <motion.button
        type="button"
        onClick={handleToggle}
        whileTap={prefersReduced ? {} : { scale: 0.88 }}
        aria-label={
          active
            ? `Saved to your favorites (${workspaceName})`
            : `Save this space (${workspaceName})`
        }
        title={active ? 'Saved to your favorites' : 'Save this space'}
        aria-pressed={active}
        className={`interactive-element cursor-favorite relative w-11 h-11 rounded-full bg-white/95 backdrop-blur-md flex items-center justify-center text-[#252126] hover:bg-white transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5] ${
          active
            ? 'shadow-[0_0_16px_rgba(243,154,140,0.45)] border border-[#F39A8C]'
            : 'deskora-shadow-xs border border-white/80 hover:border-[#F39A8C]/50'
        }`}
      >
        <motion.div
          animate={
            active && !prefersReduced
              ? { scale: [1, 1.25, 0.95, 1], rotate: [0, -6, 6, 0] }
              : { scale: 1, rotate: 0 }
          }
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
        >
          <Heart
            className={`w-4 h-4 transition-colors duration-200 ${
              active
                ? 'fill-[#F39A8C] text-[#F39A8C] drop-shadow-xs'
                : 'text-[#6F6870] hover:text-[#F39A8C]'
            }`}
          />
        </motion.div>

        {/* Circular glowing ripple upon activation */}
        <AnimatePresence>
          {showBurst && !prefersReduced && (
            <motion.span
              aria-hidden="true"
              initial={{ scale: 0.6, opacity: 0.8 }}
              animate={{ scale: 1.8, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="absolute inset-0 rounded-full border-2 border-[#F39A8C] pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.button>

      {/* 6 Tiny soft rose micro particles radiating outward */}
      <AnimatePresence>
        {showBurst && !prefersReduced && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            {PARTICLES.map((p, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                animate={{ opacity: 0, scale: 0.2, x: p.x, y: p.y }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute w-1.5 h-1.5 rounded-full bg-[#F39A8C] shadow-[0_0_4px_#F39A8C]"
              />
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
