/** アプリ全体で使う型定義 */

export type ScreenId = 'home' | 'schedule' | 'map' | 'mission' | 'guide'

/** 時間帯 */
export type SchedulePeriod = '朝' | '昼' | '夕' | '夜'

/** 予定の決まりぐあい */
export type ScheduleStatus = 'fixed' | 'recommended' | 'free'

/** スケジュール1行分 */
export interface ScheduleEntry {
  period: SchedulePeriod
  status: ScheduleStatus
  /** 改行を入れると複数行で表示される */
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
  /** ISO 形式。今日の判定に使う */
  isoDate: string
  title: string
  /** SPECIAL DAY などのラベル */
  badge?: string
  /** その日のイメージイラスト */
  illustration: string
  entries: ScheduleEntry[]
}

export type LocationId = 'sendai-station' | 'arena' | 'matsushima'

export interface MapLocation {
  id: LocationId
  /** 改行を入れると2行で表示される */
  name: string
  /** マップ上の位置（地形画像に対する％） */
  x: number
  y: number
  icon: string
  /** アイコンの表示サイズ倍率 */
  scale?: number
  description: string
}

export type MissionCategory = 'place' | 'experience' | 'special'

export interface Mission {
  id: string
  category: MissionCategory
  title: string
  /** 達成でマップ上の場所が明るくなる */
  locationId?: LocationId
  /** 達成時の演出に出す一言 */
  reward?: string
}

/** 冒険ガイドの分類 */
export type GuideCategory = 'spot' | 'food' | 'sweets'

export interface GuideEntry {
  id: string
  name: string
  category: GuideCategory
  /** カード内の説明文。2〜3行を想定 */
  description: string
  /** 仙台駅を起点にしたアクセス。改行でそのまま2行に出せる */
  access: string
  /** カード左の画像 */
  image: string
  /** タップしたときに開くリンク */
  url: string
  /** リンク先がどこかを示す短いラベル（例: 公式サイト、食べログ） */
  linkLabel: string
  /**
   * 実写を入れたときは true にする。
   * ドット絵はそのまま拡大したいので、既定ではピクセル補間を切っている。
   */
  isPhoto?: boolean
}
