# Domaine `returns`

## Objectif

Ce document décrit le domaine `returns` dans la doctrine courante du socle.

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

Le domaine `returns` est structurant pour la réutilisabilité du socle dès qu’un projet doit gérer des retours, échanges ou remboursements partiels aval.

Le domaine `returns` ne doit pas être confondu avec :

- `orders`, qui porte la commande durable ;
- `payments`, qui porte le paiement et le remboursement ;
- `availability`, qui porte la remise à disposition ou non ;
- `shipping`, qui porte l’acheminement aller et éventuellement certains flux retour ;
- `documents`, qui porte les documents de retour ou d’avoir.

Le domaine `returns` porte la **vérité métier du retour**.

---

## Position dans la doctrine de modularité

Le domaine `returns` est classé comme :

- `domaine optionnel toggleable`

Le domaine n’est pas indispensable à tous les projets au démarrage.
Mais dès qu’un commerce gère des retours structurés, il doit exister comme domaine dédié.

### Ce qui n’est jamais désactivé

Quand le domaine est activé, il conserve toujours :

- une vérité interne sur le retour ;
- une relation explicite à la commande source ;
- une cohérence avec remboursement, remise à disposition et documents ;
- un lifecycle explicite.

### Ce qui est activable / désactivable par capability

Le domaine `returns` est lié aux capabilities suivantes :

- `returns`
- `partialReturns`
- `exchangeRequests`
- `refundRequests`
- `restocking`
- `returnShipping`
- `returnDocuments`

### Ce qui relève d’un niveau

Le domaine porte explicitement plusieurs niveaux de sophistication de retour.

### Ce qui relève d’un provider ou d’une intégration externe

Relèvent de `integrations` et non du coeur de `returns` :

- portails externes de retour ;
- labels retour transporteur ;
- WMS retour externes.

Le domaine `returns` garde la vérité interne de la demande et du traitement de retour.

---

## Rôle

Le domaine `returns` porte la vérité métier du retour après commande.

Il constitue la source de vérité interne pour :

- l’existence d’une demande ou d’un dossier de retour ;
- les lignes concernées ;
- le motif de retour ;
- le statut du retour ;
- la décision de remboursement, échange ou remise à disposition si activée ;
- l’articulation avec paiement, disponibilité, documents et shipping.

Le domaine est distinct :

- de `orders`, qui reste la vérité de la commande source ;
- de `payments`, qui reste la vérité du remboursement ;
- de `availability`, qui décide la remise en disponibilité ;
- de `documents`, qui porte les documents d’avoir ou retour ;
- de `shipping`, qui peut porter la logistique de retour.

---

## Responsabilités

Le domaine `returns` prend en charge :

- la création d’une demande de retour ;
- l’identification des lignes retournées ;
- la qualification du retour ;
- le lifecycle du retour ;
- la décision interne de traitement (accepté, refusé, remboursé, échangé, restocké selon capabilities) ;
- l’orchestration cohérente avec les domaines avals ;
- la traçabilité des étapes du retour.

---

## Ce que le domaine ne doit pas faire

Le domaine `returns` ne doit pas :

- rembourser lui-même sans passer par `payments` ;
- recréer la commande source ;
- redéfinir seul la disponibilité ou le restock ;
- devenir un simple workflow support sans vérité métier ;
- dépendre entièrement d’un portail externe.

---

## Source de vérité

Le domaine `returns` est la source de vérité pour :

- le retour lui-même ;
- son statut ;
- ses lignes ;
- sa qualification ;
- son traitement métier.

Le domaine n’est pas la source de vérité pour :

- le remboursement financier effectif ;
- la commande source ;
- la disponibilité finale ;
- les documents d’avoir ;
- la logistique externe de retour.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `Return`
- `ReturnLine`
- `ReturnStatus`
- `ReturnReason`
- `RefundDecision`
- `ExchangeDecision`
- `RestockDecision`

_Les objets `RefundDecision`, `ExchangeDecision` et `RestockDecision` sont des objets de décision métier. Ils ne donnent pas nécessairement lieu à une entité de persistance dédiée dans le schéma par défaut, qui peut condenser ces décisions autour du dossier de retour et de ses lignes._

---

## Capabilities activables liées

Le domaine `returns` est lié aux capabilities suivantes :

- `returns`
- `partialReturns`
- `exchangeRequests`
- `refundRequests`
- `restocking`
- `returnShipping`
- `returnDocuments`

### Effet si `returns` est activée

Le domaine existe et porte des demandes de retour.

### Effet si `partialReturns` est activée

Le domaine peut gérer des retours partiels par ligne ou quantité.

### Effet si `exchangeRequests` est activée

Le domaine peut porter des demandes d’échange en plus du remboursement.

### Effet si `refundRequests` est activée

Le domaine peut piloter une intention de remboursement via `payments`.

### Effet si `restocking` est activée

Le domaine peut déclencher une décision de remise à disposition ou non, sans devenir `availability`.

### Effet si `returnShipping` est activée

Le domaine peut se coordonner avec une logique d’acheminement retour.

### Effet si `returnDocuments` est activée

Le domaine peut se coordonner avec `documents` pour des documents de retour ou d’avoir.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

- demande de retour simple ;
- acceptation / refus ;
- remboursement simple si nécessaire.

### Niveau 2 — standard

- retours partiels ;
- meilleure qualification des motifs ;
- meilleure coordination avec documents et remboursements.

### Niveau 3 — avancé

- échanges ;
- restocking ;
- retour logistique plus structuré ;
- meilleure orchestration avec availability et shipping.

### Niveau 4 — expert / multi-contraintes

- retours très structurés ;
- politiques plus riches ;
- plus forte gouvernance et observability ;
- intégrations retour plus denses.

---

## Entrées

Le domaine reçoit principalement :

- une commande source ;
- des lignes de commande ;
- des demandes de retour ;
- des décisions opérateur ;
- des résultats de remboursement via `payments` ;
- des décisions de remise à disposition via `availability` ;
- des résultats externes traduits de portails ou transporteurs retour si activés.

---

## Sorties

Le domaine expose principalement :

- un dossier de retour ;
- un statut de retour ;
- des lignes de retour ;
- des décisions métier liées au retour ;
- des événements liés aux étapes du retour.

---

## Dépendances vers autres domaines

Le domaine `returns` dépend de :

- `orders`
- `payments`
- `availability`
- `shipping`
- `documents`
- `audit`
- `observability`

Les domaines suivants dépendent de `returns` :

- `payments`
- `availability`
- `documents`
- `analytics`
- `customer-support`

---

## Dépendances vers providers / intégrations

Le domaine `returns` peut se coordonner avec des systèmes externes via `integrations`, mais garde une vérité locale.

Les portails de retour ou transporteurs ne remplacent pas le domaine.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `customer_support`
- `order_manager`
- `fulfillment_operator`
- `customer`

### Permissions

Exemples de permissions concernées :

- `returns.read`
- `returns.write`
- `returns.approve`
- `returns.reject`
- `returns.restock`
- `payments.read`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `return.created`
- `return.approved`
- `return.rejected`
- `return.received`
- `return.refund.requested`
- `return.exchange.requested`
- `return.restock.requested`
- `return.completed`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `order.created`
- `payment.refunded`
- `document.generated`
- `shipping.status.changed`
- `availability.updated`
- `integration.return.result.translated`

---

## Données sensibles / sécurité

Le domaine `returns` porte une donnée métier sensible.

Points de vigilance :

- le retour touche commande, argent, stock et support ;
- un retour ne doit pas être créé librement sans rattachement à une commande valide ;
- les décisions opérateur doivent être traçables ;
- les remboursements ne doivent pas être exécutés directement ici ;
- les données client et produit liées au retour doivent rester gouvernées.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un retour a été créé ;
- quelles lignes sont concernées ;
- pourquoi il a été accepté ou rejeté ;
- si un remboursement ou échange a été demandé ;
- si un restock a été déclenché ou refusé.

### Audit

Il faut tracer :

- créations de retours ;
- validations / refus ;
- décisions de remboursement ;
- décisions de restock ;
- clôtures ;
- interventions support sensibles.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un retour est rattaché à une commande existante ;
- un retour possède un statut explicite ;
- un remboursement effectif reste dans `payments` ;
- une remise à disposition effective reste dans `availability` ;
- le domaine `returns` garde la vérité du workflow retour ;
- un projet sans capability `returns` n’expose pas ces parcours.

---

## Lifecycle et gouvernance des données

### États principaux

Les états principaux incluent typiquement :

- `REQUESTED`
- `APPROVED`
- `REJECTED`
- `RECEIVED`
- `REFUNDED`
- `COMPLETED`
- `CANCELLED`

### Transitions autorisées

Exemples :

- `REQUESTED -> APPROVED`
- `REQUESTED -> REJECTED`
- `APPROVED -> RECEIVED`
- `RECEIVED -> REFUNDED`
- `REFUNDED -> COMPLETED`
- `REQUESTED -> CANCELLED`

### Transitions interdites

Exemples :

- `REJECTED -> REFUNDED`
- `COMPLETED -> REQUESTED`
- considérer un retour annulé comme jamais existé.

### Règles de conservation / archivage / suppression

- les retours restent traçables ;
- les décisions liées au remboursement et au restock restent compréhensibles ;
- la suppression physique n’est pas le comportement par défaut.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’un retour ;
- création des lignes de retour ;
- changement de statut structurant ;
- décision de remboursement demandée au domaine adéquat ;
- décision de restock demandée au domaine adéquat ;
- écriture des événements `return.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- remboursement effectif par `payments` ;
- remise à disposition effective par `availability` ;
- génération documentaire ;
- étiquette retour externe ;
- analytics ;
- notifications.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les décisions structurantes ;
- garde sur l’état courant du retour ;
- cohérence avec les lignes de commande source ;
- déduplication des demandes répétées.

Les conflits attendus sont :

- double demande de retour ;
- double remboursement logique ;
- retour et annulation concurrente ;
- restock concurrent.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `create-return` : clé d’intention = `(orderId, returnIntentId)`
- `approve-return` : clé d’intention = `(returnId, approvalIntentId)`
- `reject-return` : clé d’intention = `(returnId, rejectionIntentId)`
- `request-return-refund` : clé d’intention = `(returnId, refundIntentId)`
- `request-return-restock` : clé d’intention = `(returnId, restockIntentId)`

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `return.created`
- `return.approved`
- `return.rejected`
- `return.received`
- `return.refund.requested`
- `return.exchange.requested`
- `return.restock.requested`
- `return.completed`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- remboursement externe ;
- restock externe ;
- génération documentaire ;
- transport retour externe ;
- analytics ;
- notifications.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M2` dès qu’on active les retours ;
- `M3` pour retours partiels, échanges ou restocking ;
- `M4` pour politiques retour plus riches ou fortement intégrées.

### Pourquoi

Le domaine `returns` crée vite une forte charge support et touche argent, stock et expérience client.

### Points d’exploitation à surveiller

- retours en attente ;
- refus ;
- remboursements non clos ;
- restocks en attente ;
- écarts entre retour et commande source.

---

## Impact coût / complexité

Le coût du domaine `returns` monte principalement avec :

- `partialReturns`
- `exchangeRequests`
- `refundRequests`
- `restocking`
- `returnShipping`
- `returnDocuments`

Lecture relative du coût :

- niveau 1 : `C2`
- niveau 2 : `C3`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Créer une demande de retour
2. Accepter ou rejeter un retour
3. Demander un remboursement
4. Déclencher un restock
5. Clôturer un retour

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- commande introuvable ;
- lignes de retour invalides ;
- double demande ;
- statut invalide ;
- remboursement déjà demandé ;
- restock incohérent ;
- retour externe ambigu ;
- clôture prématurée.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `returns` est un domaine optionnel toggleable ;
- il porte la vérité métier du retour ;
- il reste distinct de `payments`, `availability`, `shipping` et `documents` ;
- les effets lourds partent après commit ;
- le domaine garde la cohérence du workflow retour ;
- la sophistication monte par capabilities et niveaux.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `returns` n’est pas obligatoire pour tous les projets ;
- dès qu’il est activé, il devient un vrai domaine métier ;
- les remboursements restent dans `payments` ;
- le restock reste dans `availability` ;
- les portails de retour externes restent des intégrations ;
- la traçabilité du retour est non négociable.
