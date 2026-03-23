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

# Roadmap tests

## Objectif

Définir une montée en puissance simple, rentable et maintenable de la stratégie de tests du socle Creatyss.

La roadmap de tests doit rester cohérente avec :

- `README.md`
- `AGENTS.md`
- `docs/architecture/00` à `11`
- `docs/domains/README.md`
- `docs/testing/strategy.md`

La priorité n'est pas de viser une couverture exhaustive.
La priorité est de sécuriser le socle réellement livré, avec des vérifications automatisées utiles, rapides et lisibles.

## Principes retenus

- Commencer par la base la plus rentable.
- Tester d'abord ce qui porte le plus de risque métier ou de régression.
- Préserver des temps d'exécution raisonnables.
- Garder une séparation claire entre :
  - tests unitaires métier
  - tests d'intégration ciblés
  - E2E smoke sur les parcours critiques
- Compléter la recette manuelle, pas chercher à la remplacer brutalement.
- Toujours privilégier des fixtures et scénarios sobres.

## Ordre des lots

La montée en charge est découpée en quatre lots :

1. socle minimal de test
2. tests unitaires métier ciblés
3. E2E smoke des parcours critiques
4. consolidation et élargissement ciblé

---

## Lot 1 — Socle minimal de test

### Objectif

Poser un socle de test simple et exploitable localement.

### À inclure

- structure de test claire dans le repo
- scripts de test minimaux
- conventions de lancement local
- première exécution utile en local
- intégration simple avec le flux Docker existant

### Sortie attendue

- la structure de tests est en place
- le repo sait lancer au moins un premier niveau de test de manière reproductible
- la base locale de test peut être utilisée sans setup exotique

### Dépendances

- aucune autre que le socle actuel du repo

### Critère de fin

Le projet peut lancer ses premières vérifications automatisées localement de façon stable.

---

## Lot 2 — Tests unitaires métier ciblés

### Objectif

Couvrir d'abord les validations métier pures, helpers critiques et règles qui portent le plus de valeur de non-régression.

### Cibles prioritaires

- `entities/category/`
- `entities/product/`
- `entities/blog/`
- `entities/homepage/`
- helpers critiques de validation, normalisation et transformation métier

### À vérifier en priorité

- validations d'entrée
- normalisation métier
- règles simples de cohérence
- cas limites connus sur les entités déjà livrées

### Sortie attendue

- les règles métier les plus sensibles ont une couverture unitaire minimale
- les tests restent rapides, lisibles et peu fragiles

### Dépendances

- lot 1

### Critère de fin

Les validations métier pures les plus importantes ne reposent plus uniquement sur la recette manuelle.

---

## Lot 3 — E2E smoke des parcours critiques

### Objectif

Couvrir les parcours critiques de bout en bout sans viser l'exhaustivité fonctionnelle.

### Parcours prioritaires

- login admin et redirections
- upload media
- CRUD catégories
- CRUD produits avec variantes et images
- édition homepage et reflet public
- CRUD blog et reflet public
- fallback SEO produit et article

### Sortie attendue

- un petit nombre de parcours critiques automatise la recette principale du socle livré
- les E2E tournent sur une base locale réinitialisable
- les scénarios restent compréhensibles et maintenables

### Dépendances

- lot 1
- seed dev
- préparation explicite d'au moins un media pour les scénarios qui en ont besoin

### Critère de fin

Les flux admin/public les plus critiques déjà livrés sont sécurisés par une base smoke exploitable.

---

## Lot 4 — Consolidation ciblée

### Objectif

Élargir la couverture seulement là où le retour sur investissement est clair.

### À inclure

- renforcement de cas limites sur les domaines déjà couverts
- tests complémentaires sur erreurs utiles et scénarios de garde-fou
- consolidation des helpers de test, fixtures sobres et utilitaires communs
- amélioration de la stabilité des scénarios E2E les plus rentables

### À ne pas faire par défaut

- multiplier les tests redondants
- introduire de grosses fixtures complexes sans besoin réel
- transformer les E2E en couverture exhaustive écran par écran

### Dépendances

- lots 1 à 3

### Critère de fin

La base de tests devient plus fiable et plus rentable sans perdre en lisibilité ni en vitesse d'exécution.

---

## Base minimale utile

La base de tests sera considérée utile quand elle permettra au minimum de :

- vérifier automatiquement les validations métier les plus importantes
- sécuriser les parcours admin/public critiques déjà livrés
- compléter la checklist manuelle au lieu de la remplacer totalement
- tourner localement sans setup lourd supplémentaire
- rester compréhensible pour une maintenance régulière

## Ordre de priorité permanent

En cas d'arbitrage, toujours prioriser dans cet ordre :

1. validations métier pures à fort risque
2. parcours critiques déjà livrés
3. scénarios de garde-fou sur les erreurs les plus utiles
4. extension ciblée de couverture seulement si elle reste rentable

## Ce qui reste volontairement hors du premier cycle

- couverture complète de tous les écrans
- tests visuels
- tests de performance
- tests de charge
- grandes fixtures complexes
- infrastructure CI/CD élaborée
- sur-automatisation de cas à faible valeur

La priorité reste une base de tests simple, rentable et maintenable pour le socle actuellement livré.
