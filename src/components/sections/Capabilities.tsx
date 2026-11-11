import { capabilities } from "@/content/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { SectionIntro } from "@/components/ui/SectionIntro";
import { CapabilityCard } from "./CapabilityCard";

export function Capabilities() {
  return (
    <section id="training" aria-labelledby="training-title" className="border-t border-line py-24 sm:py-28 lg:py-36">
      <Container>
        <SectionIntro titleId="training-title" title="Built Around the Programme Lifecycle">
          <p>
            Six connected modules cover the day-to-day work of running the programme, from the first
            registration to the final donor report. Each module reads from and writes to the same participant
            records.
          </p>
        </SectionIntro>

        <Reveal delay={120} className="mt-14 lg:mt-20">
          <ul className="grid border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability, i) => (
              <CapabilityCard key={capability.title} capability={capability} index={i} />
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
