/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState, useCallback } from 'react';
import { motion, useSpring } from 'motion/react';
import { Workspace } from '../../types';
import { WorkspaceImage } from './WorkspaceImage';
import { WorkspaceFavorite } from './WorkspaceFavorite';
import { WorkspaceMeta } from './WorkspaceMeta';
import { WorkspaceRating } from './WorkspaceRating';
import { WorkspacePrice } from './WorkspacePrice';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { Sparkles, Eye, ArrowUpRight } from 'lucide-react';

interface WorkspaceCardProps {
  workspace: Workspace;
  index: number;
  onSelect?: (workspace: Workspace) => void;
}

export function WorkspaceCard({ workspace, index, onSelect }: WorkspaceCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const prefersReduced = usePrefersReducedMotion();
  const [isHovered, setIsHovered] = useState(false);

  // Subtle 3D tilt springs for desktop (capped at 2 degrees)
  const rotateX = useSpring(0, { damping: 25, stiffness: 260 });
  const rotateY = useSpring(0, { damping: 25, stiffness: 260 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (prefersReduced || !cardRef.current) return;

      if (typeof window !== 'undefined' && !window.matchMedia('(pointer: fine)').matches) {
        return;
      }

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -2;
      const rotY = ((x - centerX) / centerX) * 2;

      rotateX.set(rotX);
      rotateY.set(rotY);
    },
    [prefersReduced, rotateX, rotateY]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('.cursor-favorite')) return;
    onSelect?.(workspace);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect?.(workspace);
    }
  };

  const staggerDelay = prefersReduced ? 0 : Math.min(index * 0.08, 0.32);

  return (
    <motion.article
      ref={cardRef}
      id={`workspace-card-${workspace.id}`}
      data-cursor="card"
      tabIndex={0}
      role="button"
      aria-label={`View details for ${workspace.name}, ₹${workspace.rentPerDay} per day`}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={prefersReduced ? { opacity: 1 } : { opacity: 0, y: 20, scale: 0.985 }}
      whileInView={prefersReduced ? {} : { opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{
        duration: 0.48,
        delay: staggerDelay,
        ease: [0.16, 1, 0.3, 1] as const,
      }}
      whileHover={
        prefersReduced
          ? {}
          : {
              y: -4,
              transition: { duration: 0.22, ease: 'easeOut' },
            }
      }
      whileTap={
        prefersReduced
          ? {}
          : {
              scale: 0.985,
              transition: { duration: 0.12, ease: 'easeOut' },
            }
      }
      style={{
        transformStyle: 'preserve-3d',
        rotateX,
        rotateY,
      }}
      className="interactive-element group relative flex flex-col justify-between rounded-[24px] sm:rounded-[26px] bg-white dark:bg-[#151218] border border-[#F0E8EA] dark:border-[#28212D] hover:border-[#E8DCE0] dark:hover:border-[#382E3F] p-3 sm:p-4 deskora-shadow-sm hover:deskora-shadow-md transition-all duration-300 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5]"
    >
      {/* Top Media & Floating Controls */}
      <div className="relative w-full overflow-hidden rounded-[20px] sm:rounded-[22px]">
        <WorkspaceImage
          src={workspace.image}
          alt={`Interior view of ${workspace.name} in ${workspace.location}`}
        />

        {/* Subtle Light Sweep effect on hover (Desktop) */}
        {!prefersReduced && isHovered && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"
          />
        )}

        {/* Top Badges Floating over Photo */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Workspace Type Badge */}
          <span className="pointer-events-auto px-2.5 py-1 rounded-full bg-white/95 dark:bg-[#151218]/95 backdrop-blur-md text-[11px] font-semibold text-[#252126] dark:text-[#FAF5F7] shadow-xs flex items-center gap-1 border border-white/20 dark:border-[#28212D]">
            <Sparkles className="w-3 h-3 text-[#F39A8C]" />
            {workspace.type}
          </span>

          {/* Favorite Button */}
          <div className="pointer-events-auto">
            <WorkspaceFavorite
              workspaceId={workspace.id}
              workspaceName={workspace.name}
            />
          </div>
        </div>

        {/* Floating Location on Photo Bottom */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none text-white">
          <div className="pointer-events-auto bg-black/55 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs">
            <WorkspaceMeta location={workspace.location} className="text-white drop-shadow-xs" />
          </div>

          <div className="pointer-events-auto bg-white/95 dark:bg-[#151218]/95 backdrop-blur-md px-2 py-0.5 rounded-full shadow-xs border border-white/20 dark:border-[#28212D]">
            <WorkspaceRating rating={workspace.rating} />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="pt-3.5 px-1 pb-1 flex flex-col flex-grow">
        {/* Workspace Name & View Indicator */}
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg sm:text-xl font-bold tracking-tight text-[#252126] dark:text-[#FAF5F7] group-hover:text-[#F39A8C] transition-colors duration-200">
            {workspace.name}
          </h3>
          <span className="text-[#C9B9E9] group-hover:text-[#F39A8C] transition-colors duration-200 shrink-0 mt-1">
            <ArrowUpRight className="w-4 h-4" />
          </span>
        </div>

        {/* Brief Description */}
        <p className="text-xs sm:text-[13px] text-[#6F6870] dark:text-[#B5ADB7] leading-relaxed mt-1 line-clamp-2">
          {workspace.description}
        </p>

        {/* Amenities Pills */}
        {workspace.amenities && workspace.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3 pt-2.5 border-t border-[#F5EDF0] dark:border-[#28212D]">
            {workspace.amenities.map((amenity) => (
              <span
                key={amenity}
                className="px-2.5 py-0.5 rounded-full bg-[#FFF8F6] dark:bg-[#1C1820] hover:bg-[#FFF0F2] dark:hover:bg-[#28212D] border border-[#F5E6E9] dark:border-[#28212D] text-[11px] font-medium text-[#6F6870] dark:text-[#B5ADB7] transition-colors"
              >
                {amenity}
              </span>
            ))}
          </div>
        )}

        {/* Card Footer: Price and Quick View CTA */}
        <div className="mt-4 pt-3 border-t border-[#F0E8EA] dark:border-[#28212D] flex items-center justify-between">
          <WorkspacePrice amount={workspace.rentPerDay} />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(workspace);
            }}
            aria-label={`View details and day pass for ${workspace.name}`}
            className="interactive-element px-3.5 py-1.5 rounded-full bg-[#FFF1F3] dark:bg-[#1C1820] group-hover:bg-[#252126] dark:group-hover:bg-[#FAF5F7] text-[#252126] dark:text-[#FAF5F7] group-hover:text-white dark:group-hover:text-[#151218] text-xs font-semibold transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5] active:scale-95 flex items-center gap-1.5 border border-[#F6D8DF] dark:border-[#28212D]"
          >
            <Eye className="w-3.5 h-3.5 text-[#F39A8C] group-hover:text-white dark:group-hover:text-[#151218] transition-colors" />
            <span>Day Pass</span>
          </button>
        </div>
      </div>
    </motion.article>
  );
}
