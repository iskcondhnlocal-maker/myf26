import { useState, useEffect } from "react";

export function useCountdownTimer() {
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

  return { timeLeft, formatTime };
}
