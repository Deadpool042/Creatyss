# Cadrage — `engagement.automations` annulation batch des jobs en attente visibles

## Objectif

Permettre à un opérateur d'annuler en une action les jobs `PENDING` déjà
visibles dans `/admin/marketing/automations`, sans introduire de cockpit
transverse de la file.

## Périmètre

- ajouter une action batch locale d'annulation des jobs en attente visibles ;
- limiter l'annulation aux jobs déjà affichés dans le cockpit `automations` ;
- réutiliser strictement l'annulation unitaire existante.

## Hors périmètre

- annulation de toute la file ;
- annulation batch des jobs `RUNNING` ;
- reprise automatique ;
- worker global ;
- cockpit transverse `jobs`.

## Invariants

- le cockpit `automations` reste une vue métier locale ;
- seuls les jobs visibles et `PENDING` sont concernés ;
- l'annulation batch ne contourne pas les validations de l'annulation unitaire ;
- aucune route admin canonique n'est modifiée.

## Risques

- annuler en lot des jobs encore seulement planifiés alors qu'un opérateur
  voulait en conserver certains ;
- confusion entre lot d'appoint local et gouvernance complète de file.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- un opérateur peut annuler en lot les jobs `PENDING` visibles ;
- le batch retourne un bilan simple succès / échecs ;
- aucune surface transverse supplémentaire n'est ajoutée.
