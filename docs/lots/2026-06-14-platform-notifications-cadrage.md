<!-- docs/lots/2026-06-14-platform-notifications-cadrage.md -->

# Cadrage — `platform.notifications` (lecture admin)

> Roadmap point 6. Lot borne conforme `AGENTS.md` : objectif / perimetre /
> hors perimetre / invariants / risques / verifications / criteres de fin,
> avec distinction etat reel vs cible.

## Objectif

Ouvrir `platform.notifications` par un premier increment **DB-backed** et
strictement borne : seed du `FeatureFlag`, lecture admin du referentiel
`Notification` / `NotificationPreference`, sans introduire de moteur d'emission
provider ni de scenarios marketing.

## Etat reel (audit)

- **Modele Prisma deja pose** (`prisma/optional/platform/notifications.prisma`,
  `Level: L1`) :
  - `Notification` : destinataire `USER|CUSTOMER`, canaux `IN_APP|EMAIL|REALTIME`,
    statuts `PENDING|SENT|READ|FAILED|CANCELLED|ARCHIVED`, sujet optionnel,
    horodatages de lecture/envoi/echec.
  - `NotificationPreference` : `recipientKey`, destinataire, canal, `topic`,
    `isEnabled`, archivage.
- **Aucun code applicatif dedie** : pas de seed feature flag, pas de query de
  gating, pas de lecture admin du referentiel.
- **Page existante a ne pas confondre** : `/admin/settings/notifications`
  gere deja les emails transactionnels du store (domaine `core`), sans lecture
  des tables `Notification*`.

## Frontieres (doctrine, a preserver)

- `notifications` porte le referentiel interne des notifications structurees et
  de leurs preferences.
- `notifications` **ne porte pas** dans ce lot :
  - les providers externes (`integrations`) ;
  - la newsletter et le marketing ;
  - un moteur de diffusion temps reel ;
  - des scenarios produit automatiques.

## Perimetre retenu (V1)

1. Seed `FeatureFlag platform.notifications` (`DRAFT`, inactif par defaut).
2. Query de gating admin.
3. Lecture admin du referentiel :
   - compteurs globaux simples ;
   - dernieres `Notification` ;
   - dernieres `NotificationPreference`.
4. Integration UI dans `/admin/settings/notifications` en gardant la section
   existante de reglages emails transactionnels.
5. Lien depuis `/admin/settings/advanced` quand la feature est active.
6. Mise a jour doc domaine + roadmap + etat des lieux.

## Hors perimetre

- emission reelle de notifications ;
- actions CRUD admin sur `Notification` / `NotificationPreference` ;
- branchement a des evenements metier (`orders`, `payments`, `returns`) ;
- providers externes email/push/realtime ;
- segmentation marketing, campagnes, newsletter ;
- websocket, polling temps reel, inbox client/storefront.

## Decisions retenues

- **D1 — Point d'entree UI** : reutiliser `/admin/settings/notifications`
  plutot qu'introduire une nouvelle route homonyme ou un doublon de navigation.
- **D2 — Nature du lot** : lecture admin **seulement** ; pas d'action
  d'emission manuelle dans ce tour.
- **D3 — Portee des lectures** : boutique courante + entrees globales
  (`storeId = null`) si elles existent.

## Invariants a preserver

- aucun changement de schema Prisma ;
- aucun changement de comportement des emails transactionnels existants ;
- aucune logique provider dans l'UI ;
- aucune creation automatique de notifications fictives.

## Risques

- confusion entre la page de reglages email existante et le module optionnel ;
- lot utile mais initialement vide tant qu'aucun producteur de notifications
  n'ecrit dans les tables ;
- glissement de perimetre vers `integrations` ou `marketing`.

## Verifications

- `pnpm run typecheck`
- `pnpm run lint`

## Criteres de fin

- `platform.notifications` peut etre active depuis les reglages avances ;
- `/admin/settings/notifications` expose, une fois active, une lecture admin
  reelle du referentiel `Notification` / `NotificationPreference` ;
- la page core existante continue de fonctionner sans regression si la feature
  reste inactive ;
- roadmap, doc domaine et etat des lieux refletent l'etat reel.
