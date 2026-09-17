import type { Location } from '../../data/locations'
import { LocationGlyph } from '../icons/LocationGlyph'

interface Props {
  location: Location
  discovered: boolean
  onClick: () => void
}

export function MapPin({ location, discovered, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      style={{ left: `${location.x}%`, top: `${location.y}%` }}
      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group"
    >
      <span
        className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 transition ${
          discovered
            ? 'bg-gold-400 border-gold-300 text-wood-900 animate-shimmer'
            : 'bg-night-700/90 border-night-700 text-night-800/70'
        }`}
      >
        {discovered ? (
          <LocationGlyph icon={location.icon} className="w-6 h-6" />
        ) : (
          <span className="text-lg font-black text-parchment-dark/40">？</span>
        )}
      </span>
      <span
        className={`px-2 py-0.5 rounded-md text-[11px] font-jp font-bold whitespace-nowrap shadow ${
          discovered ? 'bg-gold-300 text-wood-900' : 'bg-night-800/80 text-parchment-dark/50'
        }`}
      >
        {discovered ? location.name : '未発見'}
      </span>
    </button>
  )
}
