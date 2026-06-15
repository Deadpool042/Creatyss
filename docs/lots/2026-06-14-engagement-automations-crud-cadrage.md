<!-- docs/lots/2026-06-14-engagement-automations-crud-cadrage.md -->

# Cadrage — `engagement.automations` (CRUD admin des définitions)

> Suite de `docs/lots/2026-06-14-engagement-automations-cadrage.md` et de
> `docs/lots/2026-06-14-engagement-automations-schema-cadrage.md`.
> Lot borne conforme `AGENTS.md` : objectif / perimetre / hors perimetre /
> invariants / risques / verifications / criteres de fin.

## Objectif

Remplacer le placeholder `/admin/marketing/automations` par un premier
referentiel admin reel des definitions `Automation`, sans ouvrir encore
l'execution metier.

## Etat reel (audit)

- le `FeatureFlag engagement.automations` est seedé ;
- le schema Prisma `Automation` existe ;
- la page admin reste un `AdminComingSoon` ;
- les patterns comparables dans le repo sont `commerce.discounts` et
  `engagement.newsletter` : CRUD admin borne, sans execution complete du domaine.

## Frontieres a preserver

- aucune execution runtime d'automation n'est introduite ;
- aucune integration `jobs`, `workflow`, `scheduling`, `newsletter`,
  `notifications` ou `webhooks` n'est branchee ;
- aucun journal d'execution ni retry n'est ajoute ;
- aucun `configJson` libre n'est expose dans l'UI de creation.

## Perimetre retenu

1. Query admin de lecture des `Automation` du store courant.
2. Action de creation d'une definition `Automation` en statut `DRAFT`.
3. Action d'activation / desactivation (`ACTIVE` <-> `INACTIVE`,
   `DRAFT` -> `ACTIVE`).
4. Composants admin :
   - formulaire de creation ;
   - liste des definitions.
5. Remplacement du placeholder `/admin/marketing/automations`.
6. Mise a jour de la doc domaine, roadmap, etat des lieux et cockpit marketing.

## Hors perimetre

- edition complete d'une automation existante ;
- archivage / suppression ;
- execution effective sur evenements source ;
- templates riches ou configuration JSON libre ;
- campagne newsletter, email provider, notification ou webhook reels.

## Decisions retenues

- **D1 — Niveau fonctionnel** : CRUD **definitions seulement**.
- **D2 — Creation** : toute nouvelle automation est creee en `DRAFT`, puis
  activable explicitement.
- **D3 — Champs exposes** : `code`, `name`, `description`, `triggerType`,
  `actionType`, `delayMinutes`, `templateCode`.
- **D4 — Toggle** : meme logique que les autres lots admin simples :
  `ACTIVE` -> `INACTIVE`, sinon `ACTIVE`.

## Invariants a preserver

- une automation active reste une definition, pas une execution ;
- l'admin ne doit pas laisser croire qu'un runtime existe deja ;
- le referentiel reste strictement borne au store courant ;
- le schema public du modele Prisma n'est pas modifie dans ce lot.

## Risques

- confusion possible entre "active" et "effective en production" ;
- risque de surinterpreter `templateCode` comme un moteur de templating complet ;
- pression future pour brancher `configJson` trop tot dans l'UI.

## Verifications

- `pnpm run typecheck`
- `pnpm run lint`

## Criteres de fin

- `/admin/marketing/automations` affiche des definitions reelles en base ;
- une definition peut etre creee puis active/desactivee ;
- la page dit explicitement que l'execution runtime reste hors lot ;
- la doc de suivi reflète ce niveau reel du module.
