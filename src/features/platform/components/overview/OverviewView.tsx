"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { AuthMessage } from "@/features/auth/components/AuthMessage";
import { roleLabels, type Role } from "@/features/auth/config/roles";
import { useAuth } from "@/features/auth/context/useAuth";
import { useDashboard } from "../../hooks/useDashboard";
import { useDashboardFilters } from "../../hooks/useDashboardFilters";
import { firstName, formatDate, greeting } from "../../lib/format";
import { overviewSupportsFilters, usingSampleData } from "../../services/dashboard.service";
import type { DashboardData, DashboardFilters } from "../../services/dashboard.types";

/** Overviews without filters show the programme to date. */
const UNFILTERED: DashboardFilters = { period: "all", gender: "all" };
import { FilterBar } from "./FilterBar";
import { AssessorOverview, TraineeOverview, TrainerOverview } from "./PersonalOverviews";
import { isProgrammeRole, ProgrammeOverview } from "./ProgrammeOverview";

const intro: Record<Role, string> = {
  system_administrator: "Platform health, accounts and synchronization, with the programme at a glance.",
  project_manager: "Programme performance from enrollment through certification to employment.",
  training_coordinator: "Cohorts, sessions and attendance across training delivery.",
  trainer: "Your cohorts, upcoming sessions and the trainees who need follow-up.",
  assessor: "Upcoming assessments, results to record and competency outcomes.",
  trainee: "Your progress through the programme, your certificate and what comes next.",
  me_officer: "Indicators, follow-up and disaggregated results for monitoring and reporting.",
  funder_partner: "Programme results: participation, certification and employment outcomes.",
};

/** The role's home screen: greeting, filters, then the role's own overview. */
export function OverviewView({ role }: { role: Role }) {
  const { user } = useAuth();
  const filterable = overviewSupportsFilters(role);
  const { filters, update, reset } = useDashboardFilters();
  const { data, error, loading, retry } = useDashboard(role, filterable ? filters : UNFILTERED);

  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-10">
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="min-w-0">
          <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-leaf">{roleLabels[role]}</p>
          <h1 className="mt-2.5 text-[clamp(1.75rem,1.45rem+1vw,2.375rem)] font-medium leading-[1.1] tracking-[-0.024em] font-stretch-semi-condensed text-ink">
            {greeting()}, {user ? firstName(user.fullName) : ""}
          </h1>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-muted">{intro[role]}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
          <span className="inline-flex items-center gap-1.5">
            <Icon name="calendar" className="h-4 w-4" />
            {formatDate(new Date().toISOString(), "fullDay")}
          </span>
          {usingSampleData ? <SampleDataNote asOf={data?.asOf} /> : null}
        </div>
      </header>

      {filterable ? (
        <div className="mt-7 border-t border-line pt-5">
          <FilterBar
            filters={filters}
            onChange={update}
            onReset={reset}
            range={data?.kind === "programme" ? data.range : null}
            updating={loading && data !== null}
          />
        </div>
      ) : null}

      <div className={cn(filterable ? "mt-5" : "mt-8")}>
        {error ? (
          <AuthMessage tone="error" title="The overview could not be loaded" className="mb-5">
            <p>Check your connection and try again. Figures already on screen may be out of date.</p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={retry}>
              Try again
            </Button>
          </AuthMessage>
        ) : null}

        {data ? (
          <div aria-busy={loading} className={cn("transition-opacity duration-200", loading && "pointer-events-none opacity-55")}>
            <RoleOverview role={role} data={data} />
          </div>
        ) : !error ? (
          <OverviewSkeleton />
        ) : null}
      </div>
    </div>
  );
}

function RoleOverview({ role, data }: { role: Role; data: DashboardData }): ReactNode {
  switch (data.kind) {
    case "programme":
      return isProgrammeRole(role) ? <ProgrammeOverview role={role} data={data} /> : null;
    case "trainer":
      return <TrainerOverview role={role} data={data} />;
    case "assessor":
      return <AssessorOverview role={role} data={data} />;
    case "trainee":
      return <TraineeOverview data={data} />;
  }
}

function SampleDataNote({ asOf }: { asOf?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-sun/45 bg-sun-soft/55 px-2.5 py-1 text-[12.5px] text-ink">
      <Icon name="info" className="h-3.5 w-3.5 text-sun-strong" strokeWidth={1.75} />
      <span>
        Sample data
        {asOf ? <span className="text-muted">, updated {formatDate(asOf, "day")}</span> : null}
        <span className="sr-only">. Figures are illustrative until the platform is connected to programme records.</span>
      </span>
    </span>
  );
}

/** First load only: quiet placeholders in the shape of what is coming. */
function OverviewSkeleton() {
  const block = "animate-shimmer rounded-xl border border-line bg-surface";
  return (
    <div role="status" aria-label="Loading the overview" className="space-y-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={cn(block, "h-[138px] p-5")}>
            <div className="h-3 w-2/5 rounded bg-paper-2" />
            <div className="mt-5 h-8 w-1/3 rounded bg-paper-2" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        <div className={cn(block, "h-[360px] xl:col-span-8")} />
        <div className={cn(block, "h-[360px] xl:col-span-4")} />
      </div>
    </div>
  );
}
