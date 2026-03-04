function Footer() {
  return (
    <footer className="mt-1 select-none bg-slate-900 py-6 text-center text-slate-200">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 sm:px-6">
        <div className="flex flex-wrap justify-center gap-3">
          <a
            className="rounded-md border border-slate-500 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
            href="https://www.speedrun.com/"
          >
            speedrun
          </a>
          <a
            className="rounded-md border border-slate-500 px-4 py-2 text-sm font-semibold hover:bg-slate-800"
            href="https://github.com/speedruncomorg/api"
          >
            speedrun API
          </a>
        </div>
        <p className="text-sm text-cyan-300">2022 ito hal</p>
      </div>
    </footer>
  );
}

export default Footer;
