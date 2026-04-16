# Domaines coeur

## Objectif

Ce document recense les domaines coeur du système au niveau architectural.

Il ne remplace pas les fiches détaillées dans `docs/domains/core/`.
Il explicite ce qui appartient au coeur, pourquoi, et selon quelles règles de gouvernance.

---

## Définition

Un domaine coeur :

- porte une vérité métier fondamentale ;
- structure le comportement principal du système ;
- n’est pas une dépendance externe ;
- n’est pas une simple option activable ;
- possède une responsabilité indispensable à la cohérence du produit.

---

## Règle de gouvernance

Tout domaine coeur doit :

- avoir une fiche détaillée dans `docs/domains/core/` ;
- expliciter sa source de vérité ;
- expliciter ses invariants ;
- expliciter ses dépendances ;
- expliciter ses événements significatifs ;
- rester cohérent avec `../10-fondations/11-modele-de-classification.md`.

---

## Domaines coeur de Creatyss

La liste complète et à jour des domaines coeur stabilisés est dans `docs/domains/core/`.
Ce document en présente les éléments les plus structurants à titre illustratif.
En cas de divergence, `docs/domains/core/` fait autorité.

À l’état actuel de la doctrine, les domaines coeur explicitement structurants sont les suivants.

### Coeur métier stabilisé

- `products`
- `orders`
- `customers`
- `pricing`
- `availability`

### Coeur structurel stabilisé

- `auth`
- `users`
- `roles`
- `permissions`

### Produits

Le domaine `products` appartient au coeur.

Il structure notamment :

- la définition des produits ;
- les attributs métier associés ;
- la cohérence du catalogue exploitable par le système ;
- les relations nécessaires aux autres décisions métier.

Le produit n’est pas une projection secondaire.
Il fait partie du modèle métier central.

Référence :

- `../../domains/core/catalog/products.md`

### Commandes

Le domaine `orders` appartient au coeur.

Il structure notamment :

- le cycle de vie de la commande ;
- les transitions d’état significatives ;
- les décisions liées à l’achat, au traitement et au suivi ;
- les interactions métier majeures avec le reste du système.

La commande est un axe central du système.
Elle ne doit jamais être réduite à un simple flux technique ou à une vue d’intégration.

Référence :

- `../../domains/core/commerce/orders.md`

---

## Notes de gouvernance

Les éléments ci-dessus sont stabilisés doctrinalement.
Tout ajout futur dans cette liste doit être explicitement tranché, puis reflété dans `docs/domains/core/`.

## Critère de validation

Un bloc ne doit apparaître ici que si son absence :

- détruit le comportement central du système ;
- ou dénature son identité fonctionnelle.

Une fonctionnalité utile mais non indispensable n’appartient pas au coeur.

---

## Anti-patterns à éviter

Le système doit éviter :

- de promouvoir une intégration externe au rang de domaine coeur ;
- d’appeler “coeur” une option commerciale importante mais activable ;
- d’ajouter ici des blocs non stabilisés doctrinalement ;
- de masquer l’absence de frontière sous un vocabulaire trop large.

---

## Documents liés

- `../10-fondations/11-modele-de-classification.md`
- `../10-fondations/12-frontieres-et-responsabilites.md`
- `../../domains/core/catalog/products.md`
- `../../domains/core/commerce/orders.md`
