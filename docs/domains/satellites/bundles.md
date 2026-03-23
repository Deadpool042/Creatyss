# Domaine bundles

## Rôle

Le domaine `bundles` porte les compositions commerciales structurées du socle.

Il organise les lots, ensembles, packs et compositions de vente regroupant plusieurs produits, variantes ou unités logiques dans une offre cohérente, sans absorber le catalogue source, la politique de prix, les remises, la vendabilité ou les règles de stock globales.

## Responsabilités

Le domaine `bundles` prend en charge :

- les bundles commerciaux structurés
- la composition d’un bundle en composants explicites
- les règles d’éligibilité ou de disponibilité d’un bundle au niveau métier
- les états de publication ou d’activation d’un bundle
- la lecture gouvernée des bundles actifs ou en préparation
- la base bundle consommable par `products`, `pricing`, `cart`, `checkout`, `sales-policy`, `dashboarding` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `bundles` ne doit pas :

- porter le catalogue produit source, qui relève de `products`
- porter la logique de pricing, qui relève de `pricing`
- porter les remises et coupons, qui relèvent de `discounts`
- porter la politique de vendabilité, qui relève de `sales-policy`
- porter l’inventaire global, qui relève de `inventory`
- devenir un simple champ booléen sur un produit sans langage métier explicite
- devenir un moteur générique de configuration produit illimité sans frontière claire avec `products`

Le domaine `bundles` porte les compositions commerciales structurées. Il ne remplace ni `products`, ni `pricing`, ni `discounts`, ni `sales-policy`, ni `inventory`.

## Sous-domaines

- `definitions` : définitions de bundles structurés
- `components` : composants d’un bundle et quantités associées
- `availability` : états d’activation ou de disponibilité bundle au niveau métier
- `policies` : règles de composition, d’éligibilité, de substitution ou d’exposition des bundles

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour de bundles
- des changements de composition, quantités ou composants
- des demandes de lecture d’un bundle ou d’une liste de bundles
- des contextes de boutique, canal, audience ou exposition commerciale
- des demandes d’évaluation de l’éligibilité ou de la disponibilité d’un bundle
- des signaux internes utiles à l’activation ou au blocage d’un bundle

## Sorties

Le domaine expose principalement :

- des bundles structurés
- des composants de bundle explicites
- des états d’activation ou de disponibilité bundle
- des lectures exploitables par `products`, `pricing`, `cart`, `checkout`, `sales-policy`, `dashboarding` et certaines couches d’administration
- des structures bundle prêtes à être utilisées par les couches UI ou domaines consommateurs autorisés

## Dépendances vers autres domaines

Le domaine `bundles` peut dépendre de :

- `products` pour les produits ou variantes composants
- `pricing` pour l’interprétation monétaire du bundle sans absorber sa responsabilité
- `sales-policy` pour filtrer la vendabilité du bundle dans un contexte donné
- `inventory` pour certaines disponibilités de composants si ce domaine existe séparément
- `approval` si certaines activations de bundles nécessitent validation préalable
- `workflow` si le cycle de vie d’un bundle suit un processus structuré
- `audit` pour tracer certains changements sensibles de composition ou d’activation
- `observability` pour expliquer pourquoi un bundle est actif, filtré, indisponible ou bloqué
- `stores` pour le contexte boutique et certaines politiques locales

Les domaines suivants peuvent dépendre de `bundles` :

- `products`
- `pricing`
- `cart`
- `checkout`
- `sales-policy`
- `dashboarding`
- `analytics`
- certaines couches storefront et d’administration

## Capabilities activables liées

Le domaine `bundles` est directement ou indirectement lié à :

- `bundles`
- `conversionFlows`
- `marketingCampaigns`

### Effet si `bundles` est activée

Le domaine devient pleinement exploitable pour exposer et gérer des compositions commerciales structurées.

### Effet si `bundles` est désactivée

Le domaine reste structurellement présent, mais aucun bundle enrichi non indispensable ne doit être exposé côté boutique.

### Effet si `conversionFlows` ou `marketingCampaigns` est activée

Le domaine peut être davantage consommé dans des logiques de mise en avant ou de merchandising, sans absorber la responsabilité des domaines consommateurs.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `catalog_manager`
- `marketing_manager` en lecture ou contribution partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `bundles.read`
- `bundles.write`
- `catalog.read`
- `pricing.read`
- `inventory.read`
- `sales_policy.read`
- `marketing.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `bundle.created`
- `bundle.updated`
- `bundle.activated`
- `bundle.deactivated`
- `bundle.component.updated`
- `bundle.availability.changed`
- `bundle.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `product.updated`
- `product.published`
- `pricing.rule.updated`
- `inventory.stock.changed` si ce langage interne est stabilisé
- `sales_policy.status.changed` si ce langage interne est stabilisé
- `store.capabilities.updated`
- `approval.approved`
- `workflow.completed`
- certaines actions administratives structurées d’activation ou de reconfiguration

Il doit toutefois rester maître de sa propre logique de composition commerciale.

## Intégrations externes

Le domaine `bundles` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être consommé par `integrations` ou par des couches d’exposition commerciale, mais :

- la vérité des bundles internes reste dans `bundles`
- les DTO providers externes restent dans `integrations`
- le pricing externe éventuel reste hors du domaine `bundles`

## Données sensibles / sécurité

Le domaine `bundles` manipule des compositions commerciales, des règles de disponibilité et des structures potentiellement sensibles pour la cohérence de l’offre.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre bundle, composants, prix et vendabilité
- protection des bundles non actifs ou non exposables
- limitation de l’exposition selon le rôle, le scope, le canal et le statut commercial
- audit des changements significatifs de composition, d’activation ou de politique bundle

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel bundle est en vigueur
- quels composants et quantités le composent
- quel statut bundle est appliqué
- pourquoi un bundle est actif, filtré, indisponible ou bloqué
- si un bundle n’est pas exposé à cause d’une capability off, d’un composant indisponible, d’une règle de vendabilité ou d’une autre règle applicable

### Audit

Il faut tracer :

- la création d’un bundle
- la modification significative d’une composition bundle
- l’activation ou la désactivation d’un bundle sensible
- les changements significatifs de politique ou d’éligibilité
- certaines consultations sensibles si le modèle final les retient explicitement

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `BundleDefinition` : définition structurée d’un bundle
- `BundleComponent` : composant explicite d’un bundle
- `BundleAvailability` : état de disponibilité ou d’activation bundle
- `BundlePolicy` : règle de composition, d’exposition ou d’éligibilité
- `BundleStatus` : état courant du bundle
- `BundleSubjectRef` : référence vers les produits ou variantes source concernés

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un bundle possède un identifiant stable et un statut explicite
- un composant de bundle est rattaché à un bundle explicite et à un objet source explicite
- `bundles` ne se confond pas avec `products`
- `bundles` ne se confond pas avec `pricing`
- `bundles` ne se confond pas avec `discounts`
- `bundles` ne se confond pas avec `sales-policy`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de composition bundle quand le cadre commun `bundles` existe
- un bundle non actif, non vendable ou composé d’éléments incompatibles ne doit pas être exposé hors règle explicite

## Cas d’usage principaux

1. Définir un pack de produits vendus ensemble
2. Modifier la composition d’un bundle et ses quantités
3. Activer ou désactiver un bundle commercial
4. Exposer un bundle dans le catalogue, le panier ou le checkout
5. Fournir à `pricing` ou `sales-policy` une lecture structurée de la composition bundle
6. Exposer à l’admin une lecture claire des bundles, composants et statuts disponibles

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- bundle introuvable
- composant introuvable ou incompatible
- composition invalide ou incohérente
- bundle non actif ou non exposable
- capability bundles désactivée
- tentative de lecture ou d’exposition non autorisée
- conflit entre plusieurs règles de disponibilité, de pricing ou de vendabilité

## Décisions d’architecture

Les choix structurants du domaine sont :

- `bundles` porte les compositions commerciales structurées du socle
- `bundles` est distinct de `products`
- `bundles` est distinct de `pricing`
- `bundles` est distinct de `discounts`
- `bundles` est distinct de `sales-policy`
- les domaines consommateurs lisent la vérité bundle via `bundles`, sans la recréer localement
- les compositions, activations et politiques sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les compositions commerciales structurées relèvent de `bundles`
- le catalogue source relève de `products`
- le pricing relève de `pricing`
- les remises relèvent de `discounts`
- la vendabilité relève de `sales-policy`
- `bundles` ne remplace ni `products`, ni `pricing`, ni `discounts`, ni `sales-policy`, ni `inventory`, ni `integrations`
