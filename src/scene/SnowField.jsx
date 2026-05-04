import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function sm(a, b, x) {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export function SnowField({ progressRef, count = 1500 }) {
  const meshRef = useRef()

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 200
      arr[i * 3 + 1] =  Math.random() * 200 - 80
      arr[i * 3 + 2] = (Math.random() - 0.5) * 200
    }
    return arr
  }, [count])

  useFrame((_, delta) => {
    const t = progressRef.current
    const opacity = sm(0.70, 0.85, t)

    if (!meshRef.current) return
    meshRef.current.material.opacity = opacity

    if (opacity < 0.01) return

    const pos = meshRef.current.geometry.attributes.position.array
    for (let i = 0; i < count; i++) {
      const iy = i * 3 + 1
      const ix = i * 3
      pos[iy] -= delta * 0.4
      pos[ix] += Math.sin(pos[iy] * 0.05) * delta * 0.1
      if (pos[iy] < -80) pos[iy] = 120
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
        size={0.15}
        color="#e8f0ff"
        transparent
        opacity={0}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}
