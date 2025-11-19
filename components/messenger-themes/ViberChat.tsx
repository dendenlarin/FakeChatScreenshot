"use client";

import Image from "next/image";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { StatusBar } from "@/components/StatusBar";
import { Send, Phone, Video, MoreVertical, Check } from "lucide-react";

interface ViberChatProps {
  contactName: string;
  contactAvatar?: string;
  messages: Message[];
}

export function ViberChat({ contactName, contactAvatar, messages }: ViberChatProps) {
  // Высота кадра телефона
  const height = 620;

  return (
    <div
      className="bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      style={{
        width: '390px',
        height: `${height}px`,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}
    >
      {/* Status Bar */}
      <StatusBar />
      {/* Header */}
      <div className="bg-[#665cac] px-4 py-2.5 flex items-center gap-3 shadow-sm">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#665cac] font-semibold text-sm shadow-sm">
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
          <div className="text-white font-medium text-[16px] truncate">{contactName}</div>
          <div className="text-xs text-purple-100 flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
            <span>online</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Phone className="w-5 h-5 text-white/90" strokeWidth={2} />
          <Video className="w-5 h-5 text-white/90" strokeWidth={2} />
          <MoreVertical className="w-5 h-5 text-white/90" strokeWidth={2} />
        </div>
      </div>

      {/* Messages */}
      <div
        className="p-3 space-y-1.5 flex-1 overflow-y-auto"
        style={{
          background: "linear-gradient(to bottom, #f4f1fb 0%, #fdfbff 100%)",
          backgroundImage:
            "radial-gradient(circle at 2px 2px, rgba(102,92,172,0.08) 1.5px, transparent 0), radial-gradient(circle at 14px 10px, rgba(102,92,172,0.05) 1.2px, transparent 0)",
          backgroundSize: "20px 20px",
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
                "max-w-[75%] rounded-[18px] px-3 py-2 shadow-sm",
                message.sender === "user"
                  ? "bg-[#665cac] text-white rounded-br-sm"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
              )}
            >
              <div className="text-[15px] leading-[1.35] whitespace-pre-wrap break-words">{message.text}</div>
              {message.timestamp && (
                <div className={cn(
                  "text-[11px] mt-0.5 flex items-center gap-1",
                  message.sender === "user" ? "text-purple-100 justify-end" : "text-gray-500"
                )}>
                  <span>{message.timestamp}</span>
                  {message.sender === "user" && (
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="bg-white border-t border-gray-200 px-3 py-2 flex items-center gap-2">
        <div className="flex-1 bg-[#f7f7f8] rounded-[20px] px-4 py-2.5 text-[15px] text-gray-500 border border-gray-200">
          Message
        </div>
        <button
          className="bg-[#665cac] hover:bg-[#5a4f9a] text-white p-2.5 rounded-full shadow-md transition-all"
          aria-label="Отправить сообщение"
          type="button"
        >
          <Send className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
