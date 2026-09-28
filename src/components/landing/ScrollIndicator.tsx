/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ChevronDown } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface ScrollIndicatorProps {
  onClick?: () => void;
  label?: string;
}

export function ScrollIndicator({ onClick, label = 'Discover workspaces' }: ScrollIndicatorProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="interactive-element group inline-flex flex-col items-center gap-1.5 text-xs text-[#9C949B] hover:text-[#252126] transition-colors cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5] rounded-full p-2"
    >
      <span className="font-medium tracking-wide uppercase text-[10px]">{label}</span>
      <motion.div
        animate={prefersReduced ? {} : { y: [0, 4, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        className="w-6 h-6 rounded-full border border-[#F0E8EA] group-hover:border-[#EFA7B5] flex items-center justify-center bg-white shadow-2xs transition-colors"
      >
        <ChevronDown className="w-3.5 h-3.5 text-[#6F6870] group-hover:text-[#252126]" />
      </motion.div>
    </button>
  );
}
