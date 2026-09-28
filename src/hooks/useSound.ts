/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { soundManager } from '../lib/sound';
import { SoundEffectType } from '../types';

export function useSound() {
  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => soundManager.isEnabled());

  const toggleSound = useCallback(() => {
    const next = !soundManager.isEnabled();
    soundManager.setEnabled(next);
    setIsSoundEnabled(next);
    if (next) {
      soundManager.play('click');
    }
  }, []);

  const playSound = useCallback((type: SoundEffectType) => {
    soundManager.play(type);
  }, []);

  return { isSoundEnabled, toggleSound, playSound };
}
