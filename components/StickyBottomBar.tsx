"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

export default function StickyBottomBar({ source = "paid-angle1" }: { source?: string }) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    const DURATION = 15 * 60 * 1000; // 15 minutes in ms
    const STORAGE_KEY = "myf26_timer_start";

    const updateTimer = () => {
      const storedStart = localStorage.getItem(STORAGE_KEY);
      const now = Date.now();
      
      let startTime = storedStart ? parseInt(storedStart, 10) : null;
      
      if (!startTime || isNaN(startTime) || now - startTime >= DURATION) {
        startTime = now;
        localStorage.setItem(STORAGE_KEY, startTime.toString());
      }
      
      const elapsed = now - startTime;
      const remaining = Math.max(0, DURATION - elapsed);
      setTimeLeft(remaining);
    };

    updateTimer();
    const intervalId = setInterval(updateTimer, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 font-body flex justify-center md:pb-6 pointer-events-none">
      <div className="w-full md:max-w-3xl bg-[var(--color-surface-container)]/95 backdrop-blur-md border-t md:border border-[var(--color-outline-variant)]/30 p-3 sm:p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 pointer-events-auto md:rounded-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between w-full sm:w-auto shrink-0 gap-1 sm:gap-0">
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <p className="text-[15px] sm:text-base md:text-lg font-bold leading-tight whitespace-nowrap">
              <span className="text-[11px] sm:text-xs text-[var(--color-on-surface-variant)] line-through font-normal mr-1.5">₹499</span>
              <span className="text-[var(--color-secondary)]">₹20</span>
            </p>
            <p className="text-[11px] sm:text-xs label-caps text-[#ff7a59] mt-0.5">
              {timeLeft !== null && timeLeft <= 0 ? "Offer ending soon" : 
               timeLeft !== null ? `Offer ends in ${formatTime(timeLeft)} mins` : "Ends Soon"}
            </p>
          </div>
        </div>
        <Link data-gtm-cta="register-intent" href={`/register?source=${source}`} className="btn-shine-pulse w-full sm:flex-1 sm:max-w-[220px] text-center bg-[var(--color-secondary)] text-[var(--color-on-secondary-container)] px-4 py-3 sm:py-3.5 rounded-lg font-bold text-[14px] sm:text-[15px] active:scale-95 shrink-0 whitespace-nowrap overflow-hidden relative">
          <span className="relative z-10">Register Now</span>
        </Link>
      </div>
    </div>
  );
}
