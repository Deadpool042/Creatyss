# Paiements

## Rôle

Le domaine `payments` porte la logique métier de paiement du système.

Il définit :

- comment une intention ou une obligation de paiement est représentée ;
- quels états de paiement sont reconnus par le système ;
- comment les autorisations, captures, refus, échecs, annulations et remboursements sont interprétés ;
- quels faits de paiement sont suffisamment stables pour être exposés au reste du système ;
- comment le système relie une commande à son exécution de paiement sans laisser un fournisseur externe imposer sa propre grammaire métier.

Le domaine existe pour fournir une vérité interne sur le statut et l’historique métier du paiement, distincte :

- de la commande ;
- du fournisseur de paiement ;
- des webhooks ;
- des appels techniques aux API externes.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur`

### Activable

`non`

Le domaine `payments` est non optionnel dans un système transactionnel où la commande donne lieu à encaissement.
Sans lui, le système ne peut pas porter correctement l’état métier du règlement.

---

## Source de vérité

Le domaine `payments` est la source de vérité pour :

- la représentation interne du paiement ;
- l’identité interne des objets de paiement portés par le système ;
- les statuts métier de paiement ;
- l’interprétation interne des événements externes de paiement ;
- les transitions métier liées au paiement ;
- la relation métier entre commande et état de règlement ;
- les événements de paiement publiés au reste du système.

Le domaine `payments` n’est pas la source de vérité pour :

- le cycle de vie de la commande, qui relève de `orders` ;
- la tarification ou le montant calculé en amont, qui relèvent de `pricing` ;
- la fiscalité, qui relève de `taxation` ;
- les détails techniques du PSP ;
- les webhooks comme mécanisme d’entrée ;
- l’authentification et les autorisations ;
- les projections externes vers ERP, CRM ou analytics.

Un fournisseur externe peut exécuter des opérations de paiement, mais il ne doit pas devenir la source conceptuelle de la vérité métier interne.

---

## Responsabilités

Le domaine `payments` est responsable de :

- représenter le paiement comme objet métier ;
- associer un paiement à une commande ou à un engagement payable ;
- interpréter les états de paiement dans le langage du système ;
- encadrer les transitions d’état liées au règlement ;
- exposer une vue fiable de la situation de paiement au reste du système ;
- gérer la cohérence des autorisations, captures, refus, échecs et remboursements ;
- publier les événements significatifs liés au paiement ;
- protéger le système contre les ambiguïtés liées aux signaux externes ;
- permettre au reste du système de savoir si une commande est impayée, autorisée, capturée, partiellement remboursée, remboursée, en échec ou dans tout autre état reconnu.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- paiements multiples pour une même commande ;
- paiements partiels ;
- remboursements partiels ;
- tentatives successives ;
- expiration d’une autorisation ;
- réconciliation métier entre signaux externes et état interne.

---

## Non-responsabilités

Le domaine `payments` n’est pas responsable de :

- définir la commande ;
- calculer les montants de commande ;
- porter la logique complète de checkout ;
- exécuter les appels techniques aux API fournisseurs en tant que tels ;
- gouverner les webhooks comme mécanisme transverse ;
- maintenir les secrets, clés ou détails d’intégration sans frontière explicite ;
- définir la politique fiscale ;
- gérer l’expédition ou l’exécution logistique ;
- gouverner les autorisations d’accès ;
- porter l’observabilité globale du système ;
- administrer les projections marketing, CRM ou SEO.

Le domaine `payments` ne doit pas devenir :

- un simple miroir de Stripe ou d’un autre PSP ;
- ni une annexe de `orders` sans autonomie de sens.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- un paiement doit avoir une identité interne stable ;
- un paiement doit être rattaché à un contexte métier interprétable ;
- un paiement ne doit pas porter des états métier incompatibles en même temps ;
- une transition d’état doit respecter le cycle de vie autorisé ;
- un remboursement ne doit pas excéder ce qui est remboursable selon les règles du système ;
- une capture ne doit pas être interprétée comme une autorisation simple ;
- un signal externe ne doit pas provoquer une transition incohérente sans contrôle ;
- un paiement ne doit pas être simultanément considéré comme entièrement capturé et totalement échoué ;
- les événements publiés doivent correspondre à un fait métier réellement établi.

Le domaine doit protéger la cohérence métier du règlement, pas seulement relayer des réponses de PSP.

---

## Dépendances

### Dépendances métier

Le domaine `payments` interagit fortement avec :

- `orders`
- `checkout`
- `pricing`
- `customers`
- `taxation`

### Dépendances transverses

Le domaine dépend également de :

- audit ;
- observabilité ;
- jobs ;
- intégrations ;
- webhooks ;
- mécanismes d’idempotence et de retry.

### Dépendances externes

Le domaine peut dépendre de :

- PSP ;
- outils antifraude ;
- systèmes comptables ;
- ERP ;
- systèmes de réconciliation.

### Règle de frontière

Le domaine `payments` porte la vérité métier du règlement.
Les intégrations, webhooks et API clients fournissent des signaux ou des moyens techniques, mais ne doivent pas absorber cette responsabilité.

---

## Événements significatifs

Le domaine `payments` publie ou peut publier des événements significatifs tels que :

- paiement initié ;
- paiement autorisé ;
- paiement capturé ;
- paiement refusé ;
- paiement échoué ;
- paiement annulé ;
- paiement expiré ;
- remboursement initié ;
- remboursement partiel effectué ;
- remboursement total effectué ;
- statut de paiement changé ;
- réconciliation de paiement effectuée.

Le domaine peut consommer des signaux liés à :

- confirmation du checkout ;
- création de commande ;
- webhooks fournisseurs ;
- réponses API de PSP ;
- jobs de réconciliation ;
- annulation de commande ;
- demande de remboursement.

Les noms exacts doivent rester dans le langage métier du système, pas dans celui du fournisseur.

---

## Cycle de vie

Le domaine `payments` possède un cycle de vie métier structurant.

Le cycle exact dépend du modèle retenu, mais il doit au minimum distinguer :

- initié ;
- en attente ;
- autorisé ;
- capturé ;
- refusé ;
- échoué ;
- annulé ;
- remboursé partiellement ;
- remboursé totalement ;
- expiré, si ce statut est pertinent.

Le système peut également distinguer :

- en cours de réconciliation ;
- en litige ;
- en attente d’action opérateur ;
- partiellement capturé, si le modèle l’autorise.

Les transitions doivent être explicites et gouvernées.

Le domaine doit éviter :

- les statuts purement techniques ;
- les états calqués directement sur un fournisseur ;
- les transitions implicites non traçables.

---

## Interfaces et échanges

Le domaine `payments` expose principalement :

- des commandes d’initialisation de paiement ;
- des commandes de changement d’état métier lorsqu’elles sont légitimes ;
- des lectures de l’état de paiement ;
- des lectures de synthèse pour `orders`, `checkout` et l’exploitation ;
- des événements significatifs liés au paiement.

Le domaine reçoit principalement :

- des demandes issues de `checkout` ou `orders` ;
- des signaux externes traduits par les couches d’intégration ;
- des demandes de remboursement ;
- des résultats de réconciliation ;
- des demandes opératoires encadrées.

Le domaine ne doit pas exposer sa logique métier sous la forme d’un simple proxy de fournisseur.

---

## Contraintes d’intégration

Le domaine `payments` est fortement exposé aux contraintes d’intégration.

Ces contraintes incluent typiquement :

- webhooks dupliqués ;
- délais de propagation ;
- ordre de réception non garanti ;
- réponses contradictoires ou tardives ;
- retries ;
- autorisations qui expirent ;
- captures différées ;
- remboursements partiels ;
- divergence entre état fournisseur et état interne ;
- échecs partiels de traitement.

Règles minimales :

- tout signal externe doit être validé et normalisé ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un fournisseur ne doit pas imposer directement un état métier incohérent ;
- les erreurs partielles doivent être visibles ;
- la stratégie de reprise ou de réconciliation doit être explicite ;
- un webhook ne doit jamais être traité comme une vérité brute sans garde-fous.

---

## Observabilité et audit

Le domaine `payments` doit rendre visibles au minimum :

- l’initialisation du paiement ;
- les changements d’état significatifs ;
- les refus et échecs ;
- les remboursements ;
- les duplications de signaux ;
- les écarts de réconciliation ;
- les reprises opératoires ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quel paiement a changé ;
- quand ;
- à la suite de quel signal ;
- avec quel lien vers la commande ;
- selon quelle origine ;
- avec quel impact métier visible.

L’observabilité doit distinguer :

- erreur métier de transition ;
- erreur technique de traitement ;
- signal externe dupliqué ;
- divergence fournisseur / système interne ;
- reprise ou correction manuelle.

---

## Impact de maintenance / exploitation

Le domaine `payments` a un impact d’exploitation très élevé.

Raisons :

- il conditionne la validité économique de la commande ;
- il dépend fortement de systèmes externes ;
- il est exposé aux duplications, retards et incohérences ;
- ses erreurs ont un impact financier et client immédiat ;
- il nécessite une forte traçabilité opératoire.

En exploitation, une attention particulière doit être portée à :

- la clarté des statuts ;
- la réconciliation ;
- les signaux en échec ou en attente ;
- les remboursements ;
- les écarts avec l’état fournisseur ;
- les actions manuelles ;
- les paiements bloqués ou ambigus.

Le domaine doit être considéré comme critique pour la robustesse transactionnelle du système.

---

## Limites du domaine

Le domaine `payments` s’arrête :

- avant la définition de la commande ;
- avant la définition du prix ;
- avant la fiscalité ;
- avant les mécanismes techniques d’intégration eux-mêmes ;
- avant le transport brut des webhooks ;
- avant la gouvernance globale des accès ;
- avant les projections externes non directement liées à la vérité de paiement.

Le domaine `payments` porte le paiement comme objet métier.
Il ne doit pas absorber :

- la logique complète de `orders` ;
- ni la logique complète des intégrations techniques.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `payments` et `orders` ;
- la frontière exacte entre `payments` et `checkout` ;
- le modèle de paiement : unique, multiple, partiel, fractionné ;
- la politique canonique de remboursement ;
- la place exacte de la réconciliation ;
- le niveau d’autorité des signaux PSP sur les transitions internes ;
- la prise en charge des litiges ou contestations ;
- la politique opératoire en cas de divergence durable.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/10-principes-d-architecture.md`
- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../../architecture/30-execution/32-integrations-et-adaptateurs-fournisseurs.md`
- `../../architecture/30-execution/33-modele-de-defaillance-et-idempotence.md`
- `checkout.md`
- `orders.md`
- `pricing.md`
- `customers.md`
- `taxation.md`
- `integrations.md`
- `webhooks.md`
