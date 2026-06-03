# Lots

## Objectif

Ce dossier regroupe les documents opératoires de lots d'implémentation.

Il ne remplace pas :

- `AGENTS.md`
- `docs/architecture/`
- `docs/domains/`
- `docs/testing/`
- `docs/roadmap/`

Il sert à cadrer un lot exécutable, borné et vérifiable.

---

## Ce que ce dossier contient

- une roadmap de lot : intention, périmètre, invariants, risques, sorties attendues
- une checklist de lot : séquence d'exécution et de vérification

---

## Ce que ce dossier ne doit pas contenir

- doctrine d'architecture
- brainstorming flou
- backlog générique non borné
- cible future présentée comme déjà implémentée
- refactor opportuniste hors lot

---

## Règles d'usage

Chaque lot doit rester :

- borné
- cohérent avec la structure réelle du repo
- compatible avec `AGENTS.md`
- explicite sur ce qui change et ce qui ne change pas

Chaque lot doit préciser au minimum :

- objectif
- périmètre
- hors périmètre
- invariants
- risques
- fichiers concernés
- vérifications
- critères de fin

---

## Convention de nommage

Pour un lot concret :

- roadmap : `YYYY-MM-DD-<slug>-roadmap.md`
- checklist : `YYYY-MM-DD-<slug>-checklist.md`

Exemple :

- `2026-05-27-admin-products-routing-roadmap.md`
- `2026-05-27-admin-products-routing-checklist.md`

---

## Usage IA

Quand une IA s'appuie sur un lot dans ce dossier, elle doit :

1. lire d'abord `AGENTS.md`
2. lire ensuite la documentation structurante liée au sujet
3. lire la roadmap du lot
4. exécuter seulement le périmètre autorisé
5. utiliser la checklist comme garde-fou opératoire, pas comme substitut au raisonnement
6. signaler explicitement toute divergence entre lot, code réel et doctrine

---

## Templates

Les fichiers suivants servent de base :

- [`_lot-roadmap-template.md`](./_lot-roadmap-template.md)
- [`_lot-checklist-template.md`](./_lot-checklist-template.md)
