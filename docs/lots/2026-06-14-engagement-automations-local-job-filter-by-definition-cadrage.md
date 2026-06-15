# Cadrage — `engagement.automations` filtre local des jobs par définition

## Objectif

Permettre à un opérateur de passer rapidement d'une définition `Automation` à
la vue locale de ses jobs liés, sans quitter `/admin/marketing/automations`.

## Périmètre

- ajouter un focus local depuis une définition vers ses jobs liés ;
- filtrer la liste jobs sur une automation précise dans la même page ;
- permettre de revenir à la vue globale de tous les jobs locaux.

## Hors périmètre

- nouvelle page détail d'automation ;
- filtres multicritères complexes ;
- cockpit transverse de file ;
- modification des routes canoniques de réglages.

## Invariants

- le focus reste local à `/admin/marketing/automations` ;
- le filtrage ne change pas la frontière métier du module ;
- les jobs restent lus depuis la même source locale ;
- aucune route canonique hors module n'est modifiée.

## Risques

- confusion entre vue filtrée locale et vue exhaustive transverse ;
- dépendance à la clé locale liant un job à son automation.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- une définition expose un accès direct à ses jobs liés ;
- la section jobs affiche clairement quand un filtre automation est actif ;
- l'opérateur peut revenir à la vue globale sans quitter la page.
