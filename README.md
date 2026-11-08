# speedrun_viewer

speedrun.com API を使って、ゲームごとの投稿記録数と読み込み済み範囲で初登場したプレイヤー数の推移を可視化する React アプリです。
フロントエンドは Vite + React、スタイルは Tailwind CSS、グラフ描画は D3 で実装しています。

## 開発環境

- Node.js 20.19 以上、または 22.12 以上
- pnpm 8 系

## セットアップ

```bash
pnpm install
pnpm dev
```

ブラウザで `http://localhost:5173` を開いて確認できます。

## 利用可能なスクリプト

- `pnpm dev`: 開発サーバー起動
- `pnpm build`: 本番ビルド
- `pnpm preview`: ビルド成果物のローカル確認
- `pnpm test`: API 取得・集計のテスト

## 主な構成

- `src/App.jsx`: 画面全体の表示構成
- `src/hooks/useGameStatistics.js`: ゲーム検索の状態、取得、エラー処理
- `src/hooks/useChartZoom.js`: SVG のズーム操作と状態管理
- `src/chart/geometry.mjs`: 縮尺と折れ線の座標計算
- `src/chart/summary.mjs`: 表示中の対象期間の整形
- `src/chart/ticks.mjs`: X・Y 軸の目盛り位置とラベルの計算
- `src/application/loadGameStatistics.mjs`: ゲーム検索から集計までのユースケース
- `src/domain/monthlyRunStatistics.mjs`: 月別の記録数と初登場プレイヤー数の計算
- `src/infrastructure/speedrunClient.mjs`: speedrun.com API との通信とデータ変換
- `src/components/Selector.jsx`: ゲーム検索フォーム、候補選択 UI
- `src/components/ZoomableLineChart.jsx`: 軸ラベル付き折れ線グラフの SVG 表示
- `src/components/Legend.jsx`: 投稿記録数と初登場ユーザー数の凡例
- `src/components/XAxis.jsx`・`src/components/YAxis.jsx`: 軸線と目盛りの表示
- `src/style.css`: Tailwind CSS のエントリ（`@import "tailwindcss";`）

## 設計の考え方

画面は `loadGameStatistics` にゲーム名を渡します。ユースケースは API クライアントからゲームと記録を取得し、月別集計を呼び出します。

React の画面からユースケースを呼ぶ処理は `useGameStatistics` にまとめています。`App` はフックが返す状態に応じて、検索フォーム、グラフ、エラーを表示します。
グラフは `useChartZoom` がズーム操作だけを管理し、`createChartGeometry` が縮尺と線の座標を計算します。X・Y 軸コンポーネントはその縮尺から目盛りを作り、SVG を描画します。

- **ドメイン**: 「初登場プレイヤーは、読み込み済みの記録で以前の月に登場していない登録済みプレイヤー」という集計ルールを持ちます。通信や React には依存しません。
- **アプリケーション**: 検索、記録取得、集計の順序を決めます。外部 API の URL やレスポンス形式は扱いません。
- **インフラストラクチャ**: speedrun.com の URL、ページ送り、レスポンスからアプリ内のデータへの変換を担当します。

この分け方は DDD の関心の分離をこの小さなアプリに適用したものです。集約やリポジトリなどの仕組みは、必要になるまで追加していません。

## メモ

- 初期表示では `super mario 64` を検索します。
- 投稿日の新しい順に最初の 200 件を取得します。「次の 200 件を読み込む」を押すたびに古いページを取得し、読み込み済みの記録を累積してグラフを更新します。古い記録を追加すると、初登場プレイヤー数が過去の月へ移る場合があります。
- API レスポンスに依存するため、ネットワーク状況や API 制限により表示が遅延する場合があります。
- API v1 のページ上限に達したゲームは、先頭 10,000 件の範囲のみを集計し、画面にその旨を表示します。
