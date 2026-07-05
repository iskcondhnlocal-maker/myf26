export default function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-[var(--color-outline-variant)]/20 text-center font-body bg-[var(--color-surface)]">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="mb-8">
          <h3 className="text-2xl font-black tracking-tighter font-display">MEGA YOUTH FEST<span className="text-[var(--color-secondary)]">.</span></h3>
        </div>
        
        <div className="flex items-center justify-center gap-8 mb-8 opacity-80 hover:opacity-100 transition-opacity">
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-on-surface-variant)]">Organised by</span>
            <img src="/iskcon_dhanbad_logo.jpg" alt="ISKCON Dhanbad" className="h-12 w-auto object-contain rounded" />
          </div>
          <div className="w-px h-12 bg-[var(--color-outline-variant)]/30"></div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-[var(--color-on-surface-variant)]">Youth Wing</span>
            <img src="/iyf dhanbad_logo.png" alt="IYF Dhanbad" className="h-12 w-auto object-contain rounded" />
          </div>
        </div>

        <p className="text-[var(--color-on-surface-variant)] text-sm font-medium">© 2026 Mega Youth Festival. Organised by Iskcon Youth Forum, Dhanbad.</p>
        <p className="text-[var(--color-on-surface-variant)] text-xs mt-2">Golf Ground, Dhanbad | 19 July 2026</p>
      </div>
    </footer>
  );
}
