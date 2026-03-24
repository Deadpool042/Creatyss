# Événements de domaine et flux asynchrones

## Objectif

Ce document définit la place des événements de domaine dans l’architecture et la manière correcte de concevoir les flux asynchrones.

Les événements servent à exprimer des faits métier significatifs et à propager certaines conséquences de manière découplée.

Ils ne doivent pas devenir un canal générique de transport technique sans gouvernance.

---

## Définition

Un événement de domaine exprime qu’un fait métier important s’est produit.

Un événement :

- représente un fait passé ;
- est nommé dans le langage métier ;
- possède un contexte identifiable ;
- peut déclencher des traitements secondaires ;
- ne doit pas masquer une commande, une intention ou une dette de modélisation.

---

## Rôle architectural

Les événements de domaine servent à :

- découpler certaines réactions secondaires du flux principal ;
- rendre explicites les faits métier importants ;
- propager des changements vers d’autres blocs ;
- alimenter des projections, synchronisations ou traitements de fond ;
- améliorer la traçabilité du système.

Ils ne servent pas à contourner l’absence de frontière claire entre responsabilités.

---

## Principe de base

Le flux nominal est le suivant :

1. une décision ou mutation métier significative se produit ;
2. le domaine persiste son état ;
3. le système enregistre le ou les événements associés ;
4. la transaction principale se termine de manière cohérente ;
5. les traitements secondaires sont déclenchés de manière asynchrone ou différée selon les règles définies.

Le système doit privilégier une logique de type :

- mutation locale cohérente d’abord ;
- propagation secondaire ensuite.

---

## Règles de conception

### Règle 1 — Un événement exprime un fait métier

Un événement doit être compréhensible sans référence à une implémentation technique.

Bon signal :

- il décrit un fait métier significatif.

Mauvais signal :

- il décrit un détail de transport ;
- il fuit un nom de table, de queue ou de fournisseur ;
- il ne peut être compris que par son infrastructure.

### Règle 2 — Le flux principal ne dépend pas de réactions non garanties

Le coeur métier ne doit pas supposer qu’une réaction asynchrone a déjà eu lieu tant que celle-ci n’est pas explicitement confirmée par le modèle.

Le système doit distinguer clairement :

- ce qui est garanti dans la transaction principale ;
- ce qui relève d’un traitement ultérieur.

### Règle 3 — Un événement ne remplace pas une frontière mal modélisée

Si deux blocs partagent une responsabilité unique, ajouter un événement entre eux ne corrige pas le problème.

Un événement n’est pas une solution à un découpage erroné.

### Règle 4 — Les événements doivent rester gouvernés

Le système ne doit pas publier des événements sans :

- convention de nommage ;
- responsabilité claire ;
- contrat minimal ;
- stratégie de traitement ;
- logique d’idempotence lorsque nécessaire.

---

## Effets secondaires admissibles

Les événements peuvent déclencher :

- des notifications ;
- des projections ;
- des synchronisations vers des systèmes externes ;
- des recalculs secondaires ;
- des jobs techniques ou fonctionnels ;
- de l’audit ou de l’observabilité complémentaire.

Ils ne doivent pas servir à disperser la décision métier principale.

---

## Flux principal vs flux secondaire

### Flux principal

Le flux principal :

- garantit la cohérence métier immédiate ;
- protège les invariants ;
- écrit l’état faisant autorité ;
- ne dépend pas d’un traitement asynchrone opportuniste.

### Flux secondaire

Le flux secondaire :

- enrichit ;
- propage ;
- synchronise ;
- notifie ;
- traite du différé ;
- améliore la robustesse globale.

La séparation entre ces deux niveaux doit être explicite.

---

## Exigences minimales

Tout flux asynchrone significatif doit expliciter :

- l’événement source ;
- le fait métier exprimé ;
- les consommateurs attendus ;
- la criticité du traitement ;
- la stratégie de retry ;
- les règles d’idempotence ;
- le comportement attendu en cas d’échec.

---

## Anti-patterns à éviter

Le système doit éviter :

- les événements techniques déguisés en événements métier ;
- la multiplication d’événements peu significatifs ;
- les chaînes asynchrones opaques ;
- les événements sans propriétaire logique ;
- les effets de bord globaux impossibles à tracer ;
- la dépendance implicite du coeur à des traitements différés.

---

## Documents liés

- `31-jobs-et-traitements-en-arriere-plan.md`
- `32-integrations-et-adaptateurs-fournisseurs.md`
- `33-modele-de-defaillance-et-idempotence.md`
- `../10-fondations/10-principes-d-architecture.md`
