/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MapPin, Sparkles } from 'lucide-react';
import { ChatMessage, Workspace } from '../../types';

interface AssistantMessageItemProps {
  message: ChatMessage;
  onSelectWorkspace: (workspace: Workspace) => void;
}

export function AssistantMessageItem({
  message,
  onSelectWorkspace,
}: AssistantMessageItemProps) {
  const isUser = message.sender === 'user';

  return (
    <div
      className={`flex flex-col text-xs ${
        isUser ? 'items-end' : 'items-start'
      }`}
    >
      <div
        className={`max-w-[85%] rounded-[18px] px-3.5 py-2.5 leading-relaxed ${
          isUser
            ? 'bg-[#252126] dark:bg-[#FAF5F7] text-white dark:text-[#151218] rounded-br-xs font-medium'
            : 'bg-white dark:bg-[#1C1820] text-[#252126] dark:text-[#FAF5F7] border border-[#F0E8EA] dark:border-[#28212D] deskora-shadow-sm rounded-bl-xs'
        }`}
      >
        <p className="whitespace-pre-line">{message.text}</p>
      </div>

      {/* Interactive Workspace Card inside chat */}
      {message.workspaceCards && message.workspaceCards.length > 0 && (
        <div className="mt-2 space-y-2 w-full max-w-[90%]">
          {message.workspaceCards.map((ws) => (
            <div
              key={ws.id}
              className="flex items-center gap-2.5 p-2 rounded-2xl bg-white dark:bg-[#1C1820] border border-[#F0E8EA] dark:border-[#28212D] deskora-shadow-sm"
            >
              <img
                src={ws.image}
                alt={ws.name}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-[#252126] dark:text-[#FAF5F7] text-xs truncate">
                  {ws.name}
                </h4>
                <p className="text-[10px] text-[#6F6870] dark:text-[#B5ADB7] flex items-center gap-1 truncate">
                  <MapPin className="w-2.5 h-2.5 text-[#F39A8C] shrink-0" />
                  {ws.location}
                </p>
                <p className="text-[11px] font-extrabold text-[#252126] dark:text-[#FAF5F7] mt-0.5">
                  ₹{ws.rentPerDay}
                  <span className="text-[9px] font-normal text-[#9C949B] dark:text-[#7E7681]">/day</span>
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectWorkspace(ws)}
                aria-label={`View ${ws.name}`}
                className="px-2.5 py-1.5 rounded-full bg-[#FFF1F3] dark:bg-[#F39A8C]/15 hover:bg-[#252126] dark:hover:bg-[#F39A8C] text-[#252126] dark:text-[#FAF5F7] hover:text-white dark:hover:text-[#151218] text-[10px] font-bold transition-colors cursor-pointer shrink-0"
              >
                View
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Suggested Action button if provided */}
      {message.suggestedAction && (
        <button
          type="button"
          onClick={message.suggestedAction.onClick}
          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF1F3] dark:bg-[#F39A8C]/15 border border-[#F6D8DF] dark:border-[#F39A8C]/30 text-xs font-semibold text-[#F39A8C] hover:bg-[#F39A8C] hover:text-white transition-colors cursor-pointer"
        >
          <Sparkles className="w-3 h-3" />
          <span>{message.suggestedAction.label}</span>
        </button>
      )}

      <span className="text-[9px] text-[#9C949B] dark:text-[#7E7681] mt-1 px-1">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </span>
    </div>
  );
}
