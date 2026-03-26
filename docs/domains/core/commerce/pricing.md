# Tarification

## Rôle

Le domaine `pricing` porte la logique de tarification du système.

Il définit :

- comment les montants applicables sont déterminés ;
- quelles règles structurent le prix d’un produit, d’une variante, d’un panier ou d’une commande ;
- quels composants de prix relèvent du domaine ;
- quelles valeurs tarifaires peuvent être exposées au reste du système ;
- comment la cohérence tarifaire est préservée dans le temps.

Le domaine existe pour fournir une vérité de calcul et d’interprétation des prix, distincte :

- du référentiel produit ;
- de la fiscalité ;
- des remises ;
- des paiements ;
- des projections commerciales externes.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur`

### Activable

`non`

Le domaine `pricing` est non optionnel.
Sans lui, le système ne peut pas déterminer de manière fiable les montants applicables aux parcours commerciaux et transactionnels.

---

## Source de vérité

Le domaine `pricing` est la source de vérité pour :

- les règles de tarification internes ;
- la détermination des montants applicables selon le contexte retenu ;
- la représentation des prix de référence portés par le système ;
- les calculs de prix qui relèvent de la logique coeur ;
- l’interprétation métier des composants tarifaires internes ;
- les sorties tarifaires exposables à `cart`, `checkout` et `orders`.

Le domaine `pricing` n’est pas la source de vérité pour :

- l’identité ou la structure du produit, qui relèvent de `products` ;
- la fiscalité, qui relève de `taxation` ;
- les remises et promotions si elles relèvent d’un domaine distinct, par exemple `discounts` ;
- la disponibilité ou le stock ;
- la capture ou l’exécution d’un paiement ;
- les projections tarifaires spécifiques à un canal externe, sauf si elles dérivent explicitement des règles internes ;
- les politiques commerciales purement éditoriales.

Le domaine ne doit pas laisser flotter l’autorité tarifaire entre plusieurs blocs concurrents.

---

## Responsabilités

Le domaine `pricing` est responsable de :

- définir le modèle interne du prix ;
- calculer ou déterminer les montants pertinents selon les règles du système ;
- produire des sorties tarifaires cohérentes pour les parcours amont et aval ;
- distinguer les composants tarifaires relevant du coeur ;
- exposer des montants interprétables au reste du système ;
- stabiliser les règles de calcul du prix dans le temps ;
- encadrer les changements de structure tarifaire ;
- publier les événements significatifs liés aux changements tarifaires lorsque cela est pertinent ;
- fournir des résultats exploitables à `cart`, `checkout`, `orders`, `marketplace`, `search`, `seo` ou d’autres domaines consommateurs, selon le périmètre.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- prix catalogue ;
- prix de base ;
- prix dérivés selon contexte ;
- prix par variante ;
- tarification multi-store ou multi-channel si cette responsabilité est interne ;
- certaines règles de sélection du prix applicable.

---

## Non-responsabilités

Le domaine `pricing` n’est pas responsable de :

- définir ce qu’est un produit ;
- porter la structure du catalogue ;
- porter la politique de taxation ;
- gérer la logique complète des promotions si elle relève d’un domaine distinct ;
- maintenir le panier ;
- confirmer la commande ;
- capturer ou rembourser un paiement ;
- gérer les autorisations d’accès ;
- gouverner les intégrations externes ;
- gérer les webhooks ;
- maintenir les projections analytiques, marketing ou CRM ;
- arbitrer la disponibilité vendable ;
- exécuter les politiques de canal si elles relèvent de `channels`.

Le domaine `pricing` ne doit pas devenir un conteneur générique de toutes les règles commerciales du système.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- un prix exposé par le domaine doit être interprétable ;
- un même contexte tarifaire ne doit pas produire silencieusement plusieurs résultats concurrents sans règle de priorité ;
- un composant tarifaire doit avoir un sens métier stable ;
- une sortie tarifaire ne doit pas mélanger arbitrairement prix, taxe, remise et frais sans structure explicite ;
- une règle de calcul active doit être déterministe à contexte identique ;
- un prix applicable ne doit pas dépendre d’une donnée non gouvernée ;
- une mutation de configuration tarifaire ne doit pas produire d’ambiguïté structurelle ;
- les montants exposés à `cart`, `checkout` ou `orders` doivent rester cohérents avec la sémantique du domaine.

Le domaine doit protéger la cohérence tarifaire, pas seulement retourner des nombres.

---

## Dépendances

### Dépendances métier

Le domaine `pricing` interagit fortement avec :

- `products`
- `cart`
- `checkout`
- `orders`
- `taxation`
- `payments`
- `customers`
- `stores`
- `channels`
- `discounts`, si ce domaine existe séparément

### Dépendances transverses

Le domaine dépend également de :

- audit ;
- observabilité ;
- jobs ;
- intégrations ;
- import / export si le modèle tarifaire est synchronisé.

### Dépendances externes

Le domaine peut recevoir ou produire des flux liés à :

- ERP ;
- PIM ;
- systèmes de pricing externes ;
- marketplaces ;
- canaux de distribution ;
- outils d’administration commerciale.

### Règle de frontière

Le domaine `pricing` fournit une vérité tarifaire interne.
Il ne doit pas absorber la fiscalité, la promotion, le paiement ou la politique de canal sans frontière explicite.

---

## Événements significatifs

Le domaine `pricing` publie ou peut publier des événements significatifs tels que :

- règle tarifaire créée ;
- règle tarifaire mise à jour ;
- prix de référence modifié ;
- prix applicable recalculé ;
- configuration tarifaire activée ;
- configuration tarifaire désactivée ;
- grille tarifaire publiée ;
- tarification d’un produit ou d’une variante modifiée.

Le domaine peut consommer des signaux liés à :

- mutation produit ;
- changement de store ;
- changement de contexte client ;
- changement de canal ;
- activation de règles commerciales ;
- imports tarifaires ;
- synchronisations externes.

Les noms exacts doivent rester dans le langage métier du système.

---

## Cycle de vie

Le domaine `pricing` possède un cycle de vie partiel.

Le cycle ne porte pas nécessairement un objet métier unique comparable à une commande, mais il doit au minimum distinguer :

- brouillon ;
- prêt à être utilisé ;
- actif ;
- inactif ;
- archivé ou obsolète,

pour toute configuration ou règle tarifaire qui relève du domaine.

Si le modèle exact repose sur :

- des règles ;
- des grilles ;
- des versions ;
- des listes de prix ;
- des contextes de tarification,

le cycle de vie de ces objets doit être explicité.

Le domaine ne doit pas se contenter d’une logique implicite de “dernière valeur écrasante” si une gouvernance d’état est nécessaire.

---

## Interfaces et échanges

Le domaine `pricing` expose principalement :

- des lectures tarifaires ;
- des calculs ou déterminations de prix applicables ;
- des commandes de mutation des règles tarifaires ;
- des sorties structurées vers `cart`, `checkout` et `orders` ;
- des événements significatifs liés aux changements de tarification.

Le domaine reçoit principalement :

- des contextes de tarification ;
- des mutations produit pertinentes ;
- des changements de configuration commerciale ;
- des imports ou synchronisations ;
- des paramètres de store, canal ou segment si le modèle les utilise.

Le domaine ne doit pas exposer un contrat instable ou purement technique au reste du système.

---

## Contraintes d’intégration

Le domaine `pricing` peut être exposé à des contraintes fortes :

- imports massifs ;
- recalculs différés ;
- synchronisations externes ;
- versionnement de règles ;
- conflits entre grilles de prix ;
- ordre de réception non garanti ;
- divergence temporaire entre référentiel interne et source externe ;
- dépendance à des paramètres de contexte incomplets.

Règles minimales :

- toute entrée externe doit être validée ;
- la hiérarchie d’autorité doit être explicite ;
- les recalculs rejouables doivent être idempotents ou neutralisés ;
- une projection externe ne doit pas silencieusement redéfinir la vérité interne ;
- un prix calculé doit rester explicable et traçable ;
- un échec de synchronisation ne doit pas corrompre le modèle tarifaire interne.

---

## Observabilité et audit

Le domaine `pricing` doit rendre visibles au minimum :

- les changements de règles tarifaires ;
- les changements de configuration active ;
- les recalculs significatifs ;
- les erreurs de calcul ;
- les conflits de contexte ;
- les rejets de validation ;
- les écarts critiques entre système interne et système externe ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quel prix ou quelle règle a changé ;
- quand ;
- selon quelle origine ;
- avec quel impact visible ;
- pour quel périmètre ;
- sous quelle autorité.

L’observabilité doit distinguer :

- erreur de calcul métier ;
- incohérence de configuration ;
- erreur d’intégration ;
- retard de synchronisation ;
- recalcul différé.

---

## Impact de maintenance / exploitation

Le domaine `pricing` a un impact d’exploitation très élevé.

Raisons :

- il irrigue plusieurs parcours critiques ;
- une erreur tarifaire contamine immédiatement le panier, le checkout et la commande ;
- il peut être fortement exposé aux imports et synchronisations ;
- il peut porter une logique contextuelle complexe ;
- ses erreurs peuvent avoir un impact financier, juridique et commercial.

En exploitation, une attention particulière doit être portée à :

- la lisibilité des règles ;
- la traçabilité des changements ;
- les conflits de configuration ;
- les recalculs ;
- la cohérence avec `taxation` et `discounts` ;
- les écarts entre prix affiché, prix calculé et prix figé en commande ;
- les effets de bord des activations ou désactivations de règles.

Le domaine doit être considéré comme critique et fortement gouverné.

---

## Limites du domaine

Le domaine `pricing` s’arrête :

- avant la définition du produit ;
- avant la politique fiscale ;
- avant la logique complète de remise si elle relève d’un autre domaine ;
- avant l’acte de paiement ;
- avant l’authentification et les droits ;
- avant les projections externes spécifiques à un canal ;
- avant le stockage physique ou la disponibilité ;
- avant les capacités purement marketing ou éditoriales.

Le domaine fournit une vérité de tarification.
Il ne doit pas devenir la somme de toutes les politiques commerciales du système.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `pricing` et `discounts` ;
- la frontière exacte entre `pricing` et `taxation` ;
- la frontière exacte entre `pricing` et `channels` ;
- le modèle canonique du prix : liste de prix, règle, grille, version, contexte, autre ;
- le niveau d’autorité des systèmes externes sur les montants internes ;
- la gestion du multi-store, multi-channel ou multi-segment ;
- la nature exacte des prix figés à la commande vs recalculables.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/10-principes-d-architecture.md`
- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../../architecture/20-structure/21-domaines-coeur.md`
- `products.md`
- `cart.md`
- `checkout.md`
- `orders.md`
- `payments.md`
- `taxation.md`
- `stores.md`
- `../../domains/satellites/discounts.md`
- `../../domains/satellites/channels.md`
