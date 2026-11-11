import { cn } from "@/lib/cn";

/** "Step X of N" with a thin segmented bar; the active segment carries the gold accent. */
export function AuthProgress({ step, total }: { step: number; total: number }) {
  return (
    <div className="mt-4">
      <p className="text-[13.5px] font-medium tabular-nums text-ink">
        Step {step} of {total}
      </p>
      <div
        aria-hidden="true"
        className="mt-2.5 grid gap-1"
        style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-[3px] rounded-full transition-colors duration-300",
              i + 1 < step ? "bg-forest" : i + 1 === step ? "bg-sun" : "bg-line",
            )}
          />
        ))}
      </div>
    </div>
  );
}
