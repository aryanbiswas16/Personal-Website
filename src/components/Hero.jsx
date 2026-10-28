import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { site, resumeUrl } from '../data/site.js'
import { portraitLarge, portraitSmall } from '../data/portrait.js'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/scroll.js'
import { hasWebGL } from '../lib/parts.js'
import { ArrowDown, ArrowUpRight } from './Icons.jsx'
import Reveal from './Reveal.jsx'
import s from './Hero.module.css'

const HeroScene = lazy(() => import('./HeroScene.jsx'))

const HEADLINE = [
  { t: 'I' },
  { t: 'build' },
  { t: 'software' },
  { t: 'that' },
  { t: 'does' },
  { t: 'the' },
  { t: 'boring', em: true },
  { t: 'parts.', em: true },
]

const pickPortrait = () => (window.innerWidth < 900 ? portraitSmall : portraitLarge)

/** Static stand-in for the 3D scene: the portrait, already assembled. */
function PortraitFallback() {
  const { cols, rows, cells } = portraitLarge
  const tiles = []
  for (let i = 0; i < cells.length; i += 5) {
    const [c, r, red, green, blue] = cells.slice(i, i + 5)
    tiles.push(
      <rect
        key={i}
        x={c * 10 + 1}
        y={r * 10 + 1}
        width="8"
        height="8"
        rx="1"
        fill={`rgb(${red} ${green} ${blue})`}
      />,
    )
  }
  return (
    <svg className={s.fallback} viewBox={`0 0 ${cols * 10} ${rows * 10}`} aria-hidden="true">
      {tiles}
    </svg>
  )
}

export default function Hero() {
  const stageRef = useRef(null)
  const sceneRef = useRef(null)
  const progressRef = useRef(0)
  const [sorted, setSorted] = useState(false)
  const [sceneActive, setSceneActive] = useState(true)
  const [scene] = useState(() => ({
    live: hasWebGL() && !prefersReducedMotion(),
    portrait: pickPortrait(),
    poke: window.matchMedia('(pointer: fine)').matches,
  }))

  // The parts assemble into the portrait on load, then drift apart again as the hero scrolls away.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      progressRef.current = 1
      setSorted(true)
      return undefined
    }
    const state = { intro: 0, scroll: 0 }
    let wasSorted = false
    const update = () => {
      progressRef.current = state.intro * (1 - 0.7 * state.scroll)
      const now = progressRef.current > 0.9
      if (now !== wasSorted) {
        wasSorted = now
        setSorted(now)
      }
    }
    const intro = gsap.to(state, { intro: 1, duration: 2.8, delay: 0.9, ease: 'power2.inOut', onUpdate: update })
    const exit = ScrollTrigger.create({
      trigger: stageRef.current,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        state.scroll = self.progress
        update()
      },
    })
    return () => {
      intro.kill()
      exit.kill()
    }
  }, [])

  // Only render the scene while it's on screen. Ignore entries without rootBounds, which the
  // observer can report while the layout settles; only the latest real measurement counts.
  useEffect(() => {
    const el = sceneRef.current
    if (!el) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        const last = entries.filter((e) => e.rootBounds).at(-1)
        if (last) setSceneActive(last.isIntersecting)
      },
      { threshold: 0 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const parts = scene.portrait.cells.length / 5

  return (
    <section id="top" className={s.hero}>
      <div ref={stageRef} className={s.stage}>
        {/* The parts fill the whole stage, behind the copy. */}
        <div ref={sceneRef} className={s.layer} aria-hidden="true">
          {scene.live ? (
            <Suspense fallback={null}>
              <HeroScene portrait={scene.portrait} progressRef={progressRef} active={sceneActive} />
            </Suspense>
          ) : (
            <PortraitFallback />
          )}
        </div>

        <div className={`container ${s.grid}`}>
          <div className={s.copy}>
            <p className={`label ${s.eyebrow}`}>
              <span className={s.dot} aria-hidden="true" />
              <span>Now at TCS Pace Port</span>
              <span className={`${s.sep} ${s.roleSeg}`} aria-hidden="true">
                ·
              </span>
              <span className={s.roleSeg}>AI/ML engineer</span>
              <span className={s.sep} aria-hidden="true">
                ·
              </span>
              <span>{site.location}</span>
            </p>

            <p className={s.hello}>
              <span className={s.mask}>
                <span className={s.word} style={{ animationDelay: '80ms' }}>
                  Hi, I’m Aryan.
                </span>
              </span>
            </p>

            <h1 className={s.headline}>
              <span className="visually-hidden">Aryan Biswas. </span>
              {HEADLINE.map((w, i) => (
                <span key={i}>
                  <span className={s.mask}>
                    <span className={s.word} style={{ animationDelay: `${220 + i * 55}ms` }}>
                      {w.em ? <em>{w.t}</em> : w.t}
                    </span>
                  </span>{' '}
                </span>
              ))}
            </h1>

            <p className={s.lede}>
              I’m an AI/ML engineer at TCS Pace Port in Toronto and a 2026 Queen’s Computing grad.
              Right now I’m teaching computer vision to read flotation froth for one of the world’s
              largest mining companies. Before that: a generative-AI platform at BMO that turns Figma designs into
              production Angular, and DeepfakeGuard, a deepfake detector published at CUCAI 2026.
              Also one comedy-horror game about getting home for dinner.
            </p>

            <div className={s.cta}>
              <a className="btn primary" href="#work">
                See the work <ArrowDown />
              </a>
              <a className="btn ghost" href={`mailto:${site.email}`}>
                Get in touch
              </a>
              <a className={`link ${s.resume}`} href={resumeUrl} target="_blank" rel="noreferrer">
                Résumé <ArrowUpRight width={14} height={14} />
              </a>
            </div>
          </div>
        </div>

        <p className={`container mono ${s.caption}`} aria-live="polite">
          <span>Fig. 01 — The author, in {parts.toLocaleString()} parts</span>
          <span>{sorted ? (scene.poke && scene.live ? 'Go on, poke it.' : 'Messy in, clean out.') : 'Assembling…'}</span>
        </p>
      </div>

      <Reveal as="dl" className={`container ${s.facts}`}>
        <div className={s.fact}>
          <dt className="label">Now</dt>
          <dd>{site.availability}</dd>
        </div>
        <div className={s.fact}>
          <dt className="label">Studied</dt>
          <dd>Queen’s University, BComp (Hons) in Software Design, class of 2026</dd>
        </div>
        <div className={s.fact}>
          <dt className="label">Published</dt>
          <dd>
            <a className="link" href="https://cucai.ca/papers/42" target="_blank" rel="noreferrer">
              DeepfakeGuard
            </a>
            , spotlight paper at CUCAI 2026
          </dd>
        </div>
        <div className={s.fact}>
          <dt className="label">Find me</dt>
          <dd>
            <a className="link" href={site.github} target="_blank" rel="noreferrer">
              GitHub
            </a>
            {' · '}
            <a className="link" href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            {' · '}
            <a className="link" href={`mailto:${site.email}`}>
              Email
            </a>
            {' · '}
            <a className="link" href={resumeUrl} target="_blank" rel="noreferrer">
              Résumé
            </a>
          </dd>
        </div>
      </Reveal>
    </section>
  )
}
