/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { voiceController } from './voiceController';

export function hasSessionSpoken(): boolean {
  return voiceController.hasSpokenWelcomeThisSession();
}

export function markSessionSpoken(): void {
  voiceController.markWelcomeSpoken();
}

export function stopAllSpeech(): void {
  voiceController.stop();
}

export function speakUtterance(
  text: string,
  options?: {
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: unknown) => void;
    rate?: number;
    pitch?: number;
  }
): boolean {
  return voiceController.speak(text, options);
}
