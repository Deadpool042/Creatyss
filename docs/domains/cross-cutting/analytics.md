# Analytics

## Rôle

Le domaine `analytics` porte l’analyse métier consolidée du système.

Il définit :

- ce qu’est une lecture analytique du point de vue du système ;
- comment sont structurés les indicateurs, agrégats, snapshots, dimensions et vues analytiques ;
- comment ce domaine se distingue du tracking brut, de l’attribution, de l’observabilité technique, du monitoring et des providers externes ;
- comment le système reste maître de sa vérité interne sur les lectures analytiques consolidées.

Le domaine existe pour fournir une représentation explicite de l’analytique métier, distincte :

- du tracking brut porté par `tracking` ;
- de l’attribution portée par `attribution` ;
- de l’observabilité technique portée par `observability` ;
- du monitoring technique porté par `monitoring` ;
- des DTO providers externes portés par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`oui`

Le domaine `analytics` est activable.
Lorsqu’il est activé, il devient structurant pour le pilotage commercial, marketing, catalogue, événementiel et opérationnel.

---

## Source de vérité

Le domaine `analytics` est la source de vérité pour :

- les vues analytiques consolidées du système ;
- les indicateurs analytiques structurés ;
- les snapshots analytiques lorsqu’ils sont portés ici ;
- les dimensions d’analyse explicites ;
- les périmètres de lecture analytique gouvernés par le système ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `analytics` n’est pas la source de vérité pour :

- les signaux de mesure bruts, qui relèvent de `tracking` ;
- l’attribution marketing, qui relève de `attribution` ;
- l’observabilité technique, qui relève de `observability` ;
- le monitoring, qui relève de `monitoring` ;
- les providers externes analytics, qui relèvent de `integrations` ;
- la vérité métier source des domaines coeur.

Une vue analytique est une lecture consolidée gouvernée.
Elle ne doit pas être confondue avec :

- un event brut ;
- un log technique ;
- un calcul d’attribution ;
- une vérité métier source ;
- un dashboard UI ;
- un export provider externe.

---

## Responsabilités

Le domaine `analytics` est responsable de :

- définir ce qu’est une lecture analytique dans le système ;
- porter les indicateurs métier consolidés ;
- porter les vues analytiques structurées ;
- porter les dimensions analytiques explicites ;
- exposer une lecture gouvernée des tendances, performances et comparaisons métier ;
- publier les événements significatifs liés à la vie d’une vue analytique ;
- protéger le système contre les consolidations implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- analytics commerciales ;
- analytics catalogue ;
- analytics commandes et revenus ;
- analytics marketing consolidées ;
- analytics conversion consolidées ;
- analytics newsletter, social ou événements lorsque les domaines amont sont actifs ;
- snapshots périodiques ;
- vues consolidées par boutique, période, campagne, canal ou produit.

---

## Non-responsabilités

Le domaine `analytics` n’est pas responsable de :

- porter les signaux bruts de mesure ;
- porter l’attribution marketing ;
- porter l’observabilité technique ;
- porter le monitoring technique ;
- exécuter les providers externes analytics ;
- recalculer de manière divergente la vérité métier source ;
- devenir un entrepôt flou regroupant logs, événements, tracking et reporting sans structure.

Le domaine `analytics` ne doit pas devenir :

- un doublon de `tracking` ;
- un doublon de `attribution` ;
- un doublon de `observability` ;
- un doublon de `monitoring` ;
- un conteneur flou de chiffres sans gouvernance métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- une vue analytique s’appuie sur des sources identifiées et explicites ;
- `analytics` ne se confond pas avec `tracking` ;
- `analytics` ne se confond pas avec `attribution` ;
- `analytics` ne se confond pas avec `observability` ou `monitoring` ;
- les agrégats analytiques ne doivent pas redéfinir de manière divergente la vérité métier source ;
- les autres domaines ne doivent pas recréer leur propre vérité divergente des vues analytiques consolidées lorsqu’une lecture analytique commune existe ;
- une vue partielle, dégradée ou incomplète doit pouvoir être explicitée ;
- une consolidation identique sur un même périmètre doit rester déterministe à contexte identique.

Le domaine protège la cohérence de la lecture analytique, pas la vérité primaire des données sources.

---

## Dépendances

### Dépendances métier

Le domaine `analytics` interagit fortement avec :

- `tracking`
- `orders`
- `payments`
- `returns`
- `documents`
- `products`
- `marketing`
- `conversion`
- `newsletter`
- `events`
- `social`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `audit`, pour certaines corrélations sensibles si nécessaire
- `observability`, pour certaines analyses croisées sans absorber sa responsabilité
- `dashboarding`
- `jobs`, si certaines consolidations ou snapshots sont différés

### Dépendances externes

Le domaine peut être relié indirectement à :

- plateformes analytics externes ;
- BI externes ;
- data warehouses externes ;
- providers publicitaires ou marketing externes ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `analytics` porte la lecture analytique consolidée.
Il ne doit pas absorber :

- les signaux bruts ;
- l’attribution ;
- l’observabilité technique ;
- le monitoring ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `analytics` publie ou peut publier des événements significatifs tels que :

- snapshot analytique généré ;
- métrique analytique mise à jour ;
- vue analytique rafraîchie ;
- configuration analytique modifiée ;
- périmètre analytique modifié.

Le domaine peut consommer des signaux liés à :

- commande créée ;
- paiement capturé ;
- retour clôturé ;
- produit publié ;
- campagne marketing activée ;
- campagne newsletter envoyée ;
- événement publié ;
- publication sociale diffusée ;
- événement de tracking créé ;
- capability boutique modifiée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `analytics` possède un cycle de vie partiel au niveau des vues et snapshots qu’il porte.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- généré ;
- rafraîchi ;
- partiel, si pertinent ;
- archivé, si pertinent.

Des états supplémentaires peuvent exister :

- en attente ;
- obsolète ;
- recalculé ;
- restreint.

Le domaine doit éviter :

- les vues analytiques “fantômes” ;
- les chiffres non contextualisés ;
- les changements silencieux de périmètre ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `analytics` expose principalement :

- des indicateurs analytiques consolidés ;
- des vues agrégées par période, produit, campagne, canal ou autre dimension métier utile ;
- des métriques exploitables par `dashboarding`, l’admin boutique, le pilotage plateforme et certains domaines consommateurs ;
- une lecture claire des tendances, performances et comparaisons métier.

Le domaine reçoit principalement :

- des signaux structurés issus de `tracking` ;
- des données durables issues de `orders`, `payments`, `returns`, `documents` ;
- des données catalogue issues de `products` ;
- des objets ou statuts issus de `marketing`, `conversion`, `newsletter`, `events`, `social` ;
- des contextes boutique, temporels, canal ou campagne utiles à la consolidation analytique ;
- des demandes de lecture analytique par période, scope ou dimension.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `analytics` peut être exposé à des contraintes telles que :

- multi-boutiques ;
- périodes glissantes ;
- vues partielles ;
- dépendance à tracking ou à certains domaines activables ;
- snapshots différés ;
- corrections manuelles ;
- projection vers BI externes ;
- rétrocompatibilité des métriques ou dimensions.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité analytique interne reste dans `analytics` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une source absente ou dégradée ne doit pas produire silencieusement une lecture trompeuse ;
- les dimensions, agrégats et scopes doivent être explicitables.

---

## Données sensibles / sécurité

Le domaine `analytics` manipule des données agrégées potentiellement sensibles commercialement.

Points de vigilance :

- contrôle strict des droits de lecture ;
- limitation des vues selon le rôle et le scope ;
- distinction claire entre analytique métier, tracking brut et observabilité technique ;
- protection des consolidations sensibles liées au chiffre d’affaires, aux performances ou aux comportements ;
- audit des changements significatifs de configuration analytique si le modèle final les expose.

---

## Observabilité et audit

Le domaine `analytics` doit rendre visibles au minimum :

- quelles sources ont alimenté une vue analytique ;
- pourquoi un indicateur a évolué ;
- si une vue est partielle à cause d’une capability inactive, d’une source absente ou d’un retard de consolidation ;
- quelles dimensions métier ont été utilisées pour agréger les données ;
- si une lecture est restreinte par scope ou par rôle.

L’audit n’a pas vocation à tracer chaque agrégat produit individuellement.
En revanche, certaines modifications sensibles doivent pouvoir être tracées, notamment :

- les changements significatifs de configuration analytique ;
- certaines régénérations ou corrections manuelles importantes ;
- certaines modifications de périmètre ou d’exposition des vues analytiques.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- source absente ou incompatible ;
- scope non autorisé ;
- agrégation incohérente ;
- vue partielle ;
- capability inactive.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `AnalyticsMetric` : indicateur analytique consolidé ;
- `AnalyticsView` : vue analytique structurée ;
- `AnalyticsDimension` : dimension d’analyse (`temps`, `produit`, `campagne`, `canal`, etc.) ;
- `AnalyticsSnapshot` : snapshot d’un état analytique à un instant donné ;
- `AnalyticsScope` : périmètre de lecture analytique ;
- `AnalyticsPolicy` : règle de consolidation, d’exposition ou de restriction.

---

## Impact de maintenance / exploitation

Le domaine `analytics` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il structure le pilotage métier ;
- ses erreurs dégradent la lecture des performances et les décisions de pilotage ;
- il se situe à la frontière entre plusieurs domaines source ;
- il nécessite une forte explicabilité des chiffres consolidés ;
- il dépend souvent de capacités et sources multiples.

En exploitation, une attention particulière doit être portée à :

- la qualité des sources ;
- la cohérence des agrégats ;
- les vues partielles ;
- la traçabilité des corrections sensibles ;
- la cohérence avec les domaines source ;
- les effets de bord sur dashboarding, marketing, conversion et pilotage boutique.

Le domaine doit être considéré comme structurant dès qu’un pilotage métier consolidé réel existe.

---

## Limites du domaine

Le domaine `analytics` s’arrête :

- avant les signaux de mesure bruts ;
- avant l’attribution ;
- avant l’observabilité technique ;
- avant le monitoring ;
- avant les providers externes ;
- avant les DTO providers externes.

Le domaine `analytics` porte les lectures analytiques consolidées.
Il ne doit pas devenir un entrepôt flou de données, un moteur d’attribution ou un doublon des domaines source.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `analytics` et `tracking` ;
- la frontière exacte entre `analytics` et `attribution` ;
- la part exacte des corrections ou recalculs manuels autorisés ;
- la gouvernance des snapshots ;
- la hiérarchie entre vérité analytique interne et BI externe éventuelle ;
- la place exacte des analytics comportementales avancées.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `tracking.md`
- `attribution.md`
- `observability.md`
- `monitoring.md`
- `dashboarding.md`
- `../core/orders.md`
- `../core/payments.md`
- `../optional/returns.md`
- `../core/documents.md`
- `../core/products.md`
- `marketing.md`
- `conversion.md`
- `newsletter.md`
- `events.md`
- `social.md`
- `../core/stores.md`
- `audit.md`
- `../core/integrations.md`
