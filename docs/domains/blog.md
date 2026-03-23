# Domaine `blog`

## Objectif

Ce document décrit le domaine `blog` dans la doctrine courante du socle.

Il précise :

- le rôle du domaine ;
- sa place dans la modularité du socle ;
- sa source de vérité ;
- ses capabilities activables ;
- ses objets métier ;
- ses invariants ;
- son cycle de vie ;
- ses règles de cohérence ;
- ses frontières externes ;
- ses implications de maintenance, d’exploitation et de coût.

Le domaine `blog` est un domaine optionnel toggleable.
Il permet d’ajouter une couche éditoriale structurée au socle sans la confondre avec :

- le catalogue produit ;
- la homepage éditoriale ;
- les contenus purement marketing ponctuels ;
- la documentation interne.

Le domaine `blog` doit rester découplé du coeur e-commerce tout en pouvant nourrir la visibilité, le SEO et certains parcours de découverte.

---

## Position dans la doctrine de modularité

Le domaine `blog` est classé comme :

- `domaine optionnel toggleable`

Le domaine n’est activé que si un besoin éditorial réel existe.

### Ce qui n’est jamais désactivé

Quand le domaine est activé, il conserve toujours :

- une vérité éditoriale locale ;
- une distinction entre brouillon, publication et archivage ;
- une séparation claire avec produits, homepage et SEO technique global.

### Ce qui est activable / désactivable par capability

Le domaine `blog` est lié aux capabilities suivantes :

- `blog`
- `blogCategories`
- `blogTags`
- `blogSeoMetadata`
- `blogAuthoring`
- `blogPublishingWorkflow`
- `blogRelatedContent`

### Ce qui relève d’un niveau

Le domaine varie par richesse éditoriale, taxonomie, workflow et relations de contenu.

### Ce qui relève d’un provider ou d’une intégration externe

Relèvent de `integrations` :

- CMS externe ;
- import de contenus ;
- distribution externe ;
- newsletter ou diffusion tierce.

Le domaine `blog` garde la vérité locale des articles gérés par le socle.

---

## Rôle

Le domaine `blog` porte les articles éditoriaux structurés du socle.

Il constitue la source de vérité interne pour :

- les posts ;
- leurs taxonomies ;
- leur statut de publication ;
- leurs auteurs internes si le projet les gère ;
- leurs métadonnées éditoriales et SEO locales.

Le domaine est distinct :

- de `products`, qui porte le catalogue ;
- de `homepage-editorial`, qui porte la page d’accueil éditoriale ;
- de `reviews`, qui porte les avis ;
- de `ai-assistance`, qui peut enrichir le contenu sans en être la source.

---

## Responsabilités

Le domaine `blog` prend en charge :

- la création et gestion d’articles ;
- les catégories et tags si activés ;
- le statut de publication ;
- les métadonnées éditoriales ;
- les relations entre contenus si activées ;
- l’exposition de contenus blog exploitables par le storefront.

---

## Ce que le domaine ne doit pas faire

Le domaine `blog` ne doit pas :

- porter le catalogue produit ;
- devenir un CMS global de tout le site ;
- redéfinir la homepage ;
- devenir le domaine source du SEO global de la plateforme ;
- dépendre d’un CMS externe pour exister localement.

---

## Source de vérité

Le domaine `blog` est la source de vérité pour :

- les posts ;
- leurs taxonomies ;
- leur statut ;
- leurs métadonnées éditoriales propres.

Le domaine n’est pas la source de vérité pour :

- les produits ;
- les reviews ;
- les pages de navigation générales ;
- les campagnes marketing externes.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `BlogPost`
- `BlogPostStatus`
- `BlogCategory`
- `BlogTag`
- `BlogAuthor`
- `BlogSeoMetadata`
- `BlogRelation`

---

## Capabilities activables liées

Le domaine `blog` est lié aux capabilities suivantes :

- `blog`
- `blogCategories`
- `blogTags`
- `blogSeoMetadata`
- `blogAuthoring`
- `blogPublishingWorkflow`
- `blogRelatedContent`

### Effet si `blog` est activée

Le domaine existe et expose des articles.

### Effet si `blogCategories` est activée

Le domaine gère des catégories.

### Effet si `blogTags` est activée

Le domaine gère des tags.

### Effet si `blogSeoMetadata` est activée

Le domaine porte des métadonnées SEO spécifiques aux posts.

### Effet si `blogAuthoring` est activée

Le domaine porte une notion plus riche d’auteur ou de contribution.

### Effet si `blogPublishingWorkflow` est activée

Le domaine enrichit le lifecycle éditorial.

### Effet si `blogRelatedContent` est activée

Le domaine peut lier des contenus entre eux ou avec d’autres contenus pertinents.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

- posts simples ;
- statut simple ;
- peu de taxonomie.

### Niveau 2 — standard

- catégories ;
- tags ;
- SEO local ;
- meilleure structuration éditoriale.

### Niveau 3 — avancé

- workflow de publication ;
- auteurs ;
- contenus liés ;
- meilleure gouvernance éditoriale.

### Niveau 4 — expert / multi-contraintes

- forte densité éditoriale ;
- workflow plus riche ;
- intégrations et diffusion plus poussées.

---

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour de posts ;
- des changements de statut ;
- des taxonomies ;
- des métadonnées ;
- éventuellement des imports externes traduits.

---

## Sorties

Le domaine expose principalement :

- des posts ;
- leurs taxonomies ;
- leur statut ;
- des relations de contenu ;
- des événements liés à la publication.

---

## Dépendances vers autres domaines

Le domaine `blog` dépend de :

- `stores`
- `users`
- `audit`
- `observability`

Les domaines suivants dépendent de `blog` :

- `homepage-editorial`
- `search` si activé
- `analytics`
- `seo` transverse si le projet le structure

---

## Dépendances vers providers / intégrations

Le domaine `blog` peut être alimenté par `integrations`, mais garde une vérité locale.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `store_owner`
- `store_manager`
- `content_editor`
- `content_reviewer`

### Permissions

Exemples de permissions concernées :

- `blog.read`
- `blog.write`
- `blog.publish`
- `blog.taxonomy.manage`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `blog_post.created`
- `blog_post.updated`
- `blog_post.published`
- `blog_post.unpublished`
- `blog_post.archived`

---

## Événements consommés

Le domaine consomme principalement :

- `store.capabilities.updated`
- `user.updated`
- `integration.blog.result.translated`

---

## Données sensibles / sécurité

Le domaine `blog` porte une donnée éditoriale modérément sensible.

Points de vigilance :

- contrôle de publication ;
- séparation brouillon / contenu public ;
- cohérence des imports ;
- audit des changements structurants.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel article est publié ;
- pourquoi un article a changé de statut ;
- quelles taxonomies lui sont liées ;
- s’il provient d’une mise à jour interne ou d’un import.

### Audit

Il faut tracer :

- créations ;
- publications ;
- dépublications ;
- archivages ;
- changements structurants.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un post possède une identité stable ;
- un post publié est explicitement dans un état publiable ;
- le blog ne redéfinit pas le catalogue ou la homepage ;
- un contenu archivé reste traçable ;
- les taxonomies référencent des entités existantes.

---

## Lifecycle et gouvernance des données

### États principaux

- `DRAFT`
- `PUBLISHED`
- `UNPUBLISHED`
- `ARCHIVED`

### Transitions autorisées

Exemples :

- `DRAFT -> PUBLISHED`
- `PUBLISHED -> UNPUBLISHED`
- `UNPUBLISHED -> PUBLISHED`
- `PUBLISHED -> ARCHIVED`

### Transitions interdites

Exemples :

- réactivation implicite d’un contenu archivé ;
- publication sans statut ni validation explicite.

### Règles de conservation / archivage / suppression

- les contenus restent traçables ;
- l’archivage est préférable à la suppression implicite des contenus structurants ;
- la suppression physique doit rester contrôlée.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

- création d’un post ;
- changement de statut ;
- mise à jour structurante ;
- changement de taxonomies ;
- écriture des événements `blog_post.*` correspondants.

### Ce qui peut être eventual consistency

- indexation search ;
- analytics ;
- diffusion externe ;
- notifications éditoriales.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les changements structurants ;
- unicité logique du slug ou de la référence si le modèle le prévoit ;
- validation des statuts.

Les conflits attendus sont :

- double publication ;
- double modification concurrente ;
- import externe concurrent.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `upsert-blog-post` : clé d’intention = `(blogPostRef, changeIntentId)`
- `publish-blog-post` : clé d’intention = `(blogPostId, publishIntentId)`
- `apply-external-blog-result` : clé d’intention = `(providerName, externalEventId)`

### Domain events écrits dans la même transaction

- `blog_post.created`
- `blog_post.updated`
- `blog_post.published`
- `blog_post.unpublished`
- `blog_post.archived`

### Effets secondaires après commit

- indexation ;
- notifications ;
- analytics ;
- diffusion externe.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` pour blog simple ;
- `M2` pour workflow et SEO enrichis ;
- `M3` pour flux éditoriaux plus riches ou imports fréquents.

### Pourquoi

Le domaine reste optionnel, mais son exploitation peut devenir significative s’il porte une stratégie SEO ou contenu forte.

### Points d’exploitation à surveiller

- publications ;
- contenus obsolètes ;
- taxonomies incohérentes ;
- imports externes.

---

## Impact coût / complexité

Le coût du domaine `blog` monte principalement avec :

- `blogCategories`
- `blogTags`
- `blogSeoMetadata`
- `blogPublishingWorkflow`
- `blogRelatedContent`

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Créer un article
2. Le publier
3. Le classer
4. Lier des contenus entre eux
5. Alimenter une stratégie éditoriale

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- post introuvable ;
- slug dupliqué ;
- taxonomie invalide ;
- publication incohérente ;
- import ambigu.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `blog` est un domaine optionnel toggleable ;
- il porte une vérité éditoriale locale ;
- il reste distinct de `homepage-editorial`, `products` et `reviews` ;
- son enrichissement passe par capabilities et niveaux ;
- les CMS externes restent des intégrations.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `blog` n’appartient pas au coeur obligatoire ;
- s’il est activé, il devient un vrai domaine ;
- il ne remplace pas un CMS global de tout le site ;
- il reste gouverné, traçable et publiable proprement.
