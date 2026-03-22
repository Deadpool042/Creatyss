# Jobs, webhooks et intégrations

## Objectif

Ce document fixe le rôle respectif de :

- `jobs`
- `webhooks`
- `integrations`

Ces trois briques sont liées, mais elles ne portent pas la même responsabilité.

Leur bonne séparation est indispensable pour :

- garder un runtime interne propre
- exécuter des traitements externes sans coupler le coeur métier
- rendre le socle observable, auditable et résilient
- supporter les systèmes tiers, les retries, les publications différées et les synchronisations

## Vue d’ensemble

## `integrations`

Le domaine `integrations` porte les adaptateurs vers les systèmes tiers.

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

Il sait :

- transformer les objets internes vers des formats externes
- appeler un système tiers
- interpréter sa réponse
- traduire les erreurs externes

Il ne décide pas seul quand ou pourquoi un traitement doit être exécuté.

## `jobs`

Le domaine `jobs` porte l’exécution asynchrone et pilotée des traitements différés.

Il sait :

- planifier
- mettre en file
- rejouer
- retenter
- reprendre
- tracer les échecs
- exécuter des traitements non synchrones

Il ne définit pas la logique métier profonde du traitement.
Il orchestre son exécution différée ou résiliente.

## `webhooks`

Le domaine `webhooks` porte les notifications sortantes vers des systèmes abonnés à des événements du socle.

Il sait :

- exposer un mécanisme d’abonnement
- envoyer des événements sortants
- gérer les livraisons
- gérer les retries de livraison
- journaliser les tentatives et résultats

Il ne remplace ni les domain events, ni les integrations.

## Règle de séparation

### `integrations`

Répond à la question :

> comment parler à un système tiers donné ?

### `jobs`

Répond à la question :

> comment exécuter proprement un traitement différé, instable, coûteux ou rejouable ?

### `webhooks`

Répond à la question :

> comment notifier un système externe abonné à un événement du socle ?

## Ce que ces domaines ne doivent pas faire

### `integrations` ne doit pas

- devenir un domaine métier coeur
- imposer le modèle provider au runtime interne
- piloter seul les workflows métier internes

### `jobs` ne doit pas

- devenir un fourre-tout métier
- embarquer la logique métier de fond dans le scheduler ou la queue
- remplacer les domaines coeur

### `webhooks` ne doit pas

- remplacer les domain events
- être la seule source de vérité des événements
- être confondu avec un appel provider spécialisé

## Relations entre les trois

## Cas simple

1. un domaine coeur valide un fait métier
2. il émet un `domain-event`
3. un consommateur décide qu’un traitement externe doit être lancé
4. ce traitement peut être exécuté via `jobs`
5. le traitement utilise `integrations` si un provider tiers doit être contacté
6. un `webhook` peut éventuellement être envoyé à des abonnés externes

## Exemple : publication d’un produit

1. `products` publie un produit
2. `products` émet `product.published`
3. `social` peut demander une publication sociale
4. `jobs` exécute la publication en différé
5. `integrations` parle au provider social réel
6. `webhooks` peut notifier un système externe abonné à `product.published`

## Exemple : facture électronique

1. `documents` génère une facture interne
2. `documents` émet `invoice.generated`
3. un consommateur décide d’envoyer la facture vers Chorus Pro
4. `jobs` orchestre l’envoi si le traitement doit être repris en cas d’échec
5. `integrations/invoicing/chorus-pro` réalise l’appel externe
6. le résultat est observé, audité et éventuellement exposé sous un statut de sync

## Exemple : Google Shopping

1. un produit éligible est publié ou mis à jour
2. `domain-events` signale le changement
3. `jobs` déclenche une synchronisation ou une reconstruction de flux
4. `integrations/commerce/google-shopping` génère ou pousse le flux compatible
5. les erreurs de flux sont suivies comme erreurs d’intégration

## Domain events et ces trois domaines

Les `domain-events` restent le point d’entrée de découplage.

### Ils ne sont pas remplacés par `jobs`

Un job n’est pas un événement métier.

### Ils ne sont pas remplacés par `integrations`

Une intégration ne définit pas le fait métier.

### Ils ne sont pas remplacés par `webhooks`

Un webhook est une notification sortante, pas le fait métier de référence.

## `jobs` — rôle détaillé

## Quand utiliser `jobs`

Un traitement doit généralement passer par `jobs` lorsqu’il est :

- coûteux
- externe
- potentiellement instable
- rejouable
- long
- non critique pour la validation immédiate du flux principal

## Exemples typiques

- publication sociale
- synchronisation Google Shopping
- envoi à un ERP
- émission facture électronique
- push de campagne newsletter
- expiration de paniers invités
- relance panier abandonné
- génération de documents lourds

## Ce que `jobs` doit porter

- queue logique
- retries
- statuts d’exécution
- tentatives
- cause d’échec
- date de prochaine tentative
- reprise manuelle ou automatique selon politique

## Ce que `jobs` ne doit pas porter

- tout le domaine métier de l’objet traité
- les invariants coeur
- le modèle provider externe détaillé

## `webhooks` — rôle détaillé

## Finalité

Permettre à un système tiers abonné de recevoir une notification structurée sur un événement du socle.

## Exemples

- une commande créée
- un produit publié
- un document généré
- un client créé

## Ce que `webhooks` doit porter

- abonnements webhook
- événements sortants éligibles
- livraison sortante
- tentatives de livraison
- retries
- journal de livraison
- signatures éventuelles

## Ce que `webhooks` ne doit pas porter

- la vérité métier interne
- le coeur de l’intégration ERP / provider spécifique
- la logique métier qui décide du fait à notifier

## `integrations` — rôle détaillé

## Finalité

Porter les adaptateurs spécialisés vers les systèmes externes.

## Sous-familles typiques

- ERP
- facturation électronique
- commerce channels
- tracking providers
- email providers
- transporteurs
- PSP

## Ce que `integrations` doit porter

- DTO externes
- mappers interne → externe
- mappers externe → interne
- erreurs provider
- appels HTTP/API/protocoles externes
- statuts de sync et diagnostics côté provider

## Ce que `integrations` ne doit pas porter

- la vérité métier interne
- le workflow fonctionnel coeur
- la politique complète de retry générique
- la gouvernance d’autorisation métier

## Statuts et observabilité

Ces trois domaines doivent être conçus pour être observables.

## `jobs`

Doit exposer :

- statut job
- tentatives
- dernière erreur
- prochaine tentative

## `webhooks`

Doit exposer :

- statut de livraison
- nombre de tentatives
- dernière erreur
- payload envoyé ou référence de payload selon stratégie

## `integrations`

Doit exposer :

- système cible
- objet interne concerné
- statut de synchronisation
- code provider brut si utile
- message technique brut si utile
- traduction interne exploitable

## Audit

Certaines opérations liées à ces domaines doivent être auditables.

Exemples :

- ajout ou suppression d’un webhook
- activation d’une intégration sensible
- retry manuel d’un job critique
- forçage d’une resynchronisation ERP

## Capabilities liées

Ces domaines sont eux-mêmes pilotés par plusieurs capabilities.

Exemples :

- `googleShopping`
- `metaCatalog`
- `tracking`
- `marketingPixels`
- `serverSideTracking`
- `erpIntegration`
- `ebpIntegration`
- `electronicInvoicing`
- `chorusProIntegration`
- `socialPublishing`
- `automaticSocialPosting`

Quand une capability liée est off :

- aucun job spécifique ne doit être planifié
- aucun appel d’intégration ne doit être lancé
- aucun webhook spécifique ne doit être exposé si la logique ne l’exige pas
- le domaine consommateur doit rester dans un état neutre cohérent

## Invariants

- `jobs` exécute, mais ne définit pas la vérité métier coeur
- `integrations` adapte, mais ne définit pas le modèle interne
- `webhooks` notifie, mais ne remplace pas les domain events
- les trois domaines doivent rester observables et auditables
- un traitement externe critique doit pouvoir être repris proprement
- les systèmes tiers ne doivent jamais dicter la structure du socle

## Anti-patterns interdits

### 1. Mettre toute la logique métier dans un job

Le job doit exécuter un traitement, pas devenir le domaine métier principal.

### 2. Faire d’un webhook la source de vérité événementielle

Le webhook est une sortie, pas la référence interne du fait métier.

### 3. Coder directement le provider dans le domaine coeur

Les providers vivent dans `integrations`, pas dans `orders`, `products`, `documents`, etc.

### 4. Ne pas prévoir retries et diagnostics

Un système externe instable sans stratégie de reprise est incompatible avec le niveau premium attendu.

### 5. Mélanger statuts métier, statuts jobs et statuts provider

Ces dimensions doivent être distinguées.

## Décisions closes

- `jobs`, `webhooks` et `integrations` sont trois domaines distincts
- les domain events restent le mécanisme de découplage interne principal
- les traitements externes ou différés passent souvent par `jobs`
- les appels aux systèmes tiers passent par `integrations`
- les notifications sortantes vers des abonnés externes passent par `webhooks`
- les trois domaines doivent être observables, auditables et compatibles avec les capabilities activables
