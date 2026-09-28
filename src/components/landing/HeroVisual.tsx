/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Coffee, Wifi, Star, Sparkles, MapPin } from 'lucide-react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

export function HeroVisual() {
  const prefersReduced = usePrefersReducedMotion();
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX(-y * 0.03);
    setRotateY(x * 0.03);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      id="hero-visual-stage"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-w-[440px] mx-auto lg:max-w-[480px] select-none perspective-[1200px]"
    >
      {/* Ambient gradient glow behind the composition */}
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-[#F4A6B5]/25 via-[#F7C3A3]/20 to-[#CDBDEB]/25 blur-2xl opacity-70" />

      {/* Main Perspective Workspace Showcase Card */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="relative rounded-[26px] bg-white p-3 sm:p-3.5 border border-[#F0E8EA] deskora-shadow-elevated overflow-hidden"
      >
        {/* Workspace Photo Frame */}
        <div className="relative aspect-[4/3] w-full rounded-[20px] overflow-hidden bg-[#FFF8F6]">
          <img
            src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1000&q=80"
            alt="Warm sunlit architectural workspace with clean desk, laptop, plants, and natural light"
            className="w-full h-full object-cover object-center transform transition-transform duration-700 hover:scale-103"
            referrerPolicy="no-referrer"
            loading="eager"
          />

          {/* Warm cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-semibold text-[#252126] shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#F39A8C]" />
              Featured Sanctuary
            </span>
          </div>

          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-semibold text-white shadow-xs flex items-center gap-1">
              <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
              4.9
            </span>
          </div>

          {/* Bottom Card Preview Text in Photo */}
          <div className="absolute bottom-3 left-3 right-3 text-white">
            <div className="flex items-center gap-1 text-[11px] text-white/80 font-medium">
              <MapPin className="w-3 h-3 text-[#F7C3A3]" />
              Jubilee Hills, Hyderabad
            </div>
            <div className="flex items-center justify-between mt-0.5">
              <h3 className="text-base font-bold font-sans tracking-tight text-white drop-shadow-xs">
                The Sunlit Atelier
              </h3>
              <div className="text-right">
                <span className="text-sm font-extrabold text-white">₹499</span>
                <span className="text-[11px] text-white/80"> / day</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card Sub-Features Bar */}
        <div className="pt-3 px-1 pb-1 flex items-center justify-between text-xs text-[#6F6870]">
          <div className="flex items-center gap-1.5 font-medium">
            <Wifi className="w-3.5 h-3.5 text-[#F39A8C]" />
            <span>Fiber 850 Mbps</span>
          </div>
          <div className="h-3 w-px bg-[#F0E8EA]" />
          <div className="flex items-center gap-1.5 font-medium">
            <Coffee className="w-3.5 h-3.5 text-[#F39A8C]" />
            <span>Specialty Roasts</span>
          </div>
          <div className="h-3 w-px bg-[#F0E8EA]" />
          <span className="text-[11px] font-semibold text-[#252126] bg-[#FFF4EC] px-2 py-0.5 rounded-full">
            Quiet Nooks
          </span>
        </div>
      </motion.div>

      {/* Floating Accent Capsule: "Quiet Atmosphere" */}
      <motion.div
        animate={prefersReduced ? {} : { y: [-3, 3, -3] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -bottom-4 left-1 sm:-left-5 rounded-2xl bg-white/95 backdrop-blur-md p-2.5 sm:p-3 border border-[#F0E8EA] deskora-shadow-md flex items-center gap-2.5 z-20"
      >
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FFF1F3] to-[#FFF4EC] flex items-center justify-center text-[#F39A8C]">
          <Coffee className="w-4 h-4" />
        </div>
        <div>
          <p className="text-[10px] text-[#9C949B] uppercase tracking-wider font-semibold">
            Atmosphere
          </p>
          <p className="text-xs font-bold text-[#252126]">Warm & Inspiring</p>
        </div>
      </motion.div>

      {/* Floating Focus Rating Chip */}
      <motion.div
        animate={prefersReduced ? {} : { y: [3, -3, 3] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        className="absolute -top-3 right-1 sm:-right-4 rounded-2xl bg-white/95 backdrop-blur-md px-3 py-2 border border-[#F0E8EA] deskora-shadow-md flex items-center gap-2 z-20"
      >
        <div className="w-2 h-2 rounded-full bg-[#34D399] animate-pulse" />
        <span className="text-xs font-bold text-[#252126]">5 Workspaces Available</span>
      </motion.div>
    </div>
  );
}
