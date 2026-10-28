import macMini from '../assets/mac-mini.webp'
import s from './AgentFigure.module.css'

const ROWS = [
  ['MODEL', 'Ternary Bonsai 2 27B', 'local'],
  ['AGENTS', 'OpenClaw · Hermes', 'running'],
  ['MEMORY', 'Hindsight by Vectorize', 'long-term'],
  ['TOOLS', 'Wired into both agents', 'enabled'],
  ['DASHBOARD', 'Mission Control', 'mine'],
]

/** My home-lab assistant: an M4 Mac mini running an open model, two agents, memory, and tools. */
export default function AgentFigure() {
  return (
    <svg
      className={s.svg}
      viewBox="0 0 320 200"
      role="img"
      aria-label="An M4 Mac mini running my assistant: the open model Ternary Bonsai 2 27B served locally, OpenClaw and Hermes agents, long-term memory through Vectorize's Hindsight, tools, and my Mission Control dashboard."
    >
      <defs>
        <filter id="agent-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="18" />
        </filter>
        <linearGradient id="agent-glass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="rgba(255,255,255,0.11)" />
          <stop offset="1" stopColor="rgba(255,255,255,0.04)" />
        </linearGradient>
      </defs>

      {/* ambient glow behind the hardware and the panel */}
      <circle className={s.glowWarm} cx="78" cy="118" r="44" filter="url(#agent-blur)" />
      <circle className={s.glowCool} cx="232" cy="80" r="56" filter="url(#agent-blur)" />

      {/* the Mac mini itself */}
      <ellipse className={s.shadow} cx="78" cy="147" rx="52" ry="5" />
      <image className={s.mini} href={macMini} x="22" y="88" width="112" height="58.3" />
      <text className={s.chip} x="78" y="166" textAnchor="middle">
        MAC MINI · M4
      </text>
      <text className={s.uptime} x="78" y="176" textAnchor="middle">
        on 24/7
      </text>

      {/* glass status panel */}
      <g>
        <rect className={s.panel} x="150" y="34" width="156" height="134" rx="12" fill="url(#agent-glass)" />
        <path className={s.sheen} d="M162 34.5 H294" />
        <text className={s.panelTitle} x="162" y="51">
          Assistant
        </text>
        <circle className={s.pulse} cx="290" cy="48" r="2.4" />
        {ROWS.map(([key, value, state], i) => {
          const y = 66 + i * 21
          return (
            <g key={key}>
              {i > 0 && <line className={s.rule} x1="162" x2="294" y1={y - 9} y2={y - 9} />}
              <text className={s.key} x="162" y={y}>
                {key}
              </text>
              <text className={s.value} x="162" y={y + 8}>
                {value}
              </text>
              <text className={s.state} x="294" y={y + 8} textAnchor="end">
                {state}
              </text>
            </g>
          )
        })}
      </g>
    </svg>
  )
}
