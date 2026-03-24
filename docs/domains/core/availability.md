# Domaine `availability`

## Objectif

Ce document décrit le domaine `availability` dans la doctrine courante du socle.

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

Le domaine `availability` est structurant pour la réutilisabilité du socle, car il porte la capacité réelle du système à dire si une offre peut être achetée, réservée, précommandée ou bloquée dans un contexte donné.

Le domaine `availability` ne doit pas être pensé comme un simple compteur de stock.
Il porte une vérité plus large :

- disponibilité quantitative ;
- disponibilité contextuelle ;
- réservabilité ;
- indisponibilité temporaire ;
- backorder ;
- preorder ;
- politiques de vente selon contexte.

Cela permet au socle de rester pertinent pour :

- produits physiques simples ;
- produits à variantes ;
- précommandes ;
- backorders ;
- offres temporairement indisponibles ;
- projets futurs plus riches que le seul stock physique.

---

## Position dans la doctrine de modularité

Le domaine `availability` est classé comme :

- `domaine coeur à capabilities toggleables`

Le domaine existe dans tous les projets e-commerce sérieux, car le système doit savoir si une offre peut être achetée ou non.
En revanche, la manière de modéliser cette disponibilité varie selon le projet.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- une vérité interne sur la disponibilité d’une offre ;
- un langage métier stable pour dire si une offre est vendable ou non ;
- une séparation entre disponibilité interne et projections UI ;
- des garde-fous de cohérence lors des mutations critiques ;
- une articulation explicite avec `cart`, `checkout` et `orders`.

### Ce qui est activable / désactivable par capability

Le domaine `availability` est lié aux capabilities suivantes :

- `stockTracking`
- `reservation`
- `backorders`
- `preorders`
- `multiLocationAvailability`
- `availabilityPolicies`
- `lowStockSignals`

### Ce qui relève d’un niveau

Le domaine porte explicitement plusieurs niveaux de sophistication de la disponibilité.

### Ce qui relève d’un provider ou d’une intégration externe

Relèvent de `integrations` et non du coeur de `availability` :

- un ERP ou WMS externe ;
- une synchro stock externe ;
- un connecteur marketplace ;
- une source tierce de disponibilité.

Le domaine `availability` garde la vérité interne utilisée par le socle.
Un système externe peut l’alimenter, mais ne doit pas la court-circuiter.

---

## Rôle

Le domaine `availability` porte la disponibilité interne d’une offre vendable.

Il constitue la source de vérité interne pour :

- la disponibilité d’un produit ou d’une variante ;
- la quantité disponible ou réservée si la capability de stock est activée ;
- la politique de vendabilité appliquée ;
- la possibilité d’autoriser ou non un achat, une réservation, une précommande ou un backorder ;
- l’état d’indisponibilité temporaire ou durable d’une offre.

Le domaine est distinct :

- de `products`, qui porte l’identité et la structure de l’offre ;
- de `pricing`, qui porte la logique de prix ;
- de `cart`, qui porte l’intention d’achat runtime ;
- de `checkout`, qui porte la validation finale ;
- de `orders`, qui porte la commande durable ;
- de `fulfillment` ou `shipping`, qui portent l’exécution aval.

---

## Responsabilités

Le domaine `availability` prend en charge :

- la disponibilité interne d’une offre ;
- les quantités disponibles, réservées ou consommées si `stockTracking` est active ;
- les politiques de disponibilité ;
- la décision “vendable / non vendable / réservable / précommandable / backorderable” ;
- la réservation ou décrémentation selon la stratégie retenue ;
- la remise à disposition si un flux amont ou aval l’exige ;
- les événements de changement de disponibilité ;
- l’exposition d’un état fiable à `cart`, `checkout` et `orders`.

---

## Ce que le domaine ne doit pas faire

Le domaine `availability` ne doit pas :

- porter le catalogue produit lui-même ;
- recalculer la fiscalité ou le pricing ;
- devenir le domaine de logistique complète ;
- laisser l’UI définir seule si un article est vendable ;
- confondre disponibilité, stock, transport et commande dans un seul bloc ;
- dépendre d’un système externe pour savoir localement si le coeur autorise une vente.

---

## Source de vérité

Le domaine `availability` est la source de vérité pour :

- l’état de disponibilité interne d’une offre ;
- les quantités disponibles ou réservées si activées ;
- les politiques de disponibilité ;
- les signaux de backorder ou preorder ;
- les changements de disponibilité durablement validés.

Le domaine n’est pas la source de vérité pour :

- l’identité produit ;
- le prix ;
- la commande durable ;
- le panier runtime ;
- les projections storefront ;
- les systèmes externes de stock ;
- la logistique aval.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `Availability`
- `AvailabilityStatus`
- `AvailabilityPolicy`
- `StockLevel`
- `ReservedQuantity`
- `AvailabilityDecision`
- `Reservation`
- `BackorderPolicy`
- `PreorderWindow`

---

## Capabilities activables liées

Le domaine `availability` est lié aux capabilities suivantes :

- `stockTracking`
- `reservation`
- `backorders`
- `preorders`
- `multiLocationAvailability`
- `availabilityPolicies`
- `lowStockSignals`

### Effet si `stockTracking` est activée

Le domaine suit explicitement une quantité disponible ou assimilée.

### Effet si `stockTracking` est désactivée

Le domaine reste capable de porter une disponibilité binaire ou politique, sans logique quantitative détaillée.

### Effet si `reservation` est activée

Le domaine peut réserver temporairement une part de disponibilité dans des flux comme la commande ou le checkout.

### Effet si `backorders` est activée

Le domaine peut autoriser certains achats malgré un niveau de disponibilité quantitative insuffisant, selon politique.

### Effet si `preorders` est activée

Le domaine peut exposer une disponibilité future structurée.

### Effet si `multiLocationAvailability` est activée

Le domaine peut porter une disponibilité plus riche selon plusieurs localisations ou sources.

### Effet si `availabilityPolicies` est activée

Le domaine distingue plusieurs règles de vendabilité selon contexte, type d’offre ou stratégie commerciale.

### Effet si `lowStockSignals` est activée

Le domaine produit des signaux utiles à l’exploitation ou à l’admin.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

Le domaine couvre :

- disponibilité simple ;
- état vendable / non vendable ;
- logique minimale de blocage de vente.

Ce niveau convient à un projet simple ou à des offres peu contraintes.

### Niveau 2 — standard

Le domaine couvre en plus :

- suivi quantitatif simple ;
- signaux de stock faible ;
- meilleure articulation avec `cart` et `checkout`.

Ce niveau convient à un e-commerce physique standard.

### Niveau 3 — avancé

Le domaine couvre en plus :

- réservation ;
- backorders ;
- précommandes ;
- politiques plus fines ;
- meilleure cohérence entre intention d’achat et disponibilité réelle.

Ce niveau convient à un commerce plus mature ou plus exposé.

### Niveau 4 — expert / multi-contraintes

Le domaine couvre en plus :

- disponibilité multi-source ou multi-localisation ;
- politiques complexes ;
- arbitrages plus fins selon contexte ;
- exigences plus fortes d’observability, support et intégration.

Ce niveau n’est pas la valeur par défaut.

---

## Entrées

Le domaine reçoit principalement :

- des offres ou variantes identifiées ;
- des commandes d’ajustement de disponibilité ;
- des commandes de réservation ou libération ;
- des événements de création de commande ;
- des événements d’annulation ou d’expiration ;
- des signaux externes traduits via `integrations` si nécessaire.

---

## Sorties

Le domaine expose principalement :

- un état de disponibilité interne ;
- une quantité disponible / réservée si activée ;
- une décision de vendabilité ;
- des événements de changement de disponibilité ;
- des signaux utiles au panier, au checkout, à l’ordering et à l’admin.

---

## Dépendances vers autres domaines

Le domaine `availability` dépend de :

- `products`
- `stores`
- `orders`
- `audit`
- `observability`

Les domaines suivants dépendent de `availability` :

- `cart`
- `checkout`
- `orders`
- `analytics`
- `admin`
- `integrations`

---

## Dépendances vers providers / intégrations

Le domaine `availability` ne dépend pas d’un provider externe pour définir sa vérité interne.

Les systèmes externes éventuels de stock ou de synchronisation passent par `integrations`.
Le domaine `availability` :

- reçoit éventuellement un résultat externe traduit ;
- décide localement de son application ;
- ne laisse pas un payload brut externe devenir la vérité coeur.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `catalog_manager`
- `order_manager`

### Permissions

Exemples de permissions concernées :

- `availability.read`
- `availability.write`
- `availability.adjust`
- `availability.reserve`
- `products.read`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `availability.updated`
- `availability.reserved`
- `availability.released`
- `availability.depleted`
- `availability.backorder.allowed`
- `availability.preorder.opened`
- `availability.preorder.closed`
- `availability.low_stock`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `product.created`
- `product.updated`
- `order.created`
- `order.cancelled`
- `order.completed`
- `checkout.expired`
- `integration.stock.result.translated`

---

## Données sensibles / sécurité

Le domaine `availability` porte une donnée métier critique pour la cohérence commerciale.

Points de vigilance :

- une incohérence de disponibilité peut créer survente, refus erroné ou support coûteux ;
- la disponibilité ne doit jamais être librement fixée par le client ;
- les ajustements sensibles doivent être auditables ;
- les réservations et libérations doivent être cohérentes avec les flux avals.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une offre est vendable ou non ;
- pourquoi une réservation a été acceptée ou refusée ;
- pourquoi une quantité a changé ;
- pourquoi un backorder ou preorder a été autorisé ;
- d’où vient un ajustement.

### Audit

Il faut tracer :

- les ajustements manuels ;
- les changements de politique ;
- les réservations et libérations structurantes ;
- les corrections opératoires sensibles ;
- les imports ou synchronisations ayant un impact durable.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une offre a un état de disponibilité interne explicite ;
- une offre non vendable n’est pas traitée comme vendable par le coeur ;
- une réservation ne doit pas être appliquée deux fois pour la même intention ;
- une décrémentation ou libération suit une stratégie cohérente et traçable ;
- un système externe ne remplace jamais la vérité interne sans traduction et validation ;
- un projet simple ne porte pas d’emblée toute la complexité multi-location ou backorder si elle n’est pas activée.

---

## Lifecycle et gouvernance des données

### États principaux

Les états principaux utiles incluent :

- `AVAILABLE`
- `UNAVAILABLE`
- `RESERVED`
- `BACKORDERABLE`
- `PREORDERABLE`

Selon le modèle retenu, ces états peuvent être portés par un statut principal ou par une combinaison de statut + policy.

### Transitions autorisées

Exemples :

- `AVAILABLE -> UNAVAILABLE`
- `AVAILABLE -> RESERVED`
- `RESERVED -> AVAILABLE`
- `UNAVAILABLE -> BACKORDERABLE`
- `UNAVAILABLE -> PREORDERABLE`

### Transitions interdites

Exemples :

- réutiliser implicitement une réservation expirée ;
- considérer une disponibilité épuisée comme disponible sans ajustement explicite ;
- appliquer un résultat externe sans validation locale.

### Règles de conservation / archivage / suppression

- les ajustements significatifs doivent rester auditables ;
- les réservations et libérations utiles au diagnostic doivent rester compréhensibles ;
- la suppression physique n’est pas le comportement par défaut pour les traces significatives.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- ajustement durable de disponibilité ;
- réservation ;
- libération ;
- décrémentation liée à une commande lorsque la stratégie choisie l’exige ;
- écriture des événements `availability.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- projections admin ;
- analytics ;
- synchronisation externe ;
- notifications opératoires ;
- webhooks sortants.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les mutations critiques ;
- garde sur l’état courant ;
- contraintes ou règles empêchant la double réservation logique ;
- ordre stable de mutation lorsqu’une même offre est touchée plusieurs fois.

Les conflits attendus sont :

- double réservation ;
- ajustement manuel concurrent ;
- réservation et libération concurrentes ;
- synchro externe et mutation interne concurrentes ;
- double décrémentation logique.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `reserve-availability` : clé d’intention = `(offerId, reservationIntentId)`
- `release-availability` : clé d’intention = `(offerId, releaseIntentId)`
- `adjust-availability` : clé d’intention = `(offerId, adjustmentIntentId)`
- `apply-external-availability-result` : clé d’intention = `(providerName, externalEventId)`

Un retry ne doit jamais produire deux réservations ou deux décrémentations divergentes.

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `availability.updated`
- `availability.reserved`
- `availability.released`
- `availability.depleted`
- `availability.backorder.allowed`
- `availability.preorder.opened`
- `availability.preorder.closed`
- `availability.low_stock`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- synchro externe ;
- notification email ;
- webhook sortant ;
- analytics ;
- import ou export externe.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` pour disponibilité simple ;
- `M2` pour stock tracking standard ;
- `M3` avec réservations, backorders ou preorders ;
- `M4` pour multi-source ou règles très riches.

### Pourquoi

Le domaine `availability` est directement lié au risque de survente, d’indisponibilité erronée et de support coûteux.

### Points d’exploitation à surveiller

- écarts de disponibilité ;
- réservations non relâchées ;
- offres épuisées ;
- signaux low stock ;
- erreurs de synchro externe ;
- conflits de mutation.

---

## Impact coût / complexité

Le coût du domaine `availability` monte principalement avec :

- `stockTracking`
- `reservation`
- `backorders`
- `preorders`
- `multiLocationAvailability`
- la criticité de la synchro externe ;
- la précision attendue de l’observability.

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Déterminer si une offre est vendable
2. Réserver une disponibilité pour un flux de commande
3. Libérer une disponibilité après échec ou expiration
4. Ajuster la disponibilité d’une offre
5. Autoriser un backorder ou une preorder selon policy

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- offre introuvable ;
- disponibilité introuvable ;
- réservation dupliquée ;
- libération invalide ;
- ajustement concurrent ;
- payload externe ambigu ;
- policy incohérente ;
- surconsommation logique.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- le domaine s’appelle `availability`, pas `inventory` ;
- `stockTracking` est une capability, pas le nom du domaine ;
- la disponibilité est plus large que le stock ;
- le domaine reste coeur, mais sa sophistication est toggleable ;
- la vérité interne reste locale, même si des sources externes existent ;
- les mutations critiques sont transactionnelles, idempotentes et auditables ;
- la montée en complexité reste additive ;
- techniquement, le schéma de persistance par défaut regroupe la politique de disponibilité (`policy`) et les compteurs de stock dans le modèle physique unique `InventoryItem`, sans remettre en cause la séparation conceptuelle entre le domaine cœur availability et son satellite quantitatif inventory.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `availability` appartient au coeur du socle ;
- `inventory` n’est pas retenu comme nom du domaine principal ;
- le domaine couvre stock, réservation, backorder, preorder et vendabilité ;
- les systèmes externes de stock restent dans `integrations` ;
- la disponibilité influence directement `cart`, `checkout` et `orders` ;
- un projet simple peut rester en niveau 1 ou 2 sans porter toute la complexité avancée.
