import { PixelIcon } from '../components/ui/PixelIcon'
import { TRIP } from '../data/trip'
import { SECRET_MISSION_ID } from '../data/secret'
import { useProgress } from '../state/ProgressContext'
import keyVisual from '../assets/art/keyvisual.png'
import keyVisualUnlocked from '../assets/photo/bouquet-home.jpg'
import type { ScreenId } from '../types'
import s from './HomeScreen.module.css'

interface Props {
  onNavigate: (screen: ScreenId) => void
}

const MENU: { label: string; icon: 'calendar' | 'map' | 'mission' | 'book'; screen: ScreenId }[] = [
  { label: 'スケジュール', icon: 'calendar', screen: 'schedule' },
  { label: 'マップ', icon: 'map', screen: 'map' },
  { label: 'ミッション', icon: 'mission', screen: 'mission' },
  { label: '冒険ガイド', icon: 'book', screen: 'guide' },
]

export function HomeScreen({ onNavigate }: Props) {
  const { isCleared } = useProgress()
  // 隠しミッションを解くと、キービジュアルが本物の花束の写真に変わる
  const unlocked = isCleared(SECRET_MISSION_ID)

  return (
    <>
      <section className={s.keyVisual}>
        <img
          className={`${s.keyVisualArt} ${unlocked ? s.keyVisualPhoto : ''}`}
          src={unlocked ? keyVisualUnlocked : keyVisual}
          alt=""
        />
        {/* 暗号を解いたあとは、写真だけを見せる */}
        {!unlocked && <div className={s.keyVisualShade} />}
        {!unlocked && (
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
        )}
      </section>

      <div className={s.menu}>
        {MENU.map((item) => (
          <button
            key={item.label}
            type="button"
            className={s.menuButton}
            onClick={() => onNavigate(item.screen)}
          >
            <PixelIcon name={item.icon} size={24} />
            <span className={s.menuLabel}>{item.label}</span>
          </button>
        ))}
      </div>
    </>
  )
}
