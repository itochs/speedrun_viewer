export function formatLoadedPeriod(monthlyStatistics) {
  const activeMonths = monthlyStatistics?.filter(
    ({ runCount }) => runCount > 0,
  );
  if (activeMonths == null || activeMonths.length === 0) {
    return null;
  }

  const first = activeMonths[0];
  const last = activeMonths.at(-1);
  const start = `${first.year}年${first.month}月`;
  const end = `${last.year}年${last.month}月`;
  return start === end ? start : `${start}〜${end}`;
}
