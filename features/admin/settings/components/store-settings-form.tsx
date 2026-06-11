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

        {/* ── Section 2 : Informations légales ─────────────────────── */}
        <AdminFormSection
          eyebrow="Légal"
          title="Informations légales"
          description="Utilisées sur les pages légales publiques (CGV, mentions légales)."
          className="py-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField
              label="SIRET"
              htmlFor="siret"
              description="Numéro d'identification de l'établissement (14 chiffres)."
              error={fieldError("siret")}
            >
              <Input
                id="siret"
                name="siret"
                defaultValue={store.siret ?? ""}
                maxLength={20}
                placeholder="123 456 789 00012"
                className={cn(fieldError("siret") && "border-feedback-error")}
              />
            </AdminFormField>

            <AdminFormField
              label="TVA intracommunautaire"
              htmlFor="vatNumber"
              description="Numéro de TVA européen (ex. FR12345678901)."
              error={fieldError("vatNumber")}
            >
              <Input
                id="vatNumber"
                name="vatNumber"
                defaultValue={store.vatNumber ?? ""}
                maxLength={20}
                placeholder="FR12345678901"
                className={cn(fieldError("vatNumber") && "border-feedback-error")}
              />
            </AdminFormField>
          </div>
        </AdminFormSection>

        {/* ── Section 3 : Support ───────────────────────────────────── */}
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
            label="Livraison & retours (fiches produit)"
            htmlFor="shippingReturnsPolicy"
            description="Texte court affiché sur les fiches produit dans le bloc Livraison & retours. La politique de retour complète se gère dans Contenu > Pages."
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

        {/* ── Section 4 : Adresse atelier ──────────────────────────── */}
        <AdminFormSection
          eyebrow="Localisation"
          title="Adresse atelier"
          description="Adresse utilisée sur la page contact, le footer et les emails."
          className="py-6"
        >
          <AdminFormField
            label="Adresse"
            htmlFor="addressLine1"
            error={fieldError("addressLine1")}
          >
            <Input
              id="addressLine1"
              name="addressLine1"
              defaultValue={store.addressLine1 ?? ""}
              maxLength={150}
              placeholder="12 rue de la Paix"
              className={cn(fieldError("addressLine1") && "border-feedback-error")}
            />
          </AdminFormField>

          <div className="grid gap-4 sm:grid-cols-3">
            <AdminFormField
              label="Code postal"
              htmlFor="addressPostalCode"
              error={fieldError("addressPostalCode")}
            >
              <Input
                id="addressPostalCode"
                name="addressPostalCode"
                defaultValue={store.addressPostalCode ?? ""}
                maxLength={20}
                placeholder="75001"
                className={cn(fieldError("addressPostalCode") && "border-feedback-error")}
              />
            </AdminFormField>

            <AdminFormField
              label="Ville"
              htmlFor="addressCity"
              error={fieldError("addressCity")}
            >
              <Input
                id="addressCity"
                name="addressCity"
                defaultValue={store.addressCity ?? ""}
                maxLength={100}
                placeholder="Paris"
                className={cn(fieldError("addressCity") && "border-feedback-error")}
              />
            </AdminFormField>

            <AdminFormField
              label="Pays"
              htmlFor="addressCountry"
              error={fieldError("addressCountry")}
            >
              <Input
                id="addressCountry"
                name="addressCountry"
                defaultValue={store.addressCountry ?? ""}
                maxLength={80}
                placeholder="France"
                className={cn(fieldError("addressCountry") && "border-feedback-error")}
              />
            </AdminFormField>
          </div>
        </AdminFormSection>

        {/* ── Section 5 : Réseaux sociaux ──────────────────────────── */}
        <AdminFormSection
          eyebrow="Présence en ligne"
          title="Réseaux sociaux"
          description="URL complète du profil (ex : https://www.instagram.com/creatyss)."
          className="py-6"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <AdminFormField
              label="Instagram"
              htmlFor="instagramUrl"
              error={fieldError("instagramUrl")}
            >
              <Input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                defaultValue={store.instagramUrl ?? ""}
                maxLength={200}
                placeholder="https://www.instagram.com/..."
                className={cn(fieldError("instagramUrl") && "border-feedback-error")}
              />
            </AdminFormField>

            <AdminFormField
              label="Facebook"
              htmlFor="facebookUrl"
              error={fieldError("facebookUrl")}
            >
              <Input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                defaultValue={store.facebookUrl ?? ""}
                maxLength={200}
                placeholder="https://www.facebook.com/..."
                className={cn(fieldError("facebookUrl") && "border-feedback-error")}
              />
            </AdminFormField>
          </div>
        </AdminFormSection>

        {/* ── Section 6 : Métadonnées en lecture seule ─────────────── */}
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
