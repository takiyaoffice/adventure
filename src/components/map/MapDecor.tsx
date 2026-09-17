export function MountainDecor({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.5">
      <path d="M0 14 L7 0 L11 6 L16 -4 L23 14 Z" fill="#3a5a6e" />
      <path d="M7 0 L9 4 L5 4Z" fill="#eef4f6" opacity="0.8" />
      <path d="M16 -4 L18 0 L14 0Z" fill="#eef4f6" opacity="0.8" />
    </g>
  )
}

export function TreeDecor({ x, y, scale = 1 }: { x: number; y: number; scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity="0.55">
      <rect x="-1.2" y="8" width="2.4" height="6" fill="#4a2f18" />
      <circle cx="0" cy="4" r="6.5" fill="#3f6a3a" />
      <circle cx="-4" cy="7" r="4.5" fill="#365c31" />
      <circle cx="4" cy="7" r="4.5" fill="#365c31" />
    </g>
  )
}

export function RiverDecor() {
  return (
    <path
      d="M8 8 C 20 25, 15 40, 30 55 S 45 75, 40 95"
      stroke="#3a5a78"
      strokeWidth="3.2"
      fill="none"
      opacity="0.35"
      strokeLinecap="round"
    />
  )
}
