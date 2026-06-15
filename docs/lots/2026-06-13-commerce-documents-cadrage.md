<!-- docs/lots/2026-06-13-commerce-documents-cadrage.md -->

# Cadrage — `commerce.documents` (roadmap point 6)

> Suite de `docs/roadmap/2026-06-13-audit-catalogue-modules.md`, section 6,
> point 6 : « Modules L0 : `commerce.documents` (étendre au-delà de la
> confirmation de commande), puis ... »

## État actuel (audit)

- **Feature catalog** (`features/admin/pilotage/catalog/feature-catalog.ts`) :
  `key: "commerce.documents"`, `family: "satellite"`, `module: "commerce"`,
  `defaultState: "inactive"`, `mutability: "toggleable"` — pas de niveaux
  (pas d'entrée `FEATURE_LEVELS.documents`).
- **Aucun `FeatureFlag` seedé** pour `commerce.documents`
  (`grep -rln "commerce.documents" prisma/seed/` → rien) →
  `queryFeatureFlagActive("commerce.documents")` retourne `false`. Le module
  est donc **actuellement inaccessible** : `/admin/commerce/orders/[id]/documents`
  → `notFound()`, `OrderDetailDocumentsCard` jamais rendu. Même situation que
  `commerce.discounts`/`engagement.newsletter` avant leur seed — la roadmap le
  classe « L3 (inactif par défaut) » au sens « code prêt », pas « accessible ».
- **Modèle Prisma déjà entièrement posé**
  (`prisma/optional/commerce/documents.prisma`, `Level: L2`, `DependsOn:
  foundation.store, commerce.orders`) :
  - `Document` : `typeCode` (`ORDER_CONFIRMATION | INVOICE | CREDIT_NOTE |
    DELIVERY_NOTE | RECEIPT | OTHER`), `status` (`DRAFT | GENERATED | ISSUED |
    SENT | CANCELLED | ARCHIVED`), `documentNumber?`, `title?`,
    `currencyCode?`, `issuedAt?`/`sentAt?`/`cancelledAt?`/`archivedAt?`,
    `fileName?`/`mimeType?`/`storageKey?`/`publicUrl?` (aucun fichier réel
    généré aujourd'hui), `@@unique([storeId, documentNumber])`.
  - `DocumentVersion` : versionnement, non alimenté.
- **Code applicatif existant** (`features/admin/commerce/documents/*`) :
  - `is-documents-feature-active.query.ts` → `queryFeatureFlagActive("commerce.documents")`.
  - `find-documents-by-order.query.ts` → liste les `Document` d'une commande.
  - `create-order-confirmation.service.ts` + `create-order-confirmation-action.ts`
    → crée un `Document` `typeCode: ORDER_CONFIRMATION`, `status: GENERATED`,
    `documentNumber: null`, un seul par commande active.
  - `order-detail-documents-card.tsx` (slot `/admin/commerce/orders/[id]/documents`)
    → liste les documents + bouton « Générer la confirmation » si absent.
    Mention explicite : « La génération PDF sera disponible prochainement »
    (aucun fichier réel, `storageKey`/`publicUrl` restent `null`).
- **Doctrine** (`docs/domains/satellites/documents.md`, `core` /
  `coeur structurel`, activable) — section « Décisions d'implémentation » déjà
  tranchée le 2026-06 :
  - `ORDER_CONFIRMATION` : `documentNumber = null` est intentionnel (pas
    d'obligation légale de numérotation, art. L441-9 Code de commerce).
  - `INVOICE`/`CREDIT_NOTE` : **explicitement hors périmètre** sans décision
    préalable sur (1) contenu légal (snapshot vs dérivé d'`Order`), (2) champs
    fiscaux obligatoires (TVA, SIRET, lignes HT/TTC), (3) format de
    numérotation (`FA-2026-0001`), (4) rétention/archivage légal. Stratégie
    recommandée si retenue : table `DocumentCounter` + `SELECT FOR UPDATE`
    dans une transaction Prisma (pas de séquence SQL native) — **décision
    réservée au « chantier factures »**.

## Décisions à trancher

### A — Quelle extension dans ce lot

1. **Seed `FeatureFlag commerce.documents` seul** (Recommandé) : corrige
   l'écart « code prêt mais module inaccessible » (même pattern que
   `commerce.discounts`/`engagement.newsletter` avant seed) —
   `prisma/seed/documents-feature-flag.seed.ts`, `status: "DRAFT"`,
   `isEnabledByDefault: false`, `scopeType: "STORE"`, pas de niveaux (pas
   d'entrée `FEATURE_LEVELS`). Une fois activé via `/admin/settings/advanced`,
   la confirmation de commande (déjà codée) devient utilisable. Plus petit
   changement sûr, ne touche pas au schéma.
2. **Seed + génération `DELIVERY_NOTE`** (bon de préparation) : suit
   exactement le pattern `ORDER_CONFIRMATION` (`documentNumber: null`,
   `status: GENERATED`, un seul actif par commande, bouton dans
   `OrderDetailDocumentsCard`). Aucune stratégie de numérotation requise (même
   raisonnement que la confirmation — document opérationnel interne, pas de
   contrainte légale de numérotation séquentielle identifiée). C'est
   l'extension « au-delà de la confirmation de commande » la plus proche du
   pattern existant.
3. **Seed + cadrage dédié `INVOICE`/`CREDIT_NOTE`** : ouvre le « chantier
   factures » explicitement réservé par la doctrine — nécessite un cadrage
   `prisma-architect` séparé (modèle `DocumentCounter`, champs fiscaux,
   contenu légal). Hors périmètre d'un petit lot sûr.

### B — Si option A2 (`DELIVERY_NOTE`) retenue : portée

1. **Identique au pattern confirmation** (Recommandé) : un bon de préparation
   « actif » par commande (statuts hors `CANCELLED`/`ARCHIVED`), bouton
   « Générer le bon de préparation », service + action dédiés
   (`create-delivery-note.service.ts` / `create-delivery-note-action.ts`),
   `documentNumber: null`, `status: GENERATED`, `title: "Bon de préparation —
   Commande #..."`.
2. **+ lien `commerce.fulfillment`** : hors périmètre (`commerce.fulfillment`
   reste L0, aucune query/page).

## Sous-lots proposés (si A1 seul)

1. **Sous-lot 0** — Seed `commerce.documents` (`prisma/seed/documents-feature-flag.seed.ts`,
   câblé dans `prisma/seed.ts`, `status: "DRAFT"`, `isEnabledByDefault: false`).
   Vérif `tsc --noEmit` + vérif manuelle : module togglable, inactif par défaut.
2. **Sous-lot 1** — Vérifications + mise à jour
   `docs/domains/satellites/documents.md` (section décisions d'implémentation
   — seed effectué) et `docs/roadmap/2026-06-13-audit-catalogue-modules.md`
   (entrée `commerce.documents`, section 6 point 6), bilan d'exécution dans ce
   cadrage.

## Sous-lots proposés (si A2 = A1 + B1)

1. **Sous-lot 0** — Seed `commerce.documents` (idem ci-dessus). Vérif
   `tsc --noEmit`.
2. **Sous-lot 1** — `features/admin/commerce/documents/services/create-delivery-note.service.ts`
   + `actions/create-delivery-note-action.ts` (analogues confirmation,
   `typeCode: DELIVERY_NOTE`). Vérif `tsc --noEmit`.
3. **Sous-lot 2** — `order-detail-documents-card.tsx` : ajoute le bouton
   « Générer le bon de préparation » (même logique que la confirmation,
   indépendant). Vérif `tsc --noEmit`.
4. **Sous-lot 3** — Vérifications + doc (`documents.md`, roadmap audit, bilan
   d'exécution).

## `INVOICE`/`CREDIT_NOTE` — hors périmètre de ce lot (si A1 ou A2)

Reste réservé au « chantier factures » (cf.
`docs/domains/satellites/documents.md`, section « Décisions
d'implémentation ») : nécessite un cadrage `prisma-architect` dédié pour
trancher la stratégie de numérotation (`DocumentCounter`), les champs fiscaux
obligatoires et le contenu légal avant toute migration.

## Bilan d'exécution (2026-06-14) — option A1 retenue

Décision : **A1 (seed seul)**, conforme à la recommandation.

**Fichiers créés / modifiés** :
- `prisma/seed/documents-feature-flag.seed.ts` (nouveau) — `seedDocumentsFeatureFlag`,
  `FeatureFlag commerce.documents` : `status "DRAFT"`, `scopeType "STORE"`,
  `isEnabledByDefault false`, **non gradué** (`allowedLevels` laissé au défaut `[]`,
  pas de `defaultLevel`, pas d'entrée `FEATURE_LEVELS`). Upsert idempotent.
- `prisma/seed.ts` — import + appel `seedDocumentsFeatureFlag(prisma)` (placé entre
  `seedDiscountsFeatureFlag` et `seedNewsletterFeatureFlag`).
- `docs/domains/satellites/documents.md` — nouvelle sous-section « Activation —
  FeatureFlag seedé (2026-06-14) » en tête des décisions d'implémentation.
- `docs/roadmap/2026-06-13-audit-catalogue-modules.md` — entrée `commerce.documents`
  (tableau section 5) mise à jour + section 6 point 6 marquée « activation faite ».

**Vérifications** : `tsc --noEmit` → 0 erreur. Pas de migration (schéma inchangé).
Pas de seed réellement exécuté en base ni de vérif UI navigateur dans ce lot.

**Hors périmètre confirmé** : aucun nouveau `typeCode` (pas de `DELIVERY_NOTE`),
aucune génération PDF réelle (`storageKey`/`publicUrl` restent `null`),
`INVOICE`/`CREDIT_NOTE` non ouverts (chantier factures dédié), schéma Prisma
non touché.

## Bilan d'exécution (2026-06-14) — extension A2 (`DELIVERY_NOTE`, portée B1)

Suite décidée après A1 : **A2 = bon de préparation**, portée B1 (identique au
pattern confirmation).

**Fichiers créés / modifiés** :
- `features/admin/commerce/documents/services/create-delivery-note.service.ts`
  (nouveau) — `createDeliveryNote` + `CreateDeliveryNoteError`, calqué sur la
  confirmation : `typeCode "DELIVERY_NOTE"`, `status "GENERATED"`,
  `documentNumber: null`, garde « un actif par commande » (hors
  `CANCELLED`/`ARCHIVED`), `title: "Bon de préparation — Commande #..."`.
- `features/admin/commerce/documents/actions/create-delivery-note-action.ts`
  (nouveau) — `createDeliveryNoteAction`, mêmes gardes que la confirmation
  (`requireAuthenticatedAdmin`, `isDocumentsFeatureActive`, `getCurrentStoreId`,
  `revalidatePath`).
- `features/admin/commerce/documents/components/order-detail-documents-card.tsx`
  — bouton « Générer le bon de préparation » + état/transition/feedback
  **indépendants** de la confirmation ; helper `hasActiveDeliveryNote`.

**Vérifications** : typecheck du périmètre (tsconfig restreint à
`features/admin/commerce/documents/**` + seed) → `EXIT:0`, 0 erreur. (Le
`tsc --noEmit` projet complet dépasse la fenêtre d'exécution de l'environnement ;
vérification ciblée sur la fermeture transitive des fichiers touchés.) Pas de
migration (schéma inchangé), pas de vérif UI navigateur.

**Hors périmètre confirmé** : pas de lien `commerce.fulfillment` (reste L0),
aucune génération PDF réelle, `INVOICE`/`CREDIT_NOTE` toujours réservés au
chantier factures.
