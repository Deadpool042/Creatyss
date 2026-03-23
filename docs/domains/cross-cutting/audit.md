# Domaine audit

## Rôle

Le domaine `audit` porte la traçabilité sensible et gouvernée du socle.

Il structure les traces d’actions, changements et décisions qui doivent pouvoir être expliqués, revus ou justifiés a posteriori pour des raisons de gouvernance, de sécurité, d’administration, de conformité interne ou d’investigation, sans absorber l’observabilité, le monitoring, les domain events ou les logs techniques bruts.

## Responsabilités

Le domaine `audit` prend en charge :

- les entrées d’audit sensibles
- la traçabilité des actions administratives critiques
- la traçabilité des changements de configuration sensibles
- la traçabilité des changements de droits, rôles et permissions
- la traçabilité de certaines transitions métier importantes
- la lecture gouvernée des traces d’audit
- la base de preuve interne exploitable par les équipes plateforme et, selon le scope, par certains rôles autorisés

## Ce que le domaine ne doit pas faire

Le domaine `audit` ne doit pas :

- porter l’observabilité explicative, qui relève de `observability`
- porter le monitoring technique, qui relève de `monitoring`
- porter les domain events, qui relèvent de `domain-events`
- porter les logs applicatifs ou techniques bruts comme unique modèle
- devenir un journal universel de tout le runtime sans hiérarchie ni gouvernance
- redéfinir les vérités métier des domaines source

Le domaine `audit` porte la traçabilité sensible et gouvernée. Il ne remplace ni `observability`, ni `monitoring`, ni `domain-events`.

## Sous-domaines

- `entries` : entrées d’audit structurées
- `policies` : règles de ce qui doit être audité ou non
- `review` : lecture, revue et consultation gouvernée des traces d’audit

## Entrées

Le domaine reçoit principalement :

- des actions sensibles issues des domaines source
- des changements de configuration, de permissions, de rôles ou de capabilities
- certaines transitions métier critiques
- des demandes de consultation d’historique d’audit
- des contextes acteur, boutique, scope, ressource et intervalle temporel

## Sorties

Le domaine expose principalement :

- des entrées d’audit structurées
- des lectures filtrées et gouvernées des traces d’audit
- une base de preuve exploitable par les équipes plateforme, la gouvernance d’accès et certaines fonctions d’administration autorisées
- des corrélations exploitables par `observability`, `dashboarding` et certaines couches d’administration

## Dépendances vers autres domaines

Le domaine `audit` peut dépendre de :

- `users` pour l’identité technique de l’acteur
- `roles` et `permissions` pour certaines traces de gouvernance d’accès
- `stores` pour le contexte boutique
- `observability` pour certaines corrélations explicatives, sans absorber sa responsabilité

Les domaines suivants peuvent dépendre de `audit` :

- `roles`
- `permissions`
- `users`
- `stores`
- `observability`
- `dashboarding`
- les couches d’administration plateforme

Et les domaines émetteurs typiques incluent notamment :

- `roles`
- `permissions`
- `users`
- `stores`
- `feature-flags`
- `integrations`
- `webhooks`
- `orders`
- `payments`
- `returns`
- `documents`

## Capabilities activables liées

Le domaine `audit` est directement ou indirectement lié à :

- `auditTrail`
- `advancedPermissions`
- `businessObservability`
- `technicalMonitoring`

### Effet si `auditTrail` est activée

Le domaine devient pleinement exploitable pour tracer les actions sensibles du socle.

### Effet si `auditTrail` est désactivée

Le domaine reste structurellement présent, mais aucune exposition avancée de traçabilité ne doit être pilotée hors besoins internes strictement cadrés.

### Effet si `advancedPermissions` est activée

Le domaine doit tracer plus finement les changements de rôles, permissions et gouvernance d’accès.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`

Éventuellement, certains rôles de revue ou d’observation peuvent disposer d’un accès très limité selon le scope retenu.

Les rôles boutique ne doivent pas accéder librement à la traçabilité sensible transverse du socle.

### Permissions

Exemples de permissions concernées :

- `audit.read`
- `roles.read`
- `permissions.read`
- `store.settings.read`
- `capabilities.read`
- `integrations.read`
- `webhooks.read`

Selon le niveau de détail retenu plus tard, des permissions plus spécifiques d’investigation ou de revue d’audit pourront être ajoutées.

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `audit.entry.created`
- `audit.policy.updated`

## Événements consommés

Le domaine peut consommer certains événements internes ou actions source du type :

- `user.roles.changed`
- `role.updated`
- `permission.updated`
- `store.capabilities.updated`
- `feature_flag.enabled`
- `feature_flag.disabled`
- `integration.sync.status.changed` pour certains cas critiques si le modèle le prévoit
- certaines actions administratives manuelles structurées

Il doit toutefois rester maître de sa propre logique de traçabilité gouvernée.

## Intégrations externes

Le domaine `audit` ne doit pas parler directement aux systèmes externes comme source de vérité principale.

Les exportations éventuelles vers :

- systèmes d’archivage externes
- coffres de preuves externes
- outils de conformité externes

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `audit` reste la source de vérité interne des traces d’audit structurées du socle.

## Données sensibles / sécurité

Le domaine `audit` manipule des données hautement sensibles.

Points de vigilance :

- contrôle strict des droits de lecture
- immutabilité logique ou garanties fortes contre l’altération non autorisée
- séparation nette entre audit, observabilité et logs techniques
- limitation des détails exposés selon le rôle, le scope et la sensibilité
- protection renforcée des actions et objets audités

## Observability / audit

### Observability

Le domaine doit permettre de comprendre :

- quelle action ou changement a été tracé
- quel acteur a été retenu
- sur quelle ressource ou quel périmètre la trace s’applique
- à quel moment la trace a été enregistrée
- si une information manque à cause d’une politique de rétention, d’un scope ou d’une exposition limitée

### Audit

Le domaine `audit` est précisément responsable de la lecture gouvernée des traces sensibles.

Il doit permettre de conserver et consulter, selon les règles retenues, les éléments nécessaires à l’investigation ou à la justification d’actions sensibles.

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `AuditEntry` : entrée d’audit structurée
- `AuditActorRef` : référence vers l’acteur à l’origine de l’action
- `AuditResourceRef` : référence vers la ressource ou le périmètre concerné
- `AuditActionType` : type d’action auditée
- `AuditScope` : périmètre d’application ou de lecture de la trace
- `AuditPolicy` : règle de traçabilité applicable

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une entrée d’audit possède un type d’action explicite
- une entrée d’audit est rattachée à un acteur explicite lorsque cela est possible
- `audit` ne se confond pas avec `observability`
- `audit` ne se confond pas avec `monitoring`
- `audit` ne se confond pas avec les logs techniques bruts
- les traces d’audit ne doivent pas redéfinir de manière divergente la vérité des domaines source
- les autres couches ne doivent pas recréer librement des journaux d’audit divergents quand une lecture commune d’audit existe

## Cas d’usage principaux

1. Tracer un changement de rôle ou de permission
2. Tracer un changement de capability ou de configuration sensible
3. Tracer une activation ou désactivation d’un feature flag sensible
4. Tracer certaines transitions métier critiques comme une annulation de commande ou un remboursement manuel
5. Consulter l’historique d’actions sensibles sur une ressource ou une boutique
6. Fournir aux équipes plateforme une base de preuve interne gouvernée

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- entrée d’audit introuvable
- type d’action auditée inconnu ou invalide
- ressource ou acteur non résolu dans le contexte courant
- capability auditTrail désactivée
- permission ou scope insuffisant
- tentative d’exposition d’une trace trop sensible dans un contexte non autorisé

## Décisions d’architecture

Les choix structurants du domaine sont :

- `audit` porte la traçabilité sensible et gouvernée du socle
- `audit` est distinct de `observability`
- `audit` est distinct de `monitoring`
- `audit` est distinct de `domain-events`
- `audit` consomme les actions et changements sensibles des domaines source au lieu de redéfinir leurs vérités métier ou techniques
- les expositions plateforme et boutique restent strictement distinctes
- les traces d’audit sensibles doivent être contrôlées, durables, auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la traçabilité sensible relève de `audit`
- l’explicabilité et la corrélation relèvent de `observability`
- la supervision technique relève de `monitoring`
- les événements internes relèvent de `domain-events`
- les providers externes relèvent de `integrations`
- `audit` ne remplace ni `observability`, ni `monitoring`, ni `domain-events`, ni `integrations`
