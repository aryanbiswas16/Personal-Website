import { useEffect, useState } from 'react'

/** Helpers shared by the scenes built from small instanced "parts": the hero and the contact figure. */

export const smoothstep = (k) => k * k * (3 - 2 * k)
export const clamp = (x, a, b) => (x < a ? a : x > b ? b : x)

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

/** Deterministic pseudo-random so a scene looks the same on every visit. */
export function makeRandom(seed) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** A clamped standard-normal sample drawn from `rand`, for soft clouds with no hard edges. */
export function gauss(rand) {
  const u = 1 - rand()
  const v = rand()
  return clamp(Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v), -2.4, 2.4)
}

export function readColors() {
  const cs = getComputedStyle(document.documentElement)
  return {
    bg: cs.getPropertyValue('--bg').trim() || '#f4f0e8',
    base: cs.getPropertyValue('--parts').trim() || '#3b3630',
    accent: cs.getPropertyValue('--parts-accent').trim() || '#d2471b',
  }
}

/** The current theme's part colours, refreshed whenever data-theme changes. */
export function useThemeColors() {
  const [colors, setColors] = useState(readColors)
  useEffect(() => {
    const mo = new MutationObserver(() => setColors(readColors()))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => mo.disconnect()
  }, [])
  return colors
}
