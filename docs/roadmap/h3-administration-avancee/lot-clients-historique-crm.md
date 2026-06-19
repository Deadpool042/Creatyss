# Lot — Clients : historique et CRM minimal

## Statut

A faire

## Objectif

Doter le back-office d'une vue clients complète : historique de commandes, informations de contact, gestion du consentement RGPD. Un cadrage existe : `docs/lots/2026-06-16-commerce-customers-admin-v1-reference.md`.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `features/admin/customers/` — vue détail client avec historique de commandes, informations de contact, statut abonnement newsletter
- `prisma/core/commerce/customers.prisma` — modèle `Customer` déjà posé (observé)
- `prisma/optional/platform/consent.prisma` — modèles `ConsentPurpose` et `ConsentRecord` déjà posés (observé dans le schéma), à brancher sur la vue client
- Affichage du consentement actif par purpose pour chaque client
- Actions RGPD minimales : export des données client, suppression ou anonymisation sur demande

## Hors périmètre

- CRM avancé : `CrmContact`, `CrmTag`, segments comportementaux
- Support tickets et messagerie client
- Programme fidélité (couvert par `loyalty` dans `prisma/optional/`)
- Synchronisation CRM externe

## Dépendances

- H2 terminé (commandes fiables — l'historique commandes nécessite des commandes cohérentes)
- Référence de cadrage existante : `docs/lots/2026-06-16-commerce-customers-admin-v1-reference.md`

## Invariants

- Les données client sont des données personnelles — aucune action irréversible sans confirmation explicite
- L'anonymisation RGPD ne doit pas casser les relations de commandes (les commandes peuvent rester avec un `customerId` null après anonymisation)
- Le modèle `Customer` existant ne doit pas être restructuré sans validation `architect-review`

## Risques

- RGPD : la gestion du consentement et le droit à l'effacement ont des implications légales — à valider avec un juriste si la boutique traite des données de résidentes européennes (très probable)
- Anonymisation vs suppression : la suppression physique d'un client casse les relations de commandes — l'anonymisation est préférable mais la décision doit être explicite
- `ConsentRecord` : les modèles sont posés en Prisma mais leur alimentation (quand et comment le consentement est enregistré) n'est pas observée comme implémentée

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Test manuel : vue détail client avec historique, consentement affiché, export données

## Critères de fin

- L'admin peut accéder à la fiche d'un client avec son historique de commandes complet
- Le consentement actif par purpose est affiché sur la fiche client
- Une action d'export ou d'anonymisation RGPD est disponible
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`next-admin-ui-builder`
