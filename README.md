# speedrun_viewer

speedrun.com API を使って、ゲームごとの投稿記録数と新規プレイヤー数の推移を可視化する React アプリです。  
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
- `src/application/loadGameStatistics.mjs`: ゲーム検索から集計までのユースケース
- `src/domain/monthlyRunStatistics.mjs`: 月別の記録数と新規プレイヤー数の計算
- `src/infrastructure/speedrunClient.mjs`: speedrun.com API との通信とデータ変換
- `src/components/Selector.jsx`: ゲーム検索フォーム、候補選択 UI
- `src/components/ZoomableLineChart.jsx`: D3 によるズーム可能な折れ線グラフ
- `src/style.css`: Tailwind CSS のエントリ（`@import "tailwindcss";`）

## 設計の考え方

画面は `loadGameStatistics` にゲーム名を渡します。ユースケースは API クライアントからゲームと記録を取得し、月別集計を呼び出します。

React の画面からユースケースを呼ぶ処理は `useGameStatistics` にまとめています。`App` はフックが返す状態に応じて、検索フォーム、グラフ、エラーを表示します。

- **ドメイン**: 「新規プレイヤーは、そのゲームで以前の月に登場していない登録済みプレイヤー」という集計ルールを持ちます。通信や React には依存しません。
- **アプリケーション**: 検索、記録取得、集計の順序を決めます。外部 API の URL やレスポンス形式は扱いません。
- **インフラストラクチャ**: speedrun.com の URL、ページ送り、レスポンスからアプリ内のデータへの変換を担当します。

この分け方は DDD の関心の分離をこの小さなアプリに適用したものです。集約やリポジトリなどの仕組みは、必要になるまで追加していません。

## メモ

- 初期表示では `super mario 64` を検索します。
- API レスポンスに依存するため、ネットワーク状況や API 制限により表示が遅延する場合があります。
