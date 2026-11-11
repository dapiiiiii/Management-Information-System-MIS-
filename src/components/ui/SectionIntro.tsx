import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Reveal } from "./Reveal";

type SectionIntroProps = {
  title: ReactNode;
  children?: ReactNode;
  titleId?: string;
  tone?: "light" | "dark";
  className?: string;
};

/**
 * The page's standard section opening: a title on the left and a short
 * explanation on the right, aligned to a shared baseline on wide screens.
 */
export function SectionIntro({ title, children, titleId, tone = "light", className }: SectionIntroProps) {
  return (
    <Reveal className={cn("grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10", className)}>
      <h2
        id={titleId}
        className={cn(
          "text-title font-medium font-stretch-semi-condensed text-balance lg:col-span-6",
          tone === "dark" ? "text-paper" : "text-ink",
        )}
      >
        {title}
      </h2>
      {children ? (
        <div
          className={cn(
            "max-w-[52ch] text-body lg:col-span-5 lg:col-start-8",
            tone === "dark" ? "text-paper/70" : "text-muted",
          )}
        >
          {children}
        </div>
      ) : null}
    </Reveal>
  );
}
