import type { AdminOrderDetail } from "@/features/admin/orders/types/order-detail-types";
import { SectionIntro } from "@/components/shared/display";
import {
  formatOrderDateTime,
  getEmailEventLabel,
  getEmailEventFailurePresentation,
  getEmailEventStatusLabel,
} from "../mappers/order-detail-mappers";

type OrderDetailEmailEventsCardProps = Readonly<{
  emailEvents: AdminOrderDetail["emailEvents"];
}>;

export function OrderDetailEmailEventsCard({ emailEvents }: OrderDetailEmailEventsCardProps) {
  return (
    <article className="grid gap-4 rounded-xl border border-surface-border bg-surface-panel p-5 text-foreground shadow-card">
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
            (() => {
              const failurePresentation = getEmailEventFailurePresentation(emailEvent);

              return (
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

                  {failurePresentation ? (
                    <div className="grid gap-2 rounded-lg border border-surface-border bg-surface-panel p-3">
                      <div className="grid gap-1">
                        <p className="card-copy leading-snug font-medium text-foreground">
                          {failurePresentation.title}
                        </p>
                        <p className="card-meta leading-snug text-text-muted-strong">
                          {failurePresentation.summary}
                        </p>
                      </div>

                      <details className="grid gap-2">
                        <summary className="cursor-pointer text-sm font-medium text-foreground/80">
                          Détail technique
                        </summary>
                        <div className="grid gap-1 text-sm text-text-muted-strong">
                          <p>Provider : {emailEvent.provider}</p>
                          {emailEvent.providerMessageId ? (
                            <p>Référence provider : {emailEvent.providerMessageId}</p>
                          ) : null}
                          <p className="break-words">
                            Message technique : {failurePresentation.technicalDetail}
                          </p>
                        </div>
                      </details>
                    </div>
                  ) : null}
                </article>
              );
            })()
          ))}
        </div>
      )}
    </article>
  );
}
