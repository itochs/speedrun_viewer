import Footer from "./components/Footer";
import Header from "./components/Header";
import Legend from "./components/Legend";
import Selector from "./components/Selector";
import ZoomableLineChart from "./components/ZoomableLineChart";
import { useGameStatistics } from "./hooks/useGameStatistics";

function App() {
  const { gameName, setGameName, games, monthlyStatistics, status, error } =
    useGameStatistics();

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
      </main>
      <Footer />
    </div>
  );
}

export default App;
