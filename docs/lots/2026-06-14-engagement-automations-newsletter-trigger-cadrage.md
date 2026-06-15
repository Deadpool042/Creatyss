<!-- docs/lots/2026-06-14-engagement-automations-newsletter-trigger-cadrage.md -->

# Cadrage — `engagement.automations` premier déclencheur `NEWSLETTER_SUBSCRIBED`

## Objectif

Ouvrir un premier déclencheur réel pour `engagement.automations` sans ajouter
de moteur général d'exécution : une souscription newsletter storefront doit
pouvoir planifier des `Job` pour les automations actives correspondantes.

## Périmètre

- consommer le signal source `NEWSLETTER_SUBSCRIBED` depuis la souscription
  storefront ;
- rechercher les `Automation` actives du store pour ce déclencheur ;
- créer un `Job` par automation active avec `scheduledAt` dérivé de
  `delayMinutes` ;
- garder l'opération atomique avec la mutation `NewsletterSubscriber` ;
- documenter la frontière réelle atteinte.

## Hors périmètre

- worker d'exécution ;
- run model (`AutomationRun`, `AutomationExecution`) ;
- envoi email/provider ;
- déclencheurs autres que `NEWSLETTER_SUBSCRIBED` ;
- admin des jobs ;
- retries métier et compensation.

## Invariants

- `newsletter` reste la vérité d'abonnement ;
- `automations` reste la vérité des définitions ;
- `jobs` porte uniquement l'intention planifiée d'exécution ;
- une resoumission idempotente sans changement d'état ne crée pas de job ;
- une création ou réactivation explicite peut planifier de nouveaux jobs.

## Risques

- sans worker, les jobs restent visibles mais non exécutés ;
- `deduplicationKey` reste informative tant qu'aucun consommateur ne l'exploite ;
- les automations d'actions encore non supportées peuvent être planifiées mais
  pas exécutées dans ce lot.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

## Critères de fin

- une souscription storefront crée ou réactive un abonné ;
- les automations actives `NEWSLETTER_SUBSCRIBED` créent des `Job` planifiés ;
- aucune exécution provider n'est ajoutée ;
- la documentation reflète clairement cette frontière.
