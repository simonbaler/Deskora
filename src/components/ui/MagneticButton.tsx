/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, ReactNode } from 'react';
import { motion, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  maxDistance?: number;
  onClick?: () => void;
  ariaLabel?: string;
}

export function MagneticButton({
  children,
  className = '',
  maxDistance = 6,
  onClick,
  ariaLabel,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 20, stiffness: 220, mass: 0.1 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced || !ref.current) return;

    // Check fine pointer
    if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) / (rect.width / 2);
    const deltaY = (e.clientY - centerY) / (rect.height / 2);

    x.set(Math.max(-maxDistance, Math.min(maxDistance, deltaX * maxDistance)));
    y.set(Math.max(-maxDistance, Math.min(maxDistance, deltaY * maxDistance)));
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      aria-label={ariaLabel}
      className={`relative inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}
