# Règles V20 — Queries

## Constat de départ

Le code actuel ne contient pas encore de couche `queries` dans `db/repositories/**`.

La nécessité apparaît pourtant clairement dans les gros domaines :

- `catalog.repository.ts`
- `order.repository.ts`
- `admin-product.repository.ts`
- `admin-homepage.repository.ts`
- `admin-category.repository.ts`

## Pourquoi introduire `queries`

Objectif :

- réduire la taille des gros repositories
- isoler les accès Prisma purs
- rendre les transactions plus lisibles
- réutiliser certains `select` et batch loaders internes

Ce besoin est réel. Il vient du code actuel, pas d'une préférence d'architecture abstraite.

## Ce qui doit aller dans `queries`

Une query interne peut porter :

- un appel Prisma pur
- un `where` builder
- un `orderBy` builder
- un `select` partagé
- un batch loader qui retourne des lignes ou des structures internes
- une fonction acceptant `prisma` ou `tx`

Exemples cibles évidents à partir du code actuel :

- chargement des images primaires dans `catalog`
- chargement des variantes publiées utiles au catalogue
- lecture structurée d'une commande avec `ORDER_SELECT`
- chargement des catégories liées à un produit

## Ce qui ne doit pas aller dans `queries`

- le mapping vers les contrats publics
- les erreurs publiques
- les décisions métier
- l'orchestration transactionnelle de haut niveau
- les signatures publiques du repository

## Règle de dépendance

La façade publique continue d'être le repository.

Le flow cible est :

```text
repository -> queries / helpers -> prisma
```

Pas :

```text
feature -> queries -> prisma
```

## Forme cible

Sur un domaine simple, un fichier `*.queries.ts` peut suffire.

Sur un domaine volumineux, un sous-dossier `queries/` sera plus réaliste.

À ce stade, la documentation V20 emploie `queries` comme nom de responsabilité, pas comme structure déjà imposée partout.

## Critère d'extraction

Extraire une query quand :

- elle est relue ou réutilisée plusieurs fois
- elle masque une partie importante de la complexité Prisma
- elle améliore directement la lisibilité de la façade publique

Ne pas extraire une query quand :

- elle n'est utilisée qu'une fois
- elle rend le flux plus difficile à suivre
- elle force à naviguer entre trop de petits fichiers
