import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { LOCATIONS } from '../data/locations'

const STORAGE_KEY = 'sendai-adventure-progress-v1'

interface ProgressState {
  arrived: Record<string, boolean>
  photoSent: Record<string, boolean>
}

const EMPTY_STATE: ProgressState = { arrived: {}, photoSent: {} }

function loadState(): ProgressState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return EMPTY_STATE
    const parsed = JSON.parse(raw)
    return { arrived: parsed.arrived ?? {}, photoSent: parsed.photoSent ?? {} }
  } catch {
    return EMPTY_STATE
  }
}

interface ProgressContextValue {
  isArrived: (id: string) => boolean
  isPhotoSent: (id: string) => boolean
  markArrived: (id: string) => void
  markPhotoSent: (id: string) => void
  resetAll: () => void
  discoveredCount: number
  totalCount: number
  isComplete: boolean
  justCompletedFinal: boolean
  clearJustCompletedFinal: () => void
}

const ProgressContext = createContext<ProgressContextValue | null>(null)

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ProgressState>(loadState)
  const [justCompletedFinal, setJustCompletedFinal] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const finalLocationId = useMemo(() => LOCATIONS.find((l) => l.isFinal)?.id, [])

  const markArrived = (id: string) => {
    setState((prev) => {
      if (prev.arrived[id]) return prev
      if (id === finalLocationId) setJustCompletedFinal(true)
      return { ...prev, arrived: { ...prev.arrived, [id]: true } }
    })
  }

  const markPhotoSent = (id: string) => {
    setState((prev) => (prev.photoSent[id] ? prev : { ...prev, photoSent: { ...prev.photoSent, [id]: true } }))
  }

  const resetAll = () => {
    setState(EMPTY_STATE)
    setJustCompletedFinal(false)
  }

  const nonFinalLocations = useMemo(() => LOCATIONS.filter((l) => !l.isFinal), [])
  const discoveredCount = nonFinalLocations.filter((l) => state.arrived[l.id]).length

  const value: ProgressContextValue = {
    isArrived: (id) => !!state.arrived[id],
    isPhotoSent: (id) => !!state.photoSent[id],
    markArrived,
    markPhotoSent,
    resetAll,
    discoveredCount,
    totalCount: nonFinalLocations.length,
    isComplete: finalLocationId ? !!state.arrived[finalLocationId] : false,
    justCompletedFinal,
    clearJustCompletedFinal: () => setJustCompletedFinal(false),
  }

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used within ProgressProvider')
  return ctx
}
