import type { LocationIcon } from '../../data/locations'

interface Props {
  icon: LocationIcon
  className?: string
}

/** Original, simple flat-icon glyphs for each stop type. No third-party or copyrighted marks. */
export function LocationGlyph({ icon, className = 'w-6 h-6' }: Props) {
  switch (icon) {
    case 'station':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <rect x="3" y="8" width="18" height="11" rx="2" fill="currentColor" />
          <rect x="6" y="4" width="12" height="6" rx="1.5" fill="currentColor" opacity="0.8" />
          <circle cx="7.5" cy="15.5" r="1.6" fill="white" opacity="0.85" />
          <circle cx="16.5" cy="15.5" r="1.6" fill="white" opacity="0.85" />
          <rect x="10.5" y="11" width="3" height="2.4" fill="white" opacity="0.85" />
        </svg>
      )
    case 'castle':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M4 20V11l2-2 2 2V9l2-2 2 2V9l2-2 2 2v2l2-2 2 2v9H4Z" fill="currentColor" />
          <rect x="10" y="14" width="4" height="6" fill="white" opacity="0.8" />
        </svg>
      )
    case 'shrine':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M2 8.5 12 3l10 5.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <rect x="4.5" y="9" width="15" height="2" fill="currentColor" />
          <rect x="6.5" y="12" width="2" height="8" fill="currentColor" />
          <rect x="15.5" y="12" width="2" height="8" fill="currentColor" />
        </svg>
      )
    case 'food':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M4 11a8 8 0 0 0 16 0Z" fill="currentColor" />
          <rect x="3.5" y="11" width="17" height="2.4" rx="1.2" fill="currentColor" />
          <path d="M7 4c0 1.5 1 1.5 1 3M12 4c0 1.5 1 1.5 1 3M17 4c0 1.5 1 1.5 1 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.75" />
        </svg>
      )
    case 'onsen':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M4 15c1.2-1.4 1.2-2.6 0-4M9 15c1.2-1.4 1.2-2.6 0-4M14 15c1.2-1.4 1.2-2.6 0-4M19 15c1.2-1.4 1.2-2.6 0-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.75" />
          <path d="M3 18.5c1.5-2 2.9-2 4.5 0 1.5-2 2.9-2 4.5 0 1.5-2 2.9-2 4.5 0 1.5-2 2.9-2 4.5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
          <circle cx="12" cy="6" r="2" fill="currentColor" opacity="0.6" />
        </svg>
      )
    case 'street':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <circle cx="6.5" cy="8" r="3.2" fill="currentColor" />
          <rect x="5.6" y="11" width="1.8" height="8" fill="currentColor" />
          <circle cx="17.5" cy="10" r="3.2" fill="currentColor" opacity="0.85" />
          <rect x="16.6" y="13" width="1.8" height="6" fill="currentColor" opacity="0.85" />
        </svg>
      )
    case 'hotel':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M3 11 12 4l9 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <rect x="5" y="11" width="14" height="9" rx="1" fill="currentColor" />
          <rect x="10" y="14" width="4" height="6" fill="white" opacity="0.85" />
        </svg>
      )
    case 'home':
      return (
        <svg viewBox="0 0 24 24" className={className} fill="none">
          <path d="M3 11 12 4l9 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" fill="none" />
          <rect x="5.5" y="11" width="13" height="9" rx="1" fill="currentColor" />
          <rect x="10.5" y="15" width="3" height="5" fill="white" opacity="0.85" />
        </svg>
      )
    default:
      return null
  }
}
