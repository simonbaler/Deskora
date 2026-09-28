/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { SearchX, RotateCcw } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

interface EmptyWorkspaceStateProps {
  onReset: () => void;
}

export function EmptyWorkspaceState({ onReset }: EmptyWorkspaceStateProps) {
  const { playSound } = useSound();

  const handleReset = () => {
    playSound('button_press');
    onReset();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] as const }}
      className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white dark:bg-[#151218] rounded-[28px] border border-[#F0E8EA] dark:border-[#28212D] deskora-shadow-sm my-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-[#FFF1F3] dark:bg-[#F39A8C]/15 border border-[#F6D8DF] dark:border-[#F39A8C]/25 flex items-center justify-center text-[#F39A8C] mb-4">
        <SearchX className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-[#252126] dark:text-[#FAF5F7] tracking-tight">
        No spaces found.
      </h3>

      <p className="text-sm text-[#6F6870] dark:text-[#B5ADB7] max-w-sm mt-1 mb-6 leading-relaxed">
        Try another workspace name, location, or category.
      </p>

      <button
        type="button"
        onClick={handleReset}
        className="interactive-element inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#252126] dark:bg-[#FAF5F7] text-white dark:text-[#151218] text-xs font-semibold hover:bg-[#3D373F] dark:hover:bg-white transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5] active:scale-95 shadow-xs"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Clear search</span>
      </button>
    </motion.div>
  );
}
