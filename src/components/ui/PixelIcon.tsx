import { GLYPHS } from './pixel-glyphs'
import type { GlyphName } from './pixel-glyphs'

interface Props {
  name: GlyphName
  /** 表示サイズ（デザイン基準 px）。端末幅に合わせて拡大される */
  size?: number
  className?: string
}

/** 同じ行の連続した塗りを1本の矩形にまとめる */
function rowRuns(rows: readonly string[]) {
  const runs: { x: number; y: number; w: number }[] = []
  rows.forEach((row, y) => {
    let start = -1
    for (let x = 0; x <= row.length; x++) {
      const on = row[x] === '#'
      if (on && start < 0) start = x
      if (!on && start >= 0) {
        runs.push({ x: start, y, w: x - start })
        start = -1
      }
    }
  })
  return runs
}

const CACHE = new Map<GlyphName, { x: number; y: number; w: number }[]>()

export function PixelIcon({ name, size = 16, className }: Props) {
  let runs = CACHE.get(name)
  if (!runs) {
    runs = rowRuns(GLYPHS[name])
    CACHE.set(name, runs)
  }
  const px = `calc(var(--u) * ${size})`
  return (
    <svg
      className={className}
      viewBox="0 0 16 16"
      style={{ width: px, height: px, display: 'block', flex: 'none' }}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {runs.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill="currentColor" />
      ))}
    </svg>
  )
}
