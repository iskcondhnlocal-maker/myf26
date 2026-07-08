import Link from "next/link";

export default function FinalCTA({ source = "paid-angle1" }: { source?: string }) {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-primary-container)]/30 border-t border-[var(--color-outline-variant)]/20 font-body">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-6xl font-black mb-6 font-display">Seats Limited Hain</h2>
        <p className="text-xl text-[var(--color-on-surface-variant)] mb-12">Sirf ₹20 mein apni seat reserve kariye aur Dhanbad ke sabse bade Youth Festival ka hissa baniye.</p>
        
        <div className="inline-block relative group">
          <div className="absolute -inset-4 bg-[var(--color-secondary)]/20 blur-xl group-hover:bg-[var(--color-secondary)]/40 transition-all rounded-full"></div>
          <Link data-gtm-cta="register-intent" href={`/register?source=${source}`} className="btn-shine-pulse relative overflow-hidden flex min-w-[320px] cursor-pointer items-center justify-center rounded-none h-20 px-12 bg-[var(--color-secondary)] text-[var(--color-on-secondary-container)] text-2xl font-black transition-all font-display">
            <span className="relative z-10">Register Kariye — ₹20</span>
          </Link>
        </div>
        
        <div className="mt-12 flex flex-col items-center gap-2">
          <div className="flex -space-x-4">
            <img className="w-10 h-10 rounded-full border-2 border-[var(--color-surface)] object-cover" data-alt="Small circular profile avatar" src="/1. Ashish – Graduation Student, PK Roy College _ SSC Aspirant.png" alt="Avatar" />
            <img className="w-10 h-10 rounded-full border-2 border-[var(--color-surface)] object-cover" data-alt="Small circular profile avatar" src="/2. Harsh – 4th Year, Electrical Engineering, IIT (ISM) Dhanbad.png" alt="Avatar" />
            <img className="w-10 h-10 rounded-full border-2 border-[var(--color-surface)] object-cover" data-alt="Small circular profile avatar" src="/3. Uttam – 2nd Year, KK Polytechnic, Dhanbad.jpeg" alt="Avatar" />
            <div className="w-10 h-10 rounded-full bg-[var(--color-surface-container-high)] border-2 border-[var(--color-surface)] flex items-center justify-center text-[10px] font-bold">+1500</div>
          </div>
          <p className="text-[var(--color-on-surface-variant)] text-sm">Join the 1500+ strong Dhanbad youth community</p>
        </div>
      </div>
    </section>
  );
}
