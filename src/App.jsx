import Footer from "./components/Footer";
import Header from "./components/Header";
import Legend from "./components/Legend";
import Selector from "./components/Selector";
import ZoomableLineChart from "./components/ZoomableLineChart";
import { useGameStatistics } from "./hooks/useGameStatistics";

function App() {
  const {
    gameName,
    setGameName,
    games,
    selectedGameName,
    monthlyStatistics,
    periodLabel,
    loadedCount,
    hasNextPage,
    truncated,
    loadingMore,
    status,
    error,
    pageError,
    loadNextPage,
  } = useGameStatistics();

  const margin = {
    top: 50,
    bottom: 50,
    left: 50,
    right: 40,
  };
  const color = {
    runs: "#022D39",
    firstSeen: "#0794BD",
  };
  const width = 600;
  const height = 300;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Selector {...{ gameNameStatus: [gameName, setGameName], games }} />
        <section
          aria-labelledby="chart-heading"
          className="mt-5 rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
        >
          <h2 id="chart-heading" className="text-lg font-bold text-slate-900">
            {selectedGameName
              ? `${selectedGameName} の月別投稿`
              : "月別の投稿記録"}
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            投稿日を基準に、新しい記録から最大 200 件ずつ読み込んでいます。
          </p>
          {status === "success" && (
            <p className="mt-3 text-sm font-medium text-slate-800">
              対象期間: {periodLabel ?? "投稿日がある記録なし"} ・ 集計済み:{" "}
              {loadedCount} 件
            </p>
          )}
          <Legend color={color} />
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            投稿記録数は同じ人の複数投稿も数えます。初登場ユーザー数は、読み込み済みの記録で初めて現れた登録ユーザーの人数です。
          </p>
          {status === "error" ? (
            <p role="alert" className="py-6 text-center text-red-700">
              {error}
            </p>
          ) : (
            <ZoomableLineChart
              {...{ monthlyStatistics, width, height, margin, color }}
            />
          )}
          {status === "success" && (
            <div className="mt-4 flex flex-col items-center gap-3 text-center">
              {(hasNextPage || truncated) && (
                <p className="text-sm text-slate-600">
                  このグラフは読み込み済みの範囲です。古いページを追加すると初登場の値が変わる場合があります。
                </p>
              )}
              {hasNextPage && (
                <button
                  type="button"
                  className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"
                  onClick={loadNextPage}
                  disabled={loadingMore}
                >
                  {loadingMore ? "読み込み中…" : "次の 200 件を読み込む"}
                </button>
              )}
              {pageError && (
                <p role="alert" className="text-sm text-red-700">
                  {pageError}
                </p>
              )}
              {truncated && (
                <p role="status" className="text-sm text-amber-800">
                  API の取得上限により、先頭 10,000
                  件の範囲のみを集計しています。
                </p>
              )}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default App;
