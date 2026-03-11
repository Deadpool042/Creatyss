# Roadmap V5

## Direction retenue

La V5 avance par petits lots autour d'un modele produit plus souple et plus
lisible :

1. type produit explicite et compatibilite de lecture
2. admin produit simplifie selon le type
3. lecture catalogue coherente `simple` / `variable`
4. finitions utiles de migration et de lisibilite

Chaque lot doit rester utile seul et conserver la compatibilite avec les
produits variables deja presents.

## Lot 1 - Type produit explicite

Objectif :

- rendre explicite le cas `simple` ou `variable`

Livrables minimaux :

- type produit clair
- lecture metier compatible avec l'existant
- compatibilite de base pour les produits variables deja presents

Dependance :

- V2, V3 et V4 actuelles

## Lot 2 - Admin produit simplifie

Objectif :

- adapter l'admin produit au type reel du produit

Livrables minimaux :

- edition plus lisible d'un produit `simple`
- edition plus claire d'un produit `variable`
- reduction des zones inutiles selon le type

Dependance :

- lot 1

## Lot 3 - Lecture catalogue coherente

Objectif :

- rendre la lecture publique plus naturelle selon `simple` ou `variable`

Livrables minimaux :

- fiche produit coherente selon le type
- ajout au panier lisible selon le type
- continuites claires pour disponibilite, prix et achat

Dependance :

- lots 1 et 2

## Lot 4 - Finitions utiles

Objectif :

- consolider la migration et la lisibilite du modele

Livrables minimaux :

- regles de compatibilite finalisees
- cas limites existants clarifies
- derniers ajustements de lisibilite admin et catalogue

Dependance :

- lots 1 a 3

## Strategie d'implementation

- prolonger le modele catalogue existant plutot que le refondre
- introduire seulement ce qui aide a distinguer `simple` et `variable`
- garder la compatibilite des produits variables comme contrainte forte
- preferer des transitions de lecture et d'admin claires a un moteur produit
  generique
- deferer toute logique produit avancee a une phase ulterieure

## Base utile de V5

La V5 devient utile des que le projet permet :

- d'exprimer clairement un produit `simple` ou `variable`
- de garder les produits variables existants sans rupture
- de simplifier l'admin produit selon le type
- de lire la fiche produit et l'achat de facon plus coherente
