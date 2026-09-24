import type { ScheduleDay } from '../types'
import bannerDay1 from '../assets/art/banner-day1.png'
import bannerDay2 from '../assets/art/banner-day2.png'
import bannerDay3 from '../assets/art/banner-day3.png'
import icMove from '../assets/art/sch-d1-move.png'
import icGyutan from '../assets/art/sch-d1-gyutan.png'
import icTown from '../assets/art/sch-d1-town.png'
import icNabe from '../assets/art/sch-d1-nabe.png'
import icAsaichi from '../assets/art/sch-d2-asaichi.png'
import icFree from '../assets/art/sch-d2-free.png'
import icLive from '../assets/art/sch-d2-live.png'
import icHotel from '../assets/art/sch-d2-hotel.png'
import icMorning from '../assets/art/sch-d3-morning.png'
import icMatsushima from '../assets/art/sch-d3-matsushima.png'
import icSouvenir from '../assets/art/sch-d3-souvenir.png'
import icHome from '../assets/art/sch-d3-home.png'

/**
 * 旅程データ。予定を変えるときはこの配列を書き換える。
 * title はその時間帯にやること、note は選びかたの余地を書き添える一言。
 */
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
      {
        period: '朝',
        icon: icMove,
        title: '深谷 → 大宮 → 仙台へ移動',
        note: '新幹線でおよそ2時間の旅路',
      },
      {
        period: '昼',
        icon: icGyutan,
        title: '仙台に到着・お昼ごはん',
        note: '牛たん・寿司・ラーメン\n着いてから食べたいものを',
        locationId: 'sendai-station',
      },
      {
        period: '夕',
        icon: icTown,
        title: '仙台の街を散策',
        note: 'アーケード街・定禅寺通りなど\n気の向くままに',
      },
      {
        period: '夜',
        icon: icNabe,
        title: '夕食は仙台の冬の味',
        note: 'せり鍋・牡蠣・海鮮から好きな一品',
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
        period: '朝',
        icon: icAsaichi,
        title: '朝ごはん',
        note: '仙台朝市を歩く / ホテルでゆっくり',
      },
      {
        period: '昼',
        icon: icFree,
        title: '自由行動',
        note: '仙台城趾・瑞鳳殿・AER展望テラス\n行きたい所へ',
      },
      {
        period: '夕',
        icon: icLive,
        title: '稲葉さんのライブ',
        note: 'セキスイハイムスーパーアリーナ',
        locationId: 'arena',
      },
      {
        period: '夜',
        icon: icHotel,
        title: '余韻にひたりながらホテルへ',
        note: '小腹がすいたら夜食も',
      },
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
      {
        period: '朝',
        icon: icMorning,
        title: 'ゆっくり起床・朝食',
        note: '急がず、起きたい時間に',
      },
      {
        period: '昼',
        icon: icMatsushima,
        title: '松島へ移動・海辺の散策・昼食',
        note: '遊覧船・瑞巌寺・五大堂など\n気分に合わせて観光',
        locationId: 'matsushima',
      },
      {
        period: '夕',
        icon: icSouvenir,
        title: '仙台駅でお土産購入',
        note: 'ずんだ餅・萩の月・笹かま\n目についたものを',
      },
      {
        period: '夜',
        icon: icHome,
        title: '仙台 → 大宮 → 深谷へ帰宅',
        note: '帰りの新幹線で旅をふりかえる',
        locationId: 'sendai-station',
      },
    ],
  },
]
