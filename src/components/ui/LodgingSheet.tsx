import { PixelIcon } from './PixelIcon'
import { LODGING } from '../../data/lodging'
import s from './LodgingSheet.module.css'

interface Props {
  onClose: () => void
}

/** 決まっていない項目は、勝手に埋めずに「未設定」と出す */
function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className={s.row}>
      <span className={s.label}>{label}</span>
      {value ? <span className={s.value}>{value}</span> : <span className={s.unset}>未設定</span>}
    </div>
  )
}

/** 宿の記録。解放後はいつでもここから見られる */
export function LodgingSheet({ onClose }: Props) {
  // まだ決まっていない項目が残っているかどうか。残っていなければ断り書きも出さない
  const hasUnset =
    [LODGING.name, LODGING.address, LODGING.roomType, LODGING.checkIn, LODGING.checkOut].some(
      (v) => !v,
    ) || LODGING.reservation.some((item) => !item.value)

  return (
    <div className={s.overlay} role="dialog" aria-label="宿の記録" onClick={onClose}>
      <div className={s.window} onClick={(e) => e.stopPropagation()}>
        <div className={s.head}>
          <p className={s.headTitle}>
            <PixelIcon name="place" size={12} />
            宿の記録
          </p>
          <button type="button" className={s.close} onClick={onClose} aria-label="とじる">
            ×
          </button>
        </div>

        <div className={s.scroll}>
          <p className={s.name}>{LODGING.name ?? <span className={s.unset}>宿泊施設名 未設定</span>}</p>

          {LODGING.image ? (
            <img
              className={`${s.photo} ${LODGING.imageIsPhoto ? s.photoReal : ''}`}
              src={LODGING.image}
              alt={LODGING.name ?? '宿の外観'}
            />
          ) : (
            <div className={s.photoEmpty} aria-label="施設の画像 未設定">
              <PixelIcon name="place" size={28} />
              <span className={s.unset}>画像 未設定</span>
            </div>
          )}

          <div className={s.block}>
            <Row label="所在地" value={LODGING.address} />
            <Row label="宿泊日程" value={LODGING.stayDates} />
            <Row label="宿泊数" value={LODGING.nights} />
            <Row label="部屋タイプ" value={LODGING.roomType} />
            <Row label="チェックイン" value={LODGING.checkIn} />
            <Row label="チェックアウト" value={LODGING.checkOut} />
          </div>

          <p className={s.blockTitle}>予約情報</p>
          <div className={s.block}>
            {LODGING.reservation.map((item) => (
              <Row key={item.label} label={item.label} value={item.value} />
            ))}
          </div>

          {LODGING.links.length > 0 && (
            <div className={s.links}>
              {LODGING.links.map((link) => (
                <a
                  key={link.url}
                  className={s.link}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer noopener"
                >
                  {link.label}
                  <PixelIcon name="chevron" size={10} />
                </a>
              ))}
            </div>
          )}

          {hasUnset && <p className={s.note}>決まっていないところは、分かりしだい書き足されます。</p>}
        </div>
      </div>
    </div>
  )
}
