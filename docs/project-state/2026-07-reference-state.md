# État de référence Creatyss — juillet 2026

> **Avertissement**
> Ce document est une photographie datée (juillet 2026), construite à partir des roadmaps, de la doctrine et des audits disponibles à cette date.
> Il ne remplace ni les documentations de domaine (`docs/domains/**`), ni les roadmaps (`docs/roadmap/**`).
> Toute affirmation de ce document doit être relue avec Prisma et le code existant, seules sources de vérité de l'implémentation. En cas de divergence entre ce document et le code observé, le code prévaut.

---

## 1. Résumé exécutif

Creatyss est un socle e-commerce custom pour une boutique artisanale unique, conçu local-first, strictement typé et destiné à un déploiement sur VPS OVH (`AGENTS.md`). Ce n'est pas un SaaS multi-tenant ni une marketplace.

Les 32 modules du `FEATURE_CATALOG` sont classés L3 (fonctionnels) selon la grille narrative de l'audit du 2026-06-13 (`docs/roadmap/2026-06-13-audit-catalogue-modules.md`). Cette classification est une convention documentaire externe, distincte des niveaux métier déclarés techniquement dans le catalogue (`FEATURE_CATALOG` n'expose aucun champ `level`/`L3` — voir section 6). L'audit transverse le plus récent ne relève aucune régression structurelle sur ce chiffre — seulement des écarts documentaires ponctuels (chemins obsolètes, statuts de flags périmés dans certains documents historiques).

Le dépôt documente un staging (`https://staging.creatyss.lpwebstudio.fr`) opérationnel avec HTTPS, sauvegardes automatisées et une recette prod-like validée (`docs/roadmap/h1-boutique-vendable/README.md`) sur un socle Next.js App Router, TypeScript strict, Prisma modulaire et Docker de production.

Les principaux blocages restants avant ouverture commerciale ne sont pas techniques : compte marchand Stripe réel (mode live), bascule du domaine `creatyss.com`, et validation des taux de TVA par un expert-comptable (`docs/roadmap/h1-boutique-vendable/README.md`, `docs/roadmap/h2-commerce-fiable/README.md`).

De nombreux chantiers transverses (refonte UI admin, gouvernance des réglages, hygiène storefront, cockpit analytique, doctrine domaines admin) ont été clos entre le 2026-07-02 et le 2026-07-07, avec un niveau de conformité code élevé mais quelques écarts documentaires résiduels consignés section 8.

---

## 2. Doctrine et architecture

Principes actuellement applicables (source détaillée : `AGENTS.md`, `docs/architecture/`) :

- Next.js App Router, TypeScript strict, Server Components par défaut, Client Components seulement si nécessaire.
- Séparation stricte UI / métier / accès aux données — pas de logique métier dans les composants UI.
- Prisma modulaire, organisé selon la taxonomie canonique `core / optional / cross-cutting / satellites`, répliquée à l'identique dans `docs/domains/{core,optional,cross-cutting,satellites}` et `prisma/{core,optional,cross-cutting,satellites}`.
- Déploiement cible : VPS OVH (staging opérationnel, production non basculée à ce jour).
- Absence de dépendance à Shopify, WordPress, WooCommerce, Supabase ou Vercel (contrainte explicite `AGENTS.md`).

Structure Prisma modulaire observée (`prisma/**`) :

| Taxonomie       | Sous-domaines observés                               |
| --------------- | ---------------------------------------------------- |
| `core`          | `commerce`, `catalog`, `foundation`, `content`       |
| `optional`      | `commerce/inventory`, `platform`, `engagement`, `ai` |
| `cross-cutting` | feature flags, événements de domaine, etc.           |
| `satellites`    | modules satellites (recherche, canaux)               |

Pour le détail complet des principes (10 principes d'architecture, modèle de classification, frontières et responsabilités), voir :

- `docs/architecture/00-introduction/00-vue-d-ensemble-du-systeme.md`
- `docs/architecture/10-fondations/10-principes-d-architecture.md`
- `docs/architecture/10-fondations/11-modele-de-classification.md`
- `docs/architecture/20-structure/20-cartographie-du-systeme.md`
- `docs/domains/README.md`

---

## 3. Capacités livrées

Capacités réellement livrées ou substantielles, par domaine. Documenté = documenté comme livré ; Observé = confirmé par du code lu dans le cadre des audits cités.

« Livré » signifie ici que le code et l'interface correspondant au périmètre annoncé existent et sont activables. Cela ne signifie pas que la feature est active par défaut pour chaque store : l'état effectif d'un store dépend du seed, du statut du flag et d'un éventuel override configuré dans `settings/advanced` (détail section 6). L'état réel d'un store déployé n'est pas observable depuis le dépôt seul.

### Catalogue et contenu

- Catalogue produits complet (prix, disponibilité, inventaire, médias, variantes, SEO, catégories, produits liés) — 7 sous-modules `catalog.products.*` classés L3 selon la grille narrative de l'audit du 2026-06-13 (`docs/roadmap/2026-06-13-audit-catalogue-modules.md`), et non un niveau technique du fichier `feature-catalog.ts`.
- Blog et homepage éditables, pages de contenu (contact, à-propos, les marchés) — `content.blog`, `content.homepage`.
- Généralisation `LocalizedValue` (multilangue partiel) sur homepage, copies produit/boutique, pages de contenu, blog — `docs/roadmap/h4-plateforme-automatisation/README.md`.
- Hygiène de composition storefront livrée (empty states unifiés, formulaires standardisés, valeurs Tailwind arbitraires éliminées) — chantier `hygiene-composition-storefront`, 5 lots, confirmé sans écart par l'audit transverse.

### Storefront

- Recherche full-text storefront (PostgreSQL FTS français) livrée le 2026-07-05 — `satellite.search`, `docs/roadmap/h4-plateforme-automatisation/README.md`.
- Panier invité, checkout, suivi de commande (formulaire `order-tracking-form.tsx` intégré à l'espace compte) — audit `ux-admin-storefront`.
- Routing localisé, hreflang, sitemap, sélecteur de langue — `platform.localization` L3.

### Commerce

- Paiement virement bancaire (checkout invité, smoke E2E vert) et Stripe Checkout (webhook idempotent, `payment_failed` géré) — H1.
- TVA par territoire (métropole + DOM), câblage checkout — implémentation technique validée, bloquée sur validation expert-comptable externe.
- Documents commerciaux : confirmation de commande, bon de préparation, facture, avoir ; Factur-X (XML CII BASIC + PDF/A-3) livré pour les factures.
- Fulfillment partiel par ligne/quantité, lien `Shipment` optionnel.
- Retours/remboursements (périmètre admin) : sélection lignes/quantités, restock transactionnel, remboursement Stripe réel ; le formulaire de demande de retour côté storefront client reste différé (`docs/roadmap/h2-commerce-fiable/README.md`).
- Remises (`commerce.discounts`) : simple, règles, automation, livraison gratuite, ciblage catalogue — back-office dédié livré 2026-06-25.
- Zones et méthodes de livraison : CRUD admin complet (périmètre réduit à l'admin, décision produit documentée).

### Administration

- Base clients admin : historique commandes, consentements, export RGPD.
- Navigation admin fusionnée (8 groupes), hubs de configuration par domaine (commerce, marketing, content), breadcrumbs généralisés.
- Refonte de composition macOS/System Settings livrée sur 15 lots (toolbar unifiée, listes, dashboard, reflows mobiles) — chantier `admin-design-macos`, conformité code confirmée sur 14/15 lots sans réserve.
- Doctrine "flag inactif ≠ notFound" appliquée (`admin-feature-disabled-state.tsx`).

### Marketing

- Newsletter : CRUD abonnés, souscription storefront idempotente, campagnes réelles (création, prévisualisation, envoi RGPD-safe).
- Projection `DomainEvent → MarketingIntent` : transformation d'événements éditoriaux (blog, homepage, pages) en propositions de communication, revue admin (`/admin/marketing/intents`), matérialisation en brouillons `NewsletterCampaign`/`SocialPublication` — chantier `editorial-marketing-intents`, clos le 2026-07-16. Aucun envoi ni publication automatique.
- Codes promo back-office avancé (édition priorité, visualisation des utilisations).

### Analytics

- Cockpit `/admin/insights/analytics` étendu sur 7 lots (2026-07-06) : assainissement mock pages visitées, tracking recherche minimal, relance panier abandonné, section Recherche branchée, domaines `tracking`/`dashboarding` — chantier `analyses-cockpit-analytique`, statut détaillé section 4.
- `engagement.analytics` : flag `ACTIVE` par défaut depuis le 2026-07-06 (lot 14 `admin-design-macos`), bloc "Aujourd'hui vs hier" branché sur tracking réel anonyme sans cookie.

### Automatisations

- Automations événementielles : boucle `NEWSLETTER_SUBSCRIBED`/`ORDER_PLACED` → email, worker manuel, gestion de jobs (annulation, relance, batch), cockpit admin.
- Webhooks sortants : signature HMAC, retry, livré le 2026-07-05.
- Relance panier abandonné (job de scan, effet de bord confirmé via `queueCartAbandonedAutomationJobs` et `reactivateAbandonedCart`).

### Plateforme et exploitation

- Docker de production (`Dockerfile.prod` multi-stage non-root, `docker-compose.prod.yml`), Caddy (`docker/caddy/Caddyfile`).
- Scripts d'exploitation : `deploy.sh`, `backup.sh`, `backup-offsite.sh`, `prune-backups.sh`, `healthcheck.sh`.
- Staging opérationnel (`staging.creatyss.lpwebstudio.fr`), HTTPS, sauvegardes cron, sécurité VPS (UFW, Fail2Ban, unattended-upgrades).

---

## 4. Capacités partielles

| Capacité                                         | État réel                                | Partie livrée                                                                                                                     | Reste identifié                                                                                                     |
| ------------------------------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| Multilangue généralisé                           | Partiel                                  | `LocalizedValue` sur homepage, copies produit/boutique, pages de contenu, blog                                                    | Champs métier produit réels hors pilote — `docs/roadmap/h4-plateforme-automatisation/lot-multilangue-generalise.md` |
| CRM avancé                                       | Non livré                                | Base clients admin (historique, consentements, export RGPD) livrée                                                                | `CrmContact`/`CrmTag`, segmentation comportementale reportés hors H3 livrable                                       |
| Intégrations providers (`platform.integrations`) | Modèle Prisma + lecture seule uniquement | Seed, page admin `/admin/settings/integrations`, lecture `Integration`/`IntegrationCredential`/`IntegrationSyncState`             | Aucun adaptateur provider concret branché                                                                           |
| Channels Google/Meta (`satellite.channels`)      | Modèle Prisma + lecture seule uniquement | Seed, page admin `/admin/settings/channels`, lecture `Channel`/`ChannelProductStatus`/`ChannelVariantStatus`                      | Aucune synchronisation vers Google Merchant Center ou Meta Catalog                                                  |
| Provider IA externe (`ai.core`)                  | Câblé sans SDK réel                      | Niveaux `basic`/`assistant`/`advanced`/`automation` gradués, guard `meetsFeatureLevel("ai.core", …)` branché sur SEO produit/blog | Aucun SDK provider réel (Anthropic ou autre) branché                                                                |
| Retry automatique automations `ORDER_PLACED`     | Bloqué produit                           | Boucle fonctionnelle, `maxAttempts: 1`                                                                                            | Décision produit préalable requise avant toute hausse                                                               |
| Activation production des crons internes         | Non activée                              | Trois routes cron fonctionnelles (automations, webhooks sortants, scan panier abandonné), runbook à jour                          | `CRON_SECRET` et cron externes à configurer sur le VPS                                                              |

Capacités où seul le modèle Prisma existe (aucune exposition admin/UI, distinct des cas ci-dessus qui ont au moins une lecture) : aucune identifiée dans le périmètre des sept chantiers transverses audités les plus récents — l'audit correspondant note `PageSection`/`PageBlock` comme le cas le plus proche (modélisés en Prisma, non exploités par le runtime admin/pages actuel, consigné comme "reste ouvert" plutôt que comme lot en cours).

---

## 5. Dépendances et validations externes

Éléments non résolubles uniquement par le code — non présentés comme des bugs applicatifs :

- **Validation TVA par expert-comptable** : moteur TVA implémenté techniquement (métropole + DOM), mais non activable en production sans confirmation externe des taux — `docs/roadmap/h2-commerce-fiable/README.md`.
- **Recette Stripe live** : intégration Checkout et webhooks validés en mode test ; la recette avec compte marchand Stripe réel (mode live) n'a pas été exécutée.
- **Domaine et HTTPS** : HTTPS opérationnel en staging (`staging.creatyss.lpwebstudio.fr`) ; bascule du domaine de production `creatyss.com` non effectuée.
- **Bascule production** : le staging est validé (build Docker, déploiement VPS répétable, sauvegardes, recette prod-like) ; la mise en production effective reste une décision et une action humaines, pas un blocage de code.
- **Validation Factur-X** : XML CII BASIC et PDF/A-3 générés en code, jamais passés dans un outil de conformité Factur-X officiel externe.
- **Provider email transactionnel en production** : configuration Brevo/SMTP en production à confirmer pour les campagnes newsletter et emails transactionnels au-delà des tests réalisés (Mailpit local, Brevo staging).

---

## 6. Feature governance

Le système de gouvernance des features repose sur `FEATURE_CATALOG` (`features/admin/feature-governance/catalog/feature-catalog.ts`, 32 entrées), affiché dynamiquement dans `settings/advanced`. Quatre états sont explicitement distincts (modèle Prisma existant, feature cataloguée, feature activée, UI implémentée) — voir `docs/admin/settings-advanced-feature-system.md` pour le détail du cycle de vie et des règles.

Points d'état observés à date :

- La majorité des 32 features cataloguées utilisent un guard gradué (`meetsFeatureLevel`) plutôt qu'un flag booléen simple. Seules quatre features restent sur le mécanisme booléen `queryFeatureFlagActive` par choix doctrinal (jamais de `FEATURE_LEVELS` déclaré) : `platform.notifications`, `platform.integrations`, `satellite.search`, `satellite.channels`.
- Les deux mécanismes dépendent tous deux de l'état actif résolu du `FeatureFlag`, pas seulement le booléen : `getFeatureLevelState` (`features/feature-flags/queries/get-feature-level-state.query.ts`) calcule cet état, en l'absence d'override `STORE` actif, comme `status === "ACTIVE" && isEnabledByDefault`. Le guard gradué (`meetsFeatureLevel`) ajoute à cette même résolution une comparaison entre le niveau effectif et le niveau requis ; il n'est donc pas indépendant du statut du flag, contrairement à une lecture rapide du mécanisme de gradation. Un override `STORE` actif peut modifier cet état effectif indépendamment du statut par défaut.
- `engagement.analytics` et `engagement.tracking` sont `ACTIVE`/`isEnabledByDefault: true` par défaut dans les seeds actuels (`prisma/seed/*-feature-flag.seed.ts`) ; les autres features observées y restent en statut `DRAFT`/`isEnabledByDefault: false`, donc inactives par défaut pour un store fraîchement seedé, qu'elles soient exposées via le guard gradué ou le mécanisme booléen. L'état d'activation réel d'un store de production (override manuel via `settings/advanced`) n'est pas déductible du dépôt seul.
- `settings.advanced` propose des overrides par store (scope `STORE`) au-dessus du `defaultState`/`allowedLevels` déclarés dans le catalogue.
- Des placeholders `AdminComingSoon` existent pour les modules préparés mais non encore implémentés en UI, conformément à la doctrine.

Pour le détail exhaustif des 32 entrées et de leur niveau, se référer au catalogue réel (`features/admin/feature-governance/catalog/feature-catalog.ts`) plutôt qu'à ce document.

---

## 7. État de la production et de l'exploitation

Éléments observables depuis le dépôt :

- `Dockerfile.prod` (multi-stage, non-root) et `docker-compose.prod.yml` présents à la racine.
- `docker/caddy/Caddyfile` présent pour la terminaison HTTPS.
- Scripts d'exploitation présents dans `scripts/` : `deploy.sh`, `backup.sh`, `backup-offsite.sh`, `prune-backups.sh`, `healthcheck.sh`.
- Documentation d'exploitation complète dans `docs/exploitation/` (variables, sauvegardes, médias, rollback, clonage, recette commerce, cron automations).

Éléments documentés comme validés en staging/prod-like (non re-vérifiables depuis le dépôt seul, état rapporté par `docs/roadmap/h1-boutique-vendable/README.md`) :

- Build image Docker validé sur VPS OVH (2026-06-28).
- Staging opérationnel : HTTPS (HTTP/2 200 + HSTS), PostgreSQL healthy, store/admin bootstrapés.
- Sauvegardes manuelles validées, cron sauvegarde/rotation configuré.
- Sécurité VPS (UFW, Fail2Ban, unattended-upgrades, swap) configurée.
- Recette staging/prod-like validée (parcours virement complet, admin commerce, Stripe test, Brevo staging).
- Restauration DB isolée validée (dump → base temporaire, 173 tables, base principale intacte).

**Non observable depuis le dépôt, à confirmer sur l'infrastructure réelle** : état actuel du VPS de production (distinct du staging), bascule effective du domaine `creatyss.com`, configuration définitive des crons externes (`CRON_SECRET`) en production.

---

## 8. Dettes résiduelles connues

### Dette technique

- **`humanizeLevel()` non supprimé** : le lot "Lisibilité niveaux gouvernance" (`gouvernance-reglages-admin`) annonçait explicitement dans ses critères de fin la suppression de cette fonction une fois le mapping `levelLabels` en place. La fonction reste présente et utilisée comme fallback (`flag.levelLabels?.[level] ?? humanizeLevel(level)`) dans `feature-flag-level-select.tsx`. Le contenu fonctionnel principal est livré ; ce critère de fin précis n'est pas respecté à la lettre.

### Dette documentaire

- **Namespace `pilotage` obsolète** : plusieurs documents de lot (`admin-design-macos` lots 6/7/14/15, audit catalogue 2026-06-13) référencent encore `features/admin/pilotage/**`. Ce chemin n'existe plus — le module réel est `features/admin/feature-governance/**`. Le contenu fonctionnel vérifié reste conforme ; seuls les chemins cités sont périmés.
- **Statut `engagement.analytics` périmé dans l'audit catalogue 2026-06-13** : ce document affirme le flag "inactif par défaut" (`DRAFT`, `isEnabledByDefault: false`) ; le seed réel porte `status: "ACTIVE"`, `isEnabledByDefault: true` depuis le lot 14 `admin-design-macos` (2026-07-06).
- **Mention "branche non mergée" périmée** : `docs/roadmap/analyses-cockpit-analytique/lot-5-cockpit-consolide-cadrage.md` mentionne une branche non mergée ; `git log` confirme le merge (commit `45a5eaf2`) et la clôture du chantier entier (commit `98b50e39`).
- **`MaintenanceRouteNav` documentée à 3 items, réellement à 2** : le lot D de `doctrine-domaines-admin` (daté 2026-07-05) documente 3 entrées (logs, monitoring, observability) ; la fusion ultérieure du lot 15 `admin-design-macos` (2026-07-06) a réduit à 2 entrées (Vue d'ensemble, Jobs), non retracée dans le README du chantier doctrine.
- **Chantier `editorial-marketing-intents`** : clos le 2026-07-16, n'apparaît pas dans le tableau récapitulatif de `docs/roadmap/README.md` (qui liste les chantiers cross-cutting antérieurs). Écart de recensement, pas d'écart d'implémentation.

### Dette de validation externe

Voir section 5 (TVA, Stripe live, domaine/HTTPS, Factur-X, provider email production).

---

## 9. Capacités volontairement reportées

Explicitement hors horizon immédiat, ni oubli ni anomalie :

- Intégrations provider concrètes (`platform.integrations` reste lecture seule sans adaptateur).
- Google Merchant Center et Meta Catalog (`satellite.channels` reste lecture seule sans synchronisation).
- Multilangue complet — extension du périmètre partiellement livré sur les champs métier produit réels, voir section 4 (au-delà des pilotes livrés).
- CRM avancé (`CrmContact`/`CrmTag`, segmentation comportementale, support tickets).
- Provider IA externe branché sur un SDK réel (`ai.core` reste câblé sans SDK).
- OSS UE et export hors-UE (hors périmètre boutique artisanale sans vente hors France significative).
- Transporteurs intégrés et étiquettes d'expédition automatiques.
- A/B testing newsletter, analytics email avancés, workflows multi-étapes et retry policies avancées pour les automations.
- Apple Pay, Google Pay, paiement en plusieurs fois, 3DS avancé, multi-devises.
- Recherche facettée avancée, auto-complétion, traduction automatique.

---

## 10. Frontières produit et techniques

Rappel de nature du produit :

- Boutique artisanale premium, mono-boutique.
- Administrée par une personne non technique.
- Non conçue comme une marketplace ni comme un SaaS multi-tenant.

Éléments à ne pas ajouter sans décision explicite (`docs/roadmap/projet-creatyss.md`, roadmaps H1-H4) :

- Redis, queues supplémentaires, microservices.
- Moteur de règles, promotions avancées au-delà des remises déjà livrées.
- Multi-boutique, paiements complexes, abonnements.
- Analytics complexes (entonnoirs de conversion, heatmaps).
- IA produit non bornée (au-delà de l'usage borné SEO déjà cadré).

---

## 11. Sources de vérité

| Sujet                    | Source faisant autorité                                                                                                    |
| ------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Doctrine générale        | `AGENTS.md`, `docs/architecture/**`                                                                                        |
| Domaine précis           | `docs/domains/**`                                                                                                          |
| Horizon produit          | `docs/roadmap/h1-boutique-vendable/`, `h2-commerce-fiable/`, `h3-administration-avancee/`, `h4-plateforme-automatisation/` |
| Modèle réel              | `prisma/**`                                                                                                                |
| Implémentation livrée    | code existant (`features/**`, `app/**`)                                                                                    |
| Gouvernance des features | `features/admin/feature-governance/catalog/feature-catalog.ts` + `docs/admin/settings-advanced-feature-system.md`          |

---

## 12. Règles de maintenance du document

Ce document doit être mis à jour uniquement après :

- clôture d'un horizon majeur (H1 à H4) ;
- changement architectural ;
- changement significatif de gouvernance (taxonomie, catalogue de features) ;
- bascule production ;
- audit stratégique complet équivalent à celui ayant servi de base à cette version.

Il ne doit pas être modifié après chaque micro-lot. Les micro-lots continuent de vivre dans `docs/roadmap/**` et `docs/domains/**`.
