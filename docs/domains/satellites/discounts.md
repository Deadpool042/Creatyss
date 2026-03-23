# Domaine discounts

> **Statut documentaire** : satellite de `pricing`.
> `discounts` documente les capabilities de remises et promotions portées par le domaine coeur [`core/pricing.md`](../core/pricing.md).
> Tant qu'il n'existe pas de moteur promotionnel séparé et autonome, ce sujet reste subordonné à `pricing`, pas un domaine de premier rang indépendant.

## Rôle

Le domaine `discounts` porte les remises, promotions et mécanismes de réduction commerciale du socle.

Il décide quelles réductions sont applicables dans un contexte donné, selon des règles explicites de priorité, de cumul, de ciblage client, de volume, de période ou de coupon.

## Responsabilités

Le domaine `discounts` prend en charge :

- les remises automatiques
- les promotions datées
- les coupons
- les remises client spécifiques
- les remises par groupe client
- les remises volume ou quantité
- la logique de cumul ou d’exclusion entre remises
- les priorités entre règles de réduction
- la production d’un résultat de discount exploitable par `pricing`, `checkout`, `orders` et `documents`

## Ce que le domaine ne doit pas faire

Le domaine `discounts` ne doit pas :

- porter le panier, qui relève de `cart`
- porter le catalogue source, qui relève de `products`
- porter la vendabilité contextuelle, qui relève de `sales-policy`
- porter la fiscalité, qui relève de `taxation`
- porter l’orchestration monétaire finale, qui relève de `pricing`
- devenir un fourre-tout marketing qui absorberait `marketing`, `conversion` ou `crm`
- porter l’intégration technique de coupons externes, qui relèverait de `integrations`

Le domaine `discounts` décide les réductions applicables. Il ne remplace ni `pricing`, ni `marketing`, ni `cart`.

## Sous-domaines

- `rules` : règles de remises et promotions
- `coupons` : coupons et leur validité
- `evaluation` : moteur d’évaluation des remises applicables

## Entrées

Le domaine reçoit principalement :

- un contexte panier
- un contexte client
- un contexte boutique
- un contexte temporel
- les capabilities actives de la boutique
- éventuellement un ou plusieurs coupons saisis
- des règles de réduction configurées

## Sorties

Le domaine expose principalement :

- une liste de remises applicables
- une liste de remises refusées avec raisons explicites si nécessaire
- un total ou des montants de réduction monétaires exploitables par `pricing`
- une lecture structurée du résultat d’évaluation des discounts

## Dépendances vers autres domaines

Le domaine `discounts` peut dépendre de :

- `cart` pour le contexte panier runtime
- `customers` pour le type, le groupe ou le profil commercial du client
- `products` pour certaines règles ciblant des produits, variantes ou catégories
- `stores` pour le contexte boutique et les capabilities actives
- `pricing` pour certains helpers monétaires communs, sans lui déléguer la décision métier de remise
- `audit` pour tracer les changements sensibles de règles
- `observability` pour expliquer pourquoi une remise a été appliquée ou refusée

Les domaines suivants peuvent dépendre de `discounts` :

- `pricing`
- `checkout`
- `orders`
- `documents`
- `analytics`
- `dashboarding`

## Capabilities activables liées

Le domaine `discounts` est directement lié à :

- `discounts`
- `couponCodes`
- `customerSpecificPricing`
- `customerGroupPricing`
- `volumePricing`

### Effet si `discounts` est activée

Le moteur de remises devient exploitable et peut évaluer des réductions applicables.

### Effet si `discounts` est désactivée

Le domaine reste structurellement présent, mais aucune réduction n’est effectivement appliquée.

### Effet si `couponCodes` est activée

Les coupons peuvent être saisis, validés et pris en compte.

### Effet si `couponCodes` est désactivée

Aucun coupon ne doit être accepté.

### Effet si `customerSpecificPricing` est activée

Certaines remises ou prix spécifiques à un client peuvent être évalués.

### Effet si `customerGroupPricing` est activée

Le rattachement d’un client à un groupe peut influencer les remises applicables.

### Effet si `volumePricing` est activée

Des réductions liées à la quantité ou au volume peuvent être évaluées.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- éventuellement `catalog_manager` en lecture ou contribution partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `discounts.read`
- `discounts.write`
- `pricing.read`
- `customers.read`
- `catalog.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `discount.rule.created`
- `discount.rule.updated`
- `discount.coupon.created`
- `discount.coupon.updated`
- `discount.evaluation.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `cart.updated`
- `customer.group.changed`
- `customer.kind.changed`
- `product.updated`
- `store.capabilities.updated`
- événements de scheduling ou workflow si des promotions datées ou approuvées sont mises en place

Il doit toutefois rester maître de sa propre évaluation de remise.

## Intégrations externes

Le domaine `discounts` ne doit pas parler directement aux systèmes externes.

Si certaines promotions, coupons ou synchronisations viennent d’un système externe, cela doit passer par :

- `integrations`
- éventuellement `jobs`

Le domaine `discounts` reste la source de vérité interne de la décision de réduction applicable.

## Données sensibles / sécurité

Le domaine `discounts` porte une logique métier sensible car elle impacte directement les montants facturés.

Points de vigilance :

- contrôle strict des droits d’écriture
- protection des règles et coupons sensibles
- prévention des cumuls non autorisés
- aucune confiance dans des montants de réduction envoyés par le client
- cohérence entre capabilities actives et règles configurées

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une remise a été appliquée ou refusée
- quelle règle a gagné en cas de conflit
- si un coupon a été accepté ou refusé
- quel contexte client, produit ou quantité a influencé la décision
- quelle capability a neutralisé ou autorisé une remise

### Audit

Il faut tracer :

- la création d’une règle de remise
- la modification d’une règle de remise
- la création ou modification d’un coupon
- les changements sensibles de priorité, de cumul ou de fenêtre temporelle

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `DiscountRule` : règle de réduction
- `DiscountCoupon` : coupon exploitable par le moteur de remises
- `DiscountEvaluation` : résultat d’évaluation des remises applicables
- `DiscountApplication` : remise effectivement retenue
- `DiscountRejectionReason` : raison explicite de refus ou de non-applicabilité

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une remise applicable est toujours explicite
- un coupon n’est accepté que s’il est valide dans le contexte courant
- les cumuls et priorités sont définis explicitement
- `discounts` ne se confond pas avec `pricing`
- les autres domaines ne doivent pas recalculer localement leurs propres remises divergentes
- une capability désactivée neutralise les mécanismes associés sans supprimer la structure du domaine

## Cas d’usage principaux

1. Évaluer les remises automatiques applicables à un panier
2. Valider un coupon et l’appliquer si autorisé
3. Appliquer une remise client spécifique
4. Appliquer une remise par groupe client
5. Appliquer une remise volume si les conditions sont atteintes
6. Exposer à `pricing` un résultat de réduction structuré et cohérent
7. Exposer à l’admin une lecture claire des règles, priorités et conflits de remises

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- règle de remise introuvable
- coupon inconnu ou expiré
- capability discounts ou couponCodes désactivée
- conflit de remises incompatibles
- contexte client insuffisant pour une remise ciblée
- panier non éligible à la réduction demandée
- réduction incohérente avec la devise ou la politique monétaire du socle

## Décisions d’architecture

Les choix structurants du domaine sont :

- `discounts` porte la décision de réduction commerciale
- `discounts` est distinct de `pricing`
- `discounts` est distinct de `marketing`
- `discounts` consomme le contexte panier, client et catalogue sans absorber les autres domaines
- `discounts` expose un résultat structuré que `pricing` orchestre ensuite dans le calcul global
- les règles de cumul, de priorité et de coupon sont explicites et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les remises, promotions et coupons relèvent de `discounts`
- l’orchestration monétaire finale relève de `pricing`
- `discounts` ne remplace ni `cart`, ni `pricing`, ni `marketing`, ni `crm`
- les coupons relèvent de `discounts` au niveau métier
- les mécanismes de réduction sont pilotés par des capabilities explicites et doivent rester traçables et explicables
