<!-- docs/lots/2026-06-14-engagement-automations-cadrage.md -->

# Cadrage — `engagement.automations` (placeholder pilotable)

> Suite de `docs/roadmap/2026-06-13-audit-catalogue-modules.md` et de
> `docs/lots/2026-06-13-engagement-newsletter-automations-cadrage.md`.
> Lot borne conforme `AGENTS.md` : objectif / perimetre / hors perimetre /
> invariants / risques / verifications / criteres de fin.

## Objectif

Fermer l'ecart minimal de gouvernance autour de `engagement.automations` sans
inventer de schema metier premature :

- seed du `FeatureFlag` pour rendre le module pilotable depuis
  `/admin/settings/advanced` ;
- creation de la fiche domaine canonique manquante ;
- maintien de `/admin/marketing/automations` en placeholder explicite, relie a
  sa doc.

## Etat reel (audit)

- **Feature catalog** : `engagement.automations` existe deja dans
  `features/admin/pilotage/catalog/feature-catalog.ts` (`family: "optional"`,
  `module: "engagement"`, `mutability: "toggleable"`).
- **UI admin** : `/admin/marketing/automations` existe deja, mais reste un
  `AdminComingSoon`.
- **Gating** : `isAutomationsFeatureActive()` existe deja, mais aucun seed
  dedie du flag n'etait present.
- **Documentation domaine** : aucune fiche `docs/domains/**/automations.md`
  n'etait presente.
- **Schema Prisma** : aucun modele `Automation` n'est pose.

## Frontieres a preserver

- ce lot **n'introduit pas** de schema Prisma ;
- ce lot **n'introduit pas** d'execution d'automations ;
- ce lot **ne tranche pas** encore le design exact entre `marketing`,
  `workflow`, `jobs`, `newsletter` et `notifications` ;
- ce lot **ne remplace pas** la future implementation metier par une UI factice.

## Perimetre retenu (L1)

1. Seed `FeatureFlag engagement.automations` (`DRAFT`, inactif par defaut,
   sans niveaux).
2. Creation de la fiche domaine canonique `docs/domains/cross-cutting/automations.md`.
3. Rattachement du placeholder admin a cette fiche via `docRef`.
4. Mise a jour de la roadmap et de l'etat des lieux.

## Hors perimetre

- schema Prisma `Automation` / `AutomationExecution` ;
- triggers metier reels (panier abandonne, post-achat, bienvenue) ;
- jobs, delais, retries, idempotence runtime ;
- providers email / CRM / notifications ;
- CRUD admin reel d'automations ;
- choix d'event model ou de workflows d'execution.

## Decisions retenues

- **D1 — Nature du lot** : `engagement.automations` passe en **L1 pilotable**
  seulement, pas en implementation metier.
- **D2 — Categorie documentaire** : fiche domaine en
  `docs/domains/cross-cutting/automations.md`, car la responsabilite traverse
  marketing, newsletter, jobs, workflow et objets source.
- **D3 — Route canonique** : on conserve `/admin/marketing/automations` comme
  point d'entree admin canonique ; aucun doublon dans `settings/advanced`.

## Invariants a preserver

- le module reste inactif par defaut ;
- aucun schema Prisma n'est invente sans cadrage dedie ;
- aucun provider externe ne devient source de verite locale ;
- aucune execution automatique reelle n'est suggeree comme disponible.

## Risques

- confusion possible entre "module pilotable" et "module implemente" ;
- tentation future de faire grossir le placeholder sans trancher le schema ;
- ambiguite persistante entre orchestration marketing et workflow generique.

## Verifications

- `pnpm run typecheck`
- `pnpm run lint`

## Criteres de fin

- `engagement.automations` peut etre active depuis `settings/advanced` ;
- `/admin/marketing/automations` reste borne comme placeholder documente ;
- une fiche domaine canonique explicite existe ;
- la roadmap et l'etat des lieux ne disent plus que la doc domaine est absente.
