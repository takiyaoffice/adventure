import type { TimelineIcon } from '../../data/itinerary'

export function TimelineGlyph({ icon, className = 'w-5 h-5' }: { icon: TimelineIcon; className?: string }) {
  switch (icon) {
    case 'move':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M4 17h13l-3-3.5M17 7H4l3 3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      )
    case 'sight':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M12 3 2 20h20Z" fill="currentColor" />
          <circle cx="12" cy="12" r="2" fill="white" opacity="0.7" />
        </svg>
      )
    case 'meal':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M4 11a8 8 0 0 0 16 0Z" fill="currentColor" />
          <rect x="3.5" y="11" width="17" height="2.4" rx="1.2" fill="currentColor" />
        </svg>
      )
    case 'onsen':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M3 18.5c1.5-2 2.9-2 4.5 0 1.5-2 2.9-2 4.5 0 1.5-2 2.9-2 4.5 0 1.5-2 2.9-2 4.5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="12" cy="8" r="3" fill="currentColor" opacity="0.7" />
        </svg>
      )
    case 'stay':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M3 11 12 4l9 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <rect x="5" y="11" width="14" height="9" rx="1" fill="currentColor" />
        </svg>
      )
    case 'home':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M3 11 12 4l9 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          <rect x="5.5" y="11" width="13" height="9" rx="1" fill="currentColor" />
        </svg>
      )
    case 'book':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect x="4" y="4" width="16" height="16" rx="2" fill="currentColor" />
        </svg>
      )
  }
}
