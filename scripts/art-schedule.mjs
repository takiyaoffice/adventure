// スケジュール画面の各予定に添えるドット絵アイコン（40x40）。
// 枠線と角丸は CSS 側でつけるので、ここでは絵だけを端から端まで描く。
import { Canvas, mix, rng } from './pixel.mjs'
import { PAL, cloud, mountain, tree, waves, grassTexture, sparkle } from './art-parts.mjs'

export const EW = 40

const S = {
  daySky: [[0, '#1f63c2'], [0.5, '#4f96dd'], [1, '#a7d6f2']],
  duskSky: [[0, '#243a7e'], [0.45, '#8a5aa8'], [0.8, '#e08a5c'], [1, '#f6c98a']],
  nightSky: [[0, '#0d0a28'], [0.55, '#1e1550'], [1, '#2f2168']],
  room: [[0, '#2a1c3f'], [1, '#160f28']],
}

function tile(stops) {
  const c = new Canvas(EW, EW)
  c.vgradient(0, 0, EW, EW, stops)
  return c
}

/** 星をまばらに撒く */
function stars(c, count, maxY, seed) {
  const r = rng(seed)
  for (let i = 0; i < count; i++) {
    c.px(Math.round(r() * EW), Math.round(r() * maxY), '#ffffff', 0.35 + r() * 0.6)
  }
}

/* ---------------- DAY1 ---------------- */

/** 朝：新幹線で仙台へ */
function trainDay() {
  const c = tile(S.daySky)
  cloud(c, 1, 3, 13, 4)
  cloud(c, 23, 1, 15, 5)
  cloud(c, 14, 9, 11, 4, 0.8)
  mountain(c, 7, 24, 9, 9)
  mountain(c, 28, 24, 11, 10)
  c.dither(0, 21, EW, 4, PAL.skyHorizon, 2)
  // 田んぼと高架
  c.rect(0, 24, EW, EW - 24, '#3f7f3c')
  grassTexture(c, 0, 24, EW, EW - 24, 9)
  c.rect(0, 31, EW, 5, '#8e97ab')
  c.rect(0, 31, EW, 1, '#c3cbdb')
  c.rect(0, 35, EW, 1, '#555d70')
  for (let x = 3; x < EW; x += 8) c.rect(x, 36, 3, 4, '#6b7488')
  // 車体（右向き、先端がなだらかに下がる）
  const top = 17
  const bottom = 31
  for (let x = 1; x < 39; x++) {
    const t = x <= 26 ? 0 : (x - 26) / 13
    const y = top + Math.round(Math.pow(t, 1.6) * 7)
    c.rect(x, y, 1, bottom - y, '#eef3fa')
    c.px(x, y, '#ffffff')
    c.px(x, y + 1, '#ffffff')
  }
  // 青帯
  for (let x = 1; x < 39; x++) {
    const t = x <= 26 ? 0 : (x - 26) / 13
    const y = top + Math.round(Math.pow(t, 1.6) * 7)
    c.rect(x, y + 4, 1, 2, '#2f6fd0')
    c.px(x, y + 6, '#1c4a9c')
  }
  // 窓
  for (let x = 3; x < 25; x += 5) c.rect(x, top + 2, 3, 2, '#17284e')
  c.rect(31, top + 5, 4, 2, '#17284e')
  // 足回り
  c.rect(1, bottom, 34, 1, '#4a5166')
  c.rect(6, bottom, 5, 2, '#2c3145')
  c.rect(20, bottom, 5, 2, '#2c3145')
  return c
}

/** 昼：仙台に着いてお昼ごはん（牛たん定食） */
function gyutan() {
  const c = tile([[0, '#41301f'], [1, '#20160e']])
  // 木のテーブル
  c.rect(0, 24, EW, EW - 24, '#5c3d22')
  c.rect(0, 24, EW, 1, '#7d5630')
  for (let y = 28; y < EW; y += 5) c.hline(0, y, EW, '#4a3019', 0.6)
  // 炭火の七輪
  c.rect(4, 14, 32, 12, '#2b2119')
  c.rect(4, 14, 32, 1, '#4d3c2a')
  c.rect(5, 16, 30, 8, '#130d08')
  const r = rng(41)
  for (let i = 0; i < 80; i++) {
    c.px(6 + Math.round(r() * 28), 17 + Math.round(r() * 6),
      ['#f05a1e', '#f79338', '#c22f10', '#ffca63'][Math.floor(r() * 4)], 0.9)
  }
  for (let x = 5; x < 36; x += 3) c.vline(x, 16, 8, '#8b93a3', 0.55)
  // 厚切り牛たん3枚（角を落とした楕円）
  const slice = (x, y, w, h) => {
    c.rect(x + 1, y, w - 2, h, '#8e3f33')
    c.rect(x, y + 1, w, h - 2, '#8e3f33')
    c.rect(x + 2, y + 1, w - 4, 1, '#ac5c4d')
    c.rect(x + 1, y + h - 1, w - 2, 1, '#5a241e')
    c.line(x + 3, y + h - 2, x + w - 4, y + 1, '#55201a')
    c.line(x + 6, y + h - 2, x + w - 2, y + 2, '#55201a')
  }
  slice(6, 12, 13, 7)
  slice(21, 14, 13, 7)
  slice(13, 21, 14, 7)
  // 添えの小鉢（テールスープ）
  c.disc(31, 33, 6, '#2c3242')
  c.disc(31, 32, 5, '#c98f43')
  c.disc(31, 31, 4, '#e3ad57')
  c.rect(27, 36, 9, 1, '#1f2431')
  // 湯気
  for (let i = 0; i < 3; i++) {
    const x = 10 + i * 10
    for (let j = 0; j < 4; j++) c.px(x + (j % 2), 9 - j * 3, '#ffffff', 0.28 - j * 0.05)
  }
  sparkle(c, 34, 8, PAL.gold, 0.8)
  return c
}

/** 夕：仙台の街を散策（アーケードと街路樹） */
function citywalk() {
  const c = tile(S.duskSky)
  stars(c, 10, 10, 5)
  // ビル群
  const build = (x, w, h, col, lit) => {
    c.rect(x, EW - 13 - h, w, h + 13, col)
    for (let y = EW - 11 - h; y < EW - 15; y += 3) {
      for (let i = 1; i < w - 1; i += 3) c.px(x + i, y, lit ? '#ffd98a' : '#6a6f96', lit ? 0.9 : 0.5)
    }
  }
  build(0, 9, 14, '#2d2b52', true)
  build(9, 7, 20, '#25234a', false)
  build(16, 8, 11, '#332f58', true)
  build(24, 6, 17, '#282552', false)
  build(30, 10, 13, '#2f2c55', true)
  // 通り
  c.rect(0, EW - 13, EW, 13, '#3a3554')
  c.rect(0, EW - 13, EW, 1, '#524c72')
  for (let x = 2; x < EW; x += 7) c.rect(x, EW - 6, 4, 1, '#6c658c', 0.7)
  // 街路樹とイルミネーション
  const lightTree = (x, y) => {
    c.rect(x + 2, y + 4, 2, 6, '#4a3320')
    c.disc(x + 3, y + 2, 4, '#1f5a34')
    c.disc(x + 2, y + 1, 3, '#2b7444')
    const r2 = rng(x * 17 + 3)
    for (let i = 0; i < 9; i++) {
      c.px(x - 1 + Math.round(r2() * 8), y - 2 + Math.round(r2() * 7), '#ffe6a8', 0.9)
    }
  }
  lightTree(2, 21)
  lightTree(15, 19)
  lightTree(30, 22)
  // 歩く2人のシルエット
  c.rect(19, 30, 2, 6, '#141225')
  c.disc(19, 29, 1, '#141225')
  c.rect(23, 31, 2, 5, '#141225')
  c.disc(23, 30, 1, '#141225')
  return c
}

/** 夜：あたたかい鍋 */
function hotpot() {
  const c = tile([[0, '#2c2038'], [1, '#150f20']])
  // テーブル
  c.rect(0, 28, EW, 12, '#4a2f1d')
  c.rect(0, 28, EW, 1, '#6b452a')
  // 土鍋
  c.disc(20, 27, 14, '#20242f')
  c.rect(6, 20, 28, 8, '#2b303d')
  c.rect(6, 20, 28, 1, '#3d4453')
  c.rect(3, 22, 4, 3, '#2b303d')
  c.rect(33, 22, 4, 3, '#2b303d')
  // だしと具
  c.disc(20, 20, 12, '#c9963f')
  c.disc(20, 19, 11, '#e0b055')
  c.rect(9, 20, 22, 3, '#d9a648')
  // せり・きのこ・肉
  const r = rng(63)
  for (let i = 0; i < 16; i++) {
    const x = 10 + Math.round(r() * 20)
    const y = 15 + Math.round(r() * 7)
    c.rect(x, y, 2, 1, i % 3 === 0 ? '#4f9b3c' : '#68c04a')
    c.px(x + 2, y - 1, '#7fd45c')
  }
  c.rect(13, 17, 5, 3, '#9a4a38')
  c.rect(13, 17, 5, 1, '#b86149')
  c.rect(24, 19, 5, 3, '#f0ead6')
  c.rect(24, 19, 5, 1, '#ffffff')
  c.disc(20, 16, 2, '#d8cfae')
  // 湯気
  for (let i = 0; i < 3; i++) {
    const x = 11 + i * 9
    for (let j = 0; j < 5; j++) {
      c.px(x + (j % 2), 13 - j * 3, '#ffffff', 0.3 - j * 0.05)
    }
  }
  return c
}

/* ---------------- DAY2 ---------------- */

/** 朝：仙台朝市 */
function market() {
  const c = tile([[0, '#7fb8e4'], [1, '#d9ecf8']])
  // 奥の建物
  c.rect(0, 8, EW, 12, '#8e9bb4')
  for (let x = 2; x < EW; x += 6) c.rect(x, 10, 3, 4, '#63708c')
  c.rect(0, 19, EW, 2, '#5d6880')
  // テント屋根（赤白ストライプ）
  for (let x = 0; x < EW; x++) {
    c.rect(x, 14, 1, 6, Math.floor(x / 4) % 2 === 0 ? '#d8423f' : '#f5f0e2')
  }
  c.rect(0, 20, EW, 1, '#9c2a2c')
  c.rect(0, 13, EW, 1, '#b0332f')
  // 支柱
  c.rect(4, 20, 2, 10, '#6b6152')
  c.rect(34, 20, 2, 10, '#6b6152')
  // 台
  c.rect(0, 29, EW, 3, '#7d5a34')
  c.rect(0, 29, EW, 1, '#9c7343')
  c.rect(0, 32, EW, 8, '#4d3a22')
  // 並ぶ野菜・魚
  const crate = (x, col, col2) => {
    c.rect(x, 24, 9, 5, '#8a6a3e')
    c.rect(x, 24, 9, 1, '#a8854f')
    for (let i = 0; i < 4; i++) {
      c.disc(x + 2 + i * 2, 23, 1, i % 2 ? col : col2)
    }
  }
  crate(1, '#e05a2a', '#f08a3c')
  crate(11, '#4f9b3c', '#68c04a')
  crate(21, '#d8423f', '#ec6a5a')
  crate(31, '#e8d05a', '#f5e690')
  // 買い物客
  c.rect(14, 33, 3, 7, '#22283f')
  c.disc(15, 32, 1, '#22283f')
  c.rect(24, 34, 3, 6, '#22283f')
  c.disc(25, 33, 1, '#22283f')
  return c
}

/** 昼：自由行動（分かれ道の道しるべ） */
function signpost() {
  const c = tile(S.daySky)
  cloud(c, 2, 2, 14, 5)
  cloud(c, 26, 5, 13, 4, 0.85)
  mountain(c, 32, 22, 10, 8)
  // 草原
  c.rect(0, 22, EW, EW - 22, PAL.grass)
  c.rect(0, 22, EW, 1, PAL.grassLight)
  grassTexture(c, 0, 23, EW, EW - 23, 17)
  // 二股の道
  c.path([[20, 40], [20, 32], [8, 24]], PAL.roadEdge, 6)
  c.path([[20, 40], [20, 32], [33, 24]], PAL.roadEdge, 6)
  c.path([[20, 40], [20, 32], [8, 24]], PAL.road, 4)
  c.path([[20, 40], [20, 32], [33, 24]], PAL.road, 4)
  // 道しるべ
  c.rect(19, 12, 2, 20, '#6b4a26')
  c.rect(19, 12, 1, 20, '#8a6234')
  const board = (x, y, w, col) => {
    c.rect(x, y, w, 5, col)
    c.rect(x, y, w, 1, mix(col, '#ffffff', 0.3))
    c.rect(x, y + 4, w, 1, mix(col, '#000000', 0.3))
    for (let i = 1; i < w - 2; i += 3) c.rect(x + i, y + 2, 2, 1, '#3a2a16')
  }
  board(5, 13, 14, '#d8a24e')
  board(21, 20, 14, '#c98f43')
  // 小さな木
  tree(c, 2, 26, 3, true)
  tree(c, 34, 30, 3, false)
  return c
}

/** 夕：ライブ会場 */
function live() {
  const c = tile(S.nightSky)
  stars(c, 34, 22, 91)
  // スポットライト
  const beam = (topX, botX, col, base) => {
    for (let y = 0; y < 26; y++) {
      const t = y / 26
      const cx = topX + (botX - topX) * t
      const w = 1 + Math.round(t * 9)
      c.rect(Math.round(cx - w / 2), y, w, 1, col, base + t * 0.12)
    }
  }
  beam(8, 16, '#ffffff', 0.05)
  beam(32, 24, PAL.magenta, 0.05)
  beam(20, 20, '#a9d8ff', 0.06)
  // ステージ
  c.rect(0, 26, EW, 6, '#2a1a58')
  c.rect(0, 26, EW, 1, '#5b3ea8')
  c.disc(20, 26, 9, '#fff3c4', 0.18)
  // アーティスト
  c.rect(19, 18, 3, 9, '#ffffff')
  c.rect(19, 15, 3, 3, '#ffe9b0')
  c.rect(19, 14, 3, 1, '#6b4320')
  c.rect(22, 16, 2, 4, '#ffffff')
  c.rect(23, 14, 1, 3, '#ffffff')
  c.disc(24, 13, 1, '#fff3c4')
  // 客席
  for (let i = 0; i < 8; i++) {
    const x = i * 5 - 1
    const h = 8 + ((i * 5) % 4)
    const topY = EW - h
    c.rect(x, topY + 2, 4, h, '#080419')
    c.disc(x + 1, topY, 2, '#080419')
    if (i % 3 === 1) {
      c.rect(x - 1, topY - 4, 1, 5, '#080419')
      c.px(x - 1, topY - 5, i % 2 === 0 ? PAL.magenta : '#a9d8ff')
    }
  }
  return c
}

/** 夜：ホテルへ */
function hotel() {
  const c = tile(S.nightSky)
  stars(c, 26, 18, 13)
  c.disc(33, 7, 4, '#f7f0c8')
  c.disc(31, 6, 3, '#1e1550')
  // 建物
  c.rect(6, 10, 28, 30, '#2b3350')
  c.rect(6, 10, 28, 1, '#465174')
  c.rect(6, 10, 1, 30, '#3a4468')
  for (let y = 13; y < 32; y += 4) {
    for (let x = 9; x < 32; x += 5) {
      const lit = (x + y) % 3 !== 0
      c.rect(x, y, 3, 2, lit ? '#ffd98a' : '#1b2138')
      if (lit) c.px(x + 1, y, '#fff3c4')
    }
  }
  // 入口
  c.rect(16, 33, 8, 7, '#12182c')
  c.rect(16, 33, 8, 1, PAL.gold)
  c.rect(17, 35, 6, 5, '#ffe6a8', 0.85)
  c.rect(13, 31, 14, 2, '#d8423f')
  c.rect(13, 31, 14, 1, '#ec6a5a')
  // 灯りのにじみ
  c.disc(20, 37, 8, '#ffd98a', 0.12)
  return c
}

/* ---------------- DAY3 ---------------- */

/** 朝：ゆっくり起きて朝食 */
function sunrise() {
  const c = tile([[0, '#2a55a8'], [0.4, '#7f8fd8'], [0.7, '#f2a55c'], [1, '#ffd98a']])
  // 朝日
  c.disc(20, 26, 9, '#ffe9a8')
  c.disc(20, 26, 7, '#ffd25c')
  c.disc(20, 26, 4, '#fff3c4')
  for (let i = 0; i < 4; i++) c.hline(8, 20 + i * 4, 24, '#ffe9a8', 0.25)
  // 雲
  cloud(c, 1, 5, 14, 4, 0.9)
  cloud(c, 25, 2, 14, 5, 0.9)
  cloud(c, 12, 12, 12, 4, 0.7)
  // 海
  c.vgradient(0, 27, EW, EW - 27, [[0, '#3f7fc8'], [0.5, '#22579e'], [1, '#12376e']])
  c.hline(0, 27, EW, '#ffd98a', 0.8)
  waves(c, 0, 29, EW, EW - 29, 23, 0.09)
  // 光の道
  for (let y = 28; y < EW; y++) {
    const w = 2 + Math.round((y - 28) * 0.7)
    c.rect(20 - Math.round(w / 2), y, w, 1, '#ffe9a8', 0.28)
  }
  // 鳥
  ;[[6, 12], [11, 9], [31, 14]].forEach(([x, y]) => {
    c.px(x, y, '#20365e'); c.px(x + 1, y - 1, '#20365e'); c.px(x + 2, y, '#20365e')
  })
  return c
}

/** 昼：松島 */
function matsushima() {
  const c = tile([[0, '#2a6fc4'], [0.55, '#6fb0e2'], [1, '#bfe3f7']])
  cloud(c, 1, 2, 14, 5)
  cloud(c, 26, 4, 13, 4, 0.9)
  ;[[14, 10], [20, 8]].forEach(([x, y]) => {
    c.px(x, y, '#20365e'); c.px(x + 1, y - 1, '#20365e'); c.px(x + 2, y, '#20365e')
    c.px(x + 3, y - 1, '#20365e'); c.px(x + 4, y, '#20365e')
  })
  // 海
  c.vgradient(0, 17, EW, EW - 17, [[0, '#4e9ade'], [0.4, PAL.sea], [1, '#0e3a82']])
  c.hline(0, 17, EW, PAL.seaFoam)
  waves(c, 0, 19, EW, EW - 19, 31, 0.09)
  // 岩の島（岩肌＋松）
  const isle = (cx, waterY, halfW, height, pine) => {
    for (let x = cx - halfW; x <= cx + halfW; x++) {
      const t = Math.abs(x - cx) / halfW
      const top = waterY - Math.max(1, Math.round(Math.pow(1 - t * t, 0.5) * height))
      c.rect(x, top, 1, waterY - top + 1, x < cx ? '#8d8270' : '#6b6250')
      c.px(x, top, '#a2957a')
      c.rect(x, top, 1, Math.max(1, Math.round(height * 0.4)), PAL.forest)
      c.px(x, top, x % 2 ? PAL.forestLight : PAL.grassLight)
    }
    c.rect(cx - halfW, waterY, halfW * 2 + 1, 2, '#4d4639')
    c.rect(cx - halfW, waterY + 2, halfW * 2 + 1, 1, PAL.seaDeep, 0.5)
    if (pine) {
      const top = waterY - height
      tree(c, cx - 4, top - 5, 4, true)
      tree(c, cx + 1, top - 6, 4, false)
    }
  }
  isle(7, 23, 6, 5, false)
  isle(31, 21, 6, 5, false)
  isle(19, 30, 11, 9, true)
  isle(36, 34, 7, 7, false)
  // 遊覧船
  const sx = 2
  const sy = 33
  c.rect(sx, sy, 15, 3, '#f2eee2')
  c.rect(sx + 1, sy - 2, 11, 2, '#ffffff')
  for (let i = 0; i < 4; i++) c.px(sx + 3 + i * 2, sy - 1, '#2a4e8c')
  c.rect(sx + 4, sy - 5, 5, 3, '#ffffff')
  c.rect(sx + 8, sy - 8, 1, 3, '#c8ccd6')
  c.rect(sx, sy + 3, 15, 1, '#1e3a6e')
  c.rect(sx - 1, sy + 4, 17, 1, PAL.seaFoam, 0.8)
  return c
}

/** 夕：お土産 */
function souvenir() {
  const c = tile([[0, '#3a2a58'], [1, '#1c142e']])
  // 棚
  c.rect(0, 4, EW, 2, '#6b4a26')
  c.rect(0, 18, EW, 2, '#6b4a26')
  for (let x = 2; x < EW; x += 7) {
    c.rect(x, 7, 5, 11, '#2f3b5e')
    c.rect(x, 7, 5, 1, '#4a5a86')
    c.rect(x + 1, 9, 3, 2, ['#d8423f', '#4f9b3c', '#e8d05a', '#8a63d8', '#3d8ad8', '#e08a5c'][(x / 7) | 0])
  }
  // 紙袋
  c.rect(4, 22, 15, 16, '#d8b06a')
  c.rect(4, 22, 15, 1, '#ecc98a')
  c.rect(4, 22, 1, 16, '#ecc98a')
  c.rect(18, 22, 1, 16, '#a8823c')
  c.line(7, 22, 9, 17, '#8a6234', 1)
  c.line(9, 17, 12, 17, '#8a6234', 1)
  c.line(12, 17, 15, 22, '#8a6234', 1)
  c.rect(7, 27, 9, 6, '#c2954f')
  c.rect(8, 29, 7, 1, '#7a5a2c')
  // 贈り物の箱
  c.rect(21, 26, 16, 12, '#d8423f')
  c.rect(21, 26, 16, 1, '#ec6a5a')
  c.rect(21, 24, 16, 3, '#b0332f')
  c.rect(27, 24, 3, 14, PAL.gold)
  c.rect(27, 24, 1, 14, '#fff0b0')
  c.disc(26, 22, 2, PAL.gold)
  c.disc(31, 22, 2, PAL.gold)
  c.rect(28, 21, 2, 2, '#fff0b0')
  sparkle(c, 34, 15, '#ffe9a8', 0.9)
  sparkle(c, 8, 12, '#ffe9a8', 0.7)
  return c
}

/** 夜：夜の新幹線で帰路 */
function trainNight() {
  const c = tile(S.nightSky)
  stars(c, 30, 14, 47)
  // 遠くの街灯り
  for (let x = 0; x < EW; x += 3) {
    const h = 5 + ((x * 7) % 10)
    c.rect(x, 24 - h, 3, h, '#171338')
    c.px(x + 1, 24 - h + 1, '#ffd98a', 0.8)
    if (x % 6 === 0) c.px(x + 1, 24 - h + 3, '#a9d8ff', 0.65)
  }
  c.rect(0, 24, EW, 2, '#0f0c26')
  // 高架
  c.rect(0, 31, EW, 5, '#2e3450')
  c.rect(0, 31, EW, 1, '#4b5474')
  c.rect(0, 35, EW, 1, '#181c30')
  for (let x = 3; x < EW; x += 8) c.rect(x, 36, 3, 4, '#222741')
  // 車体（昼と同じ形、夜の明かりで見せる）
  const top = 17
  const bottom = 31
  for (let x = 1; x < 39; x++) {
    const t = x <= 26 ? 0 : (x - 26) / 13
    const y = top + Math.round(Math.pow(t, 1.6) * 7)
    c.rect(x, y, 1, bottom - y, '#dfe6f2')
    c.px(x, y, '#ffffff')
    c.px(x, y + 1, '#ffffff')
    c.rect(x, y + 4, 1, 2, '#2f6fd0')
    c.px(x, y + 6, '#1c4a9c')
    c.px(x, bottom - 1, '#9aa5bd')
  }
  // 灯りのともる窓
  for (let x = 3; x < 25; x += 5) {
    c.rect(x, top + 2, 3, 2, '#ffe6a8')
    c.px(x + 1, top + 2, '#fff8dc')
  }
  c.rect(31, top + 5, 4, 2, '#ffe6a8')
  // ヘッドライト
  c.rect(37, top + 7, 2, 2, '#ffffff')
  c.disc(39, top + 8, 3, '#fff3c4', 0.3)
  c.rect(1, bottom, 34, 1, '#3c4360')
  c.rect(6, bottom, 5, 2, '#242942')
  c.rect(20, bottom, 5, 2, '#242942')
  // 窓明かりのにじみ
  c.rect(0, 15, EW, 14, '#a9d8ff', 0.06)
  return c
}

/** すべてのスケジュールアイコンを生成する */
export function scheduleIcons(save) {
  return [
    save('sch-d1-move', trainDay()),
    save('sch-d1-gyutan', gyutan()),
    save('sch-d1-town', citywalk()),
    save('sch-d1-nabe', hotpot()),
    save('sch-d2-asaichi', market()),
    save('sch-d2-free', signpost()),
    save('sch-d2-live', live()),
    save('sch-d2-hotel', hotel()),
    save('sch-d3-morning', sunrise()),
    save('sch-d3-matsushima', matsushima()),
    save('sch-d3-souvenir', souvenir()),
    save('sch-d3-home', trainNight()),
  ]
}
