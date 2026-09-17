import { ScreenHeader } from '../components/layout/ScreenHeader'
import { WoodPanel } from '../components/ui/WoodPanel'
import { SealButton } from '../components/ui/SealButton'
import { TravelersArt } from '../components/icons/TravelersArt'
import { TRIP } from '../data/trip'
import { useProgress } from '../state/ProgressContext'

export function AdventureBook({ onStart, onShowComplete }: { onStart: () => void; onShowComplete: () => void }) {
  const { discoveredCount, totalCount, isComplete } = useProgress()

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <ScreenHeader numeral="①" label="冒険の書" tone="purple" title="旅のしおりアプリ" subtitle="旅全体の概要を見る" />

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none px-4 py-5 bg-wood-950">
        <div className="max-w-md mx-auto">
          <WoodPanel className="px-5 pt-6 pb-6">
            <div className="flex justify-center mb-2">
              <TravelersArt className="w-36 h-36 animate-float" />
            </div>

            <h2 className="text-center font-jp font-black text-3xl text-adventure-red-dark leading-tight drop-shadow-[0_2px_0_rgba(255,255,255,0.4)]">
              {TRIP.title}
            </h2>
            <p className="text-center font-jp text-ink-700 text-sm mt-1">{TRIP.subtitle}</p>

            <div className="mt-4 flex flex-col items-center gap-1 text-ink-900">
              <p className="font-bold text-base">{TRIP.dateRange}</p>
              <p className="text-sm">冒険者：{TRIP.travelers}</p>
            </div>

            <div className="mt-5 rounded-xl bg-paper/80 border-2 border-gold-600 px-4 py-3">
              <p className="font-jp font-bold text-ink-900 mb-2 text-base">今回の旅の予定</p>
              <ul className="space-y-1.5">
                {TRIP.summaryDays.map((d) => (
                  <li key={d.label} className="flex gap-2 text-sm text-ink-700">
                    <span className="shrink-0 font-bold text-adventure-red-dark">{d.label}</span>
                    <span>{d.route}</span>
                  </li>
                ))}
              </ul>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-ink-700 text-center">{TRIP.intro}</p>

            <div className="mt-3 text-center">
              <span className="inline-block text-xs font-bold text-gold-700 bg-gold-300/40 rounded-full px-3 py-1 border border-gold-600">
                発見済み {discoveredCount} / {totalCount}
              </span>
            </div>

            <div className="mt-5 space-y-2.5">
              {isComplete && (
                <SealButton tone="gold" fullWidth onClick={onShowComplete}>
                  🏆 冒険の記録を見る
                </SealButton>
              )}
              <SealButton tone="forest" fullWidth onClick={onStart}>
                {isComplete ? 'もう一度マップをみる' : '冒険をはじめる'}
              </SealButton>
            </div>
          </WoodPanel>
        </div>
      </div>
    </div>
  )
}
