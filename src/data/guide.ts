import type { GuideCategory, GuideEntry } from '../types'
import imgMatsushima from '../assets/art/guide-matsushima.png'
import imgSendaijo from '../assets/art/guide-sendaijo.png'
import imgZuihoden from '../assets/art/guide-zuihoden.png'
import imgAkiu from '../assets/art/guide-akiu.png'
import imgAer from '../assets/art/guide-aer.png'
import imgAsaichi from '../assets/art/guide-asaichi.png'
import imgZunda from '../assets/art/guide-zunda.png'
import imgGyutan from '../assets/art/guide-gyutan.png'
import imgGyutanSet from '../assets/art/guide-gyutan-set.png'
import imgKaki from '../assets/art/guide-kaki.png'
import imgKanmi from '../assets/art/guide-kanmi.png'
import imgSerinabe from '../assets/art/guide-serinabe.png'
import imgWagashi from '../assets/art/guide-wagashi.png'

/** カテゴリタブ */
export const GUIDE_TABS: { id: GuideCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'spot', label: 'スポット' },
  { id: 'food', label: '食事処' },
]

/** カード右上に出すラベル */
export const GUIDE_CATEGORY_LABEL: Record<GuideCategory, string> = {
  spot: 'スポット',
  food: '食事処',
}

/**
 * おすすめスポット一覧。
 * 画像はドット絵の仮置き。実写に差し替えるときは image を新しいファイルに変え、
 * isPhoto: true を足す。
 */
export const GUIDE_ENTRIES: GuideEntry[] = [
  {
    id: 'matsushima',
    name: '松島',
    category: 'spot',
    description: '日本三景のひとつ。島々の絶景。',
    access: '仙台駅から電車で約40分',
    image: imgMatsushima,
    url: 'https://www.matsushima-kanko.com/uploads/Image/files/2026matsushima-map.pdf',
    linkLabel: '観光マップ（PDF）',
  },
  {
    id: 'sendaijo',
    name: '仙台城跡',
    category: 'spot',
    description: '政宗公の騎馬像が立つ高台。',
    access: '仙台駅からバスで約22分',
    image: imgSendaijo,
    url: 'https://www.sentabi.jp/spots/60',
    linkLabel: 'せんだい旅日和',
  },
  {
    id: 'zuihoden',
    name: '瑞鳳殿',
    category: 'spot',
    description: '政宗公がねむる豪華な霊屋。',
    access: '仙台駅からバスで約15分',
    image: imgZuihoden,
    url: 'https://www.zuihoden.com',
    linkLabel: '公式サイト',
  },
  {
    id: 'akiu',
    name: '秋保大滝',
    category: 'spot',
    description: '落差55メートルの大きな滝。',
    access: '仙台駅からバスで約1時間20分',
    image: imgAkiu,
    url: 'https://www.sentabi.jp/spots/34',
    linkLabel: 'せんだい旅日和',
  },
  {
    id: 'aer',
    name: 'AER展望テラス',
    category: 'spot',
    description: '31階からの無料の大パノラマ。',
    access: '仙台駅から徒歩約2分',
    image: imgAer,
    url: 'https://www.sentabi.jp/spots/35',
    linkLabel: 'せんだい旅日和',
  },
  {
    id: 'asaichi',
    name: '仙台朝市',
    category: 'spot',
    description: '「仙台の台所」と呼ばれる商店街。',
    access: '仙台駅から徒歩約5分',
    image: imgAsaichi,
    url: 'https://sendaiasaichi.com',
    linkLabel: '公式サイト',
  },
  {
    id: 'murakamiya',
    name: '村上屋餅店',
    category: 'food',
    description: 'ずんだ餅で知られる和菓子店。',
    access: '仙台駅から地下鉄と徒歩で約10分',
    image: imgZunda,
    url: 'https://tabelog.com/miyagi/A0401/A040101/4000119/',
    linkLabel: '食べログ',
  },
  {
    id: 'hikoichi',
    name: '甘味処 彦いち',
    category: 'food',
    description: '古い日本家屋の人気の甘味処。',
    access: '仙台駅から地下鉄と徒歩で約10分',
    image: imgKanmi,
    url: 'https://tabelog.com/miyagi/A0401/A040101/4001665/',
    linkLabel: '食べログ',
  },
  {
    id: 'baisaou',
    name: '菓子司 賣茶翁',
    category: 'food',
    description: 'みちのくせんべいで知られる和菓子店。',
    access: '仙台駅から地下鉄と徒歩で約15分',
    image: imgWagashi,
    url: 'https://tabelog.com/miyagi/A0401/A040101/4001481/',
    linkLabel: '食べログ',
  },
  {
    id: 'kaku',
    name: '牛たん料理 閣',
    category: 'food',
    description: '一番町の牛たん専門店。',
    access: '仙台駅から地下鉄と徒歩で約5分',
    image: imgGyutan,
    url: 'https://tabelog.com/miyagi/A0401/A040101/4000039/',
    linkLabel: '食べログ',
  },
  {
    id: 'ichiryu',
    name: '一隆 本店',
    category: 'food',
    description: 'たん焼きで知られる牛たん店。',
    access: '仙台駅から地下鉄と徒歩で約10分',
    image: imgGyutanSet,
    url: 'https://tabelog.com/miyagi/A0401/A040101/4000060/',
    linkLabel: '食べログ',
  },
  {
    id: 'kaki',
    name: '牡蠣',
    category: 'food',
    description: '冬が旬。松島名物の牡蠣。',
    access: '仙台駅から電車で約40分',
    image: imgKaki,
    url: 'https://rikyu-m.com/matsushima-kaki/',
    linkLabel: '松島の牡蠣ガイド',
  },
  {
    id: 'seriichi',
    name: 'せり鍋専門店 せりいち',
    category: 'food',
    description: '仙台名物のせり鍋の専門店。',
    access: '仙台駅西口から徒歩約2分',
    image: imgSerinabe,
    url: 'https://www.hotpepper.jp/strJ004661149/',
    linkLabel: 'ホットペッパー',
  },
]
