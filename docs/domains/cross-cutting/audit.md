# Audit

## Rôle

Le domaine `audit` porte la traçabilité des actions significatives dans le système.

Il définit :

- quelles actions doivent être tracées ;
- sous quelle forme elles sont enregistrées ;
- comment elles peuvent être consultées ;
- comment elles permettent d’expliquer un état du système ;
- comment elles permettent de répondre à des besoins métier, légaux ou opérationnels.

Le domaine existe pour fournir une mémoire fiable et exploitable des actions, distincte :

- des logs techniques ;
- des métriques ;
- des traces d’exécution ;
- des événements de domaine.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse critique`

### Activable

`non`

Le domaine `audit` est structurellement nécessaire dès lors que :

- le système manipule des données métier importantes ;
- des actions utilisateurs ou systèmes doivent être explicables ;
- des obligations de traçabilité existent.

---

## Source de vérité

Le domaine `audit` est la source de vérité pour :

- l’historique des actions tracées ;
- la représentation des entrées d’audit ;
- la relation entre action, acteur, cible et contexte ;
- les règles de traçabilité interne.

Le domaine `audit` n’est pas la source de vérité pour :

- l’état métier courant ;
- les logs techniques ;
- les métriques ;
- les événements de domaine ;
- les décisions métier elles-mêmes.

L’audit décrit ce qui s’est passé.
Il ne définit pas ce qui est vrai.

---

## Responsabilités

Le domaine `audit` est responsable de :

- définir ce qu’est une entrée d’audit ;
- tracer les actions significatives ;
- associer chaque action à :
  - un acteur ;
  - une cible ;
  - un contexte ;
- garantir la lisibilité des entrées d’audit ;
- garantir la cohérence temporelle ;
- permettre l’exploration et la consultation ;
- supporter les besoins d’explication et d’investigation ;
- rendre possible la corrélation avec d’autres signaux.

Selon le projet, le domaine peut également être responsable de :

- la rétention des données d’audit ;
- la structuration par type d’action ;
- la classification des niveaux de criticité ;
- l’export d’audit ;
- certaines contraintes légales.

---

## Non-responsabilités

Le domaine `audit` n’est pas responsable de :

- stocker des logs techniques détaillés ;
- remplacer les événements de domaine ;
- orchestrer les traitements ;
- implémenter des règles métier ;
- stocker des métriques ou traces ;
- corriger ou compenser des erreurs métier.

Le domaine `audit` ne doit pas devenir :

- un dump de logs ;
- une base technique illisible ;
- un substitut de debugging.

---

## Invariants

Les invariants minimaux sont les suivants :

- une entrée d’audit doit correspondre à une action significative ;
- une entrée d’audit doit être compréhensible sans contexte implicite ;
- une entrée d’audit doit être horodatée ;
- une entrée d’audit doit pouvoir être reliée à un acteur (ou explicitement système) ;
- une entrée d’audit doit pouvoir être reliée à une cible ;
- une entrée d’audit ne doit pas être modifiée après écriture (immutabilité logique) ;
- une entrée d’audit ne doit pas être ambiguë ;
- une action critique ne doit pas rester sans trace.

---

## Dépendances

### Dépendances métier

Le domaine `audit` peut concerner tous les domaines :

- `users`
- `orders`
- `payments`
- `products`
- `stores`
- etc.

### Dépendances transverses

Il dépend fortement de :

- observabilité ;
- domain-events ;
- jobs ;
- sécurité / permissions.

### Dépendances externes

Selon le projet :

- stockage externe ;
- SI légal ;
- outils de reporting ;
- export vers SI tiers.

### Règle de frontière

Le domaine `audit` capture les actions.

Il ne doit pas :

- définir la logique métier ;
- remplacer les événements ;
- se substituer à l’observabilité.

---

## Événements significatifs

Le domaine `audit` ne publie pas forcément des événements métier.

Il enregistre des actions telles que :

- utilisateur créé ;
- commande modifiée ;
- paiement validé ;
- boutique désactivée ;
- rôle attribué ;
- import déclenché ;
- synchronisation externe exécutée.

Il peut consommer :

- des événements de domaine ;
- des actions utilisateur ;
- des actions système.

---

## Cycle de vie

Une entrée d’audit suit généralement un cycle simple :

- créée ;
- consultable ;
- éventuellement archivée ou purgée selon politique.

Le domaine doit éviter :

- les suppressions silencieuses ;
- les modifications rétroactives ;
- les trous dans l’historique.

---

## Interfaces et échanges

Le domaine `audit` expose :

- un mécanisme d’écriture d’entrées ;
- des capacités de lecture ;
- éventuellement des filtres (acteur, type, date, cible).

Il reçoit :

- des actions des domaines métier ;
- des actions système ;
- des événements transformés en audit.

---

## Contraintes d’intégration

Le domaine peut être soumis à :

- volume élevé d’écritures ;
- contraintes de rétention ;
- contraintes légales ;
- anonymisation ;
- export ;
- performance en lecture.

Règles minimales :

- une entrée doit être fiable ;
- une entrée ne doit pas être perdue sans visibilité ;
- les accès doivent être contrôlés ;
- les données sensibles doivent être gérées correctement.

---

## Observabilité et audit

Le domaine `audit` doit être lui-même observable :

- erreurs d’écriture ;
- pertes d’événements ;
- retards ;
- incohérences.

Il doit pouvoir être corrélé avec :

- logs ;
- événements de domaine ;
- traces techniques.

---

## Impact de maintenance / exploitation

Impact élevé car :

- utilisé en support ;
- utilisé en debug ;
- utilisé en audit métier ;
- utilisé potentiellement en contexte légal.

Risques :

- audit incomplet ;
- audit illisible ;
- surcharge inutile ;
- fuite de données sensibles.

---

## Limites du domaine

Le domaine `audit` s’arrête :

- avant les logs techniques ;
- avant les métriques ;
- avant les traces ;
- avant la logique métier ;
- avant la prise de décision.

Il décrit les actions.
Il ne pilote pas le système.

---

## Questions ouvertes

À cadrer explicitement :

- niveau de granularité ;
- stratégie de rétention ;
- anonymisation ;
- exposition aux utilisateurs ;
- liens avec observabilité ;
- liens avec sécurité.

---

## Documents liés

- `../../architecture/40-exploitation/40-observabilite.md`
- `../../architecture/40-exploitation/41-audit-et-tracabilite.md`
- `../../domains/core/domain-events.md`
- `../../domains/cross-cutting/observability.md`
- `../../domains/cross-cutting/jobs.md`
