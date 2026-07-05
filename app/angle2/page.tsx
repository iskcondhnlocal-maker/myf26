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

export default function Angle2() {
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
            College Khatam Hone Wala Hai. <br />
            <span className="text-[var(--color-secondary)]">Direction Abhi Bhi Nahi Mila?</span>
          </>
        }
        subheadline="Ek din jo aapko sirf inspire nahi karega, balki future ke liye zyada clarity dega."
        source="paid-angle2"
      />
      <VideoBlock />
      <TestimonialCarousel />
      <ProblemSection />
      <SolutionSection />
      <PricingSection source="paid-angle2" />
      <WhoItsForSection />
      <CredibilityStats />
      <FAQSection />
      <FinalCTA source="paid-angle2" />
      <Footer />
      <StickyBottomBar source="paid-angle2" />
    </div>
  );
}
