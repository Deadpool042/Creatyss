# Lot — Clients : historique et CRM minimal

## Statut

Livré — 2026-06-25

## Objectif

Doter le back-office d'une vue clients complète : historique de commandes, informations de contact, gestion du consentement RGPD. Un cadrage existe : `docs/lots/2026-06-16-commerce-customers-admin-v1-reference.md`.

## Périmètre

Livré au 2026-06-25 :

- `features/admin/customers/` et `app/admin/(protected)/commerce/customers/**` — liste clients et vue détail dédiée avec historique de commandes, informations de contact, adresses, statut et cycle de vie
- `prisma/core/commerce/customers.prisma` — modèle `Customer` déjà posé (observé)
- `prisma/optional/platform/consent.prisma` — modèles `ConsentPurpose` et `ConsentRecord` lus dans la vue client
- Affichage du consentement par purpose pour chaque client
- Action RGPD minimale : export des données client

Reste hors de ce lot :

- anonymisation ou suppression RGPD côté admin
- segmentation CRM avancée
- statut abonnement newsletter réellement éditable depuis la fiche

## Hors périmètre

- CRM avancé : `CrmContact`, `CrmTag`, segments comportementaux
- Support tickets et messagerie client
- Programme fidélité (couvert par `loyalty` dans `prisma/optional/`)
- Synchronisation CRM externe

## Dépendances

- H2 suffisamment stabilisé côté commandes (l'historique commandes nécessite des données de commandes cohérentes)
- Référence de cadrage existante : `docs/lots/2026-06-16-commerce-customers-admin-v1-reference.md`

## Invariants

- Les données client sont des données personnelles — aucune action irréversible sans confirmation explicite
- L'anonymisation RGPD ne doit pas casser les relations de commandes (les commandes peuvent rester avec un `customerId` null après anonymisation)
- Le modèle `Customer` existant ne doit pas être restructuré sans validation `architect-review`

## Risques

- RGPD : la gestion du consentement et le droit à l'effacement ont des implications légales — à valider avec un juriste si la boutique traite des données de résidentes européennes (très probable)
- Anonymisation vs suppression : la suppression physique d'un client casse les relations de commandes — l'anonymisation est préférable mais la décision doit être explicite
- `ConsentRecord` : les modèles sont lus dans l'admin, mais leur stratégie d'alimentation reste à auditer séparément

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Test manuel : liste clients, vue détail client avec historique, consentement affiché, export données

## Critères de fin

- L'admin peut accéder à la fiche d'un client avec son historique de commandes complet
- Le consentement par purpose est affiché sur la fiche client
- Une action d'export RGPD est disponible
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`next-admin-ui-builder`
