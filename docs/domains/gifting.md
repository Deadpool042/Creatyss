# Domaine gifting

## Rôle

Le domaine `gifting` porte les usages de cadeau structurés du socle.

Il organise les scénarios où un achat, un produit, un envoi ou une expérience commerciale est destiné à être offert à un tiers, avec ses données de bénéficiaire, ses messages, ses préférences de présentation ou ses modalités spécifiques, sans absorber les cartes cadeaux, la commande durable, les paiements, les notifications ou les documents métier.

## Responsabilités

Le domaine `gifting` prend en charge :

- les intentions de cadeau structurées
- les informations de bénéficiaire liées à un cadeau
- les messages ou dédicaces de cadeau
- les préférences de présentation cadeau
- les états métier liés à une option cadeau
- la lecture gouvernée d’un contexte cadeau rattaché à une commande, une ligne ou un objet offert
- la base gifting consommable par `cart`, `checkout`, `orders`, `notifications`, `documents`, `dashboarding` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `gifting` ne doit pas :

- porter les cartes cadeaux, qui relèvent de `gift-cards`
- porter la commande durable, qui relève de `orders`
- porter les paiements, qui relèvent de `payments`
- porter les notifications, qui relèvent de `notifications`
- porter les documents métier durables, qui relèvent de `documents`
- porter la logistique globale, qui relève de `shipping` ou `fulfillment`
- devenir un simple champ booléen sur une ligne de commande sans langage métier explicite

Le domaine `gifting` porte les usages de cadeau liés à une opération commerciale ou logistique. Il ne remplace ni `gift-cards`, ni `orders`, ni `payments`, ni `notifications`, ni `documents`.

## Sous-domaines

- `intent` : intention cadeau structurée
- `recipient` : bénéficiaire ou destinataire du cadeau
- `message` : message, dédicace ou note cadeau
- `presentation` : préférences de présentation ou d’emballage cadeau
- `policies` : règles d’éligibilité, d’exposition ou de traitement des usages cadeau

## Entrées

Le domaine reçoit principalement :

- des demandes d’ajout ou de mise à jour d’une intention cadeau
- des informations de bénéficiaire ou de destinataire cadeau
- des messages ou préférences de présentation cadeau
- des demandes de lecture d’un contexte cadeau rattaché à une commande, un panier ou une ligne
- des contextes de boutique, acteur, panier, checkout, commande, client, canal ou surface d’exposition
- des signaux internes utiles à l’activation, à la validation ou à la désactivation d’un usage cadeau

## Sorties

Le domaine expose principalement :

- des contextes cadeau structurés
- des données de bénéficiaire et de message cadeau
- des états métier liés aux usages cadeau
- des lectures exploitables par `cart`, `checkout`, `orders`, `notifications`, `documents`, `dashboarding` et certaines couches d’administration
- des structures gifting prêtes à être consommées par les domaines opérationnels autorisés

## Dépendances vers autres domaines

Le domaine `gifting` peut dépendre de :

- `cart` pour certains contextes d’intention cadeau avant commande
- `checkout` pour certains choix ou validations cadeau au moment de l’achat
- `orders` pour rattacher l’usage cadeau à la commande durable
- `customers` pour certains contextes d’acheteur ou de bénéficiaire si le modèle retenu le prévoit
- `notifications` pour certaines communications liées au cadeau sans absorber sa responsabilité
- `documents` pour certains enrichissements documentaires sans absorber leur responsabilité
- `shipping` ou `fulfillment` pour certaines préférences d’emballage ou de remise cadeau sans absorber leur responsabilité
- `audit` pour tracer certaines modifications sensibles de contexte cadeau
- `observability` pour expliquer pourquoi une option cadeau est active, refusée, masquée ou incomplète
- `store` pour le contexte boutique et certaines politiques locales

Les domaines suivants peuvent dépendre de `gifting` :

- `cart`
- `checkout`
- `orders`
- `notifications`
- `documents`
- `dashboarding`
- certaines couches storefront et d’administration

## Capabilities activables liées

Le domaine `gifting` est directement ou indirectement lié à :

- `gifting`
- `notifications`
- `giftCards`

### Effet si `gifting` est activée

Le domaine devient pleinement exploitable pour exprimer des intentions de cadeau, bénéficiaires, messages et préférences associées.

### Effet si `gifting` est désactivée

Le domaine reste structurellement présent, mais aucune option cadeau enrichie non indispensable ne doit être exposée côté boutique.

### Effet si `notifications` est activée

Le domaine peut être davantage consommé pour certaines communications liées au cadeau, sans absorber la responsabilité de `notifications`.

### Effet si `giftCards` est activée

Le domaine peut coexister avec les cartes cadeaux sans confusion de responsabilité : offrir un produit n’est pas émettre une carte cadeau.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `customer_support` en lecture ou action partielle selon la politique retenue
- `customer` pour ses propres contextes cadeau selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `gifting.read`
- `gifting.write`
- `orders.read`
- `customers.read`
- `notifications.read`
- `documents.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `gifting.intent.created`
- `gifting.intent.updated`
- `gifting.recipient.updated`
- `gifting.message.updated`
- `gifting.presentation.updated`
- `gifting.status.changed`
- `gifting.removed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `cart.updated`
- `checkout.readiness.changed`
- `order.created`
- `customer.created`
- `store.capabilities.updated`
- certaines actions administratives structurées d’ajout, de correction ou de suppression d’un contexte cadeau

Il doit toutefois rester maître de sa propre logique d’usage cadeau.

## Intégrations externes

Le domaine `gifting` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être consommé par `integrations` ou par certains flux externes autorisés, mais :

- la vérité des contextes cadeau internes reste dans `gifting`
- les DTO providers externes restent dans `integrations`
- les documents et notifications restent dans leurs domaines respectifs

## Données sensibles / sécurité

Le domaine `gifting` manipule des données personnelles et contextuelles sensibles, notamment sur les bénéficiaires et messages.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre intention cadeau, bénéficiaire, message et exécution aval
- protection des messages privés, identités de bénéficiaire et préférences sensibles
- limitation de l’exposition selon le rôle, le scope et le besoin métier
- audit des modifications et consultations sensibles

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel contexte cadeau est en vigueur
- quel bénéficiaire, message ou mode de présentation est appliqué
- pourquoi une option cadeau est active, refusée, masquée ou incomplète
- quel événement ou quelle opération a modifié le contexte cadeau
- si une option cadeau échoue à s’appliquer à cause d’une capability off, d’une policy, d’une donnée incomplète ou d’une autre règle applicable

### Audit

Il faut tracer :

- la création d’un contexte cadeau sensible
- la modification sensible d’un bénéficiaire ou d’un message cadeau
- la suppression ou désactivation d’un contexte cadeau sensible
- certaines consultations sensibles si le modèle final les retient explicitement
- certaines modifications manuelles importantes des politiques cadeau

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `GiftingIntent` : intention cadeau structurée
- `GiftRecipient` : bénéficiaire ou destinataire du cadeau
- `GiftMessage` : message ou dédicace cadeau
- `GiftPresentationPreference` : préférence de présentation ou d’emballage cadeau
- `GiftingStatus` : état métier du contexte cadeau
- `GiftingPolicy` : règle d’éligibilité, d’exposition ou de traitement
- `GiftingSubjectRef` : référence vers le panier, la ligne, la commande ou l’objet offert

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un contexte cadeau possède un identifiant stable et un statut explicite
- un bénéficiaire ou un message cadeau est rattaché à un contexte cadeau explicite
- `gifting` ne se confond pas avec `gift-cards`
- `gifting` ne se confond pas avec `orders`
- `gifting` ne se confond pas avec `payments`
- `gifting` ne se confond pas avec `notifications`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente d’usage cadeau quand le cadre commun `gifting` existe
- un contexte cadeau incomplet, interdit ou non éligible ne doit pas être appliqué hors règle explicite

## Cas d’usage principaux

1. Marquer un produit ou une commande comme cadeau
2. Saisir un bénéficiaire et un message cadeau
3. Définir une préférence de présentation ou d’emballage cadeau
4. Propager un contexte cadeau du panier vers la commande
5. Fournir à `orders`, `documents` ou `notifications` une lecture fiable du contexte cadeau
6. Exposer à l’admin une lecture claire des usages cadeau actifs ou passés

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- contexte cadeau introuvable
- bénéficiaire invalide ou incomplet
- message cadeau invalide
- option cadeau non éligible pour l’objet ou le contexte courant
- tentative d’application non autorisée
- permission ou scope insuffisant
- conflit entre plusieurs règles d’éligibilité, de présentation ou de propagation

## Décisions d’architecture

Les choix structurants du domaine sont :

- `gifting` porte les usages de cadeau structurés du socle
- `gifting` est distinct de `gift-cards`
- `gifting` est distinct de `orders`
- `gifting` est distinct de `payments`
- `gifting` est distinct de `notifications`
- les domaines consommateurs lisent la vérité des usages cadeau via `gifting`, sans la recréer localement
- les bénéficiaires, messages, préférences et politiques sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les usages de cadeau structurés relèvent de `gifting`
- les cartes cadeaux relèvent de `gift-cards`
- les commandes relèvent de `orders`
- les paiements relèvent de `payments`
- les notifications relèvent de `notifications`
- `gifting` ne remplace ni `gift-cards`, ni `orders`, ni `payments`, ni `notifications`, ni `documents`, ni `integrations`
