import Link from "next/link";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";
import type { Role } from "@/features/auth/config/roles";
import { MODULES, platformRoutes } from "../../config/modules";
import { formatDate } from "../../lib/format";
import type { ActivityItem, AttentionItem, ScheduleItem, Severity } from "../../services/dashboard.types";

const severity: Record<Severity, { icon: IconName; tone: string; label: string }> = {
  high: { icon: "alertCircle", tone: "text-error", label: "Priority" },
  medium: { icon: "clock", tone: "text-sun-strong", label: "Due soon" },
  info: { icon: "info", tone: "text-forest", label: "For information" },
};

/** Things that need someone to act, most urgent first, each with a way in. */
export function AttentionList({ items, role, empty }: { items: AttentionItem[]; role: Role; empty: string }) {
  if (items.length === 0) {
    return (
      <p className="flex items-center gap-2.5 rounded-lg border border-dashed border-line px-4 py-6 text-[14px] text-muted">
        <Icon name="checkCircle" className="h-5 w-5 text-leaf" />
        {empty}
      </p>
    );
  }
  return (
    <ul className="divide-y divide-line">
      {items.map((item) => {
        const s = severity[item.severity];
        return (
          <li key={item.id} className="flex gap-3.5 py-3.5 first:pt-0 last:pb-0">
            <Icon name={s.icon} className={cn("mt-0.5 h-5 w-5 shrink-0", s.tone)} strokeWidth={1.75} />
            <div className="min-w-0 flex-1">
              <p className="text-[14.5px] font-medium leading-snug text-ink">
                <span className="sr-only">{s.label}: </span>
                {item.title}
              </p>
              <p className="mt-0.5 text-[13.5px] leading-snug text-muted">{item.detail}</p>
            </div>
            {item.module ? (
              <Link
                href={platformRoutes.module(role, item.module)}
                className="-mr-1.5 inline-flex h-9 shrink-0 items-center gap-1 self-center rounded-md px-1.5 text-[13px] font-medium text-forest hover:bg-forest/[0.06]"
              >
                Open
                <span className="sr-only"> {MODULES[item.module].label}</span>
                <Icon name="chevronRight" className="h-4 w-4" />
              </Link>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

/** A dated record of who did what. */
export function ActivityList({ items }: { items: ActivityItem[] }) {
  return (
    <ol className="relative space-y-4">
      <span aria-hidden="true" className="absolute bottom-3 left-[15px] top-3 w-px bg-line" />
      {items.map((item) => (
        <li key={item.id} className="relative flex gap-3.5">
          <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-forest">
            <Icon name={item.icon} className="h-4 w-4" />
          </span>
          <div className="min-w-0 pt-0.5">
            <p className="text-[14px] leading-snug text-ink">
              <span className="font-medium">{item.actor}</span> {item.action}
              {item.subject ? <span className="text-ink"> {item.subject}</span> : null}
            </p>
            <p className="mt-0.5 text-[12.5px] text-muted">
              <time dateTime={item.at}>
                {formatDate(item.at, "day")}, {formatDate(item.at, "time")}
              </time>
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * Upcoming sessions, assessments or follow-ups, grouped by day. "week" lays
 * the days side by side as a strip, for full-width placement.
 */
export function ScheduleList({ items, layout = "list" }: { items: ScheduleItem[]; layout?: "list" | "week" }) {
  const days = items.reduce<Array<{ day: string; items: ScheduleItem[] }>>((groups, item) => {
    const day = item.at.slice(0, 10);
    const last = groups.at(-1);
    if (last && last.day === day) last.items.push(item);
    else groups.push({ day, items: [item] });
    return groups;
  }, []);
  const week = layout === "week";

  return (
    <div
      className={cn(
        week ? "grid gap-x-3 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[repeat(auto-fit,minmax(11rem,1fr))]" : "space-y-5",
      )}
    >
      {days.map((group) => (
        <section key={group.day} aria-label={formatDate(group.day, "fullDay")} className={cn(week && "min-w-0")}>
          <h3 className="text-[12px] font-medium uppercase tracking-[0.12em] text-muted">
            <time dateTime={group.day}>{formatDate(group.day, "weekday")}</time>
          </h3>
          <ul className="mt-2 space-y-2">
            {group.items.map((item) => (
              <li
                key={item.id}
                className={cn("rounded-lg border border-line bg-paper/60 px-3.5 py-3", week ? "flex flex-col" : "flex gap-3")}
              >
                {week ? (
                  <div className="flex items-center justify-between gap-2">
                    <time dateTime={item.at} className="text-[13px] font-medium tabular-nums text-ink">
                      {formatDate(item.at, "time")}
                    </time>
                    {item.tag ? <Tag>{item.tag}</Tag> : null}
                  </div>
                ) : (
                  <time dateTime={item.at} className="w-11 shrink-0 pt-px text-[13px] font-medium tabular-nums text-ink">
                    {formatDate(item.at, "time")}
                  </time>
                )}
                <div className={cn("min-w-0 flex-1", week && "mt-1.5")}>
                  <p className="text-[14px] font-medium leading-snug text-ink">{item.title}</p>
                  <p className="mt-0.5 text-[13px] leading-snug text-muted">{item.detail}</p>
                </div>
                {!week && item.tag ? <Tag>{item.tag}</Tag> : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function Tag({ children }: { children: string }) {
  return (
    <span className="h-fit shrink-0 rounded-full border border-line bg-surface px-2 py-0.5 text-[11.5px] text-muted">{children}</span>
  );
}
