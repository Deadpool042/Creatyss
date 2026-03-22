# Plateforme vs administration boutique

## Objectif

Ce document fixe la séparation entre :

- l’espace technique plateforme
- l’espace d’administration métier boutique

Cette séparation est structurante pour le socle.
Elle garantit :

- une administration boutique simple pour l’exploitant métier
- une gouvernance technique avancée pour le créateur / mainteneur du socle
- une réduction du risque fonctionnel et de la complexité exposée
- une architecture réutilisable sur plusieurs boutiques

## Principe fondamental

Le socle ne doit pas exposer le même plan d’administration à tous les profils.

Il existe deux couches distinctes :

### 1. Administration plateforme

Pilotée par les rôles techniques plateforme.

Elle concerne :

- la structure du socle
- les capabilities profondes
- les intégrations
- la supervision
- la sécurité
- la gouvernance transverse

### 2. Administration boutique

Pilotée par les rôles métier de la boutique.

Elle concerne :

- l’exploitation commerciale
- le contenu
- le catalogue
- les commandes
- les clients
- les campagnes autorisées
- les événements autorisés

## Pourquoi cette séparation est obligatoire

Sans cette séparation :

- l’admin boutique devient trop complexe
- l’exploitant métier est exposé à des réglages dangereux
- la gouvernance technique devient fragile
- la réutilisation du socle entre boutiques devient confuse
- les responsabilités se mélangent

Le modèle cible doit permettre à une boutique d’être exploitée sans accès aux mécanismes techniques profonds du socle.

## Administration plateforme

## Rôle

L’administration plateforme pilote la configuration profonde et transverse du socle.

Elle est réservée à des profils comme :

- `platform_owner`
- `platform_engineer`

## Responsabilités plateforme

### Gouvernance du socle

- activation et désactivation des capabilities
- configuration multi-boutiques
- gestion des règles de plateforme
- configuration des domaines transverses

### Sécurité et contrôle d’accès

- gestion des rôles globaux
- gestion des permissions fines
- gestion des accès sensibles
- gouvernance des scopes

### Supervision

- observability métier
- observability technique
- monitoring
- alertes
- lecture des audits

### Intégrations

- ERP
- EBP
- Chorus Pro
- Google Shopping
- Meta Catalog
- pixels / tracking providers
- providers email
- webhooks
- API clients

### Gouvernance runtime

- feature flags
- jobs
- scheduling global
- workflow / approval sensibles
- publication automatisée
- diffusion sociale automatique

### Configuration avancée boutique

- devises supportées
- langues supportées
- pays supportés
- transporteurs disponibles
- capabilities activées par boutique

## Ce que l’administration plateforme doit voir

L’espace plateforme doit permettre au minimum de voir et piloter :

- boutiques existantes
- capabilities par boutique
- intégrations configurées
- statuts de synchronisation
- jobs en erreur
- événements techniques et métier structurés
- monitoring / health
- audit trail
- rôles / permissions
- webhooks / API clients
- analytics de supervision si nécessaire

## Administration boutique

## Rôle

L’administration boutique pilote l’exploitation quotidienne d’une boutique donnée.

Elle est réservée à des profils comme :

- `store_owner`
- `store_manager`
- `catalog_manager`
- `content_editor`
- `order_manager`
- `customer_support`
- `marketing_manager`
- `observer`

## Responsabilités boutique

### Catalogue

- produits
- variantes
- catégories
- médias liés au catalogue
- publication catalogue autorisée

### Contenu

- pages
- blog
- contenus éditoriaux
- mise en avant visible en boutique

### Commerce

- commandes
- retours
- clients
- newsletters autorisées
- événements publics autorisés
- social publishing si autorisé par capability et permission

### Marketing exploitable

- campagnes autorisées
- promotions autorisées
- recommandations ou SEO exploitables si activés
- analytics métier accessibles selon rôle

## Ce que l’administration boutique ne doit pas piloter

Par défaut, l’espace boutique ne doit pas permettre de modifier :

- les capabilities profondes
- les intégrations sensibles
- les rôles globaux de plateforme
- les permissions globales
- le monitoring technique
- l’observability technique avancée
- les webhooks globaux
- les API clients
- les réglages de sécurité plateforme

## Cas cible concret

### Créateur / mainteneur du socle

Le créateur du socle doit disposer d’un espace permettant :

- de voir toutes les boutiques
- d’activer ou désactiver les capabilities
- de piloter les intégrations
- de superviser le runtime
- de lire l’audit
- de gérer rôles et permissions
- de corriger ou désactiver des flux sensibles

### Exploitante métier d’une boutique

L’exploitante métier doit disposer d’un espace permettant :

- de gérer son catalogue
- de gérer son contenu
- de gérer ses commandes
- de gérer ses clients
- de gérer ses campagnes autorisées
- de publier des événements publics autorisés
- de lancer des newsletters autorisées

Sans exposition à :

- la configuration technique profonde
- la supervision technique détaillée
- les intégrations sensibles
- les permissions globales

## Effet des capabilities sur les deux espaces

Une capability active n’implique pas automatiquement que l’espace boutique peut l’administrer librement.

Il faut distinguer :

- capability activée au niveau boutique
- permission d’utiliser la fonctionnalité
- droit d’administration de la fonctionnalité

Exemple :

- `googleShopping = true`
- l’espace boutique peut éventuellement voir un statut de diffusion
- mais l’espace plateforme reste responsable du paramétrage technique de l’intégration

Autre exemple :

- `newsletter = true`
- le marketing manager peut gérer des campagnes autorisées
- mais la configuration profonde du provider email reste plateforme

## Règles de conception UI/Admin

### Espace boutique

Doit être :

- simple
- lisible
- peu chargé techniquement
- orienté tâches métier
- explicite sur les erreurs
- protégé contre les réglages dangereux

### Espace plateforme

Doit être :

- plus complet
- plus structuré techniquement
- orienté gouvernance, exploitation, supervision et configuration
- capable de piloter plusieurs boutiques

## Matrice d’exposition simplifiée

### Visible côté plateforme

- capabilities
- intégrations
- monitoring
- observability
- audit
- rôles globaux
- permissions
- feature flags
- webhooks
- api-clients
- jobs
- scheduling global
- workflow/approval sensibles

### Visible côté boutique

- catalogue
- contenu
- commandes
- clients
- campagnes autorisées
- événements autorisés
- newsletters autorisées
- analytics métier autorisées
- statuts simples utiles à l’exploitation

## Invariants

- l’admin boutique ne doit pas devenir un cockpit technique
- l’espace plateforme doit pouvoir piloter toutes les boutiques
- les capabilities profondes sont décidées côté plateforme
- les intégrations sensibles sont gouvernées côté plateforme
- la boutique n’exploite que ce qui lui est autorisé
- les actions critiques restent auditables

## Décisions closes

- l’espace technique plateforme et l’espace boutique sont distincts
- le créateur du socle dispose d’un accès de gouvernance transverse
- l’exploitant boutique dispose d’un accès métier ciblé
- une capability active ne donne pas automatiquement tous les droits d’administration associés
- la configuration sensible des intégrations reste côté plateforme
- la supervision technique détaillée reste côté plateforme
