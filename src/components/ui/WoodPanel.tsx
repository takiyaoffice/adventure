import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
  tone?: 'paper' | 'night'
}

/** A parchment card in a dark wood + gold frame, with small corner gems — the app's signature card style. */
export function WoodPanel({ children, className = '', tone = 'paper' }: Props) {
  return (
    <div
      className={`relative rounded-2xl wood-frame ${tone === 'paper' ? 'bg-parchment-texture' : 'bg-night-map'} ${className}`}
    >
      <CornerGem className="top-1.5 left-1.5" />
      <CornerGem className="top-1.5 right-1.5" />
      <CornerGem className="bottom-1.5 left-1.5" />
      <CornerGem className="bottom-1.5 right-1.5" />
      {children}
    </div>
  )
}

function CornerGem({ className }: { className: string }) {
  return (
    <span
      className={`absolute z-10 w-2.5 h-2.5 rotate-45 bg-gold-400 shadow-[0_0_0_1px_var(--color-wood-900)] ${className}`}
    />
  )
}
