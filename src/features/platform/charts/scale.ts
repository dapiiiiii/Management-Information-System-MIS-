import type { ValueFormat } from "../services/dashboard.types";

export type Domain = { min: number; max: number; ticks: number[] };

const NICE_STEPS = [1, 2, 2.5, 5, 10];

/** A clean step of roughly `count` intervals covering `span`. */
function niceStep(span: number, count: number): number {
  const raw = span / count;
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = NICE_STEPS.find((s) => s * magnitude >= raw) ?? 10;
  return step * magnitude;
}

function ticksBetween(min: number, max: number, step: number): number[] {
  const ticks: number[] = [];
  for (let t = min; t <= max + step / 1000; t += step) ticks.push(Math.round(t * 1000) / 1000);
  return ticks;
}

/** Bars always start at zero. */
export function zeroDomain(maxValue: number, count = 4): Domain {
  if (maxValue <= 0) return { min: 0, max: 1, ticks: [0, 1] };
  const step = niceStep(maxValue, count);
  const max = Math.ceil(maxValue / step) * step;
  return { min: 0, max, ticks: ticksBetween(0, max, step) };
}

/**
 * Lines may start above zero so change stays readable. Rates keep to the
 * 0 to 100 range and include any reference value (a target) in view.
 */
export function lineDomain(values: number[], format: ValueFormat, reference?: number): Domain {
  const all = reference === undefined ? values : [...values, reference];
  if (all.length === 0) return { min: 0, max: 1, ticks: [0, 1] };
  if (format !== "percent") return zeroDomain(Math.max(...all));

  const low = Math.min(...all);
  const high = Math.max(...all);
  const step = high - low > 30 ? 10 : 5;
  const min = Math.max(0, Math.floor((low - step * 0.8) / step) * step);
  const max = Math.min(100, Math.ceil((high + step * 0.4) / step) * step);
  return { min, max, ticks: ticksBetween(min, max, step) };
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
