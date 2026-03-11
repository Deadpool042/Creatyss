# Scope V3

## Vision

La V3 prolonge la V2 actuelle sans changer sa direction principale :

- catalogue, panier, checkout, commandes et paiement simple existent deja
- l'enjeu suivant est de rendre l'apres-achat exploitable au quotidien
- l'admin doit pouvoir faire avancer une commande simplement

La V3 ne cherche pas a ajouter une nouvelle couche commerce. Elle vise
surtout a rendre les commandes actionnables, suivables et communiquees
proprement apres l'achat.

## Point de depart

La V2 actuelle couvre deja :

- catalogue administrable
- stock par variante
- panier invite
- checkout simple
- creation de commande
- paiement Stripe Checkout
- admin commandes en lecture seule

La V3 ajoute les briques d'exploitation qui manquent encore a cette base :

- action admin sur le cycle de vie de commande
- expedition simple
- suivi minimal
- emails transactionnels minimaux
- petits gains UX post-achat utiles

## Inclus

- statuts de commande plus actionnables cote admin
- expedition simple sur une commande
- numero ou lien de suivi simple si disponible
- pages admin commandes plus utiles pour preparer et expedir
- emails transactionnels minimaux :
  - confirmation de commande
  - confirmation d'expedition
- etat post-achat public plus lisible

## Exclu

- espace client complet
- centre de support client
- coupons ou promotions avancees
- automatisations marketing
- multi-langue
- logistique complexe multi-colis
- integration transporteur avancee
- SLA ou workflow d'exploitation enterprise

## Priorites

1. permettre a l'admin de faire avancer une commande simplement
2. rendre l'expedition visible et lisible
3. informer la cliente avec un minimum d'emails utiles
4. garder l'etat post-achat coherent entre public et admin
5. conserver une implementation simple et testable localement

## Criteres de fin V3

La V3 est consideree utile quand :

- une commande peut etre marquee comme preparee puis expediee
- l'admin peut saisir un suivi minimal si necessaire
- la commande affiche un etat post-achat coherent cote public et admin
- les emails transactionnels minimaux partent sur les evenements utiles
- le flux reste lisible et sans logique d'exploitation complexe
