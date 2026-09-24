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
    id: 'go-sendai-station',
    category: 'place',
    title: '仙台駅に行く',
    locationId: 'sendai-station',
    reward: '冒険のはじまりの地に立った！',
  },
  {
    id: 'go-arena',
    category: 'place',
    title: 'スーパーアリーナに行く',
    locationId: 'arena',
    reward: 'ライブ会場にたどり着いた！',
  },
  {
    id: 'go-matsushima',
    category: 'place',
    title: '松島に行く',
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
    id: 'ask-local',
    category: 'experience',
    title: '旅先で出会った人におすすめの場所を聞く',
    reward: '地元の人だけが知る場所を教わった！',
  },
  {
    id: 'enjoy-live',
    category: 'experience',
    title: 'ライブを楽しむ',
    reward: '60年の軌跡に、新しい1ページ！',
  },
  {
    id: 'take-photo',
    category: 'experience',
    title: 'ふたりで記念写真を撮る',
    reward: '思い出をひとつ記録した！',
  },
  {
    id: 'secret-compass',
    category: 'special',
    title: '？？？',
    secret: true,
    hint: '冒険者よ、未知なる道標を見逃すな。\n\n方角を示すものに、隠された力がある。',
    revealedTitle: '未来の地図の暗号を解く',
    reward: '隠されていた力が目を覚ました！',
  },
]

export const MISSION_BY_ID = new Map(MISSIONS.map((m) => [m.id, m]))
