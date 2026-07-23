-- Lot H4 lot-integrations-providers : socle de stockage chiffré réversible
-- (cf. docs/roadmap/h4-plateforme-automatisation/lot-integrations-providers.md)
-- Migration additive, table optionnelle jamais peuplée en pratique (module
-- non activé). Ajoute la charge chiffrée réversible manquante à côté du hash
-- irréversible existant (secretHash), pour permettre à un futur adaptateur
-- de rappeler l'API d'un fournisseur tiers avec le secret en clair.

ALTER TABLE "integration_credentials" ADD COLUMN "encryptedValue" TEXT;
ALTER TABLE "integration_credentials" ADD COLUMN "encryptionVersion" INTEGER;
