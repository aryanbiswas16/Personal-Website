import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { site } from '../data/site.js'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/scroll.js'
import { hasWebGL } from '../lib/parts.js'
import s from './ContactFigure.module.css'

const PlaneScene = lazy(() => import('./PlaneScene.jsx'))
const COUNT = 1000

/** Static stand-in for the 3D scene: the plane, already folded. */
function PlaneFallback() {
  return (
    <svg className={s.fallback} viewBox="0 0 320 240" aria-hidden="true">
      <polygon points="296,44 36,122 150,140" fill="var(--parts)" opacity="0.85" />
      <polygon points="296,44 150,140 204,146" fill="var(--parts)" opacity="0.5" />
      <polygon points="296,44 150,140 172,198" fill="var(--parts-accent)" opacity="0.9" />
    </svg>
  )
}

/**
 * The closing figure: the hero's parts come back and fold into a paper plane as the contact
 * section scrolls in. The whole thing is a link to email, so the plane is the send button.
 */
export default function ContactFigure({ className = '' }) {
  const figureRef = useRef(null)
  const sceneRef = useRef(null)
  const progressRef = useRef(0)
  const [folded, setFolded] = useState(false)
  const [active, setActive] = useState(true)
  const [live] = useState(() => hasWebGL() && !prefersReducedMotion())

  // Scrolling the figure into view folds the plane.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      progressRef.current = 1
      setFolded(true)
      return undefined
    }
    const ctx = gsap.context(() => {
      let was = false
      ScrollTrigger.create({
        trigger: figureRef.current,
        start: 'top 92%',
        end: 'center 60%',
        onUpdate: (self) => {
          progressRef.current = self.progress
          const now = self.progress > 0.92
          if (now !== was) {
            was = now
            setFolded(now)
          }
        },
      })
    })
    return () => ctx.revert()
  }, [])

  // Only render the scene while it's on screen. Ignore entries without rootBounds, which the
  // observer reports while an ancestor is briefly re-parented, and act on the latest one.
  useEffect(() => {
    const el = sceneRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        const last = entries.filter((e) => e.rootBounds).at(-1)
        if (last) setActive(last.isIntersecting)
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <figure ref={figureRef} className={`${s.figure} ${className}`.trim()}>
      <a className={s.stage} href={`mailto:${site.email}`} aria-label={`Email ${site.name}`}>
        <div ref={sceneRef} className={s.scene} aria-hidden="true">
          {live ? (
            <Suspense fallback={null}>
              <PlaneScene count={COUNT} progressRef={progressRef} active={active} />
            </Suspense>
          ) : (
            <PlaneFallback />
          )}
        </div>
      </a>
      <figcaption className={`mono ${s.caption}`}>
        <span>Fig. 03 — {COUNT.toLocaleString()} parts, folded</span>
        <span>{folded ? 'Ready to send.' : 'Scroll to fold them'}</span>
      </figcaption>
    </figure>
  )
}
