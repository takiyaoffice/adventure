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
    description: '日本三景のひとつ。\n島めぐりの観光マップが見られる。',
    access: '仙台駅からJR仙石線で約40分\n松島海岸駅で下車',
    image: imgMatsushima,
    url: 'https://www.matsushima-kanko.com/uploads/Image/files/2026matsushima-map.pdf',
    linkLabel: '観光マップ（PDF）',
  },
  {
    id: 'sendaijo',
    name: '仙台城跡',
    category: 'spot',
    description: '政宗公の騎馬像がある高台。\n仙台の街を見わたせる。',
    access: '仙台駅西口からるーぷる仙台で約22分',
    image: imgSendaijo,
    url: 'https://www.sentabi.jp/spots/60',
    linkLabel: 'せんだい旅日和',
  },
  {
    id: 'zuihoden',
    name: '瑞鳳殿',
    category: 'spot',
    description: '政宗公がねむる豪華な霊屋。\n杉木立の石段をのぼった先。',
    access: '仙台駅からるーぷる仙台で約15分\n瑞鳳殿前から徒歩約7分',
    image: imgZuihoden,
    url: 'https://www.zuihoden.com',
    linkLabel: '公式サイト',
  },
  {
    id: 'akiu',
    name: '秋保大滝',
    category: 'spot',
    description: '落差55メートル、幅6メートル。\n日本三大瀑布のひとつ。',
    access: '仙台駅西口からバスで約1時間20分\n車なら仙台南ICから約35分',
    image: imgAkiu,
    url: 'https://www.sentabi.jp/spots/34',
    linkLabel: 'せんだい旅日和',
  },
  {
    id: 'aer',
    name: 'AER展望テラス',
    category: 'spot',
    description: '31階の無料展望テラス。\n蔵王から太平洋まで一望。',
    access: 'JR仙台駅2階出口から徒歩約2分',
    image: imgAer,
    url: 'https://www.sentabi.jp/spots/35',
    linkLabel: 'せんだい旅日和',
  },
  {
    id: 'asaichi',
    name: '仙台朝市',
    category: 'spot',
    description: '「仙台の台所」と呼ばれる商店街。\n海の幸も並ぶ。',
    access: '仙台駅から徒歩約5分',
    image: imgAsaichi,
    url: 'https://sendaiasaichi.com',
    linkLabel: '公式サイト',
  },
  {
    id: 'murakamiya',
    name: '村上屋餅店',
    category: 'food',
    description: 'ずんだ餅で知られる\n五橋の和菓子店。',
    access: '仙台駅から地下鉄南北線で1駅\n五橋駅から徒歩約7分',
    image: imgZunda,
    url: 'https://tabelog.com/miyagi/A0401/A040101/4000119/',
    linkLabel: '食べログ',
  },
  {
    id: 'kaku',
    name: '牛たん料理 閣',
    category: 'food',
    description: 'ブランドーム本店。\n青葉通一番町の牛たん店。',
    access: '仙台駅から地下鉄東西線で1駅\n青葉通一番町駅から徒歩約3分',
    image: imgGyutan,
    url: 'https://tabelog.com/miyagi/A0401/A040101/4000039/',
    linkLabel: '食べログ',
  },
  {
    id: 'ichiryu',
    name: '一隆 本店',
    category: 'food',
    description: 'たん焼きで知られる\n仙台の牛たん専門店。',
    access: '仙台駅から地下鉄南北線で1駅\n広瀬通駅から徒歩約6分',
    image: imgGyutanSet,
    url: 'https://tabelog.com/miyagi/A0401/A040101/4000060/',
    linkLabel: '食べログ',
  },
]
