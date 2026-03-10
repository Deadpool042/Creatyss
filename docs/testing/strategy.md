# Strategie de tests V1

## Objectif

Donner une base de tests simple et utile pour Creatyss V1, sans sur-architecture.

La strategie vise a :

- securiser les flux critiques deja livres
- reduire les regressions sur les validations et parcours admin/public
- completer la verification actuelle basee sur `typecheck`, `build`, seed Docker et checklist manuelle

## Principes

- garder une seule approche claire et progressive
- commencer petit avec les cas les plus rentables
- tester surtout ce qui porte du risque fonctionnel reel
- rester aligne sur la structure actuelle du repo
- ne pas dupliquer inutilement la checklist manuelle existante

## Types de tests retenus

### Tests unitaires legers

Premier niveau de couverture sur :

- validations metier pures dans `entities/`
- helpers critiques et purs quand ils portent une regle importante

Ces tests doivent etre rapides, simples a lire et independants du navigateur.

### Tests E2E

Deuxieme niveau de couverture sur les parcours critiques deja presents :

- auth admin
- media admin
- categories admin
- produits admin
- homepage admin et reflet public
- blog admin et public
- SEO de base sur produit et article

Les E2E doivent verifier les parcours principaux, pas tous les cas limites de l'interface.

## Structure cible du futur dossier `tests/`

```text
tests/
  unit/
    entities/
    lib/
  e2e/
    admin/
    public/
  fixtures/
```

Direction retenue :

- `tests/unit/` pour les validations et helpers critiques
- `tests/e2e/` pour les parcours complets
- `tests/fixtures/` seulement pour les jeux de donnees ou fichiers strictement utiles

## Priorites de couverture

Ordre de priorite au depart :

1. validations metier pures
2. auth admin et acces protege
3. media admin
4. CRUD categories
5. CRUD produits avec variantes et images
6. homepage admin et homepage publique
7. blog admin et public
8. fallback SEO sur produit et article

## Hors perimetre au depart

Ne pas couvrir initialement :

- snapshots UI massifs
- tests visuels
- performance
- accessibilite automatisee complete
- matrice multi-navigateurs etendue
- tests de charge
- tests d'integration base de donnees isoles si les E2E couvrent deja les flux critiques

## Ancrage dans l'etat actuel du repo

La future base de tests doit partir de l'existant :

- V1 deja exploitable en local
- Docker local et `make db-reset-dev`
- seed dev existant
- mediatheque non seedee par defaut
- verification actuelle via `pnpm run typecheck`, `pnpm run build` et `docs/v1-qa-checklist.md`

La premiere valeur attendue de la future etape tests est donc de fiabiliser les parcours critiques, pas de construire un systeme de test complet.
