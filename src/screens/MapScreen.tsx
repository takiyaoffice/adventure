import { useState } from 'react'
import type { CSSProperties } from 'react'
import { PixelIcon } from '../components/ui/PixelIcon'
import {
  LOCATIONS,
  MAP_COMPASS,
  MAP_PIN_TODO,
  MAP_PIN_VISITED,
  MAP_TERRAIN,
} from '../data/locations'
import { useProgress } from '../state/ProgressContext'
import type { LocationId, Mission } from '../types'
import s from './MapScreen.module.css'

interface Props {
  onComplete: (mission: Mission) => void
}

export function MapScreen({ onComplete }: Props) {
  const [selected, setSelected] = useState<LocationId | null>(null)
  const { isVisited, isCleared, missionsAt, toggleMission } = useProgress()

  const visitedCount = LOCATIONS.filter((l) => isVisited(l.id)).length
  const selectedLocation = selected ? LOCATIONS.find((l) => l.id === selected) ?? null : null

  const defaultLines =
    visitedCount === 0
      ? ['いろいろな場所を訪れて、', '新しい発見をしよう！']
      : visitedCount < LOCATIONS.length
        ? [`おとずれた場所　${visitedCount} / ${LOCATIONS.length}`, '冒険を続けよう！']
        : ['すべての場所をおとずれた！', '未来の地図が完成した。']

  return (
    <>
      <div className={s.panel}>
        <div className={s.viewport}>
          <div className={s.canvas} onClick={() => setSelected(null)}>
            <img className={s.terrain} src={MAP_TERRAIN} alt="仙台をもとにしたファンタジー風ワールドマップ" />
            {LOCATIONS.map((loc) => {
              const visited = isVisited(loc.id)
              const classes = [s.marker, visited ? s.visited : '', selected === loc.id ? s.selected : '']
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
                  <img className={s.pin} src={visited ? MAP_PIN_VISITED : MAP_PIN_TODO} alt="" />
                  <img className={s.markerIcon} src={loc.icon} alt="" />
                  <span className={s.label}>{loc.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className={s.legend}>
          <span className={s.legendRow}>
            <img className={s.legendPin} src={MAP_PIN_VISITED} alt="" />
            訪問済み
          </span>
          <span className={s.legendRow}>
            <img className={s.legendPin} src={MAP_PIN_TODO} alt="" />
            行ってみたい
          </span>
        </div>
        <img className={s.compass} src={MAP_COMPASS} alt="" />
      </div>

      <div className={s.info}>
        {selectedLocation ? (
          <>
            <p className={s.infoTitle}>
              <PixelIcon name="mission" size={16} className={s.infoIcon} />
              {selectedLocation.name.replace('\n', '')}
            </p>
            <p className={s.infoDesc}>{selectedLocation.description}</p>
            {missionsAt(selectedLocation.id).length > 0 && (
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
                        <PixelIcon name="check" size={13} />
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
          <>
            <p className={s.infoTitle}>
              <PixelIcon name="mission" size={16} className={s.infoIcon} />
              冒険の舞台：仙台エリア
            </p>
            {defaultLines.map((line) => (
              <p key={line} className={s.infoLine}>
                {line}
              </p>
            ))}
          </>
        )}
      </div>
    </>
  )
}
