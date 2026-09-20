import { useCallback, useState } from 'react'
import { BottomNav, NAV_ITEMS } from './components/layout/BottomNav'
import { Screen } from './components/layout/Screen'
import { MissionComplete } from './components/ui/MissionComplete'
import { HomeScreen } from './screens/HomeScreen'
import { ScheduleScreen } from './screens/ScheduleScreen'
import { MapScreen } from './screens/MapScreen'
import { MissionScreen } from './screens/MissionScreen'
import { GuideScreen } from './screens/GuideScreen'
import { SCHEDULE } from './data/schedule'
import { ProgressProvider } from './state/ProgressContext'
import type { Mission, ScreenId } from './types'
import s from './App.module.css'

function AppShell() {
  const [screen, setScreen] = useState<ScreenId>('home')
  const [selectedDayId, setSelectedDayId] = useState(SCHEDULE[0].id)
  const [celebrating, setCelebrating] = useState<Mission | null>(null)

  const handleComplete = useCallback((mission: Mission) => setCelebrating(mission), [])
  const nav = NAV_ITEMS.find((item) => item.id === screen) ?? NAV_ITEMS[0]

  return (
    <div className={s.app}>
      <Screen label={nav.label} fixed={screen === 'map'}>
        {screen === 'home' && <HomeScreen onNavigate={setScreen} />}
        {screen === 'schedule' && <ScheduleScreen selectedDayId={selectedDayId} onSelectDay={setSelectedDayId} />}
        {screen === 'map' && <MapScreen onComplete={handleComplete} />}
        {screen === 'mission' && <MissionScreen onComplete={handleComplete} />}
        {screen === 'guide' && <GuideScreen />}
      </Screen>
      <BottomNav current={screen} onNavigate={setScreen} />
      <MissionComplete mission={celebrating} onClose={() => setCelebrating(null)} />
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
