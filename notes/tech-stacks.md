# Tech Stack — Ascend the Pass

Every library, tool, and why it was chosen.

---

## Runtime Dependencies

### React 18 (`react`, `react-dom`)
The UI framework. Used for component composition, state management, and the render loop. React 18's concurrent features aren't explicitly used, but `StrictMode` is enabled. The 3D scene intentionally bypasses React's render cycle by using a `ref` for scroll progress — this avoids re-rendering the Canvas on every scroll tick.

### React Router DOM v7 (`react-router-dom`)
Client-side routing. Provides `BrowserRouter`, `Routes`, `Route`, `Link`, and `useLocation`. The `ScrollToTop` component in `Root.jsx` uses `useLocation` to scroll to 0 on every route change. Nav uses `useLocation` to highlight the active link.

### Three.js (`three`)
The 3D graphics library. Used directly for geometry (`PlaneGeometry`, `BufferGeometry`, `CatmullRomCurve3`), materials (`meshStandardMaterial`, `pointsMaterial`), math (`MathUtils.clamp`, `Vector3`, `Color`), lighting (`FogExp2`), and blending modes (`AdditiveBlending`).

### React Three Fiber (`@react-three/fiber`)
A React renderer for Three.js. Lets you write JSX instead of imperative Three.js setup code. Provides `Canvas`, `useFrame` (per-frame hook, replaces `requestAnimationFrame`), `useThree` (access to camera, scene, renderer), and automatic disposal of Three.js objects on unmount.

### React Three Drei (`@react-three/drei`)
Utility library for R3F. Used via `Suspense` wrapper in `Scene.jsx` to handle async loading gracefully. Provides helpers that would otherwise require verbose Three.js boilerplate.

### GSAP (`gsap`) + ScrollTrigger plugin
Animation library. `ScrollTrigger` is the key piece — it tracks scroll position relative to a trigger element and outputs a 0–1 progress value. In `useScrollProgress.js`, it scrubs against `#scroll-proxy` (a 600vh div) to drive the entire experience. On content pages, ScrollTrigger also animates `[data-reveal]` elements into view as the user scrolls.

### Lenis (`@studio-freight/lenis`)
Smooth scroll library. Intercepts native scroll events and replaces them with a damped, eased version. Configured with 1.2s duration and exponential easing. Wired directly into GSAP's ticker so ScrollTrigger reads the smoothed position, not the raw browser scroll. Without Lenis, the scroll-driven camera animation would feel jerky.

### Lucide React (`lucide-react`)
SVG icon library. Provides crisp, consistent icons used across the content pages (permit icons, gear list icons, etc.) and in the main experience Footer — `Github` and `Linkedin` icons at 15px for the social links in the fixed frosted-glass footer.

### Cormorant Garamond (`@fontsource/cormorant-garamond`)
Display serif font. Used for all large headings, waypoint titles, altitude numbers in the HUD, and the logo. Loaded via Fontsource (self-hosted, no Google Fonts request). Weights 300 and 400, regular and italic.

### Inter (`@fontsource/inter`)
Clean sans-serif. Used for body copy on content pages. Weights 300, 400, 500.

### JetBrains Mono (`@fontsource/jetbrains-mono`)
Monospace font. Used for all HUD labels, coordinates, tracking numbers, uppercase data chips, the "SCROLL TO ASCEND" cue, and the "DEVELOPED BY ARITTRO CHOWDHURY" attribution text in the Footer. Makes the UI feel like instrumentation. Weights 300 and 400.

---

## Dev Dependencies

### Vite (`vite`) + `@vitejs/plugin-react`
Build tool and dev server. Provides ES-module-native HMR (fast reloads without full refresh), out-of-the-box JSX transform via the React plugin, and Rollup-based production bundling. `vite.config.js` sets `optimizeDeps` to pre-bundle `three`, `@react-three/fiber`, `@react-three/drei`, and `gsap` — these are large CommonJS packages that Vite would otherwise convert slowly on first load. Manual chunk splitting keeps the largest bundle (Three.js) isolated.

### Tailwind CSS (`tailwindcss`) + PostCSS + Autoprefixer
Utility-first CSS framework. Used for layout, spacing, typography scale, colours, hover states, responsive prefixes (`md:`, `lg:`), and transitions. Custom config adds the three font families. `globals.css` layers custom component classes (`.glass`, `.glass-strong`, `.hairline`) and utility classes (`.hero-gradient`, `.text-gradient-cyan`) on top of Tailwind's utilities. Autoprefixer adds vendor prefixes automatically for `backdrop-filter`.

---

## Architecture Decisions

### Why a ref for scroll progress, not state?

`useState` would cause React to re-render the entire component tree on every scroll tick — 60 times per second. The 3D scene uses `useFrame` which already runs every frame; it reads `progressRef.current` directly without needing a re-render. The UI components (Altimeter, StatusBar, etc.) do need re-renders, so `App.jsx` runs a `requestAnimationFrame` loop that syncs the ref into state — but this is isolated and deliberate.

### Why disable the Mountain geometry?

The `Mountain.jsx` procedural terrain is complete and working, but the real Nathu La photos (`nathula-pass.jpg`, `gurudongmar-lake.jpg`) create far more immersive atmosphere than a stylised 3D mesh. The mesh is kept in code for future use or a toggle. The Canvas is set to `alpha: true` so it renders over the photo layers transparently.

### Why 600vh for the scroll proxy?

GSAP ScrollTrigger's scrub value (1.2) introduces a deliberate delay between raw scroll position and the animated value. A taller scroll distance gives more room for camera movement to feel gradual and intentional, and reduces the feeling of "snapping" at the extremes.

### Why Lenis over native smooth scroll?

CSS `scroll-behavior: smooth` only works on `scrollTo` calls, not user gestures. The browser's native momentum scroll on macOS/trackpad is inconsistent. Lenis gives full control over easing curve and duration, and its output is fed directly into GSAP's ticker so the animation pipeline is unified — one source of truth for time.

### Why self-hosted fonts (Fontsource) over Google Fonts?

No external network request on page load, no CORS issue, no privacy tracking concern. Fontsource packages are NPM dependencies — they get bundled and served from the same origin as the app.

### Why vendor chunk splitting in Vite?

Three.js + R3F together is ~800 KB unminified. Splitting it into its own chunk (`three-vendor`) means the browser can cache it independently. If the app code changes but Three.js doesn't, users only re-download the small app chunk on next visit.

---

## Tooling Outside the Bundle

| Tool | Purpose |
|---|---|
| Docker + nginx | Containerised production deployment |
| `nohup npm run dev` | Long-running dev server on home server |
| Git + GitHub | Version control, remote at `github.com/arittroc/-Atmospheric-Altitude-Ascent` |
| VS Code / Claude Code | Editor and AI-assisted development |
