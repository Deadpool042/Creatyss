# Doctrine V18 — Migration progressive vers Prisma

## Rôle de Prisma dans le projet

Prisma est introduit comme **couche d'accès aux données typée**, en remplacement progressif des repositories SQL bruts (`db/repositories/`).

Son rôle est strictement limité à :

- exécuter des requêtes sur la base de données
- fournir des types TypeScript générés automatiquement depuis le schéma
- gérer les relations de manière explicite et type-safe

Prisma **ne porte aucune logique métier**. La logique métier reste dans `entities/`.

---

## Position par rapport aux repositories existants

Les repositories actuels (`db/repositories/*.ts`) sont des fichiers SQL bruts qui :

- écrivent des requêtes SQL à la main
- définissent leurs propres types de lignes internes (`*Row`)
- mappent les résultats en types publics (`AdminCategory`, `AdminProduct`, etc.)
- gèrent eux-mêmes les erreurs PostgreSQL (`code === "23505"`, etc.)

Pendant la migration, Prisma **coexiste** avec ces repositories. Un repository peut être migré sans toucher aux autres.

Une fois un repository pleinement migré et validé, il est supprimé.

---

## Gestion des migrations SQL

La gestion du schéma **ne change pas** avec l'introduction de Prisma.

Le workflow reste :

1. Écrire une migration SQL dans `db/migrations/NNN_*.sql`
2. Appliquer via `make db-schema`
3. Exécuter `prisma db pull` pour resynchroniser `prisma/schema.prisma` avec le schéma réel
4. Commit des deux fichiers ensemble

Prisma n'est **pas** utilisé comme gestionnaire de migrations (`prisma migrate dev`). Le fichier `schema.prisma` est maintenu **en lecture seule** comme reflet du schéma réel — il est généré par introspection, pas écrit à la main.

Cette règle évite tout conflit entre le workflow Makefile existant et Prisma.

**`schema.prisma` ne doit pas être édité à la main.** En particulier, il est interdit d'y renommer des modèles ou des champs pour des raisons ergonomiques (ex. passer `product_categories` en `ProductCategory`). Tout renommage dans `schema.prisma` crée un écart avec le schéma réel et casse la garantie de cohérence offerte par l'introspection. Si un nom Prisma généré est peu lisible, il est documenté mais jamais corrigé manuellement.

---

## Client Prisma

Le client Prisma est instancié en singleton dans `db/prisma-client.ts`, sur le même modèle que `db/client.ts` (protection du pool en développement HMR).

```
db/
├── client.ts           → pool pg (maintenu pendant la migration)
├── prisma-client.ts    → PrismaClient singleton (introduit en V18-1)
└── repositories/       → repositories migrés progressivement
```

---

## Règles strictes

### Pas de mélange SQL brut + Prisma dans une même fonction

Une fonction utilise soit `queryRows` / `queryFirst` (pg), soit le client Prisma — jamais les deux dans la même fonction.

Pendant la coexistence, un repository peut appeler `pg` et un autre appeler Prisma. Ce qui est interdit, c'est de mélanger les deux dans un même appel ou une même transaction.

### Pas de règles métier dans la couche Prisma

La couche Prisma ne porte pas de **règles métier**. Une règle métier est un calcul, une décision ou une contrainte qui relève du domaine (ex. : "un produit simple ne peut avoir qu'une déclinaison", "un article ne peut être publié sans contenu").

En revanche, les **critères de requête fonctionnels** sont acceptables dans un repository Prisma, dès lors qu'ils définissent l'intention de la fonction de façon stable et évidente. Filtrer les produits publiés dans `listPublishedProducts` n'est pas de la logique métier — c'est la définition même de la fonction.

La ligne de partage :

| Acceptable dans Prisma                                        | Interdit dans Prisma                              |
| ------------------------------------------------------------- | ------------------------------------------------- |
| `where: { status: "published" }` dans `listPublishedProducts` | Calculer si un produit est publiable              |
| `orderBy: { createdAt: "desc" }`                              | Décider si une transition de statut est autorisée |
| `include: { variants: true }`                                 | Appliquer une règle de prix ou de stock           |
| `take: 10` (pagination)                                       | Calculer un slug depuis un nom                    |

Exemple interdit — règle métier dans Prisma :

```ts
// ❌ règle métier enfouie dans le repository
async function canPublishProduct(id: string): Promise<boolean> {
  const product = await prisma.product.findUnique({ where: { id } });
  return product?.status === "draft" && (product.variantCount ?? 0) > 0;
}
```

Exemple correct — critère fonctionnel dans Prisma, règle métier dans `entities/` :

```ts
// ✅ repository : requête fonctionnelle délimitée
async function findAdminProductById(id: string) {
  return prisma.product.findUnique({ where: { id }, include: { variants: true } });
}

// ✅ entities/ : règle métier pure
function getProductPublishability(product: AdminProduct): PublishabilityResult { … }
```

### Pas de types Prisma dans `entities/`

`entities/` ne doit pas importer depuis `@prisma/client`. Les types du domaine métier sont définis en TypeScript pur. Si un type Prisma est utile dans un composant ou une action, il passe par un mapper de feature.

### Une feature à la fois

La migration d'un repository se fait en isolation complète. On ne touche pas à deux repositories en parallèle dans le même lot.

### Une responsabilité à la fois

Pour chaque feature, on migre les **lectures** en premier, les **mutations** ensuite. Cette séquence permet de valider les types Prisma sur les reads avant de s'engager sur les writes.

---

## Stratégie de coexistence temporaire

Pendant V18, les deux clients coexistent :

- `db/client.ts` (`pg`) — actif jusqu'à ce que tous ses consommateurs soient migrés
- `db/prisma-client.ts` (Prisma) — introduit en V18-1, étendu lot par lot

Un repository migré n'importe plus `queryRows` / `queryFirst`. Il importe uniquement `prisma` depuis `db/prisma-client.ts`.

Les repositories non encore migrés continuent d'utiliser `pg` sans modification.

---

## Règle de compatibilité des repositories migrés

Un repository migré vers Prisma **doit exposer une interface publique identique** à l'ancienne implémentation. Les consommateurs (actions, pages, features) ne doivent pas être modifiés lors de la migration.

Concrètement, cela signifie :

- **Mêmes fonctions exportées** : noms, signatures et types de paramètres inchangés
- **Mêmes types publics retournés** : ex. `AdminCategory`, `AdminProduct` — le repository mappe les types Prisma générés vers ces types publics existants, exactement comme l'implémentation `pg` le faisait
- **Mêmes erreurs métier observables** : ex. `AdminCategoryRepositoryError` avec les mêmes codes (`slug_taken`, `category_referenced`) — seule l'erreur interne absorbée change (Prisma `P2002` → `AdminCategoryRepositoryError("slug_taken", ...)`)

Cette règle garantit que la migration est purement interne au repository et ne propage aucun changement vers les callers.

La suppression physique d'un ancien repository n'intervient qu'une fois la migration validée (typecheck + tests manuels).

---

## Règles de migration d'un repository

Pour chaque repository à migrer :

1. **Introspection** : vérifier que `schema.prisma` reflète bien la table concernée après `prisma db pull`
2. **Reads** : réécrire les fonctions de lecture avec Prisma, valider que les types publics retournés sont identiques
3. **Writes** : réécrire les fonctions d'écriture (create, update, delete), gérer les erreurs Prisma (`P2002`, `P2003`, etc.) et les re-mapper vers les `RepositoryError` existantes
4. **Validation typecheck** : `pnpm run typecheck` doit passer sans erreur
5. **Validation fonctionnelle** : vérifier manuellement les parcours admin couverts par ce repository
6. **Suppression** : supprimer l'ancien fichier uniquement après validation complète — retirer ses imports remplacés dans les consommateurs si nécessaire
7. **Commit atomique** : un commit par repository migré

---

## Gestion des transactions

Les repositories actuels qui utilisent `PoolClient` pour des transactions (`admin-homepage.repository.ts`, `admin-product.repository.ts`, `order.repository.ts`) doivent être migrés en utilisant `prisma.$transaction()`.

Ces repositories sont à traiter **en dernier** (V18-4 et V18-5) en raison de leur complexité transactionnelle.

---

## Gestion des erreurs Prisma

Les erreurs PostgreSQL actuellement interceptées manuellement (`code === "23505"`) sont remplacées par les codes d'erreur Prisma :

| Erreur actuelle             | Équivalent Prisma                            |
| --------------------------- | -------------------------------------------- |
| `23505` (contrainte unique) | `PrismaClientKnownRequestError` code `P2002` |
| `23503` (clé étrangère)     | `PrismaClientKnownRequestError` code `P2003` |
| Ligne non trouvée           | `PrismaClientKnownRequestError` code `P2025` |

Les `RepositoryError` métier (ex. `AdminCategoryRepositoryError`) sont conservées — elles absorbent les erreurs Prisma de la même façon qu'elles absorbaient les erreurs `pg`.

---

## Ce qui reste hors Prisma

| Couche                | Reste hors Prisma                                  |
| --------------------- | -------------------------------------------------- |
| `entities/`           | Logique métier, validators, règles, normalisations |
| `features/*/schemas/` | Validation Zod des formulaires et payloads         |
| `features/*/mappers/` | Transformations UI, label builders                 |
| `db/migrations/`      | Workflow SQL + Makefile inchangé                   |
| `lib/`                | Helpers techniques (env, auth, uploads)            |

---

## Interdictions

- Pas de refonte globale des repositories en un seul lot
- Pas de migration massive non contrôlée
- Pas de suppression d'un repository avant que tous ses consommateurs soient migrés et validés
- Pas de `prisma migrate dev` ou `prisma migrate deploy` — le workflow de migration reste SQL + Makefile
- Pas de types Prisma dans `entities/`
- Pas de logique métier dans les appels Prisma
- Pas de mélange `pg` + Prisma dans une même fonction
- Pas d'introduction de nouveaux patterns (service layer, use cases) dans ce lot

---

## Priorité de migration des repositories

| Repository                              | Priorité       | Raison                                                 |
| --------------------------------------- | -------------- | ------------------------------------------------------ |
| `admin-category.repository.ts`          | Haute — pilote | Simple, peu de tables, déjà pilote V17 Zod             |
| `admin-blog.repository.ts`              | Haute          | Pas de transaction, structure simple                   |
| `admin-media.ts`                        | Haute          | Simple, fichier non-repository                         |
| `admin-product.repository.ts`           | Moyenne        | Transactions, compatibilité simple product             |
| `admin-product-variant.repository.ts`   | Moyenne        | Dépend de admin-product                                |
| `admin-product-image.repository.ts`     | Moyenne        | Dépend de admin-product                                |
| `admin-homepage.repository.ts`          | Moyenne        | Transactions, jointures complexes                      |
| `admin-users.ts`                        | Basse          | Peu d'usages, lié à l'auth session                     |
| `order.repository.ts`                   | Basse          | Complexité maximale — transactions, webhooks, checkout |
| `payment.repository.ts`                 | Basse          | Couplé à Stripe et order                               |
| `order-email.repository.ts`             | Basse          | Couplé à order                                         |
| `guest-cart.repository.ts`              | Basse          | Couplé au checkout                                     |
| `simple-product-admin-compatibility.ts` | Basse          | Legacy bridge — traiter en dernier                     |
| `catalog.ts`                            | Basse          | Storefront, non prioritaire                            |
