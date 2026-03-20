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

**Note préalable :** le dossier `db/repositories/orders/` existe déjà dans le repo au démarrage de V21-3. Il a été créé vide par anticipation. V21-3 n'a donc pas à créer ce dossier — il doit y déposer les fichiers internes extraits conformément au périmètre défini. Ne pas supprimer ce dossier vide : il est intentionnel.

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
- le dépôt des fichiers internes extraits dans le dossier existant `db/repositories/orders/`

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
- nouveaux fichiers internes à déposer dans le dossier existant `db/repositories/orders/types/`
- nouveaux fichiers internes à déposer dans le dossier existant `db/repositories/orders/queries/`
- nouveaux fichiers internes à déposer dans le dossier existant `db/repositories/orders/helpers/`

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

- les helpers de transaction sont sortis de `order.repository.ts` dans `db/repositories/orders/helpers/`
- les lectures internes (publiques et admin) sont sorties de `order.repository.ts` dans `db/repositories/orders/queries/`
- les mappers de lignes de commande et de paiement sont sortis de `order.repository.ts` dans `db/repositories/orders/helpers/` ou `db/repositories/orders/mappers/`
- les façades publiques `order.repository.ts` et `order.types.ts` restent strictement stables
- la sémantique `Serializable`, le retry de référence et le restock sont préservés
- `typecheck` et `lint` passent

## Compatibilité publique

Compatibilité attendue :

- `@/db/repositories/order.repository` inchangé
- `@/db/repositories/order.types` inchangé
- mêmes exports publics
- mêmes signatures runtime

## Règle d'import interne

À l'intérieur du domaine `order`, les fichiers internes déposés sous `db/repositories/orders/` doivent importer les types directement depuis la source de vérité interne (ex. `./types/` ou `../orders/types/`), et non depuis la façade publique `order.types.ts`.

La façade publique `order.types.ts` est réservée aux consumers externes au domaine (`app/`, `features/`, `components/`).

Cette règle est cohérente avec la règle d'import interne établie pour `catalog` dans V21-2B et documentée dans [doctrine.md](../doctrine.md).

## Décisions ou ambiguïtés connues

Décisions déjà retenues :

- `order.repository.ts` reste le point d'entrée public
- `order.types.ts` reste la façade de types
- `order-email.repository.ts` ne fait pas partie de ce lot
- le dossier `db/repositories/orders/` existe déjà et ne doit pas être recréé

**Décision — type de transaction Prisma (`TxClient`) :** dans `order.repository.ts`, le type de transaction est défini localement comme `type TxClient = Parameters<Parameters<typeof prisma.$transaction>[0]>[0]`. Ce type est interne au domaine `order`. Il ne fait pas partie de la façade publique `order.types.ts`. Pour V21-3, ce type doit être extrait dans `db/repositories/orders/types/` et partagé entre tous les fichiers internes du domaine. Les fichiers internes sous `orders/` doivent importer `TxClient` depuis ce fichier partagé et non redéfinir chacun leur propre alias local.

Ambiguïtés connues :

- le découpage exact entre `queries/` et `helpers/` dépendra de la lisibilité réelle des transactions après extraction
