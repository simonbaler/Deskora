/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, VolumeX, X, Sparkles, SlidersHorizontal, Square } from 'lucide-react';
import { useSound } from '../../hooks/useSound';
import { useVoice } from '../../hooks/useVoice';
import { useToast } from '../../context/ToastContext';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { FilterCategory } from '../../types';
import { VoiceSettingsModal } from './VoiceSettingsModal';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilter: (filter: FilterCategory) => void;
  onApplySearch: (query: string) => void;
}

export function VoiceAssistantModal({
  isOpen,
  onClose,
  onApplyFilter,
  onApplySearch,
}: VoiceAssistantModalProps) {
  const { isSoundEnabled, playSound } = useSound();
  const { isSpeaking, speak, stop, isSupported } = useVoice();
  const { showToast } = useToast();
  const prefersReduced = usePrefersReducedMotion();

  const [isListening, setIsListening] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [recognitionSupported, setRecognitionSupported] = useState(true);
  const [statusMessage, setStatusMessage] = useState('Tap Speak or select a voice prompt');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const recognitionRef = useRef<unknown>(null);
  const scrollTimerRef = useRef<number | null>(null);
  const responseTimerRef = useRef<number | null>(null);

  // Check Web Speech Recognition support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition;
      const supported = Boolean(SpeechRecognition);
      setRecognitionSupported(supported);
      if (!supported) {
        setStatusMessage("Microphone speech-to-text isn't supported in this browser. Try a quick prompt below.");
      }
    }
  }, []);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
      if (responseTimerRef.current) window.clearTimeout(responseTimerRef.current);
      stop();
      const rec = recognitionRef.current as { stop?: () => void; abort?: () => void } | null;
      try {
        rec?.abort?.();
      } catch {
        rec?.stop?.();
      }
    };
  }, [stop]);

  // Lock body scroll and handle ESC key
  useEffect(() => {
    if (!isOpen) return;

    playSound('modal_open');
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, playSound]);

  // Initial welcome greeting when modal opens if sound is enabled
  useEffect(() => {
    if (isOpen && isSoundEnabled && isSupported) {
      stop();
      // Gentle natural pause before speaking intro
      const timer = window.setTimeout(() => {
        speak("Hi! I'm here to help you find a space you'll love.");
      }, 250);
      return () => {
        window.clearTimeout(timer);
        stop();
      };
    }
    return () => {
      stop();
    };
  }, [isOpen, isSoundEnabled, isSupported, speak, stop]);

  const speakWithNaturalPause = (text: string) => {
    if (!isSoundEnabled || !isSupported) return;
    if (responseTimerRef.current) window.clearTimeout(responseTimerRef.current);
    // 200ms natural human breathing pause
    responseTimerRef.current = window.setTimeout(() => {
      speak(text);
    }, 200);
  };

  const scrollToWorkspaces = () => {
    if (scrollTimerRef.current) window.clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = window.setTimeout(() => {
      const el = document.getElementById('workspaces');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 380);
  };

  // Process and answer commands with clear, warm, polite phrasing
  const handleProcessCommand = (command: string) => {
    const text = command.toLowerCase().trim();
    setRecognizedText(command);
    playSound('button_press');

    if (text.includes('cheap') || text.includes('affordable') || text.includes('cost')) {
      onApplyFilter('All');
      onApplySearch('449');
      showToast('Found Velvet Study House (₹449/day)', 'success');
      setStatusMessage('The most affordable space is Velvet Study House, at ₹449 per day.');
      speakWithNaturalPause('The most affordable space is Velvet Study House, at four hundred and forty-nine rupees per day.');
      scrollToWorkspaces();
    } else if (text.includes('creative')) {
      onApplyFilter('Creative');
      onApplySearch('');
      showToast('Showing creative workspaces', 'success');
      setStatusMessage('Showing creative spaces in Jubilee Hills and Gachibowli.');
      speakWithNaturalPause('Of course. Here are the creative spaces.');
      scrollToWorkspaces();
    } else if (text.includes('quiet') || text.includes('silent') || text.includes('focus')) {
      onApplyFilter('Quiet');
      onApplySearch('');
      showToast('Showing quiet workspaces', 'success');
      setStatusMessage('Showing quiet workspaces designed for deep focus.');
      speakWithNaturalPause('Showing quiet workspaces designed for deep focus.');
      scrollToWorkspaces();
    } else if (text.includes('500') || text.includes('under 500') || text.includes('five hundred')) {
      onApplyFilter('All');
      onApplySearch('449');
      showToast('Showing spaces under ₹500', 'success');
      setStatusMessage('Showing spaces under ₹500: Velvet Study House and Sunlit Atelier.');
      speakWithNaturalPause('Here are the spaces under five hundred rupees.');
      scrollToWorkspaces();
    } else if (text.includes('saved') || text.includes('favorite')) {
      onApplyFilter('Saved');
      onApplySearch('');
      showToast('Displaying your saved workspaces', 'favorite');
      setStatusMessage('Showing your saved favorites list.');
      speakWithNaturalPause('Here are your saved spaces.');
      scrollToWorkspaces();
    } else if (text.includes('deskora') || text.includes('what is') || text.includes('about')) {
      setStatusMessage('Deskora helps you discover beautiful spaces for focused and productive days.');
      speakWithNaturalPause('Deskora helps you discover beautiful spaces for focused and productive days.');
    } else if (text.includes('help') || text.includes('options')) {
      setStatusMessage('You can ask to show creative, quiet, or affordable spaces under ₹500.');
      speakWithNaturalPause('You can ask to show creative, quiet, or affordable spaces under five hundred rupees.');
    } else {
      onApplySearch(command);
      showToast(`Searching for "${command}"`, 'info');
      setStatusMessage(`Found spaces matching "${command}".`);
      speakWithNaturalPause(`Showing spaces for ${command}.`);
      scrollToWorkspaces();
    }
  };

  // Toggle Web Speech Recognition
  const handleToggleListen = () => {
    if (isListening) {
      const rec = recognitionRef.current as { stop?: () => void } | null;
      rec?.stop?.();
      setIsListening(false);
      playSound('button_press');
      return;
    }

    if (typeof window === 'undefined') return;

    const SpeechRecognitionClass =
      (window as unknown as { SpeechRecognition?: new () => unknown }).SpeechRecognition ||
      (window as unknown as { webkitSpeechRecognition?: new () => unknown }).webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      setStatusMessage("Voice recognition isn't supported in this browser. Tap a prompt below.");
      return;
    }

    try {
      stop();
      playSound('voice_activate');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const recognition = new (SpeechRecognitionClass as any)();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setStatusMessage("I'm listening…");
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setStatusMessage('Got it.');
        playSound('voice_complete');
        // Small delay to let user see "Got it."
        setTimeout(() => {
          handleProcessCommand(transcript);
        }, 220);
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onerror = () => {
        setIsListening(false);
        setStatusMessage('Could not capture audio. Please choose a command below.');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setStatusMessage('Microphone access unavailable. Choose a quick command below.');
    }
  };

  const handleClose = () => {
    playSound('modal_close');
    if (isListening) {
      const rec = recognitionRef.current as { stop?: () => void } | null;
      rec?.stop?.();
      setIsListening(false);
    }
    stop();
    onClose();
  };

  const promptSuggestions = [
    "What's the cheapest workspace?",
    'Show me creative spaces',
    'Show me quiet workspaces',
    'Find spaces under 500',
    'Show my saved spaces',
    'What is Deskora?',
  ];

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="voice-assistant-title"
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
            />

            {/* Modal Container */}
            <motion.div
              initial={
                prefersReduced
                  ? { opacity: 0 }
                  : { y: '100%', opacity: 0.8, scale: 0.98 }
              }
              animate={
                prefersReduced
                  ? { opacity: 1 }
                  : { y: 0, opacity: 1, scale: 1 }
              }
              exit={
                prefersReduced
                  ? { opacity: 0 }
                  : { y: '100%', opacity: 0, scale: 0.98 }
              }
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="relative w-full sm:max-w-md bg-white dark:bg-[#151218] rounded-t-[32px] sm:rounded-[30px] border border-[#F0E8EA] dark:border-[#28212D] deskora-shadow-elevated z-10 p-6 sm:p-7 overflow-hidden text-center text-[#252126] dark:text-[#FAF5F7]"
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between pb-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1F3] dark:bg-[#F39A8C]/15 text-[11px] font-bold text-[#F39A8C] tracking-wider uppercase border border-[#F6D8DF] dark:border-[#F39A8C]/25">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Voice Companion</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    aria-label="Open voice settings"
                    title="Voice settings"
                    className="p-1.5 rounded-full text-[#6F6870] dark:text-[#B5ADB7] hover:text-[#252126] dark:hover:text-[#FAF5F7] hover:bg-[#FFF8F6] dark:hover:bg-[#1C1820] transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-[#F39A8C]" />
                  </button>

                  <span className="text-[11px] text-[#9C949B] dark:text-[#827A84] flex items-center gap-1">
                    {isSoundEnabled ? (
                      <Volume2 className="w-3.5 h-3.5 text-[#34D399]" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5 text-[#9C949B]" />
                    )}
                    {isSoundEnabled ? 'Audio On' : 'Muted'}
                  </span>

                  <button
                    type="button"
                    onClick={handleClose}
                    aria-label="Close voice assistant"
                    className="w-8 h-8 rounded-full bg-[#FFF8F6] dark:bg-[#1C1820] hover:bg-[#F0E8EA] dark:hover:bg-[#28212D] flex items-center justify-center text-[#6F6870] dark:text-[#B5ADB7] hover:text-[#252126] dark:hover:text-[#FAF5F7] transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Glowing Breathing Voice Orb */}
              <div className="py-6 flex flex-col items-center justify-center">
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={
                      isListening || isSpeaking
                        ? { scale: [1, 1.35, 1], opacity: [0.6, 0.2, 0.6] }
                        : { scale: [1, 1.12, 1], opacity: [0.35, 0.15, 0.35] }
                    }
                    transition={{
                      duration: isListening ? 1.4 : 2.6,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                    className="absolute w-28 h-28 rounded-full bg-gradient-to-tr from-[#F4A6B5] via-[#F7C3A3] to-[#CDBDEB] blur-md"
                  />

                  <button
                    type="button"
                    onClick={handleToggleListen}
                    aria-label={isListening ? 'Stop listening' : 'Start speaking command'}
                    className={`relative w-20 h-20 rounded-full flex flex-col items-center justify-center transition-all duration-300 cursor-pointer shadow-lg outline-none focus-visible:ring-4 focus-visible:ring-[#EFA7B5] ${
                      isListening
                        ? 'bg-gradient-to-br from-[#F39A8C] to-[#EFA7B5] text-white scale-105 shadow-[#F39A8C]/40'
                        : 'bg-gradient-to-br from-[#FFF1F3] via-white to-[#F6EEFA] dark:from-[#1C1820] dark:via-[#151218] dark:to-[#221B28] text-[#252126] dark:text-[#FAF5F7] border border-[#F6D8DF] dark:border-[#28212D] hover:border-[#F39A8C]'
                    }`}
                  >
                    {isListening ? (
                      <Mic className="w-8 h-8 animate-pulse text-white" />
                    ) : (
                      <Mic className="w-7 h-7 text-[#F39A8C]" />
                    )}

                    {/* Animated speech / listening bars */}
                    <div className="flex items-center gap-1 mt-1">
                      {[1, 2, 3, 4].map((bar) => (
                        <motion.span
                          key={bar}
                          animate={
                            isListening || isSpeaking
                              ? { height: [3, 10, 3] }
                              : { height: 3 }
                          }
                          transition={{
                            duration: 0.45,
                            repeat: Infinity,
                            delay: bar * 0.1,
                          }}
                          className={`w-1 rounded-full ${
                            isListening ? 'bg-white' : 'bg-[#F39A8C]/70'
                          }`}
                        />
                      ))}
                    </div>
                  </button>
                </div>

                <div className="mt-5">
                  <h3
                    id="voice-assistant-title"
                    className="text-xl sm:text-2xl font-extrabold text-[#252126] dark:text-[#FAF5F7] tracking-tight"
                  >
                    "Hi! Welcome to Deskora."
                  </h3>
                  <p className="text-sm text-[#6F6870] dark:text-[#B5ADB7] mt-1 font-normal">
                    Let's find a space you'll love.
                  </p>
                </div>

                <div className="mt-4 px-4 py-2 rounded-2xl bg-[#FFF8F6] dark:bg-[#1C1820] border border-[#F5E6E9] dark:border-[#28212D] text-xs font-medium text-[#252126] dark:text-[#FAF5F7] max-w-sm">
                  {isListening ? (
                    <span className="flex items-center justify-center gap-1.5 text-[#F39A8C]">
                      <span className="w-2 h-2 rounded-full bg-[#F39A8C] animate-ping" />
                      I'm listening…
                    </span>
                  ) : isSpeaking ? (
                    <span className="flex items-center justify-center gap-1.5 text-[#F39A8C]">
                      <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                      Speaking response…
                    </span>
                  ) : (
                    statusMessage
                  )}
                </div>

                {recognizedText && (
                  <p className="text-[11px] text-[#9C949B] dark:text-[#827A84] mt-2 italic">
                    Recognized: "{recognizedText}"
                  </p>
                )}
              </div>

              {/* Quick Voice Command Chips */}
              <div className="text-left mt-1 pt-3.5 border-t border-[#F0E8EA] dark:border-[#28212D]">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#9C949B] dark:text-[#827A84]">
                    {recognitionSupported ? 'Or tap a voice prompt:' : 'Supported commands:'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    className="text-[11px] text-[#F39A8C] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3 h-3" />
                    <span>Voice settings</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {promptSuggestions.map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => handleProcessCommand(cmd)}
                      className="px-3 py-1.5 rounded-full bg-[#FFF8F6] dark:bg-[#1C1820] hover:bg-[#FFF0F2] dark:hover:bg-[#28212D] text-[#252126] dark:text-[#FAF5F7] hover:text-[#F39A8C] dark:hover:text-[#F39A8C] border border-[#F5E6E9] dark:border-[#28212D] hover:border-[#F39A8C]/40 text-xs font-medium transition-colors cursor-pointer active:scale-95 text-left"
                    >
                      "{cmd}"
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 flex items-center justify-between gap-3 pt-3 border-t border-[#F0E8EA] dark:border-[#28212D]">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-1/2 min-h-[44px] py-2.5 rounded-full bg-[#FFF8F6] dark:bg-[#1C1820] text-[#6F6870] dark:text-[#B5ADB7] text-xs font-bold hover:bg-[#F0E8EA] dark:hover:bg-[#28212D] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5]"
                >
                  Cancel
                </button>

                {isSpeaking ? (
                  <button
                    type="button"
                    onClick={() => stop()}
                    className="w-1/2 min-h-[44px] py-2.5 rounded-full bg-[#FFF1F3] dark:bg-[#F39A8C]/20 text-[#F39A8C] border border-[#F39A8C]/40 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5]"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Stop Speech</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleToggleListen}
                    className="w-1/2 min-h-[44px] py-2.5 rounded-full bg-gradient-to-r from-[#F4A6B5] via-[#F39A8C] to-[#CDBDEB] text-[#252126] text-xs font-bold deskora-shadow-sm hover:deskora-shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5 outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5]"
                  >
                    {isListening ? (
                      <>
                        <MicOff className="w-4 h-4" />
                        <span>Stop</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>Speak</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Voice Settings Submodal */}
      <VoiceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
