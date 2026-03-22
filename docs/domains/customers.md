# Domaine customers

## Rôle

Le domaine `customers` porte les clients métier du socle.

Il représente la lecture commerciale et relationnelle d’un client dans une boutique ou dans le contexte global de la plateforme, indépendamment des mécanismes techniques d’authentification ou des simples comptes d’accès.

## Responsabilités

Le domaine `customers` prend en charge :

- l’identité métier du client
- la distinction particulier / professionnel
- les groupes client
- les profils de pricing liés au client
- les informations commerciales utiles au parcours e-commerce
- le contexte client consommé par `pricing`, `discounts`, `sales-policy`, `checkout` et `orders`
- les données relationnelles utiles au commerce, sans empiéter sur `crm`

## Ce que le domaine ne doit pas faire

Le domaine `customers` ne doit pas :

- porter les comptes techniques et la sécurité d’accès, qui relèvent de `users`
- porter les rôles et permissions d’administration, qui relèvent de `roles` et `permissions`
- porter l’intégralité de la logique CRM, qui relève de `crm`
- porter les calculs de prix, de taxes ou de remises, qui relèvent de `pricing`, `taxation` et `discounts`
- devenir un fourre-tout regroupant toutes les informations possibles sur une personne

Le domaine `customers` porte le client métier, pas tous les usages possibles d’un profil humain ou d’un compte technique.

## Sous-domaines

- `profile` : identité métier du client
- `groups` : groupes ou segments tarifaires / commerciaux explicites
- `pricing-profile` : informations utiles à la personnalisation commerciale et au pricing

## Entrées

Le domaine reçoit principalement :

- des créations ou mises à jour de clients métier
- des changements de type de client
- des rattachements à des groupes client
- des demandes de lecture de contexte client pour le pricing, le checkout, les commandes et la politique de vente

## Sorties

Le domaine expose principalement :

- un profil client métier
- un type de client (`individual` / `professional`)
- des groupes client éventuels
- un profil commercial exploitable par d’autres domaines
- un contexte client lisible par les domaines de vente, pricing et checkout

## Dépendances vers autres domaines

Le domaine `customers` peut dépendre de :

- `users` pour certains liens techniques entre compte et client métier
- `audit` pour tracer les changements sensibles
- `observability` pour diagnostiquer certains comportements liés au client

Les domaines suivants peuvent dépendre de `customers` :

- `cart`
- `discounts`
- `pricing`
- `sales-policy`
- `checkout`
- `orders`
- `crm`
- `documents`

## Capabilities activables liées

Les capabilities les plus liées à `customers` sont :

- `professionalCustomers`
- `customerSpecificPricing`
- `customerGroupPricing`
- `crm`

### Effet si `professionalCustomers` est activée

Le domaine doit supporter explicitement les clients professionnels.

### Effet si `professionalCustomers` est désactivée

Le modèle reste structuré, mais seuls les clients particuliers sont effectivement exploitables côté boutique.

### Effet si `customerSpecificPricing` est activée

Le client peut porter des paramètres utiles à des remises ou pricing individualisés.

### Effet si `customerGroupPricing` est activée

Le rattachement à des groupes client influence les domaines `discounts` et `pricing`.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `customer_support`
- éventuellement `marketing_manager` en lecture selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `customers.read`
- `customers.write`
- `crm.read`
- `crm.write`
- `orders.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `customer.created`
- `customer.updated`
- `customer.group.changed`
- `customer.kind.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `user.created` si le lien compte → client métier est modélisé ainsi
- `order.created` pour enrichir certains états client si la stratégie métier le prévoit

Il doit toutefois rester maître de son propre langage métier.

## Intégrations externes

Le domaine `customers` ne parle pas directement aux systèmes externes.

Les synchronisations éventuelles vers :

- ERP
- EBP
- systèmes CRM externes
- outils marketing

relèvent de `integrations`.

Le domaine `customers` reste la source de vérité métier interne du client.

## Données sensibles / sécurité

Le domaine `customers` manipule des données sensibles liées à l’identité commerciale d’un client.

Points de vigilance :

- contrôle des droits de lecture et d’écriture
- séparation entre données techniques de compte et données métier client
- exposition minimale dans l’admin selon le rôle
- audit des modifications sensibles

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel profil client a été utilisé dans un calcul métier
- quel type de client a été retenu
- quel groupe client a été appliqué
- pourquoi une règle de pricing ou discount s’est appliquée ou non pour un client donné

### Audit

Il faut tracer :

- la création d’un client métier
- les changements de type (`individual` / `professional`)
- les changements de groupe client
- certaines modifications sensibles du profil commercial

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `CustomerProfile` : profil métier du client
- `CustomerKind` : type de client (`individual` ou `professional`)
- `CustomerGroup` : groupe client explicite
- `CustomerPricingProfile` : profil utilisé pour influencer pricing et remises

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un client métier possède un identifiant stable
- un client métier a un type explicite
- les groupes client sont explicites, jamais implicites
- le client métier ne se confond pas avec un simple compte technique
- les autres domaines lisent le contexte client via `customers` au lieu de redéfinir leur propre modèle client

## Cas d’usage principaux

1. Créer un client métier
2. Lire le profil métier d’un client
3. Déterminer si un client est particulier ou professionnel
4. Rattacher un client à un groupe commercial
5. Exposer un contexte client exploitable au pricing et au checkout
6. Permettre aux commandes et documents d’utiliser la bonne lecture du client

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- client introuvable
- type de client invalide
- groupe client inconnu
- tentative d’utiliser un profil professionnel alors que la capability associée est désactivée
- profil commercial incohérent avec les groupes ou règles configurées

## Décisions d’architecture

Les choix structurants du domaine sont :

- `customers` porte le client métier, distinct de `users`
- `customers` fournit le contexte client exploité par les autres domaines commerce
- `customers` ne porte ni la sécurité d’accès, ni les permissions admin
- les groupes et profils de pricing client sont explicites
- les synchronisations externes sur les clients passent par `integrations`

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- le client métier est distinct du compte technique
- le type de client est explicite
- les groupes client relèvent de `customers`
- le pricing client spécifique ne transforme pas `customers` en moteur de pricing
- `customers` ne remplace ni `crm`, ni `users`, ni `discounts`, ni `pricing`
