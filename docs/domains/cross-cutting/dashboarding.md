# Dashboarding

## Rôle

Le domaine `dashboarding` porte les vues de pilotage et tableaux de bord du système.

Il définit :

- ce qu’est un dashboard du point de vue du système ;
- comment sont structurés les tableaux de bord, widgets, synthèses, regroupements d’indicateurs et vues d’alerte ;
- comment ce domaine se distingue de l’analytics consolidée, de l’observabilité technique, du monitoring et des domaines source eux-mêmes ;
- comment le système reste maître de sa vérité interne sur les vues de pilotage exposées.

Le domaine existe pour fournir une représentation explicite du pilotage, distincte :

- de l’analytics consolidée portée par `analytics` ;
- de l’observabilité technique portée par `observability` ;
- du monitoring technique porté par `monitoring` ;
- des domaines source métier ;
- des DTO providers externes portés par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`non`

Le domaine `dashboarding` est structurel dès lors qu’une exposition gouvernée de vues de pilotage existe dans le système.

---

## Source de vérité

Le domaine `dashboarding` est la source de vérité pour :

- les définitions internes de dashboards ;
- leurs widgets ou blocs de synthèse ;
- leurs audiences et périmètres d’exposition ;
- leurs regroupements contextualisés de métriques, états et alertes ;
- leurs lectures structurées consommables par les couches d’administration autorisées.

Le domaine `dashboarding` n’est pas la source de vérité pour :

- l’analytics consolidée, qui relève de `analytics` ;
- l’observabilité technique, qui relève de `observability` ;
- le monitoring technique, qui relève de `monitoring` ;
- les métriques source, qui relèvent de leurs domaines d’origine ;
- les DTO providers externes.

Un dashboard est une vue de pilotage gouvernée.
Il ne doit pas être confondu avec :

- une métrique source ;
- une vue analytique brute ;
- un log technique ;
- un écran UI isolé ;
- un cockpit externe ;
- une vérité métier primaire.

---

## Responsabilités

Le domaine `dashboarding` est responsable de :

- définir ce qu’est un dashboard dans le système ;
- porter les tableaux de bord structurés ;
- porter les widgets, cartes, synthèses et blocs de pilotage réutilisables ;
- porter les audiences, scopes et expositions de dashboards ;
- exposer une lecture gouvernée, lisible et actionnable des métriques, états et alertes utiles ;
- publier les événements significatifs liés à la vie d’une vue de pilotage ;
- protéger le système contre les dashboards implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- dashboards boutique ;
- dashboards plateforme ;
- widgets commandes ;
- widgets paiements ;
- widgets campagnes ;
- widgets événements ;
- widgets intégrations ou jobs ;
- règles locales d’exposition ;
- blocs de synthèse multi-sources.

---

## Non-responsabilités

Le domaine `dashboarding` n’est pas responsable de :

- porter l’analytics consolidée ;
- porter l’observabilité technique ;
- porter le monitoring technique ;
- recalculer localement des métriques source de manière divergente ;
- exécuter les intégrations provider-specific ;
- devenir un domaine purement UI sans responsabilité métier explicite ;
- devenir un entrepôt flou regroupant toutes les données sans structure de pilotage claire.

Le domaine `dashboarding` ne doit pas devenir :

- un doublon de `analytics` ;
- un doublon de `observability` ;
- un doublon de `monitoring` ;
- un conteneur flou de widgets sans gouvernance d’exposition.

---

## Invariants

Les invariants minimaux sont les suivants :

- un dashboard s’appuie sur des sources identifiées et explicites ;
- `dashboarding` ne se confond pas avec `analytics` ;
- `dashboarding` ne se confond pas avec `observability` ou `monitoring` ;
- un dashboard plateforme et un dashboard boutique restent distincts par audience, contenu et permissions ;
- les vues de pilotage ne doivent pas redéfinir de manière divergente la vérité des domaines source ;
- les autres couches UI ne doivent pas recréer librement des dashboards divergents quand une lecture commune de pilotage existe ;
- une vue partielle, masquée ou restreinte doit pouvoir être expliquée ;
- un widget sensible ne doit pas être exposé hors règle explicite de rôle, scope et audience.

Le domaine protège la cohérence des vues de pilotage, pas la vérité primaire des données affichées.

---

## Dépendances

### Dépendances métier

Le domaine `dashboarding` interagit fortement avec :

- `analytics`
- `orders`
- `payments`
- `returns`
- `documents`
- `marketing`
- `conversion`
- `newsletter`
- `events`
- `social`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `observability`
- `monitoring`
- `jobs`
- `integrations`
- `roles`
- `permissions`
- `audit`

### Dépendances externes

Le domaine peut être relié indirectement à :

- BI externes ;
- cockpits externes ;
- outils d’administration tiers ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `dashboarding` porte l’exposition de pilotage.
Il ne doit pas absorber :

- l’analytics consolidée ;
- l’observabilité technique ;
- le monitoring ;
- les domaines source ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `dashboarding` publie ou peut publier des événements significatifs tels que :

- vue de dashboard générée ;
- widget de dashboard mis à jour ;
- alerte de dashboard exposée ;
- configuration de dashboard modifiée ;
- périmètre de dashboard modifié.

Le domaine peut consommer des signaux liés à :

- vue analytique rafraîchie ;
- commande créée ;
- paiement capturé ;
- retour clôturé ;
- campagne newsletter envoyée ;
- événement publié ;
- publication sociale diffusée ;
- statut d’intégration modifié ;
- statut de job modifié ;
- capability boutique modifiée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `dashboarding` possède un cycle de vie partiel au niveau des vues et configurations qu’il porte.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- actif ;
- partiel, si pertinent ;
- masqué, si pertinent ;
- archivé, si pertinent.

Des états supplémentaires peuvent exister :

- en préparation ;
- restreint ;
- obsolète ;
- désactivé.

Le domaine doit éviter :

- les dashboards “fantômes” ;
- les changements silencieux d’exposition ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `dashboarding` expose principalement :

- des dashboards structurés ;
- des widgets de synthèse ;
- des vues lisibles de pilotage ;
- des regroupements contextualisés de métriques, états et alertes ;
- une exposition cohérente consommable par les interfaces admin plateforme et boutique.

Le domaine reçoit principalement :

- des indicateurs consolidés issus de `analytics` ;
- des états métier issus de `orders`, `payments`, `returns`, `events`, `newsletter`, `social` ou d’autres domaines source ;
- des états techniques ou de supervision issus de `observability`, `monitoring`, `jobs`, `integrations` selon le dashboard concerné ;
- des contextes de rôle, scope et boutique ;
- des demandes de lecture de tableau de bord ou de widget.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `dashboarding` peut être exposé à des contraintes telles que :

- dashboards multi-audiences ;
- séparation plateforme / boutique ;
- widgets conditionnels selon capabilities ;
- vues partielles ;
- dépendance à sources multiples ;
- exposition restreinte par rôle ;
- projection vers outils externes ;
- rétrocompatibilité des widgets ou périmètres.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des vues de pilotage reste dans `dashboarding` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une source absente ou dégradée ne doit pas produire silencieusement une vue trompeuse ;
- les conflits entre audience, scope, capability et source doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `dashboarding` expose potentiellement des données commerciales, relationnelles ou techniques sensibles.

Points de vigilance :

- contrôle strict des droits de lecture ;
- limitation des widgets et vues selon le rôle et le scope ;
- séparation stricte entre dashboard boutique et dashboard plateforme ;
- absence de fuite d’informations techniques sensibles vers l’espace boutique ;
- cohérence entre capabilities actives et exposition des vues.

---

## Observabilité et audit

Le domaine `dashboarding` doit rendre visibles au minimum :

- quelles sources ont alimenté un dashboard ou un widget ;
- pourquoi un bloc est visible ou masqué ;
- si une vue est partielle à cause d’une capability inactive, d’une permission absente ou d’une source non disponible ;
- quelle version de synthèse ou quel périmètre a été retenu pour l’exposition ;
- si une vue est restreinte par audience, rôle ou scope.

L’audit n’a pas vocation à tracer chaque rafraîchissement d’interface.
En revanche, certaines modifications sensibles doivent pouvoir être tracées, notamment :

- les changements de configuration d’exposition de dashboards ;
- les changements de périmètre d’un widget sensible ;
- certaines interventions manuelles importantes sur les vues de pilotage.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- source absente ;
- widget incompatible ;
- capability inactive ;
- permission insuffisante ;
- exposition interdite.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `DashboardView` : tableau de bord structuré ;
- `DashboardWidget` : widget ou bloc de synthèse ;
- `DashboardScope` : périmètre d’exposition du dashboard ;
- `DashboardAudience` : audience ou rôle cible d’un dashboard ;
- `DashboardAlertView` : vue de synthèse d’une alerte ou d’un signal important ;
- `DashboardPolicy` : règle d’exposition, de composition ou de restriction.

---

## Impact de maintenance / exploitation

Le domaine `dashboarding` a un impact d’exploitation moyen à élevé.

Raisons :

- il structure le pilotage visible par les acteurs ;
- ses erreurs dégradent lisibilité, décisions et actions opératoires ;
- il se situe à la frontière entre plusieurs domaines source ;
- il nécessite une forte explicabilité des expositions et restrictions ;
- il peut dépendre de nombreuses capabilities et de multiples sources.

En exploitation, une attention particulière doit être portée à :

- la cohérence des sources ;
- la séparation boutique / plateforme ;
- la traçabilité des changements d’exposition ;
- la cohérence avec analytics, observability et monitoring ;
- les effets de bord sur le pilotage admin ;
- les widgets partiels ou trompeurs.

Le domaine doit être considéré comme structurant dès qu’un pilotage gouverné réel existe.

---

## Limites du domaine

Le domaine `dashboarding` s’arrête :

- avant l’analytics consolidée ;
- avant l’observabilité ;
- avant le monitoring ;
- avant les providers externes ;
- avant les DTO providers externes ;
- avant la vérité primaire des domaines source.

Le domaine `dashboarding` porte les vues de pilotage du système.
Il ne doit pas devenir un entrepôt de données, un moteur d’analytics ou un simple assemblage UI sans gouvernance métier.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `dashboarding` et `analytics` ;
- la frontière exacte entre `dashboarding` et `observability` ;
- la part exacte des widgets techniques réellement exposés côté plateforme ;
- la gouvernance des dashboards personnalisables ;
- la hiérarchie entre vérité interne et cockpits externes éventuels ;
- la place exacte des vues multi-boutiques.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `analytics.md`
- `observability.md`
- `monitoring.md`
- `../core/commerce/orders.md`
- `../optional/commerce/payments.md`
- `../optional/returns.md`
- `../satellites/documents.md`
- `marketing.md`
- `conversion.md`
- `newsletter.md`
- `events.md`
- `social.md`
- `jobs.md`
- `../optional/platform/integrations.md`
- `../core/foundation/stores.md`
- `roles.md`
- `permissions.md`
- `audit.md`
