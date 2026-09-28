/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReduced(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    } else if ((mediaQuery as unknown as { addListener?: (fn: typeof handleChange) => void }).addListener) {
      (mediaQuery as unknown as { addListener: (fn: typeof handleChange) => void }).addListener(handleChange);
      return () => {
        (mediaQuery as unknown as { removeListener: (fn: typeof handleChange) => void }).removeListener(handleChange);
      };
    }
  }, []);

  return prefersReduced;
}
