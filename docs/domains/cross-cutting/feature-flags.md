# Domaine feature-flags

## Rôle

Le domaine `feature-flags` porte les activations progressives et les mécanismes de rollout technique du socle.

Il permet d’activer, désactiver ou exposer progressivement une implémentation, sans redéfinir pour autant les capacités métier structurelles de la boutique.

## Responsabilités

Le domaine `feature-flags` prend en charge :

- la définition des flags techniques ou fonctionnels de rollout
- l’activation progressive d’une implémentation
- la séparation entre fonctionnalité supportée et fonctionnalité effectivement exposée dans une version donnée
- le contrôle de déploiements progressifs
- la réduction du risque lors de l’introduction de nouvelles implémentations
- la gouvernance des activations temporaires ou expérimentales

## Ce que le domaine ne doit pas faire

Le domaine `feature-flags` ne doit pas :

- remplacer les capabilities métier portées par `stores`
- définir à lui seul la stratégie métier d’une boutique
- devenir un substitut à un découpage de domaines correct
- porter toute la configuration transverse du socle
- servir à masquer une architecture incomplète ou repoussée

Un feature flag pilote une implémentation ou un rollout, pas l’existence structurelle d’un domaine métier dans le socle.

## Sous-domaines

Le domaine peut rester simple au départ, avec :

- un référentiel de flags
- une lecture du statut d’activation
- une éventuelle portée par environnement, boutique ou cohorte selon la stratégie retenue

## Entrées

Le domaine reçoit principalement :

- des créations de flags
- des activations ou désactivations de flags
- des demandes de lecture de flags au runtime
- des besoins de pilotage progressif d’une implémentation

## Sorties

Le domaine expose principalement :

- le référentiel de feature flags
- leur état d’activation
- leur éventuel scope d’application
- leur lecture par le runtime au moment où une implémentation doit être choisie

## Dépendances vers autres domaines

Le domaine `feature-flags` peut dépendre de :

- `stores` si certains flags doivent être contextualisés par boutique
- `audit` pour tracer les changements sensibles
- `observability` pour comprendre quel flag était actif au moment d’un comportement donné
- `roles` et `permissions` pour restreindre qui peut administrer les flags

Les autres domaines peuvent dépendre de `feature-flags` pour choisir entre plusieurs implémentations d’un même comportement.

## Capabilities activables liées

Le domaine `feature-flags` est explicitement distinct des capabilities.

### Différence fondamentale

- **capability** : la boutique supporte effectivement une fonctionnalité métier
- **feature flag** : une implémentation donnée de cette fonctionnalité est activée, désactivée ou progressivement déployée

### Exemple correct

- `multiCurrency = true` dans `store.capabilities`
- `pricing_v2_enabled = false` dans `feature-flags`

Dans ce cas :

- la boutique supporte bien le multi-devises
- mais la nouvelle implémentation `pricing_v2` n’est pas encore activée

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`

Les rôles boutique ne doivent pas administrer librement les feature flags techniques du socle.

### Permissions

Exemples de permissions concernées :

- `feature_flags.read`
- `feature_flags.write`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `feature_flag.created`
- `feature_flag.updated`
- `feature_flag.enabled`
- `feature_flag.disabled`

## Événements consommés

Le domaine `feature-flags` n’a pas vocation à consommer beaucoup d’événements métier.

Il peut toutefois consommer certains événements d’administration ou d’approbation si la gouvernance retenue l’exige.

## Intégrations externes

Le domaine `feature-flags` ne doit pas dépendre d’un provider externe comme source de vérité principale.

Si une synchronisation ou un pilotage externe existe un jour, cela devra passer par :

- `integrations`
- et éventuellement `jobs`

La vérité interne du rollout reste portée par le socle.

## Données sensibles / sécurité

Le domaine `feature-flags` manipule des données sensibles de gouvernance technique.

Points de vigilance :

- écriture réservée à des rôles très restreints
- audit obligatoire des activations critiques
- protection des flags impactant production, intégrations ou sécurité
- prévention des activations implicites non tracées

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel flag était actif au moment d’un comportement donné
- pourquoi une implémentation A a été choisie au lieu d’une implémentation B
- si un comportement inhabituel est lié à un rollout actif

### Audit

Il faut tracer :

- la création d’un flag
- l’activation ou désactivation d’un flag
- les changements de portée d’un flag
- les changements sensibles affectant le rollout d’une implémentation

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `FeatureFlagDefinition` : définition d’un flag
- `FeatureFlagState` : état d’activation du flag
- `FeatureFlagScope` : portée éventuelle d’un flag

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un feature flag possède un identifiant stable et explicite
- un feature flag n’est pas une capability
- un feature flag n’est pas un rôle ou une permission
- un feature flag ne doit pas servir à compenser une architecture métier incorrecte
- le runtime doit pouvoir expliquer quel flag a influencé un comportement quand c’est nécessaire

## Cas d’usage principaux

1. Déployer progressivement une nouvelle implémentation
2. Désactiver rapidement une implémentation problématique
3. Tester un comportement en environnement contrôlé
4. Choisir entre deux implémentations compatibles d’un même service métier
5. Réduire le risque d’un déploiement sur plusieurs boutiques

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- flag introuvable
- flag invalide
- activation non autorisée
- conflit entre flags incompatibles
- usage d’un flag pour piloter une capability métier qui devrait relever de `stores`

## Décisions d’architecture

Les choix structurants du domaine sont :

- `feature-flags` est distinct de `store.capabilities`
- `feature-flags` pilote le rollout d’implémentations, pas la structure métier du socle
- les flags sont administrés côté plateforme
- les activations sensibles doivent être auditables
- les autres domaines peuvent consulter les flags, sans leur déléguer leur responsabilité métier

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- un feature flag est distinct d’une capability
- `feature-flags` ne remplace pas `stores`
- les flags servent au pilotage technique ou progressif, pas à repousser l’architecture
- la gouvernance des feature flags est une responsabilité plateforme sensible
