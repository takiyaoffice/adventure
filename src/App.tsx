import { useEffect, useState } from 'react'
import { ProgressProvider, useProgress } from './state/ProgressContext'
import { TabBar, type TabId } from './components/layout/TabBar'
import { AdventureBook } from './screens/AdventureBook'
import { WorldMap } from './screens/WorldMap'
import { TodayAdventure } from './screens/TodayAdventure'
import { Missions } from './screens/Missions'
import { Complete } from './screens/Complete'

function AppShell() {
  const [tab, setTab] = useState<TabId>('book')
  const [focusLocationId, setFocusLocationId] = useState<string | null>(null)
  const [showComplete, setShowComplete] = useState(false)
  const { justCompletedFinal, clearJustCompletedFinal } = useProgress()

  useEffect(() => {
    if (justCompletedFinal) {
      setShowComplete(true)
      clearJustCompletedFinal()
    }
  }, [justCompletedFinal, clearJustCompletedFinal])

  const goToMissions = (locationId: string) => {
    setFocusLocationId(locationId)
    setTab('missions')
  }

  return (
    <div className="h-full flex flex-col bg-wood-950">
      <div className="flex-1 min-h-0 flex flex-col max-w-md w-full mx-auto sm:my-0">
        {tab === 'book' && <AdventureBook onStart={() => setTab('map')} onShowComplete={() => setShowComplete(true)} />}
        {tab === 'map' && <WorldMap onOpenMissions={goToMissions} />}
        {tab === 'today' && <TodayAdventure onOpenMissions={goToMissions} />}
        {tab === 'missions' && (
          <Missions focusLocationId={focusLocationId} onConsumeFocus={() => setFocusLocationId(null)} />
        )}
      </div>

      <TabBar active={tab} onChange={setTab} />

      {showComplete && <Complete onClose={() => setShowComplete(false)} />}
    </div>
  )
}

export default function App() {
  return (
    <ProgressProvider>
      <AppShell />
    </ProgressProvider>
  )
}
