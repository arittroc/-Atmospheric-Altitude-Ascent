export default function HeroCard({ progress }) {
  // Fade out between progress 0 → 0.15
  const opacity   = Math.max(0, 1 - progress / 0.15)
  const blur      = Math.min(10, (progress / 0.15) * 10)
  const translateY = (progress / 0.15) * -40

  if (opacity === 0) return null

  return (
    <div
      className="absolute inset-0 grid place-items-center pointer-events-none select-none"
      style={{
        opacity,
        filter: `blur(${blur}px)`,
        transform: `translateY(${translateY}px)`,
        willChange: 'transform, opacity, filter',
      }}
      aria-hidden={opacity < 0.01}
    >
      <div className="text-center px-8">

        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span className="h-px w-10 bg-white/30" />
          <span className="font-mono text-[10px] tracking-[0.4em] uppercase text-white/60">
            East Sikkim · Old Silk Route · 04 — 06 May
          </span>
          <span className="h-px w-10 bg-white/30" />
        </div>

        {/* Main title */}
        <h1 className="font-serif font-light leading-[0.95] tracking-tight">
          <span className="block hero-gradient text-[clamp(64px,12vw,176px)]">
            Nathu La
          </span>
          <span className="block text-[clamp(26px,4vw,54px)] italic font-light text-white/70 mt-2">
            the&nbsp;
            <span className="hero-gradient not-italic font-light">Listening Ear</span>
          </span>
        </h1>

        {/* Body */}
        <p className="mt-10 max-w-md mx-auto text-[14px] leading-relaxed text-white/65 font-light">
          A 56-kilometre weekend ascent from Gangtok through Tsomgo Lake and
          Baba Mandir to the 4,310&nbsp;m Indo-Tibetan border on the old Silk Route.
        </p>

        {/* Scroll cue */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/45">
            Scroll to ascend
          </span>
          <div className="relative w-px h-14 bg-white/10 overflow-hidden">
            <span className="scroll-cue-line absolute inset-0" />
          </div>
        </div>

      </div>
    </div>
  )
}
