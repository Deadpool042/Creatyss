import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFRawStream,
  PDFString,
  decodePDFRawStream,
} from "pdf-lib";
import { describe, expect, it } from "vitest";
import { buildFacturXPdfWithXml } from "@/features/admin/commerce/documents/services/build-facturx-pdf-with-xml.service";

const SAMPLE_XML = '<?xml version="1.0" encoding="UTF-8"?><rsm:CrossIndustryInvoice/>';

describe("buildFacturXPdfWithXml", () => {
  it("attache le XML sous le nom factur-x.xml avec AFRelationship Data", async () => {
    const bytes = await buildFacturXPdfWithXml(SAMPLE_XML);
    const reloaded = await PDFDocument.load(bytes, { updateMetadata: false });

    const af = reloaded.catalog.lookup(PDFName.of("AF"), PDFArray);
    expect(af.size()).toBe(1);

    const fileSpec = reloaded.context.lookup(af.get(0), PDFDict);
    expect(fileSpec.lookup(PDFName.of("F"), PDFString).asString()).toBe("factur-x.xml");
    expect(fileSpec.lookup(PDFName.of("AFRelationship"), PDFName).asString()).toBe("/Data");

    const ef = fileSpec.lookup(PDFName.of("EF"), PDFDict);
    const embeddedStream = ef.lookup(PDFName.of("F"), PDFRawStream);
    const decoded = decodePDFRawStream(embeddedStream).decode();
    expect(Buffer.from(decoded).toString("utf-8")).toBe(SAMPLE_XML);
  });

  it("référence le fichier dans l'arbre Names/EmbeddedFiles", async () => {
    const bytes = await buildFacturXPdfWithXml(SAMPLE_XML);
    const reloaded = await PDFDocument.load(bytes, { updateMetadata: false });

    const names = reloaded.catalog.lookup(PDFName.of("Names"), PDFDict);
    const embeddedFiles = names.lookup(PDFName.of("EmbeddedFiles"), PDFDict);
    const efNames = embeddedFiles.lookup(PDFName.of("Names"), PDFArray);

    expect(efNames.size()).toBe(2);
    const nameEntry = efNames.get(0);
    expect(nameEntry).toBeInstanceOf(PDFHexString);
    expect((nameEntry as InstanceType<typeof PDFHexString>).decodeText()).toBe("factur-x.xml");
  });

  it("déclare le XMP complet : pdfaid, fx:*, namespace exact, bloc Extension Schema", async () => {
    const bytes = await buildFacturXPdfWithXml(SAMPLE_XML);
    const text = Buffer.from(bytes).toString("latin1");

    expect(text).toContain("<pdfaid:part>3</pdfaid:part>");
    expect(text).toContain("<pdfaid:conformance>B</pdfaid:conformance>");
    expect(text).toContain('xmlns:fx="urn:factur-x:pdfa:CrossIndustryDocument:invoice:1p0#"');
    expect(text).toContain("<fx:DocumentFileName>factur-x.xml</fx:DocumentFileName>");
    expect(text).toContain("<fx:DocumentType>INVOICE</fx:DocumentType>");
    expect(text).toContain("<fx:Version>1.0</fx:Version>");
    expect(text).toContain("<fx:ConformanceLevel>BASIC</fx:ConformanceLevel>");
    expect(text).toContain("pdfaExtension:schemas");
    expect(text).toContain("pdfaSchema:namespaceURI");
  });
});
