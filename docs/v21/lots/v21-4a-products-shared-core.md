# V21-4A — `products` : socle partagé

## Summary

V21-4A est le lot prévu pour extraire le socle partagé du domaine `products`, centré sur [admin-product.repository.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/admin-product.repository.ts), sans encore traiter le détail variantes + images comme lot séparé.

## Objectif

Réduire la densité de `admin-product.repository.ts` en sortant les lectures et helpers internes partagés du domaine `products`, tout en laissant inchangé le rôle de [simple-product-compat.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/products/simple-product-compat.ts).

## Audit de départ / contexte réel

État réel actuel :

- `admin-product.repository.ts` : 592 lignes
- `admin-product.types.ts` : 96 lignes
- `simple-product-compat.ts` : 126 lignes

`admin-product.repository.ts` mélange aujourd'hui :

- validation locale des identifiants et catégories
- mappage d'erreurs Prisma
- chargement du détail admin
- calcul local du `simpleOffer`
- remplacement des catégories produit
- mutations transactionnelles de création et mise à jour
- chargement du contexte de publication

## Périmètre exact

V21-4A doit couvrir :

- la modularisation interne de `admin-product.repository.ts`
- l'introduction de `types/`, `queries/` et `helpers/` locaux au domaine `products`
- la clarification des blocs partagés entre lecture détail, publication, catégories et offre simple

## Hors périmètre exact

V21-4A ne doit pas couvrir :

- la modularisation complète des variantes
- la modularisation complète des images
- le renommage de `simple-product-compat.ts`
- un changement des façades publiques `admin-product.repository.ts` et `admin-product.types.ts`

## Fichiers potentiellement concernés

- `db/repositories/products/admin-product.repository.ts`
- `db/repositories/products/admin-product.types.ts`
- `db/repositories/products/simple-product-compat.ts`
- nouveaux fichiers internes sous `db/repositories/products/types/`
- nouveaux fichiers internes sous `db/repositories/products/queries/`
- nouveaux fichiers internes sous `db/repositories/products/helpers/`

## Invariants à préserver

Invariants critiques :

- règles de `productType`
- cohérence des catégories produit
- compatibilité `simple product` / héritage legacy
- contrat `AdminProductPublishContext`
- contrats publics admin produit inchangés
- rôle inchangé de `simple-product-compat.ts`

## Risques principaux

Risques principaux :

- casser la compatibilité entre offre simple native et variante legacy
- casser la validation de changement de type de produit
- déplacer trop tôt la logique encore plus lisible dans la façade
- diluer la lecture du détail admin dans trop de fichiers

## Vérifications obligatoires

- `pnpm run typecheck`
- `pnpm run lint`
- vérification ciblée des façades `admin-product.repository.ts` et `admin-product.types.ts`
- vérification de l'absence de changement sur `simple-product-compat.ts`

## Critères de fin

V21-4A est considéré terminé quand :

- `admin-product.repository.ts` est sensiblement réduit
- les blocs partagés réellement réutilisables sont extraits
- `simple-product-compat.ts` conserve son rôle interne actuel
- les façades publiques restent stables
- `typecheck` et `lint` passent

## Compatibilité publique

Compatibilité attendue :

- mêmes chemins publics `admin-product.repository.ts` et `admin-product.types.ts`
- mêmes exports publics
- mêmes signatures runtime

## Décisions ou ambiguïtés connues

Décisions déjà retenues :

- le lot doit rester centré sur le socle partagé
- `simple-product-compat.ts` ne doit pas être renommé ni transformé par principe

Ambiguïtés connues :

- certains helpers actuellement locaux pourront rester dans la façade si leur extraction ne réduit pas réellement la complexité
