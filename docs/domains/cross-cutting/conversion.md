# Domaine conversion

## Rôle

Le domaine `conversion` porte les mécaniques de conversion du socle.

Il structure les dispositifs destinés à améliorer le passage à l’achat, l’augmentation du panier et la réduction des abandons, sans absorber les remises, les campagnes marketing, la newsletter, le CRM, le tracking ou les recommandations catalogue au sens large.

## Responsabilités

Le domaine `conversion` prend en charge :

- la relance de panier abandonné au niveau métier
- les seuils de conversion comme le franco de port
- les mécaniques d’upsell
- les mécaniques de cross-sell
- certains nudges commerciaux explicites liés au parcours d’achat
- la lecture d’objets de conversion exploitables par le storefront, l’admin, `analytics`, `notifications`, `newsletter` et d’autres domaines consommateurs

## Ce que le domaine ne doit pas faire

Le domaine `conversion` ne doit pas :

- porter les remises et coupons, qui relèvent de `discounts`
- porter les campagnes marketing, qui relèvent de `marketing`
- porter le CRM enrichi, qui relève de `crm`
- porter les recommandations catalogue génériques, qui relèvent de `recommendations`
- porter le tracking ou l’analyse comportementale, qui relèvent de `tracking`, `behavior`, `analytics` et `attribution`
- porter la newsletter, qui relève de `newsletter`
- devenir un fourre-tout mélangeant persuasion, pricing, contenu et diffusion

Le domaine `conversion` porte les dispositifs de conversion du parcours. Il ne remplace ni `discounts`, ni `marketing`, ni `newsletter`, ni `recommendations`.

## Sous-domaines

- `recovery` : relances et récupération de paniers ou parcours abandonnés
- `upsell` : montée en gamme ou proposition complémentaire de valeur supérieure
- `cross-sell` : suggestion de produits complémentaires dans un objectif de conversion
- `thresholds` : seuils et messages de progression, comme le franco de port

## Entrées

Le domaine reçoit principalement :

- un contexte panier issu de `cart`
- un contexte client issu de `customers` si applicable
- des lectures produit ou catalogue issues de `products`
- des lectures de contexte commercial issues de `marketing` ou `discounts` si nécessaire
- des signaux comportementaux ou analytiques issus de domaines spécialisés, sans les absorber
- des demandes de lecture des dispositifs de conversion actifs

## Sorties

Le domaine expose principalement :

- des dispositifs de relance ou de récupération
- des suggestions d’upsell structurées
- des suggestions de cross-sell structurées
- des seuils et messages de progression exploitables côté parcours d’achat
- une lecture exploitable par `notifications`, `newsletter`, `analytics`, `dashboarding` et le storefront

## Dépendances vers autres domaines

Le domaine `conversion` peut dépendre de :

- `cart` pour le contexte panier runtime
- `customers` pour le contexte client si nécessaire
- `products` pour les objets catalogue ciblés
- `marketing` pour certaines campagnes ou fenêtres commerciales
- `discounts` pour certains dispositifs liés à des seuils ou bénéfices commerciaux, sans absorber leur logique
- `stores` pour le contexte boutique et les capabilities actives
- `audit` pour tracer les changements sensibles de dispositifs de conversion
- `observability` pour expliquer pourquoi un dispositif de conversion s’applique ou non

Les domaines suivants peuvent dépendre de `conversion` :

- `notifications`
- `newsletter`
- `analytics`
- `dashboarding`
- `pages`
- `cart`
- `checkout`

## Capabilities activables liées

Le domaine `conversion` est directement lié à :

- `conversionFlows`
- `notifications`
- `newsletter`
- `recommendations`

### Effet si `conversionFlows` est activée

Le domaine devient pleinement exploitable pour piloter des dispositifs de conversion structurés.

### Effet si `conversionFlows` est désactivée

Le domaine reste structurellement présent, mais aucun dispositif de conversion actif ne doit être piloté côté boutique.

### Effet si `notifications` ou `newsletter` est activée

Certains dispositifs de conversion peuvent alimenter des relances ou communications aval via les domaines concernés.

### Effet si `recommendations` est activée

Le domaine peut consommer ou articuler certaines suggestions produit, sans devenir lui-même le domaine de recommandation générique.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- éventuellement `content_editor` en lecture partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `conversion.read`
- `conversion.write`
- `marketing.read`
- `customers.read`
- `catalog.read`
- `analytics.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `conversion.flow.created`
- `conversion.flow.updated`
- `conversion.recovery.triggered`
- `conversion.threshold.reached`
- `conversion.offer.exposed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `cart.updated`
- `cart.abandoned` si ce signal est formalisé dans le socle
- `order.created`
- `product.published`
- `marketing.campaign.activated`
- `store.capabilities.updated`

Il doit toutefois rester maître de sa propre lecture des mécanismes de conversion.

## Intégrations externes

Le domaine `conversion` ne doit pas parler directement aux systèmes externes.

Les interactions avec :

- plateformes emailing
- providers de notifications
- outils marketing automation
- providers publicitaires

relèvent de :

- `notifications`
- `newsletter`
- `integrations`
- éventuellement `jobs`

Le domaine `conversion` reste la source de vérité interne des dispositifs de conversion structurés.

## Données sensibles / sécurité

Le domaine `conversion` ne porte pas de secrets techniques par lui-même, mais il manipule des mécanismes influençant directement le parcours d’achat.

Points de vigilance :

- contrôle strict des droits d’écriture
- cohérence entre dispositifs de conversion et capabilities actives
- séparation nette entre conversion, réduction commerciale et tracking
- audit des modifications significatives de seuils, relances et expositions

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un dispositif de conversion est actif ou non
- pourquoi un seuil a été atteint ou non
- pourquoi une relance de récupération a été déclenchée ou non
- quel contexte panier, client ou campagne a influencé la décision
- si une absence d’activation vient d’une capability off, d’une règle métier ou d’un workflow amont incomplet

### Audit

Il faut tracer :

- la création d’un dispositif de conversion
- la modification d’un dispositif de conversion
- l’activation ou la désactivation de mécanismes sensibles
- les changements significatifs de seuils ou de règles de relance
- les interventions manuelles importantes

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ConversionFlow` : dispositif structuré de conversion
- `CartRecoveryRule` : règle de récupération de panier
- `UpsellOffer` : proposition d’upsell
- `CrossSellOffer` : proposition de cross-sell
- `ConversionThreshold` : seuil de progression ou de déclenchement
- `ConversionExposure` : exposition effective d’un mécanisme de conversion

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un dispositif de conversion possède un identifiant stable et un état explicite
- `conversion` ne se confond pas avec `discounts`, `marketing`, `newsletter` ou `recommendations`
- un mécanisme de conversion ne vaut pas exécution directe d’un email ou d’une notification sans passage par les domaines concernés
- les autres domaines ne doivent pas recréer leur propre vérité divergente des dispositifs de conversion structurés
- les seuils et expositions doivent rester explicites et observables

## Cas d’usage principaux

1. Définir une relance de panier abandonné
2. Définir un seuil de progression vers un bénéfice commercial
3. Définir une proposition d’upsell
4. Définir une proposition de cross-sell
5. Exposer des dispositifs de conversion dans le parcours d’achat
6. Fournir à `notifications`, `newsletter` et `analytics` une lecture claire des mécanismes actifs

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- dispositif de conversion introuvable
- dispositif invalide
- capability conversionFlows désactivée
- seuil incohérent
- mécanisme incompatible avec le contexte panier ou client
- conflit entre plusieurs dispositifs incompatibles selon la politique retenue

## Décisions d’architecture

Les choix structurants du domaine sont :

- `conversion` porte les dispositifs de conversion structurés du socle
- `conversion` est distinct de `discounts`
- `conversion` est distinct de `marketing`
- `conversion` est distinct de `newsletter`
- `conversion` est distinct de `recommendations`
- les domaines aval consomment les dispositifs de conversion, sans que `conversion` exécute lui-même toute la diffusion ou l’automation externe
- les activations significatives de conversion doivent être auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les dispositifs de conversion relèvent de `conversion`
- les remises et coupons relèvent de `discounts`
- les campagnes relèvent de `marketing`
- la diffusion newsletter relève de `newsletter`
- `conversion` ne remplace ni `discounts`, ni `marketing`, ni `newsletter`, ni `recommendations`, ni `integrations`
