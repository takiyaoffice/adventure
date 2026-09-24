import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { MISSIONS, MISSION_BY_ID } from '../data/missions'
import type { LocationId, Mission } from '../types'

const STORAGE_KEY = 'future-fantasy:progress:v1'

interface ProgressValue {
  /** 達成済みミッションの id 集合 */
  cleared: ReadonlySet<string>
  isCleared: (missionId: string) => boolean
  /** 達成状態を反転。新たに達成した場合はそのミッションを返す */
  toggleMission: (missionId: string) => Mission | null
  /** 達成済みにする（解除はしない）。新たに達成した場合はそのミッションを返す */
  completeMission: (missionId: string) => Mission | null
  /** その場所の「〇〇に行く」ミッションを達成しているか */
  isVisited: (locationId: LocationId) => boolean
  /** その場所の「〇〇に行く」ミッション */
  placeMissionAt: (locationId: LocationId) => Mission | null
  clearedCount: number
  totalCount: number
  resetProgress: () => void
}

const ProgressContext = createContext<ProgressValue | null>(null)

function loadInitial(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return new Set()
    // 現存するミッションだけを復元する
    return new Set(parsed.filter((id): id is string => typeof id === 'string' && MISSION_BY_ID.has(id)))
  } catch {
    return new Set()
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [cleared, setCleared] = useState<Set<string>>(loadInitial)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...cleared]))
    } catch {
      // プライベートブラウズなどで保存できなくても動作は継続する
    }
  }, [cleared])

  const toggleMission = useCallback((missionId: string): Mission | null => {
    const mission = MISSION_BY_ID.get(missionId)
    if (!mission) return null
    const wasCleared = cleared.has(missionId)
    setCleared((prev) => {
      const next = new Set(prev)
      if (next.has(missionId)) next.delete(missionId)
      else next.add(missionId)
      return next
    })
    // 新たに達成したときだけミッションを返す（達成演出の起動に使う）
    return wasCleared ? null : mission
  }, [cleared])

  const completeMission = useCallback((missionId: string): Mission | null => {
    const mission = MISSION_BY_ID.get(missionId)
    if (!mission || cleared.has(missionId)) return null
    setCleared((prev) => new Set(prev).add(missionId))
    return mission
  }, [cleared])

  const value = useMemo<ProgressValue>(() => {
    // 場所ごとの「〇〇に行く」ミッション。訪問したかどうかはこれだけで決まる
    const placeByLocation = new Map<LocationId, Mission>()
    MISSIONS.forEach((m) => {
      if (m.category === 'place' && m.locationId) placeByLocation.set(m.locationId, m)
    })
    return {
      cleared,
      isCleared: (id) => cleared.has(id),
      toggleMission,
      completeMission,
      isVisited: (locationId) => {
        const m = placeByLocation.get(locationId)
        return m ? cleared.has(m.id) : false
      },
      placeMissionAt: (locationId) => placeByLocation.get(locationId) ?? null,
      clearedCount: cleared.size,
      totalCount: MISSIONS.length,
      resetProgress: () => setCleared(new Set()),
    }
  }, [cleared, toggleMission, completeMission])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>')
  return ctx
}
