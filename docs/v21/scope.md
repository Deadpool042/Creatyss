# Scope V21

## Périmètre exact de V21

V21 couvre uniquement la modularisation interne de `db/`.

Le périmètre de travail est :

- `db/repositories/**`
- les façades publiques `*.repository.ts` et `*.types.ts`
- les futurs sous-dossiers internes locaux au domaine :
  - `types/`
  - `queries/`
  - `helpers/`
  - `mappers/` quand le gain est réel

## Façades publiques visées

Les façades publiques prioritairement visées sont :

- `order`
- `products`
- `catalog`

Cas particulier explicitement retenu :

- `catalog` est une façade publique de lecture / storefront read model, conservée pour compatibilité des chemins existants
- cette façade agrège aujourd'hui des lectures publiques liées à `homepage`, `categories`, `products` et `blog`
- `catalog` n'est pas documenté dans V21 comme un domaine métier autonome au même niveau que `order` ou `products`

## Domaines métier visés par V21

Les domaines métier réellement concernés par V21 sont :

- `products`
- `categories`
- `orders`
- `payment`
- `homepage`
- `blog`

Ces domaines ne sont pas tous portés par un repository public de même nom. Dans le code actuel, une partie des lectures publiques `homepage`, `categories`, `products` et `blog` reste agrégée derrière la façade `catalog`.

## Petits périmètres secondaires potentiels

En plus des zones prioritaires, V21 peut traiter des périmètres secondaires si le gain structurel est net :

- `admin-category`
- `admin-homepage`
- `guest-cart`
- `order-email`
- `payment`

Ces zones ne doivent pas être découpées par symétrie. Elles ne sont traitées que si le bénéfice structurel dépasse clairement le churn.

## Ce que V21 traite réellement

V21 traite :

- la taille des repositories
- la lisibilité des responsabilités internes
- la localité des helpers techniques
- la réutilisation des lectures Prisma internes
- la stabilisation des façades publiques existantes pendant le refactor

## Hors périmètre explicite

V21 ne couvre pas :

- le schéma PostgreSQL
- `db/migrations/`
- `db/seeds/`
- `db/prisma-client.ts`
- `db/health.ts`
- la logique métier dans `entities/`
- les composants UI
- les pages `app/`
- les cas d'usage `features/`, sauf migration d'import explicitement requise par un lot
- une nouvelle couche `services/`
- un dossier global `db/queries/`
- un dossier global `db/types/`
- un dossier global `db/helpers/`

## Invariants à préserver pendant V21

Chaque lot V21 doit préserver :

- Prisma only
- zéro raw SQL
- contrats publics inchangés
- signatures runtime inchangées
- comportement métier inchangé
- sémantique transactionnelle inchangée

## Risques si le scope est dépassé

Dépasser ce scope expose à des risques concrets :

### Risque 1 — churn de compatibilité

Changer les chemins publics ou les exports sans lot dédié augmente fortement le nombre de consumers à migrer et rend la revue plus fragile.

### Risque 2 — régression de comportement

Toucher en même temps à la structure interne et au comportement rend la validation beaucoup plus difficile, surtout sur :

- la façade publique `catalog`
- `order`
- `products`

### Risque 3 — dilution des responsabilités

Introduire des abstractions globales ou cross-domain crée une couche supplémentaire qui n'existe pas dans le modèle actuel du projet.

### Risque 4 — refactor trop large

Traiter plusieurs domaines denses dans le même lot augmente le risque de casser :

- l'ordering
- les règles d'image
- la disponibilité
- les transactions

### Risque 5 — contradiction avec V19 et V20

Dépasser le périmètre V21 revient à contredire :

- V19, qui a stabilisé la couche Prisma
- V20, qui a défini une modularisation interne locale et incrémentale

## Lecture opérationnelle

Le périmètre V21 est volontairement étroit :

- refactor interne seulement
- façade publique stable
- petits lots
- bénéfice lisible lot par lot

Tout changement qui ne rentre pas dans ce cadre doit être traité comme hors scope et arrêté avant implémentation.
