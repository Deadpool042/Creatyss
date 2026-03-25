# Jobs

## Rôle

Le domaine `jobs` porte les traitements différés, planifiés, rejouables ou exécutés en arrière-plan dans le système.

Il définit :

- ce qu’est un job du point de vue du système ;
- comment un travail différé est représenté ;
- comment il est déclenché, exécuté, repris ou abandonné ;
- comment il se distingue d’un événement de domaine, d’un webhook ou d’une intégration ;
- comment la robustesse d’exécution est garantie.

Le domaine existe pour fournir une représentation structurée des unités de travail asynchrones ou différées, distincte :

- des faits métier (`domain-events`) ;
- des webhooks ;
- des intégrations ;
- de la logique métier coeur ;
- des logs et métriques d’observabilité.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse critique`

### Activable

`non`

Le domaine `jobs` est structurel dès lors que le système exécute des traitements :

- différés ;
- planifiés ;
- rejouables ;
- non bloquants ;
- ou dépendants de mécanismes asynchrones.

---

## Source de vérité

Le domaine `jobs` est la source de vérité pour :

- la représentation des unités de travail différées ;
- leur état d’exécution ;
- leur statut de reprise ;
- leur statut d’échec ;
- leur planification, si elle est portée ici ;
- la traçabilité opérationnelle minimale du traitement différé.

Le domaine `jobs` n’est pas la source de vérité pour :

- la vérité métier d’un domaine coeur ;
- les faits métier eux-mêmes, qui relèvent de `domain-events` ;
- les flux externes entrants, qui peuvent relever de `webhooks` ;
- la politique générale d’intégration, qui relève de `integrations` ;
- les logs, métriques et traces au sens large, qui relèvent d’`observability`.

Un job est une unité de travail.
Il n’est pas, par nature, un fait métier.

---

## Responsabilités

Le domaine `jobs` est responsable de :

- définir ce qu’est un job dans le système ;
- représenter les jobs et leurs états ;
- structurer les traitements différés ;
- encadrer les politiques de reprise ;
- encadrer les politiques de retry ;
- garantir la traçabilité minimale des exécutions ;
- publier les événements significatifs liés à la vie des jobs ;
- protéger le système contre les traitements différés opaques ou incontrôlés ;
- servir de support d’exécution pour des traitements non bloquants.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- jobs planifiés ;
- jobs déclenchés par événements ;
- jobs de synchronisation ;
- jobs de projection ;
- jobs de réparation ;
- jobs de recalcul ;
- jobs opératoires de reprise ;
- files d’attente ou statuts de worker, si le modèle les porte explicitement.

---

## Non-responsabilités

Le domaine `jobs` n’est pas responsable de :

- définir la vérité métier d’un domaine coeur ;
- exprimer un fait métier ;
- remplacer `domain-events` ;
- remplacer les intégrations ;
- remplacer les webhooks ;
- porter l’observabilité globale ;
- porter les décisions métier locales ;
- devenir un fourre-tout de traitements techniques sans propriétaire clair.

Le domaine `jobs` ne doit pas devenir :

- une zone de code où l’on “met ce qui ne sait pas où aller” ;
- un substitut à une transaction métier mal modélisée ;
- un bus implicite sans gouvernance.

---

## Invariants

Les invariants minimaux sont les suivants :

- un job doit avoir une identité traçable ;
- un job doit avoir une finalité explicite ;
- un job doit avoir un état d’exécution interprétable ;
- un job ne doit pas être simultanément dans des états incompatibles ;
- un job rejouable doit être idempotent ou neutralisé ;
- un échec de job doit être visible ;
- une reprise de job doit être traçable ;
- un job critique ne doit pas rester sans stratégie de retry, d’abandon ou de compensation ;
- un job ne doit pas masquer une responsabilité métier mal placée.

Le domaine protège la robustesse du travail différé.

---

## Dépendances

### Dépendances métier

Le domaine `jobs` peut être consommé par la plupart des domaines, notamment :

- `products`
- `pricing`
- `orders`
- `payments`
- `customers`
- `availability`
- `shipping`
- `stores`

### Dépendances transverses

Le domaine dépend fortement de :

- `domain-events`
- `integrations`
- `webhooks`
- `observability`
- `audit`

### Dépendances externes

Le domaine peut interagir avec :

- files externes ;
- workers ;
- schedulers ;
- systèmes de traitement différé ;
- services d’intégration externes.

### Règle de frontière

Le domaine `jobs` exécute du travail différé.
Il ne doit pas absorber :

- la sémantique métier d’un événement ;
- la vérité d’un domaine coeur ;
- la politique d’intégration complète ;
- la logique de transport externe brute.

---

## Événements significatifs

Le domaine `jobs` publie ou peut publier des événements significatifs tels que :

- job créé ;
- job planifié ;
- job démarré ;
- job terminé ;
- job échoué ;
- job abandonné ;
- job rejoué ;
- job retardé ;
- job compensé ;
- file de jobs dégradée.

Le domaine peut consommer des signaux liés à :

- événements de domaine ;
- webhooks normalisés ;
- intégrations ;
- demandes opératoires ;
- planifications ;
- besoins de recalcul ou réparation.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `jobs` possède un cycle de vie structurel explicite.

Le cycle exact dépend du modèle retenu, mais il doit au minimum distinguer :

- créé ;
- planifié, si pertinent ;
- prêt à exécuter ;
- en cours ;
- réussi ;
- échoué ;
- abandonné ;
- rejoué, si pertinent ;
- archivé, si pertinent.

Le domaine doit éviter :

- les jobs sans état lisible ;
- les échecs silencieux ;
- les retries implicites non traçables.

---

## Interfaces et échanges

Le domaine `jobs` expose principalement :

- des commandes de création ou de planification de job ;
- des lectures d’état de job ;
- des événements significatifs liés à l’exécution ;
- des points de reprise ou de relance si le modèle les porte.

Le domaine reçoit principalement :

- des événements de domaine ;
- des demandes de traitement différé ;
- des actions opératoires ;
- des signaux de retry ;
- des horloges ou planifications.

Le domaine ne doit pas exposer un contrat couplé à une technologie de queue ou de worker spécifique si ce n’est pas explicitement assumé.

---

## Contraintes d’intégration

Le domaine `jobs` peut être exposé à des contraintes telles que :

- duplication ;
- retry ;
- ordre de traitement non garanti ;
- saturation ;
- jobs bloqués ;
- retard d’exécution ;
- traitement partiel ;
- échecs intermittents ;
- dépendances externes indisponibles ;
- besoin de compensation.

Règles minimales :

- tout job critique doit avoir une stratégie d’erreur explicite ;
- tout traitement rejouable doit être idempotent ou neutralisé ;
- tout échec doit être visible ;
- la politique de retry doit être bornée ;
- la reprise doit être traçable ;
- un job ne doit pas corrompre la vérité métier par répétition non maîtrisée ;
- la distinction entre job, événement et intégration doit rester claire.

---

## Observabilité et audit

Le domaine `jobs` doit rendre visibles au minimum :

- les jobs créés ;
- les jobs en attente ;
- les jobs en retard ;
- les jobs en erreur ;
- les retries ;
- les abandons ;
- les reprises opératoires ;
- les événements significatifs publiés ;
- les files ou workers dégradés si le modèle les porte.

L’audit doit permettre de répondre à des questions comme :

- quel job a été lancé ;
- quand ;
- à la suite de quel déclencheur ;
- avec quel résultat ;
- avec quel retry ;
- avec quelle action opératoire ;
- avec quel impact visible sur un flux métier.

L’observabilité doit distinguer :

- erreur de logique de job ;
- erreur technique d’exécution ;
- saturation ;
- duplication ;
- retry ;
- compensation ;
- abandon.

---

## Impact de maintenance / exploitation

Le domaine `jobs` a un impact d’exploitation très élevé.

Raisons :

- il porte une part importante de la robustesse asynchrone ;
- il relie potentiellement plusieurs domaines ;
- il est exposé aux échecs partiels et répétitions ;
- ses erreurs peuvent rester invisibles si mal instrumenté ;
- il conditionne la fiabilité des traitements différés.

En exploitation, une attention particulière doit être portée à :

- la lisibilité des états ;
- les jobs bloqués ;
- les retries excessifs ;
- les files dégradées ;
- les abandons ;
- les reprises manuelles ;
- les compensations ;
- les écarts entre job exécuté et impact métier attendu.

Le domaine doit être considéré comme critique pour la robustesse opérationnelle du système.

---

## Limites du domaine

Le domaine `jobs` s’arrête :

- avant la vérité métier d’un domaine coeur ;
- avant le fait métier publié (`domain-events`) ;
- avant la politique d’intégration globale ;
- avant les webhooks comme mécanisme d’entrée ;
- avant l’observabilité générale du système ;
- avant la logique métier locale d’un domaine consommateur.

Le domaine `jobs` porte le travail différé.
Il ne doit pas absorber toute l’asynchronie ni toute la complexité du système.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `jobs` et `domain-events` ;
- la frontière exacte entre `jobs` et `integrations` ;
- la frontière exacte entre `jobs` et `webhooks` ;
- la politique canonique de retry ;
- la politique d’abandon ;
- la stratégie de compensation ;
- la hiérarchie entre jobs internes et infrastructures externes ;
- la liste des jobs réellement structurants du système.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/30-execution/30-evenements-de-domaine-et-flux-asynchrones.md`
- `../../architecture/30-execution/31-jobs-et-traitements-en-arriere-plan.md`
- `../../architecture/30-execution/33-modele-de-defaillance-et-idempotence.md`
- `../../domains/core/domain-events.md`
- `../../domains/core/integrations.md`
- `../../domains/core/webhooks.md`
- `observability.md`
- `audit.md`
