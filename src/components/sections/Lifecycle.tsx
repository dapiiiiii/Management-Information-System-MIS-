"use client";

import type { CSSProperties } from "react";
import { lifecycleStages } from "@/content/site";
import { useStepSequence } from "@/hooks/useStepSequence";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";

const total = lifecycleStages.length;

/**
 * Enroll → Train → Assess → Certify → Employ → Measure.
 * The journey plays through once as it comes into view. On wide screens,
 * pointing at (or focusing) a stage fills the line up to it and reveals its
 * sentence. On smaller screens every sentence is shown.
 */
export function Lifecycle() {
  const { ref, index: active, select: setActive } = useStepSequence<HTMLOListElement>({
    length: total,
    interval: 1100,
    threshold: 0.6,
  });

  return (
    <section id="programme" aria-labelledby="programme-title" className="py-24 sm:py-28 lg:py-36">
      <Container>
        <SectionIntro titleId="programme-title" title="One Programme. One Digital System.">
          <p>
            Registration forms, attendance sheets, assessment scores, certificates and follow-up surveys no
            longer sit in separate files. Every stage of the programme runs in one platform, and each step
            begins with what the previous one recorded.
          </p>
        </SectionIntro>

        <Reveal delay={120} className="mt-16 lg:mt-24">
          <ol
            ref={ref}
            className="relative grid gap-0 lg:grid-cols-6"
            style={{ "--progress": active / (total - 1) } as CSSProperties}
          >
            {/* Track, drawn through the centre of the icons (wide screens) */}
            <span
              aria-hidden="true"
              className="absolute left-7 top-7 hidden h-px w-[calc(100%*5/6)] bg-line lg:block"
            />
            <span
              aria-hidden="true"
              className="absolute left-7 top-7 hidden h-px w-[calc(100%*5/6)] origin-left scale-x-(--progress) bg-forest transition-transform duration-500 ease-(--ease-out-soft) lg:block"
            />
            {/* Vertical track on small screens */}
            <span aria-hidden="true" className="absolute bottom-7 left-7 top-7 w-px bg-line lg:hidden" />

            {lifecycleStages.map((stage, i) => {
              const state = i < active ? "past" : i === active ? "current" : "future";
              return (
                <li
                  key={stage.label}
                  tabIndex={0}
                  data-state={state}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className="group relative grid cursor-default grid-cols-[56px_1fr] gap-x-5 pb-10 outline-offset-4 last:pb-0 lg:block lg:pb-0 lg:pr-6"
                >
                  <span
                    className={cn(
                      "relative z-10 flex h-14 w-14 items-center justify-center rounded-full border bg-paper transition-colors duration-300",
                      "border-forest/40 text-forest",
                      "lg:group-data-[state=future]:border-line lg:group-data-[state=future]:text-muted",
                      "lg:group-data-[state=past]:border-forest lg:group-data-[state=past]:text-forest",
                      "lg:group-data-[state=current]:border-forest lg:group-data-[state=current]:bg-forest lg:group-data-[state=current]:text-paper",
                    )}
                  >
                    <Icon name={stage.icon} className="h-6 w-6" />
                    <span
                      aria-hidden="true"
                      className="absolute -right-0.5 -top-0.5 hidden h-2.5 w-2.5 rounded-full border-2 border-paper bg-sun lg:group-data-[state=current]:block"
                    />
                  </span>

                  <div className="pt-1.5 lg:pt-6">
                    <h3 className="flex items-baseline gap-2 text-[18px] font-medium tracking-[-0.01em] text-ink">
                      <span className="text-label font-normal tabular-nums text-muted">{i + 1}</span>
                      {stage.label}
                    </h3>
                    <p
                      className={cn(
                        "mt-1.5 max-w-[30ch] text-small text-muted transition-[opacity,translate] duration-300 lg:mt-3 lg:max-w-[22ch]",
                        "lg:translate-y-1 lg:opacity-0 lg:group-data-[state=current]:translate-y-0 lg:group-data-[state=current]:opacity-100",
                      )}
                    >
                      {stage.sentence}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </Container>
    </section>
  );
}
