# Scope V6

## Vision

La V6 prolonge la V2, la V3, la V4 et la V5 deja en place sans rouvrir le
tunnel d'achat, le paiement ou le post-achat.

La priorite devient l'aboutissement du modele produit :

- un produit `simple` devient natif
- un produit `variable` reste stable

L'objectif est de supprimer progressivement la variante technique obligatoire
pour les produits simples, sans casser les produits variables existants.

## Point de depart

La base actuelle permet deja :

- de vendre un catalogue complet
- de distinguer un produit `simple` et un produit `variable`
- de gerer l'admin produit et la lecture publique selon ce type
- de rester compatible avec les produits variables existants

La limite restante est que le produit `simple` depend encore d'une unique
variante vendable technique.

## Inclus

- produit `simple` natif
- conservation du modele `variable`
- compatibilite avec les produits variables existants
- admin et lecture publique plus directs pour `simple`
- migration progressive depuis le modele V5

## Exclu

- moteur configurable complexe
- attributs generiques type WooCommerce
- bundles, kits ou packs
- options produit avancees
- refonte large du tunnel d'achat
- refonte large du back-office

## Priorites

1. rendre le produit `simple` natif dans le modele
2. conserver les produits `variable` sans rupture
3. simplifier l'admin des produits simples
4. rendre la lecture publique et l'achat plus directs pour `simple`
5. garder une migration lisible et reversible

## Criteres de fin V6

La V6 est consideree utile quand :

- un produit `simple` n'a plus besoin d'une variante technique obligatoire
- un produit `variable` conserve le fonctionnement actuel
- l'admin produit distingue clairement les deux cas
- la lecture publique et l'achat restent coherents selon le type
- la migration depuis la V5 reste simple et sans rupture pour l'existant
