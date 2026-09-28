/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Star } from 'lucide-react';

interface WorkspaceRatingProps {
  rating: number;
  className?: string;
}

export function WorkspaceRating({ rating, className = '' }: WorkspaceRatingProps) {
  return (
    <div
      className={`inline-flex items-center gap-1 text-xs font-bold text-[#252126] ${className}`}
      aria-label={`Rating: ${rating.toFixed(1)} out of 5 stars`}
    >
      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 shrink-0" />
      <span>{rating.toFixed(1)}</span>
    </div>
  );
}
