"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonLink, textLinkClassName } from "@/components/ui/Button";
import { authConfig } from "../config/auth.config";
import { roleHomeRoute, roleLabels } from "../config/roles";
import { useAuth } from "../context/useAuth";
import { readNextParam, resolvePostLoginPath } from "../lib/redirects";
import { loginSchema } from "../schemas/auth.schemas";
import { getAuthErrorMessage } from "../services/auth.errors";
import type { Session } from "../services/auth.service";
import { AuthHeader } from "./AuthHeader";
import { AuthMessage } from "./AuthMessage";
import { Checkbox, FormInput } from "./FormInput";
import { PasswordField } from "./PasswordField";

const EYEBROW = "Platform access";

export function LoginForm() {
  const router = useRouter();
  const { status, user, signIn, signOut } = useAuth();
  const [formError, setFormError] = useState<string | null>(null);
  const [signedIn, setSignedIn] = useState<Session | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);

  const {
    register,
    handleSubmit,
    resetField,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: false },
  });

  useEffect(() => {
    if (formError) errorRef.current?.focus();
  }, [formError]);

  // Confirm briefly, then continue to the role's home (or a safe ?next= path).
  useEffect(() => {
    if (!signedIn) return;
    resultHeadingRef.current?.focus();
    const timer = window.setTimeout(() => {
      router.replace(resolvePostLoginPath(signedIn.user.role, readNextParam()));
    }, authConfig.postLoginDelayMs);
    return () => window.clearTimeout(timer);
  }, [signedIn, router]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      setSignedIn(await signIn(values));
    } catch (error) {
      resetField("password");
      setFormError(getAuthErrorMessage(error));
    }
  });

  if (signedIn) {
    return (
      <AuthHeader
        eyebrow={EYEBROW}
        icon={{ name: "checkCircle", tone: "success" }}
        title="Signed in successfully"
        description={`Taking you to the ${roleLabels[signedIn.user.role]} platform…`}
        headingRef={resultHeadingRef}
      />
    );
  }

  if (status === "authenticated" && user && !isSubmitting) {
    return (
      <>
        <AuthHeader
          eyebrow={EYEBROW}
          title="You're already signed in"
          description={`Signed in as ${user.fullName}, ${roleLabels[user.role]}.`}
        />
        <ButtonLink href={roleHomeRoute[user.role]} size="lg" className="w-full">
          Continue to platform
        </ButtonLink>
        <p className="mt-6 text-center text-small text-muted">
          Not you?{" "}
          <button type="button" className={textLinkClassName} onClick={() => void signOut()}>
            Sign out
          </button>
        </p>
      </>
    );
  }

  return (
    <>
      <AuthHeader
        eyebrow={EYEBROW}
        title="Sign in to the platform"
        description="Access your account and continue where you left off."
      />

      <form noValidate onSubmit={onSubmit} aria-label="Sign in" className="space-y-5">
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

        <PasswordField
          label="Password"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex flex-wrap items-center justify-between gap-x-4">
          <Checkbox label="Remember me" {...register("remember")} />
          <Link href={authConfig.routes.forgotPassword} className={`${textLinkClassName} text-[14.5px]`}>
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" loading={isSubmitting} loadingText="Signing in…">
          Sign In
        </Button>
      </form>

      <p className="mt-8 text-center text-small text-muted">
        Don&rsquo;t have an account?{" "}
        <Link href={authConfig.routes.register} className={textLinkClassName}>
          Create one
        </Link>
      </p>
    </>
  );
}
