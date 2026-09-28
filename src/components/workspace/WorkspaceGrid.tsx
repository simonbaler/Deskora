/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Workspace } from '../../types';
import { WorkspaceCard } from './WorkspaceCard';

interface WorkspaceGridProps {
  workspaces: Workspace[];
  onSelectWorkspace?: (workspace: Workspace) => void;
}

export function WorkspaceGrid({ workspaces, onSelectWorkspace }: WorkspaceGridProps) {
  return (
    <div
      id="workspace-grid-container"
      role="region"
      aria-label="Workspace listings"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
    >
      {workspaces.map((workspace, index) => (
        <WorkspaceCard
          key={workspace.id}
          workspace={workspace}
          index={index}
          onSelect={onSelectWorkspace}
        />
      ))}
    </div>
  );
}
