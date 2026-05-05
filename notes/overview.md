# Ascend the Pass — Project Overview

**Nathu La: The Listening Ear**
A scroll-driven interactive web experience simulating a 56-kilometre ascent from Gangtok to the Indo-Tibetan border at Nathu La (4,310 m), East Sikkim, India.

---

## Index

1. [What Is This Project](#1-what-is-this-project)
2. [Core Experience](#2-core-experience)
3. [Page Structure & Routes](#3-page-structure--routes)
4. [File & Folder Structure](#4-file--folder-structure)
5. [UI Components](#5-ui-components)
6. [3D Scene Components](#6-3d-scene-components)
7. [Data & Hooks](#7-data--hooks)
8. [Styling System](#8-styling-system)
9. [Build & Deployment](#9-build--deployment)

---

## 1. What Is This Project

Ascend the Pass is a frontend-only, browser-based experience. There is no backend, no database, and no API. Everything runs in the browser using WebGL and CSS.

The user scrolls down the page. As they scroll, a 3D scene animates — the camera moves up a mountain path, lighting shifts from warm morning to golden-hour, snow and mist particles fade in, and two info cards slide in at key waypoints. Five additional pages provide reference content: permits, acclimatisation, a silk route journal, and a gear checklist.

The subject is the real Nathu La pass on the India-China border, open to Indian nationals on restricted days with a permit.

---

## 2. Core Experience

| Scroll Progress | What Happens |
|---|---|
| 0% | Hero card — title, subtitle, scroll cue visible |
| 0–15% | Hero fades out as you start scrolling |
| 35–50% | Mist particles fade in (cloud layer simulation) |
| 40–65% | Waypoint card 1 — Tsomgo Lake (left side) |
| 70–85% | Snow particles start falling |
| 75–100% | Waypoint card 2 — Nathu La Summit (right side) |
| 0→100% | Camera travels Catmull-Rom curve from basecamp to summit |
| 0→100% | Lighting shifts: warm morning → cool overcast → golden hour |
| 0→100% | Altimeter, StatusBar, AltitudeChip update in real-time |

The scroll driver is a 600vh-tall invisible `div#scroll-proxy`. GSAP ScrollTrigger reads its progress (0–1) and writes it to a React ref. A `requestAnimationFrame` loop syncs the ref to state for UI re-renders.

---

## 3. Page Structure & Routes

| Route | Component | Description |
|---|---|---|
| `/` | `App.jsx` | Main scroll-driven 3D experience |
| `/permits` | `PermitsPage.jsx` | Required documents, checkpoint list, application process |
| `/acclimatisation` | `AcclimatisationPage.jsx` | AMS symptoms, 3-day acclimatisation protocol, medications |
| `/journal` | `JournalPage.jsx` | Historical timeline of the Silk Route and Nathu La |
| `/gear` | `GearPage.jsx` | Interactive packing checklist, layering system guide |

All content pages share `PageLayout.jsx` which provides the nav, two footer layers (an inline scroll-area `Footer` with logo and nav links, and the imported fixed frosted-glass `SiteFooter` from `ui/Footer.jsx`), background image, vignette overlays, and film grain.

---

## 4. File & Folder Structure

```
src/
├── main.jsx                  React entry point
├── Root.jsx                  BrowserRouter + route definitions
├── App.jsx                   Main scroll-driven experience
│
├── scene/
│   ├── Scene.jsx             R3F Suspense wrapper, composes all 3D pieces
│   ├── Mountain.jsx          Procedural terrain (disabled in current build)
│   ├── CameraRig.jsx         Catmull-Rom camera path, idle drift
│   ├── Lighting.jsx          3-act colour system + fog
│   ├── SnowField.jsx         Falling snow particles (1,500 points)
│   └── MistField.jsx         Horizontal mist particles (800 points)
│
├── ui/
│   ├── Nav.jsx               Fixed top nav bar with glass pill
│   ├── HeroCard.jsx          Opening title that fades on scroll
│   ├── WaypointCard.jsx      Location card with stats and forecast
│   ├── Altimeter.jsx         Right-side altitude gauge + compass dial
│   ├── StatusBar.jsx         Bottom-left: distance, ETA, surface type
│   ├── AltitudeChip.jsx      Top-right altitude readout
│   └── Footer.jsx            Fixed frosted-glass footer with attribution and social links
│
├── pages/
│   ├── PermitsPage.jsx
│   ├── AcclimatisationPage.jsx
│   ├── JournalPage.jsx
│   └── GearPage.jsx
│
├── components/
│   └── PageLayout.jsx        Shared layout shell for all content pages
│
├── hooks/
│   ├── useScrollProgress.js  GSAP ScrollTrigger → progressRef
│   └── useLenis.js           Lenis smooth scroll + GSAP ticker sync
│
├── data/
│   └── waypoints.js          Route data, altitudes, surface labels
│
└── styles/
    └── globals.css           Tailwind + glass classes + animations

public/
└── textures/
    ├── nathula-pass.jpg      Background photo: the pass itself
    └── gurudongmar-lake.jpg  Second photo layer that cross-fades in

notes/                        This folder — project documentation
index.html                    HTML root, mobile notice, meta tags
vite.config.js                Vite config, vendor code splitting, server host: true
tailwind.config.js            Custom font families
postcss.config.js
Dockerfile
docker-compose.yml
nginx.conf
```

---

## 5. UI Components

**Nav** — Fixed frosted-glass pill at top. Shows logo, 5 nav links, a live status chip (pass hours), and an "Apply for permit" CTA button. Uses `useLocation` to highlight the active route.

**HeroCard** — Full-screen centered title card. Fades, blurs, and slides up as scroll progress passes 15%. Renders `null` when fully transparent so it doesn't block interaction. All four text elements (kicker, "Nathu La" heading, "the Listening Ear" subtitle, body paragraph) are solid white (`text-white`, `#ffffff`) with a three-layer deep drop shadow: `0 2px 8px rgba(0,0,0,1), 0 4px 32px rgba(0,0,0,0.95), 0 8px 64px rgba(0,0,0,0.8)`. No gradient fill or opacity modifier on hero text.

**WaypointCard** — Sliding info card for each key location. Accepts `entryProgress` and `exitProgress` to control when it appears and disappears. Left-aligned for Tsomgo Lake, right-aligned for the summit. Contains a stats grid and optionally a 24-hour weather forecast strip. An absolute-positioned `linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.0) 80%)` overlay sits at the top of the card for text legibility against background photos.

**Altimeter** — Fixed to the right edge. Shows current altitude as a number, a vertical progress rail with glowing dot, tick marks for 5 waypoints, and a compass/grade dial that rotates 270° from start to finish.

**StatusBar** — Fixed `bottom-14 left-6`. Shows distance covered (km), ETA (time string), and surface type (road name changes at thresholds). Positioned at `bottom-14` (not `bottom-6`) to sit clear of the fixed frosted-glass footer.

**AltitudeChip** — Fixed top-right. Compact altitude readout. Visible on large screens only.

**Footer** — Fixed to the bottom of the viewport at z-index 50, always visible across the main experience. Height 44px. Background `rgba(0,0,0,0.18)` with `backdrop-blur-md` and `backdrop-saturate-150` — frosted glass over whatever photo is showing. Top border `rgba(255,255,255,0.07)` and an upward box-shadow. Left side: "DEVELOPED BY ARITTRO CHOWDHURY" in JetBrains Mono at 11px, tracking-widest, white/40. Right side: GitHub and LinkedIn icon links (lucide-react) at 15px, white/40 with hover to white/80. Rendered as a plain HTML sibling to the Canvas in `App.jsx`, outside the WebGL tree.

---

## 6. 3D Scene Components

**CameraRig** — Defines 6 control points in 3D space. Builds a `CatmullRomCurve3` through them. Each frame, samples the curve at `progress` to get position and tangent. Lerps camera position and look-target for smooth lag. Adds sinusoidal idle drift on X and Y axes.

**Lighting** — Three-act colour system. Act I (warm morning), Act II (cool overcast), Act III (golden hour). Progress mapped to a 0→1 blend value via smoothstep. Directional, ambient, and rim lights all interpolate colour and intensity. Exponential fog density changes through 4 phases: builds, peaks at cloud layer, thins above clouds, near-zero at summit.

**SnowField** — 1,500 `BufferGeometry` points. Each frame, Y position decrements and X drifts via sine. Opacity ramps from 0 to 1 between progress 0.70 and 0.85. Invisible until near the summit.

**MistField** — 800 points with additive blending. Opacity peaks at 0.45 progress then fades out. Points drift horizontally (cloud layer simulation). Larger point size (1.2) makes them look soft.

**Mountain** — Procedural terrain via fractional Brownian motion (fBm) over a `PlaneGeometry` with 256×256 segments. Vertex colours by height: vegetation → scree → rock → snow. Currently commented out in `Scene.jsx` because the photo backgrounds provide better atmosphere.

---

## 7. Data & Hooks

**waypoints.js** — Route constants (`ROUTE_START = 1650m`, `ROUTE_END = 4310m`), altimeter tick marks, waypoint objects (title, body, stats, coordinates, optional forecast), surface label thresholds. Helper functions `getAltitude(progress)` and `getSurface(progress)`.

**useScrollProgress** — Registers a GSAP `ScrollTrigger` on `#scroll-proxy`. Updates `progressRef.current` on every scrub tick. Returns the ref (not state) so the 3D scene reads it every frame without re-rendering React.

**useLenis** — Creates a Lenis instance with 1.2s duration ease. Hooks into GSAP ticker so ScrollTrigger and Lenis stay in sync. Destroyed on unmount.

---

## 8. Styling System

Three fonts: **Cormorant Garamond** (serif, for display text), **JetBrains Mono** (mono, for labels and HUD data), **Inter** (sans, for body copy).

Custom Tailwind class `.glass`: `backdrop-filter: blur(24px)`, subtle gradient background, thin white border, drop shadow. Used for nav pill, altimeter, status bar, waypoint cards.

`.glass-strong`: Same but blur 32px and slightly stronger border. Used for waypoint cards.

Custom animations: `softPulse` (live indicator dot), `scrollCue` (descending line), `pageFadeUp` (page entrance), `blink` (cursor), `amberPulse` (warning), `countUp` (altitude number).

`[data-reveal]` attribute sets initial opacity/translateY to 0. GSAP ScrollTrigger animates these to visible on content pages.

---

## 9. Build & Deployment

`npm run dev` — Vite dev server with HMR. Listens on all interfaces (`host: true` in `vite.config.js`) so it is reachable at both `localhost:5173` and the machine's LAN IP.
`npm run build` — Production build to `/dist`.

Vite config splits vendor chunks: `three-vendor` (Three.js + R3F), `gsap-vendor` (GSAP + Lenis), `react-vendor` (React + ReactDOM). Keeps individual chunk sizes small.

A `Dockerfile` + `nginx.conf` are included for containerised deployment. `docker-compose.yml` covers local container dev. The project is also hosted on a home server at `192.168.29.100:5173`. The home server remote (`skyie@192.168.29.100:~/Ascend-the-Pass`) is configured with `receive.denyCurrentBranch ignore`; after each push a `git reset --hard HEAD` on the server syncs the working tree and Vite hot-reloads automatically.
