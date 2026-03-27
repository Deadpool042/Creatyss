# SEO

## Rôle

Le domaine `seo` porte la structuration SEO transverse du système.

Il définit :

- ce qu’est une donnée SEO du point de vue du système ;
- comment sont portées les métadonnées de référencement, les règles d’indexation, les canoniques et les signaux d’exposition référentielle ;
- comment ce domaine se distingue des contenus source, du tracking, de l’analytics, du rendu UI et des intégrations provider-specific ;
- comment le système reste maître de sa vérité interne sur l’état SEO des objets exposés publiquement.

Le domaine existe pour fournir une représentation explicite de la cohérence référentielle, distincte :

- des pages éditoriales portées par `pages` ;
- des articles de blog portés par `blog` ;
- du catalogue produit porté par `products` ;
- des événements publics portés par `events` ;
- du tracking, de l’analytics et de l’attribution ;
- des DTO providers externes portés par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`non`

Le domaine `seo` est structurel dès lors qu’un contenu public indexable existe dans le système.

---

## Source de vérité

Le domaine `seo` est la source de vérité pour :

- les métadonnées SEO structurées ;
- les règles d’indexation ou de non-indexation ;
- les références et URLs canoniques lorsqu’elles sont gouvernées ici ;
- l’état SEO applicable à un objet donné ;
- les politiques de cohérence référentielle portées par le système ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `seo` n’est pas la source de vérité pour :

- les pages éditoriales, qui relèvent de `pages` ;
- les articles de blog, qui relèvent de `blog` ;
- le catalogue produit, qui relève de `products` ;
- les événements publics, qui relèvent de `events` ;
- le tracking, qui relève de `tracking` ;
- l’analyse de performance, qui relève de `analytics` ou `attribution` ;
- le rendu UI applicatif ;
- les DTO providers externes.

Une donnée SEO est une structuration référentielle gouvernée.
Elle ne doit pas être confondue avec :

- le contenu source lui-même ;
- une statistique de performance ;
- un simple champ libre dispersé ;
- un composant UI ;
- un retour provider externe non traduit.

---

## Responsabilités

Le domaine `seo` est responsable de :

- définir ce qu’est une donnée SEO dans le système ;
- porter les métadonnées SEO structurées ;
- porter les règles d’indexation ou de non-indexation ;
- porter les références canoniques ;
- exposer une lecture gouvernée de l’état SEO applicable à un objet donné ;
- publier les événements significatifs liés à la vie d’une donnée SEO ;
- protéger le système contre les structurations SEO implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- métadonnées SEO de pages ;
- métadonnées SEO de blog ;
- métadonnées SEO de catalogue ;
- règles de canonicalisation ;
- politiques locales par boutique ou langue ;
- règles globales d’exposition référentielle ;
- cohérence entre plusieurs objets exposés publiquement.

---

## Non-responsabilités

Le domaine `seo` n’est pas responsable de :

- porter les pages éditoriales ;
- porter les articles de blog ;
- porter le catalogue produit ;
- porter les événements publics ;
- porter le tracking ou l’analyse de performance SEO ;
- porter la logique de rendu UI applicative ;
- exécuter les intégrations provider-specific ;
- devenir un CMS éditorial parallèle ou un simple sac de champs sans langage métier commun.

Le domaine `seo` ne doit pas devenir :

- un doublon de `pages` ;
- un doublon de `blog` ;
- un doublon de `products` ;
- un doublon de `events` ;
- un doublon de `analytics` ;
- un conteneur flou de champs de référencement sans gouvernance.

---

## Invariants

Les invariants minimaux sont les suivants :

- une donnée SEO est rattachée à un objet source explicite ;
- une règle d’indexation possède une signification explicite ;
- `seo` ne se confond pas avec `pages` ;
- `seo` ne se confond pas avec `blog` ;
- `seo` ne se confond pas avec `products` ;
- `seo` ne se confond pas avec `events` ;
- `seo` ne se confond pas avec `analytics` ;
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de structuration SEO quand le cadre commun `seo` existe ;
- un objet non publiable ou explicitement non indexable ne doit pas être exposé comme indexable hors règle explicite.

Le domaine protège la cohérence référentielle transverse du système.

---

## Dépendances

### Dépendances métier

Le domaine `seo` interagit fortement avec :

- `pages`
- `blog`
- `products`
- `events`
- `stores`
- `marketing`

### Dépendances transverses

Le domaine dépend également de :

- `approval`, si certaines publications SEO sensibles nécessitent validation préalable
- `workflow`, si certaines modifications SEO suivent un processus structuré
- `audit`
- `observability`
- `dashboarding`

### Dépendances externes

Le domaine peut être relié indirectement à :

- moteurs de recherche ;
- outils SEO externes ;
- consoles d’indexation ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `seo` porte la structuration référentielle transverse.
Il ne doit pas absorber :

- les contenus source ;
- la mesure de performance ;
- le rendu UI ;
- les providers externes ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `seo` publie ou peut publier des événements significatifs tels que :

- métadonnée SEO mise à jour ;
- règle d’indexation mise à jour ;
- canonicalisation mise à jour ;
- politique SEO mise à jour ;
- statut SEO modifié.

Le domaine peut consommer des signaux liés à :

- page publiée ;
- article de blog publié ;
- produit publié ;
- événement publié ;
- capability boutique modifiée ;
- approbation accordée ;
- workflow terminé ;
- action administrative structurée de publication ou de modification SEO.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `seo` possède un cycle de vie partiel au niveau des structures et états qu’il porte.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- actif ;
- inactif ;
- restreint, si pertinent ;
- archivé, si pertinent.

Pour les décisions d’indexation, le domaine doit au minimum distinguer :

- indexable ;
- non indexable ;
- canonique ;
- filtré, si pertinent.

Le domaine doit éviter :

- les états SEO implicites ;
- les canonicalisations contradictoires ;
- les changements silencieux de politique ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `seo` expose principalement :

- des métadonnées SEO structurées ;
- des règles d’indexation ou de non-indexation ;
- des URLs canoniques ou signaux de canonicalisation ;
- des lectures exploitables par `pages`, `blog`, `products`, `events`, `marketing`, `dashboarding` et certaines couches d’administration ;
- des structures SEO prêtes à être utilisées par les couches UI ou domaines consommateurs autorisés.

Le domaine reçoit principalement :

- des objets source publiables issus de `pages`, `blog`, `products`, `events` ou d’autres domaines exposables ;
- des créations ou mises à jour de métadonnées SEO ;
- des demandes de lecture de l’état SEO d’un objet donné ;
- des changements de politique d’indexation, de canonicalisation ou d’exposition ;
- des contextes de boutique, langue, route, audience ou exposition publique ;
- des demandes d’évaluation de l’état SEO applicable à une ressource publique.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `seo` peut être exposé à des contraintes telles que :

- multi-boutiques ;
- multi-langues ;
- canonicalisation complexe ;
- objets publics multiples ;
- workflows éditoriaux ;
- dépendance à des statuts de publication ;
- projection vers systèmes externes ;
- rétrocompatibilité des URLs ou politiques.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne SEO reste dans `seo` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une donnée SEO incohérente ne doit pas être promue silencieusement ;
- les conflits entre objet source, indexation, canonicalisation et exposition doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `seo` manipule des règles d’exposition publique qui peuvent être sensibles pour l’image, la visibilité ou la cohérence de la boutique.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre objet source, métadonnée SEO et exposition publique effective ;
- protection des objets non publiés ou non indexables ;
- limitation de l’exposition selon le rôle, le scope, la langue et le statut public ;
- audit des changements significatifs de métadonnées, de canonicalisation ou de politiques d’indexation.

---

## Observabilité et audit

Le domaine `seo` doit rendre visibles au minimum :

- quel état SEO est appliqué à un objet donné ;
- quelle canonicalisation est en vigueur ;
- quelle règle d’indexation s’applique ;
- pourquoi un objet est indexable, non indexable ou filtré ;
- si un objet n’est pas exposé ou indexable à cause d’un statut non publié, d’une capability inactive, d’un contexte non compatible ou d’une règle applicable.

L’audit doit permettre de répondre à des questions comme :

- quelle métadonnée SEO ou règle a changé ;
- quand ;
- selon quelle origine ;
- pour quel objet source ;
- avec quelle politique appliquée ;
- avec quel impact sur l’exposition publique.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- objet source introuvable ;
- métadonnée invalide ;
- règle d’indexation invalide ;
- canonicalisation contradictoire ;
- exposition refusée.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `SeoMetadata` : métadonnées SEO structurées ;
- `SeoIndexingRule` : règle d’indexation ou de non-indexation ;
- `SeoCanonicalRef` : référence ou URL canonique ;
- `SeoPolicy` : règle globale de cohérence ou d’exposition référentielle ;
- `SeoStatus` : état SEO applicable à un objet donné ;
- `SeoSubjectRef` : référence vers l’objet source concerné.

---

## Impact de maintenance / exploitation

Le domaine `seo` a un impact d’exploitation moyen à élevé.

Raisons :

- il influence directement l’exposition publique et la cohérence référentielle ;
- ses erreurs affectent visibilité, duplication, indexation et image de la boutique ;
- il se situe à la frontière entre contenus publics et politiques transverses ;
- il nécessite une forte explicabilité des règles ;
- il dépend souvent de plusieurs domaines source.

En exploitation, une attention particulière doit être portée à :

- la cohérence des métadonnées ;
- les règles d’indexation ;
- les canonicalisations contradictoires ;
- la traçabilité des changements ;
- la cohérence avec les statuts de publication ;
- les effets de bord sur marketing, storefront et pilotage éditorial.

Le domaine doit être considéré comme structurant dès qu’un contenu public indexable réel existe.

---

## Limites du domaine

Le domaine `seo` s’arrête :

- avant les contenus source ;
- avant le tracking ;
- avant l’analyse de performance ;
- avant le rendu UI ;
- avant les intégrations externes ;
- avant les DTO providers externes.

Le domaine `seo` porte la structuration référentielle transverse.
Il ne doit pas devenir un CMS parallèle, un moteur d’analytics ou un simple assemblage de champs dispersés.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `seo` et `pages` ;
- la frontière exacte entre `seo` et `blog` ;
- la frontière exacte entre `seo` et `products` ;
- la frontière exacte entre `seo` et `analytics` ;
- la part exacte des politiques globales vs locales ;
- la hiérarchie entre vérité interne et systèmes externes de référencement éventuels.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../optional/pages.md`
- `../optional/blog.md`
- `../core/catalog/products.md`
- `../optional/events.md`
- `../core/foundation/stores.md`
- `approval.md`
- `workflow.md`
- `audit.md`
- `observability.md`
- `dashboarding.md`
- `marketing.md`
- `analytics.md`
- `attribution.md`
- `../optional/platform/integrations.md`
