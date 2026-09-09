import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { site, resumeUrl } from '../data/site.js'
import { useLocalTime } from '../hooks/useLocalTime.js'
import { gsap } from '../lib/scroll.js'
import SectionHeading from './SectionHeading.jsx'
import Reveal from './Reveal.jsx'
import ContactFigure from './ContactFigure.jsx'
import { GitHub, LinkedIn, Mail, Copy, Check, ArrowUp, ArrowUpRight } from './Icons.jsx'
import s from './Footer.module.css'

export default function Footer() {
  const time = useLocalTime(site.timeZone)
  const [copied, setCopied] = useState(false)
  const mastheadRef = useRef(null)

  useEffect(() => {
    if (!copied) return undefined
    const id = setTimeout(() => setCopied(false), 2000)
    return () => clearTimeout(id)
  }, [copied])

  // The name rises out of the bottom edge as the footer comes into view.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const words = mastheadRef.current.querySelectorAll(`.${s.word}`)
      gsap.fromTo(
        words,
        { yPercent: 105 },
        {
          yPercent: 0,
          stagger: 0.12,
          ease: 'none',
          scrollTrigger: { trigger: mastheadRef.current, start: 'top 100%', end: 'top 72%', scrub: 0.5 },
        },
      )
    })
    return () => mm.revert()
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }

  return (
    <footer id="contact" className={s.footer}>
      <div className={`container ${s.top}`}>
        <SectionHeading number="04" label="Contact" />

        <Reveal className={s.lead}>
          <h2 className={s.cta}>
            Have something worth building?{' '}
            <a href={`mailto:${site.email}`}>Let’s talk.</a>
          </h2>
          <p className={s.avail}>{site.availability}</p>
        </Reveal>

        <ContactFigure className={s.figure} />

        <Reveal className={s.row} delay={100}>
          <div className={s.email}>
            <a className="link" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <button type="button" className={`label ${s.copy}`} onClick={copyEmail} aria-live="polite">
              {copied ? <Check width={14} height={14} /> : <Copy width={14} height={14} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <a className={`label ${s.copy}`} href={resumeUrl} target="_blank" rel="noreferrer">
              <ArrowUpRight width={14} height={14} />
              Résumé
            </a>
          </div>

          <ul className={s.socials}>
            <li>
              <a href={site.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                <GitHub />
              </a>
            </li>
            <li>
              <a href={site.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <LinkedIn />
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} aria-label="Email">
                <Mail />
              </a>
            </li>
          </ul>
        </Reveal>
      </div>

      <div ref={mastheadRef} className={s.masthead} aria-hidden="true">
        <span className={s.name}>
          {site.name.split(' ').map((word, i) => (
            <span key={i} className={s.word}>
              {word}
              {i < site.name.split(' ').length - 1 ? ' ' : ''}
            </span>
          ))}
        </span>
      </div>

      <div className={`container ${s.bottom}`}>
        <p className="mono">
          © {new Date().getFullYear()} {site.name} · Toronto, {time}
        </p>
        <p className="mono">Set in Instrument Serif and Geist. Built with React, Vite, and Three.js.</p>
        <a className={`mono ${s.up}`} href="#top">
          Back to top <ArrowUp width={14} height={14} />
        </a>
      </div>
    </footer>
  )
}
