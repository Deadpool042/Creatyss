# Domaine payments

## Rôle

Le domaine `payments` porte le paiement du socle.

Il gère les intentions, autorisations, captures, remboursements et états de paiement liés à une commande, sans confondre la vérité métier de la commande avec la vérité technique d’un provider de paiement.

## Responsabilités

Le domaine `payments` prend en charge :

- les intentions de paiement
- les autorisations de paiement
- les captures de paiement
- les remboursements
- les statuts internes de paiement
- le rattachement d’un paiement à une commande
- la lecture consolidée de l’état de paiement côté métier
- la préparation d’une base exploitable par `orders`, `documents`, `returns`, `analytics` et `integrations`

## Ce que le domaine ne doit pas faire

Le domaine `payments` ne doit pas :

- porter la commande métier, qui relève de `orders`
- porter le panier runtime, qui relève de `cart`
- recalculer le pricing, qui relève de `pricing`
- recalculer les taxes ou remises, qui relèvent de `taxation` et `discounts`
- parler directement au provider comme vérité métier brute, ce qui relève de `integrations`
- devenir un domaine de fraude complet, ce qui relève de `fraud-risk`
- porter les documents comptables ou fiscaux, qui relèvent de `documents`

Le domaine `payments` porte l’état de paiement interne du socle. Il ne remplace ni `orders`, ni `integrations`, ni `documents`.

## Sous-domaines

- `intents` : intentions de paiement
- `captures` : captures effectives
- `refunds` : remboursements et leur état

## Entrées

Le domaine reçoit principalement :

- une commande valide issue de `orders`
- des montants figés issus du snapshot de commande
- des demandes de création d’intention de paiement
- des demandes de capture
- des demandes de remboursement
- des signaux internes stabilisés venant d’intégrations de paiement
- des demandes de lecture de l’état de paiement

## Sorties

Le domaine expose principalement :

- un état de paiement interne
- des intentions de paiement
- des captures
- des remboursements
- une lecture consolidée exploitable par les domaines métier et par l’admin
- des statuts internes indépendants du dialecte brut d’un provider

## Dépendances vers autres domaines

Le domaine `payments` peut dépendre de :

- `orders` pour la commande métier de référence
- `pricing` pour les montants figés déjà retenus en commande si certaines vérifications sont nécessaires
- `audit` pour tracer les opérations sensibles
- `observability` pour expliquer un échec, un refus ou un écart de paiement

Les domaines suivants peuvent dépendre de `payments` :

- `orders`
- `documents`
- `returns`
- `analytics`
- `dashboarding`
- `integrations`

## Capabilities activables liées

Le domaine `payments` est un domaine coeur, mais certaines capacités transverses peuvent influencer son comportement ou ses usages aval.

Exemples :

- `auditTrail`
- `businessObservability`
- `technicalMonitoring`

Le socle peut aussi prévoir plus tard des capacités spécifiques de moyens de paiement, sans remettre en cause la structure du domaine.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `customer_support`
- `customer` pour la lecture de ses propres paiements selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `payments.read`
- `orders.read`
- `orders.write`
- `returns.read`
- `documents.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `payment.intent.created`
- `payment.authorized`
- `payment.captured`
- `payment.failed`
- `payment.refund.created`
- `payment.refunded`
- `payment.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `order.created`
- `order.cancelled`
- signaux internes stabilisés issus des intégrations PSP
- `return.*` si certains remboursements dépendent d’un flux de retour ou de SAV

Il doit toutefois rester maître de son propre état de paiement interne.

## Intégrations externes

Le domaine `payments` ne doit pas parler directement aux PSPs dans sa logique coeur.

Les appels vers :

- PSP
- providers de paiement
- webhooks techniques de paiement

relèvent de :

- `integrations`
- `webhooks` si exposition sortante nécessaire
- `jobs` pour certaines reprises ou synchronisations

Le domaine `payments` reste la source de vérité interne des états de paiement métier du socle.

## Données sensibles / sécurité

Le domaine `payments` manipule des données hautement sensibles.

Points de vigilance :

- ne jamais exposer ou stocker indûment des données sensibles non nécessaires
- contrôle strict des droits de lecture et d’écriture
- protection des actions critiques comme capture et remboursement
- séparation stricte entre statut interne et payload provider brut
- audit renforcé des opérations sensibles

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un paiement est autorisé, capturé, refusé ou échoué
- quelle commande est concernée
- quel montant a été retenu
- si un problème vient du contexte commande, d’un provider, d’un flux de reprise ou d’une incohérence de statut

### Audit

Il faut tracer :

- la création d’une intention de paiement
- les captures
- les remboursements
- les changements de statut sensibles
- les interventions manuelles significatives

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `PaymentIntent` : intention de paiement
- `PaymentCapture` : capture effective
- `PaymentRefund` : remboursement
- `PaymentStatus` : statut interne de paiement
- `OrderPaymentLink` : rattachement entre commande et paiements

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un paiement est rattaché explicitement à une commande
- le statut interne de paiement est explicite
- `payments` ne confond pas le statut provider brut avec le statut métier interne
- les remboursements sont explicitement tracés
- `payments` ne redéfinit pas la vérité métier de la commande
- les autres domaines ne doivent pas recréer leur propre vérité divergente de l’état de paiement

## Cas d’usage principaux

1. Créer une intention de paiement pour une commande
2. Marquer un paiement comme autorisé
3. Marquer un paiement comme capturé
4. Lire l’état de paiement d’une commande
5. Créer un remboursement total ou partiel selon les règles retenues
6. Exposer une lecture consolidée du paiement à l’admin, au support et aux autres domaines consommateurs

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- paiement introuvable
- commande introuvable
- capture invalide
- remboursement invalide ou excédentaire
- incohérence entre montant de commande et paiement
- signal provider brut incompatible avec l’état interne attendu
- transition de statut paiement invalide

## Décisions d’architecture

Les choix structurants du domaine sont :

- `payments` porte l’état de paiement interne du socle
- `payments` est distinct de `orders`
- `payments` est distinct de `integrations`
- `payments` est distinct de `documents`
- les PSPs sont appelés via `integrations`, puis les signaux utiles sont remappés dans le langage interne du domaine
- les opérations critiques de paiement doivent être auditables et observables
- le statut interne de paiement doit rester maîtrisé par le socle

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- l’état de paiement relève de `payments`
- la commande durable relève de `orders`
- l’appel technique aux PSPs relève de `integrations`
- `payments` ne remplace ni `orders`, ni `documents`, ni `integrations`, ni `fraud-risk`
- les statuts internes de paiement restent distincts des statuts bruts provider
