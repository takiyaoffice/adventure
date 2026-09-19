// PWA / ホーム画面用アイコンを生成する。
//   npm run icons
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Canvas, encodePNG, mix } from './pixel.mjs'

const PUBLIC = path.resolve(fileURLToPath(new URL('../public', import.meta.url)))
fs.mkdirSync(path.join(PUBLIC, 'icons'), { recursive: true })

const BASE = 32

/** 32x32 の元絵。inset を大きくすると maskable の安全領域に収まる */
function drawIcon({ framed }) {
  const c = new Canvas(BASE, BASE)
  // 背景（夜明けの空）
  c.vgradient(0, 0, BASE, BASE, [
    [0, '#0a1330'],
    [0.5, '#163a80'],
    [1, '#2a6bc0'],
  ])
  // 星
  ;[[4, 4], [27, 6], [9, 9], [24, 15], [6, 18]].forEach(([x, y], i) => c.px(x, y, '#ffffff', 0.5 + i * 0.1))
  // 遠景の山と地面
  for (let j = 0; j < 5; j++) c.rect(1 + j, 25 - j, 9 - j * 2, 1, '#1d3f78')
  for (let j = 0; j < 6; j++) c.rect(22 + j, 26 - j, 10 - j * 2, 1, '#1d3f78')
  c.rect(0, 26, BASE, 6, '#14301f')
  c.rect(0, 26, BASE, 1, '#2f6b3c')
  // 剣
  const cx = 16
  c.rect(cx - 2, 6, 4, 13, '#f2f6ff')
  c.rect(cx - 2, 6, 1, 13, '#ffffff')
  c.rect(cx + 1, 6, 1, 13, '#b9c6e0')
  c.rect(cx - 1, 4, 2, 2, '#ffffff')
  // つば
  c.rect(cx - 7, 19, 14, 2, '#f5c84e')
  c.rect(cx - 7, 19, 14, 1, '#ffe49a')
  c.px(cx - 8, 20, '#c99a25')
  c.px(cx + 7, 20, '#c99a25')
  // 柄
  c.rect(cx - 1, 21, 2, 5, '#8a5a2a')
  c.rect(cx - 2, 26, 4, 2, '#f5c84e')
  // 光
  c.disc(cx, 12, 9, '#ffffff', 0.06)
  c.disc(cx, 12, 5, '#ffffff', 0.08)
  if (framed) {
    c.frame(0, 0, BASE, BASE, '#ffffff')
    c.frame(1, 1, BASE - 2, BASE - 2, mix('#f5c84e', '#000000', 0.15))
  }
  return c
}

/** 最近傍で整数倍に拡大する */
function upscale(src, factor) {
  const w = src.w * factor
  const h = src.h * factor
  const out = new Uint8Array(w * h * 4)
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const p = src.get(Math.floor(x / factor), Math.floor(y / factor))
      const i = (y * w + x) * 4
      out[i] = p[0]
      out[i + 1] = p[1]
      out[i + 2] = p[2]
      out[i + 3] = p[3]
    }
  }
  return encodePNG(w, h, out)
}

/** maskable 用: 中央 80% に収まるよう余白を足す */
function withPadding(src, pad) {
  const c = new Canvas(src.w + pad * 2, src.h + pad * 2)
  c.fill('#0a1330')
  c.blit(src, pad, pad)
  return c
}

const icon = drawIcon({ framed: true })
const plain = drawIcon({ framed: false })

fs.writeFileSync(path.join(PUBLIC, 'icons', 'icon-192.png'), upscale(icon, 6))
fs.writeFileSync(path.join(PUBLIC, 'icons', 'icon-512.png'), upscale(icon, 16))
fs.writeFileSync(path.join(PUBLIC, 'icons', 'icon-maskable-512.png'), upscale(withPadding(plain, 4), 16))
fs.writeFileSync(path.join(PUBLIC, 'apple-touch-icon.png'), upscale(icon, 6))

// favicon は SVG で用意する（同色の連続ドットを1本の矩形にまとめる）
const rects = []
for (let y = 0; y < icon.h; y++) {
  let runStart = 0
  let runColor = null
  const flush = (endX) => {
    if (runColor === null || endX <= runStart) return
    rects.push(`<rect x="${runStart}" y="${y}" width="${endX - runStart}" height="1" fill="${runColor}"/>`)
  }
  for (let x = 0; x <= icon.w; x++) {
    const p = x < icon.w ? icon.get(x, y) : [0, 0, 0, 0]
    const key = p[3] === 0 ? null : `#${[p[0], p[1], p[2]].map((v) => v.toString(16).padStart(2, '0')).join('')}`
    if (key !== runColor) {
      flush(x)
      runStart = x
      runColor = key
    }
  }
}
fs.writeFileSync(
  path.join(PUBLIC, 'favicon.svg'),
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BASE} ${BASE}" shape-rendering="crispEdges">${rects.join('')}</svg>\n`,
)

console.log('アイコンを生成しました: icons/icon-192.png, icons/icon-512.png, icons/icon-maskable-512.png, apple-touch-icon.png, favicon.svg')
