# Wishlist

## Rôle

Le domaine `wishlist` porte les listes d’envies explicitement modélisées dans le système.

Il définit :

- ce qu’est une wishlist du point de vue du système ;
- comment un client, visiteur identifié ou contexte autorisé enregistre des produits, variantes ou offres pour plus tard ;
- comment ce domaine se distingue du panier, des recommandations, du CRM et du marketing ;
- comment le système reste maître de sa vérité interne sur les wishlists et leurs items.

Le domaine existe pour fournir une représentation explicite des intentions de conservation “pour plus tard”, distincte :

- du panier porté par `cart` ;
- des recommandations portées par `recommendations` ;
- de la relation client structurée portée par `crm` ;
- du marketing porté par `marketing` ;
- des DTO provider-specific portés par `integrations`.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`optionnel structurant`

### Activable

`oui`

Le domaine `wishlist` est activable.
Lorsqu’il est activé, il devient structurant pour certains parcours storefront, relation client, merchandising et reprise d’intention d’achat.

---

## Source de vérité

Le domaine `wishlist` est la source de vérité pour :

- la définition interne d’une wishlist ;
- ses statuts si le modèle en porte ;
- les items explicitement enregistrés dans la wishlist ;
- les métadonnées de wishlist portées par le système ;
- les lectures structurées de wishlist consommables par les domaines autorisés.

Le domaine `wishlist` n’est pas la source de vérité pour :

- le panier, qui relève de `cart` ;
- le produit publié, qui relève de `products` ;
- les recommandations, qui relèvent de `recommendations` ;
- la relation CRM complète, qui relève de `crm` ;
- les campagnes marketing, qui relèvent de `marketing` ;
- les DTO providers externes, qui relèvent de `integrations`.

Une wishlist est un objet métier de conservation d’intention.
Elle ne doit pas être confondue avec :

- un panier en attente ;
- une recommandation ;
- un segment CRM ;
- une simple préférence UI locale sans statut ni modèle métier.

---

## Responsabilités

Le domaine `wishlist` est responsable de :

- définir ce qu’est une wishlist dans le système ;
- porter les items ajoutés explicitement à une wishlist ;
- porter les statuts ou états utiles d’une wishlist si le modèle les expose ;
- exposer une lecture gouvernée des wishlists et de leurs items ;
- publier les événements significatifs liés à la vie d’une wishlist ;
- protéger le système contre les wishlists implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- wishlists privées ;
- wishlists partagées, si explicitement modélisées ;
- wishlist rattachée à un compte client ;
- wishlist rattachée à un contexte visiteur autorisé ;
- priorité ou ordre explicite des items ;
- notes ou tags internes à la wishlist si ce modèle est retenu.

---

## Non-responsabilités

Le domaine `wishlist` n’est pas responsable de :

- porter la logique du panier ;
- définir le catalogue produit ;
- générer des recommandations ;
- porter toute la logique CRM ;
- porter toute la logique marketing ;
- exécuter les intégrations provider-specific ;
- devenir un fourre-tout de signaux d’intérêt sans modèle clair.

Le domaine `wishlist` ne doit pas devenir :

- un doublon de `cart` ;
- un doublon de `recommendations` ;
- un doublon de `crm` ;
- un conteneur flou de favoris sans gouvernance.

---

## Invariants

Les invariants minimaux sont les suivants :

- une wishlist possède une identité stable ;
- une wishlist possède un statut explicite si le modèle en porte ;
- un item de wishlist est rattaché explicitement à une wishlist ;
- un item retiré ne doit pas être traité comme présent sans règle explicite ;
- une mutation significative de contenu de wishlist doit être traçable ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente de wishlist quand le cadre commun existe.

Le domaine protège la cohérence des listes d’envies explicites du système.

---

## Dépendances

### Dépendances métier

Le domaine `wishlist` interagit fortement avec :

- `products`
- `customers`
- `cart`
- `crm`
- `marketing`
- `recommendations`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `notifications`, si certaines alertes ou relances sont explicitement portées
- `jobs`, si certaines projections ou nettoyages sont différés
- `tracking`, si certains signaux alimentent des lectures dérivées, sans devenir la source de vérité de la wishlist

### Dépendances externes

Le domaine peut être projeté vers :

- CRM ;
- plateformes marketing ;
- outils de relance ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `wishlist` porte les listes d’envies explicites.
Il ne doit pas absorber :

- le panier ;
- les recommandations ;
- le CRM complet ;
- le marketing ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `wishlist` publie ou peut publier des événements significatifs tels que :

- wishlist créée ;
- item ajouté à la wishlist ;
- item retiré de la wishlist ;
- wishlist vidée ;
- wishlist archivée ;
- wishlist partagée, si ce cas existe ;
- ordre ou priorité d’item modifié.

Le domaine peut consommer des signaux liés à :

- produit archivé ;
- produit devenu indisponible ;
- client identifié ;
- action administrative structurée ;
- capability boutique modifiée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `wishlist` possède un cycle de vie explicite ou partiel selon le modèle retenu.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créée ;
- active ;
- archivée, si pertinent.

Des états supplémentaires peuvent exister :

- vide ;
- partagée ;
- suspendue ;
- expirée, si une politique de durée de vie existe.

Le domaine doit éviter :

- les wishlists “fantômes” ;
- les changements silencieux de contenu ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `wishlist` expose principalement :

- des lectures de wishlist structurée ;
- des lectures d’items de wishlist ;
- des lectures exploitables par `storefront`, `crm`, `marketing`, `recommendations` et certaines couches d’administration ;
- des structures prêtes à être consommées par les domaines autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de wishlist ;
- des ajouts ou retraits d’items ;
- des demandes de lecture d’une wishlist ;
- des contextes de client, boutique, session ou usage autorisé ;
- des signaux internes utiles à l’évolution de la wishlist.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `wishlist` peut être exposé à des contraintes telles que :

- wishlist multi-boutiques ;
- rattachement visiteur puis client ;
- wishlist partagée ;
- relances ou projections externes ;
- dépendance à l’état du catalogue ;
- besoin de réconciliation après login ;
- politiques de durée de vie ;
- rétrocompatibilité de statuts ou de rattachements.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des wishlists reste dans `wishlist` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une réconciliation visiteur → client ne doit pas corrompre silencieusement le contenu ;
- les conflits entre statut, rattachement et contenu doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `wishlist` peut manipuler des signaux d’intention d’achat sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre wishlist privée, partagée ou projetée ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des changements significatifs de rattachement ou de contenu ;
- prudence sur les usages dérivés côté CRM ou marketing.

---

## Observabilité et audit

Le domaine `wishlist` doit rendre visibles au minimum :

- quelle wishlist est active ;
- quels items sont présents ;
- pourquoi un item est conservé, retiré, masqué ou indisponible ;
- si une évolution est bloquée à cause d’un statut, d’un rattachement ou d’une incohérence ;
- si une réconciliation ou projection externe a modifié le contenu.

L’audit doit permettre de répondre à des questions comme :

- quelle wishlist a été créée ou modifiée ;
- quand ;
- selon quelle origine ;
- avec quel item ajouté ou retiré ;
- avec quel changement de rattachement ou de statut ;
- avec quel impact sur storefront, CRM ou marketing.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- item invalide ;
- rattachement incohérent ;
- wishlist inactive ;
- évolution non autorisée.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Wishlist` : liste d’envies structurée ;
- `WishlistItem` : item enregistré dans une wishlist ;
- `WishlistOwner` : propriétaire ou contexte de rattachement ;
- `WishlistStatus` : état de la wishlist ;
- `WishlistPolicy` : règle de gouvernance, de partage ou de durée de vie.

---

## Impact de maintenance / exploitation

Le domaine `wishlist` a un impact d’exploitation moyen lorsqu’il est activé.

Raisons :

- il influence les parcours storefront ;
- il peut être consommé par CRM, marketing et recommandations ;
- ses erreurs dégradent l’expérience de reprise d’intention ;
- il nécessite une explicabilité correcte des rattachements et contenus ;
- il peut dépendre de réconciliations visiteur → client.

En exploitation, une attention particulière doit être portée à :

- la cohérence des rattachements ;
- la stabilité des statuts ;
- la traçabilité des changements ;
- la cohérence avec le catalogue vivant ;
- les effets de bord sur CRM, marketing et storefront.

Le domaine doit être considéré comme sensible dès qu’un système de wishlist réel existe.

---

## Limites du domaine

Le domaine `wishlist` s’arrête :

- avant le panier ;
- avant les recommandations ;
- avant le CRM complet ;
- avant le marketing ;
- avant les DTO providers externes.

Le domaine `wishlist` porte les listes d’envies explicites.
Il ne doit pas devenir un doublon de panier, de recommandation ou de signal d’intérêt générique non gouverné.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `wishlist` et `cart` ;
- la frontière exacte entre `wishlist` et `recommendations` ;
- la frontière exacte entre `wishlist` et `crm` ;
- la part exacte des wishlists partagées ;
- la stratégie de rattachement visiteur → client ;
- la hiérarchie entre vérité interne et projection externe éventuelle.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/products.md`
- `../core/customers.md`
- `../core/cart.md`
- `recommendations.md`
- `../cross-cutting/crm.md`
- `../cross-cutting/marketing.md`
- `../cross-cutting/tracking.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../core/integrations.md`
