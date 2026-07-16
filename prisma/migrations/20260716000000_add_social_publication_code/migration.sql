-- Lot 5 matérialisation sociale : clé d'idempotence sur SocialPublication
-- (cf. docs/roadmap/editorial-marketing-intents/lot-5-materialisation-sociale-cadrage.md)
-- Migration additive, table vide en pratique (module jamais activé).

ALTER TABLE "social_publications" ADD COLUMN "code" TEXT NOT NULL;

CREATE UNIQUE INDEX "social_publications_storeId_code_key" ON "social_publications"("storeId", "code");
