# Roadmap V2

## Direction retenue

La V2 avance par petits lots vers une boutique achetable simple :

1. stock par variante
2. panier invite
3. checkout simple
4. commandes + admin commandes
5. paiement simple

Chaque lot doit rester utile seul et preparer le suivant sans sur-architecture.

## Lot 1 - Stock par variante

Objectif :

- rendre la disponibilite vendable explicite au niveau `product_variants`

Livrables minimaux :

- stock simple par variante
- validation de disponibilite
- affichage public basique de disponibilite si necessaire
- edition admin minimale du stock

Dependance :

- V1 actuelle

## Lot 2 - Panier invite

Objectif :

- permettre de composer un panier sans espace client

Livrables minimaux :

- ajout au panier par variante
- modification de quantite
- suppression de ligne
- recapitulatif simple

Dependance :

- lot 1

## Lot 3 - Checkout simple

Objectif :

- collecter le minimum d'informations pour transformer le panier en commande

Livrables minimaux :

- formulaire checkout invite
- recapitulatif final
- revalidation stock et prix
- prevention des commandes invalides

Dependance :

- lot 2

## Lot 4 - Commandes

Objectif :

- creer la commande et la rendre visible cote admin

Livrables minimaux :

- creation de commande
- lignes de commande figees
- decrement de stock
- page de confirmation simple
- liste admin commandes
- detail admin commande

Dependance :

- lot 3

## Lot 5 - Paiement simple

Objectif :

- brancher un paiement simple sans complexifier la V2

Livrables minimaux :

- integration d'un flux de paiement unique
- statut de paiement
- coherence entre paiement et commande
- retours simples en succes ou echec

Dependance :

- lot 4

## Strategie d'implementation

- garder les lots petits et testables localement
- etendre le modele V1 existant plutot que le refondre
- preferer un checkout invite unique avant toute logique de compte client
- garder l'admin commandes lisible et strictement utile
- deferer toute logique avancee a une phase ulterieure

## Base utile de V2

La V2 devient utile des que le projet permet :

- d'acheter une variante en stock
- de payer simplement
- de creer une commande coherente
- de suivre cette commande cote admin
