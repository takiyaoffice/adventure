import { PixelIcon } from '../ui/PixelIcon'
import type { GlyphName } from '../ui/pixel-glyphs'
import type { ScreenId } from '../../types'
import s from './BottomNav.module.css'

export const NAV_ITEMS: { id: ScreenId; label: string; icon: GlyphName }[] = [
  { id: 'home', label: 'ホーム', icon: 'home' },
  { id: 'schedule', label: 'スケジュール', icon: 'calendar' },
  { id: 'map', label: 'マップ', icon: 'map' },
  { id: 'mission', label: 'ミッション', icon: 'mission' },
  { id: 'guide', label: '冒険ガイド', icon: 'book' },
]

interface Props {
  current: ScreenId
  onNavigate: (id: ScreenId) => void
}

/** 4画面共通のフッターナビゲーション */
export function BottomNav({ current, onNavigate }: Props) {
  return (
    <nav className={s.nav}>
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`${s.item} ${current === item.id ? s.active : ''}`}
          aria-current={current === item.id ? 'page' : undefined}
          onClick={() => onNavigate(item.id)}
        >
          <PixelIcon name={item.icon} size={20} />
          <span className={s.label}>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
