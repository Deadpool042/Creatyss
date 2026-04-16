# Clients API

## Rôle

Le domaine `api-clients` porte les clients API explicitement modélisés dans le système.

Il définit :

- ce qu’est un client API du point de vue du système ;
- comment un client API est créé, identifié, activé, suspendu, révoqué ou archivé ;
- comment ce domaine se distingue des utilisateurs humains, des permissions métier globales, des intégrations provider-specific et des secrets techniques externes ;
- comment le système reste maître de sa vérité interne sur les identités machine, leurs statuts et leurs autorisations.

Le domaine existe pour fournir une représentation explicite des acteurs techniques non humains, distincte :

- des utilisateurs humains portés par `users` ;
- des permissions globales portées par `permissions` ;
- des rôles portés par `roles` ;
- des intégrations provider-specific portées par `integrations` ;
- des secrets ou infrastructures externes non gouvernés par le système.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur structurel`

### Activable

`oui`

Le domaine `api-clients` est activable.
Lorsqu’il est activé, il devient structurant pour l’exposition sécurisée d’API, les accès machine-to-machine, certaines automatisations et certaines intégrations gouvernées.

---

## Source de vérité

Le domaine `api-clients` est la source de vérité pour :

- la définition interne d’un client API ;
- son identité machine ;
- son statut ;
- ses clés, secrets ou références d’authentification lorsque leur gouvernance est portée ici ;
- ses autorisations explicites lorsqu’elles sont portées au niveau client ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `api-clients` n’est pas la source de vérité pour :

- les utilisateurs humains, qui relèvent de `users` ;
- la politique globale de rôles, qui relève de `roles` ;
- la politique globale de permissions, qui relève de `permissions` ;
- les DTO providers externes, qui relèvent de `integrations` ;
- les secrets d’infrastructure non gérés par le système.

Un client API est une identité machine gouvernée.
Il ne doit pas être confondu avec :

- un utilisateur humain ;
- une intégration provider ;
- un simple token isolé sans rattachement métier ;
- une permission globale ;
- une clé d’infrastructure hors périmètre métier.

---

## Responsabilités

Le domaine `api-clients` est responsable de :

- définir ce qu’est un client API dans le système ;
- porter son identité machine ;
- porter ses statuts d’activation, suspension, révocation ou archivage ;
- porter ses secrets ou références d’authentification si le modèle les expose ici ;
- exposer une lecture gouvernée des clients API actifs, suspendus, révoqués ou archivés ;
- publier les événements significatifs liés à la vie d’un client API ;
- protéger le système contre les identités machine implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- rotation de secret ;
- expiration de clé ;
- scopes ou permissions attachés au client ;
- restrictions par boutique, environnement ou usage ;
- métadonnées opératoires du client ;
- journalisation métier des usages significatifs ;
- délégation contrôlée de création ou révocation.

---

## Non-responsabilités

Le domaine `api-clients` n’est pas responsable de :

- définir les utilisateurs humains ;
- définir l’intégralité des permissions globales ;
- définir l’intégralité des rôles globaux ;
- exécuter les intégrations provider-specific ;
- gouverner les secrets d’infrastructure externes hors périmètre ;
- devenir un IAM universel pour tout le système.

Le domaine `api-clients` ne doit pas devenir :

- un doublon de `users` ;
- un doublon de `permissions` ;
- un doublon de `roles` ;
- un conteneur flou de tokens ou clés sans gouvernance métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- un client API possède une identité stable ;
- un client API possède un statut explicite ;
- un client révoqué ou suspendu ne doit pas être traité comme actif sans règle explicite ;
- une rotation de secret ou de clé doit être traçable ;
- une autorisation attachée à un client doit être interprétable sans ambiguïté ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente de client API quand le cadre commun existe ;
- une identité machine doit rester distincte d’une identité humaine.

Le domaine protège la cohérence des identités machine gouvernées du système.

---

## Dépendances

### Dépendances métier

Le domaine `api-clients` interagit fortement avec :

- `users`
- `permissions`
- `roles`
- `stores`
- `integrations`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `legal`, si certaines exigences de traçabilité ou de conservation s’appliquent
- `monitoring`, si certains usages techniques ou alertes sont structurés
- `jobs`, si certaines révocations, expirations ou rotations sont différées

### Dépendances externes

Le domaine peut être relié à :

- gateways API ;
- systèmes IAM externes ;
- coffres de secrets ;
- infrastructures d’authentification ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `api-clients` porte les identités machine gouvernées.
Il ne doit pas absorber :

- les utilisateurs humains ;
- l’intégralité de la politique globale IAM ;
- les providers externes ;
- ni les secrets d’infrastructure hors périmètre métier.

---

## Événements significatifs

Le domaine `api-clients` publie ou peut publier des événements significatifs tels que :

- client API créé ;
- client API activé ;
- client API suspendu ;
- client API révoqué ;
- client API archivé ;
- secret client API roté ;
- permissions client API modifiées ;
- expiration client API modifiée.

Le domaine peut consommer des signaux liés à :

- permission modifiée ;
- rôle modifié ;
- capability boutique modifiée ;
- action administrative structurée ;
- politique de sécurité modifiée ;
- rotation ou événement technique validé.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `api-clients` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- actif ;
- suspendu ;
- révoqué ;
- archivé.

Des états supplémentaires peuvent exister :

- en attente d’activation ;
- expiré ;
- restreint ;
- en rotation.

Le domaine doit éviter :

- les clients API “fantômes” ;
- les changements silencieux de statut ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `api-clients` expose principalement :

- des lectures de clients API structurés ;
- des lectures de statut ;
- des lectures de permissions ou scopes attachés si ce modèle est porté ici ;
- des lectures exploitables par les couches API, `permissions`, `observability`, `audit` et certaines couches d’administration ;
- des structures prêtes à être consommées par les domaines autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de clients API ;
- des activations, suspensions, révocations ou archivages ;
- des demandes de lecture d’un client API ;
- des changements d’autorisations ou de contexte d’usage ;
- des contextes de boutique, environnement, scope ou usage technique ;
- des signaux internes utiles à l’évolution du cycle de vie.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `api-clients` peut être exposé à des contraintes telles que :

- multi-environnements ;
- multi-boutiques ;
- scopes fins ;
- rotation de secrets ;
- expiration automatique ;
- projection vers gateway ou IAM externe ;
- audit renforcé ;
- rétrocompatibilité de clés ou identifiants.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des clients API reste dans `api-clients` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une identité incohérente ne doit pas être promue silencieusement ;
- les conflits entre statut, secret, scope et usage doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `api-clients` manipule des données de sécurité sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- protection des secrets, clés ou références sensibles ;
- séparation claire entre création, lecture limitée, rotation, suspension et révocation ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des changements significatifs de secret, statut ou autorisation ;
- prudence sur les usages frauduleux, les expositions accidentelles et les escalades de privilèges.

---

## Observabilité et audit

Le domaine `api-clients` doit rendre visibles au minimum :

- quel client API est actif ;
- quel statut est en vigueur ;
- quelles autorisations sont attachées ;
- pourquoi un client API est activé, suspendu, révoqué ou archivé ;
- si une évolution est bloquée à cause d’une règle, d’un statut ou d’une incohérence ;
- si une rotation ou expiration a modifié l’accès effectif.

L’audit doit permettre de répondre à des questions comme :

- quel client API a été créé ou modifié ;
- quand ;
- selon quelle origine ;
- avec quel changement de statut, de secret ou d’autorisation ;
- avec quelle validation ou action humaine ;
- avec quel impact sur les accès techniques.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- client inexistant ;
- secret invalide ;
- statut incohérent ;
- évolution non autorisée ;
- suspicion d’abus ou d’accès anormal.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ApiClient` : client API structuré ;
- `ApiClientStatus` : état du client API ;
- `ApiClientSecret` : secret ou référence de secret si ce modèle est porté ici ;
- `ApiClientScope` : scope ou autorisation attachée ;
- `ApiClientPolicy` : règle de gouvernance, d’expiration ou de sécurité ;
- `ApiClientAuditRecord` : trace structurée d’évolution critique si ce modèle est exposé.

---

## Impact de maintenance / exploitation

Le domaine `api-clients` a un impact d’exploitation élevé lorsqu’il est activé.

Raisons :

- il touche directement la sécurité des accès machine ;
- ses erreurs peuvent provoquer fuites, blocages ou accès indus ;
- il interagit avec permissions, rôles, audit et observabilité ;
- il nécessite une forte traçabilité ;
- il dépend souvent de politiques de sécurité strictes et parfois de systèmes externes.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- la rotation et l’expiration des secrets ;
- la traçabilité des changements ;
- la cohérence avec permissions et rôles ;
- les effets de bord sur API, intégrations et support opératoire ;
- la détection d’usages anormaux.

Le domaine doit être considéré comme sensible dès qu’un accès API machine-to-machine réel existe.

---

## Limites du domaine

Le domaine `api-clients` s’arrête :

- avant les utilisateurs humains ;
- avant l’intégralité de la politique IAM globale ;
- avant les providers externes ;
- avant les secrets d’infrastructure hors périmètre ;
- avant les DTO providers externes.

Le domaine `api-clients` porte les identités machine gouvernées.
Il ne doit pas devenir un IAM universel ni un doublon des autres domaines de sécurité.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `api-clients` et `permissions` ;
- la frontière exacte entre `api-clients` et `roles` ;
- la part exacte des secrets réellement persistés ici ;
- la gouvernance des expirations et rotations ;
- la hiérarchie entre vérité interne et IAM externe éventuel ;
- la place exacte des restrictions par boutique, environnement ou scope.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/foundation/users.md`
- `../core/foundation/permissions.md`
- `../core/foundation/roles.md`
- `../core/foundation/stores.md`
- `../optional/platform/integrations.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../cross-cutting/monitoring.md`
- `../cross-cutting/legal.md`
