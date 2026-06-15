# Cadrage — `engagement.automations` lien automation depuis une ligne job

## Objectif

Permettre à un opérateur de focaliser la page sur l'automation d'un job depuis
la ligne elle-même, sans quitter le cockpit local.

## Périmètre

- rendre le code automation d'une ligne job cliquable ;
- ouvrir la même page avec le filtre `automation` correspondant ;
- conserver les contextes locaux déjà actifs (`status`, `definition`).

## Hors périmètre

- nouvelle page détail job ;
- nouveau panneau latéral ;
- nouvelles actions runtime ;
- recherche libre.

## Invariants

- la navigation reste locale à `/admin/marketing/automations` ;
- le clic réutilise le filtre automation déjà existant ;
- aucun cockpit transverse `jobs` n'est ajouté ;
- aucune logique métier d'exécution n'est modifiée.

## Risques

- redondance partielle avec le bouton `Voir les jobs` déjà présent côté
  définitions ;
- ambiguïté possible si une ligne job orpheline ne référence plus d'automation.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- une ligne job permet de focaliser la page sur son automation ;
- les autres contextes locaux utiles sont conservés ;
- aucun nouvel écran n'est introduit.
