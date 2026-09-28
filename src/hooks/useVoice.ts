/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import {
  voiceController,
  VoiceStateSnapshot,
} from '../lib/voiceController';
import { VoiceSpeedPreset } from '../types';

export function useVoice() {
  const [snapshot, setSnapshot] = useState<VoiceStateSnapshot>(() =>
    voiceController.getSnapshot()
  );

  useEffect(() => {
    return voiceController.subscribe((newSnapshot) => {
      setSnapshot(newSnapshot);
    });
  }, []);

  const setSpeedPreset = useCallback((preset: VoiceSpeedPreset) => {
    voiceController.setSpeedPreset(preset);
  }, []);

  const selectVoice = useCallback((voice: SpeechSynthesisVoice) => {
    voiceController.selectVoice(voice);
  }, []);

  const speak = useCallback(
    (
      text: string,
      options?: {
        onStart?: () => void;
        onEnd?: () => void;
        onError?: (err: unknown) => void;
        isWelcome?: boolean;
      }
    ) => {
      return voiceController.speak(text, options);
    },
    []
  );

  const speakWelcome = useCallback(
    (options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
    }) => {
      return voiceController.speakWelcome(options);
    },
    []
  );

  const previewVoice = useCallback(
    (options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
    }) => {
      return voiceController.previewVoice(options);
    },
    []
  );

  const stop = useCallback(() => {
    voiceController.stop();
  }, []);

  return {
    isSpeaking: snapshot.isSpeaking,
    isSupported: snapshot.isSupported,
    selectedVoice: snapshot.selectedVoice,
    availableVoices: snapshot.availableVoices,
    voicesLoaded: snapshot.voicesLoaded,
    speedPreset: snapshot.speedPreset,
    rate: snapshot.rate,
    pitch: snapshot.pitch,
    volume: snapshot.volume,
    hasSpokenWelcome: snapshot.hasSpokenWelcome,
    setSpeedPreset,
    selectVoice,
    speak,
    speakWelcome,
    previewVoice,
    stop,
  };
}
