/**
 * analytics-overview-sections.tsx
 * Cockpit analytics.
 * - Bloc "Ce mois" : données réelles (`Order`/`Customer`, lecture live à la
 *   demande) si `monthly` est fourni — cf.
 *   `docs/lots/2026-06-13-engagement-analytics-cadrage.md` (décision B1/C1).
 * - Bloc "Aujourd'hui vs hier" : données réelles (`AnalyticsSnapshot`
 *   quotidiens, tracking anonyme sans cookie — cf.
 *   `features/analytics/tracking/record-storefront-analytics-event.service.ts`)
 *   si `daily` est fourni ; mock sinon (comportement antérieur).
 * - Bloc "Pages les plus visitées" : données réelles via le provider
 *   analytics actif (`features/analytics/providers/`, Umami aujourd'hui)
 *   si `topPages` est fourni ; mock sinon (provider `none`, ou échec).
 * Domaine : analytics (prisma/optional/engagement/analytics.prisma)
 * Modèles : AnalyticsMetric, AnalyticsSnapshot (alimentés par le tracking
 * storefront pour les vues produit et ajouts panier uniquement)
 */
import Link from "next/link";
import { Activity, Eye, Search, ShoppingCart, TrendingDown, TrendingUp, Users } from "lucide-react";

import { cn } from "@/lib/utils";
import { DashboardSection } from "@/components/admin/dashboard-widgets/dashboard-section";
import { KpiCard } from "@/components/admin/dashboard-widgets/kpi-card";
import type { CommerceAnalyticsInsights } from "@/features/admin/insights/queries/get-commerce-analytics-insights.query";
import type { CommerceAnalyticsRecommendations } from "@/features/admin/insights/queries/get-commerce-analytics-recommendations.query";
import type { DailyTrafficAnalytics } from "@/features/admin/insights/queries/get-daily-traffic-analytics.query";
import type { MonthlyCommerceAnalytics } from "@/features/admin/insights/queries/get-monthly-commerce-analytics.query";
import type { AnalyticsTopPagesData } from "@/features/admin/insights/queries/get-analytics-top-pages.query";
import type { SearchAnalytics } from "@/features/admin/insights/queries/get-search-analytics.query";

// ── Mock data ─────────────────────────────────────────────────────────────

const TODAY = {
  sessions: 1247,
  sessionsDelta: +12.4,
  pageViews: 4389,
  pageViewsDelta: +8.1,
  uniqueVisitors: 934,
  uniqueVisitorsDelta: +6.7,
  conversionRate: 3.2,
  conversionRateDelta: +0.4,
  avgOrderValue: 89,
  avgOrderValueDelta: +5.2,
  revenue: 1243,
  revenueDelta: +18.9,
};

const MONTH = {
  revenue: 8450,
  orders: 94,
  newCustomers: 67,
  returnRate: 24,
};

const TOP_PAGES = [
  { path: "/boutique", views: 892, delta: +4.2 },
  { path: "/boutique/sacs", views: 673, delta: +11.8 },
  { path: "/boutique/accessoires", views: 441, delta: -2.1 },
  { path: "/boutique/pochette-nocturne", views: 389, delta: +33.1 },
  { path: "/", views: 312, delta: +1.9 },
];

// ── Main ──────────────────────────────────────────────────────────────────

type AnalyticsOverviewSectionsProps = {
  /**
   * Agrégats commerce du mois courant. `null` si
   * `meetsFeatureLevel("engagement.analytics", "read")` est faux — le bloc
   * "Ce mois" reste alors un mock (comportement antérieur).
   */
  monthly?: MonthlyCommerceAnalytics | null;
  insights?: CommerceAnalyticsInsights | null;
  /**
   * Insights actionnables (produits en repli / en croissance). `null` si
   * `meetsFeatureLevel("engagement.analytics", "recommendations")` est faux
   * — la section n'est alors pas affichée.
   */
  recommendations?: CommerceAnalyticsRecommendations | null;
  /**
   * Compteurs storefront « aujourd'hui vs hier » (tracking anonyme sans
   * cookie, `AnalyticsSnapshot` quotidiens). `null` si le niveau `read`
   * n'est pas atteint — le bloc reste alors un mock (comportement antérieur).
   */
  daily?: DailyTrafficAnalytics | null;
  /**
   * Top pages du provider analytics actif. `null` si le niveau `read`
   * n'est pas atteint, si le provider est `none`, ou si l'appel a échoué —
   * le bloc retombe alors sur le mock `TOP_PAGES`.
   */
  topPages?: AnalyticsTopPagesData | null;
  /**
   * Métriques de recherche storefront (top termes 30 jours, recherches sans
   * résultat aujourd'hui vs hier). `null` si le niveau `read` n'est pas
   * atteint — la section n'est alors pas affichée.
   */
  search?: SearchAnalytics | null;
};

export function AnalyticsOverviewSections({
  monthly = null,
  insights = null,
  recommendations = null,
  daily = null,
  topPages = null,
  search = null,
}: AnalyticsOverviewSectionsProps) {
  const displayedTopPages = topPages ?? TOP_PAGES;
  return (
    <div>
      {/* KPI Hero — aujourd'hui */}
      <div className="mb-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Aujourd'hui vs hier
        </p>
        <p className="mt-0.5 text-[11px] text-muted-foreground/50">
          {daily === null
            ? "Données de démonstration — nécessite le niveau read du module analytics."
            : "Compteurs agrégés côté serveur, anonymes et sans cookie. Sessions et visiteurs uniques non mesurables sans identifiant."}
        </p>
      </div>
      {daily !== null ? (
        <div className="grid gap-3 sm:grid-cols-2">
          <KpiCard
            label="Vues produit"
            value={daily.productViews.today.toLocaleString("fr-FR")}
            delta={daily.productViews.deltaPercent}
            hint="vs hier"
            icon={Eye}
            isMock={false}
          />
          <KpiCard
            label="Ajouts panier"
            value={daily.cartAdditions.today.toLocaleString("fr-FR")}
            delta={daily.cartAdditions.deltaPercent}
            hint="vs hier"
            icon={ShoppingCart}
            isMock={false}
          />
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <KpiCard
            label="Sessions"
            value={TODAY.sessions.toLocaleString("fr-FR")}
            delta={TODAY.sessionsDelta}
            hint="vs hier"
            icon={Activity}
          />
          <KpiCard
            label="Visiteurs uniques"
            value={TODAY.uniqueVisitors.toLocaleString("fr-FR")}
            delta={TODAY.uniqueVisitorsDelta}
            hint="vs hier"
            icon={Users}
          />
          <KpiCard
            label="Pages vues"
            value={TODAY.pageViews.toLocaleString("fr-FR")}
            delta={TODAY.pageViewsDelta}
            hint="vs hier"
            icon={Eye}
          />
          <KpiCard
            label="Taux de conversion"
            value={`${TODAY.conversionRate}%`}
            delta={TODAY.conversionRateDelta}
            hint="sessions → commande"
            icon={ShoppingCart}
            accent="bg-emerald-50/60"
          />
          <KpiCard
            label="Panier moyen"
            value={`${TODAY.avgOrderValue} €`}
            delta={TODAY.avgOrderValueDelta}
            hint="vs hier"
            icon={ShoppingCart}
          />
          <KpiCard
            label="Revenu"
            value={`${TODAY.revenue.toLocaleString("fr-FR")} €`}
            delta={TODAY.revenueDelta}
            hint="vs hier"
            icon={TrendingUp}
            accent="bg-emerald-50/60"
          />
        </div>
      )}

      {/* Body */}
      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        {/* Pages les plus visitées */}
        <div className="grid gap-4">
          <DashboardSection
            eyebrow="Trafic"
            isMock={topPages === null}
            title="Pages les plus visitées"
          >
            <div className="divide-y divide-surface-border/30">
              {displayedTopPages.map((page) => {
                const isPositive = page.delta >= 0;
                const DeltaIcon = isPositive ? TrendingUp : TrendingDown;
                return (
                  <div
                    key={page.path}
                    className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <p className="min-w-0 truncate font-mono text-[12px] text-foreground">
                      {page.path}
                    </p>
                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 text-xs",
                          isPositive
                            ? "text-feedback-success-foreground"
                            : "text-feedback-error-foreground"
                        )}
                      >
                        <DeltaIcon className="size-3" />
                        {Math.abs(page.delta).toFixed(1)}%
                      </span>
                      <span className="w-14 text-right text-sm font-medium tabular-nums text-foreground">
                        {page.views.toLocaleString("fr-FR")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </DashboardSection>

          {search !== null ? (
            <DashboardSection eyebrow="Recherche" title="Recherches storefront">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                    Top termes (30 jours)
                  </p>
                  {search.topTerms.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Aucune recherche enregistrée.</p>
                  ) : (
                    <div className="divide-y divide-surface-border/30">
                      {search.topTerms.map((entry) => (
                        <div
                          key={entry.term}
                          className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
                        >
                          <p className="min-w-0 truncate text-sm text-foreground">{entry.term}</p>
                          <span className="text-sm font-semibold tabular-nums text-foreground">
                            {entry.count}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                    Sans résultat
                  </p>
                  <div className="flex items-center gap-2">
                    <Search className="size-4 shrink-0 text-muted-foreground/40" />
                    <p className="text-3xl font-semibold tracking-tight text-foreground">
                      {search.zeroResults.today}
                    </p>
                  </div>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    {search.zeroResults.deltaPercent === null ? (
                      <span className="text-xs font-medium text-muted-foreground/60">—</span>
                    ) : (
                      <span
                        className={cn(
                          "inline-flex items-center gap-0.5 text-xs font-medium",
                          search.zeroResults.deltaPercent >= 0
                            ? "text-feedback-error-foreground"
                            : "text-feedback-success-foreground"
                        )}
                      >
                        {search.zeroResults.deltaPercent >= 0 ? (
                          <TrendingUp className="size-3" />
                        ) : (
                          <TrendingDown className="size-3" />
                        )}
                        {Math.abs(search.zeroResults.deltaPercent).toFixed(1)}%
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">vs hier</span>
                  </div>
                </div>
              </div>
            </DashboardSection>
          ) : null}

          {insights !== null ? (
            <DashboardSection eyebrow="Insights" title="Top produits du mois">
              {insights.topProducts.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Aucune vente confirmée sur la période courante.
                </p>
              ) : (
                <div className="divide-y divide-surface-border/30">
                  {insights.topProducts.map((product) => (
                    <div
                      key={`${product.productId ?? "product"}-${product.productName}`}
                      className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {product.productName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.quantitySold} article{product.quantitySold > 1 ? "s" : ""} vendus
                        </p>
                      </div>
                      <span className="text-sm font-semibold tabular-nums text-foreground">
                        {product.revenue.toLocaleString("fr-FR", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}{" "}
                        €
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </DashboardSection>
          ) : null}

          {recommendations !== null ? (
            <DashboardSection eyebrow="Recommandations" title="Produits à surveiller">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                    En repli
                  </p>
                  {recommendations.decliningProducts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucun produit en repli sur les 30 derniers jours.
                    </p>
                  ) : (
                    <div className="divide-y divide-surface-border/30">
                      {recommendations.decliningProducts.map((product) => (
                        <div
                          key={`${product.productId ?? "product"}-${product.productName}`}
                          className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
                        >
                          <p className="min-w-0 truncate text-sm text-foreground">
                            {product.productName}
                          </p>
                          <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-feedback-error-foreground">
                            <TrendingDown className="size-3" />0 vente (vs{" "}
                            {product.previousQuantity})
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                    En croissance
                  </p>
                  {recommendations.growingProducts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucun produit en forte croissance ce mois.
                    </p>
                  ) : (
                    <div className="divide-y divide-surface-border/30">
                      {recommendations.growingProducts.map((product) => (
                        <div
                          key={`${product.productId ?? "product"}-${product.productName}`}
                          className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0"
                        >
                          <p className="min-w-0 truncate text-sm text-foreground">
                            {product.productName}
                          </p>
                          <span className="inline-flex shrink-0 items-center gap-0.5 text-xs font-medium text-feedback-success-foreground">
                            <TrendingUp className="size-3" />+{product.growth}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </DashboardSection>
          ) : null}
        </div>

        {/* Résumé du mois */}
        <div className="flex flex-col gap-4">
          <DashboardSection eyebrow="Ce mois" isMock={monthly === null} title="Vue mensuelle">
            <div className="space-y-3">
              {(monthly === null
                ? [
                    { label: "Revenu", value: `${MONTH.revenue.toLocaleString("fr-FR")} €` },
                    { label: "Commandes", value: String(MONTH.orders) },
                    { label: "Nouveaux clients", value: String(MONTH.newCustomers) },
                    { label: "Taux de retour", value: `${MONTH.returnRate}%` },
                  ]
                : [
                    { label: "Revenu", value: `${monthly.revenue.toLocaleString("fr-FR")} €` },
                    { label: "Commandes", value: String(monthly.ordersCount) },
                    { label: "Nouveaux clients", value: String(monthly.newCustomersCount) },
                    {
                      label: "Taux d'annulation",
                      value: `${monthly.cancellationRate.toFixed(1)}%`,
                    },
                  ]
              ).map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold tabular-nums text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </DashboardSection>

          {insights !== null ? (
            <DashboardSection eyebrow="Insights" title="Lecture commerce additionnelle">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">Panier moyen confirmé</p>
                  <p className="text-sm font-semibold tabular-nums text-foreground">
                    {insights.averageOrderValue.toLocaleString("fr-FR", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    €
                  </p>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">Commandes confirmées</p>
                  <p className="text-sm font-semibold tabular-nums text-foreground">
                    {insights.totalConfirmedOrders}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground/70">
                  Statuts des commandes créées ce mois
                </p>
                {insights.statusBreakdown.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Aucune commande créée sur la période courante.
                  </p>
                ) : (
                  <div className="grid gap-2">
                    {insights.statusBreakdown.map((status) => (
                      <div key={status.status} className="flex items-center justify-between gap-3">
                        <p className="text-xs text-muted-foreground">{status.status}</p>
                        <p className="text-sm font-semibold tabular-nums text-foreground">
                          {status.count}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DashboardSection>
          ) : null}

          <section className="rounded-2xl border border-surface-border/40 bg-surface-panel/30 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Module analytics
            </p>
            {monthly === null ? (
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground/70">
                Données de démonstration. Connectées à{" "}
                <code className="rounded bg-surface-subtle px-1 font-mono text-[10px]">
                  AnalyticsMetric
                </code>{" "}
                +{" "}
                <code className="rounded bg-surface-subtle px-1 font-mono text-[10px]">
                  AnalyticsSnapshot
                </code>{" "}
                lors de l'activation.
                <br />
                Doctrine :{" "}
                <code className="rounded bg-surface-subtle px-1 font-mono text-[10px]">
                  docs/domains/optional/
                </code>
              </p>
            ) : (
              <p className="mt-2 text-[11px] leading-5 text-muted-foreground/70">
                Bloc "Ce mois" : vue calculée à la demande depuis{" "}
                <code className="rounded bg-surface-subtle px-1 font-mono text-[10px]">Order</code>{" "}
                /{" "}
                <code className="rounded bg-surface-subtle px-1 font-mono text-[10px]">
                  Customer
                </code>
                , non historisée. Niveau `insights` : lectures commerce additionnelles (`Order` /
                `OrderLine`). Bloc "Aujourd'hui vs hier" : compteurs quotidiens{" "}
                <code className="rounded bg-surface-subtle px-1 font-mono text-[10px]">
                  AnalyticsSnapshot
                </code>{" "}
                alimentés par le tracking storefront anonyme sans cookie (vues produit, ajouts
                panier).
                <br />
                Doctrine :{" "}
                <code className="rounded bg-surface-subtle px-1 font-mono text-[10px]">
                  docs/domains/cross-cutting/analytics.md
                </code>
              </p>
            )}
            <p className="mt-3 text-[11px] leading-5 text-muted-foreground/70">
              Relance panier abandonné : suivi des jobs dans{" "}
              <Link href="/admin/marketing/automations" className="underline hover:text-foreground">
                Marketing → Automations
              </Link>
              .
              <br />
              Attribution (source/canal/campagne) : aucune lecture interne (choix assumé, cf.{" "}
              <code className="rounded bg-surface-subtle px-1 font-mono text-[10px]">
                docs/roadmap/analyses-cockpit-analytique/lot-4-attribution-cadrage.md
              </code>
              ) — se référer au tableau de bord Umami/Plausible.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
