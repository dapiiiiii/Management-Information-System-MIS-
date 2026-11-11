/**
 * A quiet trend line for a stat tile: de-emphasis gray, the latest point in
 * the accent. Decorative; the tile states the value and the change in text.
 */
export function Sparkline({ values, width = 88, height = 30 }: { values: number[]; width?: number; height?: number }) {
  if (values.length < 2) return null;
  const pad = 4;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const x = (i: number) => pad + (i / (values.length - 1)) * (width - pad * 2);
  const y = (v: number) => pad + (1 - (v - min) / span) * (height - pad * 2);
  const d = values.map((v, i) => `${i ? "L" : "M"}${x(i)},${y(v)}`).join("");
  const last = values.length - 1;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="chart-mark block overflow-visible">
      <path d={d} fill="none" stroke="var(--color-series-muted)" strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={x(last)} cy={y(values[last])} r={3.25} fill="var(--color-series-1)" stroke="var(--color-surface)" strokeWidth={2} />
    </svg>
  );
}
