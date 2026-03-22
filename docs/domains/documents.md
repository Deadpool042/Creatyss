# Domaine documents

## Rôle

Le domaine `documents` porte les documents commerciaux et fiscaux du socle.

Il gère la production, la lecture et le suivi des objets documentaires internes liés au commerce, comme les factures, avoirs et exports documentaires, sans confondre la commande, le paiement, la fiscalité ou les intégrations réglementaires externes.

## Responsabilités

Le domaine `documents` prend en charge :

- les factures
- les avoirs
- les exports documentaires internes
- la lecture documentaire liée aux commandes
- les statuts documentaires internes
- le rattachement des documents aux commandes et, si nécessaire, aux paiements ou retours
- la production d’objets documentaires internes exploitables par l’admin, le support, l’analytics et les intégrations
- la base métier nécessaire aux flux documentaires réglementaires ou comptables, sans exécuter directement les appels externes

## Ce que le domaine ne doit pas faire

Le domaine `documents` ne doit pas :

- porter la commande durable, qui relève de `orders`
- porter le paiement, qui relève de `payments`
- recalculer la fiscalité, qui relève de `taxation`
- recalculer librement les montants figés, qui relèvent du snapshot de commande et de la logique monétaire validée
- porter l’intégration réglementaire vers un provider externe, ce qui relève de `integrations`
- devenir un domaine comptable externe complet dicté par un ERP ou un provider
- devenir un simple générateur de PDF sans responsabilité métier claire

Le domaine `documents` porte les objets documentaires internes du socle. Il ne remplace ni `orders`, ni `payments`, ni `taxation`, ni `integrations`.

## Sous-domaines

- `invoices` : factures
- `credit-notes` : avoirs
- `exports` : exports documentaires ou projections documentaires internes

## Entrées

Le domaine reçoit principalement :

- une commande durable issue de `orders`
- des snapshots monétaires figés
- des informations de paiement utiles à certains statuts documentaires
- des informations de retour utiles à la génération d’avoirs
- des demandes de génération documentaire
- des demandes de lecture de documents existants

## Sorties

Le domaine expose principalement :

- des factures internes
- des avoirs internes
- des statuts documentaires internes
- des liaisons explicites entre documents et commandes
- des projections ou exports documentaires exploitables par l’admin, le support, l’analytics et les intégrations

## Dépendances vers autres domaines

Le domaine `documents` peut dépendre de :

- `orders` pour la commande de référence
- `payments` pour certains états ou références de paiement utiles aux documents
- `returns` pour certains cas d’avoirs ou résolutions post-commande
- `taxation` pour la lecture des breakdowns fiscaux déjà figés dans les snapshots documentaires ou de commande
- `store` pour le contexte boutique et certains paramètres documentaires
- `audit` pour tracer les opérations documentaires sensibles
- `observability` pour expliquer certaines incohérences ou refus de génération documentaire

Les domaines suivants peuvent dépendre de `documents` :

- `integrations`
- `analytics`
- `dashboarding`
- `customer_support`
- `notifications`

## Capabilities activables liées

Le domaine `documents` est directement ou indirectement lié à :

- `electronicInvoicing`
- `chorusProIntegration`
- `erpIntegration`
- `ebpIntegration`
- `taxation`
- `exciseTax`

### Effet si `electronicInvoicing` est activée

Le domaine doit être capable d’exposer des objets documentaires internes compatibles avec des flux d’intégration renforcés.

### Effet si `electronicInvoicing` est désactivée

Le domaine reste structurellement présent et continue de porter les documents internes, sans activer les flux réglementaires externes associés.

### Effet si `chorusProIntegration`, `erpIntegration` ou `ebpIntegration` est activée

Les documents internes peuvent alimenter des synchronisations externes via `integrations`, sans que `documents` parle directement au provider.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `order_manager`
- `customer_support`
- `customer` pour ses propres documents selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `documents.read`
- `documents.write`
- `orders.read`
- `payments.read`
- `returns.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `invoice.generated`
- `invoice.updated`
- `credit_note.generated`
- `document.export.generated`
- `document.status.changed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `order.created`
- `payment.captured`
- `payment.refunded`
- `return.accepted`
- `return.resolution.changed`

Il doit toutefois rester maître de son propre cycle de vie documentaire interne.

## Intégrations externes

Le domaine `documents` ne doit pas parler directement aux systèmes externes.

Les synchronisations vers :

- Chorus Pro
- ERP
- EBP
- systèmes comptables
- plateformes réglementaires

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `documents` reste la source de vérité interne des objets documentaires du socle.

## Données sensibles / sécurité

Le domaine `documents` porte des données commerciales, fiscales et potentiellement réglementaires sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- protection des opérations de génération ou correction sensibles
- cohérence stricte avec les snapshots de commande et les états de paiement/retour
- audit des changements documentaires sensibles
- séparation stricte entre document interne et payload provider externe

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un document a été généré ou non
- sur quelle commande ou quel événement métier il repose
- quel statut documentaire est en vigueur
- si un problème vient des données source internes ou d’un flux aval d’intégration

### Audit

Il faut tracer :

- la génération d’une facture
- la génération d’un avoir
- les changements de statut documentaire sensibles
- les interventions manuelles importantes sur les documents
- certaines corrections ou régénérations significatives

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Invoice` : facture interne
- `CreditNote` : avoir interne
- `DocumentStatus` : statut documentaire interne
- `OrderDocumentLink` : rattachement entre document et commande
- `DocumentExport` : export ou projection documentaire interne

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un document est rattaché explicitement à une commande ou à un événement métier documenté
- les montants documentaires ne sont pas librement recalculés hors de la logique monétaire de référence ou des snapshots figés
- `documents` ne se confond pas avec `orders`, `payments` ou `taxation`
- les objets documentaires internes restent indépendants des formats providers externes
- les autres domaines ne doivent pas recréer leur propre vérité divergente des documents internes

## Cas d’usage principaux

1. Générer une facture interne à partir d’une commande
2. Générer un avoir à la suite d’un retour ou d’un remboursement métier
3. Lire les documents liés à une commande
4. Exposer des statuts documentaires clairs à l’admin et au support
5. Préparer des objets documentaires exploitables par des intégrations réglementaires ou ERP
6. Exposer des documents à l’utilisateur final selon les permissions et le scope retenus

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- document introuvable
- commande introuvable
- génération documentaire impossible à partir du contexte source
- incohérence entre commande, paiement, retour et document attendu
- capability d’intégration documentaire désactivée pour un flux externe demandé
- tentative de modification interdite d’un document figé

## Décisions d’architecture

Les choix structurants du domaine sont :

- `documents` porte les objets documentaires internes du socle
- `documents` est distinct de `orders`
- `documents` est distinct de `payments`
- `documents` est distinct de `taxation`
- `documents` est distinct de `integrations`
- les documents internes sont générés à partir de données internes validées et figées
- les flux réglementaires ou ERP consomment ces documents via `integrations`, sans redéfinir la vérité interne
- les opérations documentaires sensibles doivent être auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les factures et avoirs internes relèvent de `documents`
- la commande durable relève de `orders`
- le paiement relève de `payments`
- la logique fiscale relève de `taxation`
- les intégrations Chorus Pro, ERP ou EBP relèvent de `integrations`
- `documents` ne remplace ni `orders`, ni `payments`, ni `taxation`, ni `integrations`
