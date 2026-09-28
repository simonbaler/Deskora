/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
import { AppLoader } from './components/loading/AppLoader';
import { AppShell } from './components/layout/AppShell';
import { Hero } from './components/landing/Hero';
import { WorkspaceSection } from './components/workspace/WorkspaceSection';
import { HowItWorksModal } from './components/landing/HowItWorksModal';
import { VoiceAssistantModal } from './components/voice/VoiceAssistantModal';
import { DeskoraAssistant } from './components/assistant/DeskoraAssistant';
import { MobileBottomBar } from './components/layout/MobileBottomBar';
import { ToastProvider } from './context/ToastContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext';
import { Workspace, FilterCategory } from './types';

function MainApp() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isHowItWorksOpen, setIsHowItWorksOpen] = useState<boolean>(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState<boolean>(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);

  // Global filters & search
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Active workspace quick preview modal
  const [previewWorkspace, setPreviewWorkspace] = useState<Workspace | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  // Mobile navigation active tab
  const [activeMobileTab, setActiveMobileTab] = useState<'explore' | 'saved' | 'assistant' | 'about'>('explore');

  const handleLoadingComplete = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleScrollToWorkspaces = useCallback(() => {
    setActiveMobileTab('explore');
    const el = document.getElementById('workspaces');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleOpenSaved = useCallback(() => {
    setActiveMobileTab('saved');
    setActiveFilter('Saved');
    setSearchQuery('');
    const el = document.getElementById('workspaces');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleOpenAssistant = useCallback(() => {
    setActiveMobileTab('assistant');
    setIsAssistantOpen(true);
  }, []);

  const handleOpenAbout = useCallback(() => {
    setActiveMobileTab('about');
    setIsHowItWorksOpen(true);
  }, []);

  const handleOpenVoice = useCallback(() => {
    setIsVoiceOpen(true);
  }, []);

  const handleOpenWorkspacePreview = useCallback((workspace: Workspace) => {
    setPreviewWorkspace(workspace);
    setIsPreviewOpen(true);
  }, []);

  const handleCloseWorkspacePreview = useCallback(() => {
    setIsPreviewOpen(false);
  }, []);

  return (
    <>
      {/* Cinematic Loading Experience (1.2s - 1.45s launch sequence) */}
      <AnimatePresence mode="wait">
        {isLoading && <AppLoader onComplete={handleLoadingComplete} />}
      </AnimatePresence>

      {/* Main Landing Experience */}
      {!isLoading && (
        <AppShell
          onExploreClick={handleScrollToWorkspaces}
          onVoiceClick={handleOpenVoice}
        >
          {/* Hero section with Voice Welcome Orb */}
          <Hero
            onExploreSpaces={handleScrollToWorkspaces}
            onHowItWorks={() => setIsHowItWorksOpen(true)}
            onVoiceClick={handleOpenVoice}
          />

          {/* Company Screening Task 3: Exactly 5 Workspaces Scrollable List with Quick Preview */}
          <WorkspaceSection
            externalFilter={activeFilter}
            onFilterChange={setActiveFilter}
            externalSearch={searchQuery}
            onSearchChange={setSearchQuery}
            selectedWorkspace={previewWorkspace}
            isPreviewOpen={isPreviewOpen}
            onOpenPreview={handleOpenWorkspacePreview}
            onClosePreview={handleCloseWorkspacePreview}
          />

          {/* How It Works Modal */}
          <HowItWorksModal
            isOpen={isHowItWorksOpen}
            onClose={() => {
              setIsHowItWorksOpen(false);
              setActiveMobileTab('explore');
            }}
          />

          {/* Voice Assistant Modal */}
          <VoiceAssistantModal
            isOpen={isVoiceOpen}
            onClose={() => setIsVoiceOpen(false)}
            onApplyFilter={(cat) => {
              setActiveFilter(cat);
              setIsVoiceOpen(false);
            }}
            onApplySearch={(q) => {
              setSearchQuery(q);
              setIsVoiceOpen(false);
            }}
          />

          {/* AI FAQ Chat Assistant */}
          <DeskoraAssistant
            isOpen={isAssistantOpen}
            onOpen={() => setIsAssistantOpen(true)}
            onClose={() => {
              setIsAssistantOpen(false);
              setActiveMobileTab('explore');
            }}
            onSelectWorkspace={(ws) => {
              setIsAssistantOpen(false);
              handleOpenWorkspacePreview(ws);
            }}
            onApplyFilter={(cat) => {
              setActiveFilter(cat);
              setIsAssistantOpen(false);
            }}
            onApplySearch={(q) => {
              setSearchQuery(q);
              setIsAssistantOpen(false);
            }}
          />

          {/* Mobile-first bottom bar (320px - 767px) */}
          <MobileBottomBar
            activeTab={activeMobileTab}
            onExplore={() => {
              setActiveFilter('All');
              setSearchQuery('');
              handleScrollToWorkspaces();
            }}
            onSaved={handleOpenSaved}
            onAssistant={handleOpenAssistant}
            onAbout={handleOpenAbout}
          />
        </AppShell>
      )}
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <FavoritesProvider>
          <MainApp />
        </FavoritesProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
