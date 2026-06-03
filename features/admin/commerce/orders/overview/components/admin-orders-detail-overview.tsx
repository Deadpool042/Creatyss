import Link from "next/link";
import {
  AlertTriangleIcon,
  MailWarningIcon,
  PackageIcon,
  ShoppingBagIcon,
  TruckIcon,
} from "lucide-react";

import { AdminPageShell } from "@/components/admin/layout/admin-page-shell";
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

function OverviewMetric(props: { label: string; value: number; hint: string }) {
  return (
    <div className="rounded-[1.35rem] border border-surface-border/60 bg-surface-panel/70 px-4 py-4 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
        {props.label}
      </p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{props.value}</p>
      <p className="mt-1 text-xs leading-5 text-muted-foreground">{props.hint}</p>
    </div>
  );
}

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
    <AdminPageShell
      scrollMode="area"
      title="Commandes"
      contentPreset="full-width"
      showBreadcrumbsInContent={false}
      header={
        <div className="hidden px-4 pt-1 md:px-5 lg:flex lg:flex-col lg:items-center lg:justify-center lg:gap-3 lg:px-6 lg:pb-1">
          <div className="flex size-11 items-center justify-center rounded-[1.15rem] border border-white/70 bg-white/72 shadow-sm backdrop-blur-xl">
            <ShoppingBagIcon className="size-5 text-muted-foreground" />
          </div>
          <div className="text-center">
            <h1 className="text-[1.45rem] font-semibold tracking-tight text-foreground">
              Vue d&apos;ensemble commandes
            </h1>
            <p className="mt-1 text-sm leading-5 text-muted-foreground">
              Gardez un point d&apos;entrée clair sur les commandes à traiter avant de descendre dans le détail.
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <OverviewMetric
            label="Total"
            value={stats.totalCount}
            hint={`${stats.shippedCount} expédiée${stats.shippedCount > 1 ? "s" : ""} · ${stats.cancelledCount} annulée${stats.cancelledCount > 1 ? "s" : ""}`}
          />
          <OverviewMetric
            label="À préparer"
            value={stats.paidCount}
            hint={
              stats.paidCount > 0
                ? "Commandes payées en attente de prise en charge."
                : "Aucune commande payée en attente."
            }
          />
          <OverviewMetric
            label="À expédier"
            value={stats.preparingCount}
            hint={
              stats.preparingCount > 0
                ? "Commandes en préparation prêtes à sortir."
                : "Aucune expédition urgente."
            }
          />
          <OverviewMetric
            label="Emails en échec"
            value={stats.failedEmailCount}
            hint={
              stats.failedEmailCount > 0
                ? "Les commandes restent lisibles, mais les traces demandent un suivi."
                : "Aucun incident email remonté."
            }
          />
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.85fr)]">
          <section className="rounded-[1.65rem] border border-surface-border/60 bg-surface-panel/70 p-5 shadow-sm">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/80">
                  Récentes
                </p>
                <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
                  Dernières commandes
                </h2>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  Ouvrez directement une commande prioritaire depuis ce panneau.
                </p>
              </div>
              <Button asChild size="sm" className="rounded-full">
                <Link href="/admin/commerce/overview">Vue commerce</Link>
              </Button>
            </div>

            {stats.recentOrders.length > 0 ? (
              <div className="mt-5 space-y-2">
                {stats.recentOrders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/admin/commerce/orders/${order.id}`}
                    className="flex items-start justify-between gap-3 rounded-[1.1rem] border border-white/70 bg-white/74 px-4 py-3 transition-colors hover:bg-white"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{order.reference}</p>
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
              <div className="mt-5 rounded-[1.4rem] border border-dashed border-surface-border/70 bg-white/45 px-5 py-8 text-center">
                <p className="text-sm font-medium text-foreground">Aucune commande pour le moment</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Les premières commandes apparaîtront ici dès qu&apos;elles seront créées.
                </p>
              </div>
            )}
          </section>

          <section className="rounded-[1.65rem] border border-surface-border/60 bg-surface-panel/64 p-5 shadow-sm">
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-primary/80">
              Pilotage
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-foreground">
              Points d&apos;attention
            </h2>

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
                      className="rounded-[1.1rem] border border-surface-border/60 bg-white/72 px-4 py-3"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-surface-panel/80">
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
              <div className="mt-4 rounded-[1.1rem] border border-surface-border/60 bg-white/72 px-4 py-4">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-surface-panel/80">
                    <TruckIcon className="size-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Aucun point bloquant remonté</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      Ouvrez une commande dans la liste pour vérifier le paiement, l&apos;email et l&apos;expédition au cas par cas.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </AdminPageShell>
  );
}
