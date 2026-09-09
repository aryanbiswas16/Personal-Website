import { useEffect, useState } from 'react'
import s from './WaveFigure.module.css'

/**
 * A stylized view of ACE-Step rendering a track: a prompt becomes a plan,
 * the plan becomes audio, and a playhead sweeps across the finished waveform.
 */

const BARS = 64
const STEPS = 48
const X0 = 14
const X1 = 306
const MID = 98

// deterministic "waveform" so it looks the same on every visit
const HEIGHTS = Array.from({ length: BARS }, (_, i) => {
  const a = Math.sin(i * 0.55) * Math.cos(i * 0.23)
  const b = Math.sin(i * 1.7 + 0.4) * 0.35
  const env = 0.55 + 0.45 * Math.sin((i / BARS) * Math.PI)
  return 6 + 30 * env * (0.55 + 0.45 * Math.abs(a + b))
})

const STAGES = ['prompt', 'plan', 'synthesize']

export default function WaveFigure() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTick(STEPS - 1)
      return undefined
    }
    const id = setInterval(() => setTick((t) => (t + 1) % (STEPS + 8)), 170)
    return () => clearInterval(id)
  }, [])

  const step = Math.min(tick, STEPS - 1)
  const progress = step / (STEPS - 1)
  const playX = X0 + (X1 - X0) * progress
  const stage = progress < 0.12 ? 0 : progress < 0.3 ? 1 : 2
  const seconds = Math.round(progress * 204)
  const mm = Math.floor(seconds / 60)
  const ss = String(seconds % 60).padStart(2, '0')
  const gap = (X1 - X0) / BARS

  return (
    <svg
      className={s.svg}
      viewBox="0 0 320 200"
      role="img"
      aria-label="Illustration of ACE-Step generating music: a prompt is planned by a language model, synthesized by a diffusion transformer, and played back as a waveform."
    >
      {/* status, kept clear of the category badge on the left */}
      <text className={s.meta} x={X1} y="24" textAnchor="end">
        {stage < 2 ? 'planning…' : `rendered in ${(1.4 + progress * 0.7).toFixed(1)}s`}
      </text>

      {/* waveform */}
      <line className={s.axis} x1={X0} x2={X1} y1={MID} y2={MID} />
      {HEIGHTS.map((h, i) => {
        const x = X0 + i * gap + 1
        const on = x <= playX
        return (
          <rect
            key={i}
            className={on ? s.barOn : s.barOff}
            x={x}
            y={MID - h}
            width={gap - 2}
            height={h * 2}
            rx="1"
          />
        )
      })}
      <line className={s.playhead} x1={playX} x2={playX} y1={MID - 46} y2={MID + 46} />

      {/* timeline */}
      <text className={s.meta} x={X0} y="160">
        {mm}:{ss}
      </text>
      <text className={s.meta} x={X1} y="160" textAnchor="end">
        3:24
      </text>

      {/* pipeline stages */}
      {STAGES.map((label, i) => (
        <g key={label}>
          <text className={i <= stage ? s.stageOn : s.stageOff} x={X0 + i * 62} y="191">
            {label}
          </text>
          {i < STAGES.length - 1 && (
            <text className={i < stage ? s.stageOn : s.stageOff} x={X0 + i * 62 + 50} y="191">
              ›
            </text>
          )}
        </g>
      ))}
      <text className={s.meta} x={X1} y="191" textAnchor="end">
        2B · turbo
      </text>
    </svg>
  )
}
