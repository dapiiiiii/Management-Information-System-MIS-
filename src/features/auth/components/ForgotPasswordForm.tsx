"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonLink, textLinkClassName } from "@/components/ui/Button";
import { authConfig } from "../config/auth.config";
import { forgotPasswordSchema } from "../schemas/auth.schemas";
import { getAuthErrorMessage } from "../services/auth.errors";
import { authService } from "../services/auth.service";
import { AuthHeader } from "./AuthHeader";
import { AuthMessage } from "./AuthMessage";
import { FormInput } from "./FormInput";

const EYEBROW = "Account recovery";

export function ForgotPasswordForm() {
  const [formError, setFormError] = useState<string | null>(null);
  const [requestedFor, setRequestedFor] = useState<string | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: "" } });

  useEffect(() => {
    if (formError) errorRef.current?.focus();
  }, [formError]);

  useEffect(() => {
    if (requestedFor) resultHeadingRef.current?.focus();
  }, [requestedFor]);

  const onSubmit = handleSubmit(async ({ email }) => {
    setFormError(null);
    try {
      await authService.requestPasswordReset({ email });
      setRequestedFor(email);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    }
  });

  if (requestedFor) {
    return (
      <>
        <AuthHeader
          eyebrow={EYEBROW}
          icon={{ name: "mail", tone: "neutral" }}
          title="Request received"
          headingRef={resultHeadingRef}
          description={
            <>
              If an account is associated with <span className="font-medium text-ink">{requestedFor}</span>, you
              will receive instructions to reset your password. Follow them to set a new password.
            </>
          }
        />
        <ButtonLink href={authConfig.routes.login} size="lg" className="w-full">
          Back to Sign In
        </ButtonLink>
        <p className="mt-6 text-center text-small text-muted">
          Used the wrong address?{" "}
          <button
            type="button"
            className={textLinkClassName}
            onClick={() => {
              reset();
              setRequestedFor(null);
              window.requestAnimationFrame(() => setFocus("email"));
            }}
          >
            Try another email
          </button>
        </p>
      </>
    );
  }

  return (
    <>
      <AuthHeader
        eyebrow={EYEBROW}
        title="Recover your account"
        description="Enter the email address associated with your account and follow the instructions to reset your password."
      />

      <form noValidate onSubmit={onSubmit} aria-label="Recover your account" className="space-y-5">
        {formError ? (
          <AuthMessage ref={errorRef} tone="error">
            {formError}
          </AuthMessage>
        ) : null}

        <FormInput
          label="Email address"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="name@example.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          loading={isSubmitting}
          loadingText="Sending instructions…"
        >
          Send Recovery Instructions
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
