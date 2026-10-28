import { useEffect, useState } from 'react'
import a0 from '../assets/asl/asl-0-a.webp'
import r1 from '../assets/asl/asl-1-r.webp'
import y2 from '../assets/asl/asl-2-y.webp'
import a3 from '../assets/asl/asl-3-a.webp'
import n4 from '../assets/asl/asl-4-n.webp'
import s from './SignFigure.module.css'

// Real frames from the project's DATA/ folder (my hand, landmarks drawn by MediaPipe at capture time),
// with the trained asl_model.h5's actual top prediction and softmax confidence for each.
const FRAMES = [
  { src: a0, letter: 'A', conf: 1.0 },
  { src: r1, letter: 'R', conf: 1.0 },
  { src: y2, letter: 'Y', conf: 1.0 },
  { src: a3, letter: 'A', conf: 1.0 },
  { src: n4, letter: 'N', conf: 0.873 },
]

const confLabel = (c) => (c >= 0.995 ? '>0.99' : c.toFixed(2))

/** The recognizer spelling my name, one webcam frame at a time. */
export default function SignFigure() {
  // Steps 0–4 show each frame; the extra steps hold the finished word before starting over.
  const [step, setStep] = useState(FRAMES.length + 1)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    setStep(0)
    const id = setInterval(() => setStep((t) => (t + 1) % (FRAMES.length + 2)), 1300)
    return () => clearInterval(id)
  }, [])

  const frame = Math.min(step, FRAMES.length - 1)
  const current = FRAMES[frame]

  return (
    <svg
      className={s.svg}
      viewBox="0 0 320 200"
      role="img"
      aria-label="My hand signing A, R, Y, A, N on a webcam, with MediaPipe hand landmarks drawn on, and the model spelling out ARYAN."
    >
      <defs>
        <clipPath id="sign-frame">
          <rect x="22" y="26" width="150" height="150" rx="4" />
        </clipPath>
      </defs>

      <g className={s.corner}>
        <path d="M14 30V14h16" />
        <path d="M290 14h16v16" />
        <path d="M306 170v16h-16" />
        <path d="M30 186H14v-16" />
      </g>

      <g clipPath="url(#sign-frame)">
        {FRAMES.map((f, i) => (
          <image
            key={i}
            href={f.src}
            x="22"
            y="26"
            width="150"
            height="150"
            className={s.frame}
            style={{ opacity: i === frame ? 1 : 0 }}
          />
        ))}
      </g>
      <rect className={s.box} x="22" y="26" width="150" height="150" rx="4" />
      <text className={s.tag} x="24" y="20">
        {current.letter} · {confLabel(current.conf)}
      </text>

      <text className={s.meta} x="190" y="74">
        PREDICTED
      </text>
      {FRAMES.map((f, i) => (
        <text
          key={i}
          className={`${s.letter} ${i === step ? s.now : ''} ${i <= step ? s.typed : ''}`}
          x={190 + i * 21}
          y="108"
        >
          {i <= step ? f.letter : '_'}
        </text>
      ))}
      <text className={s.meta} x="190" y="132">
        MobileNetV2 · 26 letters
      </text>

      <text className={s.meta} x="22" y="194">
        my hand · frame {frame + 1}/{FRAMES.length}
      </text>
      <text className={s.meta} x="306" y="194" textAnchor="end">
        21 landmarks
      </text>
    </svg>
  )
}
