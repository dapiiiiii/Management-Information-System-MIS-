"use client";

import type { ComponentType } from "react";
import type { Role } from "@/features/auth/config/roles";
import type { ProgrammeDashboard } from "../../services/dashboard.types";
import { KpiRow } from "./StatTile";
import {
  AccountsWidget,
  ActivityWidget,
  AttendanceByCohortWidget,
  AttendanceWidget,
  AttentionWidget,
  AuditWidget,
  CohortsWidget,
  DevicesWidget,
  GenderWidget,
  IndicatorsWidget,
  IntakesWidget,
  OutcomesWidget,
  ScheduleWidget,
  StatusWidget,
} from "./widgets";

type WidgetProps = { data: ProgrammeDashboard; role: Role; className?: string };

const WIDGETS = {
  intakes: IntakesWidget,
  status: StatusWidget,
  outcomes: OutcomesWidget,
  indicators: IndicatorsWidget,
  attendance: AttendanceWidget,
  attendanceByCohort: AttendanceByCohortWidget,
  gender: GenderWidget,
  cohorts: CohortsWidget,
  attention: AttentionWidget,
  activity: ActivityWidget,
  schedule: ScheduleWidget,
  devices: DevicesWidget,
  accounts: AccountsWidget,
  audit: AuditWidget,
} satisfies Record<string, ComponentType<WidgetProps>>;

type WidgetId = keyof typeof WIDGETS;
type Span = 4 | 5 | 7 | 8 | 12;

/** Static class names so Tailwind can see them. */
const SPAN: Record<Span, string> = {
  4: "xl:col-span-4",
  5: "xl:col-span-5",
  7: "xl:col-span-7",
  8: "xl:col-span-8",
  12: "xl:col-span-12",
};

type ProgrammeRole = Exclude<Role, "trainer" | "assessor" | "trainee">;

/**
 * What each programme-level role sees first, row by row (spans sum to 12).
 * The same widgets, ordered by the decisions each role makes.
 */
const LAYOUTS: Record<ProgrammeRole, Array<Array<[WidgetId, Span]>>> = {
  project_manager: [
    [["intakes", 8], ["status", 4]],
    [["outcomes", 7], ["indicators", 5]],
    [["attendance", 7], ["attention", 5]],
    [["cohorts", 8], ["activity", 4]],
  ],
  training_coordinator: [
    [["cohorts", 12]],
    [["schedule", 12]],
    [["attendance", 7], ["attendanceByCohort", 5]],
    [["attention", 7], ["status", 5]],
    [["intakes", 7], ["activity", 5]],
  ],
  me_officer: [
    [["indicators", 5], ["outcomes", 7]],
    [["intakes", 7], ["gender", 5]],
    [["attendance", 7], ["attention", 5]],
  ],
  funder_partner: [
    [["outcomes", 7], ["indicators", 5]],
    [["intakes", 7], ["gender", 5]],
    [["attendance", 7], ["status", 5]],
  ],
  system_administrator: [
    [["devices", 8], ["accounts", 4]],
    [["attention", 5], ["audit", 7]],
    [["cohorts", 8], ["status", 4]],
  ],
};

export function ProgrammeOverview({ data, role }: { data: ProgrammeDashboard; role: ProgrammeRole }) {
  return (
    <div className="space-y-5">
      <KpiRow kpis={data.kpis} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {LAYOUTS[role].flat().map(([id, span]) => {
          const Widget = WIDGETS[id];
          return <Widget key={id} data={data} role={role} className={SPAN[span]} />;
        })}
      </div>
    </div>
  );
}

export function isProgrammeRole(role: Role): role is ProgrammeRole {
  return role in LAYOUTS;
}
