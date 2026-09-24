import { useEffect, useState } from 'react'
import { PixelIcon } from './PixelIcon'
import { SECRET_CODE } from '../../data/secret'
import s from './CodeLock.module.css'

const LENGTH = SECRET_CODE.length
const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'del', '0', 'ok'] as const

interface Props {
  open: boolean
  /** すでに暗号を解いているか */
  unlocked: boolean
  /** 正解したときに呼ばれる */
  onUnlock: () => void
  onClose: () => void
}

/** コンパスに隠された4桁の暗号を入力する画面 */
export function CodeLock({ open, unlocked, onUnlock, onClose }: Props) {
  const [code, setCode] = useState('')
  const [error, setError] = useState(false)

  // 開くたびに入力をまっさらに戻す
  useEffect(() => {
    if (open) {
      setCode('')
      setError(false)
    }
  }, [open])

  if (!open) return null

  const submit = (value: string) => {
    if (value === SECRET_CODE) {
      onUnlock()
      return
    }
    setError(true)
    setCode('')
  }

  const press = (key: string) => {
    setError(false)
    if (key === 'del') {
      setCode((prev) => prev.slice(0, -1))
      return
    }
    if (key === 'ok') {
      if (code.length === LENGTH) submit(code)
      return
    }
    if (code.length >= LENGTH) return
    const next = code + key
    setCode(next)
    // 4桁そろったら、そのまま判定する
    if (next.length === LENGTH) submit(next)
  }

  return (
    <div className={s.overlay} role="dialog" aria-label="暗号入力" onClick={onClose}>
      <div className={s.window} onClick={(e) => e.stopPropagation()}>
        <p className={s.heading}>
          <PixelIcon name="lock" size={12} />
          SECRET CODE
        </p>

        {unlocked ? (
          <>
            <p className={s.message}>この道標の封印は、すでに解かれている。</p>
            <p className={s.cleared}>{SECRET_CODE}</p>
          </>
        ) : (
          <>
            <p className={s.message}>4桁の数字を入力せよ。</p>
            <div className={`${s.slots} ${error ? s.shake : ''}`}>
              {Array.from({ length: LENGTH }, (_, i) => (
                <span key={i} className={`${s.slot} ${i < code.length ? s.slotFilled : ''}`}>
                  {i < code.length ? code[i] : ''}
                </span>
              ))}
            </div>
            <p className={`${s.status} ${error ? s.statusError : ''}`}>
              {error ? '暗号がちがうようだ…' : '　'}
            </p>
            <div className={s.pad}>
              {KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  className={`${s.key} ${key === 'del' || key === 'ok' ? s.keyWide : ''}`}
                  onClick={() => press(key)}
                >
                  {key === 'del' ? '←' : key === 'ok' ? 'OK' : key}
                </button>
              ))}
            </div>
          </>
        )}

        <button type="button" className={s.close} onClick={onClose}>
          とじる
        </button>
      </div>
    </div>
  )
}
