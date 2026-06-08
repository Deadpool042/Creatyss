"use client";

import { useTransition, useState } from "react";
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
import { createOrderConfirmationAction } from "@/features/admin/commerce/documents/actions/create-order-confirmation-action";

const documentDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDocumentDate(date: Date): string {
  return documentDateFormatter.format(date);
}

function hasActiveOrderConfirmation(
  documents: AdminOrderDocumentSummary[]
): boolean {
  return documents.some(
    (doc) =>
      doc.typeCode === "ORDER_CONFIRMATION" &&
      doc.status !== "CANCELLED" &&
      doc.status !== "ARCHIVED"
  );
}

type OrderDetailDocumentsCardProps = Readonly<{
  documents: AdminOrderDocumentSummary[];
  orderId: string;
}>;

export function OrderDetailDocumentsCard({
  documents,
  orderId,
}: OrderDetailDocumentsCardProps) {
  const [isPending, startTransition] = useTransition();
  const [generated, setGenerated] = useState(false);
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | null
  >(null);

  const confirmationAlreadyExists = generated || hasActiveOrderConfirmation(documents);

  function handleGenerateConfirmation(): void {
    setFeedback(null);
    startTransition(async () => {
      const result = await createOrderConfirmationAction(orderId);
      if (result.success) {
        setGenerated(true);
        setFeedback({
          type: "success",
          message: "Confirmation générée avec succès.",
        });
      } else {
        setFeedback({ type: "error", message: result.error });
      }
    });
  }

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

      <div className="mt-3 grid gap-2">
        {confirmationAlreadyExists ? (
          <p className="card-meta leading-snug text-text-muted-strong">
            Confirmation déjà générée
          </p>
        ) : (
          <button
            type="button"
            onClick={handleGenerateConfirmation}
            disabled={isPending}
            className="w-fit rounded-lg border border-surface-border bg-surface-panel px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-interactive-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Génération en cours…" : "Générer la confirmation"}
          </button>
        )}

        {feedback !== null ? (
          <p
            className={`card-meta leading-snug ${
              feedback.type === "success"
                ? "text-text-success"
                : "text-text-alert"
            }`}
          >
            {feedback.message}
          </p>
        ) : null}

        <p className="card-meta leading-snug text-text-muted-strong/70">
          La génération PDF sera disponible prochainement.
        </p>
      </div>
    </AdminSplitDetailSectionCard>
  );
}
