# Cadrage — `engagement.automations` désactivation et annulation des jobs en attente

## Objectif

Faire de la désactivation d'une automation une vraie suspension opératoire :
les jobs `PENDING` déjà planifiés pour cette définition ne doivent plus rester
exécutables.

## Périmètre

- étendre la bascule admin `ACTIVE -> INACTIVE` ;
- annuler les jobs `PENDING` déjà planifiés pour l'automation désactivée ;
- garder ce comportement local au déclencheur
  `NEWSLETTER_SUBSCRIBED` déjà câblé.

## Hors périmètre

- annulation des jobs `RUNNING` ;
- retry automatique ;
- reprise automatique à la réactivation ;
- worker global ;
- second déclencheur ou seconde action d'automation.

## Invariants

- `automations` reste la vérité de la définition ;
- `jobs` reste le support technique d'exécution ;
- une automation suspendue ne doit plus produire d'exécution future via des
  jobs déjà en attente ;
- aucune route admin canonique n'est modifiée.

## Risques

- identification incorrecte des jobs liés à une automation ;
- confusion entre annulation opératoire et échec technique.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- désactiver une automation fait passer ses jobs `PENDING` liés en `CANCELLED` ;
- ces jobs n'apparaissent plus comme exécutables dans le cockpit local ;
- la sémantique reste bornée au flux newsletter déjà ouvert.
