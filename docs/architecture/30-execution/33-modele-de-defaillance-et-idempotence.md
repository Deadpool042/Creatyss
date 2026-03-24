cat > docs/architecture/30-execution/33-modele-de-defaillance-et-idempotence.md <<'EOF'

# Modèle de défaillance et idempotence

## Objectif

Ce document définit les règles de robustesse minimales du système face aux échecs, aux duplications et aux exécutions différées.

Il formalise une réalité simple :
les systèmes distribués, asynchrones ou intégrés échouent partiellement, se répètent, se retardent et se désalignent.

L’architecture doit intégrer cette réalité dès la conception.

---

## Principe général

Le système ne doit jamais supposer :

- l’exécution unique garantie ;
- l’ordre parfait des messages ;
- la disponibilité continue des dépendances externes ;
- l’absence de duplicats ;
- la réussite systématique du premier essai.

La robustesse est une exigence de conception, pas un correctif tardif.

---

## Défaillances attendues

Le système doit considérer comme normales les situations suivantes :

- timeout ;
- indisponibilité temporaire d’un fournisseur ;
- réponse partielle ;
- duplication d’un webhook ;
- retry automatique ;
- exécution multiple d’un job ;
- retard important d’un signal ;
- ordre de réception non garanti ;
- interruption après écriture partielle ;
- incohérence temporaire entre systèmes.

---

## Idempotence

### Définition

Une opération idempotente peut être exécutée plusieurs fois sans produire un résultat final incohérent ni des effets dupliqués indus.

### Cas où l’idempotence est obligatoire

L’idempotence doit être explicitement traitée pour :

- les webhooks ;
- les jobs rejouables ;
- les retries automatiques ;
- les synchronisations ;
- les commandes externes potentiellement répétées ;
- les traitements asynchrones exposés à la duplication.

### Cas où l’idempotence peut être locale

Certaines opérations purement internes et strictement bornées peuvent ne pas nécessiter de mécanisme spécifique, si la transaction et les invariants couvrent déjà le risque.

Cette exception doit rester justifiable.

---

## Règles de conception

### Règle 1 — Toute opération rejouable doit être conçue comme potentiellement répétée

Un retry ne doit pas créer à lui seul une corruption métier.

### Règle 2 — L’état final compte plus que le nombre d’exécutions

Le système doit viser un résultat final cohérent, pas l’illusion d’un « exactement une fois » généralisé.

### Règle 3 — Les duplications doivent être détectées ou neutralisées

Le système doit prévoir selon le cas :

- une clé de déduplication ;
- un contrôle d’état ;
- un verrou logique ;
- une stratégie métier de neutralisation.

### Règle 4 — Les échecs partiels doivent être pensés explicitement

Un traitement partiellement exécuté doit avoir une stratégie claire :

- reprise ;
- compensation ;
- marquage d’erreur ;
- intervention opérateur ;
- abandon contrôlé.

---

## Modèle de réponse à l’échec

Pour chaque flux critique, le système doit définir :

- ce qui constitue un succès ;
- ce qui constitue un échec temporaire ;
- ce qui constitue un échec terminal ;
- ce qui peut être rejoué ;
- ce qui doit être compensé ;
- ce qui doit être visible pour l’exploitation.

---

## Retry

Le retry est un mécanisme de résilience, pas une stratégie de conception complète.

Un retry doit toujours être accompagné de :

- bornes ;
- observabilité ;
- idempotence ou neutralisation ;
- politique d’arrêt ;
- gestion explicite des échecs répétés.

Le retry infini ou silencieux est interdit.

---

## Ordre des messages

L’ordre de réception des signaux externes ne doit pas être supposé fiable par défaut.

Lorsque l’ordre importe, le système doit le traiter explicitement par :

- versionnement ;
- contrôle d’état ;
- comparaison temporelle fiable ;
- ou règle métier adaptée.

---

## Traçabilité minimale

Tout flux critique exposé à l’échec doit fournir une traçabilité permettant d’identifier :

- l’entrée reçue ;
- le traitement tenté ;
- le résultat ;
- la duplication éventuelle ;
- le retry éventuel ;
- l’état final observé.

---

## Anti-patterns à éviter

Le système doit éviter :

- le mythe du « une seule fois » sans preuve ;
- les retries sans idempotence ;
- les compensations non documentées ;
- les échecs silencieux ;
- les incohérences assumées sans borne ;
- les webhooks traités comme des appels fiables et uniques.

---

## Documents liés

- `30-evenements-de-domaine-et-flux-asynchrones.md`
- `31-jobs-et-traitements-en-arriere-plan.md`
- `32-integrations-et-adaptateurs-fournisseurs.md`
- `../40-exploitation/42-observabilite-et-audit.md`
  EOF
