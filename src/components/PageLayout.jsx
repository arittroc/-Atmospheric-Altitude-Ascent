import { Link } from 'react-router-dom'
import Nav from '../ui/Nav'
import SiteFooter from '../ui/Footer'

function Footer() {
  return (
    <footer className="relative z-10 border-t border-white/[0.06] mt-32">
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-16">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          <div>
            <Link to="/" className="flex items-center gap-3 mb-4">
              <svg viewBox="0 0 28 28" className="w-5 h-5 text-white/60" fill="none" stroke="currentColor" strokeWidth="1" strokeLinejoin="round">
                <path d="M4 22 L10 12 L14 17 L19 8 L24 22 Z" />
              </svg>
              <span className="font-serif text-[18px] text-white/70">
                Nathu<span className="italic font-light text-white/40">.la</span>
              </span>
            </Link>
            <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-white/30">
              4,310 m · Indo-Tibetan Border · East Sikkim
            </p>
          </div>

          <nav className="flex flex-wrap gap-6" aria-label="Footer navigation">
            {[
              ['The Route', '/'],
              ['Permits', '/permits'],
              ['Acclimatisation', '/acclimatisation'],
              ['Silk Route Journal', '/journal'],
              ['Gear', '/gear'],
            ].map(([label, to]) => (
              <Link key={to} to={to} className="font-mono text-[11px] tracking-widest uppercase text-white/40 hover:text-white/80 transition-colors">
                {label}
              </Link>
            ))}
          </nav>

        </div>

        <div className="mt-12 pt-8 border-t border-white/[0.04]">
          <p className="font-mono text-[10px] tracking-wide text-white/20 text-center">
            Nathu La is a restricted military zone. All visitors must carry valid permits.
            The pass is open to Indian nationals only on Wed, Thu, Sat, Sun.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function PageLayout({ children, heroImage = '/textures/nathula-pass.jpg' }) {
  return (
    <div className="relative min-h-screen bg-[#05080e] text-[#e8edf2]">

      {/* Fixed mountain photo background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url("${heroImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 40%',
          filter: 'brightness(0.18) saturate(0.6)',
          willChange: 'transform',
        }}
      />

      {/* Atmospheric overlays */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Vignette */}
        <div style={{ background: 'radial-gradient(ellipse 90% 80% at 50% 50%, transparent 30%, rgba(5,8,14,0.7) 100%)', position: 'absolute', inset: 0 }} />
        {/* Top gradient for nav */}
        <div style={{ background: 'linear-gradient(180deg, rgba(5,8,14,0.9) 0%, transparent 30%)', position: 'absolute', inset: 0 }} />
        {/* Bottom gradient */}
        <div style={{ background: 'linear-gradient(0deg, rgba(5,8,14,0.95) 0%, transparent 40%)', position: 'absolute', inset: 0 }} />
        {/* Film grain */}
        <div
          className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '3px 3px' }}
        />
      </div>

      <Nav />

      <main className="relative z-10">
        {children}
      </main>

      <Footer />
      <SiteFooter />
    </div>
  )
}
