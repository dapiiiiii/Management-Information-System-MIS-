"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  useForm,
  useWatch,
  type Control,
  type FieldErrors,
  type Resolver,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, ButtonLink, textLinkClassName } from "@/components/ui/Button";
import { authConfig, PROGRAMME_OTHER } from "../config/auth.config";
import {
  clearRegistrationDraft,
  draftRestoredStore,
  loadRegistrationDraft,
  saveRegistrationDraft,
} from "../lib/registrationDraft";
import {
  registrationSchema,
  registrationStepFields,
  registrationStepSchemas,
  type RegistrationValues,
} from "../schemas/auth.schemas";
import { getAuthErrorMessage } from "../services/auth.errors";
import { authService } from "../services/auth.service";
import { AuthHeader } from "./AuthHeader";
import { AuthMessage } from "./AuthMessage";
import { AuthProgress } from "./AuthProgress";
import { FormInput, FormSelect, FormTextarea } from "./FormInput";
import { PasswordField } from "./PasswordField";
import { PasswordStrength } from "./PasswordStrength";

const EYEBROW = "Trainee registration";

const steps = [
  { title: "Basic information", description: "Set up the details you'll use to sign in." },
  { title: "Personal information", description: "Tell us a little about yourself." },
  {
    title: "Programme information",
    description: "Tell us about the training you're interested in and your background.",
  },
  { title: "Review your information", description: "Check your details before creating your account." },
] as const;

const TOTAL = steps.length;
const REVIEW = TOTAL;

const emptyValues: RegistrationValues = {
  fullName: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  dateOfBirth: "",
  gender: "",
  educationLevel: "",
  address: "",
  location: "",
  programmeInterest: "",
  programmeInterestOther: "",
  relevantBackground: "",
  supportingInformation: "",
};

const toOptions = (values: readonly string[]) => values.map((value) => ({ value, label: value }));
const { genderOptions, educationLevels, programmeOptions } = authConfig.registration;

export function RegisterForm() {
  const [step, setStep] = useState(1);
  const [returnToReview, setReturnToReview] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const restored = useSyncExternalStore(
    draftRestoredStore.subscribe,
    draftRestoredStore.getSnapshot,
    draftRestoredStore.getServerSnapshot,
  );

  // Refs are read only in effects and handlers, never during render.
  const stepRef = useRef(1);
  const focusHeadingNext = useRef(false);
  const focusFieldNext = useRef<keyof RegistrationValues | null>(null);
  const draftLocked = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  // Validate only the current step's schema (the review step uses the full schema).
  const resolver = useCallback<Resolver<RegistrationValues>>((values, context, options) => {
    // Each step's schema covers a subset of the form; widen the union to the full form type for the resolver.
    const schema = registrationStepSchemas[stepRef.current - 1] as unknown as typeof registrationSchema;
    const resolve = zodResolver(schema, undefined, { raw: true }) as unknown as Resolver<RegistrationValues>;
    return resolve(values, context, options);
  }, []);

  const {
    register,
    control,
    handleSubmit,
    reset,
    clearErrors,
    setFocus,
    subscribe,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationValues>({ resolver, defaultValues: emptyValues });

  // Restore a draft saved earlier in this browser session.
  useEffect(() => {
    const draft = loadRegistrationDraft();
    if (draft) {
      reset({ ...emptyValues, ...draft });
      draftRestoredStore.set(true);
    }
    return () => draftRestoredStore.set(false);
  }, [reset]);

  // Autosave as the visitor types. Passwords are excluded by saveRegistrationDraft.
  useEffect(() => {
    let timer: number | undefined;
    const unsubscribe = subscribe({
      formState: { values: true },
      callback: ({ values }) => {
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          if (!draftLocked.current) saveRegistrationDraft(values);
        }, 400);
      },
    });
    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, [subscribe]);

  // After a step change, move focus to the new heading or to a field that needs attention.
  useEffect(() => {
    const field = focusFieldNext.current;
    focusFieldNext.current = null;
    if (field) {
      setFocus(field);
    } else if (focusHeadingNext.current) {
      headingRef.current?.focus();
    }
    focusHeadingNext.current = false;
  }, [step, setFocus]);

  useEffect(() => {
    if (formError) errorRef.current?.focus();
  }, [formError]);

  useEffect(() => {
    if (submitted) headingRef.current?.focus();
  }, [submitted]);

  const goToStep = (next: number) => {
    stepRef.current = next;
    focusHeadingNext.current = true;
    setFormError(null);
    setStep(next);
  };

  const onValid = async (values: RegistrationValues) => {
    if (step < REVIEW) {
      goToStep(returnToReview ? REVIEW : step + 1);
      setReturnToReview(false);
      return;
    }

    setFormError(null);
    try {
      const data = registrationSchema.parse(values);
      await authService.register({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        educationLevel: data.educationLevel,
        address: data.address,
        location: data.location,
        programmeInterest: data.programmeInterest,
        programmeInterestOther: data.programmeInterestOther,
        relevantBackground: data.relevantBackground,
        supportingInformation: data.supportingInformation,
      });
      draftLocked.current = true;
      clearRegistrationDraft();
      setSubmitted(true);
    } catch (error) {
      setFormError(getAuthErrorMessage(error));
    }
  };

  // On the review step, send the visitor to the first step with a problem.
  const onInvalid = (fieldErrors: FieldErrors<RegistrationValues>) => {
    if (stepRef.current !== REVIEW) return; // react-hook-form focuses the first invalid field
    const index = registrationStepFields.findIndex((fields) => fields.some((field) => fieldErrors[field]));
    if (index < 0) return;
    focusFieldNext.current = registrationStepFields[index].find((field) => fieldErrors[field]) ?? null;
    stepRef.current = index + 1;
    setReturnToReview(true);
    setStep(index + 1);
  };

  const goBack = () => {
    clearErrors();
    setReturnToReview(false);
    goToStep(step - 1);
  };

  const editStep = (target: number) => {
    setReturnToReview(true);
    goToStep(target);
  };

  if (submitted) {
    return (
      <>
        <AuthHeader
          eyebrow={EYEBROW}
          icon={{ name: "checkCircle", tone: "success" }}
          title="Registration submitted successfully"
          description="Your account information has been received. Follow the instructions provided to complete account activation."
          headingRef={headingRef}
        />
        <ButtonLink href={authConfig.routes.login} size="lg" className="w-full">
          Return to Sign In
        </ButtonLink>
      </>
    );
  }

  const current = steps[step - 1];

  return (
    <>
      <AuthHeader eyebrow={EYEBROW} title={current.title} description={current.description} headingRef={headingRef}>
        <AuthProgress step={step} total={TOTAL} />
      </AuthHeader>
      <p className="sr-only" aria-live="polite">
        {`Step ${step} of ${TOTAL}: ${current.title}`}
      </p>

      <form
        noValidate
        onSubmit={handleSubmit(onValid, onInvalid)}
        aria-label="Create a trainee account"
        className="space-y-5"
      >
        {restored && step === 1 ? (
          <AuthMessage tone="info">
            We restored the details you entered earlier. For your security, passwords are never saved, so please
            enter yours again.
          </AuthMessage>
        ) : null}

        {formError ? (
          <AuthMessage ref={errorRef} tone="error">
            {formError}
          </AuthMessage>
        ) : null}

        {step === 1 ? <BasicStep register={register} control={control} errors={errors} /> : null}
        {step === 2 ? <PersonalStep register={register} errors={errors} /> : null}
        {step === 3 ? <ProgrammeStep register={register} control={control} errors={errors} /> : null}
        {step === REVIEW ? <ReviewStep control={control} onEdit={editStep} /> : null}

        <div className="flex gap-3 pt-2">
          {step > 1 ? (
            <Button variant="secondary" size="lg" onClick={goBack}>
              Back
            </Button>
          ) : null}
          <Button
            type="submit"
            size="lg"
            className="flex-1"
            loading={isSubmitting && step === REVIEW}
            loadingText="Creating account…"
          >
            {step === REVIEW ? "Create Account" : returnToReview ? "Save and Review" : "Continue"}
          </Button>
        </div>
      </form>

      <p className="mt-8 text-center text-small text-muted">
        Already have an account?{" "}
        <Link href={authConfig.routes.login} className={textLinkClassName}>
          Sign in
        </Link>
      </p>
    </>
  );
}

type StepProps = {
  register: UseFormRegister<RegistrationValues>;
  control: Control<RegistrationValues>;
  errors: FieldErrors<RegistrationValues>;
};

function BasicStep({ register, control, errors }: StepProps) {
  const password = useWatch({ control, name: "password" });
  return (
    <>
      <FormInput label="Full name" autoComplete="name" error={errors.fullName?.message} {...register("fullName")} />
      <FormInput
        label="Email address"
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="name@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <FormInput
        label="Phone number"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
        hint="Include your country code if you have one."
        error={errors.phone?.message}
        {...register("phone")}
      />
      <PasswordField
        label="Password"
        autoComplete="new-password"
        hint={<PasswordStrength password={password} />}
        error={errors.password?.message}
        {...register("password")}
      />
      <PasswordField
        label="Confirm password"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />
      <p className="text-[13.5px] leading-snug text-muted">
        Registration creates a trainee account. Staff and partner accounts are set up by programme administrators.
      </p>
    </>
  );
}

function PersonalStep({ register, errors }: Omit<StepProps, "control">) {
  return (
    <>
      <FormInput
        label="Date of birth"
        type="date"
        autoComplete="bday"
        error={errors.dateOfBirth?.message}
        {...register("dateOfBirth")}
      />
      <FormSelect
        label="Gender"
        autoComplete="sex"
        options={toOptions(genderOptions)}
        error={errors.gender?.message}
        {...register("gender")}
      />
      <FormSelect
        label="Highest level of education"
        options={toOptions(educationLevels)}
        error={errors.educationLevel?.message}
        {...register("educationLevel")}
      />
      <FormInput
        label="Address"
        autoComplete="street-address"
        error={errors.address?.message}
        {...register("address")}
      />
      <FormInput
        label="Region or district"
        autoComplete="address-level1"
        hint="The area where you live."
        error={errors.location?.message}
        {...register("location")}
      />
    </>
  );
}

function ProgrammeStep({ register, control, errors }: StepProps) {
  const interest = useWatch({ control, name: "programmeInterest" });
  const hasCatalogue = programmeOptions.length > 0;
  return (
    <>
      {hasCatalogue ? (
        <>
          <FormSelect
            label="Training interest"
            options={[...toOptions(programmeOptions), { value: PROGRAMME_OTHER, label: "Other (please specify)" }]}
            error={errors.programmeInterest?.message}
            {...register("programmeInterest")}
          />
          {interest === PROGRAMME_OTHER ? (
            <FormInput
              label="Please specify"
              error={errors.programmeInterestOther?.message}
              {...register("programmeInterestOther")}
            />
          ) : null}
        </>
      ) : (
        <FormInput
          label="Training interest"
          hint="Describe the training you would like to take part in."
          error={errors.programmeInterest?.message}
          {...register("programmeInterest")}
        />
      )}
      <FormTextarea
        label="Relevant education or experience"
        optional
        hint="For example, technical courses, electrical work or related employment."
        error={errors.relevantBackground?.message}
        {...register("relevantBackground")}
      />
      <FormTextarea
        label="Supporting information"
        optional
        hint="Anything else the programme team should know about your application."
        error={errors.supportingInformation?.message}
        {...register("supportingInformation")}
      />
    </>
  );
}

function ReviewStep({ control, onEdit }: { control: Control<RegistrationValues>; onEdit: (step: number) => void }) {
  const values = useWatch({ control });
  const interest =
    values.programmeInterest === PROGRAMME_OTHER ? values.programmeInterestOther : values.programmeInterest;

  const groups = [
    {
      step: 1,
      title: "Basic information",
      rows: [
        ["Full name", values.fullName],
        ["Email address", values.email],
        ["Phone number", values.phone],
        ["Password", values.password ? "Set" : ""],
      ],
    },
    {
      step: 2,
      title: "Personal information",
      rows: [
        ["Date of birth", formatDate(values.dateOfBirth)],
        ["Gender", values.gender],
        ["Highest level of education", values.educationLevel],
        ["Address", values.address],
        ["Region or district", values.location],
      ],
    },
    {
      step: 3,
      title: "Programme information",
      rows: [
        ["Training interest", interest],
        ["Relevant education or experience", values.relevantBackground],
        ["Supporting information", values.supportingInformation],
      ],
    },
  ] as const;

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <section
          key={group.title}
          aria-labelledby={`review-${group.step}`}
          className="rounded-md border border-line bg-surface"
        >
          <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2">
            <h2 id={`review-${group.step}`} className="text-[14.5px] font-medium text-ink">
              {group.title}
            </h2>
            <button
              type="button"
              onClick={() => onEdit(group.step)}
              className={`${textLinkClassName} inline-flex min-h-11 items-center text-[14px]`}
            >
              Edit<span className="sr-only"> {group.title.toLowerCase()}</span>
            </button>
          </div>
          <dl className="divide-y divide-line px-4">
            {group.rows.map(([label, value]) => (
              <div key={label} className="grid gap-0.5 py-3 sm:grid-cols-[11rem_1fr] sm:gap-4">
                <dt className="text-[13.5px] text-muted">{label}</dt>
                <dd className="break-words text-[14.5px] text-ink">
                  {value ? value : <span className="text-muted">Not provided</span>}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

function formatDate(value: string | undefined) {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}
