# Audit architecture modulaire — Creatyss

**Date :** 2026-06-07  
**Type :** Lecture seule — aucune modification effectuée  
**Périmètre :** repo complet, codebase + Prisma + settings/advanced

---

## 1. Résumé exécutif

Creatyss est en bonne santé architecturale. La base est propre, la doctrine est respectée, et la direction modulaire est déjà engagée concrètement : `settings/advanced` existe, le `FEATURE_CATALOG` est en place, les feature flags ont leur modèle Prisma, leur UI split-view et leur système de familles.

Les points d'attention ne remettent pas en cause la structure. Ils concernent :

- **Une dérive de taxonomie doc/Prisma** : une quinzaine de domaines classés `cross-cutting` dans `docs/` sont rangés `optional` dans `prisma/`. Ce n'est pas bloquant mais crée de l'ambiguïté à long terme.
- ~~Un pattern try/catch répété dans les 8 segments de `settings/advanced`~~ — **résolu (2026-07-22)**, cf. §3.1.
- **Deux pages quasi-identiques** pour Paiements et Livraison (présentes en `commerce/` et en `settings/`), qui représentent de vraies duplications de surface.
- **Des fichiers de travail temporaires** (`backups/`, `tmp/`, `.trash/`) qui encombrent le repo sans valeur à long terme.
- **Un seul hook mobile dupliqué** (`use-mobile.ts` vs `use-is-admin-mobile.ts`), légitime dans son contexte mais à documenter.
- **`features/admin/products/`** a une structure sans dossier `queries/` à la racine (les queries sont dans `list/`, `editor/`, etc.) — cohérent mais asymétrique avec les autres features.

Aucun vrai "dead code" n'a été identifié. Les modules Prisma non encore branchés à l'UI sont des placeholders valides et cohérents avec la roadmap modulaire.

---

## 2. Cartographie architecture actuelle

### 2.1 Structure applicative

```
app/
  admin/(protected)/
    catalog/          → produits, catégories, médias, tarification
    commerce/         → commandes, clients, paiements*, livraisons*
    content/          → blog, homepage, pages, seo
    insights/         → analytics (placeholder)
    maintenance/      → monitoring (live), logs/jobs (live), observabilité
    marketing/        → remises*, newsletter*, automations*
    settings/
      general/        → formulaire store (live)
      store/          → config domaines (live)
      advanced/       → feature flags UI (live)
      payments/*      → placeholder
      shipping/*      → placeholder
      team/           → placeholder
      api-clients/    → placeholder

  (* = AdminComingSoon, placeholder assumé)

features/admin/
  auth, blog, catalog, categories, commerce, content,
  customers, dashboard, homepage, insights, maintenance,
  marketing, media, navigation, pages, pilotage, products, settings

features/storefront/
  catalog, content, favorites

features/products/       → storefront produits (queries, mappers, repository)
features/commerce/       → cart, checkout, orders, payment
features/seo/            → helpers SEO storefront
features/homepage/       → queries homepage storefront
features/email/          → transactionnel email
```

### 2.2 Structure Prisma

```
prisma/
  core/
    catalog/    → products, categories, pricing, availability
    commerce/   → orders, cart, checkout, customers
    content/    → pages
    foundation/ → store, identity, api-clients
  cross-cutting/
    audit, domain-events, feature-flags, jobs,
    monitoring, observability, seo
  optional/
    ai/         → ai
    commerce/   → bundles, discounts, documents, fulfillment,
                   gift-cards, gifting, inventory, loyalty,
                   payments, returns, sales-policy, shipping,
                   subscriptions, taxation
    engagement/ → analytics, attribution, behavior, blog, conversion,
                   crm, newsletter, public-events, recommendations,
                   social, support
    platform/   → approval, consent, email, export, fraud-risk,
                   import, integrations, localization, notifications,
                   scheduling, webhooks, workflow
    homepage    (fichier à la racine optional/)
  satellites/
    channels, media, search
```

### 2.3 Settings/advanced — état actuel

Le système est déjà opérationnel :

- `prisma/cross-cutting/feature-flags.prisma` → modèle `FeatureFlag` + `FeatureFlagOverride`
- `features/admin/pilotage/catalog/feature-catalog.ts` → **21 features cataloguées**
- `settings/advanced` → split-view avec liste par famille + détail toggleable
- Familles : `core`, `cross_cutting`, `optional`, `satellite`, `unmapped`
- Mutabilités : `readonly`, `toggleable`, `level_selectable`
- Scopes : `store`, `global`

Features actuellement dans le catalogue :

| Famille       | Module      | Feature key                   | Mutabilité       |
| ------------- | ----------- | ----------------------------- | ---------------- |
| core          | catalog     | catalog.products.pricing      | readonly         |
| core          | catalog     | catalog.products.availability | readonly         |
| core          | catalog     | catalog.products.inventory    | level_selectable |
| core          | catalog     | catalog.products.media        | level_selectable |
| core          | catalog     | catalog.products.variants     | readonly         |
| core          | catalog     | catalog.products.seo          | readonly         |
| core          | catalog     | catalog.products.categories   | readonly         |
| core          | catalog     | catalog.products.related      | toggleable       |
| core          | settings    | settings.advanced             | readonly         |
| satellite     | commerce    | commerce.payments             | toggleable       |
| satellite     | commerce    | commerce.shipping             | toggleable       |
| optional      | commerce    | commerce.discounts            | level_selectable |
| optional      | engagement  | engagement.newsletter         | level_selectable |
| optional      | engagement  | engagement.analytics          | level_selectable |
| optional      | ai          | ai.core                       | level_selectable |
| cross_cutting | content     | content.blog                  | readonly         |
| cross_cutting | content     | content.homepage              | readonly         |
| cross_cutting | content     | content.seo                   | readonly         |
| cross_cutting | maintenance | maintenance.observability     | readonly         |
| cross_cutting | maintenance | maintenance.logs              | readonly         |
| cross_cutting | insights    | insights.analyticsRead        | readonly         |

---

## 3. Audit duplications

### 3.1 Pattern try/catch listAdminFeatureFlags (8 occurrences)

**Fichiers concernés :**

```
settings/advanced/@list/page.tsx
settings/advanced/@list/[family]/page.tsx
settings/advanced/@list/default.tsx
settings/advanced/@list/overview/page.tsx
settings/advanced/@detail/page.tsx
settings/advanced/@detail/[family]/page.tsx
settings/advanced/@detail/default.tsx
settings/advanced/@detail/overview/page.tsx
```

**Pattern répété dans chaque segment :**

```typescript
let flags: Awaited<ReturnType<typeof listAdminFeatureFlags>> = [] as const;
try {
  flags = await listAdminFeatureFlags();
} catch {
  // Table non disponible
}
```

**Type :** Duplication structurelle liée aux parallel routes Next.js. Chaque segment est un Server Component indépendant — la répétition est en partie imposée par le framework.

**Risque :** Faible. Si la signature de `listAdminFeatureFlags` change, 8 fichiers sont à mettre à jour.

~~**Proposition :** Extraire un loader partagé avec typage explicite~~ — **résolu (2026-07-22)** : `features/admin/feature-governance/queries/load-feature-flags-safe.query.ts` (colocalisé avec `list-admin-feature-flags.query.ts`, pas sous `pilotage/` comme proposé initialement — ce dossier n'existe pas dans `features/admin/`). Périmètre réel : **14 fichiers**, pas 8 — 6 segments (`[flagSlug]`, `localization/*`) ont été ajoutés depuis cet audit et portaient le même pattern. Deux sous-pages `localization/settings` et `localization/translations` du slot `@detail` vérifiées et **exclues** : elles appellent `listAdminLocalizationLocales()`, une query différente, pas de duplication.

---

### 3.2 Pages Paiements dupliquées (commerce vs settings)

**Fichiers :**

- `app/admin/(protected)/commerce/payments/page.tsx`
- `app/admin/(protected)/settings/payments/page.tsx`

**Différences :** Uniquement le titre, le breadcrumb, la description et la présence d'un `fallbackAction`. Le composant `AdminComingSoon` est le même.

**Même constat pour Livraison :**

- `app/admin/(protected)/commerce/shipping/page.tsx`
- `app/admin/(protected)/settings/shipping/page.tsx`

**Type :** Duplication de surface — deux entrées de navigation différentes pour deux contextes différents (configuration dans settings, opérationnel dans commerce). La distinction est intentionnellement UX.

**Risque :** Faible. Quand ces modules seront implémentés, les deux pages auront des contenus distincts (configuration dans settings, opérationnel dans commerce). La duplication disparaîtra naturellement.

**Verdict :** À conserver. Ne pas fusionner.

**Mise à jour (2026-07-22) :** la prédiction s'est réalisée, sans action de correction nécessaire. `commerce/payments/page.tsx` et `commerce/shipping/page.tsx` sont désormais des vues opérationnelles réelles (listes, capture manuelle, filtres) ; `commerce/payments/settings/page.tsx` et `commerce/shipping/settings/page.tsx` sont des pages de configuration réelles (formulaires, queries dédiées) ; `settings/payments/page.tsx` et `settings/shipping/page.tsx` ne sont plus des placeholders `AdminComingSoon` — ce sont désormais de simples `redirect()` vers la page `commerce/.../settings` correspondante, absents du menu de navigation admin (`admin-navigation.data.ts`). Plus aucune duplication de code, de query ou de composant. Aucun refactor à faire — point clos.

---

### 3.3 Hooks mobile dupliqués

**Fichiers :**

- `hooks/use-mobile.ts` → `useIsMobile()` — breakpoint 768px, basé sur MediaQueryList
- `hooks/use-is-admin-mobile.ts` → `useIsAdminMobile()` — breakpoint 1024px (ADMIN_SIDEBAR_MOBILE_BREAKPOINT), basé sur `window.innerWidth`

**Type :** Pseudo-duplication. Les deux hooks ont des breakpoints différents (768 vs 1024) et des implémentations légèrement différentes (MediaQueryList vs resize event). La séparation est intentionnelle.

**Risque :** Nul si les usages ne sont pas confondus.

**Proposition :** Documenter la distinction dans les fichiers (commentaire JSDoc). Vérifier que `use-mobile.ts` est encore utilisé — si ce n'est pas le cas, le supprimer.

**Mise à jour (2026-07-22) :** `hooks/use-is-admin-mobile.ts` n'existe plus dans le repo — supprimé entre-temps, sans qu'on sache si c'est lié à cette proposition. `use-mobile.ts` (`useIsMobile()`) est toujours utilisé (`components/ui/sidebar.tsx`). La pseudo-duplication signalée n'existe donc plus : un seul hook mobile reste, pas de risque de confusion résiduel.

---

### 3.4 Queries Store dupliquées (get-admin-store-settings vs get-admin-store-config)

**Fichiers :**

- `features/admin/settings/queries/get-admin-store-settings.query.ts`
- `features/admin/settings/queries/get-admin-store-config.query.ts`

**Différence :** Projections différentes du même model `Store`. `settings` porte les champs éditoriaux (legalName, support…) et `config` porte le statut opérationnel et les domaines.

**Type :** Séparation intentionnelle de responsabilités. Pas une duplication.

**Verdict :** À conserver tel quel.

---

### 3.5 Barrels index.ts (114 fichiers)

**Observation :** 114 barrels `index.ts` dans le repo. Certains sont utiles (exports publics d'une feature), d'autres sont des re-exports immédiats d'un seul fichier.

**Risque :** Faible. Risque de confusion sur les chemins d'import. Pas de risque fonctionnel.

**Proposition :** Pas d'action immédiate. Lors d'un refactor de périmètre, supprimer les barrels qui ne re-exportent qu'un seul symbole.

---

## 4. Audit code mort vs placeholders légitimes

### 4.1 Vrais fichiers à nettoyer

| Chemin                                 | Type                                        | Action                                                           |
| -------------------------------------- | ------------------------------------------- | ---------------------------------------------------------------- |
| `backups/*.dump` (5 fichiers, ~3.5 MB) | Dumps DB pré-refactor                       | Supprimer après validation que le refactor categories est stable |
| `backups/creatyss-plain.sql`           | SQL brut                                    | Idem                                                             |
| `tmp/` (11 fichiers)                   | Scripts SQL temporaires, logs de diagnostic | Supprimer                                                        |
| `.trash/features-admin-products/`      | Code legacy produits du 2026-03-28          | Supprimer — le refactoring products est manifestement validé     |

Ces fichiers encombrent le repo sans valeur et peuvent induire en erreur un futur contributeur. Nettoyage à faire dans un commit dédié.

---

### 4.2 Placeholders légitimes (à conserver)

| Page/module             | Composant                 | Statut                                                                   |
| ----------------------- | ------------------------- | ------------------------------------------------------------------------ |
| `marketing/discounts`   | AdminComingSoon           | **PLACEHOLDER_VALID** — feature flag `commerce.discounts` défini         |
| `marketing/newsletter`  | AdminComingSoon           | **PLACEHOLDER_VALID** — feature flag `engagement.newsletter` défini      |
| `marketing/automations` | AdminComingSoon           | **PLACEHOLDER_VALID** — mention du futur modèle Automation               |
| `commerce/payments`     | AdminComingSoon           | **PLACEHOLDER_VALID** — feature flag `commerce.payments` défini          |
| `commerce/shipping`     | AdminComingSoon           | **PLACEHOLDER_VALID** — feature flag `commerce.shipping` défini          |
| `settings/payments`     | AdminComingSoon           | **PLACEHOLDER_VALID** — même raison                                      |
| `settings/shipping`     | AdminComingSoon           | **PLACEHOLDER_VALID** — même raison                                      |
| `catalog/pricing`       | Page partielle            | **PLACEHOLDER_VALID** — modèle PriceList live en DB, UI création à venir |
| `settings/team`         | Non vérifié               | Probablement PLACEHOLDER_VALID                                           |
| `settings/api-clients`  | Non vérifié               | Probablement PLACEHOLDER_VALID (modèle ApiClient live)                   |
| `insights/analytics`    | AnalyticsOverviewSections | Probablement placeholder partiel                                         |

Ces placeholders sont **intentionnels, documentés et cohérents** avec la roadmap modulaire. Les supprimer serait une erreur.

---

### 4.3 `features/admin/` sans dossier queries/ à la racine

| Feature      | Observation                                                                        |
| ------------ | ---------------------------------------------------------------------------------- |
| `auth`       | Normale — pas de query, logique de session/guard                                   |
| `insights`   | Queries dans les composants inline — acceptable pour le volume actuel              |
| `marketing`  | Pas de queries — uniquement des pages placeholder                                  |
| `navigation` | Normale — helpers de navigation, pas de queries DB                                 |
| `products`   | Queries dans `list/queries/`, `editor/queries/` — architecture verticale délibérée |

Aucun de ces cas n'est du code mort.

---

## 5. Audit Prisma détaillé

### 5.1 Core (à conserver absolument)

| Modèle / Fichier                                                                                           | Catégorie | Justification                  | Risque suppression |
| ---------------------------------------------------------------------------------------------------------- | --------- | ------------------------------ | ------------------ |
| `Store`, `StoreDomain`                                                                                     | KEEP_NOW  | Racine de toute l'architecture | Catastrophique     |
| `User`, `Role`, `Permission`, `Session` (identity)                                                         | KEEP_NOW  | Auth admin live                | Catastrophique     |
| `ApiClient`, `ApiClientSecret`, `ApiClientPermission`                                                      | KEEP_NOW  | API live                       | Très élevé         |
| `Product`, `ProductVariant`, `ProductType`, `ProductOption`, `ProductOptionValue`, `ProductCharacteristic` | KEEP_NOW  | Catalogue live                 | Catastrophique     |
| `Category`                                                                                                 | KEEP_NOW  | Catalogue live                 | Catastrophique     |
| `PriceList`, `ProductPrice`, `ProductVariantPrice` (pricing)                                               | KEEP_NOW  | Tarification live              | Très élevé         |
| `AvailabilityRecord`, `SellabilityDecision` (availability)                                                 | KEEP_NOW  | Disponibilité live             | Élevé              |
| `Cart`, `CartLine`                                                                                         | KEEP_NOW  | Panier storefront live         | Très élevé         |
| `Checkout`                                                                                                 | KEEP_NOW  | Checkout live                  | Très élevé         |
| `Customer`                                                                                                 | KEEP_NOW  | Commerce live                  | Très élevé         |
| `Order`, `OrderLine`, `OrderAddress`, `OrderShippingSelection`                                             | KEEP_NOW  | Commandes live                 | Catastrophique     |
| `Page`                                                                                                     | KEEP_NOW  | Pages CMS live                 | Élevé              |

### 5.2 Cross-cutting (à conserver — infrastructure transverse)

| Modèle / Fichier                           | Catégorie | Justification                                 |
| ------------------------------------------ | --------- | --------------------------------------------- |
| `FeatureFlag`, `FeatureFlagOverride`       | KEEP_NOW  | settings/advanced live, UI branchée           |
| `AuditLog`                                 | KEEP_NOW  | Monitoring live, lu en maintenance            |
| `DomainEvent`                              | KEEP_NOW  | Infrastructure events, lu en monitoring       |
| `Job`                                      | KEEP_NOW  | File de jobs, lu en maintenance/logs          |
| `MonitoringCheck`, `MonitoringCheckResult` | KEEP_NOW  | Monitoring live                               |
| `ObservabilitySignal`                      | KEEP_NOW  | Observabilité live                            |
| `SeoMetadata`                              | KEEP_NOW  | SEO transverse live sur produits, blog, pages |

### 5.3 Optional — commerce (justification par module)

| Modèle / Fichier                                             | Catégorie         | Justification                                                                             |
| ------------------------------------------------------------ | ----------------- | ----------------------------------------------------------------------------------------- |
| `Payment`, `PaymentAttempt`                                  | KEEP_SOON         | Stripe intégré dans `core/payments/stripe/`, modèle nécessaire dès activation             |
| `Shipment`, `ShippingZone`, `ShippingMethod`                 | KEEP_SOON         | Feature flag `commerce.shipping` live dans catalog                                        |
| `Discount`, `DiscountCode`, `DiscountRule`                   | PLACEHOLDER_VALID | Feature flag `commerce.discounts` live, UI placeholder                                    |
| `Fulfillment`, `FulfillmentItem`                             | PLACEHOLDER_VALID | Nécessaire dès que shipping actif                                                         |
| `ReturnRequest`, `ReturnItem`, `ReturnDecision`              | PLACEHOLDER_VALID | Dépend de fulfillment, cohérent niveau L2                                                 |
| `Document` (ORDER_CONFIRMATION, INVOICE…)                    | PLACEHOLDER_VALID | Utile dès que orders/payments actifs                                                      |
| `TaxRule`, `TaxRuleScope`                                    | PLACEHOLDER_VALID | Niveau L2, dépend de catalog+pricing                                                      |
| `InventoryItem`, `InventoryReservation`, `InventoryMovement` | PLACEHOLDER_VALID | Feature `catalog.products.inventory` dans catalog                                         |
| `Subscription`                                               | PLACEHOLDER_VALID | Niveau L3, prépare un module futur clairement identifié                                   |
| `LoyaltyAccount`, `LoyaltyTransaction`                       | PLACEHOLDER_VALID | Niveau L3, structurellement propre                                                        |
| `GiftCard`, `GiftCardTransaction`                            | PLACEHOLDER_VALID | Niveau L3, dépend orders+payments                                                         |
| `GiftRequest`                                                | PLACEHOLDER_VALID | Niveau L3, dépend gift-cards                                                              |
| `Bundle`, `BundleItem`                                       | PLACEHOLDER_VALID | Niveau L3, doc satellite — cohérent                                                       |
| `SalesPolicy`, `SellabilityDecision`                         | REVIEW            | `SellabilityDecision` déjà dans `availability.prisma` (core) — vérifier doublon potentiel |

### 5.4 Optional — engagement (justification par module)

| Modèle / Fichier                                       | Catégorie         | Justification                                                     |
| ------------------------------------------------------ | ----------------- | ----------------------------------------------------------------- |
| `BlogCategory`, `BlogPost`                             | KEEP_NOW          | Blog live — feature `content.blog` active                         |
| `Homepage`, `HomepageSection`                          | KEEP_NOW          | Homepage admin live                                               |
| `NewsletterSubscriber`, `NewsletterCampaign`           | PLACEHOLDER_VALID | Feature flag `engagement.newsletter` dans catalog, UI placeholder |
| `AnalyticsMetric`, `AnalyticsSnapshot`                 | PLACEHOLDER_VALID | Feature flag `engagement.analytics` dans catalog                  |
| `CrmContact`, `CrmTag`, `CrmContactTag`                | PLACEHOLDER_VALID | Niveau L2, prépare gestion client avancée                         |
| `SupportTicket`, `SupportMessage`                      | PLACEHOLDER_VALID | Niveau L2, cohérent avec roadmap artisanale                       |
| `PublicEvent`, `EventRegistration`, `EventReservation` | PLACEHOLDER_VALID | Niveau L2, cohérent avec "marchés" (`app/les-marches/`)           |
| `ConversionFlow`, `ConversionFlowProduct`              | PLACEHOLDER_VALID | Niveau L1, prépare cart recovery, upsell                          |
| `RecommendationRule`                                   | PLACEHOLDER_VALID | Niveau L3, prépare recommendations produits                       |
| `BehaviorSegment`, `BehaviorProfile`                   | PLACEHOLDER_VALID | Niveau L2, prépare segmentation                                   |
| `AttributionModel`, `AttributionCredit`                | PLACEHOLDER_VALID | Niveau L2, analytics avancé                                       |
| `SocialPublication`, `SocialPublicationAsset`          | PLACEHOLDER_VALID | Niveau L2, contenu éditorial social                               |

### 5.5 Optional — platform (justification par module)

| Modèle / Fichier                                         | Catégorie         | Justification                                                           |
| -------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------- |
| `EmailMessage`, `EmailRecipient`                         | KEEP_SOON         | Email transactionnel déjà dans `features/email/`, modèle de traçabilité |
| `Notification`, `NotificationPreference`                 | PLACEHOLDER_VALID | Niveau L1, prépare notifications in-app                                 |
| `Integration`, `IntegrationCredential`                   | PLACEHOLDER_VALID | Niveau L2, prépare connecteurs tiers                                    |
| `WebhookEndpoint`, `WebhookDelivery`                     | PLACEHOLDER_VALID | Niveau L2, prépare API sortante                                         |
| `ImportDefinition`, `ImportRequest`                      | PLACEHOLDER_VALID | Script import WooCommerce existe déjà (`scripts/import-woocommerce/`)   |
| `ExportDefinition`, `ExportRequest`                      | PLACEHOLDER_VALID | Niveau L2, prépare exports CSV/comptabilité                             |
| `ConsentPurpose`, `ConsentRecord`                        | PLACEHOLDER_VALID | Niveau L2, RGPD                                                         |
| `LocalizationLocale`, `LocalizedValue`                   | PLACEHOLDER_VALID | Niveau L2, prépare multi-langues                                        |
| `SchedulePlan`                                           | PLACEHOLDER_VALID | Niveau L2, prépare publication programmée                               |
| `WorkflowDefinition`, `WorkflowInstance`, `WorkflowStep` | PLACEHOLDER_VALID | Niveau L3, automation avancée                                           |
| `ApprovalRequest`, `ApprovalDecision`                    | PLACEHOLDER_VALID | Niveau L3 — **voir note taxonomie**                                     |
| `FraudRiskAssessment`, `FraudRiskReview`                 | PLACEHOLDER_VALID | Niveau L3 — **voir note taxonomie**                                     |

### 5.6 Satellites

| Modèle / Fichier                | Catégorie         | Justification                                           |
| ------------------------------- | ----------------- | ------------------------------------------------------- |
| `MediaAsset`, `MediaReference`  | KEEP_NOW          | Bibliothèque médias live                                |
| `SearchDocument`                | KEEP_SOON         | Prépare recherche full-text — infrastructure déjà posée |
| `Channel`, `ChannelPublication` | PLACEHOLDER_VALID | Niveau L1, prépare Google Shopping, Meta Catalog        |

---

## 6. Dérive taxonomie doc/Prisma (écart à signaler)

**Problème identifié :** Une quinzaine de domaines sont classés **`cross-cutting`** dans `docs/domains/` mais rangés **`optional`** dans `prisma/`.

| Domaine       | docs/         | prisma/             |
| ------------- | ------------- | ------------------- |
| analytics     | cross-cutting | optional/engagement |
| approval      | cross-cutting | optional/platform   |
| attribution   | cross-cutting | optional/engagement |
| behavior      | cross-cutting | optional/engagement |
| consent       | cross-cutting | optional/platform   |
| conversion    | cross-cutting | optional/engagement |
| crm           | cross-cutting | optional/engagement |
| fraud-risk    | cross-cutting | optional/platform   |
| newsletter    | cross-cutting | optional/engagement |
| social        | cross-cutting | optional/engagement |
| support       | cross-cutting | optional/engagement |
| monitoring    | cross-cutting | cross-cutting ✓     |
| observability | cross-cutting | cross-cutting ✓     |
| domain-events | cross-cutting | cross-cutting ✓     |

**Nature de l'écart :** Ces domaines ont une nature duale — ils sont transverses fonctionnellement (affectent plusieurs domaines), mais optionnels architecturalement (peuvent ne pas être activés). La classification `optional` en Prisma reflète leur activabilité, la classification `cross-cutting` en docs reflète leur portée transverse.

**Ce n'est pas un bug.** Mais c'est une ambiguïté documentaire.

~~**Recommandation :** Dans une prochaine session `docs-keeper`, clarifier dans `docs/architecture/10-fondations/11-modele-de-classification.md` qu'un domaine peut être `optional` du point de vue de l'activation ET `cross-cutting` du point de vue de la portée fonctionnelle. Ces deux axes sont orthogonaux.~~ — **résolu (observé 2026-07-22)** : section "Axes orthogonaux : activabilité et portée" présente dans `docs/architecture/10-fondations/11-modele-de-classification.md` (lignes 174-195), avec les mêmes exemples (`newsletter`, `analytics`, `crm`, `consent`, `support`). Date d'ajout non tracée dans cette session — déjà fait avant ce lot.

---

## 7. Audit modularité et settings

### 7.1 Features déjà toggleables via settings/advanced

- `commerce.payments` → toggleable, scope store
- `commerce.shipping` → toggleable, scope store
- `commerce.discounts` → level_selectable (simple/rules/automation)
- `engagement.newsletter` → level_selectable (basic/segmentation/automation)
- `engagement.analytics` → level_selectable (read/insights/recommendations)
- `catalog.products.inventory` → level_selectable (manual/alerts/forecasting)
- `catalog.products.media` → level_selectable (basic/optimization/generation/automation)
- `catalog.products.related` → toggleable
- `ai.core` → level_selectable (basic/assistant/advanced/automation)

### 7.2 Features difficiles à désactiver (couplages forts)

Ces features sont `readonly` dans le catalog — elles ne peuvent pas être désactivées depuis l'UI. C'est intentionnel et correct :

- Tout ce qui est `core` : catalog, commerce, foundation
- `content.blog`, `content.homepage`, `content.seo` → marqués `cross_cutting` + `readonly`
- `settings.advanced` → auto-référentiel, ne peut pas se désactiver lui-même

### 7.3 Modules Prisma sans entrée dans le FEATURE_CATALOG

Les modules Prisma suivants n'ont pas encore d'entrée dans `FEATURE_CATALOG` :

- `commerce.loyalty` (LoyaltyAccount)
- `commerce.subscriptions` (Subscription)
- `commerce.gift-cards` (GiftCard)
- `commerce.bundles` (Bundle)
- `commerce.returns` (ReturnRequest)
- `commerce.fulfillment` (Fulfillment)
- `commerce.documents` (Document)
- `commerce.taxation` (TaxRule)
- `engagement.crm` (CrmContact)
- `engagement.support` (SupportTicket)
- `engagement.public-events` (PublicEvent)
- `engagement.social` (SocialPublication)
- `engagement.behavior` (BehaviorSegment)
- `engagement.conversion` (ConversionFlow)
- `engagement.recommendations` (RecommendationRule)
- `engagement.attribution` (AttributionModel)
- `platform.notifications` (Notification)
- `platform.webhooks` (WebhookEndpoint)
- `platform.integrations` (Integration)
- `platform.scheduling` (SchedulePlan)
- `platform.workflow` (WorkflowDefinition)
- `platform.approval` (ApprovalRequest)
- `platform.fraud-risk` (FraudRiskAssessment)
- `platform.localization` (LocalizationLocale)
- `satellite.search` (SearchDocument)
- `satellite.channels` (Channel)
- `ai.core` (AiProvider) ← déjà dans FEATURE_CATALOG ✓

Ces absences sont normales. L'enrichissement du FEATURE_CATALOG se fait progressivement à mesure que les modules approchent de leur activation.

### 7.4 Settings manquants dans la navigation

La navigation admin actuelle expose :

- `settings/general` ✓
- `settings/store` ✓
- `settings/advanced` ✓
- `settings/payments` (placeholder)
- `settings/shipping` (placeholder)
- `settings/team` (non audité)
- `settings/api-clients` (non audité)

Sections settings prévues non encore créées (à prévoir progressivement) :

- `settings/catalog` → configuration catalog (types de produits, options par défaut)
- `settings/seo` → SEO global store
- `settings/blog` → paramètres blog (si `content.blog` configurable)
- `settings/media` → limites upload, formats acceptés
- `settings/orders` → comportements par défaut (statuts automatiques, numérotation)
- `settings/customers` → options opt-in, RGPD, consentement

---

## 8. Proposition architecture cible légère

### 8.1 Feature toggle — enrichissement progressif du FEATURE_CATALOG

Quand un module Prisma approche de son activation, ajouter son entrée dans `feature-catalog.ts` **avant** de créer l'UI. C'est l'ordre correct.

Exemple pour le prochain module activé (loyalty, gift-cards, ou crm) :

```typescript
{
  key: "commerce.loyalty",
  label: "Fidélité",
  description: "Programme de points fidélité par client.",
  family: "optional",
  module: "commerce",
  defaultState: "inactive",
  mutability: "toggleable",
  scopes: ["store"],
}
```

### 8.2 Feature levels — logique existante à étendre

La logique de `levels` est déjà en place dans `FEATURE_LEVELS` et supportée par `FeatureMutability = "level_selectable"`. Ajouter des niveaux pour les nouveaux modules suits le même pattern.

### 8.3 Settings centralisés — ordre conseillé

Créer les sections settings dans cet ordre de priorité :

1. `settings/orders` → petit, lié à un module live
2. `settings/catalog` → types de produits, utile rapidement
3. `settings/media` → limites upload (déjà partiellement dans `core/uploads/`)
4. `settings/seo` → SEO global store
5. `settings/customers` → consentement RGPD (via ConsentPurpose)
6. `settings/blog` → si content.blog devient configurable

### 8.4 Placeholders propres — doctrine à maintenir

Le pattern `AdminComingSoon` avec `docRef` et `requirements` est excellent. À conserver et à utiliser systématiquement pour tout nouveau module placeholder.

Convention à respecter :

```typescript
<AdminComingSoon
  title="Nom du module"
  description="Ce que fait le module, quand actif."
  docRef="prisma/optional/[domaine]/[fichier].prisma"
  requirements={["Feature flag : [key]", "Prérequis éventuel"]}
  icon={IconLucide}
/>
```

---

## 9. Plan de refactor par micro-lots

### Lot 1 — Nettoyage fichiers temporaires — **sans objet** (vérifié 2026-07-22)

Aucun des fichiers listés n'est suivi par git (`git ls-files backups tmp .trash` ne retourne rien) — ce sont des artefacts de working directory local, hors du périmètre d'un commit. État actuel constaté : `backups/` et `.trash/` vides, `tmp/` ne contient plus que 2 fichiers `.md` sans rapport avec les dumps/scripts SQL décrits (probablement des artefacts d'un outil MCP local). Rien à committer — ce nettoyage relève de l'hygiène de poste de travail, pas du repo.

---

### Lot 2 — Extraction loader feature flags — **livré (2026-07-22)**

`features/admin/feature-governance/queries/load-feature-flags-safe.query.ts` — 14 blocs try/catch remplacés (pas 8, cf. §3.1 pour le détail des segments ajoutés depuis l'audit). `typecheck`/`lint` verts, mergé dans `main`.

---

### Lot 3 — Clarification taxonomie doc — **livré** (constaté le 2026-07-22)

Cf. §6 ci-dessus — section déjà présente dans `docs/architecture/10-fondations/11-modele-de-classification.md`.

---

### Lot 4 — Enrichissement progressif FEATURE_CATALOG (priorité continue)

**Périmètre :** À chaque module qui approche de l'activation, ajouter son entrée dans `feature-catalog.ts` avant de créer l'UI.

**Prochains candidats naturels :**

1. `commerce.loyalty` (modèle propre, dépendances claires)
2. `platform.notifications` (notification in-app, dépend email)
3. `engagement.crm` (si CRM activé)

**Agent recommandé :** `next-feature-builder` ou `architect-review` si l'activation impacte plusieurs domaines.

---

### Lot 5 — Pages settings manquantes (priorité progressive)

**Périmètre :** Créer progressivement les sections settings manquantes comme placeholders propres avec `AdminComingSoon`.

**Ordre conseillé :**

1. `settings/orders` (faible dépendance)
2. `settings/catalog` (utile rapidement)
3. `settings/media` (simple)
4. `settings/seo`

**Agent recommandé :** `next-admin-ui-builder`

---

## 10. Points hors périmètre de cet audit

- Typecheck complet (`pnpm run typecheck`) — outil non disponible dans l'environnement d'audit
- Tests unitaires et e2e — non lancés
- Analyse de performance / bundle size
- Audit sécurité (endpoints API, permissions)
- Contenu de `docs/lots/` (roadmap produits 2026-05-27) — non audité dans le détail
- Feature `app/les-marches/` — non auditée (probablement liée à `PublicEvent`)
- Feature `app/favoris/` — non auditée (liée à `features/storefront/favorites/`)
- Script `scripts/import-woocommerce/` — non audité

---

## 11. Vérifications effectuées vs non effectuées

| Vérification                                          | Statut                         |
| ----------------------------------------------------- | ------------------------------ |
| Lecture AGENTS.md                                     | ✓ Effectuée                    |
| Cartographie arborescence complète                    | ✓ Effectuée                    |
| Lecture schema.prisma + tous les fichiers .prisma     | ✓ Effectuée                    |
| Lecture feature-catalog.ts et types                   | ✓ Effectuée                    |
| Lecture settings/advanced (routes, layout, pages)     | ✓ Effectuée                    |
| Analyse duplications by diff et grep                  | ✓ Effectuée                    |
| Inventaire placeholders AdminComingSoon               | ✓ Effectuée                    |
| Inventaire fichiers temporaires (backups, tmp, trash) | ✓ Effectuée                    |
| Analyse dérive taxonomie doc/Prisma                   | ✓ Effectuée                    |
| pnpm typecheck                                        | ✗ Non effectuée (outil absent) |
| pnpm lint                                             | ✗ Non effectuée                |
| Tests e2e                                             | ✗ Non effectués                |
