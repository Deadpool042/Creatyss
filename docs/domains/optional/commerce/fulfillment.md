# Fulfillment

## Rôle

Le domaine `fulfillment` porte l'exécution logistique de la commande.

Il définit :

- comment une commande ou une partie de commande est préparée ;
- comment les unités sont prélevées, emballées, regroupées ou remises à l'expédition ;
- comment le système représente l'avancement de l'exécution logistique ;
- comment les opérations d'exécution sont suivies.

Le domaine existe pour fournir une vérité d'exécution logistique, distincte :

- de la commande ;
- de l'expédition ;
- de l'inventaire ;
- de la disponibilité vendable.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`élevé`

### Activable

`non`

Le domaine `fulfillment` est une capacité optionnelle au niveau projet. Il est pertinent dès lors que le système orchestre directement l'exécution logistique.

---

## Source de vérité

Le domaine `fulfillment` est la source de vérité pour :

- les opérations de préparation logistique ;
- l'état d'exécution d'un lot, d'une préparation ou d'un traitement logistique ;
- les unités préparées, prélevées ou remises à l'expédition selon le modèle retenu ;
- les événements significatifs d'exécution logistique.

Le domaine `fulfillment` n'est pas la source de vérité pour :

- la commande, qui relève de `orders` ;
- le stock global, qui relève de `inventory` ;
- la disponibilité vendable, qui relève de `availability` ;
- l'expédition au sens suivi de livraison, qui relève de `shipping`.

Le fulfillment exécute.
Il ne décide pas seul de ce qui est vendable ni de ce qui est livré au sens client.

---

## Responsabilités

Le domaine `fulfillment` est responsable de :

- représenter les opérations logistiques d'exécution ;
- suivre la préparation d'une commande ou d'une partie de commande ;
- exposer un état d'avancement logistique ;
- publier les événements significatifs liés à l'exécution ;
- garantir la cohérence interne des opérations qu'il porte ;
- servir de point d'ancrage pour la préparation avant expédition.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- picking ;
- packing ;
- regroupement de lots ;
- split de commande ;
- exécution partielle ;
- remise au transporteur ;
- statut de préparation par unité ou ligne.

---

## Non-responsabilités

Le domaine `fulfillment` n'est pas responsable de :

- définir la commande ;
- décider de la disponibilité vendable ;
- maintenir la vérité globale de stock ;
- suivre la livraison au client final ;
- gérer le paiement ;
- calculer le prix ;
- gouverner les intégrations transporteurs de haut niveau.

Le domaine `fulfillment` ne doit pas devenir :

- un alias de `shipping` ;
- ni un alias de `inventory`.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- une opération de fulfillment doit être rattachée à un contexte interprétable ;
- un état d'exécution doit être cohérent ;
- une exécution terminée ne doit pas redevenir "en préparation" sans règle explicite ;
- une exécution partielle doit être visible comme telle ;
- les événements publiés doivent refléter une réalité opérationnelle réellement établie.

Le domaine protège la vérité d'exécution, pas la vérité commerciale ni la vérité de stock globale.

---

## Dépendances

### Dépendances métier

Le domaine `fulfillment` interagit fortement avec :

- `orders`
- `inventory`
- `shipping`
- `customers`

### Dépendances transverses

Le domaine dépend également de :

- audit ;
- observabilité ;
- jobs ;
- intégrations.

### Dépendances externes

Le domaine peut interagir avec :

- WMS ;
- OMS ;
- entrepôts ;
- systèmes logistiques ;
- transporteurs, via les couches adéquates.

### Règle de frontière

Le domaine `fulfillment` porte l'exécution logistique.
Il ne doit pas absorber :

- la vérité de commande ;
- la vérité d'expédition ;
- la vérité de stock ;
- la disponibilité vendable.

---

## Événements significatifs

Le domaine `fulfillment` publie ou peut publier des événements significatifs tels que :

- préparation créée ;
- préparation commencée ;
- picking terminé ;
- packing terminé ;
- exécution partielle détectée ;
- lot prêt pour expédition ;
- fulfillment complété ;
- fulfillment échoué ;
- fulfillment annulé.

Le domaine peut consommer des signaux liés à :

- commande confirmée ;
- annulation de commande ;
- changement de stock ;
- changement d'expédition ;
- synchronisation WMS/OMS.

---

## Cycle de vie

Le domaine `fulfillment` possède un cycle de vie métier/ops structurant.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- en préparation ;
- partiellement exécuté ;
- prêt pour expédition ;
- complété ;
- échoué ;
- annulé.

Le domaine doit éviter les états flous ou purement techniques lorsqu'un état opérationnel clair est attendu.

---

## Interfaces et échanges

Le domaine `fulfillment` expose principalement :

- des lectures d'état d'exécution ;
- des opérations de préparation ;
- des événements significatifs d'exécution.

Le domaine reçoit principalement :

- des signaux de commande ;
- des signaux de stock ;
- des mutations de préparation ;
- des synchronisations externes.

Le domaine ne doit pas exposer un contrat instable dépendant d'un WMS spécifique.

---

## Contraintes d'intégration

Le domaine `fulfillment` peut être exposé à des contraintes telles que :

- exécution partielle ;
- ordre de réception non garanti ;
- synchronisation avec WMS/OMS ;
- doublons ;
- retards de remontée ;
- divergence entre opération physique et état système ;
- corrections manuelles.

Règles minimales :

- les entrées doivent être validées ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- les écarts doivent être visibles ;
- la hiérarchie d'autorité doit être explicite ;
- les transitions critiques doivent être traçables.

---

## Observabilité et audit

Le domaine `fulfillment` doit rendre visibles au minimum :

- les changements d'état ;
- les exécutions partielles ;
- les échecs ;
- les corrections ;
- les événements significatifs publiés ;
- les désalignements avec `inventory` ou `shipping`.

L'audit doit permettre de répondre à des questions comme :

- quelle préparation a changé ;
- quand ;
- pour quelle cause ;
- avec quel impact sur la commande ou l'expédition.

---

## Impact de maintenance / exploitation

Le domaine `fulfillment` a un impact d'exploitation très élevé.

Raisons :

- il conditionne l'exécution concrète de la commande ;
- il dépend souvent de systèmes externes ;
- il subit les écarts entre théorie et réalité opérationnelle ;
- ses erreurs contaminent l'expédition et l'expérience client.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- les exécutions partielles ;
- les écarts avec le stock ;
- les retards ;
- les corrections manuelles ;
- les synchronisations externes.

---

## Limites du domaine

Le domaine `fulfillment` s'arrête :

- avant la commande comme objet métier ;
- avant la vérité globale de stock ;
- avant la disponibilité vendable ;
- avant le suivi de livraison final (`shipping`) ;
- avant les mécanismes techniques transverses.

Le domaine porte l'exécution logistique.
Il ne doit pas absorber toute la chaîne commerciale et logistique.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `fulfillment` et `shipping` ;
- la frontière exacte entre `fulfillment` et `inventory` ;
- le niveau de détail attendu (ligne, unité, colis, lot) ;
- la hiérarchie entre système interne et WMS/OMS ;
- la gestion des exécutions partielles ;
- la stratégie de correction manuelle ;
- la gestion des retours vers l'inventaire.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../core/commerce/orders.md`
- `shipping.md`
- `inventory.md`
- `../../core/catalog/availability.md`
- `../../../architecture/20-structure/23-systemes-externes-et-satellites.md`
