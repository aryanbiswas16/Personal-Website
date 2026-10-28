import { useEffect, useRef } from 'react'
import * as maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
// MapLibre 6 parses tiles in a module worker; Vite bundles it (with its shared chunk) and hands back a URL.
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { motiveCamera } from '../data/motive.js'
import { addMotiveLayers, animateMotive } from '../lib/motiveLayers.js'

/**
 * Motive's map without a Mapbox token: OpenFreeMap's dark basemap (OpenStreetMap data, no key),
 * restyled toward the app's look, with 3D buildings and the app's heat and live pins on top.
 */

const STYLE = 'https://tiles.openfreemap.org/styles/dark'

// Taller buildings catch a little more light, so downtown reads as a skyline rather than a slab.
const BUILDINGS = {
  id: 'motive-buildings',
  type: 'fill-extrusion',
  source: 'openmaptiles',
  'source-layer': 'building',
  minzoom: 13,
  filter: ['!', ['has', 'hide_3d']],
  paint: {
    'fill-extrusion-base': ['get', 'render_min_height'],
    'fill-extrusion-height': ['get', 'render_height'],
    'fill-extrusion-color': [
      'interpolate',
      ['linear'],
      ['get', 'render_height'],
      0,
      '#1d2026',
      30,
      '#262a32',
      90,
      '#343944',
      200,
      '#4a505e',
    ],
    'fill-extrusion-opacity': 0.94,
    'fill-extrusion-vertical-gradient': true,
  },
}

maplibregl.setWorkerUrl(workerUrl)

export default function MotiveMapLibre({ onFail }) {
  const ref = useRef(null)

  useEffect(() => {
    const map = new maplibregl.Map({
      container: ref.current,
      style: STYLE,
      ...motiveCamera,
      maxPitch: 70,
      attributionControl: { compact: true },
      // Wheel and one-finger drags stay with the page; Ctrl/⌘ + scroll or two fingers move the map.
      cooperativeGestures: true,
    })
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true, showZoom: true }), 'top-right')

    let loaded = false
    map.on('error', () => {
      if (!loaded) onFail()
    })

    let stop = () => {}
    map.on('load', () => {
      loaded = true
      const style = map.getStyle()
      for (const layer of style.layers) {
        // The app hides POI, transit, and road labels; flat building footprints give way to 3D ones.
        const sl = layer['source-layer']
        if (layer.type === 'symbol' && ['poi', 'transportation_name', 'aerodrome_label', 'mountain_peak'].includes(sl)) {
          map.setLayoutProperty(layer.id, 'visibility', 'none')
        }
        if (layer.id === 'building') map.setLayoutProperty(layer.id, 'visibility', 'none')
      }
      const firstLabel = style.layers.find((l) => l.type === 'symbol')?.id
      map.addLayer(BUILDINGS, firstLabel)
      map.setLight({ anchor: 'viewport', color: '#ffffff', intensity: 0.38, position: [1.4, 210, 35] })
      map.setSky({
        'sky-color': '#0B1020',
        'horizon-color': '#101722',
        'fog-color': '#08090A',
        'sky-horizon-blend': 0.6,
        'horizon-fog-blend': 0.7,
        'fog-ground-blend': 0.35,
      })
      addMotiveLayers(map)
      stop = animateMotive(map)
      // Compact attribution starts open on wide maps; keep it as the little (i) until asked for.
      map.getContainer().querySelector('.maplibregl-ctrl-attrib')?.classList.remove('maplibregl-compact-show')
    })

    return () => {
      stop()
      map.remove()
    }
  }, [onFail])

  return <div ref={ref} style={{ position: 'absolute', inset: 0 }} />
}
