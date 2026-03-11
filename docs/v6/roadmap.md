# Roadmap V6

## Direction retenue

La V6 avance par petits lots autour d'un modele produit pleinement assume :

1. produit `simple` natif cote modele
2. admin produit `simple` sans variante technique
3. lecture publique et achat coherents pour `simple`
4. migration douce et finitions de compatibilite

Chaque lot doit rester utile seul et conserver la stabilite du modele
`variable`.

## Lot 1 - Produit `simple` natif

Objectif :

- sortir le produit `simple` de sa dependance technique a une variante

Livrables minimaux :

- support explicite du produit `simple` natif dans le modele
- compatibilite maintenue pour `variable`
- lecture metier transitoire compatible avec l'existant

Dependance :

- V5 actuelle

## Lot 2 - Admin produit `simple`

Objectif :

- rendre l'edition d'un produit `simple` directe et lisible

Livrables minimaux :

- admin produit simple sans variante technique obligatoire
- admin produit variable conserve
- messages clairs sur les cas de compatibilite

Dependance :

- lot 1

## Lot 3 - Lecture publique et achat

Objectif :

- rendre la fiche et l'achat d'un produit `simple` pleinement coherents

Livrables minimaux :

- fiche produit simple lue comme une offre native
- ajout au panier direct pour `simple`
- parcours public variable conserve

Dependance :

- lots 1 et 2

## Lot 4 - Migration et finitions

Objectif :

- finaliser la transition sans bruit technique inutile

Livrables minimaux :

- migration douce des produits simples existants
- clarification des derniers cas limites
- coherences finales admin et catalogue

Dependance :

- lots 1 a 3

## Strategie d'implementation

- prolonger le modele V5 plutot que le refondre
- traiter `simple` comme l'effort principal de la V6
- conserver `variable` comme modele stable existant
- avancer par compatibilite et migration progressive
- eviter tout moteur produit complexe ou generique

## Base utile de V6

La V6 devient utile des que le projet permet :

- de gerer un produit `simple` nativement
- de garder les produits `variable` sans rupture
- d'editer et d'afficher chaque type de produit de facon naturelle
- de migrer depuis la V5 sans casser l'existant
