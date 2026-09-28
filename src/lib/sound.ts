/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { SoundEffectType } from '../types';

const STORAGE_KEY = 'deskora_sound_enabled';

class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = false;
  private isVoiceSpeaking: boolean = false;

  constructor() {
    this.enabled = this.getInitialState();
  }

  public setVoiceActive(active: boolean) {
    this.isVoiceSpeaking = active;
  }

  public isVoiceActive(): boolean {
    return this.isVoiceSpeaking;
  }

  private getInitialState(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      // Default to OFF as mandated
      return saved === 'true';
    } catch {
      return false;
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, val ? 'true' : 'false');
      } catch {
        // storage fallback
      }
    }
    if (val && !this.ctx) {
      this.initContext();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private initContext() {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    } catch {
      this.ctx = null;
    }
  }

  public play(type: SoundEffectType) {
    // Sound remains OFF by default and completely silent when disabled
    if (!this.enabled) return;

    // Suppress mundane UI clicks/hovers when voice is actively speaking to keep voice crisp and dominant
    if (this.isVoiceSpeaking && (type === 'click' || type === 'button_press' || type === 'button_hover')) {
      return;
    }

    if (!this.ctx) {
      this.initContext();
    }

    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }

    try {
      const now = this.ctx.currentTime;
      const ctx = this.ctx;

      switch (type) {
        case 'app_open': {
          // Very soft cinematic warm startup chord (A3 - E4)
          const freqs = [220, 329.63];
          freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(800, now);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now);

            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.02, now + 0.12 + i * 0.04);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now);
            osc.stop(now + 0.58);
          });
          break;
        }

        case 'loader_complete': {
          // Subtle warm confirmation chime (C5 -> E5)
          const notes = [523.25, 659.25];
          notes.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const start = now + idx * 0.08;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.025, start);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(start);
            osc.stop(start + 0.3);
          });
          break;
        }

        case 'click':
        case 'button_press': {
          // Soft tactile click / droplet (45ms)
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(760, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

          gain.gain.setValueAtTime(0.03, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }

        case 'button_hover': {
          // Extremely subtle micro-tick
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(840, now);

          gain.gain.setValueAtTime(0.008, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.018);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.02);
          break;
        }

        case 'favorite': {
          // Gentle warm rising chime (E5 -> G#5)
          const tones = [659.25, 830.61];
          tones.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = now + idx * 0.07;
            const duration = 0.22;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.03, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
          });
          break;
        }

        case 'favorite_remove': {
          // Softer reverse tone (G#5 -> E5)
          const tones = [830.61, 659.25];
          tones.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = now + idx * 0.06;
            const duration = 0.18;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.02, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
          });
          break;
        }

        case 'filter_select': {
          // Subtle UI tap
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(420, now + 0.04);

          gain.gain.setValueAtTime(0.025, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.05);
          break;
        }

        case 'search': {
          // Subtle interaction sound
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(580, now);
          osc.frequency.exponentialRampToValueAtTime(720, now + 0.06);

          gain.gain.setValueAtTime(0.018, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case 'modal_open': {
          // Soft cinematic opening transition (F4 -> A4 -> C5)
          const chord = [349.23, 440, 523.25];
          chord.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = now + idx * 0.04;
            const duration = 0.26;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, startTime);

            gain.gain.setValueAtTime(0.02, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
          });
          break;
        }

        case 'modal_close': {
          // Soft reverse transition
          const chord = [523.25, 440, 349.23];
          chord.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = now + idx * 0.035;
            const duration = 0.2;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, startTime);

            gain.gain.setValueAtTime(0.015, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
          });
          break;
        }

        case 'assistant_open': {
          // Soft digital/warm tone
          const tones = [587.33, 880];
          tones.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const start = now + idx * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, start);

            gain.gain.setValueAtTime(0.022, start);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.16);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(start);
            osc.stop(start + 0.18);
          });
          break;
        }

        case 'assistant_message': {
          // Subtle warm response tone
          const tones = [440, 554.37];
          tones.forEach((f, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const start = now + idx * 0.05;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, start);

            gain.gain.setValueAtTime(0.02, start);
            gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.18);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(start);
            osc.stop(start + 0.2);
          });
          break;
        }

        case 'voice_activate': {
          // Soft rising tone
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(380, now);
          osc.frequency.exponentialRampToValueAtTime(680, now + 0.18);

          gain.gain.setValueAtTime(0.025, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.22);
          break;
        }

        case 'voice_complete': {
          // Soft confirmation tone
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'triangle';
          osc.frequency.setValueAtTime(680, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.16);

          gain.gain.setValueAtTime(0.025, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case 'theme_change': {
          // Subtle atmospheric shimmer (dual harmonic sweep)
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();

          osc1.type = 'sine';
          osc2.type = 'sine';

          osc1.frequency.setValueAtTime(440, now);
          osc1.frequency.exponentialRampToValueAtTime(660, now + 0.15);

          osc2.frequency.setValueAtTime(660, now);
          osc2.frequency.exponentialRampToValueAtTime(880, now + 0.15);

          gain.gain.setValueAtTime(0.018, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(ctx.destination);

          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.22);
          osc2.stop(now + 0.22);
          break;
        }

        case 'booking_success':
        case 'success': {
          // Elegant positive chime (C5 - E5 - G5)
          const chord = [523.25, 659.25, 783.99];
          chord.forEach((freq, idx) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = now + idx * 0.05;
            const duration = 0.32;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);

            gain.gain.setValueAtTime(0.024, startTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(startTime);
            osc.stop(startTime + duration);
          });
          break;
        }
      }
    } catch {
      // safe audio catch
    }
  }
}

export const soundManager = new SoundManager();
