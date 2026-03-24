# Domaine `payments`

## Objectif

Ce document décrit le domaine `payments` dans la doctrine courante du socle.

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

Le domaine `payments` est structurant pour la réutilisabilité du socle, car il doit permettre de couvrir des projets très différents :

- paiement simple mono-provider ;
- plusieurs méthodes de paiement ;
- plusieurs providers ;
- authorize / capture ;
- remboursements simples ou partiels ;
- paiement en plusieurs fois ;
- BNPL ;
- règles différentes selon pays, boutique, devise ou type de commande.

Le socle ne doit pas être pensé “Stripe d’abord”.
Il doit être pensé **paiement interne du commerce d’abord**, avec des providers activables à la frontière.

---

## Position dans la doctrine de modularité

Le domaine `payments` est classé comme :

- `domaine coeur à capabilities toggleables`

Le domaine existe dans tous les projets e-commerce sérieux.
En revanche, ses capacités, ses méthodes, ses providers et son niveau de sophistication varient fortement d’un projet à l’autre.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- une vérité interne du paiement ;
- un langage métier stable pour l’état de paiement ;
- un rattachement clair entre paiement et commande ;
- des transitions de statut explicites ;
- des règles de cohérence sur captures, annulations et remboursements ;
- une séparation nette entre coeur du paiement et providers externes.

### Ce qui est activable / désactivable par capability

Le domaine `payments` est lié aux capabilities suivantes.

#### Providers

- `paymentProvider.stripe`
- `paymentProvider.paypal`
- `paymentProvider.alma`
- `paymentProvider.klarna`
- `paymentProvider.bankTransferProvider`
- `paymentProvider.manualOffline`

#### Méthodes

- `paymentMethod.card`
- `paymentMethod.paypalWallet`
- `paymentMethod.bankTransfer`
- `paymentMethod.applePay`
- `paymentMethod.googlePay`
- `paymentMethod.giftCard`
- `paymentMethod.storeCredit`

#### Modes

- `paymentMode.oneShot`
- `paymentMode.authorizeCapture`
- `paymentMode.installments`
- `paymentMode.bnpl`
- `paymentMode.partialCapture`
- `paymentMode.partialRefund`

### Ce qui relève d’un niveau

Le domaine porte explicitement plusieurs niveaux de sophistication de paiement.

### Ce qui relève d’un provider ou d’une intégration externe

Relèvent de `integrations` et non du coeur de `payments` :

- les appels API Stripe, PayPal, Alma, Klarna, etc. ;
- les DTO providers ;
- les callbacks bruts ;
- les signatures et vérifications provider-specific ;
- la livraison technique d’ordres sortants ;
- la traduction d’un résultat externe en résultat interne stabilisé.

Le domaine `payments` garde la vérité métier interne.
Les providers n’en sont pas la source.

---

## Rôle

Le domaine `payments` porte l’état de paiement interne du socle.

Il constitue la source de vérité interne pour :

- l’existence d’un paiement lié à une commande ;
- le statut de paiement retenu par le système ;
- les opérations internes comme capture, annulation, remboursement ou activation d’un plan de paiement ;
- les références externes utiles au rapprochement ;
- la cohérence entre intention de paiement, exécution et résultat métier interne.

Le domaine est distinct :

- de `orders`, qui porte la commande durable ;
- de `checkout`, qui prépare le contexte de choix et d’éligibilité ;
- de `pricing`, qui porte la structure de prix ;
- de `integrations`, qui parle aux PSPs ;
- de `webhooks`, qui gère les notifications sortantes génériques ;
- de `documents`, qui exploite éventuellement les résultats de paiement après commit.

---

## Responsabilités

Le domaine `payments` prend en charge :

- la création du paiement interne d’une commande ;
- la représentation de l’état de paiement du point de vue du socle ;
- le rattachement d’un paiement à une commande ;
- la distinction entre provider, méthode et mode de paiement ;
- la gestion des transitions de statut de paiement ;
- la gestion des opérations internes de capture, d’annulation et de remboursement ;
- la gestion des paiements partiels ou fractionnés si activés ;
- le rapprochement entre paiement interne et références providers ;
- la production d’événements métier liés au paiement ;
- la mise à disposition d’un état fiable pour `orders`, `documents`, `analytics`, `integrations` et `support`.

---

## Ce que le domaine ne doit pas faire

Le domaine `payments` ne doit pas :

- porter la commande durable ;
- recalculer les montants catalogue ou la logique de pricing ;
- devenir un simple miroir des statuts bruts d’un provider ;
- laisser un callback externe modifier directement le coeur sans traduction et validation ;
- contenir la logique API détaillée de Stripe, PayPal ou d’un autre PSP ;
- absorber la logique de checkout ;
- devenir un fourre-tout de conformité, comptabilité ou facturation.

---

## Source de vérité

Le domaine `payments` est la source de vérité pour :

- l’état de paiement interne d’une commande ;
- le mode de paiement retenu par le système ;
- les opérations internes appliquées au paiement ;
- les références providers utiles au rapprochement ;
- l’existence d’un plan de paiement ou d’échéances si activé.

Le domaine n’est pas la source de vérité pour :

- le prix catalogue ;
- la commande elle-même ;
- les statuts bruts providers ;
- le callback brut reçu ;
- la génération documentaire ;
- la comptabilité externe ;
- la notification sortante ;
- le choix initial des options de paiement côté checkout.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `Payment`
- `PaymentStatus`
- `PaymentProviderKind`
- `PaymentMethodKind`
- `PaymentModeKind`
- `PaymentOperation`
- `PaymentPlan`
- `Installment`
- `ProviderReference`
- `ProviderEventReference`
- `Refund`
- `Capture`

---

## Capabilities activables liées

Le domaine `payments` est lié aux capabilities suivantes :

### Providers

- `paymentProvider.stripe`
- `paymentProvider.paypal`
- `paymentProvider.alma`
- `paymentProvider.klarna`
- `paymentProvider.bankTransferProvider`
- `paymentProvider.manualOffline`

### Méthodes

- `paymentMethod.card`
- `paymentMethod.paypalWallet`
- `paymentMethod.bankTransfer`
- `paymentMethod.applePay`
- `paymentMethod.googlePay`
- `paymentMethod.giftCard`
- `paymentMethod.storeCredit`

### Modes

- `paymentMode.oneShot`
- `paymentMode.authorizeCapture`
- `paymentMode.installments`
- `paymentMode.bnpl`
- `paymentMode.partialCapture`
- `paymentMode.partialRefund`

### Effet si une capability provider est activée

Le domaine peut rattacher un paiement interne à ce provider et accepter des résultats traduits provenant de ce connecteur.

### Effet si une capability provider est désactivée

Aucun parcours de paiement ne doit exposer ce provider comme option possible, et aucun flux interne ne doit le supposer disponible.

### Effet si une capability méthode est activée

La méthode de paiement devient éligible côté `checkout` si les autres conditions le permettent.

### Effet si une capability méthode est désactivée

La méthode n’est pas proposée, même si un provider pourrait techniquement la supporter.

### Effet si une capability mode est activée

Le domaine supporte les opérations, règles et transitions nécessaires à ce mode de paiement.

### Effet si une capability mode est désactivée

Le domaine refuse ou ignore les parcours qui en dépendent.

---

## Niveaux de sophistication du domaine

Le domaine `payments` porte explicitement les niveaux suivants.

### Niveau 1 — essentiel

Le domaine couvre :

- un provider principal ;
- un mode simple ;
- un paiement one-shot ;
- un parcours de capture ou validation simple ;
- des remboursements simples si nécessaires.

Ce niveau convient à :

- projet simple ;
- coût d’entrée maîtrisé ;
- parcours de paiement standard.

### Niveau 2 — standard

Le domaine couvre :

- plusieurs méthodes de paiement ;
- plus d’un provider si besoin ;
- un meilleur rapprochement provider ;
- des opérations plus riches mais encore raisonnablement simples.

Ce niveau convient à :

- commerce standard évolutif ;
- besoin de PayPal en plus d’un provider principal ;
- parcours plus riche sans orchestration complexe.

### Niveau 3 — avancé

Le domaine couvre :

- authorize / capture ;
- remboursements avancés ;
- paiements partiels ;
- gestion plus structurée de plusieurs providers ;
- règles plus fines selon contexte.

Ce niveau convient à :

- commerce plus exposé ;
- logique financière plus riche ;
- exploitation plus active.

### Niveau 4 — expert / réglementé / multi-contraintes

Le domaine couvre :

- paiement en plusieurs fois ;
- BNPL ;
- orchestration plus avancée de plusieurs providers ;
- règles fortes selon pays, devise, boutique ou contexte ;
- exigences élevées d’observability, de rapprochement et de support.

Ce niveau n’est pas la valeur par défaut.
Il doit être activé pour un besoin réel.

---

## Entrées

Le domaine reçoit principalement :

- une commande existante ;
- un choix de méthode et de mode validé en amont ;
- un montant ou breakdown figé à payer ;
- des références providers traduites par `integrations` ;
- des commandes de capture, d’annulation, de remboursement ou d’activation d’un plan ;
- des résultats provider traduits ;
- des informations de capabilities activées au niveau de la boutique.

---

## Sorties

Le domaine expose principalement :

- un paiement interne rattaché à une commande ;
- un statut interne de paiement ;
- un historique d’opérations de paiement ;
- des références providers utiles au rapprochement ;
- un éventuel plan de paiement ou échéancier ;
- des événements métier liés au paiement ;
- un état exploitable par `orders`, `documents`, `analytics`, `integrations` et `support`.

---

## Dépendances vers autres domaines

Le domaine `payments` dépend de :

- `orders` pour la commande durable ;
- `checkout` pour le contexte de choix et d’éligibilité ;
- `pricing` pour les montants figés à payer ;
- `stores` pour les capabilities activées ;
- `audit` pour les transitions sensibles ;
- `observability` pour diagnostiquer les erreurs, refus ou écarts ;
- `domain-events` pour la diffusion durable des faits métier ;
- `integrations` pour les providers externes.

Les domaines suivants dépendent de `payments` :

- `orders`
- `documents`
- `integrations`
- `webhooks`
- `analytics`
- `customer-support`
- `returns` si activé

---

## Dépendances vers providers / intégrations

Le domaine `payments` ne parle pas directement aux PSPs dans sa logique coeur.

Les flux provider passent par `integrations`, qui prend en charge :

- les credentials ;
- les appels API ;
- les DTO externes ;
- les callbacks bruts ;
- la vérification provider-specific ;
- la traduction en résultats internes stables.

Le domaine `payments` :

- n’accepte pas un statut provider brut comme vérité interne ;
- n’applique pas directement un callback brut ;
- ne fait entrer dans le coeur qu’un résultat traduit, validé et dédupliqué.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `finance_manager`
- `order_manager`
- `customer_support`

### Permissions

Exemples de permissions concernées :

- `payments.read`
- `payments.write`
- `payments.capture`
- `payments.cancel`
- `payments.refund`
- `orders.read`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `payment.created`
- `payment.authorized`
- `payment.captured`
- `payment.failed`
- `payment.cancelled`
- `payment.refunded`
- `payment.partially_refunded`
- `payment.plan.activated`
- `payment.provider.reference.bound`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `order.created`
- `order.cancelled`
- `checkout.completed`
- `integration.payment.intent.updated`
- `integration.payment.capture.succeeded`
- `integration.payment.capture.failed`
- `integration.payment.refund.succeeded`
- `integration.payment.refund.failed`
- `integration.payment.plan.activated`

---

## Données sensibles / sécurité

Le domaine `payments` porte une donnée métier hautement sensible.

Points de vigilance :

- une erreur de paiement peut produire un impact commercial, financier ou support fort ;
- les références providers doivent être protégées et correctement rapprochées ;
- les payloads providers ne doivent jamais fuiter tels quels dans le coeur ;
- les opérations de capture, annulation ou remboursement doivent être strictement encadrées ;
- les parcours avancés comme installments ou BNPL augmentent la surface de risque ;
- les logs doivent rester utiles sans exposer d’informations sensibles inutilement.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un paiement est dans un état donné ;
- quel provider, quelle méthode et quel mode ont été retenus ;
- pourquoi une opération a été acceptée, refusée ou rejetée ;
- si un callback externe a été traduit correctement ;
- si une capture, annulation ou un remboursement a été appliqué ;
- si un plan de paiement ou une échéance a été activé.

### Audit

Il faut tracer :

- la création du paiement interne ;
- les changements de statut ;
- les captures ;
- les annulations ;
- les remboursements ;
- les activations de plans de paiement ;
- les corrections manuelles ou reprises opérateur ;
- les changements structurants de configuration de paiement.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un paiement interne est rattaché à une commande existante ;
- le domaine `payments` reste la vérité interne du paiement ;
- un provider n’est pas une méthode de paiement ;
- une méthode n’est pas un mode commercial ;
- un statut provider brut ne remplace jamais un statut interne ;
- les transitions de statut sont explicites et gardées ;
- un remboursement, une capture ou une annulation laisse une trace structurée ;
- un plan de paiement reste cohérent avec le paiement auquel il est rattaché ;
- un projet simple ne subit pas la complexité des paiements avancés s’ils ne sont pas activés.

---

## Lifecycle et gouvernance des données

### États principaux

Les états principaux du paiement sont notamment :

- `PENDING`
- `AUTHORIZED`
- `CAPTURED`
- `FAILED`
- `CANCELLED`
- `REFUNDED`
- `PARTIALLY_REFUNDED`

Selon les objets secondaires :

- un plan de paiement peut être `ACTIVE`, `CANCELLED`, `COMPLETED` ;
- une opération de capture ou de remboursement peut être enregistrée, appliquée, échouée ou annulée selon le modèle retenu.

### Transitions autorisées

Exemples :

- `PENDING -> AUTHORIZED`
- `PENDING -> CAPTURED`
- `PENDING -> FAILED`
- `AUTHORIZED -> CAPTURED`
- `AUTHORIZED -> CANCELLED`
- `CAPTURED -> PARTIALLY_REFUNDED`
- `CAPTURED -> REFUNDED`
- `PARTIALLY_REFUNDED -> REFUNDED`

### Transitions interdites

Exemples :

- `REFUNDED -> CAPTURED`
- `FAILED -> AUTHORIZED` sans nouveau flux métier explicite
- `CANCELLED -> CAPTURED`
- retour implicite à un état précédent sans opération dédiée

### Règles de conservation / archivage / suppression

- un paiement n’est pas supprimé implicitement ;
- les références providers utiles au rapprochement restent conservées selon une politique explicite ;
- les remboursements, captures et annulations doivent rester auditables ;
- un paiement lié à une commande durable reste compréhensible dans le temps ;
- la suppression physique n’est pas le comportement par défaut.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création du paiement interne initial d’une commande ;
- rattachement d’un provider, d’une méthode et d’un mode retenus ;
- création d’un plan de paiement si le mode l’exige ;
- transition de statut d’un paiement ;
- écriture d’une capture, d’une annulation ou d’un remboursement ;
- éventuelle mise à jour corrélée d’un état de commande lorsque la règle métier l’exige ;
- écriture des events `payment.*` correspondants ;
- rattachement ou mise à jour des références provider retenues.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- appel PSP externe ;
- email transactionnel ;
- webhook sortant ;
- synchronisation comptable ;
- projection analytics ;
- notification support ;
- génération documentaire secondaire.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- une transaction applicative sur chaque mutation sensible ;
- une garde stricte sur le statut courant ;
- une déduplication des résultats providers par référence stable ;
- une traduction provider -> langage interne avant toute mutation métier ;
- une interdiction d’appliquer deux fois la même opération logique.

Les conflits attendus sont :

- callbacks dupliqués ;
- callbacks hors ordre ;
- double capture ;
- double remboursement ;
- demande opérateur concurrente ;
- activation concurrente d’un plan de paiement ;
- mismatch entre état interne et résultat externe reçu tardivement.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `record-provider-update` : clé d’intention = `(providerName, providerReference, providerEventId)`
- `capture-payment` : clé d’intention = `(paymentId, captureIntentId)`
- `cancel-payment` : clé d’intention = `(paymentId, cancelIntentId)`
- `refund-payment` : clé d’intention = `(paymentId, refundIntentId)`
- `activate-payment-plan` : clé d’intention = `(paymentId, paymentPlanId, activationIntentId)`

Un retry sur la même intention ne doit jamais produire :

- deux captures incompatibles ;
- deux annulations divergentes ;
- deux remboursements logiques distincts ;
- deux activations concurrentes du même plan.

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `payment.created`
- `payment.authorized`
- `payment.captured`
- `payment.failed`
- `payment.cancelled`
- `payment.refunded`
- `payment.partially_refunded`
- `payment.plan.activated`
- `payment.provider.reference.bound`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- appel PSP externe ;
- callback delivery sortant ;
- notification email ;
- synchronisation comptable ;
- projection analytics ;
- traitement documentaire externe.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` pour un paiement simple mono-provider et one-shot ;
- `M2` dès qu’il y a plusieurs méthodes ou plusieurs providers ;
- `M3` pour authorize/capture, remboursements avancés, règles plus fines ou dépendance plus forte au commerce ;
- `M4` pour BNPL, installments avancés, multi-contraintes ou contextes particulièrement sensibles.

### Pourquoi

Le domaine `payments` devient vite coûteux en support, en risque et en exploitation dès qu’il dépasse le paiement simple.

Plus le niveau monte, plus il exige :

- observability ;
- rapprochement fiable ;
- traçabilité ;
- discipline sur les callbacks ;
- gestion sérieuse des retries ;
- meilleure maîtrise des intégrations et incidents.

### Points d’exploitation à surveiller

- cohérence entre `orders` et `payments` ;
- duplication ou désordre des callbacks ;
- états intermédiaires non résolus ;
- captures ou remboursements échoués ;
- plans de paiement activés ;
- mismatch entre niveau de capability attendu et providers réellement branchés.

---

## Impact coût / complexité

Le coût du domaine `payments` monte principalement avec :

- le nombre de providers activés ;
- le nombre de méthodes proposées ;
- l’activation de `authorizeCapture` ;
- l’activation de `partialRefund` ;
- l’activation de `installments` ;
- l’activation de `bnpl` ;
- les règles d’éligibilité par pays, devise ou contexte ;
- la criticité du support, de l’audit et du rapprochement.

Lecture relative du coût :

- niveau 1 : `C1` à `C2`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Créer le paiement interne initial d’une commande
2. Rattacher le paiement à un provider, une méthode et un mode
3. Mettre à jour un paiement depuis un résultat provider traduit
4. Capturer un paiement autorisé
5. Annuler un paiement lorsque le mode le permet
6. Rembourser totalement ou partiellement un paiement
7. Activer et suivre un plan de paiement si la capability est active
8. Exposer un état fiable du paiement au reste du socle

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- commande introuvable ;
- paiement introuvable ;
- méthode ou mode non activé ;
- provider non activé ;
- callback dupliqué ;
- callback hors ordre ;
- transition de statut invalide ;
- tentative de double capture ;
- remboursement impossible ou incohérent ;
- activation de plan de paiement non autorisée ;
- mismatch entre niveau projet et sophistication réellement demandée.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `payments` est un domaine coeur à capabilities toggleables ;
- le domaine distingue explicitement provider, méthode et mode ;
- les PSPs restent à la frontière via `integrations` ;
- le statut interne de paiement reste distinct des statuts bruts providers ;
- les niveaux avancés comme installments et BNPL ne sont pas activés par défaut ;
- la complexité de paiement monte par niveaux et capabilities, pas par refonte du socle ;
- les opérations sensibles sont transactionnelles, auditables et idempotentes ;
- le domaine doit rester compréhensible aussi bien pour le build que pour le support et le coût ;
- le schéma de persistance de base condense les opérations simples de paiement (autorisation, capture, annulation) dans des champs temporels portés par `Payment` ; la création de tables de journal d'opérations dédiées est réservée aux niveaux de sophistication supérieurs ;
- les objets `PaymentPlan` et `Installment` ne font pas partie du schéma par défaut ; ils nécessitent une extension explicite du schéma, subordonnée à l'activation des capabilities `paymentMode.installments` ou `paymentMode.bnpl`.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `payments` appartient au coeur du socle ;
- Stripe n’est pas la doctrine du domaine, seulement un provider possible ;
- PayPal, installments, BNPL et autres capacités avancées sont toggleables ;
- provider, méthode et mode sont des concepts distincts ;
- les callbacks providers ne modifient jamais directement le coeur sans traduction ;
- la montée de sophistication du paiement doit rester additive et compatible avec un coût initial maîtrisé.
