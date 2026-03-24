# Domaine `orders`

## Objectif

Ce document décrit le domaine `orders` dans la doctrine courante du socle.

Il précise :

- le rôle du domaine ;
- sa place dans la modularité du socle ;
- sa source de vérité ;
- ses capabilities activables ;
- ses niveaux éventuels ;
- ses objets métier ;
- ses invariants ;
- son cycle de vie ;
- ses règles de cohérence ;
- ses frontières externes ;
- ses implications de maintenance, d’exploitation et de coût.

Le domaine `orders` est structurant pour la réutilisabilité du socle, car il porte la commande durable.
Il doit permettre de couvrir :

- un commerce simple ;
- plusieurs modes de paiement ;
- plusieurs pays ;
- plusieurs documents ;
- des transitions de cycle de vie plus ou moins riches ;
- sans perdre la cohérence entre panier, checkout, paiement, stock et intégrations.

Le domaine `orders` ne doit jamais être pensé comme un simple enregistrement final.
Il porte la **vérité durable de l’achat validé**.

---

## Position dans la doctrine de modularité

Le domaine `orders` est classé comme :

- `domaine coeur non toggleable`

Le domaine est structurellement indispensable à tout commerce sérieux.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- la vérité durable de la commande ;
- une relation claire à son contexte de création ;
- des lignes figées ;
- des montants figés ;
- un lifecycle explicite ;
- une source de vérité pour les domaines aval ;
- une traçabilité des transitions majeures.

### Ce qui est activable / désactivable par capability

Le domaine `orders` est influencé par certaines capabilities transverses du socle, sans cesser d’exister :

- `guestCheckout`
- `customerCheckout`
- `discounts`
- `multiCountryTaxation`
- `electronicInvoicing`
- `returns`
- `partialRefund`
- `b2bCommerce`

### Ce qui relève d’un niveau

Le domaine ne varie pas principalement par “existence ou non”.
Il varie par richesse du workflow, des snapshots et des flux avals.

### Ce qui relève d’un provider ou d’une intégration externe

Relèvent de `integrations`, `webhooks`, `jobs` ou `documents`, et non du coeur de `orders` :

- ERP ;
- comptabilité externe ;
- emails ;
- transporteurs ;
- analytics externes ;
- webhooks sortants.

Le domaine `orders` garde la vérité interne de la commande durable.

---

## Rôle

Le domaine `orders` porte la commande durable du socle.

Il constitue la source de vérité interne pour :

- l’existence d’une commande validée ;
- l’identité métier de la commande ;
- ses lignes figées ;
- ses montants figés ;
- ses snapshots utiles ;
- son statut métier ;
- les transitions principales de son cycle de vie.

Le domaine est distinct :

- de `cart`, qui porte le panier runtime ;
- de `checkout`, qui porte la validation finale avant commande ;
- de `payments`, qui porte la vérité interne du paiement ;
- de `availability`, qui porte la disponibilité ;
- de `documents`, qui porte la production documentaire ;
- de `integrations`, qui diffuse ou synchronise vers l’extérieur.

---

## Responsabilités

Le domaine `orders` prend en charge :

- la création de la commande durable à partir d’un checkout valide ;
- le figement des lignes ;
- le figement des montants retenus ;
- le figement des snapshots nécessaires ;
- l’identité durable de la commande ;
- le cycle de vie métier de la commande ;
- la lecture durable de la commande ;
- l’alimentation des domaines avals ;
- la traçabilité des transitions principales.

---

## Ce que le domaine ne doit pas faire

Le domaine `orders` ne doit pas :

- porter le panier runtime ;
- recalculer librement le pricing, la fiscalité ou la disponibilité après coup ;
- devenir le domaine provider-specific du paiement ;
- porter les webhooks ou intégrations externes ;
- faire d’appel externe dans sa transaction principale ;
- devenir un fourre-tout mélangeant commande, paiement, logistique, comptabilité et documents.

---

## Source de vérité

Le domaine `orders` est la source de vérité pour :

- la commande durable ;
- son statut métier principal ;
- ses lignes figées ;
- ses montants et snapshots figés ;
- son rattachement durable aux autres flux du commerce.

Le domaine n’est pas la source de vérité pour :

- le panier actif ;
- le readiness du checkout ;
- le paiement interne ;
- la disponibilité quantitative ;
- les appels providers ;
- les documents externes ;
- les projections analytics.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `Order`
- `OrderLine`
- `OrderStatus`
- `OrderTotalsSnapshot`
- `OrderCustomerSnapshot`
- `OrderShippingSnapshot`
- `OrderOriginReference`

---

## Capabilities activables liées

Le domaine `orders` est influencé par les capabilities suivantes :

- `guestCheckout`
- `customerCheckout`
- `discounts`
- `multiCountryTaxation`
- `electronicInvoicing`
- `returns`
- `partialRefund`
- `b2bCommerce`

### Effet si `guestCheckout` est activée

Le domaine accepte des commandes issues de parcours invités.

### Effet si `customerCheckout` est activée

Le domaine peut figer un contexte client plus riche.

### Effet si `discounts` est activée

Le domaine fige des montants remisés validés en amont.

### Effet si `multiCountryTaxation` est activée

Le domaine fige des snapshots fiscaux plus riches.

### Effet si `electronicInvoicing` est activée

Le domaine doit exposer un état exploitable par la chaîne documentaire après commit.

### Effet si `returns` est activée

Le lifecycle aval de la commande peut être plus riche.

### Effet si `partialRefund` est activée

Le domaine reste cohérent avec des remboursements partiels pilotés via `payments`.

### Effet si `b2bCommerce` est activée

Le domaine peut figer un contexte entreprise ou facturation plus structuré.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

Le domaine couvre :

- création de commande ;
- lignes figées ;
- montants figés ;
- statut principal ;
- lecture durable simple.

### Niveau 2 — standard

Le domaine couvre en plus :

- snapshots plus riches ;
- meilleure articulation avec paiements et documents ;
- plus de cas de lecture et d’exploitation.

### Niveau 3 — avancé

Le domaine couvre en plus :

- transitions plus riches ;
- flux avals plus nombreux ;
- meilleure intégration avec documents, retours, B2B, comptabilité ou multi-pays.

### Niveau 4 — expert / réglementé / multi-contraintes

Le domaine couvre en plus :

- obligations documentaires et fiscales plus fortes ;
- exploitation plus lourde ;
- interactions plus nombreuses avec les domaines avals et les intégrations.

Le domaine reste le même, mais son environnement se densifie.

---

## Entrées

Le domaine reçoit principalement :

- un checkout prêt à être converti ;
- un panier convertible ;
- des montants consolidés et validés ;
- un contexte client / livraison / facturation validé ;
- des commandes internes de lecture ou transition ;
- des événements internes provenant de paiements, fulfillment ou documents.

---

## Sorties

Le domaine expose principalement :

- une commande durable ;
- des lignes figées ;
- un statut métier de commande ;
- un contexte figé exploitable par les domaines avals ;
- des événements métier liés à la commande.

---

## Dépendances vers autres domaines

Le domaine `orders` dépend de :

- `checkout`
- `cart`
- `pricing`
- `taxation`
- `payments`
- `availability`
- `audit`
- `observability`

Les domaines suivants dépendent de `orders` :

- `payments`
- `documents`
- `returns`
- `integrations`
- `webhooks`
- `analytics`
- `customer-support`

---

## Dépendances vers providers / intégrations

Le domaine `orders` ne parle pas directement aux systèmes externes.

Les usages externes partent via :

- `domain-events`
- `jobs`
- `integrations`
- `webhooks`

Le domaine `orders` reste la vérité interne de la commande.
Les systèmes externes la consomment ou s’y synchronisent après commit.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `customer_support`
- `finance_manager`

### Permissions

Exemples de permissions concernées :

- `orders.read`
- `orders.write`
- `orders.status.write`
- `payments.read`
- `documents.read`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `order.created`
- `order.status.changed`
- `order.cancelled`
- `order.completed`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `checkout.completed`
- `payment.authorized`
- `payment.captured`
- `payment.failed`
- `payment.refunded`
- `fulfillment.shipped`
- `fulfillment.delivered`
- `return.completed`

---

## Données sensibles / sécurité

Le domaine `orders` porte une donnée métier critique.

Points de vigilance :

- une commande ne doit être créée qu’à partir d’un contexte validé ;
- les montants figés ne doivent pas être librement recalculés après coup ;
- les transitions de statut doivent être gardées ;
- les actions sensibles doivent être auditables ;
- les snapshots doivent rester cohérents avec le contexte validé au moment de la création.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une commande a été créée ;
- de quel checkout et de quel panier elle provient ;
- quels montants ont été figés ;
- quels snapshots ont été retenus ;
- pourquoi une transition de statut a été acceptée ou refusée ;
- si un incident vient du checkout, du paiement, du stock ou d’un flux aval.

### Audit

Il faut tracer :

- la création de commande ;
- les changements de statut sensibles ;
- les annulations ;
- les corrections manuelles ;
- les reprises opérateur ;
- les interactions structurantes avec les flux financiers ou documentaires.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une commande est créée à partir d’un checkout valide ;
- une commande possède une identité durable ;
- les lignes de commande sont figées à la création ;
- les montants retenus sont figés à la création ;
- la commande est la vérité durable de l’achat validé ;
- les domaines avals ne recréent pas une vérité concurrente ;
- le domaine `orders` ne dépend pas d’un provider externe pour valider son existence.

---

## Lifecycle et gouvernance des données

### États principaux

Le domaine `orders` porte un statut métier explicite.
Selon le modèle retenu, les états principaux incluent généralement :

- `DRAFT`
- `PENDING`
- `CONFIRMED`
- `COMPLETED`
- `CANCELLED`

Le détail exact peut être enrichi par le projet, mais doit rester gardé et lisible.

### Transitions autorisées

Exemples :

- `PENDING -> CONFIRMED`
- `PENDING -> CANCELLED`
- `CONFIRMED -> COMPLETED`
- `CONFIRMED -> CANCELLED` si les règles métier le permettent

### Transitions interdites

Exemples :

- `COMPLETED -> PENDING`
- `CANCELLED -> CONFIRMED` sans flux compensatoire explicite
- retour implicite à un état précédent sans raison métier formalisée

### Règles de conservation / archivage / suppression

- une commande n’est pas supprimée implicitement ;
- les lignes, montants et snapshots utiles restent lisibles ;
- l’archivage est préférable à la suppression physique ;
- la commande reste compréhensible pour support, audit et exploitation.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- validation finale du checkout utilisé pour la création ;
- création de `Order` ;
- création des `OrderLine` ;
- figement des snapshots client, facturation et livraison ;
- figement des montants consolidés ;
- création du paiement interne initial lorsque la règle métier l’exige ;
- réservation ou décrémentation de stock liée à la création ;
- transition du panier source en `CONVERTED` ;
- écriture de `order.created` dans l’outbox.

Les transitions de statut sensibles doivent également être atomiques avec l’écriture de leurs événements correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- emails transactionnels ;
- génération documentaire ;
- synchronisation ERP ou comptable ;
- webhooks sortants ;
- analytics ;
- déclenchements logistiques ;
- projections secondaires.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- une seule conversion réussie pour un même contexte source ;
- transaction applicative unique sur la création de commande ;
- garde sur le statut de commande avant transition ;
- refus de créer une commande si le panier ou le checkout ne sont plus convertibles ;
- refus complet en cas de conflit stock ou de source incohérente.

Les conflits attendus sont :

- double soumission de checkout ;
- double conversion du même panier ;
- transition concurrente de statut ;
- conflit entre paiement, annulation et progression de commande ;
- création concurrente sur le même contexte source.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `create-order-from-checkout` : clé d’intention = `(checkoutId, orderCreationIntentId)`
- `change-order-status` : clé d’intention = `(orderId, targetStatus, statusChangeIntentId)`
- `cancel-order` : clé d’intention = `(orderId, cancelIntentId)`

Un retry sur la même intention ne doit jamais produire :

- deux commandes durables pour le même achat ;
- deux transitions de statut divergentes ;
- deux annulations incompatibles.

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `order.created`
- `order.status.changed`
- `order.cancelled`
- `order.completed`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- appel PSP externe ;
- email transactionnel ;
- webhook sortant ;
- synchronisation ERP / comptabilité ;
- génération documentaire externe ;
- déclenchement logistique externe ;
- analytics externes.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` pour un commerce simple ;
- `M2` dès que le volume, les paiements et les documents prennent de l’importance ;
- `M3` pour les contextes multi-pays, B2B, documentaires ou plus intégrés ;
- `M4` pour les contextes réglementés ou fortement contraints.

### Pourquoi

Le domaine `orders` est au centre de la vérité commerciale durable.
Plus il monte en richesse, plus il exige :

- observability ;
- audit ;
- compréhension des transitions ;
- rapprochement avec paiement et documents ;
- qualité de reprise et de support.

### Points d’exploitation à surveiller

- création de commandes ;
- échecs de conversion ;
- transitions de statut ;
- cohérence avec paiements ;
- cohérence avec stock ;
- cohérence avec documents et intégrations.

---

## Impact coût / complexité

Le coût du domaine `orders` monte principalement avec :

- la richesse des snapshots figés ;
- les interactions avec taxation, paiements et documents ;
- les workflows d’état plus riches ;
- les besoins B2B ;
- les contraintes documentaires ;
- les exigences de support et d’audit.

Lecture relative du coût :

- niveau 1 : `C2`
- niveau 2 : `C2` à `C3`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Créer une commande durable depuis un checkout valide
2. Figer lignes, montants et snapshots
3. Lire une commande et son contexte figé
4. Faire évoluer le statut métier de la commande
5. Alimenter les domaines avals via événements et lectures durables

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- checkout introuvable ;
- panier introuvable ou déjà converti ;
- incohérence entre checkout et panier ;
- conflit de stock ;
- tentative de double création ;
- transition de statut invalide ;
- désynchronisation avec paiements ;
- tentative de mutation d’une commande déjà finalisée ou annulée.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `orders` est un domaine coeur non toggleable ;
- la commande durable est créée à partir d’un checkout valide ;
- les lignes et montants sont figés ;
- le panier source est conservé comme `CONVERTED`, pas supprimé implicitement ;
- la création de commande est transactionnelle et idempotente ;
- les événements durables de commande sont écrits dans l’outbox ;
- les effets externes partent après commit ;
- la montée de richesse du domaine se fait sans changer sa nature.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `orders` porte la vérité durable de la commande ;
- la commande n’est ni le panier ni le checkout ;
- la création de commande exige un contexte validé ;
- la commande est figée, traçable et durable ;
- les intégrations externes consomment la commande après commit ;
- la suppression implicite de la commande ou de ses sources critiques n’est pas admise.
