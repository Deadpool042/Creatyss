# Roadmap V21

## Rôle du document

Ce document fixe l'ordre d'exécution de V21 tel qu'il est retenu à ce stade.

Il ne décrit pas des lots déjà livrés au-delà de ce qui est visible dans le code. Il décrit :

- les lots réalisés
- les lots encore à faire
- leurs dépendances
- l'ordre de traitement retenu

## Vue d'ensemble

| Lot | Domaine | Statut | Dépendances directes | Objectif | Risque | Critère de fin |
| --- | --- | --- | --- | --- | --- | --- |
| `V21-1` | cadrage | fait | aucune | figer l'audit réel de `db/repositories/` | faible | plan de lots validé, aucun code modifié |
| `V21-2A` | `catalog` socle interne | fait | `V21-1` | extraire les blocs stables de `catalog` | faible à moyen | façades publiques stables, `queries/` et `helpers/` initiaux en place |
| `V21-2B` | `catalog` cœur | à faire | `V21-2A` | traiter `listPublishedProducts` et `getPublishedProductBySlug` | élevé | cœur `catalog` internalisé sans changement de comportement |
| `V21-3` | `order` | à faire | `V21-1`, `V21-2A` | modulariser `order` derrière ses façades publiques | élevé | `order.repository.ts` allégé, invariants transactionnels intacts |
| `V21-4A` | `products` socle partagé | à faire | `V21-1`, `V21-3` | sortir le cœur partagé du domaine `products` | moyen à élevé | `admin-product.repository.ts` réduit, compatibilité produit simple intacte |
| `V21-4B` | `products` variantes et images | à faire | `V21-4A` | modulariser variantes et images | élevé | règles `is_default` et `is_primary` inchangées, façades stables |
| `V21-5` | petits domaines restants | à faire | `V21-1`, `V21-3`, `V21-4A`, `V21-4B` | nettoyer seulement les domaines où le gain est net | moyen | domaines utiles clarifiés sans churn opportuniste |
| `V21-final-state` | état final | à faire | `V21-2B`, `V21-3`, `V21-4A`, `V21-4B`, `V21-5` | figer l'état cible final de `db/repositories/` | faible | structure V21 documentée et cohérente avec le code livré |

## Ordre d'exécution retenu

Ordre de travail retenu :

1. `V21-1`
2. `V21-2A`
3. `V21-2B`
4. `V21-3`
5. `V21-4A`
6. `V21-4B`
7. `V21-5`
8. `V21-final-state`

Cet ordre est conservateur :

- `catalog` a servi de premier domaine pilote
- `order` reste prioritaire après `catalog`
- `products` vient ensuite car sa structure est déjà partiellement découpée mais encore dense
- les petits domaines sont traités en dernier, seulement si le gain structurel reste supérieur au churn

## Détail des lots

### `V21-1` — cadrage et audit concret

Statut : fait.

Contenu :

- audit réel de `db/repositories/`
- identification des plus gros fichiers
- inventaire des extractions naturelles
- définition de la structure cible minimale par domaine
- séquençage par lots sûrs

Pourquoi ce lot :

- éviter un refactor big bang
- préserver les façades publiques existantes
- fixer un ordre de travail cohérent avant écriture

### `V21-2A` — `catalog` : extraction du socle interne

Statut : fait.

Contenu :

- maintien de [catalog.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/catalog.repository.ts) comme façade publique
- maintien de [catalog.types.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/catalog.types.ts) comme façade publique de types
- extraction des outputs publics vers [types/outputs.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/types/outputs.ts)
- extraction du helper d'image primaire vers [helpers/primary-image.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/helpers/primary-image.ts)
- extraction de la reconstruction batch des catégories homepage vers [helpers/category-representative-image.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/helpers/category-representative-image.ts)
- extraction des queries simples homepage / blog / recent products vers `queries/`

Pourquoi ce lot :

- créer un premier découpage interne réel
- réduire immédiatement la densité de `catalog.repository.ts`
- garder hors périmètre les deux flux les plus lourds du domaine

### `V21-2B` — `catalog` : finalisation des extractions restantes

Statut : à faire.

Contenu prévu :

- traitement de `listPublishedProducts`
- traitement de `getPublishedProductBySlug`
- revue du rôle de `catalog.mappers.ts`
- réduction supplémentaire de `catalog.repository.ts`

Pourquoi ce lot :

- finaliser la modularisation de `catalog`
- sortir les flux encore denses qui sont restés en façade après V21-2A

Dépendance :

- `V21-2A` a déjà extrait les blocs stables réutilisables nécessaires pour traiter ce lot plus tard sans changer l'API publique

### `V21-3` — `order`

Statut : à faire.

Contenu prévu :

- création d'une structure interne locale sous `db/repositories/orders/`
- maintien de [order.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/order.repository.ts) et [order.types.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/order.types.ts) comme façades publiques
- extraction des lectures, helpers transactionnels, restock et mapping internes

Pourquoi ce lot :

- [order.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/order.repository.ts) reste le plus gros repository plat du projet
- le domaine combine lectures publiques, lectures admin, orchestration transactionnelle et helpers de stock

### `V21-4A` — `products` : socle partagé

Statut : à faire.

Contenu prévu :

- extraction du cœur partagé autour de [admin-product.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/admin-product.repository.ts)
- introduction de `types/`, `queries/`, `helpers/` locaux au domaine
- conservation du rôle actuel de [simple-product-compat.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/simple-product-compat.ts)

Pourquoi ce lot :

- [admin-product.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/admin-product.repository.ts) reste la plus grosse façade du domaine `products`
- le domaine mélange encore chargement du détail, catégories, publication et compatibilité simple produit

### `V21-4B` — `products` : variantes et images

Statut : à faire.

Contenu prévu :

- modularisation interne de [admin-product-variant.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/admin-product-variant.repository.ts)
- modularisation interne de [admin-product-image.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/admin-product-image.repository.ts)
- clarification des helpers variantes / images autour des mêmes façades publiques

Pourquoi ce lot :

- les règles `is_default` et `is_primary` restent critiques et techniques
- les repositories variantes et images sont déjà séparés publiquement mais restent encore denses en interne

### `V21-5` — petits domaines restants

Statut : à faire.

Périmètre prévu :

- `admin-category`
- `admin-homepage`
- `payment`
- `guest-cart`
- `order-email`

Pourquoi ce lot :

- certains domaines plats peuvent gagner en lisibilité
- d'autres risquent surtout de créer du churn sans bénéfice réel

Règle de ce lot :

- ne traiter que les domaines où le gain structurel est net
- ne pas refactorer par symétrie

### `V21-final-state` — état final attendu

Statut : à faire.

Contenu prévu :

- figer l'état final attendu de `db/repositories/` après les lots V21
- expliciter les façades publiques conservées
- expliciter les sous-dossiers internes réellement introduits
- expliciter ce qui restera volontairement hors V21

Pourquoi ce lot :

- fermer V21 avec une vue finale cohérente avec le code livré
- éviter qu'une doctrine incomplète reste implicite après les refactors

## Dépendances entre lots

### Dépendances structurelles

- `V21-2A` dépend de l'audit `V21-1`
- `V21-2B` dépend directement de `V21-2A`
- `V21-3` dépend de la doctrine et du séquençage posés par `V21-1` et du premier domaine pilote `V21-2A`
- `V21-4A` dépend du retour d'expérience de `V21-3` sur un domaine transactionnel plus dense
- `V21-4B` dépend de `V21-4A`
- `V21-5` dépend de la stabilisation des décisions prises sur `catalog`, `order` et `products`
- `V21-final-state` dépend de la fermeture documentaire des lots précédents

### Dépendances de compatibilité

Tous les lots V21 dépendent des invariants hérités de V19 :

- Prisma only
- pas de raw SQL
- contrats publics stables
- pas de modification de logique métier

Tous les lots V21 dépendent aussi de la doctrine V20 :

- repository comme façade publique
- modularisation interne locale au domaine
- pas de couche `services/`
- pas de structure globale `db/queries/`

## Lecture opérationnelle

Cette roadmap ne décrit pas un calendrier.

Elle décrit l'ordre de refactor retenu et les dépendances techniques entre lots, pour éviter :

- le churn de chemins publics
- les extractions prématurées
- les refactors simultanés de plusieurs domaines denses
