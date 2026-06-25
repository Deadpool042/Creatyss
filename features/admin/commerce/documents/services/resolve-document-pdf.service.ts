import "server-only";

import { getInvoiceSnapshotForDocument } from "@/features/admin/commerce/documents/queries/get-invoice-snapshot-for-document.query";
import { getOrCreateFacturXPdfFile } from "@/features/admin/commerce/documents/services/persist-facturx-pdf.service";
import { renderDocumentPdf } from "@/features/admin/commerce/documents/services/render-document-pdf";
import type { DocumentPdfViewModel } from "@/features/admin/commerce/documents/types/document-pdf.types";

type ResolveDocumentPdfInput = {
  storeId: string;
  documentId: string;
  viewModel: DocumentPdfViewModel;
};

/**
 * Choisit le rendu PDF d'un document : Factur-X (PDF/A-3 + XML EN 16931
 * attaché, mis en cache sur disque via `getOrCreateFacturXPdfFile`) pour
 * une facture émise dont le snapshot est disponible, rendu générique
 * existant sinon (autres types de document, ou facture sans
 * snapshot/numéro encore alloué). Seul point de branchement entre
 * l'émission et le téléchargement existants — pas d'avoir (`CREDIT_NOTE`)
 * dans ce lot.
 */
export async function resolveDocumentPdfBytes(input: ResolveDocumentPdfInput): Promise<Uint8Array> {
  if (input.viewModel.docType === "INVOICE") {
    const invoice = await getInvoiceSnapshotForDocument(input.storeId, input.documentId);
    if (invoice !== null) {
      return getOrCreateFacturXPdfFile({
        documentId: input.documentId,
        storeId: input.storeId,
        documentNumber: invoice.documentNumber,
        snapshot: invoice.snapshot,
      });
    }
  }

  return renderDocumentPdf(input.viewModel);
}
