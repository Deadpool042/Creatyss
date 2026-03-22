# Domaine returns

## Rôle

Le domaine `returns` porte les retours, remboursements métier liés au SAV et résolutions post-commande du socle.

Il gère les demandes de retour, leur instruction, leur résolution et leurs conséquences métier, sans confondre la commande, le paiement, la logistique d’exécution ou les documents associés.

## Responsabilités

Le domaine `returns` prend en charge :

- les demandes de retour
- les motifs de retour
- les états métier d’un retour
- l’acceptation ou le refus d’un retour
- les résolutions possibles d’un retour
- le lien entre un retour et une commande ou des lignes de commande
- la préparation des conséquences métier aval, comme un remboursement, un échange ou une action logistique
- la lecture consolidée du SAV post-commande

## Ce que le domaine ne doit pas faire

Le domaine `returns` ne doit pas :

- porter la commande durable, qui relève de `orders`
- porter le paiement lui-même, qui relève de `payments`
- porter l’exécution logistique réelle, qui relève de `fulfillment`
- porter les documents commerciaux ou fiscaux, qui relèvent de `documents`
- devenir un domaine support générique au sens ticketing large, ce qui relève de `support`
- parler directement aux systèmes externes, ce qui relève de `integrations`

Le domaine `returns` porte le retour métier et sa résolution. Il ne remplace ni `orders`, ni `payments`, ni `fulfillment`, ni `support`.

## Sous-domaines

- `requests` : demandes de retour
- `resolutions` : résolutions métier des retours

## Entrées

Le domaine reçoit principalement :

- une commande ou des lignes de commande issues de `orders`
- des demandes de création de retour
- des motifs et informations de retour
- des décisions métier d’acceptation, refus ou résolution
- des signaux internes utiles venant de `payments`, `fulfillment` ou `documents`
- des demandes de lecture de l’état d’un retour

## Sorties

Le domaine expose principalement :

- une demande de retour
- un état métier de retour
- une résolution de retour
- un rattachement explicite à une commande ou à des lignes de commande
- une lecture consolidée exploitable par `payments`, `documents`, `fulfillment`, `support`, `analytics` et l’admin

## Dépendances vers autres domaines

Le domaine `returns` peut dépendre de :

- `orders` pour la commande de référence
- `payments` pour certaines conséquences de remboursement, sans porter lui-même l’état complet du paiement
- `documents` pour certains liens avec avoirs ou documents aval
- `fulfillment` pour certains états logistiques utiles au retour
- `audit` pour tracer les changements sensibles
- `observability` pour expliquer les refus, blocages ou résolutions

Les domaines suivants peuvent dépendre de `returns` :

- `payments`
- `documents`
- `fulfillment`
- `support`
- `analytics`
- `dashboarding`
- `notifications`

## Capabilities activables liées

Le domaine `returns` est un domaine activable du socle.

Il est directement lié à :

- `returns`
- `auditTrail`
- `businessObservability`

### Effet si `returns` est activée

Le domaine devient exploitable et la boutique peut gérer des demandes de retour et leurs résolutions.

### Effet si `returns` est désactivée

Le domaine reste structurellement présent, mais aucune demande de retour ne doit être ouverte côté boutique.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `customer_support`
- `customer` pour ses propres demandes de retour selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `returns.read`
- `returns.write`
- `orders.read`
- `payments.read`
- `documents.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `return.requested`
- `return.accepted`
- `return.rejected`
- `return.resolution.changed`
- `return.closed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `order.created`
- `order.cancelled`
- `payment.refunded`
- `fulfillment.*` via un langage interne stabilisé si certains retours dépendent d’un état logistique
- `document.*` si certains avoirs ou documents doivent influencer la lecture du retour

Il doit toutefois rester maître de son propre cycle de vie métier.

## Intégrations externes

Le domaine `returns` ne doit pas parler directement aux systèmes externes.

Les synchronisations ou échanges avec :

- ERP
- systèmes logistiques
- outils SAV externes
- systèmes comptables

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `returns` reste la source de vérité interne du retour métier.

## Données sensibles / sécurité

Le domaine `returns` porte une donnée métier sensible, car il peut déclencher des effets financiers, logistiques et relationnels.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- validation stricte des demandes et résolutions
- protection des transitions de statut sensibles
- audit des décisions critiques
- séparation claire entre décision métier de retour et exécution aval

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un retour a été accepté ou refusé
- quel motif a été retenu
- quelle résolution est en vigueur
- si un blocage provient de la commande, du paiement, de la logistique ou d’une règle de retour

### Audit

Il faut tracer :

- la création d’une demande de retour
- les changements d’état sensibles
- les acceptations et refus
- les résolutions choisies
- les interventions manuelles importantes

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ReturnRequest` : demande de retour
- `ReturnReason` : motif de retour
- `ReturnStatus` : état métier du retour
- `ReturnResolution` : résolution retenue
- `OrderReturnLink` : rattachement entre retour et commande ou lignes de commande

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un retour est rattaché explicitement à une commande ou à des lignes de commande
- un retour possède un état métier explicite
- une résolution de retour est explicite lorsqu’elle existe
- `returns` ne se confond pas avec `payments`, `orders` ou `support`
- les autres domaines ne doivent pas recréer leur propre vérité divergente du retour métier
- les effets aval d’un retour passent par les domaines spécialisés concernés

## Cas d’usage principaux

1. Créer une demande de retour liée à une commande
2. Lire l’état d’un retour
3. Accepter ou refuser une demande de retour
4. Définir une résolution de retour
5. Déclencher ensuite les actions aval nécessaires via les domaines spécialisés
6. Exposer une lecture consolidée du SAV à l’admin, au support et aux autres domaines consommateurs

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- retour introuvable
- commande introuvable
- ligne de commande non éligible au retour
- motif invalide
- transition de statut invalide
- résolution incompatible avec l’état courant
- capability returns désactivée

## Décisions d’architecture

Les choix structurants du domaine sont :

- `returns` porte le retour métier du socle
- `returns` est distinct de `orders`
- `returns` est distinct de `payments`
- `returns` est distinct de `documents`
- `returns` est distinct de `fulfillment`
- les effets aval d’un retour sont délégués aux domaines spécialisés concernés
- les transitions sensibles de retour doivent être auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les retours relèvent de `returns`
- la commande durable relève de `orders`
- les remboursements relèvent de `payments`
- l’exécution logistique relève de `fulfillment`
- `returns` ne remplace ni `orders`, ni `payments`, ni `documents`, ni `support`, ni `integrations`
