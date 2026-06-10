import type { AdminOrderPayment } from "@/features/admin/commerce/orders/details/types/admin-order-detail.types";

function getPaymentMethodTypeLabel(methodType: string | null): string | null {
  switch (methodType) {
    case "BANK_TRANSFER": return "Virement bancaire";
    case "CASH_ON_DELIVERY": return "Paiement à l'atelier";
    case "CARD": return "Carte bancaire";
    case "WALLET": return "Portefeuille électronique";
    case "OTHER": return "Autre";
    default: return methodType;
  }
}
import {
  AdminSplitDetailFact,
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-section-card";
import { Badge } from "@/components/ui/badge";
import { getPaymentStatusLabel } from "@/entities/order/order-status-presentation";
import { getPaymentStatusBadgeVariant } from "@/features/admin/commerce/orders/config/order-ui.config";

type OrderDetailPaymentCardProps = Readonly<{
  payment: AdminOrderPayment;
}>;

export function OrderDetailPaymentCard({ payment }: OrderDetailPaymentCardProps) {
  return (
    <AdminSplitDetailSectionCard tone="secondary">
      <AdminSplitDetailSectionHeader eyebrow="Paiement" title="État du paiement" />

      <div className="flex flex-wrap gap-2">
        <Badge variant={getPaymentStatusBadgeVariant(payment.status)}>
          {getPaymentStatusLabel(payment.status)}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {payment.provider ? (
          <AdminSplitDetailFact
            className="rounded-none border-0 bg-transparent px-0 py-0 shadow-none"
            label="Prestataire"
            value={payment.provider}
          />
        ) : null}
        {payment.methodType ? (
          <AdminSplitDetailFact
            className="rounded-none border-0 bg-transparent px-0 py-0 shadow-none"
            label="Méthode"
            value={getPaymentMethodTypeLabel(payment.methodType) ?? payment.methodType}
          />
        ) : null}
        {payment.amountCaptured ? (
          <AdminSplitDetailFact
            className="rounded-none border-0 bg-transparent px-0 py-0 shadow-none"
            label="Montant capturé"
            value={payment.amountCaptured}
          />
        ) : null}
        {payment.amountAuthorized ? (
          <AdminSplitDetailFact
            className="rounded-none border-0 bg-transparent px-0 py-0 shadow-none"
            label="Montant autorisé"
            value={payment.amountAuthorized}
          />
        ) : null}
        {payment.amountRefunded !== "0.00" ? (
          <AdminSplitDetailFact
            className="rounded-none border-0 bg-transparent px-0 py-0 shadow-none"
            label="Montant remboursé"
            value={payment.amountRefunded}
          />
        ) : null}
      </div>

      {payment.providerReference ? (
        <p className="card-meta text-sm leading-6 text-text-muted-strong">
          Référence prestataire : {payment.providerReference}
        </p>
      ) : null}
    </AdminSplitDetailSectionCard>
  );
}
