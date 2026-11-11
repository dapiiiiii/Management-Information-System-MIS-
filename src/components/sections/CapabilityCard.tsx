import type { Capability } from "@/content/site";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

/**
 * One cell of the editorial capability grid. Dividers depend on the cell's
 * position, so the grid reads as a ruled table rather than a set of cards.
 */
export function CapabilityCard({ capability, index }: { capability: Capability; index: number }) {
  const sm = index % 2 === 1 ? "sm:border-l sm:pl-8" : "sm:border-l-0 sm:pl-0 sm:pr-8";
  const lg = index % 3 === 0 ? "lg:border-l-0 lg:pl-0 lg:pr-10" : "lg:border-l lg:pl-10 lg:pr-10";

  return (
    <li
      className={cn(
        "group relative border-b border-line py-10 lg:py-12",
        "before:absolute before:-top-px before:left-0 before:h-[2px] before:w-0 before:bg-sun before:transition-[width] before:duration-500 before:ease-(--ease-out-soft) hover:before:w-16",
        sm,
        lg,
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-md border border-line text-forest transition-colors duration-300 group-hover:border-forest group-hover:bg-forest group-hover:text-paper">
        <Icon name={capability.icon} className="h-[22px] w-[22px]" />
      </span>
      <h3 className="mt-7 text-[20px] font-medium leading-snug tracking-[-0.012em] text-ink">{capability.title}</h3>
      <p className="mt-2.5 max-w-[34ch] text-small text-muted">{capability.body}</p>
    </li>
  );
}
