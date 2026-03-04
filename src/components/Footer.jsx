function Footer() {
  return (
    <footer className="footer has-background-dark" style={{ userSelect: "none" }}>
      <div className="content has-text-centered">
        <div className="columns">
          <a
            className="button column is-one-thirds"
            href="https://www.speedrun.com/"
          >
            speedrun
          </a>
          <a
            className="button column is-one-thirds"
            href="https://github.com/speedruncomorg/api"
          >
            speedrun API
          </a>
        </div>
        <p className="has-text-primary-light">2022 ito hal</p>
      </div>
    </footer>
  );
}

export default Footer;
