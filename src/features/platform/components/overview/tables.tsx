import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Meter } from "../../charts/Meter";
import { formatCount, formatDate } from "../../lib/format";
import type { CohortRow, CohortStage, DeviceRow } from "../../services/dashboard.types";

export const stageLabels: Record<CohortStage, string> = {
  enrolling: "Enrolling",
  in_training: "In training",
  assessment: "In assessment",
  certified: "Certified",
};

const stageStyles: Record<CohortStage, string> = {
  enrolling: "border-sun/45 bg-sun-soft/60 text-ink",
  in_training: "border-forest/20 bg-forest/[0.06] text-forest",
  assessment: "border-series-3/30 bg-series-3/[0.08] text-ink",
  certified: "border-line bg-paper-2 text-muted",
};

export function StagePill({ stage }: { stage: CohortStage }) {
  return (
    <span className={cn("inline-flex whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[12px] font-medium", stageStyles[stage])}>
      {stageLabels[stage]}
    </span>
  );
}

const th = "whitespace-nowrap px-3 pb-2.5 text-left text-[12.5px] font-medium text-muted first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6";
const td = "whitespace-nowrap px-3 py-3 first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6";

/** Cohorts with stage, delivery progress and attendance against the target. */
export function CohortsTable({ cohorts, attendanceTarget = 85 }: { cohorts: CohortRow[]; attendanceTarget?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-[14px]">
        <caption className="sr-only">Cohorts with start date, trainees, stage, curriculum delivered and attendance</caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className={th}>Cohort</th>
            <th scope="col" className={th}>Start</th>
            <th scope="col" className={cn(th, "text-right")}>Trainees</th>
            <th scope="col" className={th}>Stage</th>
            <th scope="col" className={th}>Delivered</th>
            <th scope="col" className={cn(th, "text-right")}>Attendance</th>
          </tr>
        </thead>
        <tbody>
          {cohorts.map((c) => {
            const low = c.attendance !== null && c.attendance < attendanceTarget;
            return (
              <tr key={c.id} className="border-b border-line/70 transition-colors last:border-0 hover:bg-paper/70">
                <th scope="row" className={cn(td, "text-left font-medium text-ink")}>
                  {c.name}
                </th>
                <td className={cn(td, "text-muted")}>
                  <time dateTime={c.start}>{formatDate(c.start, "dayYear")}</time>
                </td>
                <td className={cn(td, "text-right tabular-nums text-ink")}>{formatCount(c.trainees)}</td>
                <td className={td}>
                  <StagePill stage={c.stage} />
                </td>
                <td className={cn(td, "w-[22%] min-w-36")}>
                  <div className="flex items-center gap-3">
                    <Meter value={c.progress} label={`${c.name} curriculum delivered`} className="flex-1" />
                    <span className="w-9 text-right text-[13px] tabular-nums text-muted">{c.progress}%</span>
                  </div>
                </td>
                <td className={cn(td, "text-right tabular-nums")}>
                  {c.attendance === null ? (
                    <span className="text-muted">Not started</span>
                  ) : (
                    <span className={cn("inline-flex items-center gap-1.5", low ? "font-medium text-ink" : "text-ink")}>
                      {low ? (
                        <>
                          <Icon name="alertCircle" className="h-4 w-4 text-sun-strong" strokeWidth={1.75} />
                          <span className="sr-only">Below the {attendanceTarget}% target: </span>
                        </>
                      ) : null}
                      {c.attendance}%
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function syncState(d: DeviceRow) {
  if (d.conflicts > 0) return { label: `${d.conflicts} to review`, icon: "alertCircle" as const, tone: "text-error" };
  if (d.pending > 0) return { label: "Waiting to sync", icon: "clock" as const, tone: "text-sun-strong" };
  return { label: "Up to date", icon: "checkCircle" as const, tone: "text-leaf" };
}

/** Field devices that capture records offline, and what each still holds. */
export function DevicesTable({ devices }: { devices: DeviceRow[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse text-[14px]">
        <caption className="sr-only">Devices with assigned user, cohort, last sync, records pending and status</caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className={th}>Device</th>
            <th scope="col" className={th}>Assigned to</th>
            <th scope="col" className={th}>Last sync</th>
            <th scope="col" className={cn(th, "text-right")}>Pending</th>
            <th scope="col" className={th}>Status</th>
          </tr>
        </thead>
        <tbody>
          {devices.map((d) => {
            const s = syncState(d);
            return (
              <tr key={d.id} className="border-b border-line/70 transition-colors last:border-0 hover:bg-paper/70">
                <th scope="row" className={cn(td, "text-left font-medium text-ink")}>
                  {d.device}
                  <span className="block text-[12.5px] font-normal text-muted">{d.cohort}</span>
                </th>
                <td className={cn(td, "text-ink")}>{d.assignedTo}</td>
                <td className={cn(td, "text-muted")}>
                  <time dateTime={d.lastSync}>
                    {formatDate(d.lastSync, "day")}, {formatDate(d.lastSync, "time")}
                  </time>
                </td>
                <td className={cn(td, "text-right tabular-nums text-ink")}>{formatCount(d.pending)}</td>
                <td className={td}>
                  <span className="inline-flex items-center gap-1.5 text-[13.5px] text-ink">
                    <Icon name={s.icon} className={cn("h-4 w-4", s.tone)} strokeWidth={1.75} />
                    {s.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
