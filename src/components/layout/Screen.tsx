import type { ReactNode } from 'react'
import { PixelIcon } from '../ui/PixelIcon'
import type { GlyphName } from '../ui/pixel-glyphs'
import s from './Screen.module.css'

interface Props {
  title: string
  icon: GlyphName
  children: ReactNode
  /** 画面全体を固定してスクロールさせない（マップ画面用） */
  fixed?: boolean
}

/** 各画面のヘッダー + 本文領域。フッターは App 側に常駐する。 */
export function Screen({ title, icon, children, fixed }: Props) {
  return (
    <div className={s.screen}>
      <header className={s.header}>
        <PixelIcon name={icon} size={24} />
        <h1 className={s.title}>{title}</h1>
      </header>
      <main className={`${s.body} ${fixed ? s.bodyFixed : ''}`}>{children}</main>
    </div>
  )
}
