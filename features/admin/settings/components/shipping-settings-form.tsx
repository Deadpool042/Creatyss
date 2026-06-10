"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/shared";
import { cn } from "@/lib/utils";
import { updateAdminShippingSettingsAction } from "@/features/admin/settings/actions/update-admin-shipping-settings.action";
import { type ShippingSettingsFormState } from "@/features/admin/settings/schemas/shipping-settings.schema";
import type { AdminShippingSettings } from "@/features/admin/settings/queries/get-admin-shipping-settings.query";

const INITIAL_STATE: ShippingSettingsFormState = { status: "idle" };

type Props = { settings: AdminShippingSettings };

export function ShippingSettingsForm({ settings }: Props) {
  const [state, action, isPending] = useActionState(
    updateAdminShippingSettingsAction,
    INITIAL_STATE
  );
  const [standardAmount, setStandardAmount] = useState(
    String(settings.standardShippingAmount)
  );
  const [freeThreshold, setFreeThreshold] = useState(
    settings.freeShippingThreshold !== null ? String(settings.freeShippingThreshold) : ""
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && !state.fieldErrors) {
      toast.error(state.message);
    }
  }, [state]);

  const fieldError = (key: string) =>
    state.status === "error"
      ? state.fieldErrors?.[key as keyof typeof state.fieldErrors]
      : undefined;

  return (
    <form action={action} className="relative">
      <input type="hidden" name="currencyCode" value={settings.currencyCode} />

      {/* Feedback global (champs invalides) */}
      {state.status === "error" && state.fieldErrors && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-feedback-error-border bg-feedback-error-surface/40 px-4 py-3">
          <XCircle className="size-4 shrink-0 text-feedback-error-foreground" />
          <p className="text-sm text-feedback-error-foreground">{state.message}</p>
        </div>
      )}
      {state.status === "success" && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-feedback-success-border bg-feedback-success-surface/40 px-4 py-3">
          <CheckCircle2 className="size-4 shrink-0 text-feedback-success-foreground" />
          <p className="text-sm text-feedback-success-foreground">{state.message}</p>
        </div>
      )}

      <div className="divide-y divide-surface-border/40">
        {/* ── Section : Tarifs de livraison ──────────────────────────────── */}
        <AdminFormSection
          eyebrow="Livraison"
          title="Tarifs"
          description="Configurez les frais de livraison standard et le seuil de livraison offerte."
          className="py-6 first:pt-0"
        >
          <AdminFormField
            label={`Frais de livraison standard (${settings.currencyCode})`}
            htmlFor="standardShippingAmount"
            description="Montant appliqué à toutes les commandes sans livraison offerte."
            error={fieldError("standardShippingAmount")}
          >
            <Input
              id="standardShippingAmount"
              name="standardShippingAmount"
              type="text"
              inputMode="decimal"
              value={standardAmount}
              onChange={(e) => setStandardAmount(e.target.value)}
              placeholder="0"
              className={cn(fieldError("standardShippingAmount") && "border-feedback-error")}
            />
          </AdminFormField>

          <AdminFormField
            label={`Livraison offerte à partir de (${settings.currencyCode})`}
            htmlFor="freeShippingThreshold"
            description="Laissez vide pour désactiver la livraison offerte."
            error={fieldError("freeShippingThreshold")}
          >
            <Input
              id="freeShippingThreshold"
              name="freeShippingThreshold"
              type="text"
              inputMode="decimal"
              value={freeThreshold}
              onChange={(e) => setFreeThreshold(e.target.value)}
              placeholder="Désactivée"
              className={cn(fieldError("freeShippingThreshold") && "border-feedback-error")}
            />
          </AdminFormField>
        </AdminFormSection>
      </div>

      {/* Note d'information */}
      <p className="mt-4 text-[11px] text-muted-foreground/70">
        Ces réglages préparent les méthodes de livraison. Le checkout public sera branché dans un lot séparé.
      </p>

      {/* ── Sticky footer ──────────────────────────────────────────────── */}
      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-surface-border/40 bg-page-background/90 px-0 py-4 backdrop-blur-sm">
        <Button
          type="submit"
          disabled={isPending}
          className="min-w-32 rounded-full"
        >
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
