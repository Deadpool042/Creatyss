"use client";

import { useActionState, useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/shared";
import { cn } from "@/lib/utils";
import { updateAdminStoreSettingsAction } from "@/features/admin/settings/actions/update-admin-store-settings.action";
import {
  CURRENCY_CODES,
  TIMEZONES,
  type StoreSettingsFormState,
} from "@/features/admin/settings/schemas/store-settings.schema";
import type { AdminStoreSettings } from "@/features/admin/settings/queries/get-admin-store-settings.query";

const CURRENCY_LABELS: Record<string, string> = {
  EUR: "Euro (€)",
  USD: "Dollar US ($)",
  GBP: "Livre sterling (£)",
  CHF: "Franc suisse (CHF)",
  CAD: "Dollar canadien (CA$)",
};

const LOCALE_OPTIONS = [
  { value: "fr-FR", label: "Français (France)" },
  { value: "fr-BE", label: "Français (Belgique)" },
  { value: "fr-CH", label: "Français (Suisse)" },
  { value: "en-GB", label: "English (UK)" },
  { value: "en-US", label: "English (US)" },
  { value: "de-DE", label: "Deutsch" },
  { value: "es-ES", label: "Español" },
];

const INITIAL_STATE: StoreSettingsFormState = { status: "idle" };

type Props = { store: AdminStoreSettings };

export function StoreSettingsForm({ store }: Props) {
  const [state, action, isPending] = useActionState(updateAdminStoreSettingsAction, INITIAL_STATE);

  useEffect(() => {
    if (state.status === "success") {
      toast.success(state.message);
    } else if (state.status === "error" && !state.fieldErrors) {
      toast.error(state.message);
    }
  }, [state]);

  const fieldError = (key: string) =>
    state.status === "error" ? state.fieldErrors?.[key as keyof typeof state.fieldErrors] : undefined;

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
        {/* ── Section 1 : Identité ───────────────────────────────────── */}
        <AdminFormSection
          eyebrow="Boutique"
          title="Identité"
          description="Nom commercial et raison sociale affichés sur les documents et emails."
          className="py-6 first:pt-0"
        >
          <AdminFormField
            label="Nom de la boutique"
            htmlFor="name"
            required
            error={fieldError("name")}
          >
            <Input
              id="name"
              name="name"
              defaultValue={store.name}
              required
              maxLength={100}
              className={cn(fieldError("name") && "border-feedback-error")}
            />
          </AdminFormField>

          <AdminFormField
            label="Raison sociale"
            htmlFor="legalName"
            description="Nom légal complet de l'entreprise (pour les CGV, factures)."
            error={fieldError("legalName")}
          >
            <Input
              id="legalName"
              name="legalName"
              defaultValue={store.legalName ?? ""}
              maxLength={150}
            />
          </AdminFormField>
        </AdminFormSection>

        {/* ── Section 2 : Support ───────────────────────────────────── */}
        <AdminFormSection
          eyebrow="Contact"
          title="Support client"
          description="Coordonnées affichées dans les emails transactionnels et sur la boutique."
          className="py-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField
              label="Email de support"
              htmlFor="supportEmail"
              error={fieldError("supportEmail")}
            >
              <Input
                id="supportEmail"
                name="supportEmail"
                type="email"
                defaultValue={store.supportEmail ?? ""}
                maxLength={200}
                placeholder="contact@boutique.fr"
              />
            </AdminFormField>

            <AdminFormField
              label="Téléphone"
              htmlFor="supportPhone"
              error={fieldError("supportPhone")}
            >
              <Input
                id="supportPhone"
                name="supportPhone"
                type="tel"
                defaultValue={store.supportPhone ?? ""}
                maxLength={30}
                placeholder="+33 1 23 45 67 89"
              />
            </AdminFormField>
          </div>

          <AdminFormField
            label="Politique de livraison et retours"
            htmlFor="shippingReturnsPolicy"
            description="Résumé court affiché sur la boutique (délais, conditions, procédure de retour)."
            error={fieldError("shippingReturnsPolicy")}
          >
            <Textarea
              id="shippingReturnsPolicy"
              name="shippingReturnsPolicy"
              defaultValue={store.shippingReturnsPolicy ?? ""}
              maxLength={2000}
              rows={4}
              placeholder="Livraison sous 3-5 jours ouvrés. Retours acceptés sous 14 jours..."
            />
          </AdminFormField>
        </AdminFormSection>

        {/* ── Section 3 : Localisation ─────────────────────────────── */}
        <AdminFormSection
          eyebrow="Paramètres régionaux"
          title="Devise, langue & fuseau"
          description="Paramètres par défaut utilisés dans toute la boutique et les calculs de prix."
          className="py-6"
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <AdminFormField
              label="Devise"
              htmlFor="defaultCurrency"
              error={fieldError("defaultCurrency")}
            >
              <Select name="defaultCurrency" defaultValue={store.defaultCurrency}>
                <SelectTrigger id="defaultCurrency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCY_CODES.map((code) => (
                    <SelectItem key={code} value={code}>
                      {CURRENCY_LABELS[code] ?? code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AdminFormField>

            <AdminFormField
              label="Langue par défaut"
              htmlFor="defaultLocaleCode"
              error={fieldError("defaultLocaleCode")}
            >
              <Select name="defaultLocaleCode" defaultValue={store.defaultLocaleCode}>
                <SelectTrigger id="defaultLocaleCode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LOCALE_OPTIONS.map((l) => (
                    <SelectItem key={l.value} value={l.value}>
                      {l.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AdminFormField>

            <AdminFormField
              label="Fuseau horaire"
              htmlFor="timezone"
              error={fieldError("timezone")}
            >
              <Select name="timezone" defaultValue={store.timezone}>
                <SelectTrigger id="timezone">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {tz.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </AdminFormField>
          </div>
        </AdminFormSection>

        {/* ── Section 4 : Métadonnées en lecture seule ─────────────── */}
        <div className="py-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Code interne", value: store.code },
              { label: "Slug public", value: store.slug },
              { label: "Statut", value: store.status },
              {
                label: "Mise à jour",
                value: new Intl.DateTimeFormat("fr-FR", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(store.updatedAt)),
              },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-surface-subtle/60 px-4 py-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {item.label}
                </p>
                <p className="mt-1 font-mono text-[13px] text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
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
