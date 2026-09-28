/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import { CustomCursor } from '../cursor/CustomCursor';
import { Header } from '../landing/Header';
import { Footer } from '../landing/Footer';
import { ScrollProgress } from '../ui/ScrollProgress';

interface AppShellProps {
  children: ReactNode;
  onExploreClick?: () => void;
  onVoiceClick?: () => void;
}

export function AppShell({ children, onExploreClick, onVoiceClick }: AppShellProps) {
  return (
    <div className="relative min-h-screen flex flex-col bg-[#FFFCFA] dark:bg-[#0D0B0F] text-[#252126] dark:text-[#FAF5F7] transition-colors duration-200">
      {/* Scroll Progress Bar at the top */}
      <ScrollProgress />

      {/* Desktop Custom Smooth Inertia Cursor */}
      <CustomCursor />

      {/* Primary Sticky Header with Theme & Sound controls */}
      <Header onExploreClick={onExploreClick} onVoiceClick={onVoiceClick} />

      {/* Main Page Content */}
      <main className="flex-grow flex flex-col pb-16 md:pb-0">
        {children}
      </main>

      {/* Brand & Screening Footer */}
      <Footer />
    </div>
  );
}
