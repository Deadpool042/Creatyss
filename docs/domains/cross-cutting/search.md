# Recherche

## Rôle

Le domaine `search` porte les capacités de recherche et d’exploration du contenu dans le système.

Il définit :

- comment les utilisateurs ou systèmes interrogent les données ;
- quels objets sont indexés et recherchables ;
- comment les résultats sont structurés et retournés ;
- comment la recherche se distingue de la lecture métier classique ;
- comment elle s’articule avec les systèmes d’indexation et de ranking.

Le domaine existe pour fournir une capacité de recherche performante et exploitable, distincte :

- des lectures métier directes ;
- des repositories ;
- des projections UI ;
- des outils techniques sous-jacents (Elasticsearch, Meilisearch, etc.).

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse optionnelle`

### Activable

`oui`

Le domaine `search` est optionnel, mais devient structurant dès lors que :

- le catalogue est non trivial ;
- la navigation repose sur la recherche ;
- ou des cas d’usage avancés (filtres, scoring, suggestions) sont présents.

---

## Source de vérité

Le domaine `search` n’est PAS une source de vérité métier.

Il est une projection dérivée.

Il est responsable de :

- la représentation indexée des données ;
- les structures de recherche optimisées ;
- les index ;
- les documents de recherche.

Le domaine `search` ne doit jamais être considéré comme la vérité métier.

La vérité reste dans :

- `products`
- `pricing`
- `availability`
- etc.

---

## Responsabilités

Le domaine `search` est responsable de :

- définir ce qui est indexé ;
- structurer les documents de recherche ;
- gérer les index ;
- permettre la recherche (full-text, filtres, facettes) ;
- structurer les résultats ;
- gérer la pertinence (ranking, scoring) ;
- exposer des interfaces de recherche ;
- maintenir la cohérence entre données source et index.

Selon le projet, il peut aussi gérer :

- suggestions ;
- auto-complétion ;
- synonymes ;
- boosting ;
- recherche multi-index ;
- recherche multi-langue.

---

## Non-responsabilités

Le domaine `search` n’est pas responsable de :

- la vérité métier ;
- la validation métier ;
- les règles de pricing ;
- les règles de disponibilité ;
- la gestion du catalogue ;
- l’authentification ou permissions ;
- la logique UI.

Le domaine ne doit pas devenir :

- une source de vérité ;
- un hack pour contourner des modèles métier ;
- une couche métier cachée.

---

## Invariants

Les invariants sont :

- l’index est dérivé de la vérité métier ;
- un document indexé doit être reconstruisible ;
- un résultat de recherche ne doit pas être traité comme vérité sans validation ;
- la désynchronisation doit être tolérée mais visible ;
- la structure d’index doit rester cohérente ;
- un index corrompu doit être reconstruisible.

---

## Dépendances

### Dépendances métier

Fortes dépendances sur :

- `products`
- `categories`
- `inventory`
- `pricing`
- `availability`

### Dépendances transverses

- `jobs` (indexation async)
- `domain-events` (déclencheurs)
- `observability`
- `audit` (optionnel)

### Dépendances externes

- moteurs de recherche (Meilisearch, Elasticsearch…)
- indexeurs

---

## Événements significatifs

Le domaine publie ou consomme :

- document indexé ;
- index mis à jour ;
- index reconstruit ;
- index désynchronisé ;
- indexation échouée ;
- recherche exécutée (optionnel).

---

## Cycle de vie

Les entités de search ont un cycle :

- non indexé ;
- indexé ;
- mis à jour ;
- désynchronisé ;
- reconstruit.

---

## Interfaces et échanges

Expose :

- endpoints de recherche ;
- filtres ;
- facettes ;
- suggestions.

Consomme :

- événements métier ;
- jobs d’indexation.

---

## Contraintes d’intégration

Contraintes majeures :

- latence faible ;
- volume élevé ;
- indexation async ;
- cohérence éventuelle (eventual consistency) ;
- dépendance à moteur externe.

Règles :

- index = projection, jamais vérité ;
- indexation idempotente ;
- reconstruction possible ;
- désynchronisation acceptable mais contrôlée.

---

## Observabilité et audit

Doit exposer :

- latence recherche ;
- taux d’erreur ;
- indexation en échec ;
- backlog d’indexation ;
- divergence index / source.

---

## Impact de maintenance / exploitation

Impact élevé :

- UX critique ;
- performance critique ;
- dépendance externe forte ;
- complexité de debug.

Risques :

- index corrompu ;
- désynchronisation ;
- résultats incohérents ;
- latence.

---

## Limites du domaine

Le domaine `search` s’arrête :

- avant le métier ;
- avant la vérité ;
- avant la logique UI.

Il sert à trouver, pas à décider.

---

## Questions ouvertes

- moteur choisi ?
- stratégie d’indexation ?
- rebuild full vs incremental ?
- tolérance à la désynchronisation ?
- multi-langue ?
- multi-canal ?

---

## Documents liés

- `../../domains/core/products.md`
- `../../domains/satellites/categories.md`
- `../../domains/optional/commerce/inventory.md`
- `jobs.md`
- `domain-events.md`
- `observability.md`
