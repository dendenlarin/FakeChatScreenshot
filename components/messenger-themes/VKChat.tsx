"use client";

import Image from "next/image";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { StatusBar } from "@/components/StatusBar";
import { Send, Phone, MoreVertical, Search } from "lucide-react";

interface VKChatProps {
  contactName: string;
  contactAvatar?: string;
  messages: Message[];
}

export function VKChat({ contactName, contactAvatar, messages }: VKChatProps) {
  // Высота кадра телефона
  const height = 620;

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      style={{
        width: '390px',
        height: `${height}px`,
        fontFamily: '-apple-system, BlinkMacSystemFont, Roboto, "Helvetica Neue", Arial, sans-serif'
      }}
    >
      {/* Status Bar */}
      <StatusBar />
      {/* Header */}
      <div className="bg-[#5181b8] px-4 py-2.5 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5181b8] font-semibold text-sm shadow-sm relative">
          {contactAvatar ? (
            <Image
              src={contactAvatar}
              alt={contactName}
              width={40}
              height={40}
              className="w-full h-full rounded-full object-cover"
              unoptimized
            />
          ) : (
            contactName.charAt(0).toUpperCase()
          )}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-[#4bb34b] border-2 border-white rounded-full"></span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium text-[16px] truncate">{contactName}</div>
          <div className="text-xs text-blue-100">online</div>
        </div>
        <div className="flex items-center gap-4">
          <Phone className="w-5 h-5 text-white/90" strokeWidth={2} />
          <MoreVertical className="w-5 h-5 text-white/90" strokeWidth={2} />
        </div>
      </div>

      {/* Messages */}
      <div
        className="bg-white p-3 space-y-2 flex-1 overflow-y-auto"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(81,129,184,0.06) 1px, transparent 0), radial-gradient(circle at 12px 10px, rgba(81,129,184,0.04) 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex items-end gap-2",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            {message.sender === "contact" && (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5181b8] to-[#4573a5] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0 shadow-sm">
                {contactAvatar ? (
                  <Image
                    src={contactAvatar}
                    alt={contactName}
                    width={32}
                    height={32}
                    className="w-full h-full rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  contactName.charAt(0).toUpperCase()
                )}
              </div>
            )}
            <div
              className={cn(
                "max-w-[70%] rounded-[18px] px-3 py-2 shadow-sm",
                message.sender === "user"
                  ? "bg-[#5181b8] text-white rounded-br-md"
                  : "bg-[#edeef0] text-gray-900 rounded-bl-md"
              )}
            >
              <div className="text-[15px] leading-[1.35] whitespace-pre-wrap break-words">{message.text}</div>
              {message.timestamp && (
                <div className={cn(
                  "text-[11px] mt-0.5",
                  message.sender === "user" ? "text-blue-100" : "text-gray-500"
                )}>
                  {message.timestamp}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-[#e7e8ec] px-3 py-2 flex items-center gap-2">
        <div className="flex-1 bg-[#f0f2f5] rounded-[20px] px-4 py-2.5 text-[15px] text-gray-500 border border-[#e7e8ec]">
          Написать сообщение...
        </div>
        <button
          className="bg-[#5181b8] hover:bg-[#4573a5] text-white p-2.5 rounded-full shadow-md transition-all"
          aria-label="Отправить сообщение"
          type="button"
        >
          <Send className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
