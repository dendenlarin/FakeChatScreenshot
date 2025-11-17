"use client";

import { Message } from "@/types";
import { cn } from "@/lib/utils";

interface ViberChatProps {
  contactName: string;
  contactAvatar?: string;
  messages: Message[];
}

export function ViberChat({ contactName, contactAvatar, messages }: ViberChatProps) {
  return (
    <div className="w-full max-w-[400px] bg-white rounded-lg overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="bg-[#7360f2] px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#7360f2] font-semibold">
          {contactAvatar ? (
            <img src={contactAvatar} alt={contactName} className="w-full h-full rounded-full object-cover" />
          ) : (
            contactName.charAt(0).toUpperCase()
          )}
        </div>
        <div className="flex-1">
          <div className="text-white font-medium">{contactName}</div>
          <div className="text-xs text-purple-100">online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="bg-gradient-to-b from-purple-50 to-white p-4 space-y-2 min-h-[500px] max-h-[600px] overflow-y-auto">
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
                "max-w-[70%] rounded-2xl px-3 py-2 shadow-sm",
                message.sender === "user"
                  ? "bg-[#7360f2] text-white rounded-br-md"
                  : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
              )}
            >
              <div className="text-sm whitespace-pre-wrap break-words">{message.text}</div>
              {message.timestamp && (
                <div className={cn(
                  "text-[10px] mt-1",
                  message.sender === "user" ? "text-purple-100" : "text-gray-500"
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
          Message
        </div>
      </div>
    </div>
  );
}
