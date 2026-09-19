import type { MapLocation } from '../types'
import terrain from '../assets/art/map-terrain.png'
import iconStation from '../assets/art/loc-station.png'
import iconZuihoden from '../assets/art/loc-zuihoden.png'
import iconMatsushima from '../assets/art/loc-matsushima.png'
import iconGyutan from '../assets/art/loc-gyutan.png'
import iconLive from '../assets/art/loc-live.png'
import iconUnknown from '../assets/art/loc-unknown.png'
import iconUnknownSmall from '../assets/art/loc-unknown-small.png'

export const MAP_TERRAIN = terrain
/** 地形画像のドット数。マーカーの座標計算に使う */
export const MAP_ART_SIZE = { width: 160, height: 240 }

/**
 * マップ上の場所。x / y は地形画像に対する割合（％）。
 * locked: true の場所は ??? 表示のまま。
 */
export const LOCATIONS: MapLocation[] = [
  {
    id: 'matsushima',
    name: '松島',
    x: 78.1,
    y: 14.2,
    icon: iconMatsushima,
    scale: 1.1,
    description: '日本三景のひとつ。\n島々に朝日が差しこむ絶景の地。',
  },
  {
    id: 'unknown-1',
    name: '？？？',
    x: 25,
    y: 13.3,
    icon: iconUnknown,
    locked: true,
    description: 'まだ地図に記されていない場所。\n旅のとちゅうで見つかるかも。',
  },
  {
    id: 'sendai-station',
    name: '仙台駅',
    x: 49.4,
    y: 27.1,
    icon: iconStation,
    scale: 1.15,
    description: '冒険のはじまりの地。\nここから仙台の旅がはじまる。',
  },
  {
    id: 'zuihoden',
    name: '瑞鳳殿',
    x: 25,
    y: 38.8,
    icon: iconZuihoden,
    description: '伊達政宗公がねむる霊屋。\n杉木立の奥にたたずむ金色の社。',
  },
  {
    id: 'unknown-2',
    name: '？？？',
    x: 78.1,
    y: 38.8,
    icon: iconUnknown,
    locked: true,
    description: 'まだ地図に記されていない場所。\n旅のとちゅうで見つかるかも。',
  },
  {
    id: 'unknown-3',
    name: '？？？',
    x: 71.3,
    y: 48.8,
    icon: iconUnknownSmall,
    scale: 0.85,
    locked: true,
    description: 'まだ地図に記されていない場所。\n旅のとちゅうで見つかるかも。',
  },
  {
    id: 'gyutan',
    name: '牛たん',
    x: 27.5,
    y: 55.8,
    icon: iconGyutan,
    description: '炭火で焼きあげる仙台の名物。\n旅人の体力を大きく回復する。',
  },
  {
    id: 'live-venue',
    name: 'ライブ会場',
    x: 75,
    y: 62.1,
    icon: iconLive,
    scale: 1.1,
    description: 'この旅のいちばんの目的地。\n特別な夜がここで待っている。',
  },
  {
    id: 'unknown-4',
    name: '？？？',
    x: 25,
    y: 74.6,
    icon: iconUnknown,
    locked: true,
    description: 'まだ地図に記されていない場所。\n旅のとちゅうで見つかるかも。',
  },
  {
    id: 'unknown-5',
    name: '？？？',
    x: 58.1,
    y: 74.6,
    icon: iconUnknownSmall,
    scale: 0.85,
    locked: true,
    description: 'まだ地図に記されていない場所。\n旅のとちゅうで見つかるかも。',
  },
]

export const LOCATION_BY_ID = new Map(LOCATIONS.map((l) => [l.id, l]))
