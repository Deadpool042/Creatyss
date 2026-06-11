"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/shared";
import { cn } from "@/lib/utils";
import { updateAdminNotificationSettingsAction } from "@/features/admin/settings/actions/update-admin-notification-settings.action";
import { type NotificationSettingsFormState } from "@/features/admin/settings/schemas/notification-settings.schema";
import type { AdminNotificationSettings } from "@/features/admin/settings/queries/get-admin-notification-settings.query";

const INITIAL_STATE: NotificationSettingsFormState = { status: "idle" };

type Props = { settings: AdminNotificationSettings };

export function NotificationSettingsForm({ settings }: Props) {
  const [state, action, isPending] = useActionState(
    updateAdminNotificationSettingsAction,
    INITIAL_STATE
  );
  const [emailConfirmationEnabled, setEmailConfirmationEnabled] = useState(
    settings.emailConfirmationEnabled
  );
  const [emailShippingEnabled, setEmailShippingEnabled] = useState(
    settings.emailShippingEnabled
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
      {/* Valeur vide quand désactivé : z.coerce.boolean convertit "" en false */}
      <input
        type="hidden"
        name="emailConfirmationEnabled"
        value={emailConfirmationEnabled ? "true" : ""}
      />
      <input
        type="hidden"
        name="emailShippingEnabled"
        value={emailShippingEnabled ? "true" : ""}
      />

      {/* Feedback global */}
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
        {/* ── Section : Emails transactionnels ──────────────────────────── */}
        <AdminFormSection
          eyebrow="Emails"
          title="Emails transactionnels"
          description="Contrôlez les emails automatiquement envoyés à vos clientes après une action sur leur commande."
          className="py-6 first:pt-0"
        >
          <div className="flex items-center justify-between gap-4 rounded-xl border border-surface-border/60 bg-surface-panel-soft/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Email de confirmation de commande
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Si désactivé, aucun email de confirmation ne sera envoyé à la cliente après sa commande.
              </p>
            </div>
            <Switch
              checked={emailConfirmationEnabled}
              onCheckedChange={setEmailConfirmationEnabled}
              aria-label="Email de confirmation de commande"
            />
          </div>

          <div className="flex items-center justify-between gap-4 rounded-xl border border-surface-border/60 bg-surface-panel-soft/40 px-4 py-3">
            <div>
              <p className="text-sm font-medium text-foreground">
                Email d&apos;expédition
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Si désactivé, aucun email d&apos;expédition ne sera envoyé à la cliente lors de l&apos;envoi de sa commande.
              </p>
            </div>
            <Switch
              checked={emailShippingEnabled}
              onCheckedChange={setEmailShippingEnabled}
              aria-label="Email d'expédition"
            />
          </div>
        </AdminFormSection>

        {/* ── Section : Adresse de réponse ──────────────────────────────── */}
        <AdminFormSection
          eyebrow="Emails"
          title="Adresse de réponse"
          description="L'adresse visible par vos clientes lorsqu'elles répondent à un email de la boutique."
          className="py-6"
        >
          <AdminFormField
            label="Reply-to"
            htmlFor="replyToEmail"
            description="Si renseignée, les réponses de vos clientes arriveront sur cette adresse plutôt que sur l'expéditeur technique."
            error={fieldError("replyToEmail")}
          >
            <Input
              id="replyToEmail"
              name="replyToEmail"
              type="email"
              defaultValue={settings.replyToEmail ?? ""}
              placeholder="contact@votre-boutique.fr"
              className={cn(fieldError("replyToEmail") && "border-feedback-error")}
            />
          </AdminFormField>
        </AdminFormSection>
      </div>

      <p className="mt-4 text-[11px] text-muted-foreground/70">
        Ces réglages pilotent les emails transactionnels. Les envois en cours ne seront pas affectés rétroactivement.
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
