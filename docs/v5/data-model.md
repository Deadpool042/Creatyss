# Data model V5

## Direction retenue

La V5 ne remplace pas le catalogue actuel. Elle le clarifie.

Le modele reste centre sur `products` et `product_variants`, mais introduit
une lecture metier explicite de deux cas :

- `simple`
- `variable`

## Entites minimales

### Produit

Le produit devient explicitement typé.

Au niveau metier, il porte toujours :

- son identite catalogue
- son contenu descriptif
- ses categories
- son exposition publique

La V5 ajoute surtout une distinction de comportement :

- un produit `simple` est achetable comme une offre unique
- un produit `variable` reste porte par des declinaisons vendables

### Declinaison vendable

`product_variants` reste l'entite vendable pour les produits `variable`.

La variante continue de porter :

- SKU
- prix
- stock
- disponibilite derivee
- informations de couleur ou de declinaison

La V5 ne cherche pas a transformer la variante en moteur generique
d'attributs.

### Lecture catalogue

La lecture catalogue doit devenir coherente selon le type :

- `simple` : la fiche et l'achat peuvent etre lus comme une offre unique
- `variable` : la fiche et l'achat restent guides par les declinaisons

L'objectif est de rendre cette difference explicite, pas de multiplier les
cas.

## Relations cles

- `products` reste l'entree catalogue principale
- `product_variants` reste lie a `products`
- les produits `variable` s'appuient sur leurs declinaisons vendables
- les produits `simple` utilisent un chemin de lecture plus direct, sans
  casser la structure existante

## Regles metier cles

- un produit `simple` doit etre achetable sans matrice de declinaisons
- un produit `variable` doit conserver le fonctionnement actuel par
  declinaisons vendables
- la V5 ne doit pas casser les produits variables existants
- la compatibilite de migration doit rester simple et lisible
- l'admin ne doit montrer que ce qui est utile pour le type de produit

## Resultat attendu

Le modele V5 doit permettre :

- d'expliciter le type reel d'un produit
- de simplifier la lecture catalogue et admin
- de conserver les produits variables deja en production
- d'eviter un glissement vers un systeme produit trop riche ou trop abstrait
