# Domaine api-clients

## Rôle

Le domaine `api-clients` porte les clients techniques autorisés à appeler les interfaces programmatiques du socle.

Il structure les identités machine-to-machine, leurs credentials, leurs périmètres d’accès et leur état d’activation, sans absorber les utilisateurs humains, les rôles fonctionnels, les intégrations provider-specific ou les permissions métier elles-mêmes.

## Responsabilités

Le domaine `api-clients` prend en charge :

- les clients techniques applicatifs
- les credentials techniques associés
- l’état d’activation ou de révocation d’un client API
- le rattachement d’un client API à un scope ou périmètre d’accès
- la lecture des métadonnées utiles à l’authentification technique
- la base de contrôle d’accès machine-to-machine exploitable par les couches API, `integrations`, `audit`, `monitoring` et `observability`

## Ce que le domaine ne doit pas faire

Le domaine `api-clients` ne doit pas :

- porter les utilisateurs humains, qui relèvent de `users`
- porter les rôles fonctionnels de haut niveau, qui relèvent de `roles`
- porter la définition complète des permissions fines, qui relève de `permissions`
- porter les adaptateurs providers externes, qui relèvent de `integrations`
- devenir un fourre-tout de secrets, tokens et configurations d’intégration sans langage métier clair
- devenir la source de vérité des politiques API globales si celles-ci relèvent d’une couche transverse distincte

Le domaine `api-clients` porte l’identité technique des appelants machine-to-machine du socle. Il ne remplace ni `users`, ni `roles`, ni `permissions`, ni `integrations`.

## Sous-domaines

- `registry` : registre des clients API déclarés
- `credentials` : credentials et références de secret associées
- `scopes` : périmètres d’accès techniques des clients API
- `lifecycle` : activation, révocation, rotation et état du client API

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour de clients API
- des demandes de rotation ou révocation de credentials
- des demandes de lecture d’un client API ou de ses métadonnées d’accès
- des demandes de vérification d’état d’un client technique
- des changements de scope ou de politique d’accès technique

## Sorties

Le domaine expose principalement :

- des clients API structurés
- des états de client API
- des références de credentials ou secrets techniques
- des scopes techniques de client API
- une lecture exploitable par les couches API, `integrations`, `audit`, `monitoring`, `observability` et certaines couches d’administration plateforme

## Dépendances vers autres domaines

Le domaine `api-clients` peut dépendre de :

- `permissions` pour rattacher un client technique à des permissions ou vues de permissions adaptées
- `audit` pour tracer les changements sensibles de credentials ou de scopes
- `observability` pour expliquer certains refus ou usages anormaux
- `monitoring` pour exposer certains états de santé ou abus techniques liés à un client API
- `store` pour certains scopes multi-boutiques si le modèle le prévoit

Les domaines suivants peuvent dépendre de `api-clients` :

- `integrations`
- `audit`
- `monitoring`
- `observability`
- les couches API
- les couches d’administration plateforme

## Capabilities activables liées

Le domaine `api-clients` n’est pas une capability métier optionnelle au sens classique.

Il fait partie de l’architecture transverse du socle.

En revanche, certains usages de clients API ne sont utiles que si certains domaines ou capacités externes sont actifs, par exemple :

- `erpIntegration`
- `ebpIntegration`
- `chorusProIntegration`
- `serverSideTracking`
- `marketingPixels`

### Règle

Le domaine `api-clients` reste présent même si aucun connecteur externe spécialisé n’est activé.

Il constitue la base commune d’identité technique pour les usages machine-to-machine autorisés.

## Rôles/permissions concernés

### Rôles

Le domaine `api-clients` est principalement gouverné et observé par :

- `platform_owner`
- `platform_engineer`

Les rôles boutique ne doivent pas administrer librement les clients techniques transverses, scopes et secrets associés.

### Permissions

Exemples de permissions concernées :

- `api_clients.read`
- `api_clients.write`
- `integrations.read`
- `integrations.write`
- `audit.read`
- `monitoring.read`
- `observability.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `api_client.created`
- `api_client.updated`
- `api_client.revoked`
- `api_client.credential.rotated`
- `api_client.scope.changed`
- `api_client.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `permission.updated` si certains liens avec les permissions techniques doivent être recalculés
- `store.capabilities.updated` si certains scopes dépendent d’un périmètre activé
- certaines actions administratives structurées de sécurité ou de gouvernance

Il doit toutefois rester maître de sa propre logique d’identité technique machine-to-machine.

## Intégrations externes

Le domaine `api-clients` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être utilisé par `integrations` ou par des couches API pour authentifier un appelant technique, mais :

- les credentials provider-specific restent dans `integrations` quand ils concernent un connecteur externe nommé
- les clients API du socle restent dans `api-clients` quand ils représentent un appelant technique autorisé du système

## Données sensibles / sécurité

Le domaine `api-clients` manipule des credentials, références de secret et scopes techniques hautement sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- rotation des credentials et révocation rapide en cas de compromission
- jamais de secret exposé côté client
- séparation claire entre métadonnées visibles et secret effectif
- audit des changements sensibles de scope, statut ou credential
- limitation de l’exposition des détails de sécurité selon le rôle et le scope

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel client API a été utilisé
- s’il est actif, révoqué ou invalide
- quel scope technique lui est appliqué
- pourquoi un appel a été accepté ou refusé si le système d’explication le permet
- si une anomalie d’usage est liée à un scope, un credential invalide, une révocation ou une mauvaise configuration

### Audit

Il faut tracer :

- la création d’un client API
- la modification d’un client API
- la révocation d’un client API
- la rotation d’un credential
- les changements sensibles de scope ou de statut
- certaines consultations sensibles si le modèle final les retient

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ApiClient` : client technique autorisé
- `ApiClientCredentialRef` : référence de credential ou secret associé
- `ApiClientScope` : périmètre d’accès technique
- `ApiClientStatus` : état du client API
- `ApiClientIdentity` : identité technique stable de l’appelant

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un client API possède une identité stable et explicite
- un client API possède un statut explicite
- un client API n’est pas un utilisateur humain
- `api-clients` ne se confond pas avec `users`
- `api-clients` ne se confond pas avec `integrations`
- les credentials sensibles restent protégés et ne sont jamais assimilés à de simples métadonnées publiques
- les autres couches ne doivent pas recréer librement leur propre registre technique divergent quand le cadre commun `api-clients` existe

## Cas d’usage principaux

1. Déclarer un client API technique autorisé
2. Associer un scope technique à un client API
3. Activer ou révoquer un client API
4. Faire une rotation de credential
5. Vérifier l’état et le périmètre d’un appelant machine-to-machine
6. Exposer à l’admin technique une lecture claire des clients API, de leur statut et de leurs scopes

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- client API introuvable
- credential absent ou invalide
- client API révoqué ou inactif
- scope technique invalide ou incohérent
- rotation non autorisée
- tentative d’exposition d’un secret dans un contexte non autorisé
- conflit entre scope technique et politique d’accès applicable

## Décisions d’architecture

Les choix structurants du domaine sont :

- `api-clients` porte les identités techniques machine-to-machine du socle
- `api-clients` est distinct de `users`
- `api-clients` est distinct de `roles`
- `api-clients` est distinct de `permissions`
- `api-clients` est distinct de `integrations`
- les clients API techniques du socle utilisent un registre commun, des scopes explicites et un cycle de vie gouverné
- les credentials, scopes et changements sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les clients techniques machine-to-machine relèvent de `api-clients`
- les utilisateurs humains relèvent de `users`
- les permissions fines relèvent de `permissions`
- les connecteurs provider-specific relèvent de `integrations`
- `api-clients` ne remplace ni `users`, ni `roles`, ni `permissions`, ni `integrations`
