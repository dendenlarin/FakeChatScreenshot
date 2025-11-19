"use client";

import Image from "next/image";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { StatusBar } from "@/components/StatusBar";
import { Send, Phone, Video, MoreVertical, Check, CheckCheck } from "lucide-react";

interface TelegramChatProps {
  contactName: string;
  contactAvatar?: string;
  messages: Message[];
}

export function TelegramChat({ contactName, contactAvatar, messages }: TelegramChatProps) {
  // Высота кадра для экспортируемого телефона
  const height = 620;

  return (
    <div
      className="bg-[#0e1621] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      style={{
        width: '390px',
        height: `${height}px`,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}
    >
      {/* Status Bar */}
      <StatusBar />
      {/* Header */}
      <div className="bg-[#17212b] px-4 py-2.5 flex items-center gap-3 border-b border-[#0e1621]">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5288c1] to-[#3a72a8] flex items-center justify-center text-white font-semibold text-sm relative">
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
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium text-[15px] truncate">{contactName}</div>
          <div className="text-xs text-[#7e8b99] flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-[#3bc063] rounded-full"></span>
            <span>online</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="w-5 h-5 text-[#8d97a3]" strokeWidth={2} />
          <MoreVertical className="w-5 h-5 text-[#8d97a3]" strokeWidth={2} />
        </div>
      </div>

      {/* Messages */}
      <div
        className="bg-[#0e1621] p-4 space-y-1.5 flex-1 overflow-y-auto"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23182533' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      >
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[75%] rounded-xl px-3 py-2 shadow-sm",
                message.sender === "user"
                  ? "bg-[#5288c1] text-white rounded-br-none"
                  : "bg-[#182533] text-white rounded-bl-none"
              )}
            >
              <div className="text-[15px] leading-[1.3] whitespace-pre-wrap break-words">{message.text}</div>
              {message.timestamp && (
                <div className={cn(
                  "text-[11px] mt-0.5 flex items-center justify-end gap-1",
                  message.sender === "user" ? "text-white/70" : "text-[#7e8b99]"
                )}>
                  <span>{message.timestamp}</span>
                  {message.sender === "user" && (
                    <CheckCheck className="w-3.5 h-3.5" strokeWidth={2.5} />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="bg-[#17212b] px-3 py-2 flex items-center gap-2 border-t border-[#0e1621]">
        <div className="flex-1 bg-[#0e1621] rounded-[20px] px-4 py-2.5 text-[15px] text-[#7e8b99] border border-[#182533]">
          Message
        </div>
        <button
          className="bg-[#5288c1] hover:bg-[#4a7ab0] text-white p-2.5 rounded-full shadow-lg transition-all"
          aria-label="Отправить сообщение"
          type="button"
        >
          <Send className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
