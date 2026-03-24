# Domaines

## Objectif

Ce dossier contient les fiches de référence des domaines du système.

Chaque fiche domaine décrit une responsabilité identifiable, avec :

- son rôle ;
- sa classification ;
- sa source de vérité ;
- ses responsabilités ;
- ses non-responsabilités ;
- ses invariants ;
- ses dépendances ;
- ses événements significatifs ;
- ses contraintes d’exécution ;
- son impact d’exploitation ;
- ses limites.

Ce dossier ne définit pas la doctrine générale du système.
La doctrine canonique appartient à `docs/architecture/`.

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

- `docs/architecture/` fait autorité sur la doctrine ;
- `docs/domains/` fait autorité sur le détail local du domaine, à doctrine constante.

---

## Catégories documentaires

Le dossier `docs/domains/` est structuré selon quatre catégories documentaires :

### `core/`

Contient les domaines coeur.

Un domaine coeur :

- porte une vérité métier ou structurelle centrale ;
- est indispensable à la cohérence du système ;
- ne relève ni d’une simple option ni d’une simple dépendance externe.

Le coeur peut inclure :

- un coeur métier ;
- et, si le projet l’assume explicitement, un coeur structurel.

Cette distinction doit être documentée, pas implicite.

---

### `optional/`

Contient les capacités optionnelles significatives.

Une capacité optionnelle :

- enrichit le système ;
- peut être activée ou absente ;
- ne doit pas redéfinir silencieusement le coeur.

Une capacité importante commercialement n’est pas coeur par défaut.

---

### `cross-cutting/`

Contient les responsabilités transverses.

Une responsabilité transverse :

- traverse plusieurs domaines ou couches ;
- nécessite une gouvernance explicite ;
- peut être critique ;
- n’est pas secondaire par nature.

Important :
`cross-cutting/` est une catégorie documentaire.
Elle ne signifie ni “facultatif” ni “faible criticité”.

Exemples typiques :

- audit ;
- observabilité ;
- jobs ;
- conformité ;
- notifications ;
- certains domaines métier transverses.

---

### `satellites/`

Contient les satellites du système.

Un satellite est un bloc connecté au système sans constituer le coeur de sa vérité métier centrale.

Un satellite peut représenter :

- une projection structurée ;
- une modélisation périphérique ;
- un sous-système connexe ;
- un espace de publication ou de diffusion ;
- une responsabilité adjacente non coeur.

Important :
`satellites/` est une catégorie documentaire.
Elle ne signifie pas automatiquement “externe”, “mineur” ou “négligeable”.

Un satellite peut être important, mais il ne doit pas être confondu avec le coeur.

---

## Règles de gouvernance

### Règle 1 — Toute fiche doit déclarer sa classification

Chaque fiche doit expliciter :

- sa catégorie documentaire ;
- sa criticité architecturale ;
- son caractère activable ou non.

### Règle 2 — Toute fiche doit décrire une responsabilité réelle

Une fiche domaine doit répondre clairement à :

- de quoi ce bloc est-il responsable ;
- de quoi ne l’est-il pas ;
- où s’arrête sa frontière.

### Règle 3 — Toute fiche doit expliciter sa source de vérité

Une responsabilité sans source de vérité identifiable reste incomplète.

### Règle 4 — Toute fiche doit expliciter ses invariants

Une fiche sans invariants, ou sans justification explicite de leur absence, est insuffisante.

### Règle 5 — Toute fiche doit expliciter ses frontières

Les dépendances, échanges et limites du domaine doivent être documentés.

### Règle 6 — Toute section absente doit être justifiée

Une section peut être marquée :

- non applicable ;
- hors périmètre ;
- à confirmer.

Une omission silencieuse n’est pas acceptable.

---

## Complétude minimale obligatoire

Toute fiche domaine doit contenir au minimum :

- rôle ;
- classification ;
- source de vérité ;
- responsabilités ;
- non-responsabilités ;
- invariants ;
- dépendances ;
- événements significatifs ;
- cycle de vie ou justification de son absence ;
- impact de maintenance / exploitation ;
- limites du domaine.

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
- les descriptions purement techniques sans portée structurelle.

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
- `_migration-audit.md`
