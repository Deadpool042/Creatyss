import Link from "next/link";

import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-overview-content";
import type { AdminOrderDocumentSummary } from "@/features/admin/commerce/documents/types/admin-order-document.types";
import {
  getDocumentTypeLabel,
  getDocumentStatusLabel,
} from "@/features/admin/commerce/documents/types/admin-order-document.types";

const documentDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDocumentDate(date: Date): string {
  return documentDateFormatter.format(date);
}

type OrderDetailDocumentsCardProps = Readonly<{
  documents: AdminOrderDocumentSummary[];
  orderId: string;
}>;

export function OrderDetailDocumentsCard({
  documents,
  orderId,
}: OrderDetailDocumentsCardProps) {
  return (
    <AdminSplitDetailSectionCard tone="secondary">
      <AdminSplitDetailSectionHeader
        eyebrow="Documents"
        title="Documents de commande"
        description="Factures, confirmations et autres documents associés à cette commande."
        action={
          <Link
            href={`/admin/commerce/orders/${orderId}/documents`}
            className="text-sm font-medium text-primary/80 hover:text-primary"
          >
            Voir tout
          </Link>
        }
      />

      {documents.length === 0 ? (
        <p className="card-copy leading-snug text-foreground">
          Aucun document généré pour cette commande.
        </p>
      ) : (
        <ol className="grid gap-2">
          {documents.map((doc) => (
            <li
              key={doc.id}
              className="grid gap-1 rounded-xl border border-surface-border-subtle bg-surface-panel-soft p-3"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="card-copy leading-snug font-medium text-foreground">
                  {getDocumentTypeLabel(doc.typeCode)}
                </p>
                <p className="card-meta leading-snug text-text-muted-strong">
                  {getDocumentStatusLabel(doc.status)}
                </p>
              </div>

              {doc.documentNumber ? (
                <p className="card-meta leading-snug text-text-muted-strong">
                  N° {doc.documentNumber}
                </p>
              ) : null}

              <p className="card-meta leading-snug text-text-muted-strong">
                {doc.issuedAt
                  ? `Émis le ${formatDocumentDate(doc.issuedAt)}`
                  : `Créé le ${formatDocumentDate(doc.createdAt)}`}
              </p>
            </li>
          ))}
        </ol>
      )}

      <p className="mt-3 card-meta leading-snug text-text-muted-strong/70">
        La génération de documents est bientôt disponible.
      </p>
    </AdminSplitDetailSectionCard>
  );
}
