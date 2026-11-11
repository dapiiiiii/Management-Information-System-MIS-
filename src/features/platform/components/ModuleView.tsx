import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import type { Role } from "@/features/auth/config/roles";
import { MODULES, platformRoutes, type ModuleId } from "../config/modules";

/**
 * A module's landing page. Module screens are delivered separately; until
 * then each one explains what it will hold instead of leading nowhere.
 */
export function ModuleView({ role, moduleId }: { role: Role; moduleId: ModuleId }) {
  const info = MODULES[moduleId];
  return (
    <div className="mx-auto w-full max-w-[1440px] px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-10">
      <header className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-line bg-surface text-forest">
          <Icon name={info.icon} className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <h1 className="text-[clamp(1.75rem,1.45rem+1vw,2.375rem)] font-medium leading-[1.1] tracking-[-0.024em] font-stretch-semi-condensed text-ink">
            {info.label}
          </h1>
          <p className="mt-2 max-w-[60ch] text-[15px] leading-relaxed text-muted">{info.description}</p>
        </div>
      </header>

      <section
        aria-labelledby="module-status"
        className="mt-10 flex flex-col items-center rounded-xl border border-dashed border-line bg-surface/60 px-6 py-16 text-center"
      >
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-paper-2 text-muted">
          <Icon name="clock" className="h-5 w-5" />
        </span>
        <h2 id="module-status" className="mt-5 text-[17px] font-medium text-ink">
          This module is not connected yet
        </h2>
        <p className="mt-2 max-w-[48ch] text-[14.5px] leading-relaxed text-muted">
          Its screens are part of a later release. Your overview already shows the headline figures from this area.
        </p>
        <ButtonLink href={platformRoutes.overview(role)} variant="secondary" size="md" className="mt-7">
          <Icon name="arrowLeft" className="h-4 w-4" />
          Back to overview
        </ButtonLink>
      </section>
    </div>
  );
}
