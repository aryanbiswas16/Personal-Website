import { Fragment, useLayoutEffect, useRef } from 'react'
import { experience } from '../data/experience.js'
import { gsap, ScrollTrigger } from '../lib/scroll.js'
import SectionHeading from './SectionHeading.jsx'
import Reveal from './Reveal.jsx'
import s from './Experience.module.css'

/** Turns "**bold**" markers in a string into <strong> elements. */
function emphasize(text) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : <Fragment key={i}>{part}</Fragment>,
  )
}

export default function Experience() {
  const listRef = useRef(null)

  // Each row draws its own rule as it arrives, and the dates light up for the row you're reading.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const rows = gsap.utils.toArray(`.${s.row}`, listRef.current)
      rows.forEach((row) => {
        const line = row.querySelector(`.${s.line}`)
        const when = row.querySelector(`.${s.when}`)
        gsap.from(line, {
          scaleX: 0,
          duration: 1.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'bottom 94%', once: true },
        })
        ScrollTrigger.create({
          trigger: row,
          start: 'top 60%',
          end: 'bottom 40%',
          toggleClass: { targets: when, className: s.active },
        })
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="experience" className={`container ${s.section}`}>
      <SectionHeading number="02" label="Experience" title="Where I’ve worked." />

      <ol ref={listRef} className={s.list}>
        {experience.map((job, i) => (
          <Reveal as="li" key={`${job.company}-${job.start}`} className={s.row} delay={i * 40}>
            <div className={s.when}>
              <span className={`mono ${s.date}`}>
                {job.start} — {job.end}
              </span>
              <span className={`label ${s.loc}`}>{job.location}</span>
            </div>

            <div className={s.who}>
              <h3 className={s.role}>{job.role}</h3>
              <p className={s.org}>
                <a className="link" href={job.companyUrl} target="_blank" rel="noreferrer">
                  {job.company}
                </a>
              </p>
              {job.note && <p className={`mono ${s.note}`}>{job.note}</p>}
            </div>

            <ul className={s.what}>
              {job.bullets.map((b, j) => (
                <li key={j}>{emphasize(b)}</li>
              ))}
            </ul>

            <span className={s.line} aria-hidden="true" />
          </Reveal>
        ))}
      </ol>
    </section>
  )
}
