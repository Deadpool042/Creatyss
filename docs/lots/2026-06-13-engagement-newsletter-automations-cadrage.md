<!-- docs/lots/2026-06-13-engagement-newsletter-automations-cadrage.md -->

# Cadrage — `engagement.newsletter` et `engagement.automations` (suite point 5)

> Suite de `docs/roadmap/2026-06-13-audit-catalogue-modules.md`, section 6,
> point 5 : « Modules L1 → L3 : `commerce.discounts` (fait),
> `engagement.newsletter`, `engagement.automations` (vérifier/poser le schéma
> Prisma manquant en premier). »

## État actuel (audit)

### `engagement.newsletter`

- **Feature catalog** (`features/admin/pilotage/catalog/feature-catalog.ts`) :
  `key: "engagement.newsletter"`, `family: "optional"`, `module:
  "engagement"`, `defaultState: "inactive"`, `mutability:
  "level_selectable"`, `levels: FEATURE_LEVELS.newsletter = ["basic",
  "segmentation", "automation"]`.
- **Aucun `FeatureFlag` seedé** pour `engagement.newsletter` →
  `queryFeatureFlagActive("engagement.newsletter")` retourne `false`. Même
  situation que `commerce.discounts`/`engagement.analytics` avant leur seed.
- **Modèle Prisma déjà entièrement posé**
  (`prisma/optional/engagement/newsletter.prisma`, `Level: L2`, `DependsOn:
  foundation.store, commerce.customers, platform.email`) :
  - `NewsletterSubscriber` : `email`, `firstName?`, `lastName?`,
    `customerId?`, `status` (PENDING/SUBSCRIBED/UNSUBSCRIBED/BOUNCED/
    ARCHIVED), `source?`, `subscribedAt?`/`unsubscribedAt?`/`bouncedAt?`/
    `archivedAt?`, `@@unique([storeId, email])`.
  - `NewsletterCampaign` : `code`, `name`, `subjectLine`, `previewText?`,
    `bodyText?`/`bodyHtml?`, `status` (DRAFT/SCHEDULED/SENDING/SENT/FAILED/
    CANCELLED/ARCHIVED), `scheduledAt?`/`sentAt?`/etc., `provider?`/
    `providerReference?`, `createdByUserId?`, `@@unique([storeId, code])`.
  - `NewsletterCampaignRecipient` : jointure campagne ↔ abonné, `sentAt?`/
    `openedAt?`/`clickedAt?`/`failedAt?`.
- **Code applicatif** : aucune query/action/composant. Page admin
  `app/admin/(protected)/marketing/newsletter/page.tsx` = `AdminComingSoon`,
  gating `isNewsletterFeatureActive()` → `notFound()` (flag non seedé).
- **Infrastructure email existante** : `features/email/providers/`
  (`resolveEmailProvider()` → Brevo en prod, Mailpit en dev),
  `TransactionalEmailProvider.sendTransactionalEmail(payload)` — déjà utilisé
  pour les emails transactionnels de commande
  (`features/email/order/send-order-transactional-email.ts`). Une
  réutilisation pour l'envoi de campagnes est possible mais **boucle un envoi
  par destinataire via un provider transactionnel** — pas de mécanisme de
  campagne de masse, pas de gestion de bounce/tracking dans ce provider.
- **Nav/capability** : `adminNavigationCapabilities.marketing.newsletterRead =
  "admin.marketing.newsletter.read"`, déjà combinée avec le feature flag dans
  `admin-navigation.data.ts` (pattern identique à `discounts`). Pas d'écart.
- **Doctrine** (`docs/domains/cross-cutting/newsletter.md`, `cross-cutting` /
  `transverse optionnelle`, activable) : le domaine porte **l'abonnement**
  (statuts demandé/confirmé/actif/retiré/réactivé/archivé), explicitement
  **pas** l'exécution de campagnes (« Non-responsabilités » : « exécuter les
  campagnes emailing »). La gestion de campagne relève donc d'un autre
  périmètre (`marketing`/`crm`, non documentés séparément ici).

### `engagement.automations`

- **Feature catalog** : `key: "engagement.automations"`, `family:
  "optional"`, `module: "engagement"`, `defaultState: "inactive"`,
  `mutability: "toggleable"` — **pas de niveaux déclarés** (pas d'entrée dans
  `FEATURE_LEVELS`), contrairement à `newsletter`/`discounts`/`analytics`.
- **Aucun modèle Prisma** : `grep -rn "Automation" prisma/` → aucune
  occurrence. Le schéma est entièrement à créer.
- **Aucun code applicatif** : page admin = `AdminComingSoon` avec
  `requirements: ["Feature flag : engagement.automations", "Schéma Prisma
  Automation à définir"]` et un `fallbackAction` vers `/admin/marketing/
  discounts`.
- **Aucune doc `docs/domains/**`** pour `automations` (aucun fichier trouvé) —
  écart doctrine : le module est catalogué mais non documenté.
- **Portée fonctionnelle annoncée** : « flux automatisés déclenchés par les
  événements boutique : panier abandonné, relance post-achat, bienvenue
  abonné ». Cela suppose au minimum : un modèle `Automation`
  (déclencheur/condition/action), une dépendance à `jobs` (déclenchement
  différé/panier abandonné) et probablement à `platform.email` /
  `engagement.newsletter` (action = envoi email). C'est structurellement plus
  proche d'un nouveau domaine `optional` à part entière qu'un sous-lot de
  finition.

## Décisions à trancher

### A — Quel module traiter dans ce lot

1. **`engagement.newsletter` uniquement** (Recommandé) : modèle déjà posé,
   pattern identique à `commerce.discounts` (admin CRUD niveau `basic`, seed
   `FeatureFlag` inactif par défaut). `engagement.automations` reste signalé
   comme nécessitant un cadrage `prisma-architect` séparé (schéma à créer,
   dépendances `jobs`/`newsletter`/`email` à clarifier) — pas traité ici.
2. **Les deux** : ajouter en plus un cadrage `prisma-architect` pour poser le
   schéma `Automation` dans ce même chantier (périmètre nettement plus large,
   doctrine — « aucune ouverture de module n'est une construction libre »).
3. **`engagement.automations` en premier** (poser le schéma seul, sans UI) :
   décorrélé de `newsletter`.

### B — Si `engagement.newsletter` : périmètre du niveau `basic`

1. **Admin CRUD abonnés uniquement, sans campagnes** (Recommandé) : lister les
   `NewsletterSubscriber` du store, en ajouter manuellement (email, nom),
   changer leur statut (SUBSCRIBED/UNSUBSCRIBED/ARCHIVED). **Aucun envoi
   d'email, aucune `NewsletterCampaign` créée** dans ce lot — conforme à la
   doctrine (« newsletter » ≠ exécution de campagnes) et au principe de plus
   petit changement sûr. `NewsletterCampaign`/`NewsletterCampaignRecipient`
   restent non alimentés (niveaux `segmentation`/`automation`).
2. **Admin CRUD abonnés + création/envoi de campagnes simples** (réutilise
   `resolveEmailProvider()` en boucle par destinataire) : touche
   `platform.email`, périmètre nettement plus large, risques (volumétrie,
   absence de gestion de bounce/désabonnement dans le provider) — à cadrer
   séparément si retenu.

### C — Gating et activation (si B1)

1. **Seeder `engagement.newsletter`** (`allowedLevels: ["basic",
   "segmentation", "automation"]`, `defaultLevel: "basic"`, `status:
   "DRAFT"`, `isEnabledByDefault: false`, même schéma que
   `commerce.discounts`/`engagement.analytics`) ; gater la nouvelle UI admin
   sur `meetsFeatureLevel("engagement.newsletter","basic")`. (Recommandé)
2. Pas de gating par niveau, uniquement `queryFeatureFlagActive`.

## Décision tranchée (2026-06-13)

- **A → A1** : `engagement.newsletter` uniquement.
  `engagement.automations` reste hors périmètre (cf. section dédiée
  ci-dessous).
- **B → B1** : admin CRUD `NewsletterSubscriber` seul (lister, ajouter,
  changer le statut). Aucune `NewsletterCampaign` créée, aucun email envoyé.
- **C → C1** : seed `engagement.newsletter` (`allowedLevels: ["basic",
  "segmentation", "automation"]`, `defaultLevel: "basic"`, `status: "DRAFT"`,
  `isEnabledByDefault: false`), gating
  `meetsFeatureLevel("engagement.newsletter","basic")`.

→ Les 4 sous-lots de la section suivante sont retenus, à exécuter dans
l'ordre, chacun vérifié `tsc --noEmit`.

## Sous-lots proposés (si A1 + B1 + C1)

1. **Sous-lot 0** — Seed `engagement.newsletter` (`allowedLevels`/
   `defaultLevel`/`isEnabledByDefault: false`, seed dédié
   `prisma/seed/newsletter-feature-flag.seed.ts`, câblé dans
   `prisma/seed.ts`). Vérif `tsc --noEmit` + vérif manuelle : module inactif
   par défaut.
2. **Sous-lot 1** — Queries/actions admin `engagement.newsletter` : lister les
   `NewsletterSubscriber` du store, en créer un (email unique par store,
   statut initial), changer le statut (SUBSCRIBED/UNSUBSCRIBED/ARCHIVED).
   Vérif `tsc --noEmit`.
3. **Sous-lot 2** — Câblage `app/admin/(protected)/marketing/newsletter/page.tsx` :
   remplace `AdminComingSoon` par liste + formulaire d'ajout, gated
   `meetsFeatureLevel("engagement.newsletter","basic")`, avec mention
   explicite qu'aucune campagne n'est envoyée à ce niveau. Vérif
   `tsc --noEmit`.
4. **Sous-lot 3** — Vérifications + mise à jour `docs/domains/cross-cutting/
   newsletter.md` (section décisions d'implémentation),
   `docs/roadmap/2026-06-13-audit-catalogue-modules.md` (entrée
   `engagement.newsletter`), bilan d'exécution dans ce cadrage.

## `engagement.automations` — hors périmètre de ce lot (si A1)

Reste à l'état L0, catalogué (`mutability: "toggleable"`, pas de niveaux),
sans schéma Prisma ni doc `docs/domains/**`. Avant tout sous-lot :

- créer la doc `docs/domains/**/automations.md` (catégorisation, rôle,
  limites — actuellement absente, écart doctrine) ;
- cadrer le schéma `Automation` (`prisma-architect`) : déclencheurs (panier
  abandonné, post-achat, bienvenue abonné), conditions, actions (probablement
  email via `platform.email`/`engagement.newsletter`), dépendance `jobs` pour
  les déclenchements différés ;
- décider si des niveaux (`FEATURE_LEVELS.automations`) doivent être déclarés,
  par analogie avec les autres modules `optional`.

Ce travail est d'une ampleur comparable à un nouveau domaine `optional` et
justifie un cadrage `architect-review`/`prisma-architect` dédié, distinct de
ce lot.

## Bilan d'exécution (2026-06-13)

Les 4 sous-lots `engagement.newsletter` (A1+B1+C1) ont été exécutés dans
l'ordre, chacun vérifié `tsc --noEmit -p tsconfig.json` (0 erreur).

- **Sous-lot 0** — `prisma/seed/newsletter-feature-flag.seed.ts` (nouveau) :
  upsert `FeatureFlag` `engagement.newsletter` (`allowedLevels:
  ["basic","segmentation","automation"]`, `defaultLevel: "basic"`, `status:
  "DRAFT"`, `scopeType: "STORE"`, `isEnabledByDefault: false`). Câblé dans
  `prisma/seed.ts` (import + appel après `seedDiscountsFeatureFlag`). Module
  inactif par défaut, togglable depuis `/admin/settings/advanced`.
- **Sous-lot 1** — `features/admin/marketing/newsletter/` :
  - `types/admin-newsletter-subscriber.types.ts`
    (`AdminNewsletterSubscriberSummary`) ;
  - `queries/list-admin-newsletter-subscribers.query.ts`
    (`listAdminNewsletterSubscribers`, lecture `NewsletterSubscriber` non
    archivés du store courant) ;
  - `schemas/create-newsletter-subscriber.schema.ts`
    (`createNewsletterSubscriberSchema`, Zod — email + prénom/nom optionnels) ;
  - `shared/admin-newsletter-routes.ts` (`ADMIN_NEWSLETTER_PATH`) ;
  - `actions/create-newsletter-subscriber.action.ts`
    (`createNewsletterSubscriberAction`, "use server",
    `requireAuthenticatedAdmin`, statut initial `SUBSCRIBED`, `source:
    "admin"`, gestion P2002 email dupliqué) ;
  - `actions/toggle-newsletter-subscriber-status.action.ts`
    (`toggleNewsletterSubscriberStatusAction`, bascule
    SUBSCRIBED/UNSUBSCRIBED).
- **Sous-lot 2** — `features/admin/marketing/newsletter/components/` :
  - `admin-newsletter-subscribers-list.tsx` (liste + bascule optimiste) ;
  - `admin-newsletter-subscriber-create-form.tsx` (formulaire d'ajout :
    email, prénom, nom).
  - `app/admin/(protected)/marketing/newsletter/page.tsx` (réécriture
    complète) : `notFound()` si flag inactif ; `AdminComingSoon` (avec
    prérequis affichés) si niveau `basic` non atteint ; sinon formulaire +
    liste, avec mention explicite « aucune campagne créée/envoyée ».
- **Sous-lot 3** (ce lot) — documentation :
  - `docs/domains/cross-cutting/newsletter.md` : section « Décisions
    d'implémentation » ajoutée (après « Documents liés »), décrivant le
    seed, l'UI admin, le périmètre `basic` et la limite « aucune campagne ».
  - `docs/roadmap/2026-06-13-audit-catalogue-modules.md` : entrée
    `engagement.newsletter` (section 3, optional) passée de « L1,
    `AdminComingSoon` » à « L3 (inactif par défaut, niveau `basic`) » ;
    synthèse (section 4) mise à jour (L3 fonctionnel 17→18, L1 placeholder
    2→1) ; point 5 de la roadmap (section 6) marqué fait pour
    `engagement.newsletter`, `engagement.automations` signalé comme
    nécessitant un cadrage dédié.
  - Ce cadrage : présent bilan d'exécution.

### Ce qui n'a pas changé / hors périmètre confirmé

- `NewsletterCampaign`/`NewsletterCampaignRecipient` : non alimentés, aucun
  envoi d'email, `platform.email` non touché.
- Niveaux `segmentation` (segmentation des abonnés) et `automation`
  (synchronisation/automatisations) : non implémentés.
- `engagement.automations` : reste L0 (aucun schéma Prisma, aucune doc
  `docs/domains/**`). Nécessite un cadrage `architect-review`/
  `prisma-architect` séparé avant tout sous-lot.
- `marketing.newsletterRead` (capability nav) : aucune modification, déjà
  cohérent avec le flag `engagement.newsletter`.

### Vérifications effectuées

- `tsc --noEmit -p tsconfig.json` → 0 erreur, après chacun des sous-lots 0, 1,
  2.
- Pas de test automatisé ajouté ni exécuté pour ce lot (admin CRUD simple,
  pattern identique à `commerce.discounts`/`engagement.analytics`).
- Pas de vérification manuelle de l'UI (navigateur) — non exécutée dans cette
  session.
