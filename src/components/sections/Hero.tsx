import type { CSSProperties } from "react";
import Image from "next/image";
import trainingLab from "@/assets/solar-training-lab.jpg";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const delay = (ms: number) => ({ animationDelay: `${ms}ms` }) as CSSProperties;

const headline = ["From Skills to", "Sustainable", "Employment."];

/** Photo proportions, shared by the image and its annotation layer. */
const PHOTO_RATIO = trainingLab.width / trainingLab.height;

export function Hero() {
  return (
    <section
      id="overview"
      data-tone="dark"
      aria-labelledby="hero-title"
      className="on-dark relative isolate overflow-hidden bg-forest-deep text-paper"
    >
      <div className="relative lg:min-h-[clamp(600px,calc(100svh-224px),780px)]">
        <Container className="relative z-20 pb-12 pt-14 sm:pb-16 sm:pt-20 lg:flex lg:min-h-[inherit] lg:items-center lg:py-14">
          <div className="hero-copy">
            <p
              className="animate-rise text-[11.5px] font-medium tracking-[0.13em] text-paper/70 sm:text-[12.5px] sm:tracking-[0.18em]"
              style={delay(60)}
            >
              TRAINING <span aria-hidden="true" className="px-1 text-sun">•</span> CERTIFICATION{" "}
              <span aria-hidden="true" className="px-1 text-sun">•</span> EMPLOYMENT
            </p>

            <h1 id="hero-title" className="mt-6 text-hero font-medium font-stretch-semi-condensed text-paper">
              {headline.map((line, i) => (
                <span key={line} className="-mb-[0.1em] block overflow-hidden pb-[0.1em]">
                  <span className="block animate-line-in" style={delay(140 + i * 110)}>
                    {line}
                  </span>{" "}
                </span>
              ))}
            </h1>

            <p className="mt-7 max-w-[38ch] animate-rise text-lead text-paper/85" style={delay(520)}>
              A unified digital platform for managing solar training, certification, employment outcomes, and
              programme impact.
            </p>

            <p className="mt-4 max-w-[54ch] animate-rise text-small text-paper/60" style={delay(600)}>
              Every stage of the programme is managed in one system: trainee enrollment, training delivery and
              practical sessions, attendance and assessment, certification, employment follow-up and impact
              reporting. Programme teams, trainers and partners work from the same reliable record for every
              participant.
            </p>

            <div className="mt-8 flex animate-rise flex-wrap gap-3" style={delay(680)}>
              <ButtonLink href="#programme" variant="inverse" size="lg">
                Explore the Programme
              </ButtonLink>
              <ButtonLink href={site.platformUrl} variant="inverseOutline" size="lg">
                Access Platform
              </ButtonLink>
            </div>
          </div>
        </Container>

        <HeroPhoto />
        <SunPath />
      </div>
    </section>
  );
}

/**
 * The documentary photograph, bleeding off the right edge and melting into
 * the forest ground, with the platform's record layer pinned onto it.
 */
function HeroPhoto() {
  const frame = { "--ratio": PHOTO_RATIO } as CSSProperties;

  return (
    <div className="relative aspect-[4/5] w-full sm:aspect-[6/5] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[52%]">
      <div className="hero-photo-mask absolute inset-0 overflow-hidden [container-type:size]">
        <div className="cover-frame" style={frame}>
          <Image
            src={trainingLab}
            alt="Trainees wiring solar PV modules on practical training rigs in a vocational training lab"
            fill
            sizes="(min-width: 1024px) 54vw, 100vw"
            placeholder="blur"
            loading="eager"
            fetchPriority="high"
            className="animate-settle object-cover"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 bg-forest-deep/20" />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-forest-deep/60 to-transparent"
        />
      </div>

      {/* Record layer: what the platform captures at this moment of training */}
      <div aria-hidden="true" className="absolute inset-0 z-30 [container-type:size]">
        <div className="cover-frame" style={frame}>
          <Annotation
            x={40}
            y={44}
            line={44}
            label="Practical session"
            value="PV module mounting"
            start={1250}
            className="hidden sm:block"
          />
          <Annotation
            x={79}
            y={60}
            line={30}
            label="Attendance"
            value="Present, synced"
            status
            start={1550}
            className="hidden sm:block"
          />
          <Annotation x={56} y={84} line={38} label="Assessment" value="Wiring: competent" start={1850} />
        </div>
      </div>
    </div>
  );
}

type AnnotationProps = {
  /** Position on the photograph, in percent of its width and height. */
  x: number;
  y: number;
  /** Length of the leader line, in pixels. */
  line: number;
  label: string;
  value: string;
  /** Show a "synced" status dot. */
  status?: boolean;
  /** When the callout begins to appear, in milliseconds. */
  start: number;
  className?: string;
};

/** A pin on the photograph with a leader line to a small record card. */
function Annotation({ x, y, line, label, value, status, start, className }: AnnotationProps) {
  return (
    <div className={cn("absolute", className)} style={{ left: `${x}%`, top: `${y}%` }}>
      <span
        className="absolute -left-[7px] -top-[7px] block h-[14px] w-[14px] animate-ping-once rounded-full bg-sun"
        style={delay(start + 300)}
      />
      <span
        className="absolute -left-[7px] -top-[7px] block h-[14px] w-[14px] animate-pop rounded-full border-2 border-sun bg-forest-deep/50"
        style={delay(start)}
      >
        <span className="absolute inset-[3px] rounded-full bg-sun" />
      </span>
      <span
        className="absolute right-[8px] top-0 block h-px origin-right animate-grow-x bg-paper/80"
        style={{ width: line, ...delay(start + 180) }}
      />
      <div
        className="absolute top-0 -translate-y-1/2 animate-rise whitespace-nowrap rounded-md bg-surface py-2 pl-3 pr-3.5 text-ink shadow-float"
        style={{ right: line + 8, ...delay(start + 320) }}
      >
        <p className="text-[11px] leading-tight text-muted">{label}</p>
        <p className="mt-0.5 flex items-center gap-1.5 text-[13px] font-medium leading-tight">
          {status ? <span className="h-1.5 w-1.5 rounded-full bg-leaf" /> : null}
          {value}
        </p>
      </div>
    </div>
  );
}

/**
 * A faint sun path across the hero. The arc draws itself once on load and
 * the sun comes to rest over the photograph.
 */
function SunPath() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 680"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 z-10 hidden h-full w-full lg:block"
    >
      <path
        d="M-216.5 680A1000 1000 0 0 1 1616.5 680"
        fill="none"
        stroke="rgb(245 244 239 / 0.1)"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        pathLength={1}
        strokeDasharray="1"
        className="animate-arc"
        style={delay(200)}
      />
      <g className="animate-fade" style={delay(1700)}>
        <circle cx="860" cy="92.9" r="30" fill="none" stroke="var(--color-sun)" strokeOpacity="0.22" />
        <circle cx="860" cy="92.9" r="8" fill="var(--color-sun)" />
      </g>
    </svg>
  );
}
