import { followUps } from "@/content/site";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

/**
 * Post-training follow-up drawn to scale: the axis runs from certification to
 * twelve months, so the longer gap between six and twelve months is visible.
 * Five equal columns of three months each; the last holds the 12-month note.
 */
const AXIS = 80; // the 0–12 month axis spans four of the five columns
const at = (month: number) => `${(month / 12) * AXIS}%`;

export function OutcomesTimeline() {
  return (
    <section id="employment" aria-labelledby="employment-title" className="py-24 sm:py-28 lg:py-40">
      <Container>
        <Reveal className="grid gap-8 lg:grid-cols-12 lg:gap-10">
          <h2
            id="employment-title"
            className="text-[length:clamp(2.4rem,1.5rem+2.9vw,4rem)] font-medium leading-[1.02] tracking-[-0.028em] font-stretch-semi-condensed text-ink lg:col-span-7"
          >
            Beyond Training.
            <br />
            Into Opportunity.
          </h2>
          <div className="max-w-[50ch] text-body text-muted lg:col-span-5 lg:pt-3">
            <p>
              A certificate is not the end of a participant&rsquo;s record. The platform schedules follow-up
              with every graduate and records whether they are employed, self-employed or running a business,
              so the programme can see what its training leads to over time.
            </p>
          </div>
        </Reveal>

        {/* Wide screens: proportional timeline */}
        <Reveal delay={150} className="relative mt-20 hidden lg:block">
          <div className="relative h-14" aria-hidden="true">
            {/* month ticks */}
            {Array.from({ length: 13 }, (_, m) => (
              <span
                key={m}
                className={cn("absolute bottom-0 w-px bg-line", m % 3 === 0 ? "h-3" : "h-1.5")}
                style={{ left: at(m) }}
              />
            ))}
            <span className="absolute bottom-0 left-0 h-px bg-line" style={{ width: `${AXIS}%` }} />
            <span className="draw-x absolute bottom-0 left-0 h-px bg-forest" style={{ width: `${AXIS}%` }} />
            {/* nodes */}
            <span className="absolute -bottom-[5px] h-[11px] w-[11px] -translate-x-1/2 rounded-full border border-forest bg-paper" style={{ left: at(0) }} />
            {followUps.map((f) => (
              <span
                key={f.month}
                className="absolute -bottom-[6px] h-[13px] w-[13px] -translate-x-1/2 rounded-full bg-forest ring-4 ring-paper"
                style={{ left: at(f.month) }}
              />
            ))}
            <span
              className="absolute -bottom-[3px] h-[7px] w-[7px] -translate-x-1/2 rounded-full bg-sun"
              style={{ left: at(12) }}
            />
          </div>

          <ol className="relative mt-8 grid grid-cols-5">
            <li className="pr-8">
              <p className="text-[15px] font-medium text-ink">Certification</p>
              <p className="mt-2 max-w-[24ch] text-small text-muted">Follow-up is scheduled for every graduate.</p>
            </li>
            {followUps.map((f) => (
              <li key={f.month} className={cn("pr-8", f.month === 12 ? "col-start-5" : "")}>
                <p className="text-[clamp(2rem,1.2rem+1.6vw,2.75rem)] font-medium leading-none tracking-[-0.03em] font-stretch-semi-condensed text-ink">
                  <span className="tabular-nums">{f.month}</span>{" "}
                  <span className="text-[0.5em] font-normal tracking-[-0.01em] text-muted">months</span>
                </p>
                <p className="mt-4 text-[15px] font-medium text-ink">{f.title}</p>
                <p className="mt-1.5 max-w-[26ch] text-small text-muted">{f.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        {/* Small screens: vertical timeline */}
        <Reveal delay={120} className="mt-14 lg:hidden">
          <ol className="relative">
            <span aria-hidden="true" className="absolute bottom-3 left-[6px] top-2 w-px bg-line" />
            <li className="relative pb-10 pl-10">
              <span
                aria-hidden="true"
                className="absolute left-0 top-[5px] h-[13px] w-[13px] rounded-full border border-forest bg-paper"
              />
              <p className="text-[15px] font-medium text-ink">Certification</p>
              <p className="mt-1.5 text-small text-muted">Follow-up is scheduled for every graduate.</p>
            </li>
            {followUps.map((f, i) => (
              <li key={f.month} className={cn("relative pl-10", i < followUps.length - 1 && "pb-10")}>
                <span aria-hidden="true" className="absolute left-0 top-[9px] h-[13px] w-[13px] rounded-full bg-forest ring-4 ring-paper" />
                <p className="text-[34px] font-medium leading-none tracking-[-0.03em] font-stretch-semi-condensed text-ink">
                  <span className="tabular-nums">{f.month}</span>{" "}
                  <span className="text-[17px] font-normal tracking-normal text-muted">months</span>
                </p>
                <p className="mt-3 text-[15px] font-medium text-ink">{f.title}</p>
                <p className="mt-1 max-w-[40ch] text-small text-muted">{f.body}</p>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal className="mt-16 border-t border-line pt-6 lg:mt-20">
          <p className="max-w-[70ch] text-small text-muted">
            Each follow-up records employment status, type of work, the employer or enterprise, and how the
            training is being applied. Results roll up into the programme&rsquo;s employment and entrepreneurship
            indicators.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
