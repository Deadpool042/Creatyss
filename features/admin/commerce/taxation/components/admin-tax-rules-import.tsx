"use client";

import { useActionState, useRef } from "react";
import {
  importTaxRulesAction,
  type ImportTaxRulesResult,
} from "@/features/admin/commerce/taxation/actions/import-tax-rules.action";

const initialState: ImportTaxRulesResult | null = null;

export function AdminTaxRulesImport() {
  const [result, action, isPending] = useActionState(importTaxRulesAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  const hasSuccess = result && (result.created > 0 || result.updated > 0);
  const hasErrors = result && result.errors.length > 0;

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Scope boutique uniquement (STORE). Colonnes :{" "}
        <code className="rounded bg-surface-subtle px-1 py-0.5 font-mono text-[11px]">
          code,name,countryCode,regionCode,ratePercent,startsAt,endsAt,status
        </code>
        . Les règles existantes (même <code className="font-mono text-[11px]">code</code>) sont
        mises à jour.
      </p>

      <form ref={formRef} action={action} className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <label htmlFor="csvFile" className="mb-1 block text-xs font-medium text-foreground">
            Fichier CSV
          </label>
          <input
            id="csvFile"
            name="csvFile"
            type="file"
            accept=".csv,text/csv"
            required
            className="block w-full cursor-pointer rounded-lg border border-surface-border bg-surface-panel px-3 py-2 text-sm text-foreground file:mr-3 file:cursor-pointer file:rounded file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity disabled:opacity-60"
        >
          {isPending ? "Import en cours…" : "Importer"}
        </button>
      </form>

      {hasSuccess && (
        <p className="rounded-lg border border-feedback-success-border bg-feedback-success-surface px-3 py-2 text-sm text-feedback-success-foreground">
          Import terminé — {result.created} règle{result.created !== 1 ? "s" : ""} créée
          {result.created !== 1 ? "s" : ""}, {result.updated} mise{result.updated !== 1 ? "s" : ""}{" "}
          à jour.
        </p>
      )}

      {hasErrors && (
        <div className="rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 py-2">
          <p className="mb-1 text-sm font-medium text-feedback-error-foreground">
            {result.errors.length} erreur{result.errors.length !== 1 ? "s" : ""}
          </p>
          <ul className="list-inside list-disc space-y-0.5 text-xs text-feedback-error-foreground">
            {result.errors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {result && !hasSuccess && !hasErrors && (
        <p className="text-sm text-muted-foreground">Aucune ligne importée.</p>
      )}
    </div>
  );
}
