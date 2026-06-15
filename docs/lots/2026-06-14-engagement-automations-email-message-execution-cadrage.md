<!-- docs/lots/2026-06-14-engagement-automations-email-message-execution-cadrage.md -->

# Cadrage — `engagement.automations` exécution bornée `EMAIL_MESSAGE`

## Objectif

Fermer la première boucle d'exécution d'automation sans worker général :
permettre l'exécution manuelle d'un job d'automation prêt, pour l'action
`EMAIL_MESSAGE` issue du déclencheur `NEWSLETTER_SUBSCRIBED`.

## Périmètre

- exécuter un job `PENDING` déjà échu depuis `/admin/marketing/automations` ;
- supporter uniquement `actionType = EMAIL_MESSAGE` ;
- supporter uniquement un template borné `newsletter-welcome` (ou défaut nul) ;
- tracer l'envoi dans `EmailMessage` / `EmailRecipient` ;
- appeler le provider transactionnel existant ;
- marquer le job `SUCCEEDED` ou `FAILED`.

## Hors périmètre

- worker automatique ;
- retry générique ;
- templates éditables ;
- campagnes newsletter ;
- autres `actionType` (`NEWSLETTER_CAMPAIGN`, `NOTIFICATION`, `WEBHOOK`) ;
- exécution multi-jobs en masse.

## Invariants

- `jobs` reste le support d'exécution ;
- `email` reste la couche d'envoi provider ;
- `automations` ne devient pas un template system ;
- un job non prêt ou non `PENDING` ne peut pas être exécuté ;
- un abonné non `SUBSCRIBED` ne reçoit rien.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- un opérateur peut lancer un job `EMAIL_MESSAGE` prêt ;
- un email réel est tracé en base ;
- le job passe en `SUCCEEDED` ou `FAILED` avec message lisible ;
- aucun worker générique n'est introduit.
