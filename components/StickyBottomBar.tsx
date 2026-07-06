import Link from "next/link";

export default function StickyBottomBar({ source = "paid-angle1" }: { source?: string }) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-50 font-body flex justify-center md:pb-6 pointer-events-none">
      <div className="w-full md:max-w-3xl bg-[var(--color-surface-container)]/95 backdrop-blur-md border-t md:border border-[var(--color-outline-variant)]/30 px-4 py-3 flex items-center justify-between gap-3 pointer-events-auto md:rounded-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex flex-col shrink-0">
          <p className="text-[10px] sm:text-xs label-caps text-[var(--color-secondary)]">Ends Soon</p>
          <p className="text-base sm:text-lg font-bold text-white leading-tight">₹20 <span className="text-[10px] sm:text-xs text-[var(--color-on-surface-variant)] line-through font-normal">₹499</span></p>
        </div>
        <Link href={`/register?source=${source}`} className="flex-1 max-w-[200px] text-center bg-[var(--color-secondary)] text-[var(--color-on-secondary-container)] px-2 sm:px-6 py-2.5 sm:py-3 rounded-none font-bold text-[13px] sm:text-sm shadow-lg shadow-[var(--color-secondary)]/20 transition-transform active:scale-95 hover:scale-105 shrink-0 whitespace-nowrap">
          Register Now
        </Link>
      </div>
    </div>
  );
}
