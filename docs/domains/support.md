# Domaine support

## Rôle

Le domaine `support` porte l’assistance opérationnelle et relationnelle du socle.

Il structure les demandes d’aide, tickets, conversations, suivis et résolutions support liés à la boutique ou à ses opérations, sans absorber le CRM, les retours, la commande, les notifications transactionnelles ou l’observabilité technique.

## Responsabilités

Le domaine `support` prend en charge :

- les tickets support
- les conversations support
- les statuts de prise en charge
- les catégories et motifs de demande
- les assignations support
- les notes de traitement support
- la résolution et clôture d’une demande support
- la base relationnelle et opérationnelle exploitée par le support, l’admin boutique et certaines couches plateforme autorisées

## Ce que le domaine ne doit pas faire

Le domaine `support` ne doit pas :

- porter la relation client enrichie, qui relève de `crm`
- porter les retours métier, qui relèvent de `returns`
- porter la commande durable, qui relève de `orders`
- porter les notifications transactionnelles, qui relèvent de `notifications`
- porter l’observabilité technique, qui relève de `observability`
- devenir un fourre-tout mélangeant SAV, CRM, audit, support interne technique et ticketing provider externe sans frontière claire

Le domaine `support` porte l’assistance et le traitement des demandes support. Il ne remplace ni `crm`, ni `returns`, ni `orders`, ni `observability`.

## Sous-domaines

- `tickets` : tickets ou demandes support structurées
- `conversations` : échanges liés à un ticket ou une demande
- `assignments` : assignation du traitement à un agent ou un rôle
- `resolution` : résolution, clôture et issue de la demande support

## Entrées

Le domaine reçoit principalement :

- des demandes d’assistance créées par un client, un support ou un utilisateur autorisé
- des messages ou réponses liés à une demande support
- des rattachements à une commande, un retour, un événement ou un autre objet métier si nécessaire
- des demandes d’assignation, de réassignation, de résolution ou de clôture
- des demandes de lecture d’un ticket, d’une conversation ou d’un historique support

## Sorties

Le domaine expose principalement :

- des tickets support structurés
- des conversations support
- des statuts de traitement support
- des affectations et résolutions support
- une lecture exploitable par `crm`, `orders`, `returns`, `dashboarding`, `analytics`, `notifications` et certaines couches d’administration

## Dépendances vers autres domaines

Le domaine `support` peut dépendre de :

- `customers` pour identifier le client concerné
- `crm` pour enrichir le contexte relationnel du support
- `orders` pour rattacher un ticket à une commande
- `returns` pour rattacher un ticket à un retour ou une résolution SAV
- `payments` ou `documents` si certains tickets concernent un paiement ou un document
- `notifications` pour informer des changements de statut, sans absorber sa responsabilité
- `audit` pour tracer certaines interventions sensibles
- `observability` pour certains diagnostics avancés côté plateforme, sans absorber sa responsabilité
- `store` pour le contexte boutique et les règles d’exposition

Les domaines suivants peuvent dépendre de `support` :

- `crm`
- `dashboarding`
- `analytics`
- `notifications`
- certaines couches d’administration boutique et plateforme

## Capabilities activables liées

Le domaine `support` est directement ou indirectement lié à :

- `returns`
- `notifications`
- `crm`
- `publicEvents`

Le domaine `support` lui-même peut être considéré comme structurellement présent dans le socle, même si certaines spécialisations de traitement ne sont pas actives.

### Effet si `returns` est activée

Le support peut traiter des demandes liées à des retours et résolutions SAV plus riches.

### Effet si `notifications` est activée

Le support peut s’appuyer sur des notifications de changement de statut ou de réponse.

### Effet si `crm` est activée

Le support peut exploiter une fiche client enrichie dans le traitement des demandes.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `customer_support`
- `order_manager` en lecture partielle selon la politique retenue
- `customer` pour ses propres demandes selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `support.read`
- `support.write`
- `customers.read`
- `crm.read`
- `orders.read`
- `returns.read`
- `notifications.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `support.ticket.created`
- `support.ticket.updated`
- `support.ticket.assigned`
- `support.ticket.resolved`
- `support.ticket.closed`
- `support.message.created`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `order.created`
- `return.requested`
- `payment.failed`
- `document.status.changed`
- `customer.created`
- `store.capabilities.updated`

Il doit toutefois rester maître de sa propre logique de prise en charge support.

## Intégrations externes

Le domaine `support` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être relié plus tard à des outils externes de support via `integrations`, mais :

- la vérité support interne reste dans `support`
- les tickets ou conversations provider-specific restent du côté de `integrations` tant qu’ils ne sont pas remappés dans le langage interne du socle

## Données sensibles / sécurité

Le domaine `support` manipule des données relationnelles, commerciales et parfois sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation entre visibilité client, support boutique et plateforme
- protection des notes internes et des résolutions sensibles
- limitation de l’exposition selon le rôle, le scope et le besoin métier
- audit des interventions manuelles importantes

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel ticket a été créé
- quel client ou objet métier est concerné
- quel statut est en vigueur
- pourquoi une demande a été assignée, résolue ou clôturée
- si une action support est bloquée par un état métier source ou une permission insuffisante

### Audit

Il faut tracer :

- la création de certains tickets sensibles si la politique retenue l’exige
- les changements de statut significatifs
- les résolutions ou clôtures importantes
- les interventions manuelles sensibles
- certaines consultations sensibles si le modèle final les retient

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `SupportTicket` : ticket ou demande support structurée
- `SupportConversation` : échange rattaché à une demande support
- `SupportAssignment` : assignation du traitement
- `SupportStatus` : état de traitement de la demande
- `SupportResolution` : résolution ou issue de la demande
- `SupportSubjectRef` : référence vers l’objet métier concerné si applicable

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une demande support possède un identifiant stable et un statut explicite
- une conversation support est rattachée explicitement à une demande valide
- `support` ne se confond pas avec `crm`
- `support` ne se confond pas avec `returns`
- `support` ne se confond pas avec `observability`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente du traitement support quand le cadre commun `support` existe
- les notes ou éléments internes sensibles ne doivent pas être exposés au mauvais acteur

## Cas d’usage principaux

1. Ouvrir une demande support liée à une commande
2. Échanger avec un client au sein d’un ticket support
3. Assigner une demande à un agent support
4. Résoudre ou clôturer une demande
5. Rattacher une demande à un retour, un paiement ou un document si nécessaire
6. Exposer à l’admin et au support une lecture claire des demandes en cours, résolues ou bloquées

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- ticket support introuvable
- conversation introuvable
- objet métier rattaché introuvable
- assignation invalide
- tentative de résolution non autorisée
- permission ou scope insuffisant
- tentative d’exposition d’un contenu interne sensible dans un contexte non autorisé

## Décisions d’architecture

Les choix structurants du domaine sont :

- `support` porte le traitement des demandes d’assistance du socle
- `support` est distinct de `crm`
- `support` est distinct de `returns`
- `support` est distinct de `orders`
- `support` est distinct de `observability`
- le support peut se rattacher à des objets métier source sans absorber leur vérité métier
- les demandes, échanges et résolutions sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les demandes d’assistance relèvent de `support`
- la relation client enrichie relève de `crm`
- les retours relèvent de `returns`
- la commande relève de `orders`
- l’explicabilité technique relève de `observability`
- `support` ne remplace ni `crm`, ni `returns`, ni `orders`, ni `observability`, ni `integrations`
