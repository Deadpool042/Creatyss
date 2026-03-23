# Domaine import

## Rôle

Le domaine `import` porte les imports structurés du socle.

Il organise l’ingestion contrôlée de fichiers, flux ou jeux de données externes vers les modèles internes de la boutique ou de la plateforme, pour des besoins d’administration, de reprise, d’alimentation catalogue, de migration ou d’échange cadré, sans absorber les intégrations provider-specific continues, les documents métier durables, les webhooks ou la logique métier des domaines cibles.

## Responsabilités

Le domaine `import` prend en charge :

- les imports structurés du socle
- les définitions d’import disponibles
- les paramètres d’import
- les validations préalables d’un import
- les statuts d’import demandés, validés, exécutés, partiellement appliqués, échoués, annulés ou expirés
- les artefacts d’import au niveau métier
- la lecture gouvernée des imports passés ou en cours
- la base d’import consommable par `dashboarding`, `observability`, `audit`, `integrations`, certaines couches d’administration et certains usages métiers autorisés

## Ce que le domaine ne doit pas faire

Le domaine `import` ne doit pas :

- porter les intégrations provider-specific continues, qui relèvent de `integrations`
- porter les documents métier durables, qui relèvent de `documents`
- porter les notifications sortantes génériques, qui relèvent de `webhooks`
- porter la logique métier complète des domaines cible importés
- devenir un simple chargeur technique brut en base de données sans langage métier explicite
- absorber toute logique de migration, synchronisation ou mapping externe sans frontière claire

Le domaine `import` porte les imports structurés du socle. Il ne remplace ni `integrations`, ni `documents`, ni `webhooks`, ni les domaines métier cibles.

## Sous-domaines

- `definitions` : définitions d’import structurés
- `requests` : demandes d’import et paramètres associés
- `validation` : validation, pré-contrôles et détection d’erreurs d’import
- `artifacts` : artefacts, fichiers source ou résultats d’analyse d’import
- `status` : états d’import et transitions associées
- `policies` : règles d’éligibilité, de sécurité, de mapping ou d’application des imports

## Entrées

Le domaine reçoit principalement :

- des demandes de génération d’import
- des fichiers, flux ou jeux de données candidats à l’import
- des paramètres de format, de mapping, de périmètre ou d’application
- des demandes de validation préalable d’un import
- des demandes de lecture d’un import ou de son historique
- des contextes de boutique, scope, acteur, langue, domaine cible ou format source
- des signaux internes utiles à l’application, l’annulation ou l’expiration d’un import

## Sorties

Le domaine expose principalement :

- des définitions d’import structurées
- des demandes d’import et leur état
- des validations et résultats de contrôle d’import
- des artefacts d’import et résultats d’application
- des lectures exploitables par `dashboarding`, `observability`, `audit`, `integrations` et certaines couches d’administration
- des structures importables prêtes à être consommées par les domaines cibles ou couches d’exécution autorisées

## Dépendances vers autres domaines

Le domaine `import` peut dépendre de :

- `products`, `catalog-modeling`, `bundles`, `pricing`, `customers`, `orders`, `documents`, `events`, `support` ou d’autres domaines cible selon le périmètre de l’import demandé
- `jobs` pour l’exécution différée ou lourde d’un import sans absorber sa responsabilité
- `approval` si certains imports sensibles nécessitent validation préalable
- `workflow` si le cycle de vie d’un import suit un processus structuré
- `audit` pour tracer certaines demandes, validations ou applications sensibles d’import
- `observability` pour expliquer pourquoi un import a été validé, partiellement appliqué, rejeté ou échoué
- `stores` pour le contexte boutique et certaines politiques locales d’import

Les domaines suivants peuvent dépendre de `import` :

- `dashboarding`
- `integrations`
- `audit`
- certaines couches d’administration plateforme et boutique
- certains usages métiers autorisés d’alimentation, reprise ou migration cadrée

## Capabilities activables liées

Le domaine `import` n’est pas une capability métier optionnelle au sens strict du noyau, mais il devient particulièrement important dès qu’une ingestion structurée de données est nécessaire.

Exemples de capabilities liées :

- `erpIntegration`
- `multiLanguage`
- `bundles`
- `marketingCampaigns`
- `publicEvents`

### Règle

Le domaine `import` reste structurellement présent même si peu d’imports sont activement proposés.

Il constitue le cadre commun des ingestions structurées du socle, distinct des intégrations providers continues et des documents métier durables.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `catalog_manager`
- `order_manager`
- certains rôles administratifs, support ou analytiques selon le type d’import autorisé

### Permissions

Exemples de permissions concernées :

- `import.read`
- `import.write`
- `catalog.read`
- `orders.read`
- `customers.read`
- `documents.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `import.requested`
- `import.validated`
- `import.rejected`
- `import.started`
- `import.applied`
- `import.partially_applied`
- `import.failed`
- `import.cancelled`
- `import.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `job.succeeded`
- `job.failed`
- `approval.approved`
- `workflow.completed`
- `store.capabilities.updated`
- certaines actions administratives structurées de validation, application, annulation ou reprise d’import

Il doit toutefois rester maître de sa propre logique d’import structuré.

## Intégrations externes

Le domaine `import` ne doit pas devenir un domaine d’intégration provider-specific continue.

Il peut consommer des artefacts ou flux ensuite projetés par `integrations` ou fournis manuellement, mais :

- la vérité des imports internes reste dans `import`
- les DTO providers externes restent dans `integrations`
- les documents métier durables restent dans `documents`
- la synchronisation continue reste hors du domaine `import`

## Données sensibles / sécurité

Le domaine `import` manipule potentiellement des ensembles de données sensibles et des modifications massives des modèles internes.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- limitation des imports selon le rôle, le scope et le besoin métier
- séparation claire entre import structuré, document métier durable et intégration provider continue
- protection des artefacts source, résultats de validation et rapports d’erreur sensibles
- audit des demandes, validations, applications ou consultations sensibles d’import

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel import a été demandé
- quel périmètre, quel format et quel domaine cible ont été retenus
- quel statut d’import est en vigueur
- pourquoi un import a été validé, rejeté, partiellement appliqué, échoué ou annulé
- si un import n’est pas disponible à cause d’une capability off, d’un périmètre interdit, d’une policy de sécurité, d’un mapping invalide ou d’une règle applicable

### Audit

Il faut tracer :

- la demande d’un import sensible
- la validation ou le rejet d’un import sensible
- l’application d’un import sensible
- certaines annulations, reprises ou consultations sensibles si le modèle final les retient explicitement
- certaines modifications manuelles importantes des politiques d’import

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ImportDefinition` : définition structurée d’un import disponible
- `ImportRequest` : demande d’import formulée par un acteur autorisé
- `ImportArtifact` : artefact ou fichier source associé à l’import
- `ImportValidationResult` : résultat de validation ou de pré-contrôle
- `ImportStatus` : état courant de l’import
- `ImportPolicy` : règle d’éligibilité, de mapping, de sécurité ou d’application
- `ImportScope` : périmètre métier de l’import

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un import possède un identifiant stable, un périmètre explicite et un statut explicite
- un artefact d’import est rattaché à une demande d’import explicite
- un import n’applique pas directement des changements massifs sans cadre explicite de validation ou d’autorisation
- `import` ne se confond pas avec `integrations`
- `import` ne se confond pas avec `documents`
- `import` ne se confond pas avec `webhooks`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente d’import structuré quand le cadre commun `import` existe
- un import sensible ne doit pas être applicable hors règle explicite de sécurité, de rôle, de scope et de validation

## Cas d’usage principaux

1. Importer un catalogue produit depuis un fichier structuré
2. Importer des données clients ou commandes dans un cadre autorisé
3. Valider un fichier avant application effective
4. Produire un résultat d’import détaillant les succès partiels et erreurs
5. Fournir à l’admin une lecture claire des imports demandés, validés, appliqués, échoués ou annulés
6. Encadrer la sécurité et la traçabilité des opérations massives d’ingestion

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- définition d’import introuvable
- périmètre d’import invalide ou interdit
- format non supporté
- artefact source absent ou invalide
- mapping incohérent ou incomplet
- import non autorisé dans le contexte courant
- permission ou scope insuffisant
- conflit entre plusieurs règles de sécurité, de validation ou de périmètre

## Décisions d’architecture

Les choix structurants du domaine sont :

- `import` porte les imports structurés du socle
- `import` est distinct de `integrations`
- `import` est distinct de `documents`
- `import` est distinct de `webhooks`
- `import` est distinct des domaines métier cibles
- les domaines consommateurs lisent la vérité des imports via `import`, sans la recréer localement
- les demandes, validations, applications et politiques sensibles d’import doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les imports structurés relèvent de `import`
- les connecteurs providers spécialisés relèvent de `integrations`
- les documents métier durables relèvent de `documents`
- les notifications sortantes génériques relèvent de `webhooks`
- les changements métier durables appliqués après import restent de la responsabilité des domaines cible
- `import` ne remplace ni `integrations`, ni `documents`, ni `webhooks`, ni `jobs`, ni les domaines métier cible
