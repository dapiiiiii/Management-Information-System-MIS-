import { site } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

export function FinalCta() {
  return (
    <section aria-labelledby="cta-title" className="pb-20 pt-4 sm:pb-24 lg:pb-28">
      <Container>
        <Reveal>
          <div
            data-tone="dark"
            className="on-dark relative isolate overflow-hidden rounded-[18px] bg-forest px-6 py-16 text-paper sm:px-12 sm:py-20 lg:px-16 lg:py-28"
          >
            {/* The sun path from the mark, rising behind the closing message */}
            <svg
              aria-hidden="true"
              viewBox="0 0 640 340"
              className="pointer-events-none absolute -bottom-px right-[-38%] -z-10 w-[110%] opacity-70 sm:right-[-16%] sm:w-[70%] sm:opacity-100 lg:right-[-6%] lg:w-[50%]"
            >
              <path
                d="M40 340a280 280 0 0 1 560 0"
                fill="none"
                stroke="rgb(245 244 239 / 0.14)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
                pathLength={1}
                className="draw-arc"
              />
              <path
                d="M120 340a200 200 0 0 1 400 0"
                fill="none"
                stroke="rgb(245 244 239 / 0.07)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <circle cx="518" cy="142" r="44" fill="var(--color-sun)" fillOpacity="0.08" />
              <circle cx="518" cy="142" r="24" fill="none" stroke="var(--color-sun)" strokeOpacity="0.3" />
              <circle cx="518" cy="142" r="10" fill="var(--color-sun)" />
            </svg>

            <div className="relative max-w-[44rem]">
              <h2
                id="cta-title"
                className="text-[length:clamp(2.2rem,1.45rem+2.4vw,3.5rem)] font-medium leading-[1.06] tracking-[-0.026em] font-stretch-semi-condensed text-paper"
              >
                <span className="block">A clearer view of training.</span>
                <span className="block">A stronger path to employment.</span>
              </h2>
              <p className="mt-7 max-w-[44ch] text-lead text-paper/70">
                Connect people, training, certification and outcomes through one intelligent programme
                management platform.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href={site.platformUrl} variant="inverse" size="lg">
                  Access Platform
                </ButtonLink>
                <ButtonLink href="#programme" variant="inverseOutline" size="lg">
                  Explore the Programme
                </ButtonLink>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
