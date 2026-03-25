# Observabilité

## Rôle

Le domaine `observability` porte la capacité du système à être compris, diagnostiqué et surveillé en fonctionnement.

Il définit :

- comment le système expose son comportement interne ;
- comment détecter des anomalies ;
- comment diagnostiquer des incidents ;
- comment comprendre les performances ;
- comment corréler les signaux techniques et métier.

Le domaine existe pour fournir une visibilité opérationnelle du système, distincte :

- de l’audit métier ;
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

Le domaine `observability` est structurel dès lors que le système :

- exécute des traitements non triviaux ;
- interagit avec des systèmes externes ;
- doit être exploité en production.

---

## Source de vérité

Le domaine `observability` est la source de vérité pour :

- les logs techniques ;
- les métriques ;
- les traces d’exécution ;
- les signaux de santé du système.

Le domaine `observability` n’est pas la source de vérité pour :

- les actions métier (audit) ;
- les faits métier (domain-events) ;
- les états métier ;
- les décisions métier.

L’observabilité décrit comment le système fonctionne.
Elle ne décrit pas la vérité métier.

---

## Responsabilités

Le domaine `observability` est responsable de :

- capturer les logs techniques ;
- exposer les métriques clés ;
- tracer les flux d’exécution ;
- permettre la corrélation entre composants ;
- détecter les anomalies ;
- exposer des signaux exploitables en production ;
- permettre le diagnostic rapide d’un incident ;
- différencier les niveaux de gravité ;
- structurer les logs pour qu’ils soient exploitables.

Selon le projet, il peut aussi porter :

- alerting ;
- dashboards ;
- health checks ;
- corrélation avec événements métier ;
- agrégation multi-services.

---

## Non-responsabilités

Le domaine `observability` n’est pas responsable de :

- stocker l’historique métier (audit) ;
- exprimer les faits métier (domain-events) ;
- implémenter la logique métier ;
- piloter les workflows métier ;
- remplacer le monitoring humain.

Le domaine ne doit pas devenir :

- un dump massif de logs inutilisables ;
- un système opaque ;
- un substitut de debug manuel mal structuré.

---

## Invariants

Les invariants minimaux sont :

- un log doit être compréhensible ;
- un log doit être contextualisé ;
- un log ne doit pas être ambigu ;
- une erreur doit être visible ;
- une erreur critique ne doit pas passer silencieusement ;
- une métrique doit être stable et interprétable ;
- une trace doit permettre de suivre un flux ;
- les signaux doivent être corrélables entre eux.

---

## Dépendances

### Dépendances métier

Indirectes sur tous les domaines.

### Dépendances transverses

Fortement lié à :

- audit ;
- domain-events ;
- jobs ;
- intégrations ;
- sécurité.

### Dépendances externes

Souvent dépend de :

- systèmes de logs ;
- systèmes de métriques ;
- systèmes de tracing ;
- plateformes de monitoring.

### Règle de frontière

Observability = compréhension du système.

Elle ne doit pas :

- définir le métier ;
- remplacer audit ;
- remplacer events ;
- absorber la logique applicative.

---

## Événements significatifs

Le domaine ne publie pas d’événements métier.

Il produit des signaux tels que :

- logs d’erreur ;
- logs d’information ;
- métriques (latence, throughput, erreurs) ;
- traces d’exécution ;
- health checks.

---

## Cycle de vie

Les données d’observabilité suivent un cycle :

- produites ;
- agrégées ;
- consultées ;
- archivées / supprimées.

Le domaine doit éviter :

- accumulation non contrôlée ;
- perte silencieuse ;
- signaux inutilisables.

---

## Interfaces et échanges

Le domaine expose :

- logs ;
- métriques ;
- traces ;
- endpoints de santé.

Il reçoit :

- signaux techniques internes ;
- erreurs ;
- événements système.

---

## Contraintes d’intégration

Contraintes typiques :

- volume élevé ;
- performance ;
- latence faible ;
- coût de stockage ;
- structuration des logs ;
- corrélation multi-sources.

Règles minimales :

- les logs doivent être structurés ;
- les erreurs doivent être traçables ;
- les métriques doivent être cohérentes ;
- les traces doivent être corrélables ;
- le bruit doit être contrôlé.

---

## Observabilité et audit

Différence fondamentale :

- audit = "qui a fait quoi"
- observability = "que fait le système"

Les deux ne doivent jamais être confondus.

---

## Impact de maintenance / exploitation

Impact critique :

- debugging ;
- support ;
- performance ;
- incident response ;
- SLA.

Risques :

- absence de logs ;
- logs inutiles ;
- bruit ;
- absence de corrélation ;
- incapacité à diagnostiquer.

---

## Limites du domaine

Le domaine s’arrête :

- avant le métier ;
- avant l’audit ;
- avant les événements ;
- avant les décisions.

Il décrit le système.
Il ne le gouverne pas.

---

## Questions ouvertes

À cadrer :

- stratégie de logging ;
- niveau de verbosité ;
- corrélation avec domain-events ;
- stratégie de retention ;
- outils utilisés ;
- alerting.

---

## Documents liés

- `../../architecture/40-exploitation/40-observabilite.md`
- `../../architecture/40-exploitation/41-audit-et-tracabilite.md`
- `../../domains/core/domain-events.md`
- `../../domains/cross-cutting/audit.md`
- `../../domains/cross-cutting/jobs.md`
