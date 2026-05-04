import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Act colour stops
const DIR_COLORS = [
  new THREE.Color('#fff4e6'),  // Act I  — warm morning
  new THREE.Color('#c9d4e0'),  // Act II — cool overcast
  new THREE.Color('#ff9966'),  // Act III — golden hour
]
const DIR_INTENSITY = [1.0, 0.6, 1.4]

const AMB_COLORS = [
  new THREE.Color('#a8c5e0'),  // Act I
  new THREE.Color('#8090a8'),  // Act II
  new THREE.Color('#3a3550'),  // Act III
]
const AMB_INTENSITY = [0.5, 0.4, 0.3]

const RIM_COLORS = [
  new THREE.Color('#000000'),
  new THREE.Color('#000000'),
  new THREE.Color('#7a4a7e'),  // deep magenta rim — Act III only
]
const RIM_INTENSITY = [0, 0, 0.8]

function sm(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

// Linear interpolation between three colour stops
function lerpColors3(c0, c1, c2, t, out) {
  if (t <= 0.5) {
    out.lerpColors(c0, c1, t * 2)
  } else {
    out.lerpColors(c1, c2, (t - 0.5) * 2)
  }
}

export function Lighting({ progressRef }) {
  const dirRef = useRef()
  const ambRef = useRef()
  const rimRef = useRef()
  const { scene } = useThree()

  // Fog
  useEffect(() => {
    scene.fog = new THREE.FogExp2('#dde7f0', 0.008)
    return () => { scene.fog = null }
  }, [scene])

  const dirColor = useRef(new THREE.Color())
  const ambColor = useRef(new THREE.Color())
  const rimColor = useRef(new THREE.Color())
  const fogColor = useRef(new THREE.Color())

  useFrame(() => {
    const t = progressRef.current

    // Map progress to Act blend 0→1
    const act = sm(0, 0.70, t)  // 0 = Act I, 1 = Act III, 0.5 = mid-ascent

    lerpColors3(DIR_COLORS[0], DIR_COLORS[1], DIR_COLORS[2], act, dirColor.current)
    lerpColors3(AMB_COLORS[0], AMB_COLORS[1], AMB_COLORS[2], act, ambColor.current)
    lerpColors3(RIM_COLORS[0], RIM_COLORS[1], RIM_COLORS[2], act, rimColor.current)

    const dirInt = DIR_INTENSITY[0] + (DIR_INTENSITY[1] - DIR_INTENSITY[0]) * Math.min(1, act * 2)
    const ambInt = AMB_INTENSITY[0] + (AMB_INTENSITY[1] - AMB_INTENSITY[0]) * act
    const rimInt = RIM_INTENSITY[2] * sm(0.65, 0.90, t)

    if (dirRef.current) {
      dirRef.current.color.copy(dirColor.current)
      dirRef.current.intensity = act < 0.5 ? dirInt : dirInt + (DIR_INTENSITY[2] - dirInt) * ((act - 0.5) * 2)
    }
    if (ambRef.current) {
      ambRef.current.color.copy(ambColor.current)
      ambRef.current.intensity = ambInt
    }
    if (rimRef.current) {
      rimRef.current.color.copy(rimColor.current)
      rimRef.current.intensity = rimInt
    }

    // Fog density: ramp up mid-ascent, punch through cloud layer, thin at summit
    if (scene.fog) {
      let density
      if      (t < 0.35) density = 0.008 + sm(0, 0.35, t) * 0.017
      else if (t < 0.55) density = 0.025 - sm(0.35, 0.55, t) * 0.013
      else if (t < 0.70) density = 0.012 - sm(0.55, 0.70, t) * 0.008
      else               density = 0.004
      scene.fog.density = density

      // Fog colour shifts from pale blue → grey → blue-silver
      if      (t < 0.40) fogColor.current.lerpColors(new THREE.Color('#dde7f0'), new THREE.Color('#8a96a8'), sm(0, 0.40, t))
      else if (t < 0.55) fogColor.current.lerpColors(new THREE.Color('#8a96a8'), new THREE.Color('#b8c4d4'), sm(0.40, 0.55, t))
      else               fogColor.current.set('#b8c4d4')
      scene.fog.color.copy(fogColor.current)
    }
  })

  return (
    <>
      {/* Primary directional — positioned high and slightly left */}
      <directionalLight
        ref={dirRef}
        color="#fff4e6"
        intensity={1.0}
        position={[-8, 20, 10]}
        castShadow={false}
      />
      {/* Ambient fill */}
      <ambientLight ref={ambRef} color="#a8c5e0" intensity={0.5} />
      {/* Rim light — Act III only, from screen-right */}
      <directionalLight
        ref={rimRef}
        color="#000000"
        intensity={0}
        position={[20, 10, -5]}
      />
      {/* Subtle fill from below (sky reflection off snow) */}
      <hemisphereLight
        skyColor="#c8daf0"
        groundColor="#1a2030"
        intensity={0.3}
      />
    </>
  )
}
