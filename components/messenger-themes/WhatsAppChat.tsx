"use client";

import Image from "next/image";
import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { StatusBar } from "@/components/StatusBar";
import { Send } from "lucide-react";

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
      className="bg-[#0B141A] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      style={{ width: '390px', height: `${height}px` }}
    >
      {/* Status Bar */}
      <StatusBar />
      {/* Header */}
      <div className="bg-[#202C33] px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
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
        className="p-4 space-y-2 flex-1 overflow-y-auto"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg width=\'400\' height=\'400\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h400v400H0z\' fill=\'%230b141a\'/%3E%3Cpath d=\'M36 24c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20M36 80c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20M36 136c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20M36 192c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20M36 248c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20M36 304c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20M36 360c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20m60-20c0 10-10 20-20 20\' stroke=\'%23182229\' stroke-width=\'1\' fill=\'none\'/%3E%3C/svg%3E")',
          backgroundSize: "200px 200px",
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
                "max-w-[70%] rounded-lg px-3 py-2 shadow-md",
                message.sender === "user"
                  ? "bg-[#005C4B] text-white"
                  : "bg-[#202C33] text-white"
              )}
            >
              <div className="text-sm whitespace-pre-wrap break-words">{message.text}</div>
              {message.timestamp && (
                <div className="text-[10px] text-gray-400 mt-1 text-right">
                  {message.timestamp}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="bg-[#202C33] px-4 py-3 flex items-center gap-2">
        <div className="flex-1 bg-[#2A3942] rounded-full px-4 py-2 text-sm text-gray-400">
          Message
        </div>
        <button
          className="bg-[#005C4B] hover:bg-[#014c3e] text-white p-3 rounded-full shadow-md transition"
          aria-label="Отправить сообщение"
          type="button"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
