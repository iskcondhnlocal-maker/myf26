"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function TopBanner() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Don't show on specific pages
  if (
    pathname?.startsWith("/thank-you") || 
    pathname?.startsWith("/verify") || 
    pathname?.startsWith("/gate")
  ) {
    return null;
  }

  return (
    <div className="bg-[#ef4444] text-white text-center py-2 px-4 z-[100] relative shadow-md font-body">
      <p className="text-[13px] md:text-sm font-bold uppercase tracking-wider animate-pulse">
        🚨 Registrations Closing Tonight at Midnight — Event is Tomorrow! 🚨
      </p>
    </div>
  );
}
