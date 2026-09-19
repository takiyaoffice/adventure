import type { ScheduleDay } from '../types'
import thumbDay1 from '../assets/art/thumb-day1.png'
import thumbDay2 from '../assets/art/thumb-day2.png'
import thumbDay3 from '../assets/art/thumb-day3.png'

/** 旅程データ。予定を変えるときはこの配列を書き換える。 */
export const SCHEDULE: ScheduleDay[] = [
  {
    id: 'day1',
    dayLabel: 'DAY 1',
    dateShort: '1.22',
    dateFull: '2027.1.22',
    dateJp: '1月22日',
    isoDate: '2027-01-22',
    title: '仙台への旅立ち',
    lead: '仙台に到着して、\nまずはホテルへ向かおう！',
    thumbnail: thumbDay1,
    entries: [
      { time: '10:00', title: '東京駅 出発' },
      { time: '13:00', title: '仙台駅 到着', locationId: 'sendai-station' },
      { time: '14:00', title: 'ホテルチェックイン' },
      { time: '16:00', title: '仙台城跡 観光', locationId: 'zuihoden' },
      { time: '18:30', title: '牛たんディナー', locationId: 'gyutan' },
    ],
  },
  {
    id: 'day2',
    dayLabel: 'DAY 2',
    dateShort: '1.23',
    dateFull: '2027.1.23',
    dateJp: '1月23日',
    isoDate: '2027-01-23',
    title: '稲葉さんのライブ',
    badge: 'SPECIAL DAY',
    lead: '今日は特別な一日。\nライブ会場へ向かおう！',
    thumbnail: thumbDay2,
    entries: [
      { time: '10:00', title: '朝食' },
      { time: '12:00', title: 'ライブ会場へ移動', locationId: 'live-venue' },
      { time: '15:00', title: '稲葉さんのライブ', locationId: 'live-venue' },
      { time: '20:00', title: '仙台の夜を楽しむ' },
    ],
  },
  {
    id: 'day3',
    dayLabel: 'DAY 3',
    dateShort: '1.24',
    dateFull: '2027.1.24',
    dateJp: '1月24日',
    isoDate: '2027-01-24',
    title: '最後の冒険',
    lead: '松島をめぐって、\n旅のしめくくりへ。',
    thumbnail: thumbDay3,
    entries: [
      { time: '09:00', title: '松島観光', locationId: 'matsushima' },
      { time: '12:00', title: '海鮮ランチ' },
      { time: '15:00', title: 'お土産・買い物' },
      { time: '18:00', title: '仙台駅 出発', locationId: 'sendai-station' },
    ],
  },
]
