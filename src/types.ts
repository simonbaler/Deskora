/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Workspace {
  id: string;
  name: string;
  location: string;
  rentPerDay: number;
  rating: number;
  type: string;
  image: string;
  description: string;
  amenities: string[];
  vibe?: string;
  features?: string[];
  capacity?: string;
}

export type SoundEffectType =
  | 'click'
  | 'favorite'
  | 'favorite_remove'
  | 'success'
  | 'booking_success'
  | 'app_open'
  | 'loader_complete'
  | 'button_press'
  | 'button_hover'
  | 'filter_select'
  | 'search'
  | 'modal_open'
  | 'modal_close'
  | 'assistant_open'
  | 'assistant_message'
  | 'voice_activate'
  | 'voice_complete'
  | 'theme_change';

export interface SoundContextType {
  isSoundEnabled: boolean;
  toggleSound: () => void;
  playSound: (type: SoundEffectType) => void;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: 'light' | 'dark';
  themeMode: ThemeMode;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
}

export type FilterCategory = 'All' | 'Quiet' | 'Creative' | 'Premium' | 'Saved';

export interface ToastItem {
  id: string;
  message: string;
  type?: 'info' | 'success' | 'favorite';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
  workspaceCards?: Workspace[];
  suggestedAction?: {
    label: string;
    onClick: () => void;
  };
}

export type AssistantState =
  | 'idle'
  | 'listening'
  | 'thinking'
  | 'responding'
  | 'speaking'
  | 'ready';

export type VoiceSpeedPreset = 'gentle' | 'natural' | 'fast';

export interface VoiceProfile {
  voice: SpeechSynthesisVoice | null;
  speedPreset: VoiceSpeedPreset;
  rate: number;
  pitch: number;
  volume: number;
}

export type VoiceWelcomeState =
  | 'idle'
  | 'preparing'
  | 'ready'
  | 'speaking'
  | 'listening'
  | 'error'
  | 'unsupported';
