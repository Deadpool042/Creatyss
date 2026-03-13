import type { AdminOrderDetail } from "@/db/repositories/order.repository";
import { SectionIntro } from "@/components/section-intro";
import {
  formatOrderDateTime,
  getEmailEventLabel,
  getEmailEventStatusLabel
} from "./order-detail-helpers";

type OrderDetailEmailEventsCardProps = Readonly<{
  emailEvents: AdminOrderDetail["emailEvents"];
}>;

export function OrderDetailEmailEventsCard({
  emailEvents
}: OrderDetailEmailEventsCardProps) {
  return (
    <article className="store-card checkout-line rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm">
      <div className="stack gap-2">
        <SectionIntro
          className="grid gap-2"
          eyebrow="Emails transactionnels"
          title="Trace minimale"
        />

        {emailEvents.length === 0 ? (
          <p className="card-copy">
            Aucun e-mail transactionnel n&apos;a encore été enregistré pour
            cette commande.
          </p>
        ) : (
          <div className="checkout-line-list">
            {emailEvents.map(emailEvent => (
              <article
                className="store-card checkout-line rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm"
                key={emailEvent.id}>
                <div className="stack">
                  <p className="meta-label">Événement</p>
                  <p className="card-copy">
                    {getEmailEventLabel(emailEvent.eventType)}
                  </p>
                </div>

                <div className="stack">
                  <p className="meta-label">Statut</p>
                  <p className="card-copy">
                    {getEmailEventStatusLabel(emailEvent.status)}
                  </p>
                </div>

                <div className="stack">
                  <p className="meta-label">Destinataire</p>
                  <p className="card-copy">{emailEvent.recipientEmail}</p>
                </div>

                {emailEvent.sentAt ? (
                  <p className="card-meta">
                    Envoyé le {formatOrderDateTime(emailEvent.sentAt)}
                  </p>
                ) : null}

                {emailEvent.lastError ? (
                  <p className="card-meta">
                    Erreur : {emailEvent.lastError}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
