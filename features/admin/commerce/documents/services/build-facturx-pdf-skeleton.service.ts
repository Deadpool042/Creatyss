import "server-only";

import fontkit from "@pdf-lib/fontkit";
import { randomBytes } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PDFDocument, PDFHexString, PDFName, PDFString } from "pdf-lib";

const ASSETS_DIR = join(process.cwd(), "features/admin/commerce/documents/assets");
const FONT_REGULAR_PATH = join(ASSETS_DIR, "fonts/NotoSans-Regular.ttf");
const FONT_BOLD_PATH = join(ASSETS_DIR, "fonts/NotoSans-Bold.ttf");
const ICC_PROFILE_PATH = join(ASSETS_DIR, "icc/sRGB2014.icc");

const A4: [number, number] = [595.28, 841.89];

/**
 * N'inclut que `pdfaid` (schéma prédéfini PDF/A, accepté sans déclaration
 * supplémentaire). Le schéma d'extension Factur-X (`fx:`) nécessite un bloc
 * PDF/A Extension Schema conforme à ISO 19005-3 §6.6.2.3.2 — non ajouté ici
 * (validé manquant par veraPDF, clause 6.6.2.3.1) ; il sera construit avec
 * l'attachement du XML métier dans le lot suivant.
 */
function buildXmpMetadataXml(): string {
  return [
    '<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>',
    '<x:xmpmeta xmlns:x="adobe:ns:meta/">',
    '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">',
    '<rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">',
    "<pdfaid:part>3</pdfaid:part>",
    "<pdfaid:conformance>B</pdfaid:conformance>",
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

/** Construit le packet XMP (pdfaid uniquement) et l'attache au catalogue. */
function attachXmpMetadata(pdf: PDFDocument): void {
  const xmpBytes = Buffer.from(buildXmpMetadataXml(), "utf-8");
  const metadataRef = pdf.context.register(
    pdf.context.stream(xmpBytes, { Type: "Metadata", Subtype: "XML" })
  );
  pdf.catalog.set(PDFName.of("Metadata"), metadataRef);
}

/** Requis par ISO 19005-3 §6.1.3 : le trailer doit porter un /ID de fichier. */
function attachFileId(pdf: PDFDocument): void {
  const id = PDFHexString.of(randomBytes(16).toString("hex"));
  pdf.context.trailerInfo.ID = pdf.context.obj([id, id]);
}

/**
 * Génère le squelette structurel d'un PDF/A-3 : police réellement embarquée
 * (Noto Sans, via fontkit), OutputIntent ICC, métadonnées XMP pdfaid et /ID
 * de trailer. Ne contient ni le contenu métier de la facture, ni le XML
 * EN 16931 attaché, ni le schéma d'extension Factur-X — incréments
 * ultérieurs (validé par veraPDF --flavour 3b, conformité structurelle).
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
  attachFileId(pdf);

  return pdf.save();
}
