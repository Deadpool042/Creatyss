# Bundles

## Rôle

Le domaine `bundles` porte les compositions commerciales structurées du catalogue.

Il définit :

- ce qu’est un bundle du point de vue du système ;
- comment plusieurs produits, variantes ou offres sont assemblés dans une unité commerciale cohérente ;
- comment ce domaine se distingue des produits publiés, de la modélisation catalogue, du pricing, de la vendabilité et des remises ;
- comment le système reste maître de sa vérité interne sur les bundles.

Le domaine existe pour fournir une représentation stable des compositions commerciales, distincte :

- des produits publiés portés par `products` ;
- de la structure conceptuelle portée par `catalog-modeling` ;
- du pricing porté par `pricing` ;
- des remises portées par `discounts` ;
- de la vendabilité portée par `sales-policy` ;
- des DTO provider-specific portés par `integrations`.

---

## Classification

### Catégorie documentaire

`satellites`

### Criticité architecturale

`satellite structurant`

### Activable

`oui`

Le domaine `bundles` est activable.
Lorsqu’il est activé, il devient structurant pour la composition de l’offre commerciale, certaines lectures catalogue et certains parcours panier/checkout.

---

## Source de vérité

Le domaine `bundles` est la source de vérité pour :

- la définition interne d’un bundle ;
- ses composants ;
- ses règles de composition ;
- son statut métier ;
- ses contraintes structurelles propres ;
- ses lectures de bundle consommables par les domaines autorisés.

Le domaine `bundles` n’est pas la source de vérité pour :

- les produits publiés, qui relèvent de `products` ;
- la structure conceptuelle générale du catalogue, qui relève de `catalog-modeling` ;
- les prix, qui relèvent de `pricing` ;
- les remises, qui relèvent de `discounts` ;
- la vendabilité, qui relève de `sales-policy` ;
- les DTO providers externes, qui relèvent de `integrations`.

Un bundle est une composition commerciale explicite.
Il ne doit pas être confondu avec :

- un produit simple ;
- une famille de produits ;
- une variation produit ;
- une remise ;
- une capability ;
- un simple groupe d’affichage storefront.

---

## Responsabilités

Le domaine `bundles` est responsable de :

- définir ce qu’est un bundle dans le système ;
- porter la composition d’un bundle ;
- porter les règles structurelles propres au bundle ;
- exposer une lecture bundle gouvernée aux domaines consommateurs ;
- publier les événements significatifs liés à la vie d’un bundle ;
- protéger le système contre les compositions implicites ou incohérentes.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- bundles fixes ;
- bundles configurables dans une limite explicite ;
- bundles de découverte ;
- bundles saisonniers ;
- bundles éditorialisés mais structurellement définis ;
- relations entre bundle et composants ;
- statuts de bundle actifs, suspendus ou archivés.

---

## Non-responsabilités

Le domaine `bundles` n’est pas responsable de :

- définir les produits sources ;
- définir la structure générale du catalogue ;
- calculer les prix, remises, taxes ou totaux ;
- décider de la vendabilité ;
- exécuter le panier, le checkout ou la commande ;
- porter les intégrations provider-specific ;
- devenir un moteur générique de composition pour tout le système.

Le domaine `bundles` ne doit pas devenir :

- un doublon de `products` ;
- un doublon de `catalog-modeling` ;
- un doublon de `pricing` ;
- un fourre-tout de packs marketing sans structure métier stable.

---

## Invariants

Les invariants minimaux sont les suivants :

- un bundle possède un identifiant stable ;
- un bundle possède un statut explicite ;
- un bundle possède une composition explicite ;
- un bundle ne doit pas contenir une structure contradictoire ou impossible ;
- un bundle ne se confond pas avec ses composants ;
- une mutation de composition doit être traçable ;
- un bundle archivé ne doit pas être traité comme actif sans règle explicite ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente de bundle quand le cadre commun existe.

Le domaine protège la cohérence des compositions commerciales.

---

## Dépendances

### Dépendances métier

Le domaine `bundles` interagit fortement avec :

- `products`
- `catalog-modeling`
- `pricing`
- `sales-policy`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `jobs`, si certaines reconstructions ou validations sont différées
- `approval`, si certaines publications nécessitent validation
- `workflow`, si certaines évolutions suivent un processus structuré

### Dépendances externes

Le domaine peut être projeté vers :

- PIM ;
- ERP ;
- marketplaces ;
- autres systèmes catalogue via `integrations`.

### Règle de frontière

Le domaine `bundles` porte les compositions commerciales.
Il ne doit pas absorber :

- les produits publiés ;
- la structure conceptuelle générale ;
- la tarification ;
- la vendabilité ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `bundles` publie ou peut publier des événements significatifs tels que :

- bundle créé ;
- bundle mis à jour ;
- composition bundle modifiée ;
- statut bundle modifié ;
- bundle archivé ;
- composant bundle ajouté ;
- composant bundle retiré.

Le domaine peut consommer des signaux liés à :

- produit mis à jour ;
- produit archivé ;
- modèle catalogue modifié ;
- approbation accordée ;
- workflow terminé ;
- capabilities de boutique modifiées.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `bundles` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- actif ;
- suspendu, si pertinent ;
- archivé.

Des états supplémentaires peuvent exister :

- brouillon ;
- validé ;
- en attente ;
- déprécié.

Le domaine doit éviter :

- les bundles “fantômes” ;
- les changements silencieux de composition ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `bundles` expose principalement :

- des lectures de bundles structurés ;
- des composants bundle ;
- des règles de composition bundle ;
- des lectures exploitables par `products`, `pricing`, `sales-policy`, `cart`, `checkout` et certaines couches d’administration ;
- des structures de bundle prêtes à être consommées par les domaines autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de bundle ;
- des changements de composants ;
- des demandes de lecture de bundle ;
- des demandes de validation de cohérence ;
- des contextes de boutique, usage ou politique locale ;
- des signaux internes utiles à l’évolution du bundle.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `bundles` peut être exposé à des contraintes telles que :

- bundles multi-boutiques ;
- bundles saisonniers ;
- bundles dépendants d’un catalogue riche ;
- validation préalable ;
- workflow d’évolution ;
- projection vers des systèmes externes ;
- contraintes de cohérence avec pricing ou vendabilité ;
- besoin de rétrocompatibilité de composition.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des bundles reste dans `bundles` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une composition invalide ne doit pas être promue silencieusement ;
- les incohérences de bundle doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `bundles` manipule des compositions sensibles pour la cohérence commerciale et la stabilité de l’administration catalogue.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre bundle, produit, prix et vendabilité ;
- protection des changements structurants susceptibles d’impacter fortement le catalogue ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des changements significatifs de composition ou de statut.

---

## Observabilité et audit

Le domaine `bundles` doit rendre visibles au minimum :

- quel bundle est en vigueur ;
- quels composants sont actifs ;
- pourquoi une composition est acceptée, filtrée ou invalide ;
- si une évolution de bundle est bloquée à cause d’une policy, d’une approval manquante, d’une incompatibilité ou d’une règle applicable.

L’audit doit permettre de répondre à des questions comme :

- quel bundle a été créé ou modifié ;
- quand ;
- selon quelle origine ;
- avec quel composant affecté ;
- avec quelle validation ou approbation ;
- avec quel impact sur les domaines consommateurs.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- composition invalide ;
- composant incohérent ;
- bundle non actif ;
- évolution non autorisée.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Bundle` : composition commerciale structurée ;
- `BundleComponent` : composant rattaché à un bundle ;
- `BundleRule` : règle structurelle propre au bundle ;
- `BundleStatus` : état du bundle ;
- `BundlePolicy` : règle de validation ou de gouvernance.

---

## Impact de maintenance / exploitation

Le domaine `bundles` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il structure certaines offres commerciales ;
- il est consommé par plusieurs domaines aval ;
- ses erreurs dégradent catalogue, pricing, panier et vendabilité ;
- il nécessite une bonne explicabilité des changements structurants ;
- il peut dépendre d’approbations, workflows ou projections externes.

En exploitation, une attention particulière doit être portée à :

- la stabilité des compositions ;
- les évolutions incompatibles ;
- les composants contradictoires ;
- la traçabilité des changements ;
- la cohérence avec les consommateurs aval ;
- les effets de bord sur l’administration produit.

Le domaine doit être considéré comme structurant dès qu’une logique de bundle existe réellement.

---

## Limites du domaine

Le domaine `bundles` s’arrête :

- avant les produits publiés ;
- avant la structure conceptuelle générale du catalogue ;
- avant le pricing ;
- avant les remises ;
- avant la vendabilité ;
- avant les DTO providers externes.

Le domaine `bundles` porte les compositions commerciales.
Il ne doit pas devenir un moteur universel d’assemblage ni un doublon des autres domaines.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `bundles` et `products` ;
- la frontière exacte entre `bundles` et `catalog-modeling` ;
- la part exacte des bundles configurables ;
- la gouvernance des validations via `approval` ou `workflow` ;
- la stratégie de rétrocompatibilité des compositions ;
- la hiérarchie entre vérité interne et projection externe éventuelle.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/stores.md`
- `../core/products.md`
- `catalog-modeling.md`
- `../core/pricing.md`
- `discounts.md`
- `sales-policy.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../core/integrations.md`
