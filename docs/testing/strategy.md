# Stratégie de tests

## Objectif

Définir une stratégie de tests simple, utile et maintenable pour le socle Creatyss.

La stratégie de tests doit rester cohérente avec :

- `README.md`
- `AGENTS.md`
- `docs/architecture/00` à `11`
- `docs/domains/README.md`
- `docs/testing/roadmap.md`

La priorité n'est pas de maximiser artificiellement la couverture.
La priorité est de sécuriser le socle réellement livré, avec des vérifications automatisées utiles, lisibles et rentables.

## Principes

- Garder une seule approche claire et progressive.
- Commencer par les cas les plus rentables.
- Tester d'abord ce qui porte un risque métier ou de régression réel.
- Rester aligné sur la structure actuelle du repo.
- Ne pas dupliquer inutilement la recette manuelle existante.
- Préserver des temps d'exécution raisonnables.
- Toujours privilégier des scénarios sobres et compréhensibles.

## Niveaux de tests retenus

### 1. Tests unitaires métier

Premier niveau de couverture sur :

- validations métier pures dans `entities/` ou `domain/`
- helpers critiques et purs quand ils portent une règle importante
- normalisation métier
- transformations métier sobres

Ces tests doivent être :

- rapides
- simples à lire
- indépendants du navigateur
- peu fragiles

### 2. Tests d'intégration ciblés

Niveau intermédiaire à utiliser seulement quand il apporte un vrai gain de sécurité sur un flux serveur ou une zone difficile à couvrir uniquement en unitaire.

Exemples possibles :

- validation + repository sur un cas critique borné
- lecture / écriture sensible après évolution de schéma
- garde-fou sur un point de cohérence non trivial

Ces tests ne doivent pas devenir une couche massive ou redondante.
Ils servent à sécuriser des zones précises quand l'unitaire pur ne suffit pas et que l'E2E serait trop lourd.

### 3. Tests E2E smoke

Troisième niveau de couverture sur les parcours critiques déjà présents.

Cibles prioritaires :

- auth admin
- media admin
- catégories admin
- produits admin
- homepage admin et reflet public
- blog admin et public
- SEO de base sur produit et article

Les E2E doivent vérifier les parcours principaux, pas tous les cas limites de l'interface.

## Structure cible du dossier `tests/`

```text
tests/
  unit/
    entities/
    lib/
  integration/
  e2e/
    admin/
    public/
  fixtures/
```

Direction retenue :

- `tests/unit/` pour les validations et helpers critiques
- `tests/integration/` pour les garde-fous ciblés à forte valeur
- `tests/e2e/` pour les parcours complets réellement critiques
- `tests/fixtures/` seulement pour les jeux de données ou fichiers strictement utiles

## Priorités de couverture

Ordre de priorité au départ :

1. validations métier pures à fort risque
2. auth admin et accès protégé
3. media admin
4. CRUD catégories
5. CRUD produits avec variantes et images
6. homepage admin et homepage publique
7. blog admin et public
8. fallback SEO sur produit et article

## Ce qu'on cherche à sécuriser en premier

La stratégie vise d'abord à sécuriser :

- les règles métier déjà livrées
- les parcours admin/public réellement critiques
- les flux les plus exposés à la régression
- les zones où la recette manuelle seule devient insuffisante

## Ce qu'on ne cherche pas à faire au départ

Ne pas couvrir initialement :

- snapshots UI massifs
- tests visuels
- performance
- accessibilité automatisée complète
- matrice multi-navigateurs étendue
- tests de charge
- E2E exhaustifs écran par écran
- couche d'intégration tentaculaire et redondante

## Ancrage dans l'état actuel du repo

La base de tests doit partir de l'existant :

- socle déjà exploitable en local
- Docker local et `make db-reset-dev`
- seed dev existant
- médiathèque non seedée par défaut
- vérification actuelle via `pnpm run typecheck`, `pnpm run build` et recette manuelle

La première valeur attendue de la base de tests est donc de fiabiliser les parcours critiques et les validations importantes, pas de construire un système de test exhaustif.

## Règle d'arbitrage permanente

En cas d'arbitrage, toujours prioriser dans cet ordre :

1. validations métier pures à fort risque
2. parcours critiques déjà livrés
3. garde-fous ciblés sur les erreurs les plus utiles
4. extension de couverture seulement si elle reste rentable

## Critère de réussite

La stratégie sera considérée saine si elle permet de :

- réduire la dépendance à la seule recette manuelle sur les zones critiques
- sécuriser les flux déjà livrés sans sur-automatiser
- rester compréhensible et maintenable
- rester cohérente avec la doctrine actuelle du repo
- tourner localement sans complexité disproportionnée
