import type { AdminOrderDetail } from "@/db/repositories/order.repository";
import { SectionIntro } from "@/components/section-intro";

type OrderDetailPaymentCardProps = Readonly<{
  payment: AdminOrderDetail["payment"];
}>;

export function OrderDetailPaymentCard({
  payment
}: OrderDetailPaymentCardProps) {
  return (
    <article className="store-card checkout-line rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm">
      <SectionIntro
        className="grid gap-2"
        eyebrow="Paiement"
        title="État du paiement"
      />

      <div className="grid gap-3">
        <p className="card-copy">Prestataire : {payment.provider}</p>
        <p className="card-copy">Méthode : {payment.method}</p>
        <p className="card-copy">
          Montant : {payment.amount} {payment.currency.toUpperCase()}
        </p>

        {payment.stripeCheckoutSessionId ? (
          <p className="card-meta">
            Session Stripe : {payment.stripeCheckoutSessionId}
          </p>
        ) : null}

        {payment.stripePaymentIntentId ? (
          <p className="card-meta">
            Identifiant de paiement : {payment.stripePaymentIntentId}
          </p>
        ) : null}
      </div>
    </article>
  );
}
