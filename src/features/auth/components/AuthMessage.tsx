import type { ReactNode, Ref } from "react";
import { cn } from "@/lib/cn";
import { Icon, type IconName } from "@/components/ui/Icon";

type Tone = "error" | "success" | "info";

const tones: Record<Tone, { box: string; icon: string; name: IconName }> = {
  error: { box: "border-error/35 bg-error-soft", icon: "text-error", name: "alertCircle" },
  success: { box: "border-leaf/35 bg-leaf/[0.07]", icon: "text-leaf", name: "checkCircle" },
  info: { box: "border-line bg-surface", icon: "text-forest", name: "info" },
};

type AuthMessageProps = {
  tone: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
  ref?: Ref<HTMLDivElement>;
};

/**
 * A form-level message. Errors are announced as alerts; other tones as
 * status. Focusable so a failed submission can move focus to it.
 */
export function AuthMessage({ tone, title, children, className, ref }: AuthMessageProps) {
  const style = tones[tone];
  return (
    <div
      ref={ref}
      tabIndex={-1}
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-md border px-4 py-3.5 text-[14.5px] leading-snug text-ink", style.box, className)}
    >
      <Icon name={style.name} className={cn("mt-px h-5 w-5 shrink-0", style.icon)} strokeWidth={1.75} />
      <div>
        {title ? <p className="font-medium">{title}</p> : null}
        <div className={cn(title && "mt-1 text-muted")}>{children}</div>
      </div>
    </div>
  );
}
