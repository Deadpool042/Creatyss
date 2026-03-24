# Conventions de nommage

## Objectif

Ce document définit les conventions de nommage du dossier `docs/architecture/`.

Ces conventions servent à maintenir une documentation lisible, stable et prévisible.

---

## Convention de nommage des fichiers

Le format imposé est :

`NN-sujet-en-kebab-case.md`

Exemples :

- `10-principes-d-architecture.md`
- `21-domaines-coeur.md`
- `33-modele-de-defaillance-et-idempotence.md`

---

## Règles

### Règle 1 — Les noms de fichiers sont en français

Le dossier `docs/architecture/` est monolingue français.

### Règle 2 — Les noms de fichiers sont en minuscules

Aucune majuscule dans les noms de fichiers.

### Règle 3 — Les accents sont supprimés dans les noms de fichiers

Utiliser :

- `execution`
- `observabilite`
- `frontieres`

et non :

- `exécution`
- `observabilité`
- `frontières`

### Règle 4 — Le sujet doit être explicite

Un nom de fichier doit indiquer clairement sa fonction documentaire.

Sont interdits :

- `general.md`
- `notes.md`
- `divers.md`
- `vision.md`
- `misc.md`

### Règle 5 — La numérotation exprime une famille documentaire

- `00-*` : introduction
- `10-*` : fondations
- `20-*` : structure
- `30-*` : exécution
- `40-*` : exploitation
- `90-*` : référence

---

## Convention de nommage des titres

Le titre doit :

- être en français ;
- reprendre clairement le sujet du document ;
- rester plus lisible que le nom de fichier ;
- éviter les titres vagues ou marketing.

Bon exemple :

- `# Modèle de défaillance et idempotence`

Mauvais exemple :

- `# Quelques notes importantes`

---

## Convention de vocabulaire

Le dossier doit utiliser un vocabulaire stable.

Préférer :

- domaine
- capacité optionnelle
- système externe
- satellite
- adaptateur
- événement
- job
- source de vérité
- préoccupation transverse

Éviter les synonymes non gouvernés lorsqu’un terme canonique existe déjà.

Le glossaire fait autorité.

---

## Convention de style

Le style attendu est :

- normatif ;
- direct ;
- peu ambigu ;
- centré sur les responsabilités et conséquences.

Préférer :

- « doit »
- « ne doit pas »
- « appartient à »
- « n’appartient pas à »
- « relève de »

Éviter :

- « on pourrait »
- « selon les cas » sans précision ;
- « peut-être » ;
- « idéalement ».

---

## Règle finale

Tout nouveau document doit être cohérent avec :

- `README.md`
- `01-glossaire.md`
- `92-template-document-architecture.md`

En cas de doute, la lisibilité et la stabilité priment sur la variété stylistique.
