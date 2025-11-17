"use client";

import { OSType } from "@/types";
import { Wifi, Signal, Battery } from "lucide-react";

interface StatusBarProps {
  os: OSType;
}

export function StatusBar({ os }: StatusBarProps) {
  // Generate random battery level between 20-100%
  const batteryLevel = Math.floor(Math.random() * 80) + 20;

  // Get current time in HH:MM format
  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  if (os === "ios") {
    return (
      <div className="bg-black text-white px-6 py-2 flex items-center justify-between text-xs font-medium">
        {/* Left side - Time */}
        <div className="flex-1">
          <span className="font-semibold">{currentTime}</span>
        </div>

        {/* Center - Dynamic Island (notch) */}
        <div className="flex-1 flex justify-center">
          <div className="bg-black rounded-full h-6 w-24" />
        </div>

        {/* Right side - Status icons */}
        <div className="flex-1 flex items-center justify-end gap-1">
          <Signal className="w-3.5 h-3.5" strokeWidth={2.5} />
          <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
          <div className="flex items-center gap-0.5">
            <span className="text-[10px]">{batteryLevel}%</span>
            <Battery className="w-5 h-3.5" strokeWidth={2} fill={batteryLevel > 20 ? "white" : "none"} />
          </div>
        </div>
      </div>
    );
  }

  // Android status bar
  return (
    <div className="bg-black text-white px-4 py-1.5 flex items-center justify-between text-xs">
      {/* Left side - Time */}
      <div className="flex items-center gap-2">
        <span className="font-medium">{currentTime}</span>
      </div>

      {/* Right side - Status icons */}
      <div className="flex items-center gap-1.5">
        <Signal className="w-3 h-3" strokeWidth={2.5} />
        <Wifi className="w-3.5 h-3.5" strokeWidth={2.5} />
        <div className="flex items-center gap-0.5">
          <span className="text-[9px]">{batteryLevel}%</span>
          <Battery className="w-4 h-3" strokeWidth={2} fill={batteryLevel > 20 ? "white" : "none"} />
        </div>
      </div>
    </div>
  );
}
