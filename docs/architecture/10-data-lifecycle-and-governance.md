# Data lifecycle and governance

## Objectif

Ce document définit la doctrine de gouvernance et de cycle de vie des données du socle.

Le socle ne doit pas seulement savoir créer et lire des données.
Il doit savoir, de manière explicite :

- quelles données existent ;
- quelle est leur source de vérité ;
- comment elles évoluent ;
- quand elles sont actives, archivées, expirées ou supprimées ;
- lesquelles sont sensibles ;
- lesquelles doivent être conservées ;
- lesquelles peuvent être purgées ;
- quelles traces doivent rester disponibles pour l’exploitation, l’audit et la compréhension métier.

L’objectif est d’éviter :

- les suppressions implicites ;
- les rétentions arbitraires ;
- les doubles vérités ;
- les objets sans état de cycle de vie ;
- les zones floues entre données coeur, données runtime, projections et intégrations.

---

## Principe directeur

Toute donnée importante du socle doit être gouvernée selon trois dimensions :

1. **source de vérité**
2. **cycle de vie**
3. **niveau de sensibilité**

Une donnée correctement gouvernée n’est pas seulement “stockée”.
Elle est :

- localisée dans le bon domaine ;
- classée ;
- traçable ;
- maintenable ;
- exploitable ;
- supprimable ou conservable selon une règle explicite.

---

## Principes fondamentaux

### 1. Une donnée importante a une source de vérité unique

Chaque concept métier ou technique important possède une source de vérité explicite dans le socle.

Exemples :

- le panier relève de `cart`
- le checkout relève de `checkout`
- la commande relève de `orders`
- le paiement interne relève de `payments`
- l’identité d’auth relève de `auth`
- les événements durables relèvent de `domain-events`
- les connecteurs externes relèvent de `integrations`

Les autres domaines peuvent :

- lire ;
- projeter ;
- enrichir ;
- réagir ;
- notifier.

Ils ne doivent pas recréer une vérité concurrente.

---

### 2. Le cycle de vie est explicite, pas implicite

Un objet critique ne doit pas être piloté par des suppressions silencieuses ou des conventions implicites.

Le cycle de vie d’un objet doit être lisible :

- création ;
- activation ;
- mutation ;
- suspension éventuelle ;
- conversion éventuelle ;
- archivage éventuel ;
- expiration éventuelle ;
- suppression éventuelle.

Le bon réflexe n’est pas “supprimer pour simplifier”.
Le bon réflexe est “exprimer l’état correct du lifecycle”.

---

### 3. Toutes les données n’ont pas la même criticité

Le socle distingue plusieurs classes de données :

- données coeur métier ;
- données runtime ;
- données techniques ;
- données sensibles ;
- secrets ;
- traces d’audit ;
- événements durables ;
- projections secondaires ;
- données issues d’intégrations externes.

Chaque classe appelle des règles différentes de :

- conservation ;
- suppression ;
- sécurité ;
- observability ;
- exploitabilité.

---

### 4. La conservation est une décision d’architecture

Une donnée n’est pas conservée ou supprimée “par habitude”.
La décision doit être justifiée par :

- le métier ;
- le support ;
- l’audit ;
- l’exploitation ;
- la compréhension du système ;
- la conformité ;
- le coût.

---

### 5. La suppression doit rester contrôlée

Supprimer une donnée utile à la compréhension métier, à la reprise ou à l’audit affaiblit le socle.

Le socle privilégie donc, selon le cas :

- les statuts explicites ;
- l’archivage ;
- l’expiration ;
- la désactivation ;
- la révocation ;
- la purge contrôlée.

La suppression physique n’est retenue que lorsqu’elle est réellement souhaitable.

---

## Typologie officielle des données

---

## 1. Données coeur métier

Ce sont les données qui portent une vérité métier primaire.

Exemples :

- produits ;
- paniers ;
- checkouts ;
- commandes ;
- paiements ;
- stock / disponibilité ;
- clients ;
- boutiques.

### Règles

- source de vérité claire ;
- lifecycle explicite ;
- suppression rarement implicite ;
- invariants documentés ;
- visibilité support et exploitation adaptée.

---

## 2. Données runtime

Ce sont des données utiles au fonctionnement courant, mais dont la valeur métier durable peut être plus limitée.

Exemples :

- panier actif ;
- sessions ;
- états de préparation ;
- intents de travail ;
- files intermédiaires.

### Règles

- lifecycle explicite ;
- expiration ou désactivation souvent préférable à une suppression immédiate ;
- conservation adaptée au besoin d’exploitation et de support.

---

## 3. Données sensibles

Ce sont des données qui demandent un traitement de sécurité particulier.

Exemples :

- emails d’authentification ;
- identifiants sensibles ;
- coordonnées clients ;
- données d’adresse ;
- références techniques sensibles ;
- informations de contexte plus exposées.

### Règles

- accès limité ;
- visibilité restreinte ;
- traçabilité adaptée ;
- protection côté stockage et logs ;
- minimisation de l’exposition.

---

## 4. Secrets

Les secrets constituent une classe spécifique.

Exemples :

- secrets de session ;
- clés providers ;
- signatures webhook ;
- tokens techniques ;
- credentials d’intégration.

### Règles

- ne jamais devenir de simples données métiers ordinaires ;
- gestion hors dépôt ;
- cycle de rotation / révocation si nécessaire ;
- pas de fuite dans les logs ;
- séparation entre secrets utilisateurs et secrets providers.

---

## 5. Traces d’audit

Les traces d’audit décrivent des opérations sensibles ou structurantes.

Exemples :

- changement de mot de passe ;
- remboursement ;
- changement de statut critique ;
- rotation d’un credential ;
- replay ou retry manuel.

### Règles

- conservation plus longue que les données runtime ordinaires ;
- lisibilité de l’acteur ;
- lisibilité de l’intention ;
- lisibilité de l’effet produit ;
- suppression très contrôlée.

---

## 6. Événements durables

Les événements durables portent un reflet structuré des faits métier validés.

Exemples :

- `order.created`
- `payment.captured`
- `cart.abandoned`

### Règles

- écrits dans la même transaction que la mutation source ;
- exploitables pour dispatch, retry, replay et diagnostic ;
- non utilisés comme vérité primaire du domaine ;
- conservés selon une politique explicite.

---

## 7. Projections secondaires

Les projections sont des vues dérivées.

Exemples :

- vues dashboard ;
- tables admin enrichies ;
- index analytiques ;
- agrégations de monitoring.

### Règles

- peuvent être reconstruites à partir de vérités primaires si l’architecture le permet ;
- ne doivent pas devenir la source de vérité du coeur ;
- lifecycle lié à leur utilité réelle.

---

## 8. Données externes traduites

Ce sont des données reçues ou dérivées d’un provider externe, puis traduites dans le langage du socle.

Exemples :

- référence provider ;
- event provider traduit ;
- résultat d’intégration enregistré ;
- statut externe interprété.

### Règles

- rester distinctes des concepts coeur ;
- conserver la traçabilité de leur origine ;
- ne pas remplacer la vérité métier interne ;
- suppression et conservation pilotées selon leur rôle de rapprochement, audit et support.

---

## États de lifecycle recommandés

Le socle utilise un vocabulaire de lifecycle explicite.
Tous les objets n’ont pas besoin de tous les états, mais les états doivent rester compréhensibles.

### 1. Created

L’objet existe.

### 2. Active

L’objet est exploitable normalement.

### 3. Inactive / Disabled

L’objet existe toujours mais n’est plus utilisable comme actif.

### 4. Suspended / Locked

L’objet est temporairement bloqué sous contrôle métier ou sécurité.

### 5. Converted

L’objet source a servi à produire un autre objet durable.

### 6. Completed

Le cycle principal attendu est terminé.

### 7. Cancelled

Le cycle a été arrêté explicitement.

### 8. Expired

L’objet n’est plus valide par expiration.

### 9. Archived

L’objet n’est plus actif mais reste conservé.

### 10. Revoked

L’objet a perdu sa validité sous contrôle explicite.

### 11. Deleted / Purged

L’objet est supprimé physiquement, selon une règle contrôlée.

---

## Politique générale de conservation

Le socle adopte les règles suivantes.

### 1. Conserver ce qui explique le métier

On conserve les objets nécessaires pour comprendre :

- un achat ;
- un paiement ;
- une transition ;
- un incident ;
- une reprise ;
- une action support ;
- une intégration.

### 2. Conserver ce qui soutient l’exploitation

On conserve ce qui aide à :

- diagnostiquer ;
- auditer ;
- rejouer ;
- rapprocher ;
- restaurer la compréhension métier.

### 3. Purger ce qui n’apporte plus de valeur durable

Les données purement techniques, temporaires ou reconstruites peuvent être purgées selon une stratégie explicite.

### 4. Ne jamais confondre “inactif” et “à supprimer”

Un objet peut être :

- terminé ;
- révoqué ;
- expiré ;
- archivé ;
  sans nécessiter une suppression immédiate.

---

## Exemples par objet critique

---

## `Cart`

### Source de vérité

`cart`

### Lifecycle attendu

- `ACTIVE`
- `ABANDONED`
- `CONVERTED`
- `EXPIRED`

### Règles

- un panier converti n’est pas supprimé immédiatement ;
- un panier abandonné reste traçable ;
- un panier expiré reste compréhensible ;
- la reprise, la conversion et l’expiration doivent être explicites.

---

## `Checkout`

### Source de vérité

`checkout`

### Lifecycle attendu

- `ACTIVE`
- `READY`
- `COMPLETED`
- `EXPIRED`
- `CANCELLED`

### Règles

- un checkout complété reste traçable ;
- un checkout ne disparaît pas silencieusement ;
- l’expiration est explicite.

---

## `Order`

### Source de vérité

`orders`

### Lifecycle attendu

- créé
- actif selon statut métier
- complété / annulé selon workflow métier
- archivable selon politique future

### Règles

- une commande ne se supprime pas comme un simple objet runtime ;
- son historique reste compréhensible.

---

## `Payment`

### Source de vérité

`payments`

### Lifecycle attendu

- `PENDING`
- `AUTHORIZED`
- `CAPTURED`
- `FAILED`
- `CANCELLED`
- `REFUNDED`
- `PARTIALLY_REFUNDED`

### Règles

- le lifecycle est métier, pas provider-first ;
- les références provider restent annexes ;
- les remboursements et échecs restent traçables.

---

## `AuthIdentity` et `AuthSession`

### Source de vérité

`auth`

### Lifecycle attendu

- identité active / locked / disabled
- session active / expired / revoked

### Règles

- la révocation est préférée à une disparition opaque ;
- les éléments sensibles restent protégés ;
- les transitions de sécurité sont auditables.

---

## `IntegrationCredential`

### Source de vérité

`integrations`

### Lifecycle attendu

- actif
- rotated
- revoked
- archived

### Règles

- rotation et révocation explicites ;
- suppression physique très contrôlée ;
- pas de confusion avec un secret utilisateur.

---

## `DomainEvent`

### Source de vérité

`domain-events`

### Lifecycle attendu

- `PENDING`
- `DISPATCHED`
- `FAILED`
- replayable selon politique

### Règles

- conservation pilotée ;
- utilité pour replay, support et audit ;
- pas de suppression opportuniste immédiate.

---

## Lifecycle et sécurité

Le lifecycle d’une donnée influence directement sa sécurité.

Exemples :

- une session révoquée ne doit plus être utilisable ;
- un credential archivé ne doit plus être exploitable ;
- une identité verrouillée ne doit plus ouvrir de session ;
- un endpoint désactivé ne doit plus recevoir de livraison ;
- un panier converti ne doit plus être muté comme un panier actif.

La sécurité n’est pas indépendante du lifecycle.
Elle en dépend partiellement.

---

## Lifecycle et exploitabilité

Un lifecycle bien défini rend le système plus exploitable.

Il permet de répondre à des questions comme :

- pourquoi ce panier n’est plus modifiable ?
- pourquoi ce paiement ne peut plus être capturé ?
- pourquoi cette session n’est plus valide ?
- pourquoi ce checkout ne peut plus être converti ?
- pourquoi cette intégration est inactive ?
- pourquoi cette livraison webhook n’est plus rejouée ?

Un lifecycle flou rend les erreurs support et opératoires beaucoup plus difficiles à traiter.

---

## Lifecycle et coût

Une bonne gouvernance des données a un coût :

- stockage ;
- maintenance ;
- observability ;
- audit ;
- outillage de reprise ;
- complexité de règles de rétention.

Mais l’absence de gouvernance coûte souvent davantage :

- bugs plus difficiles à diagnostiquer ;
- support plus coûteux ;
- reprises manuelles plus risquées ;
- dette technique plus forte ;
- mauvaise réutilisabilité du socle.

La gouvernance doit donc être proportionnée, pas absente.

---

## Règles de décision

### Règle 1

Un objet critique doit avoir une source de vérité explicite.

### Règle 2

Un objet critique doit avoir un lifecycle lisible.

### Règle 3

Une suppression physique doit être justifiée, pas implicite.

### Règle 4

Les données sensibles et secrets sont des classes distinctes.

### Règle 5

Les projections ne deviennent jamais la vérité coeur.

### Règle 6

Les données externes traduites ne remplacent jamais les concepts internes.

### Règle 7

La conservation doit être pensée pour le métier, l’audit, l’exploitation et le coût.

---

## Anti-patterns interdits

Sont interdits :

- supprimer un objet critique pour éviter de gérer son cycle de vie ;
- laisser un objet important sans statut ou transition explicite ;
- traiter une projection comme la vérité primaire ;
- stocker un secret comme une simple donnée ordinaire ;
- laisser des données sensibles fuiter dans les logs ;
- dupliquer la vérité métier dans plusieurs domaines ;
- garder des données sans justification de valeur ;
- purger des objets utiles au support ou à l’audit sans stratégie claire.

---

## Décisions structurantes

Les points suivants sont considérés comme décidés :

- toute donnée importante possède une source de vérité claire ;
- tout objet critique possède un cycle de vie explicite ;
- la suppression physique n’est pas le comportement par défaut ;
- les données sensibles, secrets, événements durables et projections sont des classes distinctes ;
- la gouvernance des données fait partie de la robustesse du socle ;
- un lifecycle lisible améliore la sécurité, l’exploitabilité et la réutilisabilité du système.
