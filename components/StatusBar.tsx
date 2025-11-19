"use client";

import { useState, useEffect } from "react";

export function StatusBar() {
  // Generate random battery level between 20-100% only on client
  const [batteryLevel, setBatteryLevel] = useState(75);
  const [currentTime, setCurrentTime] = useState("9:41");

  useEffect(() => {
    setBatteryLevel(Math.floor(Math.random() * 80) + 20);
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    }));
  }, []);

  return (
    <div
      className="bg-black text-white px-5 py-1.5 flex items-center justify-between"
      style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif' }}
    >
      {/* Left side - Time */}
      <div className="flex-1">
        <span className="text-[14px] font-semibold tracking-tight">{currentTime}</span>
      </div>

      {/* Center - Dynamic Island (notch) */}
      <div className="flex-1 flex justify-center">
        <div className="bg-black rounded-full h-[26px] w-[100px]" style={{ boxShadow: '0 0 0 1px rgba(255,255,255,0.1)' }} />
      </div>

      {/* Right side - Status icons */}
      <div className="flex-1 flex items-center justify-end gap-1.5">
        {/* Signal strength bars */}
        <div className="flex items-end gap-[2px] h-3">
          <div className="w-[3px] h-[40%] bg-white rounded-sm"></div>
          <div className="w-[3px] h-[60%] bg-white rounded-sm"></div>
          <div className="w-[3px] h-[80%] bg-white rounded-sm"></div>
          <div className="w-[3px] h-[100%] bg-white rounded-sm"></div>
        </div>

        {/* 5G text */}
        <span className="text-[12px] font-semibold">5G</span>

        {/* WiFi icon */}
        <svg className="w-4 h-3.5" viewBox="0 0 16 14" fill="white">
          <path d="M8 13.5c.552 0 1-.448 1-1s-.448-1-1-1-1 .448-1 1 .448 1 1 1zm-3.5-3.5c0-.828.672-1.5 1.5-1.5s1.5.672 1.5 1.5-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5zm7 0c0-.828-.672-1.5-1.5-1.5s-1.5.672-1.5 1.5.672 1.5 1.5 1.5 1.5-.672 1.5-1.5z"/>
        </svg>

        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <span className="text-[11px] font-medium">{batteryLevel}%</span>
          <div className="relative w-[22px] h-[11px]">
            {/* Battery body */}
            <div className="absolute inset-0 border-[1.5px] border-white rounded-[3px]">
              <div
                className={`h-full ${batteryLevel > 20 ? 'bg-white' : 'bg-red-500'} rounded-[1.5px]`}
                style={{ width: `${batteryLevel}%` }}
              ></div>
            </div>
            {/* Battery tip */}
            <div className="absolute -right-[2px] top-[3px] w-[2px] h-[5px] bg-white rounded-r-[1px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
