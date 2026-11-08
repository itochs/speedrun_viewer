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
    monthlyStatistics,
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
    right: 125,
  };
  const color = {
    axis: "#022D39",
    all: { fill: "#022D39", opacity: 0.5 },
    new: { fill: "#0794BD", opacity: 0.5 },
  };
  const width = 600;
  const height = 300;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Selector {...{ gameNameStatus: [gameName, setGameName], games }} />
        {status === "error" ? (
          <p role="alert" className="py-6 text-center text-red-700">
            {error}
          </p>
        ) : (
          <ZoomableLineChart
            {...{
              monthlyStatistics,
              width,
              height,
              margin,
              color,
            }}
          >
            <Legend {...{ width, margin, color }} />
          </ZoomableLineChart>
        )}
        {status === "success" && (
          <div className="mt-4 flex flex-col items-center gap-3 text-center">
            <p className="text-sm text-slate-700">
              集計済み {loadedCount} 件
              {(hasNextPage || truncated) && "（読み込み済みの範囲）"}
            </p>
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
                API の取得上限により、先頭 10,000 件の範囲のみを集計しています。
              </p>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
