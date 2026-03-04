# speedrun_viewer

speedrun.com API を使って、ゲームごとの投稿記録数と新規プレイヤー数の推移を可視化する React アプリです。  
フロントエンドは Vite + React、スタイルは Tailwind CSS、グラフ描画は D3 で実装しています。

## 開発環境

- Node.js 18 以上を推奨
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

## 主な構成

- `src/App.jsx`: 画面全体の構成、検索対象ゲーム名の状態管理
- `src/api.jsx`: speedrun.com API の取得・整形ロジック
- `src/components/Selector.jsx`: ゲーム検索フォーム、候補選択 UI
- `src/components/ZoomableLineChart.jsx`: D3 によるズーム可能な折れ線グラフ
- `src/style.css`: Tailwind CSS のエントリ（`@import "tailwindcss";`）

## メモ

- 初期表示では `super mario 64` を検索します。
- API レスポンスに依存するため、ネットワーク状況や API 制限により表示が遅延する場合があります。
