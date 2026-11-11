"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";
import { Field, controlClassName, type FormInputProps } from "./FormInput";

type PasswordFieldProps = Omit<FormInputProps, "type">;

/** A password input with an accessible show/hide toggle. */
export function PasswordField({ label, hint, error, optional, id, className, ...props }: PasswordFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const [visible, setVisible] = useState(false);

  return (
    <Field id={inputId} label={label} hint={hint} error={error} optional={optional}>
      {(a11y) => (
        <div className="relative">
          <input
            id={inputId}
            type={visible ? "text" : "password"}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className={cn(controlClassName, "h-12 pr-14", className)}
            {...a11y}
            {...props}
          />
          <button
            type="button"
            aria-pressed={visible}
            aria-controls={inputId}
            onClick={() => setVisible((value) => !value)}
            className="absolute inset-y-0 right-0 flex w-12 items-center justify-center rounded-r-md text-muted transition-colors hover:text-ink focus-visible:outline-offset-[-4px]"
          >
            <span className="sr-only">Show password</span>
            <Icon name={visible ? "eyeOff" : "eye"} className="h-5 w-5" />
          </button>
        </div>
      )}
    </Field>
  );
}
