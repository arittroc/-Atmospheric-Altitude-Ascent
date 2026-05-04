const WX_GLYPHS = {
  sun:   () => <span className="block w-2 h-2 rounded-full bg-white" />,
  cloud: () => <span className="block w-4 h-2 rounded-full bg-white/60" />,
  snow:  () => <span className="block w-1.5 h-1.5 rounded-full bg-cyan-200" />,
}

function ForecastStrip({ hours }) {
  return (
    <div className="hairline rounded-xl px-3 py-3 mb-6">
      <div className="flex items-center justify-between mb-3">
        <span className="font-mono text-[9px] tracking-widest uppercase text-white/45">
          Forecast · 24 h · IST
        </span>
        <span className="font-mono text-[9px] tracking-widest uppercase text-white/45">
          Wind 42 km/h NE
        </span>
      </div>
      <div className="grid grid-cols-6 gap-1">
        {hours.map(h => {
          const Glyph = WX_GLYPHS[h.wx] || WX_GLYPHS.cloud
          return (
            <div key={h.t} className="flex flex-col items-center gap-2">
              <span className="font-mono text-[9px] text-white/45">{h.t}</span>
              <span className="grid place-items-center h-4"><Glyph /></span>
              <span className="font-mono text-[10px] tabular-nums text-white/85">
                {h.temp > 0 ? '+' : ''}{h.temp}°
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}

export default function WaypointCard({
  data,
  progress,
  entryProgress,
  exitProgress,
  align = 'left',
}) {
  const FADE_RANGE = 0.06

  let localT = 0
  let visible = false

  if (progress >= entryProgress && progress <= exitProgress) {
    visible = true
    localT  = Math.min(1, (progress - entryProgress) / FADE_RANGE)
  } else if (progress > exitProgress) {
    visible = true
    localT  = Math.max(0, 1 - (progress - exitProgress) / FADE_RANGE)
  }

  const opacity     = easeInOut(localT)
  const translateY  = (1 - localT) * (align === 'left' ? 30 : -30)
  const isRight     = align === 'right'

  if (!visible || opacity < 0.005) return null

  return (
    <div
      className={`absolute bottom-0 top-0 flex items-center
        ${isRight ? 'right-8 md:right-20 lg:right-32' : 'left-8 md:left-20 lg:left-32'}
        pointer-events-none select-none`}
      style={{
        opacity,
        transform: `translateY(${translateY}px)`,
        willChange: 'transform, opacity',
      }}
    >
      <article className="glass-strong rounded-3xl p-8 w-[420px] max-w-[90vw] relative overflow-hidden">

        {/* Grain texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage: 'radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '3px 3px',
          }}
          aria-hidden="true"
        />

        {/* Header row */}
        <div className="flex items-center justify-between mb-6 relative">
          <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-white/45">
            {String(data.index).padStart(2, '0')} / Waypoint
          </span>
          <div className="flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-cyan-300/90 pulse-dot" aria-hidden="true" />
            <span className="font-mono text-[9px] tracking-widest uppercase text-white/55">Live</span>
          </div>
        </div>

        {/* Kicker */}
        <div className="font-mono text-[10px] tracking-[0.28em] uppercase text-cyan-200/80 mb-2 relative">
          {data.kicker}
        </div>

        {/* Title */}
        <h2 className="font-serif font-light text-[32px] leading-[1.05] tracking-tight mb-4 relative">
          {data.title}
        </h2>

        {/* Body */}
        <p className="text-[13px] leading-relaxed text-white/68 mb-6 relative font-light">
          {data.body}
        </p>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-px bg-white/8 rounded-xl overflow-hidden mb-6 relative">
          {data.stats.map(s => (
            <div key={s.label} className="bg-[#050810]/60 px-3 py-3">
              <div className="font-mono text-[9px] tracking-widest uppercase text-white/45 mb-1">
                {s.label}
              </div>
              <div className="font-serif text-[19px] tabular-nums leading-none">
                {s.value}
              </div>
              {s.unit && (
                <div className="font-mono text-[9px] text-white/40 mt-1">{s.unit}</div>
              )}
            </div>
          ))}
        </div>

        {/* Optional forecast strip */}
        {data.forecast && <ForecastStrip hours={data.forecast} />}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1 relative">
          <button
            className="text-[11px] tracking-widest uppercase font-mono text-white/80
              hover:text-white flex items-center gap-2 group pointer-events-auto"
          >
            <span>View waypoint</span>
            <span className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
          </button>
          <span className="font-mono text-[10px] text-white/35">{data.coords}</span>
        </div>

      </article>
    </div>
  )
}
