# Data model V6

## Direction retenue

La V6 ne remplace pas le catalogue actuel. Elle termine la clarification
ouverte par la V5.

Le modele produit reste centre sur `products`, mais assume enfin deux formes
metier distinctes :

- `simple`
- `variable`

## Entites minimales

### Produit

Le produit devient l'entite principale dans tous les cas.

Il porte toujours :

- son identite catalogue
- son contenu descriptif
- ses categories
- son exposition publique

Pour un produit `simple`, il porte aussi directement l'offre vendable.

Pour un produit `variable`, il continue surtout a jouer le role de parent
catalogue.

### Offre simple native

Un produit `simple` n'a plus vocation a dependre d'une variante technique
obligatoire.

Au niveau metier, cela signifie qu'il doit pouvoir porter directement :

- prix
- stock
- disponibilite derivee
- SKU

L'objectif est de rendre son admin et sa lecture publique plus directs.

### Declinaison vendable

`product_variants` reste l'entite vendable pour les produits `variable`.

La variante conserve :

- SKU
- prix
- stock
- disponibilite derivee
- informations de couleur ou de declinaison

La V6 ne transforme pas ce modele en moteur d'attributs generique.

## Relations cles

- `products` reste l'entree catalogue principale
- un produit `variable` continue de s'appuyer sur `product_variants`
- un produit `simple` doit pouvoir etre lu, administre et achete sans variante
  technique obligatoire
- une phase transitoire peut laisser coexister les deux lectures pendant la
  migration

## Regles metier cles

- un produit `simple` doit etre vendable directement
- un produit `variable` doit conserver le fonctionnement actuel par
  declinaisons vendables
- la migration ne doit pas casser les produits `variable` deja presents
- la lecture publique doit rester coherente pendant la transition
- l'admin doit montrer seulement les informations utiles selon le type

## Resultat attendu

Le modele V6 doit permettre :

- d'assumer pleinement un produit `simple` natif
- de garder `variable` comme modele stable
- de simplifier l'admin et la lecture publique des produits simples
- de migrer progressivement sans introduire un systeme produit complexe
