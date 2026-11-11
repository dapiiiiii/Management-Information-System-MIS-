"use client";

import type { CSSProperties } from "react";
import { recordStages, specimen } from "@/content/site";
import { useStepSequence } from "@/hooks/useStepSequence";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";

const total = recordStages.length;

/**
 * Shows how information moves through the platform: one participant's record
 * gains verified information at every stage, and records together become the
 * evidence for programme impact.
 */
export function DataToImpact() {
  const { ref, index: active, select } = useStepSequence<HTMLDivElement>({
    length: total,
    interval: 1500,
    threshold: 0.4,
  });

  return (
    <section
      id="impact"
      data-tone="dark"
      aria-labelledby="impact-title"
      className="on-dark relative overflow-hidden bg-forest-deep py-24 text-paper sm:py-28 lg:py-36"
    >
      <Container>
        <SectionIntro tone="dark" titleId="impact-title" title="From Participant Data to Programme Impact.">
          <p>
            Each stage adds verified information to a participant&rsquo;s record. Across cohorts, those
            records become the evidence base for monitoring, reporting and programme decisions, without
            anyone re-entering data.
          </p>
        </SectionIntro>

        <Reveal delay={120} className="mt-16 lg:mt-24">
          <div ref={ref} className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-10">
            {/* Stage selector */}
            <div className="lg:col-span-4 xl:col-span-4">
              <ol
                aria-label="Stages of the participant record"
                className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 sm:-mx-8 sm:px-8 lg:mx-0 lg:block lg:overflow-visible lg:px-0"
              >
                {recordStages.map((stage, i) => {
                  const state = i < active ? "past" : i === active ? "current" : "future";
                  return (
                    <li key={stage.label} className="relative shrink-0 lg:pb-2.5 lg:last:pb-0">
                      {i < total - 1 ? (
                        <span
                          aria-hidden="true"
                          className="absolute -bottom-5 left-[5px] top-5 hidden w-px bg-paper/15 lg:block"
                        >
                          <span
                            className="block h-full w-full origin-top bg-sun transition-transform duration-500 ease-(--ease-out-soft)"
                            style={{ transform: `scaleY(${i < active ? 1 : 0})` } as CSSProperties}
                          />
                        </span>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => select(i)}
                        aria-pressed={i === active}
                        data-state={state}
                        className={cn(
                          "group relative flex items-center gap-4 rounded-full border px-4 py-2 text-left transition-colors duration-300",
                          "border-paper/15 data-[state=current]:border-paper data-[state=current]:bg-paper",
                          "lg:w-full lg:items-start lg:rounded-md lg:border-0 lg:px-0 lg:py-2 lg:data-[state=current]:bg-transparent",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "relative z-10 mt-[7px] hidden h-[11px] w-[11px] shrink-0 rounded-full border transition-all duration-300 lg:block",
                            "group-data-[state=future]:border-paper/30 group-data-[state=future]:bg-forest-deep",
                            "group-data-[state=past]:border-paper/80 group-data-[state=past]:bg-paper/80",
                            "group-data-[state=current]:border-sun group-data-[state=current]:bg-sun group-data-[state=current]:ring-4 group-data-[state=current]:ring-sun/20",
                          )}
                        />
                        <span className="block">
                          <span
                            className={cn(
                              "block whitespace-nowrap text-[14.5px] font-medium transition-colors duration-300 lg:text-[17px]",
                              "text-paper/80 group-data-[state=current]:text-forest-deep",
                              "lg:group-data-[state=current]:text-paper lg:group-data-[state=past]:text-paper/85 lg:group-data-[state=future]:text-paper/55",
                            )}
                          >
                            {stage.label}
                          </span>
                          <span className="mt-0.5 hidden text-[14.5px] text-paper/50 lg:block">{stage.summary}</span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            </div>

            {/* The record itself */}
            <div className="lg:col-span-8 xl:col-span-7 xl:col-start-6">
              <div className="rounded-xl border border-paper/12 bg-forest-raised">
                <div className="flex items-center justify-between gap-4 border-b border-paper/10 px-5 py-4 sm:px-7">
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-paper/10 text-[13px] font-semibold tracking-[0.04em] text-paper">
                      {specimen.initials}
                    </span>
                    <div>
                      <p className="text-[15.5px] font-medium leading-tight text-paper">{specimen.trainee}</p>
                      <p className="mt-0.5 text-[13px] text-paper/55">
                        {specimen.cohort}, {specimen.qualification}
                      </p>
                    </div>
                  </div>
                  <span className="shrink-0 rounded-full border border-paper/20 px-2.5 py-1 text-[12px] text-paper/60">
                    Sample record
                  </span>
                </div>

                <ol className="divide-y divide-paper/[0.08]" aria-label="Participant record by stage">
                  {recordStages.map((stage, i) => {
                    const state = i < active ? "past" : i === active ? "current" : "future";
                    const filled = state !== "future";
                    return (
                      <li
                        key={stage.label}
                        data-state={state}
                        className={cn(
                          "relative px-5 py-4 transition-colors duration-500 sm:px-7",
                          state === "current" && "bg-paper/[0.035]",
                        )}
                      >
                        <span
                          aria-hidden="true"
                          className={cn(
                            "absolute inset-y-0 left-0 w-[2px] bg-sun transition-opacity duration-500",
                            state === "current" ? "opacity-100" : "opacity-0",
                          )}
                        />
                        <div className="flex items-center justify-between gap-4">
                          <p
                            className={cn(
                              "text-[13.5px] font-medium transition-colors duration-500",
                              filled ? "text-paper" : "text-paper/40",
                            )}
                          >
                            {stage.label}
                          </p>
                          <p
                            className={cn(
                              "flex items-center gap-1.5 text-[12.5px] transition-colors duration-500",
                              state === "current" ? "text-sun" : filled ? "text-paper/55" : "text-paper/30",
                            )}
                          >
                            {filled ? <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2} /> : null}
                            {filled ? stage.doneLabel : "Pending"}
                          </p>
                        </div>
                        <ul className="mt-2.5 flex flex-wrap gap-1.5">
                          {stage.fields.map((field) => (
                            <li
                              key={field}
                              className={cn(
                                "rounded-[5px] border px-2 py-[3px] text-[12.5px] transition-colors duration-500",
                                filled
                                  ? "border-paper/10 bg-paper/[0.07] text-paper/85"
                                  : "border-dashed border-paper/15 text-paper/35",
                              )}
                            >
                              {field}
                            </li>
                          ))}
                        </ul>
                      </li>
                    );
                  })}
                </ol>
              </div>
              <p className="mt-4 text-[13px] text-paper/45">
                Illustrative record. Fields shown are representative of what the platform captures at each stage.
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
