import { getAltitude } from '../data/waypoints'

export default function AltitudeChip({ progress }) {
  const altitude = getAltitude(progress)

  return (
    <div
      className="fixed top-6 right-6 z-40 hidden lg:block pointer-events-none select-none"
      aria-label={`Current altitude: ${altitude} metres`}
    >
      <div className="glass rounded-2xl px-4 py-2.5 flex flex-col items-end">
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/50">
          Altitude
        </span>
        <span className="font-serif text-[22px] leading-none mt-0.5 tabular-nums">
          {altitude.toLocaleString()}
        </span>
        <span className="font-mono text-[9px] text-white/45 tracking-wider mt-0.5">
          metres
        </span>
      </div>
    </div>
  )
}
