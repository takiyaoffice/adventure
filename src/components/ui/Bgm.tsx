import { useCallback, useEffect, useRef, useState } from 'react'

const BGM_SRC = `${import.meta.env.BASE_URL}audio/future-fantasy.mp3`
const STORAGE_KEY = 'future-fantasy:bgm-muted'

function loadMuted(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * アプリを開いているあいだ流れる BGM。
 * ブラウザは音の自動再生を止めることがあるので、
 * 再生できなかったときは最初の操作をきっかけに鳴らしはじめる。
 */
export function useBgm() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [muted, setMuted] = useState(loadMuted)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, muted ? '1' : '0')
    } catch {
      // 保存できなくても再生には影響しない
    }
  }, [muted])

  const play = useCallback(() => {
    const el = audioRef.current
    if (!el || muted) return Promise.resolve(false)
    return el.play().then(() => true).catch(() => false)
  }, [muted])

  useEffect(() => {
    const el = audioRef.current
    if (!el) return
    if (muted) {
      el.pause()
      return
    }
    let disposed = false
    const unlock = () => {
      void play()
    }
    void play().then((ok) => {
      // 自動再生が止められたときは、最初のタップ／クリックで鳴らしはじめる
      if (ok || disposed) return
      window.addEventListener('pointerdown', unlock, { once: true })
      window.addEventListener('keydown', unlock, { once: true })
    })
    // タブに戻ってきたときに再開する
    const onVisible = () => {
      if (document.visibilityState === 'visible') void play()
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      disposed = true
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [muted, play])

  const element = <audio ref={audioRef} src={BGM_SRC} loop preload="auto" />

  return { muted, toggleMuted: () => setMuted((v) => !v), element }
}
