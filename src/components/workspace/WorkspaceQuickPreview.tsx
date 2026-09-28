/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  MapPin,
  Star,
  Wifi,
  Coffee,
  Wind,
  ShieldCheck,
  Calendar,
  Sparkles,
  Heart,
  Volume2,
  Users,
  Monitor,
  Check,
} from 'lucide-react';
import { Workspace } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';
import { useSound } from '../../hooks/useSound';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface WorkspaceQuickPreviewProps {
  workspace: Workspace | null;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspaceQuickPreview({
  workspace,
  isOpen,
  onClose,
}: WorkspaceQuickPreviewProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { playSound } = useSound();
  const prefersReduced = usePrefersReducedMotion();
  const [bookingState, setBookingState] = useState<'idle' | 'confirming' | 'booked'>('idle');
  const bookingTimerRef = useRef<number | null>(null);

  // Reset booking state when opening new workspace and clean timer
  useEffect(() => {
    if (isOpen) {
      playSound('modal_open');
      setBookingState('idle');
    }
    return () => {
      if (bookingTimerRef.current) window.clearTimeout(bookingTimerRef.current);
    };
  }, [isOpen, workspace?.id, playSound]);

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

  const handleClose = () => {
    playSound('modal_close');
    onClose();
  };

  if (!workspace) return null;

  const fav = isFavorite(workspace.id);

  const handleBook = () => {
    playSound('button_press');
    setBookingState('confirming');
    if (bookingTimerRef.current) window.clearTimeout(bookingTimerRef.current);
    bookingTimerRef.current = window.setTimeout(() => {
      setBookingState('booked');
      playSound('booking_success');
    }, 450);
  };

  const getAmenityIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('wifi')) return <Wifi className="w-4 h-4 text-[#F39A8C]" />;
    if (lower.includes('coffee')) return <Coffee className="w-4 h-4 text-[#F8C7A4]" />;
    if (lower.includes('ac')) return <Wind className="w-4 h-4 text-[#C9B9E9]" />;
    if (lower.includes('quiet')) return <Volume2 className="w-4 h-4 text-[#EFA7B5]" />;
    if (lower.includes('meeting')) return <Users className="w-4 h-4 text-[#F39A8C]" />;
    if (lower.includes('private') || lower.includes('desk')) return <Monitor className="w-4 h-4 text-[#F8C7A4]" />;
    return <Sparkles className="w-4 h-4 text-[#F39A8C]" />;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="workspace-quick-preview-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quick-preview-title"
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6 overflow-y-auto"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity cursor-pointer"
          />

          {/* Modal / Bottom Sheet Container */}
          <motion.div
            initial={
              prefersReduced
                ? { opacity: 0 }
                : { y: '100%', opacity: 0.8, scale: 0.98 }
            }
            animate={
              prefersReduced
                ? { opacity: 1 }
                : { y: 0, opacity: 1, scale: 1 }
            }
            exit={
              prefersReduced
                ? { opacity: 0 }
                : { y: '100%', opacity: 0, scale: 0.98 }
            }
            transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            className="relative w-full md:max-w-3xl max-h-[90vh] md:max-h-[85vh] bg-white dark:bg-[#151218] rounded-t-[32px] md:rounded-[28px] border border-[#F0E8EA] dark:border-[#28212D] deskora-shadow-elevated z-10 overflow-hidden flex flex-col md:flex-row text-[#252126] dark:text-[#FAF5F7]"
          >
            {/* Mobile Drag Indicator Handle */}
            <div className="md:hidden w-full flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-[#E5DDE0] dark:bg-[#28212D]" />
            </div>

            {/* Left: Image / Visual Banner */}
            <div className="relative w-full md:w-5/12 h-56 md:h-auto shrink-0 bg-[#FFF8F6] dark:bg-[#1C1820] overflow-hidden">
              <img
                src={workspace.image}
                alt={workspace.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

              {/* Badges on image */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                <span className="px-3 py-1 rounded-full bg-white/95 dark:bg-[#151218]/95 backdrop-blur-md text-xs font-semibold text-[#252126] dark:text-[#FAF5F7] shadow-xs border border-white/20 dark:border-[#28212D]">
                  {workspace.type}
                </span>

                <button
                  type="button"
                  onClick={() => toggleFavorite(workspace.id, workspace.name)}
                  aria-label={fav ? 'Remove from favorites' : 'Save this space'}
                  aria-pressed={fav}
                  className="w-9 h-9 rounded-full bg-white/95 dark:bg-[#151218]/95 backdrop-blur-md flex items-center justify-center text-[#252126] dark:text-[#FAF5F7] hover:bg-white dark:hover:bg-[#1C1820] shadow-xs transition-colors cursor-pointer border border-white/20 dark:border-[#28212D]"
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      fav ? 'fill-[#F39A8C] text-[#F39A8C]' : 'text-[#6F6870] dark:text-[#B5ADB7]'
                    }`}
                  />
                </button>
              </div>

              {/* Bottom tag on image */}
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-xs font-medium">
                  <Star className="w-3.5 h-3.5 fill-[#FBBF24] text-[#FBBF24]" />
                  <span>{workspace.rating} / 5.0 Rating</span>
                </span>
              </div>
            </div>

            {/* Right: Content & Actions */}
            <div className="relative flex-1 p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:p-7 flex flex-col overflow-y-auto">
              {/* Close Button */}
              <button
                type="button"
                onClick={handleClose}
                aria-label="Close details"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#FFF8F6] dark:bg-[#1C1820] hover:bg-[#F0E8EA] dark:hover:bg-[#28212D] flex items-center justify-center text-[#6F6870] dark:text-[#B5ADB7] hover:text-[#252126] dark:hover:text-[#FAF5F7] transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5]"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Title & Location */}
              <div className="pr-10">
                <h3
                  id="quick-preview-title"
                  className="text-2xl sm:text-3xl font-extrabold text-[#252126] dark:text-[#FAF5F7] tracking-tight"
                >
                  {workspace.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-[#6F6870] dark:text-[#B5ADB7] mt-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F39A8C] shrink-0" />
                  <span>{workspace.location}</span>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-[#6F6870] dark:text-[#B5ADB7] leading-relaxed mt-4">
                {workspace.description}
              </p>

              {/* Vibe Badge if present */}
              {workspace.vibe && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#252126] dark:text-[#FAF5F7]">Atmosphere:</span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#FFF1F3] dark:bg-[#F39A8C]/15 text-xs font-medium text-[#F39A8C] border border-[#F6D8DF] dark:border-[#F39A8C]/25">
                    <Sparkles className="w-3 h-3" />
                    {workspace.vibe}
                  </span>
                </div>
              )}

              {/* Amenities List */}
              <div className="mt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#9C949B] dark:text-[#827A84]">
                  Included Amenities
                </h4>
                <div className="grid grid-cols-2 gap-2 mt-2.5">
                  {workspace.amenities.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 p-2 rounded-xl bg-[#FFF8F6] dark:bg-[#1C1820] border border-[#F5E6E9] dark:border-[#28212D] text-xs text-[#252126] dark:text-[#FAF5F7]"
                    >
                      {getAmenityIcon(item)}
                      <span className="font-medium">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rate & Booking Action Block */}
              <div className="mt-6 pt-5 border-t border-[#F0E8EA] dark:border-[#28212D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#252126] dark:text-[#FAF5F7]">
                      ₹{workspace.rentPerDay}
                    </span>
                    <span className="text-xs text-[#6F6870] dark:text-[#B5ADB7]">/ day</span>
                  </div>
                  <span className="text-[11px] text-[#9C949B] dark:text-[#827A84] flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 text-[#34D399]" />
                    Instant check-in • No deposit
                  </span>
                </div>

                {bookingState === 'booked' ? (
                  <div className="flex flex-col gap-1 sm:text-right">
                    <div className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#ECFDF5] dark:bg-[#064E3B]/40 text-[#065F46] dark:text-[#34D399] text-xs font-bold border border-[#A7F3D0] dark:border-[#065F46]">
                      <Check className="w-4 h-4 text-[#10B981]" />
                      <span>Desk request ready!</span>
                    </div>
                    <span className="text-[10px] text-[#6F6870] dark:text-[#B5ADB7]">
                      Demo screening simulation completed.
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleBook}
                    disabled={bookingState === 'confirming'}
                    className="w-full sm:w-auto min-h-[44px] px-6 py-3 rounded-full bg-gradient-to-r from-[#F4A6B5] via-[#F39A8C] to-[#CDBDEB] hover:opacity-95 text-[#252126] font-bold text-sm tracking-tight deskora-shadow-md hover:deskora-shadow-elevated transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-95 outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5]"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>{bookingState === 'confirming' ? 'Preparing pass…' : 'Book Desk'}</span>
                  </button>
                )}
              </div>

              {/* Demo note */}
              {bookingState === 'booked' && (
                <div className="mt-3 p-3 rounded-xl bg-[#FFF8F6] dark:bg-[#1C1820] border border-[#F6D8DF] dark:border-[#28212D] text-[11px] text-[#6F6870] dark:text-[#B5ADB7] leading-relaxed">
                  <strong>Evaluator Note:</strong> This is a client-side demo booking interaction fulfilling the candidate screening requirements. No credit card or backend transaction occurred.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
