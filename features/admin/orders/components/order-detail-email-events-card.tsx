import type { AdminOrderDetail } from "@/features/admin/orders/types/order-detail-types";
import { SectionIntro } from "@/components/shared/display";
import {
  formatOrderDateTime,
  getEmailEventLabel,
  getEmailEventStatusLabel,
} from "../mappers/order-detail-mappers";

type OrderDetailEmailEventsCardProps = Readonly<{
  emailEvents: AdminOrderDetail["emailEvents"];
}>;

export function OrderDetailEmailEventsCard({ emailEvents }: OrderDetailEmailEventsCardProps) {
  return (
    <article className="grid gap-4 rounded-xl border border-surface-border bg-surface-panel p-5 text-card-foreground shadow-card">
      <SectionIntro
        className="grid gap-2"
        eyebrow="Emails transactionnels"
        title="Trace minimale"
      />

      {emailEvents.length === 0 ? (
        <p className="card-copy leading-snug text-foreground">
          Aucun e-mail transactionnel n&apos;a encore été enregistré pour cette commande.
        </p>
      ) : (
        <div className="grid gap-3">
          {emailEvents.map((emailEvent) => (
            <article
              className="grid gap-3 rounded-lg border border-surface-border-subtle bg-surface-panel-soft p-4"
              key={emailEvent.id}
            >
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="grid gap-1">
                  <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">
                    Événement
                  </p>
                  <p className="card-copy leading-snug font-medium text-foreground">
                    {getEmailEventLabel(emailEvent.eventType)}
                  </p>
                </div>

                <div className="grid gap-1">
                  <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">
                    Statut
                  </p>
                  <p className="card-copy leading-snug font-medium text-foreground">
                    {getEmailEventStatusLabel(emailEvent.status)}
                  </p>
                </div>

                <div className="grid gap-1">
                  <p className="text-xs font-semibold uppercase tracking-widest leading-snug text-text-muted-soft">
                    Destinataire
                  </p>
                  <p className="card-copy leading-snug font-medium text-foreground">
                    {emailEvent.recipientEmail}
                  </p>
                </div>
              </div>

              {emailEvent.sentAt ? (
                <p className="card-meta leading-snug text-text-muted-strong">
                  Envoyé le {formatOrderDateTime(emailEvent.sentAt)}
                </p>
              ) : null}

              {emailEvent.lastError ? (
                <p className="card-meta leading-snug text-text-muted-strong">
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
