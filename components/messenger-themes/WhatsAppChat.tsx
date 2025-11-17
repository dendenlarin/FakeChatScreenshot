"use client";

import { Message, OSType } from "@/types";
import { cn } from "@/lib/utils";
import { StatusBar } from "@/components/StatusBar";

interface WhatsAppChatProps {
  contactName: string;
  contactAvatar?: string;
  messages: Message[];
  os: OSType;
}

export function WhatsAppChat({ contactName, contactAvatar, messages, os }: WhatsAppChatProps) {
  // iPhone: 390x844, Android: 390x866
  const height = os === "ios" ? 844 : 866;

  return (
    <div
      className="bg-[#0B141A] rounded-3xl overflow-hidden shadow-2xl flex flex-col"
      style={{ width: '390px', height: `${height}px` }}
    >
      {/* Status Bar */}
      <StatusBar os={os} />
      {/* Header */}
      <div className="bg-[#202C33] px-4 py-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-semibold">
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
      <div
        className="p-4 space-y-2 flex-1 overflow-y-auto"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h100v100H0z\' fill=\'%230b141a\'/%3E%3Cpath d=\'M20 10c0 5-5 10-10 10m30-10c0 5-5 10-10 10m30-10c0 5-5 10-10 10m30-10c0 5-5 10-10 10m30-10c0 5-5 10-10 10M20 40c0 5-5 10-10 10m30-10c0 5-5 10-10 10m30-10c0 5-5 10-10 10m30-10c0 5-5 10-10 10m30-10c0 5-5 10-10 10M20 70c0 5-5 10-10 10m30-10c0 5-5 10-10 10m30-10c0 5-5 10-10 10m30-10c0 5-5 10-10 10m30-10c0 5-5 10-10 10\' stroke=\'%23182229\' stroke-width=\'0.5\' fill=\'none\'/%3E%3C/svg%3E")',
          backgroundSize: '100px 100px'
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
      </div>
    </div>
  );
}
