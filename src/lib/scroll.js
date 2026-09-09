import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

let lenis = null

export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const getLenis = () => lenis

function navOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue('--nav-h')
  return -((parseFloat(raw) || 68) + 12)
}

/** Scrolls to an in-page anchor ("#work", "#top"). Returns false if the target doesn't exist. */
export function scrollToHash(hash) {
  const id = hash.replace(/^#/, '')
  const toTop = !id || id === 'top'
  const el = toTop ? null : document.getElementById(id)
  if (!toTop && !el) return false

  if (lenis) {
    lenis.scrollTo(toTop ? 0 : el, {
      offset: toTop ? 0 : navOffset(),
      duration: 1.3,
      easing: (t) => 1 - Math.pow(1 - t, 4),
    })
  } else if (el) {
    el.scrollIntoView({ behavior: 'smooth' })
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  return true
}

/** Boots smooth scrolling (unless the user prefers reduced motion) and routes anchor clicks through it. */
export function initScroll() {
  let tick = null

  if (!prefersReducedMotion()) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)
    tick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)
  }

  const onClick = (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return
    const a = e.target.closest('a[href^="#"]')
    if (!a) return
    const hash = a.getAttribute('href')
    if (scrollToHash(hash)) {
      e.preventDefault()
      history.pushState(null, '', hash === '#top' ? window.location.pathname : hash)
    }
  }
  document.addEventListener('click', onClick)

  const refresh = () => ScrollTrigger.refresh()
  document.fonts?.ready.then(refresh)

  return () => {
    document.removeEventListener('click', onClick)
    if (tick) gsap.ticker.remove(tick)
    lenis?.destroy()
    lenis = null
  }
}

/** Gives every [data-parallax] element under `root` a gentle vertical drift while it crosses the viewport. */
export function parallaxImages(root, amount = 7) {
  const mm = gsap.matchMedia()
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.utils.toArray('[data-parallax]', root).forEach((el) => {
      gsap.fromTo(
        el,
        { yPercent: -amount },
        {
          yPercent: amount,
          ease: 'none',
          scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true },
        },
      )
    })
  })
  return () => mm.revert()
}

export { gsap, ScrollTrigger }
