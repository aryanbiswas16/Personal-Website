import s from './PullRequestFigure.module.css'

// The heart of the actual diff from ace-step/ACE-Step-1.5#1148 (mode_ui.py), lightly trimmed to fit.
const DIFF = [
  [' ', 'def handle_extract_src_audio_change(src_audio_path, mode):'],
  [' ', '    if mode not in ("Extract", "Lego") or not src_audio_path:'],
  [' ', '        return gr.update()'],
  [' ', '    try:'],
  ['-', '        from acestep.training…audio_io import get_audio_duration'],
  ['-', '        duration = get_audio_duration(src_audio_path)'],
  ['-', '        if duration and duration > 0:'],
  ['+', '        import soundfile as sf'],
  ['+', '        duration = float(sf.info(src_audio_path).duration)'],
  ['+', '        if duration > 0:'],
  ['+', '            return gr.update(value=duration)'],
]

const TESTS = [
  'reads_duration_from_gradio_temp_path_without_safe_path',
  'returns_noop_for_non_extract_lego_mode',
  'returns_noop_for_empty_src_audio',
  'swallows_invalid_audio_errors',
]

/** My fix to ACE-Step, drawn as the pull request: the diff, its regression tests, and the outcome. */
export default function PullRequestFigure() {
  return (
    <svg
      className={s.svg}
      viewBox="0 0 320 200"
      role="img"
      aria-label="My pull request to ACE-Step 1.5: a diff that reads audio duration with soundfile instead of the training module's path guard, four regression tests, and the note that the fix shipped to main through pull request 1210."
    >
      <g className={s.pill}>
        <rect x="186" y="13" width="120" height="13" rx="6.5" />
        <text x="246" y="22" textAnchor="middle">
          #1148 · shipped via #1210
        </text>
      </g>
      <text className={s.title} x="14" y="38">
        fix(gradio): allow Extract/Lego uploads from the Gradio temp dir
      </text>

      <g className={s.diff}>
        <rect className={s.pane} x="14" y="46" width="292" height={DIFF.length * 8.4 + 8} rx="3" />
        {DIFF.map(([sign, code], i) => {
          const y = 52 + i * 8.4
          const kind = sign === '+' ? s.add : sign === '-' ? s.del : ''
          return (
            <g key={i} className={`${s.line} ${kind}`} style={{ '--i': i }}>
              {sign !== ' ' && <rect className={s.band} x="14" y={y} width="292" height="8.4" />}
              <text className={s.sign} x="19" y={y + 6.2}>
                {sign}
              </text>
              <text className={s.code} x="27" y={y + 6.2}>
                {code}
              </text>
            </g>
          )
        })}
      </g>

      {TESTS.map((t, i) => (
        <text key={t} className={s.test} x="14" y={160 + i * 8.5}>
          <tspan className={s.check}>✓</tspan> test_{t}
        </text>
      ))}

      <text className={s.repo} x="14" y="194">
        ace-step/ACE-Step-1.5
      </text>
      <text className={s.meta} x="306" y="194" textAnchor="end">
        +57 −6 · 2 files
      </text>
    </svg>
  )
}
