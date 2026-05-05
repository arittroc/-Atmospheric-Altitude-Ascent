import { useMemo } from 'react'
import * as THREE from 'three'

// Deterministic pseudo-random based on position
function hash(n) {
  return (((Math.sin(n) * 43758.5453123) % 1) + 1) % 1
}

function valueNoise2D(x, y) {
  const ix = Math.floor(x), iy = Math.floor(y)
  const fx = x - ix, fy = y - iy
  const ux = fx * fx * (3 - 2 * fx)
  const uy = fy * fy * (3 - 2 * fy)
  const a = hash(ix + iy * 157)
  const b = hash(ix + 1 + iy * 157)
  const c = hash(ix + (iy + 1) * 157)
  const d = hash(ix + 1 + (iy + 1) * 157)
  return a + (b - a) * ux + (c - a) * uy + (d - b - c + a) * ux * uy
}

function fbm(x, y, octaves) {
  let val = 0, amp = 0.5, freq = 1, max = 0
  for (let i = 0; i < octaves; i++) {
    val += valueNoise2D(x * freq, y * freq) * amp
    max += amp
    amp *= 0.5
    freq *= 2.1
  }
  return val / max
}

function sm(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export function Mountain() {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(90, 90, 256, 256)
    geo.rotateX(-Math.PI / 2)

    const pos = geo.attributes.position.array
    const count = pos.length / 3
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const x = pos[i * 3]
      const z = pos[i * 3 + 2]

      // Mountain base shape — ridge centered at (0, -6)
      const px = x * 0.55
      const pz = z + 6
      const radial = Math.sqrt(px * px + pz * pz * 0.7)
      const base = Math.max(0, 27 - radial * 2.5)

      // Secondary ridge left-of-center for asymmetry
      const ridgeR = Math.sqrt((x - 8) * (x - 8) * 0.4 + (z + 2) * (z + 2) * 0.5)
      const ridge2 = Math.max(0, 14 - ridgeR * 2.2)

      // FBM noise for surface detail
      const n1 = (fbm(x * 0.07 + 3.1, z * 0.07 + 2.4, 3) - 0.5) * 11
      const n2 = (fbm(x * 0.22 + 1.1, z * 0.22 + 5.3, 3) - 0.5) * 4.5
      const n3 = (fbm(x * 0.65 + 7.0, z * 0.65 + 1.2, 2) - 0.5) * 1.8
      const n4 = (fbm(x * 1.8  + 2.5, z * 1.8  + 8.1, 1) - 0.5) * 0.6

      // Noise adds surface texture only where the mountain structure exists.
      // Where base=0 and ridge2=0 (sides, foreground, edges), noise is fully
      // suppressed so it cannot create isolated elevated patches — the source
      // of the floating grey blob artifact seen in the lower-right viewport.
      const structureH = base + ridge2 * 0.4
      const noiseMask = Math.min(1.0, structureH / 5.0)

      const h = Math.max(0, structureH + (n1 + n2 + n3 + n4) * noiseMask)
      pos[i * 3 + 1] = h

      // Vertex colors by height
      const snowT = sm(14, 20, h)
      const rockT = sm(4, 10, h)
      const screeT = sm(1, 4, h)

      // vegetation -> scree -> rock -> snow
      const vegR = 0.13, vegG = 0.20, vegB = 0.09
      const screeR = 0.30, screeG = 0.27, screeB = 0.24
      const rockR = 0.38, rockG = 0.35, rockB = 0.32
      const snowR = 0.90, snowG = 0.93, snowB = 0.98

      let r = vegR + (screeR - vegR) * screeT
      let g = vegG + (screeG - vegG) * screeT
      let b = vegB + (screeB - vegB) * screeT
      r = r + (rockR - r) * rockT
      g = g + (rockG - g) * rockT
      b = b + (rockB - b) * rockT
      r = r + (snowR - r) * snowT
      g = g + (snowG - g) * snowT
      b = b + (snowB - b) * snowT

      // Subtle ambient occlusion — darken hollows
      const ao = 0.85 + 0.15 * sm(0, 6, h)
      colors[i * 3]     = r * ao
      colors[i * 3 + 1] = g * ao
      colors[i * 3 + 2] = b * ao
    }

    geo.computeVertexNormals()
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    return geo
  }, [])

  return (
    <mesh geometry={geometry} position={[0, -5, 0]} receiveShadow>
      <meshStandardMaterial
        vertexColors
        roughness={0.88}
        metalness={0.04}
      />
    </mesh>
  )
}
