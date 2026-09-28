/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  Minimize2,
  RefreshCw,
} from 'lucide-react';
import { Workspace, FilterCategory, ChatMessage, AssistantState } from '../../types';
import { useFavorites } from '../../context/FavoritesContext';
import { useSound } from '../../hooks/useSound';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import { SUGGESTED_QUESTIONS, generateAssistantResponse } from './assistantLogic';
import { AssistantMessageItem } from './AssistantMessageItem';
import { stopAllSpeech } from '../../lib/voiceCoordination';

interface DeskoraAssistantProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSelectWorkspace: (workspace: Workspace) => void;
  onApplyFilter: (filter: FilterCategory) => void;
  onApplySearch: (query: string) => void;
}

export function DeskoraAssistant({
  isOpen,
  onOpen,
  onClose,
  onSelectWorkspace,
  onApplyFilter,
  onApplySearch,
}: DeskoraAssistantProps) {
  const { isFavorite } = useFavorites();
  const { playSound } = useSound();
  const prefersReduced = usePrefersReducedMotion();

  const [inputMessage, setInputMessage] = useState('');
  const [assistantState, setAssistantState] = useState<AssistantState>('ready');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: "Hello! I'm the Deskora Assistant. I can help you find quiet nooks, check rent rates in INR, explore amenities, and discover workspaces across Hyderabad.",
      timestamp: new Date(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const responseTimerRef = useRef<number | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      stopAllSpeech();
      playSound('assistant_open');
      scrollToBottom();
    }
  }, [isOpen, playSound]);

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages, assistantState]);

  // Handle ESC key, mobile scroll lock, and timer cleanup on unmount
  useEffect(() => {
    return () => {
      if (responseTimerRef.current) {
        window.clearTimeout(responseTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const isMobile = window.innerWidth < 768;
    const originalOverflow = document.body.style.overflow;
    if (isMobile) {
      document.body.style.overflow = 'hidden';
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        playSound('modal_close');
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      if (isMobile) {
        document.body.style.overflow = originalOverflow;
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, playSound]);

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text) return;

    stopAllSpeech();
    playSound('button_press');

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setAssistantState('thinking');

    if (responseTimerRef.current) {
      window.clearTimeout(responseTimerRef.current);
    }

    // Simulate 350ms response generation
    responseTimerRef.current = window.setTimeout(() => {
      const resp = generateAssistantResponse(text, {
        isFavorite,
        onSelectWorkspace,
        onApplyFilter,
        onApplySearch,
      });

      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}-bot`,
        sender: 'assistant',
        text: resp.text,
        timestamp: new Date(),
        workspaceCards: resp.workspaceCards,
        suggestedAction: resp.suggestedAction,
      };

      setMessages((prev) => [...prev, botMsg]);
      setAssistantState('ready');
      playSound('assistant_message');
    }, 350);
  };

  const handleResetConversation = () => {
    playSound('button_press');
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        sender: 'assistant',
        text: "Conversation refreshed. Ask anything about our 5 curated workspaces in Hyderabad, daily pricing, or quiet spots!",
        timestamp: new Date(),
      },
    ]);
  };

  const handleCloseAssistant = () => {
    playSound('modal_close');
    onClose();
  };

  return (
    <>
      {/* Floating Assistant Launcher Button (Desktop & Mobile) */}
      {!isOpen && (
        <div
          id="deskora-assistant-launcher"
          data-cursor="chat"
          className="fixed z-40 bottom-20 md:bottom-7 right-4 md:right-7"
        >
          <button
            type="button"
            onClick={() => {
              stopAllSpeech();
              playSound('assistant_open');
              onOpen();
            }}
            aria-label="Open Deskora Assistant"
            className="group relative flex items-center gap-2.5 h-12 md:h-13 px-4 md:px-5 rounded-full bg-[#252126] dark:bg-[#1C1820] text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] active:scale-95 border border-white/10 dark:border-[#28212D] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[#EFA7B5]"
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5 text-[#F39A8C] transition-transform group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#34D399] border-2 border-[#252126] dark:border-[#1C1820]" />
            </div>
            <span className="text-xs md:text-sm font-semibold tracking-wide">
              Ask Deskora
            </span>
          </button>
        </div>
      )}

      {/* Floating Chat Window Modal / Mobile Bottom Sheet */}
      <AnimatePresence>
        {isOpen && (
          <div
            id="deskora-assistant-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Deskora AI Assistant"
            className="fixed inset-0 z-50 flex items-end md:items-end justify-center md:justify-end md:p-6 bg-black/40 md:bg-transparent backdrop-blur-xs md:backdrop-blur-none"
          >
            {/* Desktop backdrop dismiss click */}
            <div
              className="absolute inset-0 md:hidden"
              onClick={handleCloseAssistant}
              aria-hidden="true"
            />

            <motion.div
              initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.95 }}
              animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
              exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
              className="relative w-full md:w-[400px] h-[82vh] md:h-[580px] max-h-[640px] bg-white dark:bg-[#151218] rounded-t-[28px] md:rounded-[28px] border border-[#F0E8EA] dark:border-[#28212D] deskora-shadow-elevated flex flex-col overflow-hidden z-10 text-[#252126] dark:text-[#FAF5F7]"
            >
              {/* Header */}
              <div className="px-4 py-3.5 border-b border-[#F0E8EA] dark:border-[#28212D] bg-[#FFF8F6] dark:bg-[#1C1820] flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#FFF1F3] dark:bg-[#F39A8C]/15 border border-[#F6D8DF] dark:border-[#F39A8C]/25 flex items-center justify-center text-[#F39A8C]">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h3 className="font-bold text-xs text-[#252126] dark:text-[#FAF5F7]">
                        Deskora Assistant
                      </h3>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34D399]" />
                    </div>
                    <p className="text-[10px] text-[#6F6870] dark:text-[#B5ADB7]">
                      Workspace Intelligence
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={handleResetConversation}
                    aria-label="Reset conversation"
                    title="Reset conversation"
                    className="w-7 h-7 rounded-full text-[#6F6870] dark:text-[#B5ADB7] hover:text-[#252126] dark:hover:text-[#FAF5F7] hover:bg-[#FFF1F3] dark:hover:bg-[#28212D] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseAssistant}
                    aria-label="Minimize assistant"
                    className="w-7 h-7 rounded-full text-[#6F6870] dark:text-[#B5ADB7] hover:text-[#252126] dark:hover:text-[#FAF5F7] hover:bg-[#FFF1F3] dark:hover:bg-[#28212D] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Minimize2 className="w-3.5 h-3.5 hidden md:block" />
                    <X className="w-4 h-4 md:hidden" />
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FFFCFA]/60 dark:bg-[#120F15]">
                {messages.map((msg) => (
                  <AssistantMessageItem
                    key={msg.id}
                    message={msg}
                    onSelectWorkspace={onSelectWorkspace}
                  />
                ))}

                {/* Animated Typing Indicator */}
                {assistantState === 'thinking' && (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-white dark:bg-[#1C1820] border border-[#F0E8EA] dark:border-[#28212D] w-16">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F39A8C] animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F39A8C] animate-bounce [animation-delay:0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F39A8C] animate-bounce [animation-delay:0.3s]" />
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Quick Suggested Questions Bar */}
              <div className="p-2 border-t border-[#F0E8EA] dark:border-[#28212D] bg-[#FFF8F6]/80 dark:bg-[#1C1820]/90 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => handleSendMessage(q)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-white dark:bg-[#151218] border border-[#F5E6E9] dark:border-[#28212D] hover:border-[#F39A8C] dark:hover:border-[#F39A8C] text-[11px] font-medium text-[#6F6870] dark:text-[#B5ADB7] hover:text-[#252126] dark:hover:text-[#FAF5F7] transition-colors cursor-pointer shrink-0"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="p-3 border-t border-[#F0E8EA] dark:border-[#28212D] bg-white dark:bg-[#151218] flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Ask about price, quiet spaces, amenities…"
                  className="flex-1 px-3.5 py-2 rounded-full bg-[#FFF8F6] dark:bg-[#1C1820] border border-[#F0E8EA] dark:border-[#28212D] text-xs text-[#252126] dark:text-[#FAF5F7] placeholder-[#9C949B] dark:placeholder-[#7E7681] outline-none focus:border-[#F39A8C] transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputMessage.trim()}
                  aria-label="Send message"
                  className="w-8 h-8 rounded-full bg-[#252126] dark:bg-[#F39A8C] disabled:opacity-40 text-white dark:text-[#151218] flex items-center justify-center cursor-pointer transition-opacity"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
