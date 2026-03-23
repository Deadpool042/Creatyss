# Domaine `homepage-editorial`

## Objectif

Ce document décrit le domaine `homepage-editorial` dans la doctrine courante du socle.

Il porte les blocs éditoriaux, sections et ordonnancements propres à la homepage ou à certaines zones éditoriales structurantes de présentation.

---

## Position dans la doctrine de modularité

Le domaine `homepage-editorial` est classé comme :

- `domaine optionnel toggleable`

Il est activé quand le projet a besoin d’une homepage éditorialisée, pilotée localement, distincte du blog et du catalogue.

### Capabilities activables liées

- `homepageEditor`
- `homepageSections`
- `homepageHero`
- `homepageHighlights`
- `homepageFeaturedCollections`
- `homepageSeoMetadata`

---

## Rôle

Le domaine `homepage-editorial` porte la vérité éditoriale locale de la page d’accueil et de ses blocs.

Il constitue la source de vérité pour :

- les sections de homepage ;
- leur ordre ;
- leur statut ;
- certaines relations vers blog, produits ou collections si le projet le prévoit.

Il reste distinct de :

- `blog`
- `products`
- `reviews`
- `cms` externe éventuel

---

## Objets métier principaux

- `HomepageSection`
- `HomepageLayout`
- `HomepageHero`
- `HomepageEditorialBlock`
- `HomepageSeoMetadata`

---

## Invariants métier

- la homepage éditoriale reste distincte des autres domaines ;
- l’ordre des sections est explicite ;
- une section publiée est identifiable ;
- les références vers d’autres domaines pointent vers des objets existants.

---

## Lifecycle et gouvernance des données

### États principaux

- `DRAFT`
- `PUBLISHED`
- `ARCHIVED`

### Règles principales

- l’archivage prime sur la suppression implicite ;
- les versions publiées restent traçables si la stratégie du projet le requiert.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

- création ou mise à jour d’une section ;
- changement d’ordre structurant ;
- publication ;
- écriture des événements correspondants.

### Ce qui peut être eventual consistency

- projection storefront ;
- analytics ;
- cache purge.

### Idempotence

- `upsert-homepage-section` : `(sectionRef, changeIntentId)`
- `publish-homepage-layout` : `(layoutId, publishIntentId)`

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` pour homepage simple ;
- `M2` pour homepage fortement pilotée.

### Impact coût / complexité

Le coût monte principalement avec :

- nombre de sections ;
- richesse des types de blocs ;
- liens avec d’autres domaines ;
- workflow éditorial.

Lecture relative :

- `C1` à `C3`

---

## Décisions d’architecture

- `homepage-editorial` est un domaine optionnel toggleable ;
- il reste distinct de `blog` et `products` ;
- il pilote l’éditorial de la homepage sans devenir un CMS global.
