---
name: prisma_schema_structure
description: Structure réelle du schéma Prisma — fichiers multi-domaines, modèles coeur, satellites et optionnels
type: project
---

Le schéma Prisma est éclaté en ~68 fichiers `.prisma` par domaine dans `prisma/`. Le fichier `prisma/schema.prisma` ne contient que le generator/datasource.

**Why:** Choix délibéré de modularité — un fichier par domaine pour aligner la structure DB sur la doctrine DDD.

**How to apply:** Lors d'un audit ou d'une modification, toujours lire le fichier domaine concerné, pas uniquement schema.prisma. Le Store est le tenant root — toutes les relations partent de `Store`.

Problèmes structurels connus (audit 2026-03-23) :

- Fichier `store.prisma` (singulier) vs nom canonique `stores` — nom de fichier non canonique
- `inventory.prisma` modélise un domaine nommé `inventory` alors que la doctrine dit `availability` est le domaine canonique
- `InventoryItem` manque de `version` pour optimistic locking
- `Order` manque de `version` pour concurrence
- `Payment` n'a pas de modèle `PaymentRefund` séparé — les remboursements ne sont pas structurellement modélisés
- `Checkout` embarque les adresses en colonnes plates (24 colonnes) — duplication avec `Order`
- `CartLine` : contrainte `@@unique([cartId, variantId])` bloque les options cadeau (deux lignes même variante)
- `Product.sku` est nullable et n'a pas de contrainte `@@unique` — risque d'intégrité
- `TaxRule` n'est pas lié à `ProductType` par FK réelle — `productTypeCode` est un String libre
- `SeoMetadata` utilise 4 FK nullable mutuellement exclusives — anti-pattern
- `LocalizedValue` utilise `subjectType/subjectId` en polymorphisme string — sans FK réelle
- `PageSection.content` est un `String?` — trop permissif pour de la richesse éditoriale
- `StoreCapabilityKey` mélange capabilities coeur non-toggleables (AUDIT_TRAIL) avec optionnels
- `BlogCategory` sans `status` ni lifecycle
- `ShippingRate` sans index `@@unique` sur sa combinaison géographique
- `IntegrationCredential` sans `status` de lifecycle explicite
