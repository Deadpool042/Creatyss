"use client";

import { useActionState, useEffect, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/shared";
import { cn } from "@/lib/utils";
import { updateAdminOrderSettingsAction } from "@/features/admin/settings/actions/update-admin-order-settings.action";
import { type OrderSettingsFormState } from "@/features/admin/settings/schemas/order-settings.schema";
import type { AdminOrderSettings } from "@/features/admin/settings/queries/get-admin-order-settings.query";

const INITIAL_STATE: OrderSettingsFormState = { status: "idle" };

const DEFAULT_PREFIX = "CRY";

type Props = { settings: AdminOrderSettings };

export function OrderSettingsForm({ settings }: Props) {
  const [state, action, isPending] = useActionState(updateAdminOrderSettingsAction, INITIAL_STATE);
  const [prefix, setPrefix] = useState(settings.orderNumberPrefix ?? DEFAULT_PREFIX);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && !state.fieldErrors) {
      toast.error(state.message);
    }
  }, [state]);

  const fieldError = (key: string) =>
    state.status === "error" ? state.fieldErrors?.[key as keyof typeof state.fieldErrors] : undefined;

  const previewPrefix = prefix.trim() || DEFAULT_PREFIX;

  return (
    <form action={action} className="relative">
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
        {/* ── Section : Numérotation ──────────────────────────────────── */}
        <AdminFormSection
          eyebrow="Commandes"
          title="Numérotation"
          description="Paramètres appliqués aux nouvelles commandes uniquement. Les commandes existantes ne sont pas modifiées."
          className="py-6 first:pt-0"
        >
          <AdminFormField
            label="Préfixe des numéros de commande"
            htmlFor="orderNumberPrefix"
            description="Utilisé pour les nouvelles commandes uniquement. Les commandes existantes ne sont pas affectées."
            error={fieldError("orderNumberPrefix")}
          >
            <Input
              id="orderNumberPrefix"
              name="orderNumberPrefix"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              maxLength={10}
              placeholder={DEFAULT_PREFIX}
              className={cn(fieldError("orderNumberPrefix") && "border-feedback-error")}
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground/70">
              Lettres majuscules et chiffres uniquement, 10 caractères maximum.
            </p>
          </AdminFormField>

          {/* Aperçu de la référence générée */}
          <div className="rounded-xl border border-surface-border/60 bg-surface-subtle/60 px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Exemple de référence
            </p>
            <p className="mt-1 font-mono text-[13px] text-foreground">
              {previewPrefix}-XXXXXXXXXX
            </p>
          </div>
        </AdminFormSection>
      </div>

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
