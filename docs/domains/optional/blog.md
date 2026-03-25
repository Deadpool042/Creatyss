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

_Note d'implémentation : Le socle par défaut ne persiste que `BlogPost` et `BlogCategory`. Les objets liés aux capabilities avancées nécessitent l'ajout de leurs propres modèles de persistance de façon explicite._

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

# Blog

## Rôle

Le domaine `blog` porte les articles éditoriaux structurés du système.

Il définit :

- ce qu’est un article de blog du point de vue du système ;
- comment un article est rédigé, classé, publié, dépublié, archivé ou exposé ;
- comment ce domaine se distingue des pages éditoriales, de la homepage éditoriale, des événements publics, des médias, du SEO transverse et du rendu UI ;
- comment le système reste maître de sa vérité interne sur les contenus de blog.

Le domaine existe pour fournir une représentation explicite des contenus de blog, distincte :

- des pages éditoriales portées par `pages` ;
- de la homepage éditoriale portée par `homepage-editorial` ;
- des événements publics portés par `events` ;
- des médias portés par `media` ;
- du SEO transverse porté par `seo` ;
- des couches UI de rendu.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`optionnel structurant`

### Activable

`oui`

Le domaine `blog` est activable.
Lorsqu’il est activé, il devient structurant pour les contenus éditoriaux chronologiques ou assimilés à une logique d’articles.

---

## Source de vérité

Le domaine `blog` est la source de vérité pour :

- la définition interne d’un article de blog structuré ;
- son slug ou identifiant d’exposition ;
- son statut éditorial ;
- ses taxonomies internes de blog explicitement portées par le système ;
- ses métadonnées éditoriales propres ;
- ses relations de contenu explicitement portées par le système ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `blog` n’est pas la source de vérité pour :

- les pages éditoriales, qui relèvent de `pages` ;
- la homepage éditoriale, qui relève de `homepage-editorial` ;
- les événements publics, qui relèvent de `events` ;
- les médias source, qui relèvent de `media` ;
- le SEO transverse complet, qui relève de `seo` ;
- le rendu UI applicatif, qui relève des couches de présentation ;
- un CMS externe, qui relève de `integrations` s’il existe.

Un article de blog est un contenu éditorial structuré et gouverné.
Il ne doit pas être confondu avec :

- une page institutionnelle ;
- un événement public ;
- un média ;
- un template réutilisable ;
- un simple écran UI ;
- un fragment de contenu libre sans gouvernance éditoriale.

---

## Responsabilités

Le domaine `blog` est responsable de :

- définir ce qu’est un article de blog dans le système ;
- porter les articles éditoriaux structurés ;
- porter leurs catégories, tags ou autres taxonomies internes si elles sont activées ;
- porter leurs métadonnées éditoriales propres ;
- porter les statuts de brouillon, publication, dépublication ou archivage ;
- exposer une lecture gouvernée des articles actifs, en préparation ou archivés ;
- publier les événements significatifs liés à la vie d’un article ;
- protéger le système contre les contenus blog implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- catégories de blog ;
- tags de blog ;
- auteur ou contribution éditoriale plus riche ;
- workflow de publication ;
- relations entre contenus ;
- variantes selon langue, audience ou boutique ;
- politiques locales d’exposition du blog.

---

## Non-responsabilités

Le domaine `blog` n’est pas responsable de :

- porter les pages éditoriales génériques ;
- porter la homepage éditoriale ;
- porter les événements publics ;
- porter les médias source ;
- porter le SEO transverse complet ;
- porter la logique de rendu UI applicative ;
- exécuter les intégrations provider-specific ;
- devenir un CMS universel absorbant tous les autres domaines éditoriaux.

Le domaine `blog` ne doit pas devenir :

- un doublon de `pages` ;
- un doublon de `homepage-editorial` ;
- un doublon de `events` ;
- un doublon de `media` ;
- un conteneur flou de contenu libre sans structure ni gouvernance.

---

## Invariants

Les invariants minimaux sont les suivants :

- un article possède un identifiant stable, un slug explicite et un statut explicite ;
- un article publié est explicitement dans un état publiable ;
- une taxonomie de blog référence une entité existante lorsqu’elle est activée ;
- un article non publié ne doit pas être exposé hors règle explicite ;
- une mutation significative de contenu, taxonomie, structure ou statut doit être traçable ;
- `blog` ne se confond pas avec `pages` ;
- `blog` ne se confond pas avec `homepage-editorial` ;
- `blog` ne se confond pas avec `events` ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente de contenu blog quand le cadre commun existe.

Le domaine protège la cohérence des contenus éditoriaux de blog.

---

## Dépendances

### Dépendances métier

Le domaine `blog` interagit fortement avec :

- `stores`
- `users`
- `media`
- `seo`
- `search`
- `homepage-editorial`, lorsque certains contenus blog sont mis en avant

### Dépendances transverses

Le domaine dépend également de :

- `approval`, si certaines publications nécessitent validation préalable
- `workflow`, si le cycle de vie d’un article suit un processus structuré
- `audit`
- `observability`
- `analytics`, comme consommateur ou lecture de performance selon le modèle retenu

### Dépendances externes

Le domaine peut être alimenté ou projeté vers :

- CMS externes ;
- outils d’import de contenus ;
- plateformes de diffusion ;
- newsletters tierces ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `blog` porte les articles éditoriaux structurés.
Il ne doit pas absorber :

- les pages éditoriales génériques ;
- la homepage éditoriale ;
- les événements publics ;
- les médias source ;
- le SEO transverse complet ;
- ni le rendu UI applicatif.

---

## Événements significatifs

Le domaine `blog` publie ou peut publier des événements significatifs tels que :

- article créé ;
- article mis à jour ;
- article publié ;
- article dépublié ;
- article archivé ;
- taxonomie blog mise à jour ;
- relation de contenu modifiée ;
- statut d’article modifié.

Le domaine peut consommer des signaux liés à :

- capability boutique modifiée ;
- approbation accordée ;
- workflow terminé ;
- utilisateur mis à jour ;
- résultat d’intégration blog appliqué ;
- action administrative structurée de publication ou dépublication.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `blog` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- brouillon ;
- publié ;
- dépublié ;
- archivé.

Des états supplémentaires peuvent exister :

- en revue ;
- planifié ;
- expiré ;
- restreint.

Le domaine doit éviter :

- les articles “fantômes” ;
- les changements silencieux de publication ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `blog` expose principalement :

- des lectures d’articles structurés ;
- des taxonomies ou relations de contenu de blog ;
- des statuts éditoriaux ;
- des lectures exploitables par `storefront`, `seo`, `search`, `homepage-editorial`, `analytics` et certaines couches d’administration ;
- des structures de contenu prêtes à être rendues par les couches UI autorisées.

Le domaine reçoit principalement :

- des créations ou mises à jour d’articles ;
- des changements de structure, taxonomie, métadonnées ou contenu ;
- des demandes de lecture d’un article dans un contexte donné ;
- des demandes de publication, dépublication ou archivage ;
- des contextes de boutique, langue, audience, route ou canal d’exposition ;
- des demandes d’évaluation de l’état éditorial d’un article.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `blog` peut être exposé à des contraintes telles que :

- multi-boutiques ;
- multi-langues ;
- taxonomies riches ;
- workflows éditoriaux ;
- publication planifiée ;
- dépendance à des médias ;
- import ou projection vers systèmes externes ;
- rétrocompatibilité des slugs ou statuts.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des contenus blog reste dans `blog` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un article incohérent ne doit pas être promu silencieusement ;
- les conflits entre slug, statut, taxonomie, variante et exposition doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `blog` peut manipuler des contenus non publiés, des brouillons, des imports externes ou des contenus sensibles pour l’image et la cohérence de la boutique.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre brouillon, publié, archivé et dépublié ;
- protection des contenus non publics ;
- limitation de l’exposition selon le rôle, le scope, la langue et le statut éditorial ;
- audit des changements significatifs de contenu, taxonomie, structure ou publication.

---

## Observabilité et audit

Le domaine `blog` doit rendre visibles au minimum :

- quel article a été sélectionné dans un contexte donné ;
- quel statut éditorial est en vigueur ;
- quelles taxonomies, relations ou variantes sont actives ;
- pourquoi un article a été publié, dépublié, archivé ou filtré ;
- si un article n’est pas exposé à cause d’un statut non publié, d’une capability inactive, d’un contexte non compatible ou d’une règle applicable ;
- si une mise à jour provient d’une action interne ou d’un import externe.

L’audit doit permettre de répondre à des questions comme :

- quel article a été créé ou modifié ;
- quand ;
- selon quelle origine ;
- avec quel changement de contenu, taxonomie, structure ou statut ;
- avec quelle validation ou action de publication ;
- avec quel impact d’exposition.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- slug invalide ou dupliqué ;
- statut incohérent ;
- exposition refusée ;
- évolution non autorisée ;
- import ambigu ou concurrent.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `BlogPost` : article de blog structuré ;
- `BlogPostStatus` : état éditorial de l’article ;
- `BlogCategory` : catégorie de blog lorsque cette capability est activée ;
- `BlogTag` : tag de blog lorsque cette capability est activée ;
- `BlogAuthor` : auteur ou contributeur lorsque ce modèle est explicitement porté ;
- `BlogSeoMetadata` : métadonnées SEO propres au blog si le modèle final l’expose ;
- `BlogRelation` : relation de contenu ou contenu lié si le modèle final l’expose.

---

## Impact de maintenance / exploitation

Le domaine `blog` a un impact d’exploitation moyen lorsqu’il est activé.

Raisons :

- il structure des contenus éditoriaux visibles ;
- il peut être consommé par storefront, SEO, search, homepage éditoriale et analytics ;
- ses erreurs dégradent image, cohérence, indexation et exposition publique ;
- il nécessite une bonne explicabilité des statuts, slugs et taxonomies ;
- il peut dépendre de workflows, validations, imports et médias.

En exploitation, une attention particulière doit être portée à :

- la cohérence des slugs ;
- la stabilité des statuts ;
- la traçabilité des changements ;
- la cohérence avec taxonomies, médias et SEO ;
- les effets de bord sur storefront, homepage éditoriale, search et analytics ;
- la surveillance des imports externes.

Le domaine doit être considéré comme structurant dès qu’un socle de blog administrable existe réellement.

---

## Limites du domaine

Le domaine `blog` s’arrête :

- avant les pages éditoriales génériques ;
- avant la homepage éditoriale ;
- avant les événements publics ;
- avant les médias source ;
- avant le SEO transverse complet ;
- avant le rendu UI applicatif ;
- avant les DTO providers externes.

Le domaine `blog` porte les articles éditoriaux structurés.
Il ne doit pas devenir un CMS universel ni un doublon des autres domaines éditoriaux.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `blog` et `pages` ;
- la frontière exacte entre `blog` et `homepage-editorial` ;
- la frontière exacte entre `blog` et `seo` ;
- la part exacte des taxonomies, auteurs et contenus liés réellement supportés ;
- la gouvernance des validations via `approval` ou `workflow` ;
- la stratégie de rétrocompatibilité des slugs ;
- la hiérarchie entre vérité interne et projection externe éventuelle.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `pages.md`
- `homepage-editorial.md`
- `../cross-cutting/events.md`
- `../satellites/media.md`
- `../cross-cutting/seo.md`
- `../cross-cutting/search.md`
- `../core/stores.md`
- `../core/users.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../core/integrations.md`
