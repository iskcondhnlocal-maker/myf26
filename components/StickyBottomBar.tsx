import Link from "next/link";

export default function StickyBottomBar({ source = "paid-angle1" }: { source?: string }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 font-body flex justify-center md:pb-6 pointer-events-none">
      <div className="w-full md:max-w-3xl bg-[var(--color-surface-container)]/95 backdrop-blur-md border-t md:border border-[var(--color-outline-variant)]/30 p-4 flex items-center justify-between pointer-events-auto md:rounded-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div>
          <p className="text-xs label-caps text-[var(--color-secondary)]">Ends Soon</p>
          <p className="text-lg font-bold text-white">₹20 <span className="text-xs text-[var(--color-on-surface-variant)] line-through">₹499</span></p>
        </div>
        <Link href={`/register?source=${source}`} className="bg-[var(--color-secondary)] text-[var(--color-on-secondary-container)] px-6 py-3 rounded-none font-bold text-sm shadow-lg shadow-[var(--color-secondary)]/20 transition-transform active:scale-95 hover:scale-105">
          Register Now
        </Link>
      </div>
    </div>
  );
}
