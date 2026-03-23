# Domaine `cart`

## Objectif

Ce document décrit le domaine `cart` dans la doctrine courante du socle.

Il précise :

- le rôle du domaine ;
- sa place dans la modularité du socle ;
- sa source de vérité ;
- ses capabilities activables ;
- ses niveaux de sophistication ;
- ses objets métier ;
- ses invariants ;
- son cycle de vie ;
- ses règles de cohérence ;
- ses frontières externes ;
- ses implications de maintenance, d’exploitation et de coût.

Le domaine `cart` est structurant pour la réutilisabilité du socle, car il doit couvrir des projets très différents :

- parcours invité ou authentifié ;
- panier persistant ou éphémère ;
- merge guest -> customer ;
- abandon de panier ;
- reprise contrôlée ;
- relance après abandon ;
- complexité variable selon le projet, sans changer de socle.

Le domaine `cart` ne doit pas être pensé comme une simple table temporaire.
Il porte une vraie vérité métier runtime avant `checkout` et avant `orders`.

---

## Position dans la doctrine de modularité

Le domaine `cart` est classé comme :

- `domaine coeur à capabilities toggleables`

Le domaine existe dans tous les projets e-commerce sérieux.
En revanche, ses parcours, ses états enrichis et ses automatismes varient selon les besoins du projet.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- une vérité interne sur le panier runtime ;
- un ownership explicite ;
- une gestion cohérente des lignes ;
- une distinction entre panier actif et panier non modifiable ;
- une conversion contrôlée vers `checkout` et `orders` ;
- un lifecycle explicite.

### Ce qui est activable / désactivable par capability

Le domaine `cart` est lié aux capabilities suivantes :

- `guestCart`
- `persistentCart`
- `cartMerge`
- `abandonedCartDetection`
- `abandonedCartRecovery`
- `abandonedCartRelaunch`
- `giftOptions`
- `savedCart`

### Ce qui relève d’un niveau

Le domaine porte explicitement plusieurs niveaux de sophistication du panier.

### Ce qui relève d’un provider ou d’une intégration externe

Relèvent de `integrations`, `webhooks`, `jobs` ou `analytics`, et non du coeur de `cart` :

- les relances marketing externes ;
- l’emailing d’abandon ;
- les analytics externes ;
- les enrichissements IA éventuels ;
- les workflows de segmentation marketing.

Le domaine `cart` garde la vérité métier du panier.
Les usages externes sont dérivés après commit.

---

## Rôle

Le domaine `cart` porte le panier runtime du socle.

Il constitue la source de vérité interne pour :

- l’existence d’un panier ;
- son ownership ;
- ses lignes ;
- les quantités demandées ;
- son état courant dans le cycle de vie ;
- son statut de panier actif, abandonné, converti ou expiré.

Le domaine est distinct :

- de `products`, qui porte le catalogue ;
- de `pricing`, qui porte la structure économique ;
- de `inventory` ou `availability`, qui porte la disponibilité quantitative ;
- de `checkout`, qui valide le contexte final avant commande ;
- de `orders`, qui porte la commande durable.

---

## Responsabilités

Le domaine `cart` prend en charge :

- la création d’un panier ;
- la récupération d’un panier existant ;
- l’ownership invité ou authentifié ;
- les lignes de panier ;
- l’ajout, la mise à jour et la suppression de lignes ;
- la fusion de lignes identiques ;
- le merge guest -> customer ;
- le lifecycle du panier ;
- la détection et le marquage de l’abandon ;
- la reprise contrôlée d’un panier abandonné ;
- la mise à disposition d’un panier exploitable par `checkout`.

---

## Ce que le domaine ne doit pas faire

Le domaine `cart` ne doit pas :

- devenir un mini-checkout ;
- recalculer seul tout le pricing transverse ;
- porter la vérité du stock ;
- porter la vérité de la vendabilité contextuelle complète ;
- figer la commande durable ;
- parler directement aux outils externes de relance ou d’analytics ;
- supprimer implicitement un panier critique pour éviter de gérer son lifecycle.

---

## Source de vérité

Le domaine `cart` est la source de vérité pour :

- le panier runtime ;
- les lignes runtime ;
- les quantités demandées ;
- le statut runtime du panier ;
- la relation entre ownership et panier ;
- l’état d’abandon, de reprise ou de conversion du panier.

Le domaine n’est pas la source de vérité pour :

- la commande durable ;
- la validation finale de commande ;
- la disponibilité quantitative ;
- les règles de taxation ;
- les statuts de paiement ;
- les notifications de relance ;
- les projections marketing ou analytics.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `Cart`
- `CartLine`
- `CartOwnerKind`
- `CartStatus`
- `CartMergeResult`
- `CartAbandonmentPolicy`
- `CartReactivationIntent`

---

## Capabilities activables liées

Le domaine `cart` est lié aux capabilities suivantes :

- `guestCart`
- `persistentCart`
- `cartMerge`
- `abandonedCartDetection`
- `abandonedCartRecovery`
- `abandonedCartRelaunch`
- `giftOptions`
- `savedCart`

### Effet si `guestCart` est activée

Le panier invité est supporté nativement.

### Effet si `guestCart` est désactivée

Le panier exige un ownership authentifié ou un parcours explicitement contraint.

### Effet si `persistentCart` est activée

Le panier peut survivre à une simple navigation ou à une reprise contrôlée selon sa politique de lifecycle.

### Effet si `cartMerge` est activée

Le domaine supporte la fusion transactionnelle entre un panier invité et un panier client.

### Effet si `abandonedCartDetection` est activée

Le domaine marque explicitement les paniers abandonnés selon une politique d’inactivité.

### Effet si `abandonedCartRecovery` est activée

Un panier abandonné peut être réactivé via un flux serveur explicite et revalidé.

### Effet si `abandonedCartRelaunch` est activée

Le domaine expose les événements nécessaires aux relances après commit.

### Effet si `giftOptions` est activée

Le panier peut porter des attributs cadeaux ou assimilés sans changer de nature.

### Effet si `savedCart` est activée

Le domaine peut conserver des paniers dans une logique de sauvegarde volontaire distincte de l’abandon.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

Le domaine couvre :

- panier actif ;
- lignes de base ;
- ajout / modification / suppression ;
- conversion simple ;
- expiration explicite.

Ce niveau convient à un projet simple avec coût d’entrée maîtrisé.

### Niveau 2 — standard

Le domaine couvre en plus :

- ownership invité / client plus riche ;
- merge guest -> customer ;
- détection d’abandon ;
- meilleure persistance du panier.

Ce niveau convient à un commerce standard évolutif.

### Niveau 3 — avancé

Le domaine couvre en plus :

- reprise contrôlée d’un panier abandonné ;
- relances via événements et jobs ;
- gouvernance plus riche des transitions ;
- exploitation plus forte du lifecycle.

Ce niveau convient à un commerce où le parcours d’achat mérite une meilleure récupération.

### Niveau 4 — expert / multi-contraintes

Le domaine couvre en plus :

- cas de reprise plus complexes ;
- distinctions plus fines entre abandon, sauvegarde et reprise ;
- orchestration enrichie avec d’autres capabilities ;
- contraintes plus fortes d’observability, support et automation.

Ce niveau n’est pas la valeur par défaut.

---

## Entrées

Le domaine reçoit principalement :

- des commandes de création ou récupération de panier ;
- des ajouts, suppressions ou modifications de lignes ;
- des informations d’ownership ;
- des changements de contexte utilisateur ;
- des validations de disponibilité ou de vendabilité en lecture ;
- des commandes de merge ;
- des commandes d’abandon, de réactivation ou de conversion.

---

## Sorties

Le domaine expose principalement :

- un panier runtime ;
- des lignes runtime ;
- un ownership explicite ;
- un état de cycle de vie cohérent ;
- un panier exploitable par `checkout` ;
- des événements métier liés au lifecycle du panier.

---

## Dépendances vers autres domaines

Le domaine `cart` dépend de :

- `products` pour l’identité des articles ou variantes ;
- `pricing` pour certaines lectures de contexte économique ;
- `inventory` ou `availability` pour la disponibilité quantitative ;
- `sales-policy` si ce domaine existe pour la vendabilité contextuelle ;
- `customers` pour les parcours authentifiés ;
- `stores` pour les capabilities activées ;
- `audit` pour les opérations sensibles ;
- `observability` pour expliquer refus, merges et transitions.

Les domaines suivants dépendent de `cart` :

- `checkout`
- `orders`
- `pricing`
- `analytics`
- `jobs`
- `integrations` indirectement via les événements produits

---

## Dépendances vers providers / intégrations

Le domaine `cart` ne dépend d’aucun provider externe comme vérité primaire.

Les usages externes du panier abandonné ou des relances passent par :

- `domain-events`
- `jobs`
- `webhooks`
- `integrations`

Le domaine `cart` n’envoie pas lui-même d’email, de webhook ou d’appel marketing externe.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `customer_support`
- `customer`

### Permissions

Exemples de permissions concernées :

- `cart.read`
- `cart.write`
- `cart.merge`
- `cart.reactivate`
- `customers.read`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `cart.created`
- `cart.line.added`
- `cart.line.updated`
- `cart.line.removed`
- `cart.merged`
- `cart.abandoned`
- `cart.reactivated`
- `cart.converted`
- `cart.expired`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `customer.authenticated`
- `customer.updated`
- `product.updated`
- `inventory.stock.updated`
- `store.capabilities.updated`

---

## Données sensibles / sécurité

Le domaine `cart` porte une donnée runtime importante, avec une criticité métier modérée à forte selon le projet.

Points de vigilance :

- contrôle strict de l’ownership ;
- impossibilité de muter librement un panier non actif ;
- interdiction de faire confiance aux montants ou validations côté client ;
- merge strictement serveur ;
- gestion prudente des liens entre panier invité et panier client ;
- pas d’exposition excessive de données runtime à des intégrations externes.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un panier a été créé ou récupéré ;
- pourquoi une ligne a été acceptée, fusionnée, refusée ou retirée ;
- pourquoi un panier est devenu abandonné ;
- pourquoi un panier a été réactivé ;
- pourquoi une conversion a été acceptée ou refusée ;
- pourquoi un merge a réussi ou échoué.

### Audit

Il faut tracer :

- les merges guest -> customer ;
- les conversions du panier ;
- les réactivations ;
- les interventions support sensibles ;
- les changements manuels significatifs.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un panier possède un ownership explicite ou une stratégie d’ownership explicite ;
- un panier possède un statut runtime explicite ;
- un panier non `ACTIVE` n’accepte pas les mêmes mutations qu’un panier actif ;
- une ligne ne doit pas exister en doublon logique dans le même panier ;
- un panier converti ne redevient jamais un panier actif ordinaire ;
- un panier expiré ne redevient jamais actif ;
- un panier abandonné n’est pas supprimé implicitement ;
- la conversion d’un panier doit rester cohérente avec `checkout` et `orders`.

---

## Lifecycle et gouvernance des données

### États principaux

Les états principaux du panier sont :

- `ACTIVE`
- `ABANDONED`
- `CONVERTED`
- `EXPIRED`

### Transitions autorisées

Exemples :

- `ACTIVE -> ABANDONED`
- `ABANDONED -> ACTIVE`
- `ACTIVE -> CONVERTED`
- `ACTIVE -> EXPIRED`
- `ABANDONED -> EXPIRED`

### Transitions interdites

Exemples :

- `CONVERTED -> ACTIVE`
- `EXPIRED -> ACTIVE`
- `CONVERTED -> ABANDONED`
- conversion directe d’un panier abandonné sans reprise explicite si la politique choisie l’interdit

### Règles de conservation / archivage / suppression

- un panier converti n’est pas supprimé implicitement ;
- un panier abandonné reste traçable ;
- un panier expiré reste compréhensible ;
- la suppression physique n’est pas la stratégie par défaut ;
- les états `abandonedAt`, `convertedAt`, `expiresAt` ou équivalents restent utiles à l’exploitation.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’un panier et de ses métadonnées initiales ;
- ajout d’une ligne avec fusion éventuelle ;
- mise à jour d’une ligne ;
- suppression d’une ligne ;
- merge guest -> customer ;
- transition `ACTIVE -> ABANDONED` ;
- transition `ABANDONED -> ACTIVE` ;
- transition `ACTIVE -> CONVERTED` ;
- transition `ACTIVE -> EXPIRED` ;
- écriture des événements `cart.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- relance marketing ;
- analytics ;
- webhooks sortants ;
- projections secondaires ;
- automatisations externes.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- garde sur le statut courant du panier ;
- unicité logique d’une ligne dans un panier ;
- transaction applicative sur les mutations critiques ;
- ordre stable sur les opérations de merge ;
- refus de conversion si le panier n’est plus dans un état convertible ;
- refus de réactivation si le panier est `CONVERTED` ou `EXPIRED`.

Les conflits attendus sont :

- double ajout concurrent de la même ligne ;
- double merge ;
- double conversion ;
- mise à jour concurrente de quantité ;
- abandon et conversion concurrents ;
- reprise et expiration concurrentes.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `add-cart-line` : clé d’intention = `(cartId, productRef, clientIntentId)`
- `merge-cart` : clé d’intention = `(sourceCartId, targetCartId, mergeIntentId)`
- `abandon-cart` : clé d’intention = `(cartId, abandonmentIntentId)`
- `reactivate-cart` : clé d’intention = `(cartId, reactivationIntentId)`
- `convert-cart` : clé d’intention = `(cartId, conversionIntentId)`

Un retry sur la même intention ne doit jamais produire :

- deux lignes divergentes ;
- deux merges différents ;
- deux conversions pour le même panier ;
- deux réactivations incompatibles.

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `cart.created`
- `cart.line.added`
- `cart.line.updated`
- `cart.line.removed`
- `cart.merged`
- `cart.abandoned`
- `cart.reactivated`
- `cart.converted`
- `cart.expired`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- relance email ;
- analytics externe ;
- webhook sortant ;
- segmentation marketing ;
- intégration CRM ;
- automatisation externe.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` pour un panier simple ;
- `M2` dès qu’il y a merge, abandon et reprise ;
- `M3` dès que les relances, workflows et interactions augmentent la valeur business du panier.

### Pourquoi

Le domaine `cart` est au coeur du funnel d’achat.
Plus il est enrichi, plus il exige :

- observability ;
- reprise propre ;
- compréhension des conflits ;
- analyse des conversions et abandons ;
- maîtrise des automations post-commit.

### Points d’exploitation à surveiller

- taux d’abandon ;
- conversions de paniers ;
- merges ;
- réactivations ;
- conflits de lifecycle ;
- erreurs de mutation de lignes ;
- incohérences ownership / panier.

---

## Impact coût / complexité

Le coût du domaine `cart` monte principalement avec :

- `guestCart`
- `cartMerge`
- `abandonedCartDetection`
- `abandonedCartRecovery`
- `abandonedCartRelaunch`
- `savedCart`
- la richesse des règles d’ownership ;
- les workflows post-commit.

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C3` à `C4`

---

## Cas d’usage principaux

1. Créer ou retrouver un panier
2. Ajouter, modifier ou retirer une ligne
3. Gérer l’ownership invité ou client
4. Fusionner un panier invité et un panier client
5. Marquer un panier comme abandonné
6. Réactiver un panier abandonné
7. Convertir un panier dans un flux de checkout / order

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- panier introuvable ;
- ownership incohérent ;
- panier non actif ;
- ligne introuvable ;
- quantité invalide ;
- double merge ;
- double conversion ;
- tentative de reprise interdite ;
- conflit entre abandon, expiration et conversion.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `cart` est un domaine coeur à capabilities toggleables ;
- le panier runtime possède un lifecycle explicite ;
- l’abandon de panier est un concept métier natif ;
- la reprise de panier est un flux explicite, pas un side-effect implicite ;
- un panier converti est conservé, pas supprimé implicitement ;
- les relances et intégrations externes partent après commit ;
- la montée de sophistication du panier doit rester additive.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `cart` appartient au coeur du socle ;
- le panier abandonné est un vrai état métier ;
- la relance d’abandon ne fait pas partie du coeur transactionnel du panier ;
- le merge guest -> customer est une capability du domaine ;
- la conversion du panier est structurante et traçable ;
- le lifecycle prime sur la suppression implicite.
