import { useMemo, useState } from 'react'
import { PixelIcon } from '../components/ui/PixelIcon'
import { MessageModal } from '../components/ui/MessageModal'
import { TRIP } from '../data/trip'
import { SCHEDULE } from '../data/schedule'
import keyVisual from '../assets/art/keyvisual.png'
import type { ScreenId } from '../types'
import s from './HomeScreen.module.css'

interface Props {
  onNavigate: (screen: ScreenId) => void
  onOpenDay: (dayId: string) => void
}

/** 今日にあたる日程を返す。旅行前・旅行後は DAY 1 を出す。 */
function pickTodaysDay() {
  const today = new Date()
  const iso = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')
  return SCHEDULE.find((day) => day.isoDate === iso) ?? SCHEDULE[0]
}

const MENU: { label: string; icon: 'calendar' | 'map' | 'mission' | 'character'; screen?: ScreenId }[] = [
  { label: 'SCHEDULE', icon: 'calendar', screen: 'schedule' },
  { label: 'MAP', icon: 'map', screen: 'map' },
  { label: 'MISSION', icon: 'mission', screen: 'mission' },
  { label: 'CHARACTER', icon: 'character' },
]

export function HomeScreen({ onNavigate, onOpenDay }: Props) {
  const today = useMemo(pickTodaysDay, [])
  const [lockedOpen, setLockedOpen] = useState(false)

  return (
    <>
      <section className={s.keyVisual}>
        <img className={s.keyVisualArt} src={keyVisual} alt="" />
        <div className={s.keyVisualShade} />
        <div className={s.keyVisualBody}>
          <div className={s.logoRow}>
            <PixelIcon name="sword" size={34} className={s.sword} />
            <h2 className={s.logo}>
              <span>FUTURE</span>
              <span>FANTASY</span>
            </h2>
            <PixelIcon name="star" size={16} className={s.star} />
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

      <button type="button" className={s.today} onClick={() => onOpenDay(today.id)}>
        <span className={s.todayLabel}>TODAY&apos;S ADVENTURE</span>
        <span className={s.todayDate}>{today.dateJp}</span>
        <span className={s.todayTitle}>{today.title}</span>
        <span className={s.todayLead}>{today.lead}</span>
        <PixelIcon name="chevron" size={18} className={s.todayChevron} />
      </button>

      <div className={s.menu}>
        {MENU.map((item) => (
          <button
            key={item.label}
            type="button"
            className={s.menuButton}
            onClick={() => (item.screen ? onNavigate(item.screen) : setLockedOpen(true))}
          >
            <PixelIcon name={item.icon} size={22} />
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
