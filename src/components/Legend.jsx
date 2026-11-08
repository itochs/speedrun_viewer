function Legend({ color }) {
  const items = [
    { label: "投稿記録数（件）", stroke: color.runs },
    { label: "初登場ユーザー数（人）", stroke: color.firstSeen },
  ];

  return (
    <div
      aria-label="グラフの凡例"
      className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-800"
    >
      {items.map(({ label, stroke }) => (
        <div key={label} className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="w-8 border-t-[3px]"
            style={{ borderColor: stroke }}
          />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

export default Legend;
