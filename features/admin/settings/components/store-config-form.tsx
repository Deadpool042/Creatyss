"use client";

import { useActionState, useEffect } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Globe,
  Shield,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { AdminFormSection } from "@/components/admin/forms/admin-form-section";
import { AdminFormField } from "@/components/admin/forms/admin-form-field";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/shared";
import { cn } from "@/lib/utils";
import { updateAdminStoreConfigAction, type StoreConfigFormState } from "@/features/admin/settings/actions/update-admin-store-config.action";
import type { AdminStoreConfig } from "@/features/admin/settings/queries/get-admin-store-config.query";

const INITIAL: StoreConfigFormState = { status: "idle" };

const STATUS_OPTIONS = [
  {
    value: "DRAFT",
    label: "Brouillon",
    hint: "Boutique non visible. Développement et configuration en cours.",
    danger: false,
  },
  {
    value: "ACTIVE",
    label: "Active",
    hint: "Boutique opérationnelle. Commandes et clients actifs.",
    danger: false,
  },
  {
    value: "SUSPENDED",
    label: "Suspendue",
    hint: "Accès public coupé. Données conservées.",
    danger: true,
  },
  {
    value: "ARCHIVED",
    label: "Archivée",
    hint: "Désactivée définitivement. Opération irréversible.",
    danger: true,
  },
] as const;

const DOMAIN_TYPE_LABELS: Record<string, string> = {
  PRIMARY: "Principal",
  SECONDARY: "Secondaire",
  PREVIEW: "Prévisualisation",
  INTERNAL: "Interne",
};

const dateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

type Props = { store: AdminStoreConfig };

export function StoreConfigForm({ store }: Props) {
  const [state, action, isPending] = useActionState(updateAdminStoreConfigAction, INITIAL);

  useEffect(() => {
    if (state.status === "success") toast.success(state.message);
    else if (state.status === "error") toast.error(state.message);
  }, [state]);

  const currentStatus = STATUS_OPTIONS.find((s) => s.value === store.status);
  const isDangerous = store.status === "ACTIVE";

  return (
    <form action={action} className="relative">
      {state.status === "success" && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-feedback-success-border bg-feedback-success-surface/40 px-4 py-3">
          <CheckCircle2 className="size-4 shrink-0 text-feedback-success-foreground" />
          <p className="text-sm text-feedback-success-foreground">{state.message}</p>
        </div>
      )}
      {state.status === "error" && (
        <div className="mb-6 flex items-center gap-2.5 rounded-xl border border-feedback-error-border bg-feedback-error-surface/40 px-4 py-3">
          <XCircle className="size-4 shrink-0 text-feedback-error-foreground" />
          <p className="text-sm text-feedback-error-foreground">{state.message}</p>
        </div>
      )}

      <div className="divide-y divide-surface-border/40">
        {/* ── Statut opérationnel ──────────────────────────────────── */}
        <AdminFormSection
          eyebrow="Cycle de vie"
          title="Statut de la boutique"
          description="Contrôle la visibilité et l'accessibilité publique de la boutique."
          className="py-6 first:pt-0"
        >
          {/* Statut actuel */}
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3",
              store.status === "ACTIVE"
                ? "border-feedback-success-border bg-feedback-success-surface/30"
                : store.status === "DRAFT"
                  ? "border-surface-border/60 bg-surface-subtle/40"
                  : "border-feedback-warning-border bg-feedback-warning-surface/30"
            )}
          >
            {store.status === "ACTIVE" ? (
              <ShieldCheck className="size-5 shrink-0 text-feedback-success-foreground" />
            ) : store.status === "DRAFT" ? (
              <Shield className="size-5 shrink-0 text-muted-foreground/50" />
            ) : (
              <AlertTriangle className="size-5 shrink-0 text-feedback-warning-foreground" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-medium text-foreground">
                {currentStatus?.label ?? store.status}
              </p>
              <p className="text-xs text-muted-foreground">{currentStatus?.hint}</p>
            </div>
          </div>

          <AdminFormField label="Changer le statut" htmlFor="status">
            <Select name="status" defaultValue={store.status}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    <span className={opt.danger ? "text-feedback-error-foreground" : undefined}>
                      {opt.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AdminFormField>

          {store.activatedAt ? (
            <p className="text-xs text-muted-foreground">
              Activée le {dateFormatter.format(new Date(store.activatedAt))}.
            </p>
          ) : null}

          {isDangerous ? (
            <div className="flex items-start gap-2.5 rounded-xl border border-feedback-warning-border bg-feedback-warning-surface/30 px-3 py-2.5">
              <AlertTriangle className="mt-0.5 size-4 shrink-0 text-feedback-warning-foreground" />
              <p className="text-xs text-feedback-warning-foreground">
                Suspendre ou archiver coupe l'accès public immédiatement.
                Archivée est irréversible.
              </p>
            </div>
          ) : null}
        </AdminFormSection>

        {/* ── Mode production ──────────────────────────────────────── */}
        <AdminFormSection
          eyebrow="Environnement"
          title="Mode production"
          description="Active les comportements de production : emails réels, paiements live, aucun seed data."
          className="py-6"
        >
          <div className="flex items-center justify-between gap-4 rounded-xl border border-surface-border/60 bg-surface-panel/60 px-4 py-3">
            <div className="min-w-0">
              <p className="text-[13px] font-medium text-foreground">
                {store.isProduction ? "Production activée" : "Mode développement"}
              </p>
              <p className="text-xs text-muted-foreground">
                {store.isProduction
                  ? "Emails transactionnels envoyés, paiements réels."
                  : "Emails simulés, paiements en mode test."}
              </p>
            </div>
            <Select name="isProduction" defaultValue={store.isProduction ? "true" : "false"}>
              <SelectTrigger className="w-36 shrink-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="false">Développement</SelectItem>
                <SelectItem value="true">Production</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </AdminFormSection>

        {/* ── Domaines ─────────────────────────────────────────────── */}
        <AdminFormSection
          eyebrow="Accès public"
          title="Domaines"
          description="Adresses par lesquelles la boutique est accessible. Gestion complète à venir."
          className="py-6"
        >
          {store.domains.length === 0 ? (
            <div className="rounded-xl border border-dashed border-surface-border/60 px-4 py-6 text-center">
              <Globe className="mx-auto mb-2 size-6 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Aucun domaine configuré.</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-border/30 rounded-xl border border-surface-border/60 bg-surface-panel/50">
              {store.domains.map((domain) => (
                <div
                  key={domain.id}
                  className="flex items-center justify-between gap-3 px-4 py-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Globe className="size-4 shrink-0 text-muted-foreground/50" />
                    <span className="truncate font-mono text-[13px] text-foreground">
                      {domain.host}
                    </span>
                    {domain.isCanonical ? (
                      <span className="shrink-0 rounded-md bg-feedback-success-surface/60 px-1.5 py-0.5 text-[10px] font-medium text-feedback-success-foreground">
                        Canonique
                      </span>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-[11px] text-muted-foreground/60">
                      {DOMAIN_TYPE_LABELS[domain.type] ?? domain.type}
                    </span>
                    <span
                      className={cn(
                        "inline-flex h-5 items-center rounded-md px-1.5 text-[10px] font-medium",
                        domain.isEnabled
                          ? "bg-feedback-success-surface/60 text-feedback-success-foreground"
                          : "bg-surface-subtle text-muted-foreground"
                      )}
                    >
                      {domain.isEnabled ? "Actif" : "Désactivé"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground/60">
            Ajout et suppression de domaines disponible prochainement.
          </p>
        </AdminFormSection>

        {/* ── Métadonnées read-only ─────────────────────────────────── */}
        <div className="py-6">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Code interne", value: store.code },
              { label: "Slug public", value: `/${store.slug}` },
              { label: "Créée le", value: dateFormatter.format(new Date(store.createdAt)) },
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

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-10 flex items-center justify-end border-t border-surface-border/40 bg-page-background/90 py-4 backdrop-blur-sm">
        <Button type="submit" disabled={isPending} className="min-w-32 rounded-full">
          {isPending ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>
    </form>
  );
}
