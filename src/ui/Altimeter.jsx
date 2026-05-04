import { ALTIMETER_MARKS, ROUTE_START, ROUTE_END, getAltitude } from '../data/waypoints'

export default function Altimeter({ progress }) {
  const currentElev = getAltitude(progress)
  const needleRot   = -135 + progress * 270

  const pctOf = (m) => (m - ROUTE_START) / (ROUTE_END - ROUTE_START)

  return (
    <aside
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40
        hidden md:flex flex-col items-center gap-4 pointer-events-none select-none"
      aria-label="Altitude indicator"
    >
      {/* Elevation readout chip */}
      <div className="glass rounded-2xl px-3 py-2 flex flex-col items-center min-w-[116px]">
        <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/50">Altitude</span>
        <span className="font-serif text-[27px] leading-none mt-1 tabular-nums">
          {currentElev.toLocaleString()}
        </span>
        <span className="font-mono text-[10px] text-white/50 tracking-wider mt-0.5">metres</span>
      </div>

      {/* Vertical rail */}
      <div className="glass rounded-full p-3 flex flex-col items-center">
        <div className="relative w-6 h-[340px]">

          {/* Track */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/15" />

          {/* Fill — progress goes bottom → top */}
          <div
            className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[1.5px] bg-gradient-to-t from-cyan-400/0 via-cyan-200/70 to-white"
            style={{ height: `${progress * 100}%`, willChange: 'height' }}
          />

          {/* Glowing progress dot */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white
              shadow-[0_0_8px_2px_rgba(180,220,255,0.8)] -translate-y-1/2"
            style={{ bottom: `${progress * 100}%`, willChange: 'bottom' }}
          />

          {/* Waypoint ticks */}
          {ALTIMETER_MARKS.map((mk) => {
            const p       = pctOf(mk.m)
            const reached = progress >= p - 0.005
            return (
              <div
                key={mk.m}
                className="absolute left-1/2 -translate-x-1/2 flex items-center"
                style={{ bottom: `calc(${p * 100}% - 4px)` }}
              >
                <span
                  className={`absolute right-4 whitespace-nowrap font-mono text-[9px]
                    tracking-widest uppercase transition-colors duration-300
                    ${reached ? 'text-white' : 'text-white/35'}`}
                >
                  {mk.label}
                </span>
                <span
                  className={`block w-2 h-2 rounded-full border transition-all duration-300
                    ${reached
                      ? 'bg-white border-white shadow-[0_0_12px_rgba(180,220,255,0.7)]'
                      : 'bg-transparent border-white/30'}`}
                />
                <span
                  className={`absolute left-4 font-mono text-[9px] tracking-widest
                    tabular-nums transition-colors duration-300
                    ${reached ? 'text-white/80' : 'text-white/30'}`}
                >
                  {mk.m.toLocaleString()}m
                </span>
              </div>
            )
          })}

        </div>
      </div>

      {/* Compass / grade dial */}
      <div className="glass rounded-full w-[112px] h-[112px] grid place-items-center relative">
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          aria-hidden="true"
        >
          <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.5" />
          {[...Array(24)].map((_, i) => {
            const angle = (i / 24) * 360
            const long  = i % 6 === 0
            return (
              <line
                key={i}
                x1="50" y1={long ? 8 : 10}
                x2="50" y2={long ? 14 : 12}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="0.5"
                transform={`rotate(${angle} 50 50)`}
              />
            )
          })}
          {/* Needle */}
          <g style={{ transform: `rotate(${needleRot}deg)`, transformOrigin: '50% 50%', transition: 'transform 700ms cubic-bezier(0.22,1,0.36,1)' }}>
            <line x1="50" y1="50" x2="50" y2="14"
              stroke="oklch(0.92 0.08 220)" strokeWidth="1" strokeLinecap="round" />
            <circle cx="50" cy="50" r="2" fill="oklch(0.92 0.08 220)" />
          </g>
        </svg>
        <div className="text-center relative">
          <div className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/50">Grade</div>
          <div className="font-serif text-[15px] mt-0.5 tabular-nums">
            {Math.round(progress * 12)}°
          </div>
        </div>
      </div>

    </aside>
  )
}
