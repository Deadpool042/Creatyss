# Domaine `customers`

## Objectif

Ce document décrit le domaine `customers` dans la doctrine courante du socle.

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

Le domaine `customers` est structurant pour la réutilisabilité du socle, car il porte la vérité métier du client de la boutique.

Il doit permettre de couvrir :

- client invité ou enregistré ;
- contexte B2C ;
- contexte B2B si activé ;
- informations de contact ;
- adresses ;
- relation durable au commerce.

Le domaine `customers` ne doit pas être confondu avec :

- `auth`, qui porte l’accès ;
- `users`, qui peut porter une identité plus générale ;
- `orders`, qui fige un snapshot du client au moment de l’achat.

---

## Position dans la doctrine de modularité

Le domaine `customers` est classé comme :

- `domaine coeur à capabilities toggleables`

Le domaine existe dans tous les projets e-commerce sérieux.
En revanche, la richesse du modèle client varie selon le projet.

### Ce qui n’est jamais désactivé

Le domaine conserve toujours :

- une vérité interne sur le client métier ;
- une identité client stable ;
- une séparation entre client actuel et snapshot figé dans la commande ;
- une articulation claire avec `auth`, `checkout` et `orders`.

### Ce qui est activable / désactivable par capability

Le domaine `customers` est lié aux capabilities suivantes :

- `guestCheckout`
- `customerAccounts`
- `customerAddresses`
- `b2bCommerce`
- `vatValidation`
- `loyalty`
- `wishlist`

### Ce qui relève d’un niveau

Le domaine porte plusieurs niveaux de sophistication du contexte client.

### Ce qui relève d’un provider ou d’une intégration externe

Relèvent de `integrations` et non du coeur de `customers` :

- CRM externe ;
- imports clients ;
- enrichissements externes ;
- synchronisations marketing.

Le domaine `customers` garde la vérité interne du client métier utilisé par le socle.

---

## Rôle

Le domaine `customers` porte la vérité métier du client de la boutique.

Il constitue la source de vérité interne pour :

- l’identité client métier ;
- les informations client utiles au commerce ;
- les adresses si activées ;
- certaines distinctions B2C / B2B si activées ;
- le contexte client utilisé par `checkout`, `pricing`, `taxation` et `orders`.

Le domaine est distinct :

- de `auth`, qui porte les credentials et sessions ;
- de `orders`, qui fige un snapshot client à la commande ;
- de `blog` ou `loyalty`, qui peuvent exploiter le client sans en être la source de vérité ;
- de `integrations`, qui peut synchroniser un CRM sans remplacer le coeur.

---

## Responsabilités

Le domaine `customers` prend en charge :

- la création et gestion du client métier ;
- les informations de contact ;
- les adresses si activées ;
- les contextes B2B si activés ;
- les relations avec la boutique ;
- la mise à disposition d’un contexte client exploitable par les autres domaines ;
- la distinction entre client courant et snapshot figé à la commande.

---

## Ce que le domaine ne doit pas faire

Le domaine `customers` ne doit pas :

- porter l’authentification ;
- porter les credentials ;
- porter la commande ;
- devenir un CRM complet à lui seul ;
- laisser un système externe définir le client sans validation locale ;
- devenir un fourre-tout marketing.

---

## Source de vérité

Le domaine `customers` est la source de vérité pour :

- le client métier courant ;
- ses informations de contact métier ;
- ses adresses structurées si activées ;
- ses métadonnées commerciales utiles ;
- certaines qualifications client B2B / B2C.

Le domaine n’est pas la source de vérité pour :

- le credential de login ;
- les sessions ;
- les snapshots figés dans `orders` ;
- les systèmes externes CRM ;
- la fidélité ou wishlist si ces domaines existent séparément.

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `Customer`
- `CustomerStatus`
- `CustomerAddress`
- `CustomerType`
- `CustomerCompanyProfile`
- `CustomerContact`
- `CustomerStoreRelation`

---

## Capabilities activables liées

Le domaine `customers` est lié aux capabilities suivantes :

- `guestCheckout`
- `customerAccounts`
- `customerAddresses`
- `b2bCommerce`
- `vatValidation`
- `loyalty`
- `wishlist`

### Effet si `guestCheckout` est activée

Le domaine doit coexister avec des parcours sans client pleinement enregistré.

### Effet si `customerAccounts` est activée

Le domaine porte une relation plus durable et explicite au client enregistré.

### Effet si `customerAddresses` est activée

Le domaine gère des adresses structurées réutilisables.

### Effet si `b2bCommerce` est activée

Le domaine distingue des profils entreprise ou assimilés.

### Effet si `vatValidation` est activée

Le domaine peut porter certaines informations structurées utiles à la validation B2B.

### Effet si `loyalty` est activée

Le domaine peut être relié à une logique de fidélité sans devenir cette logique.

### Effet si `wishlist` est activée

Le domaine peut être relié à une logique de wishlist sans en devenir la source de vérité.

---

## Niveaux de sophistication du domaine

### Niveau 1 — essentiel

- client simple ;
- contact de base ;
- peu de structure ;
- parcours invité ou faible compte client.

### Niveau 2 — standard

- comptes clients ;
- adresses ;
- meilleure persistance ;
- meilleur contexte checkout.

### Niveau 3 — avancé

- contexte B2B ;
- plusieurs adresses ;
- enrichissement du profil métier ;
- meilleure gouvernance du client.

### Niveau 4 — expert / multi-contraintes

- profil client fortement structuré ;
- exigences plus riches d’intégration, d’exploitation ou de segmentation métier.

---

## Entrées

Le domaine reçoit principalement :

- des commandes de création ou mise à jour de client ;
- des changements d’adresse ;
- des rattachements auth -> customer ;
- des signaux de qualification B2B ;
- des imports ou résultats externes traduits.

---

## Sorties

Le domaine expose principalement :

- un client métier ;
- un contexte client exploitable ;
- des adresses ;
- une distinction B2C / B2B ;
- des événements internes liés au client.

---

## Dépendances vers autres domaines

Le domaine `customers` dépend de :

- `stores`
- `auth`
- `audit`
- `observability`

Les domaines suivants dépendent de `customers` :

- `pricing`
- `checkout`
- `orders`
- `taxation`
- `analytics`
- `loyalty` si activé
- `wishlist` si activé

---

## Dépendances vers providers / intégrations

Le domaine `customers` peut être synchronisé avec des systèmes externes via `integrations`, mais garde une vérité locale.

Les imports CRM ou enrichissements externes ne deviennent pas la vérité coeur sans traduction ni validation.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `customer_support`
- `customer`

### Permissions

Exemples de permissions concernées :

- `customers.read`
- `customers.write`
- `customers.addresses.manage`
- `customers.b2b.manage`
- `audit.read`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `customer.created`
- `customer.updated`
- `customer.address.updated`
- `customer.type.changed`
- `customer.disabled`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `auth.identity.created`
- `auth.identity.locked`
- `integration.customer.result.translated`
- `store.capabilities.updated`

---

## Données sensibles / sécurité

Le domaine `customers` porte une donnée métier sensible.

Points de vigilance :

- informations de contact et adresses ;
- distinction entre donnée client courante et snapshot de commande ;
- contrôle d’accès aux données client ;
- imports externes validés ;
- séparation avec auth et secrets.

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un client a été créé ou modifié ;
- quel contexte client est utilisé au checkout ;
- si une adresse a changé ;
- si une qualification B2B a été activée.

### Audit

Il faut tracer :

- création de client ;
- changements d’adresse significatifs ;
- changements de type client ;
- désactivations ;
- imports externes structurants.

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un client métier possède une identité stable ;
- `customers` reste distinct de `auth` ;
- `orders` fige un snapshot du client, pas l’objet client courant ;
- les autres domaines lisent le contexte client, ils ne le redéfinissent pas ;
- un projet simple ne porte pas d’emblée toute la richesse B2B si elle n’est pas activée.

---

## Lifecycle et gouvernance des données

### États principaux

Les états principaux incluent typiquement :

- `ACTIVE`
- `DISABLED`
- `ARCHIVED`

### Transitions autorisées

Exemples :

- `ACTIVE -> DISABLED`
- `DISABLED -> ACTIVE`
- `ACTIVE -> ARCHIVED`

### Transitions interdites

Exemples :

- une réactivation implicite d’un client archivé ;
- confusion entre désactivation client et suppression des commandes liées.

### Règles de conservation / archivage / suppression

- le client courant peut évoluer sans réécrire le passé des commandes ;
- les commandes gardent leur snapshot ;
- les données client restent gouvernées selon une politique explicite ;
- la suppression physique n’est pas le comportement par défaut des objets structurants.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Les opérations suivantes doivent réussir ou échouer ensemble :

- création d’un client ;
- changement structurant de statut ;
- mise à jour d’adresse structurante ;
- changement de type client ;
- écriture des événements `customer.*` correspondants.

### Ce qui peut être eventual consistency

Les traitements suivants peuvent partir après commit :

- synchronisation CRM ;
- analytics ;
- enrichissements externes ;
- notifications ;
- projections marketing.

### Stratégie de concurrence

Le domaine protège explicitement ses invariants par :

- transaction applicative sur les changements structurants ;
- unicité logique du client dans son contexte pertinent ;
- séparation entre client courant et snapshot d’ordre ;
- validation des imports externes.

Les conflits attendus sont :

- double création logique ;
- modification d’adresse concurrente ;
- import externe concurrent ;
- désactivation concurrente avec usage checkout.

### Idempotence

Les commandes métier suivantes doivent être idempotentes :

- `upsert-customer` : clé d’intention = `(customerRef, changeIntentId)`
- `upsert-customer-address` : clé d’intention = `(customerId, addressRef, changeIntentId)`
- `apply-external-customer-result` : clé d’intention = `(providerName, externalEventId)`

### Domain events écrits dans la même transaction

Les événements suivants sont persistés dans l’outbox dans la même transaction que la mutation source :

- `customer.created`
- `customer.updated`
- `customer.address.updated`
- `customer.type.changed`
- `customer.disabled`

### Effets secondaires après commit

Les traitements suivants ne doivent jamais être exécutés dans la transaction principale :

- sync CRM ;
- notifications ;
- analytics ;
- segmentation externe ;
- enrichissements externes.

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

- `M1` pour client simple ;
- `M2` pour comptes et adresses ;
- `M3` pour B2B ou forte intégration CRM ;
- `M4` pour contexte client très gouverné ou fortement intégré.

### Pourquoi

Le domaine `customers` touche données sensibles, checkout, taxation, commandes et support.

### Points d’exploitation à surveiller

- créations ;
- incohérences client / auth ;
- adresses ;
- conflits d’import ;
- dérive B2B / B2C ;
- usages checkout.

---

## Impact coût / complexité

Le coût du domaine `customers` monte principalement avec :

- `customerAccounts`
- `customerAddresses`
- `b2bCommerce`
- `vatValidation`
- `loyalty`
- `wishlist`
- les intégrations CRM.

Lecture relative du coût :

- niveau 1 : `C1`
- niveau 2 : `C2`
- niveau 3 : `C3`
- niveau 4 : `C4`

---

## Cas d’usage principaux

1. Créer un client métier
2. Mettre à jour son profil
3. Gérer des adresses
4. Exposer un contexte client au checkout
5. Alimenter pricing, taxation et orders

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- client introuvable ;
- adresse introuvable ;
- qualification B2B incohérente ;
- rattachement auth / customer ambigu ;
- import externe ambigu ;
- client désactivé utilisé dans un parcours inadapté.

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- `customers` est un domaine coeur à capabilities toggleables ;
- le client métier est distinct de l’auth ;
- le client courant est distinct du snapshot de commande ;
- le domaine peut monter vers B2B sans imposer cette complexité à tous les projets ;
- les systèmes externes CRM restent à la frontière ;
- la gouvernance des données client est explicite ;
- les objets de profil B2B (`CustomerType`, `CustomerCompanyProfile`) ne font pas partie du schéma par défaut ; ils nécessitent une extension explicite du schéma de persistance, subordonnée à l'activation de la capability `b2bCommerce`.

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- `customers` appartient au coeur du socle ;
- il ne se confond ni avec `auth`, ni avec `orders` ;
- la richesse du modèle client varie par capabilities et niveaux ;
- les snapshots de commande figent le contexte client au moment de l’achat ;
- les intégrations CRM éventuelles restent des intégrations ;
- les données client doivent rester gouvernées et auditables.
