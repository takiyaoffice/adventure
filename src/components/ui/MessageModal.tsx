import s from './MessageModal.module.css'

interface Props {
  open: boolean
  title: string
  lines: string[]
  onClose: () => void
}

/** RPG のメッセージウィンドウ風モーダル */
export function MessageModal({ open, title, lines, onClose }: Props) {
  if (!open) return null
  return (
    <div className={s.overlay} role="dialog" aria-modal="true" onClick={onClose}>
      <div className={s.window} onClick={(e) => e.stopPropagation()}>
        <p className={s.title}>{title}</p>
        {lines.map((line) => (
          <p key={line} className={s.line}>
            {line}
          </p>
        ))}
        <button type="button" className={s.close} onClick={onClose}>
          とじる
        </button>
      </div>
    </div>
  )
}
