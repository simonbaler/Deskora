/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin } from 'lucide-react';

interface WorkspaceMetaProps {
  location: string;
  className?: string;
}

export function WorkspaceMeta({ location, className = '' }: WorkspaceMetaProps) {
  return (
    <div
      className={`inline-flex items-center gap-1.5 text-xs text-[#6F6870] font-medium ${className}`}
    >
      <MapPin className="w-3.5 h-3.5 text-[#F39A8C] shrink-0" />
      <span className="truncate">{location}</span>
    </div>
  );
}
