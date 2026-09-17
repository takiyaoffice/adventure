export type TabId = 'book' | 'map' | 'today' | 'missions'

interface Tab {
  id: TabId
  label: string
  numeral: string
  tone: string
}

const TABS: Tab[] = [
  { id: 'book', label: '冒険の書', numeral: '①', tone: 'text-mission-purple' },
  { id: 'map', label: 'マップ', numeral: '②', tone: 'text-forest-500' },
  { id: 'today', label: '今日の冒険', numeral: '③', tone: 'text-mission-blue' },
  { id: 'missions', label: 'ミッション', numeral: '④', tone: 'text-mission-orange' },
]

const ACTIVE_BG: Record<TabId, string> = {
  book: 'bg-mission-purple',
  map: 'bg-forest-600',
  today: 'bg-mission-blue',
  missions: 'bg-mission-orange',
}

function TabIcon({ id, active }: { id: TabId; active: boolean }) {
  const cls = `w-6 h-6 ${active ? 'text-gold-300' : 'text-parchment-dark'}`
  switch (id) {
    case 'book':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path
            d="M12 6.2C10.4 4.9 8.2 4 5.8 4 5 4 4.3 4.1 3.6 4.3a.6.6 0 0 0-.4.6v13.3c0 .4.4.7.8.6.7-.2 1.4-.3 2.1-.3 2 0 3.9.7 5.5 1.8.3.2.6.2.9 0 1.6-1.1 3.5-1.8 5.5-1.8.7 0 1.4.1 2.1.3.4.1.8-.2.8-.6V4.9a.6.6 0 0 0-.4-.6C19.7 4.1 19 4 18.2 4c-2.4 0-4.6.9-6.2 2.2Z"
            fill="currentColor"
          />
          <path d="M12 6.2v14" stroke="var(--color-wood-900)" strokeWidth="1.1" opacity="0.5" />
        </svg>
      )
    case 'map':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" fill="currentColor" />
          <path d="M9 4v14M15 6v14" stroke="var(--color-wood-900)" strokeWidth="1" opacity="0.4" />
        </svg>
      )
    case 'today':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <rect x="4" y="5" width="16" height="15" rx="2" fill="currentColor" />
          <rect x="4" y="5" width="16" height="4" rx="2" fill="currentColor" opacity="0.6" />
          <rect x="7" y="2.5" width="2" height="4" rx="1" fill="currentColor" />
          <rect x="15" y="2.5" width="2" height="4" rx="1" fill="currentColor" />
        </svg>
      )
    case 'missions':
      return (
        <svg viewBox="0 0 24 24" className={cls} fill="none">
          <rect x="5" y="3" width="2.4" height="18" fill="currentColor" />
          <path d="M7.4 4h10.2l-2.6 3.2L17.6 10H7.4Z" fill="currentColor" opacity="0.85" />
        </svg>
      )
  }
}

export function TabBar({ active, onChange }: { active: TabId; onChange: (id: TabId) => void }) {
  return (
    <nav className="shrink-0 bg-wood-900 border-t-4 border-gold-600 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-6px_16px_rgba(0,0,0,0.4)]">
      <div className="grid grid-cols-4 gap-1.5 max-w-md mx-auto">
        {TABS.map((tab) => {
          const isActive = tab.id === active
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex flex-col items-center gap-0.5 rounded-xl py-2 transition ${
                isActive ? `${ACTIVE_BG[tab.id]} ring-2 ring-gold-400` : 'bg-wood-800 active:bg-wood-700'
              }`}
            >
              <TabIcon id={tab.id} active={isActive} />
              <span className={`text-[11px] leading-tight font-jp font-bold ${isActive ? 'text-gold-300' : 'text-parchment-dark'}`}>
                {tab.numeral}
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
