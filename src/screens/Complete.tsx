import { WoodPanel } from '../components/ui/WoodPanel'
import { SealButton } from '../components/ui/SealButton'
import { TravelersArt } from '../components/icons/TravelersArt'
import { TRIP } from '../data/trip'
import { useProgress } from '../state/ProgressContext'

export function Complete({ onClose }: { onClose: () => void }) {
  const { resetAll } = useProgress()

  return (
    <div className="fixed inset-0 z-40 bg-wood-950 flex flex-col overflow-y-auto scrollbar-none px-4 py-8">
      <div className="max-w-md w-full mx-auto flex-1 flex flex-col justify-center gap-5">
        <WoodPanel tone="night" className="px-6 py-8 text-center animate-sparkle-in">
          <p className="text-gold-400 font-en font-bold tracking-[0.3em] text-xs">ADVENTURE COMPLETE!</p>
          <div className="flex justify-center my-4">
            <TravelersArt className="w-32 h-32 animate-float" />
          </div>
          <h1 className="font-jp font-black text-2xl text-gold-200 leading-snug">
            {TRIP.title}
            <br />
            冒険、完了。
          </h1>
          <p className="text-parchment-dark text-sm mt-3 leading-relaxed">
            二人の旅の記録が、ワールドマップに刻まれました。
            <br />
            おつかれさまでした。
          </p>
        </WoodPanel>

        <WoodPanel className="px-6 py-6 text-center">
          <p className="font-en font-bold text-adventure-red-dark tracking-[0.25em] text-xs">NEXT ADVENTURE</p>
          <p className="font-jp font-black text-xl text-ink-900 mt-2">COMING SOON…</p>
          <p className="font-jp text-3xl mt-2 text-gold-700 tracking-widest">？？？</p>
          <p className="text-ink-700 text-xs mt-3">次の冒険は、まだ見ぬ場所へ。お楽しみに。</p>
        </WoodPanel>

        <SealButton tone="gold" fullWidth onClick={onClose}>
          冒険の書にもどる
        </SealButton>

        <button
          onClick={() => {
            if (confirm('旅の記録をリセットしますか？（動作確認用）')) {
              resetAll()
              onClose()
            }
          }}
          className="text-parchment-dark/60 text-xs underline underline-offset-2 mx-auto"
        >
          記録をリセットする（確認用）
        </button>
      </div>
    </div>
  )
}
