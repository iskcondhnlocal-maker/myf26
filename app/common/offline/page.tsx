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

export default function Angle5() {
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
            Dhanbad Ka Sabse <br />
            <span className="text-[var(--color-secondary)]">Premium Youth Experience.</span>
          </>
        }
        subheadline="Sirf serious logon ke liye — 19 July."
        source="common-offline"
        showCommonFeatures={true}
      />
      <VideoBlock />
      <TestimonialCarousel />
      <ProblemSection />
      <SolutionSection />
      <PricingSection source="common-offline" />
      <WhoItsForSection />
      <CredibilityStats />
      <FAQSection />
      <FinalCTA source="common-offline" />
      <Footer />
      <StickyBottomBar source="common-offline" />
    </div>
  );
}
