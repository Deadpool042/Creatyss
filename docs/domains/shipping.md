# Domaine `shipping`

## Objectif

Ce document décrit le domaine `shipping` dans la doctrine courante du socle.

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

Le domaine `shipping` est structurant pour la réutilisabilité du socle, car il porte la logique de livraison ou d’acheminement de la commande.

Le domaine `shipping` ne doit pas être réduit à un simple coût de port.
Il doit pouvoir couvrir :

- livraison simple ;
- options de livraison ;
- adresse de livraison ;
- point relais ;
- méthodes et zones de livraison ;
- préparation de fulfillment ;
- articulation avec taxation, checkout, orders et documents ;
- enrichissement progressif via connecteurs transporteurs si activés.

---

## Position dans la doctrine de modularité

Le domaine `shipping` est classé comme :

- `domaine coeur à capabilities toggleables`

Le domaine existe dans tout projet où une commande implique un acheminement physique ou une logique assimilée de remise.
En revanche, sa sophistication varie fortement selon le projet.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- une vérité interne sur le mode de livraison retenu ;
- une cohérence entre commande et contexte de livraison ;
- une séparation claire entre logique métier de livraison et transporteurs externes ;
- une articulation explicite avec `checkout`, `orders`, `taxation` et `documents`.

### Ce qui est activable / désactivable par capability

Le domaine `shipping` est lié aux capabilities suivantes :

- `shipping`
- `shippingAddress`
- `pickupPointDelivery`
- `carrierIntegrations`
- `splitFulfillment`
- `shippingZones`
- `shippingRateRules`
- `digitalOrNoShipping`
- `returns`

### Ce qui relève d’un niveau

Le domaine porte explicitement plusieurs niveaux de sophistication de livraison.

### Ce qui relève d’un provider ou d’une intégration externe

Relèvent de `integrations` et non du coeur de `shipping` :

- APIs transporteurs ;
- points relais provider-specific ;
- génération d’étiquettes externes ;
- tracking externes ;
- synchronisation WMS / ERP.

Le domaine `shipping` garde la vérité interne de la livraison retenue par le socle.

---

## Rôle

Le domaine `shipping` porte la logique interne de livraison du commerce.

Il constitue la source de vérité interne pour :

- le mode de livraison retenu ;
- la cohérence de l’adresse ou du point de retrait ;
- le coût de livraison validé dans le contexte d’achat ;
- certaines politiques de livraison applicables ;
- l’état métier interne des étapes de livraison si le projet les supporte.

Le domaine est distinct :

- de `pricing`, qui porte la vérité économique de l’offre ;
- de `taxation`, qui porte la logique fiscale ;
- de `checkout`, qui porte la validation finale du contexte d’achat ;
- de `orders`, qui porte la commande durable ;
- de `integrations`, qui parle aux transporteurs externes ;
- de `documents`, qui porte les documents ou supports de preuve.

---

## Responsabilités

Le domaine `shipping` prend en charge :

- la modélisation des modes de livraison ;
- les zones de livraison si activées ;
- les règles d’éligibilité d’un mode de livraison ;
- la sélection et la validation du mode de livraison ;
- les coûts de livraison validés dans un contexte ;
- la cohérence entre adresse, zone, méthode et commande ;
- les transitions internes utiles à la préparation ou au suivi si le projet les active.

---

## Ce que le domaine ne doit pas faire

Le domaine `shipping` ne doit pas :

- porter toute la logistique externe ;
- devenir un wrapper de transporteur ;
- porter la vérité du paiement ou de la taxation ;
- laisser un transporteur externe définir à lui seul la vérité coeur de la livraison ;
- recalculer librement la commande durable après figement.

---

## Source de vérité

Le domaine `shipping` est la source de vérité pour :

- les méthodes de livraison internes ;
- les zones et règles internes de livraison si activées ;
- le choix de livraison retenu ;
- le coût de livraison validé dans le contexte d’achat ;
- les états internes de préparation / livraison si retenus par le projet.

Le domaine n’est pas la source de vérité pour :

- la commande durable ;
- les documents externes de transport ;
- le tracking provider brut ;
- les étiquettes externes ;
- les APIs transporteurs.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `ShippingMethod`
- `ShippingZone`
- `ShippingRateRule`
- `ShippingSelection`
- `ShippingAddressSnapshot`
- `PickupPointSelection`
- `ShippingStatus`
- `ShippingPreparation`

---

## Capabilities activables liées

Le domaine `shipping` est lié aux capabilities suivantes :

- `shipping`
- `shippingAddress`
- `pickupPointDelivery`
- `carrierIntegrations`
- `splitFulfillment`
- `shippingZones`
- `shippingRateRules`
- `digitalOrNoShipping`
- `returns`

### Effet si `shipping` est activée

Le domaine porte des méthodes de livraison et une validation de sélection de livraison.

### Effet si `shippingAddress` est activée

Le domaine exige ou exploite une adresse de livraison structurée.

### Effet si `pickupPointDelivery` est activée

Le domaine supporte une sélection de point relais ou retrait.

### Effet si `carrierIntegrations` est activée

Le domaine peut s’appuyer sur des transporteurs via `integrations`, sans leur déléguer sa vérité interne.

### Effet si `splitFulfillment` est activée

Le domaine peut porter une logique de livraison plus éclatée, avec impacts sur états et documents.

### Effet si `shippingZones` est activée

Le domaine distingue plusieurs zones de livraison.

### Effet si `shippingRateRules` est activée

Le domaine calcule ou sélectionne des coûts de livraison selon des règles plus riches.

### Effet si `digitalOrNoShipping` est activée

Le domaine peut reconnaître certains contextes sans livraison physique.

### Effet si `returns` est activée

Le domaine doit rester cohérent avec les flux de retour aval.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

- livraison simple ;
- une ou peu de méthodes ;
- adresse simple ;
- faible nombre de règles.

### Niveau 2 — standard

- plusieurs méthodes ;
- zones de livraison ;
- coûts de livraison plus structurés ;
- meilleure articulation checkout / order.

### Niveau 3 — avancé

- point relais ;
- transporteurs externes ;
- règles tarifaires plus riches ;
- préparation et statuts internes plus structurés.

### Niveau 4 — expert / multi-contraintes

- split fulfillment ;
- multi-zones avancées ;
- coordination plus dense avec transporteurs et documents ;
- exigences plus fortes d’observability et d’exploitation.

---

## Entrées

Le domaine reçoit principalement :

- un contexte de checkout ;
- une adresse ou un point de retrait ;
- des capacités boutique ;
- des règles de zones et coûts ;
- une commande durable ;
- des résultats externes traduits de transporteurs si activés.

---

## Sorties

Le domaine expose principalement :

- une sélection de livraison valide ;
- un coût de livraison ;
- un snapshot de livraison figé pour la commande ;
- des états internes de livraison ou préparation si activés ;
- des événements métier liés à la livraison.

---

## Dépendances vers autres domaines

Le domaine `shipping` dépend de :

- `stores`
- `customers`
- `checkout`
- `orders`
- `pricing`
- `taxation`
- `audit`
- `observability`

Les domaines suivants dépendent de `shipping` :

- `checkout`
- `orders`
- `documents`
- `returns`
- `integrations`
- `analytics`

---

## Dépendances vers providers / intégrations

Le domaine `shipping` ne parle pas directement aux transporteurs dans sa logique coeur.

Les flux provider passent par `integrations`, qui prend en charge :

- appels API ;
- DTO externes ;
- tracking bruts ;
- labels ;
- résultats de point relais ;
- traduction en résultats internes.

Le domaine `shipping` n’accepte pas un payload brut de transporteur comme vérité métier interne.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `fulfillment_operator`
- `customer_support`

### Permissions

Exemples de permissions concernées :

- `shipping.read`
- `shipping.write`
- `shipping.methods.manage`
- `shipping.rates.manage`
- `shipping.prepare`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `shipping.method.created`
- `shipping.method.updated`
- `shipping.selection.validated`
- `shipping.preparation.created`
- `shipping.status.changed`
- `shipping.pickup_point.selected`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `checkout.updated`
- `checkout.ready`
- `order.created`
- `order.cancelled`
- `integration.shipping.result.translated`

---

## Données sensibles / sécurité

Le domaine `shipping` porte une donnée métier sensible.

Points de vigilance :

- adresses et points de retrait ;
- cohérence entre méthode, zone et destination ;
- protection des informations de livraison ;
- contrôle des intégrations transporteurs ;
- pas de fuite de données sensibles dans les logs.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une méthode de livraison est proposée ou refusée ;
- pourquoi un coût de livraison a été retenu ;
- pourquoi un point relais est valide ou non ;
- pourquoi une préparation ou un changement d’état a eu lieu ;
- si un écart provient d’une règle interne ou d’une intégration externe.

### Audit

Il faut tracer :

- les changements de méthodes ;
- les changements de zones ;
- les changements de règles tarifaires ;
- les corrections manuelles structurantes ;
- les actions opérateur importantes sur la préparation de livraison.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une commande avec livraison physique possède une sélection de livraison cohérente ;
- une méthode de livraison retenue est compatible avec son contexte ;
- un coût de livraison figé dans la commande n’est pas recalculé librement après coup ;
- un transporteur externe ne remplace pas la vérité interne du domaine ;
- un projet sans besoin avancé ne porte pas d’emblée toute la complexité transporteur ou split fulfillment.

---

## Lifecycle et gouvernance des données

### États principaux

Les états principaux utiles incluent typiquement :

- `PENDING_SELECTION`
- `SELECTED`
- `PREPARING`
- `READY`
- `SHIPPED`
- `DELIVERED`
- `FAILED`
- `CANCELLED`

Tous les projets n’utilisent pas tous les états.

### Transitions autorisées

Exemples :

- `PENDING_SELECTION -> SELECTED`
- `SELECTED -> PREPARING`
- `PREPARING -> READY`
- `READY -> SHIPPED`
- `SHIPPED -> DELIVERED`
- `SELECTED -> CANCELLED`

### Transitions interdites

Exemples :

- `DELIVERED -> PREPARING`
- `CANCELLED -> SHIPPED`
- requalification implicite d’un mode de livraison figé sans action métier explicite.

### Règles de conservation / archivage / suppression

- les snapshots de livraison liés à la commande restent compréhensibles ;
- les changements structurants restent auditables ;
- la suppression physique n’est pas la stratégie par défaut pour les états significatifs.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création ou mise à jour structurante d’une méthode ;
- validation d’une sélection de livraison ;
- figement du snapshot de livraison pour la commande ;
- changement de statut interne de préparation ou livraison si porté par le domaine ;
- écriture des événements `shipping.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- appel transporteur ;
- génération d’étiquette externe ;
- tracking externe ;
- notifications ;
- analytics ;
- webhooks sortants.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les mutations structurantes ;
- garde sur le statut courant ;
- cohérence entre commande et sélection de livraison ;
- déduplication des résultats externes traduits.

Les conflits attendus sont :

- double sélection concurrente ;
- changement de méthode en concurrence avec complétion checkout ;
- deux workers sur la même préparation ;
- résultat externe en désordre.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `select-shipping-method` : clé d’intention = `(checkoutId, selectionIntentId)`
- `create-shipping-preparation` : clé d’intention = `(orderId, preparationIntentId)`
- `change-shipping-status` : clé d’intention = `(shippingAggregateId, targetStatus, statusIntentId)`
- `apply-external-shipping-result` : clé d’intention = `(providerName, externalEventId)`

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `shipping.method.created`
- `shipping.method.updated`
- `shipping.selection.validated`
- `shipping.preparation.created`
- `shipping.status.changed`
- `shipping.pickup_point.selected`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- appel transporteur ;
- tracking externe ;
- génération documentaire externe ;
- analytics ;
- webhook sortant ;
- notifications.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` pour livraison simple ;
- `M2` pour zones et coûts enrichis ;
- `M3` pour points relais et transporteurs ;
- `M4` pour fulfillment plus dense ou multi-contraintes.

### Pourquoi

Le domaine `shipping` touche directement le checkout, la satisfaction client et le support.
Plus il monte en richesse, plus il exige :

- observability ;
- cohérence avec la commande ;
- supervision des intégrations ;
- qualité de reprise.

### Points d’exploitation à surveiller

- sélections de livraison invalides ;
- statuts incohérents ;
- erreurs transporteurs ;
- échecs de préparation ;
- écart entre shipping interne et résultat externe.

---

## Impact coût / complexité

Le coût du domaine `shipping` monte principalement avec :

- `pickupPointDelivery`
- `carrierIntegrations`
- `splitFulfillment`
- `shippingZones`
- `shippingRateRules`

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Définir une méthode de livraison
2. Valider une sélection de livraison au checkout
3. Figer un snapshot de livraison dans la commande
4. Préparer une livraison
5. Faire évoluer un statut interne de livraison

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- méthode introuvable ;
- zone incompatible ;
- adresse invalide ;
- point relais invalide ;
- coût incohérent ;
- résultat transporteur ambigu ;
- double sélection concurrente ;
- transition de statut invalide.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `shipping` est un domaine coeur à capabilities toggleables ;
- la livraison est distincte de pricing, taxation et orders ;
- les transporteurs restent à la frontière via `integrations` ;
- le snapshot de livraison est figé dans la commande ;
- la sophistication monte par capabilities et niveaux ;
- les effets externes partent après commit.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `shipping` appartient au coeur du socle ;
- le domaine ne se réduit pas à un coût de port ;
- les transporteurs externes ne remplacent pas la vérité interne ;
- point relais et split fulfillment sont toggleables ;
- la livraison est articulée avec checkout, orders, taxation et documents ;
- la montée en complexité reste additive.
