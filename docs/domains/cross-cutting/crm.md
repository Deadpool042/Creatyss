# Domaine crm

## Rôle

Le domaine `crm` porte la relation client enrichie du socle.

Il structure la connaissance relationnelle et commerciale d’un client au-delà du simple compte technique et au-delà du strict minimum nécessaire à la commande, sans absorber le domaine `customers`, le support, les campagnes marketing, les remises ou le tracking.

## Responsabilités

Le domaine `crm` prend en charge :

- les segments relationnels
- les tags client
- les notes internes liées à un client
- la lecture enrichie de la relation client
- certains états ou indicateurs relationnels utiles à l’exploitation commerciale
- la base relationnelle exploitable par le support, le marketing, la conversion et l’admin boutique

## Ce que le domaine ne doit pas faire

Le domaine `crm` ne doit pas :

- porter le compte technique, qui relève de `users`
- porter le client métier de base, qui relève de `customers`
- porter les tickets et conversations support, qui relèvent de `support`
- porter les campagnes marketing, qui relèvent de `marketing`
- porter les remises et coupons, qui relèvent de `discounts`
- porter le tracking comportemental, qui relève de `tracking`, `behavior`, `analytics` et `attribution`
- devenir un fourre-tout de données client sans responsabilité claire

Le domaine `crm` porte la relation client enrichie. Il ne remplace ni `customers`, ni `support`, ni `marketing`, ni `analytics`.

## Sous-domaines

- `segments` : segments relationnels ou commerciaux
- `tags` : tags client explicites
- `notes` : notes internes liées au client

## Entrées

Le domaine reçoit principalement :

- une référence client issue de `customers`
- des créations ou mises à jour de segments
- des créations ou mises à jour de tags client
- des notes internes ajoutées par des utilisateurs autorisés
- des demandes de lecture enrichie d’un client
- certains signaux métier internes exploitables venant d’autres domaines, sans les absorber

## Sorties

Le domaine expose principalement :

- une lecture CRM enrichie d’un client
- des segments client
- des tags client
- des notes internes
- une vue exploitable par `marketing`, `conversion`, `support`, `newsletter`, `analytics` et l’admin

## Dépendances vers autres domaines

Le domaine `crm` peut dépendre de :

- `customers` pour le client métier de référence
- `orders` pour certaines lectures relationnelles ou commerciales utiles au contexte CRM
- `returns` pour certains signaux relationnels si nécessaire
- `store` pour le contexte boutique
- `audit` pour tracer les changements sensibles
- `observability` pour expliquer certaines classifications ou enrichissements relationnels

Les domaines suivants peuvent dépendre de `crm` :

- `marketing`
- `conversion`
- `newsletter`
- `support`
- `analytics`
- `dashboarding`

## Capabilities activables liées

Le domaine `crm` est directement lié à :

- `crm`
- `marketingCampaigns`
- `conversionFlows`
- `newsletter`

### Effet si `crm` est activée

Le domaine devient pleinement exploitable pour enrichir la relation client au-delà du socle minimal de `customers`.

### Effet si `crm` est désactivée

Le domaine reste structurellement présent, mais aucun enrichissement CRM avancé ne doit être piloté côté boutique.

### Effet si `marketingCampaigns`, `conversionFlows` ou `newsletter` est activée

Les domaines consommateurs peuvent exploiter plus finement les segments, tags et notes CRM, sans que `crm` absorbe leur responsabilité.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `customer_support`
- `marketing_manager`
- éventuellement `order_manager` en lecture partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `crm.read`
- `crm.write`
- `customers.read`
- `orders.read`
- `newsletter.read`
- `marketing.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `crm.segment.created`
- `crm.segment.updated`
- `crm.customer.segment.changed`
- `crm.customer.tagged`
- `crm.customer.note.created`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `customer.created`
- `customer.updated`
- `order.created`
- `return.accepted`
- `newsletter.subscribed`
- `store.capabilities.updated`

Il doit toutefois rester maître de sa propre vue relationnelle enrichie.

## Intégrations externes

Le domaine `crm` ne doit pas parler directement aux systèmes externes.

Les synchronisations ou échanges avec :

- outils CRM externes
- plateformes marketing
- systèmes de support externes

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `crm` reste la source de vérité interne de l’enrichissement relationnel du socle.

## Données sensibles / sécurité

Le domaine `crm` porte des données relationnelles sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre données CRM, données de compte et données métier minimales client
- protection des notes internes
- audit des changements sensibles de segmentation ou d’enrichissement
- limitation de l’exposition selon le rôle et le scope

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un client appartient à un segment donné
- pourquoi un tag a été appliqué ou retiré
- quel événement ou quelle règle a enrichi la vue CRM
- si une donnée CRM n’est pas disponible à cause d’une capability off, d’un flux absent ou d’une règle métier

### Audit

Il faut tracer :

- la création ou modification d’un segment
- les changements de tags client
- la création de notes internes sensibles
- les interventions manuelles importantes sur la relation client enrichie

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `CustomerCrmProfile` : vue CRM enrichie d’un client
- `CrmSegment` : segment relationnel ou commercial
- `CrmTag` : tag client explicite
- `CrmNote` : note interne liée à un client
- `CustomerCrmAssignment` : rattachement d’un client à des segments ou tags CRM

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une donnée CRM est rattachée explicitement à un client métier valide
- `crm` ne se confond pas avec `customers`
- `crm` ne se confond pas avec `support`, `marketing` ou `analytics`
- les notes internes restent internes et protégées selon les permissions
- les autres domaines ne doivent pas recréer leur propre vérité divergente de la relation client enrichie

## Cas d’usage principaux

1. Segmenter des clients selon des critères métier explicites
2. Taguer un client pour un usage relationnel ou commercial
3. Ajouter une note interne sur un client
4. Lire une fiche CRM enrichie d’un client
5. Fournir à `marketing`, `conversion`, `newsletter` et `support` une lecture relationnelle enrichie
6. Exploiter la relation client enrichie dans l’admin boutique

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- client introuvable
- segment introuvable
- tag invalide
- note interdite ou non autorisée
- capability crm désactivée
- conflit de classification relationnelle selon la politique retenue

## Décisions d’architecture

Les choix structurants du domaine sont :

- `crm` porte la relation client enrichie du socle
- `crm` est distinct de `customers`
- `crm` est distinct de `support`
- `crm` est distinct de `marketing`
- `crm` est distinct de `analytics`
- les domaines consommateurs exploitent la vue CRM, sans que `crm` absorbe leurs responsabilités propres
- les enrichissements relationnels sensibles doivent être auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la relation client enrichie relève de `crm`
- le client métier de base relève de `customers`
- les tickets et conversations support relèvent de `support`
- les campagnes relèvent de `marketing`
- `crm` ne remplace ni `customers`, ni `support`, ni `marketing`, ni `analytics`, ni `integrations`
