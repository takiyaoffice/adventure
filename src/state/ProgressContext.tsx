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
  /** その場所に紐づくミッションを1つでも達成しているか */
  isVisited: (locationId: LocationId) => boolean
  /** 場所に紐づくミッション */
  missionsAt: (locationId: LocationId) => Mission[]
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

  const value = useMemo<ProgressValue>(() => {
    const missionsByLocation = new Map<LocationId, Mission[]>()
    MISSIONS.forEach((m) => {
      if (!m.locationId) return
      const list = missionsByLocation.get(m.locationId) ?? []
      list.push(m)
      missionsByLocation.set(m.locationId, list)
    })
    return {
      cleared,
      isCleared: (id) => cleared.has(id),
      toggleMission,
      isVisited: (locationId) => (missionsByLocation.get(locationId) ?? []).some((m) => cleared.has(m.id)),
      missionsAt: (locationId) => missionsByLocation.get(locationId) ?? [],
      clearedCount: cleared.size,
      totalCount: MISSIONS.length,
      resetProgress: () => setCleared(new Set()),
    }
  }, [cleared, toggleMission])

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress(): ProgressValue {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>')
  return ctx
}
