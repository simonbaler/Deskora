/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Mic } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface VoiceButtonProps {
  onClick: () => void;
  className?: string;
}

export function VoiceButton({ onClick, className = '' }: VoiceButtonProps) {
  const prefersReduced = usePrefersReducedMotion();

  return (
    <div className={`relative ${className}`} data-cursor="voice">
      {/* Subtle outer breathing ring */}
      {!prefersReduced && (
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.35, 0.15, 0.35] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#F4A6B5] to-[#C9B9E9] blur-xs pointer-events-none"
        />
      )}

      <button
        type="button"
        onClick={onClick}
        aria-label="Open Deskora Voice Assistant"
        title="Voice Welcome & Search"
        className="interactive-element relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 backdrop-blur-md border border-[#F0E8EA] hover:border-[#C9B9E9] flex items-center justify-center text-[#252126] hover:text-[#7A5CB6] deskora-shadow-sm hover:deskora-shadow-md transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#C9B9E9] group active:scale-95"
      >
        <Mic className="w-5 h-5 text-[#F39A8C] group-hover:scale-110 transition-transform" />

        {/* Tiny mic indicator dot */}
        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C9B9E9] border border-white" />
      </button>
    </div>
  );
}
