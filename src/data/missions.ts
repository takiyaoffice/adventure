import type { Mission, MissionCategory } from '../types'

/** カテゴリタブの定義 */
export const MISSION_TABS: { id: MissionCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'place', label: '場所' },
  { id: 'experience', label: '体験' },
  { id: 'special', label: '特別' },
]

/** カテゴリ見出し */
export const CATEGORY_LABEL: Record<MissionCategory, string> = {
  place: '場所ミッション',
  experience: '体験ミッション',
  special: '特別ミッション',
}

export const CATEGORY_ORDER: MissionCategory[] = ['place', 'experience', 'special']

/** ミッション一覧。追加・変更はこの配列で完結する。 */
export const MISSIONS: Mission[] = [
  {
    id: 'arrive-sendai',
    category: 'place',
    title: '仙台駅に到着する',
    locationId: 'sendai-station',
    reward: '冒険のはじまりの地に立った！',
  },
  {
    id: 'visit-arena',
    category: 'place',
    title: 'スーパーアリーナに行く',
    locationId: 'arena',
    reward: 'ライブ会場にたどり着いた！',
  },
  {
    id: 'visit-matsushima',
    category: 'place',
    title: '松島を訪れる',
    locationId: 'matsushima',
    reward: '日本三景の絶景を手に入れた！',
  },
  {
    id: 'eat-gyutan',
    category: 'experience',
    title: '牛たんを食べる',
    reward: '体力が大きく回復した！',
  },
  {
    id: 'eat-zunda',
    category: 'experience',
    title: 'ずんだスイーツを食べる',
    reward: 'しあわせが少し増えた！',
  },
  {
    id: 'take-photo',
    category: 'experience',
    title: 'ふたりで記念写真を撮る',
    reward: '思い出をひとつ記録した！',
  },
  {
    id: 'join-live',
    category: 'special',
    title: '稲葉さんのライブに参加する',
    locationId: 'arena',
    reward: '特別な一日がはじまった！',
  },
  {
    id: 'enjoy-live',
    category: 'special',
    title: 'ライブを楽しむ',
    locationId: 'arena',
    reward: '60年の軌跡に、新しい1ページ！',
  },
]

export const MISSION_BY_ID = new Map(MISSIONS.map((m) => [m.id, m]))
