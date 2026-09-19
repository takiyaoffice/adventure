// 各素材で共有するピクセルアートのパーツ集
import { Canvas, mix, rng } from './pixel.mjs'

export const PAL = {
  skyTop: '#123a86',
  skyMid: '#2563c0',
  skyLow: '#5aa0e0',
  skyHorizon: '#a8d8f2',
  cloud: '#ffffff',
  cloudShade: '#bcd8f2',
  seaDeep: '#12408c',
  sea: '#1f62b8',
  seaLight: '#3d8ad8',
  seaFoam: '#b9e0f7',
  mountain: '#3a5a92',
  mountainLight: '#4f74ad',
  snow: '#d8e8fa',
  grass: '#4a9a3f',
  grassLight: '#63b44e',
  grassDark: '#357a33',
  forest: '#26602a',
  forestLight: '#39833a',
  trunk: '#5a3a1e',
  sand: '#ddc893',
  road: '#e0c87e',
  roadEdge: '#a8823c',
  wall: '#f2efe4',
  wallMid: '#d6cfbc',
  wallShade: '#a89f8a',
  roof: '#2f5fc0',
  roofLight: '#5286dd',
  roofDark: '#1c3d88',
  window: '#16264c',
  gold: '#f5c84e',
  red: '#d8423f',
  redDark: '#9c2a2c',
  outline: '#0d1528',
  night: '#150f2e',
  purple: '#5b3ea8',
  purpleLight: '#8a63d8',
  magenta: '#d45ec0',
}

/* ふわふわした雲 */
export function cloud(c, x, y, w, h, alpha = 1) {
  const r = rng(x * 71 + y * 31 + w)
  const blobs = []
  const n = Math.max(3, Math.round(w / 6))
  for (let i = 0; i < n; i++) {
    const bx = x + Math.round((i / (n - 1)) * (w - h)) + Math.round(h / 2)
    const by = y + Math.round(h / 2) - Math.round(r() * (h / 3))
    const br = Math.max(2, Math.round((h / 2) * (0.6 + r() * 0.5)))
    blobs.push([bx, by, br])
  }
  blobs.forEach(([bx, by, br]) => c.disc(bx, by, br, PAL.cloud, alpha))
  blobs.forEach(([bx, by, br]) => c.disc(bx, by + Math.max(1, br - 1), Math.max(1, br - 1), PAL.cloudShade, alpha * 0.9))
  blobs.forEach(([bx, by, br]) => c.disc(bx, by - 1, Math.max(1, br - 1), PAL.cloud, alpha))
  return c
}

/* 遠景の山（雪冠つき） */
export function mountain(c, cx, baseY, halfW, h, main = PAL.mountain, light = PAL.mountainLight, snow = PAL.snow) {
  for (let j = 0; j < h; j++) {
    const t = j / h
    const w = Math.round(halfW * t)
    const y = baseY - h + j
    c.rect(cx - w, y, w * 2 + 1, 1, main)
    if (w > 1) c.rect(cx - w, y, Math.max(1, Math.round(w * 0.7)), 1, light)
  }
  if (snow) {
    const sh = Math.max(2, Math.round(h * 0.28))
    for (let j = 0; j < sh; j++) {
      const t = j / h
      const w = Math.round(halfW * t)
      const y = baseY - h + j
      c.rect(cx - w, y, w * 2 + 1, 1, snow)
      if (j === sh - 1) {
        c.px(cx - w, y, snow)
        c.px(cx + w, y, snow)
        c.px(cx - w + 2, y + 1, snow)
        c.px(cx + w - 2, y + 1, snow)
      }
    }
  }
  return c
}

/* 針葉樹（RPG マップ定番のもこもこ木） */
export function tree(c, x, y, size = 3, dark = false) {
  const leaf = dark ? PAL.forest : PAL.forestLight
  const leafHi = dark ? PAL.forestLight : PAL.grassLight
  const leafLo = dark ? '#194a1f' : PAL.forest
  if (size <= 2) {
    c.rect(x, y, 3, 3, leaf)
    c.px(x, y, leafLo)
    c.px(x + 2, y, leafLo)
    c.px(x + 1, y - 1, leaf)
    c.px(x + 1, y + 3, PAL.trunk)
    c.px(x, y + 1, leafHi)
    return c
  }
  const w = size * 2 - 1
  for (let j = 0; j < size; j++) {
    const ww = Math.min(w, 1 + j * 2)
    c.rect(x + Math.floor((w - ww) / 2), y + j, ww, 1, leaf)
  }
  for (let j = 0; j < size; j++) {
    const ww = Math.min(w, 1 + j * 2)
    c.rect(x + Math.floor((w - ww) / 2), y + j, Math.max(1, Math.ceil(ww / 2)), 1, leafHi)
  }
  c.rect(x, y + size - 1, w, 1, leafLo)
  c.rect(x + Math.floor(w / 2), y + size, 1, Math.max(1, size - 2), PAL.trunk)
  return c
}

/* 広葉樹（丸い木） */
export function bush(c, cx, cy, r, base = PAL.forestLight) {
  c.disc(cx, cy, r, base)
  c.disc(cx, cy + 1, r - 1 > 0 ? r - 1 : 1, mix(base, '#000000', 0.25))
  c.disc(cx - 1, cy - 1, r - 1 > 0 ? r - 1 : 1, mix(base, '#ffffff', 0.18))
  return c
}

/* 塔（本体 + 三角屋根 + 旗） */
export function tower(c, cx, baseY, w, bodyH, roofH, opts = {}) {
  const wall = opts.wall ?? PAL.wall
  const roof = opts.roof ?? PAL.roof
  const flag = opts.flag ?? PAL.red
  const x0 = cx - Math.floor(w / 2)
  const topY = baseY - bodyH
  // 本体
  c.rect(x0, topY, w, bodyH, wall)
  c.rect(x0, topY, 1, bodyH, mix(wall, '#ffffff', 0.5))
  c.rect(x0 + w - 1, topY, 1, bodyH, PAL.wallShade)
  c.rect(x0, baseY - 1, w, 1, PAL.wallShade)
  // 窓
  if (w >= 5 && bodyH >= 6) {
    const wy = topY + 2
    c.rect(cx - 1, wy, 2, 3, PAL.window)
    c.px(cx - 1, wy, PAL.gold)
    if (bodyH >= 12) {
      c.rect(cx - 1, wy + 5, 2, 3, PAL.window)
      c.px(cx, wy + 5, PAL.gold)
    }
  } else if (bodyH >= 5) {
    c.rect(cx, topY + 2, 1, 2, PAL.window)
  }
  // 屋根
  const rw = w + 2
  for (let j = 0; j < roofH; j++) {
    const t = (j + 1) / roofH
    const ww = Math.max(1, Math.round(rw * t))
    const rx = cx - Math.floor(ww / 2)
    const y = topY - roofH + j
    c.rect(rx, y, ww, 1, roof)
    c.rect(rx, y, Math.max(1, Math.ceil(ww / 2)), 1, mix(roof, '#ffffff', 0.28))
    c.px(rx + ww - 1, y, mix(roof, '#000000', 0.3))
  }
  // 旗
  if (opts.flag !== false) {
    const py = topY - roofH
    c.rect(cx, py - 4, 1, 4, PAL.outline)
    c.rect(cx + 1, py - 4, 3, 2, flag)
    c.px(cx + 3, py - 3, mix(flag, '#000000', 0.3))
  }
  return c
}

/* 城壁（狭間つき） */
export function wallRun(c, x, y, w, h, wall = PAL.wall) {
  c.rect(x, y, w, h, wall)
  c.rect(x, y, w, 1, mix(wall, '#ffffff', 0.4))
  c.rect(x, y + h - 1, w, 1, PAL.wallShade)
  for (let i = 0; i < w; i += 3) c.rect(x + i, y - 2, 2, 2, wall)
  for (let i = 0; i < w; i += 3) c.rect(x + i, y - 2, 1, 1, mix(wall, '#ffffff', 0.4))
  return c
}

/* 和風の屋根（瑞鳳殿・松島の社殿用） */
export function japaneseRoof(c, cx, y, halfW, h, roof = '#2b3550', trim = PAL.gold) {
  for (let j = 0; j < h; j++) {
    const t = j / Math.max(1, h - 1)
    const w = Math.round(halfW * (0.25 + 0.75 * t))
    c.rect(cx - w, y + j, w * 2 + 1, 1, roof)
    c.rect(cx - w, y + j, Math.max(1, w), 1, mix(roof, '#ffffff', 0.22))
  }
  // 反り返った軒先
  c.rect(cx - halfW - 1, y + h - 1, halfW * 2 + 3, 1, trim)
  c.px(cx - halfW - 2, y + h - 2, trim)
  c.px(cx + halfW + 2, y + h - 2, trim)
  c.px(cx, y - 1, trim)
  return c
}

/* 海の波（白いダッシュ） */
export function waves(c, x, y, w, h, seed = 7, density = 0.09) {
  const r = rng(seed)
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (r() < density) {
        c.rect(x + i, y + j, 2, 1, PAL.seaFoam, 0.75)
        i += 4
      }
    }
  }
  return c
}

/* 草地のテクスチャ */
export function grassTexture(c, x, y, w, h, seed = 3) {
  const r = rng(seed)
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const v = r()
      if (v < 0.05) c.px(x + i, y + j, PAL.grassLight)
      else if (v < 0.09) c.px(x + i, y + j, PAL.grassDark)
    }
  }
  return c
}

export function sparkle(c, x, y, col = '#ffffff', alpha = 1) {
  c.px(x, y, col, alpha)
  c.px(x - 1, y, col, alpha * 0.6)
  c.px(x + 1, y, col, alpha * 0.6)
  c.px(x, y - 1, col, alpha * 0.6)
  c.px(x, y + 1, col, alpha * 0.6)
  return c
}

export { Canvas }
