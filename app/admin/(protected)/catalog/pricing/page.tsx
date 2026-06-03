import { CheckCircle2, Clock, Euro, Star, Tag } from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
import { ADMIN_CONTENT_PAGE } from "@/components/admin/layout/admin-content-classnames";
import { AdminComingSoon as AdminEmptyState } from "@/components/admin/shared/admin-coming-soon";
import { cn } from "@/lib/utils";

import { listAdminPriceLists, type AdminPriceListSummary } from "@/features/admin/catalog/queries/list-admin-price-lists.query";

export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" });

const STATUS_CONFIG: Record<AdminPriceListSummary["status"], {
  label: string;
  badge: string;
}> = {
  DRAFT: { label: "Brouillon", badge: "bg-surface-subtle text-muted-foreground" },
  ACTIVE: { label: "Actif", badge: "bg-feedback-success-surface/75 text-feedback-success-foreground" },
  INACTIVE: { label: "Inactif", badge: "bg-surface-subtle text-muted-foreground/70" },
  ARCHIVED: { label: "Archivé", badge: "bg-surface-subtle text-muted-foreground/50" },
};

export default async function AdminCatalogPricingPage() {
  let priceLists: AdminPriceListSummary[] = [];

  try {
    priceLists = await listAdminPriceLists();
  } catch {
    // Table non disponible
  }

  const activeLists = priceLists.filter((p) => p.status === "ACTIVE").length;
  const totalEntries = priceLists.reduce((sum, p) => sum + p.productPricesCount + p.variantPricesCount, 0);
  const defaultList = priceLists.find((p) => p.isDefault);

  return (
    <AdminPageShell
      scrollMode="area"
      title="Listes de prix"
      breadcrumbs={[
        { label: "Admin", href: "/admin" },
        { label: "Catalogue", href: "/admin/catalog/overview" },
        { label: "Tarification" },
      ]}
      showBreadcrumbsInContent={false}
      showTitleInContent={false}
      contentClassName={ADMIN_CONTENT_PAGE}
    >
      {priceLists.length === 0 ? (
        <AdminEmptyState
          title="Listes de prix"
          description="Créez des listes de prix pour gérer les tarifs par devise, par canal ou par période promotionnelle. Modèle : PriceList (prisma/core/catalog/pricing.prisma)."
          docRef="prisma/core/catalog/pricing.prisma"
          icon={Tag}
        />
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Listes total", value: priceLists.length },
              { label: "Actives", value: activeLists, accent: activeLists > 0 ? "text-feedback-success-foreground" : undefined },
              { label: "Entrées de prix", value: totalEntries },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-4 py-3 shadow-sm backdrop-blur-sm">
                <p className={cn("text-2xl font-semibold tracking-tight", s.accent ?? "text-foreground")}>{s.value}</p>
                <p className="mt-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Liste de prix par défaut mise en avant */}
          {defaultList ? (
            <div className="rounded-2xl border border-feedback-success-border bg-feedback-success-surface/20 px-5 py-4">
              <div className="flex items-center gap-3">
                <Star className="size-5 shrink-0 text-feedback-success-foreground" />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-foreground">
                    Liste par défaut : {defaultList.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {defaultList.currencyCode} · {defaultList.productPricesCount + defaultList.variantPricesCount} prix configurés
                  </p>
                </div>
                <span className="ml-auto shrink-0 inline-flex h-6 items-center rounded-md bg-feedback-success-surface/75 px-2 text-[11px] font-medium text-feedback-success-foreground">
                  <CheckCircle2 className="mr-1 size-3" />
                  Défaut
                </span>
              </div>
            </div>
          ) : null}

          {/* Toutes les listes */}
          <div className="divide-y divide-surface-border/40 overflow-hidden rounded-2xl border border-surface-border/60 bg-surface-panel/60 shadow-sm backdrop-blur-sm">
            {priceLists.map((list) => {
              const cfg = STATUS_CONFIG[list.status];
              const hasSchedule = list.startsAt || list.endsAt;

              return (
                <div key={list.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-surface-subtle/20 transition-colors">
                  {/* Icon */}
                  <div className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-xl border",
                    list.isDefault
                      ? "border-feedback-success-border/50 bg-feedback-success-surface/20"
                      : "border-surface-border/60 bg-surface-subtle"
                  )}>
                    {list.isDefault ? (
                      <Star className="size-4 text-feedback-success-foreground" />
                    ) : (
                      <Euro className="size-4 text-muted-foreground/60" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-[13px] font-medium text-foreground">{list.name}</p>
                      <code className="rounded bg-surface-subtle px-1 font-mono text-[10px] text-muted-foreground/60">
                        {list.code}
                      </code>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {list.currencyCode} · {list.productPricesCount + list.variantPricesCount} prix
                      {hasSchedule ? (
                        <span className="ml-2 inline-flex items-center gap-1">
                          <Clock className="size-3" />
                          {list.startsAt && dateFormatter.format(new Date(list.startsAt))}
                          {list.startsAt && list.endsAt ? " → " : ""}
                          {list.endsAt && dateFormatter.format(new Date(list.endsAt))}
                        </span>
                      ) : null}
                    </p>
                  </div>

                  {/* Statut */}
                  <span className={cn("shrink-0 inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium", cfg.badge)}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground/50">
            Création et édition des listes de prix à venir. Les prix par produit se configurent dans l'onglet Prix de chaque fiche produit.
          </p>
        </>
      )}
    </AdminPageShell>
  );
}
