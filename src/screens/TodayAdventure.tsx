import { useState } from 'react'
import { ScreenHeader } from '../components/layout/ScreenHeader'
import { WoodPanel } from '../components/ui/WoodPanel'
import { TimelineGlyph } from '../components/icons/TimelineGlyph'
import { ITINERARY } from '../data/itinerary'
import { useProgress } from '../state/ProgressContext'

export function TodayAdventure({ onOpenMissions }: { onOpenMissions: (locationId: string) => void }) {
  const [dayIndex, setDayIndex] = useState(0)
  const { isArrived } = useProgress()
  const day = ITINERARY[dayIndex]

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <ScreenHeader numeral="③" label="今日の冒険" tone="blue" title={`DAY ${day.day}`} subtitle={`${day.date}（${day.weekday}）`} />

      <div className="shrink-0 bg-wood-900 px-4 pb-3">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-2">
          {ITINERARY.map((d, i) => (
            <button
              key={d.day}
              onClick={() => setDayIndex(i)}
              className={`rounded-lg py-2 text-sm font-jp font-bold border-2 transition ${
                i === dayIndex
                  ? 'bg-mission-blue text-white border-gold-400'
                  : 'bg-wood-800 text-parchment-dark border-wood-700'
              }`}
            >
              DAY{d.day}（{d.weekday}）
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-4 py-5 bg-wood-950">
        <div className="max-w-md mx-auto">
          <WoodPanel className="px-4 pt-5 pb-5">
            <h2 className="text-center font-jp font-black text-lg text-adventure-red-dark mb-4">{day.title}</h2>

            <ol className="relative border-l-4 border-gold-600 ml-3 space-y-5">
              {day.items.map((item, idx) => {
                const arrived = item.locationId ? isArrived(item.locationId) : false
                return (
                  <li key={idx} className="ml-4">
                    <span className="absolute -left-[15px] flex items-center justify-center w-7 h-7 rounded-full bg-wood-800 border-2 border-gold-500 text-gold-300">
                      <TimelineGlyph icon={item.icon} className="w-4 h-4" />
                    </span>
                    <button
                      disabled={!item.locationId}
                      onClick={() => item.locationId && onOpenMissions(item.locationId)}
                      className="w-full text-left rounded-lg bg-paper/70 border border-gold-600/60 px-3 py-2.5 active:bg-paper disabled:active:bg-paper/70"
                    >
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-bold text-adventure-red-dark text-sm">{item.time}</span>
                        {item.locationId && (
                          <span
                            className={`text-[11px] font-bold rounded-full px-2 py-0.5 ${
                              arrived ? 'bg-forest-500/20 text-forest-700' : 'bg-gold-300/40 text-gold-700'
                            }`}
                          >
                            {arrived ? '✓ 到着済み' : '未到着'}
                          </span>
                        )}
                      </div>
                      <p className="font-jp font-bold text-ink-900 text-base mt-0.5">{item.title}</p>
                      {item.note && <p className="text-ink-700 text-xs mt-1 leading-relaxed">{item.note}</p>}
                    </button>
                  </li>
                )
              })}
            </ol>

            <p className="text-center text-xs text-ink-700 mt-5">
              無理のないペースで、ゆっくり旅を楽しみましょう。
            </p>
          </WoodPanel>
        </div>
      </div>
    </div>
  )
}
