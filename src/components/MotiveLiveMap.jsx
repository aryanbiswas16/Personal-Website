import { useEffect, useRef } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import { motiveCamera, motiveStyle } from '../data/motive.js'
import { addMotiveLayers, animateMotive } from '../lib/motiveLayers.js'

/**
 * Motive's map with a Mapbox token: my Mapbox Studio style (Mapbox Standard underneath), lit for
 * the visitor's time of day like the app, with the app's heat and live pins on top.
 */

// Same hours as the app's getLightPreset.
function lightPreset(hour = new Date().getHours()) {
  if (hour >= 5 && hour < 8) return 'dawn'
  if (hour >= 8 && hour < 18) return 'day'
  if (hour >= 18 && hour < 21) return 'dusk'
  return 'night'
}

const ATMOSPHERE = {
  night: { color: '#101722', 'high-color': '#0B1020', 'space-color': '#030509', 'horizon-blend': 0.18, 'star-intensity': 0.34 },
  dawn: { color: '#CAB8A2', 'high-color': '#5B6D86', 'space-color': '#121722', 'horizon-blend': 0.12, 'star-intensity': 0.06 },
  dusk: { color: '#A36F68', 'high-color': '#39455F', 'space-color': '#090A10', 'horizon-blend': 0.16, 'star-intensity': 0.12 },
  day: { color: '#D5DEE7', 'high-color': '#8FA7C2', 'space-color': '#283344', 'horizon-blend': 0.08, 'star-intensity': 0 },
}

export default function MotiveLiveMap({ token, onFail }) {
  const ref = useRef(null)

  useEffect(() => {
    const preset = lightPreset()
    mapboxgl.accessToken = token

    const map = new mapboxgl.Map({
      container: ref.current,
      style: motiveStyle,
      ...motiveCamera,
      attributionControl: false,
      cooperativeGestures: true,
      config: {
        basemap: {
          lightPreset: preset,
          showPointOfInterestLabels: false,
          showTransitLabels: false,
          showRoadLabels: false,
          showPlaceLabels: true,
        },
      },
    })
    map.addControl(new mapboxgl.AttributionControl({ compact: true }))
    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), 'top-right')

    let loaded = false
    map.on('error', (e) => {
      // Only a style that never loads (bad token, missing style) falls back; a stray tile error doesn't.
      if (!loaded && [401, 403, 404].includes(e.error?.status)) onFail()
    })

    let stop = () => {}
    map.on('style.load', () => {
      loaded = true
      map.setFog(ATMOSPHERE[preset])
      addMotiveLayers(map, { emissive: true })
      stop = animateMotive(map)
    })

    return () => {
      stop()
      map.remove()
    }
  }, [token, onFail])

  return <div ref={ref} style={{ position: 'absolute', inset: 0 }} />
}
