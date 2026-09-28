/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VoiceSpeedPreset, VoiceProfile } from '../types';
import { soundManager } from './sound';

const SESSION_WELCOME_KEY = 'deskora_welcome_spoken_session';
const PREFERRED_VOICE_KEY = 'deskora_preferred_voice_name';
const SPEED_PRESET_KEY = 'deskora_voice_speed_preset';

export const SPEED_RATES: Record<VoiceSpeedPreset, number> = {
  gentle: 0.88,
  natural: 0.94,
  fast: 1.05,
};

// Known low-quality or novelty robotic voices to strictly exclude
const EXCLUDED_VOICE_NAMES = [
  'albert',
  'bad news',
  'bahh',
  'bells',
  'boing',
  'bubbles',
  'cellos',
  'deranged',
  'fred',
  'good news',
  'hysterical',
  'jester',
  'organ',
  'pipe organ',
  'trinoids',
  'whisper',
  'zarvox',
  'ralph',
  'junior',
  'kathy',
  'princess',
];

export interface VoiceControllerListener {
  (state: VoiceStateSnapshot): void;
}

export interface VoiceStateSnapshot {
  isSpeaking: boolean;
  isSupported: boolean;
  selectedVoice: SpeechSynthesisVoice | null;
  availableVoices: SpeechSynthesisVoice[];
  voicesLoaded: boolean;
  speedPreset: VoiceSpeedPreset;
  rate: number;
  pitch: number;
  volume: number;
  hasSpokenWelcome: boolean;
}

class VoiceController {
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private voicesLoaded: boolean = false;
  private speedPreset: VoiceSpeedPreset = 'natural';
  private pitch: number = 1.12; // Warm, cute, youthful, gentle lift
  private volume: number = 0.92;
  private listeners: Set<VoiceControllerListener> = new Set();
  private sessionSpokenMemory: boolean = false;

  constructor() {
    this.speedPreset = this.loadSavedSpeedPreset();
    this.sessionSpokenMemory = this.checkSessionWelcomeStorage();

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.initVoices();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => {
          this.initVoices();
        };
      }
      window.addEventListener('voiceschanged', () => {
        this.initVoices();
      });
    }
  }

  private checkSessionWelcomeStorage(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return window.sessionStorage.getItem(SESSION_WELCOME_KEY) === 'true';
    } catch {
      return false;
    }
  }

  private loadSavedSpeedPreset(): VoiceSpeedPreset {
    if (typeof window === 'undefined') return 'natural';
    try {
      const saved = window.localStorage.getItem(SPEED_PRESET_KEY) as VoiceSpeedPreset | null;
      if (saved && (saved === 'gentle' || saved === 'natural' || saved === 'fast')) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'natural';
  }

  private loadSavedVoicePreference(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return window.localStorage.getItem(PREFERRED_VOICE_KEY);
    } catch {
      return null;
    }
  }

  private notify() {
    const snapshot = this.getSnapshot();
    this.listeners.forEach((listener) => {
      try {
        listener(snapshot);
      } catch (err) {
        console.error('VoiceController listener error:', err);
      }
    });
  }

  public subscribe(listener: VoiceControllerListener): () => void {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getSnapshot(): VoiceStateSnapshot {
    return {
      isSpeaking: this.isSpeaking,
      isSupported: typeof window !== 'undefined' && 'speechSynthesis' in window,
      selectedVoice: this.selectedVoice,
      availableVoices: this.availableVoices,
      voicesLoaded: this.voicesLoaded,
      speedPreset: this.speedPreset,
      rate: SPEED_RATES[this.speedPreset],
      pitch: this.pitch,
      volume: this.volume,
      hasSpokenWelcome: this.sessionSpokenMemory,
    };
  }

  /**
   * Initializes and scores available browser speech synthesis voices.
   */
  public initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      const rawVoices = window.speechSynthesis.getVoices() || [];
      if (rawVoices.length === 0) {
        this.voicesLoaded = false;
        return;
      }

      // Filter to English and remove known novelty/robotic voices
      const filtered = rawVoices.filter((v) => {
        const nameLower = v.name.toLowerCase();
        const isExcluded = EXCLUDED_VOICE_NAMES.some((bad) => nameLower.includes(bad));
        if (isExcluded) return false;
        return v.lang.toLowerCase().startsWith('en');
      });

      this.availableVoices = filtered.length > 0 ? filtered : rawVoices;
      this.voicesLoaded = true;

      // Check if user has a saved preference that matches
      const savedName = this.loadSavedVoicePreference();
      if (savedName) {
        const found = this.availableVoices.find((v) => v.name === savedName);
        if (found) {
          this.selectedVoice = found;
          this.notify();
          return;
        }
      }

      // Automatically select best voice with smart scoring strategy
      this.selectedVoice = this.pickBestVoice(this.availableVoices);
      this.notify();
    } catch {
      // safe fallback
    }
  }

  /**
   * Smart Voice Selection Scoring Strategy:
   * Prioritizes clear, natural, female-presenting, warm voices.
   * High preference for en-IN (Indian English) or clear neural/natural voices.
   */
  private pickBestVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
    if (voices.length === 0) return null;

    let bestScore = -999;
    let bestVoice: SpeechSynthesisVoice = voices[0];

    for (const v of voices) {
      let score = 0;
      const name = v.name.toLowerCase();
      const lang = v.lang.toLowerCase();

      // 1. Natural / Online / Neural indicator (+60)
      if (
        name.includes('natural') ||
        name.includes('online') ||
        name.includes('neural') ||
        name.includes('enhanced') ||
        name.includes('premium')
      ) {
        score += 60;
      }

      // 2. Indian English voice bonus (+45) - Deskora target audience includes Indian users
      if (
        lang === 'en-in' ||
        name.includes('india') ||
        name.includes('indian') ||
        name.includes('neerja') ||
        name.includes('heera') ||
        name.includes('veena') ||
        name.includes('kavya') ||
        name.includes('rishi')
      ) {
        score += 45;
      }

      // 3. Renowned natural female-presenting voices (+35)
      const pleasantFemaleNames = [
        'samantha',
        'karen',
        'serena',
        'victoria',
        'moira',
        'fiona',
        'tessa',
        'zira',
        'hazel',
        'jenny',
        'ava',
        'allison',
        'susan',
        'zoe',
        'sonia',
        'libby',
        'google uk english female',
        'google us english',
      ];
      if (pleasantFemaleNames.some((n) => name.includes(n))) {
        score += 35;
      }

      // 4. Female descriptor
      if (name.includes('female')) {
        score += 20;
      }

      // 5. Clean English locales
      if (lang.startsWith('en-in')) {
        score += 25;
      } else if (lang.startsWith('en-us')) {
        score += 20;
      } else if (lang.startsWith('en-gb')) {
        score += 20;
      } else if (lang.startsWith('en-au')) {
        score += 18;
      } else if (lang.startsWith('en')) {
        score += 10;
      }

      // 6. Default or local system voice
      if (v.default) score += 12;
      if (v.localService) score += 8;

      if (score > bestScore) {
        bestScore = score;
        bestVoice = v;
      }
    }

    return bestVoice;
  }

  public selectVoice(voice: SpeechSynthesisVoice) {
    this.selectedVoice = voice;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(PREFERRED_VOICE_KEY, voice.name);
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  public setSpeedPreset(preset: VoiceSpeedPreset) {
    this.speedPreset = preset;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(SPEED_PRESET_KEY, preset);
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  public hasSpokenWelcomeThisSession(): boolean {
    return this.sessionSpokenMemory || this.checkSessionWelcomeStorage();
  }

  public markWelcomeSpoken() {
    this.sessionSpokenMemory = true;
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.setItem(SESSION_WELCOME_KEY, 'true');
      } catch {
        // ignore
      }
    }
    this.notify();
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    soundManager.setVoiceActive(false);
    this.notify();
  }

  /**
   * Translates prices and symbols to clean, natural spoken phrases.
   * e.g. "₹449" -> "four hundred and forty-nine rupees"
   */
  public formatSpokenText(raw: string): string {
    return raw
      .replace(/₹449/g, 'four hundred and forty-nine rupees')
      .replace(/₹499/g, 'four hundred and ninety-nine rupees')
      .replace(/₹549/g, 'five hundred and forty-nine rupees')
      .replace(/₹699/g, 'six hundred and ninety-nine rupees')
      .replace(/₹799/g, 'seven hundred and ninety-nine rupees')
      .replace(/₹500/g, 'five hundred rupees')
      .replace(/₹(\d+)/g, '$1 rupees')
      .replace(/•/g, ', ')
      .replace(/[*_#`~]/g, '')
      .trim();
  }

  /**
   * Speaks a sentence with coordinated audio, speed preset, and error handling.
   */
  public speak(
    text: string,
    options?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: unknown) => void;
      isWelcome?: boolean;
    }
  ): boolean {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      options?.onError?.(new Error('SpeechSynthesis not supported'));
      return false;
    }

    try {
      this.stop();

      const spokenText = this.formatSpokenText(text);
      const utterance = new SpeechSynthesisUtterance(spokenText);

      // Apply preferred speech characteristics:
      // Rate: approximately 0.88 - 1.05 (default 0.94)
      // Pitch: approximately 1.12 (warm, youthful, cute, gentle)
      // Volume: approximately 0.92
      utterance.rate = SPEED_RATES[this.speedPreset];
      utterance.pitch = this.pitch;
      utterance.volume = this.volume;

      if (this.selectedVoice) {
        utterance.voice = this.selectedVoice;
      }

      utterance.onstart = () => {
        this.isSpeaking = true;
        soundManager.setVoiceActive(true);
        if (options?.isWelcome) {
          this.markWelcomeSpoken();
        }
        this.notify();
        options?.onStart?.();
      };

      utterance.onend = () => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        soundManager.setVoiceActive(false);

        // Optional subtle completion chime if sound is enabled
        if (soundManager.isEnabled()) {
          soundManager.play('voice_complete');
        }

        this.notify();
        options?.onEnd?.();
      };

      utterance.onerror = (e) => {
        this.isSpeaking = false;
        this.currentUtterance = null;
        soundManager.setVoiceActive(false);
        this.notify();
        options?.onError?.(e);
      };

      this.currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      this.isSpeaking = false;
      this.currentUtterance = null;
      soundManager.setVoiceActive(false);
      this.notify();
      options?.onError?.(error);
      return false;
    }
  }

  /**
   * Spoken welcome script: concise, clear, natural, warm.
   */
  public speakWelcome(options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  }): boolean {
    const welcomeScript = "Hi! Welcome to Deskora. Let's find a space you'll love.";
    return this.speak(welcomeScript, {
      ...options,
      isWelcome: true,
    });
  }

  /**
   * Spoken voice preview for settings modal:
   * "Hi, I'm Deskora. Let's find a space you'll love."
   */
  public previewVoice(options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
  }): boolean {
    const previewScript = "Hi, I'm Deskora. Let's find a space you'll love.";
    return this.speak(previewScript, options);
  }
}

// Global Singleton Export
export const voiceController = new VoiceController();
