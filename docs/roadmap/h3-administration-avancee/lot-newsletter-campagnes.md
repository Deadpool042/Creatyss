# Lot — Newsletter : campagnes réelles

## Statut

Livré — 2026-07-02 — code + revue (7 findings corrigés) + recette Mailpit locale validée

## État observé au 2026-07-02

- Création de campagne (schema, action, formulaire, page admin gatée feature flag + niveau `basic`) — observé, antérieur à ce lot d'écriture
- Envoi réel : `send-newsletter-campaign.action.ts` — verrou atomique anti-double-envoi, exclusion des non-`SUBSCRIBED`, lien de désinscription injecté (HTML + texte), idempotence par recipient (`sentAt`), reprise après crash (`SENDING`), statuts `SENT`/`FAILED` — observé
- Route publique `/api/newsletter/unsubscribe` (token base64url, page HTML de confirmation) — observé
- Page détail `/admin/marketing/newsletter/campaigns/[id]` : aperçu exact de l'email (iframe sandboxée, pied de désinscription inclus via lib partagée `build-newsletter-email-content.ts`), compteurs envoyés/échecs, envoi avec confirmation en deux temps — ajouté 2026-07-02
- L'envoi n'est plus déclenchable directement depuis la liste : la liste renvoie vers le détail ("Prévisualiser et envoyer") — ajouté 2026-07-02
- Tests unitaires : 9 tests sur les invariants d'envoi (store scoping, verrou concurrent, ciblage `SUBSCRIBED`, lien désinscription, idempotence, `FAILED` si tous échouent) — `tests/unit/features/admin/marketing/newsletter/send-newsletter-campaign.test.ts`, ajouté 2026-07-02

## Objectif

Permettre à l'admin de créer et d'envoyer des campagnes newsletter réelles à la liste des abonnés. `NewsletterCampaign` et `NewsletterCampaignRecipient` sont posés en Prisma mais non alimentés (observé dans `2026-06-13-audit-catalogue-modules.md`).

## Périmètre

Livré :

- `features/admin/marketing/newsletter/` — extension de la vue admin existante :
  - Création d'une campagne (`NewsletterCampaign`) : titre, sujet, contenu HTML/texte, liste cible
  - Prévisualisation de la campagne avant envoi
  - Envoi en lot : création des `NewsletterCampaignRecipient` et déclenchement de l'envoi via le provider email
  - Suivi de statut par campagne : envoyés, échecs, en attente
- Intégration avec `features/email/providers/` : Brevo en production, Mailpit en développement (décision 2026-06-25)

## Hors périmètre

- A/B testing sur les campagnes
- Analytics email avancés (taux d'ouverture, clics) — nécessitent un pixel de tracking, implications RGPD
- Campagnes automatisées déclenchées par événements (couvertes par `lot-automations-worker-general`)
- Éditeur de contenu WYSIWYG avancé (peut suivre si besoin validé)
- Désabonnement one-click (lien de désinscription dans l'email — obligatoire légalement, à inclure dans le template)

## Dépendances

- Provider email transactionnel configuré avec une réputation suffisante (SPF/DKIM/DMARC sur le domaine d'envoi) — prérequis externe
- `engagement.newsletter` L3 avec `NewsletterSubscriber` actif (observé comme base)
- Décision sur le provider — **tranchée (2026-06-25)** : Brevo en production, Mailpit en développement (`features/email/providers/brevo-email-provider.ts`, `mailpit-email-provider.ts`)

## Invariants

- Chaque email de campagne doit contenir un lien de désinscription fonctionnel (obligation légale RGPD/LPM)
- Un abonné `UNSUBSCRIBED` ne doit jamais recevoir une campagne, même si ajouté manuellement à une liste
- Le statut `NewsletterCampaignRecipient` doit refléter la réalité de l'envoi (pas de succès implicite)

## Risques

- Réputation d'envoi : envoyer en masse depuis un provider non configuré (sans SPF/DKIM/DMARC) expose à la blacklist des domaines d'envoi
- Volume d'envoi : un provider transactionnel (Resend, Postmark) n'est pas toujours adapté aux envois en masse — vérifier les limites de quota
- Conformité RGPD : le consentement des abonnés doit être documenté et tracé avant tout envoi de campagne

## Vérifications

- [x] `pnpm run typecheck` — 2026-07-02
- [x] `pnpm run lint` — 2026-07-02
- [x] Tests unitaires invariants d'envoi (9/9) — 2026-07-02
- [x] Recette Mailpit locale (2026-07-02) : création campagne, aperçu conforme (pied désinscription inclus), envoi confirmé en deux temps, 1 email reçu dans Mailpit pour l'abonné `SUBSCRIBED`, non-réception vérifiée pour l'abonné `UNSUBSCRIBED`, lien de désinscription cliqué → statut `UNSUBSCRIBED` en DB, statuts campagne/recipient corrects (`SENT`, `sentAt`). Note : flag `engagement.newsletter` passé `ACTIVE`+`isEnabledByDefault` en DB locale pour la recette (était `DRAFT` — activation produit toujours non décidée, cf. mémoire lot localization).

## Critères de fin

- L'admin peut créer, prévisualiser et envoyer une campagne newsletter
- Les abonnés `UNSUBSCRIBED` sont exclus automatiquement de l'envoi
- Chaque email contient un lien de désinscription fonctionnel
- Le statut de chaque envoi est tracé dans `NewsletterCampaignRecipient`
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour le choix du provider et la décision transactionnel vs newsletter dédié, puis `next-feature-builder` pour l'implémentation.
