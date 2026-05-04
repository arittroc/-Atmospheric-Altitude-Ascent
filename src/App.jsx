import { useState, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Scene } from './scene/Scene'
import Nav from './ui/Nav'
import HeroCard from './ui/HeroCard'
import WaypointCard from './ui/WaypointCard'
import Altimeter from './ui/Altimeter'
import StatusBar from './ui/StatusBar'
import AltitudeChip from './ui/AltitudeChip'
import { useScrollProgress } from './hooks/useScrollProgress'
import { useLenis } from './hooks/useLenis'
import { WAYPOINTS } from './data/waypoints'

function smoothstep(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Photo backgrounds behind the transparent canvas
function PhotoBackground({ progress }) {
  const lakeOpacity = smoothstep(0.25, 0.75, progress)
  const scale1 = 1 + progress * 0.18
  const txY1   = progress * -60
  const txX1   = progress * 24
  const scale2 = 1.08 - progress * 0.06
  const txY2   = (1 - progress) * 30

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-black">

      {/* Nathu La — base layer */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(${txX1}px, ${txY1}px, 0) scale(${scale1})`,
          transformOrigin: '55% 60%',
          transition: 'transform 120ms linear',
          backgroundImage: 'url("/textures/nathula-pass.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 55%',
          filter: `saturate(${1 - progress * 0.15}) brightness(${0.92 - progress * 0.08})`,
          willChange: 'transform',
        }}
      />

      {/* Gurudongmar Lake — cross-fades in */}
      <div
        className="absolute inset-0"
        style={{
          transform: `translate3d(0, ${txY2}px, 0) scale(${scale2})`,
          transformOrigin: '50% 60%',
          transition: 'transform 160ms linear',
          backgroundImage: 'url("/textures/gurudongmar-lake.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center 50%',
          opacity: lakeOpacity,
          willChange: 'transform, opacity',
        }}
      />

      {/* Cool-blue altitude wash */}
      <div
        className="absolute inset-0 pointer-events-none mix-blend-soft-light"
        style={{
          background: 'linear-gradient(180deg, oklch(0.55 0.06 235 / 0.55), oklch(0.30 0.05 245 / 0.30))',
          opacity: 0.35 + progress * 0.35,
        }}
      />

      {/* Top gradient for nav legibility */}
      <div
        className="absolute inset-x-0 top-0 h-48 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(5,8,14,0.75), transparent)' }}
      />

      {/* Bottom gradient for HUD legibility */}
      <div
        className="absolute inset-x-0 bottom-0 h-56 pointer-events-none"
        style={{ background: 'linear-gradient(0deg, rgba(5,8,14,0.75), transparent)' }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 90% 75% at 50% 50%, transparent 45%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {/* Corner inset shadow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 200px 40px rgba(0,0,0,0.65)' }}
      />

      {/* Film grain */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />
    </div>
  )
}

export default function App() {
  const progressRef = useScrollProgress()
  useLenis()

  // Sync ref → state for UI re-renders
  const [progress, setProgress] = useState(0)
  useEffect(() => {
    let raf
    const sync = () => {
      setProgress(progressRef.current)
      raf = requestAnimationFrame(sync)
    }
    raf = requestAnimationFrame(sync)
    return () => cancelAnimationFrame(raf)
  }, [progressRef])

  return (
    <div className="relative">
      {/* Photo atmosphere behind WebGL canvas */}
      <PhotoBackground progress={progress} />

      {/* WebGL — transparent so photos show through */}
      <Canvas
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
        }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        camera={{ fov: 60, near: 0.1, far: 500 }}
        aria-label="3D mountain scene"
      >
        <Scene progressRef={progressRef} />
      </Canvas>

      {/* Scroll driver — 600vh gives smooth GSAP range */}
      <div id="scroll-proxy" style={{ height: '600vh', position: 'relative', zIndex: 2 }} />

      {/* UI overlay */}
      <div
        className="fixed inset-0 z-30 pointer-events-none"
        aria-live="polite"
      >
        {/* Nav always intercepts clicks */}
        <Nav />

        {/* Hero — visible only at top */}
        <HeroCard progress={progress} />

        {/* Waypoint card 1: Tsomgo Lake */}
        <WaypointCard
          data={WAYPOINTS[0]}
          progress={progress}
          entryProgress={0.40}
          exitProgress={0.65}
          align="left"
        />

        {/* Waypoint card 2: Nathu La Summit */}
        <WaypointCard
          data={WAYPOINTS[1]}
          progress={progress}
          entryProgress={0.75}
          exitProgress={1.01}
          align="right"
        />

        <Altimeter progress={progress} />
        <StatusBar progress={progress} />
        <AltitudeChip progress={progress} />
      </div>
    </div>
  )
}
