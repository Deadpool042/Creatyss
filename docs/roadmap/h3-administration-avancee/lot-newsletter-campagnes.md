# Lot — Newsletter : campagnes réelles

## Statut

Implémenté (code) — 2026-07-02 — recette manuelle Mailpit restante

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

Proposition — non observé comme implémenté à ce jour :

- `features/admin/marketing/newsletter/` — extension de la vue admin existante :
  - Création d'une campagne (`NewsletterCampaign`) : titre, sujet, contenu HTML/texte, liste cible
  - Prévisualisation de la campagne avant envoi
  - Envoi en lot : création des `NewsletterCampaignRecipient` et déclenchement de l'envoi via le provider email
  - Suivi de statut par campagne : envoyés, échecs, en attente
- Intégration avec le provider email transactionnel déjà en place (Resend, Postmark ou SMTP)

## Hors périmètre

- A/B testing sur les campagnes
- Analytics email avancés (taux d'ouverture, clics) — nécessitent un pixel de tracking, implications RGPD
- Campagnes automatisées déclenchées par événements (couvertes par `lot-automations-worker-general`)
- Éditeur de contenu WYSIWYG avancé (peut suivre si besoin validé)
- Désabonnement one-click (lien de désinscription dans l'email — obligatoire légalement, à inclure dans le template)

## Dépendances

- Provider email transactionnel configuré avec une réputation suffisante (SPF/DKIM/DMARC sur le domaine d'envoi) — prérequis externe
- `engagement.newsletter` L3 avec `NewsletterSubscriber` actif (observé comme base)
- Décision sur le provider : utiliser le provider transactionnel existant ou un service dédié newsletter (Mailchimp, Brevo, etc.) — à trancher en `architect-review`

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
- [ ] Test manuel (Mailpit en dev) : création campagne, prévisualisation, envoi, réception, vérification de la non-réception pour un abonné `UNSUBSCRIBED`, lien de désinscription fonctionnel — **restant, validation humaine**

## Critères de fin

- L'admin peut créer, prévisualiser et envoyer une campagne newsletter
- Les abonnés `UNSUBSCRIBED` sont exclus automatiquement de l'envoi
- Chaque email contient un lien de désinscription fonctionnel
- Le statut de chaque envoi est tracé dans `NewsletterCampaignRecipient`
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour le choix du provider et la décision transactionnel vs newsletter dédié, puis `next-feature-builder` pour l'implémentation.
