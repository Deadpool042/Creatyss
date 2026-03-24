# Jobs et traitements en arrière-plan

## Objectif

Ce document définit la place des jobs et traitements différés dans l’architecture.

Il clarifie la différence entre :

- un événement de domaine ;
- un job ;
- un traitement technique ;
- un traitement planifié ;
- un mécanisme de reprise.

---

## Définition

Un job est une unité de travail exécutée hors du flux immédiat principal.

Un job peut être :

- déclenché par un événement ;
- programmé ;
- relancé ;
- purement technique ;
- mixte, avec des implications fonctionnelles limitées.

Un job n’est pas nécessairement un fait métier.
Il représente un travail à exécuter.

---

## Rôle architectural

Les jobs servent à :

- exécuter un traitement non bloquant ;
- déporter des opérations coûteuses ;
- effectuer des synchronisations ;
- traiter des reprises ;
- absorber des retards ou des retries ;
- exécuter des tâches planifiées.

Ils servent à améliorer la robustesse et la maîtrise opérationnelle du système.

---

## Différence entre événement et job

### Événement

Un événement :

- exprime un fait métier passé ;
- appartient au langage du domaine ;
- décrit quelque chose qui s’est produit.

### Job

Un job :

- exprime un travail à faire ;
- appartient au modèle d’exécution ;
- décrit une action à exécuter ou à reprendre.

Le système ne doit pas confondre ces deux notions.

---

## Cas d’usage légitimes

Les jobs sont appropriés pour :

- synchroniser un système externe ;
- recalculer des données dérivées ;
- expédier une notification différée ;
- reconstruire une projection ;
- rejouer un traitement ;
- exécuter une tâche planifiée ;
- lancer un rattrapage après échec partiel.

---

## Règles de conception

### Règle 1 — Un job doit avoir une responsabilité unique

Un job doit avoir une finalité claire et délimitée.

Un job trop large :

- devient difficile à rejouer ;
- devient difficile à tester ;
- complique la reprise ;
- dilue la traçabilité.

### Règle 2 — Un job doit être rejouable autant que possible

Un job significatif doit être conçu pour supporter :

- le retry ;
- la duplication potentielle ;
- l’exécution retardée ;
- la reprise après erreur.

### Règle 3 — Un job critique doit expliciter son contrat

Un job critique doit documenter :

- son entrée ;
- sa sortie attendue ;
- ses effets ;
- ses dépendances ;
- sa politique d’erreur ;
- sa stratégie de reprise.

### Règle 4 — Un job ne doit pas cacher une transaction métier manquante

Un job n’est pas un prétexte pour reporter une décision qui devrait être atomique dans le flux principal.

---

## Typologie recommandée

Le système peut distinguer au minimum :

### Jobs fonctionnels

Traitements ayant un impact métier indirect mais réel.

### Jobs techniques

Traitements de maintenance, projection, synchronisation, réparation ou administration.

### Jobs planifiés

Traitements exécutés selon une fréquence définie.

### Jobs de reprise

Traitements destinés à relancer ou corriger un flux inachevé.

---

## Exigences minimales

Tout job significatif doit définir :

- son déclencheur ;
- sa criticité ;
- sa stratégie d’idempotence ;
- son comportement en cas d’échec ;
- sa politique de retry ;
- ses effets observables ;
- les métriques ou logs utiles à son suivi.

---

## Anti-patterns à éviter

Le système doit éviter :

- les jobs fourre-tout ;
- les jobs sans observabilité ;
- les jobs non idempotents exposés au retry ;
- les jobs dont les effets ne sont pas traçables ;
- les jobs qui deviennent le coeur réel de la logique métier.

---

## Documents liés

- `30-evenements-de-domaine-et-flux-asynchrones.md`
- `33-modele-de-defaillance-et-idempotence.md`
- `../40-exploitation/42-observabilite-et-audit.md`
