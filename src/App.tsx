import { useCallback, useState } from 'react'
import { BottomNav, NAV_ITEMS } from './components/layout/BottomNav'
import { Screen } from './components/layout/Screen'
import { useBgm } from './components/ui/Bgm'
import { LodgingSheet } from './components/ui/LodgingSheet'
import { MissionComplete } from './components/ui/MissionComplete'
import { SystemUpdate } from './components/ui/SystemUpdate'
import { HomeScreen } from './screens/HomeScreen'
import { ScheduleScreen } from './screens/ScheduleScreen'
import { MapScreen } from './screens/MapScreen'
import { MissionScreen } from './screens/MissionScreen'
import { GuideScreen } from './screens/GuideScreen'
import { SCHEDULE } from './data/schedule'
import { ProgressProvider } from './state/ProgressContext'
import { useLodgingUnlock } from './state/useLodgingUnlock'
import type { Mission, ScreenId } from './types'
import s from './App.module.css'

function AppShell() {
  const [screen, setScreen] = useState<ScreenId>('home')
  const [selectedDayId, setSelectedDayId] = useState(SCHEDULE[0].id)
  const [celebrating, setCelebrating] = useState<Mission | null>(null)
  const bgm = useBgm()

  // 宿の記録。起動した時点で未解放だったときだけアップデート確認を出す。
  // 「はい」で解放されても演出は最後まで続けたいので、表示そのものは別に持つ。
  const { unlocked: lodgingUnlocked, unlock: unlockLodging } = useLodgingUnlock()
  const [showUpdate, setShowUpdate] = useState(() => !lodgingUnlocked)
  const [showLodging, setShowLodging] = useState(false)

  const finishUpdate = useCallback(() => {
    setShowUpdate(false)
    setScreen('home')
    setShowLodging(true)
  }, [])

  const handleComplete = useCallback((mission: Mission) => setCelebrating(mission), [])
  const nav = NAV_ITEMS.find((item) => item.id === screen) ?? NAV_ITEMS[0]

  return (
    <div className={s.app}>
      {bgm.element}
      <Screen label={nav.label} fixed={screen === 'map'}>
        {screen === 'home' && (
          <HomeScreen
            onNavigate={setScreen}
            lodgingUnlocked={lodgingUnlocked}
            onOpenLodging={() => setShowLodging(true)}
          />
        )}
        {screen === 'schedule' && <ScheduleScreen selectedDayId={selectedDayId} onSelectDay={setSelectedDayId} />}
        {screen === 'map' && <MapScreen onComplete={handleComplete} />}
        {screen === 'mission' && <MissionScreen onComplete={handleComplete} />}
        {screen === 'guide' && <GuideScreen />}
      </Screen>
      <BottomNav
        current={screen}
        onNavigate={setScreen}
        bgmMuted={bgm.muted}
        onToggleBgm={bgm.toggleMuted}
      />
      <MissionComplete mission={celebrating} onClose={() => setCelebrating(null)} />

      {showUpdate && <SystemUpdate onConfirm={unlockLodging} onFinish={finishUpdate} />}
      {showLodging && <LodgingSheet onClose={() => setShowLodging(false)} />}
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
