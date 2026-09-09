import { useEffect, useState } from 'react'
import s from './DetectorFigure.module.css'

/**
 * A stylized view of DeepFakeGuard at work: one video frame under analysis,
 * three specialist detectors reporting in, and the fused verdict.
 */

const DETECTORS = [
  { name: 'DINOv3', kind: 'face-swap', weight: 0.35, base: 0.88 },
  { name: 'D3', kind: 'temporal', weight: 0.25, base: 0.74 },
  { name: 'LipFD', kind: 'lip-sync', weight: 0.4, base: 0.91 },
]

const JITTER = [0, 0.02, -0.015, 0.01, -0.02, 0.015, 0.005]
const FRAMES = 6
const BAR_X = 166
const BAR_W = 140

export default function DetectorFigure() {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const id = setInterval(() => setTick((t) => t + 1), 900)
    return () => clearInterval(id)
  }, [])

  const scores = DETECTORS.map((d, i) => {
    const v = d.base + JITTER[(tick + i * 2) % JITTER.length]
    return Math.min(0.99, Math.max(0.5, v))
  })
  const fused = DETECTORS.reduce((sum, d, i) => sum + d.weight * scores[i], 0)
  const activeFrame = tick % FRAMES
  const frameNo = 40 + activeFrame

  return (
    <svg
      className={s.svg}
      viewBox="0 0 320 200"
      role="img"
      aria-label="Illustration of DeepFakeGuard analysing a video frame: three detector scores for face-swap, temporal consistency, and lip-sync, fused into a verdict of fake."
    >
      {/* the frame under analysis */}
      <rect className={s.frame} x="14" y="22" width="136" height="100" rx="3" />
      <path className={s.body} d="M42 122c4-20 18-32 40-32s36 12 40 32Z" />
      <ellipse className={s.head} cx="82" cy="62" rx="21" ry="27" />
      <rect className={s.box} x="55" y="30" width="54" height="68" rx="2" />
      <text className={s.tag} x="55" y="26">
        face · 0.99
      </text>
      <line className={s.scan} x1="14" x2="150" y1={38 + activeFrame * 14} y2={38 + activeFrame * 14} />

      {/* filmstrip */}
      {Array.from({ length: FRAMES }, (_, i) => (
        <rect
          key={i}
          className={i === activeFrame ? s.stripActive : s.strip}
          x={14 + i * 23.2}
          y="130"
          width="20"
          height="14"
          rx="1.5"
        />
      ))}
      <text className={s.meta} x="14" y="158">
        frame {String(frameNo).padStart(3, '0')} / 128
      </text>

      {/* detector scores */}
      {DETECTORS.map((d, i) => {
        const y = 30 + i * 34
        return (
          <g key={d.name}>
            <text className={s.name} x={BAR_X} y={y}>
              {d.name}
            </text>
            <text className={s.kind} x={BAR_X + 38} y={y}>
              {d.kind}
            </text>
            <text className={s.score} x={BAR_X + BAR_W} y={y} textAnchor="end">
              {scores[i].toFixed(2)}
            </text>
            <rect className={s.track} x={BAR_X} y={y + 6} width={BAR_W} height="4" rx="2" />
            <rect className={s.fill} x={BAR_X} y={y + 6} width={BAR_W * scores[i]} height="4" rx="2" />
          </g>
        )
      })}

      <line className={s.rule} x1={BAR_X} x2={BAR_X + BAR_W} y1="128" y2="128" />

      <text className={s.name} x={BAR_X} y="142">
        ENSEMBLE
      </text>
      <text className={s.verdict} x={BAR_X + BAR_W} y="142" textAnchor="end">
        FAKE · {fused.toFixed(2)}
      </text>
      <rect className={s.track} x={BAR_X} y="149" width={BAR_W} height="6" rx="3" />
      <rect className={s.fillStrong} x={BAR_X} y="149" width={BAR_W * fused} height="6" rx="3" />

      <text className={s.meta} x="14" y="191">
        3 detectors · weighted fusion
      </text>
      <text className={s.meta} x="306" y="191" textAnchor="end">
        explain: vlm
      </text>
    </svg>
  )
}
