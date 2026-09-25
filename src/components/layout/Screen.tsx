import type { ReactNode } from 'react'
import s from './Screen.module.css'

interface Props {
  /** スクリーンリーダー向けの画面名 */
  label: string
  children: ReactNode
  /** 画面全体を固定してスクロールさせない（マップ画面用） */
  fixed?: boolean
}

/** 各画面の本文領域。フッターは App 側に常駐する。 */
export function Screen({ label, children, fixed }: Props) {
  return (
    <main className={`${s.body} ${fixed ? s.bodyFixed : ''}`} aria-label={label}>
      {children}
    </main>
  )
}
