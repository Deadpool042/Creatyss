# Catégories

## Rôle

Le domaine `categories` porte la structuration taxonomique du catalogue.

Il définit :

- comment les produits ou offres sont classés ;
- quelles catégories existent ;
- comment elles sont organisées ;
- comment elles servent à la navigation, au merchandising et à certaines règles de présentation ;
- comment elles se distinguent du modèle produit, du search, du pricing et de la boutique.

Le domaine existe pour fournir une structure de classement exploitable du catalogue, distincte :

- de la définition intrinsèque du produit ;
- de la recherche ;
- du pricing ;
- des promotions ;
- du contenu éditorial libre.

---

## Classification

### Catégorie documentaire

`satellites`

### Criticité architecturale

`satellite structurant`

### Activable

`non`

Le domaine `categories` est structurel dès lors que le catalogue n’est pas strictement plat ou que la navigation commerciale dépend d’une taxonomie explicite.

---

## Source de vérité

Le domaine `categories` est la source de vérité pour :

- l’identité interne des catégories ;
- leur hiérarchie ou organisation taxonomique ;
- leurs attributs structurants de classement ;
- leur statut actif, inactif ou archivé si le modèle le porte ;
- le rattachement taxonomique principal porté par le système.

Le domaine `categories` n’est pas la source de vérité pour :

- la définition métier complète du produit, qui relève de `products` ;
- le modèle de catalogue avancé, qui peut relever de `catalog-modeling` ;
- la recherche et le ranking, qui relèvent de `search` ;
- la disponibilité vendable, qui relève de `availability` ;
- les prix et promotions, qui relèvent de `pricing` et `discounts` ;
- les règles de vente, qui peuvent relever de `sales-policy` ;
- la navigation UI elle-même.

Une catégorie est un objet de classement.
Elle ne doit pas être confondue avec :

- une famille de données produit ;
- un tag libre ;
- une landing page éditoriale ;
- un simple filtre de recherche.

---

## Responsabilités

Le domaine `categories` est responsable de :

- définir ce qu’est une catégorie dans le système ;
- attribuer et maintenir l’identité interne d’une catégorie ;
- porter les attributs structurants utiles au classement ;
- gérer l’organisation hiérarchique ou relationnelle des catégories ;
- servir de référentiel taxonomique pour les domaines consommateurs ;
- exposer une représentation exploitable de la taxonomie ;
- encadrer les mutations significatives de catégories ;
- publier les événements significatifs liés à la vie des catégories.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- slug canonique de catégorie ;
- ordre d’affichage ;
- rattachement à une boutique ou un canal si cela est explicitement porté ici ;
- certains attributs SEO de base liés à la catégorie ;
- état de publication de catégorie ;
- relation produit ↔ catégorie quand cette responsabilité n’est pas ailleurs.

---

## Non-responsabilités

Le domaine `categories` n’est pas responsable de :

- définir le produit ;
- porter les attributs techniques détaillés du catalogue ;
- calculer les prix ;
- décider de la disponibilité ;
- exécuter la recherche ;
- définir les promotions ;
- gouverner l’arbre éditorial libre ;
- porter toute la navigation storefront.

Le domaine `categories` ne doit pas devenir :

- un substitut de `catalog-modeling` ;
- un mélange entre taxonomie, merchandising et contenu ;
- un sac de filtres UI sans sémantique métier claire.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- une catégorie doit avoir une identité interne stable ;
- une catégorie doit être interprétable sans ambiguïté ;
- une hiérarchie de catégories ne doit pas être incohérente ;
- une catégorie ne doit pas être son propre ancêtre ;
- une mutation structurante de taxonomie doit être traçable ;
- une catégorie inactive ne doit pas être traitée comme active sans règle explicite ;
- deux catégories distinctes ne doivent pas être indiscernables sans justification explicite ;
- un rattachement produit ↔ catégorie ne doit pas rendre la taxonomie contradictoire sans visibilité.

Le domaine protège la cohérence du classement, pas uniquement une liste de labels.

---

## Dépendances

### Dépendances métier

Le domaine `categories` interagit fortement avec :

- `products`
- `catalog-modeling`
- `stores`
- `search`
- `seo`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `jobs`, si certaines reconstructions ou projections sont différées
- `integrations`, si la taxonomie est synchronisée avec un référentiel externe

### Dépendances externes

Le domaine peut interagir avec :

- ERP ;
- PIM ;
- CMS ;
- marketplaces ;
- sources catalogues externes.

### Règle de frontière

Le domaine `categories` porte la vérité taxonomique de classement.
Il ne doit pas absorber :

- le modèle produit complet ;
- la logique de recherche ;
- la logique de pricing ;
- ni la navigation UI comme telle.

---

## Événements significatifs

Le domaine `categories` publie ou peut publier des événements significatifs tels que :

- catégorie créée ;
- catégorie mise à jour ;
- catégorie activée ;
- catégorie désactivée ;
- catégorie archivée ;
- hiérarchie de catégories modifiée ;
- rattachement de catégorie modifié ;
- slug de catégorie modifié.

Le domaine peut consommer des signaux liés à :

- import catalogue ;
- synchronisation externe ;
- mise à jour de boutique ;
- reconstruction d’index de recherche ;
- mise à jour SEO ou storefront dérivée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `categories` possède un cycle de vie structurel.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créée ;
- active ;
- inactive ;
- archivée.

Des états supplémentaires peuvent exister :

- brouillon ;
- publiée ;
- masquée ;
- en attente de synchronisation.

Les transitions doivent être explicites et traçables.

Le domaine doit éviter :

- les catégories “fantômes” ;
- les changements silencieux de hiérarchie ;
- les statuts purement techniques sans sens métier.

---

## Interfaces et échanges

Le domaine `categories` expose principalement :

- des commandes de création et de mutation de catégorie ;
- des lectures du référentiel de catégories ;
- des lectures de hiérarchie ou d’arbre taxonomique ;
- des événements significatifs liés à la vie des catégories.

Le domaine reçoit principalement :

- des demandes de création ou mise à jour ;
- des mutations de hiérarchie ;
- des synchronisations externes ;
- des rattachements ou détachements de produits si cette responsabilité est portée ici.

Le domaine ne doit pas exposer un contrat canonique trop dépendant d’un outil externe ou d’une UI particulière.

---

## Contraintes d’intégration

Le domaine `categories` peut être exposé à des contraintes telles que :

- synchronisation avec un référentiel externe ;
- taxonomie multi-boutiques ;
- taxonomie multi-langues ;
- hiérarchies profondes ;
- slugs hérités ;
- import massif ;
- renommage de catégories ;
- projection vers recherche ou storefront.

Règles minimales :

- toute entrée externe doit être validée ;
- la hiérarchie d’autorité doit être explicite ;
- une mutation rejouable doit être idempotente ou neutralisée ;
- un système externe ne doit pas redéfinir silencieusement la vérité interne ;
- une mutation de hiérarchie doit être traçable.

---

## Observabilité et audit

Le domaine `categories` doit rendre visibles au minimum :

- les créations de catégories ;
- les changements de statut ;
- les changements de hiérarchie ;
- les synchronisations externes significatives ;
- les erreurs de validation ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quelle catégorie a changé ;
- quand ;
- selon quelle origine ;
- avec quel impact sur le classement ;
- sur quel périmètre boutique ou catalogue.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- conflit de hiérarchie ;
- divergence externe ;
- mutation taxonomique critique.

---

## Impact de maintenance / exploitation

Le domaine `categories` a un impact d’exploitation moyen à élevé.

Raisons :

- il structure la navigation du catalogue ;
- ses erreurs affectent merchandising, search et storefront ;
- il peut dépendre de synchronisations externes ;
- une taxonomie incohérente dégrade fortement la lisibilité produit.

En exploitation, une attention particulière doit être portée à :

- la cohérence hiérarchique ;
- la stabilité des slugs ;
- les divergences avec des référentiels externes ;
- les impacts sur search et storefront ;
- la traçabilité des mutations.

Le domaine doit être considéré comme structurant pour l’expérience catalogue.

---

## Limites du domaine

Le domaine `categories` s’arrête :

- avant le produit lui-même ;
- avant les prix ;
- avant la disponibilité ;
- avant la recherche ;
- avant la logique de promotion ;
- avant le contenu éditorial libre ;
- avant la navigation UI.

Le domaine porte la taxonomie de classement.
Il ne doit pas devenir un conteneur global de merchandising ou de structure produit.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `categories` et `catalog-modeling` ;
- la frontière exacte entre `categories` et `search` ;
- la responsabilité exacte du rattachement produit ↔ catégorie ;
- la hiérarchie entre taxonomie interne et référentiel externe ;
- la gestion multi-boutiques ou multi-langues ;
- la part SEO réellement portée par `categories`.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/catalog/products.md`
- `catalog-modeling.md`
- `../cross-cutting/search.md`
- `../cross-cutting/seo.md`
- `../core/foundation/stores.md`
