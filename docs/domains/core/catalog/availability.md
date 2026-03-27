# Disponibilité

## Rôle

Le domaine `availability` porte la disponibilité exploitable à la vente.

Il définit :

- si un produit, une variante ou une offre peut être proposé à l’achat ;
- dans quel contexte cette disponibilité est valide ;
- comment la disponibilité vendable est exposée au panier, au checkout et à la commande ;
- comment le système distingue la disponibilité commerciale de la réalité physique du stock.

Le domaine existe pour fournir une vérité de **disponibilité vendable**, distincte :

- du référentiel produit ;
- de l’inventaire physique ;
- de l’exécution logistique ;
- des projections externes.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur`

### Activable

`non`

Le domaine `availability` est non optionnel dès lors que le système permet l’ajout au panier, la validation de commande ou toute promesse de vente.

---

## Source de vérité

Le domaine `availability` est la source de vérité pour :

- le statut de disponibilité vendable ;
- la capacité du système à dire si une offre est achetable ou non ;
- les règles internes de disponibilité commerciale ;
- les sorties de disponibilité consommées par `cart`, `checkout` et `orders`.

Le domaine `availability` n’est pas la source de vérité pour :

- l’identité du produit, qui relève de `products` ;
- la quantité physique stockée, qui relève de `inventory` ;
- l’exécution logistique, qui relève de `fulfillment` ;
- l’expédition, qui relève de `shipping` ;
- le prix, qui relève de `pricing`.

Le domaine peut consommer des signaux issus d’`inventory`, mais il ne doit pas être confondu avec l’inventaire lui-même.

---

## Responsabilités

Le domaine `availability` est responsable de :

- déterminer si une offre est disponible à la vente ;
- exposer une disponibilité exploitable au reste du système ;
- intégrer les contraintes commerciales de disponibilité ;
- encadrer les changements de statut de disponibilité ;
- publier les événements significatifs liés à la disponibilité ;
- protéger le système contre des promesses de vente incohérentes.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- disponibilité par canal ;
- disponibilité par store ;
- disponibilité par marché ou zone ;
- disponibilité conditionnelle selon contexte ;
- disponibilité précommande ou différée, si ces notions existent.

---

## Non-responsabilités

Le domaine `availability` n’est pas responsable de :

- maintenir les quantités physiques ;
- exécuter les réservations logistiques détaillées ;
- gérer l’expédition ;
- gérer les intégrations transporteurs ;
- définir les produits ;
- calculer le prix ;
- confirmer le paiement ;
- porter la logique complète d’exécution logistique.

Le domaine `availability` ne doit pas devenir un alias de `inventory`.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- une disponibilité vendable doit être interprétable sans ambiguïté ;
- une offre non disponible ne doit pas être exposée comme achetable sans règle explicite ;
- une mutation de disponibilité doit rester cohérente avec les règles du domaine ;
- le domaine ne doit pas promettre une disponibilité incompatible avec ses propres règles ;
- les sorties consommées par `cart`, `checkout` et `orders` doivent être stables et compréhensibles.

La disponibilité est une vérité commerciale.
Elle ne peut pas être réduite à un simple booléen non gouverné.

---

## Dépendances

### Dépendances métier

Le domaine `availability` interagit fortement avec :

- `products`
- `inventory`
- `cart`
- `checkout`
- `orders`
- `stores`
- `channels`

### Dépendances transverses

Le domaine dépend également de :

- audit ;
- observabilité ;
- jobs ;
- intégrations.

### Dépendances externes

Le domaine peut interagir avec :

- ERP ;
- OMS ;
- systèmes de stock externes ;
- places de marché ;
- systèmes de distribution.

### Règle de frontière

Le domaine `availability` exprime la disponibilité commerciale.
Il peut dépendre d’autres signaux, mais il ne doit pas absorber :

- la vérité de stock ;
- la logistique ;
- ni la structure produit.

---

## Événements significatifs

Le domaine `availability` publie ou peut publier des événements significatifs tels que :

- offre devenue disponible ;
- offre devenue indisponible ;
- disponibilité mise à jour ;
- disponibilité réservée, si cette notion est portée ici ;
- disponibilité rétablie ;
- règle de disponibilité modifiée.

Le domaine peut consommer des signaux liés à :

- mutation produit ;
- changement de stock ;
- changement de canal ;
- changement de store ;
- synchronisation externe ;
- exécution logistique.

Les noms exacts doivent rester dans le langage métier du système.

---

## Cycle de vie

Le domaine `availability` possède un cycle de vie partiel.

Le cycle exact dépend du modèle retenu, mais il doit au minimum distinguer :

- disponible ;
- indisponible ;
- suspendu, si pertinent ;
- en précommande ou différé, si pertinent.

Des états supplémentaires peuvent exister :

- partiellement disponible ;
- réservé ;
- en réapprovisionnement, si cette notion est portée comme disponibilité commerciale.

Le domaine doit éviter les états ambigus et les calques bruts d’un système externe.

---

## Interfaces et échanges

Le domaine `availability` expose principalement :

- des lectures de disponibilité ;
- des évaluations de disponibilité vendable ;
- des événements significatifs liés aux changements de disponibilité.

Le domaine reçoit principalement :

- des signaux de stock ;
- des mutations produit ;
- des changements de canal ou de store ;
- des synchronisations externes ;
- des décisions métier influençant la disponibilité.

Le domaine ne doit pas exposer un contrat purement technique ou instable.

---

## Contraintes d’intégration

Le domaine `availability` peut être exposé à des contraintes telles que :

- décalage entre stock réel et disponibilité vendable ;
- synchronisation différée ;
- ordre de réception non garanti ;
- divergence entre systèmes internes et externes ;
- réservation partielle ;
- recalcul différé ;
- rejouabilité de certains traitements.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- un système externe ne doit pas imposer silencieusement une disponibilité incohérente ;
- les mises à jour rejouables doivent être idempotentes ou neutralisées ;
- la promesse de vente doit rester défendable et traçable.

---

## Observabilité et audit

Le domaine `availability` doit rendre visibles au minimum :

- les changements de disponibilité ;
- les indisponibilités critiques ;
- les écarts avec le stock ou les systèmes externes ;
- les erreurs de calcul ou de synchronisation ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quelle offre est devenue indisponible ;
- quand ;
- pour quelle cause ;
- avec quel impact sur les parcours de vente.

L’observabilité doit distinguer :

- erreur métier de disponibilité ;
- erreur technique ;
- divergence de synchronisation ;
- promesse de vente bloquée ou incorrecte.

---

## Impact de maintenance / exploitation

Le domaine `availability` a un impact d’exploitation très élevé.

Raisons :

- il conditionne la promesse de vente ;
- il influence directement `cart`, `checkout` et `orders` ;
- ses erreurs ont un impact immédiat sur la conversion et la confiance ;
- il dépend potentiellement de systèmes externes et de l’inventaire.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- les écarts avec l’inventaire ;
- la traçabilité des changements ;
- les blocages de vente ;
- les désalignements entre systèmes.

Le domaine doit être considéré comme critique pour la fiabilité commerciale du système.

---

## Limites du domaine

Le domaine `availability` s’arrête :

- avant le stock physique (`inventory`) ;
- avant l’exécution logistique (`fulfillment`) ;
- avant l’expédition (`shipping`) ;
- avant le produit (`products`) ;
- avant les mécanismes techniques d’intégration.

Le domaine porte la disponibilité vendable.
Il ne doit pas absorber l’ensemble de la chaîne stock-logistique.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `availability` et `inventory` ;
- la présence ou non d’une réservation portée par `availability` ;
- la disponibilité multi-store / multi-channel ;
- la gestion de la précommande ;
- la hiérarchie entre système interne et stock externe ;
- la stratégie en cas de divergence entre disponibilité et stock réel.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `products.md`
- `../commerce/cart.md`
- `../commerce/checkout.md`
- `../commerce/orders.md`
- `../foundation/stores.md`
- `../../optional/commerce/inventory.md`
- `../../satellites/channels.md`
- `../../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
