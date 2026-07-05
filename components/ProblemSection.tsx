export default function ProblemSection() {
  return (
    <section className="py-24 px-6 bg-[var(--color-surface-dim)] border-y border-[var(--color-outline-variant)]/10 font-body">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-8 font-display">Sach Bolein?</h2>
        <div className="space-y-6">
          <p className="text-xl md:text-2xl text-[var(--color-on-surface-variant)] leading-relaxed">
            Motivation aata hai — 2 din mein gayab ho jaata hai. Kitabo ke beech dimaag bhatak raha hai.
          </p>
          <div className="w-20 h-1 bg-[var(--color-secondary)] mx-auto rounded-full"></div>
          <p className="text-lg md:text-xl text-[#98a4c3]">
            Phone uthate hi 2 ghante kahan jaate hain pata nahi chalta. Career ko lekar darr hai par direction nahi. Dhanbad ke young log deserve karte hain ek real upgrade.
          </p>
        </div>
      </div>
    </section>
  );
}
