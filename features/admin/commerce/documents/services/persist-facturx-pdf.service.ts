import "server-only";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { db } from "@/core/db";
import { buildFacturXInvoiceXml } from "@/features/admin/commerce/documents/services/build-facturx-invoice-xml.service";
import { buildFacturXPdfWithXml } from "@/features/admin/commerce/documents/services/build-facturx-pdf-with-xml.service";
import type { InvoiceSnapshot } from "@/features/admin/commerce/documents/types/invoice-snapshot.types";

const DOCUMENT_MIME_TYPE = "application/pdf";

function getDocumentsDirectory(): string {
  return path.resolve(process.cwd(), process.env.DOCUMENTS_DIR ?? "storage/documents");
}

/** Déterministe (storeId + documentNumber) : pas de dépendance à une valeur déjà persistée. */
function buildInvoiceStorageKey(storeId: string, documentNumber: string): string {
  return path.join("invoices", storeId, `${documentNumber}.pdf`);
}

async function readCachedFile(storageKey: string): Promise<Uint8Array | null> {
  try {
    return await readFile(path.join(getDocumentsDirectory(), storageKey));
  } catch {
    return null;
  }
}

async function writeAndRegisterFile(input: {
  documentId: string;
  storageKey: string;
  bytes: Uint8Array;
}): Promise<void> {
  const absolutePath = path.join(getDocumentsDirectory(), input.storageKey);
  await mkdir(path.dirname(absolutePath), { recursive: true });
  await writeFile(absolutePath, input.bytes);

  await db.document.update({
    where: { id: input.documentId },
    data: {
      storageKey: input.storageKey,
      fileName: path.basename(input.storageKey),
      mimeType: DOCUMENT_MIME_TYPE,
    },
  });
}

type GetOrCreateFacturXPdfFileInput = {
  documentId: string;
  storeId: string;
  documentNumber: string;
  snapshot: InvoiceSnapshot;
};

/**
 * Cache-disque pour le PDF Factur-X d'une facture émise : sert le fichier
 * déjà généré si présent sous `storage/documents/`, le (re)génère sinon —
 * `storageKey` absent en base ou fichier physique manquant sont traités de
 * la même façon (auto-réparation, pas d'erreur exposée). Pas de verrou :
 * deux requêtes concurrentes en cache-miss peuvent régénérer et écrire en
 * double sur le même chemin déterministe ; accepté pour ce micro-lot
 * (téléchargement admin, trafic non concurrent en pratique).
 */
export async function getOrCreateFacturXPdfFile(
  input: GetOrCreateFacturXPdfFileInput
): Promise<Uint8Array> {
  const storageKey = buildInvoiceStorageKey(input.storeId, input.documentNumber);

  const cached = await readCachedFile(storageKey);
  if (cached !== null) {
    return cached;
  }

  const xml = buildFacturXInvoiceXml({
    snapshot: input.snapshot,
    documentNumber: input.documentNumber,
  });
  const bytes = await buildFacturXPdfWithXml(xml);

  await writeAndRegisterFile({ documentId: input.documentId, storageKey, bytes });

  return bytes;
}
