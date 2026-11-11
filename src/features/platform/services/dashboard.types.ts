import type { IconName } from "@/components/ui/Icon";
import type { ModuleId } from "../config/modules";

/**
 * The shape of everything the overview screens render. Components depend on
 * these types only, never on where the data comes from.
 */

export type Period = "6m" | "12m" | "all";
export type GenderFilter = "all" | "female" | "male";
export type DashboardFilters = { period: Period; gender: GenderFilter };

export type ValueFormat = "number" | "percent";

export type Delta = {
  /** Percent change for counts; percentage points for rates. */
  value: number;
  unit: "percent" | "points";
  /** Whether an increase is the desired direction. */
  upIsGood: boolean;
  /** What the change is measured against, e.g. "previous 6 months". */
  comparison: string;
};

export type Kpi = {
  id: string;
  label: string;
  value: number;
  format: ValueFormat;
  /** Shown after the value, e.g. "of 5". */
  suffix?: string;
  delta?: Delta;
  /** Recent values, oldest first, drawn as a sparkline. */
  trend?: number[];
  /** One short line of context under the value. */
  note?: string;
};

export type Series = { id: string; label: string; values: Array<number | null> };

export type TimeSeries = {
  granularity: "month" | "week";
  /** ISO dates (first day of each month or week), oldest first. */
  points: string[];
  series: Series[];
  format: ValueFormat;
};

export type RankedItem = { id: string; label: string; value: number; detail?: string };

export type Category = { id: string; label: string };

/** One bar of a stacked breakdown: counts per category id. */
export type BreakdownRow = {
  id: string;
  label: string;
  values: Record<string, number>;
  /** Explains an empty row, e.g. "First due January 2027". */
  note?: string;
};

export type Breakdown = { categories: Category[]; rows: BreakdownRow[] };

export type Indicator = {
  id: string;
  label: string;
  actual: number;
  target: number;
  status: "on_track" | "below_target";
};

export type CohortStage = "enrolling" | "in_training" | "assessment" | "certified";

export type CohortRow = {
  id: string;
  name: string;
  /** ISO date the cohort starts or started. */
  start: string;
  trainees: number;
  /** Average attendance in percent; null before the first session. */
  attendance: number | null;
  /** Share of the curriculum delivered, in percent. */
  progress: number;
  stage: CohortStage;
};

export type Severity = "high" | "medium" | "info";

export type AttentionItem = {
  id: string;
  title: string;
  detail: string;
  severity: Severity;
  module?: ModuleId;
};

export type ActivityItem = {
  id: string;
  /** ISO date-time. */
  at: string;
  actor: string;
  action: string;
  subject?: string;
  icon: IconName;
};

export type ScheduleItem = {
  id: string;
  /** ISO date-time. */
  at: string;
  title: string;
  detail: string;
  tag?: string;
};

export type DeviceRow = {
  id: string;
  device: string;
  assignedTo: string;
  cohort: string;
  /** ISO date-time of the last successful sync. */
  lastSync: string;
  pending: number;
  conflicts: number;
};

/* ---------------------------------------------------------------- */

export type IntakeRow = {
  id: string;
  label: string;
  enrolled: number;
  /** Null until the cohort's assessment closes. */
  certified: number | null;
  stage: CohortStage;
};

export type ProgrammeDashboard = {
  kind: "programme";
  asOf: string;
  /** First and last month the period filter covers (ISO dates). */
  range: { from: string; to: string };
  kpis: Kpi[];
  intakes: IntakeRow[];
  trend: TimeSeries;
  pipeline: RankedItem[];
  outcomes: Breakdown;
  indicators: Indicator[];
  /** Null when the view is already filtered to one gender. */
  gender: RankedItem[] | null;
  /** Female share (percent) at each stage, enrolled to employed; null when filtered. */
  femaleShareByStage: RankedItem[] | null;
  cohorts: CohortRow[];
  attendanceByCohort: RankedItem[];
  attention: AttentionItem[];
  activity: ActivityItem[];
  schedule: ScheduleItem[];
  admin?: {
    accountsByRole: RankedItem[];
    devices: DeviceRow[];
    audit: ActivityItem[];
  };
};

export type TrainerDashboard = {
  kind: "trainer";
  asOf: string;
  kpis: Kpi[];
  attendanceTrend: TimeSeries;
  cohorts: CohortRow[];
  schedule: ScheduleItem[];
  attention: AttentionItem[];
  device: DeviceRow;
};

export type AssessorDashboard = {
  kind: "assessor";
  asOf: string;
  kpis: Kpi[];
  resultsByModule: Breakdown;
  queue: ScheduleItem[];
  awaiting: AttentionItem[];
};

export type JourneyStage = {
  id: string;
  label: string;
  state: "complete" | "current" | "upcoming";
  detail: string;
};

export type TraineeDashboard = {
  kind: "trainee";
  asOf: string;
  programme: string;
  cohort: string;
  journey: JourneyStage[];
  kpis: Kpi[];
  modules: Array<{ id: string; label: string; progress: number }>;
  assessments: Array<{ id: string; label: string; result: string; date: string; competent: boolean }>;
  certificate:
    | { status: "issued"; id: string; issued: string }
    | { status: "pending"; detail: string };
  followUps: Array<{
    id: string;
    label: string;
    due: string;
    status: "completed" | "upcoming";
    outcome?: string;
  }>;
};

export type DashboardData = ProgrammeDashboard | TrainerDashboard | AssessorDashboard | TraineeDashboard;
