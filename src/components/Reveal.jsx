import { createElement } from 'react'
import { useInView } from '../hooks/useInView.js'
import s from './Reveal.module.css'

/**
 * Fades and lifts its children into place the first time they scroll into view.
 * `as` picks the wrapper element; `delay` staggers siblings (ms).
 * Sets data-shown="true" once revealed so children can key their own transitions off it.
 */
export default function Reveal({ as = 'div', delay = 0, className = '', style, children, ...rest }) {
  const [ref, inView] = useInView()
  return createElement(
    as,
    {
      ref,
      className: `${s.reveal} ${inView ? s.shown : ''} ${className}`.trim(),
      style: { ...style, transitionDelay: inView ? `${delay}ms` : '0ms' },
      'data-shown': inView ? 'true' : 'false',
      ...rest,
    },
    children,
  )
}
