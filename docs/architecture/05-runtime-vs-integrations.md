# Runtime interne vs intégrations externes

## Objectif

Ce document fixe la frontière entre :

- le runtime interne du socle
- les intégrations externes

Cette séparation est non négociable.
Elle protège :

- la cohérence du modèle métier interne
- la maintenabilité du socle
- la réutilisabilité multi-boutiques
- la stabilité face aux systèmes tiers

## Principe fondamental

Le socle possède sa propre vérité métier.

Les systèmes externes ne doivent jamais dicter :

- la structure des domaines internes
- la forme des objets métier internes
- les règles métier internes
- les statuts internes de référence

Le runtime interne décide.
Les intégrations adaptent.

## Définition des deux couches

### Runtime interne

Le runtime interne correspond à tout ce qui constitue la logique métier propre du socle.

Exemples :

- `products`
- `inventory`
- `sales-policy`
- `cart`
- `shipping`
- `discounts`
- `taxation`
- `pricing`
- `checkout`
- `orders`
- `payments`
- `documents`
- `notifications`
- `events`
- `domain-events`

Le runtime interne :

- produit ses propres objets
- définit ses propres statuts
- impose ses propres invariants
- orchestre ses propres enchaînements métier

### Intégrations externes

Les intégrations externes correspondent aux adaptateurs vers des systèmes tiers.

Exemples :

- EBP
- Chorus Pro
- Google Shopping
- Meta Catalog
- providers email
- providers analytics
- pixels marketing
- transporteurs
- PSP
- ERP

Leur rôle est de :

- traduire les objets internes vers les formats externes
- appeler les systèmes externes
- interpréter leurs réponses
- remonter les erreurs, statuts et résultats
- rester remplaçables sans casser le coeur du socle

## Règle d’architecture

Le coeur métier ne parle jamais directement dans le dialecte d’un fournisseur externe.

On ne doit jamais avoir :

- un domaine interne qui adopte le modèle d’un ERP
- un statut interne qui copie un statut provider brut
- une logique métier centrale conditionnée par un payload tiers
- une validation interne dépendante de la structure externe

La logique correcte est :

1. le domaine interne produit un objet métier interne
2. une couche d’intégration le transforme
3. le provider externe est appelé
4. le résultat externe est retransformé en signal compréhensible pour le socle

## Exemples de frontière correcte

### Commande

- `orders` définit la commande interne
- `integrations/erp/ebp` convertit cette commande en format EBP

### Facture électronique

- `documents` définit la facture interne
- `integrations/invoicing/chorus-pro` transforme et transmet cette facture

### Flux catalogue

- `products` et `channels` définissent les données catalogue internes diffusables
- `integrations/commerce/google-shopping` produit le format compatible Google

### Tracking marketing

- `tracking` définit l’événement interne à envoyer
- `integrations/tracking/*` l’adapte au provider cible

## Anti-patterns interdits

### 1. Coller le DTO externe dans le domaine interne

Exemple interdit :

- utiliser directement une structure EBP comme structure officielle d’une commande interne

### 2. Réutiliser les statuts externes comme statuts métier du socle

Exemple interdit :

- stocker le statut brut provider comme unique vérité métier

La bonne approche :

- mapper les statuts externes vers des statuts internes maîtrisés
- éventuellement conserver le statut brut séparément à des fins de suivi

### 3. Mettre les appels externes dans les domaines métier coeur

Exemple interdit :

- `orders` appelle directement Chorus Pro
- `cart` appelle directement un pixel provider
- `products` appelle directement Google Merchant

### 4. Faire dépendre le coeur métier d’une API tierce instable

Exemple interdit :

- si le provider change, le domaine coeur casse

## Modèle cible

## Couche 1 — domaine interne

Responsable de :

- vérité métier
- invariants
- validation métier
- états internes
- orchestration interne

## Couche 2 — domaine d’intégration

Responsable de :

- transformation interne → externe
- transformation externe → interne
- gestion des erreurs provider
- retries / statuts de sync / diagnostics

## Couche 3 — exploitation transverse

Responsable de :

- jobs
- audit
- observability
- monitoring

## Statuts et synchronisation

Les intégrations externes doivent avoir leur propre lecture de synchronisation.

On distingue :

- statut métier interne
- statut de synchronisation externe
- statut brut provider éventuel

### Exemple

Une facture peut être :

- valide en interne
- en attente d’envoi vers Chorus Pro
- rejetée côté provider

Le socle ne doit pas réduire ces trois dimensions à un seul champ ambigu.

## Erreurs externes

Les erreurs externes ne doivent pas polluer directement le langage métier principal.

Il faut distinguer :

- erreur métier interne
- erreur d’intégration
- erreur provider brute

Le socle doit être capable de :

- conserver une erreur provider brute à des fins techniques
- l’exposer sous une forme métier lisible si nécessaire
- ne pas contaminer tout le domaine avec les détails du provider

## Idempotence et retries

Les intégrations externes doivent être pensées avec :

- idempotence
- retries
- statuts de reprise
- suivi des échecs

Cela relève de :

- `integrations`
- `jobs`
- `observability`
- `audit`

Mais pas du coeur métier lui-même.

## Jobs et intégrations

Une intégration ne doit pas nécessairement s’exécuter synchrone dans le flux principal.

Exemples typiques :

- publication Google Shopping
- envoi facture électronique
- synchronisation ERP
- publication sociale
- push newsletter

Le schéma correct est souvent :

1. le runtime interne valide
2. un `domain-event` est émis
3. un job est créé
4. l’intégration externe s’exécute
5. le résultat est audité et observable

## Observability et audit

Chaque intégration sensible doit être :

- observable
- auditée
- monitorée si critique

### Observability

Doit permettre de comprendre :

- ce qui a été tenté
- avec quel objet interne
- vers quel système
- avec quel résultat
- pourquoi cela a échoué

### Audit

Doit permettre de savoir :

- qui a déclenché l’action si pertinent
- quel objet a été concerné
- quand l’action a eu lieu
- quel statut final a été obtenu

## Capabilities et intégrations

Une intégration externe peut être :

- supportée par le socle
- activée ou non par boutique
- configurée ou non

Exemples :

- `googleShopping`
- `metaCatalog`
- `erpIntegration`
- `ebpIntegration`
- `electronicInvoicing`
- `chorusProIntegration`
- `serverSideTracking`

Une intégration off doit produire :

- aucune exposition UI inutile
- aucun job lié
- aucun appel externe
- un comportement neutre côté domaine consommateur

## Cas concrets de référence

### EBP

- `orders`, `customers`, `documents` restent internes
- `integrations/erp/ebp` adapte les objets vers EBP
- les résultats EBP sont traduits dans un langage de sync interne

### Chorus Pro

- `documents` produit la facture interne
- `integrations/invoicing/chorus-pro` transmet et suit la relation provider
- le statut provider brut n’est pas la seule vérité métier du document

### Google Shopping

- `products` + `channels` portent la projection catalogue interne
- `integrations/commerce/google-shopping` fabrique le flux réel
- les erreurs de flux sont suivies comme erreurs d’intégration

### Pixel / analytics providers

- `tracking` produit l’événement interne
- `integrations/tracking/*` l’adapte par provider
- le provider n’impose pas le modèle d’événement interne

## Invariants

- le runtime interne reste la source de vérité métier
- une intégration ne redéfinit jamais un domaine coeur
- les objets externes sont mappés, jamais adoptés tels quels comme modèle interne
- les statuts provider sont séparés des statuts métier internes
- les traitements externes critiques peuvent être repris via jobs
- les intégrations sensibles sont auditables et observables

## Décisions closes

- le coeur métier et les intégrations externes sont séparés
- le domaine `integrations` porte les adaptateurs vers les systèmes tiers
- les domaines coeur ne doivent pas parler directement le langage provider
- les statuts métier internes restent maîtrisés par le socle
- les appels externes sensibles passent par une couche observable, auditable et compatible avec les jobs
