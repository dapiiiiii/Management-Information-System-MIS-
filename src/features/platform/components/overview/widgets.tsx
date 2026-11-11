"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import type { Role } from "@/features/auth/config/roles";
import { BarList } from "../../charts/BarList";
import { ColumnChart } from "../../charts/ColumnChart";
import { Legend, TargetKey } from "../../charts/Legend";
import { LineChart } from "../../charts/LineChart";
import { Meter } from "../../charts/Meter";
import { genderColor, genderInk, intakeSeries, outcomeColor, outcomeInk, singleSeries, stageColor } from "../../charts/palette";
import { ChartCard, Panel } from "../../charts/Panel";
import { SegmentedBar } from "../../charts/SegmentedBar";
import { StackedBars } from "../../charts/StackedBars";
import { formatCount, formatDate, formatMonthRange, formatValue } from "../../lib/format";
import type { Breakdown, ProgrammeDashboard } from "../../services/dashboard.types";
import { ActivityList, AttentionList, ScheduleList } from "./lists";
import { CohortsTable, DevicesTable, stageLabels } from "./tables";

type WidgetProps = { data: ProgrammeDashboard; role: Role; className?: string };

const ATTENDANCE_TARGET = 85;

function share(part: number, whole: number) {
  return whole ? `${Math.round((part / whole) * 100)}%` : "—";
}

/** Table twin for any stacked breakdown: counts with shares. */
export function breakdownTable(data: Breakdown, first: string, caption: string) {
  return {
    caption,
    columns: [
      { key: "row", label: first },
      { key: "total", label: "Total", numeric: true },
      ...data.categories.map((c) => ({ key: c.id, label: c.label, numeric: true })),
    ],
    rows: data.rows.map((row) => {
      const total = data.categories.reduce((t, c) => t + (row.values[c.id] ?? 0), 0);
      return {
        row: row.label,
        total: total ? formatCount(total) : null,
        ...Object.fromEntries(
          data.categories.map((c) => [c.id, total ? `${formatCount(row.values[c.id] ?? 0)} (${share(row.values[c.id] ?? 0, total)})` : null]),
        ),
      };
    }),
  };
}

export function IntakesWidget({ data, className }: WidgetProps) {
  const groups = data.intakes.map((i) => ({
    id: i.id,
    label: i.label,
    values: { enrolled: i.enrolled, certified: i.certified },
    note: i.certified === null ? stageLabels[i.stage] : undefined,
  }));
  return (
    <ChartCard
      className={className}
      title="Enrollment and certification by intake"
      description={`Cohorts that started ${formatMonthRange(data.range.from, data.range.to)}`}
      legend={<Legend items={intakeSeries} />}
      table={{
        caption: "Trainees enrolled and certified per intake",
        columns: [
          { key: "cohort", label: "Cohort" },
          { key: "enrolled", label: "Enrolled", numeric: true },
          { key: "certified", label: "Certified", numeric: true },
          { key: "status", label: "Status" },
        ],
        rows: data.intakes.map((i) => ({
          cohort: i.label,
          enrolled: formatCount(i.enrolled),
          certified: i.certified === null ? null : formatCount(i.certified),
          status: stageLabels[i.stage],
        })),
      }}
    >
      {groups.length ? (
        <ColumnChart groups={groups} series={intakeSeries} label="Trainees enrolled and certified per intake" />
      ) : (
        <EmptyChart>No intakes started in this period.</EmptyChart>
      )}
    </ChartCard>
  );
}

export function StatusWidget({ data, className }: WidgetProps) {
  const total = data.pipeline.reduce((t, s) => t + s.value, 0);
  return (
    <ChartCard
      className={className}
      title="Where participants are now"
      description="Trainees from the same intakes, by current stage"
      table={{
        caption: "Participants by current stage",
        columns: [
          { key: "stage", label: "Stage" },
          { key: "trainees", label: "Trainees", numeric: true },
          { key: "share", label: "Share", numeric: true },
        ],
        rows: data.pipeline.map((s) => ({ stage: s.label, trainees: formatCount(s.value), share: share(s.value, total) })),
      }}
      footer={`${formatCount(total)} trainees in total`}
    >
      <BarList items={data.pipeline} format="number" color={stageColor} showShare label="Participants by current stage" />
    </ChartCard>
  );
}

export function OutcomesWidget({ data, className }: WidgetProps) {
  return (
    <ChartCard
      className={className}
      title="Employment after training"
      description="Status of graduates at each follow-up point"
      legend={<Legend items={data.outcomes.categories.map((c) => ({ ...c, color: outcomeColor(c.id) }))} />}
      table={breakdownTable(data.outcomes, "Follow-up", "Graduate status at 3, 6 and 12 months")}
      footer="In work counts wage employment, self-employment and enterprise."
    >
      <StackedBars data={data.outcomes} color={outcomeColor} ink={outcomeInk} unit="graduates" label="Graduate status by follow-up point" />
      <div className="mt-6 border-t border-line pt-5">
        <p className="text-[13px] text-muted">In work after training</p>
        <dl className="mt-3 grid grid-cols-3 gap-4">
          {data.outcomes.rows.map((row) => {
            const total = data.outcomes.categories.reduce((t, c) => t + (row.values[c.id] ?? 0), 0);
            const working = (row.values.wage ?? 0) + (row.values.self ?? 0);
            return (
              <div key={row.id} className="min-w-0">
                <dt className="text-[12.5px] text-muted">{row.label}</dt>
                <dd className="mt-1 text-[26px] font-medium leading-none tracking-[-0.02em] font-stretch-semi-condensed text-ink">
                  {total ? (
                    // Same precision as the headline tile, so the two figures always agree.
                    formatValue(Math.round((working / total) * 1000) / 10, "percent")
                  ) : (
                    <span className="text-[14px] font-normal tracking-normal text-muted">Not yet due</span>
                  )}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </ChartCard>
  );
}

export function IndicatorsWidget({ data, className }: WidgetProps) {
  const onTrack = data.indicators.filter((i) => i.status === "on_track").length;
  return (
    <Panel
      className={className}
      title="Programme indicators"
      description={`${onTrack} of ${data.indicators.length} on track against target`}
      footer="Targets shown are sample values for illustration."
    >
      <ul className="space-y-5">
        {data.indicators.map((indicator) => {
          const ok = indicator.status === "on_track";
          return (
            <li key={indicator.id}>
              <div className="flex items-baseline justify-between gap-4">
                <p className="min-w-0 text-[14px] leading-snug text-ink">{indicator.label}</p>
                <p className="shrink-0 text-[14px] tabular-nums">
                  <span className="font-medium text-ink">{formatValue(indicator.actual, "percent")}</span>
                  <span className="text-muted"> / {formatValue(indicator.target, "percent")}</span>
                </p>
              </div>
              <Meter
                className="mt-2"
                value={indicator.actual}
                target={indicator.target}
                tone={ok ? "forest" : "sun"}
                label={`${indicator.label}: ${formatValue(indicator.actual, "percent")} against a target of ${formatValue(indicator.target, "percent")}`}
              />
              <p className={cn("mt-1.5 flex items-center gap-1.5 text-[12.5px]", ok ? "text-leaf" : "text-sun-strong")}>
                <Icon name={ok ? "checkCircle" : "alertCircle"} className="h-3.5 w-3.5" strokeWidth={2} />
                {ok ? "On track" : "Below target"}
              </p>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

export function AttendanceWidget({ data, className }: WidgetProps) {
  const series = data.trend.series.map((s) => ({ ...s, color: singleSeries }));
  return (
    <ChartCard
      className={className}
      title="Average attendance"
      description="Monthly, across cohorts in training"
      legend={<TargetKey label={`Target ${ATTENDANCE_TARGET}%`} />}
      table={{
        caption: "Average attendance by month",
        columns: [
          { key: "month", label: "Month" },
          { key: "value", label: "Attendance", numeric: true },
        ],
        rows: data.trend.points.map((p, i) => ({
          month: formatDate(p, "longMonthYear"),
          value: data.trend.series[0].values[i] === null ? null : formatValue(data.trend.series[0].values[i] as number, "percent"),
        })),
      }}
    >
      <LineChart
        points={data.trend.points}
        granularity={data.trend.granularity}
        series={series}
        format={data.trend.format}
        target={{ value: ATTENDANCE_TARGET }}
        label="Average attendance by month"
      />
    </ChartCard>
  );
}

export function AttendanceByCohortWidget({ data, className }: WidgetProps) {
  return (
    <ChartCard
      className={className}
      title="Attendance by cohort"
      description="Average across all sessions to date"
      table={{
        caption: "Average attendance by cohort",
        columns: [
          { key: "cohort", label: "Cohort" },
          { key: "value", label: "Attendance", numeric: true },
        ],
        rows: data.attendanceByCohort.map((c) => ({ cohort: c.label, value: formatValue(c.value, "percent") })),
      }}
    >
      <BarList
        items={data.attendanceByCohort}
        format="percent"
        max={100}
        target={{ value: ATTENDANCE_TARGET, label: `Target ${ATTENDANCE_TARGET}%` }}
        label="Average attendance by cohort"
      />
    </ChartCard>
  );
}

export function GenderWidget({ data, className }: WidgetProps) {
  if (!data.gender) {
    return (
      <Panel className={className} title="Participation by gender" description="Trainees enrolled in this period">
        <EmptyChart>Showing one group only. Choose &ldquo;All participants&rdquo; to compare participation.</EmptyChart>
      </Panel>
    );
  }
  const total = data.gender.reduce((t, g) => t + g.value, 0);
  return (
    <ChartCard
      className={className}
      title="Participation by gender"
      description="Trainees enrolled in this period"
      table={{
        caption: "Trainees enrolled by gender",
        columns: [
          { key: "group", label: "Group" },
          { key: "trainees", label: "Trainees", numeric: true },
          { key: "share", label: "Share", numeric: true },
        ],
        rows: data.gender.map((g) => ({ group: g.label, trainees: formatCount(g.value), share: share(g.value, total) })),
      }}
      footer="Self-reported at registration."
    >
      <SegmentedBar parts={data.gender} color={genderColor} ink={genderInk} unit="trainees" label="Trainees enrolled by gender" />
      {data.femaleShareByStage ? (
        <div className="mt-6 border-t border-line pt-5">
          <p className="mb-3.5 text-[13px] text-muted">Female share at each stage</p>
          <BarList
            items={data.femaleShareByStage}
            format="percent"
            max={100}
            color={() => genderColor("female")}
            target={{ value: 40, label: "Female participation target 40%" }}
            label="Female share of trainees at each stage"
          />
        </div>
      ) : null}
    </ChartCard>
  );
}

export function CohortsWidget({ data, className }: WidgetProps) {
  return (
    <Panel className={className} title="Cohorts" description="Active in this period, and intakes now enrolling" flush>
      <CohortsTable cohorts={data.cohorts} attendanceTarget={ATTENDANCE_TARGET} />
    </Panel>
  );
}

export function AttentionWidget({ data, role, className }: WidgetProps) {
  return (
    <Panel className={className} title="Needs attention" description="Items that need follow-up from your team">
      <AttentionList items={data.attention} role={role} empty="Nothing needs attention right now." />
    </Panel>
  );
}

export function ActivityWidget({ data, className }: WidgetProps) {
  return (
    <Panel className={className} title="Recent activity" description="Updates recorded across the programme">
      <ActivityList items={data.activity} />
    </Panel>
  );
}

export function ScheduleWidget({ data, className }: WidgetProps) {
  return (
    <Panel className={className} title="Coming up" description="Sessions, assessments and follow-ups">
      <ScheduleList items={data.schedule} layout="week" />
    </Panel>
  );
}

export function DevicesWidget({ data, className }: WidgetProps) {
  if (!data.admin) return null;
  return (
    <Panel className={className} title="Field devices" description="Records captured offline and waiting to synchronize" flush>
      <DevicesTable devices={data.admin.devices} />
    </Panel>
  );
}

export function AccountsWidget({ data, className }: WidgetProps) {
  if (!data.admin) return null;
  const accounts = data.admin.accountsByRole;
  return (
    <ChartCard
      className={className}
      title="Staff and partner accounts"
      description="By assigned role"
      table={{
        caption: "Staff and partner accounts by role",
        columns: [
          { key: "role", label: "Role" },
          { key: "accounts", label: "Accounts", numeric: true },
        ],
        rows: accounts.map((a) => ({ role: a.label, accounts: formatCount(a.value) })),
      }}
      footer="Privileged roles are assigned by an administrator, never at registration."
    >
      <BarList items={accounts} format="number" label="Staff and partner accounts by role" />
    </ChartCard>
  );
}

export function AuditWidget({ data, className }: WidgetProps) {
  if (!data.admin) return null;
  return (
    <Panel className={className} title="Access activity" description="Account and role changes">
      <ActivityList items={data.admin.audit} />
    </Panel>
  );
}

export function EmptyChart({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed border-line px-6 py-8 text-center text-[14px] text-muted">
      <p className="max-w-[36ch]">{children}</p>
    </div>
  );
}
