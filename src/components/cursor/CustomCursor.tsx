/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef } from 'react';
import { motion, useSpring, AnimatePresence } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

type CursorMode =
  | 'default'
  | 'button'
  | 'card'
  | 'favorite'
  | 'chat'
  | 'voice'
  | 'text';

interface ClickParticle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function CustomCursor() {
  const prefersReduced = usePrefersReducedMotion();
  const [cursorMode, setCursorMode] = useState<CursorMode>('default');
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  const [particles, setParticles] = useState<ClickParticle[]>([]);

  // Springs for outer ring inertia
  const ringX = useSpring(-100, { damping: 24, stiffness: 280, mass: 0.5 });
  const ringY = useSpring(-100, { damping: 24, stiffness: 280, mass: 0.5 });

  // Direct position for the precise inner dot (near instantaneous)
  const dotX = useSpring(-100, { damping: 35, stiffness: 600, mass: 0.1 });
  const dotY = useSpring(-100, { damping: 35, stiffness: 600, mass: 0.1 });

  const lastPos = useRef({ x: -100, y: -100 });

  const particleTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Strictly fine pointer (mouse/trackpad) and hover capability, NEVER touch
    const fineMatch = window.matchMedia('(pointer: fine) and (hover: hover)');
    setIsTouchDevice(!fineMatch.matches);

    const checkFine = (e: MediaQueryListEvent) => {
      setIsTouchDevice(!e.matches);
    };
    const removeFineMatchListener = () => {
      if (fineMatch.removeEventListener) {
        fineMatch.removeEventListener('change', checkFine);
      } else if ((fineMatch as unknown as { removeListener?: (fn: typeof checkFine) => void }).removeListener) {
        (fineMatch as unknown as { removeListener: (fn: typeof checkFine) => void }).removeListener(checkFine);
      }
    };

    if (fineMatch.addEventListener) {
      fineMatch.addEventListener('change', checkFine);
    } else if ((fineMatch as unknown as { addListener?: (fn: typeof checkFine) => void }).addListener) {
      (fineMatch as unknown as { addListener: (fn: typeof checkFine) => void }).addListener(checkFine);
    }

    if (!fineMatch.matches || prefersReduced) {
      return removeFineMatchListener;
    }

    const handleMouseMove = (e: MouseEvent) => {
      lastPos.current = { x: e.clientX, y: e.clientY };
      dotX.set(e.clientX);
      dotY.set(e.clientY);
      ringX.set(e.clientX);
      ringY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        if (target.closest('[data-cursor="favorite"], .cursor-favorite')) {
          setCursorMode('favorite');
        } else if (target.closest('[data-cursor="voice"]')) {
          setCursorMode('voice');
        } else if (target.closest('[data-cursor="chat"]')) {
          setCursorMode('chat');
        } else if (target.closest('[data-cursor="card"]')) {
          setCursorMode('card');
        } else if (target.closest('input, textarea')) {
          setCursorMode('text');
        } else if (target.closest('button, a, [role="button"], .interactive-element')) {
          setCursorMode('button');
        } else {
          setCursorMode('default');
        }
      }
    };

    const handleMouseDown = () => {
      setIsClicked(true);
      // Spawn 4 subtle radial particles on deliberate click
      const newParticles: ClickParticle[] = [
        { id: `p-${Date.now()}-1`, x: lastPos.current.x, y: lastPos.current.y, vx: -12, vy: -10 },
        { id: `p-${Date.now()}-2`, x: lastPos.current.x, y: lastPos.current.y, vx: 12, vy: -10 },
        { id: `p-${Date.now()}-3`, x: lastPos.current.x, y: lastPos.current.y, vx: -10, vy: 12 },
        { id: `p-${Date.now()}-4`, x: lastPos.current.x, y: lastPos.current.y, vx: 10, vy: 12 },
      ];
      setParticles(newParticles);
      if (particleTimerRef.current) window.clearTimeout(particleTimerRef.current);
      particleTimerRef.current = window.setTimeout(() => setParticles([]), 400);
    };

    const handleMouseUp = () => {
      setIsClicked(false);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsVisible(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (particleTimerRef.current) window.clearTimeout(particleTimerRef.current);
      removeFineMatchListener();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [dotX, dotY, ringX, ringY, isVisible, prefersReduced]);

  if (isTouchDevice || prefersReduced || !isVisible) {
    return null;
  }

  // Ring dimension & style based on intelligent cursor mode
  const getRingConfig = () => {
    switch (cursorMode) {
      case 'card':
        return {
          size: 54,
          border: 'border-[#F39A8C]/60',
          bg: 'rgba(243, 154, 140, 0.10)',
          text: 'VIEW',
        };
      case 'favorite':
        return {
          size: 48,
          border: 'border-[#F39A8C]',
          bg: 'rgba(243, 154, 140, 0.22)',
          text: '♥',
        };
      case 'voice':
        return {
          size: 46,
          border: 'border-[#C9B9E9]',
          bg: 'rgba(201, 185, 233, 0.24)',
          text: '🎙',
        };
      case 'chat':
        return {
          size: 46,
          border: 'border-[#F4A6B5]',
          bg: 'rgba(244, 166, 181, 0.20)',
          text: '💬',
        };
      case 'button':
        return {
          size: 42,
          border: 'border-[#EFA7B5]/60',
          bg: 'rgba(239, 167, 181, 0.14)',
          text: null,
        };
      case 'text':
        return {
          size: 24,
          border: 'border-[#252126]/30',
          bg: 'transparent',
          text: null,
        };
      default:
        return {
          size: isClicked ? 22 : 28,
          border: 'border-[#EFA7B5]/40',
          bg: 'rgba(239, 167, 181, 0.05)',
          text: null,
        };
    }
  };

  const ring = getRingConfig();

  return (
    <div
      id="deskora-custom-cursor"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
    >
      {/* Outer trailing inertia ring */}
      <motion.div
        className={`absolute rounded-full border transition-all duration-200 flex items-center justify-center ${ring.border}`}
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: ring.size,
          height: ring.size,
          backgroundColor: ring.bg,
          boxShadow:
            cursorMode === 'favorite'
              ? '0 0 16px rgba(243, 154, 140, 0.4)'
              : cursorMode === 'voice'
              ? '0 0 14px rgba(201, 185, 233, 0.4)'
              : '0 0 8px rgba(239, 167, 181, 0.15)',
        }}
      >
        {ring.text && (
          <span
            className={`text-[9px] font-extrabold tracking-wider select-none ${
              cursorMode === 'favorite'
                ? 'text-[#F39A8C]'
                : cursorMode === 'voice'
                ? 'text-[#876EC6]'
                : 'text-[#252126]'
            }`}
          >
            {ring.text}
          </span>
        )}
      </motion.div>

      {/* Inner precise dot */}
      <motion.div
        className="absolute rounded-full transition-transform duration-100"
        style={{
          x: dotX,
          y: dotY,
          translateX: '-50%',
          translateY: '-50%',
          width: cursorMode === 'default' ? 5 : cursorMode === 'text' ? 3 : 6,
          height: cursorMode === 'text' ? 12 : cursorMode === 'default' ? 5 : 6,
          backgroundColor: cursorMode === 'favorite' ? '#F39A8C' : '#252126',
          borderRadius: cursorMode === 'text' ? '1px' : '999px',
        }}
      />

      {/* Click ripple & particles */}
      <AnimatePresence>
        {isClicked && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute rounded-full border border-[#F39A8C]/50"
            style={{
              x: dotX,
              y: dotY,
              translateX: '-50%',
              translateY: '-50%',
              width: 32,
              height: 32,
            }}
          />
        )}

        {particles.map((p) => (
          <motion.span
            key={p.id}
            initial={{ opacity: 0.9, scale: 1, x: p.x, y: p.y }}
            animate={{
              opacity: 0,
              scale: 0.2,
              x: p.x + p.vx,
              y: p.y + p.vy,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#F4A6B5] to-[#F39A8C]"
            style={{ translateX: '-50%', translateY: '-50%' }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
