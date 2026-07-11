"use client";

import React, { useState, useEffect } from 'react';

function timeAgo(timestamp: string) {
  const date = new Date(timestamp);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (isNaN(seconds) || seconds < 0) return "just now";
  
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes === 1 ? '' : 's'} ago`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  
  const days = Math.floor(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

interface Registration {
  firstName: string;
  timestamp: string;
  location: string;
}

export default function SocialProofWidget() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await fetch('/api/registrations/recent');
        const data = await res.json();
        if (data.success && Array.isArray(data.data) && data.data.length >= 3) {
          setRegistrations(data.data);
          // Start the first one after a short delay
          setTimeout(() => setIsVisible(true), 2000);
        }
      } catch (err) {
        console.error("Failed to fetch recent registrations:", err);
      }
    }
    fetchRecent();
  }, []);

  useEffect(() => {
    if (registrations.length === 0) return;

    let timeout: NodeJS.Timeout;
    
    if (isVisible) {
      // Stay visible for 4.5 seconds, then hide
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 4500);
    } else {
      // Stay hidden for 2 seconds, then move to next and show
      timeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % registrations.length);
        setIsVisible(true);
      }, 2000);
    }

    return () => clearTimeout(timeout);
  }, [isVisible, registrations]);

  if (registrations.length < 3) return null;

  const currentReg = registrations[currentIndex];
  if (!currentReg) return null;

  return (
    <div 
      className={`fixed z-[60] left-4 sm:left-6 transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
        isVisible ? 'translate-x-0 opacity-100' : '-translate-x-12 opacity-0 pointer-events-none'
      }`}
      style={{ bottom: 'max(96px, env(safe-area-inset-bottom, 24px) + 72px)' }}
    >
      <div className="bg-[#131720]/95 backdrop-blur-md border border-[var(--color-secondary)]/30 rounded-xl p-3 shadow-lg shadow-[var(--color-secondary)]/10 flex items-center gap-3 max-w-[280px] sm:max-w-[320px]">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/30 flex items-center justify-center">
          <span className="material-symbols-outlined text-[var(--color-secondary)] text-lg">local_activity</span>
        </div>
        <div className="flex flex-col">
          <p className="text-white text-xs sm:text-sm font-medium leading-tight">
            <span className="font-bold text-[var(--color-secondary)]">{currentReg.firstName}</span> from Dhanbad just registered
          </p>
          <p className="text-[#98a4c3] text-[10px] sm:text-xs mt-1 font-label-caps">
            {timeAgo(currentReg.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
}
