import Reveal from './Reveal.jsx'
import s from './SectionHeading.module.css'

export default function SectionHeading({ number, label, title, sub }) {
  return (
    <Reveal as="header" className={s.head}>
      <div className={s.top}>
        <span className={`label ${s.num}`}>{number}</span>
        <span className="label">{label}</span>
        <span className={s.rule} aria-hidden="true" />
      </div>
      {title && <h2 className={s.title}>{title}</h2>}
      {sub && <p className={s.sub}>{sub}</p>}
    </Reveal>
  )
}
