export default function WhoItsForSection() {
  return (
    <section className="py-24 px-6 bg-[var(--color-surface)] font-body">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 font-display">Ye Aapke Liye Hai Agar...</h2>
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* The Green Checkmarks */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
              <span className="material-symbols-outlined text-green-400 mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 font-display">Aap Ek Ladka Hain, Umar 18-30 Saal</h3>
                <p className="text-[var(--color-on-surface-variant)]">Yeh edition specially boys ke liye curated hai. Ladkiyon ke liye bahut jald ek alag, special edition announce hoga &mdash; stay tuned!</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
              <span className="material-symbols-outlined text-green-400 mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 font-display">Student Ya Naukri Kar Rahe Hain</h3>
                <p className="text-[var(--color-on-surface-variant)]">Whether you are preparing for JEE or struggling with your 9-5.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-green-500/5 border border-green-500/20">
              <span className="material-symbols-outlined text-green-400 mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 font-display">Focus Aur Direction Dhund Rahe Hain</h3>
                <p className="text-[var(--color-on-surface-variant)]">Aapko pata hai kya karna hai, bas "kaise" aur "kab" nahi pata.</p>
              </div>
            </div>
          </div>
          
          {/* The Red Cross */}
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-[var(--color-error)]/5 border border-[var(--color-error)]/20 h-full">
              <span className="material-symbols-outlined text-[var(--color-error)] mt-1" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
              <div>
                <h3 className="text-xl font-bold text-white mb-1 text-[var(--color-error)] font-display">Ye Aapke Liye NAHI Hai Agar...</h3>
                <p className="text-[var(--color-on-surface-variant)] mb-4">Aap sirf time-pass karne ke liye aa rahe hain.</p>
                <p className="text-[var(--color-on-surface-variant)]">Hum seats sirf unko de rahe hain jo apni life mein ek positive change chahte hain. Agar aapko lagta hai ki ₹20 ki ticket hai toh bas walk-in kar lenge bina kisi seekh ke, toh please mat aaiye.</p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}
