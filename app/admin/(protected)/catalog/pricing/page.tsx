import { CheckCircle2, Clock, Euro, Star, Tag } from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { AdminEmptyState } from "@/components/admin/shared/admin-empty-state";
import { cn } from "@/lib/utils";
import { CatalogRouteNav } from "@/features/admin/catalog/components/catalog-route-nav";
import {
  listAdminPriceLists,
  type AdminPriceListSummary,
} from "@/features/admin/catalog/queries/list-admin-price-lists.query";
import { PriceListCreateDialog } from "@/features/admin/catalog/components/price-list-create-dialog";
import { PriceListRowActions } from "@/features/admin/catalog/components/price-list-row-actions";
import { ADMIN_CATALOG_PRICING_PATH } from "@/features/admin/catalog/shared/admin-catalog-routes";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

const STATUS_CONFIG: Record<AdminPriceListSummary["status"], { label: string; badge: string }> = {
  DRAFT: { label: "Brouillon", badge: "bg-surface-subtle text-muted-foreground" },
  ACTIVE: {
    label: "Actif",
    badge: "bg-feedback-success-surface/75 text-feedback-success-foreground",
  },
  INACTIVE: { label: "Inactif", badge: "bg-surface-subtle text-muted-foreground/70" },
  ARCHIVED: { label: "Archivé", badge: "bg-surface-subtle text-muted-foreground/50" },
};

function getPricingErrorMessage(code: string): string {
  switch (code) {
    case "duplicate_code":
      return "Une liste avec ce code existe déjà.";
    case "invalid_input":
      return "Formulaire invalide — vérifiez les champs.";
    case "missing_store":
      return "Aucune boutique trouvée.";
    case "not_found":
      return "Liste de prix introuvable.";
    case "not_active":
      return "Seule une liste active peut être définie par défaut.";
    case "invalid_transition":
      return "Cette transition de statut n'est pas autorisée.";
    case "pricing_level_insufficient":
      return "Le niveau tarifaire actuel n'autorise pas cette action.";
    default:
      return "L'opération a échoué.";
  }
}

type AdminCatalogPricingPageProps = Readonly<{
  searchParams: Promise<{ pl_created?: string; pl_updated?: string; pl_error?: string }>;
}>;

export default async function AdminCatalogPricingPage({
  searchParams,
}: AdminCatalogPricingPageProps) {
  const [resolvedSearchParams, priceLists, canManagePriceLists] = await Promise.all([
    searchParams,
    listAdminPriceLists().catch((): AdminPriceListSummary[] => []),
    meetsFeatureLevel("catalog.products.pricing", "price-lists"),
  ]);

  const activeLists = priceLists.filter((p) => p.status === "ACTIVE").length;
  const totalEntries = priceLists.reduce(
    (sum, p) => sum + p.productPricesCount + p.variantPricesCount,
    0
  );
  const defaultList = priceLists.find((p) => p.isDefault);

  return (
    <AdminPageShell
      scrollBehavior="page"
      title="Listes de prix"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Catalogue", href: "/admin/catalog/overview" },
        { label: "Tarification" },
      ]}
      contentPreset="table"
      topbarAction={canManagePriceLists ? <PriceListCreateDialog /> : undefined}
    >
      <CatalogRouteNav />

      {/* Feedback */}
      {resolvedSearchParams.pl_created ? (
        <div className="rounded-xl border border-feedback-success-border bg-feedback-success-surface/60 px-4 py-2.5 text-sm text-feedback-success-foreground">
          Liste de prix créée avec succès.
        </div>
      ) : null}
      {resolvedSearchParams.pl_updated ? (
        <div className="rounded-xl border border-feedback-success-border bg-feedback-success-surface/60 px-4 py-2.5 text-sm text-feedback-success-foreground">
          Liste de prix mise à jour.
        </div>
      ) : null}
      {resolvedSearchParams.pl_error ? (
        <div className="rounded-xl border border-feedback-error-border bg-feedback-error-surface/60 px-4 py-2.5 text-sm text-feedback-error-foreground">
          {getPricingErrorMessage(resolvedSearchParams.pl_error)}
        </div>
      ) : null}

      {priceLists.length === 0 ? (
        <AdminEmptyState
          eyebrow="Tarification"
          title="Aucune liste de prix"
          description="Créez des listes de prix pour gérer les tarifs par devise, par canal ou par période promotionnelle."
          icon={Tag}
        />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "Listes total", value: priceLists.length },
              {
                label: "Actives",
                value: activeLists,
                accent: activeLists > 0 ? "text-feedback-success-foreground" : undefined,
              },
              { label: "Entrées de prix", value: totalEntries },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-3 shadow-sm backdrop-blur-sm"
              >
                <p
                  className={cn(
                    "text-2xl font-semibold tracking-tight",
                    s.accent ?? "text-foreground"
                  )}
                >
                  {s.value}
                </p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
                  {s.label}
                </p>
              </div>
            ))}
          </div>

          {/* Défaut mis en avant */}
          {defaultList ? (
            <div className="rounded-2xl border border-feedback-success-border bg-feedback-success-surface/20 px-5 py-4">
              <div className="flex items-center gap-3">
                <Star className="size-5 shrink-0 text-feedback-success-foreground" />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-foreground">
                    Liste par défaut : {defaultList.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {defaultList.currencyCode} ·{" "}
                    {defaultList.productPricesCount + defaultList.variantPricesCount} prix
                    configurés
                  </p>
                </div>
                <span className="ml-auto shrink-0 inline-flex h-6 items-center rounded-md bg-feedback-success-surface/75 px-2 text-[11px] font-medium text-feedback-success-foreground">
                  <CheckCircle2 className="mr-1 size-3" />
                  Défaut
                </span>
              </div>
            </div>
          ) : null}

          {/* Liste complète */}
          <div className="divide-y divide-surface-border/40 overflow-hidden rounded-2xl border border-surface-border/60 bg-surface-panel/60 shadow-sm backdrop-blur-sm">
            {priceLists.map((list) => {
              const cfg = STATUS_CONFIG[list.status];
              const hasSchedule = list.startsAt !== null || list.endsAt !== null;

              return (
                <div
                  key={list.id}
                  className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-subtle/20"
                >
                  {/* Icône */}
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl border",
                      list.isDefault
                        ? "border-feedback-success-border/50 bg-feedback-success-surface/20"
                        : "border-surface-border/60 bg-surface-subtle"
                    )}
                  >
                    {list.isDefault ? (
                      <Star className="size-4 text-feedback-success-foreground" />
                    ) : (
                      <Euro className="size-4 text-muted-foreground/60" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[13px] font-medium text-foreground">
                        {list.name}
                      </p>
                      <code className="rounded bg-surface-subtle px-1 font-mono text-[10px] text-muted-foreground/60">
                        {list.code}
                      </code>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {list.currencyCode} · {list.productPricesCount + list.variantPricesCount} prix
                      {hasSchedule ? (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <Clock className="size-3" />
                          {list.startsAt !== null && dateFormatter.format(new Date(list.startsAt))}
                          {list.startsAt !== null && list.endsAt !== null ? " → " : ""}
                          {list.endsAt !== null && dateFormatter.format(new Date(list.endsAt))}
                        </span>
                      ) : null}
                    </p>
                  </div>

                  {/* Statut + actions */}
                  <div className="flex shrink-0 items-center gap-2">
                    <span
                      className={cn(
                        "inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium",
                        cfg.badge
                      )}
                    >
                      {cfg.label}
                    </span>
                    {canManagePriceLists ? <PriceListRowActions list={list} /> : null}
                  </div>
                </div>
              );
            })}
          </div>

          {!canManagePriceLists ? (
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-sm text-amber-900 dark:text-amber-100">
              Le niveau <code>price-lists</code> est requis pour créer, activer ou changer les
              listes depuis <code>{ADMIN_CATALOG_PRICING_PATH}</code>.
            </div>
          ) : null}

          <p className="text-xs text-muted-foreground/50">
            Les prix par produit se configurent dans l&apos;onglet Prix de chaque fiche produit.
          </p>
        </>
      )}
    </AdminPageShell>
  );
}
