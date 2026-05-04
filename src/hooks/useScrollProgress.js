import { useRef, useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useScrollProgress() {
  const progressRef = useRef(0)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: '#scroll-proxy',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        progressRef.current = self.progress
      },
    })

    return () => st.kill()
  }, [])

  return progressRef
}
