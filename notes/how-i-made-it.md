# How I Made It — Ascend the Pass

A full account of the project from the initial idea to the final deployed state. What was built, in what order, what decisions were made, and why.

---

## The Idea

The goal was to build an interactive web experience about Nathu La — a high-altitude mountain pass on the Indo-Tibetan border in East Sikkim, India. The pass sits at 4,310 metres and is only accessible to Indian nationals on specific days with a restricted permit. It was part of the ancient Silk Route between India and Tibet.

The concept: instead of a static article or a photo gallery, the user *scrolls to ascend*. Every pixel of scroll moves them further up the mountain. The experience would combine a 3D WebGL scene, real photographs, HUD-style instrumentation, and educational content pages.

---

## Phase 1 — Scaffold

**Commit: `init vite + r3f + tailwind scaffold`**

The project started with a Vite + React scaffold. The core libraries were added immediately because the architecture depended on them being available together:

- `@react-three/fiber` and `three` for the WebGL canvas
- `@react-three/drei` for R3F utilities
- `gsap` and `ScrollTrigger` for scroll-driven animation
- `@studio-freight/lenis` for smooth scrolling
- `tailwindcss`, `postcss`, `autoprefixer` for styling
- Fontsource packages for self-hosted typography

The three custom fonts were chosen upfront because they define the visual language:
- **Cormorant Garamond** for the editorial, expedition-diary feel of headings
- **JetBrains Mono** for the instrument-panel readouts
- **Inter** for clean body copy

`tailwind.config.js` was set up with the font families mapped to Tailwind's `font-serif`, `font-mono`, and `font-sans` keys. `globals.css` was created with the Tailwind layers, base resets (`overscroll-behavior-y: none`, hidden scrollbar), and the first custom component class — `.glass`.

At this point the app was just a blank canvas.

---

## Phase 2 — The Scroll Engine

The next piece was the scroll-to-progress pipeline, because everything else depends on it.

**`useScrollProgress.js`** — A GSAP `ScrollTrigger` is created against a `#scroll-proxy` element. This is an invisible `div` with `height: 600vh`. As the user scrolls from the top of this div to the bottom, `ScrollTrigger` outputs a `progress` value from 0 to 1. That value is written into a React `ref` (not state) on every scrub tick. The ref is returned to whoever needs it.

Using a ref here was deliberate. The 3D camera reads this value inside `useFrame` — which runs every animation frame regardless of React's render cycle. If the value lived in state, every scroll event would trigger a React re-render across the whole tree. The ref avoids that entirely.

**`useLenis.js`** — Lenis is initialised and wired into GSAP's ticker. `lenis.on('scroll', ScrollTrigger.update)` keeps them in sync. The easing curve (`1 - 2^(-10t)`) gives natural deceleration — fast start, graceful ease-off.

**`App.jsx` sync loop** — The UI components (Altimeter, StatusBar, WaypointCards) do need to re-render when progress changes. A `requestAnimationFrame` loop in `App.jsx` reads `progressRef.current` and writes it into `useState` every frame. This is the only place where the ref becomes state — and it's bounded to `App`, not the 3D canvas.

---

## Phase 3 — The 3D Scene

With the scroll engine ready, the scene was built incrementally.

**`CameraRig.jsx`** — Six control points were plotted in 3D space to represent the ascent path: a low basecamp position, two switchbacks, treeline, below the summit ridge, and the summit hover. A `CatmullRomCurve3` connects them into a smooth spline. Each frame, `curve.getPointAt(progress)` returns the camera position. `curve.getTangentAt(progress)` gives the direction of travel, used to compute a look-target.

Early in the journey the camera looks toward the peak (`peakTarget`). Later it follows the tangent (looks forward along the path). These are blended via `lerp` based on progress. Both position and look-target are additionally lerped with low factors (0.08 and 0.06) to add camera lag — the camera slightly trails behind its target, which feels more physical.

Sinusoidal idle drift (`Math.sin(time * 0.4) * 0.12`) adds a subtle floating motion on X and Y even when the user isn't scrolling.

**`Lighting.jsx`** — Three acts of lighting:
- Act I: warm white directional light, pale blue ambient, blue-tinted fog — morning in the foothills
- Act II: cool grey directional, darker ambient, grey fog — ascending into overcast mid-elevation
- Act III: orange-gold directional, deep purple ambient, a magenta rim light, thin blue-silver fog — the high-altitude golden hour look

Progress is mapped to a blend value via `smoothstep(0, 0.70, t)`. Act colours are interpolated with `lerpColors3`, a custom helper that handles three colour stops. Fog density follows its own curve: builds through a cloud layer at 0.35–0.45, punches through, then thins to near-zero at the summit.

**`SnowField.jsx`** — 1,500 points placed randomly in a 200×200×200 box. Each frame, Y decrements (falling) and X drifts via a sine function (sideways wind). When a particle falls past the bottom threshold it resets to the top. Opacity ramps in between progress 0.70 and 0.85 — snow only appears near the summit, which is accurate to the real location.

**`MistField.jsx`** — 800 larger points (size 1.2) with `AdditiveBlending`. They drift horizontally. Opacity peaks at progress 0.45 and fades before 0.65 — simulating the cloud layer the climber passes through mid-ascent.

**`Mountain.jsx`** — Written and fully functional, but ultimately disabled in `Scene.jsx`. The terrain uses a 256×256 `PlaneGeometry` where each vertex's Y position is set by a fractional Brownian motion (fBm) function — multiple octaves of value noise summed together, weighted by a radial base shape to form a central peak. Vertex colours go from vegetation green at low altitude through scree and rock to near-white snow. A noise mask suppresses surface detail away from the mountain structure, which fixed a bug where isolated elevated patches appeared in flat areas. The mesh looked good but the real photo backgrounds were more atmospheric, so the mesh was commented out.

---

## Phase 4 — Photo Backgrounds

The 3D Canvas is rendered with `alpha: true`, making it fully transparent. Behind it sits a CSS layer — `PhotoBackground` in `App.jsx`.

Two images: `nathula-pass.jpg` (the base layer, always present) and `gurudongmar-lake.jpg` (a second layer that cross-fades in between progress 0.25 and 0.75). Both images scale and translate in parallax as progress increases — the Nathu La photo zooms in and shifts up-left, the lake photo zooms slightly and lifts.

On top of both photos sit several CSS overlay layers stacked in order:
1. A soft-light colour wash (cool blue tint that strengthens with altitude)
2. A top gradient for nav legibility
3. A bottom gradient for HUD legibility
4. A radial vignette
5. Corner inset shadow
6. Film grain (a radial-gradient dot pattern at 7% opacity, `mix-blend-overlay`)

The result is that the WebGL particles and camera feel embedded in a photographic world rather than floating over a flat image.

---

## Phase 5 — HUD Components

These are all `fixed` position elements layered over the Canvas at `z-index: 30`.

**HeroCard** — The opening screen. Fades, blurs, and translates upward as progress passes 15%. Returns `null` at full transparency so it doesn't intercept pointer events. The eyebrow kicker ("EAST SIKKIM · OLD SILK ROUTE"), the main "Nathu La" heading, and the "the Listening Ear" subtitle all carry a Tailwind arbitrary `text-shadow` (`0 2px 24px rgba(0,0,0,0.70), 0 1px 4px rgba(0,0,0,0.50)`) to cut through bright photo backgrounds without affecting the body copy, scroll cue, or any HUD element.

**WaypointCard** — The most complex HUD component. Each card has an `entryProgress` and `exitProgress`. Between those values it's visible. Within a `FADE_RANGE = 0.06` at each boundary it interpolates opacity and vertical translation. Two instances: Tsomgo Lake (left-aligned, appears at 0.40–0.65) and Nathu La Summit (right-aligned, appears at 0.75–1.0). Each card has a stats grid and the summit card includes a 24-hour weather forecast strip with glyphs for sun, cloud, and snow.

**Altimeter** — The most visually detailed component. A vertical rail with a gradient fill that rises from 0% to `progress * 100%`. A glowing white dot rides the top of the fill. Five tick marks with labels and altitude numbers that light up white when the climber reaches them. Below the rail, a compass-style circular dial where the needle rotates 270° over the full journey.

**StatusBar** — Shows distance in km (56 * progress), a simulated ETA that ticks from 04:12 to 04:42, and surface type (NH-310 highway → Jelep La road → BRO snow track).

**AltitudeChip** — Compact top-right readout. `getAltitude(progress)` linearly interpolates between 1,650m (Gangtok) and 4,310m (Nathu La).

---

## Phase 6 — Navigation

**`Footer.jsx`** — A fixed frosted-glass bar pinned to the bottom of the viewport at z-index 50. Height 44px. Transparent background (`rgba(0,0,0,0.18)`) with `backdrop-blur-md` and `backdrop-saturate-150` so the photo atmosphere shows through. An upward box-shadow (`0 -8px 32px rgba(0,0,0,0.35)`) lifts it visually off the photo layer. Left side shows the attribution in JetBrains Mono; right side has GitHub and LinkedIn icon links (lucide-react) at white/40 opacity that fade to white/80 on hover. Rendered in `App.jsx` as a plain HTML element outside the `<Canvas>` and UI overlay, so it is never inside the WebGL or pointer-events-none tree.

**`Nav.jsx`** — A fixed frosted-glass pill containing:
- Logo: mountain SVG icon + "Nathu.la" in serif with italic suffix
- Five nav links that highlight based on current `useLocation`
- A status chip showing "Pass open · 4,310 m · Wed–Sun" with a pulsing cyan dot
- An "Apply for permit" CTA button linking to `/permits`

The glass pill uses the `.glass` class — `backdrop-filter: blur(24px)` with a subtle gradient border. This lets the mountain photos show through the nav while remaining legible.

---

## Phase 7 — Content Pages

All four content pages follow the same structure: `PageLayout.jsx` wrapping the page-specific content.

`PageLayout.jsx` provides:
- The darkened background photo (same Nathu La image, heavily desaturated at brightness 0.18)
- Atmospheric overlays (vignette, top/bottom gradients, film grain)
- The Nav
- A Footer with logo, nav links, and a legal notice about restricted access

Each page uses a `useReveal` hook (GSAP ScrollTrigger on `[data-reveal]` elements) so sections animate in as the user scrolls down.

**PermitsPage** — Documents required (Protected Area Permit, Inner Line Permit, Indian passport), checkpoint table, application steps, important notes about photograph restrictions and timing.

**AcclimatisationPage** — AMS symptom severity table, 3-day acclimatisation protocol, medication guide (Diamox, Dexamethasone, Nifedipine), emergency signs. Uses tabbed navigation to separate sections.

**JournalPage** — Historical timeline from the 15th century Silk Route era through colonial surveys, the 1962 India-China war that closed the pass, reopening in 2006, and present-day tourism. Narrative style with pull quotes.

**GearPage** — Interactive packing checklist with categories (Layers, Footwear, Accessories, Medical, Documents). Each item is clickable and marked as packed/unpacked. A counter tracks completion. Includes a layering system guide.

---

## Phase 8 — Routing & Infrastructure

**`Root.jsx`** — Wraps the app in `BrowserRouter` and defines the five routes. The `ScrollToTop` component listens to `useLocation` and calls `window.scrollTo(0, 0)` on each route change — without this, navigating to a content page would land mid-scroll.

**`vite.config.js`** — `optimizeDeps.include` pre-bundles the heavy libraries so Vite's dev server doesn't need to convert them on first request. `manualChunks` in the build config splits Three.js, GSAP, and React into separate cache-able files.

**`index.html`** — Has a mobile notice: a fixed overlay that displays if `window.innerWidth < 1024`. The experience is desktop-only (the scroll-driven 3D camera and HUD layout require space). The overlay is pure HTML/CSS/JS, no React — it runs before the bundle loads.

**Docker + nginx** — A `Dockerfile` does a multi-stage build: Node image to `npm run build`, then nginx to serve the `/dist` output. `nginx.conf` handles SPA routing (all paths serve `index.html` so React Router's `BrowserRouter` works on direct URL access).

---

## Phase 9 — Git & Deployment

Three commits:

1. `init vite + r3f + tailwind scaffold` — blank project with all dependencies installed and configured
2. `add package-lock` — added the lockfile that was missing from the first commit
3. `add pages, components, and scene updates` — everything built in phases 2–8 committed together: pages, scene files, hooks, data, components, style updates

Pushed to `github.com/arittroc/-Atmospheric-Altitude-Ascent`.

Cloned and running on home server at `192.168.29.100:5173` via `nohup npm run dev -- --host 0.0.0.0`. Home server remote (`skyie@192.168.29.100:~/Ascend-the-Pass`) is configured with `receive.denyCurrentBranch ignore` so pushes land directly and a `git reset --hard HEAD` on the server syncs the working tree.

Also running locally at `localhost:5173`.

**Latest commit — `feat: add frosted footer and hero text shadows`**
- Added `src/ui/Footer.jsx`: fixed frosted-glass attribution bar with GitHub and LinkedIn icon links
- Updated `src/ui/HeroCard.jsx`: text-shadow applied to kicker, "Nathu La" heading, and "the Listening Ear" subtitle
- Updated `src/App.jsx`: imports and renders `<Footer />` outside the Canvas tree

---

## What Was Hard

**Scroll ref vs state** — The first instinct is to put scroll progress in state. The problem shows up immediately: every scroll tick causes React to re-render the Canvas, which causes R3F to re-process the scene graph, which tanks frame rate. The ref + RAF sync pattern was the solution.

**Mountain noise blob artifact** — The procedural terrain had a bug: isolated elevated patches appeared in the lower-right of the viewport away from the main mountain shape. The cause was FBM noise adding height even where the structural base (radial peak shape) was near zero. The fix was a `noiseMask` that scales noise amplitude proportionally to the structural height — where the mountain is flat, noise is suppressed.

**Camera look-target blending** — At the start of the journey, looking along the tangent pointed the camera forward and slightly down (the curve starts nearly horizontal). This felt wrong — you'd expect to see the mountain looming ahead. The fix was blending from a fixed `peakTarget` (0, 22, 0) toward the tangent look as progress increases. The blending factor is `min(1, t * 4)` — fast transition in the first 25% of the journey.

**Lenis + GSAP sync** — If Lenis and ScrollTrigger aren't wired to the same tick source, they run on separate timers and the smooth scroll lags behind the animation. The fix is `lenis.on('scroll', ScrollTrigger.update)` plus `gsap.ticker.add(time => lenis.raf(time * 1000))` and `gsap.ticker.lagSmoothing(0)`. This makes everything run in lockstep.

**Fog on transparent canvas** — `FogExp2` applies to the Three.js scene. Since the canvas background is transparent, fog colour shows through the canvas on geometry but the background photos beneath show through the empty space. This means the fog colour needs to match the photo backgrounds loosely or it looks wrong at the edges of geometry. The fog colour was tuned to pale blue-grey tones that complement the mountain photos.
