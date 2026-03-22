# Domaine localization

## Rôle

Le domaine `localization` porte l’adaptation localisée du socle.

Il organise les langues, variantes locales, libellés localisés, contenus localisés, conventions régionales et règles d’exposition selon le contexte géographique ou linguistique, sans absorber les contenus source eux-mêmes, les prix, les devises, les SEO rules, les pages ou les intégrations externes.

## Responsabilités

Le domaine `localization` prend en charge :

- les langues et variantes locales supportées
- les contenus localisés au niveau du socle lorsqu’ils doivent être structurés transversalement
- les libellés, valeurs et champs localisés
- les règles d’exposition selon langue, locale ou marché si le modèle retenu le prévoit
- la lecture gouvernée de ce qui est localisé et applicable dans un contexte donné
- la base de localisation consommable par `pages`, `blog`, `products`, `seo`, `legal`, `template-system`, `search`, `dashboarding` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `localization` ne doit pas :

- porter les pages éditoriales, qui relèvent de `pages`
- porter les articles de blog, qui relèvent de `blog`
- porter les produits publiés, qui relèvent de `products`
- porter les prix ou devises, qui relèvent de `pricing` ou d’un domaine monétaire dédié
- porter le SEO transverse lui-même, qui relève de `seo`
- porter les contenus juridiques source eux-mêmes, qui relèvent de `legal`
- devenir un simple dictionnaire technique global sans langage métier explicite ni rattachement aux objets du socle

Le domaine `localization` porte l’adaptation localisée transverse du socle. Il ne remplace ni `pages`, ni `blog`, ni `products`, ni `pricing`, ni `seo`, ni `legal`.

## Sous-domaines

- `locales` : langues, variantes locales et marchés supportés
- `translations` : valeurs ou contenus localisés structurés
- `rules` : règles d’applicabilité, fallback ou exposition locale
- `policies` : règles de gouvernance, d’édition ou de publication des localisations

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour de locales supportées
- des demandes de traduction ou de mise à jour de valeurs localisées
- des demandes de lecture d’une valeur localisée applicable dans un contexte donné
- des changements de règles de fallback, de disponibilité ou d’exposition locale
- des contextes de boutique, langue, pays, marché, audience, canal ou surface d’exposition
- des signaux internes utiles à l’activation, la désactivation ou la substitution d’une localisation

## Sorties

Le domaine expose principalement :

- des locales structurées
- des valeurs ou contenus localisés structurés
- des règles de fallback ou d’applicabilité locale
- des lectures exploitables par `pages`, `blog`, `products`, `seo`, `legal`, `template-system`, `search`, `dashboarding` et certaines couches d’administration
- des structures localisées prêtes à être consommées par les couches UI ou domaines opérationnels autorisés

## Dépendances vers autres domaines

Le domaine `localization` peut dépendre de :

- `store` pour le contexte boutique, marché, langue par défaut ou politiques locales
- `pages` pour certains usages de contenus éditoriaux localisés sans absorber leur responsabilité
- `blog` pour certains contenus éditoriaux localisés sans absorber leur responsabilité
- `products` pour certains champs catalogue localisés sans absorber leur responsabilité
- `seo` pour certains champs référentiels localisés sans absorber sa responsabilité
- `legal` pour certaines versions localisées de contenus juridiques sans absorber leur responsabilité
- `approval` si certaines publications localisées nécessitent validation préalable
- `workflow` si certaines localisations suivent un processus structuré
- `audit` pour tracer certains changements sensibles de traduction ou de politique locale
- `observability` pour expliquer pourquoi une valeur localisée est applicable, absente, fallbackée ou non exposée

Les domaines suivants peuvent dépendre de `localization` :

- `pages`
- `blog`
- `products`
- `seo`
- `legal`
- `template-system`
- `search`
- `dashboarding`
- le storefront
- certaines couches d’administration

## Capabilities activables liées

Le domaine `localization` est directement ou indirectement lié à :

- `multiLanguage`
- `multiCurrency`
- `publicEvents`
- `marketingCampaigns`

### Effet si `multiLanguage` est activée

Le domaine devient pleinement exploitable pour gérer des langues, variantes locales et contenus localisés structurés.

### Effet si `multiLanguage` est désactivée

Le domaine reste structurellement présent, mais aucune exposition multilingue enrichie non indispensable ne doit être proposée côté boutique.

### Effet si `multiCurrency` est activée

Le domaine peut devoir articuler plus finement certains contextes marché/locale, sans absorber la responsabilité monétaire ou pricing.

### Effet si `publicEvents` ou `marketingCampaigns` est activée

Le domaine peut être davantage consommé pour l’exposition localisée des contenus ou messages, sans absorber la responsabilité des domaines consommateurs.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `content_editor`
- `catalog_manager` en contribution partielle selon la politique retenue
- `marketing_manager` en contribution partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `localization.read`
- `localization.write`
- `pages.read`
- `blog.read`
- `catalog.read`
- `seo.read`
- `legal.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `localization.locale.created`
- `localization.locale.updated`
- `localization.translation.updated`
- `localization.rule.updated`
- `localization.policy.updated`
- `localization.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `store.capabilities.updated`
- `page.updated`
- `blog.post.updated`
- `product.updated`
- `seo.metadata.updated`
- `legal.document.updated`
- `approval.approved`
- `workflow.completed`
- certaines actions administratives structurées de publication ou de correction de localisation

Il doit toutefois rester maître de sa propre logique de localisation transverse.

## Intégrations externes

Le domaine `localization` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être appuyé par `integrations` vers certains services externes de traduction ou de gestion de contenu localisé, mais :

- la vérité des structures localisées internes reste dans `localization`
- les DTO providers externes restent dans `integrations`
- les objets source restent dans leurs domaines respectifs

## Données sensibles / sécurité

Le domaine `localization` manipule des contenus susceptibles d’impacter fortement l’exposition publique, la cohérence juridique ou la compréhension fonctionnelle de la boutique.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre objet source, valeur localisée, règle de fallback et politique d’exposition
- protection des localisations non publiées, incomplètes ou réservées à certains contextes
- limitation de l’exposition selon le rôle, le scope, la langue, le marché et le statut
- audit des changements significatifs de traduction, de fallback ou de politique locale

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelle locale est en vigueur
- quelle valeur localisée a été retenue
- quelle règle de fallback ou d’applicabilité a été utilisée
- pourquoi une valeur localisée est absente, remplacée, fallbackée ou non exposée
- si une localisation n’est pas disponible à cause d’une capability off, d’un statut inactif, d’un contexte non compatible ou d’une règle applicable

### Audit

Il faut tracer :

- la création ou modification sensible d’une locale supportée
- la modification significative d’une traduction ou d’une valeur localisée sensible
- les changements de règles de fallback ou d’exposition locale
- certaines consultations sensibles si le modèle final les retient explicitement
- certaines modifications manuelles importantes des politiques de localisation

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `LocaleDefinition` : langue, variante locale ou marché supporté
- `LocalizedValue` : valeur localisée structurée
- `LocalizationRule` : règle d’applicabilité, de fallback ou d’exposition locale
- `LocalizationPolicy` : règle de gouvernance ou de publication des localisations
- `LocalizationStatus` : état d’une localisation ou d’une locale
- `LocalizationSubjectRef` : référence vers l’objet source concerné

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une valeur localisée est rattachée à un objet source explicite et à une locale explicite
- une règle de fallback ou d’exposition possède une signification explicite
- `localization` ne se confond pas avec `pages`
- `localization` ne se confond pas avec `blog`
- `localization` ne se confond pas avec `products`
- `localization` ne se confond pas avec `pricing`
- `localization` ne se confond pas avec `seo`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de localisation transverse quand le cadre commun `localization` existe
- une valeur localisée inapplicable, inactive ou non publiée ne doit pas être exposée hors règle explicite

## Cas d’usage principaux

1. Définir les langues ou locales supportées par la boutique
2. Gérer des champs localisés pour une page, un article, un produit ou un contenu juridique
3. Définir un fallback lorsqu’une traduction manque
4. Fournir à un domaine consommateur la valeur localisée applicable dans un contexte donné
5. Exposer une boutique multilingue cohérente au niveau storefront et admin
6. Exposer à l’admin une lecture claire des locales, traductions et règles de fallback disponibles

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- locale introuvable ou non supportée
- valeur localisée absente ou invalide
- règle de fallback incohérente
- contexte de localisation non compatible
- tentative de publication ou de modification non autorisée
- permission ou scope insuffisant
- conflit entre plusieurs règles d’applicabilité, de fallback ou d’exposition

## Décisions d’architecture

Les choix structurants du domaine sont :

- `localization` porte l’adaptation localisée transverse du socle
- `localization` est distinct de `pages`
- `localization` est distinct de `blog`
- `localization` est distinct de `products`
- `localization` est distinct de `pricing`
- `localization` est distinct de `seo`
- les domaines consommateurs lisent la vérité localisée via `localization`, sans la recréer localement
- les locales, traductions, fallbacks et politiques sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- l’adaptation localisée transverse relève de `localization`
- les pages éditoriales relèvent de `pages`
- les articles de blog relèvent de `blog`
- les produits publiés relèvent de `products`
- le pricing et les devises relèvent de `pricing` ou d’un domaine monétaire dédié
- la structuration SEO relève de `seo`
- `localization` ne remplace ni `pages`, ni `blog`, ni `products`, ni `pricing`, ni `seo`, ni `legal`, ni `integrations`
