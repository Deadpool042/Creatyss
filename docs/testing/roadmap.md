# Roadmap tests V1

## Direction retenue

Introduire les tests en trois lots simples :

1. socle minimal
2. unitaires legers sur le metier pur
3. E2E smoke sur les flux critiques

## Lot 1 - Socle minimal

Objectif :

- poser le futur dossier `tests/`
- ajouter le minimum de scripts et conventions necessaires
- verifier que la base locale de test peut tourner sur la V1 actuelle

Sortie attendue :

- structure `tests/` en place
- premiere execution de test vide ou minimale
- integration simple avec le flux local Docker

Dependances :

- aucune autre que la V1 actuelle

## Lot 2 - Tests unitaires legers

Objectif :

- couvrir d'abord les validations metier pures et helpers critiques

Cibles prioritaires :

- `entities/category/`
- `entities/product/`
- `entities/blog/`
- `entities/homepage/`
- helpers critiques de validation ou de normalisation

Critere de sortie :

- les regles metier les plus sensibles ont une couverture unitaire minimale
- les tests restent rapides et lisibles

Dependances :

- lot 1

## Lot 3 - E2E smoke

Objectif :

- couvrir les parcours critiques de bout en bout sans chercher l'exhaustivite

Parcours prioritaires :

- login admin et redirections
- upload media
- CRUD categories
- CRUD produits avec variantes et images
- edition homepage et reflet public
- CRUD blog et reflet public
- fallback SEO produit et article

Critere de sortie :

- un petit nombre de parcours critiques automatise la recette V1 principale
- les E2E tournent sur une base locale reinitialisable

Dependances :

- lot 1
- seed dev
- preparation explicite d'au moins un media pour les scenarios qui en ont besoin

## Base minimale utile

La base de tests sera consideree utile quand elle permettra au minimum de :

- verifier automatiquement les validations metier les plus importantes
- securiser les parcours admin/public critiques deja livres
- completer la checklist manuelle V1 au lieu de la remplacer totalement
- tourner localement sans setup lourd supplementaire

## Ce qui reste volontairement hors du premier cycle

- couverture complete de tous les ecrans
- tests visuels
- tests de performance
- tests de charge
- grandes fixtures complexes
- infrastructure CI/CD elaboree

La priorite reste une base de tests simple, rentable et maintenable pour la V1 actuelle.
