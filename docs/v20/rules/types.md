# Règles V20 — Types

## État actuel

Le code actuel utilise majoritairement un fichier `*.types.ts` par domaine.

Ce fichier porte aujourd'hui :

- les outputs publics
- les inputs publics
- les erreurs publiques
- les unions de statuts et de codes

Ce pattern est déjà en place sur :

- `order`
- `payment`
- `guest-cart`
- `order-email`
- `admin-blog`
- `admin-homepage`
- `admin-media`
- `admin-users`
- `admin-product*`
- `catalog`

Exceptions réelles :

- `admin-category.repository.ts` garde encore des inputs publics inline et ré-exporte ses types
- `catalog.repository.ts` ré-exporte encore les types du domaine

## Cible V20

Sur les domaines volumineux, la cible documentaire V20 est :

```text
types/
├── inputs.ts
├── outputs.ts
├── errors.ts
└── status.ts
```

Cette cible n'est pas encore implémentée dans le code actuel.

## Règles strictes

### Public only

Les types publics exposés aux callers doivent vivre dans `*.types.ts` ou, sur un gros domaine, dans un sous-dossier `types/`.

### Pas de type public inline dans le repository

Un repository ne doit pas définir inline :

- un input public
- un output public
- une erreur publique
- une union de statuts publique

### Les types privés restent locaux

Peuvent rester dans le repository :

- `TxClient`
- structures Prisma locales
- rows internes
- comparateurs privés

### Les hubs feature sont des façades

`features/**/types/**` peuvent :

- ré-exporter les types publics `db`
- ajouter des types purement feature

Ils ne doivent pas :

- redéfinir un contrat public `db`
- devenir une seconde source de vérité

## Quand appliquer la cible modulaire

### Petit domaine

Conserver un seul `*.types.ts` quand :

- le domaine est petit
- le fichier reste lisible
- les catégories de types ne se mélangent pas fortement

Exemples actuels :

- `admin-media.types.ts`
- `admin-users.types.ts`
- `payment.types.ts`

### Gros domaine

Préparer un découpage `types/` quand :

- les inputs deviennent nombreux
- les erreurs et statuts grossissent
- plusieurs fichiers internes doivent consommer les mêmes contrats

Candidats naturels observables :

- `catalog`
- `order`
- `admin-product`

## Lecture V20

Le but n'est pas de découper tous les types par principe.

Le but est de rendre les gros domaines lisibles sans réintroduire de types cachés dans les repositories.
