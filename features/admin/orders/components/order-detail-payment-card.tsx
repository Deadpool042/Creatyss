import type { AdminOrderDetail } from "@/db/repositories/order.repository";
import { SectionIntro } from "@/components/shared/section-intro";

type OrderDetailPaymentCardProps = Readonly<{
  payment: AdminOrderDetail["payment"];
}>;

export function OrderDetailPaymentCard({
  payment
}: OrderDetailPaymentCardProps) {
  return (
    <article className="grid gap-4 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm">
      <SectionIntro
        className="grid gap-2"
        eyebrow="Paiement"
        title="État du paiement"
      />

      <div className="grid gap-3">
        <p className="card-copy rounded-lg border border-border/60 bg-muted/10 p-3 text-sm leading-6 text-foreground">
          Prestataire : {payment.provider}
        </p>
        <p className="card-copy rounded-lg border border-border/60 bg-muted/10 p-3 text-sm leading-6 text-foreground">
          Méthode : {payment.method}
        </p>
        <p className="card-copy rounded-lg border border-border/60 bg-muted/10 p-3 text-sm leading-6 text-foreground">
          Montant : {payment.amount} {payment.currency.toUpperCase()}
        </p>

        {payment.stripeCheckoutSessionId ? (
          <p className="card-meta text-sm leading-6 text-muted-foreground">
            Session Stripe : {payment.stripeCheckoutSessionId}
          </p>
        ) : null}

        {payment.stripePaymentIntentId ? (
          <p className="card-meta text-sm leading-6 text-muted-foreground">
            Identifiant de paiement : {payment.stripePaymentIntentId}
          </p>
        ) : null}
      </div>
    </article>
  );
}
