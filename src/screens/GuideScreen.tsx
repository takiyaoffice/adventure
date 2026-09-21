import { useState } from 'react'
import { PixelIcon } from '../components/ui/PixelIcon'
import { GUIDE_CATEGORY_LABEL, GUIDE_ENTRIES, GUIDE_TABS } from '../data/guide'
import type { GuideCategory } from '../types'
import s from './GuideScreen.module.css'

const CATEGORY_CLASS: Record<GuideCategory, string> = {
  spot: s.spot,
  food: s.food,
}

export function GuideScreen() {
  const [tab, setTab] = useState<GuideCategory | 'all'>('all')
  const entries = tab === 'all' ? GUIDE_ENTRIES : GUIDE_ENTRIES.filter((e) => e.category === tab)

  return (
    <>
      <p className={s.lead}>仙台のおすすめスポットを探そう</p>

      <div className={s.tabs}>
        {GUIDE_TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`${s.tab} ${tab === item.id ? s.tabActive : ''}`}
            aria-pressed={tab === item.id}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className={s.list}>
        {entries.map((entry) => (
          <a
            key={entry.id}
            className={s.card}
            href={entry.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className={`${s.photo} ${entry.isPhoto ? s.realPhoto : ''}`}
              src={entry.image}
              alt=""
            />
            <div className={s.body}>
              <div className={s.titleRow}>
                <h2 className={s.name}>{entry.name}</h2>
                <span className={`${s.tag} ${CATEGORY_CLASS[entry.category]}`}>
                  {GUIDE_CATEGORY_LABEL[entry.category]}
                </span>
              </div>
              <p className={s.description}>{entry.description}</p>
              <p className={s.area}>エリア：{entry.area}</p>
              <p className={s.link}>{entry.linkLabel} を開く</p>
            </div>
            <PixelIcon name="chevron" size={18} className={s.chevron} />
          </a>
        ))}
        {entries.length === 0 && <p className={s.empty}>このカテゴリのスポットはまだありません。</p>}
      </div>
    </>
  )
}
