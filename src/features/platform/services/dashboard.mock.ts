/**
 * MOCK: replace with real API.
 *
 * Sample figures for the overview screens, for frontend development and
 * stakeholder review only. Every number is derived from one small, coherent
 * cohort model below, so totals agree across tiles, charts and tables. It is
 * selected by NEXT_PUBLIC_PLATFORM_DATA (see dashboard.service.ts) and the UI
 * labels it "Sample data" wherever it appears.
 *
 * Simulated failure: set sessionStorage "tce:mock-dashboard-fail" to "1".
 */

import type { Role } from "@/features/auth/config/roles";
import type { DashboardService } from "./dashboard.service";
import type {
  ActivityItem,
  AssessorDashboard,
  AttentionItem,
  Breakdown,
  CohortRow,
  CohortStage,
  DashboardFilters,
  DeviceRow,
  GenderFilter,
  Indicator,
  Kpi,
  Period,
  ProgrammeDashboard,
  RankedItem,
  ScheduleItem,
  TraineeDashboard,
  TrainerDashboard,
} from "./dashboard.types";

const LATENCY_MS = 450;
const AS_OF = "2026-11-06";

const wait = (ms = LATENCY_MS) => new Promise<void>((resolve) => window.setTimeout(resolve, ms));

/* ------------------------------------------------------------------
   The cohort model
------------------------------------------------------------------- */

type CohortSeed = {
  id: string;
  name: string;
  start: string;
  /** Month training ends and certificates are issued (YYYY-MM). */
  endMonth: string;
  applications: number;
  enrolled: number;
  female: number;
  undisclosed: number;
  /** Trainees who completed training; null while training continues. */
  completed: number | null;
  /** Certified trainees; null until assessment closes. */
  certified: number | null;
  attendance: number | null;
  progress: number;
  stage: CohortStage;
};

const COHORTS: readonly CohortSeed[] = [
  { id: "a", name: "Cohort A", start: "2025-09-08", endMonth: "2026-01", applications: 71, enrolled: 48, female: 19, undisclosed: 1, completed: 44, certified: 42, attendance: 93, progress: 100, stage: "certified" },
  { id: "b", name: "Cohort B", start: "2025-11-10", endMonth: "2026-03", applications: 80, enrolled: 52, female: 23, undisclosed: 1, completed: 49, certified: 47, attendance: 94, progress: 100, stage: "certified" },
  { id: "c", name: "Cohort C", start: "2026-01-12", endMonth: "2026-05", applications: 84, enrolled: 55, female: 24, undisclosed: 0, completed: 51, certified: 49, attendance: 92, progress: 100, stage: "certified" },
  { id: "d", name: "Cohort D", start: "2026-03-09", endMonth: "2026-07", applications: 79, enrolled: 54, female: 25, undisclosed: 1, completed: 50, certified: 48, attendance: 90, progress: 100, stage: "certified" },
  { id: "e", name: "Cohort E", start: "2026-05-11", endMonth: "2026-09", applications: 88, enrolled: 58, female: 27, undisclosed: 1, completed: 55, certified: 52, attendance: 89, progress: 100, stage: "certified" },
  { id: "f", name: "Cohort F", start: "2026-07-06", endMonth: "2026-11", applications: 83, enrolled: 56, female: 25, undisclosed: 1, completed: 54, certified: null, attendance: 87, progress: 100, stage: "assessment" },
  { id: "g", name: "Cohort G", start: "2026-09-07", endMonth: "2027-01", applications: 92, enrolled: 60, female: 28, undisclosed: 1, completed: null, certified: null, attendance: 86, progress: 38, stage: "in_training" },
  { id: "h", name: "Cohort H", start: "2026-11-16", endMonth: "2027-03", applications: 66, enrolled: 41, female: 19, undisclosed: 0, completed: null, certified: null, attendance: null, progress: 0, stage: "enrolling" },
];

/** Monthly average attendance across cohorts in training, Sep 2025 to Oct 2026. */
const ATTENDANCE_BY_MONTH: Record<string, number> = {
  "2025-09": 94, "2025-10": 93, "2025-11": 94, "2025-12": 92, "2026-01": 93, "2026-02": 92, "2026-03": 91,
  "2026-04": 90, "2026-05": 91, "2026-06": 89, "2026-07": 90, "2026-08": 88, "2026-09": 87, "2026-10": 86,
};

type Window = { from: string; to: string };

const WINDOWS: Record<Period, Window> = {
  "6m": { from: "2026-05", to: "2026-10" },
  "12m": { from: "2025-11", to: "2026-10" },
  all: { from: "2025-09", to: "2026-10" },
};

/** Only the 6-month view has a complete earlier period to compare with. */
const PREVIOUS: Partial<Record<Period, Window>> = { "6m": { from: "2025-11", to: "2026-04" } };
const COMPARISON = "previous 6 months";

const month = (iso: string) => iso.slice(0, 7);
const within = (m: string, w: Window) => m >= w.from && m <= w.to;

function addMonths(ym: string, n: number): string {
  const [y, m] = ym.split("-").map(Number);
  const d = new Date(Date.UTC(y, m - 1 + n, 1));
  return d.toISOString().slice(0, 7);
}

function monthsOf(w: Window): string[] {
  const out: string[] = [];
  for (let m = w.from; m <= w.to; m = addMonths(m, 1)) out.push(m);
  return out;
}

/** Share of a cohort that a gender filter keeps. */
function share(c: CohortSeed, g: GenderFilter): number {
  if (g === "all") return 1;
  if (g === "female") return c.female / c.enrolled;
  return (c.enrolled - c.female - c.undisclosed) / c.enrolled;
}

const scale = (value: number, c: CohortSeed, g: GenderFilter) => Math.round(value * share(c, g));
const sum = (values: number[]) => values.reduce((total, v) => total + v, 0);
const pct = (part: number, whole: number) => (whole > 0 ? Math.round((part / whole) * 1000) / 10 : 0);
const change = (current: number, previous: number) => Math.round(((current - previous) / previous) * 1000) / 10;

const startedIn = (w: Window) => COHORTS.filter((c) => within(month(c.start), w));
const certifiedIn = (w: Window) => COHORTS.filter((c) => c.certified !== null && within(c.endMonth, w));

const enrolledIn = (w: Window, g: GenderFilter) => sum(startedIn(w).map((c) => scale(c.enrolled, c, g)));
const certificatesIn = (w: Window, g: GenderFilter) => sum(certifiedIn(w).map((c) => scale(c.certified ?? 0, c, g)));

function attendanceIn(w: Window, g: GenderFilter): number {
  const adjust = g === "female" ? 1 : g === "male" ? -1 : 0;
  const values = monthsOf(w).map((m) => ATTENDANCE_BY_MONTH[m] + adjust);
  return Math.round((sum(values) / values.length) * 10) / 10;
}

/* ------------------------------------------------------------------
   Employment follow-up
------------------------------------------------------------------- */

const OUTCOME_CATEGORIES = [
  { id: "wage", label: "Wage employed" },
  { id: "self", label: "Self-employed" },
  { id: "seeking", label: "Seeking work" },
  { id: "unreached", label: "Not reached" },
];

/** Outcome shares at each follow-up point: wage, self-employed, seeking, not reached. */
const OUTCOME_SHARES: Record<GenderFilter, Record<3 | 6, number[]>> = {
  all: { 3: [0.34, 0.22, 0.32, 0.12], 6: [0.4, 0.28, 0.23, 0.09] },
  female: { 3: [0.3, 0.25, 0.33, 0.12], 6: [0.35, 0.32, 0.24, 0.09] },
  male: { 3: [0.37, 0.2, 0.31, 0.12], 6: [0.44, 0.25, 0.22, 0.09] },
};

/** Splits a whole into integer parts by share, using largest remainders so parts sum exactly. */
function distribute(total: number, shares: number[]): number[] {
  const raw = shares.map((s) => s * total);
  const parts = raw.map(Math.floor);
  let remainder = total - sum(parts);
  raw
    .map((value, i) => ({ i, frac: value - Math.floor(value) }))
    .sort((a, b) => b.frac - a.frac)
    .forEach(({ i }) => {
      if (remainder > 0) {
        parts[i] += 1;
        remainder -= 1;
      }
    });
  return parts;
}

function followUpCohorts(offset: number, w: Window) {
  return COHORTS.filter((c) => c.certified !== null && within(addMonths(c.endMonth, offset), w));
}

function outcomes(w: Window, g: GenderFilter): Breakdown {
  const row = (offset: 3 | 6, label: string) => {
    const graduates = sum(followUpCohorts(offset, w).map((c) => scale(c.certified ?? 0, c, g)));
    const parts = distribute(graduates, OUTCOME_SHARES[g][offset]);
    return {
      id: `m${offset}`,
      label,
      values: Object.fromEntries(OUTCOME_CATEGORIES.map((cat, i) => [cat.id, parts[i]])),
    };
  };
  return {
    categories: OUTCOME_CATEGORIES,
    rows: [
      row(3, "3 months"),
      row(6, "6 months"),
      { id: "m12", label: "12 months", values: {}, note: "First due January 2027" },
    ],
  };
}

function employmentRate(w: Window, g: GenderFilter): number {
  const sixMonths = outcomes(w, g).rows[1].values;
  const total = sum(Object.values(sixMonths));
  return pct((sixMonths.wage ?? 0) + (sixMonths.self ?? 0), total);
}

/* ------------------------------------------------------------------
   Programme overview
------------------------------------------------------------------- */

function participantStatus(w: Window, g: GenderFilter): RankedItem[] {
  const cohorts = startedIn(w);
  const total = (pick: (c: CohortSeed) => number) => sum(cohorts.map((c) => scale(pick(c), c, g)));
  return [
    { id: "training", label: "In training", value: total((c) => (c.completed === null ? c.enrolled : 0)) },
    { id: "assessment", label: "In assessment", value: total((c) => (c.completed !== null && c.certified === null ? c.completed : 0)) },
    { id: "reassessment", label: "Awaiting re-assessment", value: total((c) => (c.certified !== null ? (c.completed ?? 0) - c.certified : 0)) },
    { id: "certified", label: "Certified", value: total((c) => c.certified ?? 0) },
    { id: "exited", label: "Did not complete", value: total((c) => (c.completed !== null ? c.enrolled - c.completed : 0)) },
  ];
}

function cohortRows(w: Window, g: GenderFilter): CohortRow[] {
  return COHORTS.filter((c) => c.stage === "enrolling" || (month(c.start) <= w.to && c.endMonth >= w.from))
    .map((c) => ({
      id: c.id,
      name: c.name,
      start: c.start,
      trainees: scale(c.enrolled, c, g),
      attendance: c.attendance,
      progress: c.progress,
      stage: c.stage,
    }))
    .reverse();
}

function indicators(w: Window, g: GenderFilter): Indicator[] {
  const started = startedIn(w);
  const finished = certifiedIn(w);
  const list: Array<Omit<Indicator, "status">> = [];
  if (g === "all") {
    list.push({
      id: "female",
      label: "Female participation",
      actual: pct(sum(started.map((c) => c.female)), sum(started.map((c) => c.enrolled))),
      target: 40,
    });
  }
  list.push(
    {
      id: "completion",
      label: "Training completion",
      actual: pct(
        sum(finished.map((c) => scale(c.completed ?? 0, c, g))),
        sum(finished.map((c) => scale(c.enrolled, c, g))),
      ),
      target: 85,
    },
    { id: "employment", label: "Employed or self-employed at 6 months", actual: employmentRate(w, g), target: 70 },
    { id: "attendance", label: "Average attendance", actual: attendanceIn(w, g), target: 85 },
    { id: "followup", label: "Follow-ups completed on time", actual: g === "female" ? 83 : g === "male" ? 80 : 81, target: 90 },
  );
  return list.map((item) => ({ ...item, status: item.actual >= item.target ? "on_track" : "below_target" }));
}

function genderSplit(w: Window): RankedItem[] {
  const cohorts = startedIn(w);
  const female = sum(cohorts.map((c) => c.female));
  const undisclosed = sum(cohorts.map((c) => c.undisclosed));
  const male = sum(cohorts.map((c) => c.enrolled)) - female - undisclosed;
  return [
    { id: "female", label: "Female", value: female },
    { id: "male", label: "Male", value: male },
    { id: "undisclosed", label: "Prefer not to say", value: undisclosed },
  ];
}

/** Whether women keep pace through the programme: their share at each stage. */
function femaleShareByStage(w: Window): RankedItem[] {
  const employed = (g: GenderFilter) => {
    const six = outcomes(w, g).rows[1].values;
    return (six.wage ?? 0) + (six.self ?? 0);
  };
  return [
    { id: "enrolled", label: "Enrolled", value: pct(enrolledIn(w, "female"), enrolledIn(w, "all")) },
    { id: "certified", label: "Certified", value: pct(certificatesIn(w, "female"), certificatesIn(w, "all")) },
    { id: "employed", label: "In work at 6 months", value: pct(employed("female"), employed("all")) },
  ];
}

const ATTENTION: Record<string, AttentionItem> = {
  overdue: {
    id: "overdue",
    title: "9 three-month follow-ups not yet reached",
    detail: "Cohort D graduates, due in October.",
    severity: "high",
    module: "employment",
  },
  conflicts: {
    id: "conflicts",
    title: "2 sync conflicts awaiting review",
    detail: "Attendance records from Field tablet 03.",
    severity: "high",
    module: "sync",
  },
  attendance: {
    id: "attendance",
    title: "Cohort G attendance is trending down",
    detail: "83% last week, below the 85% target.",
    severity: "medium",
    module: "attendance",
  },
  due: {
    id: "due",
    title: "49 six-month follow-ups due this month",
    detail: "Cohort C graduates, certified in May.",
    severity: "medium",
    module: "employment",
  },
  results: {
    id: "results",
    title: "Cohort F assessment in progress",
    detail: "30 of 54 candidates assessed; 12 results awaiting entry.",
    severity: "info",
    module: "assessments",
  },
  registrations: {
    id: "registrations",
    title: "23 registrations awaiting review",
    detail: "Applicants for Cohort H, starting 16 November.",
    severity: "info",
    module: "trainees",
  },
};

const ATTENTION_BY_ROLE: Partial<Record<Role, string[]>> = {
  project_manager: ["overdue", "attendance", "due", "results"],
  training_coordinator: ["attendance", "registrations", "results", "overdue"],
  me_officer: ["overdue", "due", "attendance"],
  funder_partner: [],
  system_administrator: ["conflicts", "registrations"],
};

const ACTIVITY: ActivityItem[] = [
  { id: "a1", at: "2026-11-06T16:42:00", actor: "Grace Wanjiru", action: "recorded practical results for", subject: "Cohort F, 12 candidates", icon: "assess" },
  { id: "a2", at: "2026-11-06T11:15:00", actor: "Daniel Mwangi", action: "synchronized attendance for", subject: "Cohort G, 3 sessions", icon: "sync" },
  { id: "a3", at: "2026-11-05T15:30:00", actor: "Samuel Okafor", action: "recorded 3-month follow-ups for", subject: "Cohort D, 39 graduates", icon: "briefcase" },
  { id: "a4", at: "2026-11-04T09:05:00", actor: "Hana Tesfaye", action: "opened enrollment for", subject: "Cohort H", icon: "enroll" },
  { id: "a5", at: "2026-11-03T10:20:00", actor: "Mercy Otieno", action: "activated 18 trainee accounts for", subject: "Cohort H", icon: "user" },
];

const SCHEDULE: ScheduleItem[] = [
  { id: "s1", at: "2026-11-09T08:30:00", title: "Batteries and storage", detail: "Cohort G, practical session", tag: "Training" },
  { id: "s2", at: "2026-11-09T09:00:00", title: "Practical assessment", detail: "Cohort F, PV wiring and protection", tag: "Assessment" },
  { id: "s3", at: "2026-11-10T08:30:00", title: "System commissioning", detail: "Cohort G, theory", tag: "Training" },
  { id: "s4", at: "2026-11-11T13:00:00", title: "6-month follow-up calls", detail: "Cohort C graduates", tag: "Follow-up" },
  { id: "s5", at: "2026-11-12T09:00:00", title: "Theory assessment", detail: "Cohort F, 28 candidates", tag: "Assessment" },
  { id: "s6", at: "2026-11-16T08:00:00", title: "Cohort H begins", detail: "Orientation and enrollment confirmation", tag: "Intake" },
];

const DEVICES: DeviceRow[] = [
  { id: "d1", device: "Field tablet 01", assignedTo: "Daniel Mwangi", cohort: "Cohort G", lastSync: "2026-11-06T17:42:00", pending: 18, conflicts: 0 },
  { id: "d3", device: "Field tablet 03", assignedTo: "Peter Kamau", cohort: "Cohort G", lastSync: "2026-11-04T12:30:00", pending: 11, conflicts: 2 },
  { id: "d4", device: "Assessment laptop", assignedTo: "Grace Wanjiru", cohort: "Cohort F", lastSync: "2026-11-06T16:45:00", pending: 2, conflicts: 0 },
  { id: "d2", device: "Field tablet 02", assignedTo: "Ruth Achieng", cohort: "Cohort F", lastSync: "2026-11-06T16:10:00", pending: 0, conflicts: 0 },
];

const AUDIT: ActivityItem[] = [
  { id: "u1", at: "2026-11-06T10:12:00", actor: "Mercy Otieno", action: "assigned the Assessor / Examiner role to", subject: "a new staff account", icon: "shieldCheck" },
  { id: "u2", at: "2026-11-05T09:40:00", actor: "Mercy Otieno", action: "activated 18 trainee accounts for", subject: "Cohort H", icon: "user" },
  { id: "u3", at: "2026-11-04T16:05:00", actor: "Platform", action: "flagged 2 sync conflicts from", subject: "Field tablet 03", icon: "sync" },
  { id: "u4", at: "2026-11-03T08:55:00", actor: "Mercy Otieno", action: "deactivated", subject: "a staff account that left the programme", icon: "lock" },
];

const STAFF_ACCOUNTS: RankedItem[] = [
  { id: "trainer", label: "Trainer / Instructor", value: 14 },
  { id: "assessor", label: "Assessor / Examiner", value: 6 },
  { id: "funder_partner", label: "Funder / Partner", value: 5 },
  { id: "training_coordinator", label: "Training Coordinator", value: 3 },
  { id: "me_officer", label: "Monitoring & Evaluation Officer", value: 3 },
  { id: "project_manager", label: "Project Manager", value: 2 },
  { id: "system_administrator", label: "System Administrator", value: 2 },
];

function programmeKpis(role: Role, period: Period, g: GenderFilter): Kpi[] {
  const w = WINDOWS[period];
  const prev = PREVIOUS[period];
  const attendanceTrend = monthsOf(w).map((m) => ATTENDANCE_BY_MONTH[m] + (g === "female" ? 1 : g === "male" ? -1 : 0));
  const intakes = startedIn(w).map((c) => c.name.replace("Cohort ", ""));

  const enrolled: Kpi = {
    id: "enrolled",
    label: "Trainees enrolled",
    value: enrolledIn(w, g),
    format: "number",
    delta: prev
      ? { value: change(enrolledIn(w, g), enrolledIn(prev, g)), unit: "percent", upIsGood: true, comparison: COMPARISON }
      : undefined,
    note: `Intakes ${intakes.join(", ")}`,
  };
  const certified: Kpi = {
    id: "certified",
    label: "Certificates issued",
    value: certificatesIn(w, g),
    format: "number",
    delta: prev
      ? { value: change(certificatesIn(w, g), certificatesIn(prev, g)), unit: "percent", upIsGood: true, comparison: COMPARISON }
      : undefined,
    note: "Each with a unique ID and QR verification",
  };
  const employment: Kpi = {
    id: "employment",
    label: "Employed or self-employed at 6 months",
    value: employmentRate(w, g),
    format: "percent",
    note: "Target 70%",
  };
  const attendance: Kpi = {
    id: "attendance",
    label: "Average attendance",
    value: attendanceIn(w, g),
    format: "percent",
    delta: prev
      ? { value: Math.round((attendanceIn(w, g) - attendanceIn(prev, g)) * 10) / 10, unit: "points", upIsGood: true, comparison: COMPARISON }
      : undefined,
    trend: attendanceTrend,
  };
  const inTraining: Kpi = {
    id: "active",
    label: "Trainees in training or assessment",
    value: sum(COHORTS.filter((c) => c.stage === "in_training" || c.stage === "assessment").map((c) => scale(c.completed ?? c.enrolled, c, g))),
    format: "number",
    note: "Cohorts F and G",
  };
  const ind = indicators(w, g);

  switch (role) {
    case "training_coordinator":
      return [
        inTraining,
        attendance,
        { id: "sessions", label: "Sessions this week", value: 14, format: "number", note: "Across Cohorts F and G" },
        { id: "registrations", label: "Registrations awaiting review", value: 23, format: "number", note: "Cohort H starts 16 November" },
      ];
    case "me_officer":
      return [
        { id: "on-track", label: "Indicators on track", value: ind.filter((i) => i.status === "on_track").length, suffix: `of ${ind.length}`, format: "number", note: "Against programme targets" },
        employment,
        { id: "due", label: "Follow-ups due this month", value: 49, format: "number", note: "6-month follow-up, Cohort C" },
        { id: "overdue", label: "Follow-ups not yet reached", value: 9, format: "number", note: "3-month follow-up, Cohort D" },
      ];
    case "funder_partner":
      return [
        enrolled,
        certified,
        employment,
        ind[0]?.id === "female"
          ? { id: "female", label: "Female participation", value: ind[0].actual, format: "percent", note: "Target 40%" }
          : attendance,
      ];
    case "system_administrator":
      return [
        { id: "accounts", label: "Active accounts", value: sum(COHORTS.map((c) => c.enrolled)) + sum(STAFF_ACCOUNTS.map((a) => a.value)), format: "number", note: "Trainee, staff and partner accounts" },
        { id: "activation", label: "Accounts awaiting activation", value: 23, format: "number", note: "From online registration" },
        { id: "pending", label: "Records awaiting sync", value: sum(DEVICES.map((d) => d.pending)), format: "number", note: `Across ${DEVICES.filter((d) => d.pending > 0).length} devices` },
        { id: "conflicts", label: "Sync conflicts", value: sum(DEVICES.map((d) => d.conflicts)), format: "number", note: "Need review before they are applied" },
      ];
    default:
      return [enrolled, certified, employment, attendance];
  }
}

function programmeDashboard(role: Role, { period, gender }: DashboardFilters): ProgrammeDashboard {
  const w = WINDOWS[period];
  const g = gender;
  const months = monthsOf(w);
  const adjust = g === "female" ? 1 : g === "male" ? -1 : 0;

  const cohorts = cohortRows(w, g);
  const data: ProgrammeDashboard = {
    kind: "programme",
    asOf: AS_OF,
    range: { from: `${w.from}-01`, to: `${w.to}-01` },
    kpis: programmeKpis(role, period, g),
    intakes: startedIn(w).map((c) => ({
      id: c.id,
      label: c.name,
      enrolled: scale(c.enrolled, c, g),
      certified: c.certified === null ? null : scale(c.certified, c, g),
      stage: c.stage,
    })),
    trend: {
      granularity: "month",
      format: "percent",
      points: months.map((m) => `${m}-01`),
      series: [{ id: "attendance", label: "Average attendance", values: months.map((m) => ATTENDANCE_BY_MONTH[m] + adjust) }],
    },
    pipeline: participantStatus(w, g),
    outcomes: outcomes(w, g),
    indicators: indicators(w, g),
    gender: g === "all" ? genderSplit(w) : null,
    femaleShareByStage: g === "all" ? femaleShareByStage(w) : null,
    cohorts,
    attendanceByCohort: cohorts
      .filter((c): c is CohortRow & { attendance: number } => c.attendance !== null)
      .map((c) => ({ id: c.id, label: c.name, value: c.attendance }))
      .sort((a, b) => b.value - a.value),
    attention: (ATTENTION_BY_ROLE[role] ?? []).map((id) => ATTENTION[id]),
    activity: ACTIVITY,
    schedule: SCHEDULE,
  };

  if (role === "system_administrator") {
    data.admin = { accountsByRole: STAFF_ACCOUNTS, devices: DEVICES, audit: AUDIT };
  }
  return data;
}

/* ------------------------------------------------------------------
   Trainer, assessor and trainee overviews
------------------------------------------------------------------- */

const WEEKS = ["2026-08-17", "2026-08-24", "2026-08-31", "2026-09-07", "2026-09-14", "2026-09-21", "2026-09-28", "2026-10-05", "2026-10-12", "2026-10-19", "2026-10-26", "2026-11-02"];
const WEEKLY_F = [90, 89, 88, 89, 87, 88, 86, 87, 85, 86, 84, null];
const WEEKLY_G = [null, null, null, 92, 90, 89, 88, 87, 86, 85, 84, 83];

function meanOf(values: Array<number | null>): number {
  const present = values.filter((v): v is number => v !== null);
  return Math.round((sum(present) / present.length) * 10) / 10;
}

function trainerDashboard(): TrainerDashboard {
  const recent = meanOf([...WEEKLY_F.slice(-4), ...WEEKLY_G.slice(-4)]);
  const before = meanOf([...WEEKLY_F.slice(-8, -4), ...WEEKLY_G.slice(-8, -4)]);
  const mine = COHORTS.filter((c) => c.id === "f" || c.id === "g");
  return {
    kind: "trainer",
    asOf: AS_OF,
    kpis: [
      { id: "trainees", label: "Trainees in my cohorts", value: sum(mine.map((c) => c.enrolled)), format: "number", note: "Cohorts F and G" },
      { id: "sessions", label: "Sessions next week", value: 6, format: "number", note: "First on Monday at 08:30" },
      {
        id: "attendance",
        label: "Attendance, last 4 weeks",
        value: recent,
        format: "percent",
        delta: { value: Math.round((recent - before) * 10) / 10, unit: "points", upIsGood: true, comparison: "previous 4 weeks" },
        trend: WEEKLY_G.filter((v): v is number => v !== null),
      },
      { id: "sync", label: "Records awaiting sync", value: 18, format: "number", note: "Field tablet 01" },
    ],
    attendanceTrend: {
      granularity: "week",
      format: "percent",
      points: WEEKS,
      series: [
        { id: "f", label: "Cohort F", values: WEEKLY_F },
        { id: "g", label: "Cohort G", values: WEEKLY_G },
      ],
    },
    cohorts: mine.map((c) => ({
      id: c.id,
      name: c.name,
      start: c.start,
      trainees: c.enrolled,
      attendance: c.attendance,
      progress: c.progress,
      stage: c.stage,
    })).reverse(),
    schedule: [
      { id: "t1", at: "2026-11-09T08:30:00", title: "Batteries and storage", detail: "Cohort G, practical session", tag: "Practical" },
      { id: "t2", at: "2026-11-09T09:00:00", title: "Practical assessment support", detail: "Cohort F, with the assessor", tag: "Assessment" },
      { id: "t3", at: "2026-11-10T08:30:00", title: "System commissioning", detail: "Cohort G, theory", tag: "Theory" },
      { id: "t4", at: "2026-11-11T08:30:00", title: "Batteries and storage", detail: "Cohort G, practical session", tag: "Practical" },
      { id: "t5", at: "2026-11-12T13:00:00", title: "Catch-up session", detail: "Cohort G, for trainees who missed sessions", tag: "Support" },
      { id: "t6", at: "2026-11-13T08:30:00", title: "System commissioning", detail: "Cohort G, practical session", tag: "Practical" },
    ],
    attention: [
      { id: "p1", title: "Kwame Asante, Cohort G", detail: "72% attendance; missed 3 of the last 8 sessions.", severity: "high" },
      { id: "p2", title: "Joyce Mensah, Cohort G", detail: "77% attendance; missed 2 of the last 8 sessions.", severity: "medium" },
      { id: "p3", title: "Yusuf Abdi, Cohort G", detail: "79% attendance; missed 2 of the last 8 sessions.", severity: "medium" },
    ],
    device: DEVICES[0],
  };
}

function assessorDashboard(): AssessorDashboard {
  const modules: Array<[string, number, number]> = [
    ["Solar fundamentals", 154, 2],
    ["Electrical safety", 151, 5],
    ["PV module mounting", 149, 7],
    ["PV wiring and protection", 141, 15],
    ["Batteries and storage", 145, 11],
    ["System commissioning", 139, 17],
  ];
  return {
    kind: "assessor",
    asOf: AS_OF,
    kpis: [
      { id: "scheduled", label: "Candidates scheduled, next 14 days", value: 57, format: "number", note: "4 assessment sittings" },
      { id: "awaiting", label: "Results awaiting entry", value: 12, format: "number", note: "Cohort F practical assessments" },
      { id: "competent", label: "Assessed competent, last 6 months", value: 95.5, format: "percent", note: "149 of 156 candidates" },
      { id: "reassess", label: "Re-assessments due", value: 5, format: "number", note: "Cohorts D and E" },
    ],
    resultsByModule: {
      categories: [
        { id: "competent", label: "Competent" },
        { id: "notYet", label: "Not yet competent" },
      ],
      rows: modules.map(([label, competent, notYet], i) => ({ id: `m${i}`, label, values: { competent, notYet } })),
    },
    queue: [
      { id: "q1", at: "2026-11-09T09:00:00", title: "Practical assessment", detail: "Cohort F, PV wiring and protection, 14 candidates", tag: "Practical" },
      { id: "q2", at: "2026-11-10T09:00:00", title: "Practical assessment", detail: "Cohort F, batteries and storage, 12 candidates", tag: "Practical" },
      { id: "q3", at: "2026-11-12T09:00:00", title: "Theory assessment", detail: "Cohort F, 28 candidates", tag: "Theory" },
      { id: "q4", at: "2026-11-19T10:00:00", title: "Re-assessment", detail: "Cohort E, 3 candidates", tag: "Re-assessment" },
    ],
    awaiting: [
      { id: "w1", title: "Cohort F, practical: PV module mounting", detail: "8 results to enter; assessed 4 November.", severity: "medium", module: "assessments" },
      { id: "w2", title: "Cohort F, practical: electrical safety", detail: "4 results to enter; assessed 5 November.", severity: "medium", module: "assessments" },
      { id: "w3", title: "Cohort D, re-assessment", detail: "2 candidates still to schedule.", severity: "info", module: "assessments" },
    ],
  };
}

function traineeDashboard(): TraineeDashboard {
  return {
    kind: "trainee",
    asOf: AS_OF,
    programme: "Solar PV Installation and Maintenance",
    cohort: "Cohort B",
    journey: [
      { id: "enroll", label: "Enroll", state: "complete", detail: "Joined 10 November 2025" },
      { id: "train", label: "Train", state: "complete", detail: "Completed 6 March 2026" },
      { id: "assess", label: "Assess", state: "complete", detail: "Competent, 5 March 2026" },
      { id: "certify", label: "Certify", state: "complete", detail: "Issued 14 March 2026" },
      { id: "employ", label: "Employ", state: "current", detail: "12-month follow-up in March 2027" },
    ],
    kpis: [
      { id: "attendance", label: "Attendance", value: 96, format: "percent", note: "46 of 48 sessions" },
      { id: "modules", label: "Modules completed", value: 6, suffix: "of 6", format: "number", note: "Theory and practical" },
      { id: "theory", label: "Theory assessment", value: 82, format: "percent", note: "Competent" },
      { id: "followups", label: "Follow-ups completed", value: 2, suffix: "of 3", format: "number", note: "Next in March 2027" },
    ],
    modules: [
      { id: "m1", label: "Solar fundamentals", progress: 100 },
      { id: "m2", label: "Electrical safety", progress: 100 },
      { id: "m3", label: "PV module mounting", progress: 100 },
      { id: "m4", label: "PV wiring and protection", progress: 100 },
      { id: "m5", label: "Batteries and storage", progress: 100 },
      { id: "m6", label: "System commissioning", progress: 100 },
    ],
    assessments: [
      { id: "x1", label: "Theory assessment", result: "82%, competent", date: "2026-03-02", competent: true },
      { id: "x2", label: "Practical assessment", result: "Competent", date: "2026-03-05", competent: true },
    ],
    certificate: { status: "issued", id: "TCE-PV-2026-00418", issued: "2026-03-14" },
    followUps: [
      { id: "f3", label: "3-month follow-up", due: "2026-06-15", status: "completed", outcome: "Self-employed" },
      { id: "f6", label: "6-month follow-up", due: "2026-09-14", status: "completed", outcome: "Self-employed" },
      { id: "f12", label: "12-month follow-up", due: "2027-03-15", status: "upcoming" },
    ],
  };
}

function shouldFail(): boolean {
  try {
    return window.sessionStorage.getItem("tce:mock-dashboard-fail") === "1";
  } catch {
    return false;
  }
}

export const mockDashboardService: DashboardService = {
  async getOverview(role, filters) {
    await wait();
    if (shouldFail()) throw new Error("The sample service was asked to fail.");
    switch (role) {
      case "trainer":
        return trainerDashboard();
      case "assessor":
        return assessorDashboard();
      case "trainee":
        return traineeDashboard();
      default:
        return programmeDashboard(role, filters);
    }
  },
};
