// First seen means no earlier month among the runs supplied to this calculation.
export function calculateMonthlyRunStatistics(runs) {
  const months = new Map();

  for (const run of runs) {
    const year = run.submittedAt.getUTCFullYear();
    const month = run.submittedAt.getUTCMonth() + 1;
    const key = `${year}-${month}`;
    if (!months.has(key)) {
      months.set(key, { runCount: 0, playerIds: new Set() });
    }
    const statistics = months.get(key);
    statistics.runCount += 1;
    for (const id of run.playerIds) {
      if (id != null) {
        statistics.playerIds.add(id);
      }
    }
  }

  const years = [
    ...new Set(runs.map((run) => run.submittedAt.getUTCFullYear())),
  ].sort((a, b) => a - b);
  const seenPlayers = new Set();

  return years.flatMap((year) =>
    Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const statistics = months.get(`${year}-${month}`);
      let newPlayerCount = 0;
      for (const id of statistics?.playerIds ?? []) {
        if (!seenPlayers.has(id)) {
          seenPlayers.add(id);
          newPlayerCount += 1;
        }
      }
      return {
        year,
        month,
        runCount: statistics?.runCount ?? 0,
        newPlayerCount,
      };
    }),
  );
}
