# Domaine integrations

## Rôle

Le domaine `integrations` porte les adaptateurs spécialisés du socle vers les systèmes externes.

Il structure les connexions, synchronisations, mappings, DTO externes, échanges provider-specific et états d’intégration avec des systèmes nommés comme ERP, EBP, Chorus Pro, PSP, réseaux sociaux, outils emailing, analytics externes ou autres services tiers, sans absorber la vérité métier interne des domaines coeur et transverses.

## Responsabilités

Le domaine `integrations` prend en charge :

- les connecteurs vers systèmes externes nommés
- les configurations d’intégration
- les mappings entre modèles internes et modèles externes
- les DTO et contrats externes provider-specific
- les synchronisations sortantes et entrantes cadrées
- les états d’intégration
- les erreurs provider traduites et exploitables
- la coordination avec `jobs`, `webhooks`, `observability`, `monitoring` et `audit`
- la base d’échange externe consommable par les domaines source sans leur faire porter le protocole provider

## Ce que le domaine ne doit pas faire

Le domaine `integrations` ne doit pas :

- devenir la source de vérité métier interne
- porter le catalogue source, qui relève de `products`
- porter la commande durable, qui relève de `orders`
- porter le paiement interne, qui relève de `payments`
- porter les documents internes, qui relèvent de `documents`
- porter les faits métier internes, qui relèvent de `domain-events`
- porter la notification sortante générique vers abonnés, qui relève de `webhooks`
- porter le moteur asynchrone générique, qui relève de `jobs`

Le domaine `integrations` adapte le socle au monde externe. Il ne remplace ni les domaines métier internes, ni `jobs`, ni `webhooks`, ni `domain-events`.

## Sous-domaines

- `erp` : intégrations ERP au sens large
- `ebp` : intégration EBP si activée
- `chorus-pro` : intégration Chorus Pro si activée
- `payments-providers` : adaptateurs PSP et providers de paiement
- `email-providers` : adaptateurs emailing externes
- `social-providers` : adaptateurs réseaux sociaux externes
- `analytics-providers` : adaptateurs analytics et tracking externes
- `shipping-providers` : adaptateurs transporteurs ou points relais externes
- `registry` : registre des intégrations configurées et de leur état

## Entrées

Le domaine reçoit principalement :

- des demandes de synchronisation ou d’appel externe issues des domaines source
- des événements internes structurés issus de `domain-events`
- des jobs planifiés ou retries issus de `jobs`
- des configurations d’intégration
- des payloads internes à projeter vers des DTO externes
- des retours provider à traduire dans le langage du socle
- des demandes de lecture de statut, erreur ou santé d’intégration

## Sorties

Le domaine expose principalement :

- des statuts d’intégration structurés
- des résultats d’échange externe traduits
- des erreurs provider remappées dans un langage interne exploitable
- des lectures consommables par les domaines source, `monitoring`, `observability`, `audit`, `dashboarding` et les couches d’administration plateforme
- des demandes de continuation ou de reprise via `jobs` quand nécessaire

## Dépendances vers autres domaines

Le domaine `integrations` peut dépendre de :

- `jobs` pour l’exécution asynchrone, retries et reprises
- `domain-events` pour certains déclencheurs internes
- `webhooks` pour certains usages sortants génériques si nécessaire, sans absorber sa responsabilité
- `audit` pour tracer les changements sensibles de configuration et certaines actions manuelles
- `observability` pour corréler et expliquer les erreurs, délais ou comportements externes
- `monitoring` pour exposer la santé des connecteurs et synchronisations
- `store` pour le contexte boutique et les capabilities actives

Les domaines suivants peuvent dépendre de `integrations` :

- `payments`
- `documents`
- `shipping`
- `newsletter`
- `social`
- `tracking`
- `analytics`
- `events`
- `dashboarding`
- `observability`
- `monitoring`

Et les domaines source typiques incluent notamment :

- `orders`
- `payments`
- `documents`
- `products`
- `shipping`
- `newsletter`
- `social`
- `tracking`
- `analytics`
- `events`

## Capabilities activables liées

Le domaine `integrations` est directement ou indirectement lié à :

- `erpIntegration`
- `ebpIntegration`
- `chorusProIntegration`
- `electronicInvoicing`
- `socialPublishing`
- `newsletter`
- `serverSideTracking`
- `marketingPixels`
- `multiCarrier`
- `pickupPointDelivery`

### Effet si `erpIntegration` est activée

Le domaine peut exposer des connecteurs ERP et synchronisations dédiées.

### Effet si `ebpIntegration` est activée

Le domaine peut exposer des adaptateurs EBP spécifiques.

### Effet si `chorusProIntegration` ou `electronicInvoicing` est activée

Le domaine peut exposer les flux réglementaires documentaires correspondants.

### Effet si `socialPublishing`, `newsletter`, `serverSideTracking`, `marketingPixels`, `multiCarrier` ou `pickupPointDelivery` est activée

Le domaine peut exposer les adaptateurs providers nécessaires aux domaines source concernés.

### Règle

Le domaine `integrations` reste présent même si aucun connecteur spécialisé n’est activé.

## Rôles/permissions concernés

### Rôles

Le domaine `integrations` est principalement gouverné et observé par :

- `platform_owner`
- `platform_engineer`

Éventuellement, certains rôles de support avancé ou de lecture technique peuvent disposer d’un accès partiel selon la politique retenue.

Les rôles boutique ne doivent pas administrer librement les connecteurs transverses, secrets et mappings sensibles du socle.

### Permissions

Exemples de permissions concernées :

- `integrations.read`
- `integrations.write`
- `webhooks.read`
- `monitoring.read`
- `observability.read`
- `audit.read`
- `api_clients.read`
- `api_clients.write`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `integration.config.updated`
- `integration.sync.started`
- `integration.sync.succeeded`
- `integration.sync.failed`
- `integration.status.changed`
- `integration.provider.error.mapped`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `order.created`
- `payment.captured`
- `invoice.generated`
- `product.published`
- `newsletter.campaign.sent`
- `social.publication.published`
- `tracking.event.projected`
- `event.published`
- `store.capabilities.updated`

Il peut également consommer des demandes directes d’appel externe ou de synchronisation provenant de domaines source, sans que ces demandes deviennent la vérité métier de `integrations`.

## Intégrations externes

Le domaine `integrations` est précisément responsable des connecteurs provider-specific du socle.

Cela inclut notamment, selon les capabilities actives :

- ERP
- EBP
- Chorus Pro
- PSPs
- plateformes emailing
- réseaux sociaux
- outils analytics externes
- providers de tracking server-side
- transporteurs et points relais

Règles structurantes :

- le langage interne reste celui du socle
- les DTO providers restent confinés à `integrations`
- les domaines source reçoivent des résultats traduits dans un langage interne stable
- la vérité métier interne ne dépend pas du schéma provider brut

## Données sensibles / sécurité

Le domaine `integrations` manipule des secrets, credentials, endpoints, mappings et payloads potentiellement sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- jamais de secret exposé côté client
- séparation claire entre configuration, état d’intégration et payloads sensibles
- rotation et protection des credentials
- limitation de l’exposition des erreurs provider détaillées selon le rôle et le scope
- audit des modifications sensibles de configuration ou de secret

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel connecteur a été utilisé
- quel domaine ou événement a déclenché l’appel externe
- quel statut d’intégration est en vigueur
- pourquoi un échange a réussi, échoué, été retrié ou abandonné
- si un flux n’a pas été déclenché à cause d’une capability off, d’une configuration absente ou d’une règle métier amont

### Audit

Le domaine `integrations` n’a pas vocation à transformer chaque tentative technique en trace de conformité autonome.

En revanche, certaines actions sensibles doivent pouvoir être tracées, notamment :

- la création ou modification d’une configuration d’intégration
- la rotation d’un secret
- l’activation ou désactivation d’un connecteur
- certaines reprises ou synchronisations manuelles
- certaines modifications significatives de mapping ou de protocole exposé

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `IntegrationConfig` : configuration d’un connecteur externe
- `IntegrationKind` : type d’intégration (`erp`, `psp`, `email_provider`, etc.)
- `IntegrationStatus` : état de santé ou de disponibilité de l’intégration
- `IntegrationSync` : exécution logique d’une synchronisation ou d’un échange
- `IntegrationProviderError` : erreur provider traduite
- `IntegrationMapping` : mapping entre modèle interne et modèle externe
- `IntegrationCredentialRef` : référence de credential ou secret associé

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une intégration possède un type explicite, une configuration explicite et un statut explicite
- `integrations` ne se confond pas avec `domain-events`
- `integrations` ne se confond pas avec `jobs`
- `integrations` ne se confond pas avec `webhooks`
- les DTO et protocoles providers externes restent confinés au domaine `integrations`
- les domaines source ne doivent pas parler directement le langage provider brut quand le cadre commun `integrations` existe
- une capability désactivée peut empêcher l’usage d’un connecteur sans supprimer la structure du domaine

## Cas d’usage principaux

1. Synchroniser une commande vers un ERP
2. Projeter une facture ou un avoir vers Chorus Pro
3. Appeler un PSP pour une opération de paiement
4. Envoyer une campagne newsletter via un provider emailing externe
5. Publier un contenu social via un provider social externe
6. Projeter un signal tracking vers une destination server-side
7. Interroger un provider de point relais ou de transport
8. Exposer à l’admin technique une lecture claire des connecteurs, synchronisations et erreurs

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- intégration introuvable ou inactive
- configuration invalide ou incomplète
- credential absent ou invalide
- mapping incompatible
- capability nécessaire désactivée
- erreur provider répétée sans reprise automatique possible
- tentative d’appel externe non autorisée

## Décisions d’architecture

Les choix structurants du domaine sont :

- `integrations` porte les adaptateurs provider-specific du socle
- `integrations` est distinct de `domain-events`
- `integrations` est distinct de `jobs`
- `integrations` est distinct de `webhooks`
- les domaines source déclenchent des échanges externes sans absorber le protocole provider
- les DTO externes et mappings restent confinés à `integrations`
- les connecteurs, credentials, synchronisations et erreurs sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les adaptateurs providers spécialisés relèvent de `integrations`
- les faits métier internes relèvent de `domain-events`
- l’exécution asynchrone structurée relève de `jobs`
- les notifications sortantes génériques vers systèmes abonnés relèvent de `webhooks`
- `integrations` ne remplace ni `domain-events`, ni `jobs`, ni `webhooks`, ni les domaines métier source
