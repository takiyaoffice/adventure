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
  name: null,
  image: null,
  address: null,

  // 日程と泊数だけは決まっている
  stayDates: '2027.1.22（金） 〜 1.24（日）',
  nights: '2泊',

  roomType: null,
  checkIn: null,
  checkOut: null,

  reservation: [
    { label: '予約番号', value: null },
    { label: '予約者名', value: null },
    { label: '連絡先', value: null },
  ],

  links: [],
}
