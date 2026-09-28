/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useSpring } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function ScrollProgress() {
  const prefersReduced = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  if (prefersReduced) return null;

  return (
    <motion.div
      id="scroll-progress-indicator"
      className="fixed top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-[#F4A6B5] via-[#F39A8C] to-[#C9B9E9] origin-left z-50 pointer-events-none"
      style={{ scaleX }}
    />
  );
}
