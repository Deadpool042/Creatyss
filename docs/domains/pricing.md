# Domaine pricing

## Rôle

Le domaine `pricing` porte l’orchestration monétaire du socle.

Il assemble, dans une devise explicite et selon des règles d’arrondi centralisées, les différents composants monétaires utiles au commerce : sous-total, remises, livraison, taxes, accises et total estimé ou finalisé selon le contexte.

## Responsabilités

Le domaine `pricing` prend en charge :

- la représentation monétaire commune exploitable par le socle
- l’agrégation monétaire du panier ou d’un contexte commercial donné
- le sous-total
- le montant des remises retenues
- le sous-total remisé
- le coût de livraison estimé ou retenu selon le contexte
- les taxes
- les accises
- le total global estimé
- les règles d’arrondi centralisées
- la cohérence de devise entre les différents composants monétaires
- la production d’un résultat monétaire exploitable par `checkout`, `orders`, `documents`, `analytics` et les autres domaines consommateurs

## Ce que le domaine ne doit pas faire

Le domaine `pricing` ne doit pas :

- porter le panier, qui relève de `cart`
- décider quelles remises sont applicables, ce qui relève de `discounts`
- décider quelles taxes sont applicables, ce qui relève de `taxation`
- décider quelles méthodes de livraison sont disponibles, ce qui relève de `shipping`
- décider si un produit est vendable, ce qui relève de `sales-policy`
- figer à lui seul la commande finale, ce qui relève de `orders`
- devenir un fourre-tout de logique business déguisée en calcul monétaire

Le domaine `pricing` orchestre les montants. Il ne remplace pas les domaines qui décident d’où viennent ces montants.

## Sous-domaines

- `money` : primitives monétaires et lecture commune des montants
- `currency` : gestion de devise et cohérence de devise
- `totals` : agrégats monétaires globaux
- `evaluation` : assemblage et orchestration du pricing dans un contexte donné

## Entrées

Le domaine reçoit principalement :

- un contexte panier ou commande
- un sous-total issu du panier ou d’une lecture équivalente
- un résultat de remises issu de `discounts`
- une quote ou une sélection de livraison issue de `shipping`
- un breakdown fiscal issu de `taxation`
- un contexte boutique portant la devise et les capabilities
- éventuellement un contexte client si certains affichages ou politiques monétaires en dépendent

## Sorties

Le domaine expose principalement :

- un sous-total monétaire
- un montant total de remise
- un sous-total remisé
- un coût de livraison monétaire
- un breakdown fiscal monétaire
- un total estimé ou calculé
- une représentation cohérente des montants avec devise explicite
- une lecture structurée utilisable par `checkout`, `orders`, `documents`, `analytics` et l’UI

## Dépendances vers autres domaines

Le domaine `pricing` peut dépendre de :

- `cart` pour le contexte panier runtime
- `discounts` pour les réductions applicables
- `shipping` pour les quotes ou sélections de livraison
- `taxation` pour la fiscalité applicable
- `store` pour la devise de référence et les capabilities associées
- `customers` si certains profils influencent indirectement l’orchestration monétaire via des domaines amont
- `audit` pour tracer certains changements sensibles de politique monétaire
- `observability` pour expliquer les écarts ou décisions monétaires

Les domaines suivants peuvent dépendre de `pricing` :

- `checkout`
- `orders`
- `documents`
- `analytics`
- `dashboarding`
- `channels` pour certaines projections diffusables

## Capabilities activables liées

Le domaine `pricing` est directement ou indirectement lié à :

- `multiCurrency`
- `discounts`
- `couponCodes`
- `customerSpecificPricing`
- `customerGroupPricing`
- `volumePricing`
- `taxation`
- `exciseTax`

### Effet si `multiCurrency` est activée

Le domaine doit supporter explicitement plusieurs devises selon la politique de boutique et la configuration associée.

### Effet si `multiCurrency` est désactivée

Tous les montants runtime restent dans la devise de référence de la boutique.

### Effet si `discounts` est activée

Le domaine doit intégrer les montants de réduction retenus par `discounts`.

### Effet si `taxation` ou `exciseTax` est activée

Le domaine doit intégrer les breakdowns fiscaux et accises produits par `taxation`.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager` en lecture selon la politique retenue
- `order_manager` en lecture ou usage partiel selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `pricing.read`
- `discounts.read`
- `shipping.read`
- `taxation.read`
- `documents.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `pricing.evaluated`
- `pricing.total.changed`
- `pricing.currency.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `cart.updated`
- `discount.evaluation.changed`
- `shipping.quote.updated`
- `shipping.method.selected`
- `taxation.breakdown.changed`
- `store.currency.updated`
- `store.capabilities.updated`

Il doit toutefois rester maître de son propre calcul agrégé.

## Intégrations externes

Le domaine `pricing` ne doit pas parler directement aux systèmes externes comme source de vérité principale.

Si des taux de change, exports monétaires ou projections vers des systèmes externes sont nécessaires, cela doit passer par :

- `integrations`
- éventuellement `jobs`

Le domaine `pricing` reste la source de vérité interne de l’orchestration monétaire du socle.

## Données sensibles / sécurité

Le domaine `pricing` porte une donnée métier critique, car il influence directement les montants visibles et facturés.

Points de vigilance :

- aucune confiance dans un montant envoyé par le client
- centralisation des règles d’arrondi
- validation stricte de la cohérence de devise
- séparation nette entre calcul monétaire et décisions métier amont
- cohérence entre estimations runtime et montants figés en aval

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quels composants ont été agrégés dans un total
- quelle devise a été utilisée
- quelle politique d’arrondi a été appliquée
- pourquoi un total a changé
- si un écart provient de `discounts`, `shipping`, `taxation` ou d’un changement de devise

### Audit

Le domaine `pricing` n’a pas vocation à auditer chaque recalcul runtime.

En revanche, certains changements sensibles doivent pouvoir être tracés, notamment :

- les changements de configuration monétaire significatifs
- les changements de devise de référence
- les changements structurants de politiques d’arrondi si le modèle final les expose explicitement

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Money` : montant monétaire explicite avec devise
- `PricingBreakdown` : agrégat complet des composants monétaires
- `PricingTotals` : totaux globaux d’un contexte donné
- `MoneyRoundingPolicy` : politique d’arrondi appliquée
- `CurrencyContext` : contexte de devise utilisé pour le calcul

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un montant n’existe jamais sans devise explicite
- les montants sont représentés en unités mineures entières
- les arrondis sont centralisés et déterministes
- `pricing` ne décide pas des remises, taxes ou méthodes de livraison ; il les orchestre
- les autres domaines ne doivent pas recalculer localement des totaux divergents
- les montants figés en commande ou documents doivent dériver de la même logique monétaire de référence ou de ses résultats figés

## Cas d’usage principaux

1. Calculer le sous-total d’un panier
2. Intégrer les remises retenues par `discounts`
3. Intégrer une quote de livraison issue de `shipping`
4. Intégrer un breakdown fiscal issu de `taxation`
5. Produire un total estimé cohérent pour `checkout`
6. Exposer un breakdown monétaire structuré à `orders` et `documents`
7. Gérer la cohérence de devise et d’arrondi dans un contexte mono-devise ou multi-devises

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- devise absente ou invalide
- mélange incohérent de montants de devises différentes
- composant monétaire manquant ou incompatible
- politique d’arrondi invalide
- capability multiCurrency désactivée alors qu’une conversion est demandée
- total incohérent à cause d’une entrée amont invalide ou contradictoire

## Décisions d’architecture

Les choix structurants du domaine sont :

- `pricing` porte l’orchestration monétaire du socle
- `pricing` est distinct de `cart`
- `pricing` est distinct de `discounts`
- `pricing` est distinct de `taxation`
- `pricing` est distinct de `shipping`
- les règles d’arrondi sont centralisées dans `pricing` ou une couche monétaire dédiée du domaine
- les autres domaines fournissent des composants monétaires ou des décisions métier, puis `pricing` produit l’agrégat cohérent

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- l’orchestration monétaire relève de `pricing`
- les arrondis relèvent d’une logique centralisée portée par `pricing`
- `pricing` ne décide pas des discounts, taxes ou méthodes de livraison
- la devise de référence de boutique est portée par `store`, puis consommée par `pricing`
- `pricing` ne remplace ni `cart`, ni `discounts`, ni `taxation`, ni `shipping`, ni `orders`
