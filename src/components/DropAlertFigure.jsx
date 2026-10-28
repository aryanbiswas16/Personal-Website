import s from './DropAlertFigure.module.css'

// Alerts in pokedrop's message format: retailer and what changed, the product, then price and stock.
// The first is the example from the README; the others show the other alert kinds.
const ALERTS = [
  { title: 'Walmart Canada · New listing', product: 'Charizard ex Special Collection', detail: '$69.98 · in stock', tone: 'new' },
  { title: 'Walmart Canada · Price drop', product: 'Elite Trainer Box', detail: '$94.98 → $84.98 · at MSRP', tone: 'drop' },
  { title: 'EB Games Canada · Pre-order', product: 'Booster Bundle', detail: 'Pre-order open · sold by EB Games', tone: 'pre' },
]

/** pokedrop's output: restock alerts landing on my phone's lock screen. */
export default function DropAlertFigure() {
  return (
    <svg
      className={s.svg}
      viewBox="0 0 320 200"
      role="img"
      aria-label="A phone lock screen with three pokedrop alerts: a new Charizard ex Special Collection at Walmart Canada for $69.98, an Elite Trainer Box dropping from $94.98 to $84.98, and a booster bundle on pre-order at EB Games."
    >
      <defs>
        <linearGradient id="drop-wall" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0" stopColor="#2a1f3d" />
          <stop offset="0.55" stopColor="#5a2b2b" />
          <stop offset="1" stopColor="#d2471b" />
        </linearGradient>
        <clipPath id="drop-screen">
          <rect x="84" y="14" width="152" height="220" rx="22" />
        </clipPath>
        <filter id="drop-blur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="22" />
        </filter>
      </defs>

      <circle className={s.glow} cx="160" cy="150" r="70" filter="url(#drop-blur)" />

      {/* the phone runs off the bottom of the card, like it's held up to the camera */}
      <rect className={s.bezel} x="80" y="10" width="160" height="228" rx="26" />
      <g clipPath="url(#drop-screen)">
        <rect x="84" y="14" width="152" height="220" fill="url(#drop-wall)" />
        <rect className={s.island} x="141" y="21" width="38" height="9" rx="4.5" />
        <text className={s.date} x="160" y="44" textAnchor="middle">
          Tuesday, October 27
        </text>
        <text className={s.time} x="160" y="68" textAnchor="middle">
          9:41
        </text>

        {ALERTS.map((a, i) => {
          const y = 80 + i * 37
          return (
            <g key={i} className={s.card} style={{ '--i': i }}>
              <rect className={s.glass} x="92" y={y} width="136" height="32" rx="8" />
              <rect className={`${s.icon} ${s[a.tone]}`} x="98" y={y + 6} width="11" height="11" rx="3" />
              <text className={s.app} x="113" y={y + 10}>
                POKEDROP
              </text>
              <text className={s.now} x="222" y={y + 10} textAnchor="end">
                now
              </text>
              <text className={s.title} x="113" y={y + 17.5}>
                {a.title}
              </text>
              <text className={s.product} x="113" y={y + 23.5}>
                {a.product}
              </text>
              <text className={s.detail} x="113" y={y + 29}>
                {a.detail}
              </text>
            </g>
          )
        })}
      </g>

      <text className={s.side} x="20" y="92">
        6 RETAILERS
      </text>
      <text className={s.sideSub} x="20" y="102">
        alerts within
      </text>
      <text className={s.sideSub} x="20" y="110">
        seconds
      </text>
      <text className={s.side} x="300" y="92" textAnchor="end">
        ~20 MB RAM
      </text>
      <text className={s.sideSub} x="300" y="102" textAnchor="end">
        on the Mac mini
      </text>
      <text className={s.sideSub} x="300" y="110" textAnchor="end">
        no scalpers
      </text>
    </svg>
  )
}
