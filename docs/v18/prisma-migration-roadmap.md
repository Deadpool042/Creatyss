# Roadmap V18 — Migration progressive vers Prisma

---

## V18-1 — Setup Prisma

### Objectif

Installer Prisma, générer `schema.prisma` depuis la base existante, configurer le client singleton et le workflow Docker. Aucune migration de repository dans ce lot.

### Périmètre

- Installation des dépendances `prisma` (devDependency) et `@prisma/client` (dependency)
- Création de `prisma/schema.prisma` par introspection (`prisma db pull`)
- Création de `db/prisma-client.ts` — singleton PrismaClient avec protection HMR
- Ajout de `prisma generate` dans le Dockerfile (ou le script de démarrage Docker)
- Mise à jour du `Makefile` : nouvelle cible `db-prisma-pull` pour resynchroniser `schema.prisma`
- Vérification que `pnpm run typecheck` passe avec le client généré

### Fichiers créés ou modifiés

| Fichier                | Action                                                |
| ---------------------- | ----------------------------------------------------- |
| `prisma/schema.prisma` | Créé (généré par `prisma db pull`)                    |
| `db/prisma-client.ts`  | Créé (singleton)                                      |
| `package.json`         | Ajout `prisma` (dev) + `@prisma/client` (prod)        |
| `Makefile`             | Ajout cible `db-prisma-pull`                          |
| `Dockerfile`           | Ajout `prisma generate` dans le build ou l'entrypoint |
| `.gitignore`           | Vérification que `node_modules/.prisma` est ignoré    |

### Détail de `db/prisma-client.ts`

Pattern identique à `db/client.ts` — protection du pool en mode HMR Next.js :

```ts
import { PrismaClient } from "@prisma/client";

declare global {
  var __creatyssPrisma__: PrismaClient | undefined;
}

function createPrismaClient() {
  return new PrismaClient();
}

export const prisma = globalThis.__creatyssPrisma__ ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.__creatyssPrisma__ = prisma;
}
```

### Cible Makefile à ajouter

```makefile
db-prisma-pull:
	$(COMPOSE_CORE) exec $(APP_SERVICE) pnpm exec prisma db pull
```

À exécuter après chaque migration SQL pour resynchroniser `schema.prisma`.

### Critères d'acceptation

- `prisma db pull` exécuté sans erreur depuis le conteneur
- `prisma generate` exécuté sans erreur
- `pnpm run typecheck` passe
- `db/prisma-client.ts` importable depuis un repository sans erreur TypeScript
- Aucun repository existant modifié

### Risques

- Le schéma introspécté peut avoir des types Prisma non idéaux (ex. `BigInt` pour les `bigint GENERATED ALWAYS` de PostgreSQL) — documenter et ne pas corriger dans ce lot
- `prisma generate` doit être inclus dans le Docker build pour que `@prisma/client` soit disponible — vérifier le Dockerfile

---

## V18-2 — Lectures pilote : `categories`

### Objectif

Remplacer les fonctions de **lecture** de `admin-category.repository.ts` par des requêtes Prisma. Les mutations restent en `pg`.

### Périmètre

Fonctions migrées vers Prisma :

- `listAdminCategories`
- `findAdminCategoryById`
- `countProductsForCategory`

Fonctions conservées en `pg` (intactes dans ce lot) :

- `createAdminCategory`
- `updateAdminCategory`
- `updateAdminCategoryImage`
- `deleteAdminCategory`

### Fichiers concernés

| Fichier                                        | Action                             |
| ---------------------------------------------- | ---------------------------------- |
| `db/repositories/admin-category.repository.ts` | Modifié — reads migrés vers Prisma |
| `db/prisma-client.ts`                          | Consommé (déjà créé en V18-1)      |

### Points d'attention

- Le type public `AdminCategory` doit rester identique — les consommateurs (`features/admin/categories/`, `app/admin/(protected)/categories/`) ne doivent pas être modifiés
- La jointure latérale `REP_IMAGE_LATERAL` (image représentative de la catégorie) est aujourd'hui une sous-requête SQL complexe — vérifier si elle peut être exprimée proprement via `include` Prisma ou si une query SQL brute Prisma (`prisma.$queryRaw`) est nécessaire
- `countProductsForCategory` peut rester en `pg` si l'expression Prisma est moins claire

### Critères d'acceptation

- `pnpm run typecheck` passe
- `/admin/categories` charge et affiche les catégories correctement
- Aucune régression sur la création / édition de catégorie (mutations encore en `pg`)
- Types `AdminCategory` inchangés côté consommateurs

### Risques

- La jointure latérale pour `representativeImage` peut ne pas être exprimable directement en Prisma → fallback `$queryRaw` acceptable dans ce lot, documenté explicitement

---

## V18-3 — Mutations pilote : `categories`

### Objectif

Remplacer les fonctions de **mutation** de `admin-category.repository.ts` par Prisma. À l'issue de ce lot, le repository categories n'a plus de dépendance à `pg` — son implémentation est entièrement Prisma, son interface publique reste identique.

La suppression physique du fichier intervient **après** validation complète (typecheck + tests manuels), en même temps que le commit de fin de lot. Elle n'est pas réalisée avant.

### Périmètre

Fonctions migrées vers Prisma dans `admin-category.repository.ts` :

- `createAdminCategory`
- `updateAdminCategory`
- `updateAdminCategoryImage`
- `deleteAdminCategory`

Gestion des erreurs :

- Remplacer la détection manuelle (`error.code === "23505"`) par `PrismaClientKnownRequestError` avec code `P2002` (slug_taken) et `P2003` (category_referenced)
- `AdminCategoryRepositoryError` conservée — elle continue d'abstraire les erreurs Prisma pour les appelants, avec les mêmes codes métier

Interface publique : inchangée. Les fonctions exportées, leurs signatures et les types retournés (`AdminCategory`, `AdminCategoryRepositoryError`) restent identiques. Aucun consommateur ne doit être modifié.

### Fichiers concernés

| Fichier                                        | Action                                                          |
| ---------------------------------------------- | --------------------------------------------------------------- |
| `db/repositories/admin-category.repository.ts` | Implémentation intégralement migrée vers Prisma — puis supprimé |

### Critères d'acceptation

- `pnpm run typecheck` passe
- Création, édition, suppression de catégorie fonctionnent depuis l'admin
- `AdminCategoryRepositoryError` avec codes `slug_taken` et `category_referenced` levée correctement sur les cas limites
- Aucun import de `queryRows` / `queryFirst` dans le repository catégories
- Aucun consommateur modifié (types et signatures publiques identiques)

### Risques

- Différence de comportement sur les erreurs de contrainte entre `pg` et Prisma — tester les cas slug dupliqué et catégorie référencée
- `deleteAdminCategory` : vérifier que la cascade PostgreSQL `ON DELETE CASCADE` est bien reflétée dans `schema.prisma`

---

## V18-4 — Extension : `blog` et `admin-media`

### Objectif

Migrer deux repositories sans transaction et sans complexité relationnelle, pour valider le pattern Prisma sur des cas plus simples que `categories` avant d'aborder `products`.

### Périmètre

#### `admin-blog.repository.ts`

Fonctions à migrer :

- `listAdminBlogPosts` (summary)
- `findAdminBlogPostById` (detail)
- `createAdminBlogPost`
- `updateAdminBlogPost`
- `deleteAdminBlogPost`

Pas de transaction, pas de jointure complexe → migration complète reads + writes dans ce lot.

#### `admin-media.ts`

Fonctions à migrer :

- `listAdminMediaAssets`
- `getAdminMediaAssetById`
- `createAdminMediaAsset`
- `deleteAdminMediaAsset`

Fichier simple, une seule table `media_assets`.

### Fichiers concernés

| Fichier                                    | Action                                     |
| ------------------------------------------ | ------------------------------------------ |
| `db/repositories/admin-blog.repository.ts` | Migré vers Prisma — supprimé après validation |
| `db/admin-media.ts`                        | Migré vers Prisma — supprimé après validation |

### Points d'attention

- Les types publics `AdminBlogPost`, `AdminBlogPostSummary` et les types de `admin-media` restent identiques — mapper depuis les types Prisma générés
- `AdminBlogRepositoryError` (code `slug_taken`) conservée — absorbe `P2002`

### Critères d'acceptation

- `pnpm run typecheck` passe
- `/admin/blog` : listing, création, édition, suppression fonctionnent
- Médias : upload et sélection dans les formulaires fonctionnent
- Aucun consommateur modifié

### Risques

- `admin-blog.repository.ts` utilise `has_content` (colonne calculée ou champ de résumé) — vérifier que `schema.prisma` introspécté expose bien ce champ ou adapter le calcul dans le mapper

---

## V18-5 — Extension : `products` sans transactions

### Objectif

Migrer les fonctions de `admin-product.repository.ts`, `admin-product-variant.repository.ts` et `admin-product-image.repository.ts` qui **ne font pas appel à des transactions**. Les fonctions transactionnelles (`changeProductType`, `convertToSimpleProduct`) restent en `pg` et sont reportées à V18-6.

### Périmètre

#### `admin-product.repository.ts` — fonctions sans transaction

- `listAdminProductSummaries`
- `findAdminProductById`
- `createAdminProduct`
- `updateAdminProduct`
- `deleteAdminProduct`

Fonctions avec transaction (report à V18-6) :

- `changeProductType`
- `convertToSimpleProduct`

#### `admin-product-variant.repository.ts`

Migration complète : pas de transaction dans ce repository.

#### `admin-product-image.repository.ts`

Migration complète : pas de transaction dans ce repository.

### Fichiers concernés

| Fichier                                               | Action                                         |
| ----------------------------------------------------- | ---------------------------------------------- |
| `db/repositories/admin-product.repository.ts`         | Partiellement migré — fonctions sans transaction |
| `db/repositories/admin-product-variant.repository.ts` | Migré vers Prisma — supprimé après validation  |
| `db/repositories/admin-product-image.repository.ts`   | Migré vers Prisma — supprimé après validation  |

### Points d'attention

- `admin-product.repository.ts` importe `simple-product-admin-compatibility.ts` (`syncLegacyVariantCommercialFieldsFromSimpleProduct`) — ne pas toucher à ce fichier dans ce lot
- Les jointures multi-tables produit/variantes/catégories dans `findAdminProductById` peuvent produire des types Prisma `include` différents des anciens types — mapper explicitement vers les types publics existants (`AdminProductDetail`, `AdminProductSummary`)
- `admin-product.repository.ts` reste un fichier mixte (`pg` + Prisma) à l'issue de ce lot — acceptable temporairement, documenté

### Critères d'acceptation

- `pnpm run typecheck` passe
- `/admin/products` : listing, création, édition fonctionnent
- Gestion des variantes et images fonctionnelle
- Aucune régression sur `changeProductType` et `convertToSimpleProduct` (encore en `pg`)
- Aucun consommateur des repositories variantes et images modifié

### Risques

- `admin-product.repository.ts` est le fichier le plus volumineux du projet (jointures produit/variante/catégorie) — si la migration s'avère trop complexe dans ce lot, réduire le périmètre aux fonctions summary + create/update basiques et reporter findAdminProductById à V18-6
- Les types Prisma générés pour les relations `include` peuvent diverger des types publics actuels — le mapping explicite est obligatoire

---

## V18-6 — Transactions : `products` et `homepage`

### Objectif

Migrer les fonctions transactionnelles de `admin-product.repository.ts` vers `prisma.$transaction()`, migrer `simple-product-admin-compatibility.ts`, puis migrer `admin-homepage.repository.ts` (transaction multi-tables complexe).

### Périmètre

#### `admin-product.repository.ts` — fonctions avec transaction

- `changeProductType` — wrappe des mutations produit/variante en transaction
- `convertToSimpleProduct` — idem

#### `simple-product-admin-compatibility.ts`

Bridge legacy qui synchronise des champs entre la structure produit simple et les déclinaisons. À migrer après que les fonctions qui l'appellent soient migrées.

#### `admin-homepage.repository.ts`

Transaction complexe multi-tables :

- `getAdminHomepageCurrentHeroImagePath` — lecture simple, migrable seule
- `updateAdminHomepage` — transaction : homepage + featured_products + featured_categories + featured_blog_posts (DELETE + INSERT en séquence)

### Fichiers concernés

| Fichier                                                 | Action                                               |
| ------------------------------------------------------- | ---------------------------------------------------- |
| `db/repositories/admin-product.repository.ts`           | Finalisation — fonctions transactionnelles + supprimé après validation |
| `db/repositories/simple-product-admin-compatibility.ts` | Migré vers Prisma — supprimé après validation        |
| `db/repositories/admin-homepage.repository.ts`          | Migré vers Prisma — supprimé après validation        |

### Points d'attention

- `prisma.$transaction()` prend en paramètre une callback avec un client `tx` — la syntaxe diffère d'un `PoolClient` mais la garantie atomique est identique
- `updateAdminHomepage` effectue un DELETE + INSERT groupé sur plusieurs tables de jointure — exprimer chaque étape comme opération Prisma distincte dans la transaction
- `simple-product-admin-compatibility.ts` est un bridge entre deux états d'un produit (champs natifs + déclinaison legacy) — analyser ses appels entrants avant de migrer
- Une fois `admin-product.repository.ts` entièrement migré et `simple-product-admin-compatibility.ts` supprimé, aucun fichier admin ne doit plus importer depuis `@/db/client`

### Critères d'acceptation

- `pnpm run typecheck` passe
- Changement de type produit (simple ↔ variable) fonctionne
- Édition homepage (hero, textes, sélections featured) fonctionne
- Aucun import de `queryRows` / `queryFirst` dans les repositories admin (`admin-product`, `admin-homepage`)
- Aucun consommateur modifié

### Risques

- `prisma.$transaction()` en mode interactif (sequential operations) peut avoir des comportements subtils différents du `BEGIN/COMMIT` SQL — tester les rollbacks sur erreur
- `updateAdminHomepage` est la transaction la plus critique de l'admin : une régression sur les sélections featured doit être détectée immédiatement par un test manuel exhaustif

---

## V18-7 — Commandes, storefront et décommission du pool `pg`

### Objectif

Migrer les repositories restants (commandes, storefront, utilisateurs admin), puis supprimer `db/client.ts` et les dépendances `pg` une fois qu'**aucun fichier ne les importe plus**.

### Périmètre

#### Repositories commandes et paiements

À traiter dans cet ordre de préférence (du moins risqué au plus risqué) :

1. `order-email.repository.ts` — simple, pas de transaction
2. `db/admin-users.ts` — simple, peu de lignes
3. `guest-cart.repository.ts` — couplé au checkout, pas de transaction critique
4. `db/catalog.ts` — lectures publiques, pas de mutation
5. `payment.repository.ts` — couplé à Stripe webhook
6. `order.repository.ts` — le plus complexe : transaction de création de commande, transitions de statut, webhooks

#### Décommission du pool `pg`

La suppression de `db/client.ts`, `pg` et `@types/pg` n'intervient **que lorsque tous les consommateurs ont disparu** — pas avant.

Séquence de décommission :

1. Vérifier par grep exhaustif qu'aucun fichier n'importe `queryRows`, `queryFirst` ou `db` depuis `@/db/client`
2. Supprimer `db/client.ts`
3. Relancer `pnpm run typecheck` — aucune erreur attendue
4. Supprimer `pg` et `@types/pg` de `package.json`
5. Relancer `pnpm run typecheck` + `make app-build`

Si un consommateur résiduel est détecté à l'étape 1, la décommission est bloquée jusqu'à migration complète de ce consommateur.

### Fichiers concernés

| Fichier                                       | Action                                                                      |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| `db/repositories/order-email.repository.ts`   | Migré vers Prisma — supprimé après validation                               |
| `db/admin-users.ts`                           | Migré vers Prisma — supprimé après validation                               |
| `db/repositories/guest-cart.repository.ts`    | Migré vers Prisma — supprimé après validation                               |
| `db/catalog.ts`                               | Migré vers Prisma — supprimé après validation                               |
| `db/repositories/payment.repository.ts`       | Migré vers Prisma — supprimé après validation                               |
| `db/repositories/order.repository.ts`         | Migré vers Prisma — supprimé après validation                               |
| `db/client.ts`                                | Supprimé uniquement quand tous les consommateurs sont migrés et validés     |
| `package.json`                                | Suppression de `pg` et `@types/pg` après suppression de `db/client.ts`     |

### Points d'attention

- `order.repository.ts` est le repository le plus risqué du projet : il intervient dans la création de commande, les transitions de statut, les webhooks Stripe et les emails transactionnels. Ne migrer qu'avec un plan de validation e2e ciblé.
- `payment.repository.ts` est couplé au webhook Stripe (`/api/stripe/webhook`) — toute régression est critique et silencieuse en local sans tunnel Stripe actif
- `db/client.ts` et les dépendances `pg` ne sont supprimés qu'en toute fin, jamais en cours de migration

### Critères d'acceptation

- `pnpm run typecheck` passe
- `make app-build` passe
- Grep sur `@/db/client` : aucun résultat dans le projet (hors `db/client.ts` lui-même avant suppression)
- `db/client.ts` supprimé sans erreur TypeScript
- Parcours admin complet fonctionnel
- Parcours storefront fonctionnel (catalogue, panier, checkout)

### Risques

- Les transactions Prisma ont un comportement légèrement différent de `BEGIN/COMMIT` SQL explicite sur les rollbacks — tester les cas d'erreur
- `order.repository.ts` et `payment.repository.ts` impliquent des webhooks Stripe — ne migrer qu'avec un plan e2e ou une validation manuelle avec Stripe CLI en local

---

## Commandes de vérification

### Vérifications minimales (chaque lot)

```bash
pnpm run typecheck
make app-build
```

### Vérification Prisma

```bash
# Depuis le conteneur app
pnpm exec prisma db pull
pnpm exec prisma generate
pnpm exec prisma validate
```

### Resynchronisation schéma après migration SQL

```bash
make db-prisma-pull   # cible à créer en V18-1
```

---

## Hors périmètre de V18

- Introduction de nouvelles fonctionnalités métier
- Refonte de la couche `entities/`
- Migration de la validation Zod (stable depuis V17)
- Introduction d'un pattern "service" ou "use case"
- Modification du Dockerfile en dehors de l'ajout `prisma generate`
- Changement du schéma de base de données (aucune nouvelle migration dans ce lot)
