import type { ScheduleDay } from '../types'
import bannerDay1 from '../assets/art/banner-day1.png'
import bannerDay2 from '../assets/art/banner-day2.png'
import bannerDay3 from '../assets/art/banner-day3.png'
import icMove from '../assets/art/sch-d1-move.png'
import icGyutan from '../assets/art/sch-d1-gyutan.png'
import icTown from '../assets/art/sch-d1-town.png'
import icNabe from '../assets/art/sch-d1-nabe.png'
import icFree from '../assets/art/sch-d2-free.png'
import icLive from '../assets/art/sch-d2-live.png'
import icHotel from '../assets/art/sch-d2-hotel.png'
import icMorning from '../assets/art/sch-d3-morning.png'
import icMatsushima from '../assets/art/sch-d3-matsushima.png'
import icSouvenir from '../assets/art/sch-d3-souvenir.png'
import icHome from '../assets/art/sch-d3-home.png'

/**
 * 旅程データ。予定を変えるときはこの配列を書き換える。
 * title はやること、note はその下に添える一言（改行で複数行にできる）。
 */
export const SCHEDULE: ScheduleDay[] = [
  {
    id: 'day1',
    dayLabel: 'DAY 1',
    dateShort: '1.22',
    dateFull: '2027.1.22',
    isoDate: '2027-01-22',
    title: 'いざ仙台へ',
    illustration: bannerDay1,
    entries: [
      {
        icon: icMove,
        title: '仙台へ移動',
      },
      {
        icon: icGyutan,
        title: '仙台到着記念ランチ',
        note: 'まずは牛たんがおすすめ！',
        locationId: 'sendai-station',
      },
      {
        icon: icTown,
        title: '仙台市内を散策',
        note: 'アーケードや仙台城趾を巡ろう！\n甘味処で休憩もいかが？',
      },
      {
        icon: icNabe,
        title: '冬のディナー',
        note: 'せり鍋で温まる？海鮮を満喫？',
      },
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
      {
        icon: icFree,
        title: 'フリー',
        note: 'ライブに備えて体を休めるもよし。\n仙台朝市で市場を巡るもよし。',
      },
      {
        icon: icLive,
        title: 'Special Live',
        note: '稲葉さんを感じろ！！！\nアリーナで聴け！叫べ！歌え！',
        locationId: 'arena',
      },
      {
        icon: icHotel,
        title: '余韻とともにホテルへ',
        note: '小腹が空いたら、ホテル周辺を\n夜食探しに練り歩くもよし。',
      },
    ],
  },
  {
    id: 'day3',
    dayLabel: 'DAY 3',
    dateShort: '1.24',
    dateFull: '2027.1.24',
    isoDate: '2027-01-24',
    title: '松島でゆったり旅',
    illustration: bannerDay3,
    entries: [
      {
        icon: icMorning,
        title: 'ゆったり起床',
        note: 'スケジュールに振り回されず、\nマイペースに起きよう',
      },
      {
        icon: icMatsushima,
        title: '松島へ',
        note: '海辺をゆっくり歩こう。\n美しい景色でのんびり過ごすもよし。\n海鮮を堪能してもよし。',
        locationId: 'matsushima',
      },
      {
        icon: icSouvenir,
        title: 'お土産探し',
        note: '仙台駅に戻って、お土産を買おう！',
      },
      {
        icon: icHome,
        title: '帰路',
        note: '旅の思い出を振り返ろう。\n……爆睡かも？',
        locationId: 'sendai-station',
      },
    ],
  },
]
