"use client";

import { Message } from "@/types";
import { cn } from "@/lib/utils";

interface TelegramChatProps {
  contactName: string;
  contactAvatar?: string;
  messages: Message[];
}

export function TelegramChat({ contactName, contactAvatar, messages }: TelegramChatProps) {
  return (
    <div className="w-full max-w-[400px] bg-[#0F1419] rounded-lg overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-[#212121] px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
          {contactAvatar ? (
            <img src={contactAvatar} alt={contactName} className="w-full h-full rounded-full object-cover" />
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
      <div className="bg-[#0F1419] p-4 space-y-2 min-h-[500px] max-h-[600px] overflow-y-auto">
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
      </div>
    </div>
  );
}
