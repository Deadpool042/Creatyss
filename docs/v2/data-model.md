# Data model V2

## Direction retenue

La V2 prolonge le modele V1 existant sans le refondre. Le catalogue reste porte par :

- `products`
- `product_variants`
- `product_images`
- `categories`

Les nouvelles entites V2 ajoutent seulement ce qui manque pour acheter.

## Entites minimales

### Stock de variante

Le stock est porte par la variante, pas par le produit parent.

Chaque `product_variant` doit pouvoir exprimer au minimum :

- une quantite disponible
- un etat simple de disponibilite si necessaire

La variante reste l'unite vendable.

### Cart

Le panier represente une intention d'achat simple pour une session invite.

Il contient :

- un identifiant de panier
- un etat simple
- des lignes de panier
- des timestamps

Le panier ne devient pas un compte client.

### Cart item

Une ligne de panier pointe vers une variante et conserve au minimum :

- la variante choisie
- la quantite
- le prix unitaire observe au moment de l'ajout ou du recalcul

La validation finale reste faite au checkout.

### Order

La commande represente l'achat confirme.

Elle doit figer au minimum :

- une reference de commande
- les informations client utiles au checkout
- l'adresse de livraison/facturation simple si retenue comme meme bloc
- les montants principaux
- un statut de commande
- un statut de paiement
- des timestamps

### Order item

Une ligne de commande fige les donnees produit au moment de l'achat :

- identifiant de variante source
- nom produit
- nom variante / couleur
- SKU
- prix unitaire fige
- quantite
- total de ligne

Les lignes de commande ne doivent pas dependre du catalogue vivant pour rester lisibles apres modification du produit.

### Payment

Le paiement reste simple en V2.

Il doit permettre de conserver au minimum :

- la commande cible
- le fournisseur ou mode de paiement retenu
- un statut de paiement
- une reference externe si disponible
- les timestamps utiles

## Relations cles

- un `product` a plusieurs `product_variants`
- une `product_variant` peut etre ajoutee a plusieurs `cart_items`
- un `cart` a plusieurs `cart_items`
- un `order` a plusieurs `order_items`
- un `order` peut avoir un paiement simple associe
- les `order_items` gardent un lien vers la variante source si utile, mais restent lisibles meme si le catalogue evolue

## Regles metier cles

- seule une variante peut etre achetee
- le stock est controle par variante
- une variante sans stock ne doit pas etre commandable
- le checkout revalide prix et stock avant creation de commande
- la commande fige ses lignes et ses montants au moment de la validation
- le panier reste modifiable tant que la commande n'est pas creee
- l'admin lit et suit les commandes ; il ne gere pas une logique de back-office complexe en V2

## Resultat attendu

Le modele V2 doit rester petit, lisible et assez stable pour permettre :

- un flux panier -> checkout -> commande
- un suivi admin des commandes
- une evolution future vers livraison, paiements plus riches ou espace client si necessaire
