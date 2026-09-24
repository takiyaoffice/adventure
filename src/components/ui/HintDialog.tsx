import { PixelIcon } from './PixelIcon'
import s from './HintDialog.module.css'

interface Props {
  /** 表示する本文。null のあいだは何も出さない */
  text: string | null
  onClose: () => void
}

/** 隠しミッションのヒントを出す小さなウィンドウ */
export function HintDialog({ text, onClose }: Props) {
  if (!text) return null

  return (
    <div className={s.overlay} role="dialog" aria-label="ヒント" onClick={onClose}>
      <div className={s.window} onClick={(e) => e.stopPropagation()}>
        <p className={s.heading}>
          <PixelIcon name="star" size={12} />
          HINT
          <PixelIcon name="star" size={12} />
        </p>
        <p className={s.body}>{text}</p>
        <button type="button" className={s.close} onClick={onClose}>
          とじる
        </button>
      </div>
    </div>
  )
}
