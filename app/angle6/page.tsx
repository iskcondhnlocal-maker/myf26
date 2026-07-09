"use client";

import { useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import VideoBlock from "@/components/VideoBlock";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import ProblemSection from "@/components/ProblemSection";
import SolutionSection from "@/components/SolutionSection";
import PricingSection from "@/components/PricingSection";
import WhoItsForSection from "@/components/WhoItsForSection";
import CredibilityStats from "@/components/CredibilityStats";
import FAQSection from "@/components/FAQSection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";
import StickyBottomBar from "@/components/StickyBottomBar";

export default function Angle6() {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
      section.classList.add('transition-all', 'duration-1000', 'ease-out', 'opacity-0', 'translate-y-10');
      observer.observe(section);
    });

    const interval = setInterval(() => {
      const btns = document.querySelectorAll('.bg-\\[var\\(--color-secondary\\)\\]');
      btns.forEach(btn => {
        btn.classList.add('brightness-110');
        setTimeout(() => btn.classList.remove('brightness-110'), 500);
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[var(--color-background)] text-[var(--color-on-background)] min-h-[max(884px,100dvh)]">
      <HeroSection 
        headline={
          <>
            Ek Haar, <br />
            <span className="text-[var(--color-secondary)]">Poori Kahani Nahi Hoti.</span>
          </>
        }
        subheadline="Unke Saath Wapas Utho Jinhone Yeh Khud Dekha Hai — Naya Josh Milega."
        extraContent={
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
            <span className="text-[#98a4c3] text-sm font-bold uppercase tracking-wider label-caps">Guidance From:</span>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1.5 text-xs font-medium border border-[var(--color-secondary)]/50 rounded-full text-[var(--color-secondary)] bg-[var(--color-secondary)]/10">IIT-ISM</span>
              <span className="px-3 py-1.5 text-xs font-medium border border-[var(--color-secondary)]/50 rounded-full text-[var(--color-secondary)] bg-[var(--color-secondary)]/10">PMCH</span>
              <span className="px-3 py-1.5 text-xs font-medium border border-[var(--color-secondary)]/50 rounded-full text-[var(--color-secondary)] bg-[var(--color-secondary)]/10">BCCL Professionals</span>
            </div>
          </div>
        }
        source="paid-angle6"
      />
      <VideoBlock />
      <TestimonialCarousel />
      <ProblemSection />
      <SolutionSection />
      <PricingSection source="paid-angle6" />
      <WhoItsForSection />
      <CredibilityStats />
      <FAQSection />
      <FinalCTA source="paid-angle6" />
      <Footer />
      <StickyBottomBar source="paid-angle6" />
    </div>
  );
}
