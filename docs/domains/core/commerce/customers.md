# Clients

## Rôle

Le domaine `customers` porte la représentation métier du client dans le système.

Il définit :

- ce qu’est un client du point de vue métier ;
- comment un client est identifié indépendamment des mécanismes d’authentification ;
- quelles informations structurantes sont associées à un client ;
- comment le client est utilisé dans les parcours commerciaux et transactionnels ;
- quelles relations métier existent entre le client et les autres domaines.

Le domaine existe pour fournir une entité client stable, indépendante :

- de l’authentification ;
- des comptes techniques ;
- des sessions ;
- des intégrations externes.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur`

### Activable

`non`

Le domaine `customers` est non optionnel dans un système transactionnel.
Sans lui, le système ne peut pas porter correctement la notion de client métier.

---

## Source de vérité

Le domaine `customers` est la source de vérité pour :

- l’identité métier du client ;
- les attributs métier du client ;
- les informations nécessaires aux parcours commerciaux et transactionnels ;
- la relation entre un client et ses commandes ;
- la représentation interne du client dans le système.

Le domaine `customers` n’est pas la source de vérité pour :

- l’authentification, qui relève de `auth` ;
- les rôles et permissions ;
- les sessions ;
- les comptes techniques internes ;
- les projections CRM externes ;
- les données purement marketing ou analytiques ;
- les préférences purement applicatives non métier ;
- les mécanismes de consentement, sauf si explicitement rattachés au client métier.

Le client est une entité métier.
Il ne doit pas être confondu avec un utilisateur technique.

---

## Responsabilités

Le domaine `customers` est responsable de :

- définir ce qu’est un client dans le système ;
- attribuer et maintenir l’identité métier du client ;
- porter les informations structurantes du client ;
- garantir la cohérence des données client ;
- exposer une représentation exploitable aux domaines consommateurs ;
- encadrer les mutations du client ;
- publier les événements significatifs liés au client ;
- servir de point de référence pour :
  - `orders`
  - `payments`
  - `checkout`
  - `cart`
  - `loyalty`, si applicable
  - `crm`, si intégré

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- adresses associées au client ;
- informations de facturation ;
- segmentation métier ;
- historique structuré du client ;
- rattachement multi-comptes si nécessaire.

---

## Non-responsabilités

Le domaine `customers` n’est pas responsable de :

- authentifier un utilisateur ;
- gérer les sessions ;
- définir les rôles et permissions ;
- gérer les comptes opérateurs internes ;
- porter les mécanismes de login ou d’identité technique ;
- gérer la logique complète CRM externe ;
- gouverner les intégrations ;
- gérer les webhooks ;
- porter les données analytiques ;
- exécuter les actions marketing ;
- maintenir les projections SEO ou search.

Le domaine `customers` ne doit pas devenir :

- un doublon de `users` ;
- ni un conteneur global de toutes les données liées à une personne.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- un client doit avoir une identité interne stable ;
- un client doit être identifiable de manière non ambiguë ;
- les données structurantes doivent rester cohérentes ;
- un client ne doit pas être simultanément actif et supprimé ;
- une mutation du client ne doit pas créer de duplication silencieuse ;
- les relations avec les commandes doivent rester cohérentes ;
- un client ne doit pas dépendre implicitement d’un mécanisme d’authentification pour exister.

Le domaine doit garantir la cohérence métier du client, pas seulement stocker des informations.

---

## Dépendances

### Dépendances métier

Le domaine `customers` interagit fortement avec :

- `orders`
- `cart`
- `checkout`
- `payments`
- `pricing`
- `loyalty`, si applicable
- `crm`, si intégré

### Dépendances transverses

Le domaine dépend également de :

- audit ;
- observabilité ;
- jobs ;
- consent, si applicable ;
- notifications ;
- intégrations.

### Dépendances externes

Le domaine peut interagir avec :

- CRM ;
- ERP ;
- outils marketing ;
- outils de support ;
- systèmes d’identité externes.

### Règle de frontière

Le domaine `customers` porte la vérité métier du client.
Les autres systèmes peuvent consommer ou enrichir cette information, mais ne doivent pas la redéfinir sans gouvernance explicite.

---

## Événements significatifs

Le domaine `customers` publie ou peut publier des événements significatifs tels que :

- client créé ;
- client mis à jour ;
- client supprimé ou anonymisé ;
- adresse ajoutée ou modifiée ;
- informations client modifiées ;
- segmentation modifiée ;
- rattachement client-commande ;
- changement de statut client.

Le domaine peut consommer des signaux liés à :

- création de commande ;
- mise à jour CRM ;
- synchronisation externe ;
- actions marketing ;
- consentement, si applicable.

Les noms exacts doivent rester dans le langage métier du système.

---

## Cycle de vie

Le domaine `customers` possède un cycle de vie métier.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- actif ;
- inactif ;
- supprimé ou anonymisé.

Des états supplémentaires peuvent exister :

- en cours de validation ;
- bloqué ;
- fusionné avec un autre client ;
- segmenté.

Les transitions doivent être explicites et traçables.

Le domaine doit éviter :

- les états purement techniques ;
- les dépendances implicites à des systèmes externes.

---

## Interfaces et échanges

Le domaine `customers` expose principalement :

- des commandes de création et mise à jour ;
- des lectures du référentiel client ;
- des lectures adaptées aux domaines consommateurs ;
- des événements significatifs liés au client.

Le domaine reçoit principalement :

- des données issues du checkout ;
- des données issues de la commande ;
- des synchronisations CRM ;
- des enrichissements externes ;
- des actions opératoires.

Le domaine ne doit pas exposer un modèle instable ou dépendant d’un fournisseur.

---

## Contraintes d’intégration

Le domaine `customers` peut être exposé à des contraintes telles que :

- synchronisations CRM ;
- import de données client ;
- duplication de profils ;
- fusion de clients ;
- anonymisation (RGPD) ;
- divergence entre systèmes internes et externes ;
- mise à jour partielle ;
- ordre de réception non garanti.

Règles minimales :

- les entrées externes doivent être validées ;
- la duplication doit être contrôlée ;
- la fusion doit être explicite et traçable ;
- les données sensibles doivent être gouvernées ;
- un système externe ne doit pas écraser silencieusement la vérité interne ;
- les mutations doivent être idempotentes si rejouables.

---

## Observabilité et audit

Le domaine `customers` doit rendre visibles au minimum :

- la création du client ;
- les modifications significatives ;
- les suppressions ou anonymisations ;
- les fusions ;
- les erreurs de validation ;
- les synchronisations ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quel client a changé ;
- quand ;
- selon quelle origine ;
- avec quel impact métier ;
- sur quelles données ;
- à la suite de quelle action.

L’observabilité doit distinguer :

- erreur métier ;
- erreur technique ;
- conflit de données ;
- duplication ;
- divergence externe.

---

## Impact de maintenance / exploitation

Le domaine `customers` a un impact d’exploitation élevé.

Raisons :

- il est central pour les parcours commerciaux ;
- il relie plusieurs domaines coeur ;
- il est exposé aux synchronisations externes ;
- ses erreurs impactent directement la commande, le paiement et la relation client.

En exploitation, une attention particulière doit être portée à :

- la cohérence des données ;
- la duplication ;
- la fusion ;
- la traçabilité des changements ;
- la synchronisation avec les systèmes externes ;
- les opérations sensibles (suppression, anonymisation).

Le domaine doit être considéré comme critique pour la cohérence métier globale.

---

## Limites du domaine

Le domaine `customers` s’arrête :

- avant l’authentification (`auth`) ;
- avant les rôles et permissions ;
- avant les sessions ;
- avant la logique CRM complète ;
- avant les mécanismes d’intégration ;
- avant les webhooks ;
- avant les projections analytiques et marketing ;
- avant les mécanismes de sécurité.

Le domaine porte le client comme entité métier.
Il ne doit pas absorber toutes les dimensions techniques ou périphériques liées à une personne.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `customers` et `users` ;
- la relation exacte entre `customers` et `auth` ;
- la gestion du multi-compte ou multi-identité ;
- la politique de fusion de clients ;
- la politique d’anonymisation ;
- la hiérarchie entre système interne et CRM externe ;
- la gestion des données sensibles ;
- la segmentation métier vs marketing.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../../architecture/10-fondations/10-principes-d-architecture.md`
- `../../../architecture/10-fondations/11-modele-de-classification.md`
- `../../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `orders.md`
- `cart.md`
- `checkout.md`
- `../../optional/commerce/payments.md`
- `pricing.md`
- `../foundation/auth.md`
- `../foundation/users.md`
- `../../cross-cutting/crm.md`
