import { cn } from "@/lib/cn";
import { authConfig } from "../config/auth.config";

type Strength = { score: 0 | 1 | 2 | 3 | 4; label: string };

/**
 * Advisory only: guides people towards stronger passwords without adding
 * rules. The single enforced rule is authConfig.password.minLength.
 */
function estimateStrength(password: string): Strength {
  if (!password) return { score: 0, label: "Not entered" };
  const min = authConfig.password.minLength;
  if (password.length < min) return { score: 1, label: "Too short" };

  const variety = [/[a-z]/, /[A-Z]/, /\d/, /[^A-Za-z0-9]/].filter((pattern) => pattern.test(password)).length;
  let score = 1;
  if (password.length >= min + 4) score++;
  if (variety >= 3) score++;
  if (password.length >= min + 8 || variety === 4) score++;

  const labels = ["", "Weak", "Fair", "Good", "Strong"] as const;
  const capped = Math.min(score, 4) as 1 | 2 | 3 | 4;
  return { score: capped, label: labels[capped] };
}

const fill: Record<Strength["score"], string> = {
  0: "bg-line",
  1: "bg-error",
  2: "bg-sun-strong",
  3: "bg-leaf",
  4: "bg-forest",
};

export function PasswordStrength({ password }: { password: string }) {
  const { score, label } = estimateStrength(password);
  return (
    <div>
      <div className="grid grid-cols-4 gap-1" aria-hidden="true">
        {[1, 2, 3, 4].map((segment) => (
          <span
            key={segment}
            className={cn("h-1 rounded-full transition-colors duration-300", segment <= score ? fill[score] : "bg-line")}
          />
        ))}
      </div>
      <p className="mt-2">
        Password strength: <span className="font-medium text-ink">{label}</span>. Use a strong password to protect
        your account.
      </p>
    </div>
  );
}
