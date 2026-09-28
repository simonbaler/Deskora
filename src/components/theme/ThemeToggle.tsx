/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../../context/ThemeContext';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const prefersReduced = usePrefersReducedMotion();

  const isDark = theme === 'dark';
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';

  return (
    <motion.button
      type="button"
      onClick={toggleTheme}
      whileTap={prefersReduced ? {} : { scale: 0.92 }}
      whileHover={prefersReduced ? {} : { scale: 1.05 }}
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      className={`interactive-element relative min-h-[44px] min-w-[44px] sm:min-h-[38px] sm:min-w-[38px] p-2 rounded-full border border-[#F0E8EA] dark:border-[#28212D] bg-white/95 dark:bg-[#151218]/95 backdrop-blur-md text-[#252126] dark:text-[#FAF5F7] deskora-shadow-sm hover:deskora-shadow-md hover:border-[#EFA7B5]/60 dark:hover:border-[#F39A8C]/50 hover:shadow-[0_0_12px_rgba(243,154,140,0.22)] dark:hover:shadow-[0_0_14px_rgba(201,185,233,0.25)] flex items-center justify-center transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5] dark:focus-visible:ring-[#F39A8C] ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="dark-moon"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, rotate: -45, scale: 0.6 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, rotate: 45, scale: 0.6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex items-center justify-center"
          >
            <Moon className="w-4 h-4 text-[#C9B9E9] drop-shadow-[0_0_6px_rgba(201,185,233,0.6)]" />
          </motion.div>
        ) : (
          <motion.div
            key="light-sun"
            initial={prefersReduced ? { opacity: 0 } : { opacity: 0, rotate: 45, scale: 0.6 }}
            animate={prefersReduced ? { opacity: 1 } : { opacity: 1, rotate: 0, scale: 1 }}
            exit={prefersReduced ? { opacity: 0 } : { opacity: 0, rotate: -45, scale: 0.6 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] as const }}
            className="flex items-center justify-center"
          >
            <Sun className="w-4 h-4 text-[#F39A8C] drop-shadow-[0_0_6px_rgba(243,154,140,0.5)]" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
