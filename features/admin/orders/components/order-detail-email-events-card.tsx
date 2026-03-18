import type { AdminOrderDetail } from "@/db/repositories/order.repository";
import { SectionIntro } from "@/components/shared/section-intro";
import {
  formatOrderDateTime,
  getEmailEventLabel,
  getEmailEventStatusLabel
} from "../mappers/order-detail-mappers";

type OrderDetailEmailEventsCardProps = Readonly<{
  emailEvents: AdminOrderDetail["emailEvents"];
}>;

export function OrderDetailEmailEventsCard({
  emailEvents
}: OrderDetailEmailEventsCardProps) {
  return (
    <article className="grid gap-4 rounded-xl border border-border/70 bg-card p-5 text-card-foreground shadow-sm">
      <SectionIntro
        className="grid gap-2"
        eyebrow="Emails transactionnels"
        title="Trace minimale"
      />

      {emailEvents.length === 0 ? (
        <p className="card-copy text-sm leading-6 text-foreground">
          Aucun e-mail transactionnel n&apos;a encore été enregistré pour cette
          commande.
        </p>
      ) : (
        <div className="grid gap-3">
          {emailEvents.map(emailEvent => (
            <article
              className="grid gap-3 rounded-lg border border-border/60 bg-muted/10 p-4"
              key={emailEvent.id}>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="grid gap-1">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Événement
                  </p>
                  <p className="card-copy text-sm font-medium leading-6 text-foreground">
                    {getEmailEventLabel(emailEvent.eventType)}
                  </p>
                </div>

                <div className="grid gap-1">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Statut
                  </p>
                  <p className="card-copy text-sm font-medium leading-6 text-foreground">
                    {getEmailEventStatusLabel(emailEvent.status)}
                  </p>
                </div>

                <div className="grid gap-1">
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Destinataire
                  </p>
                  <p className="card-copy text-sm font-medium leading-6 text-foreground">
                    {emailEvent.recipientEmail}
                  </p>
                </div>
              </div>

              {emailEvent.sentAt ? (
                <p className="card-meta text-sm leading-6 text-muted-foreground">
                  Envoyé le {formatOrderDateTime(emailEvent.sentAt)}
                </p>
              ) : null}

              {emailEvent.lastError ? (
                <p className="card-meta text-sm leading-6 text-muted-foreground">
                  Erreur : {emailEvent.lastError}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </article>
  );
}
