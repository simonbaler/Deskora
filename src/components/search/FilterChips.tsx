/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Heart } from 'lucide-react';
import { useSound } from '../../hooks/useSound';
import { useFavorites } from '../../context/FavoritesContext';
import { FilterCategory } from '../../types';

export type { FilterCategory };

interface FilterChipsProps {
  selectedFilter: FilterCategory;
  onSelectFilter: (filter: FilterCategory) => void;
  className?: string;
}

export function FilterChips({
  selectedFilter,
  onSelectFilter,
  className = '',
}: FilterChipsProps) {
  const { playSound } = useSound();
  const { favoritesCount } = useFavorites();
  const filters: FilterCategory[] = ['All', 'Quiet', 'Creative', 'Premium', 'Saved'];

  const handleClick = (filter: FilterCategory) => {
    playSound('button_press');
    onSelectFilter(filter);
  };

  return (
    <div
      role="tablist"
      aria-label="Filter workspaces by category"
      className={`flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none max-w-full ${className}`}
    >
      {filters.map((filter) => {
        const isSelected = selectedFilter === filter;
        return (
          <button
            key={filter}
            type="button"
            role="tab"
            aria-selected={isSelected}
            aria-controls="workspace-grid-container"
            onClick={() => handleClick(filter)}
            className={`interactive-element shrink-0 min-h-[38px] px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5] select-none active:scale-[0.97] flex items-center gap-1.5 ${
              isSelected
                ? 'bg-gradient-to-r from-[#252126] via-[#352F37] to-[#252126] dark:from-[#FAF5F7] dark:via-white dark:to-[#FAF5F7] text-white dark:text-[#151218] shadow-xs ring-1 ring-black/10'
                : 'bg-white dark:bg-[#151218] text-[#6F6870] dark:text-[#B5ADB7] border border-[#F0E8EA] dark:border-[#28212D] hover:border-[#EFA7B5]/50 dark:hover:border-[#EFA7B5]/50 hover:text-[#252126] dark:hover:text-[#FAF5F7]'
            }`}
          >
            {filter === 'Saved' && (
              <Heart
                className={`w-3.5 h-3.5 ${
                  isSelected ? 'fill-[#F39A8C] text-[#F39A8C]' : 'text-[#F39A8C]'
                }`}
              />
            )}
            <span>{filter === 'All' ? 'All Spaces' : filter}</span>
            {filter === 'Saved' && favoritesCount > 0 && (
              <span
                className={`ml-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isSelected
                    ? 'bg-white/20 dark:bg-black/15 text-white dark:text-[#151218]'
                    : 'bg-[#FFF1F3] dark:bg-[#F39A8C]/20 text-[#F39A8C]'
                }`}
              >
                {favoritesCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
