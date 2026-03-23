# Integrations, providers and external boundaries

## Objectif

Ce document définit la doctrine des frontières externes du socle.

Il formalise :

- la différence entre coeur métier et systèmes externes ;
- le rôle du domaine `integrations` ;
- la place des providers ;
- les règles de traduction entre langage interne et schémas externes ;
- les règles des callbacks entrants ;
- les règles des webhooks sortants ;
- les règles de sécurité, d’idempotence, de retry et de dégradation.

L’objectif est d’éviter que les systèmes externes dictent l’architecture interne du socle.

---

## Principe directeur

Le socle conserve toujours un langage métier interne stable.
Les systèmes externes sont branchés à la frontière du système, via des connecteurs dédiés.

La règle officielle est la suivante :

- le coeur décide ;
- l’intégration traduit ;
- le provider exécute ;
- le callback revient ;
- le socle revalide et retraduit ;
- la vérité métier interne reste souveraine.

Le coeur ne parle pas “Stripe”, “PayPal”, “ERP X” ou “Transporteur Y”.
Il parle ses propres concepts métier.

---

## Typologie des frontières externes

Le socle peut être connecté à plusieurs familles de systèmes externes.

### 1. Paiements

Exemples :

- Stripe
- PayPal
- Alma
- Klarna
- Adyen
- Mollie

### 2. Comptabilité / ERP

Exemples :

- EBP
- ERP internes
- connecteurs comptables
- outils documentaires

### 3. Emailing et communication

Exemples :

- Brevo
- Mail providers
- providers de notification

### 4. Logistique

Exemples :

- transporteurs
- points relais
- systèmes d’étiquettes
- systèmes de suivi

### 5. Analytics et marketing

Exemples :

- analytics server-side
- CRM
- marketing automation
- tracking externes

### 6. IA et enrichissements

Exemples :

- assistants rédactionnels ;
- fournisseurs de classification ;
- outils d’automatisation IA ;
- connecteurs LLM externes.

Chaque famille reste une frontière externe.
Aucune ne doit devenir la grammaire interne du coeur.

---

## Le rôle du domaine `integrations`

Le domaine `integrations` est le socle d’adaptation externe.

Il prend en charge :

- la déclaration logique des connecteurs ;
- leurs statuts ;
- leurs configurations ;
- leurs credentials ;
- leurs mappings ;
- leurs DTO providers ;
- la traduction vers le langage interne ;
- la journalisation de leurs résultats ;
- certaines commandes de synchronisation.

Le domaine `integrations` ne devient pas la source de vérité métier primaire.
Il reste une couche de traduction et de liaison.

---

## Ce que le coeur garde pour lui

Le coeur garde :

- les vérités métier ;
- les statuts métier internes ;
- les transitions métier ;
- la cohérence locale ;
- les invariants ;
- les domain events internes ;
- l’audit ;
- l’observability centrale ;
- le lifecycle des objets critiques.

Le coeur ne délègue pas ces responsabilités à un provider externe.

---

## Ce qu’un provider est autorisé à faire

Un provider peut :

- exécuter un service spécialisé ;
- recevoir une demande sortante ;
- renvoyer un callback ;
- fournir une référence externe ;
- renvoyer un statut ou un résultat brut ;
- exposer un schéma de payload spécifique.

Un provider ne doit jamais :

- imposer sa machine d’état comme vérité métier interne ;
- dicter la structure d’un domaine coeur ;
- court-circuiter les validations métier locales ;
- devenir l’unique source de vérité interne.

---

## Connecteurs provider-specific

Chaque provider concret est traité comme un connecteur spécialisé.

Exemples :

- `integration.stripe`
- `integration.paypal`
- `integration.ebp`
- `integration.brevo`
- `integration.carrierX`
- `integration.aiProviderY`

Un connecteur provider-specific :

- possède une identité ;
- possède un statut ;
- peut être activé ou désactivé ;
- peut avoir ses propres credentials ;
- peut être versionné ou remplacé ;
- reste isolé du coeur.

---

## DTO externes et traduction

Le socle distingue clairement :

### DTO externes

Payloads, événements, réponses, structures propres à un provider.

### Langage interne

Concepts métiers officiels du socle.

La règle est :

- les DTO providers restent confinés à `integrations` ;
- ils sont validés ;
- ils sont traduits ;
- seule la traduction validée peut atteindre le coeur.

Le coeur ne doit pas manipuler directement un payload provider brut.

---

## Traduction provider -> langage interne

Toute donnée externe entrant dans le coeur suit la chaîne suivante :

1. réception du payload externe ;
2. validation de forme et de sécurité ;
3. identification du provider et du type de message ;
4. déduplication / contrôle idempotence ;
5. traduction vers un résultat interne stable ;
6. application éventuelle à la vérité métier via une mutation interne contrôlée.

Ce processus doit être explicite.
Il ne doit jamais être remplacé par un mapping implicite flou.

---

## Commandes sortantes vers provider

Quand le coeur veut agir sur un provider, la logique correcte est :

1. le coeur valide qu’une action métier doit partir ;
2. un event durable ou un job est produit après commit ;
3. `integrations` exécute la demande sortante ;
4. le provider répond ou renvoie plus tard un callback ;
5. le résultat revient via la frontière externe ;
6. le coeur revalide son propre état si une mutation métier doit suivre.

Cela évite que le coeur dépende de l’exécution réseau immédiate.

---

## Callbacks entrants

Les callbacks entrants sont des flux potentiellement hostiles, dupliqués, désordonnés ou retardés.

Le socle les traite donc comme des entrées sensibles.

### Règles obligatoires

- validation de la provenance ;
- validation du schéma ;
- idempotence ;
- déduplication ;
- refus des payloads ambigus ou invalides ;
- traduction avant impact métier ;
- aucune confiance implicite dans l’ordre d’arrivée ;
- aucune confiance implicite dans l’unicité.

### Ce qu’un callback ne peut pas faire directement

Un callback brut ne peut pas :

- modifier directement la vérité métier ;
- bypasser les gardes de statut ;
- devenir un statut interne sans traduction ;
- décider seul d’un remboursement, d’une capture ou d’une transition critique.

---

## Webhooks sortants

Le socle distingue clairement :

### Intégration provider-specific

Connecteur dédié à un système externe identifié.

### Webhook sortant générique

Notification sortante à destination d’un endpoint abonné.

Les webhooks sortants :

- partent après commit ;
- sont dérivés de faits métier validés ;
- possèdent leur propre logique de livraison, retry et statut ;
- ne remplacent pas `integrations`.

---

## Sécurité des frontières externes

La sécurité des intégrations et providers couvre notamment :

- stockage correct des credentials ;
- rotation et révocation si nécessaire ;
- validation des signatures de callbacks ;
- contrôle des URLs et endpoints ;
- réduction de la fuite de secrets dans les logs ;
- séparation stricte entre secrets utilisateurs et secrets providers ;
- audit des actions sensibles sur les connecteurs.

Un provider mal isolé met en danger le coeur.
La sécurité des frontières externes est donc une exigence de base.

---

## Idempotence aux frontières externes

Les flux externes sont un terrain classique de duplication logique.

L’idempotence est donc obligatoire sur :

- callbacks entrants ;
- captures ;
- remboursements ;
- synchronisations ;
- retries d’appels sortants ;
- relances d’intégration ;
- pollings récurrents ;
- traitements de résultats provider.

Les clés d’idempotence reposent généralement sur :

- `providerName`
- `externalEventId`
- `providerReference`
- `syncIntentId`
- `deliveryId`

Un flux externe non idempotent n’est pas considéré comme robuste.

---

## Défaillances externes et dégradation

Le socle doit rester cohérent quand un provider échoue.

Exemples :

- timeout PSP ;
- webhook non livré ;
- ERP indisponible ;
- email provider down ;
- transporteur indisponible ;
- callback retardé ;
- résultat provider incohérent.

### Règle de dégradation

L’échec externe ne doit pas détruire la vérité interne déjà validée.

Le système doit pouvoir :

- conserver l’état interne correct ;
- tracer l’échec ;
- planifier un retry si adapté ;
- permettre une reprise opératoire ;
- éviter la corruption du coeur.

---

## Observability et audit des intégrations

Le socle doit permettre de comprendre :

- quel connecteur a été utilisé ;
- quelle opération a été tentée ;
- quel payload a été reçu ou envoyé ;
- quelle traduction a été produite ;
- pourquoi l’opération a réussi ou échoué ;
- quelle reprise est possible ;
- quel opérateur a éventuellement relancé ou modifié quelque chose.

Les intégrations ne doivent pas être une zone d’ombre.

---

## Règles de conception des providers

Un provider bien intégré respecte les règles suivantes :

### 1. Le provider est remplaçable

Le coeur ne doit pas dépendre d’un fournisseur unique au point de bloquer toute évolution.

### 2. Le provider est localisé

Son code, ses DTO et ses particularités restent dans la frontière externe.

### 3. Le provider est explicite

Sa configuration, ses credentials et son statut sont connus.

### 4. Le provider est observable

Ses succès, échecs et retries sont visibles.

### 5. Le provider est idempotent ou compensé

Les flux critiques supportent les duplications ou reprises.

---

## Lien avec la modularité du socle

Les providers sont activés comme connecteurs toggleables.

Exemples :

- `paymentProvider.stripe`
- `paymentProvider.paypal`
- `integration.erp`
- `integration.emailProvider`
- `integration.analyticsServer`

Le coeur ne change pas de nature selon le provider.
Ce sont les capacités externes branchées qui changent.

Cette distinction est essentielle pour garder :

- un socle réutilisable ;
- un coût initial maîtrisé ;
- une montée en complexité progressive ;
- une meilleure lisibilité du chiffrage.

---

## Anti-patterns interdits

Sont interdits :

- utiliser les statuts providers bruts comme statut officiel du coeur ;
- faire transiter directement un payload provider dans un domaine coeur ;
- déclencher une mutation critique sans traduction ni garde ;
- mettre les appels providers dans les transactions métier ;
- coder la logique provider directement dans `orders`, `payments`, `cart` ou `checkout` ;
- stocker les secrets providers comme de simples données applicatives non séparées ;
- dépendre d’un callback externe pour “terminer” localement une mutation qui aurait dû être atomique.

---

## Décisions structurantes

Les points suivants sont considérés comme décidés :

- le coeur conserve son langage métier interne ;
- les providers restent à la frontière externe ;
- `integrations` porte les connecteurs provider-specific ;
- les DTO providers sont confinés et traduits ;
- les callbacks entrants sont validés, dédupliqués et traduits avant toute mutation ;
- les webhooks sortants restent distincts des intégrations spécialisées ;
- les échecs externes ne doivent pas corrompre le coeur ;
- la robustesse du socle dépend d’une frontière externe claire, sécurisée et observable.
