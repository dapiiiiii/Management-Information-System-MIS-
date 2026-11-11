"use client";

import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { QrCode } from "@/components/ui/QrCode";
import type { Role } from "@/features/auth/config/roles";
import { Legend, TargetKey } from "../../charts/Legend";
import { LineChart } from "../../charts/LineChart";
import { Meter } from "../../charts/Meter";
import { categoricalSlots, resultColor, resultInk } from "../../charts/palette";
import { ChartCard, Panel } from "../../charts/Panel";
import { StackedBars } from "../../charts/StackedBars";
import { formatDate, formatValue } from "../../lib/format";
import type { AssessorDashboard, TraineeDashboard, TrainerDashboard } from "../../services/dashboard.types";
import { AttentionList, ScheduleList } from "./lists";
import { KpiRow } from "./StatTile";
import { CohortsTable } from "./tables";
import { breakdownTable } from "./widgets";

const ATTENDANCE_TARGET = 85;

/* ------------------------------------------------------------------
   Trainer / Instructor
------------------------------------------------------------------- */

export function TrainerOverview({ data, role }: { data: TrainerDashboard; role: Role }) {
  const series = data.attendanceTrend.series.slice(0, categoricalSlots.length).map((s, i) => ({ ...s, color: categoricalSlots[i] }));
  return (
    <div className="space-y-5">
      <KpiRow kpis={data.kpis} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <ChartCard
          className="xl:col-span-8"
          title="Weekly attendance"
          description="Share of trainees present, by cohort"
          legend={
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5">
              <Legend items={series} shape="line" />
              <TargetKey label={`Target ${ATTENDANCE_TARGET}%`} />
            </div>
          }
          table={{
            caption: "Weekly attendance by cohort",
            columns: [
              { key: "week", label: "Week of" },
              ...series.map((s) => ({ key: s.id, label: s.label, numeric: true })),
            ],
            rows: data.attendanceTrend.points.map((p, i) => ({
              week: formatDate(p, "dayYear"),
              ...Object.fromEntries(series.map((s) => [s.id, s.values[i] === null ? null : formatValue(s.values[i] as number, "percent")])),
            })),
          }}
          footer="Gaps mark weeks without sessions for that cohort."
        >
          <LineChart
            points={data.attendanceTrend.points}
            granularity={data.attendanceTrend.granularity}
            series={series}
            format={data.attendanceTrend.format}
            target={{ value: ATTENDANCE_TARGET }}
            label="Weekly attendance by cohort"
          />
        </ChartCard>

        <Panel className="xl:col-span-4" title="Trainees to follow up" description="Attendance below 80% over the last 8 sessions">
          <AttentionList items={data.attention} role={role} empty="Every trainee is attending regularly." />
        </Panel>

        <Panel className="xl:col-span-12" title="Next week" description="Your sessions, day by day">
          <ScheduleList items={data.schedule} layout="week" />
        </Panel>

        <Panel className="xl:col-span-12" title="My cohorts" description="Delivery progress and attendance" flush>
          <CohortsTable cohorts={data.cohorts} attendanceTarget={ATTENDANCE_TARGET} />
        </Panel>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Assessor / Examiner
------------------------------------------------------------------- */

export function AssessorOverview({ data, role }: { data: AssessorDashboard; role: Role }) {
  return (
    <div className="space-y-5">
      <KpiRow kpis={data.kpis} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <ChartCard
          className="xl:col-span-7"
          title="Results by competency"
          description="First-attempt outcomes, Cohorts C to E"
          legend={<Legend items={data.resultsByModule.categories.map((c) => ({ ...c, color: resultColor(c.id) }))} />}
          table={breakdownTable(data.resultsByModule, "Competency", "Assessment results by competency")}
        >
          <StackedBars data={data.resultsByModule} color={resultColor} ink={resultInk} unit="candidates" label="Assessment results by competency" />
        </ChartCard>

        <Panel className="xl:col-span-5" title="Results to enter" description="Recorded assessments without results">
          <AttentionList items={data.awaiting} role={role} empty="All results are entered." />
        </Panel>

        <Panel className="xl:col-span-12" title="Assessment schedule" description="The next 14 days">
          <ScheduleList items={data.queue} layout="week" />
        </Panel>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Trainee
------------------------------------------------------------------- */

export function TraineeOverview({ data }: { data: TraineeDashboard }) {
  return (
    <div className="space-y-5">
      <Journey data={data} />
      <KpiRow kpis={data.kpis} />
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <CertificateCard data={data} className="xl:col-span-5" />

        <Panel className="xl:col-span-7" title="Employment follow-up" description="The programme checks in after certification">
          <ol className="relative">
            <span aria-hidden="true" className="absolute bottom-4 left-[11px] top-4 w-px bg-line" />
            {data.followUps.map((f) => {
              const done = f.status === "completed";
              return (
                <li key={f.id} className="relative flex gap-4 pb-6 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "relative z-10 mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                      done ? "border-forest bg-forest text-paper" : "border-sun bg-surface",
                    )}
                  >
                    {done ? <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.25} /> : <span className="h-2 w-2 rounded-full bg-sun" />}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-medium text-ink">
                      {f.label}
                      <span className="sr-only">{done ? ", completed" : ", upcoming"}</span>
                    </p>
                    <p className="mt-0.5 text-[13.5px] text-muted">
                      {done ? "Completed" : "Due"} <time dateTime={f.due}>{formatDate(f.due, "longMonthYear")}</time>
                      {f.outcome ? <> &middot; {f.outcome}</> : null}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 rounded-lg bg-paper px-4 py-3 text-[13.5px] leading-snug text-muted">
            A member of the programme team will contact you before each follow-up. Your answers help show what the training leads to.
          </p>
        </Panel>

        <Panel className="xl:col-span-7" title="Training record" description={`${data.programme}, ${data.cohort}`}>
          <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
            {data.modules.map((m) => (
              <li key={m.id}>
                <div className="flex items-baseline justify-between gap-3 text-[14px]">
                  <span className="min-w-0 truncate text-ink">{m.label}</span>
                  <span className="shrink-0 tabular-nums text-muted">{m.progress}%</span>
                </div>
                <Meter className="mt-2" value={m.progress} label={`${m.label} completed`} />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel className="xl:col-span-5" title="Assessment results">
          <ul className="divide-y divide-line">
            {data.assessments.map((a) => (
              <li key={a.id} className="flex items-start justify-between gap-4 py-3.5 first:pt-0 last:pb-0">
                <div>
                  <p className="text-[14.5px] font-medium text-ink">{a.label}</p>
                  <p className="mt-0.5 text-[13px] text-muted">
                    <time dateTime={a.date}>{formatDate(a.date, "long")}</time>
                  </p>
                </div>
                <p className={cn("flex shrink-0 items-center gap-1.5 text-[14px] font-medium", a.competent ? "text-leaf" : "text-sun-strong")}>
                  <Icon name={a.competent ? "checkCircle" : "clock"} className="h-4 w-4" strokeWidth={1.75} />
                  {a.result}
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

/** The programme lifecycle, from the trainee's side: where they are now. */
function Journey({ data }: { data: TraineeDashboard }) {
  const current = data.journey.findIndex((s) => s.state === "current");
  return (
    <section aria-labelledby="journey-title" className="rounded-xl border border-line bg-surface px-5 py-5 sm:px-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="journey-title" className="text-[15.5px] font-medium text-ink">
          Your programme
        </h2>
        <p className="text-[13.5px] text-muted">
          {data.programme} &middot; {data.cohort}
        </p>
      </div>
      <ol className="mt-5 grid gap-4 sm:grid-cols-5 sm:gap-0">
        {data.journey.map((stage, i) => {
          const complete = stage.state === "complete";
          const active = stage.state === "current";
          return (
            <li key={stage.id} className="relative flex gap-3 sm:block sm:pr-4" aria-current={active ? "step" : undefined}>
              {i < data.journey.length - 1 ? (
                <span
                  aria-hidden="true"
                  className={cn("absolute left-8 right-2 top-[11px] hidden h-px sm:block", i < current ? "bg-forest" : "bg-line")}
                />
              ) : null}
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border",
                  complete && "border-forest bg-forest text-paper",
                  active && "border-sun bg-sun-soft ring-4 ring-sun/15",
                  stage.state === "upcoming" && "border-line bg-surface",
                )}
              >
                {complete ? <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.25} /> : <span className={cn("h-2 w-2 rounded-full", active ? "bg-sun" : "bg-line")} />}
              </span>
              <div className="sm:mt-3">
                <p className="text-[14.5px] font-medium text-ink">
                  {stage.label}
                  <span className="sr-only">{complete ? ", complete" : active ? ", current stage" : ", upcoming"}</span>
                </p>
                <p className="mt-0.5 text-[13px] leading-snug text-muted">{stage.detail}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function CertificateCard({ data, className }: { data: TraineeDashboard; className?: string }) {
  const cert = data.certificate;
  if (cert.status === "pending") {
    return (
      <Panel className={className} title="Certificate" description="Issued from your assessed results">
        <p className="text-[14px] text-muted">{cert.detail}</p>
      </Panel>
    );
  }
  return (
    <section
      aria-labelledby="certificate-title"
      className={cn("on-dark relative flex flex-col overflow-hidden rounded-xl bg-forest-deep px-5 py-5 text-paper sm:px-6", className)}
    >
      <div aria-hidden="true" className="absolute -right-16 -top-16 h-48 w-48 rounded-full border border-sun/20" />
      <div aria-hidden="true" className="absolute -right-6 -top-6 h-28 w-28 rounded-full border border-sun/15" />
      <p className="flex items-center gap-2 text-[12.5px] font-medium tracking-[0.14em] text-sun">
        <Icon name="seal" className="h-4 w-4" />
        CERTIFIED
      </p>
      <h2 id="certificate-title" className="mt-3 text-[22px] font-medium leading-tight tracking-[-0.015em] font-stretch-semi-condensed">
        {data.programme}
      </h2>
      <p className="mt-1 text-[13.5px] text-paper/65">Certificate of Competence</p>

      <div className="mt-6 flex items-end justify-between gap-4">
        <dl className="space-y-3 text-[13.5px]">
          <div>
            <dt className="text-paper/55">Certificate ID</dt>
            <dd className="mt-0.5 font-medium tabular-nums tracking-[0.01em]">{cert.id}</dd>
          </div>
          <div>
            <dt className="text-paper/55">Date of issue</dt>
            <dd className="mt-0.5 font-medium">
              <time dateTime={cert.issued}>{formatDate(cert.issued, "long")}</time>
            </dd>
          </div>
        </dl>
        <div className="shrink-0 rounded-md bg-white p-1.5 text-forest-deep">
          <QrCode className="h-20 w-20" label={`QR code for certificate ${cert.id}`} />
        </div>
      </div>
      <p className="mt-6 flex items-start gap-2 border-t border-paper/12 pt-4 text-[13px] leading-snug text-paper/70">
        <Icon name="shieldCheck" className="mt-px h-4 w-4 shrink-0 text-sun" />
        Employers and partners can confirm this certificate by scanning its code, without an account.
      </p>
    </section>
  );
}
