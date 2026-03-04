import { useRef, useState } from "react";

function Selector({ gameNameStatus, games }) {
  const [gameName, setGameName] = gameNameStatus;
  const [value, setValue] = useState(gameName);
  const inputRef = useRef();

  return (
    <div className="p-5" style={{ userSelect: "none" }}>
      <div className="block">
        <label className="is-primary"> search game</label>
      </div>
      <div>
        <form
          className="columns"
          onSubmit={(event) => {
            event.preventDefault();
            setGameName(inputRef.current.value);
          }}
        >
          <div className="column is-half">
            <input
              className="input is-primary"
              ref={inputRef}
              type="search"
              placeholder="input game name"
              defaultValue={value}
              onChange={(event) => {
                setValue(event.target.value);
              }}
            />
          </div>

          <div className="column is-one-fifth">
            <button
              type="submit"
              className="button is-dark"
              style={{ textAlign: "center" }}
              onClick={() => {
                setGameName(inputRef.current.value);
                setValue(inputRef.current.value);
              }}
            >
              search
            </button>
          </div>
        </form>
      </div>

      <div className="columns">
        {games == null ? (
          <div className="column">
            <div className="select is-primary">
              <select>
                <option>none</option>
              </select>
            </div>
          </div>
        ) : (
          <div className="column">
            <div className="select is-primary">
              <select
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Selector;
