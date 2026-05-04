import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function sm(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export function MistField({ progressRef, count = 800 }) {
  const meshRef = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 120
      arr[i * 3 + 1] =  Math.random() * 20 + 5
      arr[i * 3 + 2] = (Math.random() - 0.5) * 120
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    const t = progressRef.current
    // Fade in at 0.35, peak at 0.45, fade out at 0.65
    let opacity = 0
    if (t < 0.45) opacity = sm(0.35, 0.50, t) * 0.15
    else          opacity = sm(0.65, 0.50, t) * 0.15  // fade out direction reversed

    if (!meshRef.current) return
    meshRef.current.material.opacity = Math.max(0, opacity)

    if (opacity < 0.005) return

    const pos = meshRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const ix = i * 3, iz = i * 3 + 2
      pos[ix] += Math.sin(pos[iz] * 0.02) * delta * 0.05
      pos[iz] += delta * 0.06
      if (pos[iz] > 60) pos[iz] = -60
    }
    meshRef.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.2}
        color="#c8d8e8"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}
