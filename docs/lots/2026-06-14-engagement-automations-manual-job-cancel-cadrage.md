# Cadrage — `engagement.automations` annulation manuelle d'un job

## Objectif

Permettre à un opérateur d'annuler depuis `/admin/marketing/automations` un
job d'automation encore `PENDING`, sans passer par une vue transverse de la
file de jobs.

## Périmètre

- ajouter une action admin locale d'annulation manuelle d'un job ;
- limiter cette annulation aux jobs `PENDING` du flux
  `NEWSLETTER_SUBSCRIBED` déjà branché ;
- exposer le contrôle dans la liste existante des jobs d'automation.

## Hors périmètre

- annulation batch ;
- annulation d'un job `RUNNING` ;
- reprise/replanification ;
- worker global ;
- cockpit transverse `jobs`.

## Invariants

- `automations` reste le cockpit métier local ;
- `jobs` reste le support technique sous-jacent ;
- une annulation manuelle doit être visible comme telle et ne pas se faire
  passer pour un échec technique ;
- aucune route admin canonique n'est modifiée.

## Risques

- collision avec une exécution qui démarre juste avant l'annulation ;
- confusion entre job planifié non dû et job à annuler.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- un opérateur peut annuler un job `PENDING` depuis sa ligne ;
- le job passe en `CANCELLED` avec trace explicite ;
- aucun cockpit transverse supplémentaire n'est introduit.
