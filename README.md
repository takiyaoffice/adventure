# 仙台の冒険 〜二人の旅、思い出の地図〜

お父さん夫婦のための旅のしおりPWA。ファンタジー冒険風のUIで、仙台旅行の行程・訪問先をミッション形式でたどれます。

## 画面構成

1. **冒険の書** — 旅のタイトル・日程・概要
2. **ワールドマップ** — 訪れた場所が光るファンタジーマップ
3. **今日の冒険** — 日ごとの時系列プラン
4. **ミッション** — 各訪問先の「到着チェック」と写真ミッション

最後の「帰宅」ミッションを達成すると `ADVENTURE COMPLETE!` 画面が表示されます。

## 開発

```bash
npm install
npm run dev
```

## ビルド

```bash
npm run build
npm run preview
```

## データの編集

- 旅程: [src/data/itinerary.ts](src/data/itinerary.ts)
- 訪問先・マップ座標: [src/data/locations.ts](src/data/locations.ts)
- 旅の概要: [src/data/trip.ts](src/data/trip.ts)

日付・訪問先・ミッション文言はすべてこの3ファイルを編集するだけで変更できます。

## デプロイ（GitHub Pages）

`main` ブランチに push すると `.github/workflows/deploy.yml` が自動で GitHub Pages にデプロイします。

初回のみ、リポジトリの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定してください。公開URLは `https://<ユーザー名>.github.io/adventure/` になります。

## PWA

ホーム画面に追加してアプリのように使えます（`vite-plugin-pwa` によりオフライン対応・自動更新）。進捗（到着・写真ミッション）は端末内の `localStorage` に保存されます。
