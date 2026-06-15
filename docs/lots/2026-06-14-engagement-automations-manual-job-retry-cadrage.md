# Cadrage — `engagement.automations` relance manuelle d'un job échoué

## Objectif

Permettre à un opérateur de relancer depuis `/admin/marketing/automations` un
job `FAILED`, sans introduire de retry générique ni de worker global.

## Périmètre

- ajouter une action admin locale de relance d'un job échoué ;
- limiter cette relance au flux `NEWSLETTER_SUBSCRIBED` déjà branché ;
- réutiliser l'exécuteur borné existant après réarmement du job.

## Hors périmètre

- retry automatique ;
- politique globale de retries ;
- relance batch des jobs échoués ;
- relance des jobs `CANCELLED` ;
- worker global.

## Invariants

- la relance reste une décision opératoire locale ;
- `jobs` reste le support technique d'exécution ;
- l'historique d'essais (`attemptCount`) reste porté par le job existant ;
- aucune route admin canonique n'est modifiée.

## Risques

- relancer un échec structurel (automation inactive, template invalide,
  subscriber non actif) reproduit l'échec ;
- confusion entre relance manuelle locale et mécanisme générique de retry.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- un job `FAILED` expose un bouton `Réessayer` dans le cockpit local ;
- la relance réarme le job puis réutilise l'exécution bornée existante ;
- aucun retry automatique ni surface transverse supplémentaire n'est ajouté.
