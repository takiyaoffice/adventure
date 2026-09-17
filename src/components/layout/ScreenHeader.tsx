import type { ReactNode } from 'react'
import { Ribbon } from '../ui/Ribbon'

interface Props {
  numeral: string
  label: string
  tone: 'purple' | 'green' | 'blue' | 'orange'
  title: string
  subtitle?: string
  right?: ReactNode
}

export function ScreenHeader({ numeral, label, tone, title, subtitle, right }: Props) {
  return (
    <header className="shrink-0 bg-wood-900 px-4 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 border-b-4 border-gold-600">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div>
          <Ribbon tone={tone}>
            {numeral} {label}
          </Ribbon>
          <h1 className="mt-1.5 font-jp font-black text-xl sm:text-2xl text-gold-300 text-outline-gold" style={{ WebkitTextStroke: '0.6px #1c120a' }}>
            {title}
          </h1>
          {subtitle && <p className="text-parchment-dark text-xs sm:text-sm mt-0.5">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  )
}
