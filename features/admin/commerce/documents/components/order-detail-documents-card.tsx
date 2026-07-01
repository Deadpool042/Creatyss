"use client";

import { useTransition, useState } from "react";
import Link from "next/link";

import {
  AdminSplitDetailSectionCard,
  AdminSplitDetailSectionHeader,
} from "@/components/admin/layout/admin-split-detail-section-card";
import {
  getDocumentTypeLabel,
  getDocumentStatusLabel,
  type AdminOrderDocumentSummary,
} from "@/features/admin/commerce/documents/types/admin-order-document.types";
import { createOrderConfirmationAction } from "@/features/admin/commerce/documents/actions/create-order-confirmation-action";
import { createDeliveryNoteAction } from "@/features/admin/commerce/documents/actions/create-delivery-note-action";
import { issueInvoiceAction } from "@/features/admin/commerce/documents/actions/issue-invoice-action";
import { issueCreditNoteAction } from "@/features/admin/commerce/documents/actions/issue-credit-note-action";

const documentDateFormatter = new Intl.DateTimeFormat("fr-FR", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

function formatDocumentDate(date: Date): string {
  return documentDateFormatter.format(date);
}

function hasActiveOrderConfirmation(documents: AdminOrderDocumentSummary[]): boolean {
  return documents.some(
    (doc) =>
      doc.typeCode === "ORDER_CONFIRMATION" &&
      doc.status !== "CANCELLED" &&
      doc.status !== "ARCHIVED"
  );
}

function hasActiveDeliveryNote(documents: AdminOrderDocumentSummary[]): boolean {
  return documents.some(
    (doc) =>
      doc.typeCode === "DELIVERY_NOTE" && doc.status !== "CANCELLED" && doc.status !== "ARCHIVED"
  );
}

function hasActiveInvoice(documents: AdminOrderDocumentSummary[]): boolean {
  return documents.some(
    (doc) => doc.typeCode === "INVOICE" && doc.status !== "CANCELLED" && doc.status !== "ARCHIVED"
  );
}

function hasActiveCreditNote(documents: AdminOrderDocumentSummary[]): boolean {
  return documents.some(
    (doc) =>
      doc.typeCode === "CREDIT_NOTE" && doc.status !== "CANCELLED" && doc.status !== "ARCHIVED"
  );
}

type OrderDetailDocumentsCardProps = Readonly<{
  documents: AdminOrderDocumentSummary[];
  orderId: string;
}>;

export function OrderDetailDocumentsCard({ documents, orderId }: OrderDetailDocumentsCardProps) {
  const [isPending, startTransition] = useTransition();
  const [generated, setGenerated] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const [isDeliveryNotePending, startDeliveryNoteTransition] = useTransition();
  const [deliveryNoteGenerated, setDeliveryNoteGenerated] = useState(false);
  const [deliveryNoteFeedback, setDeliveryNoteFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [isInvoicePending, startInvoiceTransition] = useTransition();
  const [invoiceGenerated, setInvoiceGenerated] = useState(false);
  const [invoiceFeedback, setInvoiceFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const [isCreditNotePending, startCreditNoteTransition] = useTransition();
  const [creditNoteGenerated, setCreditNoteGenerated] = useState(false);
  const [creditNoteFeedback, setCreditNoteFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const confirmationAlreadyExists = generated || hasActiveOrderConfirmation(documents);
  const deliveryNoteAlreadyExists = deliveryNoteGenerated || hasActiveDeliveryNote(documents);
  const invoiceAlreadyExists = invoiceGenerated || hasActiveInvoice(documents);
  const creditNoteAlreadyExists = creditNoteGenerated || hasActiveCreditNote(documents);

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

  function handleGenerateDeliveryNote(): void {
    setDeliveryNoteFeedback(null);
    startDeliveryNoteTransition(async () => {
      const result = await createDeliveryNoteAction(orderId);
      if (result.success) {
        setDeliveryNoteGenerated(true);
        setDeliveryNoteFeedback({
          type: "success",
          message: "Bon de préparation généré avec succès.",
        });
      } else {
        setDeliveryNoteFeedback({ type: "error", message: result.error });
      }
    });
  }

  function handleIssueInvoice(): void {
    setInvoiceFeedback(null);
    startInvoiceTransition(async () => {
      const result = await issueInvoiceAction(orderId);
      if (result.success) {
        setInvoiceGenerated(true);
        setInvoiceFeedback({ type: "success", message: "Facture émise avec succès." });
      } else {
        setInvoiceFeedback({ type: "error", message: result.error });
      }
    });
  }

  function handleIssueCreditNote(): void {
    setCreditNoteFeedback(null);
    startCreditNoteTransition(async () => {
      const result = await issueCreditNoteAction(orderId);
      if (result.success) {
        setCreditNoteGenerated(true);
        setCreditNoteFeedback({ type: "success", message: "Avoir émis avec succès." });
      } else {
        setCreditNoteFeedback({ type: "error", message: result.error });
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

              <a
                href={`/admin/commerce/documents/${doc.id}/pdf`}
                target="_blank"
                rel="noopener noreferrer"
                className="card-meta w-fit leading-snug font-medium text-primary/80 hover:text-primary"
              >
                Télécharger le PDF
              </a>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-3 grid gap-2">
        {confirmationAlreadyExists ? (
          <p className="card-meta leading-snug text-text-muted-strong">Confirmation déjà générée</p>
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
              feedback.type === "success" ? "text-text-success" : "text-text-alert"
            }`}
          >
            {feedback.message}
          </p>
        ) : null}

        {deliveryNoteAlreadyExists ? (
          <p className="card-meta leading-snug text-text-muted-strong">
            Bon de préparation déjà généré
          </p>
        ) : (
          <button
            type="button"
            onClick={handleGenerateDeliveryNote}
            disabled={isDeliveryNotePending}
            className="w-fit rounded-lg border border-surface-border bg-surface-panel px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-interactive-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeliveryNotePending ? "Génération en cours…" : "Générer le bon de préparation"}
          </button>
        )}

        {deliveryNoteFeedback !== null ? (
          <p
            className={`card-meta leading-snug ${
              deliveryNoteFeedback.type === "success" ? "text-text-success" : "text-text-alert"
            }`}
          >
            {deliveryNoteFeedback.message}
          </p>
        ) : null}

        {invoiceAlreadyExists ? (
          <p className="card-meta leading-snug text-text-muted-strong">Facture déjà émise</p>
        ) : (
          <button
            type="button"
            onClick={handleIssueInvoice}
            disabled={isInvoicePending}
            className="w-fit rounded-lg border border-surface-border bg-surface-panel px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-interactive-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isInvoicePending ? "Émission en cours…" : "Émettre la facture"}
          </button>
        )}

        {invoiceFeedback !== null ? (
          <p
            className={`card-meta leading-snug ${
              invoiceFeedback.type === "success" ? "text-text-success" : "text-text-alert"
            }`}
          >
            {invoiceFeedback.message}
          </p>
        ) : null}

        {invoiceAlreadyExists ? (
          creditNoteAlreadyExists ? (
            <p className="card-meta leading-snug text-text-muted-strong">Avoir déjà émis</p>
          ) : (
            <button
              type="button"
              onClick={handleIssueCreditNote}
              disabled={isCreditNotePending}
              className="w-fit rounded-lg border border-surface-border bg-surface-panel px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-interactive-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isCreditNotePending ? "Émission en cours…" : "Émettre un avoir"}
            </button>
          )
        ) : null}

        {creditNoteFeedback !== null ? (
          <p
            className={`card-meta leading-snug ${
              creditNoteFeedback.type === "success" ? "text-text-success" : "text-text-alert"
            }`}
          >
            {creditNoteFeedback.message}
          </p>
        ) : null}

        <p className="card-meta leading-snug text-text-muted-strong/70">
          La facture PDF au format Factur-X est générée et téléchargeable après émission. La
          validation de conformité externe n&apos;a pas encore été effectuée — à valider avant usage
          en production réelle.
        </p>
      </div>
    </AdminSplitDetailSectionCard>
  );
}
