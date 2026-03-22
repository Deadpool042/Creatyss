# Domaine export

## Rôle

Le domaine `export` porte les exportations structurées du socle.

Il organise la production de fichiers, flux ou jeux de données exportables à partir des données internes de la boutique ou de la plateforme, pour des besoins d’administration, d’exploitation, d’analyse, de conformité ou d’échange cadré, sans absorber les documents métier durables, les intégrations provider-specific, les webhooks ou l’analytics elle-même.

## Responsabilités

Le domaine `export` prend en charge :

- les exports structurés du socle
- les définitions d’exports disponibles
- les paramètres d’export
- les statuts d’export demandés, générés, échoués, expirés ou annulés
- les fichiers ou artefacts d’export au niveau métier
- la lecture gouvernée des exports disponibles ou passés
- la base d’export consommable par `dashboarding`, `observability`, `audit`, `integrations`, certaines couches d’administration et certains usages métiers autorisés

## Ce que le domaine ne doit pas faire

Le domaine `export` ne doit pas :

- porter les documents métier durables, qui relèvent de `documents`
- porter les intégrations providers externes, qui relèvent de `integrations`
- porter les notifications sortantes génériques, qui relèvent de `webhooks`
- porter l’analytics consolidée, qui relève de `analytics`
- devenir un simple dump technique brut de base de données sans langage métier explicite
- absorber toute logique de reporting ou tout format externe sans frontière claire

Le domaine `export` porte les exportations structurées du socle. Il ne remplace ni `documents`, ni `integrations`, ni `webhooks`, ni `analytics`.

## Sous-domaines

- `definitions` : définitions d’exports structurés
- `requests` : demandes d’export et paramètres associés
- `artifacts` : artefacts ou fichiers d’export produits
- `status` : états d’export et transitions associées
- `policies` : règles d’éligibilité, de rétention, de sécurité ou d’exposition des exports

## Entrées

Le domaine reçoit principalement :

- des demandes de génération d’export
- des paramètres de filtrage, période, périmètre ou format d’export
- des demandes de lecture d’un export disponible ou de son historique
- des changements de statut d’un export en cours de préparation
- des contextes de boutique, scope, acteur, langue ou format cible
- des signaux internes utiles à l’activation, l’expiration ou l’annulation d’un export

## Sorties

Le domaine expose principalement :

- des définitions d’export structurées
- des demandes d’export et leur état
- des artefacts d’export produits
- des lectures exploitables par `dashboarding`, `observability`, `audit`, `integrations` et certaines couches d’administration
- des structures exportables prêtes à être consommées par des couches d’exécution ou de téléchargement autorisées

## Dépendances vers autres domaines

Le domaine `export` peut dépendre de :

- `orders`, `customers`, `products`, `documents`, `analytics`, `events`, `support` ou d’autres domaines source selon le périmètre de l’export demandé
- `jobs` pour l’exécution différée ou lourde d’un export sans absorber sa responsabilité
- `audit` pour tracer certaines demandes ou consultations sensibles d’export
- `observability` pour expliquer pourquoi un export a été généré, différé, expiré ou échoué
- `store` pour le contexte boutique et certaines politiques locales d’export

Les domaines suivants peuvent dépendre de `export` :

- `dashboarding`
- `integrations`
- `audit`
- certaines couches d’administration plateforme et boutique
- certains usages métiers autorisés de téléchargement ou d’échange cadré

## Capabilities activables liées

Le domaine `export` n’est pas une capability métier optionnelle au sens strict du noyau, mais il devient particulièrement important dès qu’une extraction structurée de données est nécessaire.

Exemples de capabilities liées :

- `erpIntegration`
- `electronicInvoicing`
- `analytics`
- `publicEvents`
- `newsletter`

### Règle

Le domaine `export` reste structurellement présent même si peu d’exports sont activement proposés.

Il constitue le cadre commun des extractions structurées du socle, distinct des documents métier durables et des intégrations providers.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `marketing_manager` en lecture partielle selon la politique retenue
- certains rôles analytiques, support ou administratifs selon le type d’export autorisé

### Permissions

Exemples de permissions concernées :

- `export.read`
- `export.write`
- `orders.read`
- `customers.read`
- `catalog.read`
- `documents.read`
- `analytics.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `export.requested`
- `export.started`
- `export.generated`
- `export.failed`
- `export.expired`
- `export.cancelled`
- `export.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `job.succeeded`
- `job.failed`
- `store.capabilities.updated`
- certaines actions administratives structurées de génération, expiration ou annulation d’export

Il doit toutefois rester maître de sa propre logique d’export structuré.

## Intégrations externes

Le domaine `export` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut produire des artefacts ensuite consommés par `integrations` ou téléchargés via des couches autorisées, mais :

- la vérité des exports internes reste dans `export`
- les DTO providers externes restent dans `integrations`
- les documents métier durables restent dans `documents`

## Données sensibles / sécurité

Le domaine `export` manipule potentiellement des ensembles de données sensibles à large périmètre.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- limitation des exports selon le rôle, le scope et le besoin métier
- séparation claire entre export structuré, document métier durable et échange externe provider-specific
- protection des artefacts d’export sensibles, expirables ou à accès restreint
- audit des demandes, téléchargements ou consultations sensibles si le modèle final les retient

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel export a été demandé
- quel périmètre et quel format ont été retenus
- quel statut d’export est en vigueur
- pourquoi un export a été différé, échoué, expiré ou annulé
- si un export n’est pas disponible à cause d’une capability off, d’un périmètre interdit, d’une policy de sécurité ou d’une règle applicable

### Audit

Il faut tracer :

- la demande d’un export sensible
- la génération d’un export sensible
- l’expiration ou l’annulation d’un export sensible
- certaines consultations ou téléchargements sensibles si le modèle final les retient explicitement
- certaines modifications manuelles importantes des politiques d’export

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ExportDefinition` : définition structurée d’un export disponible
- `ExportRequest` : demande d’export formulée par un acteur autorisé
- `ExportArtifact` : artefact ou fichier produit par l’export
- `ExportStatus` : état courant de l’export
- `ExportPolicy` : règle d’éligibilité, de rétention ou de sécurité
- `ExportScope` : périmètre métier de l’export

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un export possède un identifiant stable, un périmètre explicite et un statut explicite
- un artefact d’export est rattaché à une demande d’export explicite
- `export` ne se confond pas avec `documents`
- `export` ne se confond pas avec `integrations`
- `export` ne se confond pas avec `webhooks`
- `export` ne se confond pas avec `analytics`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente d’export structuré quand le cadre commun `export` existe
- un export sensible ne doit pas être accessible hors règle explicite de sécurité, de rôle et de scope

## Cas d’usage principaux

1. Générer un export de commandes sur une période donnée
2. Générer un export client ou catalogue pour un usage administratif autorisé
3. Générer un export analytique cadré pour exploitation interne
4. Produire un artefact réutilisable par une intégration ou un téléchargement manuel autorisé
5. Fournir à l’admin une lecture claire des exports demandés, générés, échoués ou expirés
6. Encadrer la rétention et la sécurité des fichiers d’export

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- définition d’export introuvable
- périmètre d’export invalide ou interdit
- format non supporté
- artefact expiré ou indisponible
- export non autorisé dans le contexte courant
- permission ou scope insuffisant
- conflit entre plusieurs règles de sécurité, de rétention ou de périmètre

## Décisions d’architecture

Les choix structurants du domaine sont :

- `export` porte les exportations structurées du socle
- `export` est distinct de `documents`
- `export` est distinct de `integrations`
- `export` est distinct de `webhooks`
- `export` est distinct de `analytics`
- les domaines consommateurs lisent la vérité des exports via `export`, sans la recréer localement
- les demandes, artefacts et politiques sensibles d’export doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les exportations structurées relèvent de `export`
- les documents métier durables relèvent de `documents`
- les connecteurs providers spécialisés relèvent de `integrations`
- les notifications sortantes génériques relèvent de `webhooks`
- l’analytics consolidée relève de `analytics`
- `export` ne remplace ni `documents`, ni `integrations`, ni `webhooks`, ni `analytics`, ni `jobs`
