# Domaine gift-cards

## Rôle

Le domaine `gift-cards` porte les cartes cadeaux structurées du socle.

Il organise les cartes cadeaux, leurs émissions, activations, soldes, consommations, expirations et statuts métier, sans absorber le paiement, la politique de prix, les remises générales, les exportations, ni les providers externes spécialisés.

## Responsabilités

Le domaine `gift-cards` prend en charge :

- les cartes cadeaux structurées
- l’émission d’une carte cadeau
- l’activation ou la désactivation d’une carte cadeau
- le solde d’une carte cadeau
- l’utilisation totale ou partielle d’une carte cadeau
- l’expiration ou l’invalidation d’une carte cadeau
- la lecture gouvernée de l’état d’une carte cadeau ou d’un historique d’usage
- la base gift card consommable par `checkout`, `payments`, `orders`, `customers`, `dashboarding`, `observability` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `gift-cards` ne doit pas :

- porter les paiements globaux, qui relèvent de `payments`
- porter la commande durable, qui relève de `orders`
- porter le pricing général du catalogue, qui relève de `pricing`
- porter les remises, coupons ou promotions générales, qui relèvent de `discounts`
- porter les documents métier durables, qui relèvent de `documents`
- porter les providers externes spécialisés, qui relèvent de `integrations`
- devenir un simple champ monétaire sur un client ou une commande sans langage métier explicite

Le domaine `gift-cards` porte les cartes cadeaux comme objet métier spécifique. Il ne remplace ni `payments`, ni `orders`, ni `pricing`, ni `discounts`, ni `integrations`.

## Sous-domaines

- `issuance` : émission et activation des cartes cadeaux
- `balance` : solde disponible et mouvements de solde
- `redemption` : consommation totale ou partielle de la carte cadeau
- `status` : états métier de la carte cadeau
- `policies` : règles d’émission, d’usage, d’expiration ou d’exposition des cartes cadeaux

## Entrées

Le domaine reçoit principalement :

- des demandes d’émission de carte cadeau
- des demandes d’activation, désactivation, invalidation ou expiration
- des demandes d’utilisation partielle ou totale d’une carte cadeau
- des demandes de lecture d’une carte cadeau, de son solde ou de son historique d’usage
- des contextes de boutique, acteur, commande, checkout, client, devise ou canal d’exposition
- des signaux internes utiles à la mise à jour d’état, d’expiration ou de consommation

## Sorties

Le domaine expose principalement :

- des cartes cadeaux structurées
- des soldes et mouvements de cartes cadeaux
- des statuts métier de cartes cadeaux
- des lectures exploitables par `checkout`, `payments`, `orders`, `customers`, `dashboarding`, `observability` et certaines couches d’administration
- des structures de gift card prêtes à être consommées par les domaines opérationnels autorisés

## Dépendances vers autres domaines

Le domaine `gift-cards` peut dépendre de :

- `payments` pour certaines coordinations de paiement sans absorber sa responsabilité
- `orders` pour certains contextes d’achat ou d’usage de carte cadeau
- `customers` pour certains rattachements de bénéficiaire ou d’acheteur si le modèle retenu le prévoit
- `checkout` pour certains usages de consommation au moment de l’achat
- `email` ou `notifications` pour certaines communications liées à l’émission ou à l’usage sans absorber leur responsabilité
- `audit` pour tracer certaines émissions, invalidations ou consommations sensibles
- `observability` pour expliquer pourquoi une carte cadeau est active, expirée, invalide, bloquée ou partiellement consommée
- `store` pour le contexte boutique, devise ou politiques locales

Les domaines suivants peuvent dépendre de `gift-cards` :

- `checkout`
- `payments`
- `orders`
- `customers`
- `dashboarding`
- `analytics`
- certaines couches storefront et d’administration

## Capabilities activables liées

Le domaine `gift-cards` est directement ou indirectement lié à :

- `giftCards`
- `notifications`
- `multiCurrency`

### Effet si `giftCards` est activée

Le domaine devient pleinement exploitable pour émettre, suivre et consommer des cartes cadeaux structurées.

### Effet si `giftCards` est désactivée

Le domaine reste structurellement présent, mais aucune carte cadeau non indispensable ne doit être exposée côté boutique.

### Effet si `notifications` est activée

Le domaine peut être davantage consommé pour informer des émissions, activations ou usages, sans absorber la responsabilité de `notifications`.

### Effet si `multiCurrency` est activée

Le domaine doit expliciter plus finement les règles de devise, de solde et d’usage applicables aux cartes cadeaux.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `customer_support` en lecture ou action partielle selon la politique retenue
- `customer` pour ses propres cartes cadeaux selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `gift_cards.read`
- `gift_cards.write`
- `orders.read`
- `payments.read`
- `customers.read`
- `notifications.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `gift_card.issued`
- `gift_card.activated`
- `gift_card.deactivated`
- `gift_card.redeemed`
- `gift_card.partially_redeemed`
- `gift_card.expired`
- `gift_card.invalidated`
- `gift_card.balance.changed`
- `gift_card.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `order.created`
- `payment.captured`
- `checkout.readiness.changed`
- `customer.created`
- `store.capabilities.updated`
- certaines actions administratives structurées d’émission, d’activation, d’invalidation ou de consommation

Il doit toutefois rester maître de sa propre logique de carte cadeau.

## Intégrations externes

Le domaine `gift-cards` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être appuyé par `integrations` vers certains systèmes externes spécialisés, mais :

- la vérité des cartes cadeaux internes reste dans `gift-cards`
- les DTO providers externes restent dans `integrations`
- les décisions et soldes métier internes restent exprimés dans le langage du socle

## Données sensibles / sécurité

Le domaine `gift-cards` manipule des valeurs monétaires ou quasi-monétaires sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre émission, solde, consommation et invalidation
- protection des identifiants, codes ou secrets d’usage sensibles selon le modèle retenu
- limitation de l’exposition selon le rôle, le scope et le besoin métier
- audit des émissions, consommations, invalidations et consultations sensibles

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelle carte cadeau est en vigueur
- quel statut et quel solde sont appliqués
- pourquoi une carte cadeau est active, expirée, invalide, bloquée ou partiellement consommée
- quel événement ou quelle opération a modifié son solde ou son statut
- si une utilisation échoue à cause d’un solde insuffisant, d’une expiration, d’une devise incompatible, d’une capability off ou d’une règle applicable

### Audit

Il faut tracer :

- l’émission d’une carte cadeau sensible
- l’activation, l’invalidation ou l’expiration d’une carte cadeau
- les consommations totales ou partielles sensibles
- certaines consultations sensibles si le modèle final les retient explicitement
- certaines modifications manuelles importantes des politiques d’émission, d’usage ou d’expiration

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `GiftCard` : carte cadeau structurée
- `GiftCardBalance` : solde courant de la carte cadeau
- `GiftCardTransaction` : mouvement de solde ou d’usage
- `GiftCardStatus` : état métier de la carte cadeau
- `GiftCardPolicy` : règle d’émission, d’usage ou d’expiration
- `GiftCardOwnerRef` : référence vers l’acheteur, le bénéficiaire ou le détenteur selon le modèle retenu
- `GiftCardSubjectRef` : référence vers la commande ou l’opération liée

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une carte cadeau possède un identifiant stable, un statut explicite et un solde explicite
- une consommation de carte cadeau est rattachée à une carte cadeau explicite et à un contexte d’usage explicite
- `gift-cards` ne se confond pas avec `payments`
- `gift-cards` ne se confond pas avec `orders`
- `gift-cards` ne se confond pas avec `pricing`
- `gift-cards` ne se confond pas avec `discounts`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de carte cadeau quand le cadre commun `gift-cards` existe
- une carte cadeau expirée, invalide ou sans solde disponible ne doit pas être consommable hors règle explicite

## Cas d’usage principaux

1. Émettre une carte cadeau achetée en boutique
2. Activer ou invalider une carte cadeau
3. Consommer totalement ou partiellement une carte cadeau au checkout
4. Consulter le solde et l’historique d’usage d’une carte cadeau
5. Fournir à `checkout`, `payments` ou `orders` une lecture fiable de l’état de la carte cadeau
6. Exposer à l’admin une lecture claire des cartes cadeaux, soldes, usages et statuts disponibles

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- carte cadeau introuvable
- solde insuffisant
- carte cadeau expirée ou invalide
- devise incompatible selon la politique retenue
- tentative de consommation non autorisée
- permission ou scope insuffisant
- conflit entre plusieurs règles d’émission, d’usage ou d’expiration

## Décisions d’architecture

Les choix structurants du domaine sont :

- `gift-cards` porte les cartes cadeaux structurées du socle
- `gift-cards` est distinct de `payments`
- `gift-cards` est distinct de `orders`
- `gift-cards` est distinct de `pricing`
- `gift-cards` est distinct de `discounts`
- les domaines consommateurs lisent la vérité des cartes cadeaux via `gift-cards`, sans la recréer localement
- les soldes, usages, invalidations et politiques sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les cartes cadeaux structurées relèvent de `gift-cards`
- les paiements relèvent de `payments`
- les commandes relèvent de `orders`
- le pricing relève de `pricing`
- les remises relèvent de `discounts`
- `gift-cards` ne remplace ni `payments`, ni `orders`, ni `pricing`, ni `discounts`, ni `integrations`, ni `notifications`
