# Scope V2

## Vision

La V2 transforme la V1 actuelle en boutique vraiment achetable, sans changer sa direction principale :

- catalogue administrable deja en place
- checkout invite simple
- stock gere par variante
- commandes visibles et suivies dans l'admin
- paiement simple

La V2 ne cherche pas a devenir une plateforme e-commerce complete. Elle ajoute le strict necessaire pour vendre proprement les produits deja geres dans l'admin.

## Point de depart

La V1 actuelle couvre deja :

- catalogue produits avec variantes et images
- categories
- blog
- homepage editable
- media locaux
- admin authentifie
- SEO de base

La V2 ajoute les briques transactionnelles qui manquent encore a cette base :

- panier
- checkout
- commandes
- stock
- paiement
- admin commandes

## Inclus

- stock porte par `product_variants`
- disponibilite simple par variante
- panier invite
- recapitulatif panier
- checkout simple avec informations client et adresse
- creation de commande
- lignes de commande figees au moment de l'achat
- paiement simple sur un flux unique
- page ou etat de confirmation de commande
- admin commandes avec liste et detail simple
- statuts de commande minimaux et lisibles

## Exclu

- coupons
- promotions avancees
- espace client complet
- historique client cote public
- multi-adresse
- multi-livraison
- multi-devise
- paiement en plusieurs fois
- moteur fiscal avance
- moteur de livraison complexe
- OMS ou logistique avancee

## Priorites

1. rendre un achat possible de bout en bout
2. garantir la coherence du stock par variante
3. figer proprement les donnees de commande
4. permettre a l'admin de suivre les commandes sans UI lourde
5. garder une implementation simple et maintenable

## Criteres de fin V2

La V2 est consideree livrable quand :

- une variante en stock peut etre ajoutee au panier
- un checkout invite peut creer une commande valide
- le stock de la variante est mis a jour correctement
- le paiement simple aboutit a un etat de commande coherent
- l'admin peut consulter la liste des commandes et leur detail
- les cas simples de rupture de stock sont geres clairement
