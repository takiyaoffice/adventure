import type { ReactNode } from 'react'

const TONE_CLASSES: Record<string, string> = {
  purple: 'bg-mission-purple',
  green: 'bg-mission-green',
  blue: 'bg-mission-blue',
  orange: 'bg-mission-orange',
  red: 'bg-adventure-red',
  gold: 'bg-gold-500',
}

interface Props {
  children: ReactNode
  tone?: keyof typeof TONE_CLASSES
  className?: string
}

/** Small rounded banner label, matching the numbered step banners in the reference design. */
export function Ribbon({ children, tone = 'red', className = '' }: Props) {
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-4 py-1.5 text-white font-jp font-bold text-sm sm:text-base shadow-[0_2px_0_rgba(0,0,0,0.3)] ring-2 ring-black/15 ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
