export default function SolutionSection() {
  return (
    <section className="py-24 px-6 bg-[var(--color-surface)] font-body">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight font-display">
            19 July — <span className="text-[var(--color-primary)]">Mega Youth Fest, Dhanbad</span>
          </h2>
          <p className="text-lg text-[var(--color-on-surface-variant)] mb-8 leading-relaxed">
            Ek din. Life wisdom. Leadership. Music. Community. <br /><br />
            Ye koi normal seminar nahi hai. Ye woh engine hai jo aapki life ki ruki hui train ko track par layega.
          </p>
          <div className="bg-[var(--color-secondary-container)]/10 border-l-4 border-[var(--color-secondary)] p-8 rounded-r-xl">
            <p className="text-[var(--color-secondary)] text-xl font-bold italic leading-relaxed">
              "Ye motivational lecture nahi hai. Ye ek turning point hai — jo aapko push karegi, not preach."
            </p>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden aspect-square shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-background)] to-transparent z-10"></div>
          <img
            className="w-full h-full object-cover"
            data-alt="A dynamic, high-contrast photograph of a speaker on stage"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuApOW3W0IKXbEif5yrhdoZvq7tvsbkp45xZpfeQYXocTF1Avgn_8yxa2MQFI3bHlu0ZOZ_Rg3f_80cYYBD-KOanTLy9diQhpNiXj1oCLSbbV5xZAdEt8Io7lmf9r0EFlFH_bM96xfv-PCDI3Ge5iu0m6VIUypiTeKxLRdB5F0grxyiIsPhupCKvaiX0DGCAjOi-bLMJYZlgHEVru3qNXLsBJEW407_0fTTt_WxME617UdoXFth6ghEM"
            alt="Speaker on stage"
          />
        </div>
      </div>
    </section>
  );
}
