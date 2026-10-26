import { PixelIcon } from './PixelIcon'
import s from './ConfirmDialog.module.css'

interface Props {
  open: boolean
  title: string
  /** 本文。改行を入れると複数行で表示される */
  body: string
  /** 実行ボタンの文言 */
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

/** 取り消せない操作の前に出す確認ウィンドウ */
export function ConfirmDialog({ open, title, body, confirmLabel, onConfirm, onCancel }: Props) {
  if (!open) return null

  return (
    <div className={s.overlay} role="alertdialog" aria-label={title} onClick={onCancel}>
      <div className={s.window} onClick={(e) => e.stopPropagation()}>
        <p className={s.heading}>
          <PixelIcon name="star" size={12} />
          {title}
        </p>
        <p className={s.body}>{body}</p>
        <div className={s.actions}>
          <button type="button" className={s.cancel} onClick={onCancel}>
            やめる
          </button>
          <button type="button" className={s.confirm} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
