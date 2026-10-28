import { motives, typeColor } from '../data/motive.js'

/**
 * Motive's overlay, ported from the React Native layers in motive/app/(tabs)/index.tsx: crowd heat,
 * pins, and pulsing rings on live motives. Works on a mapbox-gl or maplibre-gl map; `emissive` adds
 * Mapbox Standard's emissive-strength so night lighting doesn't dim the overlay.
 */

const PULSE_MS = 1600
const PULSE_REST_MS = 500

function features(props) {
  return {
    type: 'FeatureCollection',
    features: motives.map((m) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [m.lng, m.lat] },
      properties: props(m),
    })),
  }
}

export function addMotiveLayers(map, { emissive = false } = {}) {
  const glow = emissive ? { 'circle-emissive-strength': 1 } : {}
  const textGlow = emissive ? { 'text-emissive-strength': 1 } : {}

  map.addSource('energy', {
    type: 'geojson',
    data: features((m) => ({ weight: Math.min(1.8, 0.3 + m.people / 18) * (m.live ? 1 : 0.55) })),
  })
  // Crowd heat, with the app's ramp: accentDeep → accent → amber → coral → text.
  map.addLayer({
    id: 'energy-heat',
    type: 'heatmap',
    source: 'energy',
    paint: {
      'heatmap-weight': ['get', 'weight'],
      // Twice the app's intensity: the site has 18 motives and no live crowd, the app has both.
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 10, 1, 15, 2.6],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 10, 22, 15, 60],
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 12, 0.85, 16, 0.65],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(94,106,210,0)',
        0.18,
        'rgba(94,106,210,0.16)',
        0.42,
        'rgba(141,140,255,0.34)',
        0.68,
        'rgba(255,200,98,0.46)',
        0.88,
        'rgba(255,122,107,0.58)',
        1,
        'rgba(244,245,246,0.7)',
      ],
    },
  })

  map.addSource('pins', {
    type: 'geojson',
    data: features((m) => ({ color: typeColor[m.type], title: m.title, live: m.live ? 1 : 0 })),
  })
  map.addLayer({
    id: 'pin-ring',
    type: 'circle',
    source: 'pins',
    filter: ['==', ['get', 'live'], 1],
    paint: {
      ...glow,
      'circle-opacity': 0,
      'circle-stroke-color': ['get', 'color'],
      'circle-stroke-width': 2.4,
      'circle-stroke-opacity': 0.9,
      'circle-radius': 10,
      'circle-pitch-alignment': 'map',
    },
  })
  map.addLayer({
    id: 'pins',
    type: 'circle',
    source: 'pins',
    paint: {
      ...glow,
      'circle-color': ['get', 'color'],
      'circle-radius': 6.5,
      'circle-opacity': 0.95,
      'circle-stroke-color': '#08090A',
      'circle-stroke-width': 2,
    },
  })
  map.addLayer({
    id: 'pin-labels',
    type: 'symbol',
    source: 'pins',
    filter: ['==', ['get', 'live'], 1],
    layout: {
      'text-field': ['get', 'title'],
      'text-font': emissive ? ['DIN Pro Medium', 'Arial Unicode MS Regular'] : ['Noto Sans Regular'],
      'text-size': 11,
      'text-offset': [0, 1.4],
      'text-optional': true,
    },
    paint: { ...textGlow, 'text-color': '#C9D0D9', 'text-halo-color': '#08090A', 'text-halo-width': 1.4 },
  })
}

/**
 * Grows and fades the live rings like the app's LivePulse, and slowly turns the camera until
 * someone grabs the map. Returns a function that stops it.
 */
export function animateMotive(map) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  let frame = 0
  let touched = false
  const stopDrift = () => {
    touched = true
  }
  map.on('mousedown', stopDrift)
  map.on('touchstart', stopDrift)

  const start = performance.now()
  const tick = (now) => {
    const t = ((now - start) % (PULSE_MS + PULSE_REST_MS)) / PULSE_MS
    const ease = 1 - (1 - Math.min(1, t)) ** 3
    map.setPaintProperty('pin-ring', 'circle-radius', 10 + 26 * ease)
    map.setPaintProperty('pin-ring', 'circle-stroke-opacity', t >= 1 ? 0 : 0.9 * (1 - ease))
    map.setPaintProperty('pin-ring', 'circle-stroke-width', 2.4 - 1.6 * ease)
    if (!touched && !map.isMoving()) map.setBearing(map.getBearing() + 0.02)
    frame = requestAnimationFrame(tick)
  }
  frame = requestAnimationFrame(tick)
  return () => cancelAnimationFrame(frame)
}
