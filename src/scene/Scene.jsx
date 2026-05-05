import { Suspense } from 'react'
import { Mountain } from './Mountain'
import { CameraRig } from './CameraRig'
import { Lighting } from './Lighting'
import { SnowField } from './SnowField'
import { MistField } from './MistField'

export function Scene({ progressRef }) {
  return (
    <Suspense fallback={null}>
      <CameraRig progressRef={progressRef} />
      <Lighting progressRef={progressRef} />
      {/* <Mountain /> */}
      <MistField progressRef={progressRef} />
      <SnowField progressRef={progressRef} />
    </Suspense>
  )
}
