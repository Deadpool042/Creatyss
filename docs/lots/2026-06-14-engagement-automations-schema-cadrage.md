<!-- docs/lots/2026-06-14-engagement-automations-schema-cadrage.md -->

# Cadrage — `engagement.automations` (schéma minimal de définition)

> Suite de `docs/lots/2026-06-14-engagement-automations-cadrage.md`.
> Lot borne conforme `AGENTS.md` : objectif / perimetre / hors perimetre /
> invariants / risques / verifications / criteres de fin.

## Objectif

Poser le premier schéma Prisma utile pour `engagement.automations` sans ouvrir
encore l'exécution métier :

- definition d'automations gouvernées par boutique ;
- vocabulaire minimal des déclencheurs et actions supportés ;
- migration SQL dédiée ;
- mise à jour de la documentation de suivi.

## Etat reel (audit)

- le module est déjà **catalogué**, **seedé** et **documenté** ;
- la route `/admin/marketing/automations` existe, mais reste un placeholder ;
- aucun modèle Prisma `Automation` n'est encore matérialisé ;
- la doctrine projet distingue clairement :
  - `workflow` pour l'orchestration générique ;
  - `scheduling` pour l'intention temporelle ;
  - `jobs` pour l'exécution différée ;
  - `newsletter` / `notifications` / `email` pour les domaines voisins.

## Frontieres a preserver

- ce lot pose la **définition**, pas l'exécution ;
- aucun `AutomationExecution` / `AutomationRun` n'est ajouté ;
- aucun rattachement direct à `Job`, `SchedulePlan`, `WorkflowInstance`,
  `Notification`, `NewsletterCampaign` ou `EmailMessage` n'est posé ;
- aucun CRUD admin ni moteur runtime n'est ajouté.

## Perimetre retenu

1. Ajouter `prisma/optional/engagement/automations.prisma`.
2. Ajouter les back-relations nécessaires dans `Store` et `User`.
3. Ajouter une migration SQL dédiée.
4. Mettre à jour la doc domaine, la roadmap et l'état des lieux.
5. Vérifier `prisma validate`, `prisma generate`, `typecheck`, `lint`.

## Hors perimetre

- exécution réelle des automations ;
- retries, journal d'exécution, statuts de run ;
- intégration `jobs`, `scheduling` ou `workflow` au niveau relationnel ;
- actions providers ;
- UI de lecture ou d'édition des automations ;
- déclencheurs métier branchés sur événements réels.

## Decisions retenues

- **D1 — Niveau de modélisation** : un seul modèle `Automation`, centré sur la
  définition métier, sans modèle de run.
- **D2 — Temporalité** : `delayMinutes` est conservé dans la définition ; les
  occurrences planifiées restent hors lot et relèveront ensuite de
  `scheduling` / `jobs`.
- **D3 — Config légère** : un champ `configJson` est autorisé pour éviter de
  sur-spécifier trop tôt les variantes d'actions.
- **D4 — Scope** : `storeId` obligatoire, car le module est piloté à l'échelle
  boutique.

## Invariants a preserver

- une automation possède un `triggerType` explicite et un `actionType`
  explicite ;
- une automation ne devient pas un job, un workflow ou une notification par
  simple changement de statut ;
- le schéma ne doit pas imposer prématurément une sémantique provider ;
- la migration doit rester strictement additive.

## Risques

- schéma encore trop générique si `configJson` absorbe toute la sémantique ;
- schéma trop étroit si les déclencheurs V1 évoluent vite ;
- tentation future de rajouter de l'exécution directement dans `Automation`
  plutôt que de garder la frontière avec `jobs`.

## Verifications

- `pnpm run db:validate`
- `pnpm run db:generate`
- `pnpm run typecheck`
- `pnpm run lint`

## Criteres de fin

- un modèle Prisma `Automation` existe et valide ;
- une migration SQL dédiée est présente ;
- la doc domaine ne dit plus que le schéma est absent ;
- le placeholder admin reste honnête sur ce qui manque encore.
