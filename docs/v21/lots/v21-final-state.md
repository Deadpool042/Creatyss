# V21 — État final attendu

## Summary

Ce document décrit l'état cible attendu de `db/repositories/` après fermeture de V21.

Il ne décrit pas un état déjà atteint aujourd'hui. Il décrit le résultat recherché par les lots V21 dans le respect du code et de la doctrine existants.

## Objectif

Figer la forme finale visée pour `db/repositories/` après V21, afin que chaque lot converge vers la même structure sans changer l'API publique.

## Audit de départ / contexte réel

État réel actuel :

- seul `catalog` a commencé sa modularisation interne via V21-2A
- `order` reste une grosse façade plate
- `products` reste partiellement découpé publiquement mais dense en interne
- les petits domaines restent majoritairement plats

## Périmètre exact

L'état final attendu de V21 couvre :

- la structure interne de `db/repositories/`
- les façades publiques conservées
- les sous-dossiers internes réellement introduits

## Hors périmètre exact

L'état final attendu de V21 ne couvre pas :

- une nouvelle couche `services/`
- des dossiers globaux `db/queries/`, `db/types/`, `db/helpers/`
- un changement de schéma
- un changement de logique métier

## Fichiers potentiellement concernés

En cible finale, les zones principales concernées sont :

- `db/repositories/catalog/**`
- `db/repositories/order.repository.ts`
- `db/repositories/order.types.ts`
- `db/repositories/orders/**`
- `db/repositories/products/**`
- `db/repositories/admin-category*`
- `db/repositories/admin-homepage*`
- `db/repositories/payment*`
- `db/repositories/guest-cart*`
- `db/repositories/order-email*`

## Invariants à préserver

Invariants globaux de fin de version :

- Prisma only
- zéro raw SQL
- façades publiques conservées
- contrats publics stables
- signatures runtime stables
- logique métier hors `db/`

## Risques principaux

Risques principaux si l'état final est mal interprété :

- vouloir homogénéiser tous les domaines à tout prix
- sur-découper des domaines déjà suffisamment lisibles
- casser des imports publics pour satisfaire une symétrie artificielle

## Vérifications obligatoires

Vérifications attendues à fermeture de V21 :

- `pnpm run typecheck`
- `pnpm run lint`
- vérification des façades publiques conservées
- vérification de l'absence de raw SQL
- vérification documentaire de cohérence avec les lots réellement livrés

## Critères de fin

V21 sera considéré fermé quand :

- `catalog` sera modularisé au-delà de V21-2A
- `order` sera modularisé derrière ses façades publiques
- `products` sera clarifié en interne
- les petits domaines auront été traités uniquement si le gain est net
- la documentation V21 décrira l'état réellement livré

## Compatibilité publique

Compatibilité finale attendue :

- conservation des façades publiques `*.repository.ts`
- conservation des façades publiques `*.types.ts`
- consumers `app/` et `features/` non cassés par la modularisation interne

## Décisions ou ambiguïtés connues

Décisions déjà retenues :

- la modularisation reste locale au domaine
- la façade publique reste le point d'entrée
- les petits domaines ne seront pas découpés par principe

Ambiguïtés connues :

- certains petits domaines pourront rester plats après V21 si leur découpage n'apporte pas de gain net
- [simple-product-compat.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/simple-product-compat.ts) pourra rester un fichier interne autonome
- [order-email.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/order-email.repository.ts) pourra rester un repository satellite si son découpage n'apporte pas de bénéfice clair
