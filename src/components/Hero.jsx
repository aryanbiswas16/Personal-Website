import { lazy, Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { site, resumeUrl } from '../data/site.js'
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

function partCount() {
  const w = window.innerWidth
  if (w < 900) return 700
  if (w < 1400) return 1300
  return 1800
}

/** Static stand-in for the 3D scene: the parts, already sorted into a tidy grid. */
function PartsFallback() {
  const cols = 18
  const rows = 22
  const cells = []
  let seed = 7
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      seed = (seed * 16807) % 2147483647
      const accent = seed / 2147483647 < 0.08
      cells.push(
        <rect
          key={`${r}-${c}`}
          x={c * 10 + 2}
          y={r * 10 + 2}
          width="6"
          height="6"
          rx="1"
          fill={accent ? 'var(--parts-accent)' : 'var(--parts)'}
        />,
      )
    }
  }
  return (
    <svg className={s.fallback} viewBox={`0 0 ${cols * 10} ${rows * 10}`} aria-hidden="true">
      {cells}
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
    count: partCount(),
  }))

  // Scroll drives the sorting. On wide screens the hero holds still while it happens.
  useLayoutEffect(() => {
    if (prefersReducedMotion()) {
      progressRef.current = 1
      setSorted(true)
      return undefined
    }
    const mm = gsap.matchMedia()
    mm.add({ desktop: '(min-width: 900px)', mobile: '(max-width: 899px)' }, (ctx) => {
      const { desktop } = ctx.conditions
      let wasSorted = false
      ScrollTrigger.create({
        trigger: stageRef.current,
        start: 'top top',
        end: desktop ? '+=75%' : '+=45%',
        pin: desktop,
        anticipatePin: desktop ? 1 : 0,
        onUpdate: (self) => {
          progressRef.current = self.progress
          const now = self.progress > 0.9
          if (now !== wasSorted) {
            wasSorted = now
            setSorted(now)
          }
        },
      })
    })
    return () => mm.revert()
  }, [])

  // Only render the scene while it's on screen. ScrollTrigger re-parents the pinned stage while it
  // sets up, which the observer reports as a detached (rootBounds-less) "not intersecting" entry,
  // sometimes batched with the re-attach. Only the latest real measurement counts.
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

  return (
    <section id="top" className={s.hero}>
      <div ref={stageRef} className={s.stage}>
        {/* The parts fill the whole stage, behind the copy. */}
        <div ref={sceneRef} className={s.layer} aria-hidden="true">
          {scene.live ? (
            <Suspense fallback={null}>
              <HeroScene count={scene.count} progressRef={progressRef} active={sceneActive} />
            </Suspense>
          ) : (
            <PartsFallback />
          )}
        </div>

        <div className={`container ${s.grid}`}>
          <div className={s.copy}>
            <p className={`label ${s.eyebrow}`}>
              <span className={s.dot} aria-hidden="true" />
              <span>Available</span>
              <span className={`${s.sep} ${s.roleSeg}`} aria-hidden="true">
                ·
              </span>
              <span className={s.roleSeg}>{site.role}</span>
              <span className={s.sep} aria-hidden="true">
                ·
              </span>
              <span>{site.location}</span>
            </p>

            <h1 className={s.headline}>
              {HEADLINE.map((w, i) => (
                <span key={i}>
                  <span className={s.mask}>
                    <span className={s.word} style={{ animationDelay: `${120 + i * 55}ms` }}>
                      {w.em ? <em>{w.t}</em> : w.t}
                    </span>
                  </span>{' '}
                </span>
              ))}
            </h1>

            <p className={s.lede}>
              I’m Aryan Biswas, a software developer and AI engineer in Toronto, Queen’s Computing
              class of 2026. I take messy problems and turn them into clean, working systems. Lately:
              a generative-AI platform at BMO that turns Figma designs into production Angular, an LLM
              system that migrates legacy code, and DeepfakeGuard, a multimodal deepfake detector
              published at CUCAI 2026. Also one comedy-horror game about getting home for dinner.
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
          <span>
            Fig. 01 — {scene.count.toLocaleString()} parts, {sorted ? 'sorted' : 'loose'}
          </span>
          <span>{sorted ? 'Messy in, clean out.' : 'Scroll to sort them'}</span>
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
