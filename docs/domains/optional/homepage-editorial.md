# Homepage éditoriale

## Rôle

Le domaine `homepage-editorial` porte l’éditorial structuré de la page d’accueil.

Il définit :

- ce qu’est une homepage éditoriale du point de vue du système ;
- comment sont structurés ses blocs, sections, ordres, variantes et statuts ;
- comment ce domaine se distingue des pages génériques, du blog, des médias, du SEO transverse, du catalogue et du rendu UI ;
- comment le système reste maître de sa vérité interne sur l’éditorial de homepage.

Le domaine existe pour fournir une représentation explicite de la page d’accueil éditoriale, distincte :

- des pages éditoriales génériques portées par `pages` ;
- des articles portés par `blog` ;
- des médias portés par `media` ;
- du SEO transverse porté par `seo` ;
- du catalogue produit porté par `products` ;
- des couches UI de rendu.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`optionnel structurant`

### Activable

`oui`

Le domaine `homepage-editorial` est activable.
Lorsqu’il est activé, il devient structurant pour la page d’accueil administrable et ses blocs éditoriaux gouvernés.

---

## Source de vérité

Le domaine `homepage-editorial` est la source de vérité pour :

- la définition interne de la homepage éditoriale ;
- ses sections ou blocs structurés ;
- leur ordre ;
- leur statut éditorial ;
- leurs variantes, si ce modèle est explicitement retenu ;
- les relations explicites vers d’autres domaines quand elles sont portées par la homepage ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `homepage-editorial` n’est pas la source de vérité pour :

- les pages éditoriales génériques, qui relèvent de `pages` ;
- les articles de blog, qui relèvent de `blog` ;
- les médias source, qui relèvent de `media` ;
- le SEO transverse complet, qui relève de `seo` ;
- le catalogue produit, qui relève de `products` ;
- le rendu UI applicatif, qui relève des couches de présentation ;
- un CMS externe, qui relève de `integrations` s’il existe.

Une homepage éditoriale est un objet éditorial structuré et gouverné.
Elle ne doit pas être confondue avec :

- une page générique ;
- une page blog ;
- un assemblage libre de composants UI ;
- un simple écran front codé en dur ;
- un CMS global sans frontière métier.

---

## Responsabilités

Le domaine `homepage-editorial` est responsable de :

- définir ce qu’est la homepage éditoriale dans le système ;
- porter ses blocs ou sections structurés ;
- porter leur ordre ;
- porter les statuts de brouillon, publication, dépublication ou archivage ;
- exposer une lecture gouvernée de la homepage active, en préparation ou archivée ;
- publier les événements significatifs liés à la vie de la homepage éditoriale ;
- protéger le système contre les homepages implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- hero homepage ;
- sections éditoriales ;
- produits mis en avant ;
- collections ou catégories mises en avant ;
- contenus blog ou éditoriaux mis en avant ;
- variantes par boutique, langue ou audience ;
- politiques locales d’exposition de la homepage.

---

## Non-responsabilités

Le domaine `homepage-editorial` n’est pas responsable de :

- porter les pages éditoriales génériques ;
- porter les articles de blog ;
- porter les médias source ;
- porter le SEO transverse complet ;
- porter le catalogue produit ;
- porter la logique de rendu UI applicative ;
- exécuter les intégrations provider-specific ;
- devenir un CMS universel absorbant tous les autres domaines éditoriaux.

Le domaine `homepage-editorial` ne doit pas devenir :

- un doublon de `pages` ;
- un doublon de `blog` ;
- un doublon de `media` ;
- un doublon de `products` ;
- un conteneur flou de contenu libre sans structure ni gouvernance.

---

## Invariants

Les invariants minimaux sont les suivants :

- une homepage éditoriale possède un identifiant stable et un statut explicite ;
- une section de homepage est rattachée explicitement à une homepage ;
- l’ordre des sections est explicite ;
- une homepage non publiée ne doit pas être exposée hors règle explicite ;
- une mutation significative de contenu, structure, ordre ou statut doit être traçable ;
- `homepage-editorial` ne se confond pas avec `pages` ;
- `homepage-editorial` ne se confond pas avec `blog` ;
- `homepage-editorial` ne se confond pas avec `products` ;
- les relations vers d’autres domaines pointent vers des objets existants ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente de homepage éditoriale quand le cadre commun existe.

Le domaine protège la cohérence de l’éditorial structuré de la page d’accueil.

---

## Dépendances

### Dépendances métier

Le domaine `homepage-editorial` interagit fortement avec :

- `pages`
- `blog`
- `media`
- `products`
- `stores`
- `seo`

### Dépendances transverses

Le domaine dépend également de :

- `approval`, si certaines publications nécessitent validation préalable
- `workflow`, si le cycle de vie de la homepage suit un processus structuré
- `audit`
- `observability`
- `marketing`, comme consommateur ou contexte de diffusion selon le modèle retenu

### Dépendances externes

Le domaine peut être alimenté ou projeté vers :

- CMS externes ;
- outils d’édition ;
- plateformes marketing ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `homepage-editorial` porte l’éditorial structuré de la homepage.
Il ne doit pas absorber :

- les pages génériques ;
- le blog ;
- les médias source ;
- le SEO transverse complet ;
- le catalogue produit ;
- ni le rendu UI applicatif.

---

## Événements significatifs

Le domaine `homepage-editorial` publie ou peut publier des événements significatifs tels que :

- homepage éditoriale créée ;
- homepage éditoriale mise à jour ;
- homepage éditoriale publiée ;
- homepage éditoriale dépubliée ;
- homepage éditoriale archivée ;
- section de homepage mise à jour ;
- ordre des sections modifié ;
- statut de homepage modifié.

Le domaine peut consommer des signaux liés à :

- capability boutique modifiée ;
- approbation accordée ;
- workflow terminé ;
- action administrative structurée de publication, dépublication ou réordonnancement.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `homepage-editorial` possède un cycle de vie explicite.

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

- les homepages “fantômes” ;
- les changements silencieux d’ordre ou de publication ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `homepage-editorial` expose principalement :

- des lectures de homepage structurée ;
- des sections ou blocs de homepage ;
- des ordres de sections ;
- des statuts éditoriaux ;
- des lectures exploitables par `storefront`, `seo`, `marketing`, `analytics` et certaines couches d’administration ;
- des structures de contenu prêtes à être rendues par les couches UI autorisées.

Le domaine reçoit principalement :

- des créations ou mises à jour de homepage éditoriale ;
- des changements de structure, sections, contenus ou ordre ;
- des demandes de lecture de la homepage dans un contexte donné ;
- des demandes de publication, dépublication ou archivage ;
- des contextes de boutique, langue, audience ou canal d’exposition ;
- des demandes d’évaluation de l’état éditorial de la homepage.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `homepage-editorial` peut être exposé à des contraintes telles que :

- multi-boutiques ;
- multi-langues ;
- variantes de homepage ;
- workflows éditoriaux ;
- publication planifiée ;
- dépendance à des médias, produits ou contenus liés ;
- projection vers systèmes externes ;
- rétrocompatibilité des structures ou statuts.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne de la homepage reste dans `homepage-editorial` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une homepage incohérente ne doit pas être promue silencieusement ;
- les conflits entre ordre, statut, variante et exposition doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `homepage-editorial` peut manipuler des contenus non publiés, des brouillons ou des sélections sensibles pour l’image et la cohérence de la boutique.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre brouillon, publié, archivé et dépublié ;
- protection des homepages non publiques ;
- limitation de l’exposition selon le rôle, le scope, la langue et le statut éditorial ;
- audit des changements significatifs de contenu, structure, ordre ou publication.

---

## Observabilité et audit

Le domaine `homepage-editorial` doit rendre visibles au minimum :

- quelle homepage a été sélectionnée dans un contexte donné ;
- quel statut éditorial est en vigueur ;
- quelles sections, variantes ou mises en avant sont actives ;
- pourquoi une homepage a été publiée, dépubliée, archivée ou filtrée ;
- si une homepage n’est pas exposée à cause d’un statut non publié, d’une capability inactive, d’un contexte non compatible ou d’une règle applicable.

L’audit doit permettre de répondre à des questions comme :

- quelle homepage a été créée ou modifiée ;
- quand ;
- selon quelle origine ;
- avec quel changement de contenu, structure, ordre ou statut ;
- avec quelle validation ou action de publication ;
- avec quel impact d’exposition.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- ordre invalide ;
- statut incohérent ;
- exposition refusée ;
- évolution non autorisée.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `HomepageDefinition` : définition structurée de la homepage ;
- `HomepageSection` : section ou bloc composant la homepage ;
- `HomepageSectionOrder` : ordre explicite des sections ;
- `HomepageStatus` : état éditorial de la homepage ;
- `HomepagePolicy` : règle d’exposition, d’édition ou de publication ;
- `HomepageVariant` : variante de homepage selon contexte, langue ou audience si le modèle final l’expose.

---

## Impact de maintenance / exploitation

Le domaine `homepage-editorial` a un impact d’exploitation moyen lorsqu’il est activé.

Raisons :

- il structure la page d’accueil visible ;
- il peut être consommé par storefront, SEO, marketing et administration ;
- ses erreurs dégradent image, cohérence et exposition publique ;
- il nécessite une bonne explicabilité des statuts, ordres et contenus ;
- il peut dépendre de workflows, validations, médias et contenus liés.

En exploitation, une attention particulière doit être portée à :

- la cohérence des ordres ;
- la stabilité des statuts ;
- la traçabilité des changements ;
- la cohérence avec médias, produits, blog et SEO ;
- les effets de bord sur storefront et marketing.

Le domaine doit être considéré comme structurant dès qu’une homepage administrable et éditorialisée existe réellement.

---

## Limites du domaine

Le domaine `homepage-editorial` s’arrête :

- avant les pages génériques ;
- avant le blog ;
- avant les médias source ;
- avant le SEO transverse complet ;
- avant le catalogue produit ;
- avant le rendu UI applicatif ;
- avant les DTO providers externes.

Le domaine `homepage-editorial` porte l’éditorial structuré de la homepage.
Il ne doit pas devenir un CMS universel ni un doublon des autres domaines éditoriaux.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `homepage-editorial` et `pages` ;
- la frontière exacte entre `homepage-editorial` et `blog` ;
- la frontière exacte entre `homepage-editorial` et `seo` ;
- la part exacte des variantes par langue, audience ou boutique ;
- la gouvernance des validations via `approval` ou `workflow` ;
- la stratégie de rétrocompatibilité des structures ;
- la hiérarchie entre vérité interne et projection externe éventuelle.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `pages.md`
- `blog.md`
- `../satellites/media.md`
- `../cross-cutting/seo.md`
- `../core/products.md`
- `../core/stores.md`
- `../cross-cutting/marketing.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../core/integrations.md`
