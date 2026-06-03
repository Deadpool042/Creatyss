import type { AdminOrderPayment } from "@/features/admin/orders/details/types/admin-order-detail.types";
import { SectionIntro } from "@/components/shared/display";

type OrderDetailPaymentCardProps = Readonly<{
  payment: AdminOrderPayment;
}>;

export function OrderDetailPaymentCard({ payment }: OrderDetailPaymentCardProps) {
  return (
    <article className="grid gap-4 rounded-xl border border-surface-border bg-surface-panel p-5 text-foreground shadow-card">
      <SectionIntro className="grid gap-2" eyebrow="Paiement" title="État du paiement" />

      <div className="grid gap-3">
        {payment.provider ? (
          <p className="card-copy rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3 text-sm leading-6 text-foreground">
            Prestataire : {payment.provider}
          </p>
        ) : null}
        {payment.methodType ? (
          <p className="card-copy rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3 text-sm leading-6 text-foreground">
            Méthode : {payment.methodType}
          </p>
        ) : null}
        {payment.amountCaptured ? (
          <p className="card-copy rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3 text-sm leading-6 text-foreground">
            Montant capturé : {payment.amountCaptured}
          </p>
        ) : null}
        {payment.amountAuthorized ? (
          <p className="card-copy rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3 text-sm leading-6 text-foreground">
            Montant autorisé : {payment.amountAuthorized}
          </p>
        ) : null}
        {payment.amountRefunded !== "0.00" ? (
          <p className="card-copy rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3 text-sm leading-6 text-foreground">
            Montant remboursé : {payment.amountRefunded}
          </p>
        ) : null}
        {payment.providerReference ? (
          <p className="card-meta text-sm leading-6 text-text-muted-strong">
            Référence prestataire : {payment.providerReference}
          </p>
        ) : null}
      </div>
    </article>
  );
}
