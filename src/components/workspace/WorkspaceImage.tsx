/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Armchair } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface WorkspaceImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function WorkspaceImage({ src, alt, className = '' }: WorkspaceImageProps) {
  const prefersReduced = usePrefersReducedMotion();
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`relative aspect-[4/3] w-full rounded-[20px] sm:rounded-[22px] overflow-hidden bg-[#FAF3F5] ${className}`}
    >
      {/* Loading Skeleton Shimmer */}
      {!isLoaded && !hasError && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-[#F5ECEE] to-[#FAF3F5] flex items-center justify-center animate-pulse"
        >
          <div className="w-8 h-8 rounded-full border-2 border-[#EFA7B5]/40 border-t-transparent animate-spin" />
        </div>
      )}

      {/* Main Image */}
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          onError={() => {
            setHasError(true);
            setIsLoaded(true);
          }}
          loading="lazy"
          referrerPolicy="no-referrer"
          className={`w-full h-full object-cover object-center transition-transform duration-500 ease-out sm:group-hover:scale-[1.025] ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ) : (
        /* Elegant fallback graphic for error states */
        <div
          aria-hidden="true"
          className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#FFF1F3] via-[#FFF8F6] to-[#F7EEF8] text-[#9C949B] p-4 text-center"
        >
          <div className="w-12 h-12 rounded-2xl bg-white shadow-2xs flex items-center justify-center text-[#F39A8C] mb-2">
            <Armchair className="w-6 h-6" />
          </div>
          <p className="text-xs font-semibold text-[#6F6870]">Deskora Workspace</p>
          <p className="text-[10px] text-[#9C949B] mt-0.5">Verified Sanctuary</p>
        </div>
      )}

      {/* Subtle bottom gradient overlay for contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent"
      />
    </div>
  );
}
