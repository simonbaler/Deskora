/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Sparkles, Mic, ArrowDown, SlidersHorizontal, Square } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { useSound } from '../../hooks/useSound';
import { useVoice } from '../../hooks/useVoice';
import { VoiceSettingsModal } from './VoiceSettingsModal';

interface VoiceWelcomeOrbProps {
  onExploreClick?: () => void;
  onOpenVoiceAssistant?: () => void;
  className?: string;
}

export function VoiceWelcomeOrb({
  onExploreClick,
  onOpenVoiceAssistant,
  className = '',
}: VoiceWelcomeOrbProps) {
  const prefersReduced = usePrefersReducedMotion();
  const { playSound } = useSound();
  const { isSpeaking, isSupported, speakWelcome, stop, hasSpokenWelcome } = useVoice();

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [userInteracted, setUserInteracted] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const welcomeHeadline = "Hi! Welcome to Deskora.";
  const welcomeSubline = "Let's find a space you'll love.";

  // Safe speak welcome implementation
  const triggerWelcome = useCallback(
    (isUserGesture = false) => {
      if (!isSupported) return;

      // If already spoken automatically in this session and not an explicit user click, don't repeat
      if (!isUserGesture && hasSpokenWelcome) {
        return;
      }

      playSound('voice_activate');
      speakWelcome();
    },
    [isSupported, hasSpokenWelcome, playSound, speakWelcome]
  );

  // Initial sequence on mount: attempt soft auto-welcome or register first legitimate user gesture fallback
  useEffect(() => {
    if (typeof window === 'undefined' || !isSupported) return;

    // Small delay to allow page assets and audio subsystem to settle
    const settleTimer = window.setTimeout(() => {
      if (!hasSpokenWelcome) {
        triggerWelcome(false);
      }
    }, 500);

    // Register first legitimate user gesture as a safe browser-approved fallback
    const handleFirstUserGesture = () => {
      setUserInteracted(true);
      if (!hasSpokenWelcome) {
        triggerWelcome(true);
      }
      cleanupGestureListeners();
    };

    const cleanupGestureListeners = () => {
      window.removeEventListener('pointerdown', handleFirstUserGesture);
      window.removeEventListener('keydown', handleFirstUserGesture);
    };

    window.addEventListener('pointerdown', handleFirstUserGesture, { once: true });
    window.addEventListener('keydown', handleFirstUserGesture, { once: true });

    return () => {
      window.clearTimeout(settleTimer);
      cleanupGestureListeners();
    };
  }, [isSupported, hasSpokenWelcome, triggerWelcome]);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      playSound('button_press');
      stop();
    } else {
      setUserInteracted(true);
      triggerWelcome(true);
    }
  };

  const handleOpenSettings = () => {
    playSound('button_press');
    setIsSettingsOpen(true);
  };

  const handleExplore = () => {
    playSound('click');
    onExploreClick?.();
  };

  return (
    <>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] as const }}
        className={`relative w-full max-w-xl mx-auto rounded-3xl p-5 sm:p-6 border border-[#F0E8EA] dark:border-[#28212D] bg-white/95 dark:bg-[#151218]/95 backdrop-blur-xl deskora-shadow-md overflow-hidden ${className}`}
      >
        {/* Soft atmospheric gradient halos (warm rose, peach, lavender) */}
        <div className="absolute -right-16 -top-16 w-52 h-52 rounded-full bg-gradient-to-br from-[#F4A6B5]/20 via-[#F7C3A3]/18 to-[#CDBDEB]/20 blur-2xl pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-52 h-52 rounded-full bg-gradient-to-tr from-[#CDBDEB]/18 via-[#F4A6B5]/15 to-[#F39A8C]/18 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
          {/* Glowing Animated Voice Orb */}
          <div className="relative shrink-0 flex items-center justify-center">
            {/* Gentle breathing aura */}
            {!prefersReduced && (
              <motion.div
                animate={{
                  scale: isSpeaking ? [1, 1.28, 1] : [1, 1.12, 1],
                  opacity: isSpeaking ? [0.65, 0.9, 0.65] : [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: isSpeaking ? 1.5 : 3.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#F4A6B5] via-[#F39A8C] to-[#C9B9E9] blur-md"
              />
            )}

            {/* Core Orb Button */}
            <button
              type="button"
              onClick={handleToggleSpeech}
              aria-label={isSpeaking ? 'Stop voice welcome' : 'Play voice welcome to Deskora'}
              title={isSpeaking ? 'Stop voice' : 'Hear welcome'}
              className="interactive-element relative w-16 h-16 sm:w-18 sm:h-18 rounded-full p-[2px] bg-gradient-to-tr from-[#F4A6B5] via-[#F7C3A3] to-[#CDBDEB] deskora-shadow-md hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#F39A8C]"
            >
              <div className="w-full h-full rounded-full bg-white dark:bg-[#151218] flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  {isSpeaking ? (
                    /* Delicate Pink & Peach Waveform Bars */
                    <motion.div
                      key="speaking-bars"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-1 h-6"
                    >
                      {[0.35, 0.75, 1, 0.65, 0.4].map((scale, i) => (
                        <motion.span
                          key={i}
                          animate={
                            prefersReduced
                              ? { height: 14 }
                              : { height: [6, 20 * scale, 6] }
                          }
                          transition={{
                            duration: 0.55 + i * 0.08,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="w-1 rounded-full bg-gradient-to-t from-[#F4A6B5] via-[#F39A8C] to-[#C9B9E9]"
                        />
                      ))}
                    </motion.div>
                  ) : (
                    /* Speaker & Spark Icon */
                    <motion.div
                      key="idle-icon"
                      initial={{ scale: 0.85, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.85, opacity: 0 }}
                      className="flex flex-col items-center justify-center text-[#F39A8C]"
                    >
                      <Volume2 className="w-6 h-6" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </button>

            {/* Spark badge */}
            <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-white dark:bg-[#1C1820] border border-[#F0E8EA] dark:border-[#28212D] flex items-center justify-center shadow-xs pointer-events-none">
              <Sparkles className="w-3 h-3 text-[#F39A8C]" />
            </div>
          </div>

          {/* Text Information & Controls */}
          <div className="flex-1 min-w-0">
            {/* Top pill badge + live indicator */}
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#FFF1F3] dark:bg-[#F39A8C]/15 text-[#F39A8C] border border-[#F6D8DF] dark:border-[#F39A8C]/30">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSpeaking ? 'bg-[#34D399] animate-ping' : 'bg-[#F39A8C] animate-pulse'
                  }`}
                />
                <span>Voice Welcome</span>
              </span>
              <span className="text-[11px] text-[#9C949B] dark:text-[#7E7681]">
                {isSpeaking ? 'Speaking…' : 'Warm • Clear • Curated'}
              </span>
            </div>

            {/* Main Greeting Quote */}
            <h3 className="text-base sm:text-lg font-bold text-[#252126] dark:text-[#FAF5F7] tracking-tight">
              "{welcomeHeadline}"
            </h3>
            <p className="text-xs sm:text-sm text-[#6F6870] dark:text-[#B5ADB7] mt-0.5 leading-relaxed">
              {isSpeaking
                ? welcomeSubline
                : !userInteracted && !hasSpokenWelcome
                ? "Tap to hear welcome, customize voice settings, or ask our assistant."
                : "Boutique workspaces designed for focused days and creative moments."}
            </p>

            {/* Interactive Control Row */}
            <div className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-2.5">
              {/* Primary Play / Stop Button */}
              <button
                type="button"
                onClick={handleToggleSpeech}
                className={`interactive-element min-h-[44px] px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#F39A8C] ${
                  isSpeaking
                    ? 'bg-[#FFF1F3] dark:bg-[#F39A8C]/20 text-[#F39A8C] border border-[#F39A8C]/40 hover:bg-[#FFE4E8]'
                    : 'bg-gradient-to-r from-[#F4A6B5] via-[#F7C3A3] to-[#CDBDEB] text-[#252126] font-bold deskora-shadow-sm hover:deskora-shadow-md active:scale-97'
                }`}
              >
                {isSpeaking ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop speech</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Hear welcome</span>
                  </>
                )}
              </button>

              {/* Voice Settings Trigger */}
              <button
                type="button"
                onClick={handleOpenSettings}
                aria-label="Open voice settings"
                title="Voice settings"
                className="interactive-element min-h-[44px] px-3.5 py-2 rounded-full text-xs font-medium text-[#6F6870] dark:text-[#B5ADB7] bg-white dark:bg-[#1C1820] border border-[#F0E8EA] dark:border-[#28212D] hover:border-[#F39A8C]/50 hover:text-[#252126] dark:hover:text-[#FAF5F7] flex items-center gap-1.5 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#F39A8C]"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#F39A8C]" />
                <span>Voice settings</span>
              </button>

              {/* Voice Assistant Modal Trigger */}
              {onOpenVoiceAssistant && (
                <button
                  type="button"
                  onClick={() => {
                    stop();
                    playSound('modal_open');
                    onOpenVoiceAssistant();
                  }}
                  className="interactive-element min-h-[44px] px-3.5 py-2 rounded-full text-xs font-semibold text-[#252126] dark:text-[#FAF5F7] bg-white dark:bg-[#1C1820] border border-[#F0E8EA] dark:border-[#28212D] hover:border-[#C9B9E9] flex items-center gap-1.5 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#C9B9E9]"
                >
                  <Mic className="w-3.5 h-3.5 text-[#C9B9E9]" />
                  <span>Assistant</span>
                </button>
              )}

              {/* Explore Quick Jump */}
              {onExploreClick && (
                <button
                  type="button"
                  onClick={handleExplore}
                  className="interactive-element min-h-[44px] px-3 py-2 rounded-full text-xs font-medium text-[#6F6870] dark:text-[#B5ADB7] hover:text-[#252126] dark:hover:text-[#FAF5F7] hover:bg-[#FFF4EC]/40 dark:hover:bg-[#1C1820] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Explore spaces</span>
                  <ArrowDown className="w-3 h-3 text-[#9C949B]" />
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Voice Settings Drawer / Modal */}
      <VoiceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
