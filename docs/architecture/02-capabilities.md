# Capabilities activables du socle

## Objectif

Ce document définit le modèle de capabilities activables du socle e-commerce premium+++.

Les capabilities permettent de piloter, par boutique, quelles fonctionnalités du socle sont actives, exposées et exécutées.

Le but est de disposer :

- d’un socle complet dès le départ
- d’une activation sélective par boutique
- d’un contrôle centralisé depuis l’espace technique plateforme
- d’un comportement neutre, lisible et cohérent quand une capability est désactivée

## Distinction fondamentale

### Capability

Une capability indique qu’une boutique supporte effectivement une fonctionnalité du socle.

Exemple :

- `multiCurrency = true`

Cela signifie que la boutique peut utiliser plusieurs devises.

### Configuration

La configuration précise comment la capability fonctionne pour une boutique donnée.

Exemple :

- `supportedCurrencies = ["EUR", "USD"]`

### Feature flag

Un feature flag est un mécanisme de rollout, d’expérimentation ou d’activation progressive.
Il ne remplace pas une capability.

Exemple :

- une capability peut être active
- une nouvelle implémentation de cette capability peut être protégée temporairement par un feature flag

## Règle

- **capability** = possibilité métier / plateforme offerte à la boutique
- **configuration** = paramètres de cette capability pour la boutique
- **feature flag** = pilotage technique progressif d’une implémentation

## Principes d’activation

### 1. Le domaine existe même si la capability est désactivée

Un domaine du socle peut exister structurellement sans être actif pour une boutique donnée.

Exemple :

- `taxation` existe dans le socle
- `exciseTax = false` pour Creatyss

### 2. Une capability désactivée produit un comportement neutre

Le domaine concerné doit retourner un état cohérent et prévisible.

Exemples :

- accises off → montant d’accise = 0
- multi-currency off → une seule devise boutique autorisée
- Google Shopping off → aucun flux Google émis
- event reservations off → événement publiable sans réservation
- social publishing off → aucune publication sociale automatique

### 3. L’activation se fait depuis l’espace technique plateforme

Les capabilities profondes ne sont pas pilotées par l’espace métier boutique.

Elles sont contrôlées par :

- `platform_owner`
- `platform_engineer`

### 4. L’espace boutique ne doit voir que ce qui est autorisé

Une capability off doit aussi désactiver l’exposition fonctionnelle côté UI et côté admin boutique.

### 5. Le backend reste l’arbitre final

Même si une capability est masquée côté UI, le backend doit aussi bloquer l’usage correspondant.

## Modèle de capabilities globales

Le modèle de référence est le suivant :

```ts
export type CommerceCapabilities = {
  guestCheckout: boolean;
  customerCheckout: boolean;
  professionalCustomers: boolean;

  multiCurrency: boolean;
  multiCarrier: boolean;
  pickupPointDelivery: boolean;

  discounts: boolean;
  couponCodes: boolean;
  customerSpecificPricing: boolean;
  customerGroupPricing: boolean;
  volumePricing: boolean;

  taxation: boolean;
  exciseTax: boolean;

  backorders: boolean;
  preorders: boolean;
  giftOptions: boolean;

  productChannels: boolean;
  googleShopping: boolean;
  metaCatalog: boolean;

  marketingCampaigns: boolean;
  conversionFlows: boolean;
  crm: boolean;

  tracking: boolean;
  cookieConsent: boolean;
  analytics: boolean;
  attribution: boolean;
  marketingPixels: boolean;
  serverSideTracking: boolean;

  notifications: boolean;
  newsletter: boolean;
  realtimeNotifications: boolean;

  publicEvents: boolean;
  eventRegistrations: boolean;
  eventReservations: boolean;

  socialPublishing: boolean;
  automaticSocialPosting: boolean;

  behavioralAnalytics: boolean;
  productViewTracking: boolean;
  clickTracking: boolean;

  search: boolean;
  recommendations: boolean;
  advancedSeo: boolean;
  localization: boolean;

  auditTrail: boolean;
  businessObservability: boolean;
  technicalMonitoring: boolean;
  advancedPermissions: boolean;

  erpIntegration: boolean;
  ebpIntegration: boolean;
  electronicInvoicing: boolean;
  chorusProIntegration: boolean;
};
```

## Classification des capabilities

### A. Checkout / clients / vente

Ces capabilities influencent le parcours d’achat et la relation commerciale.

#### `guestCheckout`

Autorise l’achat invité.

Si désactivée :

- le client doit passer par un compte
- les parcours guest sont coupés

#### `customerCheckout`

Autorise l’achat avec compte.

Si désactivée :

- les parcours client connecté sont neutralisés

#### `professionalCustomers`

Autorise les profils professionnels.

Si désactivée :

- seuls les clients particuliers sont supportés

### B. Livraison / transport

#### `multiCarrier`

Autorise plusieurs transporteurs.

Si désactivée :

- un seul transporteur boutique reste disponible

#### `pickupPointDelivery`

Autorise les points relais.

Si désactivée :

- aucune méthode de type pickup point n’est proposée

### C. Pricing / devises / remises

#### `multiCurrency`

Autorise plusieurs devises.

Si désactivée :

- une seule devise boutique est disponible

#### `discounts`

Autorise le moteur de remises.

Si désactivée :

- aucune remise n’est calculée

#### `couponCodes`

Autorise les coupons.

Si désactivée :

- aucun coupon ne peut être appliqué

#### `customerSpecificPricing`

Autorise les remises ou prix spécifiques à un client.

#### `customerGroupPricing`

Autorise les remises ou prix par groupe client.

#### `volumePricing`

Autorise les remises volume, quantité ou multi-produits.

### D. Fiscalité

#### `taxation`

Active les calculs fiscaux.

Si désactivée :

- les taxes sont neutres ou à zéro selon le modèle retenu

#### `exciseTax`

Active les accises.

Si désactivée :

- accises à 0
- aucun workflow accise

### E. Disponibilité produit

#### `backorders`

Autorise les commandes en rupture avec backorder.

#### `preorders`

Autorise les précommandes.

#### `giftOptions`

Autorise les options cadeau.

### F. Canaux catalogue

#### `productChannels`

Active la diffusion du catalogue vers des canaux externes.

#### `googleShopping`

Active Google Shopping.

#### `metaCatalog`

Active Meta Catalog.

### G. Marketing / conversion / CRM

#### `marketingCampaigns`

Active les campagnes marketing.

#### `conversionFlows`

Active les mécaniques de conversion.

#### `crm`

Active les fonctions CRM enrichies.

### H. Tracking / mesure / consentement

#### `tracking`

Active la couche tracking.

#### `cookieConsent`

Active la gestion du consentement cookies, marketing et analytics.

#### `analytics`

Active l’analytics business.

#### `attribution`

Active l’attribution marketing.

#### `marketingPixels`

Active les pixels marketing.

#### `serverSideTracking`

Active les envois server-side vers les providers.

### I. Notifications / newsletter / temps réel

#### `notifications`

Active les notifications.

#### `newsletter`

Active la newsletter.

#### `realtimeNotifications`

Active les notifications temps réel ou quasi temps réel.

### J. Événements publics / social

#### `publicEvents`

Active les événements publics.

#### `eventRegistrations`

Active les inscriptions aux événements.

#### `eventReservations`

Active les réservations d’événements.

#### `socialPublishing`

Active les capacités de publication sociale.

#### `automaticSocialPosting`

Autorise la publication sociale automatique.

### K. Analyse comportementale

#### `behavioralAnalytics`

Active les faits de comportement utilisateur.

#### `productViewTracking`

Active la mesure des vues produit.

#### `clickTracking`

Active la mesure détaillée des clics.

### L. Expérience / contenu / international

#### `search`

Active la recherche.

#### `recommendations`

Active les recommandations.

#### `advancedSeo`

Active les fonctions SEO avancées.

#### `localization`

Active l’internationalisation et la localisation.

### M. Pilotage / sécurité / supervision

#### `auditTrail`

Active la traçabilité métier détaillée.

#### `businessObservability`

Active l’observabilité métier.

#### `technicalMonitoring`

Active le monitoring technique.

#### `advancedPermissions`

Active les permissions fines avancées.

### N. Intégrations externes

#### `erpIntegration`

Active les intégrations ERP.

#### `ebpIntegration`

Active EBP.

#### `electronicInvoicing`

Active la facturation électronique.

#### `chorusProIntegration`

Active Chorus Pro.

## Mapping capability → domaine

- `guestCheckout` → `cart`, `checkout`
- `customerCheckout` → `cart`, `checkout`, `customers`
- `professionalCustomers` → `customers`, `pricing`, `discounts`, `sales-policy`
- `multiCurrency` → `pricing`, `store`, `checkout`, `documents`
- `multiCarrier` → `shipping`
- `pickupPointDelivery` → `shipping`
- `discounts` → `discounts`, `pricing`
- `couponCodes` → `discounts`, `checkout`
- `customerSpecificPricing` → `discounts`, `pricing`, `customers`
- `customerGroupPricing` → `discounts`, `pricing`, `customers`
- `volumePricing` → `discounts`, `pricing`
- `taxation` → `taxation`, `pricing`, `documents`
- `exciseTax` → `taxation`, `pricing`, `documents`
- `backorders` → `inventory`, `sales-policy`, `cart`
- `preorders` → `inventory`, `sales-policy`, `cart`
- `giftOptions` → `gifting`, `cart`, `checkout`
- `productChannels` → `channels`
- `googleShopping` → `channels`, `integrations`
- `metaCatalog` → `channels`, `integrations`
- `marketingCampaigns` → `marketing`
- `conversionFlows` → `conversion`
- `crm` → `crm`
- `tracking` → `tracking`
- `cookieConsent` → `consent`
- `analytics` → `analytics`
- `attribution` → `attribution`
- `marketingPixels` → `tracking`
- `serverSideTracking` → `tracking`, `integrations`
- `notifications` → `notifications`
- `newsletter` → `newsletter`, `subscriptions`
- `realtimeNotifications` → `notifications`
- `publicEvents` → `events`
- `eventRegistrations` → `events`
- `eventReservations` → `events`
- `socialPublishing` → `social`
- `automaticSocialPosting` → `social`, `jobs`, `domain-events`
- `behavioralAnalytics` → `behavior`, `analytics`
- `productViewTracking` → `behavior`, `analytics`
- `clickTracking` → `behavior`, `analytics`
- `search` → `search`
- `recommendations` → `recommendations`
- `advancedSeo` → `seo`
- `localization` → `localization`, `store`, `pages`, `blog`, `products`
- `auditTrail` → `audit`
- `businessObservability` → `observability`
- `technicalMonitoring` → `monitoring`
- `advancedPermissions` → `permissions`, `roles`
- `erpIntegration` → `integrations`
- `ebpIntegration` → `integrations`
- `electronicInvoicing` → `documents`, `integrations`
- `chorusProIntegration` → `integrations`, `documents`

## Qui peut activer une capability

Les capabilities profondes sont pilotées par l’espace technique plateforme.

### Peut activer

- `platform_owner`
- `platform_engineer`

### Ne peut pas activer

- `store_owner`
- `store_manager`
- les autres rôles boutique métier

## Effet quand une capability est désactivée

La règle générale est :

- le domaine reste structurellement présent dans le socle
- l’UI liée n’est pas exposée à la boutique
- les traitements liés sont neutralisés
- le domaine renvoie un comportement neutre et cohérent

Exemples :

### `multiCurrency = false`

- une seule devise
- aucun sélecteur multi-devise
- aucun convertisseur actif

### `googleShopping = false`

- aucun flux Google
- aucune publication Google
- aucun job Google

### `exciseTax = false`

- breakdown accise vide
- montant accise à 0

### `eventReservations = false`

- publication d’événement possible
- aucune réservation possible

### `automaticSocialPosting = false`

- publication sociale manuelle seulement, ou aucune selon configuration

## Gouvernance

Les capabilities doivent être :

- stockées côté plateforme et boutique dans `store`
- auditables
- éventuellement soumises à workflow ou approval pour les plus sensibles
- visibles depuis l’espace technique
- appliquées côté runtime serveur, jamais seulement côté UI

## Décisions closes

- les capabilities sont portées par `store`
- elles sont distinctes des feature flags
- elles sont activées depuis l’espace technique plateforme
- une capability off produit un comportement neutre
- l’espace boutique ne pilote pas les capabilities profondes
- le socle est pensé complet, les capabilities ne servent pas à repousser l’architecture
