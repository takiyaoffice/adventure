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
  const H = 170
  const c = new Canvas(W, H)

  // 上半分は文字を載せる領域なので、雲や城が入り込まないよう空を広く取る
  const SKY_END = 98
  const SEA_TOP = 100
  const LAND_TOP = 136
  const CASTLE_BASE = 140

  // --- 空 ---
  c.vgradient(0, 0, W, SKY_END + 8, [
    [0, PAL.skyTop],
    [0.34, PAL.skyMid],
    [0.68, PAL.skyLow],
    [1, PAL.skyHorizon],
  ])
  c.disc(122, 22, 12, '#ffffff', 0.05)
  c.disc(122, 22, 7, '#fff6d8', 0.22)

  // --- 雲（文字にかからないよう上部のみ） ---
  cloud(c, 2, 6, 40, 12)
  cloud(c, 106, 4, 48, 13)
  cloud(c, 52, 26, 30, 8, 0.9)
  cloud(c, 0, 38, 24, 7, 0.75)
  cloud(c, 128, 36, 30, 8, 0.8)

  // 鳥
  const bird = (x, y) => {
    c.px(x, y, '#20365e'); c.px(x + 1, y - 1, '#20365e'); c.px(x + 2, y, '#20365e')
    c.px(x + 3, y - 1, '#20365e'); c.px(x + 4, y, '#20365e')
  }
  bird(24, 56); bird(34, 52); bird(42, 58)

  // --- 遠景の山脈（文字の下に収まる高さ） ---
  mountain(c, 14, 104, 18, 16)
  mountain(c, 40, 104, 13, 12)
  mountain(c, 134, 104, 19, 15)
  mountain(c, 110, 104, 12, 10, mix(PAL.mountain, '#ffffff', 0.12), PAL.mountainLight, PAL.snow)
  c.dither(0, SKY_END, W, 6, PAL.skyHorizon, 2)

  // --- 海（仙台湾） ---
  c.vgradient(0, SEA_TOP, W, LAND_TOP - SEA_TOP + 4, [
    [0, '#2a74c8'],
    [0.5, PAL.sea],
    [1, PAL.seaDeep],
  ])
  c.hline(0, SEA_TOP, W, mix(PAL.seaFoam, PAL.sea, 0.4))
  waves(c, 0, SEA_TOP + 2, W, LAND_TOP - SEA_TOP, 91, 0.055)
  for (let y = SEA_TOP + 4; y < LAND_TOP; y += 3) {
    const w = 10 + ((y * 7) % 14)
    c.rect(114 - Math.round((y - SEA_TOP) * 0.6), y, w, 1, PAL.seaFoam, 0.2)
  }

  // --- 城の建つ島 ---
  c.disc(80, CASTLE_BASE + 4, 30, PAL.grassDark)
  c.disc(80, CASTLE_BASE + 2, 28, PAL.grass)
  c.disc(74, CASTLE_BASE, 22, PAL.grassLight)
  c.rect(50, CASTLE_BASE + 2, 60, 8, PAL.grass)
  for (let x = 48; x < 112; x++) {
    const d = Math.abs(x - 80) / 32
    const y = CASTLE_BASE + 2 - Math.round(Math.cos(d * 1.5) * 3)
    c.px(x, y, PAL.sand)
    c.px(x, y + 1, mix(PAL.sand, '#000000', 0.2))
  }

  // --- 城 ---
  wallRun(c, 54, CASTLE_BASE - 9, 52, 9)
  c.rect(76, CASTLE_BASE - 8, 8, 8, mix(PAL.wallShade, '#000000', 0.25))
  c.rect(77, CASTLE_BASE - 7, 6, 7, PAL.window)
  c.rect(78, CASTLE_BASE - 8, 4, 1, PAL.gold)
  tower(c, 59, CASTLE_BASE - 8, 6, 11, 6, { flag: false })
  tower(c, 101, CASTLE_BASE - 8, 6, 11, 6, { flag: false })
  tower(c, 67, CASTLE_BASE - 8, 8, 16, 8)
  tower(c, 93, CASTLE_BASE - 8, 8, 16, 8)
  tower(c, 80, CASTLE_BASE - 10, 14, 22, 11)
  c.rect(74, CASTLE_BASE - 34, 13, 1, PAL.gold)

  // --- 手前の陸地（重なり合う丘） ---
  const hill = (cy, amp, freq, phase, col) => {
    for (let x = 0; x < W; x++) {
      const y = Math.round(cy + Math.sin(x * freq + phase) * amp + Math.sin(x * freq * 2.3 + phase) * (amp * 0.35))
      c.rect(x, y, 1, H - y, col)
    }
  }
  hill(LAND_TOP + 2, 3, 0.09, 0.4, PAL.grass)
  grassTexture(c, 0, LAND_TOP - 2, W, H - LAND_TOP + 2, 12)
  for (let x = 0; x < W; x++) {
    const y = Math.round(LAND_TOP + 2 + Math.sin(x * 0.09 + 0.4) * 3 + Math.sin(x * 0.207 + 0.4) * 1.05)
    c.px(x, y - 1, PAL.sand)
    c.px(x, y, mix(PAL.sand, '#000000', 0.2))
    c.px(x, y - 2, PAL.seaFoam, 0.6)
  }
  hill(LAND_TOP + 13, 4, 0.07, 2.1, PAL.grassDark)
  hill(LAND_TOP + 25, 3, 0.11, 4.2, PAL.forest)
  grassTexture(c, 0, LAND_TOP + 10, W, H - LAND_TOP - 10, 33)

  // 街道
  c.path([[82, LAND_TOP + 4], [74, LAND_TOP + 13], [88, LAND_TOP + 22], [70, LAND_TOP + 30], [80, H]], PAL.roadEdge, 5)
  c.path([[82, LAND_TOP + 4], [74, LAND_TOP + 13], [88, LAND_TOP + 22], [70, LAND_TOP + 30], [80, H]], PAL.road, 3)

  // --- 手前の森 ---
  const r = rng(2024)
  const onRoadKV = (x, y) => {
    const p = c.get(x, y)
    return p[0] > 150 && p[1] > 110 && p[2] < 150 && p[1] < 215
  }
  const plantRow = (y0, y1, size, dark, count) => {
    for (let i = 0; i < count * 8 && count > 0; i++) {
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
  plantRow(LAND_TOP + 1, LAND_TOP + 8, 3, true, 20)
  plantRow(LAND_TOP + 6, LAND_TOP + 15, 4, false, 16)
  plantRow(LAND_TOP + 13, LAND_TOP + 23, 4, true, 18)
  plantRow(LAND_TOP + 20, LAND_TOP + 31, 5, false, 14)
  plantRow(LAND_TOP + 26, H - 3, 6, true, 12)
  for (let i = 0; i < 24; i++) {
    bush(c, Math.round(r() * W), LAND_TOP + Math.round(r() * (H - LAND_TOP)), 1 + Math.round(r() * 1.6), r() > 0.5 ? PAL.forest : PAL.forestLight)
  }

  return save('keyvisual', c)
}

/* =========================================================
   2. マップの地形（アイコンは別素材で重ねる）
   ========================================================= */
// 海岸線: y に対する海の始まる x
const SEA_EDGE = [
  [0, 78], [14, 82], [26, 86], [38, 92], [48, 100], [56, 112],
  [62, 126], [67, 142], [71, 158], [76, 172],
]
function seaEdgeX(y) {
  if (y <= SEA_EDGE[0][0]) return SEA_EDGE[0][1]
  for (let i = 0; i < SEA_EDGE.length - 1; i++) {
    const [y0, x0] = SEA_EDGE[i]
    const [y1, x1] = SEA_EDGE[i + 1]
    if (y >= y0 && y <= y1) return x0 + ((x1 - x0) * (y - y0)) / (y1 - y0)
  }
  return 999
}

function mapTerrain() {
  const W = 160
  const H = 240
  const c = new Canvas(W, H)
  const r = rng(777)

  // --- 大地 ---
  c.fill(PAL.grass)
  grassTexture(c, 0, 0, W, H, 55)
  // 明暗のムラ
  for (let i = 0; i < 26; i++) {
    const x = Math.round(r() * W)
    const y = Math.round(r() * H)
    const rad = 6 + Math.round(r() * 12)
    c.disc(x, y, rad, r() > 0.5 ? PAL.grassLight : PAL.grassDark, 0.28)
  }

  // --- 海 ---
  for (let y = 0; y < H; y++) {
    const ex = Math.round(seaEdgeX(y))
    if (ex >= W) continue
    const jitter = Math.sin(y * 0.55) > 0.3 ? 1 : Math.sin(y * 0.9) < -0.6 ? -1 : 0
    const sx = ex + jitter
    // 砂浜
    c.rect(sx - 2, y, 3, 1, PAL.sand)
    c.rect(sx - 3, y, 1, 1, mix(PAL.sand, PAL.grass, 0.5))
    // 浅瀬 → 深海
    c.rect(sx + 1, y, 4, 1, PAL.seaLight)
    c.rect(sx + 5, y, 6, 1, PAL.sea)
    c.rect(sx + 11, y, W - (sx + 11), 1, PAL.seaDeep)
  }
  waves(c, 76, 0, 84, 176, 31, 0.07)

  // --- 松島の島々 ---
  const isle = (cx, cy, rad) => {
    c.disc(cx, cy + 1, rad, PAL.forest)
    c.disc(cx, cy, rad, PAL.grass)
    c.disc(cx - 1, cy - 1, Math.max(1, rad - 1), PAL.grassLight)
    c.ring(cx, cy + 1, rad + 1, mix(PAL.seaFoam, PAL.sea, 0.35))
  }
  isle(125, 34, 11)
  isle(110, 18, 4)
  isle(143, 22, 5)
  isle(148, 46, 4)
  isle(133, 58, 3)
  isle(104, 40, 3)
  tree(c, 141, 18, 3, true)
  tree(c, 147, 44, 3, true)
  tree(c, 108, 16, 2, true)

  // --- 川 ---
  const river = [[118, 96], [126, 116], [122, 138], [132, 160], [128, 182], [138, 206], [134, 240]]
  c.path(river, mix(PAL.sea, '#000000', 0.25), 6)
  c.path(river, PAL.sea, 4)
  c.path(river, PAL.seaLight, 2)
  // 河口
  c.disc(120, 92, 5, PAL.sea)
  c.disc(120, 92, 3, PAL.seaLight)

  // --- 山地（左と下） ---
  const mt = (cx, by, hw, h) => {
    mountain(c, cx, by, hw, h, '#3f6f38', '#578c46', '#cfe3d2')
  }
  mt(12, 34, 14, 16)
  mt(28, 30, 10, 12)
  mt(10, 212, 16, 18)
  mt(66, 226, 13, 14)
  mt(150, 226, 14, 15)

  // --- 池 ---
  const pond = (cx, cy, rx, ry) => {
    for (let y = -ry; y <= ry; y++) {
      const w = Math.round(rx * Math.sqrt(Math.max(0, 1 - (y * y) / (ry * ry))))
      c.rect(cx - w, cy + y, w * 2 + 1, 1, PAL.sea)
      c.rect(cx - w, cy + y, w * 2 + 1, 1, y < 0 ? PAL.seaLight : PAL.sea)
    }
    c.ring(cx, cy, Math.max(rx, ry), mix(PAL.sand, PAL.grass, 0.4))
  }
  pond(28, 62, 9, 6)
  pond(70, 206, 11, 7)

  // --- 街道（曲がりくねった道） ---
  const ROADS = [
    [[40, 32], [46, 40], [55, 44], [62, 52], [70, 57], [79, 65]],
    [[79, 65], [70, 70], [62, 74], [54, 82], [46, 87], [40, 93]],
    [[79, 65], [90, 68], [99, 75], [110, 82], [118, 88], [125, 93]],
    [[40, 93], [36, 102], [39, 112], [36, 122], [40, 128], [44, 134]],
    [[125, 93], [124, 100], [118, 105], [116, 112], [114, 117]],
    [[114, 117], [110, 124], [115, 132], [117, 141], [120, 149]],
    [[44, 134], [58, 139], [72, 137], [86, 143], [100, 147], [110, 145], [120, 149]],
    [[44, 134], [38, 145], [43, 156], [38, 168], [40, 179]],
    [[40, 179], [52, 187], [66, 189], [80, 184], [93, 179]],
    [[93, 179], [104, 174], [110, 164], [116, 156], [120, 149]],
    [[79, 65], [86, 76], [92, 88], [100, 98], [106, 108], [114, 117]],
    [[93, 179], [99, 192], [94, 206], [88, 218], [86, 228]],
  ]
  ROADS.forEach((pts) => c.path(pts, PAL.roadEdge, 4))
  ROADS.forEach((pts) => c.path(pts, PAL.road, 2))

  // --- 森（クラスタ状に密生させる） ---
  const isSea = (x, y) => x >= seaEdgeX(y) - 3
  const nodes = [[40, 32], [79, 65], [40, 93], [125, 93], [114, 117], [44, 134], [120, 149], [40, 179], [93, 179], [125, 34]]
  const nearNode = (x, y) => nodes.some(([nx, ny]) => Math.abs(nx - x) < 15 && Math.abs(ny - y) < 15)
  const blocked = (x, y) => {
    const p = c.get(x, y)
    if (p[3] === 0) return true
    const isRoad = p[0] > 150 && p[1] > 110 && p[2] < 160
    const isWater = p[2] > 120 && p[2] > p[1] + 20
    return isRoad || isWater
  }
  const canPlant = (x, y, size) => {
    if (isSea(x + size, y + size) || nearNode(x + size, y + size)) return false
    for (let dy = -1; dy <= size + 1; dy++) {
      for (let dx = -1; dx <= size * 2; dx++) if (blocked(x + dx, y + dy)) return false
    }
    return true
  }
  // 森のかたまり
  const clusters = [
    [16, 12], [58, 20], [92, 26], [16, 56], [62, 96], [92, 128], [20, 116], [66, 118],
    [18, 150], [70, 160], [104, 196], [24, 200], [54, 226], [116, 214], [136, 178],
    [8, 78], [100, 58], [140, 120], [62, 48], [30, 164],
  ]
  clusters.forEach(([cx, cy], ci) => {
    const cr = rng(500 + ci)
    for (let i = 0; i < 90; i++) {
      const x = cx + Math.round((cr() - 0.5) * 30)
      const y = cy + Math.round((cr() - 0.5) * 30)
      const size = cr() < 0.25 ? 2 : cr() < 0.75 ? 3 : 4
      if (x < 0 || y < 0 || x > W - 8 || y > H - 8) continue
      if (!canPlant(x, y, size)) continue
      tree(c, x, y, size, cr() > 0.35)
    }
  })
  // まばらな単木
  for (let i = 0; i < 2200; i++) {
    const x = Math.round(r() * (W - 8))
    const y = Math.round(r() * (H - 8))
    const size = r() < 0.5 ? 2 : 3
    if (!canPlant(x, y, size)) continue
    tree(c, x, y, size, r() > 0.45)
  }
  // 草むら
  for (let i = 0; i < 260; i++) {
    const x = Math.round(r() * W)
    const y = Math.round(r() * H)
    if (isSea(x, y) || blocked(x, y)) continue
    c.px(x, y, PAL.grassDark)
    c.px(x + 1, y - 1, PAL.grassLight)
  }
  return save('map-terrain', c)
}

/* =========================================================
   3. マップのロケーションアイコン（24x24）
   ========================================================= */
const ICON = 24
function iconCanvas() {
  return new Canvas(ICON, ICON)
}
/* アイコン下部の影 */
function shadow(c, cy = 21, w = 7) {
  for (let i = -w; i <= w; i++) {
    const a = 0.3 * (1 - Math.abs(i) / (w + 1))
    c.px(12 + i, cy, '#06210c', a)
    c.px(12 + i, cy + 1, '#06210c', a * 0.5)
  }
  return c
}

function iconStation() {
  const c = iconCanvas()
  shadow(c)
  // 本体
  c.rect(4, 10, 16, 11, PAL.wall)
  c.rect(4, 10, 1, 11, mix(PAL.wall, '#ffffff', 0.6))
  c.rect(19, 10, 1, 11, PAL.wallShade)
  c.rect(4, 20, 16, 1, PAL.wallShade)
  // 屋根
  for (let j = 0; j < 4; j++) c.rect(3 + j, 6 + j, 18 - j * 2, 1, j === 0 ? PAL.roofLight : PAL.roof)
  c.rect(2, 9, 20, 2, PAL.roofDark)
  c.rect(2, 9, 20, 1, PAL.roof)
  // 中央の塔屋
  tower(c, 12, 7, 7, 5, 4, { flag: false })
  c.rect(11, 3, 3, 1, PAL.gold)
  // アーチの入口
  c.rect(10, 15, 5, 6, PAL.window)
  c.rect(11, 14, 3, 1, PAL.window)
  c.rect(11, 15, 3, 1, mix(PAL.window, '#ffffff', 0.25))
  // 窓
  ;[6, 16].forEach((x) => {
    c.rect(x, 13, 3, 3, PAL.window)
    c.px(x, 13, PAL.gold)
    c.px(x + 2, 15, mix(PAL.window, '#ffffff', 0.4))
  })
  c.rect(5, 17, 2, 2, PAL.gold)
  c.rect(18, 17, 2, 2, PAL.gold)
  return save('loc-station', c)
}

function iconZuihoden() {
  const c = iconCanvas()
  shadow(c)
  // 石段
  c.rect(6, 19, 13, 1, '#b9b4a4')
  c.rect(7, 20, 11, 1, '#9a9585')
  // 本体（朱塗り）
  c.rect(6, 12, 13, 7, PAL.red)
  c.rect(6, 12, 1, 7, mix(PAL.red, '#ffffff', 0.35))
  c.rect(18, 12, 1, 7, PAL.redDark)
  c.rect(10, 14, 5, 5, '#2a1830')
  c.rect(11, 15, 3, 1, PAL.gold)
  // 大屋根
  japaneseRoof(c, 12, 6, 10, 6, '#33405f', PAL.gold)
  japaneseRoof(c, 12, 10, 8, 3, '#2b3550', PAL.gold)
  // 千木・鰹木
  c.rect(11, 3, 3, 2, PAL.gold)
  c.px(10, 4, PAL.gold)
  c.px(14, 4, PAL.gold)
  // 灯籠
  c.rect(4, 16, 2, 4, '#b9b4a4')
  c.rect(19, 16, 2, 4, '#b9b4a4')
  c.px(4, 15, PAL.gold)
  c.px(20, 15, PAL.gold)
  return save('loc-zuihoden', c)
}

function iconMatsushima() {
  const c = iconCanvas()
  // 海
  c.disc(12, 19, 10, PAL.sea, 0.9)
  c.disc(12, 19, 8, PAL.seaLight, 0.9)
  c.rect(2, 20, 20, 3, PAL.sea)
  // 島
  c.disc(12, 16, 8, PAL.forest)
  c.disc(12, 15, 7, PAL.grass)
  c.disc(10, 14, 5, PAL.grassLight)
  c.rect(4, 17, 17, 3, PAL.grass)
  c.rect(4, 19, 17, 1, mix(PAL.sand, '#000000', 0.1))
  // 松
  tree(c, 3, 11, 3, true)
  tree(c, 18, 12, 3, true)
  // 社殿
  c.rect(9, 12, 7, 5, '#f0ece0')
  c.rect(9, 12, 1, 5, '#ffffff')
  japaneseRoof(c, 12, 8, 7, 4, PAL.red, PAL.gold)
  c.rect(11, 14, 3, 3, '#2a1830')
  // 鳥居
  c.rect(4, 14, 1, 5, PAL.red)
  c.rect(7, 14, 1, 5, PAL.red)
  c.rect(3, 13, 6, 1, PAL.red)
  c.rect(4, 15, 4, 1, PAL.red)
  // 波
  c.rect(2, 21, 3, 1, PAL.seaFoam)
  c.rect(8, 22, 4, 1, PAL.seaFoam)
  c.rect(16, 21, 4, 1, PAL.seaFoam)
  return save('loc-matsushima', c)
}

function iconGyutan() {
  const c = iconCanvas()
  shadow(c, 21, 9)
  // 木の皿
  c.disc(12, 17, 10, '#3a2a1c')
  c.disc(12, 16, 10, '#6b4a2c')
  c.disc(12, 16, 8, '#8a6138')
  c.disc(12, 15, 7, '#a07747')
  c.ring(12, 16, 10, '#2a1c12')
  // 牛たん（楕円のスライス）
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
    // 焼き目
    c.rect(cx - rx + 2, cy - 1, rx * 2 - 3, 1, '#7a3020')
    c.rect(cx - rx + 2, cy + 1, rx * 2 - 3, 1, '#8c3a26')
    c.px(cx - 2, cy - ry + 1, '#d98c66')
  }
  slice(7, 16, 5, 3)
  slice(17, 16, 5, 3)
  slice(12, 12, 6, 3)
  // レモン
  c.disc(20, 10, 3, '#f2d24e')
  c.disc(20, 10, 2, '#fbe98a')
  c.px(20, 10, '#f2d24e')
  // 湯気
  c.px(8, 6, '#ffffff', 0.45)
  c.px(9, 4, '#ffffff', 0.35)
  c.px(7, 2, '#ffffff', 0.25)
  c.px(15, 6, '#ffffff', 0.45)
  c.px(14, 4, '#ffffff', 0.35)
  c.px(16, 2, '#ffffff', 0.25)
  return save('loc-gyutan', c)
}

function iconLive() {
  const c = iconCanvas()
  shadow(c, 21, 9)
  // ステージ背面
  c.rect(2, 4, 20, 14, PAL.night)
  c.rect(2, 4, 20, 1, PAL.purpleLight)
  c.rect(2, 4, 1, 14, PAL.purple)
  c.rect(21, 4, 1, 14, PAL.purple)
  // スポットライト
  for (let j = 0; j < 11; j++) {
    const w = 3 + j
    c.rect(12 - Math.floor(w / 2), 5 + j, w, 1, '#ffffff', 0.16 + j * 0.012)
  }
  // 星
  const r = rng(42)
  for (let i = 0; i < 16; i++) {
    const x = 3 + Math.round(r() * 18)
    const y = 5 + Math.round(r() * 9)
    c.px(x, y, r() > 0.5 ? '#ffffff' : PAL.magenta, 0.6 + r() * 0.4)
  }
  // アーティスト
  c.rect(11, 9, 2, 5, '#ffffff')
  c.px(11, 8, '#ffe9b0')
  c.px(12, 8, '#ffe9b0')
  c.px(10, 10, '#ffffff')
  c.px(13, 9, '#ffffff')
  // 客席シルエット
  for (let i = 0; i < 9; i++) {
    const x = 3 + i * 2
    const h = 2 + ((i * 5) % 3)
    c.rect(x, 18 - h, 2, h + 1, '#0b0718')
    c.px(x, 17 - h, '#0b0718')
  }
  // ステージ床
  c.rect(1, 18, 22, 3, '#241a42')
  c.rect(1, 18, 22, 1, PAL.purpleLight)
  c.rect(1, 20, 22, 1, '#120c26')
  return save('loc-live', c)
}

function iconUnknown(name, kind) {
  const c = iconCanvas()
  shadow(c, 21, 7)
  const dark = '#1e2a3d'
  const darker = '#141d2c'
  const edge = '#2d3c55'
  if (kind === 'castle') {
    c.rect(5, 10, 14, 11, dark)
    c.rect(5, 10, 1, 11, edge)
    c.rect(18, 10, 1, 11, darker)
    for (let j = 0; j < 4; j++) c.rect(4 + j, 6 + j, 16 - j * 2, 1, j === 0 ? edge : dark)
    c.rect(3, 9, 18, 2, darker)
    c.rect(9, 1, 6, 6, dark)
    for (let j = 0; j < 3; j++) c.rect(9 - j, 3 + j, 6 + j * 2, 1, dark)
    c.rect(10, 14, 4, 7, darker)
    c.rect(7, 13, 2, 2, '#38496a')
    c.rect(15, 13, 2, 2, '#38496a')
  } else {
    // 小さな祠
    c.rect(6, 12, 12, 9, dark)
    c.rect(6, 12, 1, 9, edge)
    c.rect(17, 12, 1, 9, darker)
    for (let j = 0; j < 5; j++) c.rect(3 + j, 7 + j, 18 - j * 2, 1, j === 0 ? edge : dark)
    c.rect(10, 15, 4, 6, darker)
    c.rect(7, 14, 2, 2, '#38496a')
    c.rect(15, 14, 2, 2, '#38496a')
  }
  return save(name, c)
}

/* =========================================================
   4. スケジュールのサムネイル（40x40）
   ========================================================= */
function thumbDay1() {
  const c = new Canvas(40, 40)
  c.vgradient(0, 0, 40, 26, [[0, PAL.skyTop], [0.5, PAL.skyMid], [1, PAL.skyHorizon]])
  cloud(c, 1, 3, 14, 5)
  cloud(c, 24, 8, 15, 5, 0.9)
  mountain(c, 6, 27, 9, 10)
  mountain(c, 33, 27, 9, 9)
  c.rect(0, 26, 40, 4, PAL.sea)
  c.rect(0, 26, 40, 1, PAL.seaFoam)
  waves(c, 0, 27, 40, 3, 5, 0.12)
  c.rect(0, 29, 40, 11, PAL.grass)
  grassTexture(c, 0, 29, 40, 11, 8)
  c.rect(0, 29, 40, 1, PAL.sand)
  // 城
  wallRun(c, 12, 24, 16, 6)
  c.rect(19, 25, 3, 5, PAL.window)
  tower(c, 14, 25, 5, 8, 5, { flag: false })
  tower(c, 26, 25, 5, 8, 5, { flag: false })
  tower(c, 20, 26, 7, 13, 7)
  // 森
  tree(c, 1, 31, 3, true)
  tree(c, 6, 34, 3)
  tree(c, 32, 32, 3, true)
  tree(c, 36, 35, 3)
  c.path([[20, 30], [16, 35], [22, 40]], PAL.road, 2)
  return save('thumb-day1', c)
}

function thumbDay2() {
  const c = new Canvas(40, 40)
  c.vgradient(0, 0, 40, 40, [[0, '#1a0f3a'], [0.5, '#2c1a5e'], [1, '#0d0722']])
  const r = rng(9)
  for (let i = 0; i < 40; i++) {
    const x = Math.round(r() * 39)
    const y = Math.round(r() * 26)
    c.px(x, y, r() > 0.6 ? PAL.magenta : '#ffffff', 0.4 + r() * 0.6)
  }
  // スポットライト2本
  for (let j = 0; j < 22; j++) {
    const w = 2 + j
    c.rect(14 - Math.floor(w / 2), j, w, 1, '#ffffff', 0.03 + j * 0.005)
    const w2 = 2 + Math.round(j * 0.8)
    c.rect(27 - Math.floor(w2 / 2), j, w2, 1, PAL.magenta, 0.03 + j * 0.005)
  }
  // ステージの光
  c.disc(20, 24, 9, '#ffffff', 0.14)
  c.disc(20, 24, 5, '#fff3c4', 0.22)
  // アーティスト
  c.rect(19, 19, 3, 7, '#ffffff')
  c.rect(19, 17, 3, 2, '#ffe9b0')
  c.rect(17, 20, 2, 1, '#ffffff')
  c.rect(22, 18, 2, 1, '#ffffff')
  c.px(24, 17, '#ffffff')
  // 客席
  for (let i = 0; i < 20; i++) {
    const x = i * 2
    const h = 4 + ((i * 7) % 4)
    c.rect(x, 40 - h - 2, 2, h + 2, '#080416')
    c.px(x, 38 - h - 1, '#080416')
    if (i % 3 === 0) c.px(x, 36 - h, PAL.magenta, 0.8)
  }
  c.rect(0, 28, 40, 1, PAL.purpleLight, 0.7)
  return save('thumb-day2', c)
}

function thumbDay3() {
  const c = new Canvas(40, 40)
  c.vgradient(0, 0, 40, 22, [[0, '#1d5ab4'], [0.6, PAL.skyLow], [1, PAL.skyHorizon]])
  cloud(c, 2, 2, 14, 5)
  cloud(c, 25, 5, 14, 5, 0.9)
  c.rect(0, 22, 40, 18, PAL.sea)
  c.vgradient(0, 22, 40, 18, [[0, PAL.seaLight], [0.5, PAL.sea], [1, PAL.seaDeep]])
  c.hline(0, 22, 40, PAL.seaFoam)
  waves(c, 0, 24, 40, 15, 17, 0.1)
  // 松島の島
  const isle = (cx, cy, rad) => {
    c.disc(cx, cy + 1, rad, PAL.forest)
    c.disc(cx, cy, rad, PAL.grass)
    c.disc(cx - 1, cy - 1, Math.max(1, rad - 1), PAL.grassLight)
    c.ring(cx, cy + 1, rad + 1, PAL.seaFoam)
  }
  isle(5, 24, 4)
  isle(33, 26, 5)
  isle(19, 27, 9)
  tree(c, 3, 19, 3, true)
  tree(c, 31, 21, 3, true)
  tree(c, 9, 22, 3, true)
  tree(c, 27, 24, 3, true)
  // 五大堂
  c.rect(16, 22, 7, 5, '#f0ece0')
  japaneseRoof(c, 19, 18, 7, 4, PAL.red, PAL.gold)
  c.rect(18, 24, 3, 3, '#2a1830')
  // 鳥居
  c.rect(11, 27, 1, 5, PAL.red)
  c.rect(14, 27, 1, 5, PAL.red)
  c.rect(10, 26, 6, 1, PAL.red)
  c.rect(11, 28, 4, 1, PAL.red)
  return save('thumb-day3', c)
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
const icons = [iconStation(), iconZuihoden(), iconMatsushima(), iconGyutan(), iconLive(), iconUnknown('loc-unknown', 'castle'), iconUnknown('loc-unknown-small', 'shrine')]
const thumbs = [thumbDay1(), thumbDay2(), thumbDay3()]
if (process.env.ART_PREVIEW) preview([kv, terrain, ...thumbs, ...icons])
console.log('生成した素材:\n  ' + written.join('\n  '))
