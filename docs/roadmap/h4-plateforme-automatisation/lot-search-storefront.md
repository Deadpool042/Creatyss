# Lot — Recherche storefront

## Statut

Terminé — 2026-07-05

Décision moteur : PostgreSQL FTS dictionnaire `french` (pas d'Algolia — volume boutique artisanale, aucune dépendance externe). Livré en 4 micro-lots :

1. index GIN fonctionnel `to_tsvector('french', indexedText)` sur `search_documents` (migration `20260705100000`) ;
2. indexation synchrone dans la transaction des mutations produit (création, édition générale, archivage, restauration, suppression) via `features/search/services/sync-product-search-document.service.ts`, pattern try/catch non bloquant du repository orders ; le nom est doublé dans `indexedText` pour la pondération `ts_rank` ;
3. requête FTS `features/search/queries/search-published-product-ids.query.ts` branchée sur le paramètre `q` existant de `/boutique` — résolue une fois par rendu, fallback ILIKE inchangé quand `satellite.search` est inactif ;
4. barre de recherche visible dans la toolbar boutique (`boutique-search-form.tsx`), liens topbar « Rechercher » activés vers `/boutique`, script `scripts/backfill-search-documents.ts` pour les produits antérieurs à l'activation, encart admin mis à jour.

Recette : typecheck, lint, 440 tests unitaires verts ; recette navigateur desktop + mobile (`?q=pochettes` matche « Pochette » par stemming, multi-mots OK, dépubliés exclus via statut de document).

## Objectif

Implémenter une recherche full-text dans le storefront pour permettre aux clientes de trouver des produits par mot-clé. `SearchDocument` est posé en Prisma et la page admin de lecture est observée, mais aucun moteur de recherche storefront n'existe.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/satellites/search.prisma` — modèle `SearchDocument` déjà posé (observé)
- Indexation : alimentation de `SearchDocument` lors de la création ou modification d'un produit
- Moteur de recherche : requête full-text sur `SearchDocument` (PostgreSQL FTS ou Algolia selon décision)
- Storefront : barre de recherche, page de résultats avec liste de produits correspondants
- Admin : page `/admin/settings/search` existante — affichage du nombre de documents indexés déjà observé

## Hors périmètre

- Recherche facettée avancée (filtres par catégorie, prix, disponibilité dans les résultats)
- Auto-complétion / suggestions en temps réel
- Recherche sur le blog ou les pages de contenu (peut suivre)
- Synonymes et corrections orthographiques avancées

## Dépendances

- Décision sur le moteur de recherche : PostgreSQL FTS (recommandé pour le volume d'une boutique artisanale, sans dépendance externe) ou Algolia (plus puissant mais coût récurrent et dépendance externe) — à trancher en `architect-review`
- Catalogue stable avec produits publiés (H1 recommandé)

## Invariants

- L'indexation ne doit pas bloquer le flux de mutation produit (asynchrone ou synchrone léger selon le moteur)
- Un `SearchDocument` doit être mis à jour ou supprimé lorsque le produit correspondant est modifié ou dépublié
- La recherche ne retourne que des produits publiés et disponibles (`availabilityRecord` actif)

## Risques

- Algolia : dépendance externe avec coût récurrent — si le plan gratuit est dépassé, coût immédiat ; la migration ultérieure vers PostgreSQL FTS est non triviale
- PostgreSQL FTS en français : la tokenisation par défaut n'est pas optimale pour le français — configuration `french` dictionary requise
- Index stale : si un produit est modifié sans mise à jour du `SearchDocument`, les résultats de recherche sont incohérents — la synchronisation doit être fiable

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` — tests unitaires sur la logique d'indexation et de requête
- Test manuel : recherche sur le storefront avec plusieurs mots-clés, vérification que les produits dépubliés n'apparaissent pas

## Critères de fin

- Une cliente peut rechercher des produits par mot-clé depuis le storefront
- Les produits dépubliés ou indisponibles n'apparaissent pas dans les résultats
- L'index est mis à jour automatiquement lors des modifications produit
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour la décision moteur (PostgreSQL FTS vs Algolia) et la conception de l'indexation, puis `next-feature-builder` pour l'implémentation.
