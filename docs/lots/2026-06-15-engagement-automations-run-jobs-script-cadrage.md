<!-- docs/lots/2026-06-15-engagement-automations-run-jobs-script-cadrage.md -->

# Cadrage — `engagement.automations` exécution automatique bornée des jobs

## Objectif

Permettre l'exécution automatique des jobs `PENDING` dus du flux
`NEWSLETTER_SUBSCRIBED`, sans intervention admin, en réutilisant strictement
l'exécuteur unitaire existant.

## Périmètre

- script `scripts/run-automation-jobs.ts` (commande `pnpm run
  automations:run-jobs`) ;
- sélection des `Job` `PENDING`, `typeCode =
  AUTOMATION_NEWSLETTER_SUBSCRIBED`, `archivedAt: null`,
  `scheduledAt <= now`, limités à un lot borné ;
- appel de `executeAutomationJob` pour chaque job sélectionné ;
- résumé console (sélectionnés / réussis / échoués) ;
- mise à jour de `docs/domains/cross-cutting/automations.md` (décision
  d'implémentation).

## Hors périmètre

- tout `actionType` / `triggerType` autre qu'`EMAIL_MESSAGE` /
  `NEWSLETTER_SUBSCRIBED` ;
- retry automatique des jobs `FAILED` ou politique de reprise générique ;
- nouvelle route API, nouveau modèle Prisma ;
- configuration effective du cron système OVH (documentée comme suite
  opérationnelle, pas comme code) ;
- cockpit admin de pilotage du worker.

## Invariants

- aucune modification de `executeAutomationJob` ni du schéma Prisma ;
- le claim atomique existant (`updateMany` PENDING → RUNNING,
  `count === 1`) reste l'unique garde-fou d'idempotence ; le script peut donc
  être rejoué/chevauché sans double exécution ;
- la route canonique `/admin/marketing/automations` et son cockpit manuel
  restent inchangés ;
- le script reste borné à `AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE`.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- exécution manuelle : créer un job dû via souscription newsletter, lancer
  `pnpm run automations:run-jobs`, vérifier passage `SUCCEEDED`/`FAILED` et
  trace `EmailMessage`.

## Critères de fin

- `pnpm run automations:run-jobs` exécute les jobs `PENDING` dus du flux
  `NEWSLETTER_SUBSCRIBED` et affiche un résumé ;
- aucun changement de contrat public, de schéma ou de route existante ;
- `docs/domains/cross-cutting/automations.md` documente cette exécution
  automatique bornée.

## Statut — implémenté (2026-06-15)

- `scripts/helpers/load-env.ts` : charge `.env*` (`@next/env`) en effet de
  bord, importé en premier pour que `serverEnv`/`db` se résolvent hors Next.
- `scripts/run-automation-jobs.ts` : sélectionne les `Job` `PENDING`,
  `typeCode = AUTOMATION_NEWSLETTER_SUBSCRIBED`, `archivedAt: null`,
  `scheduledAt <= now` (lot par défaut 50, `--batch-size=`), appelle
  `executeAutomationJob` pour chacun, affiche un résumé
  sélectionnés/réussis/échoués.
- `package.json` : commande `automations:run-jobs`.
- `docs/domains/cross-cutting/automations.md` : nouvelle décision
  d'implémentation documentant ce script et son rôle complémentaire au
  cockpit manuel.

`pnpm run typecheck` et lint ciblé (`eslint scripts/run-automation-jobs.ts
scripts/helpers/load-env.ts`) passent sans erreur. Vérification manuelle
(exécution réelle avec job dû) non effectuée dans ce lot — à faire en
environnement avec base de données disponible.

Hors périmètre confirmé inchangé : configuration cron OVH effective,
cockpit admin du worker, retry générique.
