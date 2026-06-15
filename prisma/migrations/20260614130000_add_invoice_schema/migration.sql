-- Chantier factures : snapshot légal, relation avoir→facture, compteur de
-- numérotation (cf. docs/lots/2026-06-14-commerce-factures-cadrage.md).

ALTER TABLE "documents" ADD COLUMN "snapshot" JSONB;
ALTER TABLE "documents" ADD COLUMN "parentDocumentId" TEXT;

CREATE INDEX "documents_parentDocumentId_idx" ON "documents"("parentDocumentId");

ALTER TABLE "documents"
  ADD CONSTRAINT "documents_parentDocumentId_fkey"
  FOREIGN KEY ("parentDocumentId") REFERENCES "documents"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

CREATE TABLE "document_counters" (
  "id" TEXT NOT NULL,
  "storeId" TEXT NOT NULL,
  "typeCode" "DocumentTypeCode" NOT NULL,
  "year" INTEGER NOT NULL,
  "lastValue" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "document_counters_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "document_counters_storeId_typeCode_year_key"
  ON "document_counters"("storeId", "typeCode", "year");

ALTER TABLE "document_counters"
  ADD CONSTRAINT "document_counters_storeId_fkey"
  FOREIGN KEY ("storeId") REFERENCES "stores"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
