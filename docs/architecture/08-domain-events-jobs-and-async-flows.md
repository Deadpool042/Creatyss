# Domain events, jobs and async flows

## Objectif

Ce document définit la doctrine du runtime asynchrone interne du socle.

Il formalise :

- la place des domain events ;
- la place des jobs ;
- la différence entre commit métier et traitements aval ;
- les règles de dispatch, retry et replay ;
- les rôles respectifs de l’outbox, des consumers, des projections et des effets externes.

L’objectif est d’obtenir un système :

- découplé ;
- fiable ;
- traçable ;
- réessayable ;
- exploitable ;
- sans confusion entre vérité métier et exécution asynchrone.

---

## Principe directeur

Le coeur métier valide d’abord sa vérité locale.
Le runtime asynchrone part ensuite de cette vérité validée.

Le bon ordre est :

1. mutation métier ;
2. écriture éventuelle de l’outbox ;
3. commit ;
4. dispatch ;
5. consommation interne ou externe ;
6. jobs ou projections ;
7. retries si nécessaire.

Le système ne doit jamais dépendre d’une exécution asynchrone immédiate pour considérer qu’un fait métier existe.

---

## Vocabulaire officiel

### Domain event

Fait métier interne durable représentant une mutation validée du système.

### Outbox

Persistance durable des événements internes à diffuser.

### Job

Travail asynchrone planifié ou déclenché après commit.

### Consumer

Composant consommant un événement interne ou un job.

### Projection

Vue dérivée ou état secondaire produit à partir d’un fait déjà validé.

### Retry

Nouvelle tentative d’exécution d’un dispatch ou d’un job après échec.

### Replay

Réexécution contrôlée d’un événement ou d’un flux à des fins de reprise, de reconstruction ou d’opération exceptionnelle.

---

## Rôle des domain events

Les domain events servent à exprimer le langage des faits métier validés du socle.

Exemples :

- `cart.abandoned`
- `checkout.ready`
- `order.created`
- `payment.captured`
- `inventory.stock.adjusted`
- `auth.password.changed`

Un domain event :

- est durable ;
- est structuré ;
- appartient au langage interne ;
- part d’une mutation source validée.

Un domain event n’est pas :

- un log technique ;
- un message best-effort ;
- un payload provider brut ;
- une vérité métier primaire autonome.

---

## Rôle des jobs

Les jobs servent à exécuter un travail asynchrone ou différé.

Exemples :

- envoyer une notification ;
- déclencher une relance panier abandonné ;
- recalculer une projection ;
- appeler un provider externe ;
- traiter une synchronisation ;
- rejouer une livraison échouée.

Un job n’est pas une mutation coeur qui remplace la validation métier.
Un job intervient **après** la validation du fait source.

---

## Relation entre domain events et jobs

Les domain events et les jobs ne sont pas interchangeables.

### Les domain events expriment

- ce qui s’est passé dans le coeur ;
- de manière durable ;
- avec une portée métier.

### Les jobs expriment

- ce qu’il faut faire ensuite ;
- de manière asynchrone ;
- avec une portée opératoire ou dérivée.

Un domain event peut déclencher un job.
Un job ne doit pas inventer ex nihilo un fait métier critique absent du coeur.

---

## Chaîne standard du runtime asynchrone

### 1. Le domaine source valide une mutation

Exemple :
commande créée.

### 2. Le domaine source écrit l’event durable

Exemple :
`order.created` dans l’outbox.

### 3. La transaction est commitée

La vérité du coeur est désormais valide.

### 4. Le dispatcher lit l’outbox

Il identifie les événements à diffuser ou consommer.

### 5. Des consumers internes ou des jobs sont déclenchés

Exemple :
notification, analytics, ERP, webhooks.

### 6. Les erreurs sont journalisées et peuvent être rejouées

Le système reste capable de retry ou de reprise.

---

## Typologie des flux async

Le socle distingue plusieurs usages de l’asynchrone.

---

## 1. Notifications

Exemples :

- email transactionnel ;
- email de relance ;
- notification interne ;
- message opérateur.

Ce sont des effets secondaires post-commit.

---

## 2. Projections

Exemples :

- dashboard ;
- tables admin agrégées ;
- vues simplifiées ;
- métriques dérivées ;
- index analytiques.

Les projections ne remplacent pas la source de vérité primaire.

---

## 3. Intégrations sortantes

Exemples :

- appel PSP ;
- synchro ERP ;
- transporteur ;
- CRM ;
- analytics server-side.

Elles partent d’un événement ou d’un job, jamais directement dans la transaction métier.

---

## 4. Relances et automation

Exemples :

- abandoned cart relaunch ;
- reminder ;
- suivi de paiement ;
- workflow automation.

Ces flux sont typiquement pilotés par événements + jobs.

---

## 5. Enrichissements et traitements lourds

Exemples :

- classification ;
- génération de documents ;
- traitements IA ;
- import / export ;
- recalculs non bloquants.

Ils ne doivent pas ralentir ni fragiliser le coeur transactionnel.

---

## Règles officielles sur les domain events

---

## 1. Un domain event représente un fait métier déjà validé

On n’émet pas un event durable pour “tenter quelque chose”.
On l’émet pour décrire ce qui a été validé.

---

## 2. Un domain event est écrit dans la même transaction que sa mutation source

Cette règle est obligatoire.
Elle évite les divergences entre coeur métier et diffusion.

---

## 3. Un domain event possède un langage interne stable

Les noms d’événements et leurs payloads doivent rester :

- compréhensibles ;
- cohérents ;
- stables ;
- distincts des schémas providers.

---

## 4. Un domain event ne remplace pas la source de vérité du domaine

Le domaine `orders` reste la vérité de la commande.
`order.created` n’est qu’un reflet durable de ce fait.

---

## Règles officielles sur les jobs

---

## 1. Un job ne valide pas la vérité primaire du coeur

La validation du coeur a déjà eu lieu avant le job.

---

## 2. Un job doit être rejouable ou reprenable proprement

Un job peut échouer.
Il doit rester :

- identifiable ;
- retraçable ;
- relançable ;
- compatible avec un retry sûr.

---

## 3. Un job ne doit pas recréer aveuglément un effet déjà appliqué

Il doit intégrer :

- une clé de déduplication ;
- un état d’avancement ;
- ou une logique idempotente adaptée.

---

## Dispatch, retry et replay

---

## Dispatch

Le dispatch correspond au passage d’un event durable vers ses consommateurs.

Le dispatch doit :

- conserver l’état de progression ;
- tracer succès et échec ;
- rester observable ;
- éviter la duplication logique.

---

## Retry

Un retry permet une nouvelle tentative après échec.

Le retry doit être :

- borné ;
- traçable ;
- sûr ;
- compatible avec l’idempotence du flux ciblé.

Un retry de dispatch ou de job ne doit pas réexécuter aveuglément une mutation coeur déjà validée.

---

## Replay

Le replay est une opération contrôlée.
Il ne s’agit pas d’un retry automatique ordinaire.

Le replay peut servir à :

- reprendre une erreur exceptionnelle ;
- reconstruire une projection ;
- réémettre une diffusion contrôlée ;
- corriger un problème opératoire.

Le replay doit être :

- explicite ;
- auditable ;
- borné ;
- compréhensible.

---

## Observability des flux async

Le socle doit permettre de comprendre :

- quel event a été écrit ;
- quel job a été planifié ;
- quel consumer a été déclenché ;
- combien de tentatives ont eu lieu ;
- pourquoi un dispatch ou un job a échoué ;
- quel état final a été atteint ;
- quelle action opératoire est possible.

Le runtime async ne doit jamais devenir une boîte noire.

---

## Séparation des responsabilités

Le runtime async est découpé clairement.

### Le domaine source

Valide le fait métier.

### L’outbox

Persiste le fait métier diffusé.

### Le dispatcher

Diffuse ou route l’événement.

### Le consumer

Réagit à l’événement ou programme une suite.

### Le job runner

Exécute le travail différé.

### Les intégrations

Parlent au monde externe.

Cette séparation est essentielle pour :

- la lisibilité ;
- la robustesse ;
- la reprise ;
- le chiffrage de la complexité.

---

## Anti-patterns interdits

Sont interdits :

- logique coeur critique implémentée uniquement dans un job ;
- domain events émis sans persistance durable ;
- jobs déclenchés avant commit ;
- callbacks externes traduits directement en état métier sans validation ;
- mélanger logs techniques et événements métier ;
- flux async impossibles à diagnostiquer ou reprendre ;
- retries sans garde ni idempotence.

---

## Cas d’usage standards du socle

Le runtime async doit couvrir naturellement des cas comme :

- `cart.abandoned` -> job de relance ;
- `checkout.completed` -> analytics et projections ;
- `order.created` -> documents, notifications, ERP ;
- `payment.captured` -> statut commande, documents, comptabilité ;
- `inventory.stock.adjusted` -> projections et disponibilité dérivée ;
- `auth.password.changed` -> notifications et sécurité.

---

## Lien avec les niveaux de projet

Un projet simple n’active pas forcément tous les flux async disponibles.

Exemples :

- niveau simple : seulement quelques notifications ;
- niveau standard : projections + quelques relances ;
- niveau avancé : plus d’intégrations, plus de consumers, plus de workflows ;
- niveau expert : plus de contrôle, plus de replay, plus de supervision.

Le runtime async du socle reste le même.
Sa richesse opérationnelle varie selon les capabilities et les niveaux activés.

---

## Décisions structurantes

Les points suivants sont considérés comme décidés :

- un domain event exprime un fait métier validé ;
- un job exprime un travail asynchrone dérivé ;
- l’outbox est durable ;
- le dispatch part après commit ;
- les retries ne recréent pas la mutation coeur ;
- les replays sont contrôlés et auditables ;
- le runtime async complète le coeur, il ne le remplace pas ;
- les flux async doivent rester observables, idempotents et exploitables.
