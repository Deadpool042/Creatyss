# Gouvernance des fonctionnalités

> Référence produit canonique de la modularité Creatyss : modules, capabilities,
> niveaux gradués, mutabilité, maintenance et pilotage depuis Réglages avancés.
> Ce document est exploitable par un agent de code comme contrat doctrinal.
>
> Le mécanisme technique d'activation (flag, état runtime, scope, override) est
> décrit dans `feature-flags.md`. Ce document décrit la **doctrine produit** ;
> `feature-flags.md` décrit le **mécanisme**.

---

## Centre de gravité

Deux notions distinctes ne doivent jamais être confondues :

- **Feature flag** : mécanisme technique d'activation, de désactivation ou de
  variation d'un comportement. C'est un outil runtime, pas une doctrine.
- **Feature governance** : doctrine produit qui décrit comment les
  fonctionnalités sont organisées (modules, capabilities), graduées (niveaux),
  pilotées (mutabilité, maintenance) et protégées (guards).

La gouvernance est le centre. Le flag est l'un de ses mécanismes d'exécution.
Un flag sans gouvernance est une dette : tout toggle doit avoir un propriétaire,
une intention, un état et un cycle de vie.

---

## Vocabulaire canonique

Ces définitions priment sur tout usage ambigu ailleurs dans le repo.

| Terme                 | Définition                                                                                                                                                                                          |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Module**            | Zone fonctionnelle cohérente et visible (ex. produits, paiements, newsletter). Unité de navigation et d'organisation. Un module reste visible même si certaines de ses capabilities sont inactives. |
| **Feature**           | Comportement nommé et gouvernable, indépendamment de sa granularité (un module ou une capability est une feature).                                                                                  |
| **Capability**        | Capacité fine à l'intérieur d'un module (ex. médias produit, inventaire). Unité de pilotage précise et de garde serveur. Booléenne ou graduée.                                                      |
| **Feature flag**      | Mécanisme runtime d'activation / désactivation / variation. Porté par `FeatureFlag` (DB). Voir `feature-flags.md`.                                                                                  |
| **Feature state**     | État effectif résolu d'une feature pour un contexte donné : `status` (et `level` si gradué).                                                                                                        |
| **Feature level**     | Niveau d'une feature graduée, quand le mécanisme de gradation s'applique. Optionnel : toutes les features ne sont pas graduées.                                                                     |
| **Feature scope**     | Périmètre d'application : `GLOBAL`, `STORE`, `USER`.                                                                                                                                                |
| **Feature guard**     | Point de contrôle serveur qui consomme un feature state pour autoriser ou masquer un comportement.                                                                                                  |
| **Maintenance state** | État de pilotage signalant qu'une feature est en maintenance, expérimentale ou dépréciée, sans être simplement active ou inactive.                                                                  |

---

## Typologie produit

`experimental` et `maintenance` sont des **états de pilotage** appliqués
transversalement, pas nécessairement des catégories métier. La classification
documentaire canonique du repo (`AGENTS.md`) reste `core / optional /
cross-cutting / satellites`.

| Famille             | Définition                               | Exemples                            | Mutabilité admin         | Niveau possible | Impact nav/UI                 | Impact guards      |
| ------------------- | ---------------------------------------- | ----------------------------------- | ------------------------ | --------------- | ----------------------------- | ------------------ |
| core                | Domaine fondamental indispensable        | catalogue, commandes, auth          | Non désactivable         | Rare            | Toujours visible              | Toujours appliqués |
| cross-cutting       | Préoccupation transverse non optionnelle | feature-flags, audit, observability | Non désactivable         | Non             | Implicite                     | Toujours actifs    |
| optional            | Capacité activable par boutique          | newsletter, analytics, IA           | Activable / désactivable | Oui si gradué   | Visible si actif              | Bloque si inactif  |
| satellite           | Système périphérique ou intégration      | discounts, sales-policy             | Activable selon usage    | Possible        | Visible si actif              | Bloque si inactif  |
| experimental (état) | En cours de validation, accès restreint  | —                                   | Masqué / réservé interne | Possible        | Masqué hors contexte autorisé | Stricts            |
| maintenance (état)  | Temporairement gelée ou dégradée         | —                                   | Visible, non modifiable  | Gelé            | Visible avec mention          | Mutations bloquées |

---

## Modularité

Principes :

- un **module** est une zone cohérente et visible ;
- un module **contient des capabilities** ;
- une capability est **booléenne** (active/inactive) ou **graduée** (niveau) ;
- un module reste **visible même si ses capabilities sont inactives** : on
  explique l'état, on ne masque pas brutalement.

Exemples avec clés réelles du repo :

| Niveau            | Clé réelle                   | Nature                               |
| ----------------- | ---------------------------- | ------------------------------------ |
| Module produit    | `catalog.products`           | module                               |
| Capability        | `catalog.products.media`     | capability booléenne                 |
| Capability        | `catalog.products.inventory` | capability (graduable, voir niveaux) |
| Module commerce   | `commerce.payments`          | module optionnel                     |
| Module engagement | `engagement.newsletter`      | module optionnel                     |
| Module IA         | `ai.core`                    | module optionnel                     |

> Écart à connaître : la navigation analytics utilise le flag
> `engagement.analytics`, mais la capability de lecture associée est
> `admin.insights.analytics.read`. Flag de module et capability de lecture sont
> deux choses distinctes ; ne pas les confondre.

---

## Niveaux fonctionnels gradués

Mécanisme **générique** et **optionnel** : une feature graduée expose un
`level` en plus de son `status`. Le mécanisme est le même pour toutes les
features ; seul l'ensemble des niveaux varie. L'IA n'est qu'un exemple parmi
d'autres.

Paliers stabilisés dans `FEATURE_LEVELS`
(`features/admin/feature-governance/catalog/feature-catalog.ts`) :

| Feature                         | Paliers                                            |
| ------------------------------- | -------------------------------------------------- |
| `ai.core`                       | basic → assistant → advanced → automation          |
| `engagement.analytics`          | read → insights → recommendations                  |
| `engagement.newsletter`         | basic → segmentation → automation                  |
| `catalog.products.media`        | basic → optimization → generation → automation     |
| `commerce.discounts`            | simple → rules → automation                        |
| `catalog.products.inventory`    | manual → alerts → forecasting                      |
| `platform.localization`         | managed → multilingual → localized-routing         |
| `commerce.fulfillment`          | manual → partial                                   |
| `commerce.returns`              | manual → partial                                   |
| `commerce.documents`            | basic → fiscal                                     |
| `commerce.taxation`             | store (niveau unique — cible produit non tranchée) |
| `engagement.automations`        | basic (niveau unique — extensible)                 |
| `commerce.payments`             | read → manual → online                             |
| `platform.webhooks`             | read → manage → retry                              |
| `commerce.shipping`             | read → dispatch → delivery                         |
| `catalog.products.pricing`      | base-price → price-lists → scheduled-pricing       |
| `catalog.products.availability` | sellability → scheduling → preorder                |
| `content.blog`                  | draft → publish                                    |
| `catalog.products.related`      | storefront → manage                                |
| `catalog.products.variants`     | read → manage → options                            |

La doctrine retenue n'est pas la liste des niveaux mais le **mécanisme** : une
feature graduée déclare ses niveaux autorisés ; l'admin sélectionne un niveau
parmi ceux autorisés ; le guard bloque les fonctions au-delà du niveau actif.

### Règle `defaultLevel`

Le `defaultLevel` seedé pour une feature graduée doit toujours correspondre au
comportement de production **immédiatement antérieur** à l'introduction de la
gradation pour cette feature — jamais un choix arbitraire. Deux cas observés,
tous deux conformes à cette règle :

- **Feature graduée a posteriori sur du code déjà actif** (ex. `commerce.payments`,
  `commerce.shipping`, `platform.webhooks`, `catalog.products.pricing` /
  `availability` / `variants` / `related`, `content.blog`) → `defaultLevel` =
  niveau **maximal**. La capacité complète existait déjà avant la gradation ;
  démarrer plus bas retirerait silencieusement des capacités à des boutiques
  existantes.
- **Feature graduée dès son introduction** (ex. `ai.core`, `engagement.newsletter`
  / `analytics` / `automations`, `commerce.discounts` / `fulfillment` /
  `returns` / `documents` / `taxation`, `platform.localization`) →
  `defaultLevel` = niveau **minimal**. Rollout prudent d'une capacité jamais
  activée par défaut avant ce lot.
- **Cas apparemment exceptionnel mais conforme** : `catalog.products.inventory`
  et `catalog.products.media` sont `core`/actives de longue date, mais leur
  `defaultLevel` est le niveau minimal (`manual`/`basic`). Ce n'est pas une
  exception : ce niveau minimal correspond exactement au comportement
  pré-gradation (seuil de stock fixe non configurable / upload manuel sans
  diagnostic) — les niveaux supérieurs sont des capacités additionnelles
  introduites avec la gradation, pas retirées par elle.

Toute PR qui ajoute une gradation à une feature existante doit vérifier
laquelle des deux situations s'applique avant de choisir `defaultLevel`.

### Niveaux planchers structurels

Pour une feature `core`/toujours active (`defaultState: "active"`), le niveau
le plus bas déclaré n'a pas vocation à avoir de call-site `meetsFeatureLevel`
dédié : l'onglet ou la page admin correspondante est toujours visible, seuls
les paliers d'escalade au-dessus du plancher sont gatés explicitement. C'est
le cas de `base-price` (pricing), `sellability` (availability), `read`
(variants), `manual` (inventory), `basic` (media), `draft` (blog) — un audit
futur ne doit pas les signaler comme des « niveaux fantômes » : ce sont des
planchers structurels, pas des capacités manquantes. Le seul niveau
réellement non câblé à ce jour est documenté explicitement ci-dessus quand il
existe.

---

## État vs niveau

Deux axes orthogonaux décrivent une feature :

- **`status`** : `active` / `inactive` / `archived` / `maintenance` /
  `experimental` ;
- **`level`** : niveau effectif, uniquement pour les features graduées.

| Feature                         | Décrite par                  |
| ------------------------------- | ---------------------------- |
| `commerce.payments`             | `status` + `level`           |
| `commerce.shipping`             | `status` + `level`           |
| `catalog.products.pricing`      | `status` + `level`           |
| `catalog.products.availability` | `status` + `level`           |
| `content.blog`                  | `status` + `level`           |
| `catalog.products.inventory`    | `status` + `level` si gradué |
| `catalog.products.variants`     | `status` + `level`           |
| `ai.core`                       | `status` + `level`           |
| `engagement.newsletter`         | `status` + `level`           |
| `engagement.analytics`          | `status` + `level`           |
| `engagement.automations`        | `status` + `level`           |
| `commerce.discounts`            | `status` + `level`           |
| `commerce.fulfillment`          | `status` + `level`           |
| `commerce.returns`              | `status` + `level`           |
| `commerce.documents`            | `status` + `level`           |
| `commerce.taxation`             | `status` + `level`           |

### Propositions sans gradation runtime observée

Les features suivantes restent atomiques dans le code actuel. Les niveaux
ci-dessous sont des propositions de cadrage, pas des niveaux runtime actifs.

| Feature                       | État observé                        | Proposition de paliers si le code évolue                          |
| ----------------------------- | ----------------------------------- | ----------------------------------------------------------------- |
| `platform.notifications`      | lecture admin du référentiel        | read → preferences → emit                                         |
| `platform.integrations`       | lecture admin du référentiel        | read → credentials → sync                                         |
| `satellite.search`            | lecture admin de `SearchDocument`   | read → index → storefront                                         |
| `satellite.channels`          | lecture admin canaux/statuts        | read → eligibility → publish                                      |
| `catalog.products.seo`        | core, actif, non désactivable       | metadata → social-preview → ai-assist                             |
| `catalog.products.categories` | core, actif, non désactivable       | flat → hierarchy → merchandising                                  |
| `content.homepage`            | module éditorial core/cross-cutting | edit → merchandising → localized si une gradation devient utile   |
| `content.seo`                 | réglage transversal                 | metadata → social → structured-data                               |
| `settings.advanced`           | pilotage système core               | garder atomique ; la gradation doit porter sur les flags pilotés  |
| `maintenance.observability`   | lecture système                     | health → jobs → alerts                                            |
| `maintenance.logs`            | lecture journaux                    | read → filter → export                                            |
| `insights.analyticsRead`      | capability de lecture dépendante    | garder atomique tant que `engagement.analytics` porte les niveaux |

Ne pas mélanger le header Prisma `/// Level: L4` (maturité documentaire du
modèle) avec un `level` fonctionnel runtime (intensité de la feature activée).

---

## Mutabilité admin par famille

| Famille         | Mutabilité admin                                   |
| --------------- | -------------------------------------------------- |
| core            | Jamais désactivable ; toggle absent ou verrouillé. |
| cross-cutting   | Non désactivable via l'admin.                      |
| optional        | Activable / désactivable.                          |
| satellite       | Activable selon usage.                             |
| experimental    | Masqué ; pilotage réservé interne.                 |
| maintenance     | Visible mais non modifiable tant que l'état dure.  |
| feature graduée | Niveau sélectionnable parmi les niveaux autorisés. |

---

## Maintenance et cycle de vie

Une feature traverse des états : active, inactive, archivée, en maintenance,
expérimentale, dépréciée.

Objectifs :

- ne pas supprimer brutalement une fonctionnalité ;
- expliquer son état dans l'admin plutôt que de la faire disparaître ;
- bloquer les mutations dangereuses quand l'état l'exige ;
- garder une trace d'exploitation des transitions.

Un toggle non gouverné est une dette : chaque feature doit avoir un
propriétaire, une intention, un état et un cycle de vie lisibles.

---

## Source de vérité (doctrine cible)

| Couche                                               | Rôle                                                                                                                             |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| FeatureCatalog                                       | Catalogue stable, typé : modules, features, capabilities, labels, famille, mutabilité, niveaux autorisés, règles de maintenance. |
| FeatureState (`FeatureFlag` + `FeatureFlagOverride`) | État effectif : `status`, défaut / override, `level`.                                                                            |
| Settings advanced                                    | Surface de lecture et de pilotage.                                                                                               |
| Guards                                               | Application serveur du feature state.                                                                                            |

État actuel : `FeatureState` existe (flags + overrides). Le `FeatureCatalog`, le
pilotage par niveau et le resolver commun constituent l'écart à combler par
migration progressive.

---

## Réglages avancés

Depuis Réglages avancés, l'admin doit pouvoir :

- voir les modules, capabilities, famille, statut, niveau, mutabilité et
  impacts ;
- modifier uniquement ce qui est autorisé par la famille et la mutabilité ;
- comprendre pourquoi le core n'est pas désactivable.

L'écran ne décide pas de la doctrine : il rend lisible et pilotable ce que le
catalogue et les règles de mutabilité autorisent.

---

## Guards

Règle forte : **masquer un menu ne suffit pas.**

- une action serveur sensible vérifie la capability **côté serveur**,
  indépendamment de la visibilité UI ;
- un module inactif n'expose aucune mutation dangereuse ;
- un niveau insuffisant bloque la fonction correspondante.

La visibilité de navigation n'est jamais une autorisation.

---

## Migration progressive (roadmap)

| Lot | Objet                                                         |
| --- | ------------------------------------------------------------- |
| F1  | FeatureCatalog read-only (catalogue stable)                   |
| F2  | Mapping catalogue + états DB                                  |
| F3  | UI Réglages avancés enrichie                                  |
| F4  | Règles de mutabilité par famille                              |
| F5  | Resolver de feature state commun (serveur)                    |
| F6  | Seeds alignés sur le catalogue                                |
| F7  | Niveaux gradués génériques                                    |
| F8  | Application progressive (produits, engagement, analytics, IA) |

---

## Documents liés

- `feature-flags.md`
- `../../architecture/20-structure/22-capacites-optionnelles.md`
- `../../architecture/40-exploitation/41-modele-d-exploitation.md`
- `../optional/ai-assistance.md`
- `../../architecture/10-fondations/11-modele-de-classification.md`
