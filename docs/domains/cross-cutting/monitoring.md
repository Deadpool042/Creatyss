# Monitoring

## Rôle

Le domaine `monitoring` porte la surveillance active du système en exploitation.

Il définit :

- quels signaux doivent être surveillés ;
- quels seuils ou conditions constituent une anomalie ;
- quelles alertes doivent être déclenchées ;
- comment l’état de santé du système est évalué ;
- comment l’exploitation détecte rapidement une dégradation, un incident ou une dérive.

Le domaine existe pour fournir une capacité de supervision active, distincte :

- de l’observabilité au sens large ;
- de l’audit ;
- des événements de domaine ;
- des données métier ;
- des décisions métier.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse critique`

### Activable

`non`

Le domaine `monitoring` est structurel dès lors que le système doit être exploité sérieusement en production.

---

## Source de vérité

Le domaine `monitoring` est la source de vérité pour :

- les règles de surveillance active ;
- les états de santé exposés pour l’exploitation ;
- les alertes et conditions d’alerte ;
- les signaux synthétiques de supervision ;
- les politiques de détection d’anomalies au niveau exploitation.

Le domaine `monitoring` n’est pas la source de vérité pour :

- les logs techniques complets, qui relèvent d’`observability` ;
- l’historique métier, qui relève d’`audit` ;
- les événements métier, qui relèvent de `domain-events` ;
- la vérité métier des domaines coeur ;
- les décisions d’intervention humaine.

Le monitoring surveille le système.
Il ne définit pas ce qui est vrai d’un point de vue métier.

---

## Responsabilités

Le domaine `monitoring` est responsable de :

- définir les signaux critiques à surveiller ;
- exprimer les états de santé pertinents ;
- détecter les dégradations et incidents ;
- déclencher ou exposer des alertes ;
- structurer les règles de supervision ;
- rendre visible l’état global ou partiel du système pour l’exploitation ;
- distinguer les situations normales, dégradées et critiques ;
- fournir une base claire à l’intervention opératoire.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- health checks ;
- readiness / liveness ;
- alerting ;
- dashboards de supervision ;
- seuils de saturation ;
- supervision de jobs, intégrations, webhooks, paiements, files ou workers ;
- supervision métier minimale si elle est explicitement assumée.

---

## Non-responsabilités

Le domaine `monitoring` n’est pas responsable de :

- stocker l’ensemble des logs ;
- remplacer l’observabilité ;
- remplacer l’audit ;
- exprimer les faits métier ;
- corriger les incidents ;
- implémenter la logique métier ;
- porter les décisions d’exploitation ;
- gouverner les webhooks, jobs ou intégrations eux-mêmes.

Le domaine `monitoring` ne doit pas devenir :

- un simple tableau de bord décoratif ;
- une copie d’`observability` ;
- un conteneur de métriques sans action claire.

---

## Invariants

Les invariants minimaux sont les suivants :

- un signal surveillé doit avoir une raison d’être explicite ;
- une alerte doit correspondre à une condition interprétable ;
- un état de santé doit être lisible et non ambigu ;
- une situation critique ne doit pas rester silencieuse sans justification explicite ;
- un monitoring actif ne doit pas produire un bruit ingérable sans hiérarchisation ;
- un signal surveillé doit pouvoir être rattaché à un périmètre clair ;
- une dégradation visible doit être corrélable avec des données d’observabilité quand nécessaire.

Le domaine doit protéger la capacité de détection, pas accumuler des signaux sans gouvernance.

---

## Dépendances

### Dépendances métier

Indirectes sur les domaines critiques surveillés, notamment :

- `orders`
- `payments`
- `availability`
- `shipping`
- `stores`

### Dépendances transverses

Le domaine dépend fortement de :

- `observability`
- `jobs`
- `integrations`
- `webhooks`
- `audit`, pour certaines corrélations opératoires
- sécurité, si certains signaux critiques la concernent

### Dépendances externes

Le domaine peut dépendre de :

- systèmes d’alerting ;
- dashboards ;
- outils APM ;
- systèmes de santé infra ;
- services de notification d’incident.

### Règle de frontière

Le domaine `monitoring` surveille.
Il ne doit pas absorber :

- la collecte brute d’observabilité ;
- la logique métier ;
- la traçabilité d’audit ;
- ni l’orchestration des traitements.

---

## Événements significatifs

Le domaine `monitoring` publie ou peut publier des signaux significatifs tels que :

- service dégradé ;
- service indisponible ;
- file saturée ;
- job en échec critique ;
- latence anormale détectée ;
- taux d’erreur critique détecté ;
- intégration dégradée ;
- webhook en anomalie ;
- état de santé rétabli ;
- alerte déclenchée ;
- alerte résolue.

Le domaine peut consommer des signaux issus de :

- logs structurés ;
- métriques ;
- traces ;
- états de jobs ;
- états d’intégration ;
- health checks ;
- événements opératoires.

Les noms exacts doivent rester lisibles pour l’exploitation.

---

## Cycle de vie

Le domaine `monitoring` possède un cycle de vie partiel au niveau des alertes ou états surveillés.

Le cycle exact dépend du modèle retenu, mais il doit au minimum distinguer :

- normal ;
- dégradé ;
- critique ;
- résolu ;
- éventuellement supprimé ou archivé pour une alerte historique.

Le domaine doit éviter :

- les alertes éternellement ouvertes sans statut ;
- les changements silencieux d’état ;
- les signaux sans résolution lisible.

---

## Interfaces et échanges

Le domaine `monitoring` expose principalement :

- des états de santé ;
- des alertes ;
- des règles de supervision ;
- des vues synthétiques pour l’exploitation ;
- éventuellement des endpoints de santé ou statuts de dépendances.

Le domaine reçoit principalement :

- des métriques ;
- des logs structurés ;
- des traces agrégées ;
- des états de jobs ;
- des états d’intégration ;
- des signaux d’infrastructure ou de runtime.

Le domaine ne doit pas exposer comme vérité unique une simple collection d’outils externes sans modèle interne lisible.

---

## Contraintes d’intégration

Le domaine `monitoring` peut être exposé à des contraintes telles que :

- bruit excessif ;
- faux positifs ;
- faux négatifs ;
- dérive des seuils ;
- surcharge des dashboards ;
- latence de détection ;
- dépendance à des outils externes ;
- indisponibilité partielle des données de supervision.

Règles minimales :

- toute alerte doit être justifiable ;
- les seuils doivent être gouvernés ;
- les alertes doivent être hiérarchisées ;
- la détection critique doit rester fiable ;
- une indisponibilité de monitoring doit être elle-même visible si possible ;
- la supervision ne doit pas masquer les causes profondes derrière des signaux vagues.

---

## Observabilité et audit

Relation avec `observability` :

- `observability` fournit la matière première de compréhension ;
- `monitoring` en dérive une surveillance active.

Relation avec `audit` :

- `audit` répond à “qui a fait quoi” ;
- `monitoring` répond à “est-ce que le système va bien ou dérive”.

Les trois domaines ne doivent pas être confondus.

---

## Impact de maintenance / exploitation

Le domaine `monitoring` a un impact d’exploitation critique.

Raisons :

- il conditionne la rapidité de détection des incidents ;
- il structure la surveillance des flux critiques ;
- il réduit ou augmente fortement le temps de diagnostic selon sa qualité ;
- ses erreurs peuvent laisser un incident invisible ou créer une fatigue d’alerte.

En exploitation, une attention particulière doit être portée à :

- la qualité des alertes ;
- la hiérarchisation ;
- le bruit ;
- la couverture réelle des flux critiques ;
- la lisibilité des dashboards ;
- les dépendances externes de supervision ;
- les angles morts.

Le domaine doit être considéré comme critique pour la supervision active du système.

---

## Limites du domaine

Le domaine `monitoring` s’arrête :

- avant la collecte brute complète d’observabilité ;
- avant l’audit ;
- avant les faits métier ;
- avant la logique métier ;
- avant la correction automatique généralisée ;
- avant la décision humaine d’exploitation.

Le domaine `monitoring` surveille activement le système.
Il ne doit pas absorber toute la compréhension technique ni toute la gouvernance opérationnelle.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `monitoring` et `observability` ;
- les signaux réellement critiques à superviser ;
- la stratégie d’alerting ;
- les seuils et leur gouvernance ;
- la place des dashboards ;
- la supervision des jobs, intégrations et webhooks ;
- la stratégie anti-bruit ;
- la gestion des incidents récurrents.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/40-exploitation/41-modele-d-exploitation.md`
- `../../architecture/40-exploitation/42-observabilite-et-audit.md`
- `observability.md`
- `audit.md`
- `jobs.md`
- `../../domains/core/integrations.md`
- `../../domains/core/webhooks.md`
