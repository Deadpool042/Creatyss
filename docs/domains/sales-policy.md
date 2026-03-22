# Domaine sales-policy

## Rôle

Le domaine `sales-policy` porte la vendabilité contextuelle du socle.

Il décide si un produit ou une variante catalogue peut effectivement être vendu dans un contexte donné, en tenant compte des règles métier, du contexte client, du contexte boutique, des capabilities actives et des contraintes applicables.

## Responsabilités

Le domaine `sales-policy` prend en charge :

- la vendabilité contextuelle d’un item catalogue
- les règles liées au pays ou à la zone de vente
- les règles liées au type de client
- les règles liées aux groupes client si nécessaire
- les règles liées aux fenêtres temporelles de vente
- les règles liées aux capabilities actives de la boutique
- les règles catalogue qui conditionnent l’accès à la vente
- la production d’une lecture explicite de type vendable / non vendable / vendable sous conditions

## Ce que le domaine ne doit pas faire

Le domaine `sales-policy` ne doit pas :

- décrire le catalogue produit source, qui relève de `products`
- porter le stock quantitatif, qui relève de `inventory`
- calculer les prix, remises, taxes ou totaux, qui relèvent de `pricing`, `discounts` et `taxation`
- porter la logique complète du panier ou du checkout
- porter les intégrations externes ou les canaux eux-mêmes
- devenir un agrégat flou de règles métier sans structure explicite

Le domaine `sales-policy` décide la vendabilité. Il ne remplace ni `products`, ni `inventory`, ni `pricing`.

## Sous-domaines

- `sellability` : décision principale de vendabilité
- `customer-rules` : règles liées au type ou au groupe de client
- `country-rules` : règles liées au pays, à la zone ou au contexte géographique
- `catalog-rules` : règles liées à l’état catalogue ou à la politique de vente propre à l’item

## Entrées

Le domaine reçoit principalement :

- un produit ou une variante catalogue
- un contexte client
- un contexte boutique
- un contexte géographique
- un contexte temporel
- éventuellement une lecture de disponibilité quantitative issue de `inventory`
- les capabilities actives de la boutique

## Sorties

Le domaine expose principalement :

- une décision de vendabilité
- une liste de raisons explicites de refus ou de restriction
- une lecture structurée exploitable par `cart`, `checkout`, `channels`, `recommendations` ou d’autres domaines consommateurs

## Dépendances vers autres domaines

Le domaine `sales-policy` peut dépendre de :

- `products` pour lire le catalogue source
- `inventory` pour certaines contraintes quantitatives ou politiques de disponibilité
- `customers` pour le contexte client
- `store` pour le contexte boutique et les capabilities actives
- `audit` pour tracer certaines règles sensibles si nécessaire
- `observability` pour expliquer pourquoi un item est ou non vendable

Les domaines suivants peuvent dépendre de `sales-policy` :

- `cart`
- `checkout`
- `channels`
- `recommendations`
- `search`
- `orders`

## Capabilities activables liées

Le domaine `sales-policy` est particulièrement lié à :

- `professionalCustomers`
- `backorders`
- `preorders`
- `productChannels`

### Effet si `professionalCustomers` est activée

Le domaine peut faire dépendre la vendabilité de la nature professionnelle du client.

### Effet si `professionalCustomers` est désactivée

Les règles réservées aux clients professionnels deviennent inactives ou neutres.

### Effet si `backorders` ou `preorders` est activée

Le domaine peut tenir compte de politiques de vente élargies compatibles avec les états retournés par `inventory`.

### Effet si `productChannels` est activée

Le domaine peut participer à l’éligibilité d’un item à certains contextes de diffusion ou de vente.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `catalog_manager`

Selon le modèle retenu, certains rôles marketing ou contenus peuvent avoir une visibilité partielle sur certaines décisions, mais pas nécessairement leur gouvernance complète.

### Permissions

Exemples de permissions concernées :

- `catalog.read`
- `catalog.write`
- `inventory.read`
- `customers.read`
- `channels.read`
- `channels.write`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `sales_policy.rule.updated`
- `sales_policy.item.sellability.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `product.updated`
- `product.published`
- `inventory.stock.updated`
- `customer.kind.changed`
- `store.capabilities.updated`

Il doit toutefois rester maître de ses propres décisions de vendabilité.

## Intégrations externes

Le domaine `sales-policy` ne parle pas directement aux systèmes externes.

Si certaines règles de vente doivent être projetées vers :

- des canaux externes
- des flux catalogue
- des systèmes ERP

cela doit passer par :

- `channels`
- `integrations`
- éventuellement `jobs`

Le domaine `sales-policy` reste la source de vérité interne de la décision de vendabilité contextuelle.

## Données sensibles / sécurité

Le domaine `sales-policy` ne porte pas directement des secrets, mais il porte une logique métier sensible, car elle impacte la capacité réelle de vendre.

Points de vigilance :

- modifications réservées à des profils contrôlés
- traçabilité des changements de règles sensibles
- explicabilité des décisions de refus ou d’acceptation
- cohérence stricte avec les capabilities actives

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un item est vendable ou non
- quelle règle a bloqué la vente
- quel contexte client, géographique ou capability a influencé la décision
- quelle lecture de `inventory` ou de `products` a été consommée

### Audit

Il faut tracer :

- les modifications de règles de vendabilité
- les changements de politique sensibles
- certaines transitions majeures de statut de vendabilité si elles résultent d’une action humaine significative

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `SalesContext` : contexte de vente analysé
- `SellabilityDecision` : décision de vendabilité
- `SellabilityReason` : raison explicite de refus, restriction ou acceptation conditionnelle
- `SalesRule` : règle de politique de vente appliquée

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- la vendabilité contextuelle est décidée par `sales-policy`
- la vendabilité ne se confond pas avec le catalogue source
- la vendabilité ne se confond pas avec la seule quantité disponible
- une décision de vendabilité doit pouvoir être expliquée
- les autres domaines ne doivent pas inventer leur propre logique divergente de vendabilité
- les capabilities actives de la boutique conditionnent certaines décisions sans supprimer la structure du domaine

## Cas d’usage principaux

1. Déterminer si un produit est vendable dans une boutique donnée
2. Déterminer si un produit est vendable pour un client particulier ou professionnel
3. Déterminer si un item est vendable dans un pays donné
4. Refuser ou autoriser une vente en fonction d’un contexte métier explicite
5. Exposer à `cart` et `checkout` une lecture claire de la vendabilité
6. Exposer à `channels` une lecture de ce qui peut être diffusé ou vendu dans un contexte donné

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- produit introuvable
- contexte client incohérent
- pays ou zone non supporté
- règle de vendabilité invalide
- conflit entre capabilities et règle configurée
- item catalogue lisible mais non vendable dans le contexte demandé

## Décisions d’architecture

Les choix structurants du domaine sont :

- `sales-policy` porte la vendabilité contextuelle
- `sales-policy` est distinct de `products`
- `sales-policy` est distinct de `inventory`
- `sales-policy` ne calcule pas les prix ni les taxes
- les autres domaines consomment la décision de vendabilité au lieu de la redéfinir localement
- les décisions de vendabilité doivent être explicables via `observability`

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la vendabilité contextuelle relève de `sales-policy`
- le domaine `products` ne décide pas seul de la vendabilité
- le domaine `inventory` ne décide pas seul de la vendabilité
- `sales-policy` ne remplace ni `products`, ni `inventory`, ni `pricing`, ni `checkout`
- les décisions de vendabilité doivent rester explicites, traçables et cohérentes avec les capabilities actives
