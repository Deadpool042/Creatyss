# Domaine pages

## Rôle

Le domaine `pages` porte les pages éditoriales structurées du socle.

Il organise les pages de contenu public ou administrable de la boutique, leurs sections, leur état de publication et leur composition éditoriale, sans absorber le blog, les événements publics, les templates réutilisables, les médias, le SEO transverse ou la logique UI de rendu.

## Responsabilités

Le domaine `pages` prend en charge :

- les pages éditoriales structurées
- les sections ou blocs de page
- les états de brouillon, publication, archivage ou dépublication
- la composition éditoriale de pages hors blog et hors événements
- la lecture gouvernée des pages actives ou en préparation
- la base de contenu de pages consommable par le storefront, `seo`, `marketing`, `template-system`, `dashboarding` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `pages` ne doit pas :

- porter les articles de blog, qui relèvent de `blog`
- porter les événements publics, qui relèvent de `events`
- porter les médias source, qui relèvent de `media`
- porter les templates réutilisables, qui relèvent de `template-system`
- porter la logique de rendu UI applicative, qui relève des couches de présentation
- porter le SEO transverse complet, qui relève de `seo`
- devenir un CMS universel absorbant tous les autres domaines éditoriaux

Le domaine `pages` porte les pages éditoriales structurées. Il ne remplace ni `blog`, ni `events`, ni `media`, ni `template-system`, ni `seo`.

## Sous-domaines

- `definitions` : définitions de pages structurées
- `sections` : sections, blocs ou zones composant une page
- `publication` : états de publication, archivage ou dépublication
- `policies` : règles d’exposition, d’édition ou de publication des pages

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour de pages
- des changements de structure, sections ou contenus de page
- des demandes de lecture d’une page dans un contexte donné
- des demandes de publication, dépublication ou archivage
- des contextes de boutique, langue, audience, route ou canal d’exposition
- des demandes d’évaluation de l’état éditorial d’une page

## Sorties

Le domaine expose principalement :

- des pages structurées
- des sections ou blocs de page
- des états de publication de page
- des lectures exploitables par le storefront, `seo`, `marketing`, `template-system`, `dashboarding` et certaines couches d’administration
- des structures de contenu de page prêtes à être rendues par les couches UI autorisées

## Dépendances vers autres domaines

Le domaine `pages` peut dépendre de :

- `media` pour référencer des ressources média utilisées dans les pages
- `template-system` pour certains gabarits ou structures réutilisables si le modèle retenu le prévoit
- `seo` pour certaines métadonnées ou règles d’exposition référentielle, sans absorber sa responsabilité
- `approval` si certaines publications de pages nécessitent validation préalable
- `workflow` si le cycle de vie d’une page suit un processus structuré
- `audit` pour tracer certains changements sensibles de page ou de publication
- `observability` pour expliquer pourquoi une page a été publiée, filtrée, archivée ou non exposée
- `stores` pour le contexte boutique, langue ou politiques locales

Les domaines suivants peuvent dépendre de `pages` :

- `seo`
- `marketing`
- `template-system`
- `dashboarding`
- le storefront
- certaines couches d’administration

## Capabilities activables liées

Le domaine `pages` n’est pas une capability métier optionnelle au sens strict du noyau, mais il devient particulièrement important lorsque la boutique expose des contenus éditoriaux administrables.

Exemples de capabilities liées :

- `multiLanguage`
- `marketingCampaigns`
- `publicEvents`
- `newsletter`

### Règle

Le domaine `pages` reste structurellement présent même si peu de pages éditoriales sont activement administrées.

Il constitue le cadre commun des pages éditoriales hors blog et hors événements.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `content_editor`
- `marketing_manager` en lecture ou contribution partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `pages.read`
- `pages.write`
- `media.read`
- `seo.read`
- `marketing.read`
- `template_system.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `page.created`
- `page.updated`
- `page.published`
- `page.unpublished`
- `page.archived`
- `page.section.updated`
- `page.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `store.capabilities.updated`
- `approval.approved`
- `workflow.completed`
- certaines actions administratives structurées de publication ou de dépublication

Il doit toutefois rester maître de sa propre logique éditoriale de page.

## Intégrations externes

Le domaine `pages` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut fournir du contenu à des domaines ou couches qui exposent ensuite ce contenu, mais :

- la vérité des pages internes reste dans `pages`
- les DTO providers externes restent dans `integrations`
- le rendu effectif reste dans les couches UI ou domaines consommateurs autorisés

## Données sensibles / sécurité

Le domaine `pages` peut manipuler des contenus non publiés, des brouillons ou des pages sensibles pour l’image et la cohérence de la boutique.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre brouillon, publié, archivé et dépublié
- protection des pages non publiques
- limitation de l’exposition selon le rôle, le scope, la langue et le statut éditorial
- audit des changements significatifs de contenu, structure ou publication

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelle page a été sélectionnée dans un contexte donné
- quel statut éditorial est en vigueur
- quelles sections ou variantes sont actives
- pourquoi une page a été publiée, dépubliée, archivée ou filtrée
- si une page n’est pas exposée à cause d’un statut non publié, d’une capability off, d’un contexte non compatible ou d’une règle applicable

### Audit

Il faut tracer :

- la création d’une page
- la modification significative d’une page
- la publication ou la dépublication d’une page sensible
- les changements significatifs de structure ou de sections
- certaines consultations sensibles si le modèle final les retient explicitement

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `PageDefinition` : définition structurée d’une page
- `PageSection` : section ou bloc composant la page
- `PageStatus` : état éditorial de la page
- `PageRoute` : route ou identifiant d’exposition de la page
- `PagePolicy` : règle d’exposition, d’édition ou de publication
- `PageVariant` : variante de page selon contexte, langue ou audience si le modèle final l’expose

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une page possède un identifiant stable, une route explicite et un statut explicite
- une section de page est rattachée à une page explicite
- `pages` ne se confond pas avec `blog`
- `pages` ne se confond pas avec `events`
- `pages` ne se confond pas avec `media`
- `pages` ne se confond pas avec `template-system`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de page éditoriale quand le cadre commun `pages` existe
- une page non publiée ne doit pas être exposée hors règle explicite

## Cas d’usage principaux

1. Définir une page éditoriale administrable
2. Structurer une page en sections ou blocs cohérents
3. Publier ou dépublier une page
4. Exposer une page publique dans le storefront
5. Alimenter `seo` ou `marketing` avec la lecture d’une page publiée
6. Exposer à l’admin une lecture claire des pages, statuts et structures disponibles

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- page introuvable
- route de page invalide ou en conflit
- section invalide ou incompatible
- page non publiée ou archivée
- capability ou contexte non compatible
- tentative de lecture ou d’exposition non autorisée
- conflit entre plusieurs règles d’exposition ou de priorité

## Décisions d’architecture

Les choix structurants du domaine sont :

- `pages` porte les pages éditoriales structurées du socle
- `pages` est distinct de `blog`
- `pages` est distinct de `events`
- `pages` est distinct de `media`
- `pages` est distinct de `template-system`
- les couches UI et domaines consommateurs lisent la vérité des pages via `pages`, sans la recréer localement
- les contenus, statuts et publications sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les pages éditoriales structurées relèvent de `pages`
- les articles de blog relèvent de `blog`
- les événements publics relèvent de `events`
- les médias source relèvent de `media`
- les gabarits réutilisables relèvent de `template-system`
- `pages` ne remplace ni `blog`, ni `events`, ni `media`, ni `template-system`, ni `integrations`

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
