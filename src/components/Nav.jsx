import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { site, navLinks, sectionIds, resumeUrl } from '../data/site.js'
import { useTheme } from '../hooks/useTheme.js'
import { useLocalTime } from '../hooks/useLocalTime.js'
import { useActiveSection } from '../hooks/useActiveSection.js'
import { gsap, getLenis } from '../lib/scroll.js'
import { Sun, Moon, Menu, Close, GitHub, LinkedIn, Mail, ArrowUpRight } from './Icons.jsx'
import s from './Nav.module.css'

export default function Nav() {
  const { theme, toggle } = useTheme()
  const time = useLocalTime(site.timeZone)
  const active = useActiveSection(sectionIds)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const barRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // A hairline along the bottom of the nav fills up as you read.
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(barRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.15 },
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!open) return undefined
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    getLenis()?.stop()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      getLenis()?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const ThemeIcon = theme === 'dark' ? Sun : Moon

  return (
    <>
      <header className={`${s.nav} ${scrolled || open ? s.scrolled : ''}`}>
        <div className={`container ${s.inner}`}>
          <a className={s.brand} href="#top" onClick={() => setOpen(false)}>
            {site.name}
            <em>.</em>
          </a>

          <nav className={s.links} aria-label="Primary">
            {navLinks.map((l) => (
              <a key={l.id} href={`#${l.id}`} className={active === l.id ? s.active : ''}>
                {l.label}
              </a>
            ))}
          </nav>

          <div className={s.right}>
            <a className={s.resume} href={resumeUrl} target="_blank" rel="noreferrer">
              Résumé <ArrowUpRight width={13} height={13} />
            </a>
            <span className={`mono ${s.clock}`} title={`Local time in ${site.location}`}>
              Toronto&nbsp;{time}
            </span>
            <button
              type="button"
              className={s.iconBtn}
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
            >
              <ThemeIcon />
            </button>
            <button
              type="button"
              className={`${s.iconBtn} ${s.menuBtn}`}
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <Close /> : <Menu />}
            </button>
          </div>
        </div>
        <span ref={barRef} className={s.progress} aria-hidden="true" />
      </header>

      <div id="mobile-menu" className={`${s.overlay} ${open ? s.overlayOpen : ''}`} aria-hidden={!open}>
        <nav className={s.overlayLinks} aria-label="Mobile">
          {navLinks.map((l, i) => (
            <a key={l.id} href={`#${l.id}`} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              <span>{l.label}</span>
              <span className="label">0{i + 1}</span>
            </a>
          ))}
        </nav>
        <div className={s.overlayFoot}>
          <a href={`mailto:${site.email}`} tabIndex={open ? 0 : -1}>
            <Mail /> Email
          </a>
          <a href={site.github} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
            <GitHub /> GitHub
          </a>
          <a href={site.linkedin} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
            <LinkedIn /> LinkedIn
          </a>
          <a href={resumeUrl} target="_blank" rel="noreferrer" tabIndex={open ? 0 : -1}>
            <ArrowUpRight /> Résumé
          </a>
        </div>
      </div>
    </>
  )
}
