# Domaine loyalty

## Rôle

Le domaine `loyalty` porte la fidélisation structurée du socle.

Il organise les mécanismes de fidélité, comptes de fidélité, points, statuts, avantages, règles d’accumulation et de consommation au niveau métier, sans absorber les remises générales, le pricing global, les gift cards, les paiements ou les campagnes marketing elles-mêmes.

## Responsabilités

Le domaine `loyalty` prend en charge :

- les comptes de fidélité structurés
- les points ou unités de fidélité
- les statuts ou paliers de fidélité
- les règles d’accumulation de fidélité
- les règles d’utilisation ou de consommation des avantages fidélité
- les avantages liés à la fidélité lorsqu’ils relèvent du programme lui-même
- la lecture gouvernée de l’état de fidélité d’un client ou d’un compte
- la base loyalty consommable par `customers`, `checkout`, `orders`, `discounts`, `dashboarding`, `observability` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `loyalty` ne doit pas :

- porter les remises générales, qui relèvent de `discounts`
- porter le pricing global, qui relève de `pricing`
- porter les cartes cadeaux, qui relèvent de `gift-cards`
- porter les paiements, qui relèvent de `payments`
- porter les campagnes marketing, qui relèvent de `marketing`
- porter le CRM relationnel complet, qui relève de `crm`
- devenir un simple compteur numérique attaché au client sans langage métier explicite

Le domaine `loyalty` porte la fidélisation structurée du socle. Il ne remplace ni `discounts`, ni `pricing`, ni `gift-cards`, ni `payments`, ni `marketing`, ni `crm`.

## Sous-domaines

- `accounts` : comptes de fidélité structurés
- `points` : points, unités et mouvements de fidélité
- `tiers` : statuts, niveaux ou paliers de fidélité
- `benefits` : avantages portés par le programme de fidélité
- `policies` : règles d’éligibilité, d’accumulation, de consommation ou d’expiration de la fidélité

## Entrées

Le domaine reçoit principalement :

- des événements d’achat, d’activité ou de qualification issus de domaines autorisés
- des demandes de lecture du solde de fidélité, du statut ou de l’historique
- des demandes de consommation ou d’application d’un avantage fidélité
- des changements de règles, de paliers ou de programme de fidélité
- des contextes de boutique, client, commande, checkout, canal ou surface d’exposition
- des signaux internes utiles à l’accumulation, à l’expiration, à la consommation ou à la réévaluation d’un statut

## Sorties

Le domaine expose principalement :

- des comptes de fidélité structurés
- des soldes ou mouvements de points
- des statuts et avantages de fidélité
- des lectures exploitables par `customers`, `checkout`, `orders`, `discounts`, `dashboarding`, `observability` et certaines couches d’administration
- des structures loyalty prêtes à être consommées par les domaines opérationnels autorisés

## Dépendances vers autres domaines

Le domaine `loyalty` peut dépendre de :

- `customers` pour le rattachement principal du compte de fidélité
- `orders` pour certains événements d’accumulation ou d’éligibilité liés à l’achat
- `checkout` pour certains usages de consommation d’avantage au moment de la commande
- `discounts` pour articuler certains bénéfices appliqués sans absorber leur responsabilité
- `pricing` pour l’interprétation monétaire de certains avantages sans absorber sa responsabilité
- `notifications` pour certaines communications liées au statut ou aux points sans absorber sa responsabilité
- `crm` pour certains enrichissements relationnels sans absorber sa responsabilité
- `audit` pour tracer certaines consommations, corrections ou changements sensibles
- `observability` pour expliquer pourquoi des points, un statut ou un avantage ont été attribués, expirés, refusés ou consommés
- `store` pour le contexte boutique et certaines politiques locales de fidélité

Les domaines suivants peuvent dépendre de `loyalty` :

- `customers`
- `checkout`
- `orders`
- `discounts`
- `dashboarding`
- `analytics`
- `crm`
- certaines couches storefront et d’administration

## Capabilities activables liées

Le domaine `loyalty` est directement ou indirectement lié à :

- `loyalty`
- `discounts`
- `notifications`
- `marketingCampaigns`

### Effet si `loyalty` est activée

Le domaine devient pleinement exploitable pour gérer des comptes, points, statuts et avantages fidélité structurés.

### Effet si `loyalty` est désactivée

Le domaine reste structurellement présent, mais aucun mécanisme de fidélité enrichi non indispensable ne doit être exposé côté boutique.

### Effet si `discounts` est activée

Le domaine peut articuler certains bénéfices fidélité avec des mécanismes de réduction, sans absorber la responsabilité de `discounts`.

### Effet si `notifications` ou `marketingCampaigns` est activée

Le domaine peut être davantage consommé pour des usages de communication ou d’animation du programme de fidélité, sans absorber la responsabilité des domaines consommateurs.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager` en lecture ou action partielle selon la politique retenue
- `customer_support` en lecture ou correction partielle selon la politique retenue
- `customer` pour son propre compte de fidélité selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `loyalty.read`
- `loyalty.write`
- `customers.read`
- `orders.read`
- `discounts.read`
- `crm.read`
- `notifications.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `loyalty.account.created`
- `loyalty.points.earned`
- `loyalty.points.redeemed`
- `loyalty.points.expired`
- `loyalty.tier.changed`
- `loyalty.benefit.granted`
- `loyalty.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `customer.created`
- `order.created`
- `payment.captured`
- `checkout.readiness.changed`
- `discount.applied`
- `store.capabilities.updated`
- certaines actions administratives structurées de correction, d’attribution ou de consommation fidélité

Il doit toutefois rester maître de sa propre logique de fidélisation.

## Intégrations externes

Le domaine `loyalty` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être appuyé par `integrations` vers certains programmes ou outils externes spécialisés, mais :

- la vérité de la fidélité interne reste dans `loyalty`
- les DTO providers externes restent dans `integrations`
- les avantages et états métier internes restent exprimés dans le langage du socle

## Données sensibles / sécurité

Le domaine `loyalty` manipule des données commerciales et quasi-monétaires sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre points, statut, avantage, réduction et paiement
- protection des mouvements, corrections et consommations sensibles
- limitation de l’exposition selon le rôle, le scope et le besoin métier
- audit des attributions, consommations, corrections et consultations sensibles

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel compte de fidélité est en vigueur
- quel solde de points, quel statut ou quel avantage sont appliqués
- pourquoi des points ont été gagnés, expirés, refusés ou consommés
- quel événement ou quelle opération a modifié le statut ou le solde
- si un avantage ne s’applique pas à cause d’une capability off, d’une règle d’éligibilité, d’un solde insuffisant ou d’une autre règle applicable

### Audit

Il faut tracer :

- la création d’un compte de fidélité sensible
- les corrections ou consommations sensibles de points
- les changements sensibles de statut ou de palier
- certaines consultations sensibles si le modèle final les retient explicitement
- certaines modifications manuelles importantes des politiques ou avantages de fidélité

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `LoyaltyAccount` : compte de fidélité structuré
- `LoyaltyPointBalance` : solde courant de points ou d’unités de fidélité
- `LoyaltyTransaction` : mouvement d’accumulation, d’expiration ou de consommation
- `LoyaltyTier` : niveau ou palier de fidélité
- `LoyaltyBenefit` : avantage porté par le programme de fidélité
- `LoyaltyPolicy` : règle d’éligibilité, d’accumulation, de consommation ou d’expiration
- `LoyaltySubjectRef` : référence vers le client, la commande ou l’opération concernée

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un compte de fidélité possède un identifiant stable, un statut explicite et un rattachement explicite
- un mouvement de fidélité est rattaché à un compte explicite et à un contexte d’origine explicite
- `loyalty` ne se confond pas avec `discounts`
- `loyalty` ne se confond pas avec `pricing`
- `loyalty` ne se confond pas avec `gift-cards`
- `loyalty` ne se confond pas avec `payments`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de fidélisation quand le cadre commun `loyalty` existe
- un avantage non éligible, expiré ou non activé ne doit pas être appliqué hors règle explicite

## Cas d’usage principaux

1. Créer un compte de fidélité pour un client
2. Accumuler des points après une commande éligible
3. Changer le statut ou le palier d’un client fidèle
4. Consommer un avantage ou des points au checkout
5. Fournir à `customers`, `checkout` ou `discounts` une lecture fiable de l’état de fidélité
6. Exposer à l’admin une lecture claire des comptes, points, statuts et avantages disponibles

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- compte de fidélité introuvable
- solde de points insuffisant
- avantage non éligible ou expiré
- palier invalide ou incohérent
- tentative de consommation non autorisée
- permission ou scope insuffisant
- conflit entre plusieurs règles d’accumulation, de consommation ou d’éligibilité

## Décisions d’architecture

Les choix structurants du domaine sont :

- `loyalty` porte la fidélisation structurée du socle
- `loyalty` est distinct de `discounts`
- `loyalty` est distinct de `pricing`
- `loyalty` est distinct de `gift-cards`
- `loyalty` est distinct de `payments`
- les domaines consommateurs lisent la vérité de fidélité via `loyalty`, sans la recréer localement
- les soldes, statuts, mouvements, avantages et politiques sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la fidélisation structurée relève de `loyalty`
- les remises relèvent de `discounts`
- le pricing relève de `pricing`
- les cartes cadeaux relèvent de `gift-cards`
- les paiements relèvent de `payments`
- `loyalty` ne remplace ni `discounts`, ni `pricing`, ni `gift-cards`, ni `payments`, ni `crm`, ni `integrations`
