/**
 * 宿の記録。
 *
 * 決まっていない項目は null のままにしておく。画面には「未設定」とだけ出る。
 * 分かった時点でこのファイルの値を書き換えれば、そのまま反映される。
 *
 * 画像を入れるときは src/assets 以下に置いて import し、image に渡す。
 *   import hotelPhoto from '../assets/photo/hotel.jpg'
 *   image: hotelPhoto,
 */

import hotelPhoto from '../assets/photo/hotel-granterrace.jpg'

export interface ReservationItem {
  label: string
  /** 未設定のあいだは null */
  value: string | null
}

export interface LodgingLink {
  label: string
  url: string
}

export interface LodgingInfo {
  /** 宿泊施設名 */
  name: string | null
  /** 施設の画像（import したもの） */
  image: string | null
  /** 画像が実写なら true。ドット絵はそのまま拡大したいので既定は false */
  imageIsPhoto?: boolean
  /** 所在地・住所 */
  address: string | null
  /** 宿泊日程 */
  stayDates: string
  /** 宿泊数 */
  nights: string
  /** 部屋タイプ */
  roomType: string | null
  /** チェックイン時刻 */
  checkIn: string | null
  /** チェックアウト時刻 */
  checkOut: string | null
  /** 予約番号など。値が null のものは未設定として出る */
  reservation: ReservationItem[]
  /** 公式サイトや地図へのリンク。決まるまでは空のままでよい */
  links: LodgingLink[]
}

export const LODGING: LodgingInfo = {
  name: 'ホテルグランテラス仙台国分町',
  // 公式サイトの外観写真を 900px 幅に縮めたもの
  image: hotelPhoto,
  imageIsPhoto: true,
  // 住所は地図のリンク先と公式サイトの表記
  address: '宮城県仙台市青葉区国分町2-2-2',

  stayDates: '2027.1.22（金） 〜 1.24（日）',
  nights: '2泊',

  roomType: 'デラックスツイン（禁煙）',
  checkIn: '15:00 〜',
  checkOut: '11:00',

  reservation: [
    { label: '予約番号', value: '1790256920' },
    { label: '予約者名', value: 'Shun Shiobara' },
  ],

  links: [{ label: '地図を開く', url: 'https://maps.app.goo.gl/TGcjHe4uDnp1D45g8' }],
}
