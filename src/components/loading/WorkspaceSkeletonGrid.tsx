/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { WorkspaceSkeleton } from './WorkspaceSkeleton';

interface WorkspaceSkeletonGridProps {
  count?: number;
}

export function WorkspaceSkeletonGrid({ count = 5 }: WorkspaceSkeletonGridProps) {
  return (
    <div
      aria-busy="true"
      aria-label="Loading workspaces"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
    >
      {Array.from({ length: count }).map((_, i) => (
        <WorkspaceSkeleton key={i} />
      ))}
    </div>
  );
}
