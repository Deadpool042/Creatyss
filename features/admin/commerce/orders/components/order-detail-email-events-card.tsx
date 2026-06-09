import type { AdminOrderDetail } from "@/features/admin/commerce/orders/types/order-detail-types";
import {
  AdminSplitDetailFact,
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-section-card";
import {
  formatOrderDateTime,
  getEmailEventLabel,
  getEmailEventFailurePresentation,
  getEmailEventStatusLabel,
} from "../mappers/order-detail-mappers";

type OrderDetailEmailEventsCardProps = Readonly<{
  emailEvents: AdminOrderDetail["emailEvents"];
}>;

type EmailEventRowProps = Readonly<{
  emailEvent: AdminOrderDetail["emailEvents"][number];
}>;

function EmailEventRow({ emailEvent }: EmailEventRowProps) {
  const failurePresentation = getEmailEventFailurePresentation(emailEvent);

  return (
    <article className="grid gap-3 py-1" key={emailEvent.id}>
      <div className="grid gap-3 sm:grid-cols-3">
        <AdminSplitDetailFact
          className="rounded-none border-0 bg-transparent px-0 py-0 shadow-none"
          label="Événement"
          value={getEmailEventLabel(emailEvent.eventType)}
        />
        <AdminSplitDetailFact
          className="rounded-none border-0 bg-transparent px-0 py-0 shadow-none"
          label="Statut"
          value={getEmailEventStatusLabel(emailEvent.status)}
        />
        <AdminSplitDetailFact
          className="rounded-none border-0 bg-transparent px-0 py-0 shadow-none"
          label="Destinataire"
          value={emailEvent.recipientEmail}
        />
      </div>

      {emailEvent.sentAt ? (
        <p className="card-meta leading-snug text-text-muted-strong">
          Envoyé le {formatOrderDateTime(emailEvent.sentAt)}
        </p>
      ) : null}

      {failurePresentation ? (
        <div className="grid gap-2 pt-1">
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
              <p className="wrap-break-word">
                Message technique : {failurePresentation.technicalDetail}
              </p>
            </div>
          </details>
        </div>
      ) : null}
    </article>
  );
}

export function OrderDetailEmailEventsCard({ emailEvents }: OrderDetailEmailEventsCardProps) {
  return (
    <AdminSplitDetailSectionCard tone="secondary">
      <AdminSplitDetailSectionHeader
        eyebrow="Emails transactionnels"
        title="Trace minimale"
        description="Le message principal reste opératoire. Le détail technique n'apparaît qu'en second niveau."
      />

      {emailEvents.length === 0 ? (
        <p className="card-copy leading-snug text-foreground">
          Aucun e-mail transactionnel n&apos;a encore été enregistré pour cette commande.
        </p>
      ) : (
        <div className="grid gap-3">
          {emailEvents.map((emailEvent) => (
            <EmailEventRow emailEvent={emailEvent} key={emailEvent.id} />
          ))}
        </div>
      )}
    </AdminSplitDetailSectionCard>
  );
}
