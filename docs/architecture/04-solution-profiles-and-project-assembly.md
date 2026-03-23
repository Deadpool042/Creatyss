# Solution profiles and project assembly

## Objectif

Ce document définit comment assembler un projet réel à partir du socle.

Le socle n’est pas utilisé en activant des fonctionnalités au hasard.
Il est assemblé à partir de :

- un besoin client ;
- un profil solution ;
- un ensemble de capabilities ;
- un niveau pour chaque capability ;
- un niveau de maintenance et d’exploitation ;
- une cohérence de coût initial et récurrent.

L’objectif est de rendre la composition d’un projet :

- lisible ;
- réutilisable ;
- évolutive ;
- commercialement compréhensible ;
- techniquement maîtrisée.

---

## Principe général

Un projet n’est pas décrit comme “une liste de pages” ou “une liste de features”.
Il est décrit comme un **assemblage cohérent**.

Cet assemblage relie :

1. le profil métier du projet ;
2. les domaines coeur nécessaires ;
3. les capabilities activées ;
4. le niveau retenu pour chaque capability ;
5. le niveau de maintenance ;
6. le coût structurel induit.

Le socle reste le même.
Ce qui change, c’est l’assemblage.

---

## Objectifs de l’assemblage

La logique d’assemblage doit permettre :

- de lancer vite un projet simple ;
- de garder un coût d’entrée agressif ;
- de ne pas activer de complexité inutile ;
- de faire monter un projet en richesse sans refonte ;
- de rendre le chiffrage plus intuitif ;
- de garder la maintenance proportionnée au besoin réel.

---

## Grammaire officielle d’un assemblage

Tout projet est décrit avec les rubriques suivantes.

### 1. Profil solution

Type global du projet.

### 2. Domaines coeur requis

Briques toujours présentes pour assurer un commerce sérieux.

### 3. Capabilities activées

Options métier réellement nécessaires.

### 4. Niveau par capability

Profondeur retenue.

### 5. Providers et intégrations

Systèmes externes réellement branchés.

### 6. Maintenance cible

Niveau d’exploitation et de maintenance technique.

### 7. Contraintes spécifiques

Fiscalité, pays, conformité, B2B, volumétrie, support attendu, etc.

### 8. Ce qui reste explicitement désactivé

Pour éviter le scope creep et clarifier le devis.

---

## Profils solution

Le socle reconnaît plusieurs profils types.
Ils n’enferment pas un projet, mais servent de base de cadrage.

---

## Profil A — commerce simple maîtrisé

### Description

Le projet vise un périmètre e-commerce simple, propre et maîtrisé, avec un coût d’entrée bas et une exploitation légère.

### Cas typiques

- artisan ;
- petite marque locale ;
- boutique premium simple ;
- catalogue modéré ;
- vente sur une zone limitée ;
- faible nombre d’intégrations.

### Domaines coeur présents

- `stores`
- `auth`
- `users`
- `customers`
- `products`
- `pricing`
- `cart`
- `checkout`
- `orders`
- `payments`
- `domain-events`
- `audit`
- `observability`
- `jobs`
- `integrations`

### Capabilities généralement activées

- `simpleProducts`
- `variants` si besoin
- `guestCart`
- `guestCheckout`
- `paymentProvider.stripe` ou équivalent simple
- `paymentMethod.card`
- `paymentMode.oneShot`
- `taxation` niveau simple
- `blog` si besoin éditorial
- `homepageEditor`

### Capabilities généralement désactivées

- `exciseTax`
- `paymentMode.installments`
- `paymentMode.bnpl`
- `erpIntegration`
- `multiCountryTaxation` avancée
- `b2bCommerce`
- `loyalty`
- `marketplace`

### Niveau de maintenance fréquent

- `M1` ou `M2`

### Objectif économique

- coût initial contenu ;
- coût récurrent faible à modéré ;
- base saine et sérieuse ;
- trajectoire d’évolution ouverte.

---

## Profil B — commerce standard évolutif

### Description

Le projet reste lisible et raisonnable, mais avec une base plus riche, plusieurs options de parcours, plus de contenu, et une meilleure capacité d’évolution.

### Cas typiques

- marque déjà installée ;
- commerce FR + UE ;
- besoin de plusieurs moyens de paiement ;
- contenu éditorial actif ;
- quelques intégrations utiles ;
- parcours client plus travaillés.

### Domaines coeur présents

Identiques au profil A.

### Capabilities généralement activées

- `variants`
- `guestCart`
- `cartMerge`
- `abandonedCartDetection`
- `abandonedCartRecovery`
- `guestCheckout`
- `customerCheckout`
- `paymentProvider.stripe`
- `paymentProvider.paypal` selon besoin
- `paymentMethod.card`
- `paymentMethod.paypalWallet`
- `paymentMode.oneShot`
- `taxation` niveau 1 ou 2
- `euSelling`
- `blog`
- `homepageEditor`
- `reviews` ou `wishlist` selon stratégie
- `emailMarketing` simple
- `analyticsServer` léger

### Capabilities généralement désactivées

- `exciseTax`
- `paymentMode.installments` sauf besoin clair
- `bnpl`
- `erpIntegration` lourde
- `marketplace`
- `multiStorefront` avancé

### Niveau de maintenance fréquent

- `M2`

### Objectif économique

- base plus riche sans explosion de coût ;
- meilleure capacité de montée en gamme ;
- plus de confort marketing et commercial ;
- plus de supervision utile.

---

## Profil C — commerce avancé

### Description

Le projet requiert davantage de règles, de variantes, d’intégrations et de contrôle opérationnel.

### Cas typiques

- plusieurs pays ;
- fiscalité plus large ;
- plusieurs providers ;
- logique documentaire ou comptable plus présente ;
- automatisation métier plus forte ;
- dépendance plus importante du client à son e-commerce.

### Domaines coeur présents

Identiques aux profils précédents.

### Capabilities généralement activées

- `euSelling`
- `nonEuSelling` selon cas
- `multiCountryTaxation`
- `guestCart`
- `cartMerge`
- `abandonedCartDetection`
- `abandonedCartRecovery`
- `abandonedCartRelaunch`
- `guestCheckout`
- `customerCheckout`
- `paymentProvider.stripe`
- `paymentProvider.paypal`
- éventuellement un provider supplémentaire
- `paymentMode.oneShot`
- `paymentMode.authorizeCapture`
- `paymentMode.partialRefund`
- `carrierIntegrations`
- `returns`
- `accountingIntegration`
- `analyticsServer`
- `crmIntegration`
- options B2B ciblées si besoin

### Capabilities parfois activées

- `paymentMode.installments`
- `electronicInvoicing`
- `vatValidation`
- `manualReview`
- `fraudScreening`

### Niveau de maintenance fréquent

- `M2` ou `M3`

### Objectif économique

- supporter un commerce plus exposé ;
- éviter les bricolages d’évolution ;
- rendre l’exploitation plus solide ;
- accepter plus d’intégrations sans casser le coeur.

---

## Profil D — commerce expert / réglementé / multi-contraintes

### Description

Le projet opère dans un contexte plus complexe :
plusieurs zones, obligations spécifiques, flux financiers plus riches, exigences de contrôle plus fortes, intégrations plus sensibles.

### Cas typiques

- UE + hors UE ;
- accises ;
- conformité documentaire élevée ;
- paiements avancés ;
- plusieurs providers ;
- forte criticité business ;
- exigences d’audit ou de traçabilité plus élevées.

### Domaines coeur présents

Identiques, avec un usage plus riche de plusieurs domaines.

### Capabilities généralement activées

- `euSelling`
- `nonEuSelling`
- `multiCountryTaxation`
- `exciseTax`
- `electronicInvoicing`
- `vatValidation`
- `customsData`
- `guestCheckout` ou `customerCheckout` selon contexte
- `paymentProvider.stripe`
- `paymentProvider.paypal`
- provider(s) additionnel(s) compatibles
- `paymentMode.authorizeCapture`
- `paymentMode.installments`
- `paymentMode.bnpl` si besoin
- `partialRefund`
- `carrierIntegrations`
- `returns`
- `accountingIntegration`
- `erpIntegration`
- `manualReview`
- `fraudScreening`
- `analyticsServer` plus structuré

### Niveau de maintenance fréquent

- `M3` ou `M4`

### Objectif économique

- encadrer un contexte réellement plus risqué ;
- rendre visible le coût réel de la sophistication ;
- ne pas maquiller une complexité forte derrière un périmètre apparent simple.

---

## Règles d’assemblage

### Règle 1 — partir du profil, pas du catalogue technique

On choisit d’abord le type de projet.
La technique vient ensuite confirmer l’assemblage.

### Règle 2 — activer le minimum utile

Un projet ne doit pas activer une capability simplement parce qu’elle est disponible dans le socle.

### Règle 3 — choisir le niveau minimal suffisant

Le niveau retenu doit couvrir le besoin sans introduire une charge structurelle injustifiée.

### Règle 4 — relier capabilities et maintenance

Un projet plus riche peut exiger une maintenance plus élevée.
Le build et l’exploitation doivent rester cohérents entre eux.

### Règle 5 — documenter explicitement ce qui reste désactivé

Une capability absente doit être une décision claire.
Cela évite le glissement de périmètre.

### Règle 6 — garder l’assemblage additif

L’ajout d’une capability ou d’un niveau ne doit pas remettre en cause la structure du coeur.

---

## Assemblage minimal obligatoire

Même le plus petit projet de production sérieuse doit inclure :

- sécurité de base ;
- auth admin sérieuse ;
- commandes durables ;
- paiements internes structurés ;
- cohérence transactionnelle ;
- audit minimal ;
- observability minimale ;
- gestion correcte des secrets ;
- lifecycle des objets critiques ;
- environnement de production distinct.

Le ticket d’entrée peut être agressif.
Il ne peut pas être structurellement fragile.

---

## Providers et intégrations dans un assemblage

Un projet n’active jamais “toutes les intégrations”.
Il active les connecteurs réellement utiles.

La règle est :

- domaine coeur stable ;
- capability utile ;
- provider utile ;
- niveau compatible ;
- maintenance compatible.

Exemples :

- un projet simple peut rester mono-provider ;
- un projet plus avancé peut ajouter PayPal ;
- un projet plus riche peut activer plusieurs providers, un ERP et une comptabilité ;
- un projet réglementé peut exiger plus de documentation, de supervision et de maintien opérationnel.

---

## Exemple complet — Creatyss

### Profil

Creatyss relève d’un commerce premium simple à standard.

### Domaines coeur présents

- `stores`
- `auth`
- `users`
- `customers`
- `products`
- `pricing`
- `cart`
- `checkout`
- `orders`
- `payments`
- `domain-events`
- `audit`
- `observability`
- `jobs`
- `integrations`

### Capabilities activées

- `simpleProducts`
- `variants`
- `guestCart`
- `guestCheckout`
- `paymentProvider.stripe`
- `paymentMethod.card`
- `paymentMode.oneShot`
- `taxation` simple
- `homepageEditor`
- `blog`

### Niveau retenu

- plutôt niveau 1 à 2 sur la plupart des capabilities ;
- pas de sophistication fiscale ou payment advanced inutile au départ.

### Maintenance cible

- `M1` ou `M2` selon le niveau d’exploitation réel souhaité.

### Ce qui reste désactivé

- `exciseTax`
- `paymentMode.installments`
- `bnpl`
- `erpIntegration`
- `multiCountryTaxation` avancée
- `b2bCommerce`
- `marketplace`
- `loyalty` avancée

### Conclusion

Creatyss doit servir de projet de référence simple, propre et réutilisable, sans surcharger le socle de contraintes qui n’appartiennent pas à son besoin réel.

---

## Règles de progression entre profils

Un projet peut évoluer :

- de A vers B ;
- de B vers C ;
- de C vers D ;

sans changement de socle.

La montée s’effectue par :

- activation de nouvelles capabilities ;
- montée de niveau sur certaines capabilities ;
- ajout de providers ;
- montée de maintenance ;
- enrichissement progressif de l’exploitation.

La progression ne doit pas exiger de duplication d’architecture ni de refonte du coeur.

---

## Ce que l’assemblage apporte commercialement

La logique de profils solution permet :

- de cadrer plus vite un projet ;
- d’expliquer clairement ce qui est inclus ;
- d’expliquer ce qui est optionnel ;
- d’expliquer ce qui fait monter le coût ;
- d’expliquer ce qui fait monter la maintenance ;
- de proposer un coût d’entrée plus agressif sans dégrader la qualité structurelle.

---

## Décisions structurantes

Les points suivants sont considérés comme décidés :

- tout projet est assemblé à partir d’un profil solution ;
- les profils servent de base de cadrage et de chiffrage ;
- le coeur reste stable quel que soit le profil ;
- les capabilities et niveaux varient selon le besoin ;
- la maintenance fait partie intégrante de l’assemblage ;
- l’assemblage doit rester additif et réutilisable.
