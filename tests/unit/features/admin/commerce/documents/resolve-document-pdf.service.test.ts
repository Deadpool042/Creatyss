import { beforeEach, describe, expect, it, vi } from "vitest";
import type { DocumentPdfViewModel } from "@/features/admin/commerce/documents/types/document-pdf.types";
import type { InvoiceSnapshot } from "@/features/admin/commerce/documents/types/invoice-snapshot.types";

vi.mock(
  "@/features/admin/commerce/documents/queries/get-invoice-snapshot-for-document.query",
  () => ({
    getInvoiceSnapshotForDocument: vi.fn(),
  })
);

vi.mock("@/features/admin/commerce/documents/services/render-document-pdf", () => ({
  renderDocumentPdf: vi.fn(),
}));

import { getInvoiceSnapshotForDocument } from "@/features/admin/commerce/documents/queries/get-invoice-snapshot-for-document.query";
import { renderDocumentPdf } from "@/features/admin/commerce/documents/services/render-document-pdf";
import { resolveDocumentPdfBytes } from "@/features/admin/commerce/documents/services/resolve-document-pdf.service";

const mockGetInvoiceSnapshot = getInvoiceSnapshotForDocument as ReturnType<typeof vi.fn>;
const mockRenderDocumentPdf = renderDocumentPdf as ReturnType<typeof vi.fn>;

const STORE_ID = "store_1";
const DOCUMENT_ID = "doc_1";

const SNAPSHOT: InvoiceSnapshot = {
  schema: "creatyss.invoice.v1",
  issuedAt: "2026-06-25T10:00:00.000Z",
  orderNumber: "CMD-2026-0001",
  currencyCode: "EUR",
  seller: {
    legalName: "Creatyss SAS",
    siret: "12345678900012",
    vatNumber: "FR12345678900",
    addressLine1: "1 rue de la Paix",
    postalCode: "75002",
    city: "Paris",
    country: "FR",
  },
  buyer: {
    firstName: "Jean",
    lastName: "Dupont",
    company: null,
    email: "jean.dupont@example.com",
    line1: "2 avenue des Champs",
    line2: null,
    postalCode: "69000",
    city: "Lyon",
    countryCode: "FR",
  },
  lines: [
    {
      productName: "Sac en cuir",
      variantName: null,
      sku: "SAC-001",
      quantity: 1,
      grossAmount: 120,
      netAmount: 100,
      taxAmount: 20,
      taxRatePercent: 20,
      taxTerritory: "FR",
    },
  ],
  totals: { netAmount: 100, taxAmount: 20, grossAmount: 120 },
};

function invoiceViewModel(): DocumentPdfViewModel {
  return {
    docType: "INVOICE",
    documentNumber: "FA-2026-0001",
    dateLabel: "25 juin 2026",
    currency: "EUR",
    seller: {
      name: "Creatyss SAS",
      siret: "12345678900012",
      vatNumber: "FR12345678900",
      address: null,
    },
    buyer: { name: "Jean Dupont", email: "jean.dupont@example.com", address: null },
    orderNumber: "CMD-2026-0001",
    lines: [],
    totals: { net: 100, tax: 20, gross: 120 },
    showTax: true,
  };
}

beforeEach(() => {
  mockGetInvoiceSnapshot.mockReset();
  mockRenderDocumentPdf.mockReset();
});

describe("resolveDocumentPdfBytes", () => {
  it("produit un PDF Factur-X (PDF/A-3 + XML attaché) pour une facture avec snapshot", async () => {
    mockGetInvoiceSnapshot.mockResolvedValue({
      snapshot: SNAPSHOT,
      documentNumber: "FA-2026-0001",
    });

    const bytes = await resolveDocumentPdfBytes({
      storeId: STORE_ID,
      documentId: DOCUMENT_ID,
      viewModel: invoiceViewModel(),
    });

    expect(mockRenderDocumentPdf).not.toHaveBeenCalled();
    const text = Buffer.from(bytes).toString("latin1");
    expect(text).toContain("<fx:DocumentFileName>factur-x.xml</fx:DocumentFileName>");
  });

  it("retombe sur le rendu générique pour une facture sans snapshot", async () => {
    mockGetInvoiceSnapshot.mockResolvedValue(null);
    mockRenderDocumentPdf.mockResolvedValue(new Uint8Array([1, 2, 3]));

    const bytes = await resolveDocumentPdfBytes({
      storeId: STORE_ID,
      documentId: DOCUMENT_ID,
      viewModel: invoiceViewModel(),
    });

    expect(mockRenderDocumentPdf).toHaveBeenCalledTimes(1);
    expect(bytes).toEqual(new Uint8Array([1, 2, 3]));
  });

  it("retombe sur le rendu générique pour un type de document autre que INVOICE", async () => {
    mockRenderDocumentPdf.mockResolvedValue(new Uint8Array([4, 5, 6]));
    const viewModel: DocumentPdfViewModel = { ...invoiceViewModel(), docType: "CREDIT_NOTE" };

    const bytes = await resolveDocumentPdfBytes({
      storeId: STORE_ID,
      documentId: DOCUMENT_ID,
      viewModel,
    });

    expect(mockGetInvoiceSnapshot).not.toHaveBeenCalled();
    expect(mockRenderDocumentPdf).toHaveBeenCalledTimes(1);
    expect(bytes).toEqual(new Uint8Array([4, 5, 6]));
  });
});
