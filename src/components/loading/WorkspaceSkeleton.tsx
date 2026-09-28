/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function WorkspaceSkeleton() {
  const prefersReduced = usePrefersReducedMotion();
  const shimmerClass = prefersReduced ? '' : 'animate-pulse';

  return (
    <div
      aria-hidden="true"
      className="flex flex-col rounded-[26px] bg-white border border-[#F0E8EA] p-3 sm:p-4 deskora-shadow-sm select-none"
    >
      {/* Image Skeleton */}
      <div
        className={`relative aspect-[4/3] w-full rounded-[24px] bg-gradient-to-br from-[#F5ECEE] to-[#FAF3F5] overflow-hidden ${shimmerClass}`}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.8s_infinite]" />
      </div>

      {/* Content Skeleton */}
      <div className="pt-3.5 px-1 pb-1 flex flex-col gap-2.5">
        {/* Type pill skeleton */}
        <div className="w-24 h-4 rounded-full bg-[#F5ECEE]" />

        {/* Title skeleton (width ~65%) */}
        <div className="w-[65%] h-5 rounded-md bg-[#EADEE2]" />

        {/* Metadata skeleton (width ~45%) */}
        <div className="w-[45%] h-3.5 rounded-md bg-[#F5ECEE]" />

        {/* Amenities skeleton */}
        <div className="flex items-center gap-1.5 pt-1">
          <div className="w-16 h-4 rounded-full bg-[#F5ECEE]" />
          <div className="w-12 h-4 rounded-full bg-[#F5ECEE]" />
          <div className="w-14 h-4 rounded-full bg-[#F5ECEE]" />
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[#F0E8EA] my-1" />

        {/* Footer: Price (width ~30%) & Rating */}
        <div className="flex items-center justify-between">
          <div className="w-[30%] h-5 rounded-md bg-[#EADEE2]" />
          <div className="w-12 h-4 rounded-md bg-[#F5ECEE]" />
        </div>
      </div>
    </div>
  );
}
