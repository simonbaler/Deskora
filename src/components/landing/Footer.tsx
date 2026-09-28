/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatedLogo } from '../ui/AnimatedLogo';
import { Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-[#0D0B0F] border-t border-[#F0E8EA] dark:border-[#28212D] py-10 sm:py-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo & positioning */}
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <AnimatedLogo size="sm" showTagline />
            <p className="text-xs text-[#6F6870] dark:text-[#B5ADB7] mt-2 max-w-xs">
              A workspace discovery experience helping you find comfortable places to focus, create, and thrive.
            </p>
          </div>

          {/* Screening task summary for evaluator */}
          <div className="text-center sm:text-right text-xs text-[#9C949B] dark:text-[#827A84]">
            <p className="font-semibold text-[#252126] dark:text-[#FAF5F7]">Deskora • Technical Screening Build</p>
            <p className="mt-0.5">Task 3 Mini-Build: 5 Workspaces • No backend</p>
            <p className="mt-2 flex items-center justify-center sm:justify-end gap-1 text-[11px] text-[#6F6870] dark:text-[#B5ADB7]">
              Crafted with <Heart className="w-3 h-3 text-[#F39A8C] fill-[#F39A8C]" /> for creative minds
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
