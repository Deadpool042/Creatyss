import "server-only";

import fontkit from "@pdf-lib/fontkit";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";

const ASSETS_DIR = join(process.cwd(), "features/admin/commerce/documents/assets");
const FONT_REGULAR_PATH = join(ASSETS_DIR, "fonts/NotoSans-Regular.ttf");
const FONT_BOLD_PATH = join(ASSETS_DIR, "fonts/NotoSans-Bold.ttf");
const ICC_PROFILE_PATH = join(ASSETS_DIR, "icc/sRGB2014.icc");

const A4: [number, number] = [595.28, 841.89];

function buildXmpMetadataXml(): string {
  return [
    '<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>',
    '<x:xmpmeta xmlns:x="adobe:ns:meta/">',
    '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">',
    '<rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/" xmlns:fx="urn:factur-x:pdfa:CrossIndustryDocument:invoice:1p0#">',
    "<pdfaid:part>3</pdfaid:part>",
    "<pdfaid:conformance>B</pdfaid:conformance>",
    "<fx:DocumentType>INVOICE</fx:DocumentType>",
    "<fx:DocumentFileName>factur-x.xml</fx:DocumentFileName>",
    "<fx:Version>1.0</fx:Version>",
    "<fx:ConformanceLevel>BASIC</fx:ConformanceLevel>",
    "</rdf:Description>",
    "</rdf:RDF>",
    "</x:xmpmeta>",
    '<?xpacket end="w"?>',
  ].join("\n");
}

/**
 * Construit l'OutputIntent PDF/A (profil ICC sRGB embarqué) et l'ajoute au
 * catalogue. Requis par la conformité PDF/A-3 quel que soit le contenu.
 */
function attachOutputIntent(pdf: PDFDocument): void {
  const iccBytes = readFileSync(ICC_PROFILE_PATH);
  const iccStreamRef = pdf.context.register(
    pdf.context.flateStream(iccBytes, { N: 3, Alternate: "DeviceRGB" })
  );

  const outputIntentRef = pdf.context.register(
    pdf.context.obj({
      Type: "OutputIntent",
      S: "GTS_PDFA1",
      OutputConditionIdentifier: PDFString.of("sRGB IEC61966-2.1"),
      Info: PDFString.of("sRGB IEC61966-2.1"),
      DestOutputProfile: iccStreamRef,
    })
  );

  pdf.catalog.set(PDFName.of("OutputIntents"), pdf.context.obj([outputIntentRef]));
}

/**
 * Construit le packet XMP (pdfaid + extension schema Factur-X) et l'attache
 * au catalogue. `fx:DocumentFileName` annonce le nom du XML métier que le
 * lot suivant attachera réellement — il n'est pas encore présent ici.
 */
function attachXmpMetadata(pdf: PDFDocument): void {
  const xmpBytes = Buffer.from(buildXmpMetadataXml(), "utf-8");
  const metadataRef = pdf.context.register(
    pdf.context.stream(xmpBytes, { Type: "Metadata", Subtype: "XML" })
  );
  pdf.catalog.set(PDFName.of("Metadata"), metadataRef);
}

/**
 * Génère le squelette structurel d'un PDF/A-3 : police réellement embarquée
 * (Noto Sans, via fontkit), OutputIntent ICC, métadonnées XMP déclarant la
 * conformité PDF/A-3 et l'extension Factur-X. Ne contient ni le contenu
 * métier de la facture ni le XML EN 16931 attaché — incréments ultérieurs.
 */
export async function buildFacturXPdfSkeleton(): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);

  const regularFont = await pdf.embedFont(readFileSync(FONT_REGULAR_PATH), { subset: true });
  const boldFont = await pdf.embedFont(readFileSync(FONT_BOLD_PATH), { subset: true });

  const page = pdf.addPage(A4);
  page.drawText("Squelette PDF/A-3 — Factur-X", { x: 50, y: 780, size: 14, font: boldFont });
  page.drawText("Police embarquée, OutputIntent ICC et XMP — sans contenu métier.", {
    x: 50,
    y: 758,
    size: 10,
    font: regularFont,
  });

  attachOutputIntent(pdf);
  attachXmpMetadata(pdf);

  return pdf.save();
}
