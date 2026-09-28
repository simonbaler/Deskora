/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Volume2, VolumeX } from 'lucide-react';
import { useSound } from '../../hooks/useSound';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function SoundToggle({ className = '' }: { className?: string }) {
  const { isSoundEnabled, toggleSound } = useSound();
  const prefersReduced = usePrefersReducedMotion();

  const label = isSoundEnabled ? 'Turn sound off' : 'Turn sound on';

  return (
    <motion.button
      type="button"
      onClick={toggleSound}
      whileTap={prefersReduced ? {} : { scale: 0.94 }}
      whileHover={prefersReduced ? {} : { scale: 1.05 }}
      aria-pressed={isSoundEnabled}
      aria-label={label}
      title={label}
      className={`interactive-element relative min-h-[44px] min-w-[44px] sm:min-h-[38px] sm:min-w-0 flex items-center justify-center gap-2 px-3 py-1.5 rounded-full border border-[#F0E8EA] dark:border-[#28212D] bg-white/95 dark:bg-[#151218]/95 backdrop-blur-md text-[#252126] dark:text-[#FAF5F7] text-xs font-medium deskora-shadow-sm hover:border-[#EFA7B5]/60 dark:hover:border-[#F39A8C]/50 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5] dark:focus-visible:ring-[#F39A8C] ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {isSoundEnabled && !prefersReduced && (
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F39A8C] opacity-75" />
        )}
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isSoundEnabled
              ? 'bg-gradient-to-r from-[#F4A6B5] to-[#F39A8C]'
              : 'bg-[#9C949B] dark:bg-[#68606B]'
          }`}
        />
      </span>

      {isSoundEnabled ? (
        <Volume2 className="w-3.5 h-3.5 text-[#252126] dark:text-[#FAF5F7]" />
      ) : (
        <VolumeX className="w-3.5 h-3.5 text-[#9C949B] dark:text-[#7E7681]" />
      )}

      <span className="hidden sm:inline text-[#6F6870] dark:text-[#B5ADB7] font-sans">
        {isSoundEnabled ? 'Sound On' : 'Sound Off'}
      </span>
    </motion.button>
  );
}
