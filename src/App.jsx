import { useEffect, useState } from "react";
import api from "./api.mjs";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Legend from "./components/Legend";
import Selector from "./components/Selector";
import ZoomableLineChart from "./components/ZoomableLineChart";

function App() {
  const [data, setData] = useState({
    ymData: null,
    games: null,
    loading: true,
    error: null,
  });
  const [gameName, setGameName] = useState("super mario 64");

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    (async () => {
      setData({ ymData: null, games: null, loading: true, error: null });
      try {
        const { ymData, games } = await api(gameName, {
          signal: controller.signal,
        });
        if (active) {
          setData({ ymData, games, loading: false, error: null });
        }
      } catch (error) {
        if (active) {
          setData({
            ymData: null,
            games: null,
            loading: false,
            error:
              error.message === "ゲームが見つかりませんでした。"
                ? error.message
                : "データを取得できませんでした。時間をおいて再試行してください。",
          });
        }
      }
    })();
    return () => {
      active = false;
      controller.abort();
    };
  }, [gameName]);

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
        <Selector
          {...{ gameNameStatus: [gameName, setGameName], games: data.games }}
        />
        {data.error ? (
          <p role="alert" className="py-6 text-center text-red-700">
            {data.error}
          </p>
        ) : (
          <ZoomableLineChart
            {...{
              ymData: data.ymData,
              width,
              height,
              margin,
              color,
            }}
          >
            <Legend {...{ width, margin, color }} />
          </ZoomableLineChart>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default App;
