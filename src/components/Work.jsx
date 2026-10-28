import { useEffect, useLayoutEffect, useRef } from 'react'
import { projects, more } from '../data/projects.js'
import { parallaxImages } from '../lib/scroll.js'
import SectionHeading from './SectionHeading.jsx'
import Reveal from './Reveal.jsx'
import SignFigure from './SignFigure.jsx'
import PullRequestFigure from './PullRequestFigure.jsx'
import MotiveFigure from './MotiveFigure.jsx'
import DropAlertFigure from './DropAlertFigure.jsx'
import AgentFigure from './AgentFigure.jsx'
import { ArrowUpRight } from './Icons.jsx'
import Paper from './Paper.jsx'
import s from './Work.module.css'

const FIGURES = {
  sign: SignFigure,
  pullRequest: PullRequestFigure,
  motiveMap: MotiveFigure,
  dropAlerts: DropAlertFigure,
  agents: AgentFigure,
}

/** A muted demo loop that only plays while on screen, and not at all with reduced motion. */
function LoopVideo({ video, label }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) el.play().catch(() => {})
      else el.pause()
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <video ref={ref} poster={video.poster} muted loop playsInline preload="none" aria-label={label}>
      <source src={video.webm} type="video/webm" />
      <source src={video.mp4} type="video/mp4" />
    </video>
  )
}

function Figure({ project }) {
  const primary = project.links.find((l) => l.primary) ?? project.links[0]
  const Drawn = project.figure ? FIGURES[project.figure] : null
  const className = `${s.figure} ${project.imageFit === 'contain' || project.video ? s.contain : ''}`
  // Projects without a public link get a plain frame instead of a link.
  const Frame = primary ? 'a' : 'div'
  const frameProps = primary
    ? {
        href: primary.href,
        target: '_blank',
        rel: 'noreferrer',
        'aria-label': `${project.title} — ${primary.label}`,
      }
    : {}
  return (
    <Frame className={className} {...frameProps}>
      {Drawn ? (
        <Drawn />
      ) : project.video ? (
        <LoopVideo video={project.video} label={project.imageAlt} />
      ) : (
        <img
          src={project.image}
          alt={project.imageAlt}
          loading="lazy"
          decoding="async"
          style={{ objectPosition: project.imagePosition, objectFit: project.imageFit ?? 'cover' }}
          data-parallax
        />
      )}
      <span className={`label ${s.kind}`}>{project.kind}</span>
    </Frame>
  )
}

function Meta({ project, index }) {
  return (
    <div className={s.meta}>
      <div className={s.top}>
        <span className="label">{String(index + 1).padStart(2, '0')}</span>
        <span className="label">{project.kind}</span>
      </div>
      <h3 className={s.title}>
        {project.links.length > 0 ? (
          <a href={project.links[0].href} target="_blank" rel="noreferrer">
            {project.title}
          </a>
        ) : (
          project.title
        )}
      </h3>
      <p className={s.desc}>{project.desc}</p>
      {project.credit && <p className={`mono ${s.credit}`}>{project.credit}</p>}
      {project.paper && <Paper paper={project.paper} />}
      <ul className={s.tags} aria-label="Built with">
        {project.tags.map((t) => (
          <li key={t} className="mono">
            {t}
          </li>
        ))}
      </ul>
      {project.links.length > 0 && (
        <div className={s.links}>
          {project.links.map((l) => (
            <a key={l.href} className="link" href={l.href} target="_blank" rel="noreferrer">
              {l.label} <ArrowUpRight width={14} height={14} />
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Work() {
  const rootRef = useRef(null)

  useLayoutEffect(() => parallaxImages(rootRef.current, 7), [])

  return (
    <section id="work" ref={rootRef} className={`container ${s.section}`}>
      <SectionHeading
        number="01"
        label="Selected work"
        title="Things I’ve built."
        sub="Client work I can show, side projects, and the home lab running on my Mac mini. The earlier BMO work is internal, so it’s described under Experience rather than shown here."
      />

      <div className={s.grid}>
        {projects.map((p, i) => (
          <Reveal
            as="article"
            key={p.id}
            className={p.featured ? `${s.feature} ${p.flip ? s.featureFlip : ''}`.trim() : s.item}
            delay={p.featured ? 0 : (i % 2) * 90}
          >
            <Figure project={p} />
            <Meta project={p} index={i} />
          </Reveal>
        ))}
      </div>

      <div className={s.more}>
        <p className={`label ${s.moreLabel}`}>Also built</p>
        <ol className={s.moreList}>
          {more.map((m, i) => (
            <Reveal as="li" key={m.title} className={s.moreItem} delay={(i % 2) * 60}>
              <span className="label">{String(projects.length + i + 1).padStart(2, '0')}</span>
              <div>
                <h3 className={s.moreTitle}>{m.title}</h3>
                <p className={s.moreDesc}>{m.desc}</p>
              </div>
              <span className={`mono ${s.moreWhere}`}>{m.where}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
