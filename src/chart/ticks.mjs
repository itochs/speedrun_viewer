export function createXTicks(scale, monthlyStatistics) {
  if (monthlyStatistics == null || monthlyStatistics.length === 0) {
    return [];
  }

  return scale
    .ticks()
    .filter(
      (index) =>
        Number.isInteger(index) &&
        index >= 0 &&
        index < monthlyStatistics.length,
    )
    .map((index) => ({
      x: scale(index),
      label: `${monthlyStatistics[index].year}年${monthlyStatistics[index].month}月`,
    }));
}

export function createYTicks(scale) {
  return scale.ticks().map((value) => ({
    y: scale(value),
    label: value,
  }));
}
