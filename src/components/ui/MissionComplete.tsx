import { useEffect } from 'react'
import type { CSSProperties } from 'react'
import { PixelIcon } from './PixelIcon'
import type { Mission } from '../../types'
import s from './MissionComplete.module.css'

interface Props {
  mission: Mission | null
  onClose: () => void
}

const SPARKS = [
  { left: '12%', top: '26%', size: 12, delay: 0 },
  { left: '82%', top: '22%', size: 16, delay: 160 },
  { left: '22%', top: '68%', size: 10, delay: 320 },
  { left: '74%', top: '72%', size: 14, delay: 90 },
  { left: '50%', top: '16%', size: 10, delay: 420 },
  { left: '34%', top: '80%', size: 12, delay: 240 },
]

/** ミッション達成時の「MISSION COMPLETE!」演出 */
export function MissionComplete({ mission, onClose }: Props) {
  useEffect(() => {
    if (!mission) return
    const timer = window.setTimeout(onClose, 2800)
    return () => window.clearTimeout(timer)
  }, [mission, onClose])

  if (!mission) return null

  return (
    <div className={s.overlay} role="alertdialog" aria-label="ミッション達成" onClick={onClose}>
      <div className={s.burst} aria-hidden="true">
        {SPARKS.map((spark) => (
          <span
            key={spark.left + spark.top}
            className={s.spark}
            style={{ left: spark.left, top: spark.top, animationDelay: `${spark.delay}ms` } as CSSProperties}
          >
            <PixelIcon name="star" size={spark.size} />
          </span>
        ))}
      </div>
      <div className={s.window} onClick={(e) => e.stopPropagation()}>
        <div className={s.ribbon} aria-hidden="true">
          <PixelIcon name="star" size={12} />
          <PixelIcon name="star" size={12} />
          <PixelIcon name="star" size={12} />
        </div>
        <p className={s.heading}>
          MISSION
          <br />
          COMPLETE!
        </p>
        <p className={s.title}>{mission.title}</p>
        {mission.reward && <p className={s.reward}>{mission.reward}</p>}
        <p className={s.hint}>TAP TO CLOSE</p>
      </div>
    </div>
  )
}
