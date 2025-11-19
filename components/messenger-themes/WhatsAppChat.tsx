"use client";

import Image from "next/image";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { StatusBar } from "@/components/StatusBar";
import { Send, Phone, Video, MoreVertical, Check, CheckCheck, Smile, Paperclip, Mic } from "lucide-react";

interface WhatsAppChatProps {
  contactName: string;
  contactAvatar?: string;
  messages: Message[];
}

export function WhatsAppChat({ contactName, contactAvatar, messages }: WhatsAppChatProps) {
  // Высота кадра телефона
  const height = 620;

  return (
    <div
      className="bg-[#0b141a] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      style={{
        width: '390px',
        height: `${height}px`,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      }}
    >
      {/* Status Bar */}
      <StatusBar />
      {/* Header */}
      <div className="bg-[#202c33] px-4 py-2.5 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#667781] flex items-center justify-center text-white font-medium text-sm">
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
          <div className="text-xs text-[#8696a0]">online</div>
        </div>
        <div className="flex items-center gap-5">
          <Video className="w-5 h-5 text-[#aebac1]" strokeWidth={2} />
          <Phone className="w-5 h-5 text-[#aebac1]" strokeWidth={2} />
          <MoreVertical className="w-5 h-5 text-[#aebac1]" strokeWidth={2} />
        </div>
      </div>

      {/* Messages */}
      <div
        className="p-3 space-y-1 flex-1 overflow-y-auto"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z\' fill=\'%23182229\' fill-opacity=\'0.08\' fill-rule=\'evenodd\'/%3E%3C/svg%3E")',
          backgroundSize: "200px 200px",
          backgroundColor: "#0b141a"
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
                "max-w-[75%] rounded-md px-2.5 py-1.5 shadow-sm relative",
                message.sender === "user"
                  ? "bg-[#005c4b] text-white rounded-tr-none"
                  : "bg-[#202c33] text-white rounded-tl-none"
              )}
              style={{
                borderRadius: message.sender === "user"
                  ? "7.5px 7.5px 0 7.5px"
                  : "0 7.5px 7.5px 7.5px"
              }}
            >
              <div className="text-[14.5px] leading-[1.35] whitespace-pre-wrap break-words pb-3">{message.text}</div>
              {message.timestamp && (
                <div className={cn(
                  "text-[11px] absolute bottom-1 right-2 flex items-center gap-1",
                  message.sender === "user" ? "text-[#8696a0]" : "text-[#8696a0]"
                )}>
                  <span>{message.timestamp}</span>
                  {message.sender === "user" && (
                    <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" strokeWidth={2.5} />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="bg-[#202c33] px-3 py-1.5 flex items-center gap-2">
        <div className="flex items-center gap-2 flex-1 bg-[#2a3942] rounded-[21px] px-3 py-2">
          <Smile className="w-5 h-5 text-[#8696a0]" strokeWidth={2} />
          <div className="flex-1 text-[15px] text-[#8696a0]">
            Message
          </div>
          <Paperclip className="w-5 h-5 text-[#8696a0] rotate-45" strokeWidth={2} />
        </div>
        <button
          className="bg-[#00a884] hover:bg-[#009872] text-white p-2.5 rounded-full shadow-md transition-all"
          aria-label="Отправить сообщение"
          type="button"
        >
          <Mic className="w-5 h-5" strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}
