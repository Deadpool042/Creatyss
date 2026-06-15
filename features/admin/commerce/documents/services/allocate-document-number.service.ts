import "server-only";

import { randomUUID } from "node:crypto";

import type { DbTx } from "@/core/db/transactions/with-transaction";
import type { DocumentTypeCode } from "@/prisma-generated/client";

/** Préfixes de numérotation par type de document numéroté. */
const NUMBER_PREFIX: Partial<Record<DocumentTypeCode, string>> = {
  INVOICE: "FA",
  CREDIT_NOTE: "AV",
};

const SEQUENCE_PAD = 4;

export function formatDocumentNumber(
  typeCode: DocumentTypeCode,
  year: number,
  sequence: number
): string {
  const prefix = NUMBER_PREFIX[typeCode];
  if (prefix === undefined) {
    throw new Error(`Type de document non numéroté : ${typeCode}.`);
  }
  return `${prefix}-${year}-${String(sequence).padStart(SEQUENCE_PAD, "0")}`;
}

type AllocateInput = {
  storeId: string;
  typeCode: DocumentTypeCode;
  year: number;
};

type CounterRow = { lastValue: number };

/**
 * Alloue le prochain numéro séquentiel sans trou pour (store, type, année).
 * À appeler DANS la transaction d'émission : verrou `SELECT … FOR UPDATE` sur
 * la ligne compteur, garantissant l'absence de doublon/trou en concurrence.
 */
export async function allocateDocumentNumber(
  tx: DbTx,
  input: AllocateInput
): Promise<{ sequence: number; documentNumber: string }> {
  // Garantit l'existence de la ligne compteur (sans écraser une valeur existante).
  await tx.$executeRaw`
    INSERT INTO "document_counters" ("id", "storeId", "typeCode", "year", "lastValue", "createdAt", "updatedAt")
    VALUES (${randomUUID()}, ${input.storeId}, ${input.typeCode}::"DocumentTypeCode", ${input.year}, 0, now(), now())
    ON CONFLICT ("storeId", "typeCode", "year") DO NOTHING
  `;

  const rows = await tx.$queryRaw<CounterRow[]>`
    SELECT "lastValue" FROM "document_counters"
    WHERE "storeId" = ${input.storeId}
      AND "typeCode" = ${input.typeCode}::"DocumentTypeCode"
      AND "year" = ${input.year}
    FOR UPDATE
  `;

  const current = rows[0]?.lastValue ?? 0;
  const sequence = current + 1;

  await tx.$executeRaw`
    UPDATE "document_counters"
    SET "lastValue" = ${sequence}, "updatedAt" = now()
    WHERE "storeId" = ${input.storeId}
      AND "typeCode" = ${input.typeCode}::"DocumentTypeCode"
      AND "year" = ${input.year}
  `;

  return { sequence, documentNumber: formatDocumentNumber(input.typeCode, input.year, sequence) };
}
