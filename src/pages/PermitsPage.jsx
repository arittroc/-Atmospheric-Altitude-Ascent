import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import PageLayout from '../components/PageLayout'

gsap.registerPlugin(ScrollTrigger)

function useReveal(ref) {
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-reveal]').forEach(el => {
        gsap.to(el, {
          y: 0, opacity: 1, duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        })
      })
    }, ref)
    return () => ctx.revert()
  }, [ref])
}

const PERMITS = [
  {
    num: '01',
    seal: 'GOI',
    title: 'Inner Line Permit',
    subtitle: 'Mandatory for entry into Sikkim',
    who: 'All Indian nationals',
    cost: 'Free',
    validity: '15–30 days',
    processing: 'Instant online / Same day in-person',
    where: 'sikkimtourism.gov.in · Gangtok · Siliguri · NJP · Delhi',
    note: 'Carry original + 1 photocopy. Required at Rangpo checkpoint upon entering Sikkim.',
    color: 'cyan',
  },
  {
    num: '02',
    seal: 'DC',
    title: 'Nathu La Day Pass',
    subtitle: 'For the pass itself — beyond Tsomgo',
    who: 'Indian nationals only (foreigners not permitted)',
    cost: '₹100 per person',
    validity: 'Single day',
    processing: '24–48 hrs advance booking',
    where: 'Via registered Gangtok tour operators only. Individual applications not accepted.',
    note: 'Subject to army clearance. Cancellations happen without notice. Depart Nathu La before 3:30 PM.',
    color: 'amber',
  },
  {
    num: '03',
    seal: 'WL',
    title: 'Tsomgo Lake Entry',
    subtitle: 'Wildlife permit for the lake zone',
    who: 'All tourists — Indian and foreign',
    cost: '₹100–200 per person',
    validity: 'Single day',
    processing: 'On-site at the gate',
    where: 'Tsomgo Lake checkpoint (38 km from Gangtok)',
    note: 'Foreign nationals may visit Tsomgo Lake and Baba Mandir but are restricted from proceeding to Nathu La.',
    color: 'emerald',
  },
]

const CHECKPOINTS = [
  { km: 0,  alt: '1,650 m', name: 'Rangpo',         note: 'ILP verification — entry to Sikkim' },
  { km: 14, alt: '2,440 m', name: 'Gangtok',         note: 'Collect Nathu La Day Pass from tour operator' },
  { km: 38, alt: '3,753 m', name: 'Tsomgo Lake Gate', note: 'Wildlife permit check. Foreigners stop here.' },
  { km: 48, alt: '4,023 m', name: 'Kupup Post',       note: 'Army checkpoint. ID verification. No cameras.' },
  { km: 56, alt: '4,310 m', name: 'Nathu La',          note: 'Final gate. Day pass + ID mandatory. Leave by 15:30.' },
]

const DOCS = [
  'Government photo ID (original) — Passport / Aadhar / Voter ID / DL',
  '1 photocopy of your ID document',
  '2 passport-size photographs',
  'Hotel or accommodation booking confirmation',
  'Tour operator booking slip (for Nathu La pass)',
  'Inner Line Permit printout or digital copy',
]

const RULES = [
  { icon: '⊘', color: 'red', title: 'No Photography Near Posts', body: 'Photography within 300 m of any Indian Army installation is strictly prohibited. Confiscation and detention are enforced.' },
  { icon: '⊘', color: 'red', title: 'No Drones', body: 'Unmanned aerial vehicles are explicitly illegal. All drones will be confiscated. Criminal charges may apply.' },
  { icon: '⊘', color: 'amber', title: 'Day Trip Only', body: 'No overnight stays are permitted at Nathu La. All tourists must descend to Gangtok or below before 6 PM.' },
  { icon: '⊘', color: 'amber', title: 'Registered Vehicles Only', body: 'Private cars from outside Sikkim are not permitted beyond Tsomgo Lake. You must hire a Sikkim-registered taxi or jeep.' },
  { icon: '⊘', color: 'amber', title: 'Children Under 5 Not Recommended', body: 'Altitude of 4,310 m poses serious risk to young children. Medical advice mandatory before bringing children under 5.' },
  { icon: 'ℹ', color: 'cyan', title: 'Open Wed, Thu, Sat, Sun Only', body: 'The pass is closed Monday, Tuesday, and Friday. It may also close without notice due to weather, military operations, or diplomatic events.' },
]

export default function PermitsPage() {
  const ref = useRef()
  useReveal(ref)

  return (
    <PageLayout>
      <div ref={ref}>

        {/* ─── HERO ─── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-8 pt-32 pb-24">
          <div className="page-enter">
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-cyan-300/70 mb-6">
              Before You Ascend
            </p>
            <h1 className="font-serif font-light text-[clamp(52px,8vw,110px)] leading-[0.95] tracking-tight mb-6">
              <span className="hero-gradient">The Gatekeepers</span>
              <br />
              <span className="italic text-white/50 text-[0.65em]">of the Pass</span>
            </h1>
            <p className="max-w-xl mx-auto text-[15px] leading-relaxed text-white/55 font-light mt-6">
              Nathu La sits at 4,310 metres on the Indo-Tibetan border — a restricted military zone
              requiring advance permits. Foreign nationals may not enter beyond Tsomgo Lake.
              Plan at least two days ahead.
            </p>
          </div>

          {/* Quick stat row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden max-w-2xl w-full page-enter">
            {[
              ['4,310 m', 'Summit elevation'],
              ['4 permits', 'Required documents'],
              ['24–48 h', 'Advance booking'],
              ['3:30 PM', 'Last entry cutoff'],
            ].map(([val, label]) => (
              <div key={label} className="bg-[#05080e]/70 px-6 py-5 text-center">
                <div className="font-serif text-[26px] leading-none text-white/90 mb-1">{val}</div>
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/35">{label}</div>
              </div>
            ))}
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/60">Scroll</span>
            <div className="relative w-px h-12 bg-white/20 overflow-hidden scroll-cue-line" />
          </div>
        </section>

        {/* ─── PERMIT TYPES ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div data-reveal className="mb-16">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-3">Documentation</p>
              <h2 className="font-serif font-light text-[clamp(36px,5vw,64px)] leading-tight">
                Three Documents,<br />
                <span className="text-gradient-cyan">One Pass</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {PERMITS.map((p) => {
                const accent = p.color === 'cyan' ? 'text-cyan-300' : p.color === 'amber' ? 'text-amber-400' : 'text-emerald-400'
                const border = p.color === 'cyan' ? 'border-cyan-400/20' : p.color === 'amber' ? 'border-amber-400/20' : 'border-emerald-400/20'
                return (
                  <article key={p.num} data-reveal className={`glass-strong rounded-3xl p-8 flex flex-col border ${border}`}>

                    {/* Seal + number */}
                    <div className="flex items-start justify-between mb-6">
                      <div className={`w-12 h-12 rounded-full border ${border} grid place-items-center`}>
                        <span className={`font-mono text-[10px] tracking-widest uppercase ${accent}`}>{p.seal}</span>
                      </div>
                      <span className={`font-mono text-[10px] tracking-widest ${accent} opacity-50`}>{p.num} / 03</span>
                    </div>

                    <h3 className="font-serif text-[26px] leading-tight mb-1">{p.title}</h3>
                    <p className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40 mb-6">{p.subtitle}</p>

                    <hr className="rule-thin mb-6" />

                    <div className="space-y-3 flex-1">
                      {[
                        ['Required by', p.who],
                        ['Cost', p.cost],
                        ['Valid for', p.validity],
                        ['Processing', p.processing],
                        ['Where', p.where],
                      ].map(([k, v]) => (
                        <div key={k}>
                          <span className="font-mono text-[9px] tracking-widest uppercase text-white/30 block mb-0.5">{k}</span>
                          <span className="text-[13px] text-white/75 leading-snug">{v}</span>
                        </div>
                      ))}
                    </div>

                    <div className={`mt-6 rounded-xl px-4 py-3 bg-white/[0.03] border ${border}`}>
                      <p className="font-mono text-[10px] leading-relaxed text-white/50">{p.note}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── ROUTE CHECKPOINTS ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-4xl mx-auto">
            <div data-reveal className="mb-16">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-3">Route Clearance</p>
              <h2 className="font-serif font-light text-[clamp(36px,5vw,64px)] leading-tight">
                Five Checkpoints<br />
                <span className="italic text-white/40">to the Summit</span>
              </h2>
            </div>

            <div className="relative">
              {/* Vertical spine */}
              <div className="absolute left-[27px] top-8 bottom-8 w-px bg-gradient-to-b from-cyan-400/40 via-white/10 to-amber-400/30" />

              <ol className="space-y-0">
                {CHECKPOINTS.map((cp, i) => (
                  <li key={cp.km} data-reveal className="relative flex gap-8 pb-10 last:pb-0">
                    {/* Dot */}
                    <div className="flex-none w-14 flex justify-center">
                      <div className={`relative w-4 h-4 rounded-full border mt-1 z-10
                        ${i === CHECKPOINTS.length - 1
                          ? 'border-amber-400/80 bg-amber-400/20'
                          : 'border-cyan-400/50 bg-cyan-400/10'}`}
                      >
                        {i === CHECKPOINTS.length - 1 && (
                          <span className="absolute inset-0 rounded-full border border-amber-400/40 animate-ping" />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="glass rounded-2xl px-6 py-5 flex-1">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <h3 className="font-serif text-[20px] leading-tight">{cp.name}</h3>
                          <p className="text-[13px] text-white/55 mt-1 leading-relaxed">{cp.note}</p>
                        </div>
                        <div className="text-right flex-none">
                          <div className="font-mono text-[10px] tracking-widest uppercase text-white/35">km {cp.km}</div>
                          <div className="font-serif text-[18px] text-cyan-300/80">{cp.alt}</div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ─── DOCUMENTS CHECKLIST ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-4xl mx-auto">
            <div data-reveal className="mb-12">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-3">What to Carry</p>
              <h2 className="font-serif font-light text-[clamp(36px,5vw,64px)] leading-tight">
                Documents<br />
                <span className="text-gradient-cyan">Checklist</span>
              </h2>
            </div>

            <div data-reveal className="glass-strong rounded-3xl p-8 md:p-10">
              <ul className="space-y-4">
                {DOCS.map((doc, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <span className="flex-none w-6 h-6 rounded-full border border-cyan-400/40 bg-cyan-400/10 grid place-items-center mt-0.5">
                      <svg className="w-3 h-3 text-cyan-300" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
                        <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-[14px] text-white/70 leading-relaxed">{doc}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-8 border-t border-white/[0.06]">
                <p className="font-mono text-[11px] tracking-wide text-amber-400/70 leading-relaxed">
                  ⚠ Checkpoint officers may refuse entry without original documents. Digital copies alone are insufficient at Rangpo and Kupup.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ─── RULES ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div data-reveal className="mb-16">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-3">At the Border</p>
              <h2 className="font-serif font-light text-[clamp(36px,5vw,64px)] leading-tight">
                Rules of<br />
                <span className="italic text-white/40">the Zone</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {RULES.map((r, i) => {
                const colorMap = {
                  red:   { border: 'border-red-500/25',   icon: 'text-red-400',   bg: 'bg-red-500/5' },
                  amber: { border: 'border-amber-500/25', icon: 'text-amber-400', bg: 'bg-amber-500/5' },
                  cyan:  { border: 'border-cyan-500/25',  icon: 'text-cyan-400',  bg: 'bg-cyan-500/5' },
                }
                const c = colorMap[r.color]
                return (
                  <div key={i} data-reveal className={`glass rounded-2xl p-6 border ${c.border} ${c.bg}`}>
                    <div className={`font-mono text-[18px] ${c.icon} mb-3`}>{r.icon}</div>
                    <h3 className="font-serif text-[18px] mb-2">{r.title}</h3>
                    <p className="text-[13px] text-white/55 leading-relaxed">{r.body}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section data-reveal className="py-24 px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass-strong rounded-3xl p-12">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-4">Ready to ascend?</p>
              <h2 className="font-serif font-light text-[40px] mb-4">Begin Your Journey</h2>
              <p className="text-[14px] text-white/50 leading-relaxed mb-8">
                Book your Nathu La permit through any registered tour operator in Gangtok.
                Allow 48 hours and carry every document twice over.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/acclimatisation"
                  className="px-8 py-3 rounded-full bg-white/95 text-slate-900 text-[13px] font-medium tracking-wide hover:bg-white transition-colors"
                >
                  Plan Acclimatisation
                </Link>
                <Link
                  to="/gear"
                  className="px-8 py-3 rounded-full border border-white/20 text-[13px] tracking-wide text-white/70 hover:text-white hover:border-white/40 transition-colors"
                >
                  What to Pack
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  )
}
