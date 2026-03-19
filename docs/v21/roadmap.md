# Roadmap V21

## Rôle du document

Ce document fixe l'ordre d'exécution de V21 tel qu'il est retenu à ce stade.

Il ne décrit pas des lots déjà livrés au-delà de ce qui est visible dans le code. Il décrit :

- les lots réalisés
- les lots encore à faire
- leurs dépendances
- l'ordre de traitement retenu

## Vue d'ensemble

| Lot | Domaine | Statut | Dépendances directes |
| --- | --- | --- | --- |
| `V21-1` | cadrage | fait | aucune |
| `V21-2A` | `catalog` socle interne | fait | `V21-1` |
| `V21-2B` | `catalog` finalisation | à faire | `V21-2A` |
| `V21-3` | `order` | à faire | `V21-1`, `V21-2A` |
| `V21-4` | `products` | à faire | `V21-1`, `V21-3` |
| `V21-5` | petits domaines restants | à faire | `V21-1`, `V21-3`, `V21-4` |

## Ordre d'exécution retenu

Ordre de travail retenu :

1. `V21-1`
2. `V21-2A`
3. `V21-2B`
4. `V21-3`
5. `V21-4`
6. `V21-5`

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

### `V21-4` — `products`

Statut : à faire.

Contenu prévu :

- modularisation interne de `db/repositories/products/**`
- introduction de `types/`, `queries/`, `helpers/` locaux
- réduction de [admin-product.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/admin-product.repository.ts)
- conservation de [simple-product-compat.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/simple-product-compat.ts) tant que son rôle reste strictement interne et lisible

Pourquoi ce lot :

- le domaine est déjà partiellement découpé en plusieurs repositories publics
- la densité reste forte sur `admin-product`
- l'articulation produit / variantes / images / compatibilité doit être clarifiée sans changer la surface publique

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

## Dépendances entre lots

### Dépendances structurelles

- `V21-2A` dépend de l'audit `V21-1`
- `V21-2B` dépend directement de `V21-2A`
- `V21-3` dépend de la doctrine et du séquençage posés par `V21-1` et du premier domaine pilote `V21-2A`
- `V21-4` dépend du retour d'expérience de `V21-3` sur un domaine transactionnel plus dense
- `V21-5` dépend de la stabilisation des décisions prises sur `catalog`, `order` et `products`

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
