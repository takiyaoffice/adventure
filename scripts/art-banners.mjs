// 各日のイメージイラスト（160x80 / 2:1）。
// スケジュール画面の見出し下に、切り抜きなしでそのまま並ぶ大きさ。
import { Canvas, mix, rng } from './pixel.mjs'
import { PAL, cloud, mountain, tree, bush, tower, wallRun, japaneseRoof, waves, grassTexture } from './art-parts.mjs'

export const BW = 160
export const BH = 80

/** 遠くを飛ぶ鳥 */
function birds(c, spots, col = '#20365e') {
  spots.forEach(([x, y]) => {
    c.px(x, y, col)
    c.px(x + 1, y - 1, col)
    c.px(x + 2, y, col)
    c.px(x + 3, y - 1, col)
    c.px(x + 4, y, col)
  })
  return c
}

/** ごつごつした岩肌の島。上に松が生える */
function rockyIsle(c, cx, waterY, halfW, height, seed, pines = 0) {
  const r = rng(seed)
  const rockTop = waterY - height
  for (let x = cx - halfW; x <= cx + halfW; x++) {
    const t = Math.abs(x - cx) / Math.max(1, halfW)
    const edge = Math.round(Math.pow(1 - t * t, 0.55) * height)
    const jag = Math.round((r() - 0.5) * Math.max(1, height * 0.18))
    const top = waterY - Math.max(1, edge + jag)
    c.rect(x, top, 1, waterY - top + 2, '#7b7160')
    c.rect(x, top, 1, 1, '#9e9380')
    if (x < cx) c.rect(x, top + 1, 1, Math.max(1, (waterY - top) >> 1), '#8d8270')
    else c.rect(x, top + 1, 1, Math.max(1, (waterY - top) >> 1), '#645b4c')
  }
  // 波打ち際の削れた影
  c.rect(cx - halfW, waterY - 1, halfW * 2 + 1, 2, '#4d4639')
  // 緑の冠
  const greenH = Math.max(2, Math.round(height * 0.45))
  for (let x = cx - halfW + 1; x <= cx + halfW - 1; x++) {
    const t = Math.abs(x - cx) / Math.max(1, halfW)
    const edge = Math.round(Math.pow(1 - t * t, 0.5) * height)
    const top = waterY - edge
    const h = Math.max(1, Math.round(greenH * (1 - t * 0.7)) + Math.round((r() - 0.5) * 2))
    c.rect(x, top - h + 1, 1, h, r() > 0.45 ? PAL.forest : PAL.forestLight)
    c.px(x, top - h + 1, r() > 0.5 ? PAL.grassLight : PAL.forestLight)
  }
  for (let i = 0; i < pines; i++) {
    const x = cx - halfW + 2 + Math.round(r() * (halfW * 2 - 5))
    const t = Math.abs(x - cx) / Math.max(1, halfW)
    const edge = Math.round(Math.pow(1 - t * t, 0.5) * height)
    const size = 3 + Math.round(r() * 1.4)
    tree(c, x - size + 1, waterY - edge - greenH - size + 1, size, r() > 0.5)
  }
  // 水面に落ちる影
  c.rect(cx - halfW, waterY + 2, halfW * 2 + 1, 1, PAL.seaDeep, 0.5)
  for (let x = cx - halfW; x <= cx + halfW; x += 2) c.px(x, waterY + 3, PAL.seaDeep, 0.3)
  return c
}

/* =========================================================
   DAY1 : 城のある丘と街道（仙台へ向かう旅のはじまり）
   ========================================================= */
export function bannerDay1() {
  const c = new Canvas(BW, BH)
  const r = rng(11)
  c.vgradient(0, 0, BW, 40, [[0, PAL.skyTop], [0.4, PAL.skyMid], [0.75, PAL.skyLow], [1, PAL.skyHorizon]])
  cloud(c, 4, 3, 30, 9)
  cloud(c, 60, 1, 34, 10)
  cloud(c, 112, 4, 30, 9)
  cloud(c, 38, 15, 22, 6, 0.8)
  cloud(c, 96, 18, 24, 6, 0.75)
  birds(c, [[28, 24], [42, 20], [120, 22]])
  mountain(c, 12, 42, 17, 16)
  mountain(c, 36, 42, 12, 11)
  mountain(c, 140, 42, 18, 15)
  mountain(c, 116, 42, 12, 10, mix(PAL.mountain, '#ffffff', 0.12), PAL.mountainLight, PAL.snow)
  c.dither(0, 38, BW, 4, PAL.skyHorizon, 2)
  // 海
  c.vgradient(0, 40, BW, 14, [[0, '#2a74c8'], [0.5, PAL.sea], [1, PAL.seaDeep]])
  c.hline(0, 40, BW, mix(PAL.seaFoam, PAL.sea, 0.4))
  waves(c, 0, 41, BW, 12, 5, 0.08)
  // 城のある岬
  c.disc(82, 58, 26, PAL.grassDark)
  c.disc(82, 56, 24, PAL.grass)
  c.disc(74, 54, 18, PAL.grassLight)
  c.rect(56, 56, 52, 6, PAL.grass)
  for (let x = 54; x < 112; x++) {
    const y = 56 - Math.round(Math.cos((Math.abs(x - 82) / 30) * 1.5) * 2)
    c.px(x, y, PAL.sand)
  }
  const cb = 56
  wallRun(c, 64, cb - 7, 36, 7)
  c.rect(80, cb - 6, 5, 6, PAL.window)
  tower(c, 68, cb - 6, 5, 9, 5, { flag: false })
  tower(c, 96, cb - 6, 5, 9, 5, { flag: false })
  tower(c, 82, cb - 7, 9, 16, 8)
  // 手前の丘
  const hill = (cy, amp, freq, phase, col) => {
    for (let x = 0; x < BW; x++) {
      const y = Math.round(cy + Math.sin(x * freq + phase) * amp)
      c.rect(x, y, 1, BH - y, col)
    }
  }
  c.rect(0, 52, BW, BH - 52, PAL.grass)
  hill(58, 2, 0.08, 0.4, PAL.grass)
  hill(66, 3, 0.07, 2.2, PAL.grassDark)
  hill(74, 2, 0.1, 4.0, PAL.forest)
  grassTexture(c, 0, 56, BW, BH - 56, 21)
  // 街道
  const road = [[82, 55], [76, 59], [68, 63], [74, 67], [86, 70], [80, 74], [64, 77], [54, 80]]
  c.path(road, PAL.roadEdge, 5)
  c.path(road, PAL.road, 3)
  const onRoad = (x, y) => {
    const p = c.get(x, y)
    return p[0] > 150 && p[1] > 110 && p[2] < 150 && p[1] < 215
  }
  const plant = (y0, y1, size, dark, count) => {
    for (let i = 0; i < count * 12 && count > 0; i++) {
      const x = Math.round(r() * (BW - 6))
      const y = y0 + Math.round(r() * (y1 - y0))
      let clean = true
      for (let dy = -1; dy <= size + 1 && clean; dy++) {
        for (let dx = -1; dx <= size * 2; dx++) if (onRoad(x + dx, y + dy)) { clean = false; break }
      }
      if (clean) { tree(c, x, y, size, dark); count-- }
    }
  }
  plant(55, 62, 3, true, 46)
  plant(59, 68, 3, false, 38)
  plant(64, 73, 4, true, 34)
  plant(70, 77, 5, false, 24)
  for (let i = 0; i < 60; i++) {
    const bx = Math.round(r() * BW)
    const by = 56 + Math.round(r() * 23)
    if (onRoad(bx, by)) continue
    bush(c, bx, by, 1 + Math.round(r() * 1.8), r() > 0.5 ? PAL.forest : PAL.forestLight)
  }
  for (let i = 0; i < 120; i++) {
    const gx = Math.round(r() * BW)
    const gy = 56 + Math.round(r() * 23)
    if (onRoad(gx, gy)) continue
    c.px(gx, gy, PAL.grassDark)
    c.px(gx + 1, gy - 1, PAL.grassLight)
  }
  return c
}

/* =========================================================
   DAY2 : ライブ会場
   ========================================================= */
export function bannerDay2() {
  const c = new Canvas(BW, BH)
  const r = rng(77)
  c.vgradient(0, 0, BW, BH, [[0, '#150a33'], [0.45, '#2d1560'], [1, '#0a0620']])
  for (let i = 0; i < 150; i++) {
    c.px(Math.round(r() * BW), Math.round(r() * 52), r() > 0.62 ? PAL.magenta : '#ffffff', 0.35 + r() * 0.65)
  }
  const beam = (topX, botX, col, base) => {
    for (let y = 0; y < 52; y++) {
      const t = y / 52
      const cx = topX + (botX - topX) * t
      const w = 2 + Math.round(t * 20)
      c.rect(Math.round(cx - w / 2), y, w, 1, col, base + t * 0.1)
    }
  }
  beam(26, 56, '#ffffff', 0.03)
  beam(134, 104, PAL.magenta, 0.03)
  beam(80, 80, '#a9d8ff', 0.035)
  beam(54, 36, PAL.gold, 0.022)
  beam(106, 124, '#8a63d8', 0.022)
  c.vgradient(0, 44, BW, 12, [[0, '#241354'], [1, '#150b32']])
  c.rect(0, 44, BW, 1, '#331f6b')
  c.disc(80, 46, 26, '#ffffff', 0.08)
  c.disc(80, 46, 16, '#fff3c4', 0.13)
  // アーティスト
  c.rect(77, 36, 6, 16, '#ffffff')
  c.rect(78, 36, 4, 1, '#e6ecff')
  c.rect(77, 31, 6, 5, '#ffe9b0')
  c.rect(77, 30, 6, 2, '#6b4320')
  c.rect(72, 38, 5, 3, '#ffffff')
  c.rect(83, 32, 3, 6, '#ffffff')
  c.rect(85, 28, 2, 5, '#ffffff')
  c.disc(86, 27, 2, '#fff3c4')
  c.rect(77, 52, 2, 4, '#20264a')
  c.rect(81, 52, 2, 4, '#20264a')
  // ステージ床
  c.vgradient(0, 56, BW, 6, [[0, '#3a2470'], [1, '#1a0f3a']])
  c.rect(0, 56, BW, 1, '#5b3ea8')
  for (let x = 2; x < BW; x += 9) c.rect(x, 57, 4, 1, '#472c85')
  // 客席
  for (let i = 0; i < 33; i++) {
    const x = i * 5 + (i % 2) * 2 - 2
    const h = 11 + ((i * 7) % 7)
    const top = BH - h
    c.rect(x, top + 3, 4, h, '#070418')
    c.disc(x + 1, top + 1, 2, '#070418')
    if (i % 2 === 0) {
      c.rect(x - 1, top - 3, 1, 6, '#070418')
      c.px(x - 1, top - 4, i % 4 === 0 ? PAL.magenta : '#a9d8ff', 0.95)
    }
    if (i % 3 === 0) {
      c.rect(x + 4, top - 1, 1, 5, '#070418')
      c.px(x + 4, top - 2, PAL.gold, 0.9)
    }
  }
  for (let i = 0; i < 40; i++) {
    c.px(Math.round(r() * BW), Math.round(r() * 58), [PAL.gold, PAL.magenta, '#a9d8ff', '#ffffff'][Math.floor(r() * 4)], 0.9)
  }
  return c
}

/* =========================================================
   DAY3 : 松島湾（岩の島・五大堂・遊覧船）
   ========================================================= */
export function bannerDay3() {
  const c = new Canvas(BW, BH)
  const r = rng(303)
  const waterY = 30
  // 空
  c.vgradient(0, 0, BW, waterY, [[0, '#1b58b2'], [0.5, '#5ba3e2'], [1, '#bfe3f7']])
  cloud(c, 3, 3, 30, 9)
  cloud(c, 48, 1, 26, 8)
  cloud(c, 118, 2, 34, 10)
  cloud(c, 88, 13, 22, 6, 0.8)
  cloud(c, 24, 16, 20, 5, 0.7)
  birds(c, [[38, 15], [50, 12], [64, 17]])
  // 海
  c.vgradient(0, waterY, BW, BH - waterY, [[0, '#59a4e0'], [0.35, '#2f79cc'], [0.7, PAL.sea], [1, '#0e3a82']])
  c.hline(0, waterY, BW, PAL.seaFoam)
  c.hline(0, waterY + 1, BW, mix(PAL.seaFoam, PAL.sea, 0.5))
  waves(c, 0, waterY + 2, BW, BH - waterY - 2, 13, 0.07)
  // 遠景の島
  rockyIsle(c, 14, waterY + 4, 9, 7, 91, 1)
  rockyIsle(c, 46, waterY + 3, 7, 6, 12, 1)
  rockyIsle(c, 70, waterY + 5, 5, 4, 55, 0)
  rockyIsle(c, 100, waterY + 4, 8, 6, 33, 1)
  rockyIsle(c, 148, waterY + 6, 10, 8, 71, 2)
  // 中景の島
  rockyIsle(c, 30, waterY + 14, 12, 10, 24, 2)
  rockyIsle(c, 64, waterY + 20, 10, 9, 66, 2)
  rockyIsle(c, 6, waterY + 28, 11, 9, 88, 2)
  // 主役の島（右）: 崖の上に五大堂、赤い橋でつながる
  const mainCx = 122
  const mainY = waterY + 22
  rockyIsle(c, mainCx, mainY, 26, 20, 7, 0)
  // 崖の上の平らな台
  c.rect(mainCx - 14, mainY - 26, 28, 5, PAL.forest)
  c.rect(mainCx - 13, mainY - 27, 26, 2, PAL.forestLight)
  // 社殿
  const hx = mainCx + 2
  c.rect(hx - 6, mainY - 34, 12, 8, '#efe9db')
  c.rect(hx - 6, mainY - 34, 1, 8, '#ffffff')
  c.rect(hx + 5, mainY - 34, 1, 8, PAL.wallShade)
  c.rect(hx - 3, mainY - 31, 6, 5, '#2a1830')
  c.rect(hx - 2, mainY - 30, 4, 1, PAL.gold)
  japaneseRoof(c, hx, mainY - 42, 11, 8, '#3a4256', PAL.gold)
  japaneseRoof(c, hx, mainY - 47, 6, 5, '#2f3648', PAL.gold)
  // 島の松
  tree(c, mainCx - 22, mainY - 32, 5, true)
  tree(c, mainCx - 16, mainY - 36, 4, false)
  tree(c, mainCx + 14, mainY - 34, 5, false)
  tree(c, mainCx + 20, mainY - 30, 4, true)
  tree(c, mainCx - 10, mainY - 30, 3, true)
  // 赤い橋（小島から主役の島へ渡る）
  rockyIsle(c, 86, mainY - 2, 9, 9, 44, 1)
  const bridgeY = mainY - 10
  for (let x = 88; x < 104; x++) {
    const y = bridgeY - Math.round(Math.sin(((x - 88) / 16) * Math.PI) * 3)
    c.rect(x, y, 1, 2, PAL.red)
    c.px(x, y, '#ec6a5a')
    if ((x - 88) % 4 === 0) c.rect(x, y + 2, 1, 6, PAL.redDark)
  }
  c.rect(87, bridgeY - 1, 2, 3, PAL.redDark)
  c.rect(103, bridgeY - 4, 2, 5, PAL.redDark)
  // 鳥居（手前の島の渚に立つ）
  rockyIsle(c, 34, 74, 16, 9, 19, 2)
  c.rect(28, 58, 2, 12, PAL.red)
  c.rect(40, 58, 2, 12, PAL.red)
  c.rect(26, 55, 18, 2, PAL.red)
  c.rect(27, 59, 16, 2, PAL.red)
  c.rect(26, 54, 18, 1, PAL.redDark)
  // 遊覧船
  const sx = 62
  const sy = 66
  c.rect(sx, sy, 24, 4, '#f2eee2')
  c.rect(sx + 1, sy - 3, 18, 3, '#ffffff')
  c.rect(sx + 1, sy - 3, 18, 1, '#dfe6f0')
  for (let i = 0; i < 6; i++) c.rect(sx + 3 + i * 3, sy - 2, 2, 1, '#2a4e8c')
  c.rect(sx + 5, sy - 7, 8, 4, '#ffffff')
  c.rect(sx + 6, sy - 6, 6, 2, '#2a4e8c')
  c.rect(sx + 10, sy - 11, 1, 4, '#c8ccd6')
  c.rect(sx, sy + 4, 24, 2, '#1e3a6e')
  c.rect(sx + 2, sy + 6, 20, 1, '#12275a')
  c.rect(sx - 2, sy + 4, 28, 1, PAL.seaFoam, 0.8)
  // 手前の波
  for (let i = 0; i < 46; i++) {
    const x = Math.round(r() * BW)
    const y = 62 + Math.round(r() * 18)
    c.rect(x, y, 3 + Math.round(r() * 4), 1, PAL.seaFoam, 0.7)
  }
  return c
}
