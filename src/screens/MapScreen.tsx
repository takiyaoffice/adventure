import { useState } from 'react'
import type { CSSProperties } from 'react'
import { PixelIcon } from '../components/ui/PixelIcon'
import { LOCATIONS, MAP_TERRAIN } from '../data/locations'
import { useProgress } from '../state/ProgressContext'
import type { LocationId, Mission } from '../types'
import s from './MapScreen.module.css'

interface Props {
  onComplete: (mission: Mission) => void
}

export function MapScreen({ onComplete }: Props) {
  const [selected, setSelected] = useState<LocationId | null>(null)
  const { isVisited, isCleared, missionsAt, toggleMission } = useProgress()

  const openLocations = LOCATIONS.filter((l) => !l.locked)
  const visitedCount = openLocations.filter((l) => isVisited(l.id)).length
  const selectedLocation = selected ? LOCATIONS.find((l) => l.id === selected) ?? null : null

  const defaultLines =
    visitedCount === 0
      ? ['まだ訪れていない場所が', 'たくさんあります。', '冒険を続けましょう！']
      : visitedCount < openLocations.length
        ? [`おとずれた場所　${visitedCount} / ${openLocations.length}`, '未踏の地がまだ残っています。', '冒険を続けましょう！']
        : ['すべての場所をおとずれた！', '未来の地図が完成しました。']

  return (
    <>
      <div className={s.panel}>
        <div className={s.viewport}>
          <div className={s.canvas} onClick={() => setSelected(null)}>
            <img className={s.terrain} src={MAP_TERRAIN} alt="仙台をもとにしたファンタジー風ワールドマップ" />
            {LOCATIONS.map((loc) => {
              const visited = !loc.locked && isVisited(loc.id)
              const classes = [
                s.marker,
                loc.locked ? s.locked : '',
                visited ? s.visited : '',
                selected === loc.id ? s.selected : '',
              ]
                .filter(Boolean)
                .join(' ')
              return (
                <button
                  key={loc.id}
                  type="button"
                  className={classes}
                  style={{ left: `${loc.x}%`, top: `${loc.y}%`, '--scale': loc.scale ?? 1 } as CSSProperties}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelected((prev) => (prev === loc.id ? null : loc.id))
                  }}
                >
                  <img className={s.markerIcon} src={loc.icon} alt="" />
                  <span className={s.label}>{loc.locked ? '？？？' : loc.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className={s.info}>
        <PixelIcon name="mission" size={22} className={s.infoIcon} />
        <div className={s.infoBody}>
          {selectedLocation ? (
            <>
              <p className={s.infoName}>{selectedLocation.locked ? '？？？' : selectedLocation.name}</p>
              <p className={s.infoDesc}>{selectedLocation.description}</p>
              {!selectedLocation.locked && missionsAt(selectedLocation.id).length > 0 && (
                <div className={s.infoMissions}>
                  {missionsAt(selectedLocation.id).map((mission) => {
                    const done = isCleared(mission.id)
                    return (
                      <button
                        key={mission.id}
                        type="button"
                        className={`${s.infoMission} ${done ? s.done : ''}`}
                        onClick={() => {
                          const completed = toggleMission(mission.id)
                          if (completed) onComplete(completed)
                        }}
                      >
                        <span className={`${s.box} ${done ? s.boxDone : ''}`}>
                          <PixelIcon name="check" size={14} />
                        </span>
                        <span>{mission.title}</span>
                      </button>
                    )
                  })}
                </div>
              )}
              <button type="button" className={s.close} onClick={() => setSelected(null)}>
                ×
              </button>
            </>
          ) : (
            defaultLines.map((line) => (
              <p key={line} className={s.infoLine}>
                {line}
              </p>
            ))
          )}
        </div>
      </div>
    </>
  )
}
