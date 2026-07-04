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
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-section-card";
import { AdminSplitDetailOverviewShell } from "@/components/admin/layout/admin-split-detail-overview-shell";
import { Button } from "@/components/ui/button";
import { getAdminOrdersOverview } from "@/features/admin/commerce/orders/overview/queries/get-admin-orders-overview.query";
import { ADMIN_ORDERS_DETAIL_OVERVIEW_CONTENT_WIDTH } from "@/features/admin/commerce/orders/shared/admin-orders-detail-layout";

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
          description="Repérez ce qui a besoin d'attention avant de descendre dans le détail. La liste à gauche reste le point d'entrée pour parcourir ou filtrer toutes les commandes."
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
      <AdminSplitDetailSectionCard>
        <AdminSplitDetailSectionHeader eyebrow="Pilotage" title="Points d'attention" />

        {signals.length > 0 ? (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
                <div key={signal.key} className="flex items-start gap-3 py-1">
                  <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-panel">
                    <Icon className="size-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">{signal.title}</p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">{signal.detail}</p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="mt-4 flex items-start gap-3">
            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-panel">
              <TruckIcon className="size-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Aucun point bloquant remonté</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Ouvrez une commande dans la liste pour vérifier le paiement, l&apos;email et
                l&apos;expédition au cas par cas.
              </p>
            </div>
          </div>
        )}
      </AdminSplitDetailSectionCard>
    </AdminSplitDetailOverviewShell>
  );
}
