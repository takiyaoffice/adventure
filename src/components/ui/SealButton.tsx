import type { ButtonHTMLAttributes } from 'react'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: 'forest' | 'gold' | 'red'
  fullWidth?: boolean
}

const TONE: Record<string, string> = {
  forest: 'bg-forest-600 hover:bg-forest-500 active:bg-forest-700 text-gold-300',
  gold: 'bg-gold-500 hover:bg-gold-400 active:bg-gold-600 text-wood-900',
  red: 'bg-adventure-red hover:bg-adventure-red active:bg-adventure-red-dark text-gold-300',
}

/** Big, thumb-friendly RPG-style button used for primary calls to action. */
export function SealButton({ tone = 'forest', fullWidth, className = '', children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`${fullWidth ? 'w-full' : ''} ${TONE[tone]} rounded-xl border-2 border-wood-900 ring-2 ring-gold-500/70 px-6 py-4 text-lg sm:text-xl font-jp font-bold tracking-wide shadow-[0_4px_0_rgba(0,0,0,0.45)] active:translate-y-[2px] active:shadow-[0_2px_0_rgba(0,0,0,0.45)] transition disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {children}
    </button>
  )
}
