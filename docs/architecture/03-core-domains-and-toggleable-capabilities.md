# Core domains and toggleable capabilities

## Objectif

Ce document définit la classification structurelle du socle.

Il distingue explicitement :

- les domaines coeur non toggleables ;
- les domaines coeur à capabilities toggleables ;
- les domaines optionnels toggleables ;
- les connecteurs provider-specific.

Cette classification est indispensable pour :

- garder un noyau stable ;
- éviter les confusions entre architecture et options ;
- rendre la modularité lisible ;
- cadrer les projets plus simplement ;
- éviter qu’un provider ou une feature spécifique ne pollue le coeur.

---

## Les trois catégories officielles

Le socle classe toute brique d’architecture dans l’une des catégories suivantes :

### 1. Domaine coeur non toggleable

Le domaine est structurellement indispensable au socle.
Il est toujours présent, quel que soit le projet.

### 2. Domaine coeur à capabilities toggleables

Le domaine reste toujours présent, mais certaines de ses capabilities internes sont activées ou non selon le besoin du projet.

### 3. Domaine optionnel toggleable

Le domaine complet n’est activé que si un besoin métier réel le justifie.

Cette classification concerne les domaines.
Les providers externes constituent une catégorie séparée.

---

## Ce qu’est un provider-specific connector

Un provider-specific connector est un connecteur externe spécialisé.

Exemples :

- Stripe ;
- PayPal ;
- Alma ;
- ERP ;
- EBP ;
- Brevo ;
- un transporteur ;
- un moteur IA externe.

Un provider-specific connector :

- n’est pas un domaine coeur ;
- n’est pas la source de vérité métier ;
- ne doit pas imposer son langage au socle ;
- vit à la frontière externe du système.

---

## Domaines coeur non toggleables

Les domaines suivants sont considérés comme coeur non toggleable.

### Structure et sécurité

- `auth`
- `audit`
- `observability`
- `domain-events`
- `jobs`
- `integrations` comme socle d’adaptation externe

### Commerce coeur

- `stores`
- `users`
- `customers`
- `products`
- `pricing`
- `cart`
- `checkout`
- `orders`
- `payments`

### Disponibilité / opérabilité commerciale

- `availability` ou `inventory` selon la structuration retenue

Ces domaines restent présents dans tous les projets.
Leur comportement peut varier, mais leur existence n’est pas optionnelle.

---

## Pourquoi ces domaines ne sont pas toggleables

Un domaine coeur non toggleable répond à au moins une de ces conditions :

- il garantit la sécurité ;
- il garantit la cohérence métier ;
- il garantit la traçabilité ;
- il garantit l’exploitabilité ;
- il porte une vérité métier indispensable ;
- il est nécessaire à tout commerce au sens large.

Exemples :

- sans `auth`, il n’y a pas de sécurité d’accès sérieuse ;
- sans `orders`, il n’y a pas de commande durable ;
- sans `payments`, il n’y a pas de vérité interne de paiement ;
- sans `domain-events`, le découplage fiable et l’async interne deviennent fragiles ;
- sans `audit`, certaines opérations sensibles perdent leur traçabilité.

---

## Domaines coeur à capabilities toggleables

Certains domaines coeur restent toujours présents, mais leurs variations fonctionnelles sont activables.

---

## `cart`

Le domaine `cart` est coeur.
Ses capabilities peuvent varier :

- `guestCart`
- `persistentCart`
- `cartMerge`
- `abandonedCartDetection`
- `abandonedCartRecovery`
- `abandonedCartRelaunch`
- `giftOptions`

Le domaine ne disparaît jamais.
Ses comportements varient selon le projet.

---

## `checkout`

Le domaine `checkout` est coeur.
Ses capabilities peuvent varier :

- `guestCheckout`
- `customerCheckout`
- `shippingAddress`
- `billingAddress`
- `pickupPointDelivery`
- `manualReview`
- `fraudScreening`
- `b2bCheckout`

Le checkout reste présent dans tous les projets e-commerce structurés.
Ses exigences changent selon le contexte.

---

## `payments`

Le domaine `payments` est coeur.
Ses capabilities peuvent varier selon trois axes.

### Providers

- `paymentProvider.stripe`
- `paymentProvider.paypal`
- `paymentProvider.alma`
- `paymentProvider.klarna`

### Méthodes

- `paymentMethod.card`
- `paymentMethod.paypalWallet`
- `paymentMethod.bankTransfer`
- `paymentMethod.applePay`
- `paymentMethod.googlePay`
- `paymentMethod.giftCard`
- `paymentMethod.storeCredit`

### Modes

- `paymentMode.oneShot`
- `paymentMode.authorizeCapture`
- `paymentMode.installments`
- `paymentMode.bnpl`
- `paymentMode.partialCapture`
- `paymentMode.partialRefund`

Le domaine `payments` est toujours là.
Ce sont les providers, méthodes et modes qui varient.

---

## `pricing`

Le domaine `pricing` est coeur.
Ses capabilities peuvent varier :

- `basePricing`
- `priceLists`
- `discounts`
- `promotions`
- `b2bPricing`
- `campaignPricing`

Le projet peut commencer simple puis monter en richesse sans changer de domaine.

---

## `inventory` ou `availability`

Le domaine de disponibilité est coeur.
Ses capabilities peuvent varier :

- `stockTracking`
- `backorders`
- `preorders`
- `reservation`
- `multiWarehouse` si retenu un jour

Le coeur de disponibilité reste structurel.
La sophistication varie.

---

## `taxation`

Le domaine de taxation est coeur dès qu’un commerce opère réellement.
Mais ses capabilities sont fortement variables :

- `taxation`
- `multiCountryTaxation`
- `exciseTax`
- `vatValidation`
- `electronicInvoicing`
- `customsData`

Le domaine existe comme point de vérité fiscal/commercial.
En revanche, son niveau et ses sous-capacités dépendent fortement du projet.

---

## `auth`

`auth` est coeur, mais certaines capabilities peuvent varier :

- `passwordRecovery`
- `mfa`
- `sessionManagement`
- `adminBootstrap`

Le domaine reste structurel.
Le niveau de sophistication d’accès peut varier.

---

## `integrations`

`integrations` est un domaine coeur de frontière externe.
Ses capabilities varient via les connecteurs activés :

- `integration.stripe`
- `integration.paypal`
- `integration.erp`
- `integration.emailProvider`
- `integration.shippingCarrier`
- `integration.analyticsServer`
- `integration.invoiceProvider`
- `integration.aiProvider`

Le domaine reste présent.
Les connecteurs concrets sont toggleables.

---

## Domaines optionnels toggleables

Les domaines suivants sont optionnels.
Ils ne sont activés que si un besoin clair existe.

### Contenu et marketing

- `blog`
- `homepage-editorial`
- `reviews`
- `wishlist`
- `loyalty`
- `email-marketing`
- `recommendations`

### Commerce enrichi

- `gift-cards`
- `returns`
- `subscriptions`
- `marketplace`
- `affiliate`

### Segments spécialisés

- `b2b-advanced`
- `point-of-sale`
- `multi-storefront-advanced`

### Automatisation et IA

- `ai-assistance`
- `ai-automation`

Leur absence ne casse pas le coeur du commerce.
Leur activation enrichit le projet selon son positionnement.

---

## Grille officielle de décision

Pour classer correctement une brique, on applique les questions suivantes.

### Question 1

Le système peut-il encore fonctionner comme commerce robuste si ce domaine disparaît complètement ?

- si non : domaine coeur ;
- si oui : domaine optionnel possible.

### Question 2

Le domaine doit-il toujours exister, mais pas toutes ses variantes ?

- si oui : domaine coeur à capabilities toggleables.

### Question 3

La variation relève-t-elle d’un système externe concret ?

- si oui : provider-specific connector, pas domaine coeur.

### Question 4

La variation est-elle une profondeur de sophistication plutôt qu’un comportement distinct ?

- si oui : niveau, pas nouveau domaine.

---

## Ce qui n’est jamais toggleable

Les éléments suivants ne sont jamais toggleables comme fondation :

- la sécurité de base ;
- la cohérence transactionnelle ;
- l’outbox durable ;
- l’audit des mutations critiques ;
- l’observability minimale ;
- la gestion correcte des secrets ;
- la séparation entre coeur et intégrations ;
- le lifecycle explicite des objets critiques ;
- la possibilité de reprise minimale.

On peut faire varier le niveau.
On ne désactive pas le principe.

---

## Règles d’activation

### Règle 1

Un domaine coeur reste présent même si certaines de ses capabilities sont absentes.

### Règle 2

Une capability n’est activée que si elle répond à un besoin réel.

### Règle 3

Un provider n’est activé que s’il est utile et cohérent avec le niveau du projet.

### Règle 4

Un domaine optionnel ne doit pas contaminer le coeur lorsqu’il est absent.

### Règle 5

Une montée de niveau ou une activation supplémentaire doit rester additive.

---

## Exemples structurants

### Exemple 1 — paiements

- `payments` : domaine coeur ;
- `paymentProvider.paypal` : capability provider-specific activable ;
- `paymentMode.installments` : capability de mode ;
- niveau simple ou avancé selon le projet.

### Exemple 2 — taxation

- `taxation` : domaine coeur ;
- `exciseTax` : capability toggleable ;
- niveau plus ou moins élevé selon zones de vente et conformité.

### Exemple 3 — panier abandonné

- `cart` : domaine coeur ;
- `abandonedCartDetection` : capability ;
- `abandonedCartRecovery` : capability ;
- `abandonedCartRelaunch` : capability ;
- niveau plus ou moins riche selon le projet.

### Exemple 4 — contenu éditorial

- `blog` : domaine optionnel toggleable ;
- activé si besoin de contenu ;
- totalement absent si le projet n’en a pas besoin.

---

## Conséquences pratiques pour le socle

Cette classification impose plusieurs conséquences.

### 1. Le coeur ne dépend pas des domaines optionnels

Un projet sans blog, sans loyalty et sans BNPL doit rester parfaitement cohérent.

### 2. Les providers restent à la frontière

Stripe, PayPal ou tout autre provider ne doivent pas dicter la structure du coeur.

### 3. Le chiffrage devient plus lisible

On peut distinguer :

- ce qui est toujours dans la base ;
- ce qui est activable ;
- ce qui fait monter le niveau ;
- ce qui ajoute un provider ;
- ce qui fait monter la maintenance.

### 4. La réutilisabilité devient plus simple

Le même socle peut servir plusieurs projets sans créer de forks conceptuels.

---

## Décisions structurantes

Les points suivants sont considérés comme décidés :

- les domaines coeur sont distingués des capabilities ;
- les capabilities sont distinguées des providers ;
- les providers restent confinés à la frontière externe ;
- les domaines coeur critiques ne sont pas toggleables ;
- plusieurs domaines coeur portent des capabilities toggleables ;
- les domaines optionnels restent découplés du coeur ;
- la classification doit rester lisible pour l’architecture, la maintenance et le chiffrage.
