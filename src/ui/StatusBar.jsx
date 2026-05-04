import { getSurface } from '../data/waypoints'

export default function StatusBar({ progress }) {
  const distance = (56 * progress).toFixed(1)
  const surface  = getSurface(progress)

  // ETA ticks from 04:12 to 04:42
  const etaMin   = Math.round(12 + progress * 30)
  const etaStr   = `04:${String(etaMin).padStart(2, '0')}`

  return (
    <div className="fixed bottom-6 left-6 z-40 hidden md:block pointer-events-none select-none">
      <div className="glass rounded-2xl px-5 py-3 flex items-center gap-6">

        <div>
          <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/45">Distance</div>
          <div className="font-serif text-[18px] tabular-nums leading-none mt-1">
            {distance}&thinsp;<span className="text-white/50 text-[12px]">km</span>
          </div>
        </div>

        <span className="w-px h-8 bg-white/10" aria-hidden="true" />

        <div>
          <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/45">ETA</div>
          <div className="font-serif text-[18px] tabular-nums leading-none mt-1">{etaStr}</div>
        </div>

        <span className="w-px h-8 bg-white/10" aria-hidden="true" />

        <div>
          <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/45">Surface</div>
          <div className="font-serif text-[18px] leading-none mt-1">{surface}</div>
        </div>

      </div>
    </div>
  )
}
