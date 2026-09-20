# FUTURE FANTASY -未来の地図-

2027年1月22日〜24日の仙台旅行のための、RPG風デザインのスマートフォン専用 PWA。
「ゲーム」ではなく、旅行そのものを主役にして、RPGの世界観と演出を少しだけ足した旅のしおりです。

- アプリ名: FUTURE FANTASY / 未来の地図
- コンセプト: 60年の軌跡、ここから新たな冒険へ。舞台は仙台。
- 対象: スマートフォン（iPhone 想定）のみ。PC向けレイアウトはありません。

## 画面

| 画面 | 内容 |
| --- | --- |
| ホーム | キービジュアルと、各画面へのメニュー |
| スケジュール | DAY 1〜3 のタブで1日ずつ表示。イラストとタイムライン |
| マップ | 仙台をもとにしたドット絵のワールドマップ。場所をタップすると詳細が出る |
| ミッション | 場所 / 体験 / 特別のミッション一覧。達成すると MISSION COMPLETE 演出が出る |
| 冒険ガイド | 仙台のおすすめスポット一覧。カテゴリで絞り込める |

5画面すべてに共通フッターがあり、そこから相互に移動できます。
画面上部にタイトルバーは置かず、内容をできるだけ広く使っています。

## 開発

```bash
npm install
npm run dev        # 開発サーバー
npm run build      # 型チェック + 本番ビルド
npm run preview    # ビルド結果の確認
```

スマートフォンでの確認は `npm run dev -- --host` で同じネットワークの端末から開きます。

## データの変更

旅程・場所・ミッションは `src/data/` にまとまっています。ここだけ書き換えれば画面に反映されます。

| ファイル | 内容 |
| --- | --- |
| `src/data/trip.ts` | アプリ名・キャッチコピー・旅行期間 |
| `src/data/schedule.ts` | DAY 1〜3 の日付・タイトル・一言・時刻ごとの予定 |
| `src/data/locations.ts` | マップ上の場所、座標（地形画像に対する％）、説明文 |
| `src/data/missions.ts` | ミッションと、達成時に明るくなるマップ上の場所の紐づけ |

ミッションの `locationId` がマップの場所と連動します。ミッションを1つでも達成すると、
その場所のアイコンが明るく光ります。`locked: true` の場所は ??? のまま暗く表示されます。

達成状況は端末の localStorage（キー `future-fantasy:progress:v1`）に保存され、
アプリを閉じても残ります。

### 冒険ガイドの写真を差し替える

いまはドット絵の仮画像を入れています。実写にするときは、画像を
`src/assets/art/` に置いて `src/data/guide.ts` の `image` を差し替え、
その項目に `isPhoto: true` を足してください。`isPhoto` があるとドットの
拡大補間を切り、写真としてなめらかに表示します。

スポットを増やすときは `GUIDE_ENTRIES` に1件足すだけで、
カテゴリタブの絞り込みにも自動で反映されます。

## ドット絵素材

キービジュアル・マップ・アイコンは、すべてコード（`scripts/`）から生成した PNG です。
生成物は `src/assets/art/` にコミット済みなので、ビルド時に再生成する必要はありません。

```bash
npm run art      # src/assets/art/*.png を再生成
npm run icons    # public/icons/*.png, favicon.svg を再生成
```

`scripts/pixel.mjs` が PNG 書き出しと描画、`scripts/art-parts.mjs` が雲・木・塔などの
共通パーツ、`scripts/generate-art.mjs` が各素材の構図を担当します。

UI のアイコンは `src/components/ui/pixel-glyphs.ts` に 16x16 のドットの文字列として定義し、
SVG の矩形に変換して描画しています。拡大してもにじみません。

## フォント

`DotGothic16`（日本語）と `Press Start 2P`（英字）を、アプリで使う文字だけに絞って
`public/fonts/` に self-host しています（合計約 36KB）。オフラインでも表示が崩れません。

文言を大きく変えて字が足りなくなった場合は、以下で作り直します。

```bash
pip install fonttools brotli
python3 scripts/subset-fonts.py
```

## PWA

- `vite-plugin-pwa` で manifest と Service Worker を生成
- `display: standalone` / `viewport-fit=cover` / セーフエリア対応
- ホーム画面に追加すると、アドレスバーなしのアプリとして起動します
- 初回表示後はオフラインでも4画面すべて閲覧できます

## 配信

GitHub Pages 向けに `vite.config.ts` の `base` を `/adventure/` にしています。
別の場所へ置く場合はこの値と `index.html` 内のパスを合わせて変更してください。

```bash
npm run deploy   # dist を gh-pages ブランチへ公開
```

## 技術構成

React 19 / TypeScript / Vite / CSS Modules / vite-plugin-pwa

レイアウトは 390 x 844 のデザインを基準に、CSS 変数 `--u` で端末の幅と高さの
小さいほうに合わせて比例拡大しています。どの iPhone でも同じ見た目になり、
スクロールなしで1画面に収まります。
