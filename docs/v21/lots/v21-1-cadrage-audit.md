# V21-1 — Cadrage et audit

## Summary

V21-1 a été un lot de cadrage. Il n'a modifié aucun fichier de code.

Le lot a figé les constats structurels de départ de `db/repositories/` et a produit le séquençage de V21 par domaines, avant toute modularisation effective.

## Objectif

Documenter l'état réel de `db/repositories/` après V19 et V20 pour :

- identifier les repositories les plus denses
- repérer les blocs naturels à extraire
- préserver les chemins publics existants
- définir un ordre de refactor sûr

## Audit de départ / contexte réel

Au moment du cadrage, les principaux constats étaient :

- `db/` était déjà 100% Prisma ORM
- les contrats publics étaient déjà explicites dans la majorité des domaines
- le problème n'était plus technologique, mais structurel

Les plus gros fichiers observés au démarrage de V21 étaient :

- `db/repositories/catalog/catalog.repository.ts` : 878 lignes avant V21-2A
- `db/repositories/order.repository.ts` : 728 lignes
- `db/repositories/products/admin-product.repository.ts` : 592 lignes
- `db/repositories/guest-cart.repository.ts` : 449 lignes
- `db/repositories/admin-homepage.repository.ts` : 425 lignes
- `db/repositories/admin-category.repository.ts` : 365 lignes

Les constats structurels figés par le cadrage étaient :

- arborescence mixte entre domaines déjà découpés (`catalog`, `products`) et domaines encore plats
- repositories publics encore trop chargés en helpers privés, queries et mapping
- dette de lisibilité plus forte sur `catalog`, `order` et `products`
- nécessité de garder les façades publiques existantes pour éviter du churn applicatif

## Périmètre exact

V21-1 a couvert :

- la lecture de `db/repositories/**`
- l'analyse des responsabilités actuelles
- la définition d'une structure cible locale par domaine
- la proposition d'un ordre de lots V21

## Hors périmètre exact

V21-1 n'a pas couvert :

- toute modification de code
- toute modification de contrat public
- toute modification de schéma
- toute migration SQL
- tout recâblage de consumer

## Fichiers potentiellement concernés

En lecture :

- `db/repositories/catalog/**`
- `db/repositories/order.repository.ts`
- `db/repositories/order.types.ts`
- `db/repositories/products/**`
- `db/repositories/guest-cart.repository.ts`
- `db/repositories/admin-homepage.repository.ts`
- `db/repositories/admin-category.repository.ts`
- `db/repositories/payment.repository.ts`
- `db/repositories/order-email.repository.ts`

En écriture :

- aucun fichier de code
- documentation et plan de version uniquement

## Invariants à préserver

V21-1 a figé les invariants suivants pour les lots à venir :

- façades publiques stables
- Prisma only
- zéro raw SQL
- aucune modification de comportement métier
- aucun refactor big bang

## Risques principaux

Risques identifiés au cadrage :

- élargir V21 à des changements d'API publique
- mélanger modularisation interne et changement de comportement
- traiter trop de domaines denses en parallèle
- introduire une structure globale `db/queries/` ou `db/types/` contraire à la localité par domaine

## Vérifications obligatoires

Pour V21-1, les vérifications utiles étaient :

- confirmer qu'aucun code n'était modifié
- confirmer la cohérence du séquençage par lots
- confirmer que les chemins publics sensibles étaient bien identifiés avant toute extraction

## Critères de fin

V21-1 est considéré terminé quand :

- les fichiers prioritaires sont identifiés
- les extractions naturelles sont listées
- l'ordre des lots est fixé
- la structure cible minimale par domaine est posée
- aucun fichier de code n'a été modifié

## Compatibilité publique

V21-1 n'a changé aucune compatibilité publique.

## Décisions ou ambiguïtés connues

Décisions prises :

- commencer par `catalog`
- traiter `order` avant `products`
- garder les façades publiques existantes

Ambiguïtés connues au cadrage :

- la profondeur exacte de certains futurs sous-dossiers internes
- le niveau de découpage utile pour les petits domaines
- le traitement futur du ré-export de types encore présent dans certaines façades
