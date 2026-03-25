# Pages

## Rôle

Le domaine `pages` porte les pages éditoriales structurées du système.

Il définit :

- ce qu’est une page du point de vue du système ;
- comment une page est structurée, publiée, dépubliée, archivée ou exposée ;
- comment ce domaine se distingue du blog, des événements publics, des médias, des templates réutilisables, du SEO transverse et du rendu UI ;
- comment le système reste maître de sa vérité interne sur les pages éditoriales.

Le domaine existe pour fournir une représentation explicite des pages éditoriales, distincte :

- des articles portés par `blog` ;
- des événements publics portés par `events` ;
- des médias portés par `media` ;
- des templates réutilisables portés par `template-system` ;
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

Le domaine `pages` est activable.
Lorsqu’il est activé, il devient structurant pour les contenus éditoriaux administrables hors blog et hors événements.

---

## Source de vérité

Le domaine `pages` est la source de vérité pour :

- la définition interne d’une page éditoriale structurée ;
- sa route ou son identifiant d’exposition ;
- son statut éditorial ;
- ses sections ou blocs explicitement portés par le système ;
- ses variantes, si ce modèle est explicitement retenu ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `pages` n’est pas la source de vérité pour :

- les articles de blog, qui relèvent de `blog` ;
- les événements publics, qui relèvent de `events` ;
- les médias source, qui relèvent de `media` ;
- les templates réutilisables, qui relèvent de `template-system` ;
- le SEO transverse complet, qui relève de `seo` ;
- le rendu UI applicatif, qui relève des couches de présentation.

Une page est un objet éditorial structuré.
Elle ne doit pas être confondue avec :

- un article de blog ;
- un événement public ;
- un média ;
- un template réutilisable ;
- un simple écran UI ;
- un fragment de contenu sans gouvernance éditoriale.

---

## Responsabilités

Le domaine `pages` est responsable de :

- définir ce qu’est une page dans le système ;
- porter les pages éditoriales structurées ;
- porter leurs sections ou blocs ;
- porter les statuts de brouillon, publication, dépublication ou archivage ;
- exposer une lecture gouvernée des pages actives, en préparation ou archivées ;
- publier les événements significatifs liés à la vie d’une page ;
- protéger le système contre les pages implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- pages institutionnelles ;
- pages de contenu administrable ;
- variantes de page selon langue, audience ou boutique ;
- routes publiques éditoriales ;
- politiques d’exposition ou de publication locales ;
- structuration en sections ou blocs gouvernés.

---

## Non-responsabilités

Le domaine `pages` n’est pas responsable de :

- porter les articles de blog ;
- porter les événements publics ;
- porter les médias source ;
- porter les templates réutilisables ;
- porter le SEO transverse complet ;
- porter la logique de rendu UI applicative ;
- exécuter les intégrations provider-specific ;
- devenir un CMS universel absorbant tous les autres domaines éditoriaux.

Le domaine `pages` ne doit pas devenir :

- un doublon de `blog` ;
- un doublon de `events` ;
- un doublon de `media` ;
- un doublon de `template-system` ;
- un conteneur flou de contenu libre sans structure ni gouvernance.

---

## Invariants

Les invariants minimaux sont les suivants :

- une page possède un identifiant stable, une route explicite et un statut explicite ;
- une section de page est rattachée à une page explicite ;
- une page non publiée ne doit pas être exposée hors règle explicite ;
- une mutation significative de contenu, structure ou statut doit être traçable ;
- `pages` ne se confond pas avec `blog` ;
- `pages` ne se confond pas avec `events` ;
- `pages` ne se confond pas avec `media` ;
- `pages` ne se confond pas avec `template-system` ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente de page éditoriale quand le cadre commun existe.

Le domaine protège la cohérence des pages éditoriales structurées.

---

## Dépendances

### Dépendances métier

Le domaine `pages` interagit fortement avec :

- `media`
- `template-system`
- `stores`
- `seo`

### Dépendances transverses

Le domaine dépend également de :

- `approval`, si certaines publications nécessitent validation préalable
- `workflow`, si le cycle de vie d’une page suit un processus structuré
- `audit`
- `observability`
- `marketing`, comme consommateur ou contexte de diffusion selon le modèle retenu

### Dépendances externes

Le domaine peut être projeté vers :

- CMS externes ;
- plateformes marketing ;
- outils de publication ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `pages` porte les pages éditoriales structurées.
Il ne doit pas absorber :

- le blog ;
- les événements ;
- les médias source ;
- les templates réutilisables ;
- le SEO transverse complet ;
- ni le rendu UI applicatif.

---

## Événements significatifs

Le domaine `pages` publie ou peut publier des événements significatifs tels que :

- page créée ;
- page mise à jour ;
- page publiée ;
- page dépubliée ;
- page archivée ;
- section de page mise à jour ;
- statut de page modifié.

Le domaine peut consommer des signaux liés à :

- capability boutique modifiée ;
- approbation accordée ;
- workflow terminé ;
- action administrative structurée de publication ou dépublication.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `pages` possède un cycle de vie explicite.

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

- les pages “fantômes” ;
- les changements silencieux de publication ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `pages` expose principalement :

- des lectures de pages structurées ;
- des sections ou blocs de page ;
- des statuts éditoriaux ;
- des lectures exploitables par `storefront`, `seo`, `marketing`, `template-system`, `dashboarding` et certaines couches d’administration ;
- des structures de contenu prêtes à être rendues par les couches UI autorisées.

Le domaine reçoit principalement :

- des créations ou mises à jour de pages ;
- des changements de structure, sections ou contenus ;
- des demandes de lecture d’une page dans un contexte donné ;
- des demandes de publication, dépublication ou archivage ;
- des contextes de boutique, langue, audience, route ou canal d’exposition ;
- des demandes d’évaluation de l’état éditorial d’une page.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `pages` peut être exposé à des contraintes telles que :

- multi-boutiques ;
- multi-langues ;
- variantes de page ;
- workflows éditoriaux ;
- publication planifiée ;
- dépendance à des médias ou templates ;
- projection vers systèmes externes ;
- rétrocompatibilité des routes ou statuts.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des pages reste dans `pages` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une page incohérente ne doit pas être promue silencieusement ;
- les conflits entre route, statut, variante et exposition doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `pages` peut manipuler des contenus non publiés, des brouillons ou des pages sensibles pour l’image et la cohérence de la boutique.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre brouillon, publié, archivé et dépublié ;
- protection des pages non publiques ;
- limitation de l’exposition selon le rôle, le scope, la langue et le statut éditorial ;
- audit des changements significatifs de contenu, structure ou publication.

---

## Observabilité et audit

Le domaine `pages` doit rendre visibles au minimum :

- quelle page a été sélectionnée dans un contexte donné ;
- quel statut éditorial est en vigueur ;
- quelles sections ou variantes sont actives ;
- pourquoi une page a été publiée, dépubliée, archivée ou filtrée ;
- si une page n’est pas exposée à cause d’un statut non publié, d’une capability inactive, d’un contexte non compatible ou d’une règle applicable.

L’audit doit permettre de répondre à des questions comme :

- quelle page a été créée ou modifiée ;
- quand ;
- selon quelle origine ;
- avec quel changement de contenu, structure ou statut ;
- avec quelle validation ou action de publication ;
- avec quel impact d’exposition.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- route invalide ;
- statut incohérent ;
- exposition refusée ;
- évolution non autorisée.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `PageDefinition` : définition structurée d’une page ;
- `PageSection` : section ou bloc composant la page ;
- `PageStatus` : état éditorial de la page ;
- `PageRoute` : route ou identifiant d’exposition de la page ;
- `PagePolicy` : règle d’exposition, d’édition ou de publication ;
- `PageVariant` : variante de page selon contexte, langue ou audience si le modèle final l’expose.

---

## Impact de maintenance / exploitation

Le domaine `pages` a un impact d’exploitation moyen lorsqu’il est activé.

Raisons :

- il structure des contenus éditoriaux visibles ;
- il peut être consommé par storefront, SEO, marketing et administration ;
- ses erreurs dégradent image, cohérence et exposition publique ;
- il nécessite une bonne explicabilité des statuts et routes ;
- il peut dépendre de workflows, validations et médias.

En exploitation, une attention particulière doit être portée à :

- la cohérence des routes ;
- la stabilité des statuts ;
- la traçabilité des changements ;
- la cohérence avec médias, templates et SEO ;
- les effets de bord sur storefront et marketing.

Le domaine doit être considéré comme structurant dès qu’un socle de pages éditoriales administrables existe réellement.

---

## Limites du domaine

Le domaine `pages` s’arrête :

- avant le blog ;
- avant les événements publics ;
- avant les médias source ;
- avant les templates réutilisables ;
- avant le SEO transverse complet ;
- avant le rendu UI applicatif ;
- avant les DTO providers externes.

Le domaine `pages` porte les pages éditoriales structurées.
Il ne doit pas devenir un CMS universel ni un doublon des autres domaines éditoriaux.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `pages` et `template-system` ;
- la frontière exacte entre `pages` et `seo` ;
- la part exacte des variantes par langue, audience ou boutique ;
- la gouvernance des validations via `approval` ou `workflow` ;
- la stratégie de rétrocompatibilité des routes ;
- la hiérarchie entre vérité interne et projection externe éventuelle.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../optional/blog.md`
- `../cross-cutting/events.md`
- `../satellites/media.md`
- `../cross-cutting/template-system.md`
- `../cross-cutting/seo.md`
- `../core/stores.md`
- `../cross-cutting/marketing.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../core/integrations.md`
