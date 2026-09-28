/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AnimatedLogo } from '../ui/AnimatedLogo';
import { SoundToggle } from '../sound/SoundToggle';
import { ThemeToggle } from '../theme/ThemeToggle';
import { Sparkles, Mic } from 'lucide-react';

interface HeaderProps {
  onExploreClick?: () => void;
  onVoiceClick?: () => void;
}

export function Header({ onExploreClick, onVoiceClick }: HeaderProps) {
  return (
    <header
      id="deskora-header"
      className="sticky top-0 z-40 w-full h-16 sm:h-[72px] bg-[#FFFCFA]/90 dark:bg-[#0D0B0F]/90 backdrop-blur-md border-b border-[#F0E8EA]/70 dark:border-[#28212D]/80 transition-colors"
    >
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left: Deskora Logo */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          aria-label="Deskora Home"
          className="interactive-element flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5] dark:focus-visible:ring-[#F39A8C] rounded-lg"
        >
          <AnimatedLogo size="md" />
        </a>

        {/* Right: Voice Welcome + Sound Toggle + Theme Toggle + Screening Task 3 indicator / Quick Explore */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Subtle screening badge */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1F3] dark:bg-[#F39A8C]/15 border border-[#F6D8DF] dark:border-[#F39A8C]/25 text-[11px] font-semibold text-[#252126] dark:text-[#FAF5F7] tracking-wide">
            <Sparkles className="w-3 h-3 text-[#F39A8C]" />
            <span>5 Workspaces Verified</span>
          </div>

          {/* Voice Assistant trigger */}
          {onVoiceClick && (
            <button
              type="button"
              onClick={onVoiceClick}
              data-cursor="voice"
              aria-label="Open Deskora Voice Assistant"
              title="Voice Assistant"
              className="interactive-element flex items-center gap-1.5 min-h-[44px] sm:min-h-[38px] px-2.5 sm:px-3 py-1.5 rounded-full bg-[#FFF8F6] dark:bg-[#151218] hover:bg-[#FFF0F2] dark:hover:bg-[#1C1820] border border-[#F0E8EA] dark:border-[#28212D] hover:border-[#C9B9E9] dark:hover:border-[#C9B9E9] text-xs font-semibold text-[#252126] dark:text-[#FAF5F7] transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#C9B9E9]"
            >
              <Mic className="w-3.5 h-3.5 text-[#F39A8C]" />
              <span className="hidden sm:inline">Voice</span>
            </button>
          )}

          {/* Sound Toggle */}
          <SoundToggle />

          {/* Theme Toggle (Light / Dark mode) */}
          <ThemeToggle />

          {/* Mobile Explore Quick Jump */}
          {onExploreClick && (
            <button
              type="button"
              onClick={onExploreClick}
              className="text-xs font-semibold px-3 py-1.5 min-h-[44px] flex items-center justify-center rounded-full bg-[#252126] dark:bg-[#FAF5F7] text-white dark:text-[#151218] hover:bg-[#3D373F] dark:hover:bg-white transition-colors cursor-pointer sm:hidden"
            >
              Spaces
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
