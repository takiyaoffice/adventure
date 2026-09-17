export type TimelineIcon = 'move' | 'sight' | 'meal' | 'onsen' | 'stay' | 'home' | 'book'

export interface TimelineItem {
  time: string
  title: string
  note?: string
  icon: TimelineIcon
  /** links to a Location id for mission tracking, when this stop has a checkable mission */
  locationId?: string
}

export interface DayPlan {
  day: 1 | 2
  date: string
  weekday: string
  title: string
  items: TimelineItem[]
}

export const ITINERARY: DayPlan[] = [
  {
    day: 1,
    date: '2026年10月10日',
    weekday: '土',
    title: '杜の都へ、出発',
    items: [
      {
        time: '10:00',
        title: '仙台駅 到着',
        note: '新幹線で仙台へ！ホームに降り立ち、冒険がはじまる。',
        icon: 'move',
        locationId: 'sendai-station',
      },
      {
        time: '11:00',
        title: '仙台城跡',
        note: '伊達政宗公騎馬像の前で記念撮影。青葉山から城下町を一望。',
        icon: 'sight',
        locationId: 'sendai-castle',
      },
      {
        time: '12:30',
        title: '昼食（牛たん）',
        note: '仙台名物を味わう。麦飯とテールスープもお楽しみに。',
        icon: 'meal',
        locationId: 'gyutan',
      },
      {
        time: '14:30',
        title: '秋保温泉',
        note: '温泉でゆっくり休憩。無理のないペースで旅を楽しもう。',
        icon: 'onsen',
        locationId: 'akiu-onsen',
      },
      {
        time: '16:30',
        title: 'ホテルへ',
        note: 'チェックインして、1日目はここまで。おつかれさまでした。',
        icon: 'stay',
        locationId: 'hotel',
      },
    ],
  },
  {
    day: 2,
    date: '2026年10月11日',
    weekday: '日',
    title: '杜の都をめぐり、帰路へ',
    items: [
      {
        time: '09:00',
        title: '宿を出発',
        note: '朝食をとって、2日目の冒険へ。',
        icon: 'move',
      },
      {
        time: '09:30',
        title: '瑞鳳殿',
        note: '桃山文化を受け継ぐ極彩色の廟所を見学。',
        icon: 'sight',
        locationId: 'zuihoden',
      },
      {
        time: '11:30',
        title: '定禅寺通を散策',
        note: '欅並木の下をのんびり歩き、お土産を探そう。',
        icon: 'sight',
        locationId: 'jozenji',
      },
      {
        time: '13:00',
        title: '昼食',
        note: 'お好みのお店でランチ。仙台の味をもう一度。',
        icon: 'meal',
      },
      {
        time: '15:00',
        title: '仙台駅へ',
        note: 'おみやげを買って、新幹線の時間まで一休み。',
        icon: 'move',
      },
      {
        time: '16:00',
        title: '新幹線で帰路へ',
        note: '二人の旅も、そろそろ終着点。ゆっくり帰ろう。',
        icon: 'home',
        locationId: 'home',
      },
    ],
  },
]
