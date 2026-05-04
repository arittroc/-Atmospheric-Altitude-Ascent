import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const CONTROL_POINTS = [
  [  0,  2.0,  18 ],  // basecamp — low approach
  [  4,  5.5,  14 ],  // first switchback
  [ -3, 11.0,  10 ],  // second switchback
  [  4, 17.5,   6 ],  // above treeline
  [ -2, 25.0,   2 ],  // below summit ridge
  [  0, 32.0,  -2 ],  // summit hover
]

// Idle drift parameters
const DRIFT_AMP_X = 0.12
const DRIFT_AMP_Y = 0.06
const DRIFT_FREQ  = 0.4

export function CameraRig({ progressRef }) {
  const { camera } = useThree()
  const lookTarget  = useRef(new THREE.Vector3(0, 16, 0))
  const posTarget   = useRef(new THREE.Vector3(0, 2, 18))
  const clock       = useRef(0)

  const curve = useMemo(
    () => new THREE.CatmullRomCurve3(
      CONTROL_POINTS.map(p => new THREE.Vector3(...p)),
      false,
      'catmullrom',
      0.5,
    ),
    [],
  )

  // Look-ahead target along the curve
  const peakTarget = useMemo(() => new THREE.Vector3(0, 22, 0), [])

  useFrame((_, delta) => {
    clock.current += delta

    const t = THREE.MathUtils.clamp(progressRef.current, 0, 0.9999)

    const pos  = curve.getPointAt(t)
    const tan  = curve.getTangentAt(t)

    // Early in journey look toward the peak; later follow tangent
    const blendToTangent = Math.min(1, t * 4)
    const tangentLook = new THREE.Vector3(
      pos.x + tan.x * 8,
      pos.y + tan.y * 4,
      pos.z + tan.z * 8,
    )
    const lt = new THREE.Vector3().lerpVectors(peakTarget, tangentLook, blendToTangent)

    // Idle drift on x/y only when nearly still (low progress velocity)
    const driftX = Math.sin(clock.current * DRIFT_FREQ) * DRIFT_AMP_X
    const driftY = Math.sin(clock.current * DRIFT_FREQ * 0.7) * DRIFT_AMP_Y

    pos.x += driftX
    pos.y += driftY

    posTarget.current.lerp(pos, 0.08)
    lookTarget.current.lerp(lt, 0.06)

    camera.position.copy(posTarget.current)
    camera.lookAt(lookTarget.current)
  })

  return null
}
