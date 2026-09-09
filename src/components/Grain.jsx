import s from './Grain.module.css'

/** A faint, slowly drifting film grain over the whole page. Purely decorative. */
export default function Grain() {
  return <div className={s.grain} aria-hidden="true" />
}
