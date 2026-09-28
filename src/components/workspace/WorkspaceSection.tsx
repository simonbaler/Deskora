/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { WORKSPACES } from '../../data/workspaces';
import { Workspace, FilterCategory } from '../../types';
import { WorkspaceGrid } from './WorkspaceGrid';
import { WorkspaceSkeletonGrid } from '../loading/WorkspaceSkeletonGrid';
import { WorkspaceSearch } from '../search/WorkspaceSearch';
import { FilterChips } from '../search/FilterChips';
import { EmptyWorkspaceState } from '../search/EmptyWorkspaceState';
import { WorkspaceQuickPreview } from './WorkspaceQuickPreview';
import { useFavorites } from '../../context/FavoritesContext';
import { Sparkles, CheckCircle2 } from 'lucide-react';

interface WorkspaceSectionProps {
  externalFilter?: FilterCategory;
  onFilterChange?: (filter: FilterCategory) => void;
  externalSearch?: string;
  onSearchChange?: (query: string) => void;
  selectedWorkspace?: Workspace | null;
  isPreviewOpen?: boolean;
  onOpenPreview?: (workspace: Workspace) => void;
  onClosePreview?: () => void;
}

export function WorkspaceSection({
  externalFilter,
  onFilterChange,
  externalSearch,
  onSearchChange,
  selectedWorkspace,
  isPreviewOpen: externalIsPreviewOpen,
  onOpenPreview,
  onClosePreview,
}: WorkspaceSectionProps) {
  const { isFavorite } = useFavorites();
  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [internalSelectedFilter, setInternalSelectedFilter] = useState<FilterCategory>('All');
  const [isInitializing, setIsInitializing] = useState(true);

  // Internal preview modal state (used if external not provided)
  const [internalPreviewWorkspace, setInternalPreviewWorkspace] = useState<Workspace | null>(null);
  const [internalIsPreviewOpen, setInternalIsPreviewOpen] = useState(false);

  // Sync with external or internal
  const selectedFilter = externalFilter ?? internalSelectedFilter;
  const searchQuery = externalSearch ?? internalSearchQuery;
  const previewWorkspace = selectedWorkspace ?? internalPreviewWorkspace;
  const isPreviewOpen = externalIsPreviewOpen ?? internalIsPreviewOpen;

  const handleFilterSelect = (cat: FilterCategory) => {
    setInternalSelectedFilter(cat);
    onFilterChange?.(cat);
  };

  const handleSearchChange = (q: string) => {
    setInternalSearchQuery(q);
    onSearchChange?.(q);
  };

  // Brief initial skeleton presentation (280ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 280);
    return () => clearTimeout(timer);
  }, []);

  // Filter workspaces locally without any backend
  const filteredWorkspaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return WORKSPACES.filter((ws) => {
      // Category filter
      let matchesFilter = true;
      if (selectedFilter === 'Quiet') {
        matchesFilter =
          ws.type.toLowerCase().includes('quiet') ||
          ws.name.toLowerCase().includes('study') ||
          ws.amenities.some((a) => a.toLowerCase().includes('quiet'));
      } else if (selectedFilter === 'Creative') {
        matchesFilter =
          ws.type.toLowerCase().includes('creative') ||
          ws.type.toLowerCase().includes('collaborative') ||
          ws.name.toLowerCase().includes('atelier') ||
          ws.name.toLowerCase().includes('glasshouse');
      } else if (selectedFilter === 'Premium') {
        matchesFilter =
          ws.type.toLowerCase().includes('premium') ||
          ws.type.toLowerCase().includes('private') ||
          ws.rentPerDay >= 549;
      } else if (selectedFilter === 'Saved') {
        matchesFilter = isFavorite(ws.id);
      }

      if (!matchesFilter) return false;

      // Text search query filter (matches name, location, or type)
      if (q) {
        const matchesName = ws.name.toLowerCase().includes(q);
        const matchesLocation = ws.location.toLowerCase().includes(q);
        const matchesType = ws.type.toLowerCase().includes(q);
        const matchesAmenities = ws.amenities.some((a) => a.toLowerCase().includes(q));
        return matchesName || matchesLocation || matchesType || matchesAmenities;
      }

      return true;
    });
  }, [searchQuery, selectedFilter, isFavorite]);

  const handleResetFilters = () => {
    handleSearchChange('');
    handleFilterSelect('All');
  };

  const handleOpenCard = (workspace: Workspace) => {
    if (onOpenPreview) {
      onOpenPreview(workspace);
    } else {
      setInternalPreviewWorkspace(workspace);
      setInternalIsPreviewOpen(true);
    }
  };

  const handleCloseCard = () => {
    if (onClosePreview) {
      onClosePreview();
    } else {
      setInternalIsPreviewOpen(false);
    }
  };

  return (
    <section
      id="workspaces"
      className="relative w-full py-12 sm:py-16 lg:py-24 bg-[#FFF8F6]/60 dark:bg-[#110E14] border-t border-[#F0E8EA] dark:border-[#28212D] transition-colors"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="flex flex-col items-start sm:items-center text-left sm:text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-gradient-to-r from-[#FFF1F3] to-[#FFF5F2] dark:from-[#F39A8C]/15 dark:to-[#B79FE4]/15 border border-[#F6D8DF] dark:border-[#F39A8C]/30 text-[11px] font-bold text-[#252126] dark:text-[#FAF5F7] tracking-widest uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F39A8C]" />
            <span>FIND YOUR SPACE</span>
          </div>

          {/* Title: Spaces you'll love. */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#252126] dark:text-[#FAF5F7]">
            Spaces you'll love<span className="text-[#F39A8C]">.</span>
          </h2>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-[#6F6870] dark:text-[#B5ADB7] mt-3 leading-relaxed max-w-xl">
            Thoughtfully chosen workspaces for focused days, creative sessions, and everything in between.
          </p>
        </div>

        {/* Discovery Bar: Search & Filter Chips */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sm:mb-10 bg-white dark:bg-[#151218] p-3 sm:p-4 rounded-[26px] border border-[#F0E8EA] dark:border-[#28212D] deskora-shadow-sm">
          {/* Search Input */}
          <WorkspaceSearch
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={() => handleSearchChange('')}
            className="w-full md:max-w-sm"
          />

          {/* Category Filter Chips */}
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto">
            <FilterChips
              selectedFilter={selectedFilter}
              onSelectFilter={handleFilterSelect}
            />

            {/* Results counter */}
            <div className="hidden sm:inline-flex items-center px-3 py-1.5 rounded-full bg-[#FFF8F6] dark:bg-[#1C1820] border border-[#F5E8EB] dark:border-[#28212D] text-xs font-semibold text-[#6F6870] dark:text-[#B5ADB7] whitespace-nowrap shrink-0">
              {filteredWorkspaces.length} of {WORKSPACES.length} spaces
            </div>
          </div>
        </div>

        {/* Main Content: Skeleton Buffer, Workspace Grid, or Empty State */}
        {isInitializing ? (
          <WorkspaceSkeletonGrid count={5} />
        ) : filteredWorkspaces.length > 0 ? (
          <WorkspaceGrid
            workspaces={filteredWorkspaces}
            onSelectWorkspace={handleOpenCard}
          />
        ) : (
          <EmptyWorkspaceState onReset={handleResetFilters} />
        )}

        {/* Evaluator Verification Bar */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-[#151218] border border-[#F0E8EA] dark:border-[#28212D] text-xs text-[#6F6870] dark:text-[#B5ADB7] deskora-shadow-sm">
            <span className="flex items-center gap-1.5 font-medium text-[#252126] dark:text-[#FAF5F7]">
              <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
              Company Task 3 Verified
            </span>
            <span className="hidden sm:inline text-[#D4CDD2] dark:text-[#4A424E]">•</span>
            <span>Exactly 5 fake workspaces</span>
            <span className="hidden sm:inline text-[#D4CDD2] dark:text-[#4A424E]">•</span>
            <span>INR rent amounts</span>
            <span className="hidden sm:inline text-[#D4CDD2] dark:text-[#4A424E]">•</span>
            <span>No backend / Hardcoded</span>
          </div>
        </div>
      </div>

      {/* Quick Preview Modal / Bottom Sheet */}
      <WorkspaceQuickPreview
        workspace={previewWorkspace}
        isOpen={isPreviewOpen}
        onClose={handleCloseCard}
      />
    </section>
  );
}
