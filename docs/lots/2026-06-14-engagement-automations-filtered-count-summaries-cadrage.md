<!-- docs/lots/2026-06-14-engagement-automations-filtered-count-summaries-cadrage.md -->

# Cadrage — `engagement.automations` affichage des comptages filtrés

## Objectif

Rendre la page `/admin/marketing/automations` plus explicite pour l'opérateur en
affichant combien de définitions et de jobs sont réellement visibles après
application des filtres locaux déjà présents.

## Périmètre

- section « Définitions d'automation » ;
- section « Jobs planifiés » ;
- texte de synthèse local seulement ;
- prise en compte du fait que la vue jobs est bornée aux entrées récentes
  retournées par la query paginée locale.

## Hors périmètre

- nouveau filtre ;
- nouvelle action opératoire ;
- pagination complète ;
- changement de requête Prisma ;
- changement de route, hash ou paramètre canonique.

## Invariants

- conserver les routes canoniques existantes de l'admin ;
- ne pas modifier le comportement des filtres ;
- ne pas changer la limite de lecture locale des jobs ;
- rester strictement borné au cockpit `engagement.automations`.

## Risques

- confusion si le texte laisse croire que tous les jobs sont chargés alors que
  la vue est bornée aux plus récents ;
- duplication visuelle inutile si le résumé répète les cartes de stats sans
  apporter de précision.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- vérification manuelle de `/admin/marketing/automations` avec et sans filtres
  `definition`, `automation`, `status`

## Critères de fin

- la section définitions indique clairement combien d'entrées restent visibles ;
- la section jobs indique clairement combien d'entrées sont affichées et, si
  nécessaire, qu'il s'agit d'un sous-ensemble récent d'un total filtré plus large ;
- aucun contrat, paramètre d'URL ou comportement métier n'est modifié.
