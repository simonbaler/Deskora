/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

interface WorkspaceSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  className?: string;
}

export function WorkspaceSearch({
  value,
  onChange,
  onClear,
  className = '',
}: WorkspaceSearchProps) {
  const { playSound } = useSound();
  const [isFocused, setIsFocused] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    playSound('button_press');
    onClear();
  };

  return (
    <div className={`relative w-full md:max-w-[560px] ${className}`}>
      <div
        className={`relative flex items-center w-full h-12 sm:h-[52px] rounded-[18px] bg-white dark:bg-[#151218] transition-all duration-300 ${
          isFocused
            ? 'ring-2 ring-[#F39A8C] border-transparent shadow-[0_4px_22px_rgba(243,154,140,0.22)]'
            : 'border border-[#F0E8EA] dark:border-[#28212D] hover:border-[#E8DCE0] dark:hover:border-[#3B3242] deskora-shadow-sm'
        }`}
      >
        {/* Left Search Icon with subtle focus movement */}
        <div className="pl-4 pr-2.5 flex items-center pointer-events-none">
          <Search
            className={`w-4 h-4 transition-all duration-200 ${
              isFocused
                ? 'text-[#F39A8C] scale-110 -translate-x-0.5'
                : 'text-[#9C949B] dark:text-[#827A84]'
            }`}
          />
        </div>

        {/* Input */}
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            setIsFocused(true);
            playSound('button_press');
          }}
          onBlur={() => setIsFocused(false)}
          placeholder="Search a workspace..."
          aria-label="Search workspaces by name, location, or type"
          className="w-full h-full pr-11 text-sm text-[#252126] dark:text-[#FAF5F7] placeholder-[#9C949B] dark:placeholder-[#827A84] bg-transparent outline-none font-medium"
        />

        {/* Clear Button with smooth scale + fade animation */}
        <AnimatePresence>
          {value.length > 0 && (
            <motion.button
              type="button"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              onClick={handleClear}
              aria-label="Clear workspace search"
              className="absolute right-2.5 w-8 h-8 rounded-full bg-[#FFF1F3] dark:bg-[#1C1820] hover:bg-[#FCE2E7] dark:hover:bg-[#28212D] text-[#6F6870] dark:text-[#B5ADB7] hover:text-[#252126] dark:hover:text-[#FAF5F7] flex items-center justify-center transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5]"
            >
              <X className="w-3.5 h-3.5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
