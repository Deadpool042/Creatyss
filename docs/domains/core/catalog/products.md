# Produits

## Rôle

Le domaine `products` porte le référentiel produit central du système.

Il définit ce qu’est un produit du point de vue métier, comment il est identifié, structuré, qualifié et exposé au reste du système.

Le domaine existe pour fournir une représentation produit stable, cohérente et exploitable par les autres domaines coeur et capacités optionnelles.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur`

### Activable

`non`

Le domaine `products` est non optionnel.
Sans lui, le système ne peut pas porter un catalogue exploitable ni soutenir correctement les parcours métier dépendants des produits.

---

## Source de vérité

Le domaine `products` est la source de vérité pour :

- l’identité produit interne ;
- la définition métier de base d’un produit ;
- les attributs structurants du produit ;
- la structure produit nécessaire aux usages du système ;
- les relations de rattachement métier explicitement portées par le domaine ;
- les états métier du référentiel produit lorsque ceux-ci relèvent du produit lui-même.

Le domaine `products` n’est pas la source de vérité pour :

- les prix calculés ou publiés, qui relèvent de `pricing` ;
- les stocks physiques ou virtuels, qui relèvent de `availability` et/ou `inventory` selon le modèle retenu ;
- les médias binaires eux-mêmes, qui relèvent de `media` si ce domaine existe comme satellite distinct ;
- les règles de taxation, qui relèvent de `taxation` ;
- les règles promotionnelles ou remises, qui ne relèvent pas du référentiel produit central ;
- les projections vers des canaux, marketplaces ou systèmes externes.

Si un système externe alimente les données produit, il ne devient pas automatiquement la source de vérité du domaine.
Le domaine `products` reste responsable de la représentation interne faisant autorité dans le système.

---

## Responsabilités

Le domaine `products` est responsable de :

- définir le concept métier de produit dans le système ;
- attribuer et maintenir les identifiants internes nécessaires ;
- porter les attributs métier structurants du produit ;
- garantir la cohérence minimale d’un produit exploitable ;
- exposer un référentiel produit stable aux autres domaines ;
- gérer les états produit qui relèvent du référentiel central ;
- encadrer les mutations du référentiel produit ;
- publier les événements significatifs liés à la vie du produit ;
- fournir une base cohérente aux domaines dépendants comme `cart`, `checkout`, `orders`, `search`, `seo`, `recommendations` ou `marketplace`.

Le domaine peut également être responsable, selon le périmètre exact du projet, de :

- la relation entre produit parent et variantes ;
- certains regroupements structurants nécessaires au catalogue ;
- certaines métadonnées métier centrales ;
- le statut de publication interne du produit, si ce statut relève bien du référentiel et non d’un canal externe.

---

## Non-responsabilités

Le domaine `products` n’est pas responsable de :

- calculer les prix, remises, taxes ou montants finaux ;
- arbitrer les disponibilités physiques ou logiques ;
- gérer les paniers ;
- gérer le tunnel de commande ;
- gérer les commandes ;
- gérer les paiements ;
- gérer l’expédition ;
- gérer les autorisations d’accès ;
- définir la logique d’intégration vers un fournisseur externe ;
- exécuter les synchronisations externes ;
- stocker ou distribuer les médias techniques en tant que tels ;
- gouverner les projections SEO, search, analytics ou marketing ;
- porter la logique métier des bundles, discounts, gifting ou autres capacités optionnelles si elles existent comme domaines distincts.

Le domaine `products` ne doit pas devenir un conteneur générique pour toute donnée “attachée à un produit”.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- un produit doit avoir une identité interne stable ;
- un produit ne doit pas exister dans un état incohérent par rapport à ses attributs structurants ;
- la structure produit exposée au reste du système doit rester exploitable ;
- une variante ne doit pas exister sans rattachement valide si le modèle produit/variante est retenu ;
- les attributs obligatoires à l’exploitation métier doivent être présents avant exposition dans les flux qui les exigent ;
- un produit ne doit pas être ambigu dans sa qualification métier de base ;
- les transitions d’état du produit doivent respecter les règles du cycle de vie défini ;
- une mutation du référentiel produit ne doit pas casser silencieusement les contrats attendus par les domaines consommateurs.

Les invariants exacts doivent être ajustés selon le modèle catalogue réel, mais le domaine doit toujours exprimer des règles de cohérence propres.
Une simple accumulation de champs ne constitue pas un domaine.

---

## Dépendances

### Dépendances métier

Le domaine `products` interagit fortement avec :

- `pricing`
- `availability`
- `cart`
- `checkout`
- `orders`
- `search`
- `seo`
- `recommendations`
- `marketplace`
- `categories`
- `media`

### Dépendances techniques ou d’intégration

Le domaine peut dépendre de :

- mécanismes d’import ;
- jobs de synchronisation ;
- adaptateurs d’intégration ;
- webhooks ou flux entrants indirects ;
- projections vers des systèmes externes.

### Règle de frontière

Le domaine `products` consomme ou expose des informations vers ces blocs, mais il ne doit pas absorber leurs responsabilités.

En particulier :

- `products` ne décide pas des prix ;
- `products` ne décide pas des disponibilités ;
- `products` ne décide pas des règles de canal ;
- `products` ne décide pas des statuts d’exécution de synchronisation.

---

## Événements significatifs

Le domaine `products` publie ou peut publier des événements significatifs tels que :

- produit créé ;
- produit mis à jour ;
- produit archivé ;
- produit activé ;
- produit désactivé ;
- variante créée ;
- variante mise à jour ;
- structure produit modifiée ;
- statut produit changé.

Le domaine peut consommer des signaux liés à :

- imports de catalogue ;
- synchronisations de données ;
- mises à jour de médias ;
- rattachements de catégories ;
- projections vers des canaux.

Les noms exacts des événements doivent rester dans le langage métier du système.
Ils ne doivent pas refléter directement un vocabulaire de fournisseur externe.

---

## Cycle de vie

Le domaine `products` possède un cycle de vie métier.

Le cycle exact dépend du périmètre retenu, mais il doit au minimum distinguer :

- brouillon / incomplet ;
- prêt à être exploité ;
- actif / publié ;
- inactif / suspendu ;
- archivé.

Les transitions doivent être explicites.

Exemples de transitions structurantes :

- création du produit ;
- enrichissement progressif ;
- activation ;
- désactivation ;
- archivage ;
- réactivation éventuelle si le modèle le permet.

Le domaine doit éviter les statuts flous ou purement techniques lorsqu’un statut métier est attendu.

---

## Interfaces et échanges

Le domaine `products` expose principalement :

- des commandes de création ;
- des commandes de mise à jour ;
- des lectures du référentiel produit ;
- des lectures structurées pour les domaines consommateurs ;
- des événements significatifs liés aux mutations du catalogue.

Le domaine reçoit principalement :

- des demandes de mutation internes ;
- des flux d’import ou de synchronisation si prévus par l’architecture ;
- des rattachements ou enrichissements provenant d’autres blocs, selon les frontières définies.

Le domaine ne doit pas exposer directement sa structure interne brute si une forme stabilisée est nécessaire pour les consommateurs.

---

## Contraintes d’intégration

Le domaine `products` est fortement exposé aux contraintes d’intégration.

Ces contraintes incluent typiquement :

- imports massifs ;
- synchronisations différées ;
- mises à jour partielles ;
- conflits de données ;
- rejouabilité ;
- idempotence sur les flux entrants ;
- ordre de réception non garanti ;
- dépendance éventuelle à des systèmes tiers de catalogue ou de PIM.

Règles minimales :

- les flux entrants doivent être validés ;
- les mutations rejouables doivent être idempotentes ou neutralisées ;
- la source de vérité doit rester explicite ;
- une projection externe ne doit pas rétro-imposer silencieusement sa structure au domaine ;
- un échec de synchronisation ne doit pas corrompre le référentiel interne.

---

## Observabilité et audit

Le domaine `products` doit rendre visibles au minimum :

- les créations ;
- les mises à jour significatives ;
- les changements d’état ;
- les erreurs de validation ;
- les échecs de synchronisation critiques ;
- les reprises ou relectures opératoires si elles existent ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quel produit a changé ;
- quand ;
- selon quel déclencheur ;
- avec quel impact métier visible ;
- via quelle origine de mutation si plusieurs canaux existent.

L’observabilité doit distinguer :

- les erreurs métier de cohérence produit ;
- les erreurs techniques d’intégration ;
- les retards ou rejets de projection.

---

## Impact de maintenance / exploitation

Le domaine `products` a un impact d’exploitation élevé.

Raisons :

- il alimente plusieurs domaines coeur ;
- il conditionne la qualité des parcours aval ;
- il est exposé aux imports, synchronisations et enrichissements ;
- une incohérence produit peut contaminer pricing, cart, checkout, orders, search et marketplace.

En exploitation, une attention particulière doit être portée à :

- la qualité des flux entrants ;
- la cohérence des mutations ;
- les erreurs de validation ;
- les incohérences de structure ;
- les projections incomplètes ;
- les effets de bord d’une modification de modèle produit.

Le domaine doit être considéré comme sensible mais stable.
Toute évolution de sa structure doit être gouvernée.

---

## Limites du domaine

Le domaine `products` s’arrête :

- avant la détermination du prix final ;
- avant la disponibilité exploitable à la vente ;
- avant le comportement panier / commande ;
- avant les politiques de taxation ;
- avant les projections spécifiques aux canaux externes ;
- avant la distribution technique des médias ;
- avant les fonctionnalités purement marketing ou éditoriales.

Le domaine fournit un référentiel produit cohérent.
Il ne doit pas devenir le point d’accumulation de toutes les informations périphériques du système.

---

## ProductCharacteristic

### Rôle métier

`ProductCharacteristic` porte les caractéristiques structurées d'un produit.

Une caractéristique est une paire **libellé / valeur** décrivant une propriété factuelle du produit :
matière, dimensions, fermeture, poids, composition, entretien, etc.

Ces données sont affichées telles quelles sur la fiche produit, sans transformation métier :
elles informent l'acheteur sur les attributs objectifs du produit.

### Portée V1

En V1, toutes les caractéristiques d'un produit sont visibles si elles existent.
Il n'y a pas de statut par caractéristique, pas de visibilité conditionnelle,
pas de filtrage par canal.

La seule condition d'affichage est la présence de données.

### Relation avec Product

Un `Product` possède zéro ou plusieurs `ProductCharacteristic`.

- Relation : `Product` 1 → N `ProductCharacteristic`
- Pas de partage entre produits : une caractéristique appartient à un seul produit
- Pas de `storeId` sur `ProductCharacteristic` : le produit est déjà scopé au store

### Ordre d'affichage

Le champ `sortOrder Int @default(0)` détermine l'ordre d'affichage des caractéristiques.

Les caractéristiques sont toujours lues ordonnées par `[sortOrder ASC, createdAt ASC]`.

L'ordre est géré en édition admin (stratégie replace-all à la sauvegarde).

### Comportement de suppression

Si un produit est supprimé, toutes ses caractéristiques sont supprimées automatiquement.

Contrainte : `onDelete: Cascade` sur la FK `productId → products.id`.

### Ce que ce n'est pas

- **Pas une variante** : une caractéristique ne génère pas de déclinaison produit.
  Les variantes relèvent de `ProductVariant` / `ProductOption`.
- **Pas un `ProductOption` ni un `ProductOptionValue`** : ces modèles servent à définir
  les axes de variation (taille, couleur…) et les valeurs sélectionnables par l'acheteur.
  Les caractéristiques sont purement informationnelles, non sélectionnables.
- **Pas du SEO** : les caractéristiques ne sont ni des métadonnées SEO ni du contenu
  structuré pour les moteurs de recherche. Elles relèvent du référentiel produit.
- **Pas du contenu éditorial global** : une caractéristique est toujours liée à un produit
  précis. Ce n'est pas une donnée de contenu partagée ou administrable globalement.
- **Pas de la disponibilité ni du stock** : ces responsabilités relèvent d'`availability`
  et d'`inventory`.

### Implémentation

- Table : `product_characteristics`
- Champs : `id`, `productId`, `label`, `value`, `sortOrder`, `createdAt`, `updatedAt`
- Index : `@@index([productId, sortOrder])`
- Présent dans la migration `20260421113740_init`

Rendu :

- Storefront : section "Caractéristiques" dans `features/storefront/catalog/product-page-template.tsx`
- Admin preview : même template partagé
- Admin éditeur : onglet "Caractéristiques" dans `features/admin/products/components/editor/product-characteristics-tab.tsx`

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- le modèle produit/variante exact ;
- le statut doctrinal de `categories` ;
- le statut doctrinal de `media` ;
- la frontière exacte entre `products` et `catalog-modeling` ;
- la frontière exacte entre `products` et `availability` / `inventory` ;
- la part du statut de publication portée par `products` vs `channels` ;
- la nature exacte des flux entrants faisant autorité.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../../architecture/10-fondations/10-principes-d-architecture.md`
- `../../../architecture/10-fondations/11-modele-de-classification.md`
- `../../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../../../architecture/20-structure/21-domaines-coeur.md`
- `../../../architecture/20-structure/23-systemes-externes-et-satellites.md`
- `../commerce/pricing.md`
- `availability.md`
- `../commerce/cart.md`
- `../commerce/checkout.md`
- `../commerce/orders.md`
- `../../satellites/categories.md`
- `../../satellites/media.md`
- `../../satellites/catalog-modeling.md`
