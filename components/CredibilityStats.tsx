export default function CredibilityStats() {
  return (
    <section className="py-20 px-6 bg-[var(--color-primary-container)]/20 font-body">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-8 rounded-2xl bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)]/30">
          <p className="text-5xl font-black text-[var(--color-primary)] mb-2 font-display">1000+</p>
          <p className="text-[var(--color-on-surface-variant)] font-bold">Pichle Saal Ke Attendees</p>
        </div>
        <div className="text-center p-8 rounded-2xl bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)]/30">
          <p className="text-5xl font-black text-[var(--color-secondary)] mb-2 font-display">IIT-ISM</p>
          <p className="text-[var(--color-on-surface-variant)] font-bold">Seniors & Doctors Guidance</p>
        </div>
        <div className="text-center p-8 rounded-2xl bg-[var(--color-surface-container-high)] border border-[var(--color-outline-variant)]/30">
          <p className="text-5xl font-black text-[var(--color-tertiary-fixed-dim)] mb-2 font-display">4.8★</p>
          <p className="text-[var(--color-on-surface-variant)] font-bold">Student Feedback Rating</p>
        </div>
      </div>
    </section>
  );
}
