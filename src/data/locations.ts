export type LocationIcon =
  | 'station'
  | 'castle'
  | 'shrine'
  | 'food'
  | 'onsen'
  | 'street'
  | 'hotel'
  | 'home'

export interface LocationMission {
  /** shown as the main checkbox mission */
  arriveText: string
  /** optional secondary "extra" mission, e.g. take a photo */
  extra?: string
}

export interface Location {
  id: string
  name: string
  kana: string
  icon: LocationIcon
  /** position on the fantasy world map, in % of the map viewBox */
  x: number
  y: number
  day: 1 | 2
  blurb: string
  mission: LocationMission
  /** true for the final "return home" mission, not drawn on the fantasy map */
  isFinal?: boolean
}

export const LOCATIONS: Location[] = [
  {
    id: 'sendai-station',
    name: '仙台駅',
    kana: 'せんだいえき',
    icon: 'station',
    x: 50,
    y: 82,
    day: 1,
    blurb: '冒険の出発点。新幹線でここに降り立つところから、二人の旅がはじまる。',
    mission: { arriveText: '仙台駅に到着した！' },
  },
  {
    id: 'sendai-castle',
    name: '仙台城跡',
    kana: 'せんだいじょうあと',
    icon: 'castle',
    x: 26,
    y: 46,
    day: 1,
    blurb: '伊達政宗公が築いた名城の跡。石垣と銅像が、かつての栄華を今に伝える。',
    mission: {
      arriveText: '仙台城跡を訪れた！',
      extra: '写真を撮って家族に送ろう。旅の思い出をシェアしよう。',
    },
  },
  {
    id: 'gyutan',
    name: '牛たんのお店',
    kana: 'ぎゅうたん',
    icon: 'food',
    x: 46,
    y: 63,
    day: 1,
    blurb: '仙台名物・牛たん定食で腹ごしらえ。冒険には元気なスタミナが欠かせない。',
    mission: { arriveText: '牛たんを味わった！' },
  },
  {
    id: 'akiu-onsen',
    name: '秋保温泉',
    kana: 'あきうおんせん',
    icon: 'onsen',
    x: 15,
    y: 22,
    day: 1,
    blurb: '奥州三名湯のひとつ。旅の疲れをゆっくり癒す、静かな山あいの湯どころ。',
    mission: {
      arriveText: '秋保温泉でひと休みした！',
      extra: '露天風呂からの景色を写真におさめよう。',
    },
  },
  {
    id: 'hotel',
    name: '今宵の宿',
    kana: 'こよいのやど',
    icon: 'hotel',
    x: 64,
    y: 78,
    day: 1,
    blurb: '1日目の夜を過ごす宿。ゆっくり休んで、明日の冒険に備えよう。',
    mission: { arriveText: '宿にチェックインした！' },
  },
  {
    id: 'zuihoden',
    name: '瑞鳳殿',
    kana: 'ずいほうでん',
    icon: 'shrine',
    x: 73,
    y: 20,
    day: 2,
    blurb: '伊達政宗公を祀る絢爛豪華な廟所。桃山文化の彫刻が杜の中に輝く。',
    mission: {
      arriveText: '瑞鳳殿を訪れた！',
      extra: '極彩色の彫刻を写真に残そう。',
    },
  },
  {
    id: 'jozenji',
    name: '定禅寺通',
    kana: 'じょうぜんじどおり',
    icon: 'street',
    x: 60,
    y: 48,
    day: 2,
    blurb: '欅並木が続く杜の都のシンボルロード。お土産探しに立ち寄ろう。',
    mission: { arriveText: '定禅寺通を散策した！' },
  },
  {
    id: 'home',
    name: 'おうち',
    kana: 'かえりみち',
    icon: 'home',
    x: 50,
    y: 82,
    day: 2,
    blurb: '二人の旅も、ここでひと区切り。無事におうちに着いたら、冒険は完了だ。',
    mission: { arriveText: '家に着いた！' },
    isFinal: true,
  },
]

export const getLocation = (id: string) => LOCATIONS.find((l) => l.id === id)
