import { useEffect, useRef, useState } from 'react'
import { ScreenHeader } from '../components/layout/ScreenHeader'
import { WoodPanel } from '../components/ui/WoodPanel'
import { SealButton } from '../components/ui/SealButton'
import { LocationGlyph } from '../components/icons/LocationGlyph'
import { LOCATIONS, type Location } from '../data/locations'
import { useProgress } from '../state/ProgressContext'

export function Missions({
  focusLocationId,
  onConsumeFocus,
}: {
  focusLocationId: string | null
  onConsumeFocus: () => void
}) {
  const [openId, setOpenId] = useState<string | null>(null)
  const { isArrived } = useProgress()

  useEffect(() => {
    if (focusLocationId) {
      setOpenId(focusLocationId)
      onConsumeFocus()
    }
  }, [focusLocationId, onConsumeFocus])

  const open = openId ? LOCATIONS.find((l) => l.id === openId) : undefined

  if (open) {
    return <MissionDetail location={open} onBack={() => setOpenId(null)} />
  }

  const day1 = LOCATIONS.filter((l) => l.day === 1 && !l.isFinal)
  const day2 = LOCATIONS.filter((l) => l.day === 2 && !l.isFinal)
  const finalMission = LOCATIONS.find((l) => l.isFinal)

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <ScreenHeader numeral="④" label="ミッション" tone="orange" title="ミッション一覧" subtitle="各場所のミッションを達成" />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-4 py-5 bg-wood-950">
        <div className="max-w-md mx-auto space-y-5">
          <MissionGroup title="1日目" items={day1} arrived={isArrived} onSelect={setOpenId} />
          <MissionGroup title="2日目" items={day2} arrived={isArrived} onSelect={setOpenId} />

          {finalMission && (
            <div>
              <p className="text-gold-400 font-jp font-bold text-sm mb-2 px-1">FINAL MISSION</p>
              <button onClick={() => setOpenId(finalMission.id)} className="w-full text-left">
                <WoodPanel
                  tone="night"
                  className={`px-4 py-4 flex items-center gap-3 ${isArrived(finalMission.id) ? 'ring-4 ring-gold-400' : ''}`}
                >
                  <span
                    className={`flex items-center justify-center w-12 h-12 rounded-full shrink-0 ${
                      isArrived(finalMission.id) ? 'bg-gold-400 text-wood-900' : 'bg-wood-700 text-parchment-dark'
                    }`}
                  >
                    <LocationGlyph icon={finalMission.icon} className="w-7 h-7" />
                  </span>
                  <div className="flex-1">
                    <p className="font-jp font-black text-gold-200 text-base">{finalMission.mission.arriveText}</p>
                    <p className="text-parchment-dark text-xs">旅の最後に達成しよう</p>
                  </div>
                  {isArrived(finalMission.id) && <span className="text-gold-300 text-xl">✓</span>}
                </WoodPanel>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function MissionGroup({
  title,
  items,
  arrived,
  onSelect,
}: {
  title: string
  items: Location[]
  arrived: (id: string) => boolean
  onSelect: (id: string) => void
}) {
  return (
    <div>
      <p className="text-gold-400 font-jp font-bold text-sm mb-2 px-1">{title}</p>
      <div className="space-y-2.5">
        {items.map((loc) => {
          const done = arrived(loc.id)
          return (
            <button key={loc.id} onClick={() => onSelect(loc.id)} className="w-full text-left">
              <WoodPanel className={`px-4 py-3 flex items-center gap-3 ${done ? 'ring-4 ring-forest-500' : ''}`}>
                <span
                  className={`flex items-center justify-center w-11 h-11 rounded-full shrink-0 ${
                    done ? 'bg-forest-600 text-gold-200' : 'bg-wood-700 text-parchment'
                  }`}
                >
                  <LocationGlyph icon={loc.icon} className="w-6 h-6" />
                </span>
                <div className="flex-1">
                  <p className="font-jp font-bold text-ink-900 text-base">{loc.name}</p>
                  <p className="text-ink-700 text-xs">{done ? '達成済み' : loc.mission.arriveText}</p>
                </div>
                {done ? (
                  <span className="text-forest-600 text-xl shrink-0">✓</span>
                ) : (
                  <span className="text-gold-700 text-xl shrink-0">›</span>
                )}
              </WoodPanel>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MissionDetail({ location, onBack }: { location: Location; onBack: () => void }) {
  const { isArrived, isPhotoSent, markArrived, markPhotoSent } = useProgress()
  const done = isArrived(location.id)
  const photoDone = isPhotoSent(location.id)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [toast, setToast] = useState(false)

  const handlePhoto = async (file: File) => {
    markPhotoSent(location.id)
    const nav = navigator as Navigator & { canShare?: (data: ShareData) => boolean; share?: (data: ShareData) => Promise<void> }
    if (nav.share && nav.canShare && nav.canShare({ files: [file] })) {
      try {
        await nav.share({ files: [file], title: location.name, text: `${location.name}で撮った写真だよ！` })
        return
      } catch {
        /* user cancelled share — still keep the mission as recorded */
      }
    }
    setToast(true)
    setTimeout(() => setToast(false), 2400)
  }

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <header className="shrink-0 bg-wood-900 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 border-b-4 border-gold-600">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <button onClick={onBack} className="w-9 h-9 rounded-full bg-wood-800 text-gold-300 font-bold shrink-0 text-lg">
            ‹
          </button>
          <div>
            <p className="text-gold-400 text-xs font-bold">ミッション詳細</p>
            <h1 className="font-jp font-black text-xl text-gold-300">{location.name}</h1>
          </div>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-4 py-5 bg-wood-950">
        <div className="max-w-md mx-auto">
          <WoodPanel className="px-5 py-6">
            <div className="flex justify-center">
              <span
                className={`flex items-center justify-center w-20 h-20 rounded-full ${
                  done ? 'bg-gold-400 text-wood-900 animate-shimmer' : 'bg-wood-700 text-parchment'
                }`}
              >
                <LocationGlyph icon={location.icon} className="w-11 h-11" />
              </span>
            </div>
            <p className="text-center text-gold-700 font-bold text-xs mt-2 tracking-widest">
              MISSION{location.isFinal ? ' — FINAL' : ''}
            </p>
            <h2 className="text-center font-jp font-black text-2xl text-ink-900 mt-1">{location.name}</h2>
            <p className="text-center text-ink-700 text-sm mt-2 leading-relaxed">{location.blurb}</p>

            <div className="mt-5 rounded-xl bg-paper/80 border-2 border-gold-600 px-4 py-4">
              <p className="font-jp font-bold text-ink-900 mb-3">{location.mission.arriveText}</p>
              <SealButton tone={done ? 'gold' : 'forest'} fullWidth onClick={() => markArrived(location.id)} disabled={done}>
                {done ? '✓ 到着した！' : '到着した！'}
              </SealButton>
            </div>

            {location.mission.extra && (
              <div className="mt-4 rounded-xl bg-paper/60 border-2 border-gold-600/70 px-4 py-4">
                <p className="font-jp font-bold text-ink-900 mb-1 text-sm">追加ミッション</p>
                <p className="text-ink-700 text-xs mb-3">{location.mission.extra}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handlePhoto(file)
                    e.target.value = ''
                  }}
                />
                <SealButton tone={photoDone ? 'gold' : 'red'} fullWidth onClick={() => fileInputRef.current?.click()}>
                  {photoDone ? '✓ 送信済み・もう一度撮る' : '📷 写真を撮る・送る'}
                </SealButton>
                {toast && <p className="text-center text-forest-700 text-xs font-bold mt-2">思い出の写真を記録しました！</p>}
              </div>
            )}
          </WoodPanel>
        </div>
      </div>
    </div>
  )
}
