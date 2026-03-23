# Domaine `integrations`

## Objectif

Ce document décrit le domaine `integrations` dans la doctrine courante du socle.

Il précise :

- le rôle du domaine ;
- sa place dans la modularité du socle ;
- sa source de vérité ;
- ses capabilities activables ;
- ses niveaux de sophistication ;
- ses objets métier ;
- ses invariants ;
- son cycle de vie ;
- ses règles de cohérence ;
- ses frontières externes ;
- ses implications de maintenance, d’exploitation et de coût.

Le domaine `integrations` est structurant pour la réutilisabilité du socle, car il porte les connecteurs provider-specific sans laisser ces providers polluer le coeur métier.

Le domaine `integrations` ne doit pas être pensé comme un fourre-tout technique.
Il porte la **frontière externe spécialisée** du système.

---

## Position dans la doctrine de modularité

Le domaine `integrations` est classé comme :

- `domaine coeur à capabilities toggleables`

Le domaine existe dans tous les projets sérieux du socle comme couche d’adaptation externe, même si peu de connecteurs sont activés au départ.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- le principe de frontière externe explicite ;
- la séparation entre coeur métier et providers ;
- la gestion structurée des connecteurs ;
- la gestion des credentials d’intégration ;
- la traduction des résultats externes vers le langage interne ;
- la traçabilité minimale des interactions externes importantes.

### Ce qui est activable / désactivable par capability

Le domaine `integrations` est lié aux capabilities suivantes :

- `integration.stripe`
- `integration.paypal`
- `integration.alma`
- `integration.klarna`
- `integration.erp`
- `integration.accounting`
- `integration.emailProvider`
- `integration.shippingCarrier`
- `integration.analyticsServer`
- `integration.invoiceProvider`
- `integration.aiProvider`

### Ce qui relève d’un niveau

Le domaine porte plusieurs niveaux de sophistication liés à :

- la variété des connecteurs ;
- la complexité des mappings ;
- la richesse des synchronisations ;
- le niveau de supervision requis.

### Ce qui relève d’un provider ou d’une intégration externe

Les providers eux-mêmes sont précisément l’objet de ce domaine.
Mais ils ne doivent jamais définir le langage coeur des autres domaines.

---

## Rôle

Le domaine `integrations` porte les connecteurs spécialisés du socle vers les systèmes externes identifiés.

Il constitue la source de vérité interne pour :

- l’existence d’un connecteur ;
- son statut ;
- sa configuration ;
- ses credentials techniques ;
- ses mappings ;
- certains résultats provider traduits ;
- certaines opérations de synchronisation.

Le domaine est distinct :

- de `payments`, `orders`, `taxation`, `auth`, etc., qui portent les vérités métier ;
- de `webhooks`, qui porte la notification sortante générique ;
- de `domain-events`, qui porte l’outbox interne ;
- de `jobs`, qui porte l’exécution asynchrone.

---

## Responsabilités

Le domaine `integrations` prend en charge :

- la modélisation logique des connecteurs externes ;
- leur activation / désactivation ;
- leurs credentials ;
- leurs mappings et traductions ;
- les DTO provider-specific ;
- les résultats externes traduits ;
- certaines synchronisations entrantes ou sortantes ;
- la journalisation utile des erreurs d’intégration ;
- la séparation stricte entre monde externe et langage interne du socle.

---

## Ce que le domaine ne doit pas faire

Le domaine `integrations` ne doit pas :

- devenir la source de vérité primaire d’un métier ;
- absorber la logique coeur de paiement, de commande ou d’auth ;
- transformer un payload brut provider en vérité interne sans validation ;
- devenir un substitut à l’outbox ou à l’audit ;
- mélanger connecteurs spécialisés et webhooks sortants génériques ;
- imposer un provider comme structure native du socle.

---

## Source de vérité

Le domaine `integrations` est la source de vérité pour :

- l’identité d’un connecteur ;
- son statut ;
- ses credentials d’intégration ;
- ses mappings techniques ;
- la configuration interne d’une intégration ;
- certains résultats provider traduits ou persistés à des fins de rapprochement.

Le domaine n’est pas la source de vérité pour :

- la commande ;
- le paiement interne ;
- le checkout ;
- la logique fiscale ;
- la sécurité d’auth ;
- les domain events ;
- les webhooks sortants génériques.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `Integration`
- `IntegrationStatus`
- `IntegrationProviderKind`
- `IntegrationCredential`
- `ProviderTranslationResult`
- `IntegrationSync`
- `IntegrationOperationRecord`
- `IntegrationMapping`

---

## Capabilities activables liées

Le domaine `integrations` est lié aux capabilities suivantes :

- `integration.stripe`
- `integration.paypal`
- `integration.alma`
- `integration.klarna`
- `integration.erp`
- `integration.accounting`
- `integration.emailProvider`
- `integration.shippingCarrier`
- `integration.analyticsServer`
- `integration.invoiceProvider`
- `integration.aiProvider`

### Effet si une capability d’intégration est activée

Le connecteur correspondant peut être configuré, utilisé et supervisé dans les règles du socle.

### Effet si une capability d’intégration est désactivée

Le connecteur n’est pas disponible, même si le domaine `integrations` existe toujours.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

- peu de connecteurs ;
- configuration simple ;
- faible densité de mappings ;
- peu de synchronisations.

### Niveau 2 — standard

- plusieurs connecteurs utiles ;
- meilleurs mappings ;
- meilleure visibilité des erreurs ;
- plus d’usages sortants ou entrants.

### Niveau 3 — avancé

- plusieurs connecteurs critiques ;
- plus de synchronisations ;
- meilleure supervision ;
- meilleure maîtrise des callbacks et retries.

### Niveau 4 — expert / multi-contraintes

- connecteurs nombreux ou sensibles ;
- forte dépendance métier ;
- gouvernance et audit plus exigeants ;
- mappings complexes ;
- maintenance plus coûteuse.

---

## Entrées

Le domaine reçoit principalement :

- des événements durables à projeter vers l’extérieur ;
- des résultats providers entrants ;
- des commandes de synchronisation ;
- des configurations et credentials d’intégration ;
- des demandes de test, rotation ou désactivation.

---

## Sorties

Le domaine expose principalement :

- des résultats providers traduits ;
- des ordres techniques vers les providers ;
- des statuts d’intégration ;
- des événements métier techniques liés aux intégrations ;
- des erreurs et états exploitables.

---

## Dépendances vers autres domaines

Le domaine `integrations` dépend de :

- `domain-events`
- `jobs`
- `audit`
- `observability`
- les domaines coeur concernés par chaque intégration
- `webhooks` pour la distinction de responsabilité

Les domaines suivants dépendent de `integrations` :

- `payments`
- `documents`
- `shipping`
- `analytics`
- `erp`
- `auth` si un provider externe d’identité est utilisé comme connecteur technique

---

## Dépendances vers providers / intégrations

Le domaine `integrations` parle directement aux providers et systèmes externes, mais selon des règles strictes :

- les DTO externes restent confinés ;
- les callbacks sont validés et dédupliqués ;
- les résultats externes sont traduits avant de toucher le coeur ;
- les credentials sont séparés et protégés ;
- le provider n’impose pas sa machine d’état au coeur.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `integration_operator`
- `observability_operator`
- `security_operator`

### Permissions

Exemples de permissions concernées :

- `integrations.read`
- `integrations.write`
- `integrations.sync`
- `integrations.credentials.manage`
- `observability.read`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `integration.config.updated`
- `integration.sync.started`
- `integration.sync.succeeded`
- `integration.sync.failed`
- `integration.provider.result.translated`
- `integration.credential.rotated`
- `integration.credential.revoked`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `order.created`
- `order.status.changed`
- `payment.captured`
- `payment.refunded`
- `inventory.stock.adjusted`
- `document.generated`
- `auth.password.changed` si une intégration de sécurité le requiert

---

## Données sensibles / sécurité

Le domaine `integrations` manipule une donnée hautement sensible.

Points de vigilance :

- credentials providers protégés ;
- rotation et révocation explicites ;
- validation stricte des payloads externes ;
- réduction de la fuite de secrets ou de payloads bruts dans les logs ;
- contrôle rigoureux des opérations sortantes et entrantes.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel connecteur a été utilisé ;
- quelle opération a été tentée ;
- quel résultat provider a été reçu ;
- quelle traduction a été produite ;
- pourquoi une synchronisation a échoué ;
- quelle reprise est possible.

### Audit

Il faut tracer :

- création ou modification d’un connecteur ;
- activation / désactivation ;
- rotation / révocation de credentials ;
- synchronisations forcées ;
- replays ou reprises opératoires sensibles.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un connecteur possède une identité et un statut explicites ;
- un provider ne devient jamais la vérité métier primaire du socle ;
- les DTO externes restent confinés à `integrations` ;
- une mutation interne déclenchée par un provider n’est appliquée qu’après traduction et validation ;
- les credentials d’intégration restent distincts des credentials utilisateurs ;
- un connecteur désactivé ne doit plus être considéré comme utilisable.

---

## Lifecycle et gouvernance des données

### États principaux

Les états principaux d’une intégration sont typiquement :

- `ACTIVE`
- `DISABLED`
- `ARCHIVED`

Les credentials peuvent eux-mêmes être :

- actifs ;
- rotated ;
- revoked ;
- archived.

### Transitions autorisées

Exemples :

- `ACTIVE -> DISABLED`
- `DISABLED -> ACTIVE`
- `ACTIVE -> ARCHIVED`
- credential actif -> rotated
- credential actif -> revoked

### Transitions interdites

Exemples :

- un connecteur archivé ne redevient pas implicitement actif ;
- un credential révoqué n’est plus utilisable ;
- un résultat provider brut ne devient pas une vérité coeur par simple stockage.

### Règles de conservation / archivage / suppression

- les connecteurs et résultats utiles restent traçables ;
- les credentials sont gérés avec prudence selon leur nature ;
- les éléments utiles à l’audit, au support et au rapprochement ne sont pas supprimés implicitement ;
- les purges éventuelles sont contrôlées.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création ou mise à jour d’un connecteur ;
- création, rotation ou révocation d’un credential ;
- persistance d’un résultat provider traduit ;
- écriture des events `integration.*` correspondants ;
- mutation interne locale déclenchée par un résultat externe validé, avec son outbox associé si nécessaire.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- appel provider sortant ;
- polling ;
- synchronisation ;
- notification opérateur ;
- monitoring externe ;
- projection secondaire.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les mutations locales sensibles ;
- déduplication des callbacks par identité externe stable ;
- séparation claire entre réception externe et application métier ;
- une seule traduction interne validée par événement logique.

Les conflits attendus sont :

- callbacks dupliqués ;
- polling et callback concurrents ;
- rotation de credential pendant une synchronisation ;
- double déclenchement d’un sync.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `apply-provider-result` : clé d’intention = `(providerName, externalEventId)`
- `run-integration-sync` : clé d’intention = `(integrationId, syncIntentId)`
- `rotate-integration-credential` : clé d’intention = `(integrationId, credentialKey, rotationIntentId)`

Un retry ne doit jamais produire deux mutations internes divergentes.

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `integration.config.updated`
- `integration.sync.started`
- `integration.sync.succeeded`
- `integration.sync.failed`
- `integration.provider.result.translated`
- `integration.credential.rotated`
- `integration.credential.revoked`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- appel provider externe ;
- webhook sortant ;
- monitoring externe ;
- notification opérateur ;
- analytics externe.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` si peu de connecteurs et faible dépendance ;
- `M2` dès qu’un provider critique est activé ;
- `M3` avec plusieurs connecteurs sensibles ;
- `M4` pour des contextes très intégrés ou réglementés.

### Pourquoi

Le domaine `integrations` concentre une part forte du risque opérationnel externe.
Plus les connecteurs sont nombreux ou critiques, plus il exige :

- observability ;
- idempotence ;
- reprise propre ;
- traçabilité des credentials ;
- supervision des erreurs externes.

### Points d’exploitation à surveiller

- statut des connecteurs ;
- échecs externes ;
- callbacks dupliqués ;
- retries ;
- rotation de credentials ;
- désynchronisations entre coeur et providers.

---

## Impact coût / complexité

Le coût du domaine `integrations` monte principalement avec :

- le nombre de connecteurs activés ;
- la criticité métier des connecteurs ;
- la complexité des mappings ;
- la densité des synchronisations ;
- la richesse de l’observability attendue ;
- les exigences de sécurité et de rotation de credentials.

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Configurer un connecteur externe
2. Stocker et gérer ses credentials
3. Traduire un résultat provider en langage interne
4. Lancer ou superviser une synchronisation
5. Séparer proprement coeur et frontière externe

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- connecteur introuvable ;
- connecteur désactivé ;
- credential expiré ou révoqué ;
- callback invalide ;
- callback dupliqué ;
- résultat externe ambigu ;
- synchronisation échouée ;
- rotation concurrente de credentials.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `integrations` est un domaine coeur à capabilities toggleables ;
- les providers restent à la frontière externe ;
- les DTO providers restent confinés ;
- les résultats externes sont traduits avant toute mutation coeur ;
- les credentials sont séparés et protégés ;
- la multiplication des providers fait monter coût, maintenance et risque ;
- le domaine structure la relation au monde externe sans polluer les domaines coeur.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `integrations` appartient à la colonne vertébrale du socle ;
- les providers sont toggleables ;
- les providers ne remplacent jamais les domaines coeur ;
- les callbacks providers sont validés, dédupliqués et traduits ;
- la sécurité des credentials est une responsabilité structurante du domaine ;
- les intégrations font monter le coût et la maintenance de façon explicite.
