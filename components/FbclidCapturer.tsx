"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function FbclidCapturer() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const fbclid = searchParams.get("fbclid");
    if (fbclid) {
      localStorage.setItem("myf_fbclid", fbclid);
    }
  }, [searchParams]);

  return null;
}
