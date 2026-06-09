import Link from "next/link";
import {
  AlertTriangleIcon,
  MailWarningIcon,
  PackageIcon,
  ShoppingBagIcon,
  TruckIcon,
} from "lucide-react";

import { AdminOverviewHero } from "@/components/admin/layout/admin-overview-hero";
import {
  AdminSplitDetailOverviewEmptyState,
  AdminSplitDetailOverviewGrid,
} from "@/components/admin/layout/admin-split-detail-overview-content";
import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-section-card";
import { AdminSplitDetailOverviewShell } from "@/components/admin/layout/admin-split-detail-overview-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getOrderStatusLabel,
  getPaymentStatusLabel,
} from "@/entities/order/order-status-presentation";
import {
  getOrderStatusBadgeVariant,
  getPaymentStatusBadgeVariant,
} from "@/features/admin/commerce/orders/config/order-ui.config";
import { getAdminOrdersOverview } from "@/features/admin/commerce/orders/overview/queries/get-admin-orders-overview.query";
import { ADMIN_ORDERS_DETAIL_OVERVIEW_CONTENT_WIDTH } from "@/features/admin/commerce/orders/shared/admin-orders-detail-layout";

const dateTimeFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

type OverviewSignal = {
  key: string;
  title: string;
  detail: string;
};

function buildSignals(input: Awaited<ReturnType<typeof getAdminOrdersOverview>>): OverviewSignal[] {
  const signals: OverviewSignal[] = [];

  if (input.paidCount > 0) {
    signals.push({
      key: "paid",
      title: `${input.paidCount} commande${input.paidCount > 1 ? "s" : ""} à passer en préparation`,
      detail: "Le paiement est confirmé, mais la commande attend encore sa prise en charge.",
    });
  }

  if (input.preparingCount > 0) {
    signals.push({
      key: "preparing",
      title: `${input.preparingCount} commande${input.preparingCount > 1 ? "s" : ""} à expédier`,
      detail: "La préparation est en cours. Finalisez l'expédition dès que possible.",
    });
  }

  if (input.paymentIssueCount > 0) {
    signals.push({
      key: "payment",
      title: `${input.paymentIssueCount} paiement${input.paymentIssueCount > 1 ? "s" : ""} à vérifier`,
      detail: "Un paiement a échoué ou demande une vérification avant traitement.",
    });
  }

  if (input.failedEmailCount > 0) {
    signals.push({
      key: "email",
      title: `${input.failedEmailCount} email${input.failedEmailCount > 1 ? "s" : ""} en échec`,
      detail: "La commande reste valide, mais un envoi transactionnel demande une reprise.",
    });
  }

  return signals;
}

export async function AdminOrdersDetailOverview() {
  const stats = await getAdminOrdersOverview();
  const signals = buildSignals(stats);

  return (
    <AdminSplitDetailOverviewShell
      title="Commandes"
      contentWidth={ADMIN_ORDERS_DETAIL_OVERVIEW_CONTENT_WIDTH}
      hero={
        <AdminOverviewHero
          mobileHidden
          align="leading"
          eyebrow="Commerce"
          icon={ShoppingBagIcon}
          title="Vue d'ensemble commandes"
          description="Gardez un point d'entrée clair sur les commandes à traiter avant de descendre dans le détail."
          action={
            <Button asChild size="sm" className="rounded-full">
              <Link href="/admin/commerce/overview">Vue commerce</Link>
            </Button>
          }
          metrics={[
            {
              label: "Total",
              value: stats.totalCount,
              hint: `${stats.shippedCount} expédiée${stats.shippedCount > 1 ? "s" : ""} · ${stats.cancelledCount} annulée${stats.cancelledCount > 1 ? "s" : ""}`,
              toneClassName: "bg-surface-panel",
            },
            {
              label: "À préparer",
              value: stats.paidCount,
              hint:
                stats.paidCount > 0
                  ? "Commandes payées en attente de prise en charge."
                  : "Aucune commande payée en attente.",
              toneClassName: "bg-surface-panel-soft",
            },
            {
              label: "À expédier",
              value: stats.preparingCount,
              hint:
                stats.preparingCount > 0
                  ? "Commandes en préparation prêtes à sortir."
                  : "Aucune expédition urgente.",
              toneClassName: "bg-surface-panel-soft",
            },
            {
              label: "Emails en échec",
              value: stats.failedEmailCount,
              hint:
                stats.failedEmailCount > 0
                  ? "Les commandes restent lisibles, mais les traces demandent un suivi."
                  : "Aucun incident email remonté.",
              toneClassName: "bg-surface-panel-soft",
            },
          ]}
        />
      }
    >
      <AdminSplitDetailOverviewGrid>
        <AdminSplitDetailSectionCard>
          <AdminSplitDetailSectionHeader
            eyebrow="Récentes"
            title="Dernières commandes"
            description="Ouvrez directement une commande prioritaire depuis ce panneau."
            action={
              <Button asChild size="sm" className="rounded-full">
                <Link href="/admin/commerce/overview">Vue commerce</Link>
              </Button>
            }
          />

          {stats.recentOrders.length > 0 ? (
            <div className="mt-5 space-y-2">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/commerce/orders/${order.id}`}
                  className="flex items-start justify-between gap-3 rounded-xl border border-surface-border-subtle bg-surface-panel-soft px-4 py-3 transition-colors hover:bg-surface-panel"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {order.reference}
                    </p>
                    <p className="mt-1 truncate text-xs text-muted-foreground">
                      {order.customerName}
                      {order.customerEmail.length > 0 ? ` · ${order.customerEmail}` : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge variant={getOrderStatusBadgeVariant(order.status)}>
                        {getOrderStatusLabel(order.status)}
                      </Badge>
                      <Badge variant={getPaymentStatusBadgeVariant(order.paymentStatus)}>
                        {getPaymentStatusLabel(order.paymentStatus)}
                      </Badge>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold text-foreground">{order.totalAmount}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {dateTimeFormatter.format(new Date(order.createdAt))}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <AdminSplitDetailOverviewEmptyState
              title="Aucune commande pour le moment"
              description="Les premières commandes apparaîtront ici dès qu'elles seront créées."
            />
          )}
        </AdminSplitDetailSectionCard>

        <AdminSplitDetailSectionCard tone="secondary">
          <AdminSplitDetailSectionHeader eyebrow="Pilotage" title="Points d'attention" />

          {signals.length > 0 ? (
            <div className="mt-4 space-y-3">
              {signals.map((signal) => {
                const Icon =
                  signal.key === "email"
                    ? MailWarningIcon
                    : signal.key === "preparing"
                      ? TruckIcon
                      : signal.key === "payment"
                        ? AlertTriangleIcon
                        : PackageIcon;

                return (
                  <div
                    key={signal.key}
                    className="rounded-xl border border-surface-border-subtle bg-surface-panel-soft px-4 py-3"
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-surface-panel">
                        <Icon className="size-4 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground">{signal.title}</p>
                        <p className="mt-1 text-xs leading-5 text-muted-foreground">
                          {signal.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-4 rounded-xl border border-surface-border-subtle bg-surface-panel-soft px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-surface-panel">
                  <TruckIcon className="size-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Aucun point bloquant remonté
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Ouvrez une commande dans la liste pour vérifier le paiement, l&apos;email et
                    l&apos;expédition au cas par cas.
                  </p>
                </div>
              </div>
            </div>
          )}
        </AdminSplitDetailSectionCard>
      </AdminSplitDetailOverviewGrid>
    </AdminSplitDetailOverviewShell>
  );
}
