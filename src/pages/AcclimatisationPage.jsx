import { useEffect, useRef, useState } from 'react'
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

// SVG altitude profile
function AltitudeProfile() {
  const points = [
    { x: 0,   y: 280, label: 'Sea Level', alt: '0 m',     sublabel: 'Point of Origin' },
    { x: 90,  y: 237, label: 'Siliguri',  alt: '122 m',   sublabel: 'Gateway to Sikkim' },
    { x: 200, y: 178, label: 'Gangtok',   alt: '1,650 m', sublabel: 'Night 1 — Acclimatise' },
    { x: 340, y: 88,  label: 'Tsomgo',    alt: '3,753 m', sublabel: 'Day 2 — Climb & Return' },
    { x: 460, y: 48,  label: 'Nathu La',  alt: '4,310 m', sublabel: 'Day 3 — The Summit' },
  ]
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-10 overflow-hidden">
      <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/35 mb-6">Altitude Profile</p>
      <svg viewBox="0 -10 500 320" className="w-full" preserveAspectRatio="xMidYMid meet">
        {/* Grid lines */}
        {[0, 100, 200, 300].map(y => (
          <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
        ))}

        {/* Area fill */}
        <defs>
          <linearGradient id="altGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(103,232,249,0.25)" />
            <stop offset="100%" stopColor="rgba(103,232,249,0.02)" />
          </linearGradient>
        </defs>
        <path
          d={`${pathD} L 460 300 L 0 300 Z`}
          fill="url(#altGrad)"
        />

        {/* Profile line */}
        <path
          d={pathD}
          fill="none"
          stroke="rgba(103,232,249,0.7)"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />

        {/* Points */}
        {points.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r="4" fill="#67e8f9" opacity="0.9" />
            <circle cx={p.x} cy={p.y} r="8" fill="none" stroke="#67e8f9" strokeWidth="0.5" opacity="0.4" />
            {/* Label */}
            <text
              x={p.x}
              y={p.y - 16}
              textAnchor="middle"
              fill="rgba(232,237,242,0.85)"
              fontSize="9"
              fontFamily="JetBrains Mono, monospace"
              letterSpacing="0.08em"
            >
              {p.label.toUpperCase()}
            </text>
            <text
              x={p.x}
              y={p.y - 6}
              textAnchor="middle"
              fill="rgba(103,232,249,0.8)"
              fontSize="8"
              fontFamily="JetBrains Mono, monospace"
            >
              {p.alt}
            </text>
          </g>
        ))}
      </svg>

      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-white/[0.06]">
        {[
          ['Ascent Day 3', 'Gangtok → Nathu La: +2,660 m'],
          ['Danger Zone', 'Above 3,500 m: AMS risk rises'],
          ['Safe Window', '3–4 hrs max above 4,000 m'],
        ].map(([k, v]) => (
          <div key={k}>
            <div className="font-mono text-[8px] tracking-widest uppercase text-white/30 mb-1">{k}</div>
            <div className="text-[11px] text-white/60">{v}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const PROTOCOL = [
  {
    day: 'Day 1',
    title: 'Arrive in Gangtok',
    alt: '1,650 m',
    action: 'REST. ACCLIMATISE. HYDRATE.',
    color: 'emerald',
    items: [
      'Arrive before noon if possible — avoid exertion on day of arrival',
      'Drink 3–4 litres of water throughout the day',
      'Eat light. Avoid alcohol completely for 48 hours',
      'Take a short, flat walk in the evening — nothing strenuous',
      'Sleep at this altitude. Your body begins producing extra red blood cells.',
      'Begin Diamox if prescribed: 125 mg twice daily, starting today',
    ],
    quote: '"The mountain does not reward haste. It rewards patience."',
  },
  {
    day: 'Day 2',
    title: 'Day Trip to Tsomgo Lake',
    alt: '3,753 m',
    action: 'CLIMB HIGH. SLEEP LOW.',
    color: 'cyan',
    items: [
      'Ascend to Tsomgo Lake (3,753 m) — this is intentional altitude exposure',
      'Spend 2–3 hours at the lake. Notice how your body feels.',
      'Return to Gangtok for the night — sleeping at lower altitude is essential',
      'This triggers red blood cell production at the kidneys (EPO release)',
      'Mild headache or fatigue at Tsomgo is normal. Severe symptoms: descend.',
      'Avoid sleeping pills — they suppress the breathing response that fights AMS',
    ],
    quote: '"Tsomgo is not the destination. It is the rehearsal."',
  },
  {
    day: 'Day 3',
    title: 'Ascend to Nathu La',
    alt: '4,310 m',
    action: 'GO EARLY. LEAVE BEFORE 15:30.',
    color: 'amber',
    items: [
      'Start by 8:00 AM — altitude effects worsen in the afternoon',
      'Ascend slowly. Stop and breathe if your heart rate is above 120 bpm.',
      'Spend maximum 3–4 hours above 4,000 m',
      'At the pass: walk slowly, breathe deeply, do not run',
      'Watch others around you for confusion or unsteadiness',
      'Descend immediately if any severe AMS signs appear',
    ],
    quote: '"Above 4,000 metres, the mountain decides the terms."',
  },
]

const AMS_LEVELS = [
  {
    level: 'Green',
    title: 'Mild AMS — Continue with Caution',
    color: 'emerald',
    gradient: 'from-emerald-500/20 to-emerald-500/5',
    border: 'border-emerald-500/30',
    symptoms: [
      'Headache that responds to paracetamol',
      'Mild fatigue and weakness',
      'Loss of appetite',
      'Slight nausea',
      'Difficulty sleeping',
    ],
    action: 'Do not ascend further. Rest at current altitude. Rehydrate. Take paracetamol for headache.',
  },
  {
    level: 'Amber',
    title: 'Moderate AMS — Stop Ascending',
    color: 'amber',
    gradient: 'from-amber-500/20 to-amber-500/5',
    border: 'border-amber-500/30',
    symptoms: [
      'Severe headache not responding to pain relief',
      'Persistent vomiting',
      'Increasing fatigue with rest',
      'Breathlessness on mild exertion',
      'Swelling in face or hands',
    ],
    action: 'STOP. Do not ascend. Rest. Take Diamox 250 mg if available. Consider descent if no improvement in 12 hours.',
  },
  {
    level: 'Red',
    title: 'HACE / HAPE — DESCEND IMMEDIATELY',
    color: 'red',
    gradient: 'from-red-500/20 to-red-500/5',
    border: 'border-red-500/30',
    symptoms: [
      'Confusion or altered mental state',
      'Loss of coordination (cannot walk in a straight line)',
      'Extreme breathlessness at rest',
      'Pink or frothy cough (HAPE)',
      'Severe persistent headache + vomiting',
    ],
    action: 'DESCEND IMMEDIATELY. 500–1,000 m descent is the only treatment. Administer supplemental oxygen if available. Reach medical care.',
  },
]

const MEDICATIONS = [
  {
    name: 'Acetazolamide (Diamox)',
    dose: '125–250 mg twice daily',
    timing: 'Start 24h before ascent',
    use: 'Primary prevention and treatment of AMS',
    notes: 'Side effects: increased urination, tingling in fingers/toes, metallic taste with carbonated drinks. Sulfa allergy: contraindicated. Consult a doctor.',
    color: 'cyan',
  },
  {
    name: 'Ibuprofen / Paracetamol',
    dose: '400–600 mg (ibuprofen) or 1 g (paracetamol)',
    timing: 'As needed for headache',
    use: 'Symptom relief only — does not treat underlying AMS',
    notes: 'Take with food. Do not use ibuprofen if stomach is empty at altitude. These mask symptoms but do not address the cause.',
    color: 'white',
  },
  {
    name: 'Dexamethasone',
    dose: '8 mg initial, 4 mg every 6h',
    timing: 'Emergency use only',
    use: 'Reduces cerebral oedema in HACE',
    notes: 'Not a substitute for descent. Carry only if prescribed. Must be administered by or under direction of a medical professional.',
    color: 'amber',
  },
  {
    name: 'Nifedipine',
    dose: '10 mg sublingual, then 30 mg slow-release',
    timing: 'HAPE emergency only',
    use: 'Reduces pulmonary arterial pressure in HAPE',
    notes: 'Only for documented HAPE cases. Pre-prescribe before travel if you have prior history. Descent remains mandatory even if medication administered.',
    color: 'red',
  },
]

const GOLDEN_RULES = [
  'Never ascend if you are symptomatic',
  'Never leave a symptomatic person alone at altitude',
  '"When in doubt, don\'t go up" — and if severe doubt, go down',
  'Descent of 500 m is the only reliable treatment for HACE or HAPE',
  'Alcohol suppresses breathing during sleep — avoid for 48h before ascent',
  'Altitude sickness affects all fitness levels equally — marathon runners get it too',
  'Children, pregnant women, and those with heart or lung conditions: seek medical advice first',
]

export default function AcclimatisationPage() {
  const ref = useRef()
  const [activeDay, setActiveDay] = useState(0)
  useReveal(ref)

  return (
    <PageLayout heroImage="/textures/gurudongmar-lake.jpg">
      <div ref={ref}>

        {/* ─── HERO ─── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-8 pt-32 pb-24">
          <div className="page-enter">
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-cyan-300/70 mb-6">
              High Altitude Medicine
            </p>
            <h1 className="font-serif font-light text-[clamp(52px,8vw,110px)] leading-[0.95] tracking-tight mb-6">
              <span className="hero-gradient">Your Body</span>
              <br />
              <span className="italic text-white/50 text-[0.65em]">at 4,310 Metres</span>
            </h1>
            <p className="max-w-xl mx-auto text-[15px] leading-relaxed text-white/55 font-light mt-6">
              The summit is not a reward for the brave.
              It is a gift for the prepared. Atmospheric pressure at Nathu La
              is 58% of sea level — your body needs time to adjust.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden max-w-2xl w-full page-enter">
            {[
              ['58%', 'Atmospheric pressure vs sea level'],
              ['−40%', 'Oxygen partial pressure'],
              ['24–72 h', 'Time to adapt (red blood cells)'],
              ['3 days', 'Minimum stay protocol'],
            ].map(([val, label]) => (
              <div key={label} className="bg-[#05080e]/70 px-6 py-5 text-center">
                <div className="font-serif text-[26px] leading-none text-white/90 mb-1">{val}</div>
                <div className="font-mono text-[9px] tracking-[0.2em] uppercase text-white/35">{label}</div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/60">Scroll</span>
            <div className="relative w-px h-12 bg-white/20 overflow-hidden scroll-cue-line" />
          </div>
        </section>

        {/* ─── THE SCIENCE ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <div data-reveal>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-3">The Physiology</p>
                  <h2 className="font-serif font-light text-[clamp(36px,5vw,60px)] leading-tight mb-6">
                    What Happens<br />
                    <span className="text-gradient-cyan">Above 3,500 m</span>
                  </h2>
                  <div className="space-y-4 text-[14px] text-white/60 leading-relaxed">
                    <p>
                      As altitude increases, atmospheric pressure falls. At Nathu La (4,310 m),
                      pressure is approximately 590 hPa — compared to 1,013 hPa at sea level.
                      Each breath delivers 40% less oxygen to your lungs.
                    </p>
                    <p>
                      Your body responds immediately: breathing rate increases, heart rate rises,
                      and blood becomes more acidic (respiratory alkalosis). Over 24–72 hours,
                      your kidneys release erythropoietin (EPO), stimulating new red blood cell
                      production to carry more oxygen.
                    </p>
                    <p>
                      This process cannot be rushed. Ascending too quickly overwhelms the
                      brain and lungs before adaptation occurs — causing Acute Mountain
                      Sickness (AMS), and in severe cases, HACE or HAPE.
                    </p>
                  </div>
                </div>
              </div>

              <div data-reveal>
                <AltitudeProfile />
              </div>
            </div>
          </div>
        </section>

        {/* ─── 3-DAY PROTOCOL ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-5xl mx-auto">
            <div data-reveal className="mb-12">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-3">The Schedule</p>
              <h2 className="font-serif font-light text-[clamp(36px,5vw,64px)] leading-tight">
                Three Days.<br />
                <span className="italic text-white/40">No Shortcuts.</span>
              </h2>
            </div>

            {/* Day selector */}
            <div data-reveal className="flex gap-3 mb-8 flex-wrap">
              {PROTOCOL.map((p, i) => (
                <button
                  key={i}
                  onClick={() => setActiveDay(i)}
                  className={`px-5 py-2 rounded-full text-[12px] font-mono tracking-widest uppercase transition-all duration-300 ${
                    activeDay === i
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-white/40 border border-white/10 hover:text-white/70 hover:border-white/20'
                  }`}
                >
                  {p.day}
                </button>
              ))}
            </div>

            {PROTOCOL.map((p, i) => {
              if (i !== activeDay) return null
              const colorMap = {
                emerald: { badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-400' },
                cyan:    { badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',          dot: 'bg-cyan-400' },
                amber:   { badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',       dot: 'bg-amber-400' },
              }
              const c = colorMap[p.color]
              return (
                <div key={i} className="glass-strong rounded-3xl p-8 md:p-12">
                  <div className="flex items-start justify-between flex-wrap gap-4 mb-8">
                    <div>
                      <span className={`inline-block font-mono text-[9px] tracking-[0.25em] uppercase px-3 py-1.5 rounded-full border mb-4 ${c.badge}`}>
                        {p.day} · {p.action}
                      </span>
                      <h3 className="font-serif text-[32px] leading-tight">{p.title}</h3>
                    </div>
                    <div className="text-right">
                      <div className="font-mono text-[10px] tracking-widest uppercase text-white/30">Elevation</div>
                      <div className="font-serif text-[36px] text-cyan-300/80">{p.alt}</div>
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {p.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-3">
                        <span className={`flex-none w-1.5 h-1.5 rounded-full mt-2 ${c.dot}`} />
                        <span className="text-[14px] text-white/65 leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <blockquote className="border-l-2 border-white/15 pl-6 italic font-serif text-[18px] text-white/40">
                    {p.quote}
                  </blockquote>
                </div>
              )
            })}
          </div>
        </section>

        {/* ─── AMS LEVELS ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div data-reveal className="mb-16">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-3">Symptom Recognition</p>
              <h2 className="font-serif font-light text-[clamp(36px,5vw,64px)] leading-tight">
                Know the<br />
                <span className="text-gradient-cyan">Warning Signs</span>
              </h2>
            </div>

            <div className="space-y-6">
              {AMS_LEVELS.map((level) => {
                const colorMap = {
                  emerald: { title: 'text-emerald-300', badge: 'bg-emerald-500' },
                  amber:   { title: 'text-amber-300',   badge: 'bg-amber-500' },
                  red:     { title: 'text-red-400',     badge: 'bg-red-500' },
                }
                const c = colorMap[level.color]
                return (
                  <div
                    key={level.level}
                    data-reveal
                    className={`glass rounded-3xl p-8 md:p-10 bg-gradient-to-br ${level.gradient} border ${level.border}`}
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <div className={`flex-none w-3 h-3 rounded-full mt-1.5 ${c.badge}`} />
                      <div>
                        <span className={`font-mono text-[10px] tracking-[0.25em] uppercase ${c.title} block mb-1`}>
                          {level.level} Alert
                        </span>
                        <h3 className={`font-serif text-[24px] ${c.title}`}>{level.title}</h3>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div>
                        <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-3">Symptoms</p>
                        <ul className="space-y-2">
                          {level.symptoms.map((s, i) => (
                            <li key={i} className="text-[13px] text-white/65 flex items-start gap-2">
                              <span className="text-white/25 mt-0.5">—</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="font-mono text-[9px] tracking-widest uppercase text-white/30 mb-3">Action</p>
                        <p className={`text-[14px] leading-relaxed font-medium ${c.title}`}>{level.action}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── MEDICATIONS ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div data-reveal className="mb-16">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-3">Pharmacology</p>
              <h2 className="font-serif font-light text-[clamp(36px,5vw,64px)] leading-tight">
                The Medicine<br />
                <span className="italic text-white/40">Cabinet</span>
              </h2>
              <p className="text-[14px] text-white/40 mt-4 max-w-xl">
                Consult a physician before any altitude journey. These notes are informational only and do not constitute medical advice.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {MEDICATIONS.map((med) => {
                const accent = med.color === 'cyan' ? 'text-cyan-300' : med.color === 'amber' ? 'text-amber-400' : med.color === 'red' ? 'text-red-400' : 'text-white/80'
                const border = med.color === 'cyan' ? 'border-cyan-400/20' : med.color === 'amber' ? 'border-amber-400/20' : med.color === 'red' ? 'border-red-400/20' : 'border-white/10'
                return (
                  <div key={med.name} data-reveal className={`glass-strong rounded-2xl p-8 border ${border}`}>
                    <h3 className={`font-serif text-[22px] mb-1 ${accent}`}>{med.name}</h3>
                    <div className="space-y-2 mt-4 mb-4">
                      {[['Dose', med.dose], ['Timing', med.timing], ['Use', med.use]].map(([k, v]) => (
                        <div key={k} className="flex gap-3">
                          <span className="font-mono text-[9px] tracking-widest uppercase text-white/25 w-14 flex-none mt-0.5">{k}</span>
                          <span className="text-[13px] text-white/65">{v}</span>
                        </div>
                      ))}
                    </div>
                    <hr className="rule-thin mb-4" />
                    <p className="font-mono text-[10px] leading-relaxed text-white/35">{med.notes}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ─── GOLDEN RULES ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-4xl mx-auto">
            <div data-reveal className="mb-12">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-3">The Cardinal Laws</p>
              <h2 className="font-serif font-light text-[clamp(36px,5vw,64px)] leading-tight">
                Seven Rules<br />
                <span className="text-gradient-gold">You Do Not Break</span>
              </h2>
            </div>

            <ol className="space-y-4">
              {GOLDEN_RULES.map((rule, i) => (
                <li key={i} data-reveal className="flex gap-6 items-center glass rounded-2xl px-8 py-6">
                  <span className="font-serif text-[48px] text-white/[0.06] leading-none flex-none w-10 text-right">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[15px] text-white/70 leading-relaxed">{rule}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section data-reveal className="py-24 px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass-strong rounded-3xl p-12">
              <p className="font-serif italic text-[28px] text-white/50 mb-6 leading-snug">
                "Climb high. Sleep low.<br />
                Descend at the first sign of doubt."
              </p>
              <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/25 mb-8">
                The Himalayan climber's first commandment
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/permits"
                  className="px-8 py-3 rounded-full bg-white/95 text-slate-900 text-[13px] font-medium tracking-wide hover:bg-white transition-colors"
                >
                  Get Your Permits
                </Link>
                <Link
                  to="/gear"
                  className="px-8 py-3 rounded-full border border-white/20 text-[13px] tracking-wide text-white/70 hover:text-white hover:border-white/40 transition-colors"
                >
                  Pack the Gear
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  )
}
