# Domaine marketing

## Rôle

Le domaine `marketing` porte l’animation commerciale et les campagnes du socle.

Il structure les opérations marketing pilotées par la boutique ou la plateforme, comme les campagnes, offres, mises en avant et dispositifs de communication commerciale, sans absorber les moteurs de remises, de conversion, de tracking, de newsletter ou de publication sociale.

## Responsabilités

Le domaine `marketing` prend en charge :

- les campagnes marketing
- les offres marketing au sens métier
- les bannières et mises en avant commerciales
- les périodes de campagne
- le ciblage marketing de haut niveau
- la cohérence des opérations commerciales visibles côté boutique
- la lecture d’objets marketing exploitables par l’admin, le storefront, l’analytics et certains domaines consommateurs

## Ce que le domaine ne doit pas faire

Le domaine `marketing` ne doit pas :

- porter les remises et coupons, qui relèvent de `discounts`
- porter les mécaniques de conversion fines, qui relèvent de `conversion`
- porter le CRM enrichi, qui relève de `crm`
- porter la newsletter, qui relève de `newsletter`
- porter la publication sociale, qui relève de `social`
- porter le tracking, l’attribution ou l’analytics, qui relèvent de `tracking`, `attribution` et `analytics`
- devenir un fourre-tout mélangeant contenu, promotions, pixels et diffusion externe

Le domaine `marketing` porte la campagne et l’animation commerciale. Il ne remplace ni `discounts`, ni `conversion`, ni `newsletter`, ni `social`.

## Sous-domaines

- `campaigns` : campagnes marketing
- `offers` : offres commerciales ou opérations mises en avant
- `banners` : bannières et éléments d’exposition commerciale

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour de campagnes
- des créations ou mises à jour d’offres marketing
- des demandes de planification ou d’activation d’opérations commerciales
- des demandes de lecture des campagnes actives
- des contextes boutique, temporels ou d’audience utiles au ciblage marketing

## Sorties

Le domaine expose principalement :

- des campagnes marketing
- des offres commerciales structurées
- des bannières ou dispositifs de mise en avant
- des fenêtres temporelles d’activation
- une lecture exploitable par `conversion`, `newsletter`, `social`, `analytics`, `pages`, `dashboarding` et l’admin

## Dépendances vers autres domaines

Le domaine `marketing` peut dépendre de :

- `store` pour le contexte boutique et les capabilities actives
- `products` pour certaines offres ou mises en avant liées au catalogue
- `pages` ou `media` pour certains supports visuels ou emplacements éditoriaux
- `workflow` ou `approval` si certaines campagnes doivent être validées avant activation
- `scheduling` pour certaines activations planifiées
- `audit` pour tracer les changements sensibles
- `observability` pour expliquer pourquoi une campagne est active, inactive ou non exposée

Les domaines suivants peuvent dépendre de `marketing` :

- `conversion`
- `newsletter`
- `social`
- `analytics`
- `dashboarding`
- `pages`
- `seo` dans certains cas de contenus promotionnels indexables

## Capabilities activables liées

Le domaine `marketing` est directement lié à :

- `marketingCampaigns`
- `notifications`
- `newsletter`
- `socialPublishing`

### Effet si `marketingCampaigns` est activée

Le domaine devient pleinement exploitable pour gérer des campagnes marketing structurées.

### Effet si `marketingCampaigns` est désactivée

Le domaine reste structurellement présent, mais aucune campagne marketing active ne doit être pilotée côté boutique.

### Effet si `newsletter` est activée

Certaines campagnes peuvent alimenter des usages aval côté `newsletter`, sans que `marketing` devienne le domaine newsletter lui-même.

### Effet si `socialPublishing` est activée

Certaines campagnes peuvent alimenter des usages aval côté `social`, sans que `marketing` exécute lui-même la publication.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- `content_editor` en lecture ou contribution partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `marketing.read`
- `marketing.write`
- `catalog.read`
- `pages.read`
- `newsletter.read`
- `social.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `marketing.campaign.created`
- `marketing.campaign.updated`
- `marketing.campaign.activated`
- `marketing.campaign.deactivated`
- `marketing.offer.updated`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `product.published`
- `store.capabilities.updated`
- événements de workflow, approval ou scheduling liés à l’activation d’une campagne

Il doit toutefois rester maître de sa propre lecture des campagnes et offres marketing.

## Intégrations externes

Le domaine `marketing` ne doit pas parler directement aux systèmes externes.

Les interactions avec :

- plateformes emailing
- plateformes sociales
- providers publicitaires
- outils marketing externes

relèvent de :

- `newsletter`
- `social`
- `integrations`
- éventuellement `jobs`

Le domaine `marketing` reste la source de vérité interne des campagnes et opérations marketing structurées.

## Données sensibles / sécurité

Le domaine `marketing` ne porte pas de secrets techniques par lui-même, mais il porte une logique métier sensible car elle impacte directement la communication commerciale de la boutique.

Points de vigilance :

- contrôle strict des droits d’écriture
- validation des périodes et états de campagne
- cohérence entre capabilities actives et exposition marketing
- audit des activations ou modifications significatives

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une campagne est active ou inactive
- pourquoi une offre est exposée ou non
- quelle fenêtre temporelle ou quel contexte a influencé l’exposition
- si une campagne n’est pas propagée à un domaine aval pour cause de capability off, de workflow incomplet ou de règle métier

### Audit

Il faut tracer :

- la création d’une campagne
- la modification d’une campagne
- l’activation ou la désactivation d’une campagne
- les changements significatifs d’offre ou de mise en avant
- les interventions manuelles importantes

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `MarketingCampaign` : campagne marketing structurée
- `MarketingOffer` : offre ou opération commerciale
- `MarketingBanner` : bannière ou mise en avant visuelle
- `MarketingCampaignStatus` : état métier d’une campagne
- `MarketingExposureWindow` : fenêtre temporelle d’exposition

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une campagne possède un identifiant stable et un état explicite
- une campagne ne se confond pas avec une remise ou un coupon
- une campagne marketing ne vaut pas exécution automatique dans newsletter ou social sans passage par les domaines concernés
- `marketing` ne se confond pas avec `conversion`, `discounts`, `newsletter` ou `social`
- les autres domaines ne doivent pas recréer leur propre vérité divergente de la campagne marketing structurée

## Cas d’usage principaux

1. Créer une campagne marketing
2. Modifier une campagne marketing
3. Activer ou désactiver une campagne
4. Définir une offre commerciale mise en avant
5. Exposer une bannière ou une mise en avant liée à une campagne
6. Fournir à d’autres domaines une lecture claire des campagnes actives

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- campagne introuvable
- campagne invalide
- période de campagne incohérente
- capability marketingCampaigns désactivée
- tentative d’activation non autorisée
- conflit entre plusieurs campagnes incompatibles selon la politique retenue

## Décisions d’architecture

Les choix structurants du domaine sont :

- `marketing` porte les campagnes et opérations marketing structurées
- `marketing` est distinct de `discounts`
- `marketing` est distinct de `conversion`
- `marketing` est distinct de `newsletter`
- `marketing` est distinct de `social`
- les domaines aval consomment les objets marketing, sans que `marketing` exécute lui-même toute la diffusion externe
- les activations significatives de campagne doivent être auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les campagnes relèvent de `marketing`
- les remises et coupons relèvent de `discounts`
- la diffusion newsletter relève de `newsletter`
- la diffusion sociale relève de `social`
- `marketing` ne remplace ni `discounts`, ni `conversion`, ni `newsletter`, ni `social`, ni `integrations`
