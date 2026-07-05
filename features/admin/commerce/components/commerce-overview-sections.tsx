import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  Info,
  Package,
  Percent,
  Settings2,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { CommerceOverviewStats } from "@/features/admin/commerce/queries/get-commerce-overview-stats.query";

// ── Paths ──────────────────────────────────────────────────────────────────
const COMMERCE_ORDERS_PATH = "/admin/commerce/orders";
const COMMERCE_CUSTOMERS_PATH = "/admin/commerce/customers";
const COMMERCE_PAYMENTS_PATH = "/admin/commerce/payments";
const COMMERCE_SHIPPING_PATH = "/admin/commerce/shipping";
const COMMERCE_TAXATION_PATH = "/admin/commerce/taxation";
const COMMERCE_SETTINGS_PATH = "/admin/commerce/settings";

// ── Types locaux ───────────────────────────────────────────────────────────
type CommerceHeroMetric = {
  label: string;
  value: string;
  hint: string;
  accentClassName: string;
};

type CommerceQuickLink = {
  href: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
};

// ── Quick links ────────────────────────────────────────────────────────────
const QUICK_LINKS: ReadonlyArray<CommerceQuickLink> = [
  {
    href: COMMERCE_ORDERS_PATH,
    title: "Commandes",
    description: "Traiter les commandes, suivre les statuts et gérer les expéditions.",
    icon: ShoppingBag,
  },
  {
    href: COMMERCE_CUSTOMERS_PATH,
    title: "Clients",
    description: "Consulter les profils, l'historique d'achat et les informations de contact.",
    icon: Users,
  },
  {
    href: COMMERCE_PAYMENTS_PATH,
    title: "Paiements",
    description: "Suivre les transactions, les remboursements et les anomalies de paiement.",
    icon: CreditCard,
  },
  {
    href: COMMERCE_SHIPPING_PATH,
    title: "Livraisons",
    description: "Gérer les expéditions, les transporteurs et les numéros de suivi.",
    icon: Truck,
  },
  {
    href: COMMERCE_TAXATION_PATH,
    title: "TVA",
    description: "Configurer les règles de taxation par territoire de livraison.",
    icon: Percent,
  },
  {
    href: COMMERCE_SETTINGS_PATH,
    title: "Configuration",
    description: "Centraliser les réglages paiements, livraison, TVA et clients.",
    icon: Settings2,
  },
];

function formatRevenue(amount: number): string {
  if (amount === 0) return "0 €";
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1).replace(".", ",")} k€`;
  }
  return `${amount.toFixed(2).replace(".", ",")} €`;
}

// ── Hero metric card ───────────────────────────────────────────────────────
function HeroMetric({ label, value, hint, accentClassName }: CommerceHeroMetric) {
  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-2xl border border-surface-border/60 bg-surface-panel/60 px-5 py-4 shadow-sm backdrop-blur-sm",
        accentClassName
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
        {label}
      </p>
      <p className="text-3xl font-semibold tracking-tight text-foreground">{value}</p>
      <p className="text-xs leading-5 text-muted-foreground">{hint}</p>
    </div>
  );
}

// ── Signal item ────────────────────────────────────────────────────────────
function SignalItem({
  label,
  detail,
  tone,
}: {
  label: string;
  detail: string;
  tone: "warning" | "error" | "info";
}) {
  const Icon = tone === "error" ? AlertTriangle : tone === "warning" ? Clock : Info;

  const toneClass =
    tone === "error"
      ? "text-feedback-error-foreground"
      : tone === "warning"
        ? "text-feedback-warning-foreground"
        : "text-foreground/60";

  return (
    <div className="flex items-start gap-3 py-3 first:pt-0 last:pb-0">
      <Icon className={cn("mt-0.5 size-4 shrink-0", toneClass)} />
      <div className="min-w-0">
        <p className="text-[13px] font-medium text-foreground">{label}</p>
        <p className="mt-0.5 text-xs leading-5 text-muted-foreground">{detail}</p>
      </div>
    </div>
  );
}

// ── Order status badge ─────────────────────────────────────────────────────
const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  paid: "Payée",
  preparing: "Préparation",
  shipped: "Expédiée",
  cancelled: "Annulée",
};

const STATUS_CLASSES: Record<string, string> = {
  pending: "bg-feedback-warning-surface text-feedback-warning-foreground",
  paid: "bg-feedback-success-surface text-feedback-success-foreground",
  preparing: "bg-sky-50/80 text-sky-700",
  shipped: "bg-feedback-success-surface/60 text-feedback-success-foreground",
  cancelled: "bg-surface-subtle text-muted-foreground",
};

// ── Main component ─────────────────────────────────────────────────────────
type CommerceOverviewSectionsProps = {
  stats: CommerceOverviewStats;
};

export function CommerceOverviewSections({ stats }: CommerceOverviewSectionsProps) {
  const hasOrders = stats.totalOrders > 0;

  const heroMetrics: CommerceHeroMetric[] = [
    {
      label: "Commandes totales",
      value: String(stats.totalOrders),
      hint: hasOrders
        ? `${stats.shippedCount} expédiée${stats.shippedCount > 1 ? "s" : ""} · ${stats.cancelledCount} annulée${stats.cancelledCount > 1 ? "s" : ""}`
        : "Aucune commande reçue",
      accentClassName: "",
    },
    {
      label: "Revenu confirmé",
      value: formatRevenue(stats.confirmedRevenue),
      hint: "Commandes payées, en préparation ou expédiées",
      accentClassName: "bg-emerald-50/60",
    },
    {
      label: "En attente",
      value: String(stats.pendingCount),
      hint:
        stats.pendingCount > 0
          ? `${formatRevenue(stats.pendingRevenue)} en attente de confirmation`
          : "Aucune commande en attente",
      accentClassName: stats.pendingCount > 0 ? "bg-amber-50/60" : "",
    },
    {
      label: "À expédier",
      value: String(stats.preparingCount),
      hint:
        stats.preparingCount > 0
          ? "En cours de préparation — agir sous 24 h"
          : "Aucune commande à préparer",
      accentClassName: stats.preparingCount > 0 ? "bg-sky-50/60" : "",
    },
  ];

  return (
    <div>
      {/* ── Hero metrics ──────────────────────────────────────────────── */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {heroMetrics.map((m) => (
          <HeroMetric key={m.label} {...m} />
        ))}
      </div>

      {/* ── Body : signals + recent + quick links ─────────────────────── */}
      <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        {/* Colonne principale */}
        <div className="flex flex-col gap-4">
          {/* Commandes récentes */}
          <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                  Activité récente
                </p>
                <h2 className="mt-1 text-xl font-semibold tracking-tight text-foreground">
                  Dernières commandes
                </h2>
              </div>
              <Link
                href={COMMERCE_ORDERS_PATH}
                className="inline-flex items-center gap-1 rounded-full border border-surface-border/60 bg-surface-panel px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-panel-soft hover:text-foreground"
              >
                Toutes
                <ArrowRight className="size-3" />
              </Link>
            </div>

            {stats.recentOrders.length === 0 ? (
              <div className="py-8 text-center">
                <ShoppingBag className="mx-auto mb-3 size-8 text-muted-foreground/30" />
                <p className="text-sm font-medium text-foreground">Aucune commande</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Les premières commandes apparaîtront ici dès réception.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-surface-border/30">
                {stats.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`${COMMERCE_ORDERS_PATH}/${order.id}`}
                    className="flex items-center justify-between gap-3 py-3 transition-colors hover:text-foreground first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-foreground">
                        {order.reference}
                      </p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {new Intl.DateTimeFormat("fr-FR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(order.createdAt))}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2.5">
                      <span
                        className={cn(
                          "inline-flex h-6 items-center rounded-md px-2 text-[11px] font-medium",
                          STATUS_CLASSES[order.status] ?? "bg-surface-subtle text-muted-foreground"
                        )}
                      >
                        {STATUS_LABELS[order.status] ?? order.status}
                      </span>
                      <span className="text-sm font-medium tabular-nums text-foreground">
                        {parseFloat(order.totalAmount).toLocaleString("fr-FR", {
                          style: "currency",
                          currency: "EUR",
                        })}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Accès rapides */}
          <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
              Accès rapides
            </p>
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
              Outils commerce
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {QUICK_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-start gap-3 rounded-xl border border-surface-border/40 bg-surface-panel/50 p-3.5 transition-colors hover:bg-surface-panel hover:border-surface-border"
                >
                  <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-surface-subtle">
                    <link.icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-foreground">{link.title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-muted-foreground">
                      {link.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {/* Colonne latérale — signaux + statut */}
        <div className="flex flex-col gap-4">
          {/* Signaux d'attention */}
          <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
              Signaux
            </p>
            <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
              Points d'attention
            </h2>

            {stats.signals.length === 0 ? (
              <div className="flex items-center gap-2.5 rounded-xl bg-feedback-success-surface/40 px-3 py-2.5">
                <CheckCircle2 className="size-4 shrink-0 text-feedback-success-foreground" />
                <p className="text-[13px] text-feedback-success-foreground">Aucune alerte active</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-border/30">
                {stats.signals.map((s) => (
                  <SignalItem key={s.key} label={s.label} detail={s.detail} tone={s.tone} />
                ))}
              </div>
            )}
          </section>

          {/* Répartition par statut */}
          {hasOrders ? (
            <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/60 p-5 shadow-sm backdrop-blur-sm">
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-primary/80">
                Répartition
              </p>
              <h2 className="mb-4 text-xl font-semibold tracking-tight text-foreground">
                Statuts en cours
              </h2>
              <div className="space-y-2">
                {(
                  [
                    ["pending", "En attente"],
                    ["paid", "Payées"],
                    ["preparing", "En préparation"],
                    ["shipped", "Expédiées"],
                    ["cancelled", "Annulées"],
                  ] as [string, string][]
                )
                  .filter(
                    ([key]) =>
                      (stats.ordersByStatus[key as keyof typeof stats.ordersByStatus] ?? 0) > 0
                  )
                  .map(([key, label]) => {
                    const count =
                      stats.ordersByStatus[key as keyof typeof stats.ordersByStatus] ?? 0;
                    const pct = Math.round((count / stats.totalOrders) * 100);
                    return (
                      <div key={key} className="flex items-center gap-3">
                        <span className="w-28 shrink-0 text-xs text-muted-foreground">{label}</span>
                        <div className="min-w-0 flex-1 overflow-hidden rounded-full bg-surface-subtle">
                          <div
                            className={cn(
                              "h-1.5 rounded-full",
                              STATUS_CLASSES[key]?.split(" ")[0] ?? "bg-surface-border"
                            )}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="w-6 shrink-0 text-right text-xs font-medium tabular-nums text-foreground">
                          {count}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </section>
          ) : null}

          {/* Cockpit note */}
          <section className="rounded-2xl border border-surface-border/60 bg-surface-panel/40 p-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-primary/80">
              Module commerce
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Les commandes sont opérationnelles. Clients, paiements et livraisons seront
              accessibles au fil de l'activation progressive.
            </p>
            <Link
              href={COMMERCE_ORDERS_PATH}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
            >
              <Package className="size-3.5" />
              Gérer les commandes
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
