import HeroVideo from "./HeroVideo";

export default function VideoBlock() {
  return (
    <div className="p-4 @container -mt-20 relative z-10 font-body">
      <div className="flex flex-col items-stretch justify-start rounded-2xl @xl:flex-row @xl:items-start shadow-2xl bg-[var(--color-surface-container)] border border-[var(--color-outline-variant)]/30 overflow-hidden">
        <div className="w-full @xl:w-[55%] aspect-video relative">
          <HeroVideo />
        </div>
        <div className="flex w-full min-w-72 grow flex-col items-stretch justify-center gap-4 py-8 px-6 @xl:px-10">
          <p className="text-white text-2xl font-bold leading-tight tracking-[-0.015em]">
            Pichle saal 1000+ young log Dhanbad mein ek jagah pe aaye
          </p>
          <div className="border-t border-[var(--color-outline-variant)]/30 pt-6">
            <p className="text-[#98a4c3] text-base font-normal leading-normal italic">
              "Real stories from real participants who found their path."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
