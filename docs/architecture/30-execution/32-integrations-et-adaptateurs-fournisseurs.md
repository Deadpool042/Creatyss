# Intégrations et adaptateurs fournisseurs

## Objectif

Ce document définit la manière correcte d’intégrer des systèmes externes dans l’architecture.

Le système doit rester maître de son modèle interne, de son vocabulaire et de ses décisions métier.

Les intégrations doivent être conçues comme des dépendances isolées, jamais comme des centres de gravité conceptuels.

---

## Définition

Une intégration relie le système à un fournisseur, une plateforme tierce ou un satellite externe.

Un adaptateur est la couche chargée de :

- traduire les formats ;
- normaliser les erreurs ;
- isoler les dépendances ;
- protéger le coeur métier ;
- éviter la contamination du modèle interne par le modèle externe.

---

## Rôle architectural

Les intégrations servent à :

- échanger des données ;
- déléguer une capacité technique ;
- recevoir ou émettre des signaux ;
- synchroniser un état ;
- interfacer le système avec son environnement.

Elles ne doivent pas redéfinir la structure conceptuelle du coeur.

---

## Règles de conception

### Règle 1 — Le coeur ne parle pas le langage du fournisseur

Le vocabulaire métier du système doit rester interne.

Les structures, noms, statuts ou conventions d’un fournisseur ne doivent pas devenir le langage du coeur sans traduction explicite.

### Règle 2 — Toute dépendance externe doit être encapsulée

L’accès à un fournisseur doit passer par une couche dédiée.

Cette couche doit :

- porter la traduction ;
- centraliser la dépendance ;
- isoler les détails de protocole ;
- protéger le reste du système contre les variations externes.

### Règle 3 — L’adaptateur traduit, il ne décide pas du métier

Un adaptateur ne doit pas :

- porter la décision métier principale ;
- définir la vérité du domaine ;
- arbitrer les invariants du coeur ;
- imposer la structure conceptuelle externe à l’interne.

### Règle 4 — Les échanges doivent être explicitement gouvernés

Toute intégration significative doit documenter :

- ce qui entre ;
- ce qui sort ;
- qui fait autorité ;
- comment les erreurs sont traitées ;
- ce qui est synchrone ;
- ce qui est différé.

---

## Catégories d’intégration

Les intégrations peuvent relever de plusieurs catégories :

- lecture seule ;
- écriture seule ;
- synchronisation bidirectionnelle ;
- réception de signaux ou webhooks ;
- délégation de service ;
- projection vers un système tiers.

Le type d’intégration conditionne les exigences de robustesse.

---

## Questions obligatoires pour toute intégration

Pour chaque intégration significative, il faut répondre explicitement aux questions suivantes :

1. Quel est le rôle exact du fournisseur ?
2. Quelle donnée ou quel flux est concerné ?
3. Qui est la source de vérité ?
4. Quel est le point de traduction ?
5. Quels sont les modes d’échec possibles ?
6. Quelle est la politique d’idempotence ?
7. Quelle est la stratégie de retry ou de compensation ?
8. Quel est l’impact métier d’un échec ou d’un retard ?

---

## Webhooks et flux entrants

Les flux entrants externes doivent être considérés comme potentiellement :

- dupliqués ;
- retardés ;
- désordonnés ;
- incomplets ;
- malformés ;
- hostiles.

Le système doit donc :

- valider ;
- authentifier si nécessaire ;
- normaliser ;
- contrôler l’idempotence ;
- tracer le traitement.

---

## Anti-patterns à éviter

Le système doit éviter :

- l’appel direct d’API fournisseur depuis le coeur métier ;
- la fuite des statuts externes dans le modèle central ;
- la duplication d’une même logique d’intégration dans plusieurs zones ;
- l’absence de point d’isolation ;
- l’absence de stratégie de reprise ;
- la dépendance implicite du flux principal à une réponse externe non maîtrisée.

---

## Documents liés

- `33-modele-de-defaillance-et-idempotence.md`
- `../10-fondations/12-frontieres-et-responsabilites.md`
- `../20-structure/23-systemes-externes-et-satellites.md`
