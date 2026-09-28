/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Compass, Heart, Bot, Info } from 'lucide-react';
import { useFavorites } from '../../context/FavoritesContext';
import { useSound } from '../../hooks/useSound';

interface MobileBottomBarProps {
  activeTab: 'explore' | 'saved' | 'assistant' | 'about';
  onExplore: () => void;
  onSaved: () => void;
  onAssistant: () => void;
  onAbout: () => void;
}

export function MobileBottomBar({
  activeTab,
  onExplore,
  onSaved,
  onAssistant,
  onAbout,
}: MobileBottomBarProps) {
  const { favoritesCount } = useFavorites();
  const { playSound } = useSound();

  const handleAction = (tab: 'explore' | 'saved' | 'assistant' | 'about', action: () => void) => {
    playSound('button_press');
    action();
  };

  return (
    <nav
      id="deskora-mobile-bottom-bar"
      role="navigation"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FFFCFA]/95 dark:bg-[#0D0B0F]/95 backdrop-blur-lg border-t border-[#F0E8EA] dark:border-[#28212D] pb-[max(env(safe-area-inset-bottom),8px)] pt-2 px-3 shadow-[0_-4px_20px_rgba(0,0,0,0.04)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* 1. Explore */}
        <button
          type="button"
          onClick={() => handleAction('explore', onExplore)}
          aria-label="Explore workspaces"
          aria-current={activeTab === 'explore' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] rounded-xl transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5] ${
            activeTab === 'explore'
              ? 'text-[#252126] dark:text-[#FAF5F7] font-bold'
              : 'text-[#9C949B] dark:text-[#7E7681] hover:text-[#6F6870] dark:hover:text-[#B5ADB7]'
          }`}
        >
          <div
            className={`p-1 rounded-full transition-colors ${
              activeTab === 'explore'
                ? 'bg-[#FFF1F3] dark:bg-[#F39A8C]/20 text-[#F39A8C]'
                : ''
            }`}
          >
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Explore</span>
        </button>

        {/* 2. Saved */}
        <button
          type="button"
          onClick={() => handleAction('saved', onSaved)}
          aria-label={`Saved workspaces (${favoritesCount})`}
          aria-current={activeTab === 'saved' ? 'page' : undefined}
          className={`relative flex flex-col items-center justify-center min-w-[56px] min-h-[46px] rounded-xl transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5] ${
            activeTab === 'saved'
              ? 'text-[#252126] dark:text-[#FAF5F7] font-bold'
              : 'text-[#9C949B] dark:text-[#7E7681] hover:text-[#6F6870] dark:hover:text-[#B5ADB7]'
          }`}
        >
          <div
            className={`p-1 rounded-full transition-colors ${
              activeTab === 'saved'
                ? 'bg-[#FFF1F3] dark:bg-[#F39A8C]/20 text-[#F39A8C]'
                : ''
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                activeTab === 'saved' ? 'fill-[#F39A8C] text-[#F39A8C]' : ''
              }`}
            />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Saved</span>

          {favoritesCount > 0 && (
            <span className="absolute top-1 right-2 px-1.5 py-0.2 rounded-full bg-[#F39A8C] text-white text-[9px] font-bold leading-none">
              {favoritesCount}
            </span>
          )}
        </button>

        {/* 3. Assistant */}
        <button
          type="button"
          onClick={() => handleAction('assistant', onAssistant)}
          aria-label="Open Deskora Assistant"
          aria-current={activeTab === 'assistant' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] rounded-xl transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5] ${
            activeTab === 'assistant'
              ? 'text-[#252126] dark:text-[#FAF5F7] font-bold'
              : 'text-[#9C949B] dark:text-[#7E7681] hover:text-[#6F6870] dark:hover:text-[#B5ADB7]'
          }`}
        >
          <div
            className={`p-1 rounded-full transition-colors ${
              activeTab === 'assistant'
                ? 'bg-[#FFF1F3] dark:bg-[#F39A8C]/20 text-[#F39A8C]'
                : ''
            }`}
          >
            <Bot className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Assistant</span>
        </button>

        {/* 4. About */}
        <button
          type="button"
          onClick={() => handleAction('about', onAbout)}
          aria-label="About Deskora screening task"
          aria-current={activeTab === 'about' ? 'page' : undefined}
          className={`flex flex-col items-center justify-center min-w-[56px] min-h-[46px] rounded-xl transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5] ${
            activeTab === 'about'
              ? 'text-[#252126] dark:text-[#FAF5F7] font-bold'
              : 'text-[#9C949B] dark:text-[#7E7681] hover:text-[#6F6870] dark:hover:text-[#B5ADB7]'
          }`}
        >
          <div
            className={`p-1 rounded-full transition-colors ${
              activeTab === 'about'
                ? 'bg-[#FFF1F3] dark:bg-[#F39A8C]/20 text-[#F39A8C]'
                : ''
            }`}
          >
            <Info className="w-5 h-5" />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">About</span>
        </button>
      </div>
    </nav>
  );
}
