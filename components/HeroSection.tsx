import Link from "next/link";
import React from "react";

interface HeroSectionProps {
  headline?: React.ReactNode;
  subheadline?: string | React.ReactNode;
  extraContent?: React.ReactNode;
  source?: string;
  showCommonFeatures?: boolean;
}

export default function HeroSection({
  headline = (
    <>
      Kitabein Khuli Hain. <br />
      <span className="text-[var(--color-secondary)]">Dimaag Kahin Aur Hai.</span>
    </>
  ),
  subheadline = "19 July — ek din jo focus wapas la dega.",
  extraContent,
  source = "angle1",
  showCommonFeatures = false,
}: HeroSectionProps) {
  return (
    <section className="relative flex h-auto min-h-screen w-full flex-col bg-[#131720] dark group/design-root overflow-x-hidden">
      <div className="@container">
        <div className="@[480px]:p-4">
          <div
            className="flex min-h-[580px] flex-col gap-6 bg-cover bg-center bg-no-repeat @[480px]:gap-8 @[480px]:rounded-xl items-center justify-center p-4 relative"
            data-alt="A high-energy, wide-angle cinematic shot of a massive youth festival at night in an open field, with vibrant stage lights and a crowd of thousands."
            style={{
              backgroundImage:
                "linear-gradient(rgba(13, 27, 62, 0.8) 0%, rgba(19, 23, 32, 0.95) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuAW9HlGQGzjZNjz6qZgwjOtdxCSq3wwNZ2c5Cb4iVejQn7iMKe1YKkF0pOfkRM0TQj44T0NP_jP64_s-s1Yu_c8_eVr_D6J19DUjbTNDBAJ8rYmTWTygcgB7_DssVALI6jtFye0CR6Vief7NziVZV9xN38EJwVX58x4pla2uPlbQtbzYqILLykbnBboUtxWSm3h5r0jURFYX_3By4EL2sW811i7sYrVDKkU3Z6RirE4i8fI1N0UWYcD')",
            }}
          >
            <div className="inline-flex items-center text-center max-w-[95vw] gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/30 text-[var(--color-secondary)] mb-[clamp(1.5rem,5vw,2.5rem)]">
              <span className="material-symbols-outlined text-[10px] sm:text-sm shrink-0">calendar_today</span>
              <span className="label-caps text-[9px] sm:text-xs leading-tight">19 July · 10 AM · Golf Ground, Dhanbad</span>
            </div>
            
            <div className="flex flex-col gap-4 text-center max-w-4xl">
              {showCommonFeatures && (
                <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
                  <span className="border border-[var(--color-secondary)] text-[var(--color-secondary)] bg-transparent rounded-full px-3 py-1 text-[10px] sm:text-xs">Life Lessons, Drama & Debate</span>
                  <span className="border border-[var(--color-secondary)] text-[var(--color-secondary)] bg-transparent rounded-full px-3 py-1 text-[10px] sm:text-xs">Live Music</span>
                  <span className="border border-[var(--color-secondary)] text-[var(--color-secondary)] bg-transparent rounded-full px-3 py-1 text-[10px] sm:text-xs">Inspiring Community</span>
                  <span className="border border-[var(--color-secondary)] text-[var(--color-secondary)] bg-transparent rounded-full px-3 py-1 text-[10px] sm:text-xs">Delicious Food</span>
                </div>
              )}
              <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em] @[480px]:text-7xl font-display">
                {headline}
              </h1>
              <h2 className="text-[#98a4c3] text-lg font-normal leading-relaxed @[480px]:text-2xl max-w-2xl mx-auto font-body">
                {subheadline}
              </h2>
              {showCommonFeatures && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                  <span className="font-label-caps text-[10px] sm:text-xs text-[#98a4c3] uppercase tracking-widest mr-1">Guidance From:</span>
                  <span className="border border-[var(--color-secondary)] text-[var(--color-secondary)] bg-[#000000]/40 backdrop-blur-sm rounded-full px-3 py-1.5 text-[10px] sm:text-xs">IIT-ISM</span>
                  <span className="border border-[var(--color-secondary)] text-[var(--color-secondary)] bg-[#000000]/40 backdrop-blur-sm rounded-full px-3 py-1.5 text-[10px] sm:text-xs">PMCH</span>
                  <span className="border border-[var(--color-secondary)] text-[var(--color-secondary)] bg-[#000000]/40 backdrop-blur-sm rounded-full px-3 py-1.5 text-[10px] sm:text-xs">BCCL Professionals</span>
                </div>
              )}
              {extraContent}
            </div>
            <div className="flex flex-col items-center gap-4 mt-4">
              <Link data-gtm-cta="register-intent" href={`/register?source=${source}`} className="btn-shine-pulse relative overflow-hidden flex min-w-[120px] cursor-pointer items-center justify-center rounded-none h-14 px-8 bg-[var(--color-secondary)] text-[var(--color-on-secondary-container)] text-lg font-bold transition-transform active:scale-95">
                <span className="relative z-10 truncate">₹20 Mein Register Karo</span>
              </Link>
              <p className="text-[var(--color-on-surface-variant)] text-sm font-medium flex items-center gap-2 font-body">
                <span className="material-symbols-outlined text-green-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                  check_circle
                </span>
                Limited Seats remaining for early birds
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
