/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Sparkles, Sliders, Check } from 'lucide-react';
import { useVoice } from '../../hooks/useVoice';
import { useSound } from '../../hooks/useSound';
import { VoiceSpeedPreset } from '../../types';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceSettingsModal({ isOpen, onClose }: VoiceSettingsModalProps) {
  const {
    selectedVoice,
    availableVoices,
    speedPreset,
    setSpeedPreset,
    selectVoice,
    previewVoice,
    isSpeaking,
    stop,
    isSupported,
  } = useVoice();
  const { playSound } = useSound();

  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playSound('modal_close');
        stop();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, playSound, stop]);

  const handleSpeedChange = (preset: VoiceSpeedPreset) => {
    playSound('button_press');
    setSpeedPreset(preset);
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const chosen = availableVoices.find((v) => v.name === e.target.value);
    if (chosen) {
      playSound('filter_select');
      selectVoice(chosen);
    }
  };

  const handlePreview = () => {
    if (isSpeaking) {
      playSound('button_press');
      stop();
    } else {
      playSound('voice_activate');
      previewVoice();
    }
  };

  const speedOptions: { id: VoiceSpeedPreset; label: string; desc: string }[] = [
    { id: 'gentle', label: 'Gentle', desc: '0.88x • Relaxed' },
    { id: 'natural', label: 'Natural', desc: '0.94x • Balanced' },
    { id: 'fast', label: 'Fast', desc: '1.05x • Brisk' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="voice-settings-title"
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {
              playSound('modal_close');
              stop();
              onClose();
            }}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 24, opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', damping: 28, stiffness: 340 }}
            className="relative w-full sm:max-w-md bg-white dark:bg-[#151218] rounded-t-[30px] sm:rounded-[26px] border border-[#F0E8EA] dark:border-[#28212D] deskora-shadow-elevated z-10 p-5 sm:p-6 text-[#252126] dark:text-[#FAF5F7]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#F0E8EA] dark:border-[#28212D]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FFF1F3] dark:bg-[#F39A8C]/15 flex items-center justify-center text-[#F39A8C]">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3
                    id="voice-settings-title"
                    className="text-base font-bold text-[#252126] dark:text-[#FAF5F7] tracking-tight flex items-center gap-1.5"
                  >
                    Voice Settings
                  </h3>
                  <p className="text-[11px] text-[#9C949B] dark:text-[#827A84]">
                    Natural browser speech customization
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  playSound('modal_close');
                  stop();
                  onClose();
                }}
                aria-label="Close voice settings"
                className="w-8 h-8 rounded-full bg-[#FFF8F6] dark:bg-[#1C1820] hover:bg-[#F0E8EA] dark:hover:bg-[#28212D] flex items-center justify-center text-[#6F6870] dark:text-[#B5ADB7] hover:text-[#252126] dark:hover:text-[#FAF5F7] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!isSupported ? (
              <div className="py-6 text-center text-xs text-[#6F6870] dark:text-[#B5ADB7]">
                Speech synthesis is not supported on this browser or device.
              </div>
            ) : (
              <div className="py-4 space-y-5">
                {/* Voice Selection */}
                <div>
                  <label
                    htmlFor="voice-select-dropdown"
                    className="block text-xs font-bold uppercase tracking-wider text-[#9C949B] dark:text-[#827A84] mb-1.5"
                  >
                    Selected Voice
                  </label>
                  {availableVoices.length > 0 ? (
                    <div className="relative">
                      <select
                        id="voice-select-dropdown"
                        value={selectedVoice?.name || ''}
                        onChange={handleVoiceChange}
                        className="w-full text-xs font-semibold py-2.5 px-3 rounded-xl bg-[#FFF8F6] dark:bg-[#1C1820] border border-[#F0E8EA] dark:border-[#28212D] text-[#252126] dark:text-[#FAF5F7] outline-none focus:ring-2 focus:ring-[#F39A8C] cursor-pointer appearance-none truncate"
                      >
                        {availableVoices.map((v) => (
                          <option key={v.name} value={v.name}>
                            {v.name} ({v.lang})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#9C949B]">
                        ▼
                      </div>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-[#FFF8F6] dark:bg-[#1C1820] border border-[#F0E8EA] dark:border-[#28212D] text-xs text-[#6F6870] dark:text-[#B5ADB7]">
                      {selectedVoice ? selectedVoice.name : 'System default voice'}
                    </div>
                  )}
                  <p className="text-[11px] text-[#9C949B] dark:text-[#827A84] mt-1 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#F39A8C]" />
                    <span>Auto-selected for clarity, warmth, and natural pacing.</span>
                  </p>
                </div>

                {/* Speed Presets */}
                <div>
                  <span className="block text-xs font-bold uppercase tracking-wider text-[#9C949B] dark:text-[#827A84] mb-1.5">
                    Speaking Speed
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {speedOptions.map((opt) => {
                      const isActive = speedPreset === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSpeedChange(opt.id)}
                          className={`min-h-[44px] px-2.5 py-2 rounded-xl text-center transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#F39A8C] ${
                            isActive
                              ? 'bg-gradient-to-r from-[#252126] to-[#352F37] dark:from-[#FAF5F7] dark:to-white text-white dark:text-[#151218] shadow-xs'
                              : 'bg-[#FFF8F6] dark:bg-[#1C1820] text-[#6F6870] dark:text-[#B5ADB7] border border-[#F0E8EA] dark:border-[#28212D] hover:text-[#252126] dark:hover:text-[#FAF5F7]'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-1 text-xs font-bold">
                            {isActive && <Check className="w-3 h-3 text-[#F39A8C]" />}
                            <span>{opt.label}</span>
                          </div>
                          <span className="text-[10px] opacity-75 block mt-0.5">
                            {opt.desc}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Voice Preview Box */}
                <div className="p-3.5 rounded-2xl bg-[#FFF8F6] dark:bg-[#1C1820] border border-[#F6D8DF] dark:border-[#28212D] flex flex-col gap-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#252126] dark:text-[#FAF5F7]">
                      Sample Sentence:
                    </span>
                    <span className="text-[10px] text-[#9C949B] dark:text-[#827A84]">
                      Audition voice
                    </span>
                  </div>
                  <p className="text-xs italic text-[#6F6870] dark:text-[#B5ADB7] leading-relaxed">
                    "Hi, I'm Deskora. Let's find a space you'll love."
                  </p>

                  <button
                    type="button"
                    onClick={handlePreview}
                    className="interactive-element w-full min-h-[44px] mt-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#F4A6B5] via-[#F39A8C] to-[#CDBDEB] text-[#252126] font-bold text-xs tracking-tight deskora-shadow-sm hover:deskora-shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-98"
                  >
                    <Volume2 className="w-4 h-4" />
                    <span>{isSpeaking ? 'Stop preview' : 'Preview voice'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-3 border-t border-[#F0E8EA] dark:border-[#28212D] flex justify-end">
              <button
                type="button"
                onClick={() => {
                  playSound('modal_close');
                  stop();
                  onClose();
                }}
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-full bg-[#252126] dark:bg-[#FAF5F7] text-white dark:text-[#151218] text-xs font-bold hover:bg-[#3D373F] dark:hover:bg-white transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
