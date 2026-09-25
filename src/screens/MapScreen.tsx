import { useState } from 'react'
import type { CSSProperties } from 'react'
import { PixelIcon } from '../components/ui/PixelIcon'
import { CodeLock } from '../components/ui/CodeLock'
import { LOCATIONS, MAP_COMPASS, MAP_TERRAIN } from '../data/locations'
import { SECRET_MISSION_ID } from '../data/secret'
import { useProgress } from '../state/ProgressContext'
import type { LocationId, Mission } from '../types'
import s from './MapScreen.module.css'

interface Props {
  onComplete: (mission: Mission) => void
}

export function MapScreen({ onComplete }: Props) {
  const [selected, setSelected] = useState<LocationId | null>(null)
  const [lockOpen, setLockOpen] = useState(false)
  const { isVisited, isCleared, placeMissionAt, toggleMission, completeMission } = useProgress()

  const visitedCount = LOCATIONS.filter((l) => isVisited(l.id)).length
  const selectedLocation = selected ? LOCATIONS.find((l) => l.id === selected) ?? null : null
  const selectedMission = selectedLocation ? placeMissionAt(selectedLocation.id) : null

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
                  <img className={s.markerIcon} src={loc.icon} alt="" />
                  <span className={s.label}>{loc.name}</span>
                </button>
              )
            })}
          </div>
        </div>
        {/* 方位磁針はボタン。押すと隠された暗号の入力画面が開く */}
        <button
          type="button"
          className={`${s.compass} ${isCleared(SECRET_MISSION_ID) ? s.compassUnlocked : ''}`}
          aria-label="方角を示すものを調べる"
          onClick={() => setLockOpen(true)}
        >
          <img className={s.compassIcon} src={MAP_COMPASS} alt="" />
        </button>
      </div>

      {/* 高さを固定して、選んでもマップの大きさが変わらないようにする */}
      <div className={s.info}>
        {selectedLocation ? (
          <>
            <p className={s.infoTitle}>
              <PixelIcon name="mission" size={16} className={s.infoIcon} />
              {selectedLocation.name.replace('\n', '')}
            </p>
            <p className={s.infoDesc}>{selectedLocation.description}</p>
            {selectedMission && (
              <button
                type="button"
                className={`${s.infoMission} ${isCleared(selectedMission.id) ? s.done : ''}`}
                onClick={() => {
                  const completed = toggleMission(selectedMission.id)
                  if (completed) onComplete(completed)
                }}
              >
                <span className={`${s.box} ${isCleared(selectedMission.id) ? s.boxDone : ''}`}>
                  <PixelIcon name="check" size={13} />
                </span>
                <span>{selectedMission.title}</span>
              </button>
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

      <CodeLock
        open={lockOpen}
        unlocked={isCleared(SECRET_MISSION_ID)}
        onUnlock={() => {
          setLockOpen(false)
          const completed = completeMission(SECRET_MISSION_ID)
          if (completed) onComplete(completed)
        }}
        onClose={() => setLockOpen(false)}
      />
    </>
  )
}
