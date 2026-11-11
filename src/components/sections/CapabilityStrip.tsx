import type { CSSProperties } from "react";
import { capabilityStrip } from "@/content/site";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/Container";
import { Icon, type IconName } from "@/components/ui/Icon";

const icons: IconName[] = ["panel", "seal", "pathway", "measure"];

// Per-position dividers for a 2 x 2 grid on small screens and one row on large.
const cell = [
  "pr-5 lg:pr-8",
  "border-l pl-5 lg:px-8",
  "border-t pr-5 lg:border-l lg:border-t-0 lg:px-8",
  "border-l border-t pl-5 lg:border-t-0 lg:pl-8 lg:pr-0",
];

/** The hero's foot: four institutional capabilities on the same dark ground. */
export function CapabilityStrip() {
  return (
    <section
      aria-label="Core capabilities"
      data-tone="dark"
      className="on-dark relative bg-forest-deep text-paper"
    >
      <Container>
        <ul className="grid grid-cols-2 border-t border-paper/10 lg:grid-cols-4">
          {capabilityStrip.map((item, i) => (
            <li
              key={item.word}
              className={cn("animate-rise border-paper/10 py-7 sm:py-8 lg:py-9", cell[i])}
              style={{ animationDelay: `${900 + i * 90}ms` } as CSSProperties}
            >
              <div className="flex items-center gap-3">
                <Icon name={icons[i]} className="h-5 w-5 text-sun" />
                <p className="text-[12.5px] font-semibold tracking-[0.2em] text-paper">{item.word}</p>
              </div>
              <p className="mt-3 max-w-[26ch] text-small text-paper/60">{item.text}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
