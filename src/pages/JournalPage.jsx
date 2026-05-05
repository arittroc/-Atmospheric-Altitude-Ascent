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
          y: 0, opacity: 1, duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
        })
      })
      // Large chapter numbers animate in with a different feel
      gsap.utils.toArray('[data-chap-num]').forEach(el => {
        gsap.fromTo(el,
          { x: -40, opacity: 0 },
          {
            x: 0, opacity: 1, duration: 1.2,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' },
          }
        )
      })
    }, ref)
    return () => ctx.revert()
  }, [ref])
}

const TIMELINE_EVENTS = [
  { year: 'Before 1800', label: 'Ancient trade across the pass' },
  { year: '1904',        label: 'Younghusband Expedition opens Tibet' },
  { year: '1947',        label: 'India independence — Sikkim becomes protectorate' },
  { year: '1962',        label: 'Sino-Indian War — pass closure begins' },
  { year: '1967',        label: 'Battle of Nathu La — 800 soldiers die' },
  { year: '1975',        label: 'Sikkim joins India as 22nd state' },
  { year: '2006',        label: 'Reopening after 44 years of silence' },
  { year: 'Today',       label: 'Restricted zone open Wed–Sun, 8 AM–3:30 PM' },
]

export default function JournalPage() {
  const ref = useRef()
  useReveal(ref)

  return (
    <PageLayout>
      <div ref={ref}>

        {/* ─── HERO ─── */}
        <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-8 pt-32 pb-32">
          <div className="page-enter">
            <p className="font-mono text-[10px] tracking-[0.45em] uppercase text-white/30 mb-8">
              Est. 3,000 BCE · The Silk Route
            </p>
            <h1 className="font-serif font-light text-[clamp(52px,9vw,130px)] leading-[0.88] tracking-tight">
              <span className="hero-gradient">A Road</span>
              <br />
              <span className="italic text-white/35">Older Than</span>
              <br />
              <span className="hero-gradient">Nations</span>
            </h1>
            <p className="max-w-lg mx-auto text-[15px] leading-relaxed text-white/45 font-light mt-10">
              For three thousand years, caravans of yaks carried tea, silk, and salt
              through this pass. The route survived empires, wars, and four decades
              of imposed silence. The mountain remembers everything.
            </p>
          </div>

          {/* Timeline strip */}
          <div className="mt-20 w-full max-w-3xl page-enter">
            <div className="relative">
              <div className="absolute top-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
              <div className="flex justify-between">
                {['3,000 BCE', '1904', '1962', '2006', 'Today'].map(y => (
                  <div key={y} className="flex flex-col items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-white/25" />
                    <span className="font-mono text-[8px] tracking-widest uppercase text-white/30">{y}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
            <span className="font-mono text-[9px] tracking-[0.25em] uppercase text-white/60">Read on</span>
            <div className="relative w-px h-12 bg-white/20 overflow-hidden scroll-cue-line" />
          </div>
        </section>

        {/* ─── CHAPTER I ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-[1fr,2fr] gap-12 items-start">
              <div className="lg:sticky lg:top-32">
                <div data-chap-num className="opacity-0">
                  <span className="font-serif text-[140px] leading-none text-white/[0.04] select-none block">I</span>
                </div>
                <div data-reveal>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">Chapter One</p>
                  <h2 className="font-serif font-light text-[clamp(28px,4vw,44px)] leading-tight mb-4">
                    The Ancient<br />Trade
                  </h2>
                  <p className="font-mono text-[10px] text-white/25">Before 1800</p>
                </div>
              </div>

              <div className="space-y-6 text-[15px] leading-[1.85] text-white/60 font-light">
                <p data-reveal>
                  The pass known as Nathu La — <span className="italic text-white/80">"Listening Ears Pass"</span> in Tibetan
                  — was among the most strategically vital of all Himalayan trade corridors.
                  The Silk Route did not follow a single road but a web of passes, and Nathu La
                  was its Himalayan artery, linking the Indian subcontinent to the Tibetan plateau.
                </p>
                <p data-reveal>
                  For centuries before cartography and nation-states, merchants from Bengal, Nepal,
                  Bhutan, and Sikkim ascended to meet Tibetan traders descending from Lhasa.
                  The trade was ancient and elegant in its logic: India had tea, silk, cotton,
                  and spices. Tibet had salt, wool, yak butter, and the dried herbs of the high
                  plateau. The pass was the meeting point of two worlds.
                </p>

                <blockquote data-reveal className="border-l-2 border-cyan-400/30 pl-8 py-4 my-8">
                  <p className="font-serif italic text-[20px] text-white/50 leading-snug">
                    "A journey from Gangtok to Lhasa took 45 days in summer.
                    In winter, the pass sealed itself in snow — and the merchants
                    waited, sometimes for months."
                  </p>
                </blockquote>

                <p data-reveal>
                  The caravans moved slowly. Yak trains of 50, 100, sometimes 200 animals.
                  Drivers who knew the weather by the behavior of ravens and the quality of
                  ice on Tsomgo Lake. They carried silk-wrapped medicines, indigo blocks,
                  and the first Indian tea destined for Tibetan butter-tea ceremonies that
                  have not changed in a thousand years.
                </p>
                <p data-reveal>
                  The communities who lived along the route — the Bhutia traders of Sikkim —
                  grew wealthy on the commerce. Monasteries were built on the earnings of the pass.
                  The Rumtek Monastery below Gangtok, one of Buddhism's most sacred sites,
                  exists in part because of the trade that flowed through Nathu La.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="rule-thin max-w-5xl mx-auto" />

        {/* ─── CHAPTER II ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-[1fr,2fr] gap-12 items-start">
              <div className="lg:sticky lg:top-32">
                <div data-chap-num className="opacity-0">
                  <span className="font-serif text-[140px] leading-none text-white/[0.04] select-none block">II</span>
                </div>
                <div data-reveal>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">Chapter Two</p>
                  <h2 className="font-serif font-light text-[clamp(28px,4vw,44px)] leading-tight mb-4">
                    The Kingdom<br />of Sikkim
                  </h2>
                  <p className="font-mono text-[10px] text-white/25">1800–1904</p>
                </div>
              </div>

              <div className="space-y-6 text-[15px] leading-[1.85] text-white/60 font-light">
                <p data-reveal>
                  When the British East India Company turned its attention to the Himalayas,
                  Sikkim was already a Buddhist kingdom under the Chogyal — the divine ruler.
                  The word means "righteous king" in Tibetan. The British wanted access to Tibet.
                  Tibet did not want the British.
                </p>
                <p data-reveal>
                  In 1904, Francis Younghusband led the British Expedition through Nathu La —
                  not as traders, but as soldiers. The Tibetan resistance at Guru, where 700
                  Tibetan soldiers were killed in a single engagement, remains one of the most
                  lopsided military actions in Himalayan history. The British had Maxim guns.
                  The Tibetans had matchlock muskets.
                </p>

                <div data-reveal className="glass rounded-2xl p-8 my-4">
                  <p className="font-mono text-[9px] tracking-widest uppercase text-white/25 mb-3">The Lhasa Convention, 1904</p>
                  <p className="text-[14px] text-white/65 leading-relaxed">
                    The Younghusband Expedition forced the opening of three Tibetan trade marts:
                    Gyantse, Gartok, and Yatung. Nathu La became an official commercial route
                    under British treaty law. The ancient informal trade was now formal commerce
                    under an empire's stamp.
                  </p>
                </div>

                <p data-reveal>
                  The trade boomed. British Indian goods flooded Tibet — Yorkshire woollens,
                  Bengal indigo, Assam tea. In return: musk deer pods for European perfumeries,
                  high-grade borax, yak wool for Glasgow mills, and Tibetan thangka paintings
                  that found their way into London drawing rooms. The pass was busy, profitable,
                  and — for a brief generation — peaceful.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="rule-thin max-w-5xl mx-auto" />

        {/* ─── CHAPTER III: WAR ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-[1fr,2fr] gap-12 items-start">
              <div className="lg:sticky lg:top-32">
                <div data-chap-num className="opacity-0">
                  <span className="font-serif text-[140px] leading-none text-white/[0.04] select-none block">III</span>
                </div>
                <div data-reveal>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">Chapter Three</p>
                  <h2 className="font-serif font-light text-[clamp(28px,4vw,44px)] leading-tight mb-4">
                    War, Closure,<br />Silence
                  </h2>
                  <p className="font-mono text-[10px] text-white/25">1962–2006</p>
                </div>
              </div>

              <div className="space-y-6 text-[15px] leading-[1.85] text-white/60 font-light">
                <p data-reveal>
                  The Sino-Indian War of October 1962 changed everything. China's People's
                  Liberation Army moved through the Himalayas in a coordinated offensive.
                  Nathu La was not the primary battleground — but the border it represented
                  became the wound that would not heal.
                </p>

                {/* Classified-style callout */}
                <div data-reveal className="relative rounded-2xl overflow-hidden my-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-red-950/30 to-red-900/10 border border-red-500/20" />
                  <div className="relative px-8 py-8">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-red-400/70">
                        Battle of Nathu La — September 1967
                      </span>
                    </div>
                    <p className="text-[14px] text-white/65 leading-relaxed">
                      Five years after the war, the worst armed clash since 1962 occurred at
                      Nathu La itself. Indian and Chinese soldiers, separated by only a few metres
                      of barbed wire at the pass, opened fire. The fighting lasted three days.
                      Over 800 soldiers died between both sides. India held the pass.
                      China withdrew. The wire remained.
                    </p>
                  </div>
                </div>

                <p data-reveal>
                  After the 1967 battle, Nathu La was sealed. Not for months. For
                  <span className="text-white/90 font-medium"> forty-four years</span>.
                </p>
                <p data-reveal>
                  The trade caravans stopped. The yak herders rerouted through Nepal.
                  The Bhutia trading families of Sikkim, whose wealth had depended on
                  the commerce of the pass for generations, found themselves cut off
                  from the routes their great-grandparents had walked since childhood.
                </p>
                <p data-reveal>
                  For four decades, the most important Himalayan trade route between
                  India and Tibet existed only in memory and in history books —
                  and in the stories of old men who remembered the smell of yak butter
                  and cardamom at the border market.
                </p>

                <blockquote data-reveal className="border-l-2 border-red-400/30 pl-8 py-4 my-8">
                  <p className="font-serif italic text-[20px] text-white/50 leading-snug">
                    "The ancient paths began to be erased by moss and glacial movement.
                    For forty-four years, the most important road between
                    India and Tibet was also the most invisible."
                  </p>
                </blockquote>
              </div>
            </div>
          </div>
        </section>

        <hr className="rule-thin max-w-5xl mx-auto" />

        {/* ─── CHAPTER IV: REOPENING ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-[1fr,2fr] gap-12 items-start">
              <div className="lg:sticky lg:top-32">
                <div data-chap-num className="opacity-0">
                  <span className="font-serif text-[140px] leading-none text-white/[0.04] select-none block">IV</span>
                </div>
                <div data-reveal>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">Chapter Four</p>
                  <h2 className="font-serif font-light text-[clamp(28px,4vw,44px)] leading-tight mb-4">
                    The<br />Reopening
                  </h2>
                  <p className="font-mono text-[10px] text-white/25">June 6, 2006</p>
                </div>
              </div>

              <div className="space-y-6 text-[15px] leading-[1.85] text-white/60 font-light">
                <p data-reveal>
                  On June 6, 2006, a convoy of ten Indian trucks crossed the sealed gates
                  of Nathu La for the first time since 1962. Trumpets played on both sides
                  of the border. Military commanders shook hands across the line.
                  In Gangtok, old women wept. Prime Minister Manmohan Singh called it
                  "a new chapter in our relationship."
                </p>

                <div data-reveal className="glass-strong rounded-2xl p-8 my-4 text-center">
                  <div className="font-serif text-[80px] leading-none text-white/[0.06] mb-4 select-none">44</div>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/40">Years of Silence</p>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-cyan-300/50 mt-1">
                    1962 → 2006
                  </p>
                </div>

                <p data-reveal>
                  The reopening was part of the India-China "strategic and cooperative
                  partnership" framework, initiated during Prime Minister Vajpayee's
                  Beijing visit in 2003. In Sikkim, the economics were significant:
                  analysts projected $1 billion in annual bilateral trade once the
                  route reached full capacity.
                </p>
                <p data-reveal>
                  But the trade never recovered to its historical scale. The modern
                  Silk Route is a political gesture as much as an economic one.
                  The Indian trucks carry mostly consumer goods — electronics, clothing,
                  medicines. The Chinese trucks bring: very little. The ancient balance
                  of goods has not been restored. The route operates below 10% of
                  its projected capacity, constrained by infrastructure, politics,
                  and the unresolved tensions that a handshake cannot dissolve.
                </p>
              </div>
            </div>
          </div>
        </section>

        <hr className="rule-thin max-w-5xl mx-auto" />

        {/* ─── CHAPTER V: WHAT REMAINS ─── */}
        <section className="py-24 md:py-40 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid lg:grid-cols-[1fr,2fr] gap-12 items-start">
              <div className="lg:sticky lg:top-32">
                <div data-chap-num className="opacity-0">
                  <span className="font-serif text-[140px] leading-none text-white/[0.04] select-none block">V</span>
                </div>
                <div data-reveal>
                  <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/30 mb-3">Chapter Five</p>
                  <h2 className="font-serif font-light text-[clamp(28px,4vw,44px)] leading-tight mb-4">
                    What<br />Remains
                  </h2>
                  <p className="font-mono text-[10px] text-white/25">Today</p>
                </div>
              </div>

              <div className="space-y-6 text-[15px] leading-[1.85] text-white/60 font-light">
                <p data-reveal>
                  Stand at Nathu La today and you will see: two armies separated by a
                  painted line on the earth. Indian soldiers in their army greens and
                  berets. Chinese soldiers in their olive drabs, some close enough to nod to.
                  Between them: tourists taking photographs, prayer flags snapping and fraying
                  in wind that has crossed the Tibetan plateau for a thousand kilometres.
                </p>
                <p data-reveal>
                  The ancient trading post where yak-wool merchants once haggled
                  is now a border market with glass display cases and Chinese consumer
                  goods under fluorescent lighting. It opens on certain days.
                  It closes without warning. The atmosphere is simultaneously sacred
                  and bureaucratic, ancient and contemporary.
                </p>
                <p data-reveal>
                  Small pyramids of stone cairns built by pilgrims. The smell of
                  kerosene from the army mess halls. A sign in three languages —
                  Hindi, English, Chinese — that reads: "India–China Border.
                  Unauthorised photography prohibited." The ravens still circle.
                  They have always circled.
                </p>

                {/* Final meditation */}
                <div data-reveal className="relative py-16 my-8 text-center">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent rounded-3xl" />
                  <div className="relative">
                    <p className="font-serif italic text-[clamp(22px,3.5vw,36px)] text-white/70 leading-[1.4] max-w-2xl mx-auto">
                      "Stand at the pass at dawn, before the tourists arrive,
                      before the soldiers change shifts. The light comes from the east —
                      from Tibet, from the direction of Lhasa. In that moment,
                      in the cold and the silence before the world wakes,
                      it is possible to feel the weight of the centuries
                      that have passed through this exact point on the earth."
                    </p>
                    <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/20 mt-8">
                      The route is older than the nations that claim it.
                      It will outlast them too.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TIMELINE ─── */}
        <section className="py-24 md:py-32 px-8">
          <div className="max-w-4xl mx-auto">
            <div data-reveal className="mb-16 text-center">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-3">A Condensed History</p>
              <h2 className="font-serif font-light text-[clamp(36px,5vw,60px)] leading-tight">
                The Timeline
              </h2>
            </div>

            <div className="relative">
              <div className="absolute left-[50%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent hidden md:block" />

              <div className="space-y-6">
                {TIMELINE_EVENTS.map((ev, i) => (
                  <div
                    key={ev.year}
                    data-reveal
                    className={`flex gap-6 md:gap-0 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  >
                    <div className={`hidden md:block w-[calc(50%-20px)] ${i % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}`}>
                      <div className={`inline-block glass rounded-2xl px-6 py-4 ${i % 2 === 0 ? '' : ''}`}>
                        <div className="font-serif text-[22px] text-white/80">{ev.year}</div>
                        <div className="text-[13px] text-white/50 mt-1">{ev.label}</div>
                      </div>
                    </div>

                    {/* Centre dot */}
                    <div className="hidden md:flex w-10 justify-center">
                      <div className="w-3 h-3 rounded-full border border-white/25 bg-white/10 mt-5" />
                    </div>

                    <div className="md:w-[calc(50%-20px)]" />

                    {/* Mobile layout */}
                    <div className="md:hidden glass rounded-2xl px-6 py-4 flex gap-4 items-start w-full">
                      <div className="font-serif text-[18px] text-white/70 flex-none w-16">{ev.year}</div>
                      <div className="text-[13px] text-white/50 mt-1">{ev.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── CTA ─── */}
        <section data-reveal className="py-24 px-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glass-strong rounded-3xl p-12">
              <p className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/35 mb-4">Walk the Route</p>
              <h2 className="font-serif font-light text-[40px] mb-4">Ascend the Pass</h2>
              <p className="text-[14px] text-white/50 leading-relaxed mb-8">
                The road is open. The permits are waiting. The mountain
                has been here for sixty million years and will be here tomorrow.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/"
                  className="px-8 py-3 rounded-full bg-white/95 text-slate-900 text-[13px] font-medium tracking-wide hover:bg-white transition-colors"
                >
                  Experience the Route
                </Link>
                <Link
                  to="/permits"
                  className="px-8 py-3 rounded-full border border-white/20 text-[13px] tracking-wide text-white/70 hover:text-white hover:border-white/40 transition-colors"
                >
                  Get Your Permits
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
    </PageLayout>
  )
}
