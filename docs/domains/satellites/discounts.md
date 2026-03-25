# Remises

## Rôle

Le domaine `discounts` porte les mécanismes de réduction appliqués au catalogue, au panier, à la commande ou à certains contextes de vente.

Il définit :

- quels types de remises existent ;
- sur quels périmètres elles s’appliquent ;
- comment elles sont évaluées ;
- comment elles se distinguent du pricing de base, de la taxation et des règles de vente ;
- comment elles restent traçables, explicables et cohérentes.

Le domaine existe pour fournir un cadre explicite de réduction commerciale, distinct :

- du prix de référence porté par `pricing` ;
- de la fiscalité portée par `taxation` ;
- des règles de disponibilité ou de stock ;
- des politiques de vente générales ;
- des programmes de fidélité ou cartes cadeaux lorsqu’ils existent comme domaines séparés.

---

## Classification

### Catégorie documentaire

`satellites`

### Criticité architecturale

`satellite structurant`

### Activable

`oui`

Le domaine `discounts` est activable.
Lorsqu’il est activé, il devient fortement structurant pour :

- le panier ;
- le checkout ;
- la commande ;
- l’explicabilité commerciale ;
- la cohérence des montants.

---

## Source de vérité

Le domaine `discounts` est la source de vérité pour :

- la définition interne des remises ;
- leurs règles d’éligibilité ;
- leur mode de calcul ou d’évaluation ;
- leur statut actif, inactif, expiré ou archivé ;
- les conditions d’application portées par le système ;
- la traçabilité minimale de leur utilisation quand cette responsabilité est portée ici.

Le domaine `discounts` n’est pas la source de vérité pour :

- le prix catalogue de base, qui relève de `pricing` ;
- la taxe, qui relève de `taxation` ;
- les règles générales de vente, qui peuvent relever de `sales-policy` ;
- la commande elle-même, qui relève de `orders` ;
- le paiement, qui relève de `payments` ;
- la fidélité ou les cartes cadeaux, si ces concepts sont modélisés séparément.

Une remise modifie un montant selon une règle commerciale.
Elle ne doit pas être confondue avec :

- un prix de référence ;
- une taxe ;
- un avoir ;
- un moyen de paiement ;
- un programme de fidélité.

---

## Responsabilités

Le domaine `discounts` est responsable de :

- définir ce qu’est une remise dans le système ;
- porter les règles d’éligibilité et de validité ;
- encadrer l’évaluation des remises ;
- structurer les différents types de remises explicitement supportés ;
- exposer une représentation exploitable des remises applicables ;
- publier les événements significatifs liés à la vie des remises ;
- protéger le système contre les réductions implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- remises en pourcentage ;
- remises fixes ;
- remises produit ;
- remises panier ;
- remises conditionnelles ;
- coupons, si ce sous-modèle est porté ici ;
- remises ciblées par boutique, canal, segment, pays ou période ;
- plafonds, minimums, exclusivités ou cumulabilité.

---

## Non-responsabilités

Le domaine `discounts` n’est pas responsable de :

- définir le prix catalogue de base ;
- définir la taxe ;
- garantir la disponibilité vendable ;
- porter la commande entière ;
- exécuter le paiement ;
- gouverner la fidélité, les récompenses ou les cartes cadeaux si ces domaines existent ;
- porter toute la politique de vente générale ;
- devenir un moteur générique de règles pour tout le système.

Le domaine `discounts` ne doit pas devenir :

- un doublon de `pricing` ;
- un mélange entre prix, promotion, coupon et avantage fidélité ;
- un fourre-tout de cas commerciaux spéciaux sans gouvernance.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- une remise doit avoir une identité interne stable ;
- une remise doit avoir un périmètre d’application explicite ;
- une remise ne doit pas être ambiguë sur son mode de calcul ;
- une remise inactive ou expirée ne doit pas être appliquée comme active sans règle explicite ;
- deux remises incompatibles ne doivent pas être cumulées silencieusement ;
- l’application d’une remise doit être explicable ;
- une remise ne doit pas produire un résultat monétaire incohérent ;
- une mutation structurante de remise doit être traçable.

Le domaine protège la cohérence commerciale du mécanisme de réduction.

---

## Dépendances

### Dépendances métier

Le domaine `discounts` interagit fortement avec :

- `pricing`
- `cart`
- `checkout`
- `orders`
- `taxation`
- `stores`
- `products`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `jobs`, si certaines activations ou expirations sont différées
- `feature-flags`, si certains rollouts promotionnels sont gouvernés ainsi
- `integrations`, si certaines remises viennent d’un système externe

### Dépendances externes

Le domaine peut interagir avec :

- ERP ;
- moteur promotionnel externe ;
- PIM ;
- backoffice commercial ;
- marketplace ou canal externe.

### Règle de frontière

Le domaine `discounts` porte les réductions commerciales.
Il ne doit pas absorber :

- le prix de base ;
- la fiscalité ;
- la logique de commande ;
- ni la politique complète de vente.

---

## Événements significatifs

Le domaine `discounts` publie ou peut publier des événements significatifs tels que :

- remise créée ;
- remise mise à jour ;
- remise activée ;
- remise désactivée ;
- remise expirée ;
- règle d’éligibilité modifiée ;
- coupon généré ou invalidé, si ce concept est porté ici ;
- remise appliquée ;
- remise rejetée.

Le domaine peut consommer des signaux liés à :

- mise à jour de prix ;
- mise à jour de produit ;
- changement de boutique ou canal ;
- évolution de stock ou de disponibilité si cela affecte l’éligibilité ;
- synchronisation commerciale externe ;
- changement de période promotionnelle.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `discounts` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créée ;
- active ;
- inactive ;
- expirée ;
- archivée.

Des états supplémentaires peuvent exister :

- brouillon ;
- planifiée ;
- suspendue ;
- consommée, pour certains coupons ou avantages unitaires.

Les transitions doivent être explicites et traçables.

Le domaine doit éviter :

- les remises “fantômes” ;
- les activations implicites ;
- les changements silencieux de règles ;
- les cumuls opaques.

---

## Interfaces et échanges

Le domaine `discounts` expose principalement :

- des commandes de création et de mutation de remises ;
- des lectures de remises actives ou applicables ;
- des évaluations de remises sur un contexte donné ;
- des événements significatifs liés à leur cycle de vie.

Le domaine reçoit principalement :

- des demandes de création ou de mise à jour ;
- des contextes d’éligibilité ou d’évaluation ;
- des synchronisations externes ;
- des actions opératoires de suspension ou d’activation.

Le domaine ne doit pas exposer un contrat canonique dépendant d’un outil promotionnel externe sans modèle interne clair.

---

## Contraintes d’intégration

Le domaine `discounts` peut être exposé à des contraintes telles que :

- promotions planifiées ;
- multi-boutiques ;
- multi-devises ;
- règles de cumul ;
- coupons à usage unique ;
- dépendance à un système commercial externe ;
- ordre d’évaluation sensible ;
- interaction avec taxation et panier ;
- recalcul en temps réel.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- le calcul doit rester déterministe à contexte identique ;
- une remise expirée ne doit pas continuer à être appliquée silencieusement ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- les incompatibilités doivent être visibles ;
- un système externe ne doit pas redéfinir silencieusement la vérité interne.

---

## Observabilité et audit

Le domaine `discounts` doit rendre visibles au minimum :

- les créations et activations de remises ;
- les expirations ;
- les rejets d’éligibilité significatifs ;
- les erreurs de calcul ;
- les divergences avec des systèmes externes ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quelle remise a été activée ou modifiée ;
- quand ;
- selon quelle origine ;
- sur quel périmètre ;
- avec quel impact commercial attendu ;
- avec quelle application réelle dans un panier ou une commande.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- conflit de règles ;
- divergence externe ;
- remise expirée encore visible ;
- calcul incohérent.

---

## Impact de maintenance / exploitation

Le domaine `discounts` a un impact d’exploitation élevé lorsqu’il est activé.

Raisons :

- il modifie directement les montants affichés et commandés ;
- il influence l’expérience commerciale ;
- ses erreurs affectent panier, checkout et commande ;
- il peut être lié à des campagnes ou systèmes externes ;
- il augmente fortement la complexité d’explicabilité.

En exploitation, une attention particulière doit être portée à :

- la clarté des règles ;
- la cohérence entre prix et remises ;
- les conflits de cumul ;
- les remises expirées ;
- les coupons invalides ;
- les divergences avec les systèmes externes ;
- les effets de bord sur taxation et totalisation.

Le domaine doit être considéré comme sensible pour l’intégrité commerciale.

---

## Limites du domaine

Le domaine `discounts` s’arrête :

- avant le prix catalogue de base ;
- avant la fiscalité ;
- avant la commande comme agrégat complet ;
- avant le paiement ;
- avant les programmes de fidélité ou cartes cadeaux si séparés ;
- avant la politique générale de vente ;
- avant la disponibilité et le stock.

Le domaine porte la réduction commerciale.
Il ne doit pas devenir un moteur global de prix ou un conteneur de tous les cas spéciaux.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `discounts` et `pricing` ;
- la frontière exacte entre `discounts` et `sales-policy` ;
- la place exacte des coupons ;
- les règles de cumul et d’exclusivité ;
- l’ordre canonique d’évaluation par rapport à taxation ;
- la hiérarchie entre moteur interne et système commercial externe ;
- la gestion multi-boutiques, multi-devises et multi-canaux.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/pricing.md`
- `../core/cart.md`
- `../core/checkout.md`
- `../core/orders.md`
- `../core/taxation.md`
- `sales-policy.md`
- `../core/stores.md`
