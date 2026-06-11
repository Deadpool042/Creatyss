"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/shared";
import { cn } from "@/lib/utils";
import { updateAdminLegalSettingsAction } from "@/features/admin/settings/actions/update-admin-legal-settings.action";
import {
  LEGAL_BODY_MAX_LENGTH,
  type LegalSettingsFormState,
  type LegalSettingsInput,
} from "@/features/admin/settings/schemas/legal-settings.schema";
import type { AdminLegalSettings } from "@/features/admin/settings/queries/get-admin-legal-settings.query";

const INITIAL_STATE: LegalSettingsFormState = { status: "idle" };

type LegalTextSection = {
  field: keyof LegalSettingsInput;
  eyebrow: string;
  title: string;
  label: string;
  description: string;
};

const SECTIONS: ReadonlyArray<LegalTextSection> = [
  {
    field: "legalNotice",
    eyebrow: "Légal",
    title: "Mentions légales",
    label: "Texte des mentions légales",
    description:
      "Identité de l'éditeur, hébergeur, contact. Obligatoire pour tout site marchand.",
  },
  {
    field: "termsOfSale",
    eyebrow: "Légal",
    title: "Conditions générales de vente",
    label: "Texte des CGV",
    description:
      "Conditions applicables aux commandes : prix, paiement, livraison, rétractation.",
  },
  {
    field: "privacyPolicy",
    eyebrow: "Légal",
    title: "Politique de confidentialité",
    label: "Texte de la politique de confidentialité",
    description:
      "Traitement des données personnelles, cookies et droits des utilisateurs (RGPD).",
  },
  {
    field: "returnsPolicy",
    eyebrow: "Légal",
    title: "Politique de retour",
    label: "Texte de la politique de retour",
    description:
      "Conditions de retour et de remboursement des produits.",
  },
];

type Props = { legal: AdminLegalSettings | null };

export function LegalSettingsForm({ legal }: Props) {
  const [state, action, isPending] = useActionState(
    updateAdminLegalSettingsAction,
    INITIAL_STATE
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && !state.fieldErrors) {
      toast.error(state.message);
    }
  }, [state]);

  const fieldError = (key: keyof LegalSettingsInput) =>
    state.status === "error" ? state.fieldErrors?.[key] : undefined;

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
        {SECTIONS.map((section, index) => (
          <AdminFormSection
            key={section.field}
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
            className={cn("py-6", index === 0 && "first:pt-0")}
          >
            <AdminFormField
              label={section.label}
              htmlFor={section.field}
              description="Texte brut, sans mise en forme. Laisser vide si non applicable."
              error={fieldError(section.field)}
            >
              <Textarea
                id={section.field}
                name={section.field}
                defaultValue={legal?.[section.field] ?? ""}
                maxLength={LEGAL_BODY_MAX_LENGTH}
                rows={12}
                className={cn(
                  "min-h-48 font-normal leading-6",
                  fieldError(section.field) && "border-feedback-error"
                )}
              />
            </AdminFormField>
          </AdminFormSection>
        ))}
      </div>

      {/* ── Sticky footer ────────────────────────────────────────────── */}
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
