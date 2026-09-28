/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { ArrowRight, Sparkles, Compass } from 'lucide-react';
import { Button } from '../ui/Button';
import { MagneticButton } from '../ui/MagneticButton';
import { HeroVisual } from './HeroVisual';
import { ScrollIndicator } from './ScrollIndicator';
import { VoiceWelcomeOrb } from '../voice/VoiceWelcomeOrb';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface HeroProps {
  onExploreSpaces: () => void;
  onHowItWorks: () => void;
  onVoiceClick?: () => void;
}

export function Hero({ onExploreSpaces, onHowItWorks, onVoiceClick }: HeroProps) {
  const prefersReduced = usePrefersReducedMotion();

  const headlineMotion = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 24 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.1, duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
      };

  const supportMotion = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
      };

  const ctaMotion = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, y: 14, scale: 0.97 },
        animate: { opacity: 1, y: 0, scale: 1 },
        transition: { delay: 0.26, duration: 0.45, ease: [0.16, 1, 0.3, 1] as const },
      };

  const visualMotion = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        transition: { delay: 0.16, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
      };

  return (
    <section
      id="hero-section"
      className="relative w-full pt-8 pb-12 sm:pt-12 sm:pb-18 lg:pt-14 lg:pb-20 overflow-hidden"
    >
      {/* Background ambient radial glow */}
      <div className="pointer-events-none absolute inset-0 radial-glow-hero" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Typography & CTAs (mobile-first, priority reading) */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* Eyebrow badge */}
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.05 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1F3] dark:bg-[#F39A8C]/15 border border-[#F6D8DF] dark:border-[#F39A8C]/30 text-[11px] font-bold text-[#252126] dark:text-[#FAF5F7] tracking-widest uppercase mb-5"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F39A8C]" />
              <span>Work • Focus • Create</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              {...headlineMotion}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#252126] dark:text-[#FAF5F7] leading-[1.08] max-w-xl"
            >
              Find a{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-[#F4A6B5] via-[#F39A8C] to-[#B79FE4] bg-clip-text text-transparent">
                  space
                </span>
              </span>{' '}
              you'll{' '}
              <span className="font-serif-romantic italic font-semibold text-[#F39A8C] underline decoration-[#F4A6B5]/40 decoration-wavy decoration-1 underline-offset-6">
                love.
              </span>
            </motion.h1>

            {/* Supporting Text */}
            <motion.p
              {...supportMotion}
              className="mt-4 sm:mt-5 text-base sm:text-lg text-[#6F6870] dark:text-[#B5ADB7] font-normal leading-relaxed max-w-lg"
            >
              Beautiful workspaces designed for focused days, creative moments, and better work.
              Browse quiet nooks, sunlit studios, and boutique lofts.
            </motion.p>

            {/* CTAs */}
            <motion.div
              {...ctaMotion}
              className="mt-7 sm:mt-8 flex flex-col sm:flex-row items-center gap-3.5 w-full sm:w-auto"
            >
              {/* Primary CTA */}
              <MagneticButton maxDistance={8} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="primary"
                  onClick={onExploreSpaces}
                  icon={<ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  Explore spaces
                </Button>
              </MagneticButton>

              {/* Secondary CTA */}
              <Button
                size="lg"
                variant="ghost"
                onClick={onHowItWorks}
                icon={<Compass className="w-4 h-4 text-[#F39A8C]" />}
                iconPosition="left"
                className="w-full sm:w-auto text-[#6F6870] dark:text-[#B5ADB7] hover:text-[#252126] dark:hover:text-[#FAF5F7]"
              >
                See how it works
              </Button>
            </motion.div>

            {/* Micro-trust indicators */}
            <motion.div
              initial={prefersReduced ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.5 }}
              className="mt-8 pt-6 border-t border-[#F0E8EA] dark:border-[#28212D] w-full max-w-md flex items-center justify-center lg:justify-start gap-6 text-xs text-[#6F6870] dark:text-[#B5ADB7]"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#EFA7B5]" />
                <span>Zero membership fees</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#C9B9E9]" />
                <span>Instant day access</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Hero Workspace Visual */}
          <motion.div
            {...visualMotion}
            className="lg:col-span-5 w-full flex items-center justify-center"
          >
            <HeroVisual />
          </motion.div>
        </div>

        {/* Dedicated "Welcome to Deskora" Voice Orb experience */}
        <div className="mt-10 sm:mt-14 w-full flex justify-center">
          <VoiceWelcomeOrb
            onExploreClick={onExploreSpaces}
            onOpenVoiceAssistant={onVoiceClick}
          />
        </div>

        {/* Scroll Indicator */}
        <div className="mt-10 sm:mt-12 flex justify-center">
          <ScrollIndicator onClick={onExploreSpaces} label="Explore 5 Workspaces" />
        </div>
      </div>
    </section>
  );
}
