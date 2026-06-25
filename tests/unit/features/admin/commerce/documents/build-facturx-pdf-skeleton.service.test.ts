import { PDFArray, PDFDict, PDFDocument, PDFName, PDFNumber, PDFRawStream } from "pdf-lib";
import { describe, expect, it } from "vitest";
import { buildFacturXPdfSkeleton } from "@/features/admin/commerce/documents/services/build-facturx-pdf-skeleton.service";

describe("buildFacturXPdfSkeleton", () => {
  it("produit un PDF rechargeable avec une seule page", async () => {
    const bytes = await buildFacturXPdfSkeleton();
    const reloaded = await PDFDocument.load(bytes, { updateMetadata: false });

    expect(reloaded.getPageCount()).toBe(1);
  });

  it("déclare la conformité PDF/A-3 dans le packet XMP", async () => {
    const bytes = await buildFacturXPdfSkeleton();
    const text = Buffer.from(bytes).toString("latin1");

    expect(text).toContain("<pdfaid:part>3</pdfaid:part>");
    expect(text).toContain("<pdfaid:conformance>B</pdfaid:conformance>");
    expect(text).toContain("urn:factur-x:pdfa:CrossIndustryDocument:invoice:1p0#");
  });

  it("ajoute un OutputIntent PDF/A référençant un profil ICC", async () => {
    const bytes = await buildFacturXPdfSkeleton();
    const reloaded = await PDFDocument.load(bytes, { updateMetadata: false });

    const outputIntents = reloaded.catalog.lookup(PDFName.of("OutputIntents"), PDFArray);
    expect(outputIntents.size()).toBe(1);

    const outputIntent = reloaded.context.lookup(outputIntents.get(0), PDFDict);
    expect(outputIntent.lookup(PDFName.of("S"), PDFName).asString()).toBe("/GTS_PDFA1");

    const destProfile = outputIntent.lookup(PDFName.of("DestOutputProfile"), PDFRawStream);
    expect(destProfile.dict.lookup(PDFName.of("N"), PDFNumber).asNumber()).toBe(3);
  });
});
