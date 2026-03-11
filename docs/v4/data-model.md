# Data model V4

## Direction retenue

La V4 prolonge le modele catalogue deja en place. Elle ne change pas les
entites transactionnelles V2/V3. Elle ajoute seulement ce qui aide a mieux
trouver, lire et mettre en avant les produits.

## Entites minimales

### Catalogue indexable

Le catalogue existant doit pouvoir etre lu plus facilement par une recherche
simple.

Au niveau metier, cela suppose une vue exploitable des donnees deja presentes :

- nom produit
- slug
- descriptions utiles
- categories associees
- statut et disponibilite derivee

La V4 ne cherche pas a introduire un moteur de recherche complexe. Elle vise
une indexation simple des champs deja utiles a la decouverte.

### Filtres simples

Les filtres V4 restent derives du catalogue actuel.

Les dimensions minimales utiles sont :

- categorie
- disponibilite
- statut de mise en avant si cela aide le merchandising

La V4 ne cherche pas a modeliser des facettes riches ou un moteur de filtre
avance. Les filtres doivent rester lisibles et directement relies aux donnees
deja existantes.

### Lisibilite produit

La fiche produit doit mieux exposer ce qui aide a choisir :

- disponibilite produit derivee des variantes
- informations des declinaisons vendables
- images utiles
- categories ou reperes simples si pertinents

La V4 n'ajoute pas une nouvelle entite pour cela. Elle clarifie la lecture de
ce qui existe deja dans `products`, `product_variants`, `product_images` et
`categories`.

### Merchandising leger

Le merchandising V4 reste simple et s'appuie sur les structures deja presentes :

- produits mis en avant
- categories mises en avant
- ordre de presentation simple la ou c'est utile

L'objectif n'est pas de creer un moteur de regles. Il s'agit seulement de
donner un peu plus de controle sur ce qui merite d'etre vu plus vite.

### SEO utile

La V4 reste sur un SEO de base utile au catalogue :

- titres et descriptions plus coherents
- signaux de listing et de fiche produit mieux exploites
- contenu de categorie ou de listing plus lisible si necessaire

La V4 ne cherche pas a modeliser une couche SEO avancee.

## Relations cles

- `products`, `product_variants`, `product_images` et `categories` restent le
  coeur du catalogue
- la recherche simple lit ces entites sans changer leur role
- les filtres simples derivent des relations deja existantes
- le merchandising leger reutilise les structures de mise en avant deja
  presentes ou des enrichissements minimaux du catalogue

## Regles metier cles

- la decouverte catalogue doit rester simple a comprendre
- les filtres ne doivent porter que sur des dimensions stables et utiles
- la fiche produit doit mieux expliquer l'offre sans ajouter de logique lourde
- le merchandising reste editorial et explicite, pas algorithmique
- le SEO V4 doit rester utile au catalogue reel, sans couche d'optimisation
  complexe

## Resultat attendu

Le modele V4 doit rester petit et lisible tout en permettant :

- de mieux trouver un produit
- de mieux comprendre une fiche produit
- de mieux orienter la navigation catalogue
- de soutenir la conversion sans ouvrir un nouveau chantier technique lourd
