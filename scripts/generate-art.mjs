// アプリで使うピクセルアート素材を生成する。
//   npm run art
// 出力先: src/assets/art/*.png （生成物もコミットするのでビルド時には不要）
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Canvas, mix, rng } from './pixel.mjs'
import { PAL, cloud, mountain, tree, bush, tower, wallRun, japaneseRoof, waves, grassTexture, sparkle } from './art-parts.mjs'

const OUT = path.resolve(fileURLToPath(new URL('../src/assets/art', import.meta.url)))
fs.mkdirSync(OUT, { recursive: true })
const written = []
function save(name, canvas) {
  const file = path.join(OUT, `${name}.png`)
  fs.writeFileSync(file, canvas.toPNG())
  written.push(`${name}.png (${canvas.w}x${canvas.h})`)
  return canvas
}

/* =========================================================
   1. ホームのキービジュアル : 仙台を思わせるファンタジー風景
   ========================================================= */
function keyVisual() {
  const W = 160
  const H = 248
  const c = new Canvas(W, H)

  // 上部はキャッチコピーを載せる領域なので、雲や城が入り込まないよう空を広く取る
  const SKY_END = 118
  const SEA_TOP = 120
  const LAND_TOP = 160
  const CASTLE_BASE = 166

  // --- 空 ---
  c.vgradient(0, 0, W, SKY_END + 8, [
    [0, PAL.skyTop],
    [0.34, PAL.skyMid],
    [0.68, PAL.skyLow],
    [1, PAL.skyHorizon],
  ])
  // --- 雲（文字にかからないよう上部のみ） ---
  cloud(c, 2, 6, 42, 12)
  cloud(c, 106, 4, 50, 13)
  cloud(c, 54, 28, 32, 9, 0.9)
  cloud(c, 0, 44, 26, 7, 0.75)
  cloud(c, 126, 42, 32, 8, 0.8)

  // 鳥
  const bird = (x, y) => {
    c.px(x, y, '#20365e'); c.px(x + 1, y - 1, '#20365e'); c.px(x + 2, y, '#20365e')
    c.px(x + 3, y - 1, '#20365e'); c.px(x + 4, y, '#20365e')
  }
  bird(22, 68); bird(33, 63); bird(42, 70)

  // --- 遠景の山脈 ---
  mountain(c, 12, 124, 22, 22)
  mountain(c, 42, 124, 15, 15)
  mountain(c, 138, 124, 23, 20)
  mountain(c, 110, 124, 14, 12, mix(PAL.mountain, '#ffffff', 0.12), PAL.mountainLight, PAL.snow)
  c.dither(0, SKY_END, W, 6, PAL.skyHorizon, 2)

  // --- 海（仙台湾） ---
  c.vgradient(0, SEA_TOP, W, LAND_TOP - SEA_TOP + 6, [
    [0, '#2a74c8'],
    [0.5, PAL.sea],
    [1, PAL.seaDeep],
  ])
  c.hline(0, SEA_TOP, W, mix(PAL.seaFoam, PAL.sea, 0.4))
  waves(c, 0, SEA_TOP + 2, W, LAND_TOP - SEA_TOP, 91, 0.055)
  for (let y = SEA_TOP + 4; y < LAND_TOP; y += 3) {
    const w = 10 + ((y * 7) % 16)
    c.rect(116 - Math.round((y - SEA_TOP) * 0.6), y, w, 1, PAL.seaFoam, 0.2)
  }

  // --- 城の建つ島 ---
  c.disc(80, CASTLE_BASE + 5, 32, PAL.grassDark)
  c.disc(80, CASTLE_BASE + 3, 30, PAL.grass)
  c.disc(73, CASTLE_BASE + 1, 23, PAL.grassLight)
  c.rect(48, CASTLE_BASE + 3, 64, 9, PAL.grass)
  for (let x = 46; x < 114; x++) {
    const d = Math.abs(x - 80) / 34
    const y = CASTLE_BASE + 3 - Math.round(Math.cos(d * 1.5) * 3)
    c.px(x, y, PAL.sand)
    c.px(x, y + 1, mix(PAL.sand, '#000000', 0.2))
  }

  // --- 城 ---
  wallRun(c, 53, CASTLE_BASE - 10, 54, 10)
  c.rect(76, CASTLE_BASE - 9, 8, 9, mix(PAL.wallShade, '#000000', 0.25))
  c.rect(77, CASTLE_BASE - 8, 6, 8, PAL.window)
  c.rect(78, CASTLE_BASE - 9, 4, 1, PAL.gold)
  tower(c, 58, CASTLE_BASE - 9, 7, 13, 7, { flag: false })
  tower(c, 102, CASTLE_BASE - 9, 7, 13, 7, { flag: false })
  tower(c, 67, CASTLE_BASE - 9, 9, 19, 9)
  tower(c, 93, CASTLE_BASE - 9, 9, 19, 9)
  tower(c, 80, CASTLE_BASE - 11, 15, 26, 13)
  c.rect(74, CASTLE_BASE - 42, 13, 1, PAL.gold)

  // --- 手前の陸地（重なり合う丘） ---
  const hill = (cy, amp, freq, phase, col) => {
    for (let x = 0; x < W; x++) {
      const y = Math.round(cy + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2.3 + phase) * (amp * 0.35))
      c.rect(x, y, 1, H - y, col)
    }
  }
  hill(LAND_TOP + 2, 3, 0.09, 0.4, PAL.grass)
  grassTexture(c, 0, LAND_TOP - 2, W, H - LAND_TOP + 2, 12)
  // 波打ち際
  for (let x = 0; x < W; x++) {
    const y = Math.round(LAND_TOP + 2 + Math.sin(x * 0.09 + 0.4) * 3 + Math.sin(x * 0.207 + 0.4) * 1.05)
    c.px(x, y - 1, PAL.sand)
    c.px(x, y, mix(PAL.sand, '#000000', 0.2))
    c.px(x, y - 2, PAL.seaFoam, 0.6)
  }
  hill(LAND_TOP + 16, 4, 0.07, 2.1, PAL.grassDark)
  hill(LAND_TOP + 34, 4, 0.11, 4.2, PAL.forest)
  hill(LAND_TOP + 58, 3, 0.08, 1.2, '#1c4f22')
  grassTexture(c, 0, LAND_TOP + 12, W, H - LAND_TOP - 12, 33)

  // 街道
  const road = [[84, LAND_TOP + 4], [74, LAND_TOP + 18], [90, LAND_TOP + 34], [68, LAND_TOP + 52], [82, LAND_TOP + 70], [74, H]]
  c.path(road, PAL.roadEdge, 6)
  c.path(road, PAL.road, 4)

  // --- 手前の森（奥から手前へ、だんだん大きく） ---
  const r = rng(2024)
  const onRoadKV = (x, y) => {
    const p = c.get(x, y)
    const isRoad = p[0] > 150 && p[1] > 110 && p[2] < 150 && p[1] < 215
    const isWater = p[2] > 120 && p[2] > p[1] + 20
    return isRoad || isWater
  }
  const plantRow = (y0, y1, size, dark, count) => {
    for (let i = 0; i < count * 10 && count > 0; i++) {
      const x = Math.round(r() * (W - 6))
      const y = y0 + Math.round(r() * (y1 - y0))
      let clean = true
      for (let dy = -1; dy <= size + 1 && clean; dy++) {
        for (let dx = -1; dx <= size * 2; dx++) if (onRoadKV(x + dx, y + dy)) { clean = false; break }
      }
      if (!clean) continue
      tree(c, x, y, size, dark)
      count--
    }
  }
  plantRow(LAND_TOP + 1, LAND_TOP + 10, 3, true, 46)
  plantRow(LAND_TOP + 8, LAND_TOP + 22, 3, false, 38)
  plantRow(LAND_TOP + 14, LAND_TOP + 28, 4, true, 40)
  plantRow(LAND_TOP + 24, LAND_TOP + 40, 4, false, 34)
  plantRow(LAND_TOP + 34, LAND_TOP + 52, 5, true, 30)
  plantRow(LAND_TOP + 46, LAND_TOP + 66, 6, false, 24)
  plantRow(LAND_TOP + 60, H - 4, 7, true, 18)
  // 下草と茂み
  for (let i = 0; i < 90; i++) {
    const x = Math.round(r() * W)
    const y = LAND_TOP + Math.round(r() * (H - LAND_TOP))
    if (onRoadKV(x, y)) continue
    bush(c, x, y, 1 + Math.round(r() * 2), r() > 0.45 ? PAL.forest : PAL.forestLight)
  }
  // 草のゆらぎ
  for (let i = 0; i < 260; i++) {
    const x = Math.round(r() * W)
    const y = LAND_TOP + Math.round(r() * (H - LAND_TOP))
    if (onRoadKV(x, y)) continue
    c.px(x, y, PAL.grassDark)
    c.px(x + 1, y - 1, PAL.grassLight)
  }

  return save('keyvisual', c)
}

/* =========================================================
   2. マップの地形（アイコンは別素材で重ねる）
   ========================================================= */
// 海岸線: y に対する海の始まる x（右側が海）
const COAST = [
  [0, 96], [18, 90], [34, 99], [50, 86], [64, 93], [80, 104],
  [96, 98], [112, 106], [128, 96], [146, 103], [162, 95], [180, 104],
  [196, 97], [212, 105], [228, 98], [240, 103],
]
function coastX(y) {
  if (y <= COAST[0][0]) return COAST[0][1]
  for (let i = 0; i < COAST.length - 1; i++) {
    const [y0, x0] = COAST[i]
    const [y1, x1] = COAST[i + 1]
    if (y >= y0 && y <= y1) {
      const t = (y - y0) / (y1 - y0)
      const e = t * t * (3 - 2 * t) // なめらかに補間する
      return x0 + (x1 - x0) * e
    }
  }
  return COAST[COAST.length - 1][1]
}

function mapTerrain() {
  const W = 160
  const H = 240
  const c = new Canvas(W, H)
  const r = rng(4321)

  /* ---------- 大地 ---------- */
  c.fill(PAL.grass)
  grassTexture(c, 0, 0, W, H, 55)
  for (let i = 0; i < 40; i++) {
    c.disc(Math.round(r() * W), Math.round(r() * H), 5 + Math.round(r() * 14),
      r() > 0.5 ? PAL.grassLight : PAL.grassDark, 0.26)
  }

  /* ---------- 海と岩の海岸 ---------- */
  const seaAt = (y) => Math.round(coastX(y) + Math.sin(y * 0.7) * 1.4 + Math.sin(y * 0.23) * 2.2)
  for (let y = 0; y < H; y++) {
    const sx = seaAt(y)
    // 岩場の崖
    c.rect(sx - 4, y, 4, 1, '#6b5f4e')
    c.rect(sx - 4, y, 2, 1, '#8a7c66')
    c.px(sx - 1, y, '#4a4136')
    // 浅瀬 → 深い海
    c.rect(sx, y, 5, 1, '#54b0e0')
    c.rect(sx + 5, y, 7, 1, PAL.seaLight)
    c.rect(sx + 12, y, 10, 1, PAL.sea)
    c.rect(sx + 22, y, W - (sx + 22), 1, PAL.seaDeep)
  }
  waves(c, 84, 0, 76, H, 31, 0.08)
  // 岩礁
  for (let i = 0; i < 14; i++) {
    const y = Math.round(r() * H)
    const sx = seaAt(y) + 4 + Math.round(r() * 26)
    if (sx > W - 3) continue
    const rad = 1 + Math.round(r() * 2)
    c.disc(sx, y, rad, '#5c5142')
    c.disc(sx - 1, y - 1, Math.max(1, rad - 1), '#7d7159')
    c.ring(sx, y + 1, rad + 1, mix(PAL.seaFoam, PAL.sea, 0.3))
  }
  // 小島
  const islet = (cx, cy, rad, treeSize) => {
    c.disc(cx, cy + 1, rad + 1, '#4a4136')
    c.disc(cx, cy, rad, PAL.forest)
    c.disc(cx, cy - 1, rad, PAL.grass)
    c.disc(cx - 1, cy - 2, Math.max(1, rad - 2), PAL.grassLight)
    c.ring(cx, cy + 1, rad + 2, mix(PAL.seaFoam, PAL.sea, 0.35))
    if (treeSize) tree(c, cx - 2, cy - rad - treeSize + 2, treeSize, true)
  }
  islet(112, 18, 4, 3)
  islet(106, 78, 3, 2)
  islet(118, 146, 3, 2)
  islet(110, 202, 4, 3)

  /* ---------- 山地（左上） ---------- */
  const rockMountain = (cx, baseY, halfW, h) => {
    for (let j = 0; j < h; j++) {
      const t = j / h
      const w = Math.round(halfW * t)
      const y = baseY - h + j
      c.rect(cx - w, y, w * 2 + 1, 1, '#6e6352')
      c.rect(cx - w, y, Math.max(1, Math.round(w * 0.8)), 1, '#8a7e69')
      c.rect(cx + Math.round(w * 0.4), y, Math.max(1, Math.round(w * 0.6)), 1, '#554c3f')
      if ((j + cx) % 7 === 0 && w > 2) c.px(cx - w + 2, y, '#4a4237')
    }
    // 雪
    const sh = Math.max(3, Math.round(h * 0.3))
    for (let j = 0; j < sh; j++) {
      const t = j / h
      const w = Math.round(halfW * t)
      const y = baseY - h + j
      c.rect(cx - w, y, w * 2 + 1, 1, '#e8eef5')
      c.rect(cx + Math.round(w * 0.3), y, Math.max(1, Math.round(w * 0.7)), 1, '#c2ccda')
      if (j === sh - 1) {
        c.px(cx - w, y, '#e8eef5'); c.px(cx + w, y, '#e8eef5')
        c.px(cx - w + 3, y + 1, '#e8eef5'); c.px(cx + w - 3, y + 1, '#e8eef5')
      }
    }
  }
  rockMountain(20, 96, 20, 46)
  rockMountain(44, 92, 15, 34)
  rockMountain(6, 88, 13, 30)
  // 山裾
  for (let x = 0; x < 62; x++) {
    const y = 96 + Math.round(Math.sin(x * 0.2) * 2)
    c.rect(x, y, 1, 4, PAL.grassDark)
  }

  /* ---------- 川 ---------- */
  const river = (pts, width) => {
    c.path(pts, '#2a5a86', width + 2)
    c.path(pts, PAL.sea, width)
    c.path(pts, PAL.seaLight, Math.max(1, width - 2))
  }
  river([[58, 0], [62, 14], [58, 28], [66, 42], [76, 52], [84, 58], [92, 60]], 4)
  river([[34, 108], [30, 128], [38, 148], [32, 168], [40, 188], [36, 210], [42, 240]], 3)
  c.disc(90, 60, 4, PAL.sea)
  c.disc(90, 60, 2, PAL.seaLight)

  /* ---------- 街道 ---------- */
  const NODES = { station: [26, 163], arena: [74, 120], north: [62, 74], west: [24, 120], south: [58, 206], east: [92, 168] }
  const ROADS = [
    [[26, 163], [36, 150], [50, 140], [62, 130], [74, 120]],
    [[74, 120], [70, 104], [64, 90], [62, 74]],
    [[62, 74], [50, 62], [44, 48], [48, 32]],
    [[26, 163], [22, 146], [20, 132], [24, 120]],
    [[24, 120], [36, 112], [50, 108], [62, 100]],
    [[74, 120], [82, 134], [88, 150], [92, 168]],
    [[26, 163], [34, 180], [44, 194], [58, 206]],
    [[58, 206], [74, 200], [86, 186], [92, 168]],
    [[58, 206], [60, 222], [54, 236]],
    [[92, 168], [96, 152], [94, 138]],
  ]
  ROADS.forEach((pts) => c.path(pts, PAL.roadEdge, 4))
  ROADS.forEach((pts) => c.path(pts, PAL.road, 2))

  /* ---------- 森 ---------- */
  const blocked = (x, y) => {
    const p = c.get(x, y)
    if (p[3] === 0) return true
    const isRoad = p[0] > 150 && p[1] > 110 && p[2] < 160
    const isWater = p[2] > 120 && p[2] > p[1] + 20
    const isRock = Math.abs(p[0] - p[1]) < 30 && p[0] > 70 && p[2] < p[0] - 10 && p[1] < p[0]
    const isSnow = p[0] > 190 && p[1] > 195 && p[2] > 200
    return isRoad || isWater || isRock || isSnow
  }
  const ICON_SPOTS = [NODES.station, NODES.arena]
  const near = (x, y) => ICON_SPOTS.some(([nx, ny]) => Math.abs(nx - x) < 16 && Math.abs(ny - y) < 16)
  const canPlant = (x, y, size) => {
    if (x < 0 || y < 0 || x > W - size * 2 - 2 || y > H - size - 2) return false
    if (x + size >= seaAt(y + size) - 4 || near(x + size, y + size)) return false
    for (let dy = -1; dy <= size + 1; dy++) {
      for (let dx = -1; dx <= size * 2; dx++) if (blocked(x + dx, y + dy)) return false
    }
    return true
  }
  // 陸地をほぼ覆うように、細かいかたまりを並べる
  const clusters = []
  for (let cy = 8; cy < H; cy += 15) {
    for (let cx = 6; cx < 96; cx += 15) {
      clusters.push([cx + Math.round((r() - 0.5) * 8), cy + Math.round((r() - 0.5) * 8)])
    }
  }
  clusters.forEach(([cx, cy], ci) => {
    const cr = rng(900 + ci)
    for (let i = 0; i < 40; i++) {
      const x = cx + Math.round((cr() - 0.5) * 20)
      const y = cy + Math.round((cr() - 0.5) * 20)
      const size = cr() < 0.24 ? 2 : cr() < 0.74 ? 3 : 4
      if (canPlant(x, y, size)) tree(c, x, y, size, cr() > 0.3)
    }
  })
  for (let i = 0; i < 9000; i++) {
    const x = Math.round(r() * 100)
    const y = Math.round(r() * H)
    const size = r() < 0.5 ? 2 : 3
    if (canPlant(x, y, size)) tree(c, x, y, size, r() > 0.4)
  }
  // 広葉樹と茂み
  for (let i = 0; i < 300; i++) {
    const x = Math.round(r() * 100)
    const y = Math.round(r() * H)
    if (!canPlant(x, y, 2)) continue
    bush(c, x + 2, y + 2, 1 + Math.round(r() * 1.6), r() > 0.5 ? PAL.forest : PAL.forestLight)
  }
  // 草のゆらぎ
  for (let i = 0; i < 320; i++) {
    const x = Math.round(r() * W)
    const y = Math.round(r() * H)
    if (x >= seaAt(y) - 4 || blocked(x, y)) continue
    c.px(x, y, PAL.grassDark)
    c.px(x + 1, y - 1, PAL.grassLight)
  }
  return save('map-terrain', c)
}

/* =========================================================
   3. マップのロケーションアイコン（32x32）とマーカー
   ========================================================= */
const ICON = 32
function iconCanvas() {
  return new Canvas(ICON, ICON)
}
/* アイコン下部の影 */
function shadow(c, cy = 29, w = 10) {
  for (let i = -w; i <= w; i++) {
    const a = 0.34 * (1 - Math.abs(i) / (w + 1))
    c.px(16 + i, cy, '#06210c', a)
    c.px(16 + i, cy + 1, '#06210c', a * 0.5)
  }
  return c
}

/** 仙台駅：高層ビルの並ぶ街 */
function iconStation() {
  const c = iconCanvas()
  shadow(c, 29, 13)
  // 足もとの地面
  c.rect(2, 26, 28, 4, '#3f6b3a')
  c.rect(2, 26, 28, 1, '#56903f')
  const lit = (x, y, w, h, on) => {
    for (let j = 1; j < h - 1; j += 2) {
      for (let i = 1; i < w - 1; i += 2) {
        c.px(x + i, y + j, (i + j + x) % 3 ? on : '#2a3a56')
      }
    }
  }
  const tower = (x, y, w, h, wall, edge, roof) => {
    c.rect(x, y, w, h, wall)
    c.rect(x, y, 1, h, edge)
    c.rect(x + w - 1, y, 1, h, mix(wall, '#000000', 0.32))
    if (roof) c.rect(x - 1, y - 2, w + 2, 2, roof)
    lit(x, y, w, h, PAL.gold)
  }
  // 奥のビル
  tower(3, 14, 5, 13, '#7d8ea8', '#9fb0c8', null)
  tower(25, 12, 5, 15, '#7d8ea8', '#9fb0c8', null)
  tower(20, 9, 5, 18, '#8fa0ba', '#b4c4da', '#2f7d6b')
  // 中央の高層ビル
  tower(12, 3, 8, 24, '#a9bcd6', '#cfdcee', null)
  c.rect(12, 3, 8, 2, '#dfe9f6')
  c.rect(15, 0, 2, 3, '#8fa0ba')
  c.px(16, 0, '#ffe9b0')
  // 手前の低い建物（緑の屋根）
  const lowRoof = (x, y, w, h) => {
    c.rect(x, y, w, h, '#efeadc')
    c.rect(x, y, 1, h, '#ffffff')
    for (let j = 0; j < 3; j++) c.rect(x - 1 + j, y - 3 + j, w + 2 - j * 2, 1, j === 0 ? '#3f9a86' : '#2f7d6b')
    c.rect(x + 1, y + 2, 2, 3, PAL.window)
    c.rect(x + w - 3, y + 2, 2, 3, PAL.window)
  }
  lowRoof(5, 20, 8, 7)
  lowRoof(19, 21, 8, 6)
  // 駅前の木
  tree(c, 0, 21, 3, true)
  tree(c, 28, 22, 3, true)
  return save('loc-station', c)
}

/** セキスイハイムスーパーアリーナ：リブの入ったドーム */
function iconArena() {
  const c = iconCanvas()
  shadow(c, 29, 13)
  // 敷地
  c.rect(2, 24, 28, 5, '#8e9aa6')
  c.rect(2, 24, 28, 1, '#aab6c2')
  c.rect(2, 28, 28, 1, '#5e6a76')
  // ドームの本体
  for (let y = 0; y < 12; y++) {
    const t = y / 11
    const w = Math.round(13 * Math.sqrt(Math.max(0, 1 - (1 - t) * (1 - t))))
    c.rect(16 - w, 11 + y, w * 2 + 1, 1, '#7f93ab')
  }
  // 明るい面
  for (let y = 0; y < 12; y++) {
    const t = y / 11
    const w = Math.round(13 * Math.sqrt(Math.max(0, 1 - (1 - t) * (1 - t))))
    c.rect(16 - w, 11 + y, Math.max(1, w), 1, '#9db0c6')
  }
  // リブ
  for (let a = -78; a <= 78; a += 13) {
    const rad = (a * Math.PI) / 180
    for (let t = 0.15; t <= 1.0; t += 0.07) {
      const x = Math.round(16 + Math.sin(rad) * 13 * t)
      const y = Math.round(23 - Math.cos(rad) * 12 * t)
      if (y >= 11) c.px(x, y, '#c6d6e8')
    }
  }
  c.rect(3, 22, 27, 1, '#5e6a76')
  // ドームのてっぺん
  c.rect(14, 9, 5, 3, '#b4c6da')
  c.rect(15, 8, 3, 1, '#dfe9f6')
  c.px(16, 6, '#ffffff')
  c.px(16, 7, '#c6d6e8')
  // 外周の柱
  for (let x = 4; x < 29; x += 3) c.rect(x, 23, 1, 3, '#4f5a66')
  c.rect(3, 23, 26, 1, '#8e9aa6')
  // 入口
  c.rect(14, 23, 5, 4, '#2a3340')
  c.rect(15, 24, 3, 1, PAL.gold)
  // 照明塔
  c.rect(1, 14, 1, 10, '#6e7a86')
  c.rect(0, 12, 3, 2, '#c6d6e8')
  c.rect(30, 14, 1, 10, '#6e7a86')
  c.rect(29, 12, 3, 2, '#c6d6e8')
  return save('loc-arena', c)
}

/** 松島：島に建つ五大堂 */
function iconMatsushima() {
  const c = iconCanvas()
  // まわりの海
  c.disc(16, 22, 15, PAL.sea, 0.85)
  c.disc(16, 22, 13, PAL.seaLight, 0.9)
  c.ring(16, 22, 15, mix(PAL.seaFoam, PAL.sea, 0.35))
  // 島（岩場のふち）
  c.disc(16, 20, 12, '#4a4136')
  c.disc(16, 19, 12, PAL.forest)
  c.disc(16, 18, 11, PAL.grass)
  c.disc(13, 16, 8, PAL.grassLight)
  c.rect(5, 20, 23, 3, PAL.grass)
  for (let x = 4; x < 29; x++) {
    const y = 23 + (Math.sin(x * 0.7) > 0.3 ? 1 : 0)
    c.px(x, y, '#6b5f4e')
    c.px(x, y + 1, '#4a4136')
  }
  // 松
  tree(c, 2, 12, 4, true)
  tree(c, 25, 13, 4, true)
  tree(c, 6, 18, 3, false)
  tree(c, 23, 19, 3, false)
  // 五大堂
  c.rect(11, 14, 10, 7, '#c9a06a')
  c.rect(11, 14, 1, 7, '#e0bb85')
  c.rect(20, 14, 1, 7, '#8a6a3a')
  japaneseRoof(c, 16, 8, 11, 6, '#2b3550', PAL.gold)
  japaneseRoof(c, 16, 13, 8, 3, '#242d45', PAL.gold)
  c.rect(14, 17, 4, 4, '#2a1830')
  c.rect(15, 18, 2, 1, PAL.gold)
  c.rect(15, 5, 3, 2, PAL.gold)
  // 赤い橋
  c.rect(1, 24, 7, 1, PAL.red)
  c.rect(2, 25, 1, 2, PAL.redDark)
  c.rect(6, 25, 1, 2, PAL.redDark)
  // 波
  c.rect(3, 28, 4, 1, PAL.seaFoam)
  c.rect(14, 30, 5, 1, PAL.seaFoam)
  c.rect(24, 28, 4, 1, PAL.seaFoam)
  return save('loc-matsushima', c)
}

/** 方位磁針（28x28） */
function compass() {
  const c = new Canvas(28, 28)
  c.disc(14, 14, 13, '#1a1f33')
  c.disc(14, 14, 12, '#222a40')
  c.ring(14, 14, 13, PAL.gold)
  c.ring(14, 14, 10, mix(PAL.gold, '#000000', 0.35))
  // 4方位の星
  const spike = (dx, dy, len, colA, colB) => {
    for (let t = 0; t <= len; t++) {
      const w = Math.max(0, Math.round((len - t) / 3))
      const x = 14 + Math.round(dx * t)
      const y = 14 + Math.round(dy * t)
      for (let o = -w; o <= w; o++) {
        c.px(x + Math.round(dy * o), y + Math.round(dx * o), o < 0 ? colA : colB)
      }
    }
  }
  spike(0, -1, 10, '#fff0b0', PAL.gold)
  spike(0, 1, 10, PAL.gold, '#a8791d')
  spike(-1, 0, 10, '#fff0b0', PAL.gold)
  spike(1, 0, 10, PAL.gold, '#a8791d')
  c.disc(14, 14, 2, '#fff0b0')
  c.px(14, 14, PAL.gold)
  return save('compass', c)
}

/* =========================================================
   4. スケジュールの日ごとイラスト（120x80）
   ========================================================= */
const BW = 120
const BH = 80

function bannerDay1() {
  const c = new Canvas(BW, BH)
  const r = rng(11)
  // 空
  c.vgradient(0, 0, BW, 40, [[0, PAL.skyTop], [0.4, PAL.skyMid], [0.75, PAL.skyLow], [1, PAL.skyHorizon]])
  cloud(c, 4, 4, 26, 8)
  cloud(c, 72, 2, 30, 9)
  cloud(c, 44, 14, 20, 6, 0.85)
  cloud(c, 100, 18, 20, 6, 0.8)
  ;[[20, 24], [28, 21], [35, 25]].forEach(([x, y]) => {
    c.px(x, y, '#20365e'); c.px(x + 1, y - 1, '#20365e'); c.px(x + 2, y, '#20365e')
  })
  // 山
  mountain(c, 10, 42, 13, 13)
  mountain(c, 28, 42, 9, 9)
  mountain(c, 104, 42, 14, 12)
  mountain(c, 86, 42, 9, 8, mix(PAL.mountain, '#ffffff', 0.12), PAL.mountainLight, PAL.snow)
  c.dither(0, 38, BW, 4, PAL.skyHorizon, 2)
  // 海
  c.vgradient(0, 40, BW, 14, [[0, '#2a74c8'], [0.5, PAL.sea], [1, PAL.seaDeep]])
  c.hline(0, 40, BW, mix(PAL.seaFoam, PAL.sea, 0.4))
  waves(c, 0, 41, BW, 12, 5, 0.08)
  // 城のある岬
  c.disc(62, 58, 22, PAL.grassDark)
  c.disc(62, 56, 20, PAL.grass)
  c.disc(56, 54, 15, PAL.grassLight)
  c.rect(42, 56, 42, 6, PAL.grass)
  for (let x = 40; x < 86; x++) {
    const y = 56 - Math.round(Math.cos((Math.abs(x - 62) / 24) * 1.5) * 2)
    c.px(x, y, PAL.sand)
  }
  const cb = 56
  wallRun(c, 48, cb - 7, 28, 7)
  c.rect(60, cb - 6, 5, 6, PAL.window)
  tower(c, 51, cb - 6, 5, 9, 5, { flag: false })
  tower(c, 73, cb - 6, 5, 9, 5, { flag: false })
  tower(c, 62, cb - 7, 9, 16, 8)
  // 手前の陸
  const hill = (cy, amp, freq, phase, col) => {
    for (let x = 0; x < BW; x++) {
      const y = Math.round(cy + Math.sin(x * freq + phase) * amp)
      c.rect(x, y, 1, BH - y, col)
    }
  }
  c.rect(0, 52, BW, BH - 52, PAL.grass)
  hill(58, 2, 0.11, 0.4, PAL.grass)
  hill(66, 3, 0.09, 2.2, PAL.grassDark)
  hill(74, 2, 0.13, 4.0, PAL.forest)
  grassTexture(c, 0, 56, BW, BH - 56, 21)
  // 街道
  const road = [[62, 55], [59, 59], [55, 63], [58, 67], [64, 70], [62, 74], [55, 77], [50, 80]]
  c.path(road, PAL.roadEdge, 4)
  c.path(road, PAL.road, 2)
  // 森
  const onRoad = (x, y) => {
    const p = c.get(x, y)
    return p[0] > 150 && p[1] > 110 && p[2] < 150 && p[1] < 215
  }
  const plant = (y0, y1, size, dark, count) => {
    for (let i = 0; i < count * 10 && count > 0; i++) {
      const x = Math.round(r() * (BW - 6))
      const y = y0 + Math.round(r() * (y1 - y0))
      let clean = true
      for (let dy = -1; dy <= size + 1 && clean; dy++) {
        for (let dx = -1; dx <= size * 2; dx++) if (onRoad(x + dx, y + dy)) { clean = false; break }
      }
      if (clean) { tree(c, x, y, size, dark); count-- }
    }
  }
  plant(55, 62, 3, true, 34)
  plant(59, 68, 3, false, 28)
  plant(64, 73, 4, true, 26)
  plant(70, 77, 5, false, 18)
  for (let i = 0; i < 46; i++) {
    const bx = Math.round(r() * BW)
    const by = 56 + Math.round(r() * 23)
    if (onRoad(bx, by)) continue
    bush(c, bx, by, 1 + Math.round(r() * 1.8), r() > 0.5 ? PAL.forest : PAL.forestLight)
  }
  for (let i = 0; i < 90; i++) {
    const gx = Math.round(r() * BW)
    const gy = 56 + Math.round(r() * 23)
    if (onRoad(gx, gy)) continue
    c.px(gx, gy, PAL.grassDark)
    c.px(gx + 1, gy - 1, PAL.grassLight)
  }
  return save('banner-day1', c)
}

function bannerDay2() {
  const c = new Canvas(BW, BH)
  const r = rng(77)
  // 夜空
  c.vgradient(0, 0, BW, BH, [[0, '#150a33'], [0.45, '#2d1560'], [1, '#0a0620']])
  for (let i = 0; i < 90; i++) {
    const x = Math.round(r() * BW)
    const y = Math.round(r() * 52)
    c.px(x, y, r() > 0.62 ? PAL.magenta : '#ffffff', 0.35 + r() * 0.65)
  }
  // スポットライト
  const beam = (topX, botX, col, base) => {
    for (let y = 0; y < 52; y++) {
      const t = y / 52
      const cx = topX + (botX - topX) * t
      const w = 2 + Math.round(t * 16)
      c.rect(Math.round(cx - w / 2), y, w, 1, col, base + t * 0.1)
    }
  }
  beam(24, 44, '#ffffff', 0.03)
  beam(96, 76, PAL.magenta, 0.03)
  beam(60, 60, '#a9d8ff', 0.035)
  // ステージ後方の幕（縦縞は柵に見えるので使わず、色の濃淡だけで奥行きを出す）
  c.vgradient(0, 44, BW, 12, [[0, '#241354'], [1, '#150b32']])
  c.rect(0, 44, BW, 1, '#331f6b')

  // 大きな光の輪
  c.disc(60, 46, 20, '#ffffff', 0.09)
  c.disc(60, 46, 13, '#fff3c4', 0.14)

  // アーティスト
  c.rect(57, 36, 6, 16, '#ffffff')
  c.rect(58, 36, 4, 1, '#e6ecff')
  c.rect(57, 31, 6, 5, '#ffe9b0')
  c.rect(57, 30, 6, 2, '#6b4320')
  c.rect(52, 38, 5, 3, '#ffffff')
  c.rect(63, 32, 3, 6, '#ffffff')
  c.rect(65, 28, 2, 5, '#ffffff')
  c.disc(66, 27, 2, '#fff3c4')
  c.rect(57, 52, 2, 4, '#20264a')
  c.rect(61, 52, 2, 4, '#20264a')

  // ステージ床
  c.vgradient(0, 56, BW, 6, [[0, '#3a2470'], [1, '#1a0f3a']])
  c.rect(0, 56, BW, 1, '#5b3ea8')
  for (let x = 2; x < BW; x += 9) c.rect(x, 57, 4, 1, '#472c85')

  // 客席（頭と上げた手）
  for (let i = 0; i < 24; i++) {
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

  // 紙吹雪
  for (let i = 0; i < 26; i++) {
    const x = Math.round(r() * BW)
    const y = Math.round(r() * 58)
    c.px(x, y, [PAL.gold, PAL.magenta, '#a9d8ff', '#ffffff'][Math.floor(r() * 4)], 0.9)
  }
  return save('banner-day2', c)
}

function bannerDay3() {
  const c = new Canvas(BW, BH)
  const r = rng(303)
  // 空
  c.vgradient(0, 0, BW, 30, [[0, '#1d5ab4'], [0.55, PAL.skyLow], [1, PAL.skyHorizon]])
  cloud(c, 2, 3, 26, 8)
  cloud(c, 60, 1, 30, 9)
  cloud(c, 96, 14, 22, 6, 0.85)
  ;[[34, 18], [42, 15], [49, 19]].forEach(([x, y]) => {
    c.px(x, y, '#20365e'); c.px(x + 1, y - 1, '#20365e'); c.px(x + 2, y, '#20365e')
  })
  // 海
  c.vgradient(0, 28, BW, BH - 28, [[0, '#3d8ad8'], [0.4, PAL.sea], [1, PAL.seaDeep]])
  c.hline(0, 28, BW, PAL.seaFoam)
  waves(c, 0, 30, BW, BH - 30, 13, 0.09)
  // 島
  const isle = (cx, cy, rad, treeSize) => {
    c.disc(cx, cy + 1, rad, PAL.forest)
    c.disc(cx, cy, rad, PAL.grass)
    c.disc(cx - 1, cy - 1, Math.max(1, rad - 2), PAL.grassLight)
    c.ring(cx, cy + 1, rad + 1, mix(PAL.seaFoam, PAL.sea, 0.3))
    if (treeSize) {
      tree(c, cx - rad + 1, cy - rad - treeSize + 2, treeSize, true)
      tree(c, cx + rad - 4, cy - rad - treeSize + 3, treeSize, false)
    }
  }
  isle(14, 34, 6, 3)
  isle(102, 33, 7, 3)
  isle(36, 30, 4, 2)
  isle(84, 44, 5, 3)
  isle(8, 50, 5, 3)
  isle(114, 54, 5, 3)
  // 中央の島と五大堂
  isle(58, 46, 16, 0)
  c.rect(40, 46, 36, 6, PAL.grass)
  tree(c, 42, 33, 4, true)
  tree(c, 70, 34, 4, false)
  tree(c, 36, 40, 3, true)
  tree(c, 76, 41, 3, false)
  c.rect(52, 38, 12, 8, '#f0ece0')
  c.rect(52, 38, 1, 8, '#ffffff')
  c.rect(63, 38, 1, 8, PAL.wallShade)
  japaneseRoof(c, 58, 30, 12, 7, PAL.red, PAL.gold)
  c.rect(55, 41, 6, 5, '#2a1830')
  c.rect(56, 42, 4, 1, PAL.gold)
  // 鳥居
  c.rect(24, 52, 2, 9, PAL.red)
  c.rect(33, 52, 2, 9, PAL.red)
  c.rect(22, 49, 15, 2, PAL.red)
  c.rect(23, 53, 13, 2, PAL.red)
  c.rect(22, 48, 15, 1, PAL.redDark)
  // 小舟
  c.rect(88, 66, 11, 2, '#7a4f28')
  c.rect(89, 65, 9, 1, '#a06b38')
  c.rect(93, 60, 1, 5, '#e8e4d8')
  c.rect(94, 60, 4, 4, '#ffffff')
  // 手前の波
  for (let i = 0; i < 26; i++) {
    const x = Math.round(r() * BW)
    const y = 62 + Math.round(r() * 18)
    c.rect(x, y, 3 + Math.round(r() * 3), 1, PAL.seaFoam, 0.7)
  }
  return save('banner-day3', c)
}

/* =========================================================
   5. 冒険ガイドの写真プレースホルダ（48x48）
   実写に差し替えるまでのあいだ使う
   ========================================================= */
const GW = 48

function guideMatsushima() {
  const c = new Canvas(GW, GW)
  const r = rng(501)
  c.vgradient(0, 0, GW, 20, [[0, '#1d5ab4'], [0.6, PAL.skyLow], [1, PAL.skyHorizon]])
  cloud(c, 1, 2, 16, 6)
  cloud(c, 30, 4, 16, 5, 0.9)
  c.vgradient(0, 19, GW, GW - 19, [[0, '#3d8ad8'], [0.45, PAL.sea], [1, PAL.seaDeep]])
  c.hline(0, 19, GW, PAL.seaFoam)
  waves(c, 0, 21, GW, GW - 21, 9, 0.1)
  const isle = (cx, cy, rad, ts) => {
    c.disc(cx, cy + 1, rad, PAL.forest)
    c.disc(cx, cy, rad, PAL.grass)
    c.disc(cx - 1, cy - 1, Math.max(1, rad - 2), PAL.grassLight)
    c.ring(cx, cy + 1, rad + 1, mix(PAL.seaFoam, PAL.sea, 0.3))
    if (ts) tree(c, cx - 2, cy - rad - ts + 2, ts, true)
  }
  isle(7, 25, 4, 3)
  isle(41, 24, 5, 3)
  isle(24, 32, 11, 0)
  c.rect(14, 32, 21, 5, PAL.grass)
  tree(c, 15, 22, 3, true)
  tree(c, 31, 23, 3, false)
  c.rect(21, 26, 7, 6, '#f0ece0')
  japaneseRoof(c, 24, 21, 7, 4, PAL.red, PAL.gold)
  c.rect(23, 28, 3, 4, '#2a1830')
  // 鳥居
  c.rect(6, 36, 1, 6, PAL.red)
  c.rect(11, 36, 1, 6, PAL.red)
  c.rect(5, 34, 8, 1, PAL.red)
  c.rect(6, 37, 6, 1, PAL.red)
  for (let i = 0; i < 12; i++) {
    c.rect(Math.round(r() * GW), 40 + Math.round(r() * 8), 3, 1, PAL.seaFoam, 0.7)
  }
  return save('guide-matsushima', c)
}

function guideGyutan() {
  const c = new Canvas(GW, GW)
  // 木のテーブル
  c.vgradient(0, 0, GW, GW, [[0, '#6b4a2c'], [1, '#452d19']])
  for (let y = 0; y < GW; y += 4) c.hline(0, y, GW, '#3a2515', 0.35)
  // 皿
  c.disc(24, 28, 19, '#2a1c12')
  c.disc(24, 27, 18, '#d9d3c2')
  c.disc(24, 26, 15, '#f2efe4')
  c.ring(24, 27, 18, '#a89f8a')
  // 牛たん
  const slice = (cx, cy, rx, ry) => {
    for (let y = -ry; y <= ry; y++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))))
      c.rect(cx - w, cy + y, w * 2 + 1, 1, '#a34a33')
    }
    for (let y = -ry; y <= 0; y++) {
      const w = Math.round((rx - 1) * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))))
      c.rect(cx - w, cy + y, w * 2 + 1, 1, '#c26a4c')
    }
    c.rect(cx - rx + 1, cy + ry, (rx - 1) * 2 + 1, 1, '#6e2a1c')
    c.rect(cx - rx + 2, cy - 1, rx * 2 - 3, 1, '#7a3020')
    c.rect(cx - rx + 2, cy + 1, rx * 2 - 3, 1, '#8c3a26')
    c.px(cx - 2, cy - ry + 1, '#d98c66')
  }
  slice(15, 30, 8, 4)
  slice(33, 30, 8, 4)
  slice(24, 20, 9, 4)
  // レモンと薬味
  c.disc(38, 17, 4, '#c9a92e')
  c.disc(38, 17, 3, '#f2d24e')
  c.disc(38, 17, 2, '#fbe98a')
  c.disc(10, 18, 3, '#2f7a2e')
  c.disc(10, 18, 2, '#4f9e46')
  // 湯気
  for (const [x, y] of [[18, 10], [19, 6], [17, 3], [30, 11], [31, 7], [29, 4]]) {
    c.px(x, y, '#ffffff', 0.4)
  }
  return save('guide-gyutan', c)
}

function guideZunda() {
  const c = new Canvas(GW, GW)
  // テーブル
  c.vgradient(0, 0, GW, GW, [[0, '#7a5a38'], [1, '#4a3320']])
  for (let y = 0; y < GW; y += 5) c.hline(0, y, GW, '#3d2a18', 0.3)
  // 器（大）
  c.disc(18, 30, 15, '#20303f')
  c.disc(18, 29, 14, '#f4f1e6')
  c.disc(18, 28, 11, '#ffffff')
  c.ring(18, 29, 14, '#b9b2a0')
  // ずんだ
  c.disc(18, 27, 9, '#4f9e46')
  c.disc(18, 26, 8, '#6fc05a')
  c.disc(15, 24, 5, '#8fd673')
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2
    c.px(18 + Math.round(Math.cos(a) * 6), 26 + Math.round(Math.sin(a) * 5), '#3f8437')
  }
  // 器（小）
  c.disc(37, 20, 10, '#20303f')
  c.disc(37, 19, 9, '#f4f1e6')
  c.disc(37, 18, 7, '#ffffff')
  c.disc(37, 17, 5, '#6fc05a')
  c.disc(36, 16, 3, '#8fd673')
  // 白玉
  c.disc(13, 24, 3, '#ffffff')
  c.disc(13, 23, 2, '#fdfdf8')
  c.disc(23, 25, 3, '#ffffff')
  c.disc(23, 24, 2, '#fdfdf8')
  // 木のさじ
  c.rect(30, 34, 12, 2, '#a07747')
  c.disc(29, 35, 3, '#b9895a')
  c.disc(29, 34, 2, '#cfa06e')
  return save('guide-zunda', c)
}

function guideSendaijo() {
  const c = new Canvas(GW, GW)
  // 空
  c.vgradient(0, 0, GW, 26, [[0, PAL.skyTop], [0.5, PAL.skyMid], [1, PAL.skyHorizon]])
  cloud(c, 1, 2, 16, 6)
  cloud(c, 30, 5, 16, 5, 0.85)
  // 遠くの街並み
  for (let i = 0; i < 12; i++) {
    const x = i * 4
    const h = 3 + ((i * 5) % 6)
    c.rect(x, 24 - h, 4, h, '#3f5b8c')
    c.px(x + 1, 25 - h, '#6f8bbd')
  }
  c.rect(0, 24, GW, 2, '#33497a')
  // 城山の斜面（石垣のまわりを埋める）
  c.vgradient(0, 26, GW, GW - 26, [[0, '#2f6b34'], [1, '#1c4a22']])
  grassTexture(c, 0, 26, GW, GW - 26, 44)
  // 石垣（下に向かって広がる）
  for (let j = 0; j < 16; j++) {
    const w = 26 + j
    const x = 24 - Math.round(w / 2)
    c.rect(x, 26 + j, w, 1, j % 2 ? '#8e8878' : '#9c9585')
  }
  // 石の目地
  for (let j = 0; j < 16; j += 3) {
    const w = 26 + j
    const x = 24 - Math.round(w / 2)
    c.rect(x, 26 + j, w, 1, '#6e685a')
    for (let i = (j % 6) ? 0 : 3; i < w; i += 6) c.px(x + i, 27 + j, '#6e685a')
  }
  // 騎馬像
  const bronze = '#3f5246'
  const bronzeHi = '#5f7a66'
  c.rect(17, 19, 13, 5, bronze)       // 馬の胴
  c.rect(17, 19, 13, 1, bronzeHi)
  c.rect(28, 15, 4, 5, bronze)        // 首
  c.rect(30, 13, 4, 3, bronze)        // 頭
  c.px(33, 14, bronzeHi)
  c.rect(15, 17, 2, 4, bronze)        // 尾
  c.rect(18, 24, 2, 4, bronze)        // 脚
  c.rect(26, 24, 2, 4, bronze)
  c.rect(22, 24, 2, 3, bronze)
  c.rect(22, 13, 4, 7, bronze)        // 騎乗する人
  c.rect(22, 13, 4, 1, bronzeHi)
  c.rect(22, 10, 4, 3, bronze)
  c.px(21, 9, PAL.gold)               // 三日月の前立て
  c.px(22, 8, PAL.gold)
  c.px(24, 8, PAL.gold)
  c.px(25, 9, PAL.gold)
  c.rect(26, 14, 4, 2, bronze)        // 腕
  // 足もとの緑
  c.rect(0, 42, GW, 6, PAL.grassDark)
  c.rect(0, 42, GW, 1, PAL.grass)
  tree(c, 1, 33, 4, true)
  tree(c, 41, 34, 4, true)
  tree(c, 8, 40, 3, false)
  tree(c, 36, 41, 3, false)
  return save('guide-sendaijo', c)
}

function guideZuihoden() {
  const c = new Canvas(GW, GW)
  // 杉木立
  c.vgradient(0, 0, GW, GW, [[0, '#16301c'], [1, '#0d2013']])
  const r = rng(88)
  for (let i = 0; i < 22; i++) {
    const x = Math.round(r() * GW)
    const y = Math.round(r() * 26)
    tree(c, x, y, 3 + Math.round(r() * 2), true)
  }
  // 石段
  for (let j = 0; j < 8; j++) {
    const w = 20 + j * 3
    c.rect(24 - Math.round(w / 2), 40 + j, w, 1, j % 2 ? '#a8a294' : '#948e80')
  }
  c.rect(14, 39, 20, 1, '#b9b4a4')
  // 本体（朱塗り）
  c.rect(12, 26, 24, 13, PAL.red)
  c.rect(12, 26, 1, 13, mix(PAL.red, '#ffffff', 0.35))
  c.rect(35, 26, 1, 13, PAL.redDark)
  c.rect(18, 29, 12, 10, '#2a1830')
  c.rect(19, 30, 10, 1, PAL.gold)
  c.rect(19, 37, 10, 1, PAL.gold)
  // 大屋根
  japaneseRoof(c, 24, 14, 21, 12, '#2b3550', PAL.gold)
  japaneseRoof(c, 24, 24, 16, 5, '#242d45', PAL.gold)
  // 金の装飾
  c.rect(21, 10, 6, 3, PAL.gold)
  c.px(20, 11, PAL.gold)
  c.px(27, 11, PAL.gold)
  c.rect(23, 8, 2, 2, '#fff0b0')
  // 灯籠
  const lantern = (x) => {
    c.rect(x, 33, 4, 7, '#b9b4a4')
    c.rect(x - 1, 31, 6, 2, '#a8a294')
    c.rect(x + 1, 34, 2, 2, PAL.gold)
    c.rect(x - 1, 40, 6, 1, '#8b8578')
  }
  lantern(3)
  lantern(41)
  return save('guide-zuihoden', c)
}

function guideAkiu() {
  const c = new Canvas(GW, GW)
  // 空と木々
  c.vgradient(0, 0, GW, 10, [[0, PAL.skyMid], [1, PAL.skyHorizon]])
  c.rect(0, 8, GW, 6, PAL.forest)
  const r = rng(140)
  for (let i = 0; i < 14; i++) tree(c, Math.round(r() * GW), 3 + Math.round(r() * 6), 3, true)
  // 岩壁
  const rock = (x, w) => {
    c.rect(x, 10, w, 30, '#6b6054')
    for (let j = 0; j < 30; j += 3) {
      c.rect(x, 10 + j, w, 1, j % 6 ? '#5c5247' : '#7a6f60')
      for (let i = 0; i < w; i += 5) c.px(x + i + (j % 5), 11 + j, '#4a4139')
    }
    c.rect(x + (x === 0 ? w - 1 : 0), 10, 1, 30, '#3d352e')
  }
  rock(0, 17)
  rock(31, 17)
  // 滝
  c.rect(17, 10, 14, 28, '#cfe6fa')
  c.rect(17, 10, 14, 28, '#e8f4ff', 0.5)
  for (let i = 0; i < 6; i++) {
    const x = 18 + i * 2
    for (let y = 10; y < 38; y += 3) c.px(x, y + (i % 3), '#ffffff')
  }
  c.rect(17, 10, 1, 28, '#9cc4e0')
  c.rect(30, 10, 1, 28, '#9cc4e0')
  // 滝つぼ
  c.vgradient(0, 38, GW, 10, [[0, '#4f9ad0'], [1, '#1f62b8']])
  c.disc(24, 40, 9, '#ffffff', 0.7)
  c.disc(24, 40, 6, '#ffffff')
  for (let i = 0; i < 24; i++) {
    c.rect(Math.round(r() * GW), 40 + Math.round(r() * 7), 2 + Math.round(r() * 3), 1, '#ffffff', 0.6)
  }
  // しぶき
  for (let i = 0; i < 16; i++) c.px(18 + Math.round(r() * 12), 34 + Math.round(r() * 6), '#ffffff', 0.8)
  return save('guide-akiu', c)
}

function guideAer() {
  const c = new Canvas(GW, GW)
  // 夕暮れの空
  c.vgradient(0, 0, GW, 30, [[0, '#1b2a63'], [0.45, '#6b4a8c'], [0.75, '#d97a5c'], [1, '#f2b06a']])
  const r = rng(210)
  for (let i = 0; i < 14; i++) c.px(Math.round(r() * GW), Math.round(r() * 14), '#ffffff', 0.4 + r() * 0.5)
  // 奥州連山
  mountain(c, 6, 30, 12, 9, '#2f3f6b', '#42548a', '#cbd8f0')
  mountain(c, 22, 30, 9, 7, '#2a3862', '#3c4d80', '#cbd8f0')
  mountain(c, 41, 30, 12, 8, '#2f3f6b', '#42548a', '#cbd8f0')
  // 街並み
  c.rect(0, 30, GW, 18, '#101a33')
  for (let i = 0; i < 16; i++) {
    const x = i * 3
    const h = 5 + ((i * 7) % 9)
    c.rect(x, 48 - h, 3, h, i % 2 ? '#1b2949' : '#16223d')
    for (let y = 48 - h + 1; y < 47; y += 2) {
      if ((i + y) % 3) c.px(x + 1, y, PAL.gold, 0.85)
    }
  }
  // AER タワー
  c.rect(19, 6, 11, 38, '#20304f')
  c.rect(19, 6, 1, 38, '#35496f')
  c.rect(29, 6, 1, 38, '#141f36')
  c.rect(19, 6, 11, 2, '#3f5680')
  // 最上階の展望テラス
  c.rect(18, 8, 13, 4, '#5a7ab0')
  c.rect(18, 8, 13, 1, '#a9c8f0')
  c.rect(19, 9, 11, 2, '#cfe4ff')
  // 窓明かり
  for (let y = 14; y < 43; y += 3) {
    for (let x = 21; x < 29; x += 3) {
      if ((x + y) % 4) c.rect(x, y, 2, 2, PAL.gold, 0.9)
      else c.rect(x, y, 2, 2, '#4a6390')
    }
  }
  c.px(24, 4, '#ffffff')
  c.px(24, 3, '#ffffff', 0.6)
  return save('guide-aer', c)
}

function guideAsaichi() {
  const c = new Canvas(GW, GW)
  const r = rng(360)
  // アーケードの奥
  c.vgradient(0, 0, GW, GW, [[0, '#3a3026'], [1, '#221b13']])
  c.rect(0, 0, GW, 8, '#2b241a')
  // 吊り下げ照明
  for (let i = 0; i < 4; i++) {
    const x = 6 + i * 12
    c.rect(x, 0, 1, 4, '#5c5244')
    c.disc(x, 5, 2, '#fff0b0')
    c.disc(x, 5, 3, '#fff0b0', 0.25)
  }
  // 店先のひさし（紅白のストライプ）
  for (let i = 0; i < GW; i++) {
    c.rect(i, 9, 1, 5, Math.floor(i / 4) % 2 ? '#d94f4f' : '#f0ece0')
  }
  c.rect(0, 14, GW, 1, '#8c3636')
  // 値札の札
  c.rect(4, 16, 9, 5, '#f7f2df')
  c.rect(4, 16, 9, 1, '#d9d3c2')
  c.rect(6, 18, 5, 1, '#c0392b')
  c.rect(35, 16, 9, 5, '#f7f2df')
  c.rect(37, 18, 5, 1, '#c0392b')
  // 木箱
  const crate = (x, y, w, h, col) => {
    c.rect(x, y, w, h, '#8a6a3a')
    c.rect(x, y, w, 1, '#a9834a')
    c.rect(x, y + h - 1, w, 1, '#5e4726')
    c.rect(x + w - 1, y, 1, h, '#5e4726')
    c.rect(x + 1, y + 1, w - 2, h - 3, col)
  }
  crate(1, 24, 15, 10, '#2f7d47')
  crate(17, 22, 14, 12, '#d96a2a')
  crate(32, 24, 15, 10, '#c0392b')
  crate(4, 35, 16, 11, '#e8d24a')
  crate(22, 36, 14, 10, '#6fc05a')
  crate(37, 35, 11, 11, '#5a8ccc')
  // 中身のつぶつぶ
  for (let i = 0; i < 70; i++) {
    const x = Math.round(r() * GW)
    const y = 23 + Math.round(r() * 22)
    const p = c.get(x, y)
    if (p[3] === 0) continue
    c.px(x, y, r() > 0.5 ? mix([p[0], p[1], p[2], 255], '#ffffff', 0.3) : mix([p[0], p[1], p[2], 255], '#000000', 0.25))
  }
  // 魚
  c.disc(41, 28, 3, '#b9c6d6')
  c.px(44, 28, '#8fa0b5')
  c.px(39, 27, '#20304f')
  return save('guide-asaichi', c)
}

function guideKaki() {
  const c = new Canvas(GW, GW)
  const r = rng(620)
  // 炭火の網
  c.vgradient(0, 0, GW, GW, [[0, '#332b22'], [1, '#17130d']])
  c.rect(2, 5, 44, 38, '#241e16')
  c.rect(2, 5, 44, 1, '#453b2e')
  c.rect(2, 42, 44, 1, '#120e08')
  for (let i = 0; i < 34; i++) {
    const x = 4 + Math.round(r() * 40)
    const y = 7 + Math.round(r() * 34)
    c.px(x, y, r() > 0.5 ? '#e0691f' : '#7a3009', 0.75)
  }
  for (let x = 3; x < 46; x += 5) c.rect(x, 5, 1, 38, '#5c5348', 0.8)

  /** 殻を開いた牡蠣 */
  const oyster = (cx, cy, rx, ry) => {
    const ovalW = (y, ax, ay) => Math.round(ax * Math.sqrt(Math.max(0, 1 - (y * y) / (ay * ay))))
    // 落ちる影
    for (let y = -ry; y <= ry; y++) {
      const w = ovalW(y, rx, ry)
      c.rect(cx - w + 1, cy + y + 2, w * 2 + 1, 1, '#0d0a06', 0.55)
    }
    // 殻の外側
    for (let y = -ry; y <= ry; y++) {
      const w = ovalW(y, rx, ry)
      c.rect(cx - w, cy + y, w * 2 + 1, 1, '#6e6659')
    }
    // 放射状のうね
    for (let a = 0; a < 360; a += 15) {
      const rad = (a * Math.PI) / 180
      const dark = ((a / 15) % 2) === 0
      for (let t = 0.62; t <= 1.0; t += 0.08) {
        c.px(cx + Math.round(Math.cos(rad) * rx * t), cy + Math.round(Math.sin(rad) * ry * t),
          dark ? '#514a3f' : '#867d6d')
      }
    }
    // ふちを締める
    for (let a = 0; a < 360; a += 8) {
      const rad = (a * Math.PI) / 180
      c.px(cx + Math.round(Math.cos(rad) * rx), cy + Math.round(Math.sin(rad) * ry), '#453f35')
    }
    // 貝の内側（真珠色）
    for (let y = -ry + 2; y <= ry - 2; y++) {
      const w = ovalW(y, rx - 2, ry - 2)
      c.rect(cx - w, cy + y, w * 2 + 1, 1, '#e4dfd0')
    }
    for (let y = -ry + 2; y <= 0; y++) {
      const w = ovalW(y, rx - 2, ry - 2)
      c.rect(cx - w, cy + y, w * 2 + 1, 1, '#f4f1e6')
    }
    // 身（貝の内側を少し残してふっくら見せる）
    for (let y = -ry + 4; y <= ry - 4; y++) {
      const w = ovalW(y, rx - 5, ry - 4)
      c.rect(cx - w, cy + y, w * 2 + 1, 1, '#a89170')
    }
    for (let y = -ry + 4; y <= ry - 5; y++) {
      const w = ovalW(y, rx - 6, ry - 4)
      c.rect(cx - w, cy + y, w * 2 + 1, 1, '#d9c49a')
    }
    for (let y = -ry + 4; y <= -1; y++) {
      const w = ovalW(y, rx - 7, ry - 4)
      c.rect(cx - w, cy + y, w * 2 + 1, 1, '#ecdcb6')
    }
    // 身のひだと照り
    c.rect(cx - rx + 6, cy + 1, (rx - 6) * 2 - 1, 1, '#bda47f')
    c.rect(cx - 2, cy - ry + 5, 3, 1, '#fff7e2')
    // 汁
    c.px(cx - rx + 3, cy + 2, '#cfd8d0')
    c.px(cx + rx - 3, cy - 1, '#cfd8d0')
  }

  oyster(14, 15, 11, 8)
  oyster(34, 23, 11, 8)
  oyster(18, 34, 12, 8)

  // レモン
  c.disc(41, 39, 5, '#b8991f')
  c.disc(41, 39, 4, '#f2d24e')
  c.disc(41, 39, 3, '#fbe98a')
  c.rect(38, 39, 7, 1, '#e0bb2e')
  c.rect(41, 36, 1, 7, '#e0bb2e')
  c.px(39, 37, '#fff6c8')

  // 湯気
  for (const [x, y, a] of [[9, 4, 0.55], [10, 1, 0.35], [28, 9, 0.5], [29, 6, 0.32], [40, 11, 0.4]]) {
    c.px(x, y, '#ffffff', a)
  }
  return save('guide-kaki', c)
}

function guideGyutanSet() {
  const c = new Canvas(GW, GW)
  // 折敷
  c.vgradient(0, 0, GW, GW, [[0, '#5c4227'], [1, '#3a2a18']])
  c.rect(2, 4, 44, 40, '#7a5a38')
  c.rect(2, 4, 44, 1, '#94714a')
  c.rect(2, 43, 44, 1, '#4a3320')
  // 牛たん皿
  c.disc(16, 16, 12, '#20303f')
  c.disc(16, 15, 11, '#efeadc')
  c.disc(16, 14, 9, '#ffffff')
  const slice = (cx, cy, rx, ry) => {
    for (let y = -ry; y <= ry; y++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))))
      c.rect(cx - w, cy + y, w * 2 + 1, 1, '#a34a33')
    }
    for (let y = -ry; y <= 0; y++) {
      const w = Math.round((rx - 1) * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))))
      c.rect(cx - w, cy + y, w * 2 + 1, 1, '#c26a4c')
    }
    c.rect(cx - rx + 2, cy - 1, rx * 2 - 3, 1, '#7a3020')
    c.rect(cx - rx + 2, cy + 1, rx * 2 - 3, 1, '#8c3a26')
  }
  slice(11, 13, 6, 3)
  slice(21, 13, 6, 3)
  slice(16, 19, 6, 3)
  // 麦めし
  c.disc(35, 18, 10, '#20303f')
  c.disc(35, 17, 9, '#3f5266')
  c.disc(35, 16, 7, '#f7f4ea')
  c.disc(35, 15, 5, '#ffffff')
  for (let i = 0; i < 14; i++) c.px(30 + Math.round((i * 7) % 11), 13 + ((i * 5) % 6), '#c9a06a')
  // テールスープ
  c.disc(14, 36, 9, '#1b1208')
  c.disc(14, 35, 8, '#2e2114')
  c.disc(14, 34, 6, '#6b4a2c')
  c.disc(13, 33, 3, '#8a6138')
  c.px(12, 33, '#c9a06a')
  c.px(16, 35, '#4f9e46')
  // 南蛮味噌漬け
  c.disc(34, 36, 7, '#20303f')
  c.disc(34, 35, 6, '#efeadc')
  c.disc(34, 34, 4, '#2f7d47')
  c.px(33, 34, '#6fc05a')
  // 箸
  c.rect(4, 40, 18, 1, '#c9a06a')
  c.rect(4, 42, 18, 1, '#c9a06a')
  return save('guide-gyutan-set', c)
}

function guideKanmi() {
  const c = new Canvas(GW, GW)
  const r = rng(710)
  // 畳と黒塗りのお盆
  c.vgradient(0, 0, GW, GW, [[0, '#9c8f66'], [1, '#6e6348']])
  for (let y = 0; y < GW; y += 4) c.hline(0, y, GW, '#5e553d', 0.3)
  c.rect(3, 8, 42, 34, '#241c14')
  c.rect(3, 8, 42, 1, '#463828')
  c.rect(3, 41, 42, 1, '#120d08')
  c.rect(5, 10, 38, 30, '#100c08')

  // あんみつの器
  c.disc(19, 24, 14, '#1c2a3a')
  c.disc(19, 23, 13, '#e8eef5')
  c.disc(19, 22, 11, '#ffffff')
  c.ring(19, 23, 13, '#8fa0b5')
  // 寒天の角切り
  const kanten = (x, y) => {
    c.rect(x, y, 4, 4, '#cfe4ef')
    c.rect(x, y, 4, 1, '#eef7fb')
    c.rect(x, y + 3, 4, 1, '#a8c4d4')
    c.px(x + 1, y + 1, '#ffffff')
  }
  kanten(10, 20); kanten(15, 24); kanten(22, 26); kanten(25, 19); kanten(13, 28)
  // あんこ
  c.disc(19, 18, 6, '#3a1f2e')
  c.disc(19, 17, 5, '#52293c')
  c.disc(17, 16, 3, '#6b3a4e')
  for (let i = 0; i < 10; i++) c.px(15 + Math.round(r() * 8), 14 + Math.round(r() * 6), '#2a1520')
  // 白玉
  c.disc(12, 25, 3, '#e4e0d4')
  c.disc(12, 24, 2, '#ffffff')
  c.disc(25, 27, 3, '#e4e0d4')
  c.disc(25, 26, 2, '#ffffff')
  // さくらんぼ
  c.disc(23, 14, 3, '#a82f33')
  c.disc(23, 13, 2, '#d8423f')
  c.px(22, 12, '#f2938f')
  c.rect(23, 9, 1, 4, '#3f6b3a')
  // みかん
  c.disc(10, 15, 3, '#d96a2a')
  c.disc(10, 14, 2, '#f0913f')
  // 黒蜜のポット
  c.rect(35, 24, 8, 10, '#2a2018')
  c.rect(35, 24, 1, 10, '#463828')
  c.rect(36, 22, 6, 2, '#463828')
  c.rect(37, 26, 4, 5, '#6b4a2c')
  // 楊枝
  c.rect(30, 36, 12, 1, '#c9a06a')
  return save('guide-kanmi', c)
}

function guideSerinabe() {
  const c = new Canvas(GW, GW)
  const r = rng(715)
  // 木のテーブルとコンロ
  c.vgradient(0, 0, GW, GW, [[0, '#7a5a38'], [1, '#41301c']])
  for (let y = 0; y < GW; y += 5) c.hline(0, y, GW, '#33260f', 0.3)
  c.rect(6, 34, 36, 8, '#2e2720')
  c.rect(6, 34, 36, 1, '#4a4038')
  for (let i = 0; i < 8; i++) c.px(10 + i * 4, 38, i % 2 ? '#f07a2a' : '#f5c84e')

  // 土鍋
  c.disc(24, 24, 18, '#1c1510')
  c.disc(24, 23, 17, '#4a3527')
  c.disc(24, 22, 15, '#63472f')
  c.ring(24, 23, 17, '#2e2016')
  c.ring(24, 23, 15, '#7d5c3c')
  // 取っ手
  c.rect(3, 22, 5, 5, '#4a3527')
  c.rect(40, 22, 5, 5, '#4a3527')
  c.rect(3, 22, 5, 1, '#7d5c3c')
  c.rect(40, 22, 5, 1, '#7d5c3c')
  // だし
  c.disc(24, 22, 13, '#8a6a3a')
  c.disc(24, 21, 12, '#a07747')
  c.disc(21, 19, 6, '#b9895a', 0.7)
  // 鴨肉
  const duck = (cx, cy, rx, ry) => {
    for (let y = -ry; y <= ry; y++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))))
      c.rect(cx - w, cy + y, w * 2 + 1, 1, '#8a3a3a')
    }
    for (let y = -ry; y <= 0; y++) {
      const w = Math.round((rx - 1) * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))))
      c.rect(cx - w, cy + y, w * 2 + 1, 1, '#a84f47')
    }
    c.rect(cx - rx + 1, cy + ry, (rx - 1) * 2 + 1, 1, '#5e2424')
    c.px(cx - 1, cy - ry + 1, '#c97a6a')
  }
  duck(16, 26, 5, 3)
  duck(31, 25, 5, 3)
  // せり（葉と白い根）
  const seri = (x, y, dir) => {
    c.rect(x, y, 1, 5, '#e4e8d8')          // 根
    c.px(x, y + 5, '#c9cfb8')
    c.rect(x, y - 4, 1, 4, '#3f8437')      // 茎
    for (let i = 0; i < 4; i++) {          // 葉
      c.px(x + dir * (1 + (i % 2)), y - 5 - i, '#4f9e46')
      c.px(x - dir * (1 + (i % 2)), y - 6 - i, '#6fc05a')
    }
    c.px(x, y - 9, '#8fd673')
  }
  seri(14, 18, 1)
  seri(22, 15, -1)
  seri(29, 18, 1)
  seri(19, 22, -1)
  seri(33, 20, -1)
  for (let i = 0; i < 26; i++) {
    const a = r() * Math.PI * 2
    const d = r() * 11
    c.px(24 + Math.round(Math.cos(a) * d), 21 + Math.round(Math.sin(a) * d * 0.9),
      r() > 0.5 ? '#4f9e46' : '#6fc05a')
  }
  // 湯気
  for (const [x, y, a] of [[15, 6, 0.5], [16, 3, 0.32], [24, 4, 0.55], [25, 1, 0.3], [33, 7, 0.45]]) {
    c.px(x, y, '#ffffff', a)
  }
  return save('guide-serinabe', c)
}

/* =========================================================
   5. プレビュー（確認用の一覧画像）
   ========================================================= */
function preview(items) {
  const scale = 2
  const pad = 8
  let w = pad
  let h = 0
  items.forEach((c) => { w += c.w * scale + pad; h = Math.max(h, c.h * scale) })
  const out = new Canvas(w, h + pad * 2)
  out.fill('#101828')
  let x = pad
  items.forEach((c) => {
    for (let y = 0; y < c.h * scale; y++) {
      for (let i = 0; i < c.w * scale; i++) {
        const p = c.get(Math.floor(i / scale), Math.floor(y / scale))
        if (p[3] > 0) out.px(x + i, pad + y, p, p[3] / 255)
      }
    }
    x += c.w * scale + pad
  })
  fs.writeFileSync(path.join(OUT, '..', '..', '..', 'preview-art.png'), out.toPNG())
}

const kv = keyVisual()
const terrain = mapTerrain()
const icons = [iconStation(), iconArena(), iconMatsushima(), compass()]
const banners = [bannerDay1(), bannerDay2(), bannerDay3()]
const guides = [guideMatsushima(), guideSendaijo(), guideZuihoden(), guideAkiu(), guideAer(), guideAsaichi(), guideZunda(), guideGyutan(), guideGyutanSet(), guideKaki(), guideKanmi(), guideSerinabe()]
if (process.env.ART_PREVIEW) preview([kv, terrain, ...banners, ...guides, ...icons])
console.log('生成した素材:\n  ' + written.join('\n  '))
