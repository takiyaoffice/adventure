import { useEffect, useState } from 'react'
import { PixelIcon } from './PixelIcon'
import s from './SystemUpdate.module.css'

interface Props {
  /** 「はい」が押されたとき。ここで解放を保存する */
  onConfirm: () => void
  /** 演出が終わったとき。宿の記録を開く */
  onFinish: () => void
}

type Step = 'ask' | 'updating' | 'done'

const UPDATING_MS = 1100
const DONE_MS = 1900

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * 起動時に一度だけ出るアップデート確認。
 *
 *   はい → 短いアップデート演出 → UPDATE COMPLETE → 宿の記録
 *
 * 動きを減らす設定のときは、光らせずに文字だけを出す。
 */
export function SystemUpdate({ onConfirm, onFinish }: Props) {
  const [step, setStep] = useState<Step>('ask')
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (step === 'updating') {
      const t = window.setTimeout(() => setStep('done'), reduced ? 320 : UPDATING_MS)
      return () => window.clearTimeout(t)
    }
    if (step === 'done') {
      const t = window.setTimeout(onFinish, reduced ? 1200 : DONE_MS)
      return () => window.clearTimeout(t)
    }
  }, [step, reduced, onFinish])

  const start = () => {
    onConfirm() // 押した時点で解放を保存しておく（途中で閉じても残る）
    setStep('updating')
  }

  return (
    <div className={s.overlay} role="alertdialog" aria-label="システムアップデート">
      {step !== 'ask' && !reduced && <div className={s.flash} aria-hidden="true" />}

      <div className={s.window}>
        {step === 'ask' && (
          <>
            <p className={s.heading}>SYSTEM UPDATE</p>
            <p className={s.body}>
              宿の記録を受信しました。
              <br />
              アップデートを実行しますか？
            </p>
            <button type="button" className={s.yes} onClick={start} autoFocus>
              はい
            </button>
          </>
        )}

        {step === 'updating' && (
          <>
            <p className={s.heading}>SYSTEM UPDATE</p>
            <p className={s.body}>アップデート中…</p>
            <div className={s.bar} aria-hidden="true">
              <span className={s.barFill} style={{ animationDuration: `${reduced ? 320 : UPDATING_MS}ms` }} />
            </div>
          </>
        )}

        {step === 'done' && (
          <>
            <div className={s.ribbon} aria-hidden="true">
              <PixelIcon name="star" size={12} />
              <PixelIcon name="star" size={12} />
              <PixelIcon name="star" size={12} />
            </div>
            <p className={`${s.heading} ${s.headingDone}`}>
              UPDATE
              <br />
              COMPLETE
            </p>
            <p className={s.found}>宿の記録を発見した。</p>
          </>
        )}
      </div>
    </div>
  )
}
