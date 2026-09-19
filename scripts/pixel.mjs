// 依存ライブラリなしのピクセルアート描画 & PNG 書き出しユーティリティ。
// すべての素材は「ドット単位」で描き、アプリ側で image-rendering: pixelated 拡大する。
import zlib from 'node:zlib'

/* ---------------- PNG encoder ---------------- */
const CRC_TABLE = (() => {
  const t = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    t[n] = c
  }
  return t
})()

function crc32(buf) {
  let c = -1
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ -1) >>> 0
}

function chunk(type, data) {
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length, 0)
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data])
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body), 0)
  return Buffer.concat([len, body, crc])
}

export function encodePNG(width, height, rgba) {
  const stride = width * 4
  const raw = Buffer.alloc((stride + 1) * height)
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0 // filter: none
    Buffer.from(rgba.buffer, rgba.byteOffset + y * stride, stride).copy(raw, y * (stride + 1) + 1)
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(width, 0)
  ihdr.writeUInt32BE(height, 4)
  ihdr[8] = 8 // bit depth
  ihdr[9] = 6 // color type RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, { level: 9 })),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

/* ---------------- color ---------------- */
const colorCache = new Map()
export function color(css) {
  if (Array.isArray(css)) return css
  let c = colorCache.get(css)
  if (c) return c
  let s = css.replace('#', '')
  if (s.length === 3) s = s.split('').map((ch) => ch + ch).join('')
  if (s.length === 6) s += 'ff'
  c = [
    parseInt(s.slice(0, 2), 16),
    parseInt(s.slice(2, 4), 16),
    parseInt(s.slice(4, 6), 16),
    parseInt(s.slice(6, 8), 16),
  ]
  colorCache.set(css, c)
  return c
}

/** 2色を t(0..1) で混ぜる */
export function mix(a, b, t) {
  const ca = color(a)
  const cb = color(b)
  return [
    Math.round(ca[0] + (cb[0] - ca[0]) * t),
    Math.round(ca[1] + (cb[1] - ca[1]) * t),
    Math.round(ca[2] + (cb[2] - ca[2]) * t),
    Math.round(ca[3] + (cb[3] - ca[3]) * t),
  ]
}

export function shade(css, amount) {
  return amount >= 0 ? mix(css, '#ffffff', amount) : mix(css, '#000000', -amount)
}

/* ---------------- deterministic RNG ---------------- */
export function rng(seed) {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/* ---------------- canvas ---------------- */
export class Canvas {
  constructor(w, h) {
    this.w = w
    this.h = h
    this.d = new Uint8Array(w * h * 4)
  }

  px(x, y, c, alpha = 1) {
    x = x | 0
    y = y | 0
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return
    const col = color(c)
    const a = (col[3] / 255) * alpha
    if (a <= 0) return
    const i = (y * this.w + x) * 4
    const d = this.d
    if (a >= 1) {
      d[i] = col[0]
      d[i + 1] = col[1]
      d[i + 2] = col[2]
      d[i + 3] = 255
      return
    }
    const da = d[i + 3] / 255
    const out = a + da * (1 - a)
    d[i] = Math.round((col[0] * a + d[i] * da * (1 - a)) / out)
    d[i + 1] = Math.round((col[1] * a + d[i + 1] * da * (1 - a)) / out)
    d[i + 2] = Math.round((col[2] * a + d[i + 2] * da * (1 - a)) / out)
    d[i + 3] = Math.round(out * 255)
  }

  get(x, y) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return [0, 0, 0, 0]
    const i = (y * this.w + x) * 4
    return [this.d[i], this.d[i + 1], this.d[i + 2], this.d[i + 3]]
  }

  fill(c) {
    this.rect(0, 0, this.w, this.h, c)
    return this
  }

  rect(x, y, w, h, c, alpha = 1) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.px(x + i, y + j, c, alpha)
    return this
  }

  /** 枠のみ */
  frame(x, y, w, h, c) {
    this.rect(x, y, w, 1, c)
    this.rect(x, y + h - 1, w, 1, c)
    this.rect(x, y, 1, h, c)
    this.rect(x + w - 1, y, 1, h, c)
    return this
  }

  hline(x, y, w, c, alpha = 1) {
    this.rect(x, y, w, 1, c, alpha)
    return this
  }

  vline(x, y, h, c, alpha = 1) {
    this.rect(x, y, 1, h, c, alpha)
    return this
  }

  line(x0, y0, x1, y1, c, thickness = 1) {
    x0 |= 0; y0 |= 0; x1 |= 0; y1 |= 0
    const dx = Math.abs(x1 - x0)
    const dy = -Math.abs(y1 - y0)
    const sx = x0 < x1 ? 1 : -1
    const sy = y0 < y1 ? 1 : -1
    let err = dx + dy
    const r = Math.floor(thickness / 2)
    for (;;) {
      if (thickness <= 1) this.px(x0, y0, c)
      else this.rect(x0 - r, y0 - r, thickness, thickness, c)
      if (x0 === x1 && y0 === y1) break
      const e2 = 2 * err
      if (e2 >= dy) { err += dy; x0 += sx }
      if (e2 <= dx) { err += dx; y0 += sy }
    }
    return this
  }

  /** 制御点を滑らかに通る折れ線（道や川に使う） */
  path(points, c, thickness = 1) {
    for (let i = 0; i < points.length - 1; i++) {
      const [x0, y0] = points[i]
      const [x1, y1] = points[i + 1]
      this.line(x0, y0, x1, y1, c, thickness)
    }
    return this
  }

  disc(cx, cy, r, c, alpha = 1) {
    for (let y = -r; y <= r; y++) {
      for (let x = -r; x <= r; x++) {
        if (x * x + y * y <= r * r + r * 0.5) this.px(cx + x, cy + y, c, alpha)
      }
    }
    return this
  }

  ring(cx, cy, r, c) {
    for (let a = 0; a < 360; a += 2) {
      const rad = (a * Math.PI) / 180
      this.px(Math.round(cx + Math.cos(rad) * r), Math.round(cy + Math.sin(rad) * r), c)
    }
    return this
  }

  /** チェッカー状ディザ。step=2 で市松、3 でまばら */
  dither(x, y, w, h, c, step = 2, offset = 0) {
    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        if ((x + i + y + j + offset) % step === 0) this.px(x + i, y + j, c)
      }
    }
    return this
  }

  /** 縦方向グラデーション（バンド＋ディザで 8bit 風に） */
  vgradient(x, y, w, h, stops) {
    for (let j = 0; j < h; j++) {
      const t = h <= 1 ? 0 : j / (h - 1)
      let c = stops[0][1]
      for (let s = 0; s < stops.length - 1; s++) {
        const [p0, c0] = stops[s]
        const [p1, c1] = stops[s + 1]
        if (t >= p0 && t <= p1) {
          const lt = (t - p0) / Math.max(0.0001, p1 - p0)
          const q = Math.round(lt * 4) / 4 // 段差を作ってレトロ感を出す
          c = mix(c0, c1, q)
          break
        }
        if (t > p1) c = c1
      }
      this.rect(x, y + j, w, 1, c)
    }
    return this
  }

  /** 別キャンバスを合成 */
  blit(src, dx, dy, alpha = 1) {
    for (let y = 0; y < src.h; y++) {
      for (let x = 0; x < src.w; x++) {
        const p = src.get(x, y)
        if (p[3] === 0) continue
        this.px(dx + x, dy + y, p, (p[3] / 255) * alpha)
      }
    }
    return this
  }

  /** 文字列グリッドから描画。key -> color のマップを渡す。'.' は透明 */
  stamp(x, y, rows, palette) {
    rows.forEach((row, j) => {
      for (let i = 0; i < row.length; i++) {
        const key = row[i]
        if (key === '.' || key === ' ') continue
        const c = palette[key]
        if (c) this.px(x + i, y + j, c)
      }
    })
    return this
  }

  toPNG() {
    return encodePNG(this.w, this.h, this.d)
  }
}
