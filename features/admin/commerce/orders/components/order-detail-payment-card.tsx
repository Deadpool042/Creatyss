import type { AdminOrderPayment } from "@/features/admin/commerce/orders/details/types/admin-order-detail.types";
import { SectionIntro } from "@/components/shared/display";
import { Badge } from "@/components/ui/badge";
import { getPaymentStatusLabel } from "@/entities/order/order-status-presentation";
import { getPaymentStatusBadgeVariant } from "@/features/admin/commerce/orders/config/order-ui.config";

type OrderDetailPaymentCardProps = Readonly<{
  payment: AdminOrderPayment;
}>;

export function OrderDetailPaymentCard({ payment }: OrderDetailPaymentCardProps) {
  return (
    <article className="grid gap-4 rounded-xl border border-surface-border bg-surface-panel p-5 text-foreground shadow-card">
      <SectionIntro className="grid gap-2" eyebrow="Paiement" title="État du paiement" />

      <div className="flex flex-wrap gap-2">
        <Badge variant={getPaymentStatusBadgeVariant(payment.status)}>
          {getPaymentStatusLabel(payment.status)}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {payment.provider ? (
          <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
              Prestataire
            </p>
            <p className="mt-1 text-sm font-medium leading-6 text-foreground">{payment.provider}</p>
          </div>
        ) : null}
        {payment.methodType ? (
          <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
              Méthode
            </p>
            <p className="mt-1 text-sm font-medium leading-6 text-foreground">
              {payment.methodType}
            </p>
          </div>
        ) : null}
        {payment.amountCaptured ? (
          <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
              Montant capturé
            </p>
            <p className="mt-1 text-sm font-medium leading-6 text-foreground">
              {payment.amountCaptured}
            </p>
          </div>
        ) : null}
        {payment.amountAuthorized ? (
          <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
              Montant autorisé
            </p>
            <p className="mt-1 text-sm font-medium leading-6 text-foreground">
              {payment.amountAuthorized}
            </p>
          </div>
        ) : null}
        {payment.amountRefunded !== "0.00" ? (
          <div className="rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-text-muted-soft">
              Montant remboursé
            </p>
            <p className="mt-1 text-sm font-medium leading-6 text-foreground">
              {payment.amountRefunded}
            </p>
          </div>
        ) : null}
      </div>

      {payment.providerReference ? (
        <p className="card-meta text-sm leading-6 text-text-muted-strong">
          Référence prestataire : {payment.providerReference}
        </p>
      ) : null}
    </article>
  );
}
