# Domaine `checkout`

## Objectif

Ce document décrit le domaine `checkout` dans la doctrine courante du socle.

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

Le domaine `checkout` est structurant pour la réutilisabilité du socle, car il porte la validation finale avant commande.
Il doit permettre de couvrir des projets très différents :

- checkout simple ;
- checkout invité ;
- checkout client ;
- options de paiement variables ;
- livraison simple ou plus riche ;
- validation TVA, B2B ou règles plus avancées ;
- montée de sophistication sans changement de socle.

Le domaine `checkout` ne doit pas être un simple écran UI.
Il porte la **vérité interne de readiness avant commande**.

---

## Position dans la doctrine de modularité

Le domaine `checkout` est classé comme :

- `domaine coeur à capabilities toggleables`

Le domaine existe dans tous les projets e-commerce structurés.
En revanche, le niveau de validation, les parcours disponibles et les options exposées varient fortement.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- une validation finale côté serveur ;
- un état de readiness explicite ;
- une préparation cohérente des données de commande ;
- une relation claire avec le panier source ;
- un lifecycle explicite ;
- un rôle de frontière avant conversion en commande.

### Ce qui est activable / désactivable par capability

Le domaine `checkout` est lié aux capabilities suivantes :

- `guestCheckout`
- `customerCheckout`
- `shippingAddress`
- `billingAddress`
- `pickupPointDelivery`
- `manualReview`
- `fraudScreening`
- `b2bCheckout`
- `vatValidation`
- `paymentMode.oneShot`
- `paymentMode.authorizeCapture`
- `paymentMode.installments`
- `paymentMode.bnpl`

### Ce qui relève d’un niveau

Le domaine porte explicitement plusieurs niveaux de sophistication du checkout.

### Ce qui relève d’un provider ou d’une intégration externe

Relèvent de `integrations`, `payments`, `webhooks` ou `jobs`, et non du coeur de `checkout` :

- les appels PSP ;
- l’antifraude provider-specific ;
- les APIs transporteurs ;
- la notification email ;
- les webhooks sortants ;
- les outils externes de scoring ou de conformité.

Le domaine `checkout` garde la vérité interne de préparation et de validation.
Les providers externes ne la remplacent pas.

---

## Rôle

Le domaine `checkout` porte la validation finale du contexte d’achat avant la création de la commande.

Il constitue la source de vérité interne pour :

- l’état de readiness ;
- la complétude du contexte client / livraison / facturation ;
- la cohérence finale des informations nécessaires à la commande ;
- la liste des blocages ou avertissements ;
- la liste des options de paiement éligibles ;
- la préparation des données figées ensuite dans `orders`.

Le domaine est distinct :

- de `cart`, qui porte le panier runtime ;
- de `pricing`, qui porte les composantes de prix ;
- de `taxation`, qui porte la logique fiscale ;
- de `payments`, qui porte l’état de paiement interne ;
- de `orders`, qui porte la commande durable.

---

## Responsabilités

Le domaine `checkout` prend en charge :

- la création ou mise à jour du checkout rattaché à un panier ;
- la consolidation du contexte d’achat ;
- la validation finale avant commande ;
- l’évaluation de la readiness ;
- la liste des blocages ;
- la liste des avertissements ;
- la détermination des options de paiement éligibles ;
- la préparation des snapshots et montants destinés à `orders` ;
- le lifecycle du checkout ;
- la clôture logique du checkout lors de la conversion en commande.

---

## Ce que le domaine ne doit pas faire

Le domaine `checkout` ne doit pas :

- porter le panier runtime ;
- recalculer seul toute la logique de pricing ;
- recalculer seul toute la logique fiscale ;
- devenir un domaine provider-specific de paiement ;
- figer lui-même la commande durable ;
- envoyer des appels externes dans sa transaction de validation ;
- laisser l’UI décider qu’un checkout est valide sans validation serveur.

---

## Source de vérité

Le domaine `checkout` est la source de vérité pour :

- l’état de readiness avant commande ;
- les blocages et avertissements structurés ;
- la préparation du contexte final d’achat ;
- les options de paiement éligibles ;
- le statut du checkout dans son lifecycle ;
- la relation univoque entre panier et tentative de finalisation.

Le domaine n’est pas la source de vérité pour :

- le panier runtime ;
- la commande durable ;
- le paiement interne ;
- le stock ;
- la logique fiscale primaire ;
- les providers externes ;
- les documents.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `Checkout`
- `CheckoutStatus`
- `CheckoutReadiness`
- `CheckoutBlockingIssue`
- `CheckoutWarning`
- `CheckoutPaymentOption`
- `CheckoutPreparation`
- `CheckoutContextSnapshot`

---

## Capabilities activables liées

Le domaine `checkout` est lié aux capabilities suivantes :

- `guestCheckout`
- `customerCheckout`
- `shippingAddress`
- `billingAddress`
- `pickupPointDelivery`
- `manualReview`
- `fraudScreening`
- `b2bCheckout`
- `vatValidation`
- `paymentMode.oneShot`
- `paymentMode.authorizeCapture`
- `paymentMode.installments`
- `paymentMode.bnpl`

### Effet si `guestCheckout` est activée

Le checkout peut être rattaché à un panier invité.

### Effet si `customerCheckout` est activée

Le checkout peut exploiter un contexte client authentifié plus riche.

### Effet si `shippingAddress` est activée

Le checkout exige ou gère une adresse de livraison selon le type d’offre.

### Effet si `billingAddress` est activée

Le checkout gère une adresse de facturation distincte si le projet le requiert.

### Effet si `pickupPointDelivery` est activée

Le checkout peut intégrer une sélection de point relais ou équivalent.

### Effet si `manualReview` est activée

Le checkout peut exiger une validation intermédiaire ou un état de revue avant conversion.

### Effet si `fraudScreening` est activée

Le checkout peut intégrer une couche de vérification ou de signalement supplémentaire avant certaines conversions.

### Effet si `b2bCheckout` est activée

Le checkout prend en charge des règles B2B plus riches.

### Effet si `vatValidation` est activée

Le checkout peut exiger ou exploiter une validation TVA selon le contexte.

### Effet si des `paymentMode.*` sont activées

Le checkout peut exposer les options de paiement compatibles avec ces modes.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

Le domaine couvre :

- un checkout simple ;
- validation finale minimale sérieuse ;
- blocages structurés ;
- conversion standard vers commande ;
- options de paiement simples.

### Niveau 2 — standard

Le domaine couvre en plus :

- guest + customer checkout ;
- options de paiement plus variées ;
- plus de champs et de validations ;
- meilleur contrôle de readiness ;
- meilleure préparation du contexte final.

### Niveau 3 — avancé

Le domaine couvre en plus :

- validations plus fines ;
- B2B ou TVA plus structurés ;
- modes de paiement avancés éligibles ;
- revue manuelle ou signaux supplémentaires ;
- interactions plus riches avec taxation, shipping et payments.

### Niveau 4 — expert / réglementé / multi-contraintes

Le domaine couvre en plus :

- règles plus denses selon zones, boutique, type de client ou niveau de risque ;
- parcours fortement contraints ;
- dépendances plus fortes à des capabilities avancées ;
- exigences plus élevées d’observability et de support.

---

## Entrées

Le domaine reçoit principalement :

- un panier convertible ;
- des données client, de livraison et de facturation ;
- des résultats de pricing ;
- des résultats de taxation ;
- des données de disponibilité ou de vendabilité ;
- des capabilities de boutique ;
- des choix d’options de livraison ou de paiement ;
- des commandes de validation et de finalisation.

---

## Sorties

Le domaine expose principalement :

- un checkout persistant ;
- un état de readiness ;
- une liste de blocages ;
- une liste d’avertissements ;
- une liste d’options de paiement éligibles ;
- une préparation finale exploitable par `orders`.

---

## Dépendances vers autres domaines

Le domaine `checkout` dépend de :

- `cart`
- `products`
- `pricing`
- `taxation`
- `inventory` ou `availability`
- `customers`
- `stores`
- `payments` pour le modèle d’options de paiement
- `audit`
- `observability`

Les domaines suivants dépendent de `checkout` :

- `orders`
- `payments`
- `analytics`
- `documents`
- `integrations` indirectement via les événements produits

---

## Dépendances vers providers / intégrations

Le domaine `checkout` ne dépend pas directement d’un provider externe pour valider sa vérité interne.

Les usages d’antifraude, transport, paiement ou validation externe passent par :

- `integrations`
- `jobs`
- `payments`
- `webhooks`

Le domaine `checkout` ne prend jamais un résultat externe brut comme vérité finale du readiness.

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

- `checkout.read`
- `checkout.write`
- `checkout.validate`
- `checkout.complete`
- `orders.write`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `checkout.updated`
- `checkout.ready`
- `checkout.blocked`
- `checkout.completed`
- `checkout.expired`
- `checkout.cancelled`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `cart.updated`
- `cart.converted`
- `pricing.result.updated`
- `taxation.decision.produced`
- `inventory.stock.updated`
- `store.capabilities.updated`
- `customer.updated`

---

## Données sensibles / sécurité

Le domaine `checkout` porte une donnée métier critique.

Points de vigilance :

- validation exclusivement côté serveur ;
- pas de confiance dans l’état “prêt” envoyé par le client ;
- bonne protection des adresses, contacts et informations sensibles ;
- cohérence stricte entre panier, contexte client et options proposées ;
- gestion prudente des blocages et signaux de revue manuelle.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un checkout est prêt ou bloqué ;
- quels blocages s’appliquent ;
- quelles options de paiement ont été proposées ou rejetées ;
- pourquoi une conversion a été refusée ;
- quel contexte a servi à préparer la commande.

### Audit

Il faut tracer :

- les changements significatifs du checkout ;
- les validations sensibles ;
- les annulations ;
- les expirations ;
- les complétions ;
- les interventions support ou opérateur influant sur le readiness.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un checkout est rattaché à un panier explicite ;
- un checkout non prêt ne peut pas produire une commande ;
- un checkout complété ne redevient pas un checkout actif ordinaire ;
- le readiness est une décision serveur ;
- les options de paiement proposées sont cohérentes avec les capabilities activées ;
- le checkout prépare `orders` sans devenir lui-même la commande ;
- un projet simple n’est pas forcé dans un checkout avancé sans besoin métier réel.

---

## Lifecycle et gouvernance des données

### États principaux

Les états principaux du checkout sont :

- `ACTIVE`
- `READY`
- `COMPLETED`
- `EXPIRED`
- `CANCELLED`

### Transitions autorisées

Exemples :

- `ACTIVE -> READY`
- `READY -> COMPLETED`
- `ACTIVE -> EXPIRED`
- `READY -> EXPIRED`
- `ACTIVE -> CANCELLED`
- `READY -> CANCELLED`

### Transitions interdites

Exemples :

- `COMPLETED -> ACTIVE`
- `EXPIRED -> READY`
- `CANCELLED -> READY`
- mutation libre d’un checkout déjà complété

### Règles de conservation / archivage / suppression

- un checkout complété reste traçable ;
- un checkout expiré ou annulé reste compréhensible ;
- la suppression physique n’est pas le comportement par défaut ;
- les blocages et contextes utiles au support ou à l’audit doivent rester lisibles selon la politique retenue.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création initiale du checkout ;
- mise à jour cohérente de ses champs structurants ;
- production et persistance de l’état de readiness ;
- mise à jour de la liste des blocages et avertissements ;
- calcul et persistance des options de paiement éligibles ;
- transition `ACTIVE -> READY` ;
- transition `READY -> COMPLETED` ;
- transition vers `EXPIRED` ou `CANCELLED` ;
- écriture des événements `checkout.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- analytics ;
- webhooks sortants ;
- notifications ;
- synchronisations externes ;
- déclenchements secondaires d’intégration.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- garde sur le statut courant ;
- unicité logique du checkout actif par panier ;
- transaction applicative sur les transitions critiques ;
- revalidation serveur avant complétion ;
- refus de conversion si l’état du panier ou du contexte n’est plus cohérent.

Les conflits attendus sont :

- double soumission de checkout ;
- mise à jour concurrente du panier et du checkout ;
- conversion concurrente ;
- expiration et complétion concurrentes ;
- revue manuelle et complétion concurrentes.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `upsert-checkout-from-cart` : clé d’intention = `(cartId, checkoutIntentId)`
- `mark-checkout-ready` : clé d’intention = `(checkoutId, readinessIntentId, validationFingerprint)`
- `complete-checkout` : clé d’intention = `(checkoutId, completionIntentId)`
- `expire-checkout` : clé d’intention = `(checkoutId, expirationIntentId)`

Un retry sur la même intention ne doit jamais produire :

- deux checkouts concurrents ;
- deux complétions divergentes ;
- deux readiness incompatibles ;
- deux conversions de commande à partir du même checkout.

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `checkout.updated`
- `checkout.ready`
- `checkout.blocked`
- `checkout.completed`
- `checkout.expired`
- `checkout.cancelled`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- appel PSP externe ;
- antifraude provider-specific ;
- notification email ;
- webhook sortant ;
- intégration transporteur externe ;
- analytics externe.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` pour un checkout simple ;
- `M2` pour un checkout standard avec options plus riches ;
- `M3` dès que revue, B2B, TVA ou modes de paiement avancés entrent en jeu ;
- `M4` pour des contextes très contraints ou fortement réglementés.

### Pourquoi

Le domaine `checkout` concentre une forte part de la logique de validation avant commande.
Plus il monte en richesse, plus il exige :

- observability ;
- précision des blocages ;
- compréhension des refus ;
- traçabilité des transitions ;
- cohérence avec `cart`, `payments`, `taxation` et `orders`.

### Points d’exploitation à surveiller

- taux de blocage ;
- raisons de blocage ;
- abandons en checkout ;
- complétions ;
- désynchronisations entre panier et checkout ;
- incidents sur les options de paiement.

---

## Impact coût / complexité

Le coût du domaine `checkout` monte principalement avec :

- `guestCheckout` + `customerCheckout` combinés ;
- `pickupPointDelivery` ;
- `manualReview` ;
- `fraudScreening` ;
- `b2bCheckout` ;
- `vatValidation` ;
- l’activation de modes de paiement plus complexes ;
- la densité des règles de validation.

Lecture relative du coût :

- niveau 1 : `C1` à `C2`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Créer ou mettre à jour un checkout depuis un panier
2. Consolider les informations nécessaires à la commande
3. Déterminer si le checkout est prêt
4. Exposer les options de paiement éligibles
5. Produire un contexte final exploitable par `orders`
6. Compléter le checkout lors de la conversion en commande

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- panier introuvable ;
- checkout introuvable ;
- checkout non actif ;
- données de livraison ou facturation invalides ;
- options de paiement incohérentes ;
- panier non convertible ;
- blocage non résolu ;
- double soumission ;
- expiration concurrente ;
- tentative de complétion sur checkout non prêt.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `checkout` est un domaine coeur à capabilities toggleables ;
- le checkout porte une vérité de readiness explicite ;
- le readiness reste une décision serveur ;
- les options de paiement appartiennent au contexte du checkout, pas au provider brut ;
- le checkout prépare la commande sans devenir `orders` ;
- la complétion du checkout est transactionnelle et idempotente ;
- les intégrations externes restent hors transaction principale ;
- la montée de sophistication du checkout doit rester additive.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `checkout` appartient au coeur du socle ;
- le checkout n’est pas une simple UI, mais un agrégat métier ;
- le readiness est explicite ;
- les modes de paiement avancés sont toggleables ;
- le checkout ne parle pas directement aux providers ;
- la conversion vers `orders` exige une complétion claire et traçable.
