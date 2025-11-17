"use client";

import Image from "next/image";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { StatusBar } from "@/components/StatusBar";
import { Send } from "lucide-react";

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
      className="bg-[#0F1419] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      style={{ width: '390px', height: `${height}px` }}
    >
      {/* Status Bar */}
      <StatusBar />
      {/* Header */}
      <div className="bg-[#212121] px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
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
        <div className="flex-1">
          <div className="text-white font-medium">{contactName}</div>
          <div className="text-xs text-gray-400">online</div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="bg-[#0F1419] p-4 space-y-2 flex-1 overflow-y-auto"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0), radial-gradient(circle at 3px 3px, rgba(255,255,255,0.03) 1px, transparent 0)",
          backgroundSize: "14px 14px",
        }}
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.sender === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-3 py-2",
                message.sender === "user"
                  ? "bg-[#8774E1] text-white rounded-br-md"
                  : "bg-[#212121] text-white rounded-bl-md"
              )}
            >
              <div className="text-sm whitespace-pre-wrap break-words">{message.text}</div>
              {message.timestamp && (
                <div className={cn(
                  "text-[10px] mt-1",
                  message.sender === "user" ? "text-blue-100" : "text-gray-400"
                )}>
                  {message.timestamp}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="bg-[#212121] px-4 py-3 flex items-center gap-2">
        <div className="flex-1 bg-[#181818] rounded-full px-4 py-2 text-sm text-gray-400">
          Message
        </div>
        <button
          className="bg-[#8774E1] hover:bg-[#6d5bd4] text-white p-3 rounded-full shadow-md transition"
          aria-label="Отправить сообщение"
          type="button"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
