import type { ScheduleDay, ScheduleStatus } from '../types'
import bannerDay1 from '../assets/art/banner-day1.png'
import bannerDay2 from '../assets/art/banner-day2.png'
import bannerDay3 from '../assets/art/banner-day3.png'

/** 予定の決まりぐあいの表示名 */
export const STATUS_LABEL: Record<ScheduleStatus, string> = {
  fixed: '確定',
  recommended: 'おすすめ',
  free: 'フリー',
}

/** 旅程データ。予定を変えるときはこの配列を書き換える。 */
export const SCHEDULE: ScheduleDay[] = [
  {
    id: 'day1',
    dayLabel: 'DAY 1',
    dateShort: '1.22',
    dateFull: '2027.1.22',
    isoDate: '2027-01-22',
    title: '仙台グルメを満喫',
    illustration: bannerDay1,
    entries: [
      { period: '朝', status: 'fixed', title: '深谷 → 大宮 → 仙台へ移動' },
      { period: '昼', status: 'fixed', title: '仙台到着・牛たんランチ', locationId: 'sendai-station' },
      { period: '夕', status: 'recommended', title: '仙台市内を散策' },
      { period: '夜', status: 'recommended', title: 'せり鍋を楽しむ' },
    ],
  },
  {
    id: 'day2',
    dayLabel: 'DAY 2',
    dateShort: '1.23',
    dateFull: '2027.1.23',
    isoDate: '2027-01-23',
    title: "稲葉's ライブ",
    badge: 'SPECIAL DAY',
    illustration: bannerDay2,
    entries: [
      { period: '朝', status: 'recommended', title: '仙台朝市などを散策' },
      { period: '昼', status: 'free', title: '自由行動・昼食' },
      { period: '夕', status: 'fixed', title: '稲葉さんのライブ', locationId: 'arena' },
      { period: '夜', status: 'fixed', title: 'ホテルへ' },
    ],
  },
  {
    id: 'day3',
    dayLabel: 'DAY 3',
    dateShort: '1.24',
    dateFull: '2027.1.24',
    isoDate: '2027-01-24',
    title: '松島観光と帰路',
    illustration: bannerDay3,
    entries: [
      { period: '朝', status: 'free', title: 'ゆっくり起床・朝食' },
      {
        period: '昼',
        status: 'recommended',
        title: '松島へ移動・海辺の散策・昼食\n遊覧船・瑞巌寺など、気分に合わせて観光',
        locationId: 'matsushima',
      },
      { period: '夕', status: 'recommended', title: '仙台駅でお土産購入' },
      { period: '夜', status: 'fixed', title: '仙台 → 大宮 → 深谷へ帰宅', locationId: 'sendai-station' },
    ],
  },
]
