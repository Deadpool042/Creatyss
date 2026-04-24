# Médias

## Rôle

Le domaine `media` porte les ressources média structurées du système.

Il définit :

- ce qu’est un média du point de vue du système ;
- comment sont représentés les actifs média, leurs variantes, leurs métadonnées et leurs rattachements ;
- comment un média devient exploitable par les domaines consommateurs ;
- comment ce domaine se distingue du contenu éditorial, du rendu UI, du stockage provider-specific et des intégrations techniques ;
- comment le système reste maître de sa vérité interne sur les médias.

Le domaine existe pour fournir une représentation stable des actifs média, distincte :

- du catalogue produit porté par `products` ;
- des pages éditoriales portées par `pages` ;
- des articles portés par `blog` ;
- des événements publics portés par `events` ;
- des templates réutilisables portés par `template-system` ;
- de l’exécution provider-specific de stockage ou de transformation, qui relève de `integrations`.

---

## Convention galerie produit (V1)

Pour garantir un rendu storefront premium, stable et cohérent, toutes les images de galerie
produit doivent respecter les règles suivantes.

### Ratio

- Image galerie source : **4:5**
- Miniatures UI : **1:1** dérivées de l’image galerie

### Ordre recommandé

1. Vue principale hero
2. Vue portée ou vue d’échelle
3. Détail matière ou finition
4. Détail fonctionnel
5. Vue complémentaire

### Règles éditoriales

- Le produit doit rester clairement lisible
- La première image doit montrer le produit entier
- Les détails serrés ne doivent jamais être en première position
- Le cadrage doit rester cohérent d’une image à l’autre
- La lumière et la distance de prise de vue doivent rester homogènes
- Une image non conforme au ratio 4:5 n’est pas considérée comme hero-ready

### Objectif

Cette convention évite les compensations CSS en front et permet un hero produit plus stable,
plus lisible et plus premium sur desktop comme sur mobile.

---

## Classification

### Catégorie documentaire

`satellites`

### Criticité architecturale

`satellite structurant`

### Activable

`non`

Le domaine `media` est structurel dès lors que le système manipule des images, fichiers ou ressources visuelles partagées entre plusieurs domaines.

---

## Source de vérité

Le domaine `media` est la source de vérité pour :

- l’identité interne d’un média ;
- son statut métier ;
- ses métadonnées structurées ;
- ses variantes ou dérivés lorsqu’ils sont modélisés ici ;
- ses rattachements logiques vers des objets consommateurs ;
- ses règles internes d’exposition, d’édition, d’archivage ou de conservation lorsqu’elles sont portées ici.

Le domaine `media` n’est pas la source de vérité pour :

- le contenu métier des produits, pages, articles ou événements ;
- le rendu UI ;
- le stockage provider-specific externe ;
- les DTO de fournisseurs externes ;
- la logique éditoriale des domaines consommateurs ;
- la logique de templates réutilisables.

Un média est un actif structuré du système.
Il ne doit pas être confondu avec :

- un contenu éditorial complet ;
- un composant UI ;
- un provider de stockage ;
- un simple fichier anonyme sans statut ni rattachement.

---

## Responsabilités

Le domaine `media` est responsable de :

- définir ce qu’est un média dans le système ;
- porter les actifs média structurés ;
- porter leurs métadonnées structurées ;
- porter leurs variantes ou dérivés si le modèle les expose ;
- porter les rattachements logiques vers les objets consommateurs ;
- exposer des lectures gouvernées des médias actifs, archivés ou non exposables ;
- fournir une base média commune consommable par les domaines autorisés ;
- publier les événements significatifs liés à la vie d’un média.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- images produit ;
- fichiers éditoriaux ;
- variantes de formats ;
- politiques d’exposition ;
- politiques locales par boutique ;
- métadonnées descriptives, techniques ou éditoriales ;
- lecture admin des médias, références, variantes et statuts.

---

## Non-responsabilités

Le domaine `media` n’est pas responsable de :

- définir le catalogue produit ;
- définir les pages éditoriales ;
- définir les articles de blog ;
- définir les événements publics ;
- définir les templates réutilisables ;
- porter le rendu UI applicatif ;
- absorber toute la logique d’intégration provider-specific ;
- devenir un DAM universel hors périmètre du système.

Le domaine `media` ne doit pas devenir :

- un doublon de `products`, `pages`, `blog` ou `events` ;
- un simple wrapper sur un provider de stockage ;
- un fourre-tout de fichiers sans modèle métier ;
- un conteneur de logique éditoriale ou de rendu.

---

## Invariants

Les invariants minimaux sont les suivants :

- un média possède un identifiant stable ;
- un média possède un statut explicite ;
- une variante média est rattachée à une ressource explicite ;
- une référence média est rattachée à un média et à un objet consommateur explicites ;
- un média non exposable ne doit pas être servi hors règle explicite ;
- les autres domaines ne doivent pas recréer librement une vérité divergente sur les médias quand le cadre commun `media` existe ;
- une mutation significative de métadonnées, de variante ou de référence doit être traçable ;
- un média archivé ne doit pas être traité comme actif sans règle explicite.

Le domaine protège la cohérence des actifs média du système.

---

## Dépendances

### Dépendances métier

Le domaine `media` interagit fortement avec :

- `products`
- `pages`
- `blog`
- `events`
- `marketing`
- `template-system`
- `seo`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `approval`, si certaines publications ou utilisations nécessitent validation
- `workflow`, si le cycle de vie média suit un processus structuré
- `audit`
- `observability`
- `jobs`, si certaines variantes ou reconstructions sont différées

### Dépendances externes

Le domaine peut être appuyé par :

- stockage externe ;
- transformations d’images ;
- services d’upload ;
- CDN ;
- autres traitements provider-specific via `integrations`.

### Règle de frontière

Le domaine `media` porte la vérité interne des actifs média.
Il ne doit pas absorber :

- la logique éditoriale des domaines sources ;
- le rendu UI ;
- la logique provider-specific ;
- ni les templates réutilisables.

---

## Événements significatifs

Le domaine `media` publie ou peut publier des événements significatifs tels que :

- média créé ;
- média mis à jour ;
- média archivé ;
- statut média modifié ;
- variante média générée ;
- référence média mise à jour ;
- métadonnées média mises à jour.

Le domaine peut consommer des signaux liés à :

- publication approuvée ;
- workflow terminé ;
- capabilities de boutique modifiées ;
- actions administratives structurées de rattachement, d’archivage ou d’activation.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `media` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- actif ;
- non exposable ;
- archivé.

Des états supplémentaires peuvent exister :

- brouillon ;
- validé ;
- en attente ;
- supprimé logiquement ;
- restreint.

Le domaine doit éviter :

- les médias “fantômes” ;
- les statuts implicites ;
- les changements silencieux d’exposition ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `media` expose principalement :

- des lectures de médias structurés ;
- des métadonnées média ;
- des variantes ou dérivés média ;
- des références vers les objets consommateurs ;
- des lectures exploitables par les domaines autorisés ;
- des structures prêtes à être utilisées par les couches UI ou consommateurs autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de médias ;
- des demandes de lecture d’un média ou d’un ensemble de médias ;
- des changements de métadonnées, de statut ou de rattachement ;
- des demandes de génération ou de gestion de variantes ;
- des contextes de boutique, langue, usage, canal, audience ou objet consommateur ;
- des demandes d’évaluation de l’état ou de l’exposabilité d’un média.

Le domaine ne doit pas exposer comme contrat canonique un modèle dicté par un provider de stockage externe.

---

## Contraintes d’intégration

Le domaine `media` peut être exposé à des contraintes telles que :

- stockage local et externe ;
- variantes générées ou synchronisées ;
- exposition publique ou restreinte ;
- multi-boutiques ;
- multi-langues ;
- politiques de conservation ;
- références multiples vers des domaines consommateurs ;
- indisponibilité partielle d’un backend technique.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- les DTO providers restent dans `integrations` ;
- la vérité interne des médias reste dans `media` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une indisponibilité technique ne doit pas corrompre silencieusement la vérité métier ;
- les références orphelines doivent être détectables.

---

## Données sensibles / sécurité

Le domaine `media` peut manipuler des ressources non publiées, sensibles pour l’image de la boutique ou techniquement contraintes.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre média actif, brouillon, archivé ou non exposable ;
- protection des médias non publics ou internes ;
- limitation de l’exposition selon le rôle, le scope, le statut et l’usage ;
- audit des changements significatifs de métadonnées, variantes, références ou archivage.

---

## Observabilité et audit

Le domaine `media` doit rendre visibles au minimum :

- quel média a été sélectionné ou rattaché à un objet donné ;
- quel statut média est en vigueur ;
- quelles variantes ou métadonnées sont actives ;
- pourquoi un média a été archivé, filtré ou non exposé ;
- si un média n’est pas disponible à cause d’un statut, d’un contexte non compatible ou d’une règle applicable.

L’audit doit permettre de répondre à des questions comme :

- quel média a été créé, modifié ou archivé ;
- quand ;
- selon quelle origine ;
- avec quel rattachement ;
- avec quel changement de statut ;
- avec quel impact d’exposition.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- média introuvable ;
- référence incohérente ;
- variante invalide ;
- média non exposable.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `MediaAsset` : ressource média structurée ;
- `MediaVariant` : variante ou dérivé média ;
- `MediaMetadata` : métadonnées descriptives, techniques ou éditoriales ;
- `MediaReference` : rattachement logique à un objet consommateur ;
- `MediaStatus` : état du média ;
- `MediaPolicy` : règle d’exposition, d’édition ou d’archivage.

---

## Impact de maintenance / exploitation

Le domaine `media` a un impact d’exploitation moyen à élevé.

Raisons :

- il est consommé par plusieurs domaines ;
- ses erreurs dégradent catalogue, contenu, SEO et storefront ;
- il est exposé à des problématiques d’exposition publique ou restreinte ;
- il dépend souvent d’un socle technique externe pour le stockage ou la transformation ;
- il nécessite une bonne explicabilité des statuts et références.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- les références orphelines ;
- les variantes invalides ;
- l’exposition involontaire de médias non publics ;
- les divergences entre vérité interne et backend technique ;
- la traçabilité des changements sensibles.

Le domaine doit être considéré comme structurant dès qu’un socle média partagé existe réellement.

---

## Limites du domaine

Le domaine `media` s’arrête :

- avant le contenu métier des produits, pages, articles et événements ;
- avant le rendu UI ;
- avant les templates réutilisables ;
- avant la logique provider-specific de stockage ;
- avant les DTO d’intégration ;
- avant la logique éditoriale des domaines consommateurs.

Le domaine `media` porte les ressources média structurées du système.
Il ne doit pas devenir un DAM universel ni un doublon des domaines consommateurs.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `media` et `template-system` ;
- la frontière exacte entre `media` et `integrations` ;
- la responsabilité exacte des variantes générées ;
- la gestion multi-boutiques ou multi-langues ;
- la politique de conservation et d’archivage ;
- les cas d’exposition restreinte ;
- la responsabilité exacte des références produit ↔ média.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/foundation/stores.md`
- `../core/catalog/products.md`
- `../optional/pages.md`
- `../optional/blog.md`
- `../cross-cutting/seo.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../optional/platform/integrations.md`
