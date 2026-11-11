import {
  useId,
  type InputHTMLAttributes,
  type ReactNode,
  type Ref,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

/** Shared look for every text-like control: 48px tall, hairline 3:1 border, gold focus ring. */
export const controlClassName = cn(
  "block w-full rounded-md border border-field bg-surface px-3.5 text-[16px] text-ink transition-colors duration-150",
  "placeholder:text-muted hover:border-ink/55 focus:border-forest",
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-strong",
  "aria-[invalid=true]:border-error",
);

type ControlA11y = { "aria-describedby"?: string; "aria-invalid"?: true };

type FieldProps = {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  optional?: boolean;
  children: (a11y: ControlA11y) => ReactNode;
};

/**
 * Label above the control, then hint, then error. The control receives
 * aria-describedby pointing at both, and aria-invalid when in error.
 */
export function Field({ id, label, hint, error, optional, children }: FieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="block text-[14.5px] font-medium text-ink">
        {label}
        {optional ? <span className="font-normal text-muted"> (optional)</span> : null}
      </label>
      <div className="mt-2">{children({ "aria-describedby": describedBy, "aria-invalid": error ? true : undefined })}</div>
      {hint ? (
        <div id={hintId} className="mt-2 text-[13.5px] leading-snug text-muted">
          {hint}
        </div>
      ) : null}
      {error ? (
        <p id={errorId} className="mt-2 flex items-start gap-1.5 text-[13.5px] leading-snug text-error">
          <Icon name="alertCircle" className="mt-px h-4 w-4 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      ) : null}
    </div>
  );
}

type FieldOwnProps = { label: string; hint?: ReactNode; error?: string; optional?: boolean };

export type FormInputProps = InputHTMLAttributes<HTMLInputElement> & FieldOwnProps & { ref?: Ref<HTMLInputElement> };

export function FormInput({ label, hint, error, optional, id, className, ...props }: FormInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  return (
    <Field id={inputId} label={label} hint={hint} error={error} optional={optional}>
      {(a11y) => <input id={inputId} className={cn(controlClassName, "h-12", className)} {...a11y} {...props} />}
    </Field>
  );
}

type Option = { value: string; label: string };

type FormSelectProps = SelectHTMLAttributes<HTMLSelectElement> &
  FieldOwnProps & { options: readonly Option[]; placeholder?: string; ref?: Ref<HTMLSelectElement> };

export function FormSelect({
  label,
  hint,
  error,
  optional,
  id,
  options,
  placeholder = "Select an option",
  className,
  ...props
}: FormSelectProps) {
  const generatedId = useId();
  const selectId = id ?? generatedId;
  return (
    <Field id={selectId} label={label} hint={hint} error={error} optional={optional}>
      {(a11y) => (
        <div className="relative">
          <select
            id={selectId}
            className={cn(controlClassName, "h-12 appearance-none pr-11", className)}
            {...a11y}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Icon
            name="chevronDown"
            className="pointer-events-none absolute right-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted"
          />
        </div>
      )}
    </Field>
  );
}

type FormTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> &
  FieldOwnProps & { ref?: Ref<HTMLTextAreaElement> };

export function FormTextarea({ label, hint, error, optional, id, className, ...props }: FormTextareaProps) {
  const generatedId = useId();
  const textareaId = id ?? generatedId;
  return (
    <Field id={textareaId} label={label} hint={hint} error={error} optional={optional}>
      {(a11y) => (
        <textarea
          id={textareaId}
          rows={4}
          className={cn(controlClassName, "min-h-28 resize-y py-3 leading-relaxed", className)}
          {...a11y}
          {...props}
        />
      )}
    </Field>
  );
}

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  ref?: Ref<HTMLInputElement>;
};

/** A native checkbox with a 44px-tall label as its touch target. */
export function Checkbox({ label, id, className, ...props }: CheckboxProps) {
  const generatedId = useId();
  const checkboxId = id ?? generatedId;
  return (
    <label htmlFor={checkboxId} className={cn("inline-flex min-h-11 cursor-pointer items-center gap-3 text-[14.5px] text-ink", className)}>
      <input
        id={checkboxId}
        type="checkbox"
        className="h-5 w-5 shrink-0 cursor-pointer rounded accent-forest focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sun-strong"
        {...props}
      />
      {label}
    </label>
  );
}
