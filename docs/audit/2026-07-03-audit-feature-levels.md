# Audit des niveaux fonctionnels gradués (FEATURE_LEVELS) — 2026-07-03

Suite au chantier de généralisation des guards `meetsFeatureLevel` (batches 2/3/4, 2026-07-03), audit complet des 20 features graduées du `FEATURE_CATALOG` : niveaux réellement câblés dans le code, alignement seed ↔ catalogue ↔ DB, cohérence de la convention `defaultLevel`.

Toujours distinguer Observé / Documenté / Déduit / Proposition.

---

## 1. Constat critique initial — corrigé après vérification

Un premier passage d'audit (sous-agent) a signalé `commerce.payments` et `commerce.shipping` comme dépourvus de tout seed `allowedLevels`/`defaultLevel`, ce qui aurait cassé silencieusement `meetsFeatureLevel(...)` pour ces deux features (retour `false` systématique, `resolveEffectiveLevel` renvoyant `null` quand `allowedLevels` est vide).

**Vérification (Observé) :** le seed existe bel et bien, dans `prisma/seed/admin-navigation-access.seed.ts` (`featureFlagDefs`, lignes ~72-83), avec `allowedLevels`/`defaultLevel` corrects pour les deux codes. Le faux positif venait d'un grep sur la chaîne littérale `"commerce.payments"` qui ne trouvait pas la référence symbolique `adminNavigationFeatureFlags.commerce.payments`.

**Root cause réel (Observé) :** la DB locale n'avait simplement pas été re-seedée depuis l'ajout de ces niveaux (batch 2). Vérification en base avant correction :

```
commerce.payments   ACTIVE  isEnabledByDefault=true  allowedLevels=[]  defaultLevel=null
commerce.shipping   ACTIVE  isEnabledByDefault=true  allowedLevels=[]  defaultLevel=null
```

Même constat pour 6 autres features touchées par le batch 2 : `platform.webhooks`, `catalog.products.pricing`, `catalog.products.availability`, `catalog.products.variants`, `catalog.products.related`, `content.blog` — seed correct dans le code, mais DB locale stale.

**Correction appliquée :** `pnpm run db:seed` rejoué localement. Vérification post-seed (les 10 codes) :

```
commerce.payments               ACTIVE  ["read","manual","online"]                          online
commerce.shipping                ACTIVE  ["read","dispatch","delivery"]                       delivery
platform.webhooks                ACTIVE  ["read","manage","retry"]                            retry
catalog.products.pricing         ACTIVE  ["base-price","price-lists","scheduled-pricing"]     scheduled-pricing
catalog.products.availability    ACTIVE  ["sellability","scheduling","preorder"]              preorder
catalog.products.variants        ACTIVE  ["read","manage","options"]                          options
catalog.products.related         ACTIVE  ["storefront","manage"]                              manage
content.blog                     ACTIVE  ["draft","publish"]                                  publish
catalog.products.inventory       ACTIVE  ["manual","alerts","forecasting"]                    manual
catalog.products.media           ACTIVE  ["basic","optimization","generation","automation"]   basic
```

Tous corrects. **Aucun bug de code** — mais le mécanisme révèle un vrai risque opérationnel (§4).

---

## 2. Couverture réelle des niveaux déclarés

Pour chacune des 20 features graduées, niveaux déclarés vs. niveaux réellement testés par au moins un `meetsFeatureLevel(code, niveau)` dans le code applicatif (hors `feature-catalog.ts`/doc, qui ne fait que déclarer) :

| Feature                         | Niveaux déclarés                            | Niveau(x) sans call-site dédié | Nature                                                                  |
| ------------------------------- | ------------------------------------------- | ------------------------------ | ----------------------------------------------------------------------- |
| `commerce.payments`             | read, manual, online                        | aucun                          | —                                                                       |
| `commerce.shipping`             | read, dispatch, delivery                    | aucun                          | —                                                                       |
| `platform.webhooks`             | read, manage, retry                         | aucun                          | —                                                                       |
| `catalog.products.pricing`      | base-price, price-lists, scheduled-pricing  | `base-price`                   | **structurel** (niveau plancher d'une feature toujours active)          |
| `catalog.products.availability` | sellability, scheduling, preorder           | `sellability`                  | **structurel**                                                          |
| `catalog.products.variants`     | read, manage, options                       | `read`                         | **structurel**                                                          |
| `catalog.products.related`      | storefront, manage                          | aucun                          | —                                                                       |
| `content.blog`                  | draft, publish                              | `draft`                        | **structurel**                                                          |
| `catalog.products.inventory`    | manual, alerts, forecasting                 | `manual`                       | **structurel**                                                          |
| `catalog.products.media`        | basic, optimization, generation, automation | `basic`                        | **structurel**                                                          |
| `engagement.newsletter`         | basic, segmentation, automation             | aucun                          | —                                                                       |
| `engagement.analytics`          | read, insights, recommendations             | **`recommendations`**          | **réel** — non implémenté, documenté comme tel dans `levelDescriptions` |
| `engagement.automations`        | basic (unique)                              | —                              | niveau unique, normal                                                   |
| `commerce.discounts`            | simple, rules, automation                   | aucun                          | —                                                                       |
| `commerce.fulfillment`          | manual, partial                             | aucun                          | —                                                                       |
| `commerce.returns`              | manual, partial                             | aucun                          | —                                                                       |
| `commerce.documents`            | basic, fiscal                               | aucun                          | —                                                                       |
| `commerce.taxation`             | store (unique)                              | —                              | niveau unique, normal                                                   |
| `platform.localization`         | managed, multilingual, localized-routing    | aucun                          | —                                                                       |
| `ai.core`                       | basic, assistant, advanced, automation      | aucun                          | —                                                                       |

**Niveaux "structurels" (6 occurrences) :** ce sont les paliers plancher de features `core`/toujours actives (`defaultState: "active"`). L'onglet admin correspondant est toujours visible et le code ne gate explicitement que les paliers d'escalade — le plancher lui-même n'a jamais besoin d'un `meetsFeatureLevel` dédié puisqu'il correspond au comportement de base, non conditionnel. **Ce n'est pas un écart à corriger.**

**Seul niveau réellement fantôme : `engagement.analytics.recommendations`.** Sélectionnable dans le UI admin (`FeatureFlagLevelSelect` rend systématiquement toutes les valeurs d'`allowedLevels`), mais aucun code ne le distingue de `insights` — un opérateur qui le sélectionne ne verra aucun changement, sans autre indice que la description textuelle ("Non implémenté à ce stade").

---

## 3. Convention `defaultLevel` — règle implicite à documenter

Deux groupes de comportement observés, tous deux cohérents une fois la logique comprise :

- **Features graduées a posteriori sur du code déjà actif** (`catalog.products.pricing/availability/variants/related`, `content.blog`, `platform.webhooks`, `commerce.payments/shipping`) → `defaultLevel` = niveau **maximal**. Logique : ces capacités existaient déjà en production avant l'introduction de la gradation ; démarrer à un niveau bas aurait retiré silencieusement des capacités à des boutiques existantes.
- **Features graduées dès leur introduction** (`ai.core`, `engagement.newsletter/analytics/automations`, `commerce.discounts/fulfillment/returns/documents/taxation`, `platform.localization`) → `defaultLevel` = niveau **minimal**. Logique : rollout prudent d'une capacité nouvelle, jamais activée par défaut en production avant ce lot.
- **Cas particulier `catalog.products.inventory`/`catalog.products.media`** : ces deux features sont `core`/actives de longue date, mais leur `defaultLevel` est pourtant le niveau **minimal** (`manual`/`basic`). Vérification : ce niveau minimal correspond exactement au comportement pré-gradation (`manual` = "seuil de stock fixe non configurable", `basic` = "upload manuel sans diagnostic ni génération") — les niveaux `alerts`/`forecasting` et `optimization`/`generation`/`automation` sont des capacités additionnelles introduites _avec_ la gradation, pas retirées par elle. **Cohérent avec la même règle, pas une exception.**

**Règle unifiée (à documenter) :** `defaultLevel` doit toujours correspondre au comportement de production immédiatement antérieur à l'introduction de la gradation pour cette feature — jamais un choix arbitraire.

Cette règle n'est actuellement nulle part écrite dans `feature-governance.md` — elle n'existe que comme pattern observé, appliqué correctement par accumulation de lots successifs mais jamais formalisé. Un futur lot pourrait la violer sans s'en rendre compte.

---

## 4. Risque opérationnel identifié — non documenté avant cet audit

Modifier `allowedLevels`/`defaultLevel` dans un fichier de seed **n'a aucun effet tant que `pnpm run db:seed` n'est pas rejoué sur l'environnement concerné**. Or `scripts/deploy.sh` ne rejoue pas les seeds automatiquement (vérifié : aucune occurrence de `db:seed` ou équivalent dans le script de déploiement).

**Conséquence concrète si les branches `refactor/feature-flags-guard-generic-batch2/3/4` sont déployées sans reseed explicite sur staging/prod :** tout `FeatureFlag` existant dont le niveau vient d'être introduit aura `allowedLevels=[]` en base → `meetsFeatureLevel(...)` renverra `false` pour tous les niveaux, y compris le niveau de base — alors que `queryFeatureFlagActive` (l'ancien mécanisme, qui ignorait `allowedLevels`) renvoyait `true`. Concrètement : la page admin paiements et l'option de paiement carte au checkout (`get-available-payment-methods.query.ts`) disparaîtraient silencieusement en production tant que le reseed n'est pas fait, de même pour shipping, webhooks, et les 4 features catalogue concernées.

C'est le même mécanisme qui a affecté la DB locale (§1), mais avec un impact bien plus grave en production (checkout cassé, pas juste un audit local).

---

## Propositions

**P1 — Documenter dans `feature-governance.md` la règle `defaultLevel`** (§3 ci-dessus) : formaliser "le niveau par défaut préserve le comportement de production antérieur à la gradation" comme règle explicite, avec un exemple de chaque cas. Coût : quelques lignes de doc, aucun risque.

**P2 — Documenter la nécessité de reseed après tout changement de niveaux** dans le runbook de déploiement (`docs/exploitation/`) et/ou dans `feature-governance.md` : ajouter une checklist "tout PR qui modifie `allowedLevels`/`defaultLevel` d'un seed doit être accompagnée d'un reseed sur chaque environnement cible avant merge en production". Priorité **haute** compte tenu du risque §4, à traiter avant tout merge des branches batch 2/3/4 vers `main`.

**P3 — Ajouter un check de cohérence automatisé** (candidat pour `pnpm run db:validate` ou un script dédié) : pour chaque entrée `FEATURE_CATALOG` ayant un tableau `levels`, vérifier que le `FeatureFlag` correspondant en base a un `allowedLevels` non vide et strictement égal (même ensemble, même ordre) à `FEATURE_LEVELS.<clé>`. Détecterait la dérive DB/code observée en §1 avant qu'elle n'atteigne un environnement partagé. Effort modéré (script + intégration CI), valeur élevée — aurait évité de découvrir ce risque a posteriori.

**P4 — Décision produit sur `engagement.analytics.recommendations`** : soit retirer ce niveau de `allowedLevels` tant qu'il n'est pas implémenté (évite le piège UX d'un opérateur qui le sélectionne sans effet visible), soit accepter de le garder comme marqueur roadmap explicite dans le sélecteur (déjà partiellement fait via la description "non implémenté", mais rien n'empêche techniquement la sélection). Pas de code à écrire sans trancher ce point d'abord.

**P5 — Documenter les "niveaux structurels" (§2)** dans `feature-governance.md` : préciser explicitement que le niveau plancher d'une feature `core`/toujours active n'a pas vocation à avoir de call-site `meetsFeatureLevel` dédié, pour éviter qu'un futur audit les signale à tort comme des niveaux fantômes. Coût minimal.

---

## Portée non couverte par cet audit

- Les 4 features non graduées (`platform.notifications`, `platform.integrations`, `satellite.search`, `satellite.channels`) : leurs niveaux proposés dans `feature-governance.md` restent des propositions de cadrage, pas un scope de cet audit (aucun code à vérifier, rien n'est câblé).
- Staging/production : aucune vérification directe effectuée sur ces environnements dans cet audit (accès non disponible depuis cette session) — le risque §4 est déduit du code du script de déploiement, pas observé en conditions réelles. À confirmer avant tout déploiement des branches batch 2/3/4.
