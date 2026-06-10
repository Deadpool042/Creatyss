"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/shared";
import { cn } from "@/lib/utils";
import { updateAdminPaymentSettingsAction } from "@/features/admin/settings/actions/update-admin-payment-settings.action";
import { type PaymentSettingsFormState } from "@/features/admin/settings/schemas/payment-settings.schema";
import type { AdminPaymentSettings } from "@/features/admin/settings/queries/get-admin-payment-settings.query";

const INITIAL_STATE: PaymentSettingsFormState = { status: "idle" };

type Props = { settings: AdminPaymentSettings };

export function PaymentSettingsForm({ settings }: Props) {
  const [state, action, isPending] = useActionState(
    updateAdminPaymentSettingsAction,
    INITIAL_STATE
  );
  const [bankTransferEnabled, setBankTransferEnabled] = useState(settings.bankTransferEnabled);
  const [cashOnDeliveryEnabled, setCashOnDeliveryEnabled] = useState(
    settings.cashOnDeliveryEnabled
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
      {/* Valeur vide quand désactivé : z.coerce.boolean transformerait "false" en true */}
      <input type="hidden" name="bankTransferEnabled" value={bankTransferEnabled ? "true" : ""} />
      <input
        type="hidden"
        name="cashOnDeliveryEnabled"
        value={cashOnDeliveryEnabled ? "true" : ""}
      />

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
        {/* ── Section : Virement bancaire ───────────────────────────────── */}
        <AdminFormSection
          eyebrow="Paiement"
          title="Virement bancaire"
          description="Vos clientes règlent leur commande par virement, avec vos coordonnées bancaires."
          className="py-6 first:pt-0"
        >
          <div className="flex items-center justify-between gap-4 rounded-xl border border-surface-border/60 bg-surface-panel-soft/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Accepter le virement bancaire</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                La commande est confirmée à réception du virement.
              </p>
            </div>
            <Switch
              checked={bankTransferEnabled}
              onCheckedChange={setBankTransferEnabled}
              aria-label="Accepter le virement bancaire"
            />
          </div>

          <AdminFormField
            label="Instructions de virement"
            htmlFor="bankTransferInstructions"
            description="IBAN, BIC, référence à indiquer… Ces instructions seront affichées à la cliente sur la page de confirmation et dans son email de commande."
            error={fieldError("bankTransferInstructions")}
          >
            <Textarea
              id="bankTransferInstructions"
              name="bankTransferInstructions"
              rows={4}
              defaultValue={settings.bankTransferInstructions ?? ""}
              placeholder={"IBAN : FR76 …\nBIC : …\nMerci d'indiquer votre numéro de commande en référence."}
              disabled={!bankTransferEnabled}
              className={cn(fieldError("bankTransferInstructions") && "border-feedback-error")}
            />
          </AdminFormField>
        </AdminFormSection>

        {/* ── Section : Paiement à l'atelier ────────────────────────────── */}
        <AdminFormSection
          eyebrow="Paiement"
          title="Paiement à l'atelier"
          description="Vos clientes règlent leur commande en venant la récupérer à l'atelier."
          className="py-6"
        >
          <div className="flex items-center justify-between gap-4 rounded-xl border border-surface-border/60 bg-surface-panel-soft/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Accepter le paiement à l&apos;atelier
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Règlement en personne, au moment du retrait de la commande.
              </p>
            </div>
            <Switch
              checked={cashOnDeliveryEnabled}
              onCheckedChange={setCashOnDeliveryEnabled}
              aria-label="Accepter le paiement à l'atelier"
            />
          </div>

          <AdminFormField
            label="Instructions de retrait"
            htmlFor="cashOnDeliveryInstructions"
            description="Adresse, horaires, moyens de paiement acceptés sur place… Ces instructions seront affichées à la cliente sur la page de confirmation et dans son email de commande."
            error={fieldError("cashOnDeliveryInstructions")}
          >
            <Textarea
              id="cashOnDeliveryInstructions"
              name="cashOnDeliveryInstructions"
              rows={4}
              defaultValue={settings.cashOnDeliveryInstructions ?? ""}
              placeholder={"Atelier ouvert du mardi au samedi, 10h–18h.\nPaiement en espèces ou par carte sur place."}
              disabled={!cashOnDeliveryEnabled}
              className={cn(fieldError("cashOnDeliveryInstructions") && "border-feedback-error")}
            />
          </AdminFormField>
        </AdminFormSection>
      </div>

      {/* Note d'information */}
      <p className="mt-4 text-[11px] text-muted-foreground/70">
        Ces réglages préparent les moyens de paiement. Leur affichage dans le checkout public sera
        branché dans un lot séparé.
      </p>

      {/* ── Sticky footer ──────────────────────────────────────────────── */}
      <div className="sticky bottom-0 z-10 flex items-center justify-end gap-3 border-t border-surface-border/40 bg-page-background/90 px-0 py-4 backdrop-blur-sm">
        <Button type="submit" disabled={isPending} className="min-w-32 rounded-full">
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
