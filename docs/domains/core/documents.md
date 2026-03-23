# Domaine `documents`

## Objectif

Ce document décrit le domaine `documents` dans la doctrine courante du socle.

Il précise :

- le rôle du domaine ;
- sa place dans la modularité du socle ;
- sa source de vérité ;
- ses capabilities activables ;
- ses niveaux de sophistication ;
- ses objets métier ;
- ses invariants ;
- son cycle de vie ;
- ses règles de cohérence ;
- ses frontières externes ;
- ses implications de maintenance, d’exploitation et de coût.

Le domaine `documents` est structurant pour la réutilisabilité du socle, car il porte les documents commerciaux, opérationnels ou réglementaires dérivés des vérités coeur du système.

Le domaine `documents` ne doit pas être confondu avec :

- `orders`, qui porte la commande durable ;
- `payments`, qui porte le paiement interne ;
- `taxation`, qui porte la logique fiscale ;
- `integrations`, qui parle à des systèmes documentaires externes.

Il porte la **vérité documentaire interne** du socle.

---

## Position dans la doctrine de modularité

Le domaine `documents` est classé comme :

- `domaine coeur à capabilities toggleables`

Le domaine existe dès qu’un projet a besoin de produire des documents commerciaux, fiscaux ou opérationnels.
En revanche, sa richesse varie fortement selon le projet.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- une responsabilité explicite sur les documents internes ;
- une séparation entre vérité coeur et représentation documentaire ;
- une traçabilité des documents générés ;
- une articulation claire avec orders, payments, taxation et shipping.

### Ce qui est activable / désactivable par capability

Le domaine `documents` est lié aux capabilities suivantes :

- `orderDocuments`
- `invoiceDocuments`
- `creditNoteDocuments`
- `shippingDocuments`
- `electronicInvoicing`
- `b2bCommerce`
- `multiCountryTaxation`

### Ce qui relève d’un niveau

Le domaine porte plusieurs niveaux de sophistication documentaire.

### Ce qui relève d’un provider ou d’une intégration externe

Relèvent de `integrations` et non du coeur de `documents` :

- facture électronique externe ;
- GED externe ;
- signature ou archivage externe ;
- export comptable documentaire.

Le domaine `documents` garde la vérité interne de la production documentaire décidée par le socle.

---

## Rôle

Le domaine `documents` porte les documents dérivés des vérités métier du commerce.

Il constitue la source de vérité interne pour :

- l’existence d’un document ;
- son type ;
- son rattachement à une commande, un paiement, un remboursement ou une livraison ;
- son statut interne ;
- certaines métadonnées documentaires ;
- l’état de génération, disponibilité ou annulation du document.

Le domaine est distinct :

- de `orders`, qui porte les données commerciales figées ;
- de `payments`, qui porte la vérité financière ;
- de `taxation`, qui porte la vérité fiscale ;
- de `shipping`, qui porte la vérité de livraison ;
- de `integrations`, qui peut exécuter une production externe spécialisée.

---

## Responsabilités

Le domaine `documents` prend en charge :

- la modélisation des types documentaires ;
- la création documentaire à partir des vérités coeur ;
- la production ou orchestration de génération ;
- la conservation de la vérité documentaire interne ;
- la lecture et traçabilité des documents ;
- la gestion du cycle de vie d’un document ;
- la cohérence entre document et fait métier source.

---

## Ce que le domaine ne doit pas faire

Le domaine `documents` ne doit pas :

- devenir la source de vérité de la commande ou du paiement ;
- recalculer les montants métier à partir de lui-même ;
- prendre un export externe pour vérité primaire ;
- mélanger document interne et provider documentaire externe ;
- remplacer `taxation`, `orders` ou `payments`.

---

## Source de vérité

Le domaine `documents` est la source de vérité pour :

- les documents internes générés ou reconnus par le socle ;
- leur statut ;
- leur rattachement métier ;
- leur identité documentaire interne ;
- leurs métadonnées de génération et disponibilité.

Le domaine n’est pas la source de vérité pour :

- les montants commerciaux ;
- les paiements ;
- la taxation ;
- les commandes ;
- les providers documentaires externes.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `Document`
- `DocumentType`
- `DocumentStatus`
- `DocumentSourceReference`
- `InvoiceDocument`
- `CreditNoteDocument`
- `ShippingDocument`
- `DocumentGenerationRequest`

---

## Capabilities activables liées

Le domaine `documents` est lié aux capabilities suivantes :

- `orderDocuments`
- `invoiceDocuments`
- `creditNoteDocuments`
- `shippingDocuments`
- `electronicInvoicing`
- `b2bCommerce`
- `multiCountryTaxation`

### Effet si `orderDocuments` est activée

Le domaine peut générer ou exposer des documents liés à la commande.

### Effet si `invoiceDocuments` est activée

Le domaine peut produire des factures internes ou piloter leur génération.

### Effet si `creditNoteDocuments` est activée

Le domaine peut produire des avoirs ou notes de crédit cohérents avec remboursements ou annulations.

### Effet si `shippingDocuments` est activée

Le domaine peut porter certains documents de livraison ou d’expédition.

### Effet si `electronicInvoicing` est activée

Le domaine peut se coordonner avec une logique documentaire plus réglementée ou électronique.

### Effet si `b2bCommerce` est activée

Le domaine peut produire des documents plus riches pour les parcours entreprise.

### Effet si `multiCountryTaxation` est activée

Le domaine peut porter des snapshots documentaires fiscalement plus riches.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

- documents simples ;
- faible nombre de types ;
- génération ou exposition limitée.

### Niveau 2 — standard

- factures et documents de commande plus structurés ;
- meilleure articulation avec paiement et taxation.

### Niveau 3 — avancé

- avoirs ;
- documents de livraison ;
- B2B ;
- plus grande richesse documentaire et plus forte exigence de traçabilité.

### Niveau 4 — expert / réglementé / multi-contraintes

- facture électronique ;
- plusieurs types réglementés ;
- exigences élevées de conservation, traçabilité et intégration.

---

## Entrées

Le domaine reçoit principalement :

- des commandes créées ou modifiées ;
- des paiements capturés ou remboursés ;
- des résultats fiscaux figés ;
- des événements de livraison ;
- des demandes de génération documentaire ;
- des résultats externes traduits de systèmes documentaires si activés.

---

## Sorties

Le domaine expose principalement :

- un document interne ;
- un statut documentaire ;
- une référence documentaire exploitable ;
- des événements liés à la génération ou au changement d’état d’un document.

---

## Dépendances vers autres domaines

Le domaine `documents` dépend de :

- `orders`
- `payments`
- `taxation`
- `shipping`
- `stores`
- `audit`
- `observability`

Les domaines suivants dépendent de `documents` :

- `integrations`
- `analytics`
- `customer-support`
- `admin`

---

## Dépendances vers providers / intégrations

Le domaine `documents` peut utiliser `integrations` pour produire ou transmettre certains documents, mais garde une vérité documentaire interne.

Il ne laisse pas un système externe devenir la vérité documentaire du socle sans traduction ni rattachement explicite.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `finance_manager`
- `order_manager`
- `customer_support`

### Permissions

Exemples de permissions concernées :

- `documents.read`
- `documents.write`
- `documents.generate`
- `documents.invoice.manage`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `document.created`
- `document.generated`
- `document.failed`
- `document.cancelled`
- `invoice.generated`
- `credit_note.generated`
- `shipping_document.generated`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `order.created`
- `order.cancelled`
- `payment.captured`
- `payment.refunded`
- `shipping.status.changed`
- `integration.document.result.translated`

---

## Données sensibles / sécurité

Le domaine `documents` porte une donnée métier sensible.

Points de vigilance :

- les documents peuvent exposer des données client, fiscales ou financières ;
- les documents ne doivent pas diverger de leur source coeur ;
- les accès doivent être contrôlés ;
- les exports externes doivent être surveillés ;
- les documents annulés ou corrigés doivent rester traçables.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un document a été généré ;
- depuis quel fait métier source ;
- quel type documentaire a été produit ;
- pourquoi une génération a échoué ;
- si un document est disponible, annulé ou remplacé.

### Audit

Il faut tracer :

- les demandes de génération ;
- les annulations ;
- les régénérations ;
- les documents de correction ;
- les flux documentaires sensibles.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un document est rattaché à une source métier explicite ;
- un document ne redéfinit pas la vérité commerciale ou financière ;
- un document annulé ou remplacé reste traçable ;
- le domaine `documents` reste distinct des systèmes documentaires externes ;
- la génération documentaire part de faits métier déjà validés.

---

## Lifecycle et gouvernance des données

### États principaux

Les états principaux incluent typiquement :

- `PENDING`
- `GENERATED`
- `AVAILABLE`
- `FAILED`
- `CANCELLED`
- `REPLACED`

### Transitions autorisées

Exemples :

- `PENDING -> GENERATED`
- `GENERATED -> AVAILABLE`
- `PENDING -> FAILED`
- `AVAILABLE -> CANCELLED`
- `AVAILABLE -> REPLACED`

### Transitions interdites

Exemples :

- considérer un document annulé comme jamais existé ;
- réécrire silencieusement un document sans trace ;
- traiter un payload externe comme document interne sans rattachement explicite.

### Règles de conservation / archivage / suppression

- les documents structurants restent traçables ;
- les documents remplacés ou annulés restent compréhensibles ;
- la suppression physique n’est pas la stratégie par défaut ;
- la conservation dépend aussi des exigences commerciales et réglementaires du projet.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’un enregistrement documentaire interne ;
- rattachement à sa source métier ;
- changement de statut documentaire ;
- écriture des événements `document.*` correspondants ;
- création d’un document de correction ou de remplacement si cela fait partie du même invariant métier.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- génération de PDF ou rendu ;
- dépôt externe ;
- signature externe ;
- envoi email ;
- export comptable ;
- analytics ;
- webhooks sortants.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les mutations documentaires structurantes ;
- unicité logique du document par source / type quand la règle métier l’exige ;
- refus des régénérations concurrentes incohérentes ;
- traçabilité des remplacements.

Les conflits attendus sont :

- double génération ;
- génération concurrente après annulation ;
- document de correction concurrent ;
- résultat externe doublonné.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `generate-document` : clé d’intention = `(documentSourceRef, documentType, generationIntentId)`
- `cancel-document` : clé d’intention = `(documentId, cancelIntentId)`
- `apply-external-document-result` : clé d’intention = `(providerName, externalEventId)`

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `document.created`
- `document.generated`
- `document.failed`
- `document.cancelled`
- `invoice.generated`
- `credit_note.generated`
- `shipping_document.generated`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- rendu PDF ;
- signature externe ;
- archivage externe ;
- email ;
- export comptable ;
- analytics.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` pour documents simples ;
- `M2` pour factures et documents standards ;
- `M3` pour avoirs, documents de livraison et B2B ;
- `M4` pour facture électronique ou contexte plus réglementé.

### Pourquoi

Le domaine `documents` supporte directement support, finance, fiscalité et obligations administratives.
Plus il monte en richesse, plus il exige :

- observability ;
- traçabilité ;
- gouvernance documentaire ;
- qualité de reprise.

### Points d’exploitation à surveiller

- documents non générés ;
- documents en échec ;
- documents incohérents avec la source métier ;
- régénérations ;
- écarts entre document interne et système externe.

---

## Impact coût / complexité

Le coût du domaine `documents` monte principalement avec :

- `invoiceDocuments`
- `creditNoteDocuments`
- `shippingDocuments`
- `electronicInvoicing`
- `b2bCommerce`
- `multiCountryTaxation`

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Générer un document de commande
2. Générer une facture
3. Générer un avoir
4. Générer un document de livraison
5. Suivre le cycle de vie documentaire

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- source métier introuvable ;
- type documentaire non activé ;
- double génération ;
- résultat externe ambigu ;
- annulation invalide ;
- document remplacé incohérent ;
- génération concurrente.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `documents` est un domaine coeur à capabilities toggleables ;
- les documents dérivent des vérités coeur ;
- le domaine reste distinct de `orders`, `payments` et `taxation` ;
- les systèmes externes documentaires restent dans `integrations` ;
- les documents sont traçables, versionnables ou remplaçables selon besoin ;
- la génération lourde part après commit.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `documents` appartient au socle ;
- les documents ne redéfinissent pas la vérité métier ;
- les factures électroniques ou exports externes restent des intégrations ;
- les avoirs et documents de correction sont de vraies capacités du domaine ;
- la richesse documentaire varie par capability et par niveau ;
- la traçabilité documentaire est non négociable.
