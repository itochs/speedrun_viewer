import { useRef, useState } from "react";

function Selector({ gameNameStatus, games }) {
  const [gameName, setGameName] = gameNameStatus;
  const [value, setValue] = useState(gameName);
  const inputRef = useRef();

  return (
    <div className="select-none rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="mb-3">
        <label className="font-semibold text-slate-700">search game</label>
      </div>
      <div className="mb-4">
        <form
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
          onSubmit={(event) => {
            event.preventDefault();
            setGameName(inputRef.current.value);
          }}
        >
          <input
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none ring-cyan-400 placeholder:text-slate-400 focus:ring-2 sm:max-w-md"
            ref={inputRef}
            type="search"
            placeholder="input game name"
            defaultValue={value}
            onChange={(event) => {
              setValue(event.target.value);
            }}
          />

          <button
            type="submit"
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 sm:w-auto"
            onClick={() => {
              setGameName(inputRef.current.value);
              setValue(inputRef.current.value);
            }}
          >
            search
          </button>
        </form>
      </div>

      <div>
        {games == null ? (
          <select
            className="w-full max-w-md rounded-md border border-slate-300 bg-slate-100 px-3 py-2 text-sm text-slate-500"
            disabled
          >
            <option>none</option>
          </select>
        ) : (
          <select
            className="w-full max-w-md rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-cyan-400 focus:ring-2"
            onChange={(event) => {
              event.preventDefault();
              setGameName(event.target.value);
            }}
          >
            {games.data.map(({ names }, i) => (
              <option key={i} value={names.international}>
                {names.international}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

export default Selector;
