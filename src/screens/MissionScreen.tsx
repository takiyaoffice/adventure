import { useState } from 'react'
import { PixelIcon } from '../components/ui/PixelIcon'
import type { GlyphName } from '../components/ui/pixel-glyphs'
import { CATEGORY_LABEL, CATEGORY_ORDER, MISSIONS, MISSION_TABS } from '../data/missions'
import { useProgress } from '../state/ProgressContext'
import type { Mission, MissionCategory } from '../types'
import s from './MissionScreen.module.css'

interface Props {
  onComplete: (mission: Mission) => void
}

const CATEGORY_ICON: Record<MissionCategory, GlyphName> = {
  place: 'place',
  experience: 'mission',
  special: 'mission',
}

export function MissionScreen({ onComplete }: Props) {
  const [tab, setTab] = useState<MissionCategory | 'all'>('all')
  const { isCleared, toggleMission } = useProgress()

  const categories = tab === 'all' ? CATEGORY_ORDER : [tab]

  return (
    <>
      <div className={s.tabs}>
        {MISSION_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${s.tab} ${tab === item.id ? s.tabActive : ''}`}
            aria-pressed={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={s.sections}>
        {categories.map((category) => {
          const missions = MISSIONS.filter((m) => m.category === category)
          if (missions.length === 0) return null
          return (
            <section key={category} className={s.section}>
              <header className={s.sectionHead}>
                <PixelIcon name={CATEGORY_ICON[category]} size={18} />
                <span className={s.sectionTitle}>{CATEGORY_LABEL[category]}</span>
              </header>
              <ul className={s.rows}>
                {missions.map((mission) => {
                  const done = isCleared(mission.id)
                  return (
                    <li key={mission.id}>
                      <button
                        type="button"
                        className={`${s.row} ${done ? s.rowDone : ''}`}
                        aria-pressed={done}
                        onClick={() => {
                          const completed = toggleMission(mission.id)
                          if (completed) onComplete(completed)
                        }}
                      >
                        <span className={`${s.badge} ${done ? s.badgeDone : ''}`}>
                          {done && <PixelIcon name="check" size={18} />}
                        </span>
                        <span className={s.rowTitle}>{mission.title}</span>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </>
  )
}
