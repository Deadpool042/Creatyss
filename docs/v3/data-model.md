# Data model V3

## Direction retenue

La V3 prolonge les commandes V2 existantes. La commande reste la source de
verite du post-achat. La V3 n'ajoute pas de nouvel axe metier majeur : elle
etend simplement la commande, son suivi d'expedition et ses evenements de
communication.

## Entites minimales

### Order

La commande reste l'entite centrale.

En V3, elle doit pouvoir porter un cycle d'exploitation plus actionnable :

- commande recue
- commande preparee
- commande expediee
- commande annulee si besoin

Le statut de paiement reste separe et continue d'exprimer uniquement l'etat
du paiement.

### Shipment

L'expedition reste simple.

Une commande peut porter au minimum :

- une date d'expedition
- un transporteur libre ou une methode d'expedition simple
- une reference de suivi optionnelle
- un lien de suivi optionnel

La V3 ne cherche pas a modeliser une logistique multi-colis complete.

### Transactional email event

La V3 a besoin d'une trace minimale des emails envoyes, sans systeme complexe.

Cette trace doit permettre de savoir au minimum :

- quel type d'email a ete emis
- pour quelle commande
- a quelle date
- avec quel resultat simple

L'objectif n'est pas de construire une plateforme de messaging, seulement de
garder un minimum de visibilite et d'idempotence.

## Relations cles

- une `order` reste composee de `order_items` figes
- une `order` garde un `payment` simple associe
- une `order` peut porter zero ou une information d'expedition simple
- une `order` peut etre reliee a plusieurs evenements d'email transactionnel

## Regles metier cles

- la commande reste le centre du post-achat
- l'admin agit sur l'etat d'exploitation de la commande, pas sur ses lignes
- une commande payee peut avancer vers preparation puis expedition
- l'expedition reste optionnelle tant que la commande n'est pas expediee
- le suivi reste facultatif mais doit etre lisible s'il existe
- les emails suivent des evenements metier simples et ne doivent pas etre
  envoyes plusieurs fois pour le meme changement sans raison explicite
- public et admin doivent lire les memes etats metier

## Resultat attendu

Le modele V3 doit rester petit et lisible tout en permettant :

- une exploitation simple des commandes
- une expedition minimale
- une communication transactionnelle utile
- une evolution future vers un support client ou une logistique plus riche si
  cela devient necessaire
