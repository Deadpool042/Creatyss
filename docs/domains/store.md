# Domaine store

## Rôle

Le domaine `store` porte le profil de boutique et la configuration globale qui pilotent le comportement du socle pour une boutique donnée.

Il constitue le point d’entrée de la configuration transverse métier et plateforme.

## Responsabilités

Le domaine `store` prend en charge :

- l’identité fonctionnelle d’une boutique
- le code boutique
- la devise par défaut
- les pays supportés
- les langues supportées
- les capabilities activées
- les paramètres commerce globaux de la boutique
- la distinction entre configuration structurelle et usage métier
- la configuration transverse utilisée par les autres domaines

## Ce que le domaine ne doit pas faire

Le domaine `store` ne doit pas :

- porter le catalogue produit
- porter la logique panier
- porter la logique de pricing détaillée
- porter la fiscalité détaillée
- porter les règles de shipping détaillées
- porter les permissions elles-mêmes
- porter les intégrations externes elles-mêmes
- devenir un fourre-tout de settings sans structure métier

Il définit le contexte de boutique, mais il ne remplace pas les domaines spécialisés.

## Sous-domaines

- `profile` : identité et paramètres principaux de la boutique
- `capabilities` : capabilities activables par boutique
- `locale` : langues, pays, formats et paramètres de contexte local
- `currency` : devise par défaut et devises supportées

## Entrées

Le domaine reçoit principalement :

- des commandes de configuration plateforme
- des lectures de configuration par les autres domaines
- des activations ou désactivations de capabilities
- des demandes de lecture du profil boutique courant

## Sorties

Le domaine expose principalement :

- le profil de boutique
- les capabilities activées
- la devise par défaut
- les devises supportées
- les pays supportés
- les langues supportées
- les paramètres globaux nécessaires aux autres domaines

## Dépendances vers autres domaines

Le domaine `store` doit rester faiblement couplé.

Il peut dépendre de :

- `feature-flags` pour certains comportements techniques si le modèle le nécessite
- `audit` pour tracer les modifications sensibles
- `observability` pour exposer certains changements structurants
- `roles` et `permissions` pour contrôler qui peut administrer la configuration

Les autres domaines dépendent souvent de `store`, mais l’inverse doit rester limité.

## Capabilities activables liées

Le domaine `store` porte justement les capabilities globales.

Exemples de capabilities directement pilotées ici :

- `guestCheckout`
- `customerCheckout`
- `professionalCustomers`
- `multiCurrency`
- `multiCarrier`
- `pickupPointDelivery`
- `discounts`
- `couponCodes`
- `taxation`
- `exciseTax`
- `productChannels`
- `googleShopping`
- `marketingCampaigns`
- `tracking`
- `analytics`
- `notifications`
- `newsletter`
- `publicEvents`
- `socialPublishing`
- `erpIntegration`
- `electronicInvoicing`

### Effet si une capability est activée

Le domaine rend la fonctionnalité disponible pour la boutique et les autres domaines peuvent l’exploiter.

### Effet si une capability est désactivée

Le domaine conserve la structure du socle, mais la fonctionnalité concernée doit rester neutre, masquée ou inactive pour la boutique.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`

Les rôles boutique ne doivent pas administrer par défaut les capabilities profondes.

### Permissions

Exemples de permissions concernées :

- `store.settings.read`
- `store.settings.write`
- `capabilities.read`
- `capabilities.write`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `store.updated`
- `store.capabilities.updated`
- `store.currency.updated`
- `store.locale.updated`

## Événements consommés

Le domaine `store` n’a pas vocation à consommer beaucoup d’événements métier externes.

Il peut éventuellement consommer :

- des événements techniques ou d’administration liés à la gouvernance plateforme

Mais il ne doit pas dépendre fortement d’événements venant des domaines commerce coeur.

## Intégrations externes

Le domaine `store` ne porte pas directement les intégrations externes.

Il peut en revanche porter la configuration transversale qui conditionne leur activation.

Exemples :

- activation Google Shopping
- activation Chorus Pro
- activation EBP
- activation tracking providers

L’appel réel aux systèmes externes appartient à `integrations`.

## Données sensibles / sécurité

Le domaine `store` manipule des données sensibles au sens gouvernance, car il pilote le comportement global d’une boutique.

Points de vigilance :

- contrôle strict des droits d’écriture
- audit obligatoire des changements sensibles
- protection des activations profondes
- séparation nette entre lecture métier et administration technique

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelle boutique a quelle configuration active
- quand une capability a changé
- quelle configuration transverse était en vigueur lors d’un comportement donné

### Audit

Il faut tracer :

- qui a modifié la configuration
- quelles capabilities ont changé
- quand la modification a été faite
- sur quelle boutique

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `StoreProfile` : profil global de boutique
- `StoreCapabilities` : ensemble des capabilities activées
- `StoreLocaleSettings` : langues, pays, formats
- `StoreCurrencySettings` : devise par défaut et devises supportées

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une boutique possède un profil unique stable
- une boutique possède une devise par défaut explicite
- les capabilities sont explicites, jamais implicites
- une capability désactivée ne doit pas laisser de comportement actif incohérent
- la configuration sensible est administrée côté plateforme
- les autres domaines ne doivent pas inventer leur propre lecture de la configuration boutique

## Cas d’usage principaux

1. Lire le profil complet d’une boutique
2. Lire les capabilities actives d’une boutique
3. Modifier la devise par défaut d’une boutique
4. Modifier les langues ou pays supportés
5. Activer ou désactiver une capability pour une boutique
6. Exposer aux autres domaines le contexte de configuration courant

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- boutique introuvable
- devise par défaut invalide
- pays ou langue non supporté dans la configuration
- capability inconnue
- tentative d’activation non autorisée
- configuration incohérente entre capability et paramètres associés

## Décisions d’architecture

Les choix structurants du domaine sont :

- `store` est la source de vérité de la configuration boutique transverse
- `store` porte les capabilities globales
- `store` ne porte pas la logique détaillée des domaines spécialisés
- `store` est administré côté plateforme pour les réglages sensibles
- les autres domaines consomment la configuration `store` au lieu de la redéfinir localement

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la devise par défaut est portée par `store`
- les capabilities sont portées par `store`
- l’activation des capabilities profondes ne relève pas de l’admin boutique
- `store` ne remplace ni `pricing`, ni `shipping`, ni `taxation`, ni `integrations`
