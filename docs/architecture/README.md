# Architecture

## Objectif

Ce dossier contient la documentation d’architecture canonique du système.

Il définit :

- la manière correcte de penser le système ;
- la classification des éléments architecturaux ;
- la cartographie des blocs structurants ;
- les règles de conception et de découplage ;
- les principes d’exécution, d’exploitation et de maintenance.

Ce dossier ne contient pas les détails métier complets de chaque domaine.
Ces détails appartiennent à `docs/domains/`.

---

## Ce que ce dossier fait autorité sur

`docs/architecture/` fait autorité sur :

- le vocabulaire architectural ;
- la taxonomie du système ;
- les règles de frontière entre domaines, capacités, intégrations et préoccupations transverses ;
- les principes de modularité ;
- les règles d’implémentation structurantes.

Aucun autre dossier documentaire ne doit contredire ce dossier.

---

## Ce que ce dossier ne remplace pas

- `docs/domains/` : fiches détaillées par domaine ;
- `docs/testing/` : stratégie de validation, niveaux de tests, roadmap de tests ;
- documentation technique locale à un module : détails d’implémentation ponctuels.

---

## Structure du dossier

- `00-introduction/` : point d’entrée, glossaire, guide de lecture ;
- `10-fondations/` : doctrine d’architecture ;
- `20-structure/` : cartographie du système ;
- `30-execution/` : comportement à l’exécution ;
- `40-exploitation/` : exploitation, maintenance, observabilité ;
- `90-reference/` : conventions, règles de décision, templates.

---

## Ordre de lecture recommandé

### Parcours minimum

1. `00-introduction/00-vue-d-ensemble-du-systeme.md`
2. `00-introduction/01-glossaire.md`
3. `10-fondations/10-principes-d-architecture.md`
4. `10-fondations/11-modele-de-classification.md`
5. `20-structure/20-cartographie-du-systeme.md`

### Parcours architecture complet

1. `00-introduction/00-vue-d-ensemble-du-systeme.md`
2. `00-introduction/01-glossaire.md`
3. `00-introduction/02-guide-de-lecture.md`
4. `10-fondations/10-principes-d-architecture.md`
5. `10-fondations/11-modele-de-classification.md`
6. `10-fondations/12-frontieres-et-responsabilites.md`
7. `20-structure/*`
8. `30-execution/*`
9. `40-exploitation/*`
10. `90-reference/*`

---

## Règles documentaires

1. Un document d’architecture a une fonction unique et explicite.
2. Un document d’architecture ne mélange pas doctrine, inventaire, backlog et notes de réflexion.
3. Le glossaire fait autorité sur le vocabulaire.
4. Les règles structurantes doivent être formulées de manière normative.
5. Toute nouvelle classification doit être cohérente avec `10-fondations/11-modele-de-classification.md`.
6. Toute nouvelle documentation de domaine doit rester cohérente avec la doctrine définie ici.

---

## Style attendu

Le style attendu dans ce dossier est :

- direct ;
- normatif ;
- stable ;
- peu ambigu ;
- centré sur les décisions et leurs conséquences.

Les formulations vagues doivent être évitées.

Exemples à éviter :

- « on pourrait »
- « selon les cas »
- « idéalement »
- « cela dépend »

Préférer :

- « doit »
- « ne doit pas »
- « appartient à »
- « n’appartient pas à »
- « est classé comme »
- « est interdit »
