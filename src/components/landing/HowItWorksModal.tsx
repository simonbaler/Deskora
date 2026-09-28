/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Sparkles, Coffee, ShieldCheck } from 'lucide-react';
import { useSound } from '../../hooks/useSound';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowItWorksModal({ isOpen, onClose }: HowItWorksModalProps) {
  const { playSound } = useSound();

  const handleClose = () => {
    playSound('modal_close');
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      playSound('modal_open');
    }
  }, [isOpen, playSound]);

  // Body scroll lock and ESC key handling
  useEffect(() => {
    if (!isOpen) return;

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
  }, [isOpen]);

  const steps = [
    {
      icon: <Search className="w-5 h-5 text-[#F39A8C]" />,
      title: '1. Discover Your Vibe',
      desc: 'Browse handpicked workspaces filtered by natural light, quiet levels, ergonomic setups, and amenities.',
    },
    {
      icon: <Sparkles className="w-5 h-5 text-[#C9B9E9]" />,
      title: '2. Reserve In Seconds',
      desc: 'Lock in a dedicated desk or peaceful nook for the day at transparent rates with zero hidden membership fees.',
    },
    {
      icon: <Coffee className="w-5 h-5 text-[#F8C7A4]" />,
      title: '3. Arrive & Create',
      desc: 'Tap your digital day pass, plug into gigabit fiber, pour fresh roast coffee, and do your best work.',
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="how-it-works-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
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
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: 'spring', stiffness: 400, damping: 28 }}
            className="relative w-full max-w-lg rounded-[28px] bg-white dark:bg-[#151218] p-6 sm:p-8 border border-[#F0E8EA] dark:border-[#28212D] deskora-shadow-elevated z-10 text-[#252126] dark:text-[#FAF5F7]"
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={handleClose}
              aria-label="Close dialog"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FFF8F6] dark:bg-[#1C1820] hover:bg-[#F0E8EA] dark:hover:bg-[#28212D] flex items-center justify-center text-[#6F6870] dark:text-[#B5ADB7] hover:text-[#252126] dark:hover:text-[#FAF5F7] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5]"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Content */}
            <div className="text-center sm:text-left">
              <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF1F3] dark:bg-[#F39A8C]/15 border border-[#F6D8DF] dark:border-[#F39A8C]/25 text-[11px] font-bold text-[#252126] dark:text-[#FAF5F7] tracking-wider uppercase mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F39A8C]" />
                <span>Simple & Human</span>
              </div>
              <h3 id="how-it-works-title" className="text-2xl font-bold text-[#252126] dark:text-[#FAF5F7] tracking-tight">
                How Deskora Works
              </h3>
              <p className="text-sm text-[#6F6870] dark:text-[#B5ADB7] mt-1">
                Your sanctuary for productive, quiet, and inspiring workdays.
              </p>
            </div>

            {/* Steps List */}
            <div className="mt-6 space-y-4">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#FFF8F6] dark:bg-[#1C1820] border border-[#F0E8EA] dark:border-[#28212D]"
                >
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#151218] border border-transparent dark:border-[#28212D] flex items-center justify-center shrink-0 shadow-2xs">
                    {step.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#252126] dark:text-[#FAF5F7]">{step.title}</h4>
                    <p className="text-xs text-[#6F6870] dark:text-[#B5ADB7] leading-relaxed mt-0.5">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Dismiss */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto min-h-[44px] px-6 py-2.5 rounded-full bg-[#252126] dark:bg-[#FAF5F7] text-white dark:text-[#151218] text-xs font-semibold hover:bg-[#3D373F] dark:hover:bg-white transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5]"
              >
                Got it, let's explore
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
