# Domaine `integrations`

## Rôle

Le domaine `integrations` porte les adaptateurs spécialisés du socle vers les systèmes externes nommés.
Il structure les connecteurs, credentials, mappings, DTO provider-specific, synchronisations et traductions entre langage interne et monde externe.

## Responsabilités

Le domaine `integrations` prend en charge :

- les connecteurs vers systèmes externes nommés
- les configurations d’intégration
- les credentials et secrets d’intégration
- les DTO et mappings provider-specific
- les synchronisations entrantes et sortantes
- la traduction provider → langage interne stable
- les statuts d’intégration
- la journalisation métier des échecs provider traduits

## Ce que le domaine ne doit pas faire

Le domaine `integrations` ne doit pas :

- devenir la source de vérité métier interne
- porter la commande, le paiement, le stock ou l’auth comme vérité primaire
- porter les webhooks génériques
- porter l’outbox interne
- laisser fuiter les schémas providers bruts dans les domaines coeur

Le domaine `integrations` adapte le socle au monde externe.
Il ne remplace ni `orders`, ni `payments`, ni `inventory`, ni `domain-events`, ni `webhooks`.

## Sous-domaines

- `connectors` : définition des connecteurs
- `credentials` : secrets et credentials
- `mappings` : traduction entre modèles internes et externes
- `sync` : synchronisations entrantes et sortantes
- `provider-results` : traduction des erreurs et résultats externes

## Entrées

Le domaine reçoit principalement :

- des événements internes durables à projeter à l’extérieur
- des commandes métier de synchronisation
- des payloads entrants de providers spécialisés
- des credentials et configurations d’intégration
- des demandes de test ou d’inspection opérateur

## Sorties

Le domaine expose principalement :

- une `Integration`
- des `IntegrationCredential`
- des résultats provider traduits en langage interne
- des statuts d’intégration
- des demandes de mutation interne cadrées

## Dépendances vers autres domaines

Le domaine `integrations` dépend de :

- `domain-events` pour les faits internes durables
- `orders`
- `payments`
- `inventory`
- `documents`
- `webhooks` pour la distinction de responsabilité
- `jobs` pour l’orchestration asynchrone
- `observability`
- `audit`

Les domaines suivants dépendent de `integrations` :

- `payments`
- `documents`
- `shipping`
- `erp`
- `emailing`
- `analytics`
- `tracking`

## Capabilities activables liées

Le domaine `integrations` est lié à :

- `electronicInvoicing`
- `pickupPointDelivery`
- `emailProviders`
- `paymentProviders`
- `erpSync`

### Effet si une capability provider est activée

Le domaine active le connecteur correspondant et traduit les échanges dans un langage interne stable.

### Effet si une capability provider est désactivée

Le connecteur concerné est inactif et ne reçoit ni émission ni synchronisation.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `integration_operator`
- `observability_operator`

### Permissions

Exemples de permissions concernées :

- `integrations.read`
- `integrations.write`
- `integrations.sync`
- `api_clients.read`
- `observability.read`
- `audit.read`

## Événements émis

Le domaine émet les domain events internes suivants :

- `integration.config.updated`
- `integration.sync.started`
- `integration.sync.succeeded`
- `integration.sync.failed`
- `integration.provider.result.translated`

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `order.created`
- `order.status.changed`
- `payment.captured`
- `payment.refunded`
- `inventory.stock.adjusted`
- `document.generated`
- `auth.password.changed` si une intégration sécurité le requiert

## Intégrations externes

Le domaine `integrations` est précisément responsable des connecteurs provider-specific :

- PSP
- ERP / EBP
- facturation électronique
- emailing provider
- transporteurs
- analytics server-side
- CMS ou systèmes tiers nommés

Règles structurantes :

- le langage interne reste celui du socle
- les DTO providers restent confinés à `integrations`
- les domaines source reçoivent des résultats traduits
- la vérité métier interne ne dépend jamais du schéma provider brut

## Données sensibles / sécurité

Le domaine `integrations` manipule des secrets, credentials et payloads sensibles.

Points de vigilance :

- stockage chiffré ou hashé selon la nature du secret
- séparation stricte entre secret provider et domaine coeur
- rotation et révocation des credentials
- validation stricte des payloads entrants
- journalisation des erreurs sans fuite de secret

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel connecteur a été utilisé
- quelle opération externe a été tentée
- quel résultat provider a été reçu
- quelle traduction interne a été produite
- pourquoi une synchronisation a échoué

### Audit

Il faut tracer :

- la création ou modification d’une intégration
- la rotation ou révocation de credentials
- les synchronisations forcées
- les replays d’intégration
- les désactivations de connecteur

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Integration` : connecteur externe nommé
- `IntegrationCredential` : credential d’intégration
- `IntegrationStatus` : `ACTIVE`, `DISABLED`, `ARCHIVED`
- `IntegrationProviderKind` : catégorie d’intégration
- `ProviderTranslationResult` : résultat traduit dans le langage interne

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un connecteur possède une identité et un statut explicites
- les credentials d’intégration sont distincts des credentials utilisateurs
- la traduction provider → interne est explicite
- un système externe ne devient jamais la vérité métier primaire du socle
- une synchronisation ne modifie la vérité interne qu’après validation et traduction

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création ou mise à jour d’une intégration
- création, rotation ou révocation d’un credential d’intégration
- enregistrement d’un résultat provider traduit
- écriture des events `integration.*` correspondants
- mutation interne déclenchée par un résultat provider validé, avec son outbox associé

### Ce qui peut être eventual consistency

Les traitements suivants ont lieu après commit :

- appel HTTP externe
- polling provider
- synchronisation sortante
- retries provider
- projections de monitoring
- notifications opérateur

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- une transaction applicative sur les mutations locales d’intégration
- une déduplication des callbacks et résultats providers par identité externe stable
- une seule traduction interne validée par événement provider logique
- une séparation stricte entre résultat externe reçu et mutation interne validée

Les conflits attendus sont :

- callbacks dupliqués
- polling et callback concurrents
- rotation de credential pendant une synchronisation
- double déclenchement d’une même synchronisation

### Idempotence

Les commandes métier suivantes sont idempotentes :

- `apply-provider-result` : clé d’idempotence = `(providerName, externalEventId)`
- `run-integration-sync` : clé d’idempotence = `(integrationId, syncIntentId)`
- `rotate-integration-credential` : clé d’idempotence = `(integrationId, credentialKey, rotationIntentId)`

Un retry de la même intention ne doit jamais produire deux mutations métier divergentes.

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `integration.config.updated`
- `integration.sync.started`
- `integration.sync.succeeded`
- `integration.sync.failed`
- `integration.provider.result.translated`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- appel provider externe
- synchronisation sortante
- retry provider
- webhook sortant
- notification opérateur
- monitoring externe

## Cas d’usage principaux

1. Configurer un connecteur externe
2. Stocker ou faire tourner un credential d’intégration
3. Traduire un résultat provider en langage interne
4. Lancer une synchronisation sortante
5. Appliquer un callback provider validé

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- intégration introuvable
- intégration désactivée
- credential expiré ou révoqué
- payload provider invalide
- callback dupliqué
- résultat provider ambigu
- échec de synchronisation
- conflit de rotation de credentials

## Décisions d’architecture

Les choix structurants du domaine sont :

- `integrations` porte les adaptateurs provider-specific
- les domaines coeur restent indépendants des schémas providers
- les callbacks et syncs sont traduits dans un langage interne stable
- les mutations locales restent transactionnelles
- les events `integration.*` passent par l’outbox
- les appels externes sont toujours hors transaction métier

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les connecteurs externes relèvent de `integrations`
- les faits métier internes relèvent des domaines coeur et de `domain-events`
- les webhooks sortants génériques relèvent de `webhooks`
- les secrets providers ne fuient pas dans les domaines coeur
- les callbacks providers sont traités en idempotence
- la vérité métier interne ne dépend jamais du payload brut provider
