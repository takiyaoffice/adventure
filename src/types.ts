/** アプリ全体で使う型定義 */

export type ScreenId = 'home' | 'schedule' | 'map' | 'mission'

/** スケジュール1行分 */
export interface ScheduleEntry {
  time: string
  title: string
  /** 対応するマップ上の場所（任意） */
  locationId?: LocationId
}

export interface ScheduleDay {
  id: string
  /** タブに出す表示名 */
  dayLabel: string
  /** タブ2行目・カード右上に出す日付 */
  dateShort: string
  dateFull: string
  /** 「1月22日」形式。ホームのカードで使う */
  dateJp: string
  /** ISO 形式。今日の判定に使う */
  isoDate: string
  title: string
  /** SPECIAL DAY などのラベル */
  badge?: string
  /** ホームの TODAY'S ADVENTURE に出す一言 */
  lead: string
  thumbnail: string
  entries: ScheduleEntry[]
}

export type LocationId =
  | 'sendai-station'
  | 'zuihoden'
  | 'matsushima'
  | 'gyutan'
  | 'live-venue'
  | 'unknown-1'
  | 'unknown-2'
  | 'unknown-3'
  | 'unknown-4'
  | 'unknown-5'

export interface MapLocation {
  id: LocationId
  /** 未開放エリアは name を伏せる */
  name: string
  /** マップ上の位置（地形画像に対する％） */
  x: number
  y: number
  icon: string
  /** アイコンの表示サイズ倍率 */
  scale?: number
  /** 未開放エリア（??? 表示） */
  locked?: boolean
  description: string
}

export type MissionCategory = 'place' | 'experience' | 'special'

export interface Mission {
  id: string
  category: MissionCategory
  title: string
  /** 達成でマップ上の場所が明るくなる */
  locationId?: LocationId
  /** チェックボックスの代わりに出す固有アイコン */
  badge?: string
  /** 達成時の演出に出す一言 */
  reward?: string
}
