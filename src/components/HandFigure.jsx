import { useEffect, useState } from 'react'
import s from './HandFigure.module.css'

// MediaPipe hand landmark order: wrist, then thumb, index, middle, ring, pinky (4 each).
const POINTS = [
  [160, 190],
  [128, 172], [104, 150], [88, 128], [78, 108],
  [138, 120], [132, 88], [128, 64], [125, 42],
  [160, 115], [160, 78], [160, 52], [160, 28],
  [182, 120], [188, 86], [192, 62], [194, 42],
  [203, 132], [214, 104], [221, 84], [226, 68],
]

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12],
  [9, 13], [13, 14], [14, 15], [15, 16],
  [13, 17], [17, 18], [18, 19], [19, 20],
  [0, 17],
]

const CONFIDENCES = ['0.98', '0.97', '0.99', '0.96', '0.98', '0.99']
const FPS = ['30', '29', '30', '31', '30']

/** A stylized "live inference" view: an open hand (ASL number 5) with its 21 tracked landmarks. */
export default function HandFigure() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 900)
    return () => clearInterval(id)
  }, [])

  return (
    <svg
      className={s.svg}
      viewBox="0 0 320 200"
      role="img"
      aria-label="Illustration of a webcam feed with 21 hand landmarks tracked over an open hand, labelled as the sign for the number five."
    >
      {/* viewfinder corners */}
      <g className={s.corner}>
        <path d="M14 30V14h16" />
        <path d="M290 14h16v16" />
        <path d="M306 170v16h-16" />
        <path d="M30 186H14v-16" />
      </g>

      {/* detection box */}
      <rect className={s.box} x="84" y="22" width="150" height="163" rx="3" />
      <text className={s.tag} x="88" y="16">
        5 · {CONFIDENCES[tick % CONFIDENCES.length]}
      </text>

      {/* hand skeleton */}
      <g className={s.hand} transform="translate(23 6) scale(0.9)">
        {CONNECTIONS.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            className={s.bone}
            x1={POINTS[a][0]}
            y1={POINTS[a][1]}
            x2={POINTS[b][0]}
            y2={POINTS[b][1]}
          />
        ))}
        {POINTS.map(([x, y], i) => (
          <circle key={i} className={i === 0 ? s.wrist : s.joint} cx={x} cy={y} r={i === 0 ? 4 : 3} />
        ))}
      </g>

      <text className={s.meta} x="14" y="197">
        21 landmarks
      </text>
      <text className={s.meta} x="306" y="197" textAnchor="end">
        {FPS[tick % FPS.length]} fps
      </text>
    </svg>
  )
}
