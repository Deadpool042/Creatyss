<!-- docs/lots/2026-06-14-engagement-newsletter-storefront-subscription-cadrage.md -->

# Cadrage — `engagement.newsletter` souscription storefront

## Objectif

Rendre effective la souscription newsletter déjà appelée depuis la homepage
storefront (`fetch("/api/newsletter")`) en restant strictement dans le
périmètre `engagement.newsletter` niveau `basic`.

## Périmètre

- ajouter le route handler public `POST /api/newsletter` ;
- valider l'entrée (`email`) ;
- créer ou réactiver un `NewsletterSubscriber` du store courant ;
- respecter le gating `meetsFeatureLevel("engagement.newsletter","basic")` ;
- garder une sémantique idempotente côté UX.

## Hors périmètre

- double opt-in ;
- désinscription publique ;
- campagnes `NewsletterCampaign` ;
- exécution d'automations ;
- envoi email provider ;
- anti-spam, rate limiting, captcha ;
- rattachement `customerId`.

## Invariants

- `newsletter` reste la vérité d'abonnement ;
- aucune campagne n'est créée ;
- une souscription répétée ne crée pas de doublon ;
- une nouvelle intention explicite côté storefront peut réactiver un contact
  non actif existant ;
- les liens de réglages restent canoniques via `/admin/settings/advanced`.

## Risques

- la politique de réactivation n'est pas encore explicitement tranchée dans la
  doctrine ; ce lot retient une réactivation explicite et idempotente ;
- sans anti-spam, la route reste volontairement minimale ;
- si la feature reste inactive, la homepage reçoit une erreur applicative
  contrôlée.

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- vérification manuelle ciblée :
  - feature inactive → `POST /api/newsletter` retourne 404 `feature_inactive`
  - feature active niveau `basic` → création puis resoumission idempotente

## Critères de fin

- `/api/newsletter` existe et ne retourne plus 404 technique ;
- la homepage peut créer un `NewsletterSubscriber` réel quand la feature est active ;
- aucun runtime `automations` n'est introduit ;
- la doc `newsletter` et l'état de session reflètent l'état réel.
