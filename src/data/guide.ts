import type { GuideCategory, GuideEntry } from '../types'
import imgMatsushima from '../assets/art/guide-matsushima.png'
import imgGyutan from '../assets/art/guide-gyutan.png'
import imgZunda from '../assets/art/guide-zunda.png'
import imgSouvenir from '../assets/art/guide-souvenir.png'

/** カテゴリタブ */
export const GUIDE_TABS: { id: GuideCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'すべて' },
  { id: 'spot', label: 'スポット' },
  { id: 'food', label: '食事処' },
  { id: 'cafe', label: 'カフェ・スイーツ' },
  { id: 'souvenir', label: 'お土産' },
]

/** カード右上に出すラベル */
export const GUIDE_CATEGORY_LABEL: Record<GuideCategory, string> = {
  spot: 'スポット',
  food: '食事処',
  cafe: 'カフェ・スイーツ',
  souvenir: 'お土産',
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
    description: '日本三景のひとつ。\n美しい島々と絶景を\n楽しめます。',
    area: '松島町',
    image: imgMatsushima,
  },
  {
    id: 'gyutan',
    name: '牛たん専門店',
    category: 'food',
    description: '仙台名物の牛たん！\n厚切りでジューシーな\n味わい。',
    area: '仙台駅周辺',
    image: imgGyutan,
  },
  {
    id: 'zunda',
    name: 'ずんだスイーツ',
    category: 'cafe',
    description: 'ずんだの優しい甘さが\n楽しめる人気スイーツ。',
    area: '仙台市内',
    image: imgZunda,
  },
  {
    id: 'souvenir',
    name: '仙台銘菓',
    category: 'souvenir',
    description: '旅の思い出にぴったりな\n仙台の銘菓・お土産。',
    area: '仙台駅周辺',
    image: imgSouvenir,
  },
]
