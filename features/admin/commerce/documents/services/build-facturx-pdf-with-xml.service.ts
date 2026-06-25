import "server-only";

import { AFRelationship, PDFDocument, PDFName } from "pdf-lib";
import { buildFacturXPdfSkeleton } from "@/features/admin/commerce/documents/services/build-facturx-pdf-skeleton.service";

const XML_ATTACHMENT_NAME = "factur-x.xml";
const FX_NAMESPACE_URI = "urn:factur-x:pdfa:CrossIndustryDocument:invoice:1p0#";

function buildXmpExtensionProperty(name: string, description: string): string {
  return [
    '<rdf:li rdf:parseType="Resource">',
    `<pdfaProperty:name>${name}</pdfaProperty:name>`,
    "<pdfaProperty:valueType>Text</pdfaProperty:valueType>",
    "<pdfaProperty:category>external</pdfaProperty:category>",
    `<pdfaProperty:description>${description}</pdfaProperty:description>`,
    "</rdf:li>",
  ].join("\n");
}

/**
 * Repris fidèlement de `Factur-X_extension_schema.xmp` (akretion/factur-x,
 * lui-même issu du sample officiel PDFlib GmbH du pack de spécification
 * Factur-X 1.0) :
 * https://github.com/akretion/factur-x/blob/master/src/facturx/xmp/Factur-X_extension_schema.xmp
 * Deux pièges documentés par l'auteur d'origine, respectés ici : la casse
 * mixte "CrossIndustryDocument" et le "#" final du namespace — les
 * échantillons PDF du pack officiel Factur-X 1.0 sont eux-mêmes fautifs
 * sur ce point.
 */
function buildFullXmpMetadataXml(): string {
  return [
    '<?xpacket begin="﻿" id="W5M0MpCehiHzreSzNTczkc9d"?>',
    '<x:xmpmeta xmlns:x="adobe:ns:meta/">',
    '<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">',
    '<rdf:Description rdf:about="" xmlns:pdfaid="http://www.aiim.org/pdfa/ns/id/">',
    "<pdfaid:part>3</pdfaid:part>",
    "<pdfaid:conformance>B</pdfaid:conformance>",
    "</rdf:Description>",
    `<rdf:Description rdf:about="" xmlns:fx="${FX_NAMESPACE_URI}">`,
    `<fx:DocumentFileName>${XML_ATTACHMENT_NAME}</fx:DocumentFileName>`,
    "<fx:DocumentType>INVOICE</fx:DocumentType>",
    "<fx:Version>1.0</fx:Version>",
    "<fx:ConformanceLevel>BASIC</fx:ConformanceLevel>",
    "</rdf:Description>",
    '<rdf:Description rdf:about="" xmlns:pdfaExtension="http://www.aiim.org/pdfa/ns/extension/" xmlns:pdfaSchema="http://www.aiim.org/pdfa/ns/schema#" xmlns:pdfaProperty="http://www.aiim.org/pdfa/ns/property#">',
    "<pdfaExtension:schemas>",
    "<rdf:Bag>",
    '<rdf:li rdf:parseType="Resource">',
    "<pdfaSchema:schema>Factur-X PDFA Extension Schema</pdfaSchema:schema>",
    `<pdfaSchema:namespaceURI>${FX_NAMESPACE_URI}</pdfaSchema:namespaceURI>`,
    "<pdfaSchema:prefix>fx</pdfaSchema:prefix>",
    "<pdfaSchema:property>",
    "<rdf:Seq>",
    buildXmpExtensionProperty("DocumentFileName", "name of the embedded XML invoice file"),
    buildXmpExtensionProperty("DocumentType", "INVOICE"),
    buildXmpExtensionProperty("Version", "The actual version of the Factur-X XML schema"),
    buildXmpExtensionProperty(
      "ConformanceLevel",
      "The conformance level of the embedded Factur-X data"
    ),
    "</rdf:Seq>",
    "</pdfaSchema:property>",
    "</rdf:li>",
    "</rdf:Bag>",
    "</pdfaExtension:schemas>",
    "</rdf:Description>",
    "</rdf:RDF>",
    "</x:xmpmeta>",
    '<?xpacket end="w"?>',
  ].join("\n");
}

/**
 * Attache le XML Factur-X au squelette PDF/A-3 (déjà validé veraPDF
 * isolément) et remplace le XMP minimal par le packet complet (pdfaid + fx
 * + bloc PDF/A Extension Schema). N'est pas encore branché au pipeline
 * d'émission de facture — service de test isolé pour validation veraPDF.
 */
export async function buildFacturXPdfWithXml(xmlContent: string): Promise<Uint8Array> {
  const skeletonBytes = await buildFacturXPdfSkeleton();
  const pdf = await PDFDocument.load(skeletonBytes, { updateMetadata: false });

  await pdf.attach(Buffer.from(xmlContent, "utf-8"), XML_ATTACHMENT_NAME, {
    mimeType: "text/xml",
    afRelationship: AFRelationship.Data,
  });

  const xmpBytes = Buffer.from(buildFullXmpMetadataXml(), "utf-8");
  const metadataRef = pdf.context.register(
    pdf.context.stream(xmpBytes, { Type: "Metadata", Subtype: "XML" })
  );
  pdf.catalog.set(PDFName.of("Metadata"), metadataRef);

  return pdf.save();
}
