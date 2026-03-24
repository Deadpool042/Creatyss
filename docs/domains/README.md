# Domaines

## Objectif

Ce dossier contient les fiches de référence des domaines du système.

Chaque fiche domaine décrit une responsabilité métier ou transverse identifiable, avec ses frontières, ses invariants, ses dépendances et ses effets structurants.

Ce dossier ne définit pas la doctrine d’architecture générale.
La doctrine canonique appartient à `docs/architecture/`.

---

## Rôle de ce dossier

`docs/domains/` sert à documenter :

- les responsabilités métier réelles ;
- les sources de vérité ;
- les invariants ;
- les dépendances ;
- les événements significatifs ;
- les frontières locales ;
- les impacts d’exploitation et de maintenance.

Un document de domaine doit permettre de répondre à la question :

**de quoi ce bloc est-il responsable, et de quoi n’est-il pas responsable ?**

---

## Relation avec `docs/architecture/`

La relation entre les deux dossiers est la suivante :

- `docs/architecture/` définit la doctrine ;
- `docs/domains/` applique cette doctrine à des blocs concrets du système.

En conséquence :

- un document de domaine ne doit pas contredire la taxonomie de `docs/architecture/` ;
- un document de domaine ne doit pas redéfinir librement le vocabulaire canonique ;
- un document de domaine ne doit pas inventer une frontière incompatible avec `docs/architecture/10-fondations/`.

En cas de conflit :
`docs/architecture/` fait autorité sur la doctrine ;
`docs/domains/` fait autorité sur le détail local du domaine, à doctrine constante.

---

## Organisation du dossier

Le dossier est structuré par catégorie architecturale.

### `core/`

Contient les domaines coeur.

Un domaine coeur :

- porte une vérité métier fondamentale ;
- est indispensable à l’identité fonctionnelle du système ;
- structure le modèle métier central.

### `optional/`

Contient les capacités optionnelles significatives.

Une capacité optionnelle :

- enrichit le système ;
- peut être activée ou non ;
- ne doit pas redéfinir silencieusement le coeur.

### `cross-cutting/`

Contient les préoccupations transverses documentées comme domaines ou blocs de responsabilité.

Important :
`cross-cutting/` est une catégorie documentaire.
Elle ne signifie pas “secondaire” ni “facultatif”.

Une préoccupation transverse peut être :

- critique ;
- non optionnelle ;
- structurellement indispensable.

Exemples typiques :

- audit ;
- observabilité ;
- jobs ;
- intégrations structurantes.

---

## Règles de gouvernance

### Règle 1 — Toute fiche doit avoir une classification explicite

Chaque fiche doit indiquer au minimum :

- sa catégorie documentaire ;
- sa criticité architecturale ;
- son caractère activable ou non.

### Règle 2 — Toute fiche doit expliciter sa responsabilité

Une fiche domaine doit définir clairement :

- ce qu’elle possède ;
- ce qu’elle décide ;
- ce qu’elle publie ;
- ce qu’elle consomme ;
- ce qu’elle ne possède pas.

### Règle 3 — Toute fiche doit expliciter sa source de vérité

Une responsabilité sans source de vérité identifiable est incomplète.

### Règle 4 — Toute fiche doit expliciter ses invariants

Une fiche sans invariants ou sans justification explicite de leur absence reste insuffisante.

### Règle 5 — Toute fiche doit expliciter ses frontières

Les dépendances, échanges et limites du domaine doivent être documentés.

### Règle 6 — Toute section absente doit être justifiée

Une section peut être marquée :

- non applicable ;
- hors périmètre ;
- à préciser ultérieurement si cela est réellement transitoire.

Une omission silencieuse n’est pas acceptable.

---

## Complétude minimale obligatoire

Toute fiche domaine doit contenir au minimum les sections suivantes :

- rôle ;
- classification ;
- source de vérité ;
- responsabilités ;
- invariants ;
- dépendances ;
- événements significatifs ;
- cycle de vie ou justification de son absence ;
- impact de maintenance / exploitation ;
- limites explicites du domaine.

---

## Règle d’écriture

Le style attendu est :

- direct ;
- normatif ;
- explicite ;
- stable ;
- centré sur la responsabilité.

Éviter :

- les notes de brainstorming ;
- les formulations vagues ;
- les synonymes instables ;
- les descriptions purement techniques sans portée métier.

---

## Template obligatoire

Toute nouvelle fiche doit partir de :

- `_template.md`

Le template n’est pas facultatif.
Il peut être allégé uniquement si certaines sections sont explicitement marquées comme non applicables.

---

## Documents liés

- `../architecture/README.md`
- `../architecture/00-introduction/01-glossaire.md`
- `../architecture/10-fondations/10-principes-d-architecture.md`
- `../architecture/10-fondations/11-modele-de-classification.md`
- `../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `_template.md`
