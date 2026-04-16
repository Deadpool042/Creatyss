# Panier

## Rôle

Le domaine `cart` porte l’état mutable du panier avant confirmation de commande.

Il définit :

- comment une intention d’achat en cours est représentée ;
- comment des produits, variantes ou unités sont ajoutés, retirés ou modifiés ;
- comment le panier conserve un état exploitable pendant la phase de préparation à l’achat ;
- quels signaux significatifs doivent être publiés avant passage au checkout ou à la commande.

Le domaine existe pour fournir un espace de préparation cohérent, réversible et exploitable avant l’engagement métier porté par `orders`.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur`

### Activable

`non`

Le domaine `cart` est non optionnel dans un parcours commerce standard.
Sans lui, le système ne dispose pas d’un état préparatoire structuré avant confirmation.

---

## Source de vérité

Le domaine `cart` est la source de vérité pour :

- l’identité interne du panier ;
- la composition actuelle du panier ;
- les lignes de panier avant confirmation ;
- les quantités sélectionnées ;
- les états métier du panier ;
- les métadonnées temporaires nécessaires à la préparation d’achat ;
- les transitions propres au panier avant validation.

Le domaine `cart` n’est pas la source de vérité pour :

- la commande confirmée, qui relève de `orders` ;
- le calcul de prix, qui relève de `pricing` ;
- la fiscalité, qui relève de `taxation` ;
- la disponibilité réelle ou le stock physique, qui relèvent d’autres domaines ;
- le paiement ;
- l’authentification, les rôles ou les permissions ;
- les projections externes ;
- les webhooks, intégrations ou signaux techniques.

Le panier reste une vérité préparatoire.
Il ne doit pas être traité comme une commande informelle.

---

## Responsabilités

Le domaine `cart` est responsable de :

- créer et identifier un panier ;
- ajouter, retirer ou modifier des lignes de panier ;
- gérer les quantités sélectionnées ;
- conserver un état cohérent du panier avant validation ;
- exposer un contenu de panier exploitable au checkout ;
- porter les informations préparatoires nécessaires au passage à l’étape suivante ;
- encadrer les transitions du panier ;
- publier les événements significatifs liés à la vie du panier ;
- invalider ou signaler les incohérences évidentes du panier lorsque le modèle le requiert.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- l’association du panier à un client ou une session ;
- certains éléments contextuels temporaires ;
- certaines réservations logiques légères, si elles relèvent réellement du panier ;
- la gestion d’un brouillon d’intention d’achat avant passage au checkout.

---

## Non-responsabilités

Le domaine `cart` n’est pas responsable de :

- confirmer l’achat ;
- créer la commande finale ;
- figer la vérité de commande ;
- porter la logique complète de checkout ;
- porter la vérité du prix ;
- porter la logique fiscale ;
- capturer un paiement ;
- décider du stock réel ;
- exécuter les synchronisations externes ;
- gouverner les intégrations ;
- gérer les autorisations d’accès ;
- porter les conséquences avales de l’achat.

Le domaine `cart` ne doit pas devenir un substitut de `orders` ni un agrégat fourre-tout de logique commerciale.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- un panier doit avoir une identité interne stable ;
- une ligne de panier doit référencer un objet achetable valide selon le modèle retenu ;
- une quantité de ligne doit rester cohérente avec les règles du domaine ;
- un panier ne doit pas contenir des lignes structurellement incohérentes ;
- le contenu exposé au checkout doit être interprétable ;
- un panier confirmé ne doit pas continuer à évoluer comme si aucune transition n’avait eu lieu, si le modèle distingue clairement panier et commande ;
- une mutation du panier ne doit pas produire un état ambigu pour les consommateurs aval.

Le panier peut être mutable, mais il ne doit pas être incohérent.

---

## Dépendances

### Dépendances métier

Le domaine `cart` interagit fortement avec :

- `products`
- `pricing`
- `availability`
- `checkout`
- `orders`
- `customers`

### Dépendances transverses

Le domaine dépend également de :

- audit ;
- observabilité ;
- jobs, si certaines vérifications ou expirations sont différées ;
- notifications, selon le périmètre ;
- intégrations, si certains paniers doivent être projetés ou récupérés.

### Règle de frontière

Le domaine `cart` consomme les sorties d’autres domaines, mais il ne doit pas absorber :

- la vérité tarifaire ;
- la vérité de commande ;
- la logique complète de paiement ;
- la gouvernance des systèmes externes.

---

## Événements significatifs

Le domaine `cart` publie ou peut publier des événements significatifs tels que :

- panier créé ;
- ligne ajoutée ;
- ligne retirée ;
- ligne modifiée ;
- quantité modifiée ;
- panier vidé ;
- panier expiré ;
- panier validé pour checkout ;
- panier abandonné, si cette notion est portée par le domaine.

Le domaine peut consommer des signaux liés à :

- mutation produit ;
- changement de prix ;
- indisponibilité ;
- changement de contexte client ;
- validation du checkout ;
- expiration logique.

Les noms exacts doivent rester dans le langage métier du système.

---

## Cycle de vie

Le domaine `cart` possède un cycle de vie métier.

Le cycle exact dépend du produit, mais il doit au minimum distinguer :

- créé ;
- actif ;
- prêt pour checkout ;
- converti ;
- expiré ;
- abandonné ou invalidé, si le modèle le permet.

Exemples de transitions structurantes :

- création du panier ;
- ajout de contenu ;
- modification du contenu ;
- validation pour checkout ;
- conversion en commande ou passage structurant vers `orders` ;
- expiration ;
- abandon.

Le domaine doit éviter les transitions implicites et les états trop techniques.

---

## Interfaces et échanges

Le domaine `cart` expose principalement :

- des commandes de création de panier ;
- des commandes de mutation des lignes ;
- des lectures du panier courant ;
- des sorties structurées vers `checkout` ;
- des événements significatifs liés aux mutations du panier.

Le domaine reçoit principalement :

- des demandes d’ajout ou de retrait ;
- des changements de quantité ;
- des changements de contexte ;
- des validations préparatoires au checkout ;
- des signaux de mutation produit ou prix pouvant affecter la cohérence du panier.

Le domaine ne doit pas exposer un contrat interne instable comme interface implicite publique.

---

## Contraintes d’intégration

Le domaine `cart` peut être exposé à des contraintes telles que :

- contexte utilisateur anonyme ou authentifié ;
- recalculs de prix à la volée ;
- indisponibilité partielle ;
- expiration ;
- réconciliation avec des données externes ;
- récupération de paniers persistés ;
- duplication de requêtes de mutation ;
- traitements asynchrones liés à la mise à jour du panier.

Règles minimales :

- une mutation de panier doit être validée ;
- une requête répétée ne doit pas produire un état incohérent ;
- le panier ne doit pas dériver vers une commande sans transition explicite ;
- les écarts entre contenu du panier et données externes doivent être gérés de manière visible ;
- les signaux techniques ne doivent pas redéfinir silencieusement la vérité locale du panier.

---

## Observabilité et audit

Le domaine `cart` doit rendre visibles au minimum :

- la création du panier ;
- les mutations significatives ;
- les invalidations ;
- les expirations ;
- les échecs de mutation ;
- les incohérences détectées ;
- les validations de passage au checkout ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quel panier a changé ;
- quand ;
- selon quelle action ;
- sur quelles lignes ;
- avec quel impact visible ;
- sous quelle origine de mutation.

L’observabilité doit distinguer :

- erreur métier de cohérence ;
- erreur technique ;
- expiration ;
- recalcul différé ;
- écart avec des données externes.

---

## Impact de maintenance / exploitation

Le domaine `cart` a un impact d’exploitation élevé.

Raisons :

- il conditionne l’entrée dans le tunnel d’achat ;
- il dépend de plusieurs domaines amont ;
- il est fortement exposé aux mutations fréquentes ;
- ses incohérences contaminent rapidement `checkout` et `orders`.

En exploitation, une attention particulière doit être portée à :

- la cohérence des lignes ;
- les paniers expirés ;
- les écarts de prix ou de disponibilité ;
- les échecs de mutation ;
- la conversion panier → checkout → commande ;
- la gestion des doublons ou répétitions de requêtes.

Le domaine doit rester souple dans l’usage, mais rigoureux dans sa cohérence.

---

## Limites du domaine

Le domaine `cart` s’arrête :

- avant la confirmation de commande ;
- avant la capture ou la confirmation de paiement ;
- avant le cycle de vie de `orders` ;
- avant la vérité complète du prix ;
- avant la logique fiscale ;
- avant les projections externes ;
- avant la gouvernance des intégrations et des webhooks ;
- avant les mécanismes d’autorisation.

Le panier prépare l’achat.
Il ne l’engage pas encore au même niveau qu’une commande.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `cart` et `checkout` ;
- la frontière exacte entre `cart` et `orders` ;
- le niveau de persistance du panier ;
- le statut doctrinal du panier anonyme vs authentifié ;
- la politique d’expiration ;
- la gestion des écarts prix/disponibilité avant checkout ;
- la stratégie de conversion panier → commande.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../../architecture/10-fondations/10-principes-d-architecture.md`
- `../../../architecture/10-fondations/11-modele-de-classification.md`
- `../../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../catalog/products.md`
- `pricing.md`
- `checkout.md`
- `orders.md`
- `customers.md`
- `../catalog/availability.md`
