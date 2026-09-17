import { useState } from 'react'
import { ScreenHeader } from '../components/layout/ScreenHeader'
import { WoodPanel } from '../components/ui/WoodPanel'
import { SealButton } from '../components/ui/SealButton'
import { MapPin } from '../components/map/MapPin'
import { LocationGlyph } from '../components/icons/LocationGlyph'
import { MountainDecor, TreeDecor, RiverDecor } from '../components/map/MapDecor'
import { LOCATIONS, getLocation } from '../data/locations'
import { useProgress } from '../state/ProgressContext'

const ROUTE_ORDER = ['sendai-station', 'sendai-castle', 'gyutan', 'akiu-onsen', 'hotel', 'zuihoden', 'jozenji', 'home']

export function WorldMap({ onOpenMissions }: { onOpenMissions: (locationId: string) => void }) {
  const { isArrived, discoveredCount, totalCount } = useProgress()
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const selected = selectedId ? getLocation(selectedId) : undefined
  const visiblePins = LOCATIONS.filter((l) => !l.isFinal)

  const routePoints = ROUTE_ORDER.map((id) => getLocation(id)).filter((l): l is NonNullable<typeof l> => !!l && !l.isFinal)
  const pathD = routePoints.reduce(
    (acc, p, i) => acc + `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y} `,
    ''
  )

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <ScreenHeader
        numeral="②"
        label="ワールドマップ"
        tone="green"
        title="仙台ワールドマップ"
        subtitle="訪れた場所が光るマップ"
        right={
          <span className="text-[11px] font-bold text-gold-300 bg-wood-800 border border-gold-600 rounded-full px-3 py-1 shrink-0">
            {discoveredCount}/{totalCount} 発見
          </span>
        }
      />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-3 py-4 bg-wood-950">
        <div className="max-w-md mx-auto">
          <WoodPanel tone="night" className="p-2">
            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <RiverDecor />
                <path d={pathD} stroke="#d9b356" strokeWidth="0.8" strokeDasharray="2.2 2" fill="none" opacity="0.55" />
                <MountainDecor x={4} y={4} scale={1.1} />
                <MountainDecor x={78} y={2} scale={0.9} />
                <TreeDecor x={90} y={30} scale={1} />
                <TreeDecor x={6} y={62} scale={1.1} />
                <TreeDecor x={88} y={68} scale={0.9} />
                <TreeDecor x={30} y={90} scale={0.8} />
              </svg>

              {visiblePins.map((loc) => (
                <MapPin key={loc.id} location={loc} discovered={isArrived(loc.id)} onClick={() => setSelectedId(loc.id)} />
              ))}
            </div>
          </WoodPanel>

          <div className="mt-3 flex items-center justify-center gap-5 text-parchment-dark text-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-night-700 border border-night-700 inline-block" />
              未発見
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-gold-400 border border-gold-300 inline-block animate-shimmer" />
              発見済み
            </span>
          </div>

          {selected && (
            <div className="fixed inset-0 z-30 flex items-end sm:items-center justify-center bg-black/50 px-3 pb-3 sm:pb-3" onClick={() => setSelectedId(null)}>
              <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
                <WoodPanel className="px-5 py-5 animate-sparkle-in">
                  <div className="flex items-start gap-3">
                    <span
                      className={`flex items-center justify-center w-12 h-12 rounded-full shrink-0 ${
                        isArrived(selected.id) ? 'bg-gold-400 text-wood-900' : 'bg-wood-700 text-parchment-dark'
                      }`}
                    >
                      <LocationGlyph icon={selected.icon} className="w-7 h-7" />
                    </span>
                    <div className="flex-1">
                      <h3 className="font-jp font-black text-xl text-ink-900">{selected.name}</h3>
                      <p className="text-xs text-ink-700">{selected.kana}</p>
                    </div>
                    <button
                      onClick={() => setSelectedId(null)}
                      className="w-8 h-8 rounded-full bg-wood-800 text-gold-300 font-bold shrink-0"
                      aria-label="閉じる"
                    >
                      ×
                    </button>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-ink-700">{selected.blurb}</p>

                  <div className="mt-4">
                    {isArrived(selected.id) ? (
                      <p className="text-center font-jp font-bold text-forest-600 bg-forest-500/15 border-2 border-forest-600 rounded-lg py-2">
                        ✓ DISCOVERED（発見済み）
                      </p>
                    ) : (
                      <SealButton
                        tone="gold"
                        fullWidth
                        onClick={() => {
                          onOpenMissions(selected.id)
                          setSelectedId(null)
                        }}
                      >
                        ミッションを見る
                      </SealButton>
                    )}
                  </div>
                </WoodPanel>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
