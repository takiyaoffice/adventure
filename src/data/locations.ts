import type { MapLocation } from '../types'
import terrain from '../assets/art/map-terrain.png'
import iconStation from '../assets/art/loc-station.png'
import iconArena from '../assets/art/loc-arena.png'
import iconMatsushima from '../assets/art/loc-matsushima.png'
import pinVisited from '../assets/art/pin-visited.png'
import pinTodo from '../assets/art/pin-todo.png'
import compass from '../assets/art/compass.png'

export const MAP_TERRAIN = terrain
export const MAP_PIN_VISITED = pinVisited
export const MAP_PIN_TODO = pinTodo
export const MAP_COMPASS = compass

/** 地形画像のドット数。マーカーの座標計算に使う */
export const MAP_ART_SIZE = { width: 160, height: 240 }

/**
 * マップ上の場所。x / y は地形画像に対する割合（％）。
 * ミッションを達成すると「訪問済み」になり、アイコンが明るくなる。
 */
export const LOCATIONS: MapLocation[] = [
  {
    id: 'matsushima',
    name: '松島',
    x: 76.9,
    y: 18.3,
    icon: iconMatsushima,
    scale: 1.1,
    description: '日本三景のひとつ。\n島々に朝日が差しこむ絶景の地。',
  },
  {
    id: 'arena',
    name: 'セキスイハイム\nスーパーアリーナ',
    x: 46.3,
    y: 50,
    icon: iconArena,
    scale: 1.05,
    description: 'この旅のいちばんの目的地。\n特別な夜がここで待っている。',
  },
  {
    id: 'sendai-station',
    name: '仙台駅',
    x: 16.3,
    y: 67.9,
    icon: iconStation,
    description: '冒険のはじまりの地。\nここから仙台の旅がはじまる。',
  },
]

export const LOCATION_BY_ID = new Map(LOCATIONS.map((l) => [l.id, l]))
