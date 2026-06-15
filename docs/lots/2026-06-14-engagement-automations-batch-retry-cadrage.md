# Cadrage — `engagement.automations` relance batch des jobs échoués visibles

## Objectif

Permettre à un opérateur de relancer en une action les jobs `FAILED` déjà
visibles dans `/admin/marketing/automations`, sans introduire de retry
générique ni de worker global.

## Périmètre

- ajouter une action batch locale de relance des jobs échoués visibles ;
- limiter la relance aux jobs déjà affichés dans le cockpit `automations` ;
- réutiliser strictement la relance unitaire existante.

## Hors périmètre

- retry automatique ;
- politique globale de retries ;
- relance de toute la file ;
- relance des jobs `CANCELLED` ;
- worker global.

## Invariants

- le cockpit `automations` reste une vue métier locale ;
- seuls les jobs visibles et échoués sont concernés ;
- la relance batch ne contourne pas les validations de la relance unitaire ;
- aucune route admin canonique n'est modifiée.

## Risques

- relancer en lot des échecs structurels reproduit plusieurs erreurs ;
- confusion entre lot local d'appoint et orchestration de file globale.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- un opérateur peut relancer en lot les jobs `FAILED` visibles ;
- le batch retourne un bilan simple succès / échecs ;
- aucune politique de retry automatique ni surface transverse supplémentaire
  n'est ajoutée.
