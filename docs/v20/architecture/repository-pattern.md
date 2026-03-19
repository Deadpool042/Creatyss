# Pattern repository

## État actuel

Dans le code actuel, un repository est la façade publique d'un domaine de persistance.

Il peut contenir :

- les fonctions exportées utilisées par `app/` et `features/`
- les transactions Prisma
- des helpers privés de lecture et d'écriture
- des mappers de persistance
- des validations techniques locales
- le remapping des erreurs Prisma vers des erreurs publiques

Exemples représentatifs :

- `catalog.repository.ts`
- `order.repository.ts`
- `payment.repository.ts`
- `guest-cart.repository.ts`
- `admin-homepage.repository.ts`

## Ce qu'un repository fait réellement aujourd'hui

### Surface publique

Le repository expose des fonctions stables, par exemple :

- `listPublishedProducts`
- `getPublishedProductBySlug`
- `createOrderFromGuestCartToken`
- `markPaymentSucceededByCheckoutSessionId`
- `getAdminHomepageEditorData`

### Orchestration interne

Le repository orchestre souvent plusieurs étapes :

- lectures Prisma ciblées
- chargements batch
- assemblage en mémoire
- transaction Prisma si la cohérence l'exige
- conversion `bigint` / `Decimal` vers les contrats publics

### Gestion d'erreurs

Quand le domaine a une erreur publique, le repository absorbe les erreurs Prisma connues et les re-mappe.

Exemples :

- `AdminBlogRepositoryError`
- `AdminHomepageRepositoryError`
- `OrderRepositoryError`
- `AdminProductRepositoryError`

## Limite du pattern actuel

Sur les domaines simples, ce pattern reste lisible :

- `admin-media`
- `admin-users`
- `payment`

Sur les domaines complexes, le repository concentre encore trop de responsabilités internes :

- `catalog`
- `order`
- `admin-product`
- `admin-homepage`

Le problème actuel n'est pas la présence du repository. C'est la quantité de logique privée accumulée dans un seul fichier.

## Cible V20

La cible V20 n'est pas de supprimer les repositories. Elle est de clarifier leur rôle en interne.

### Repository

Le repository doit rester :

- la façade publique du domaine
- le lieu des signatures exportées
- le lieu des transactions
- le lieu du remapping des erreurs publiques

### Queries

Une couche `queries` interne pourra porter :

- les accès Prisma purs
- les `select` réutilisables
- les lectures batch de bas niveau
- les appels qui acceptent `prisma` ou `tx`

Cette couche n'existe pas encore dans le code actuel. V20 la documente pour préparer l'extraction.

### Helpers

Une couche `helpers` interne pourra porter :

- comparateurs
- normalisation d'identifiants
- assemblage mémoire
- sélection d'image primaire
- mappers privés non publics

### Types

Les contrats publics doivent rester à part dans `*.types.ts` puis, sur les domaines volumineux, évoluer vers un sous-dossier `types/`.

## Ce qui est autorisé

- garder la façade publique sur `*.repository.ts`
- garder les transactions dans le repository
- appeler des helpers internes de query ou de batch
- garder un helper privé local si l'extraction n'apporte rien

## Ce qui doit sortir d'un gros repository en premier

Ordre recommandé sur un domaine volumineux :

1. `select` et lectures Prisma répétées
2. helpers batch
3. mappers privés
4. comparateurs et normalisations locales

Ce qui ne doit pas sortir du repository tant qu'il n'y a pas de gain clair :

- les signatures exportées
- le remapping des erreurs publiques
- l'orchestration transactionnelle

## Ce qui est interdit

- créer une couche service générique
- déplacer des règles métier depuis `entities/` vers `db/`
- faire d'un `queries.ts` une nouvelle façade publique
- multiplier les fichiers internes sans pression réelle de taille ou de complexité

## Lecture V20 du pattern

V20 considère donc le repository comme un point d'entrée stable, pas comme un “gros fichier obligé”.

La modularisation à venir est interne au domaine. Elle ne change pas la frontière publique si elle est bien menée.
