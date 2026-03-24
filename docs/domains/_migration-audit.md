# Audit de migration de docs/domains

## Objectif

Ce document recense les écarts entre `docs/domains/**` et la doctrine canonique définie dans `docs/architecture/`.

Il sert de registre de décision pour :

- la refonte des fiches domaine ;
- la correction des classifications ;
- la suppression des contradictions ;
- la priorisation des travaux.

Il ne remplace pas les documents d’architecture.
Il sert à piloter la migration de `docs/domains/**` vers la nouvelle doctrine.

---

## Référentiel de vérité

La doctrine canonique est désormais portée par :

- `docs/architecture/README.md`
- `docs/architecture/00-introduction/01-glossaire.md`
- `docs/architecture/10-fondations/10-principes-d-architecture.md`
- `docs/architecture/10-fondations/11-modele-de-classification.md`
- `docs/architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `docs/architecture/20-structure/*`
- `docs/architecture/30-execution/*`
- `docs/architecture/40-exploitation/*`
- `docs/architecture/90-reference/*`

En cas de conflit :

- `docs/architecture/` fait autorité sur la doctrine ;
- `docs/domains/` fait autorité sur le détail local d’un domaine, à doctrine constante.

---

## Constats structurants

### 1. La taxonomie documentaire réelle contient quatre catégories

Le repo contient actuellement :

- `core/`
- `cross-cutting/`
- `optional/`
- `satellites/`

La gouvernance documentaire de `docs/domains/` doit donc reconnaître explicitement ces quatre catégories.

👉 Décision :

- `satellites` devient une catégorie documentaire officielle de `docs/domains/`.

---

### 2. Une partie du corpus reste alignée sur l’ancienne doctrine

Certaines fiches, et en particulier les plus anciennes, utilisent encore une grammaire centrée sur :

- modularité implicite ;
- capabilities toggleables ;
- providers ;
- niveaux et variations de socle ;
- logique ancienne de lecture de `docs/architecture/`.

👉 Décision :
toutes les fiches doivent désormais être réalignées sur les axes suivants :

- rôle ;
- classification ;
- source de vérité ;
- responsabilités ;
- non-responsabilités ;
- invariants ;
- frontières ;
- contraintes d’exécution ;
- impact d’exploitation.

---

### 3. Le corpus mélange coeur métier et coeur structurel

Des fiches comme :

- `core/auth.md`
- `core/integrations.md`
- `core/webhooks.md`

ne relèvent pas d’un coeur métier commercial classique, mais elles sont traitées dans le repo comme des blocs structurants non négociables du socle.

👉 Décision à trancher en phase 3 :

- soit le projet assume explicitement l’existence d’un **coeur structurel** ;
- soit ces fiches sont reclassées comme **transverses non optionnelles**.

Cette décision doit être doctrinale, pas opportuniste.

---

### 4. Le dossier `cross-cutting/` mélange plusieurs familles

On y trouve au moins quatre sous-ensembles :

- des transverses critiques du système ;
- des mécanismes d’exécution ou d’exploitation ;
- des domaines métier transverses ;
- des blocs marketing / analytics / pilotage.

👉 Décision :

- clarifier les familles ;
- éviter les fusions abusives ;
- garder séparés les vrais domaines métier transverses des mécanismes techniques transverses.

---

### 5. Le dossier `satellites/` n’est pas encore doctrinalement stabilisé

Plusieurs fiches rangées dans `satellites/` semblent plausiblement relever :

- d’un satellite réel ;
- d’une capacité optionnelle ;
- d’un coeur secondaire ;
- d’une modélisation à fusionner ailleurs.

👉 Décision :

- auditer `satellites/` après stabilisation du noyau documentaire ;
- ne pas reclasser à l’aveugle avant lecture détaillée.

---

## Méthode d’évaluation

Chaque fiche domaine doit être évaluée selon les critères suivants :

- classification réelle ;
- clarté du rôle ;
- source de vérité explicite ;
- responsabilités explicites ;
- non-responsabilités explicites ;
- invariants explicites ;
- dépendances et frontières explicites ;
- événements significatifs ;
- cycle de vie ou justification de son absence ;
- contraintes d’exécution ;
- impact de maintenance / exploitation ;
- compatibilité avec `docs/architecture/`.

---

## Légende des décisions

### garder

Le document est globalement cohérent et ne nécessite que des ajustements limités.

### refondre

Le document est utile mais doit être restructuré ou réécrit pour s’aligner sur la nouvelle doctrine.

### reclasser

Le document porte une responsabilité utile mais se trouve dans une catégorie documentaire inadéquate.

### fusionner

Le document recouvre fortement une autre responsabilité documentaire ou fait doublon.

### supprimer

Le document ne porte pas de responsabilité claire, est devenu obsolète, ou ne mérite pas migration.

---

## Légende des priorités

### P1

Structurant pour la cohérence de la doctrine ou du modèle central.

### P2

Important mais non bloquant pour stabiliser le noyau documentaire.

### P3

Utile, mais peut être traité après stabilisation des zones structurantes.

---

## Tableau de migration — Gouvernance documentaire

| Fichier                     | Classification réelle    | Décision | Priorité | Notes                                                                               |
| --------------------------- | ------------------------ | -------- | -------- | ----------------------------------------------------------------------------------- |
| `docs/domains/README.md`    | gouvernance documentaire | refondre | P1       | doit intégrer `satellites` et pointer uniquement vers la nouvelle architecture      |
| `docs/domains/_template.md` | référence documentaire   | refondre | P1       | doit intégrer `satellites` et rester strictement aligné avec le nouveau référentiel |

---

## Tableau de migration — P1 structurants

| Fichier                                       | Classification réelle                                      | Décision                | Priorité | Notes                                                                  |
| --------------------------------------------- | ---------------------------------------------------------- | ----------------------- | -------- | ---------------------------------------------------------------------- |
| `docs/domains/core/products.md`               | coeur                                                      | refondre                | P1       | bon contenu, à réaligner sur le nouveau template                       |
| `docs/domains/core/orders.md`                 | coeur                                                      | refondre                | P1       | même logique que `products`                                            |
| `docs/domains/core/pricing.md`                | coeur probable                                             | refondre                | P1       | frontière critique avec discounts, taxation, checkout                  |
| `docs/domains/core/payments.md`               | coeur probable                                             | refondre                | P1       | distinguer domaine paiement et fournisseurs de paiement                |
| `docs/domains/core/cart.md`                   | coeur probable                                             | refondre                | P1       | structurant pour le parcours commerce                                  |
| `docs/domains/core/checkout.md`               | coeur probable                                             | refondre                | P1       | vérifier s’il s’agit d’un domaine ou d’une orchestration structurée    |
| `docs/domains/core/customers.md`              | coeur probable                                             | refondre                | P1       | forte tension avec `users`                                             |
| `docs/domains/core/auth.md`                   | coeur structurel ou transverse non optionnel               | à trancher              | P1       | décision doctrinale requise                                            |
| `docs/domains/core/users.md`                  | coeur secondaire ou transverse non optionnel               | à trancher              | P1       | frontière à clarifier avec `customers`, `auth`, `roles`, `permissions` |
| `docs/domains/core/domain-events.md`          | transverse non optionnel                                   | reclasser ou refondre   | P1       | à distinguer impérativement de `cross-cutting/events.md`               |
| `docs/domains/core/integrations.md`           | coeur structurel ou transverse non optionnel               | à trancher              | P1       | ne pas reclasser sans arbitrage doctrinal                              |
| `docs/domains/core/webhooks.md`               | coeur structurel ou transverse non optionnel               | à trancher              | P1       | même remarque que `integrations`                                       |
| `docs/domains/cross-cutting/audit.md`         | transverse non optionnel                                   | refondre                | P1       | responsabilité claire, structure trop légère                           |
| `docs/domains/cross-cutting/observability.md` | transverse non optionnel                                   | refondre                | P1       | contenu utile, encore formulé dans l’ancienne grammaire                |
| `docs/domains/cross-cutting/jobs.md`          | transverse non optionnel                                   | refondre                | P1       | à réaligner avec `docs/architecture/30-execution/*`                    |
| `docs/domains/cross-cutting/events.md`        | domaine métier transverse                                  | garder / refondre léger | P1       | ne pas confondre avec le backbone d’événements internes                |
| `docs/domains/cross-cutting/monitoring.md`    | transverse non optionnel ou sous-partie de l’observabilité | fusionner probable      | P1       | forte suspicion de recouvrement avec `observability.md`                |

---

## Ambiguïtés majeures identifiées

### Auth / Users / Customers

Le triptyque :

- `auth`
- `users`
- `customers`

est potentiellement contradictoire si les frontières ne sont pas parfaitement explicites.

Questions à trancher :

- `auth` porte-t-il uniquement l’identité et l’authentification ?
- `users` porte-t-il les comptes internes / accès / opérateurs ?
- `customers` porte-t-il l’entité métier client indépendante de l’authentification ?

Tant que cette séparation n’est pas stabilisée, une partie du coeur restera ambiguë.

---

### Events vs Domain Events

Le repo contient deux responsabilités différentes :

- `cross-cutting/events.md` : domaine métier d’événements publics ;
- `core/domain-events.md` : mécanique d’événements internes du système.

👉 Décision :

- maintenir la séparation ;
- éviter toute fusion sémantique ou documentaire ;
- clarifier les noms, rôles et frontières.

---

### Integrations / Webhooks / API clients

Le trio :

- `integrations`
- `webhooks`
- `api-clients`

signale probablement une frontière encore imparfaitement stabilisée entre :

- politique générale d’intégration ;
- points d’entrée/sortie techniques ;
- clients d’API externes.

👉 Décision :

- auditer ces trois fiches ensemble ;
- vérifier si `api-clients.md` mérite une existence propre ;
- éviter que plusieurs documents portent la même responsabilité sous des angles différents.

---

### Pricing / Discounts / Taxation

Cette zone est structurellement critique.

Questions à trancher :

- qui porte la vérité du prix ?
- qui porte la logique de remise ?
- qui porte la logique fiscale ?
- qui orchestre le montant final ?

👉 Cette zone doit être traitée comme un cluster de cohérence, pas comme des fiches isolées.

---

### Availability / Inventory / Shipping / Fulfillment

Cette zone semble exposée à des recouvrements probables entre :

- disponibilité vendable ;
- stock réel ;
- expédition ;
- exécution logistique.

👉 Décision :

- auditer cette zone comme un ensemble ;
- éviter les frontières artificielles.

---

## Backlog P2 — coeur et zones adjacentes

| Fichier                             | Classification réelle                          | Décision probable | Priorité | Notes                                   |
| ----------------------------------- | ---------------------------------------------- | ----------------- | -------- | --------------------------------------- |
| `docs/domains/core/taxation.md`     | coeur probable                                 | refondre          | P2       | zone couplée à `pricing`                |
| `docs/domains/core/shipping.md`     | coeur probable                                 | refondre          | P2       | frontière avec `fulfillment` à préciser |
| `docs/domains/core/availability.md` | coeur secondaire ou satellite                  | à trancher        | P2       | tension probable avec `inventory`       |
| `docs/domains/core/stores.md`       | coeur secondaire ou structure de canal interne | refondre          | P2       | à clarifier selon le multi-store réel   |
| `docs/domains/core/documents.md`    | coeur secondaire ou transverse                 | à trancher        | P2       | rôle à préciser                         |
| `docs/domains/core/permissions.md`  | transverse non optionnel                       | à trancher        | P2       | à auditer avec `roles` et `auth`        |
| `docs/domains/core/roles.md`        | transverse non optionnel                       | à trancher        | P2       | même cluster que `permissions`          |
| `docs/domains/core/api-clients.md`  | satellite ou mécanisme d’intégration           | à trancher        | P2       | existence autonome à justifier          |

---

## Backlog P2 — cross-cutting

| Fichier                                         | Classification réelle                 | Décision probable | Priorité | Notes                                                 |
| ----------------------------------------------- | ------------------------------------- | ----------------- | -------- | ----------------------------------------------------- |
| `docs/domains/cross-cutting/analytics.md`       | transverse optionnel                  | refondre          | P2       | probable cluster avec tracking                        |
| `docs/domains/cross-cutting/consent.md`         | transverse non optionnel              | refondre          | P2       | criticité juridique et exploitation                   |
| `docs/domains/cross-cutting/crm.md`             | satellite ou transverse optionnel     | à trancher        | P2       | frontière avec systèmes externes                      |
| `docs/domains/cross-cutting/email.md`           | satellite ou transverse optionnel     | à trancher        | P2       | frontière avec notifications                          |
| `docs/domains/cross-cutting/feature-flags.md`   | transverse non optionnel              | refondre          | P2       | gouvernance système                                   |
| `docs/domains/cross-cutting/fraud-risk.md`      | transverse optionnel                  | refondre          | P2       | fort impact métier mais pas forcément coeur           |
| `docs/domains/cross-cutting/import.md`          | transverse optionnel                  | refondre          | P2       | à relier aux intégrations                             |
| `docs/domains/cross-cutting/legal.md`           | transverse non optionnel              | refondre          | P2       | à relier à consent, audit                             |
| `docs/domains/cross-cutting/localization.md`    | transverse optionnel ou non optionnel | à trancher        | P2       | dépend du périmètre produit                           |
| `docs/domains/cross-cutting/notifications.md`   | transverse optionnel ou non optionnel | à trancher        | P2       | frontière avec email                                  |
| `docs/domains/cross-cutting/search.md`          | optionnelle ou transverse optionnelle | à trancher        | P2       | probablement capacité produit plus que transverse pur |
| `docs/domains/cross-cutting/seo.md`             | transverse optionnelle                | refondre          | P2       | forte dépendance au référentiel contenu / produit     |
| `docs/domains/cross-cutting/template-system.md` | transverse optionnelle                | refondre          | P2       | rôle exact à préciser                                 |
| `docs/domains/cross-cutting/workflow.md`        | transverse optionnelle                | refondre          | P2       | risque de doc trop générique                          |

---

## Backlog P3 — cross-cutting à faible priorité doctrinale

| Fichier                                      | Classification réelle  | Décision probable  | Priorité | Notes                                       |
| -------------------------------------------- | ---------------------- | ------------------ | -------- | ------------------------------------------- |
| `docs/domains/cross-cutting/approval.md`     | transverse optionnelle | refondre           | P3       | rôle métier à préciser                      |
| `docs/domains/cross-cutting/attribution.md`  | transverse optionnelle | fusionner probable | P3       | cluster analytics/marketing                 |
| `docs/domains/cross-cutting/behavior.md`     | transverse optionnelle | fusionner probable | P3       | cluster analytics/marketing                 |
| `docs/domains/cross-cutting/conversion.md`   | transverse optionnelle | fusionner probable | P3       | cluster analytics/marketing                 |
| `docs/domains/cross-cutting/dashboarding.md` | transverse optionnelle | refondre           | P3       | souvent projection plus que domaine         |
| `docs/domains/cross-cutting/export.md`       | transverse optionnelle | refondre           | P3       | peut rester autonome                        |
| `docs/domains/cross-cutting/marketing.md`    | transverse optionnelle | refondre           | P3       | risque de doc trop large                    |
| `docs/domains/cross-cutting/newsletter.md`   | optionnelle probable   | reclasser probable | P3       | probablement plus proche de l’offre produit |
| `docs/domains/cross-cutting/scheduling.md`   | transverse optionnelle | refondre           | P3       | rôle exact à stabiliser                     |
| `docs/domains/cross-cutting/social.md`       | optionnelle probable   | reclasser probable | P3       | plus capacité que transverse                |
| `docs/domains/cross-cutting/support.md`      | transverse optionnelle | refondre           | P3       | à stabiliser                                |
| `docs/domains/cross-cutting/tracking.md`     | transverse optionnelle | fusionner probable | P3       | cluster analytics/marketing                 |

---

## Backlog P2/P3 — optional

| Fichier                                       | Classification réelle           | Décision probable       | Priorité | Notes                                     |
| --------------------------------------------- | ------------------------------- | ----------------------- | -------- | ----------------------------------------- |
| `docs/domains/optional/ai-assistance.md`      | optionnelle                     | garder / refondre léger | P3       | faible urgence doctrinale                 |
| `docs/domains/optional/blog.md`               | optionnelle                     | garder / refondre léger | P3       | faible urgence doctrinale                 |
| `docs/domains/optional/gift-cards.md`         | optionnelle                     | refondre                | P2       | impact commerce réel                      |
| `docs/domains/optional/homepage-editorial.md` | optionnelle                     | garder / refondre léger | P3       | contenu / CMS                             |
| `docs/domains/optional/loyalty.md`            | optionnelle                     | refondre                | P2       | impact métier réel                        |
| `docs/domains/optional/marketplace.md`        | optionnelle structurante        | refondre                | P2       | frontières critiques                      |
| `docs/domains/optional/pages.md`              | optionnelle                     | refondre                | P2       | rôle contenu à préciser                   |
| `docs/domains/optional/recommendations.md`    | optionnelle                     | garder / refondre léger | P3       | dépendance à products/search/behavior     |
| `docs/domains/optional/returns.md`            | optionnelle ou coeur secondaire | à trancher              | P2       | peut devenir structurant selon le produit |
| `docs/domains/optional/reviews.md`            | optionnelle                     | garder / refondre léger | P3       | faible urgence doctrinale                 |
| `docs/domains/optional/subscriptions.md`      | optionnelle structurante        | refondre                | P2       | fort impact de modèle                     |
| `docs/domains/optional/wishlist.md`           | optionnelle                     | garder / refondre léger | P3       | faible urgence doctrinale                 |

---

## Backlog P2/P3 — satellites

| Fichier                                       | Classification réelle         | Décision probable  | Priorité | Notes                                             |
| --------------------------------------------- | ----------------------------- | ------------------ | -------- | ------------------------------------------------- |
| `docs/domains/satellites/bundles.md`          | satellite ou optionnelle      | à trancher         | P2       | pourrait relever d’une capacité produit           |
| `docs/domains/satellites/catalog-modeling.md` | satellite ou doc à fusionner  | à trancher         | P2       | frontière critique avec `products`                |
| `docs/domains/satellites/categories.md`       | satellite ou coeur secondaire | à trancher         | P2       | rôle exact à stabiliser                           |
| `docs/domains/satellites/channels.md`         | satellite                     | refondre           | P2       | rôle de projection / publication probable         |
| `docs/domains/satellites/discounts.md`        | satellite ou optionnelle      | à trancher         | P2       | forte dépendance à `pricing`                      |
| `docs/domains/satellites/fulfillment.md`      | satellite ou coeur secondaire | à trancher         | P2       | frontière avec `shipping`                         |
| `docs/domains/satellites/gifting.md`          | optionnelle probable          | reclasser probable | P3       | probablement pas un satellite réel                |
| `docs/domains/satellites/inventory.md`        | satellite ou coeur secondaire | à trancher         | P2       | frontière avec `availability`                     |
| `docs/domains/satellites/media.md`            | satellite                     | refondre           | P2       | rôle attendu assez clair                          |
| `docs/domains/satellites/sales-policy.md`     | satellite ou doc à fusionner  | à trancher         | P2       | frontière critique avec pricing/shipping/taxation |

---

## Lots de refonte recommandés

### Lot 1 — gouvernance documentaire

À traiter d’abord :

- `docs/domains/README.md`
- `docs/domains/_template.md`

Objectif :

- intégrer `satellites` ;
- aligner définitivement la racine de `docs/domains/` sur `docs/architecture/`.

---

### Lot 2 — coeur métier principal

À traiter ensuite :

- `products`
- `orders`
- `pricing`
- `cart`
- `checkout`

Objectif :

- stabiliser le référentiel catalogue / parcours commerce / valeur monétaire.

---

### Lot 3 — coeur structurel ou transverse critique

À traiter après arbitrage doctrinal :

- `auth`
- `users`
- `permissions`
- `roles`
- `integrations`
- `webhooks`
- `domain-events`

Objectif :

- trancher la frontière entre coeur structurel et transverse critique.

---

### Lot 4 — transverse critique

À traiter après le lot 3 :

- `audit`
- `observability`
- `jobs`
- `monitoring`

Objectif :

- produire un socle d’exploitation et de robustesse cohérent.

---

### Lot 5 — zones frontière

À traiter ensuite par cluster :

- `availability`
- `inventory`
- `shipping`
- `fulfillment`

et :

- `pricing`
- `discounts`
- `taxation`
- `sales-policy`

Objectif :

- éviter les recouvrements cachés entre domaines voisins.

---

### Lot 6 — optional et satellites

À traiter après stabilisation du noyau :

- `optional/*`
- `satellites/*`
- cluster marketing / analytics / tracking

Objectif :

- finaliser l’extension du modèle sans contaminer le noyau.

---

## Règle de migration

Chaque fiche refondue doit :

- partir du template courant de `docs/domains/_template.md` ;
- expliciter sa classification ;
- expliciter sa source de vérité ;
- expliciter ses responsabilités ;
- expliciter ses non-responsabilités ;
- expliciter ses invariants ;
- expliciter ses frontières ;
- expliciter ses contraintes d’exécution et d’exploitation.

Une fiche riche mais floue doit être refondue.
Une fiche courte mais claire peut être conservée si elle est doctrinalement juste.

---

## Critère de sortie de la phase 2

La phase 2 est terminée lorsque :

- chaque fichier a une décision claire ;
- chaque ambiguïté majeure est identifiée ;
- les lots de refonte sont ordonnés ;
- la priorisation P1/P2/P3 est stabilisée ;
- le plan de migration est exploitable sans improvisation.

---

## Note finale

L’objectif n’est pas d’écrire plus de documentation.

L’objectif est de produire un corpus :

- plus cohérent ;
- plus défendable ;
- moins ambigu ;
- plus directement exploitable pour le design, le code, les tests et l’exploitation.
