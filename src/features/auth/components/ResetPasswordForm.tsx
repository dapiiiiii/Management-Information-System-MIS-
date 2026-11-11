"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonLink, textLinkClassName } from "@/components/ui/Button";
import { authConfig } from "../config/auth.config";
import { resetPasswordSchema } from "../schemas/auth.schemas";
import { authErrorMessages, getAuthErrorCode, getAuthErrorMessage } from "../services/auth.errors";
import { authService } from "../services/auth.service";
import { AuthHeader } from "./AuthHeader";
import { AuthMessage } from "./AuthMessage";
import { PasswordField } from "./PasswordField";
import { PasswordStrength } from "./PasswordStrength";

const EYEBROW = "Account recovery";

type Outcome = "success" | "TOKEN_INVALID" | "TOKEN_EXPIRED";

export function ResetPasswordForm() {
  const token = useSearchParams().get("token");
  const [outcome, setOutcome] = useState<Outcome | null>(token ? null : "TOKEN_INVALID");
  const [formError, setFormError] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });
  const password = useWatch({ control, name: "password" });

  useEffect(() => {
    if (formError) errorRef.current?.focus();
  }, [formError]);

  useEffect(() => {
    if (outcome) resultHeadingRef.current?.focus();
  }, [outcome]);

  const onSubmit = handleSubmit(async ({ password: newPassword }) => {
    setFormError(null);
    try {
      await authService.resetPassword({ token: token ?? "", password: newPassword });
      setOutcome("success");
    } catch (error) {
      const code = getAuthErrorCode(error);
      if (code === "TOKEN_INVALID" || code === "TOKEN_EXPIRED") setOutcome(code);
      else setFormError(getAuthErrorMessage(error));
    }
  });

  if (outcome === "success") {
    return (
      <>
        <AuthHeader
          eyebrow={EYEBROW}
          icon={{ name: "checkCircle", tone: "success" }}
          title="Your password has been updated"
          description="Sign in with your new password to continue to the platform."
          headingRef={resultHeadingRef}
        />
        <ButtonLink href={authConfig.routes.login} size="lg" className="w-full">
          Sign In
        </ButtonLink>
      </>
    );
  }

  if (outcome) {
    return (
      <>
        <AuthHeader
          eyebrow={EYEBROW}
          icon={{ name: "alertCircle", tone: "error" }}
          title={outcome === "TOKEN_EXPIRED" ? "This reset link has expired" : "This reset link isn't valid"}
          description={authErrorMessages[outcome]}
          headingRef={resultHeadingRef}
        />
        <ButtonLink href={authConfig.routes.forgotPassword} size="lg" className="w-full">
          Request New Instructions
        </ButtonLink>
        <p className="mt-6 text-center text-small text-muted">
          <Link href={authConfig.routes.login} className={textLinkClassName}>
            Back to Sign In
          </Link>
        </p>
      </>
    );
  }

  return (
    <>
      <ResetPasswordHeader />

      <form noValidate onSubmit={onSubmit} aria-label="Set a new password" className="space-y-5">
        {formError ? (
          <AuthMessage ref={errorRef} tone="error">
            {formError}
          </AuthMessage>
        ) : null}

        <PasswordField
          label="New password"
          autoComplete="new-password"
          hint={<PasswordStrength password={password} />}
          error={errors.password?.message}
          {...register("password")}
        />

        <PasswordField
          label="Confirm new password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button type="submit" size="lg" className="w-full" loading={isSubmitting} loadingText="Updating password…">
          Update Password
        </Button>
      </form>

      <p className="mt-8 text-center text-small text-muted">
        <Link href={authConfig.routes.login} className={textLinkClassName}>
          Back to Sign In
        </Link>
      </p>
    </>
  );
}

/** Also used as the Suspense fallback while the reset token is read from the URL. */
export function ResetPasswordHeader() {
  return (
    <AuthHeader
      eyebrow={EYEBROW}
      title="Set a new password"
      description={`Choose a password of at least ${authConfig.password.minLength} characters.`}
    />
  );
}
