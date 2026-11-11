import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";

type AuthHeaderProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  /** A status icon above the heading, for result screens. */
  icon?: { name: IconName; tone: "success" | "error" | "neutral" };
  /** Rendered between the eyebrow and the heading, for example a step indicator. */
  children?: ReactNode;
  /** Lets a form move focus to the heading when its content changes. */
  headingRef?: Ref<HTMLHeadingElement>;
};

const iconTone = {
  success: "bg-leaf/10 text-leaf",
  error: "bg-error-soft text-error",
  neutral: "bg-forest/[0.07] text-forest",
};

/** The page's single heading block: eyebrow, h1 and supporting text. */
export function AuthHeader({ eyebrow, title, description, icon, children, headingRef }: AuthHeaderProps) {
  return (
    <header className="mb-8">
      {icon ? (
        <span className={cn("mb-6 flex h-12 w-12 items-center justify-center rounded-full", iconTone[icon.tone])}>
          <Icon name={icon.name} className="h-6 w-6" strokeWidth={1.75} />
        </span>
      ) : null}
      <p className="text-[12px] font-medium uppercase tracking-[0.16em] text-leaf">{eyebrow}</p>
      {children}
      <h1
        ref={headingRef}
        tabIndex={-1}
        className="mt-4 text-[clamp(1.75rem,1.45rem+1vw,2.125rem)] font-medium leading-[1.1] tracking-[-0.022em] font-stretch-semi-condensed text-ink focus:outline-none"
      >
        {title}
      </h1>
      {description ? <div className="mt-3 text-body text-muted">{description}</div> : null}
    </header>
  );
}
