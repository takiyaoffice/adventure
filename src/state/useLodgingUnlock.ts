import { useCallback, useEffect, useState } from 'react'

/**
 * 宿の記録が解放されたかどうか。
 *
 * ミッションの進み具合（future-fantasy:progress:v1）とは別の鍵で持つので、
 * 既存の保存内容には手を触れない。
 * 同じ端末・同じブラウザであれば、閉じて開き直しても解放されたままになる。
 */
const STORAGE_KEY = 'future-fantasy:lodging-unlocked:v1'

function loadInitial(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    // プライベートブラウズなどで読めない場合は未解放として扱う
    return false
  }
}

export function useLodgingUnlock() {
  const [unlocked, setUnlocked] = useState(loadInitial)

  // 解放されたことだけを書き込む。解除はしない
  useEffect(() => {
    if (!unlocked) return
    try {
      localStorage.setItem(STORAGE_KEY, '1')
    } catch {
      // 保存できなくても、そのセッションのあいだは見られる
    }
  }, [unlocked])

  const unlock = useCallback(() => setUnlocked(true), [])

  return { unlocked, unlock }
}
