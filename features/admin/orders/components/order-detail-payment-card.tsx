import type { AdminOrderDetail } from "@/features/admin/orders/types/order-detail-types";
import { SectionIntro } from "@/components/shared/section-intro";

type OrderDetailPaymentCardProps = Readonly<{
  payment: AdminOrderDetail["payment"];
}>;

export function OrderDetailPaymentCard({ payment }: OrderDetailPaymentCardProps) {
  return (
    <article className="grid gap-4 rounded-xl border border-surface-border bg-surface-panel p-5 text-card-foreground shadow-card">
      <SectionIntro className="grid gap-2" eyebrow="Paiement" title="État du paiement" />

      <div className="grid gap-3">
        <p className="card-copy rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3 text-sm leading-6 text-foreground">
          Prestataire : {payment.provider}
        </p>
        <p className="card-copy rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3 text-sm leading-6 text-foreground">
          Méthode : {payment.method}
        </p>
        <p className="card-copy rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-3 text-sm leading-6 text-foreground">
          Montant : {payment.amount} {payment.currency.toUpperCase()}
        </p>

        {payment.stripeCheckoutSessionId ? (
          <p className="card-meta text-sm leading-6 text-text-muted-strong">
            Session Stripe : {payment.stripeCheckoutSessionId}
          </p>
        ) : null}

        {payment.stripePaymentIntentId ? (
          <p className="card-meta text-sm leading-6 text-text-muted-strong">
            Identifiant de paiement : {payment.stripePaymentIntentId}
          </p>
        ) : null}
      </div>
    </article>
  );
}
