# Domaine taxation

## Rôle

Le domaine `taxation` porte la fiscalité du socle.

Il décide quelles taxes et quelles accises s’appliquent dans un contexte donné, selon des règles explicites liées à la boutique, au pays, au type de produit, au type de client et aux capabilities actives.

## Responsabilités

Le domaine `taxation` prend en charge :

- les taxes standards
- les accises
- les règles de taxation par contexte
- les breakdowns fiscaux
- les règles dépendant du pays ou d’un contexte géographique pertinent
- les règles dépendant du type de produit ou d’autres caractéristiques explicitement exposées
- les règles dépendant du type de client si nécessaire
- la production d’un résultat fiscal exploitable par `pricing`, `checkout`, `orders` et `documents`

## Ce que le domaine ne doit pas faire

Le domaine `taxation` ne doit pas :

- porter le panier, qui relève de `cart`
- porter le catalogue source, qui relève de `products`
- porter la vendabilité contextuelle, qui relève de `sales-policy`
- porter les remises, qui relèvent de `discounts`
- porter l’orchestration monétaire finale, qui relève de `pricing`
- devenir un domaine comptable ou documentaire complet, ce qui relève partiellement de `documents`
- parler directement à un provider externe, ce qui relève de `integrations`

Le domaine `taxation` décide la logique fiscale applicable. Il ne remplace ni `pricing`, ni `documents`, ni `integrations`.

## Sous-domaines

- `tax` : fiscalité standard
- `excise` : accises et règles associées

## Entrées

Le domaine reçoit principalement :

- un contexte panier ou ligne monétaire à fiscaliser
- un contexte boutique
- un contexte client
- un contexte géographique
- un contexte produit ou catégorie produit si nécessaire
- les capabilities actives de la boutique
- des règles fiscales configurées

## Sorties

Le domaine expose principalement :

- un breakdown fiscal structuré
- des montants fiscaux monétaires exploitables par `pricing`
- une lecture explicite des taxes appliquées ou neutralisées
- une lecture explicite des accises appliquées ou neutralisées
- des raisons de non-application si nécessaire dans certains cas d’explication avancée

## Dépendances vers autres domaines

Le domaine `taxation` peut dépendre de :

- `cart` pour le contexte panier ou ligne
- `products` pour certaines caractéristiques nécessaires à la fiscalité
- `customers` pour le type de client ou certains profils fiscaux
- `store` pour le contexte boutique, les capabilities et éventuellement les paramètres fiscaux globaux
- `pricing` pour la représentation monétaire commune, sans lui déléguer la décision fiscale
- `audit` pour tracer les changements sensibles de règles fiscales
- `observability` pour expliquer pourquoi une taxe ou une accise a été appliquée ou non

Les domaines suivants peuvent dépendre de `taxation` :

- `pricing`
- `checkout`
- `orders`
- `documents`
- `analytics`
- `dashboarding`

## Capabilities activables liées

Le domaine `taxation` est directement lié à :

- `taxation`
- `exciseTax`

### Effet si `taxation` est activée

Le moteur fiscal devient exploitable et peut produire des montants de taxes dans les contextes concernés.

### Effet si `taxation` est désactivée

Le domaine reste structurellement présent, mais les taxes deviennent neutres ou à zéro selon la politique retenue.

### Effet si `exciseTax` est activée

Le domaine peut évaluer et exposer des accises en plus de la fiscalité standard.

### Effet si `exciseTax` est désactivée

Aucune accise ne doit être appliquée.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- éventuellement `order_manager` ou `marketing_manager` en lecture partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `taxation.read`
- `taxation.write`
- `pricing.read`
- `documents.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `taxation.rule.updated`
- `taxation.breakdown.changed`
- `taxation.excise_rule.updated`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `cart.updated`
- `customer.kind.changed`
- `product.updated`
- `store.capabilities.updated`
- événements de scheduling ou workflow si certaines règles fiscales dépendent d’une date d’effet explicite

Il doit toutefois rester maître de sa propre décision fiscale.

## Intégrations externes

Le domaine `taxation` ne doit pas parler directement aux systèmes externes.

Si certaines règles ou exports fiscaux doivent être synchronisés avec un système externe, cela doit passer par :

- `integrations`
- éventuellement `jobs`

Le domaine `taxation` reste la source de vérité interne de la décision fiscale appliquée dans le socle.

## Données sensibles / sécurité

Le domaine `taxation` porte une logique métier sensible et potentiellement réglementaire.

Points de vigilance :

- contrôle strict des droits d’écriture
- traçabilité des changements de règles fiscales
- cohérence entre capabilities actives et règles configurées
- centralisation des décisions fiscales
- interdiction de laisser d’autres domaines inventer leur propre calcul fiscal divergent

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une taxe a été appliquée ou non
- pourquoi une accise a été appliquée ou non
- quelle règle fiscale a été utilisée
- quel contexte géographique, client ou produit a influencé la décision
- si une neutralisation est due à une capability désactivée ou à une règle explicite

### Audit

Il faut tracer :

- la création d’une règle fiscale
- la modification d’une règle fiscale
- la création ou modification d’une règle d’accise
- les changements sensibles de politique fiscale

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `TaxRule` : règle de fiscalité standard
- `ExciseRule` : règle d’accise
- `TaxBreakdown` : détail fiscal structuré
- `TaxApplication` : application effective d’une taxe
- `ExciseApplication` : application effective d’une accise
- `TaxRejectionReason` : raison explicite de non-application si nécessaire

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- la fiscalité applicable est décidée par `taxation`
- les taxes et accises sont représentées avec des montants monétaires explicites
- `taxation` ne se confond pas avec `pricing`
- les autres domaines ne doivent pas recalculer localement des taxes divergentes
- une capability désactivée neutralise les mécanismes fiscaux associés sans supprimer la structure du domaine
- les montants fiscaux retenus pour la commande doivent ensuite être figés par les domaines aval appropriés

## Cas d’usage principaux

1. Calculer la fiscalité standard applicable à un panier ou une ligne
2. Calculer une accise si la capability correspondante est active
3. Exposer à `pricing` un breakdown fiscal structuré
4. Exposer à `checkout` une lecture claire des montants fiscaux estimés
5. Exposer à `orders` et `documents` les montants fiscaux figés retenus
6. Expliquer à l’admin pourquoi une taxe ou une accise a été appliquée ou non

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- règle fiscale introuvable ou invalide
- capability taxation ou exciseTax désactivée
- contexte géographique insuffisant ou incohérent
- contexte produit insuffisant pour appliquer une règle
- conflit entre règles fiscales configurées
- montant fiscal incohérent avec la politique monétaire du socle

## Décisions d’architecture

Les choix structurants du domaine sont :

- `taxation` porte la décision fiscale du socle
- `taxation` est distinct de `pricing`
- `taxation` est distinct de `documents`
- `taxation` consomme le contexte produit, client, boutique et panier sans absorber les autres domaines
- `taxation` expose un résultat structuré que `pricing` orchestre ensuite dans le calcul global
- les décisions fiscales doivent être explicables, auditables et cohérentes avec les capabilities actives

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la logique fiscale relève de `taxation`
- les accises relèvent de `taxation`
- l’orchestration monétaire finale relève de `pricing`
- les intégrations réglementaires ou documentaires externes relèvent de `integrations`
- `taxation` ne remplace ni `pricing`, ni `documents`, ni `cart`, ni `products`
