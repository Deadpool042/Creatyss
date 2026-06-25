import path from "node:path";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { InvoiceSnapshot } from "@/features/admin/commerce/documents/types/invoice-snapshot.types";

vi.mock("node:fs/promises", () => ({
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));

vi.mock("@/core/db", () => ({
  db: { document: { update: vi.fn() } },
}));

import { readFile, writeFile, mkdir } from "node:fs/promises";
import { db } from "@/core/db";
import { getOrCreateFacturXPdfFile } from "@/features/admin/commerce/documents/services/persist-facturx-pdf.service";

const mockReadFile = readFile as ReturnType<typeof vi.fn>;
const mockWriteFile = writeFile as ReturnType<typeof vi.fn>;
const mockMkdir = mkdir as ReturnType<typeof vi.fn>;
const mockUpdate = (db as unknown as { document: { update: ReturnType<typeof vi.fn> } }).document
  .update;

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

const INPUT = {
  documentId: "doc_1",
  storeId: "store_1",
  documentNumber: "FA-2026-0001",
  snapshot: SNAPSHOT,
};

beforeEach(() => {
  mockReadFile.mockReset();
  mockWriteFile.mockReset();
  mockMkdir.mockReset();
  mockUpdate.mockReset();
});

describe("getOrCreateFacturXPdfFile", () => {
  it("retourne le fichier en cache s'il existe déjà sur disque (cache-hit)", async () => {
    const cachedBytes = new Uint8Array([1, 2, 3]);
    mockReadFile.mockResolvedValue(cachedBytes);

    const bytes = await getOrCreateFacturXPdfFile(INPUT);

    expect(bytes).toBe(cachedBytes);
    expect(mockWriteFile).not.toHaveBeenCalled();
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("régénère, écrit sur disque et met à jour le Document si le fichier est absent (cache-miss / auto-réparation)", async () => {
    mockReadFile.mockRejectedValue(Object.assign(new Error("not found"), { code: "ENOENT" }));
    mockMkdir.mockResolvedValue(undefined);
    mockWriteFile.mockResolvedValue(undefined);
    mockUpdate.mockResolvedValue({});

    const bytes = await getOrCreateFacturXPdfFile(INPUT);

    const text = Buffer.from(bytes).toString("latin1");
    expect(text).toContain("<fx:DocumentFileName>factur-x.xml</fx:DocumentFileName>");

    expect(mockWriteFile).toHaveBeenCalledTimes(1);
    const [writtenPath, writtenBytes] = mockWriteFile.mock.calls[0] as [string, Uint8Array];
    expect(writtenPath).toContain(path.join("invoices", "store_1", "FA-2026-0001.pdf"));
    expect(writtenBytes).toBe(bytes);

    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "doc_1" },
      data: {
        storageKey: path.join("invoices", "store_1", "FA-2026-0001.pdf"),
        fileName: "FA-2026-0001.pdf",
        mimeType: "application/pdf",
      },
    });
  });
});
