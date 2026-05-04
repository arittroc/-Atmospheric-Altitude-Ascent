const LINKS = ['The Route', 'Permits', 'Acclimatisation', 'Silk Route Journal']

export default function Nav() {
  return (
    <header className="pointer-events-auto fixed top-0 inset-x-0 z-40">
      <div className="mx-auto max-w-[1480px] px-8 pt-6">
        <nav className="glass rounded-full px-6 py-3 flex items-center justify-between">

          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group" aria-label="Nathu La home">
            <span className="relative w-7 h-7 grid place-items-center">
              <span className="absolute inset-0 rounded-full border border-white/20" />
              <svg viewBox="0 0 28 28" className="w-5 h-5" aria-hidden="true">
                <path
                  d="M4 22 L10 12 L14 17 L19 8 L24 22 Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinejoin="round"
                  className="text-white/90"
                />
              </svg>
            </span>
            <span className="font-serif text-[20px] tracking-wide text-white/95 leading-none select-none">
              Nathu<span className="italic font-light text-white/60">.la</span>
            </span>
          </a>

          {/* Nav links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {LINKS.map((label, i) => (
              <li key={label}>
                <a
                  href="#"
                  className={`px-4 py-2 rounded-full text-[13px] tracking-wide transition-colors duration-200
                    ${i === 0
                      ? 'text-white bg-white/[0.06]'
                      : 'text-white/70 hover:text-white hover:bg-white/[0.04]'
                    }`}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          {/* Right cluster */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full hairline">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300/80 pulse-dot" aria-hidden="true" />
              <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/60 select-none">
                Pass open · 4,310 m · Wed–Sun
              </span>
            </div>
            <button
              className="px-4 py-2 rounded-full bg-white/95 text-slate-900 text-[13px] font-medium tracking-wide
                hover:bg-white transition-colors duration-200 select-none"
              aria-label="Apply for a permit to visit Nathu La"
            >
              Apply for permit
            </button>
          </div>

        </nav>
      </div>
    </header>
  )
}
