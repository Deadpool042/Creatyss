import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import { getDocumentPdfData } from "@/features/admin/commerce/documents/queries/get-document-pdf-data.query";
import { renderDocumentPdf } from "@/features/admin/commerce/documents/services/render-document-pdf";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ documentId: string }> }
): Promise<Response> {
  await requireAuthenticatedAdmin();

  const storeId = await getCurrentStoreId();
  if (storeId === null) {
    return new Response("Boutique introuvable.", { status: 404 });
  }

  const { documentId } = await context.params;
  const viewModel = await getDocumentPdfData(storeId, documentId);
  if (viewModel === null) {
    return new Response("Document introuvable.", { status: 404 });
  }

  const pdfBytes = await renderDocumentPdf(viewModel);
  const filename = `${viewModel.documentNumber ?? viewModel.docType}.pdf`;

  return new Response(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
