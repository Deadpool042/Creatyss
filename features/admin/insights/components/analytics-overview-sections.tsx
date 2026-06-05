/**
 * analytics-overview-sections.tsx
 * Cockpit analytics — toutes les données sont des mocks assumés.
 * Domaine : analytics (prisma/optional/engagement/analytics.prisma)
 * Modèles : AnalyticsMetric, AnalyticsSnapshot
 */
import { Activity, Eye, ShoppingCart, TrendingDown, TrendingUp, Users } from "lucide-react";

import { cn } from "@/lib/utils";

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

// ── Sub-components ────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  delta,
  hint,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  delta: number;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
}) {
  const isPositive = delta >= 0;
  const DeltaIcon = isPositive ? TrendingUp : TrendingDown;
  return (
    <div
      className={cn(
        "flex flex-col gap-2 rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-5 py-4 shadow-sm backdrop-blur-sm",
        accent
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
          {label}
          <span className="ml-1.5 font-normal text-muted-foreground/40">(mock)</span>
        </p>
        <Icon className="size-4 shrink-0 text-muted-foreground/40" />
      </div>
      <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <div className="flex items-center gap-1.5">
        <span
          className={cn(
            "inline-flex items-center gap-0.5 text-xs font-medium",
            isPositive ? "text-feedback-success-foreground" : "text-feedback-error-foreground"
          )}
        >
          <DeltaIcon className="size-3" />
          {Math.abs(delta).toFixed(1)}%
        </span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────

export function AnalyticsOverviewSections() {
  return (
    <div>
      {/* KPI Hero — aujourd'hui */}
      <div className="mb-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Aujourd'hui vs hier
        </p>
      </div>
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

      {/* Body */}
      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        {/* Pages les plus visitées */}
        <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm">
          <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
            Trafic
          </p>
          <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
            Pages les plus visitées
          </h2>
          <div className="divide-y divide-surface-border/30">
            {TOP_PAGES.map((page) => {
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
        </section>

        {/* Résumé du mois */}
        <div className="flex flex-col gap-4">
          <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
              Ce mois
              <span className="ml-1.5 font-normal text-muted-foreground/40">(mock)</span>
            </p>
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
              Vue mensuelle
            </h2>
            <div className="space-y-3">
              {[
                { label: "Revenu", value: `${MONTH.revenue.toLocaleString("fr-FR")} €` },
                { label: "Commandes", value: String(MONTH.orders) },
                { label: "Nouveaux clients", value: String(MONTH.newCustomers) },
                { label: "Taux de retour", value: `${MONTH.returnRate}%` },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="text-sm font-semibold tabular-nums text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-surface-border/40 bg-surface-panel/30 p-4">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Module analytics
            </p>
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
          </section>
        </div>
      </div>
    </div>
  );
}
