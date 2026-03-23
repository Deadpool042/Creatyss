# Client needs, capabilities and levels

## Objectif

Ce document définit la méthode de traduction d’un besoin client en solution composable.

Le socle ne part pas d’une simple liste de fonctionnalités disponibles.
Il part :

1. du besoin client ;
2. des capabilities nécessaires ;
3. du niveau retenu pour chaque capability ;
4. du niveau de maintenance compatible ;
5. de l’impact sur le coût initial et le coût récurrent.

Cette approche permet :

- un coût d’entrée maîtrisé ;
- une réutilisation claire du socle ;
- une montée progressive sans refonte ;
- une proposition commerciale plus lisible.

---

## Chaîne de transformation officielle

Tout projet est décrit par la chaîne suivante :

### 1. Besoin client

Le besoin est exprimé dans le langage métier.

Exemples :

- vendre localement ;
- vendre en France et dans quelques pays UE ;
- vendre en UE + hors UE ;
- proposer plusieurs modes de paiement ;
- gérer une reprise de panier abandonné ;
- activer du blog ou du contenu éditorial ;
- proposer du paiement en plusieurs fois ;
- gérer des contraintes fiscales spécifiques ;
- activer des intégrations comptables ou ERP ;
- proposer des fonctions IA ciblées.

### 2. Capability proposée

Le besoin est traduit en capabilities activables.

Exemples :

- `guestCart`
- `cartMerge`
- `abandonedCartDetection`
- `abandonedCartRecovery`
- `guestCheckout`
- `multiCountrySelling`
- `taxation`
- `exciseTax`
- `paymentProvider.paypal`
- `paymentMode.installments`
- `electronicInvoicing`
- `erpIntegration`
- `aiAssistance`

### 3. Niveau de capability

Chaque capability reçoit un niveau.
Le niveau exprime la profondeur réelle de mise en oeuvre.

### 4. Pré-requis

Une capability peut exiger :

- un domaine coeur ;
- une autre capability ;
- un niveau minimal de maintenance ;
- une observability plus riche ;
- un provider ;
- une gouvernance de données plus stricte.

### 5. Impact coût

L’impact coût est évalué sur plusieurs axes :

- build ;
- intégration ;
- tests ;
- run ;
- maintenance ;
- support ;
- conformité / risque.

---

## Vocabulaire officiel

### Besoin client

Formulation métier ou avant-vente du besoin.

### Capability

Comportement activable dans le socle.

### Niveau

Profondeur de sophistication d’une capability.

### Pré-requis

Condition nécessaire à l’activation correcte d’une capability ou d’un niveau.

### Dépendance

Lien explicite entre capabilities, domaines, providers ou maintenance.

### Coût relatif

Qualification synthétique du poids de la capability.

---

## Échelle universelle des niveaux

Toutes les capabilities utilisent la même échelle.

### Niveau 0 — absent

La capability n’est pas activée.

### Niveau 1 — essentiel

La capability couvre le besoin principal de façon simple, robuste et cadrée.

### Niveau 2 — standard

La capability couvre plusieurs cas usuels avec plus de règles, d’options et de contrôle.

### Niveau 3 — avancé

La capability gère des parcours plus riches, plusieurs variantes métier, plus d’automatisation ou plus d’intégrations.

### Niveau 4 — expert / réglementé / multi-contraintes

La capability couvre des contextes plus complexes :
plusieurs zones, plus de conformité, plusieurs canaux, plusieurs providers, plus d’exploitation, plus de contrôle.

---

## Comment lire un niveau

Un niveau plus élevé ne signifie pas seulement “plus complet”.
Il signifie aussi :

- plus de périmètre ;
- plus de règles ;
- plus de cas limites ;
- plus de dépendances ;
- plus de maintenance ;
- plus d’observability ;
- plus de coût ;
- plus de risque à contrôler.

Le niveau retenu doit toujours être justifié par le besoin réel.

---

## Familles de capabilities

Les capabilities du socle sont organisées par familles.

---

## 1. Portée commerciale

Capabilities typiques :

- `localSelling`
- `euSelling`
- `nonEuSelling`
- `multiStorefront`
- `b2cCommerce`
- `b2bCommerce`

Questions associées :

- dans quelles zones le client vend-il ?
- faut-il supporter plusieurs pays ?
- faut-il gérer du B2B ?
- faut-il gérer plusieurs storefronts ?

---

## 2. Catalogue et offre

Capabilities typiques :

- `simpleProducts`
- `variants`
- `bundles`
- `availabilityPolicies`
- `stockTracking`
- `giftOptions`

Questions associées :

- produits simples ou complexes ?
- déclinaisons ?
- suivi du stock ?
- logique d’offre simple ou plus avancée ?

---

## 3. Parcours achat

Capabilities typiques :

- `guestCart`
- `persistentCart`
- `cartMerge`
- `abandonedCartDetection`
- `abandonedCartRecovery`
- `abandonedCartRelaunch`
- `guestCheckout`
- `customerCheckout`

Questions associées :

- panier invité ?
- reprise de panier ?
- relance panier abandonné ?
- checkout simple ou plus riche ?

---

## 4. Paiements

Capabilities typiques :

- `paymentProvider.stripe`
- `paymentProvider.paypal`
- `paymentProvider.alma`
- `paymentMethod.card`
- `paymentMethod.paypalWallet`
- `paymentMethod.bankTransfer`
- `paymentMode.oneShot`
- `paymentMode.authorizeCapture`
- `paymentMode.installments`
- `paymentMode.bnpl`

Questions associées :

- un ou plusieurs providers ?
- paiement immédiat seulement ?
- capture différée ?
- paiement en plusieurs fois ?
- contraintes par pays ou devise ?

---

## 5. Fiscalité et conformité commerciale

Capabilities typiques :

- `taxation`
- `multiCountryTaxation`
- `exciseTax`
- `vatValidation`
- `electronicInvoicing`
- `customsData`

Questions associées :

- vente locale ou multi-zone ?
- obligations UE ou hors UE ?
- accises ?
- documents plus avancés ?

---

## 6. Livraison et fulfillment

Capabilities typiques :

- `shipping`
- `pickupPointDelivery`
- `carrierIntegrations`
- `returns`
- `splitFulfillment`

Questions associées :

- livraison simple ?
- point relais ?
- transporteurs externes ?
- retours structurés ?

---

## 7. Contenu, marketing et relation client

Capabilities typiques :

- `blog`
- `homepageEditor`
- `reviews`
- `wishlist`
- `emailMarketing`
- `loyalty`
- `recommendations`

Questions associées :

- contenu éditorial ?
- fidélisation ?
- avis ?
- wishlist ?
- marketing automatisé ?

---

## 8. Intégrations et automatisations

Capabilities typiques :

- `erpIntegration`
- `accountingIntegration`
- `analyticsServer`
- `crmIntegration`
- `webhooksOutbound`
- `automationFlows`

Questions associées :

- systèmes externes à connecter ?
- besoin de flux automatisés ?
- besoin d’analytics avancée ?
- besoin d’un ERP ou d’une comptabilité intégrée ?

---

## 9. IA et assistance

Capabilities typiques :

- `aiAssistance`
- `aiContentHelp`
- `aiClassification`
- `aiAutomation`

Questions associées :

- simple aide rédactionnelle ?
- enrichissement métier ?
- automatisation ?
- IA reliée à des domaines sensibles ?

---

## Exemples de lecture par capability

### `taxation`

- **Niveau 1** : taxation simple sur pays principal ;
- **Niveau 2** : taxation multi-pays UE ;
- **Niveau 3** : UE + hors UE avec règles plus riches ;
- **Niveau 4** : multi-zone avec accises, contraintes documentaires et obligations avancées.

### `payments`

- **Niveau 1** : un provider, one-shot simple ;
- **Niveau 2** : plusieurs méthodes et plus d’un provider ;
- **Niveau 3** : authorize/capture, remboursements avancés, règles d’éligibilité enrichies ;
- **Niveau 4** : paiement fractionné, BNPL, règles multi-zone, orchestration plus avancée.

### `abandonedCart`

- **Niveau 1** : marquage métier du panier abandonné ;
- **Niveau 2** : reprise contrôlée du panier ;
- **Niveau 3** : relances et analytics d’abandon ;
- **Niveau 4** : orchestration avancée multicanale.

### `aiAssistance`

- **Niveau 1** : aide à la rédaction ou au SEO ;
- **Niveau 2** : suggestions semi-automatiques ;
- **Niveau 3** : workflows automatisés pilotés ;
- **Niveau 4** : IA reliée à plusieurs domaines sensibles avec gouvernance forte.

---

## Pré-requis et dépendances

Une capability n’existe jamais isolément.

Exemples :

- `paymentMode.installments` dépend du domaine `payments`, d’au moins un provider compatible et d’un niveau de maintenance adapté ;
- `exciseTax` dépend d’une capability de taxation active et d’un niveau fonctionnel plus avancé ;
- `abandonedCartRelaunch` dépend d’un marquage métier du panier abandonné et d’un flux async ou marketing ;
- `multiCountrySelling` dépend généralement d’une taxation adaptée, d’un checkout cohérent et parfois d’intégrations spécifiques.

Les dépendances doivent être documentées et assumées dès le cadrage.

---

## Classes de coût relatives

Chaque capability reçoit une classe de coût relative.

### C1 — faible

Faible complexité, peu de dépendances, faible exposition.

### C2 — modéré

Plusieurs règles ou plusieurs variantes, mais complexité encore contenue.

### C3 — élevé

Logique transverse plus riche, plus d’intégrations, plus de maintenance.

### C4 — fort

Conformité, multi-zones, providers multiples, fort impact sur le coeur métier ou l’exploitation.

Cette classe ne remplace pas un devis détaillé.
Elle structure la réflexion et le chiffrage.

---

## Règles de cadrage

### Règle 1

Toute capability doit répondre à un besoin client explicite.

### Règle 2

Le niveau retenu est le niveau minimal suffisant, pas le plus élevé possible.

### Règle 3

Une capability avancée peut exiger une maintenance plus élevée.

### Règle 4

Une capability plus complexe doit faire monter le coût de manière lisible.

### Règle 5

Une capability retenue doit rester compatible avec une montée en niveau future sans refonte du coeur.

---

## Profils de projets typiques

### Profil A — commerce simple maîtrisé

Objectif :
coût initial bas, périmètre resserré, exploitation simple.

Exemples :

- vente locale ;
- paiement simple ;
- contenu limité ;
- peu d’intégrations.

### Profil B — commerce standard évolutif

Objectif :
base sérieuse avec plusieurs options activables.

Exemples :

- UE ;
- plusieurs méthodes de paiement ;
- contenu éditorial ;
- quelques intégrations utiles.

### Profil C — commerce avancé

Objectif :
plus de pays, plus de règles, plus d’intégrations, plus d’exploitation.

### Profil D — commerce expert / réglementé

Objectif :
conformité forte, fiscalité complexe, providers multiples, exigences de contrôle supérieures.

---

## Exemple : Creatyss

Le cas Creatyss relève d’un commerce premium simple à standard.

Cela implique :

- un coeur e-commerce sérieux ;
- un coût initial maîtrisé ;
- un niveau de sophistication utile, pas maximal ;
- pas d’accises ;
- pas de fiscalité avancée inutile ;
- paiement simple au départ ;
- architecture capable de monter en niveau ensuite.

Le bon cadrage n’est donc pas “tout activer”.
Le bon cadrage est :

- activer les capabilities réellement utiles ;
- garder le coeur prêt pour d’autres cas plus complexes ;
- éviter de faire payer une sophistication non nécessaire au départ.

---

## Exemple : projet avec accises

Un autre projet peut demander :

- vente UE + hors UE ;
- taxation plus riche ;
- accises ;
- documents plus structurés ;
- contrôles et maintenance plus élevés.

Ce projet n’exige pas un autre socle.
Il exige :

- des capabilities supplémentaires ;
- des niveaux plus élevés ;
- des dépendances supplémentaires ;
- un coût et une maintenance plus élevés.

---

## Décisions structurantes

Les points suivants sont considérés comme décidés :

- toute capability est reliée à un besoin client ;
- toute capability a un niveau ;
- le niveau influe sur le coût et la maintenance ;
- le niveau minimal suffisant est privilégié ;
- les dépendances sont explicites ;
- le socle reste unique, même quand les projets diffèrent fortement ;
- le but est de garder une proposition de valeur lisible, réutilisable et économiquement maîtrisée.
