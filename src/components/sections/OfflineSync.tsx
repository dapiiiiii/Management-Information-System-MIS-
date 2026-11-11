"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import fieldWorkshop from "@/assets/field-workshop.jpg";
import { offlineSteps } from "@/content/site";
import { useStepSequence } from "@/hooks/useStepSequence";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";

const total = offlineSteps.length;

export function OfflineSync() {
  const { ref, index: step, select } = useStepSequence<HTMLDivElement>({
    length: total,
    interval: 2000,
    threshold: 0.45,
  });

  return (
    <section aria-labelledby="offline-title" className="py-24 sm:py-28 lg:py-36">
      <Container>
        <div ref={ref} className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-6 xl:col-span-6">
            <Reveal>
              <h2 id="offline-title" className="text-title font-medium font-stretch-semi-condensed text-balance text-ink">
                Designed for <span className="whitespace-nowrap">Real-World</span> Connectivity
              </h2>
              <p className="mt-6 text-lead text-ink/85">Training does not stop when connectivity does.</p>
              <p className="mt-5 max-w-[52ch] text-body text-muted">
                Trainers take attendance and record assessments in classrooms, workshops and field sites with
                weak or no signal. The platform keeps working, holds records safely on the device, and
                synchronizes them automatically once a connection returns.
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-12">
              <ol
                aria-label="How offline work is saved and synchronized"
                className="relative grid gap-0 sm:grid-cols-5"
                style={{ "--progress": step / (total - 1) } as CSSProperties}
              >
                <span aria-hidden="true" className="absolute left-[22px] top-[22px] hidden h-px w-[calc(100%*4/5)] bg-line sm:block" />
                <span
                  aria-hidden="true"
                  className="absolute left-[22px] top-[22px] hidden h-px w-[calc(100%*4/5)] origin-left scale-x-(--progress) bg-forest transition-transform duration-500 ease-(--ease-out-soft) sm:block"
                />
                <span aria-hidden="true" className="absolute bottom-[22px] left-[22px] top-[22px] w-px bg-line sm:hidden" />

                {offlineSteps.map((item, i) => {
                  const state = i < step ? "past" : i === step ? "current" : "future";
                  return (
                    <li key={item.label} className="relative pb-5 last:pb-0 sm:pb-0">
                      <button
                        type="button"
                        onClick={() => select(i)}
                        aria-pressed={i === step}
                        data-state={state}
                        className="group flex w-full items-center gap-4 rounded-md text-left sm:flex-col sm:items-start sm:gap-3"
                      >
                        <span
                          className={cn(
                            "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border bg-paper transition-colors duration-300",
                            "group-data-[state=future]:border-line group-data-[state=future]:text-muted",
                            "group-data-[state=past]:border-forest group-data-[state=past]:text-forest",
                            "group-data-[state=current]:border-forest group-data-[state=current]:bg-forest group-data-[state=current]:text-paper",
                            "group-hover:border-forest",
                          )}
                        >
                          <Icon name={item.icon} className="h-5 w-5" />
                        </span>
                        <span
                          className={cn(
                            "text-[15px] font-medium transition-colors duration-300",
                            "group-data-[state=future]:text-muted group-data-[state=past]:text-ink group-data-[state=current]:text-ink",
                          )}
                        >
                          {item.label}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="mt-8 flex min-h-[3.5rem] items-start gap-3 border-t border-line pt-5">
                <span className="mt-0.5 text-label tabular-nums text-muted" aria-hidden="true">
                  {step + 1}/{total}
                </span>
                <p className="max-w-[48ch] text-small text-ink">
                  <span className="font-medium">{offlineSteps[step].label}.</span>{" "}
                  <span className="text-muted">{offlineSteps[step].detail}</span>
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="lg:col-span-6 lg:col-start-7">
            <div className="relative sm:pb-16">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-paper-2 sm:w-[78%]">
                <Image
                  src={fieldWorkshop}
                  alt="A trainee assembling a solar lighting unit at a workbench in a community workshop"
                  fill
                  sizes="(min-width: 1024px) 36vw, (min-width: 640px) 70vw, 100vw"
                  placeholder="blur"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-2.5 py-1 text-[12px] text-paper backdrop-blur-sm">
                  <Icon name="wifiOff" className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Field workshop
                </span>
              </div>
              <div className="relative -mt-28 sm:absolute sm:bottom-0 sm:right-0 sm:mt-0 sm:w-[288px]">
                <Phone step={step} />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

const roster = [
  { name: "Amina Hassan", initials: "AH", present: true },
  { name: "Grace Wanjiru", initials: "GW", present: true },
  { name: "Hana Tesfaye", initials: "HT", present: true },
  { name: "Fatuma Ali", initials: "FA", present: false },
  { name: "Joyce Mensah", initials: "JM", present: true },
  { name: "Mercy Otieno", initials: "MO", present: true },
];

/** A device showing the attendance screen in each connectivity state. */
function Phone({ step }: { step: number }) {
  const online = step >= 3;
  const captured = step >= 1;
  const marked = roster.filter((person) => person.present).length;

  const banner = [
    {
      tone: "bg-ink text-paper",
      icon: "wifiOff" as const,
      title: "You're offline",
      body: "Keep working. Records will be saved on this device.",
    },
    {
      tone: "bg-ink text-paper",
      icon: "capture" as const,
      title: "Recording offline",
      body: `${marked} of ${roster.length} marked present.`,
    },
    {
      tone: "bg-sun-soft text-ink",
      icon: "store" as const,
      title: "Saved on this device",
      body: `${roster.length} records waiting to sync.`,
    },
    {
      tone: "bg-paper-2 text-ink",
      icon: "wifi" as const,
      title: "Back online",
      body: "Sending saved records…",
    },
    {
      tone: "bg-forest text-paper",
      icon: "check" as const,
      title: "All records synchronized",
      body: "No conflicts to review.",
    },
  ][step];

  return (
    <div aria-hidden="true" className="relative mx-auto w-full max-w-[288px]">
      <div className="rounded-[44px] bg-ink p-2 shadow-device">
        <div className="relative flex h-[568px] flex-col overflow-hidden rounded-[36px] bg-surface">
          {/* Status bar */}
          <div className="flex items-center justify-between px-7 pb-2 pt-4 text-[12px] font-semibold text-ink">
            <span className="tabular-nums">10:24</span>
            <span className="absolute left-1/2 top-3 h-[22px] w-[86px] -translate-x-1/2 rounded-full bg-ink" />
            <span className="flex items-center gap-1.5">
              <Icon name={online ? "wifi" : "wifiOff"} className={cn("h-4 w-4", online ? "text-ink" : "text-muted")} strokeWidth={1.75} />
              <Icon name="battery" className="h-4 w-5" strokeWidth={1.5} />
            </span>
          </div>

          {/* App header */}
          <div className="border-b border-line px-5 pb-4 pt-3">
            <p className="text-[11.5px] text-muted">Cohort B, practical session</p>
            <p className="mt-0.5 text-[19px] font-medium tracking-[-0.01em] text-ink">Attendance</p>
            <div className="mt-3 flex items-center justify-between text-[12px] text-muted">
              <span>PV wiring and protection</span>
              <span className="tabular-nums">{captured ? `${marked}/${roster.length}` : `0/${roster.length}`}</span>
            </div>
          </div>

          {/* Roster */}
          <ul className="flex-1 divide-y divide-line px-5">
            {roster.map((person, i) => {
              const done = captured;
              return (
                <li key={person.name} className="flex items-center justify-between py-2.5">
                  <span className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-2 text-[11px] font-semibold text-forest">
                      {person.initials}
                    </span>
                    <span className="text-[13.5px] text-ink">{person.name}</span>
                  </span>
                  <span
                    className={cn(
                      "flex h-7 min-w-[74px] items-center justify-center gap-1 rounded-full border px-2.5 text-[11.5px] font-medium transition-colors duration-300",
                      !done && "border-line text-muted",
                      done && person.present && "border-forest/15 bg-forest/[0.06] text-forest",
                      done && !person.present && "border-line bg-paper-2 text-muted",
                    )}
                    style={{ transitionDelay: done ? `${i * 70}ms` : "0ms" }}
                  >
                    {done ? (
                      person.present ? (
                        <>
                          <Icon name="check" className="h-3 w-3" strokeWidth={2.25} />
                          Present
                        </>
                      ) : (
                        "Absent"
                      )
                    ) : (
                      "Mark"
                    )}
                  </span>
                </li>
              );
            })}
          </ul>

          {/* Connection banner */}
          <div className="px-3 pb-3">
            <div className={cn("flex items-start gap-3 rounded-2xl px-4 py-3.5 transition-colors duration-500", banner.tone)}>
              <Icon name={banner.icon} className="mt-0.5 h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
              <div className="min-w-0">
                <p className="text-[13px] font-medium leading-tight">{banner.title}</p>
                <p className="mt-1 text-[12px] leading-snug opacity-75">{banner.body}</p>
                {step === 3 ? (
                  <span className="mt-2.5 block h-[3px] overflow-hidden rounded-full bg-ink/10">
                    <span className="block h-full w-2/3 rounded-full bg-forest" />
                  </span>
                ) : null}
              </div>
            </div>
            <span className="mx-auto mt-3 block h-1 w-28 rounded-full bg-ink/80" />
          </div>
        </div>
      </div>
    </div>
  );
}
