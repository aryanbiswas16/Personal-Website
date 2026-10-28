import { lazy, Suspense, useCallback, useState } from 'react'
import { hasWebGL } from '../lib/parts.js'
import { useInView } from '../hooks/useInView.js'
import s from './MotiveFigure.module.css'

const MotiveLiveMap = lazy(() => import('./MotiveLiveMap.jsx'))
const MotiveMapLibre = lazy(() => import('./MotiveMapLibre.jsx'))

// A public Mapbox token, restricted to this site's URLs in the Mapbox dashboard. With it the card
// shows my real Mapbox style; without it, the same overlay on an open OpenStreetMap basemap.
const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN

/** Motive's map, live and in 3D: it loads once the card is close to the viewport. */
export default function MotiveFigure() {
  const [ref, near] = useInView({ rootMargin: '400px 0px', threshold: 0 })
  const [failed, setFailed] = useState(false)
  const onFail = useCallback(() => setFailed(true), [])
  const [touch] = useState(() => window.matchMedia('(pointer: coarse)').matches)
  const live = hasWebGL() && !failed

  return (
    <div ref={ref} className={s.wrap}>
      {live ? (
        <>
          <p className={`mono ${s.status}`}>Loading Toronto…</p>
          {near && (
            <Suspense fallback={null}>
              {TOKEN ? <MotiveLiveMap token={TOKEN} onFail={onFail} /> : <MotiveMapLibre onFail={onFail} />}
            </Suspense>
          )}
          <div className={s.scrim} aria-hidden="true" />
          <p className={`mono ${s.hint}`}>
            {touch ? 'Two fingers to explore' : 'Drag to explore · Ctrl + scroll to zoom'}
          </p>
        </>
      ) : (
        <p className={`mono ${s.status}`}>The live map needs WebGL, which this browser has turned off.</p>
      )}
    </div>
  )
}
