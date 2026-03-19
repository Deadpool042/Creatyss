# Doctrine V21

## Rôle du document

Cette doctrine fixe les règles d'architecture appliquées aux lots V21.

Elle ne décrit pas un état déjà homogène dans tout `db/`. Elle fixe le cadre de refactor interne utilisé pour faire évoluer le code existant sans changer sa surface publique.

## Définition d'une façade publique

### `*.repository.ts`

Dans V21, un fichier `*.repository.ts` reste la façade publique runtime d'un domaine.

Une façade publique runtime :

- porte les fonctions exportées consommées par `app/` et `features/`
- orchestre les flows du domaine
- garde les transactions Prisma
- garde le remapping d'erreurs publiques quand il existe

Une façade publique runtime n'est pas le lieu privilégié pour :

- des `select` Prisma partagés
- des batch loaders réutilisables
- des comparateurs techniques
- des lectures Prisma simples réutilisées à plusieurs endroits

### `*.types.ts`

Dans V21, un fichier `*.types.ts` reste la façade publique de types d'un domaine.

Une façade publique de types :

- garde le chemin public de référence
- peut ré-exporter des contrats internes depuis un sous-dossier `types/`
- ne porte ni lecture Prisma ni logique de persistance

Exemple réel après V21-2A :

- [catalog.types.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/catalog.types.ts) ré-exporte désormais depuis [types/outputs.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/types/outputs.ts)

## Règles de stabilité des exports

### Règle 1 — stabilité des chemins publics

Un lot V21 ne change pas un chemin public sauf si ce lot prend explicitement en charge la migration exhaustive de ses consumers.

### Règle 2 — stabilité des noms exportés

Un lot V21 ne change pas la liste des exports publics d'une façade sauf objectif explicite du lot.

### Règle 3 — stabilité des signatures runtime

Un lot V21 ne change pas la signature runtime d'une fonction repository exportée.

### Règle 4 — stabilité des contrats publics

Un lot V21 ne change pas la forme publique d'un type exporté sans lot dédié.

### Règle 5 — compatibilité par façade

Quand un lot introduit des fichiers internes, la compatibilité publique est préservée par la façade existante, pas par une nouvelle API parallèle.

## Règles d'extraction

## `queries/`

### Ce qui va dans `queries/`

`queries/` porte des lectures Prisma canoniques locales au domaine.

Peuvent aller dans `queries/` :

- un `findMany`, `findFirst`, `count`, `groupBy`
- un `select` Prisma partagé
- un type Prisma de row ou de payload interne
- une lecture batch qui retourne des rows ou des structures internes

Exemples réels après V21-2A :

- [queries/homepage.queries.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/queries/homepage.queries.ts)
- [queries/blog.queries.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/queries/blog.queries.ts)
- [queries/recent-products.queries.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/queries/recent-products.queries.ts)

### Ce qui ne va pas dans `queries/`

`queries/` ne porte pas :

- le mapping vers les contrats publics
- les erreurs publiques
- les décisions métier
- l'orchestration transactionnelle
- les signatures publiques du repository

## `helpers/`

### Ce qui va dans `helpers/`

`helpers/` porte les blocs techniques locaux au domaine qui ne sont pas, à eux seuls, des queries publiques ou des contrats publics.

Peuvent aller dans `helpers/` :

- batch loading
- reconstruction mémoire
- comparateurs
- normalisation locale d'identifiants
- sélection déterministe d'une entité technique

Exemples réels après V21-2A :

- [helpers/primary-image.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/helpers/primary-image.ts)
- [helpers/category-representative-image.ts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/helpers/category-representative-image.ts)

### Ce qui ne va pas dans `helpers/`

`helpers/` ne porte pas :

- les contrats publics
- la façade publique du domaine
- une logique métier transverse qui doit rester dans `entities/`
- une abstraction générique cross-domain

## `types/`

### Ce qui va dans `types/`

`types/` porte les contrats publics internes au domaine quand le domaine devient trop gros pour un seul `*.types.ts`.

Peuvent aller dans `types/` :

- outputs publics
- inputs publics
- erreurs publiques
- unions de statuts publiques

### Ce qui ne va pas dans `types/`

`types/` ne porte pas :

- des types Prisma internes
- des rows privées
- du code d'accès base
- des mappers

### État réel de V21

Après V21-2A, seul `catalog` utilise réellement un sous-dossier `types/`, et seulement pour `outputs.ts`.

V21 n'impose pas encore un découpage systématique `inputs.ts / outputs.ts / errors.ts / status.ts` à tous les domaines.

## Ce qui ne doit jamais être extrait

V21 ne sort pas d'un repository, sauf lot explicite très justifié :

- l'orchestration transactionnelle
- les signatures publiques runtime
- le remapping d'erreurs publiques
- un flow complexe si l'extraction dilue la compréhension du comportement

Exemple concret :

- après V21-2A, [listPublishedProducts](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/catalog.repository.ts#L420) et [getPublishedProductBySlug](/Users/laurent/Desktop/CREATYSS/db/repositories/catalog/catalog.repository.ts#L467) sont restés dans la façade publique

## Règles sur Prisma

### Où Prisma doit vivre

Prisma reste localisé dans `db/`.

Dans V21, Prisma peut vivre :

- dans la façade repository
- dans `queries/`
- dans `helpers/` si le helper charge lui-même des données du domaine

### Où Prisma ne doit pas vivre

Prisma ne doit pas vivre :

- dans `features/`
- dans `entities/`
- dans un dossier global `db/queries/`
- dans des helpers transverses hors domaine sans lien direct avec la persistance locale

### Invariant V21

V21 conserve l'invariant hérité de V19 :

- aucun raw SQL
- aucun `$queryRaw`
- aucun `$executeRaw`
- aucun `Prisma.sql`

## Règles sur les mappers

### Rôle des mappers

Un mapper transforme une row Prisma ou une structure interne vers un contrat ou une structure de lecture utilisée par la façade.

### Où mettre un mapper

Un mapper peut rester :

- dans `catalog.mappers.ts` si plusieurs flows du domaine l'utilisent déjà
- dans le repository si son extraction n'apporte rien
- dans un futur sous-dossier `mappers/` si le volume devient réellement trop grand

### Ce que V21 n'impose pas

V21 n'impose pas de créer un dossier `mappers/` dans tous les domaines.

Le découpage est proportionné à la complexité réelle. À ce stade, `catalog.mappers.ts` existe toujours comme fichier unique.

## Règles de nommage et de structure

### Structure locale au domaine

La structure cible V21 reste locale au domaine :

```text
db/repositories/<domaine>/
  <domaine>.repository.ts
  <domaine>.types.ts
  types/
  queries/
  helpers/
  mappers/
```

### Règles de nommage

- façade runtime : `<domaine>.repository.ts`
- façade types : `<domaine>.types.ts`
- queries : `<sous-flux>.queries.ts`
- helpers : nom orienté responsabilité technique
- types internes : nom orienté catégorie de contrats, par exemple `outputs.ts`

### Règles de profondeur

V21 n'introduit pas de hiérarchie profonde.

Le découpage attendu reste :

- local au domaine
- lisible
- sans sous-niveaux inutiles

## Lecture opérationnelle

La règle directrice de V21 est simple :

- garder la façade publique stable
- sortir uniquement les blocs internes qui améliorent réellement la lisibilité
- ne pas transformer une modularisation interne en changement d'API publique
