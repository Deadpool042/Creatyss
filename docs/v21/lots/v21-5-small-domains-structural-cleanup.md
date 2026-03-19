# V21-5 — Domaines restants : nettoyage structurel

## Summary

V21-5 est le lot prévu pour traiter les domaines restants seulement si le gain structurel est réel :

- `admin-category`
- `admin-homepage`
- `payment`
- `guest-cart`
- `order-email`

## Objectif

Nettoyer les domaines plats encore denses ou ambigus sans provoquer de churn structurel supérieur au bénéfice obtenu.

## Audit de départ / contexte réel

État réel actuel :

- `admin-category.repository.ts` : 365 lignes
- `admin-homepage.repository.ts` : 425 lignes
- `payment.repository.ts` : 167 lignes
- `guest-cart.repository.ts` : 449 lignes
- `order-email.repository.ts` : 118 lignes

Points saillants observables :

- `admin-category.repository.ts` garde encore des ré-exports publics et des inputs inline
- `admin-homepage.repository.ts` mélange lectures options, validations et transaction de mise à jour
- `guest-cart.repository.ts` reste un gros fichier plat avec CRUD, disponibilité et contexte checkout
- `payment.repository.ts` est déjà relativement compact
- `order-email.repository.ts` est déjà relativement compact et agit comme domaine satellite

## Périmètre exact

V21-5 doit couvrir uniquement les domaines où un nettoyage structurel apporte un gain net de lisibilité.

Les domaines à examiner explicitement sont :

- `db/repositories/admin-category.repository.ts`
- `db/repositories/admin-homepage.repository.ts`
- `db/repositories/payment.repository.ts`
- `db/repositories/guest-cart.repository.ts`
- `db/repositories/order-email.repository.ts`

## Hors périmètre exact

V21-5 ne doit pas couvrir :

- un refactor par symétrie
- une obligation de découper `payment` ou `order-email` si le gain est faible
- une modification des contrats publics
- une modification des comportements métier ou transactionnels

## Fichiers potentiellement concernés

- `db/repositories/admin-category.repository.ts`
- `db/repositories/admin-category.types.ts`
- `db/repositories/admin-homepage.repository.ts`
- `db/repositories/admin-homepage.types.ts`
- `db/repositories/payment.repository.ts`
- `db/repositories/payment.types.ts`
- `db/repositories/guest-cart.repository.ts`
- `db/repositories/guest-cart.types.ts`
- `db/repositories/order-email.repository.ts`
- `db/repositories/order-email.types.ts`

## Invariants à préserver

Invariants critiques :

- aucun changement de transaction sur `admin-homepage` ou `payment`
- aucun changement de disponibilité, sous-total ou checkout draft sur `guest-cart`
- aucun changement sur `AdminCategory` et sa lecture admin
- aucun changement sur les contrats `order-email`

## Risques principaux

Risques principaux :

- créer du churn documentaire et technique sans gain réel
- sur-découper `payment` ou `order-email`
- casser un domaine plat qui était encore lisible

## Vérifications obligatoires

- `pnpm run typecheck`
- `pnpm run lint`
- vérification que seuls les domaines à gain net sont réellement modifiés
- vérification que les domaines non rentables à découper sont laissés intacts

## Critères de fin

V21-5 est considéré terminé quand :

- les domaines qui gagnent réellement en lisibilité ont été nettoyés
- les domaines où le gain est faible ont été explicitement laissés en l'état
- aucun churn opportuniste n'a été introduit
- `typecheck` et `lint` passent

## Compatibilité publique

Compatibilité attendue :

- mêmes chemins publics
- mêmes exports publics
- mêmes signatures runtime

## Décisions ou ambiguïtés connues

Décision déjà retenue :

- ce lot n'est pas un passage obligé de découpage pour tous les domaines restants

Ambiguïtés connues :

- `payment` et `order-email` peuvent légitimement rester quasiment inchangés si le gain structurel n'est pas démontré
