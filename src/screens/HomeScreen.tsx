import { useState } from 'react'
import { PixelIcon } from '../components/ui/PixelIcon'
import { MessageModal } from '../components/ui/MessageModal'
import { TRIP } from '../data/trip'
import keyVisual from '../assets/art/keyvisual.png'
import type { ScreenId } from '../types'
import s from './HomeScreen.module.css'

interface Props {
  onNavigate: (screen: ScreenId) => void
}

const MENU: { label: string; icon: 'calendar' | 'map' | 'mission' | 'character'; screen?: ScreenId }[] = [
  { label: 'スケジュール', icon: 'calendar', screen: 'schedule' },
  { label: 'マップ', icon: 'map', screen: 'map' },
  { label: 'ミッション', icon: 'mission', screen: 'mission' },
  { label: 'キャラクター', icon: 'character' },
]

export function HomeScreen({ onNavigate }: Props) {
  const [lockedOpen, setLockedOpen] = useState(false)

  return (
    <>
      <section className={s.keyVisual}>
        <img className={s.keyVisualArt} src={keyVisual} alt="" />
        <div className={s.keyVisualShade} />
        <div className={s.keyVisualBody}>
          <div className={s.logoRow}>
            <PixelIcon name="sword" size={36} className={s.sword} />
            <h1 className={s.logo}>
              <span>FUTURE</span>
              <span>FANTASY</span>
            </h1>
            <PixelIcon name="star" size={17} className={s.star} />
          </div>
          <p className={s.subtitle}>— {TRIP.subtitle} —</p>
          <p className={s.copy}>
            {TRIP.catchCopy.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </p>
          <p className={s.tripDate}>{TRIP.dateRange}</p>
        </div>
      </section>

      <div className={s.menu}>
        {MENU.map((item) => (
          <button
            key={item.label}
            type="button"
            className={s.menuButton}
            onClick={() => (item.screen ? onNavigate(item.screen) : setLockedOpen(true))}
          >
            <PixelIcon name={item.icon} size={24} />
            <span className={s.menuLabel}>{item.label}</span>
          </button>
        ))}
      </div>

      <MessageModal
        open={lockedOpen}
        title="？ ？ ？"
        lines={['この機能はまだ解放されていない。', '旅の準備が整うまで、もう少し待とう。']}
        onClose={() => setLockedOpen(false)}
      />
    </>
  )
}
