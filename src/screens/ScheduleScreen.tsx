import { useEffect, useRef } from 'react'
import { SCHEDULE } from '../data/schedule'
import s from './ScheduleScreen.module.css'

interface Props {
  selectedDayId: string
  onSelectDay: (dayId: string) => void
}

export function ScheduleScreen({ selectedDayId, onSelectDay }: Props) {
  const refs = useRef(new Map<string, HTMLElement>())
  const firstRender = useRef(true)

  // タブで選んだ日のカードまでスクロールする
  useEffect(() => {
    const node = refs.current.get(selectedDayId)
    if (!node) return
    node.scrollIntoView({ behavior: firstRender.current ? 'auto' : 'smooth', block: 'start' })
    firstRender.current = false
  }, [selectedDayId])

  return (
    <>
      <div className={s.tabs}>
        {SCHEDULE.map((day) => (
          <button
            key={day.id}
            type="button"
            className={`${s.tab} ${day.id === selectedDayId ? s.tabActive : ''}`}
            aria-pressed={day.id === selectedDayId}
            onClick={() => onSelectDay(day.id)}
          >
            <span className={s.tabName}>{day.dayLabel}</span>
            <span className={s.tabDate}>{day.dateShort}</span>
          </button>
        ))}
      </div>

      <div className={s.list}>
        {SCHEDULE.map((day) => (
          <article
            key={day.id}
            ref={(node) => {
              if (node) refs.current.set(day.id, node)
              else refs.current.delete(day.id)
            }}
            className={`${s.card} ${day.id === selectedDayId ? s.cardActive : ''}`}
          >
            <div className={s.cardMain}>
              <div className={s.cardHead}>
                <span className={s.dayChip}>{day.dayLabel}</span>
                <span className={s.cardDate}>{day.dateFull}</span>
              </div>
              {day.badge && <span className={s.badge}>{day.badge}</span>}
              <h3 className={s.cardTitle}>{day.title}</h3>
              <ol className={s.timeline}>
                {day.entries.map((entry) => (
                  <li key={`${entry.time}-${entry.title}`} className={s.entry}>
                    <span className={s.dot} />
                    <span className={s.time}>{entry.time}</span>
                    <span className={s.entryTitle}>{entry.title}</span>
                  </li>
                ))}
              </ol>
            </div>
            <img className={s.thumb} src={day.thumbnail} alt="" />
          </article>
        ))}
      </div>
    </>
  )
}
