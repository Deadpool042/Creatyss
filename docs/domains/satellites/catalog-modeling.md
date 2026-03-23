# Domaine catalog-modeling

## Rôle

Le domaine `catalog-modeling` porte la structuration conceptuelle du catalogue du socle.

Il organise les formes de modélisation produit nécessaires au catalogue, comme les familles, types, attributs structurants, options, compatibilités, axes de variation ou autres dimensions de modélisation, sans absorber les produits publiés eux-mêmes, les bundles, le pricing, la vendabilité ou la logique de contenu éditorial.

## Responsabilités

Le domaine `catalog-modeling` prend en charge :

- les modèles de structuration du catalogue
- les types ou familles de produits
- les attributs structurants du catalogue
- les axes de variation conceptuels
- les options ou dimensions de modélisation du catalogue
- les compatibilités ou relations structurelles entre objets catalogues si le modèle retenu le prévoit
- la lecture gouvernée de la structure catalogue applicable
- la base de modélisation consommable par `products`, `bundles`, `pricing`, `sales-policy`, `dashboarding` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `catalog-modeling` ne doit pas :

- porter les produits publiés, qui relèvent de `products`
- porter les bundles commerciaux, qui relèvent de `bundles`
- porter le pricing, qui relève de `pricing`
- porter les remises, qui relèvent de `discounts`
- porter la vendabilité, qui relève de `sales-policy`
- porter la logique éditoriale des pages ou contenus, qui relève d’autres domaines
- devenir un méta-modèle théorique illimité déconnecté des besoins métier réels du catalogue

Le domaine `catalog-modeling` porte la structure conceptuelle du catalogue. Il ne remplace ni `products`, ni `bundles`, ni `pricing`, ni `sales-policy`.

## Sous-domaines

- `product-types` : types, familles ou formes de produits
- `attributes` : attributs structurants du catalogue
- `variation-axes` : axes ou dimensions conceptuelles de variation
- `compatibility` : relations structurelles ou compatibilités entre objets catalogue
- `policies` : règles de modélisation, de validation ou d’exposition de la structure catalogue

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour de types ou familles de catalogue
- des changements d’attributs structurants ou d’axes de variation
- des demandes de lecture de la structure catalogue applicable
- des demandes de vérification de cohérence d’un modèle catalogue
- des contextes de boutique, domaine produit, usage ou politique locale
- des signaux internes utiles à la validation ou à l’évolution du modèle catalogue

## Sorties

Le domaine expose principalement :

- des types ou familles de produits structurés
- des attributs et axes de variation structurants
- des règles de compatibilité ou de cohérence structurelle
- des lectures exploitables par `products`, `bundles`, `pricing`, `sales-policy`, `dashboarding` et certaines couches d’administration
- des structures de modélisation prêtes à être consommées par les domaines catalogue autorisés

## Dépendances vers autres domaines

Le domaine `catalog-modeling` peut dépendre de :

- `stores` pour le contexte boutique et certaines politiques locales de modélisation
- `approval` si certaines évolutions de modèle nécessitent validation préalable
- `workflow` si certaines évolutions du modèle suivent un processus structuré
- `audit` pour tracer certains changements sensibles de structure catalogue
- `observability` pour expliquer pourquoi un modèle, un attribut ou une compatibilité est accepté, filtré ou invalide

Les domaines suivants peuvent dépendre de `catalog-modeling` :

- `products`
- `bundles`
- `pricing`
- `sales-policy`
- `dashboarding`
- `analytics`
- certaines couches storefront et d’administration

## Capabilities activables liées

Le domaine `catalog-modeling` n’est pas une capability métier optionnelle au sens strict du noyau, mais il devient particulièrement important dès qu’un catalogue riche, variable ou typé est administré.

Exemples de capabilities liées :

- `bundles`
- `multiLanguage`
- `marketingCampaigns`

### Règle

Le domaine `catalog-modeling` reste structurellement présent même si le catalogue reste simple.

Il constitue le cadre commun de structuration conceptuelle du catalogue, même dans une V1 sobre.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `catalog_manager`
- `marketing_manager` en lecture partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `catalog_modeling.read`
- `catalog_modeling.write`
- `catalog.read`
- `pricing.read`
- `sales_policy.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `catalog_model.created`
- `catalog_model.updated`
- `catalog_attribute.updated`
- `catalog_variation_axis.updated`
- `catalog_compatibility.updated`
- `catalog_model.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `store.capabilities.updated`
- `approval.approved`
- `workflow.completed`
- certaines actions administratives structurées d’évolution du modèle catalogue

Il doit toutefois rester maître de sa propre logique de structuration conceptuelle.

## Intégrations externes

Le domaine `catalog-modeling` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être consommé par `integrations` ou par des couches d’administration pour projeter la structure catalogue vers d’autres systèmes, mais :

- la vérité de modélisation interne reste dans `catalog-modeling`
- les DTO providers externes restent dans `integrations`
- les produits publiés restent dans `products`

## Données sensibles / sécurité

Le domaine `catalog-modeling` manipule des structures de catalogue sensibles pour la cohérence métier et la stabilité de l’administration produit.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre structure conceptuelle, produit publié, prix et vendabilité
- protection des changements structurants susceptibles d’impacter fortement le catalogue
- limitation de l’exposition selon le rôle, le scope et le besoin métier
- audit des changements significatifs de types, attributs, axes ou compatibilités

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel modèle catalogue est en vigueur
- quels types, attributs ou axes de variation sont actifs
- pourquoi une structure est acceptée, filtrée ou invalide
- si une évolution de modèle est bloquée à cause d’une policy, d’une approval manquante, d’une incompatibilité ou d’une règle applicable

### Audit

Il faut tracer :

- la création d’un type ou modèle catalogue sensible
- la modification significative d’un attribut structurant
- la modification d’un axe de variation ou d’une compatibilité importante
- certaines consultations sensibles si le modèle final les retient explicitement
- certaines évolutions manuelles importantes de la structure catalogue

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `CatalogModel` : structure conceptuelle du catalogue
- `ProductTypeDefinition` : type ou famille de produit structurante
- `CatalogAttributeDefinition` : attribut structurant du catalogue
- `CatalogVariationAxis` : axe conceptuel de variation
- `CatalogCompatibilityRule` : règle de compatibilité ou de relation structurelle
- `CatalogModelPolicy` : règle de modélisation ou de validation

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un type ou modèle catalogue possède un identifiant stable et une signification explicite
- un attribut structurant ou un axe de variation est défini dans un cadre de modèle explicite
- `catalog-modeling` ne se confond pas avec `products`
- `catalog-modeling` ne se confond pas avec `bundles`
- `catalog-modeling` ne se confond pas avec `pricing`
- `catalog-modeling` ne se confond pas avec `sales-policy`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de structure catalogue quand le cadre commun `catalog-modeling` existe
- une structure catalogue invalide ou incohérente ne doit pas être admise comme base stable pour les domaines consommateurs

## Cas d’usage principaux

1. Définir une famille ou un type de produit structurant
2. Définir un attribut catalogue partagé
3. Définir un axe de variation conceptuel
4. Vérifier la cohérence d’une structure catalogue avant usage par `products`
5. Fournir à `pricing`, `bundles` ou `sales-policy` une lecture fiable de la structure catalogue applicable
6. Exposer à l’admin une lecture claire des types, attributs et axes structurants disponibles

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- modèle catalogue introuvable
- type produit introuvable ou incohérent
- attribut invalide ou incompatible
- axe de variation contradictoire
- compatibilité structurelle invalide
- tentative d’évolution du modèle non autorisée
- permission ou scope insuffisant
- conflit entre plusieurs règles de modélisation ou de validation

## Décisions d’architecture

Les choix structurants du domaine sont :

- `catalog-modeling` porte la structure conceptuelle du catalogue du socle
- `catalog-modeling` est distinct de `products`
- `catalog-modeling` est distinct de `bundles`
- `catalog-modeling` est distinct de `pricing`
- `catalog-modeling` est distinct de `sales-policy`
- les domaines consommateurs lisent la vérité structurelle via `catalog-modeling`, sans la recréer localement
- les types, attributs, axes et compatibilités sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la structure conceptuelle du catalogue relève de `catalog-modeling`
- les produits publiés relèvent de `products`
- les bundles relèvent de `bundles`
- le pricing relève de `pricing`
- la vendabilité relève de `sales-policy`
- `catalog-modeling` ne remplace ni `products`, ni `bundles`, ni `pricing`, ni `sales-policy`, ni `integrations`
