import { SCHEDULE } from '../data/schedule'
import s from './ScheduleScreen.module.css'

interface Props {
  selectedDayId: string
  onSelectDay: (dayId: string) => void
}

/** 1日ぶんを1ページとして表示し、上部のタブで切り替える */
export function ScheduleScreen({ selectedDayId, onSelectDay }: Props) {
  const day = SCHEDULE.find((d) => d.id === selectedDayId) ?? SCHEDULE[0]

  return (
    <>
      <div className={s.tabs}>
        {SCHEDULE.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${s.tab} ${item.id === day.id ? s.tabActive : ''}`}
            aria-pressed={item.id === day.id}
            onClick={() => onSelectDay(item.id)}
          >
            <span className={s.tabName}>{item.dayLabel}</span>
            <span className={s.tabDate}>{item.dateShort}</span>
          </button>
        ))}
      </div>

      {/* key を変えることで、日を切り替えるたびにページがめくれる演出になる */}
      <article key={day.id} className={s.card}>
        <div className={s.headRow}>
          <span className={s.dayChip}>{day.dayLabel}</span>
          <span className={s.cardDate}>{day.dateFull}</span>
          {day.badge && <span className={s.badge}>{day.badge}</span>}
        </div>
        <h2 className={s.cardTitle}>{day.title}</h2>
        <p className={s.lead}>{day.lead}</p>

        <img className={s.illustration} src={day.illustration} alt="" />

        <ol className={s.timeline}>
          {day.entries.map((entry) => (
            <li key={`${entry.time}-${entry.title}`} className={s.entry}>
              <span className={s.dot} />
              <span className={s.time}>{entry.time}</span>
              <span className={s.entryTitle}>{entry.title}</span>
            </li>
          ))}
        </ol>
      </article>
    </>
  )
}
