import { useEffect, useId, useRef, useState } from 'react'
import { getLenis } from '../lib/scroll.js'
import { ArrowUpRight, Close } from './Icons.jsx'
import s from './Paper.module.css'

/**
 * A published paper attached to a project. Renders as a small sheet in the
 * project's meta column; clicking it opens the PDF in a reader dialog. With a
 * modifier key held (or without JavaScript) the sheet is a plain link to the PDF.
 */

// iOS Safari and most Android browsers can't render PDFs inline and say so.
// Browsers too old to report at all almost always can.
const canEmbed = () => navigator.pdfViewerEnabled !== false

const surnames = (authors) => authors.map((name) => name.split(' ').at(-1)).join(', ')

function Reader({ paper, url, open, onClose }) {
  const ref = useRef(null)
  const titleId = useId()
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const dialog = ref.current
    if (!open || !dialog) return undefined
    if (!dialog.open) dialog.showModal()
    dialog.focus()
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    getLenis()?.stop()
    return () => {
      document.body.style.overflow = prev
      getLenis()?.start()
      setLoaded(false)
      if (dialog.open) dialog.close()
    }
  }, [open])

  const embed = open && canEmbed()

  return (
    <dialog
      ref={ref}
      className={s.dialog}
      aria-labelledby={titleId}
      tabIndex={-1}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && e.currentTarget.close()}
      data-lenis-prevent
    >
      <div className={s.head}>
        <div className={s.headText}>
          <span className="label">Paper · {paper.venueLong}</span>
          <h3 id={titleId} className={s.title}>
            {paper.title}
          </h3>
          <p className="mono">
            {paper.authors.join(', ')} · {paper.affiliation}
          </p>
        </div>
        <div className={s.actions}>
          <a className={s.action} href={url} target="_blank" rel="noreferrer">
            Open in new tab <ArrowUpRight width={14} height={14} />
          </a>
          <a className={s.action} href={url} download>
            Download
          </a>
          <button type="button" className={s.close} onClick={() => ref.current?.close()} aria-label="Close reader">
            <Close />
          </button>
        </div>
      </div>

      <div className={s.body}>
        {embed && (
          <>
            {!loaded && <span className={`label ${s.loading}`}>Loading paper…</span>}
            <iframe
              className={s.frame}
              src={`${url}#view=FitH`}
              title={paper.title}
              onLoad={() => setLoaded(true)}
            />
          </>
        )}
        {open && !embed && (
          <div className={s.fallback}>
            <img
              className={s.page}
              src={paper.preview}
              alt={`First page of “${paper.title}”`}
              width="640"
              height="829"
            />
            <div>
              <p className={s.abstract}>{paper.abstract}</p>
              <p className={`mono ${s.note}`}>This browser can’t show PDFs inline, so the paper opens in a new tab.</p>
              <div className={s.fallbackActions}>
                <a className="btn primary" href={url} target="_blank" rel="noreferrer">
                  Open the PDF <ArrowUpRight />
                </a>
                <a className="btn ghost" href={url} download>
                  Download
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </dialog>
  )
}

export default function Paper({ paper }) {
  const [open, setOpen] = useState(false)
  const url = import.meta.env.BASE_URL + paper.file

  const openReader = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    setOpen(true)
  }

  return (
    <>
      <div className={s.wrap}>
        <a className={s.sheet} href={url} onClick={openReader} aria-haspopup="dialog">
          <img
            className={s.thumb}
            src={paper.thumb}
            alt=""
            width="240"
            height="311"
            loading="lazy"
            decoding="async"
          />
          <span className={s.text}>
            <span className="label">Paper · {paper.venue}</span>
            <span className={s.sheetTitle}>{paper.title}</span>
            <span className="mono">
              {surnames(paper.authors)} · {paper.pages}&nbsp;pages
            </span>
          </span>
          <span className={s.read}>
            Read <ArrowUpRight width={14} height={14} />
          </span>
        </a>
      </div>
      <Reader paper={paper} url={url} open={open} onClose={() => setOpen(false)} />
    </>
  )
}
