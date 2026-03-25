# Marketplace

## Rôle

Le domaine `marketplace` porte l’orchestration d’une place de marché explicitement modélisée dans le système.

Il définit :

- ce qu’est une offre marketplace du point de vue du système ;
- comment des vendeurs, offres, catalogues ou stocks tiers sont exposés dans un cadre gouverné ;
- comment ce domaine se distingue du catalogue propriétaire, des intégrations techniques, du pricing, des paiements et des commandes standards ;
- comment le système reste maître de sa vérité interne sur les acteurs, offres et statuts marketplace.

Le domaine existe pour fournir une représentation explicite de la place de marché, distincte :

- du catalogue propriétaire porté par `products` ;
- des intégrations provider-specific portées par `integrations` ;
- du pricing porté par `pricing` ;
- des paiements portés par `payments` ;
- des commandes standards portées par `orders` ;
- des DTO providers externes portés par `integrations`.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`optionnel structurant`

### Activable

`oui`

Le domaine `marketplace` est activable.
Lorsqu’il est activé, il devient fortement structurant pour le catalogue, la vente, les commandes, les paiements, la conformité opérationnelle et les intégrations.

---

## Source de vérité

Le domaine `marketplace` est la source de vérité pour :

- la définition interne d’un vendeur marketplace ou acteur équivalent explicitement modélisé ;
- le rattachement d’une offre marketplace à un vendeur ;
- les statuts marketplace de l’offre, du vendeur ou de la relation commerciale si le modèle les porte ;
- les lectures structurées marketplace consommables par les domaines autorisés ;
- les règles internes de gouvernance marketplace explicitement portées par le système.

Le domaine `marketplace` n’est pas la source de vérité pour :

- le catalogue propriétaire standard, qui relève de `products` ;
- les DTO d’intégration externes, qui relèvent de `integrations` ;
- le pricing global générique, qui relève de `pricing` ;
- le paiement standard, qui relève de `payments` ;
- la commande standard, qui relève de `orders` ;
- la conformité juridique générale, qui relève de `legal` ;
- les canaux externes, qui relèvent de `channels` lorsque la diffusion n’est pas une marketplace interne.

Une marketplace est un cadre métier multi-vendeurs explicitement gouverné.
Elle ne doit pas être confondue avec :

- un simple import catalogue ;
- une intégration technique ;
- un canal de diffusion ;
- une capability boutique isolée ;
- un fournisseur invisible absorbé par le catalogue principal.

---

## Responsabilités

Le domaine `marketplace` est responsable de :

- définir ce qu’est une relation marketplace dans le système ;
- porter les vendeurs marketplace explicitement modélisés ;
- porter les offres marketplace ou leur rattachement aux vendeurs ;
- porter les statuts de gouvernance marketplace ;
- exposer une lecture gouvernée des vendeurs et offres marketplace ;
- publier les événements significatifs liés à la vie de la marketplace ;
- protéger le système contre les offres tierces implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- onboarding vendeur ;
- validation ou suspension vendeur ;
- offre propriétaire vs offre tierce ;
- commissions marketplace si ce modèle est explicitement porté ici ;
- règles de publication marketplace ;
- statuts de conformité opérationnelle ;
- visibilité vendeur côté backoffice ou storefront ;
- politiques de gouvernance multi-vendeurs.

---

## Non-responsabilités

Le domaine `marketplace` n’est pas responsable de :

- définir tout le catalogue propriétaire ;
- exécuter les intégrations provider-specific ;
- calculer tout le pricing générique ;
- exécuter le paiement standard ;
- porter toute la commande standard ;
- porter toute la conformité légale du système ;
- devenir un fourre-tout de vendeurs, fournisseurs, canaux et intégrations sans frontière claire.

Le domaine `marketplace` ne doit pas devenir :

- un doublon de `products` ;
- un doublon de `integrations` ;
- un doublon de `channels` ;
- un doublon de `payments` ;
- un conteneur flou d’offres tierces sans gouvernance métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- un vendeur marketplace possède une identité stable ;
- une offre marketplace est rattachée explicitement à un vendeur ou à un acteur autorisé ;
- une offre suspendue ou non conforme ne doit pas être traitée comme active sans règle explicite ;
- une mutation significative de statut vendeur ou offre doit être traçable ;
- la vérité marketplace ne doit pas être dissoute dans les intégrations techniques ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente marketplace quand le cadre commun existe.

Le domaine protège la cohérence métier de la place de marché.

---

## Dépendances

### Dépendances métier

Le domaine `marketplace` interagit fortement avec :

- `products`
- `pricing`
- `orders`
- `payments`
- `stores`
- `inventory`
- `availability`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `legal`
- `support`
- `jobs`, si certaines validations, synchronisations ou consolidations sont différées
- `fraud-risk`, si certains contrôles vendeurs ou offres sont modélisés

### Dépendances externes

Le domaine peut être projeté vers :

- ERP ;
- systèmes vendeurs externes ;
- outils de conformité ;
- systèmes de paiement connectés ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `marketplace` porte la gouvernance métier multi-vendeurs.
Il ne doit pas absorber :

- le catalogue propriétaire complet ;
- l’intégration technique pure ;
- le paiement standard ;
- la commande standard ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `marketplace` publie ou peut publier des événements significatifs tels que :

- vendeur marketplace créé ;
- vendeur marketplace validé ;
- vendeur marketplace suspendu ;
- offre marketplace créée ;
- offre marketplace activée ;
- offre marketplace suspendue ;
- rattachement vendeur-offre modifié ;
- politique marketplace modifiée.

Le domaine peut consommer des signaux liés à :

- produit mis à jour ;
- stock mis à jour ;
- statut de conformité modifié ;
- action administrative structurée ;
- capability boutique modifiée ;
- synchronisation externe validée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `marketplace` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- actif ;
- suspendu ;
- archivé, si pertinent.

Des états supplémentaires peuvent exister :

- brouillon ;
- en revue ;
- validé ;
- rejeté ;
- désactivé ;
- restreint.

Le domaine doit éviter :

- les vendeurs “fantômes” ;
- les offres tierces silencieusement actives ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `marketplace` expose principalement :

- des lectures de vendeurs marketplace structurés ;
- des lectures d’offres marketplace ;
- des lectures de statut et gouvernance marketplace ;
- des lectures exploitables par `products`, `orders`, `payments`, `support` et certaines couches d’administration ;
- des structures prêtes à être consommées par les domaines autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de vendeurs ;
- des créations ou mises à jour d’offres marketplace ;
- des changements de statut ou de politique ;
- des demandes de lecture d’un acteur ou d’une offre marketplace ;
- des contextes de boutique, vendeur, offre ou usage ;
- des signaux internes utiles à l’évolution de la marketplace.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `marketplace` peut être exposé à des contraintes telles que :

- multi-vendeurs ;
- offres hybrides propriétaire / tiers ;
- synchronisations externes ;
- règles de conformité locale ;
- commissions ou reversements ;
- dépendance à disponibilité et pricing ;
- réconciliations opérationnelles ;
- rétrocompatibilité des statuts.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne marketplace reste dans `marketplace` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une offre incohérente ne doit pas être promue silencieusement ;
- les conflits entre vendeur, offre, statut et publication doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `marketplace` manipule des données commerciales et opérationnelles sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre acteurs propriétaires, vendeurs tiers et opérateurs internes ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des changements significatifs de statut vendeur, offre ou gouvernance ;
- prudence sur les usages frauduleux, conflits d’intérêt et incohérences de publication.

---

## Observabilité et audit

Le domaine `marketplace` doit rendre visibles au minimum :

- quel vendeur ou quelle offre marketplace est active ;
- quel statut de gouvernance est en vigueur ;
- pourquoi une offre est autorisée, suspendue, rejetée ou restreinte ;
- si une évolution est bloquée à cause d’une règle, d’un statut ou d’une incohérence ;
- si une synchronisation ou projection externe a modifié l’état métier.

L’audit doit permettre de répondre à des questions comme :

- quel vendeur ou quelle offre a été créé, validé, suspendu ou modifié ;
- quand ;
- selon quelle origine ;
- avec quel changement de statut ou de rattachement ;
- avec quel impact sur catalogue, commande ou paiement.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- offre invalide ;
- statut incohérent ;
- vendeur non conforme ;
- évolution non autorisée ;
- suspicion de fraude ou de conflit.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `MarketplaceSeller` : vendeur ou acteur marketplace structuré ;
- `MarketplaceOffer` : offre marketplace structurée ;
- `MarketplaceSellerStatus` : état du vendeur ;
- `MarketplaceOfferStatus` : état de l’offre ;
- `MarketplacePolicy` : règle de gouvernance marketplace ;
- `MarketplaceRelationship` : relation explicite entre vendeur, offre et boutique si ce concept est porté.

---

## Impact de maintenance / exploitation

Le domaine `marketplace` a un impact d’exploitation élevé lorsqu’il est activé.

Raisons :

- il impacte catalogue, commande, paiement, support et conformité ;
- il introduit une gouvernance multi-acteurs ;
- ses erreurs peuvent créer litiges, erreurs de publication, problèmes commerciaux ou opérationnels ;
- il nécessite une explicabilité forte des statuts et rattachements ;
- il dépend souvent d’intégrations externes et de contrôles renforcés.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts vendeurs et offres ;
- la traçabilité des validations et suspensions ;
- la cohérence avec disponibilité, pricing et commande ;
- les effets de bord sur support, paiement et conformité ;
- la gestion des fraudes, litiges et conflits d’acteurs.

Le domaine doit être considéré comme très sensible dès qu’une marketplace réelle existe.

---

## Limites du domaine

Le domaine `marketplace` s’arrête :

- avant le catalogue propriétaire complet ;
- avant l’intégration technique pure ;
- avant le paiement standard ;
- avant la commande standard ;
- avant les DTO providers externes.

Le domaine `marketplace` porte la gouvernance métier multi-vendeurs.
Il ne doit pas devenir un doublon d’intégration, de catalogue ou de paiement non gouverné.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `marketplace` et `products` ;
- la frontière exacte entre `marketplace` et `integrations` ;
- la part exacte des commissions ou reversements portée ici ;
- la gouvernance des validations vendeurs ;
- la hiérarchie entre vérité interne et systèmes vendeurs externes ;
- la place exacte du split de commande ou de paiement si nécessaire.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/products.md`
- `../core/pricing.md`
- `../core/orders.md`
- `../core/payments.md`
- `inventory.md`
- `../core/availability.md`
- `../cross-cutting/legal.md`
- `../cross-cutting/support.md`
- `../cross-cutting/fraud-risk.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../core/integrations.md`
