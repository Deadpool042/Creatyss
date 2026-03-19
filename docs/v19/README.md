# V19 — Refactor DB Prisma + contrats explicites

## Résumé

V19 stabilise la couche `db/` autour de Prisma ORM et termine la sortie du SQL brut.

L'état final visible dans le repository est le suivant :

- `db/client.ts` et `db/catalog.ts` ont disparu
- la couche data s'appuie sur `db/prisma-client.ts`
- les repositories exposent des fonctions publiques stables et s'appuient sur Prisma pour les reads, les writes et les transactions
- les contrats publics sont majoritairement sortis dans des fichiers `*.types.ts`
- `catalog/**` et `admin-category.repository.ts` ont remplacé les derniers `LEFT JOIN LATERAL` par des lectures Prisma batchées et une reconstruction en mémoire
- `db/health.ts` ne fait plus de round-trip SQL brut et utilise un health check Prisma minimal

V19 ne change pas le schéma, n'introduit pas de nouvelle couche de service et ne déplace pas la logique métier dans Prisma. La version vise d'abord la stabilité, la lisibilité et la cohérence de la frontière `db/`.

## Objectifs de la V19

- supprimer totalement les usages runtime de `$queryRaw`, `$executeRaw` et `Prisma.sql`
- adopter Prisma ORM à 100% dans `db/`
- séparer plus clairement implémentation repository et contrats publics
- supprimer la majorité des ré-exports de types depuis les repositories
- expliciter les inputs, outputs, statuts et erreurs publiques
- stabiliser la frontière de la couche `db/`
- introduire du batch loading explicite là où Prisma pur remplace des jointures SQL complexes
- unifier certaines règles de lecture côté DB, notamment autour des images et de la disponibilité produit

## Périmètre

Zones impactées par V19 :

- `db/prisma-client.ts`
- `db/health.ts`
- `db/repositories/**`
- `db/repositories/catalog/**`
- `db/repositories/products/**`
- `db/repositories/order.repository.ts`
- `db/repositories/guest-cart.repository.ts`
- `db/repositories/payment.repository.ts`
- `db/repositories/order-email.repository.ts`
- `db/repositories/admin-*.repository.ts`
- `db/repositories/*.types.ts`

Features et consumers impactés par le recâblage des types :

- `features/admin/blog/**`
- `features/admin/categories/**`
- `features/admin/homepage/**`
- `features/admin/media/**`
- `features/admin/orders/**`
- `features/admin/products/**`
- `features/cart/**`
- `features/checkout/**`
- `features/email/**`
- `features/homepage/types.ts`
- plusieurs pages `app/admin/**`, `app/panier/page.tsx`, `app/checkout/page.tsx`, `app/page.tsx`, `app/boutique/**`, `app/blog/**`

Hors périmètre de V19 :

- le workflow SQL de `db/migrations/`
- `prisma/schema.prisma` comme source éditable
- la logique métier de `entities/`
- l'introduction d'une couche `services/`

## Architecture finale de `db/`

### Arborescence réelle

```text
db/
├── prisma-client.ts
├── health.ts
└── repositories/
    ├── admin-blog.repository.ts
    ├── admin-blog.types.ts
    ├── admin-category.repository.ts
    ├── admin-category.types.ts
    ├── admin-homepage.repository.ts
    ├── admin-homepage.types.ts
    ├── admin-media.repository.ts
    ├── admin-media.types.ts
    ├── admin-users.repository.ts
    ├── admin-users.types.ts
    ├── catalog/
    │   ├── catalog.repository.ts
    │   ├── catalog.types.ts
    │   └── catalog.mappers.ts
    ├── guest-cart.repository.ts
    ├── guest-cart.types.ts
    ├── order-email.repository.ts
    ├── order-email.types.ts
    ├── order.repository.ts
    ├── order.types.ts
    ├── payment.repository.ts
    ├── payment.types.ts
    └── products/
        ├── admin-product.repository.ts
        ├── admin-product.types.ts
        ├── admin-product-variant.repository.ts
        ├── admin-product-variant.types.ts
        ├── admin-product-image.repository.ts
        ├── admin-product-image.types.ts
        └── simple-product-compat.ts
```

### `db/prisma-client.ts`

`db/prisma-client.ts` est le point d'entrée unique pour Prisma. Le projet utilise :

- `PrismaClient`
- `@prisma/adapter-pg`
- un singleton protégé contre le HMR en développement

V19 décommissionne complètement le pool `pg` historique.

### Rôle d'un repository

Un repository porte :

- les fonctions publiques d'accès aux données
- les transactions Prisma
- les mappers privés de persistance
- les helpers batch nécessaires pour éviter les N+1
- le remapping des erreurs Prisma vers des erreurs publiques métier

Un repository ne doit pas porter de logique métier transverse. Les calculs et règles métier restent dans `entities/`.

### Rôle d'un fichier `*.types.ts`

Un fichier `*.types.ts` porte :

- les types publics d'entrée et de sortie
- les unions de statuts et de codes
- les erreurs publiques de repository
- les éventuels ré-exports de types stables provenant d'une autre couche ou d'un autre repository

Dans l'état final de V19, la majorité des domaines suivent ce pattern.

### Ce qui est autorisé

- Prisma ORM uniquement
- `prisma.$transaction()` quand la cohérence de lecture/écriture l'exige
- `select` ciblés et explicites
- chargements batchés et reconstruction en mémoire quand Prisma ne peut pas exprimer directement la requête SQL historique

### Ce qui est interdit

- `prisma.$queryRaw`
- `prisma.$executeRaw`
- `Prisma.sql`
- mélange `pg` + Prisma
- logique métier enfouie dans les requêtes Prisma

### État réel vs cible visée

V19 rapproche fortement `db/` de la doctrine “repository runtime only / types publics séparés”, mais l'état final n'est pas parfaitement homogène :

- [db/repositories/admin-category.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/admin-category.repository.ts) ré-exporte encore `AdminCategory` et `AdminCategoryRepositoryError`
- [db/repositories/catalog/catalog.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/catalog.repository.ts) ré-exporte encore les types publics du catalogue

Ces deux exceptions ne remettent pas en cause la migration Prisma, mais elles restent des candidats V20.

## Lots V19

Note de lecture :

- l'historique git regroupe `V19-1a` et `V19-1b` dans un même commit
- la documentation les présente ici comme `V19-1` et `V19-2` pour coller au découpage logique final
- `V19-10` correspond à la finalisation visible dans l'état actuel du repository, au-delà du lot 9 historique

### V19-1 — Structure initiale

Ce lot restructure `db/` avant la migration complète :

- déplacement de `db/admin-media.ts` vers `db/repositories/admin-media.repository.ts`
- déplacement de `db/admin-users.ts` vers `db/repositories/admin-users.repository.ts`
- déplacement des repositories produit vers `db/repositories/products/`
- introduction de `db/repositories/catalog/`
- suppression de `db/queries/`
- mise à jour des imports consommateurs dans `app/`, `features/`, `components/` et `lib/`

Pourquoi :

- clarifier le périmètre des responsabilités
- préparer l'extraction des contrats publics
- sortir des fichiers “DB” isolés non alignés sur la structure repository

### V19-2 — Extraction des types

Ce lot crée et stabilise les `*.types.ts` publics :

- création de fichiers `*.types.ts` pour `admin-blog`, `admin-category`, `admin-homepage`, `admin-media`, `admin-users`, `guest-cart`, `order-email`, `order`, `payment`, `admin-product*`
- déplacement des types publics hors des implémentations
- recâblage des hubs `features/**/types/` vers les nouveaux fichiers `*.types.ts`

Pourquoi :

- rendre explicite la frontière publique de `db/`
- éviter les types “cachés” dans les repositories
- réduire le couplage direct entre pages/actions et l'implémentation data

### V19-3 — Nettoyage préalable et suppression des raw non justifiés

Ce lot supprime les usages raw qui n'étaient pas nécessaires à Prisma :

- `admin-blog` : bascule de transitions de statut en `$transaction` read → compute → update
- `admin-product` : suppression de raw devenus remplaçables par `_count`, `groupBy` et lectures Prisma séparées
- `admin-homepage` : remplacement d'un ordering SQL historique par `orderBy` Prisma avec `nulls: "last"`

Pourquoi :

- réduire la dette raw avant la vraie fin de migration
- réserver les derniers usages raw aux cas réellement bloqués par `LEFT JOIN LATERAL`

### V19-4 — Migration des repositories simples vers Prisma

Ce lot termine la migration de repositories à faible complexité transactionnelle :

- `admin-users.repository.ts`
- `order-email.repository.ts`

Ce qui change :

- reads et writes Prisma natifs
- conservation des signatures publiques
- conservation des erreurs publiques observables

Pourquoi :

- sécuriser le pattern Prisma sur des cas simples
- réduire le nombre de points d'entrée encore dépendants de l'ancienne couche SQL

### V19-5 — Payment + transactions Prisma

`payment.repository.ts` passe à Prisma avec transactions explicites :

- `findPaymentStartContextByOrderReference` via `findFirst` + relation `orders`
- `saveStripeCheckoutSessionForOrder` via `upsert`
- `markPaymentSucceededByCheckoutSessionId` et `markPaymentFailedByCheckoutSessionId` via `$transaction` en isolation `Serializable`

Pourquoi :

- reproduire proprement les sémantiques de verrouillage du SQL historique
- garder les flux Stripe cohérents sans `SELECT FOR UPDATE` manuel

### V19-6 — Guest-cart + money

`guest-cart.repository.ts` passe à Prisma et le projet extrait les helpers monétaires dans `lib/money.ts`.

Ce qui change :

- lecture/écriture du panier en Prisma
- `upsert` atomique sur `cart_items`
- `upsert` sur `cart_checkout_details`
- composition parallèle du contexte checkout invité
- extraction des helpers monétaires partagés pour `guest-cart` et `order`

Pourquoi :

- stabiliser le checkout invité
- centraliser les conversions monétaires simples hors repository

### V19-7 — Catalog partiellement Prisma

Le catalogue est décomposé dans `db/repositories/catalog/` :

- `catalog.repository.ts`
- `catalog.types.ts`
- `catalog.mappers.ts`

Ce qui migre en Prisma à ce stade :

- homepage content de base
- featured blog posts
- catégories de filtre
- images parent / images de variante
- variantes publiées
- blog public

Ce qui reste encore raw à ce stade :

- les requêtes avec `LEFT JOIN LATERAL`
- la sélection complexe d'image primaire produit
- `listPublishedProducts`
- certaines lectures homepage

Pourquoi :

- sortir `db/catalog.ts`
- isoler le catalogue public dans un domaine dédié
- migrer d'abord les lectures triviales ou modérées

### V19-8 — `order.repository.ts` vers Prisma + transactions

`order.repository.ts` passe à Prisma avec transactions `Serializable`.

Ce qui change :

- création de commande depuis le panier invité via `$transaction`
- boucles de retry sur l'unicité de la référence
- restock via `groupBy` et update loop
- lectures admin et publiques via `select` ciblés
- mapping natif Prisma des `Decimal` vers des montants string publics

Pourquoi :

- terminer la migration du domaine le plus sensible côté checkout
- conserver les garanties de cohérence de l'ancienne implémentation SQL

### V19-9 — Suppression `db/client.ts` + nettoyage final

Ce lot retire définitivement l'ancienne couche `pg` :

- suppression de `db/client.ts`
- suppression de `db/catalog.ts`
- migration de `db/health.ts` vers Prisma

À ce stade historique, `db/health.ts` utilise encore `prisma.$queryRaw\`SELECT 1\`` comme health check minimal.

Pourquoi :

- supprimer le dernier point d'entrée `pg`
- aligner tout `db/` sur `db/prisma-client.ts`

### V19-10 — Suppression complète du raw Prisma restant

Ce lot correspond à la finalisation visible dans l'état actuel du repository.

Ce qui change :

- suppression du raw Prisma résiduel dans `db/health.ts`
- suppression du raw Prisma dans `admin-category.repository.ts`
- suppression complète du raw Prisma dans `catalog/**`
- introduction d'un helper centralisé de sélection d'image primaire produit dans `catalog.repository.ts`
- reconstruction batchée en mémoire des lectures historiquement basées sur `LEFT JOIN LATERAL`
- normalisation déterministe des catégories homepage :
  - produit publié le plus récent
  - tie-break `created_at DESC`, puis `id DESC`
  - image choisie via le helper centralisé d'image primaire

Pourquoi :

- terminer la migration Prisma au sens strict
- supprimer le dernier SQL brut runtime
- unifier les règles de lecture du catalogue public
- rendre les reconstructions en mémoire lisibles, testables et sans N+1

## Règles techniques introduites

### Prisma

- Prisma ORM uniquement
- aucun appel runtime à `$queryRaw`, `$executeRaw` ou `Prisma.sql`
- `schema.prisma` reste un reflet du schéma, pas une source métier

### Repositories

- les fonctions publiques vivent dans `*.repository.ts`
- les transactions Prisma y restent locales
- les helpers batch restent dans le repository quand ils servent directement la requête
- la doctrine cible est “runtime only”

### Types

- les contrats publics vivent dans `*.types.ts`
- les erreurs publiques y sont définies
- les inputs publics y sont nommés explicitement
- les hubs feature ré-exportent ces types au lieu de les redéfinir

### Batch loading

- batch obligatoire quand Prisma remplace une ancienne jointure SQL complexe
- pas de boucle de requêtes par produit, catégorie ou ligne
- `select` minimal uniquement

### Image primaire produit

Règle unique introduite et réutilisée dans le catalogue :

1. `variant_id IS NULL`
2. `is_primary DESC`
3. `sort_order ASC`
4. `id ASC`

Cette règle est utilisée pour :

- homepage featured products
- listing catalogue
- détail produit public
- produits récents
- catégories homepage après normalisation V19-10

### Image représentative de catégorie

Deux cas existent dans l'état final :

- `admin-category` : produit publié le plus récent par `created_at DESC`, puis `id DESC`, avec image primaire produit uniquement (`variant_id = null`)
- `catalog/homepage categories` : produit publié le plus récent par `created_at DESC`, puis `id DESC`, puis sélection d'image via le helper primaire produit partagé

## Cas complexes documentés

### `catalog/**`

Le catalogue est le point le plus complexe de la migration :

- remplacement des `LEFT JOIN LATERAL`
- reconstruction en mémoire via batch loading
- centralisation de la sélection d'image primaire
- réutilisation des helpers existants `resolvePublishedSimpleOffer` et `getPublishedProductAvailability`
- conservation des contrats publics du storefront

Le repository catalogue reste volumineux car il concentre :

- homepage
- listing boutique
- détail produit
- blog public

### `listPublishedProducts`

`listPublishedProducts` est le principal compromis V19.

Lecture actuelle :

- `products.findMany` avec filtres Prisma
- recherche multi-relations :
  - nom
  - slug
  - catégories
  - couleur de déclinaison publiée
- batch sur les images candidates
- batch sur les variantes publiées utiles à l'offre simple et à la disponibilité
- dérivation en mémoire de :
  - `primaryImage`
  - `simpleOffer`
  - `isAvailable`
- filtrage `onlyAvailable` en mémoire
- ordering conditionnel :
  - `is_featured DESC`, `created_at DESC`, `id DESC` en listing éditorial
  - sinon `created_at DESC`, `id DESC`

### `admin-category`

`admin-category.repository.ts` remplace l'ancien `LATERAL` par :

- lecture batch de `product_categories`
- lecture batch des produits publiés liés
- lecture batch des images primaires produit
- reconstruction en mémoire de `representativeImage`

Le contrat `AdminCategory` est conservé.

## Impacts

### Positifs

- couche `db/` homogène autour de Prisma
- suppression du SQL brut runtime
- contrats publics beaucoup plus explicites
- frontière plus nette entre `db/` et `features/`
- batch loading visible et lisible dans les cas complexes
- maintenabilité et refactorabilité accrues

### Négatifs / compromis

- `listPublishedProducts` est potentiellement plus coûteux qu'une grosse requête SQL agrégée
- `db/health.ts` vérifie désormais la connectivité Prisma via `prisma.$connect()` plutôt qu'un vrai round-trip SQL utilisateur
- certaines requêtes sont volontairement normalisées de manière déterministe alors que le SQL historique était ambigu

## État final

État final de V19 visible dans le code :

- 0 appel runtime à `$queryRaw`
- 0 appel runtime à `$executeRaw`
- 0 usage runtime de `Prisma.sql`
- `db/client.ts` supprimé
- `db/catalog.ts` supprimé
- couche `db/` stable autour de Prisma
- contrats publics explicites dans la majorité des domaines
- transactions critiques migrées vers `prisma.$transaction()`

Précision :

- une recherche texte sur `db/` peut encore remonter un commentaire historique mentionnant `$queryRaw` dans `admin-homepage.repository.ts`
- ce commentaire ne correspond à aucun appel runtime

## Limites actuelles

V19 termine la migration Prisma, mais ne termine pas toute l'industrialisation de la couche `db/`.

Limites visibles dans l'état final :

- [db/repositories/catalog/catalog.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/catalog.repository.ts) reste très gros : 878 lignes
- [db/repositories/order.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/order.repository.ts) reste très gros : 728 lignes
- [db/repositories/products/admin-product.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/admin-product.repository.ts) reste volumineux : 592 lignes
- [db/repositories/admin-category.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/admin-category.repository.ts) garde encore des ré-exports publics et des inputs publics inline
- [db/repositories/catalog/catalog.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/catalog.repository.ts) garde encore un bloc de ré-export de types publics
- l'arborescence `db/repositories/` reste mixte :
  - `catalog/` et `products/` sont sous-découpés
  - `order`, `payment`, `guest-cart`, `admin-*` restent à plat
- `features/homepage/types.ts` dépend encore du ré-export de types du repository catalogue
- les fichiers `*.types.ts` restent globalement plats par domaine, sans sous-découpage inputs/errors/status

Ces limites ne remettent pas en cause V19, mais elles justifient un V20 centré sur la modularisation et la réduction de taille des fichiers.

## Suite prévue — V20

V20 peut logiquement porter :

- modularisation plus fine de `db/repositories/`
- introduction de sous-modules `queries/` ou `helpers/` quand le gain est net
- découpage des gros repositories (`catalog`, `order`, `admin-product`)
- découpage des `*.types.ts` trop larges
- homogénéisation de l'arborescence `db/repositories/`
- suppression des derniers ré-exports publics résiduels dans certains repositories

V20 n'a pas besoin de réouvrir la migration Prisma elle-même. Le sujet n'est plus la technologie d'accès à la base, mais la qualité structurelle de la couche `db/`.

## Prompt Codex — Génération documentation V19

Utilise ce prompt dans Codex pour régénérer ou compléter la documentation V19 à partir du code réel :

---

Tu es un Staff Engineer / CTO.

Ta mission : écrire ou valider la documentation V19 du dossier `db/` à partir de l’état réel du repository.

Contexte :

- Le projet a migré 100% vers Prisma ORM
- Aucun `$queryRaw`, `$executeRaw`, `Prisma.sql` n’est autorisé
- La couche `db/` repose uniquement sur des repositories
- Les contrats publics sont majoritairement dans des fichiers `*.types.ts`
- Les cas complexes (catalog, admin-category) utilisent du batch loading + reconstruction mémoire
- Il n’y a pas de couche service

Objectifs :

1. Vérifier que la documentation correspond exactement au code
2. Compléter les parties implicites ou sous-documentées
3. Ne jamais inventer de comportement non présent dans le code
4. Être précis, structuré, sans fluff

Contraintes :

- Pas de théorie générale sur Prisma
- Pas de refacto V20 (uniquement état V19)
- Pas de duplication inutile
- Ton factuel, niveau senior

À produire :

- Résumé clair de l’état final
- Description de l’architecture `db/`
- Règles techniques réelles (et non idéales)
- Explication des cas complexes (catalog, order, admin-category)
- Limites actuelles (réelles, observables)
- Aucun bullshit

Si un point est incertain → le signaler explicitement.

---

Ce prompt doit être utilisé pour maintenir la doc alignée avec le code réel, pas pour spéculer.
