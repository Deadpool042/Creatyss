# Inventaire

## Rôle

Le domaine `inventory` porte la représentation des quantités, emplacements, réserves et mouvements de stock.

Il définit :

- ce qui est physiquement ou logiquement présent en stock ;
- quelles quantités sont disponibles, réservées, entrantes ou sorties selon le modèle retenu ;
- comment le système représente l'état de stock ;
- comment les mouvements de stock sont suivis.

Le domaine existe pour fournir une vérité d'inventaire, distincte :

- de la disponibilité vendable ;
- de l'expédition ;
- de l'exécution logistique ;
- des projections commerciales.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`élevé`

### Activable

`oui`

Le domaine `inventory` est une capacité optionnelle activable par configuration. Il n'appartient pas au coeur structurel universel mais est nécessaire dès lors que le système porte directement la gestion et la réservation de stock.

---

## Source de vérité

Le domaine `inventory` est la source de vérité pour :

- les quantités de stock ;
- les réserves de stock si cette responsabilité est portée ici ;
- les mouvements de stock ;
- les états d'inventaire ;
- les emplacements ou structures de stockage si le modèle les inclut.

Le domaine `inventory` n'est pas la source de vérité pour :

- la disponibilité vendable, qui relève de `availability` ;
- le produit, qui relève de `products` ;
- la commande, qui relève de `orders` ;
- l'expédition, qui relève de `shipping` ;
- l'exécution logistique, qui relève de `fulfillment`.

Le stock réel n'est pas automatiquement la disponibilité commerciale.

---

## Responsabilités

Le domaine `inventory` est responsable de :

- maintenir la quantité de stock ;
- enregistrer les mouvements de stock ;
- exprimer l'état des réserves si le modèle l'exige ;
- exposer un état d'inventaire exploitable ;
- publier les événements significatifs liés au stock ;
- protéger la cohérence des quantités.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- stock par emplacement ;
- stock par entrepôt ;
- stock réservé ;
- stock entrant ;
- stock ajusté ;
- inventaire cyclique ou correction.

---

## Non-responsabilités

Le domaine `inventory` n'est pas responsable de :

- décider si une offre est vendable ;
- porter le produit ;
- gérer le panier ;
- confirmer la commande ;
- calculer le prix ;
- gérer le paiement ;
- gérer l'expédition ;
- exécuter la logistique de préparation ;
- porter les intégrations de canaux.

Le domaine `inventory` ne doit pas devenir un synonyme de `availability`.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- une quantité de stock doit être interprétable ;
- un mouvement de stock doit être traçable ;
- un ajustement doit avoir une cause explicite ;
- un stock ne doit pas devenir incohérent sans détection ;
- les réserves et quantités doivent rester cohérentes selon le modèle retenu.

Le domaine protège la vérité de stock, pas la promesse commerciale.

---

## Dépendances

### Dépendances métier

Le domaine `inventory` interagit fortement avec :

- `products`
- `availability`
- `orders`
- `fulfillment`
- `shipping`

### Dépendances transverses

Le domaine dépend également de :

- audit ;
- observabilité ;
- jobs ;
- intégrations.

### Dépendances externes

Le domaine peut interagir avec :

- WMS ;
- ERP ;
- OMS ;
- systèmes d'entrepôt ;
- scanners, flux physiques ou outils de stock.

### Règle de frontière

Le domaine `inventory` porte la vérité de quantité et de mouvement.
Il ne doit pas absorber la disponibilité vendable ni la logique complète d'exécution.

---

## Événements significatifs

Le domaine `inventory` publie ou peut publier des événements significatifs tels que :

- stock ajusté ;
- stock réservé ;
- réserve libérée ;
- stock décrémenté ;
- stock incrémenté ;
- mouvement enregistré ;
- rupture de stock détectée.

Le domaine peut consommer des signaux liés à :

- commande confirmée ;
- annulation de commande ;
- exécution logistique ;
- retour produit ;
- synchronisation externe.

---

## Cycle de vie

Le domaine `inventory` ne porte pas nécessairement un cycle de vie unique comparable à une commande.

Cette section reste applicable via les états d'inventaire, par exemple :

- disponible ;
- réservé ;
- en attente de réapprovisionnement ;
- ajusté ;
- archivé, si un périmètre ou emplacement cesse d'être actif.

Si le modèle ne repose pas sur un cycle de vie unifié, cela doit être assumé explicitement.

---

## Interfaces et échanges

Le domaine `inventory` expose principalement :

- des lectures de quantité ;
- des lectures d'état de stock ;
- des mouvements ou ajustements structurés ;
- des événements significatifs liés au stock.

Le domaine reçoit principalement :

- des signaux de commande ;
- des signaux de logistique ;
- des ajustements opératoires ;
- des synchronisations externes.

---

## Contraintes d'intégration

Le domaine `inventory` peut être exposé à des contraintes telles que :

- synchronisation avec un WMS ou ERP ;
- mouvements en retard ;
- ordre de réception non garanti ;
- double traitement ;
- corrections manuelles ;
- divergence entre état physique et état système.

Règles minimales :

- tout mouvement doit être traçable ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- la hiérarchie d'autorité doit être explicite ;
- une divergence doit être visible et exploitable.

---

## Observabilité et audit

Le domaine `inventory` doit rendre visibles au minimum :

- les ajustements ;
- les réserves ;
- les écarts ;
- les ruptures ;
- les événements significatifs publiés ;
- les corrections manuelles.

L'audit doit permettre de répondre à des questions comme :

- quel stock a changé ;
- quand ;
- pour quelle cause ;
- avec quel impact sur la disponibilité ou l'exécution.

---

## Impact de maintenance / exploitation

Le domaine `inventory` a un impact d'exploitation très élevé.

Raisons :

- il conditionne indirectement la vente ;
- il influence la logistique ;
- il est exposé aux systèmes externes et aux corrections manuelles ;
- ses erreurs contaminent la disponibilité et l'exécution.

En exploitation, une attention particulière doit être portée à :

- la cohérence des quantités ;
- les écarts ;
- les corrections ;
- les synchronisations ;
- la traçabilité des mouvements.

---

## Limites du domaine

Le domaine `inventory` s'arrête :

- avant la disponibilité vendable (`availability`) ;
- avant l'exécution logistique (`fulfillment`) ;
- avant l'expédition (`shipping`) ;
- avant le prix ;
- avant la commande comme objet métier.

Le domaine porte la vérité de stock.
Il ne décide pas seul de ce qui peut être vendu.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la place exacte des réserves ;
- la hiérarchie entre stock interne et WMS/ERP ;
- la granularité par emplacement ;
- la gestion des corrections manuelles ;
- la politique de réconciliation avec `availability`.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../core/catalog/availability.md`
- `../../core/catalog/products.md`
- `../../core/commerce/orders.md`
- `fulfillment.md`
- `../../../architecture/20-structure/23-systemes-externes-et-satellites.md`
