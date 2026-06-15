<!-- docs/lots/2026-06-14-satellite-channels-cadrage.md -->

# Cadrage — `satellite.channels` (lecture admin)

> Roadmap point 6. Lot borne conforme `AGENTS.md` : objectif / perimetre /
> hors perimetre / invariants / risques / verifications / criteres de fin.

## Objectif

Ouvrir `satellite.channels` par un premier increment **lecture seule** :
activation gouvernee, lecture admin de `Channel`, `ChannelProductStatus` et
`ChannelVariantStatus`, sans publication, sans synchronisation provider et sans
regles d'eligibilite automatiques.

## Etat reel (audit)

- **Modele Prisma deja pose** (`prisma/satellites/channels.prisma`, `Level: L1`) :
  - `Channel` : definition interne, type, statut, `isEnabled` ;
  - `ChannelProductStatus` : statut de publication et eligibilite par produit ;
  - `ChannelVariantStatus` : statut de publication et eligibilite par variante.
- **Aucun code applicatif dedie** : pas de seed feature flag, pas de gating,
  pas de page admin, pas de create/update.

## Frontieres a preserver

- `channels` porte ici le **referentiel interne de diffusion** et ses statuts.
- `channels` **ne porte pas** :
  - les appels provider (`integrations`) ;
  - la recherche ;
  - la vendabilite generale ;
  - les prix, taxes ou remises ;
  - la publication sociale.

## Perimetre retenu (V1)

1. Seed `FeatureFlag satellite.channels` (`DRAFT`, inactif par defaut).
2. Query de gating admin.
3. Lecture admin du referentiel :
   - compteurs canaux / statuts ;
   - derniers `Channel` ;
   - derniers `ChannelProductStatus` ;
   - derniers `ChannelVariantStatus`.
4. Page discrète `/admin/settings/channels`, reliee au flag actif dans
   `/admin/settings/advanced`.
5. Mise a jour doc domaine + roadmap + etat des lieux.

## Hors perimetre

- creation ou edition de canaux ;
- publication / depublciation ;
- synchronisation Google Shopping / Meta / marketplaces ;
- moteur de regles d'eligibilite ;
- jobs, webhooks, observabilite avancee ;
- projection storefront.

## Decisions retenues

- **D1 — Point d'entree UI** : page discrète `/admin/settings/channels`,
  protegee par `admin.settings.advanced.read`.
- **D2 — Nature du lot** : lecture seule stricte.
- **D3 — Statuts lus** : etat reel Prisma uniquement, sans reinterpretation
  provider ni logique supplementaire.

## Invariants a preserver

- aucune source de verite catalogue ne depend de `channels` ;
- aucun appel provider n'est introduit ;
- aucun changement de schema Prisma ;
- aucune mutation de publication n'est ajoutee.

## Risques

- utilite immediate limitee si les tables sont vides ;
- confusion possible entre "referentiel canal" et "integration provider" ;
- risque de glissement vers `integrations` si le lot sort du read-only.

## Verifications

- `pnpm run typecheck`
- `pnpm run lint`

## Criteres de fin

- `satellite.channels` peut etre active depuis `settings/advanced` ;
- une page admin expose l'etat reel des canaux et de leurs statuts ;
- aucune regression sur le reste de l'admin ;
- la doc reflète l'etat reel sans promettre de synchronisation inexistante.
