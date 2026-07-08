export default function FAQSection() {
  return (
    <section className="py-24 px-6 bg-[var(--color-surface)] font-body">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-black text-center mb-16 font-display">Frequently Asked Questions</h2>
        <div className="space-y-4">
          
          <details className="group border border-[var(--color-outline-variant)]/30 rounded-xl bg-[var(--color-surface-container-low)] overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-[var(--color-surface-variant)]/30 transition-colors">
              <span className="text-lg font-bold">Kya ye ek religious event hai?</span>
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <div className="p-6 pt-0 text-[var(--color-on-surface-variant)] leading-relaxed">
              Mega Youth Festival sabhi background ke students aur young professionals ke liye hai. Event ka focus leadership, personality development, practical life wisdom aur meaningful connections par hai. Event ko modern aur relatable tareeke se design kiya gaya hai, taaki aap jo seekhein use apni studies, career aur daily life mein confidently apply kar saken.
            </div>
          </details>
          
          <details className="group border border-[var(--color-outline-variant)]/30 rounded-xl bg-[var(--color-surface-container-low)] overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-[var(--color-surface-variant)]/30 transition-colors">
              <span className="text-lg font-bold">₹20 itna kam kyun rakha gaya hai? Koi hidden cost toh nahi?</span>
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <div className="p-6 pt-0 text-[var(--color-on-surface-variant)] leading-relaxed">
              Bilkul nahi — sirf ₹20, aur bas itna hi. Koi chhupa hua charge nahi hai. Humara maqsad simple hai: Dhanbad ka har youth is experience ka hissa ban sake, chahe unki jeb mein jitna bhi ho. Isliye humne price itna kam rakha hai — taaki paisa kabhi kisi ke aane mein rukawat na bane.
            </div>
          </details>
          <details className="group border border-[var(--color-outline-variant)]/30 rounded-xl bg-[var(--color-surface-container-low)] overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-[var(--color-surface-variant)]/30 transition-colors">
              <span className="text-lg font-bold">₹20 mein kya-kya milega?</span>
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <div className="p-6 pt-0 text-[var(--color-on-surface-variant)] leading-relaxed">
              Aapki registration mein leadership sessions, expert guidance, live music, inspiring youth community, delicious prasadam (meal), aur poore din ka premium event experience shamil hai. Hum chahte hain ki zyada se zyada students aur young professionals is opportunity ka hissa ban saken.
            </div>
          </details>
          
          <details className="group border border-[var(--color-outline-variant)]/30 rounded-xl bg-[var(--color-surface-container-low)] overflow-hidden">
            <summary className="flex items-center justify-between p-6 cursor-pointer list-none hover:bg-[var(--color-surface-variant)]/30 transition-colors">
              <span className="text-lg font-bold">Registration aur payment alag hai kya?</span>
              <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
            </summary>
            <div className="p-6 pt-0 text-[var(--color-on-surface-variant)] leading-relaxed">
              Nahi. Sirf ₹20 ka registration complete karte hi aapki seat confirm ho jaayegi. Iske baad aapko confirmation aur event details WhatsApp aur email ke through mil jaayengi.
            </div>
          </details>
          
        </div>
      </div>
    </section>
  );
}
