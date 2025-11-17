"use client";

import { Message } from "@/types";
import { cn } from "@/lib/utils";
import { StatusBar } from "@/components/StatusBar";
import { Send } from "lucide-react";

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
      style={{ width: '390px', height: `${height}px` }}
    >
      {/* Status Bar */}
      <StatusBar />
      {/* Header */}
      <div className="bg-[#4680C2] px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#4680C2] font-semibold">
          {contactAvatar ? (
            <img src={contactAvatar} alt={contactName} className="w-full h-full rounded-full object-cover" />
          ) : (
            contactName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <div className="text-white font-medium">{contactName}</div>
          <div className="text-xs text-blue-100">online</div>
        </div>
      </div>

      {/* Messages */}
      <div
        className="bg-white p-4 space-y-2 flex-1 overflow-y-auto"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(70,128,194,0.08) 1px, transparent 0), radial-gradient(circle at 10px 12px, rgba(70,128,194,0.05) 1px, transparent 0)",
          backgroundSize: "18px 18px",
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
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {contactAvatar ? (
                  <img src={contactAvatar} alt={contactName} className="w-full h-full rounded-full object-cover" />
                ) : (
                  contactName.charAt(0).toUpperCase()
                )}
              </div>
            )}
            <div
              className={cn(
                "max-w-[70%] rounded-2xl px-3 py-2",
                message.sender === "user"
                  ? "bg-[#4680C2] text-white rounded-br-md"
                  : "bg-[#E5E7EB] text-gray-800 rounded-bl-md"
              )}
            >
              <div className="text-sm whitespace-pre-wrap break-words">{message.text}</div>
              {message.timestamp && (
                <div className={cn(
                  "text-[10px] mt-1",
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
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-2">
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-500">
          Написать сообщение...
        </div>
        <button className="bg-[#4680C2] hover:bg-[#3a6ea8] text-white p-3 rounded-full shadow-md transition">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
