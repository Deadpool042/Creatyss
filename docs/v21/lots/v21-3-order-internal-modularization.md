# V21-3 — `order` : modularisation interne

## Summary

V21-3 est le lot prévu pour modulariser le domaine `order` derrière ses façades publiques existantes :

- [order.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/order.repository.ts)
- [order.types.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/order.types.ts)

## Objectif

Réduire la densité de `order.repository.ts` en sortant les lectures, helpers transactionnels et mappers internes vers une structure locale, sans changer :

- les façades publiques
- les signatures runtime
- les contrats publics
- la sémantique transactionnelle

## Audit de départ / contexte réel

État réel actuel :

- `order.repository.ts` : 728 lignes
- `order.types.ts` : 123 lignes

Responsabilités aujourd'hui mélangées dans `order.repository.ts` :

- validations techniques locales
- mappers de lignes de commande et de paiement
- helpers de transaction
- restock des variantes commandées
- lectures publiques
- lectures admin
- création de commande depuis le guest cart
- transitions de statut
- expédition

Le domaine importe aussi [order-email.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/order-email.repository.ts) pour enrichir le détail admin.

## Périmètre exact

V21-3 doit couvrir :

- la modularisation interne de `order.repository.ts`
- la conservation de `order.repository.ts` comme façade publique
- la conservation de `order.types.ts` comme façade publique de types
- l'introduction d'une structure interne locale sous `db/repositories/orders/`

## Hors périmètre exact

V21-3 ne doit pas couvrir :

- la modularisation de `order-email.repository.ts`
- une modification des contrats publics `order.types.ts`
- une modification de `payment.repository.ts`
- une modification de la logique métier des transitions de statut
- une modification du schéma ou des migrations

## Fichiers potentiellement concernés

- `db/repositories/order.repository.ts`
- `db/repositories/order.types.ts`
- nouveaux fichiers internes sous `db/repositories/orders/types/`
- nouveaux fichiers internes sous `db/repositories/orders/queries/`
- nouveaux fichiers internes sous `db/repositories/orders/helpers/`

## Invariants à préserver

Invariants critiques :

- isolation `Serializable` sur les transactions qui la portent aujourd'hui
- boucle de retry externe sur la génération de référence de commande
- comportement de restock lors des transitions qui le déclenchent
- validation du checkout draft avant création de commande
- compatibilité des contrats publics admin et storefront

## Risques principaux

Risques principaux :

- casser la sémantique transactionnelle
- casser la génération ou l'unicité de `reference`
- casser le restock des variantes commandées
- diluer la lecture des transitions de statut entre trop de fichiers

## Vérifications obligatoires

- `pnpm run typecheck`
- `pnpm run lint`
- vérification ciblée des façades publiques `order.repository.ts` et `order.types.ts`
- vérification ciblée de la conservation des transactions `Serializable`

## Critères de fin

V21-3 est considéré terminé quand :

- `order.repository.ts` est sensiblement allégé
- les helpers de transaction, lectures et mappings internes sont sortis de la façade
- les façades publiques restent strictement stables
- la sémantique `Serializable`, le retry de référence et le restock sont préservés
- `typecheck` et `lint` passent

## Compatibilité publique

Compatibilité attendue :

- `@/db/repositories/order.repository` inchangé
- `@/db/repositories/order.types` inchangé
- mêmes exports publics
- mêmes signatures runtime

## Décisions ou ambiguïtés connues

Décisions déjà retenues :

- `order.repository.ts` reste le point d'entrée public
- `order.types.ts` reste la façade de types
- `order-email.repository.ts` ne fait pas partie de ce lot

Ambiguïtés connues :

- le découpage exact entre `queries/` et `helpers/` dépendra de la lisibilité réelle des transactions après extraction
