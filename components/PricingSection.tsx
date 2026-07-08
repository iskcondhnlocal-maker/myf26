import Link from "next/link";

export default function PricingSection({ source = "paid-angle1" }: { source?: string }) {
  return (
    <section className="py-24 px-6 bg-[var(--color-surface-container-low)] font-body">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#1c2230] rounded-3xl p-8 md:p-16 border border-[var(--color-primary)]/20 shadow-2xl relative overflow-hidden">
          {/* Accent background light */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-primary)]/5 blur-[100px] -mr-32 -mt-32 rounded-full"></div>
          
          <h2 className="text-3xl md:text-5xl font-black text-center mb-12 font-display">₹20 Mein Itna Sab?</h2>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-variant)]/40">
              <span className="material-symbols-outlined text-[var(--color-secondary)]" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
              <span className="text-lg font-medium">Leadership Session (Life Skills)</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-variant)]/40">
              <span className="material-symbols-outlined text-[var(--color-secondary)]" style={{ fontVariationSettings: "'FILL' 1" }}>school</span>
              <span className="text-lg font-medium">IIT-ISM Students Personal Guidance</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-variant)]/40">
              <span className="material-symbols-outlined text-[var(--color-secondary)]" style={{ fontVariationSettings: "'FILL' 1" }}>event</span>
              <span className="text-lg font-medium">Live Music & Performance</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-variant)]/40">
              <span className="material-symbols-outlined text-[var(--color-secondary)]" style={{ fontVariationSettings: "'FILL' 1" }}>restaurant</span>
              <span className="text-lg font-medium">Sumptuous Meal Included</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-variant)]/40">
              <span className="material-symbols-outlined text-[var(--color-secondary)]" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
              <span className="text-lg font-medium">Vibrant Peer Community</span>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-surface-variant)]/40">
              <span className="material-symbols-outlined text-[var(--color-secondary)]" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              <span className="text-lg font-medium">Digital Participation Certificate</span>
            </div>
          </div>
          
          <div className="text-center pt-8 border-t border-[var(--color-outline-variant)]/30">
            <p className="label-caps text-[var(--color-on-surface-variant)] mb-2">Registration Fee</p>
            <div className="flex items-baseline justify-center gap-2 mb-8">
              <span className="text-7xl md:text-8xl font-black text-white font-display">₹20</span>
              <span className="text-[var(--color-on-surface-variant)] line-through text-3xl md:text-4xl font-display">₹499</span>
            </div>
            <Link data-gtm-cta="register-intent" href={`/register?source=${source}`} className="btn-shine-pulse relative overflow-hidden w-full md:w-auto min-w-[300px] cursor-pointer flex items-center justify-center rounded-none h-16 px-10 bg-[var(--color-secondary)] text-[var(--color-on-secondary-container)] text-xl font-black transition-transform active:scale-95 font-display">
              <span className="relative z-10">Claim Your Seat Now</span>
            </Link>
            <p className="text-[var(--color-on-surface-variant)] mt-4 text-sm">*Sirf pehle 500 registrations ke liye special price</p>
          </div>
        </div>
      </div>
    </section>
  );
}
