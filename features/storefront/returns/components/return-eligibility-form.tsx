"use client";

import { useId, useState, useTransition, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Notice } from "@/components/shared/feedback";
import {
  checkStorefrontReturnEligibilityAction,
  type CheckStorefrontReturnEligibilityActionResult,
} from "@/features/storefront/returns/actions/check-storefront-return-eligibility-action";
import { RETURN_REASON_CATEGORY_OPTIONS } from "@/features/storefront/returns/lib/return-reason-labels";

const GENERIC_UNAVAILABLE_MESSAGE =
  "Nous n'avons pas pu vérifier votre commande avec ces informations. Vérifiez la référence et l'email saisis, ou contactez-nous.";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldErrors = Readonly<{
  reference: string | undefined;
  email: string | undefined;
  reason: string | undefined;
}>;

const NO_FIELD_ERRORS: FieldErrors = { reference: undefined, email: undefined, reason: undefined };

function validateClientFields(values: {
  reference: string;
  email: string;
  reason: string;
}): FieldErrors {
  return {
    reference:
      values.reference.trim().length === 0 ? "La référence de commande est requise." : undefined,
    email: EMAIL_PATTERN.test(values.email.trim())
      ? undefined
      : "Renseignez une adresse email valide.",
    reason: values.reason.length === 0 ? "Choisissez un motif." : undefined,
  };
}

function hasFieldErrors(errors: FieldErrors): boolean {
  return (
    errors.reference !== undefined || errors.email !== undefined || errors.reason !== undefined
  );
}

function ResultNotice({ result }: { result: CheckStorefrontReturnEligibilityActionResult }) {
  if (!result.available) {
    return <Notice tone="note">{GENERIC_UNAVAILABLE_MESSAGE}</Notice>;
  }

  switch (result.eligibility.outcome) {
    case "ELIGIBLE":
      return (
        <Notice tone="success">
          Votre commande contient au moins un article potentiellement éligible au retour.
          <br />
          Contactez-nous pour finaliser votre demande de retour.
        </Notice>
      );
    case "MANUAL_REVIEW":
      return (
        <Notice tone="note">
          Votre situation nécessite une vérification manuelle.
          <br />
          Contactez-nous afin que nous puissions étudier votre demande.
        </Notice>
      );
    case "INELIGIBLE":
      return (
        <Notice tone="alert">
          Nous ne pouvons pas confirmer l&apos;éligibilité de cette commande au retour.
          <br />
          Vous pouvez nous contacter si vous pensez que votre situation nécessite une vérification.
        </Notice>
      );
  }
}

export function ReturnEligibilityForm() {
  const [reference, setReference] = useState("");
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>(NO_FIELD_ERRORS);
  const [result, setResult] = useState<CheckStorefrontReturnEligibilityActionResult | null>(null);
  const [isPending, startTransition] = useTransition();

  const referenceErrorId = useId();
  const emailErrorId = useId();
  const reasonErrorId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const errors = validateClientFields({ reference, email, reason });
    setFieldErrors(errors);
    if (hasFieldErrors(errors)) {
      return;
    }

    startTransition(async () => {
      try {
        const nextResult = await checkStorefrontReturnEligibilityAction({
          reference,
          email,
          reason,
        });
        setResult(nextResult);
      } catch {
        setResult({ available: false });
      }
    });
  }

  function handleReferenceChange(value: string) {
    setReference(value);
    setResult(null);
    if (fieldErrors.reference !== undefined) {
      setFieldErrors((previous) => ({ ...previous, reference: undefined }));
    }
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    setResult(null);
    if (fieldErrors.email !== undefined) {
      setFieldErrors((previous) => ({ ...previous, email: undefined }));
    }
  }

  function handleReasonChange(value: string) {
    setReason(value);
    setResult(null);
    if (fieldErrors.reason !== undefined) {
      setFieldErrors((previous) => ({ ...previous, reason: undefined }));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-2">
        <Label htmlFor="return-reference">Référence de commande</Label>
        <Input
          id="return-reference"
          name="reference"
          type="text"
          value={reference}
          onChange={(event) => handleReferenceChange(event.target.value)}
          placeholder="CRY-XXXXXXXXXX"
          disabled={isPending}
          aria-invalid={fieldErrors.reference ? true : undefined}
          aria-describedby={fieldErrors.reference ? referenceErrorId : undefined}
        />
        <p className="text-[11px] text-muted-foreground/60">
          Disponible dans votre email de confirmation.
        </p>
        {fieldErrors.reference ? (
          <p id={referenceErrorId} className="text-xs text-feedback-error-foreground" role="alert">
            {fieldErrors.reference}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="return-email">Email</Label>
        <Input
          id="return-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => handleEmailChange(event.target.value)}
          placeholder="votre@email.fr"
          disabled={isPending}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? emailErrorId : undefined}
        />
        {fieldErrors.email ? (
          <p id={emailErrorId} className="text-xs text-feedback-error-foreground" role="alert">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="return-reason">Motif du retour</Label>
        <select
          id="return-reason"
          name="reason"
          value={reason}
          onChange={(event) => handleReasonChange(event.target.value)}
          disabled={isPending}
          aria-invalid={fieldErrors.reason ? true : undefined}
          aria-describedby={fieldErrors.reason ? reasonErrorId : undefined}
          className="h-8 w-full min-w-0 rounded-lg border border-control-border bg-control-surface px-2.5 py-1 text-base shadow-control transition-all outline-none hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 md:text-sm"
        >
          <option value="">Choisissez un motif</option>
          {RETURN_REASON_CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {fieldErrors.reason ? (
          <p id={reasonErrorId} className="text-xs text-feedback-error-foreground" role="alert">
            {fieldErrors.reason}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={isPending}>
        {isPending ? "Vérification…" : "Vérifier mon éligibilité"}
      </Button>

      <div aria-live="polite" aria-atomic="true">
        {result !== null ? <ResultNotice result={result} /> : null}
      </div>
    </form>
  );
}
