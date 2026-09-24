import { useState } from 'react'
import { SCHEDULE, STATUS_LABEL } from '../data/schedule'
import type { ScheduleStatus } from '../types'
import s from './ScheduleScreen.module.css'

interface Props {
  selectedDayId: string
  onSelectDay: (dayId: string) => void
}

const STATUS_CLASS: Record<ScheduleStatus, string> = {
  fixed: s.fixed,
  recommended: s.recommended,
  free: s.free,
}

/** 1日ぶんを1ページとして表示し、上部のタブで切り替える */
export function ScheduleScreen({ selectedDayId, onSelectDay }: Props) {
  const day = SCHEDULE.find((d) => d.id === selectedDayId) ?? SCHEDULE[0]
  // 同じタブを押し直したときも key が変わるようにして、ページの動きを必ず出す
  const [tick, setTick] = useState(0)

  const selectDay = (dayId: string) => {
    onSelectDay(dayId)
    setTick((n) => n + 1)
  }

  return (
    <>
      <div className={s.tabs}>
        {SCHEDULE.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${s.tab} ${item.id === day.id ? s.tabActive : ''}`}
            aria-pressed={item.id === day.id}
            onClick={() => selectDay(item.id)}
          >
            <span className={s.tabName}>{item.dayLabel}</span>
            <span className={s.tabDate}>{item.dateShort}</span>
          </button>
        ))}
      </div>

      {/* key を変えることで、タブを押すたびに必ずページがめくれる演出になる */}
      <article key={`${day.id}-${tick}`} className={s.card}>
        <div className={s.headRow}>
          <span className={s.dayChip}>{day.dayLabel}</span>
          <span className={s.cardDate}>{day.dateFull}</span>
          {day.badge && <span className={s.badge}>{day.badge}</span>}
        </div>
        <h2 className={s.cardTitle}>{day.title}</h2>

        <img className={s.illustration} src={day.illustration} alt="" />

        <ol className={s.timeline}>
          {day.entries.map((entry) => (
            <li key={`${entry.period}-${entry.title}`} className={s.entry}>
              <span className={s.dot} />
              <div className={s.entryBody}>
                <div className={s.entryHead}>
                  <span className={s.period}>{entry.period}</span>
                  <span className={`${s.status} ${STATUS_CLASS[entry.status]}`}>
                    {STATUS_LABEL[entry.status]}
                  </span>
                </div>
                <span className={s.entryTitle}>{entry.title}</span>
              </div>
            </li>
          ))}
        </ol>
      </article>
    </>
  )
}
