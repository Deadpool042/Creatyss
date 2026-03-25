# Modélisation du catalogue

## Rôle

Le domaine `catalog-modeling` porte la structure conceptuelle du catalogue.

Il définit :

- ce qu’est un modèle catalogue du point de vue du système ;
- comment sont structurés les types, familles, attributs, axes de variation et relations de compatibilité ;
- comment cette structure est exposée aux domaines consommateurs ;
- comment ce domaine se distingue des produits publiés, des bundles commerciaux, du pricing, de la vendabilité et du contenu éditorial ;
- comment le système reste maître de sa vérité interne de modélisation catalogue.

Le domaine existe pour fournir une représentation stable de la structure conceptuelle du catalogue, distincte :

- des produits publiés portés par `products` ;
- des bundles commerciaux portés par `bundles` ;
- des prix portés par `pricing` ;
- des remises portées par `discounts` ;
- de la vendabilité portée par `sales-policy` ;
- du contenu éditorial porté par d’autres domaines ;
- des DTO provider-specific portés par `integrations`.

---

## Classification

### Catégorie documentaire

`satellites`

### Criticité architecturale

`satellite structurant`

### Activable

`non`

Le domaine `catalog-modeling` est structurel dès lors que le système ne réduit pas le catalogue à une simple liste plate de produits.

---

## Source de vérité

Le domaine `catalog-modeling` est la source de vérité pour :

- la définition interne des modèles catalogue ;
- les types ou familles de produits ;
- les attributs structurants du catalogue ;
- les axes conceptuels de variation ;
- les compatibilités ou relations structurelles explicitement portées ;
- les politiques de modélisation ou de validation portées par le système ;
- les lectures structurées de modèle catalogue consommables par les domaines autorisés.

Le domaine `catalog-modeling` n’est pas la source de vérité pour :

- les produits publiés, qui relèvent de `products` ;
- les bundles commerciaux, qui relèvent de `bundles` ;
- le pricing, qui relève de `pricing` ;
- les remises, qui relèvent de `discounts` ;
- la vendabilité, qui relève de `sales-policy` ;
- le contenu éditorial ;
- les DTO providers externes, qui relèvent de `integrations`.

Un modèle catalogue est une structure conceptuelle stable.
Il ne doit pas être confondu avec :

- un produit publié ;
- un bundle commercial ;
- une règle de prix ;
- une règle de vendabilité ;
- une simple capability ;
- un méta-modèle théorique illimité sans ancrage métier.

---

## Responsabilités

Le domaine `catalog-modeling` est responsable de :

- définir ce qu’est un modèle catalogue dans le système ;
- porter les types, familles et attributs structurants ;
- porter les axes de variation conceptuels ;
- porter les compatibilités ou relations structurelles explicitement modélisées ;
- exposer une structure catalogue lisible et gouvernée ;
- fournir aux domaines consommateurs une base commune de modélisation ;
- encadrer la validation structurelle du catalogue ;
- publier les événements significatifs liés à la vie du modèle catalogue.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- familles produit ;
- définitions d’attributs ;
- schémas de variation ;
- règles de compatibilité structurelle ;
- politiques locales de modélisation par boutique ;
- validation de cohérence du modèle avant consommation par `products`, `bundles`, `pricing` ou `sales-policy`.

---

## Non-responsabilités

Le domaine `catalog-modeling` n’est pas responsable de :

- publier ou porter les produits du catalogue vivant ;
- porter les bundles commerciaux ;
- calculer les prix, remises, taxes ou totaux ;
- décider de la vendabilité ;
- porter la logique éditoriale des pages, contenus ou storefront ;
- porter les intégrations provider-specific ;
- devenir un moteur théorique de modélisation sans limite ni gouvernance.

Le domaine `catalog-modeling` ne doit pas devenir :

- un doublon de `products` ;
- un doublon de `bundles` ;
- un doublon de `pricing` ;
- un doublon de `sales-policy` ;
- un conteneur flou d’abstractions sans usage concret.

---

## Invariants

Les invariants minimaux sont les suivants :

- un modèle catalogue possède un identifiant stable et une signification explicite ;
- un attribut structurant ou un axe de variation est défini dans un cadre de modèle explicite ;
- `catalog-modeling` ne se confond pas avec `products` ;
- `catalog-modeling` ne se confond pas avec `bundles` ;
- `catalog-modeling` ne se confond pas avec `pricing` ;
- `catalog-modeling` ne se confond pas avec `sales-policy` ;
- les domaines consommateurs ne doivent pas recréer librement une vérité divergente de structure catalogue quand le cadre commun existe ;
- une structure catalogue invalide ou incohérente ne doit pas devenir une base stable pour les domaines consommateurs.

Le domaine protège la cohérence de la structure conceptuelle du catalogue.

---

## Dépendances

### Dépendances métier

Le domaine `catalog-modeling` interagit fortement avec :

- `products`
- `bundles`
- `pricing`
- `sales-policy`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `approval`, si certaines évolutions de modèle nécessitent validation
- `workflow`, si certaines évolutions du modèle suivent un processus structuré
- `audit`
- `observability`
- `jobs`, si certaines reconstructions ou validations sont différées

### Dépendances externes

Le domaine peut être projeté vers :

- PIM ;
- ERP ;
- backoffice externes ;
- autres systèmes catalogue via `integrations`.

### Règle de frontière

Le domaine `catalog-modeling` porte la structure conceptuelle du catalogue.
Il ne doit pas absorber :

- les produits publiés ;
- les bundles commerciaux ;
- la tarification ;
- la vendabilité ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `catalog-modeling` publie ou peut publier des événements significatifs tels que :

- modèle catalogue créé ;
- modèle catalogue mis à jour ;
- attribut catalogue mis à jour ;
- axe de variation mis à jour ;
- compatibilité catalogue mise à jour ;
- statut de modèle catalogue modifié.

Le domaine peut consommer des signaux liés à :

- capabilities de boutique modifiées ;
- approbation accordée ;
- workflow terminé ;
- actions administratives structurées d’évolution du modèle catalogue.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `catalog-modeling` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- actif ;
- suspendu, si pertinent ;
- archivé, si pertinent.

Des états supplémentaires peuvent exister :

- brouillon ;
- validé ;
- en attente ;
- déprécié.

Le domaine doit éviter :

- les modèles “fantômes” ;
- les changements silencieux de structure ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `catalog-modeling` expose principalement :

- des types ou familles de produits structurés ;
- des attributs et axes de variation structurants ;
- des règles de compatibilité ou de cohérence structurelle ;
- des lectures exploitables par `products`, `bundles`, `pricing`, `sales-policy`, `dashboarding` et certaines couches d’administration ;
- des structures de modélisation prêtes à être consommées par les domaines catalogue autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de types ou familles de catalogue ;
- des changements d’attributs structurants ou d’axes de variation ;
- des demandes de lecture de la structure catalogue applicable ;
- des demandes de vérification de cohérence d’un modèle catalogue ;
- des contextes de boutique, domaine produit, usage ou politique locale ;
- des signaux internes utiles à la validation ou à l’évolution du modèle catalogue.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `catalog-modeling` peut être exposé à des contraintes telles que :

- catalogue multi-boutiques ;
- variantes structurées ;
- modèles partagés ;
- validation préalable ;
- workflow d’évolution ;
- projection vers des systèmes externes ;
- compatibilités complexes ;
- besoin de rétrocompatibilité de structure.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne de structure reste dans `catalog-modeling` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une structure invalide ne doit pas être promue silencieusement ;
- les incompatibilités doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `catalog-modeling` manipule des structures sensibles pour la cohérence métier et la stabilité de l’administration produit.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre structure conceptuelle, produit publié, prix et vendabilité ;
- protection des changements structurants susceptibles d’impacter fortement le catalogue ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des changements significatifs de types, attributs, axes ou compatibilités.

---

## Observabilité et audit

Le domaine `catalog-modeling` doit rendre visibles au minimum :

- quel modèle catalogue est en vigueur ;
- quels types, attributs ou axes de variation sont actifs ;
- pourquoi une structure est acceptée, filtrée ou invalide ;
- si une évolution de modèle est bloquée à cause d’une policy, d’une approval manquante, d’une incompatibilité ou d’une règle applicable.

L’audit doit permettre de répondre à des questions comme :

- quel modèle a été créé ou modifié ;
- quand ;
- selon quelle origine ;
- avec quel attribut, axe ou type affecté ;
- avec quelle validation ou approbation ;
- avec quel impact sur les domaines consommateurs.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- attribut invalide ;
- axe contradictoire ;
- compatibilité structurelle invalide ;
- évolution non autorisée.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `CatalogModel` : structure conceptuelle du catalogue ;
- `ProductTypeDefinition` : type ou famille de produit structurante ;
- `CatalogAttributeDefinition` : attribut structurant du catalogue ;
- `CatalogVariationAxis` : axe conceptuel de variation ;
- `CatalogCompatibilityRule` : règle de compatibilité ou de relation structurelle ;
- `CatalogModelPolicy` : règle de modélisation ou de validation.

---

## Impact de maintenance / exploitation

Le domaine `catalog-modeling` a un impact d’exploitation moyen à élevé.

Raisons :

- il structure la cohérence du catalogue ;
- il est consommé par plusieurs domaines aval ;
- ses erreurs dégradent produits, bundles, pricing et vendabilité ;
- il nécessite une bonne explicabilité des changements structurants ;
- il peut dépendre d’approbations, workflows ou projections externes.

En exploitation, une attention particulière doit être portée à :

- la stabilité du modèle ;
- les évolutions incompatibles ;
- les attributs et axes contradictoires ;
- la traçabilité des changements ;
- la cohérence avec les consommateurs aval ;
- les effets de bord sur l’administration produit.

Le domaine doit être considéré comme structurant dès qu’un catalogue riche, variable ou typé est administré.

---

## Limites du domaine

Le domaine `catalog-modeling` s’arrête :

- avant les produits publiés ;
- avant les bundles commerciaux ;
- avant le pricing ;
- avant les remises ;
- avant la vendabilité ;
- avant le contenu éditorial ;
- avant les DTO providers externes.

Le domaine `catalog-modeling` porte la structure conceptuelle du catalogue.
Il ne doit pas devenir un méta-modèle théorique illimité ni un doublon des autres domaines.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `catalog-modeling` et `products` ;
- la frontière exacte entre `catalog-modeling` et `bundles` ;
- la part exacte des politiques locales par boutique ;
- la responsabilité exacte des compatibilités structurelles ;
- la gouvernance des validations via `approval` ou `workflow` ;
- la stratégie de rétrocompatibilité du modèle ;
- la hiérarchie entre vérité interne et projection externe éventuelle.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/stores.md`
- `../core/products.md`
- `bundles.md`
- `../core/pricing.md`
- `discounts.md`
- `sales-policy.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../core/integrations.md`
