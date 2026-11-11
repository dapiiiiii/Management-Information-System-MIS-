/**
 * Colour assignment for every chart, in one place. Colours follow the
 * entity, never its rank or position, so a filter that removes a series
 * never repaints the ones that remain. Values live in globals.css.
 */

const series = {
  1: "var(--color-series-1)",
  2: "var(--color-series-2)",
  3: "var(--color-series-3)",
  4: "var(--color-series-4)",
  muted: "var(--color-series-muted)",
} as const;

type Ink = "light" | "dark";

function lookup(map: Record<string, string>, fallback: string = series.muted) {
  return (id: string) => map[id] ?? fallback;
}

/* Employment status at follow-up (categorical, slots 1–3 plus de-emphasis) */
export const outcomeColor = lookup({ wage: series[1], self: series[2], seeking: series[3], unreached: series.muted });
export const outcomeInk = (id: string): Ink => (id === "wage" || id === "seeking" ? "light" : "dark");

/* Participation by gender (categorical, slots 1–3) */
export const genderColor = lookup({ female: series[1], male: series[2], undisclosed: series[3] });
export const genderInk = (id: string): Ink => (id === "male" ? "dark" : "light");

/* Intake columns (categorical, slots 1–2) */
export const intakeSeries = [
  { id: "enrolled", label: "Enrolled", color: series[1] },
  { id: "certified", label: "Certified", color: series[2] },
];

/**
 * Categorical slots in their validated order, for charts whose series are
 * the subject (e.g. a trainer's cohorts). Never more than four in one chart:
 * a fifth series folds into "Other" rather than reusing a hue.
 */
export const categoricalSlots = [series[1], series[2], series[3], series[4]] as const;

/* Where participants are now (ordinal: one hue, later stages darker) */
export const stageColor = lookup({
  training: "var(--color-stage-2)",
  assessment: "var(--color-stage-3)",
  reassessment: "var(--color-stage-4)",
  certified: "var(--color-stage-6)",
  exited: series.muted,
});

/* Assessment results (status: always paired with a text label) */
export const resultColor = lookup({ competent: "var(--color-status-good)", notYet: "var(--color-sun)" });
export const resultInk = (id: string): Ink => (id === "competent" ? "light" : "dark");

export const singleSeries = series[1];
