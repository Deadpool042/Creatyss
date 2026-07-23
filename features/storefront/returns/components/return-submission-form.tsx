"use client";

import { useEffect, useId, useState, useTransition, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Notice } from "@/components/shared/feedback";
import {
  getStorefrontReturnOrderLinesAction,
  type GetStorefrontReturnOrderLinesActionResult,
} from "@/features/storefront/returns/actions/get-storefront-return-order-lines-action";
import {
  submitStorefrontReturnRequestAction,
  type SubmitStorefrontReturnRequestActionResult,
} from "@/features/storefront/returns/actions/submit-storefront-return-request-action";
import { RETURN_REASON_CATEGORY_OPTIONS } from "@/features/storefront/returns/lib/return-reason-labels";

const GENERIC_UNAVAILABLE_MESSAGE =
  "Nous n'avons pas pu préparer votre demande de retour. Vérifiez la référence et l'email saisis, ou contactez-nous.";

type ReturnSubmissionFormProps = {
  reference: string;
  email: string;
  /** Motif présélectionné (repris de l'étape 1), modifiable par la cliente. */
  initialReason: string;
};

type LineSelection = Readonly<{ selected: boolean; quantity: number }>;

export function ReturnSubmissionForm({
  reference,
  email,
  initialReason,
}: ReturnSubmissionFormProps) {
  const [linesResult, setLinesResult] = useState<GetStorefrontReturnOrderLinesActionResult | null>(
    null
  );
  const [selections, setSelections] = useState<Record<string, LineSelection>>({});
  const [reason, setReason] = useState(initialReason);
  const [submitResult, setSubmitResult] =
    useState<SubmitStorefrontReturnRequestActionResult | null>(null);
  const [isLoadingLines, startLoadingLines] = useTransition();
  const [isSubmitting, startSubmitting] = useTransition();

  const reasonId = useId();

  useEffect(() => {
    let cancelled = false;

    startLoadingLines(async () => {
      try {
        const result = await getStorefrontReturnOrderLinesAction({ reference, email });
        if (!cancelled) {
          setLinesResult(result);
          if (result.available) {
            setSelections(
              Object.fromEntries(
                result.lines.map((line) => [
                  line.orderLineId,
                  { selected: false, quantity: line.remainingQuantity },
                ])
              )
            );
          }
        }
      } catch {
        if (!cancelled) {
          setLinesResult({ available: false });
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, [reference, email]);

  function toggleLine(orderLineId: string, checked: boolean) {
    setSelections((previous) => {
      const current = previous[orderLineId] ?? { selected: false, quantity: 1 };
      return { ...previous, [orderLineId]: { ...current, selected: checked } };
    });
    setSubmitResult(null);
  }

  function changeQuantity(orderLineId: string, quantity: number) {
    setSelections((previous) => {
      const current = previous[orderLineId] ?? { selected: false, quantity: 1 };
      return { ...previous, [orderLineId]: { ...current, quantity } };
    });
    setSubmitResult(null);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const selectedLines = Object.entries(selections)
      .filter(([, selection]) => selection.selected)
      .map(([orderLineId, selection]) => ({ orderLineId, quantity: selection.quantity }));

    if (selectedLines.length === 0 || reason.length === 0) {
      return;
    }

    startSubmitting(async () => {
      try {
        const result = await submitStorefrontReturnRequestAction({
          reference,
          email,
          reason,
          lines: selectedLines,
        });
        setSubmitResult(result);
      } catch {
        setSubmitResult({ available: false });
      }
    });
  }

  if (linesResult === null || isLoadingLines) {
    return (
      <p className="mt-4 text-xs text-muted-foreground" aria-live="polite">
        Préparation de votre demande de retour…
      </p>
    );
  }

  if (!linesResult.available) {
    return (
      <div className="mt-4" aria-live="polite" aria-atomic="true">
        <Notice tone="note">{GENERIC_UNAVAILABLE_MESSAGE}</Notice>
      </div>
    );
  }

  if (submitResult?.available) {
    return (
      <div className="mt-4" aria-live="polite" aria-atomic="true">
        <Notice tone="success">
          Votre demande de retour a bien été enregistrée. Nous reviendrons vers vous rapidement.
        </Notice>
      </div>
    );
  }

  const hasSelection = Object.values(selections).some((selection) => selection.selected);

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-5 border-t border-surface-border/60 pt-6">
      <p className="text-sm font-semibold text-foreground">Sélectionnez les articles à retourner</p>

      <ul className="space-y-3">
        {linesResult.lines.map((line) => {
          const selection = selections[line.orderLineId];
          const isSelected = selection?.selected ?? false;
          return (
            <li key={line.orderLineId} className="flex items-center gap-3">
              <input
                type="checkbox"
                id={`return-line-${line.orderLineId}`}
                checked={isSelected}
                onChange={(event) => toggleLine(line.orderLineId, event.target.checked)}
                disabled={isSubmitting}
                className="size-4 rounded border-control-border"
              />
              <label htmlFor={`return-line-${line.orderLineId}`} className="flex-1 text-sm">
                {line.productName}
                {line.variantName ? ` — ${line.variantName}` : ""}
              </label>
              <input
                type="number"
                min={1}
                max={line.remainingQuantity}
                value={selection?.quantity ?? line.remainingQuantity}
                onChange={(event) => changeQuantity(line.orderLineId, Number(event.target.value))}
                disabled={isSubmitting || !isSelected}
                aria-label={`Quantité à retourner pour ${line.productName}`}
                className="h-8 w-16 rounded-lg border border-control-border bg-control-surface px-2 text-sm shadow-control outline-none"
              />
            </li>
          );
        })}
      </ul>

      <div className="grid gap-2">
        <label htmlFor={reasonId} className="text-xs font-medium text-muted-foreground">
          Motif du retour
        </label>
        <select
          id={reasonId}
          value={reason}
          onChange={(event) => {
            setReason(event.target.value);
            setSubmitResult(null);
          }}
          disabled={isSubmitting}
          className="h-8 w-full min-w-0 rounded-lg border border-control-border bg-control-surface px-2.5 py-1 text-base shadow-control transition-all outline-none hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 md:text-sm"
        >
          <option value="">Choisissez un motif</option>
          {RETURN_REASON_CATEGORY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <Button type="submit" disabled={isSubmitting || !hasSelection || reason.length === 0}>
        {isSubmitting ? "Envoi…" : "Envoyer ma demande de retour"}
      </Button>

      <div aria-live="polite" aria-atomic="true">
        {submitResult !== null && !submitResult.available ? (
          <Notice tone="note">{GENERIC_UNAVAILABLE_MESSAGE}</Notice>
        ) : null}
      </div>
    </form>
  );
}
