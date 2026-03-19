# Décisions V21-2A

## Décision 1 — Garder `catalog.repository.ts` comme façade publique stable

### Décision prise

`db/repositories/catalog/catalog.repository.ts` est resté le point d'entrée public unique du domaine.

### Conséquence

- aucun chemin public n'a changé
- aucune signature runtime n'a changé
- aucun consumer `app/` ou `features/` n'a été modifié

## Décision 2 — Garder `catalog.types.ts` comme façade publique stable

### Décision prise

`db/repositories/catalog/catalog.types.ts` est resté le point d'entrée public des contrats.

### Conséquence

Les définitions publiques ont été déplacées dans `db/repositories/catalog/types/outputs.ts`, mais le chemin public est resté :

- `@/db/repositories/catalog/catalog.types`

## Décision 3 — Extraire d'abord les blocs internes déjà stabilisés

### Décision prise

Le lot a extrait d'abord les éléments les plus stables et les moins risqués :

- les outputs publics
- la sélection d'image primaire
- la reconstruction batch des images représentatives de catégories homepage
- les queries simples homepage
- les queries simples blog
- la query simple recent products

### Conséquence

Le lot a réduit la taille et la densité du repository sans déplacer les zones les plus sensibles.

## Décision 4 — Ne pas traiter `listPublishedProducts`

### Décision explicitement non prise

Le lot n'a pas déplacé `listPublishedProducts` hors de `catalog.repository.ts`.

### Raison

Cette fonction reste la zone la plus dense du domaine :

- construction de `where`
- ordering conditionnel
- chargement batch des images
- chargement batch des variantes utiles à l'offre simple
- dérivation de `simpleOffer`
- dérivation de `isAvailable`
- filtrage `onlyAvailable` en mémoire

Le garde-fou du lot imposait de ne pas changer ce flux.

### Conséquence

La fonction reste localisée dans la façade publique et devra être traitée dans un lot ultérieur dédié.

## Décision 5 — Ne pas traiter `getPublishedProductBySlug`

### Décision explicitement non prise

Le lot n'a pas déplacé `getPublishedProductBySlug` hors de `catalog.repository.ts`.

### Raison

Cette fonction combine encore plusieurs responsabilités dans un même flux :

- lecture produit
- lecture des images produit
- lecture des variantes publiées
- lecture des images de variantes
- regroupement des images par variante
- mapping des variantes
- dérivation de `simpleOffer`
- dérivation de `isAvailable`

Le lot n'a pas voulu re-découper ce flux sans lot dédié.

### Conséquence

La façade publique reste partiellement épaisse après V21-2A.

## Décision 6 — Ne pas modifier `catalog.mappers.ts`

### Décision explicitement non prise

Le lot n'a pas redécoupé `db/repositories/catalog/catalog.mappers.ts`.

### Raison

`catalog.mappers.ts` n'était pas nécessaire pour atteindre l'objectif structurel de V21-2A.

### Conséquence

Les mappers partagés existants restent centralisés dans ce fichier après le lot.

## Décision 7 — Conserver le ré-export de types depuis `catalog.repository.ts`

### Décision prise

Le lot a conservé le bloc `export type { ... } from "./catalog.types"` dans `catalog.repository.ts`.

### Raison

Des consumers existent encore sur ce chemin, notamment [features/homepage/types.ts](/Users/laurent/Desktop/CREATYSS/features/homepage/types.ts).

### Conséquence

La compatibilité publique a été préservée intégralement. La dette documentaire signalée en V20 reste visible après V21-2A.

## Décision 8 — Ne pas modifier les consumers hors `catalog/**`

### Décision prise

Le lot n'a touché aucun fichier `app/`, `features/` ou `components/`.

### Raison

Les façades publiques sont restées stables. Aucun recâblage n'était nécessaire pour obtenir le gain structurel recherché.

### Conséquence

Le lot est resté strictement local au domaine `catalog`.

## Règles de compatibilité retenues

Règles appliquées pendant le lot :

- aucun changement de chemin public
- aucun changement de signature runtime
- aucun changement de contrat public exporté
- aucun changement de comportement sur homepage
- aucun changement de comportement sur blog
- aucun changement de comportement sur recent products
- aucun changement sur la règle d'image primaire
- aucun changement d'ordering ou de tie-break sur le périmètre traité

## Hypothèses explicites retenues dans cette documentation

Cette documentation s'appuie sur les hypothèses explicites suivantes :

- V21-1 a été réalisé avant V21-2A
- V21-2A est le seul lot V21 implémenté à ce stade
- les autres lots V21 restent à l'état de séquencement de travail
- aucun gain de performance n'a été mesuré dans ce lot
- aucune donnée du code actuel ne permet d'affirmer un impact runtime positif ou négatif du seul découpage interne

## Lecture de la décision V21-2A

V21-2A a retenu une stratégie conservatrice :

- stabiliser les façades publiques
- sortir les blocs internes déjà mûrs
- ne pas toucher aux deux flux catalogue les plus denses

Cette stratégie a réduit la taille du repository public sans ouvrir un chantier de comportement ou de compatibilité.
