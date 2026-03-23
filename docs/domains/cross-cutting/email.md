# Domaine email

## Rôle

Le domaine `email` porte la communication email structurée du socle au niveau message et canal interne.

Il organise les emails émis par la plateforme ou la boutique, leur typologie, leur état, leur contexte métier et leur préparation interne, sans absorber les notifications transactionnelles, la newsletter, les templates réutilisables, ni les providers emailing externes.

## Responsabilités

Le domaine `email` prend en charge :

- les messages email structurés du socle
- les catégories d’emails au niveau métier
- les états d’un email préparé, émis, différé, échoué ou annulé au niveau interne
- les destinataires logiques d’un email
- le contexte métier d’émission d’un email
- la lecture gouvernée des emails émis ou en attente au niveau interne
- la base email consommable par `notifications`, `newsletter`, `support`, `orders`, `documents`, `dashboarding`, `observability` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `email` ne doit pas :

- porter les notifications transactionnelles comme responsabilité globale, qui relèvent de `notifications`
- porter les campagnes newsletter, qui relèvent de `newsletter`
- porter les templates réutilisables, qui relèvent de `template-system`
- porter les providers emailing externes, qui relèvent de `integrations`
- devenir un simple journal SMTP technique sans langage métier explicite
- absorber toute communication sortante du socle sans distinction de finalité

Le domaine `email` porte le message email structuré au niveau interne. Il ne remplace ni `notifications`, ni `newsletter`, ni `template-system`, ni `integrations`.

## Sous-domaines

- `messages` : messages email structurés
- `recipients` : destinataires logiques d’un email
- `status` : états de préparation, émission ou échec au niveau interne
- `policies` : règles d’émission, de catégorisation ou d’exposition des emails

## Entrées

Le domaine reçoit principalement :

- des demandes de préparation ou d’émission d’un email issues de domaines consommateurs autorisés
- des contextes métier issus de `orders`, `documents`, `support`, `events`, `notifications` ou d’autres domaines autorisés
- des demandes de lecture d’un email ou d’un historique email interne
- des changements d’état d’émission ou de préparation
- des contextes de boutique, langue, canal, audience ou acteur destinataire
- des signaux internes utiles à la catégorisation ou à la mise à jour de statut d’un email

## Sorties

Le domaine expose principalement :

- des emails structurés
- des destinataires logiques d’emails
- des états internes d’émission email
- des lectures exploitables par `notifications`, `newsletter`, `support`, `orders`, `documents`, `dashboarding`, `observability` et certaines couches d’administration
- des structures email prêtes à être rendues ou transmises aux couches d’exécution autorisées

## Dépendances vers autres domaines

Le domaine `email` peut dépendre de :

- `template-system` pour certains gabarits réutilisables si le modèle retenu le prévoit
- `notifications` pour certains usages transactionnels sans absorber sa responsabilité
- `newsletter` pour certaines coordinations d’usage sans absorber sa responsabilité
- `customers` ou `users` pour certains destinataires logiques
- `store` pour le contexte boutique, langue, branding ou politiques locales
- `audit` pour tracer certains changements sensibles d’émission ou de consultation
- `observability` pour expliquer pourquoi un email a été préparé, différé, annulé ou marqué en échec

Les domaines suivants peuvent dépendre de `email` :

- `notifications`
- `newsletter`
- `support`
- `orders`
- `documents`
- `dashboarding`
- certaines couches d’administration

## Capabilities activables liées

Le domaine `email` est directement ou indirectement lié à :

- `notifications`
- `newsletter`
- `marketingCampaigns`

Le domaine `email` lui-même peut être considéré comme structurellement présent dès qu’une communication email interne structurée existe dans le socle.

### Effet si `notifications` est activée

Le domaine peut être davantage utilisé pour les messages email transactionnels préparés côté socle.

### Effet si `newsletter` est activée

Le domaine peut coexister avec la diffusion newsletter sans absorber sa responsabilité métier.

### Effet si `marketingCampaigns` est activée

Le domaine peut être davantage sollicité pour certains contextes email dérivés, sans remplacer `newsletter` ou `marketing`.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager` en lecture partielle selon la politique retenue
- `customer_support` en lecture partielle selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `email.read`
- `email.write`
- `notifications.read`
- `newsletter.read`
- `customers.read`
- `orders.read`
- `documents.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `email.created`
- `email.prepared`
- `email.sent`
- `email.failed`
- `email.cancelled`
- `email.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `notification.created`
- `newsletter.campaign.created`
- `order.created`
- `invoice.generated`
- `support.message.created`
- `store.capabilities.updated`
- certaines actions administratives structurées de préparation ou d’annulation d’email

Il doit toutefois rester maître de sa propre logique de message email structuré.

## Intégrations externes

Le domaine `email` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être consommé par `integrations` ou par des couches d’exécution qui parlent à des providers emailing, mais :

- la vérité des messages email internes reste dans `email`
- les DTO providers externes restent dans `integrations`
- la responsabilité des campagnes newsletter reste dans `newsletter`
- la responsabilité des notifications transactionnelles reste dans `notifications`

## Données sensibles / sécurité

Le domaine `email` manipule des contenus de communication et des destinataires potentiellement sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre message email interne, template, diffusion transactionnelle et provider externe
- protection des contenus non encore envoyés ou sensibles
- limitation de l’exposition selon le rôle, le scope et la finalité
- audit des changements significatifs d’état, de destinataire ou de consultation sensible

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel email a été préparé ou émis
- quel contexte métier a déclenché sa création
- quel statut interne est en vigueur
- pourquoi un email a été différé, annulé ou marqué en échec
- si une absence d’émission vient d’une capability off, d’un blocage de policy, d’un destinataire invalide ou d’une règle applicable

### Audit

Il faut tracer :

- la création d’un email sensible
- les changements significatifs de statut d’émission
- certaines annulations ou réémissions importantes
- certaines consultations sensibles si le modèle final les retient explicitement
- certaines modifications manuelles importantes du message ou du destinataire logique

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `EmailMessage` : message email structuré
- `EmailRecipient` : destinataire logique de l’email
- `EmailStatus` : état interne de l’email
- `EmailPolicy` : règle d’émission, de catégorisation ou d’exposition
- `EmailCategory` : catégorie métier d’email
- `EmailSubjectRef` : référence vers le contexte métier source de l’email

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un email possède un identifiant stable, une catégorie explicite et un statut explicite
- un destinataire logique est rattaché à un email explicite
- `email` ne se confond pas avec `notifications`
- `email` ne se confond pas avec `newsletter`
- `email` ne se confond pas avec `template-system`
- `email` ne se confond pas avec `integrations`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de message email interne quand le cadre commun `email` existe
- un statut provider externe ne doit pas devenir directement la vérité métier interne sans traduction explicite

## Cas d’usage principaux

1. Préparer un email lié à une commande ou à un document
2. Structurer un email transactionnel avant diffusion effective
3. Gérer l’état interne d’un email émis, échoué ou annulé
4. Fournir à `notifications` ou `support` une lecture fiable de l’email lié à un contexte métier
5. Exposer à l’admin une lecture claire des emails internes et de leur état
6. Coordonner l’usage email sans absorber la newsletter ni le provider externe

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- email introuvable
- destinataire logique introuvable ou invalide
- transition de statut invalide pour l’état courant
- email annulé, non émissible ou incomplet
- tentative de lecture ou d’exposition non autorisée
- permission ou scope insuffisant
- conflit entre plusieurs règles d’émission ou de catégorisation

## Décisions d’architecture

Les choix structurants du domaine sont :

- `email` porte les messages email structurés du socle
- `email` est distinct de `notifications`
- `email` est distinct de `newsletter`
- `email` est distinct de `template-system`
- `email` est distinct de `integrations`
- les domaines consommateurs lisent la vérité email via `email`, sans la recréer localement
- les contenus, statuts et consultations sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les messages email structurés relèvent de `email`
- les notifications transactionnelles relèvent de `notifications`
- la diffusion newsletter relève de `newsletter`
- les gabarits réutilisables relèvent de `template-system`
- les providers emailing externes relèvent de `integrations`
- `email` ne remplace ni `notifications`, ni `newsletter`, ni `template-system`, ni `integrations`
