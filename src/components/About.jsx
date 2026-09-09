import { useLayoutEffect, useRef } from 'react'
import { site } from '../data/site.js'
import { skills } from '../data/skills.js'
import { useLocalTime } from '../hooks/useLocalTime.js'
import { gsap, parallaxImages } from '../lib/scroll.js'
import SectionHeading from './SectionHeading.jsx'
import Reveal from './Reveal.jsx'
import photo from '../assets/aryan-about.webp'
import s from './About.module.css'

const QUOTE =
  'I like the part of software engineering where a tedious, repetitive job quietly turns into a button.'

const facts = [
  ['Now', site.availability],
  ['Education', 'Bachelor of Computing (Honours), Software Design. Queen’s University, 2021 to 2026, 3.8 GPA'],
  ['Into', 'Developer tooling, applied machine learning, LLM systems, computer vision, games'],
]

export default function About() {
  const time = useLocalTime(site.timeZone)
  const rootRef = useRef(null)
  const quoteRef = useRef(null)

  // The pull-quote lights up word by word as it crosses the viewport.
  useLayoutEffect(() => {
    const stopParallax = parallaxImages(rootRef.current, 6)
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const words = quoteRef.current.querySelectorAll(`.${s.w}`)
      gsap.fromTo(
        words,
        { opacity: 0.18 },
        {
          opacity: 1,
          stagger: 0.06,
          ease: 'none',
          scrollTrigger: { trigger: quoteRef.current, start: 'top 78%', end: 'bottom 42%', scrub: 0.4 },
        },
      )
    })
    return () => {
      mm.revert()
      stopParallax()
    }
  }, [])

  return (
    <section id="about" ref={rootRef} className={`container ${s.section}`}>
      <SectionHeading number="03" label="About" title="A little more about me." />

      <div className={s.grid}>
        <div className={s.side}>
          <Reveal as="figure" className={s.figure}>
            <div className={s.frame}>
              <img
                src={photo}
                width="1000"
                height="1250"
                alt="Aryan Biswas leaning against an orange wall at night, arms crossed, with a lit pool and palm trees behind him."
                loading="lazy"
                decoding="async"
                data-parallax
              />
            </div>
            <figcaption className="mono">Fig. 02 — The author, off duty.</figcaption>
          </Reveal>

          <Reveal as="dl" className={s.dl} delay={100}>
            {facts.map(([k, v]) => (
              <div key={k}>
                <dt className="label">{k}</dt>
                <dd>{v}</dd>
              </div>
            ))}
            <div>
              <dt className="label">Based in</dt>
              <dd>
                {site.location}. It’s <span className={s.time}>{time}</span> here.
              </dd>
            </div>
          </Reveal>
        </div>

        <div className={s.body}>
          <p ref={quoteRef} className={s.big}>
            <span className="visually-hidden">{QUOTE}</span>
            <span aria-hidden="true">
              {QUOTE.split(' ').map((word, i) => (
                <span key={i}>
                  <span className={s.w}>{word}</span>{' '}
                </span>
              ))}
            </span>
          </p>

          <Reveal className={s.prose}>
            <p>
              I studied computing at Queen’s University, specializing in software design, and
              graduated in 2026. Along the way I spent a year and a half at BMO through TCS Pace
              Port, first as an AI research intern and then as an AI engineer: a generative-AI
              platform that turns Figma designs into production Angular for a hundred-plus internal
              users, LLM agents that draft QA test cases, a refactoring system that migrates legacy
              AngularJS, churn models, OCR pipelines. Most of it follows the same pattern. Find the
              boring part of a workflow, then make it disappear.
            </p>
            <p>
              At Queen’s I led an AI research project at QMind, where a team of five built{' '}
              <a
                className="link"
                href="https://github.com/aryanbiswas16/DeepFakeGuard"
                target="_blank"
                rel="noreferrer"
              >
                DeepfakeGuard
              </a>
              , an open-source multimodal deepfake detector I first-authored as a{' '}
              <a className="link" href="https://cucai.ca/papers/42" target="_blank" rel="noreferrer">
                spotlight paper at CUCAI 2026
              </a>
              . I’ve also shipped an autograder, a ROS 2 autonomous wheelchair, a couple of Chrome
              extensions, a fix that was merged into the ACE-Step music model, and exactly one game
              about monsters in an office.
            </p>
            <p>
              I’m looking for a full-time role where I can keep doing this, in AI engineering or
              software development, in Toronto or remote. If that sounds like your team,{' '}
              <a className="link" href={`mailto:${site.email}`}>
                I’d like to hear from you
              </a>
              .
            </p>
          </Reveal>
        </div>
      </div>

      <Reveal className={s.skills} delay={60}>
        <h3 className={s.skillsTitle}>What I work with.</h3>
        <dl className={s.skillRows}>
          {skills.map(({ group, items }) => (
            <div key={group} className={s.skillRow}>
              <dt className="label">{group}</dt>
              <dd>
                <ul className={s.skillList}>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </section>
  )
}
