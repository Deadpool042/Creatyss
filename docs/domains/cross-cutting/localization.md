# Localization

## Rôle

Le domaine `localization` porte l’adaptation localisée transverse du système.

Il définit :

- ce qu’est une locale du point de vue du système ;
- comment sont portées les langues, variantes locales, valeurs localisées, règles d’applicabilité et fallbacks ;
- comment ce domaine se distingue des contenus source eux-mêmes, du pricing, du SEO, des pages, des contenus juridiques et des intégrations externes ;
- comment le système reste maître de sa vérité interne sur les structures localisées.

Le domaine existe pour fournir une représentation explicite de la localisation transverse, distincte :

- des pages éditoriales portées par `pages` ;
- des articles de blog portés par `blog` ;
- des produits publiés portés par `products` ;
- du pricing et des devises portés par `pricing` ou un domaine monétaire dédié ;
- du SEO porté par `seo` ;
- des contenus juridiques source portés par `legal` ;
- des DTO providers externes portés par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`oui`

Le domaine `localization` est activable.
Lorsqu’il est activé, il devient structurant pour les langues, variantes locales, fallbacks et expositions multilingues ou multi-marchés.

---

## Source de vérité

Le domaine `localization` est la source de vérité pour :

- les locales supportées ;
- les variantes locales ou marchés lorsqu’ils sont portés ici ;
- les valeurs localisées structurées ;
- les règles d’applicabilité, de fallback ou d’exposition locale ;
- les politiques de publication ou d’activation des localisations ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `localization` n’est pas la source de vérité pour :

- les pages éditoriales, qui relèvent de `pages` ;
- les articles de blog, qui relèvent de `blog` ;
- les produits publiés, qui relèvent de `products` ;
- les prix ou devises, qui relèvent de `pricing` ;
- le SEO transverse lui-même, qui relève de `seo` ;
- les contenus juridiques source eux-mêmes, qui relèvent de `legal` ;
- les DTO providers externes.

Une localisation est une adaptation transverse gouvernée.
Elle ne doit pas être confondue avec :

- le contenu source complet ;
- une simple traduction libre hors contexte ;
- une règle de pricing ;
- une règle SEO ;
- un dictionnaire technique global sans langage métier.

---

## Responsabilités

Le domaine `localization` est responsable de :

- définir ce qu’est une locale dans le système ;
- porter les langues et variantes locales supportées ;
- porter les valeurs ou contenus localisés structurés lorsqu’ils sont gouvernés transversalement ;
- porter les règles d’applicabilité, de fallback et d’exposition locale ;
- exposer une lecture gouvernée de ce qui est localisé et applicable dans un contexte donné ;
- publier les événements significatifs liés à la vie d’une localisation ;
- protéger le système contre les structures localisées implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- locales par boutique ;
- marchés locaux ;
- traductions de champs transverses ;
- fallbacks de langue ;
- variantes par marché ;
- politiques de publication locale ;
- activation ou désactivation de localisations ;
- cohérence de l’exposition multilingue.

---

## Non-responsabilités

Le domaine `localization` n’est pas responsable de :

- porter les pages éditoriales ;
- porter les articles de blog ;
- porter les produits publiés ;
- porter les prix ou devises ;
- porter le SEO transverse lui-même ;
- porter les contenus juridiques source ;
- exécuter les intégrations provider-specific ;
- devenir un simple dictionnaire technique global sans rattachement aux objets du système.

Le domaine `localization` ne doit pas devenir :

- un doublon de `pages` ;
- un doublon de `blog` ;
- un doublon de `products` ;
- un doublon de `pricing` ;
- un doublon de `seo` ;
- un conteneur flou de traductions sans gouvernance de contexte.

---

## Invariants

Les invariants minimaux sont les suivants :

- une valeur localisée est rattachée à un objet source explicite et à une locale explicite ;
- une règle de fallback ou d’exposition possède une signification explicite ;
- `localization` ne se confond pas avec `pages` ;
- `localization` ne se confond pas avec `blog` ;
- `localization` ne se confond pas avec `products` ;
- `localization` ne se confond pas avec `pricing` ;
- `localization` ne se confond pas avec `seo` ;
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de localisation transverse quand le cadre commun `localization` existe ;
- une valeur localisée inapplicable, inactive ou non publiée ne doit pas être exposée hors règle explicite.

Le domaine protège la cohérence de l’adaptation localisée transverse.

---

## Dépendances

### Dépendances métier

Le domaine `localization` interagit fortement avec :

- `stores`
- `pages`
- `blog`
- `products`
- `seo`
- `legal`
- `template-system`
- `search`

### Dépendances transverses

Le domaine dépend également de :

- `approval`, si certaines publications localisées nécessitent validation préalable
- `workflow`, si certaines localisations suivent un processus structuré
- `audit`
- `observability`
- `dashboarding`

### Dépendances externes

Le domaine peut être relié indirectement à :

- services de traduction ;
- CMS de traduction ;
- référentiels marchés externes ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `localization` porte l’adaptation localisée transverse.
Il ne doit pas absorber :

- les contenus source ;
- le pricing ;
- le SEO lui-même ;
- les contenus juridiques source ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `localization` publie ou peut publier des événements significatifs tels que :

- locale créée ;
- locale mise à jour ;
- valeur localisée mise à jour ;
- règle de localisation mise à jour ;
- politique de localisation mise à jour ;
- statut de localisation modifié.

Le domaine peut consommer des signaux liés à :

- capability boutique modifiée ;
- page mise à jour ;
- article de blog mis à jour ;
- produit mis à jour ;
- métadonnée SEO mise à jour ;
- document juridique mis à jour ;
- approbation accordée ;
- workflow terminé ;
- action administrative structurée de publication ou de correction de localisation.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `localization` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- active ;
- inactive ;
- publiée, si pertinent ;
- archivée, si pertinent.

Des états supplémentaires peuvent exister :

- brouillon ;
- en révision ;
- fallback ;
- restreinte ;
- expirée.

Le domaine doit éviter :

- les localisations “fantômes” ;
- les changements silencieux de fallback ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `localization` expose principalement :

- des locales structurées ;
- des valeurs ou contenus localisés structurés ;
- des règles de fallback ou d’applicabilité locale ;
- des lectures exploitables par `pages`, `blog`, `products`, `seo`, `legal`, `template-system`, `search`, `dashboarding` et certaines couches d’administration ;
- des structures localisées prêtes à être consommées par les couches UI ou domaines opérationnels autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de locales supportées ;
- des demandes de traduction ou de mise à jour de valeurs localisées ;
- des demandes de lecture d’une valeur localisée applicable dans un contexte donné ;
- des changements de règles de fallback, de disponibilité ou d’exposition locale ;
- des contextes de boutique, langue, pays, marché, audience, canal ou surface d’exposition ;
- des signaux internes utiles à l’activation, la désactivation ou la substitution d’une localisation.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `localization` peut être exposé à des contraintes telles que :

- multi-langues ;
- multi-boutiques ;
- multi-marchés ;
- fallback de langue ;
- publication différée ;
- dépendance à des contextes locaux ;
- synchronisation avec systèmes externes ;
- rétrocompatibilité des locales ou politiques.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des structures localisées reste dans `localization` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une localisation incohérente ne doit pas être promue silencieusement ;
- les conflits entre locale, fallback, statut et exposition doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `localization` manipule des contenus susceptibles d’impacter fortement l’exposition publique, la cohérence juridique ou la compréhension fonctionnelle de la boutique.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre objet source, valeur localisée, règle de fallback et politique d’exposition ;
- protection des localisations non publiées, incomplètes ou réservées à certains contextes ;
- limitation de l’exposition selon le rôle, le scope, la langue, le marché et le statut ;
- audit des changements significatifs de traduction, de fallback ou de politique locale.

---

## Observabilité et audit

Le domaine `localization` doit rendre visibles au minimum :

- quelle locale est en vigueur ;
- quelle valeur localisée a été retenue ;
- quelle règle de fallback ou d’applicabilité a été utilisée ;
- pourquoi une valeur localisée est absente, remplacée, fallbackée ou non exposée ;
- si une localisation n’est pas disponible à cause d’une capability inactive, d’un statut inactif, d’un contexte non compatible ou d’une règle applicable.

L’audit doit permettre de répondre à des questions comme :

- quelle locale ou valeur localisée a été créée ou modifiée ;
- quand ;
- selon quelle origine ;
- avec quelle règle de fallback ou politique appliquée ;
- avec quelle action manuelle significative ;
- avec quel impact sur l’exposition locale.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- locale non supportée ;
- valeur localisée absente ;
- règle de fallback incohérente ;
- exposition refusée ;
- contexte non compatible.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `LocaleDefinition` : langue, variante locale ou marché supporté ;
- `LocalizedValue` : valeur localisée structurée ;
- `LocalizationRule` : règle d’applicabilité, de fallback ou d’exposition locale ;
- `LocalizationPolicy` : règle de gouvernance ou de publication des localisations ;
- `LocalizationStatus` : état d’une localisation ou d’une locale ;
- `LocalizationSubjectRef` : référence vers l’objet source concerné.

---

## Impact de maintenance / exploitation

Le domaine `localization` a un impact d’exploitation moyen à élevé lorsqu’il est activé.

Raisons :

- il structure l’exposition multilingue et multi-marchés ;
- ses erreurs dégradent compréhension, cohérence publique et parfois conformité ;
- il se situe à la frontière entre plusieurs domaines source ;
- il nécessite une forte explicabilité des fallbacks et statuts ;
- il dépend souvent de capacités activables et de contextes multiples.

En exploitation, une attention particulière doit être portée à :

- la cohérence des locales ;
- la validité des valeurs localisées ;
- les fallbacks incohérents ;
- la traçabilité des changements ;
- la cohérence avec les domaines source ;
- les effets de bord sur storefront, SEO, juridique et template-system.

Le domaine doit être considéré comme structurant dès qu’une exposition localisée réelle existe.

---

## Limites du domaine

Le domaine `localization` s’arrête :

- avant les contenus source ;
- avant le pricing et les devises ;
- avant le SEO transverse lui-même ;
- avant les contenus juridiques source ;
- avant les intégrations externes ;
- avant les DTO providers externes.

Le domaine `localization` porte l’adaptation localisée transverse du système.
Il ne doit pas devenir un simple dictionnaire technique global ni un doublon des domaines source.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `localization` et `pages` ;
- la frontière exacte entre `localization` et `products` ;
- la frontière exacte entre `localization` et `seo` ;
- la part exacte des fallbacks réellement supportés ;
- la gouvernance des marchés vs langues ;
- la hiérarchie entre vérité interne et services externes de traduction éventuels.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/stores.md`
- `../optional/pages.md`
- `../optional/blog.md`
- `../core/products.md`
- `seo.md`
- `legal.md`
- `template-system.md`
- `search.md`
- `approval.md`
- `workflow.md`
- `audit.md`
- `observability.md`
- `dashboarding.md`
- `pricing.md`
- `../core/integrations.md`
