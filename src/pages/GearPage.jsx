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

const LAYERS = [
  {
    num: '03',
    name: 'Shell Layer',
    icon: '◈',
    desc: 'Waterproof. Windproof. Non-negotiable.',
    detail: 'Gore-Tex or equivalent. Wind at Nathu La can reach 80 km/h with gusts beyond 100 km/h. Temperature with wind chill can feel below −20°C even in August. Your shell must be both waterproof and windproof. Softshells are insufficient.',
    items: ['Hardshell jacket (taped seams)', 'Waterproof shell pants', 'Gaiters (Oct–Apr)'],
    color: 'from-slate-800/40 to-slate-900/20',
    border: 'border-white/15',
    label: 'text-white/85',
  },
  {
    num: '02',
    name: 'Mid Layer',
    icon: '◇',
    desc: 'Insulation. Warmth. Packability.',
    detail: 'A 600+ fill-power down jacket or high-loft fleece. This is your thermal mass. At rest at 4,310 m in shade, body temperature drops faster than expected. Pack two mid-layers if visiting between October and March.',
    items: ['Down jacket (600+ fill power)', 'Fleece mid-layer', 'Insulated gloves'],
    color: 'from-slate-700/30 to-slate-800/15',
    border: 'border-white/10',
    label: 'text-white/75',
  },
  {
    num: '01',
    name: 'Base Layer',
    icon: '◻',
    desc: 'Moisture management. Next to skin.',
    detail: 'Merino wool or moisture-wicking synthetic. Never cotton. Cotton absorbs sweat and holds it against your skin — in mountain conditions, this causes rapid heat loss and hypothermia. Merino is odour-resistant and temperature-regulating.',
    items: ['Merino wool or synthetic thermal top', 'Thermal leggings', 'Merino wool socks ×3 pairs'],
    color: 'from-slate-600/20 to-slate-700/10',
    border: 'border-white/[0.07]',
    label: 'text-white/65',
  },
]

const CATEGORIES = [
  {
    id: 'safety',
    title: 'Safety & Medical',
    icon: '✦',
    accent: 'text-red-400',
    items: [
      { name: 'Acetazolamide (Diamox)', note: 'Prescribed. Start 24h before ascent.', weight: '5 g' },
      { name: 'Paracetamol + Ibuprofen', note: 'AMS headache management.', weight: '30 g' },
      { name: 'Pulse oximeter', note: 'Under ₹1,500. Tells you O₂ saturation.', weight: '35 g' },
      { name: 'Personal first-aid kit', note: 'Bandages, antiseptic, blister care.', weight: '150 g' },
      { name: 'Emergency contact card', note: 'Hotel number, tour operator, local hospital.', weight: '1 g' },
      { name: 'Portable O₂ can', note: 'Optional. Available to hire in Gangtok.', weight: '600 g' },
    ],
  },
  {
    id: 'clothing',
    title: 'Clothing',
    icon: '◈',
    accent: 'text-cyan-400',
    items: [
      { name: 'Down jacket (600+ fill power)', note: 'Non-negotiable. Core warmth.', weight: '400 g' },
      { name: 'Waterproof hardshell jacket', note: 'Taped seams. Gore-Tex or equiv.', weight: '500 g' },
      { name: 'Waterproof shell pants', note: 'Over your thermal leggings.', weight: '250 g' },
      { name: 'Thermal base layer (top + bottom)', note: 'Merino or synthetic. No cotton.', weight: '300 g' },
      { name: 'Fleece mid-layer', note: 'Between down jacket and base.', weight: '350 g' },
      { name: 'Warm gloves', note: 'Waterproof outer + liner glove system.', weight: '160 g' },
      { name: 'Balaclava or warm hat', note: '30% of body heat lost through head.', weight: '80 g' },
      { name: 'Neck gaiter', note: 'Against wind and dust.', weight: '60 g' },
      { name: 'Wool socks ×3 pairs', note: 'Change into dry socks at the pass.', weight: '200 g' },
      { name: 'Waterproof hiking boots', note: 'Ankle support. Waterproof. Broken-in.', weight: '900 g' },
    ],
  },
  {
    id: 'essentials',
    title: 'Essentials',
    icon: '◉',
    accent: 'text-amber-400',
    items: [
      { name: 'Sunglasses (Cat 3–4 UV)', note: 'Glacial UV is intense. Snow blindness is real.', weight: '30 g' },
      { name: 'Sunscreen SPF 50+', note: 'Face + neck + hands. Every 2h.', weight: '90 g' },
      { name: 'Lip balm with SPF', note: 'Extreme dryness at altitude.', weight: '10 g' },
      { name: 'Insulated water flask (1.5–2 L)', note: 'Standard bottles freeze. Insulation mandatory.', weight: '300 g' },
      { name: 'High-energy snacks', note: 'Altitude suppresses appetite. Eat anyway.', weight: '300 g' },
      { name: 'Offline maps downloaded', note: 'No signal above Tsomgo. Google Maps offline.', weight: '— g' },
      { name: 'Permit copies — digital + physical', note: 'Two formats, every checkpoint.', weight: '5 g' },
      { name: 'Power bank (20,000 mAh)', note: 'Cold kills batteries in 30 minutes.', weight: '450 g' },
      { name: 'Head torch + spare batteries', note: 'Early starts. Unexpected delays.', weight: '120 g' },
    ],
  },
  {
    id: 'photography',
    title: 'Photography',
    icon: '◎',
    accent: 'text-violet-400',
    items: [
      { name: 'Extra camera batteries ×2', note: 'Cold halves battery life. Each one counts.', weight: '200 g' },
      { name: 'Hand warmers', note: 'Keep batteries warm in outer pocket.', weight: '50 g' },
      { name: 'Lens cloth ×3', note: 'Condensation between hot/cold zones is relentless.', weight: '30 g' },
      { name: 'Circular polarising filter', note: 'Cuts snow glare. Essential for blue sky shots.', weight: '80 g' },
      { name: 'Rain sleeve or dry bag', note: 'Sudden snow is common.', weight: '100 g' },
      { name: 'Lightweight tripod', note: 'For dawn shots. Gorilla pod works well.', weight: '700 g' },
    ],
  },
]

const DONTS = [
  { item: 'Drones', reason: 'Explicitly illegal. Confiscated. Criminal charges possible.' },
  { item: 'Alcohol', reason: 'Altitude + alcohol = dangerous. Also restricted near army zones.' },
  { item: 'Aerosol cans', reason: 'Pressure issues at altitude. Potential hazard near army installations.' },
  { item: 'Open-flame lighters', reason: 'Army checkpoints are strict about fire sources.' },
  { item: 'Junk food / excessive sugar', reason: 'Blood sugar crashes are worse at altitude. Bring slow-release energy.' },
  { item: 'Sleeping pills', reason: 'Suppress the breathing reflex — dangerous during altitude acclimatisation.' },
  { item: 'Cotton clothing', reason: 'Stays wet, causes hypothermia. Never cotton next to skin.' },
]

const TOTAL_WEIGHT = '6.8 kg'

export default function GearPage() {
  const ref = useRef()
  const [activeCategory, setActiveCategory] = useState('safety')
  const [checked, setChecked] = useState({})
  useReveal(ref)

  const toggleCheck = (id, name) => {
    setChecked(prev => ({ ...prev, [`${id}-${name}`]: !prev[`${id}-${name}`] }))
  }

  const activeItems = CATEGORIES.find(c => c.id === activeCategory)?.items || []
  const checkedCount = Object.values(checked).filter(Boolean).length
  const totalItems = CATEGORIES.reduce((sum, c) => sum + c.items.length, 0)

  return (
    <PageLayout>
      <div ref={ref}>

        {/* ─── HERO ─── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-8 pt-32 pb-24">
          <div className="page-enter">
            <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-amber-300/70 mb-6">
              Equipment Guide
            </p>
            <h1 className="font-serif font-light text-[clamp(52px,8vw,110px)] leading-[0.95] tracking-tight mb-6">
              <span className="hero-gradient">Pack Light.</span>
              <br />
              <span className="text-gradient-gold">Pack Right.</span>
              <br />
              <span className="italic text-white/35 text-[0.55em]">Pack Warm.</span>
            </h1>
            <p className="max-w-xl mx-auto text-[15px] leading-relaxed text-white/55 font-light mt-6">
              At 4,310 metres, temperature can drop 15°C in under an hour.
              The mountain does not give warnings. This is the definitive
              packing list for the Nathu La ascent.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-3 gap-px bg-white/[0.06] rounded-2xl overflow-hidden max-w-lg w-full page-enter">
            {[
              [`${TOTAL_WEIGHT}`, 'Target pack weight'],
              ['−15°C', 'Possible wind chill'],
              ['< 8 kg', 'Day pack maximum'],
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

        {/* ─── LAYERING SYSTEM ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-5xl mx-auto">
            <div data-reveal className="mb-16">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-3">Thermal Management</p>
              <h2 className="font-serif font-light text-[clamp(36px,5vw,64px)] leading-tight">
                The Three-Layer<br />
                <span className="text-gradient-cyan">System</span>
              </h2>
              <p className="text-[14px] text-white/45 mt-4 max-w-xl">
                Every experienced alpinist uses the same principle. Each layer serves a specific purpose.
                The system only works if all three layers are present.
              </p>
            </div>

            <div className="space-y-4">
              {LAYERS.map((layer) => (
                <div
                  key={layer.num}
                  data-reveal
                  className={`glass rounded-3xl p-8 md:p-10 bg-gradient-to-br ${layer.color} border ${layer.border}`}
                >
                  <div className="grid md:grid-cols-[1fr,2fr] gap-8 items-start">
                    <div>
                      <div className="flex items-baseline gap-4 mb-3">
                        <span className="font-serif text-[64px] leading-none text-white/[0.06]">{layer.num}</span>
                        <div>
                          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/30 block mb-1">{layer.icon} Layer</span>
                          <h3 className={`font-serif text-[28px] ${layer.label}`}>{layer.name}</h3>
                        </div>
                      </div>
                      <p className="font-mono text-[11px] tracking-wide text-white/40 italic">{layer.desc}</p>
                    </div>

                    <div>
                      <p className="text-[14px] text-white/55 leading-relaxed mb-5">{layer.detail}</p>
                      <ul className="space-y-1.5">
                        {layer.items.map((item) => (
                          <li key={item} className="flex items-center gap-2 text-[13px] text-white/65">
                            <span className="w-1 h-1 rounded-full bg-white/30 flex-none" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── INTERACTIVE CHECKLIST ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-4xl mx-auto">
            <div data-reveal className="mb-12">
              <div className="flex items-end justify-between flex-wrap gap-4">
                <div>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-3">Complete Inventory</p>
                  <h2 className="font-serif font-light text-[clamp(36px,5vw,64px)] leading-tight">
                    Gear<br />
                    <span className="italic text-white/40">Checklist</span>
                  </h2>
                </div>
                {/* Progress */}
                <div className="glass rounded-2xl px-6 py-4 text-right">
                  <div className="font-serif text-[28px] text-cyan-300/80">{checkedCount}/{totalItems}</div>
                  <div className="font-mono text-[9px] tracking-widest uppercase text-white/30">Items packed</div>
                </div>
              </div>
            </div>

            {/* Category tabs */}
            <div data-reveal className="flex flex-wrap gap-2 mb-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-[11px] font-mono tracking-widest uppercase transition-all duration-200 ${
                    activeCategory === cat.id
                      ? 'bg-white/10 text-white border border-white/20'
                      : 'text-white/40 border border-white/10 hover:text-white/70 hover:border-white/20'
                  }`}
                >
                  <span className={cat.accent}>{cat.icon}</span>
                  {cat.title}
                </button>
              ))}
            </div>

            <div data-reveal className="glass-strong rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/[0.06]">
                <p className="font-mono text-[10px] tracking-[0.25em] uppercase text-white/30">
                  {CATEGORIES.find(c => c.id === activeCategory)?.title} — {activeItems.length} items
                </p>
              </div>
              <ul className="divide-y divide-white/[0.04]">
                {activeItems.map((item) => {
                  const key = `${activeCategory}-${item.name}`
                  const done = checked[key]
                  return (
                    <li
                      key={item.name}
                      onClick={() => toggleCheck(activeCategory, item.name)}
                      className={`flex items-center gap-5 px-6 py-4 cursor-pointer transition-colors duration-150 hover:bg-white/[0.02] ${done ? 'opacity-40' : ''}`}
                    >
                      <div className={`flex-none w-5 h-5 rounded border grid place-items-center transition-colors ${
                        done ? 'bg-cyan-400/20 border-cyan-400/50' : 'border-white/20'
                      }`}>
                        {done && (
                          <svg className="w-3 h-3 text-cyan-300" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth="2">
                            <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-[14px] ${done ? 'line-through text-white/30' : 'text-white/80'}`}>{item.name}</p>
                        <p className="font-mono text-[10px] text-white/30 mt-0.5 truncate">{item.note}</p>
                      </div>
                      <div className="font-mono text-[10px] text-white/25 flex-none">{item.weight}</div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── DO NOT BRING ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-4xl mx-auto">
            <div data-reveal className="mb-12">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-3">What to Leave Behind</p>
              <h2 className="font-serif font-light text-[clamp(36px,5vw,64px)] leading-tight">
                The Do-Not-Pack<br />
                <span className="text-red-400/70 italic">List</span>
              </h2>
            </div>

            <div className="space-y-3">
              {DONTS.map((d, i) => (
                <div key={i} data-reveal className="glass rounded-2xl px-8 py-5 flex items-start gap-6 border border-red-500/10">
                  <div className="font-mono text-[16px] text-red-500/60 flex-none mt-0.5">⊘</div>
                  <div>
                    <h3 className="text-[16px] text-white/70 font-medium mb-1">{d.item}</h3>
                    <p className="text-[13px] text-white/40 leading-relaxed">{d.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── PHOTOGRAPHY TIPS ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-5xl mx-auto">
            <div data-reveal className="mb-12">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-3">Visual Notes</p>
              <h2 className="font-serif font-light text-[clamp(36px,5vw,64px)] leading-tight">
                Photographing<br />
                <span className="text-gradient-cyan">the Pass</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: 'The Golden Window',
                  body: 'Arrive at the pass at 9–10 AM when the angle of the Himalayan light is low and warm. By noon, harsh overhead sun flattens the landscape. The magic is in the first two hours.',
                  tip: 'Golden hour at 4,310 m is extraordinary — clouds below the pass become a carpet of mist.',
                },
                {
                  title: 'The Battery Problem',
                  body: 'Cold kills lithium batteries. At 4,310 m and sub-zero temperatures, your battery will drop from 80% to 5% in 20 minutes if kept in a cold camera bag.',
                  tip: 'Keep spare batteries in an inner pocket against your body. 37°C body heat saves your shots.',
                },
                {
                  title: 'Respecting Restrictions',
                  body: 'Photography is prohibited within 300 m of any Indian Army installation. The army will confiscate cameras. No exceptions. The border marker and the mountain are safe subjects.',
                  tip: 'The Nathu La border gate itself, from a distance, makes for a powerful composition.',
                },
                {
                  title: 'The Condensation Trap',
                  body: 'Moving from the cold pass into a warm vehicle creates instant condensation on your lens, sensor, and internal electronics. This can damage cameras permanently.',
                  tip: 'Let your camera equalise in temperature slowly. Keep it in a sealed bag when moving between environments.',
                },
              ].map((tip, i) => (
                <div key={i} data-reveal className="glass-strong rounded-2xl p-8">
                  <h3 className="font-serif text-[22px] mb-3 text-violet-300/80">{tip.title}</h3>
                  <p className="text-[14px] text-white/55 leading-relaxed mb-4">{tip.body}</p>
                  <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 px-4 py-3">
                    <p className="font-mono text-[11px] leading-relaxed text-violet-300/70">
                      ◎ {tip.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── WEIGHT SUMMARY ─── */}
        <section data-reveal className="py-24 px-8">
          <div className="max-w-3xl mx-auto">
            <div className="glass-strong rounded-3xl p-12 text-center">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-4">Pack Weight Target</p>
              <div className="font-serif text-[100px] leading-none text-gradient-cyan mb-4 select-none">
                {TOTAL_WEIGHT}
              </div>
              <p className="text-[14px] text-white/45 max-w-sm mx-auto leading-relaxed mb-8">
                Above 8 kg, the pack becomes a burden that exacerbates altitude fatigue.
                No porters are available at Nathu La — you carry everything yourself.
              </p>
              <div className="grid grid-cols-3 gap-4 mb-10">
                {[
                  ['6–8 kg', 'Ideal weight', 'text-emerald-400'],
                  ['8–10 kg', 'Manageable', 'text-amber-400'],
                  ['> 10 kg', 'Too heavy', 'text-red-400'],
                ].map(([range, label, color]) => (
                  <div key={range} className="glass rounded-xl px-4 py-4">
                    <div className={`font-serif text-[22px] ${color}`}>{range}</div>
                    <div className="font-mono text-[9px] tracking-widest uppercase text-white/30 mt-1">{label}</div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/acclimatisation"
                  className="px-8 py-3 rounded-full bg-white/95 text-slate-900 text-[13px] font-medium tracking-wide hover:bg-white transition-colors"
                >
                  Acclimatisation Guide
                </Link>
                <Link
                  to="/"
                  className="px-8 py-3 rounded-full border border-white/20 text-[13px] tracking-wide text-white/70 hover:text-white hover:border-white/40 transition-colors"
                >
                  Experience the Route
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  )
}
