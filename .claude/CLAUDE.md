# Claude Code – Creatyss

## Rôle de ce fichier

`AGENTS.md` est la doctrine canonique du repo.

Ce fichier définit uniquement les règles d’exécution spécifiques à Claude Code :

- routage des agents ;
- séquencement des interventions ;
- règles de collaboration entre agents ;
- garde-fous opérationnels pour l’exécution des lots.

Ne pas dupliquer ici la doctrine générale du projet sauf si un rappel bref est strictement utile à l’exécution.

---

## Source de vérité

Lire par défaut, dans cet ordre :

1. `AGENTS.md`
2. `README.md`
3. `docs/architecture/README.md`
4. `docs/architecture/00-introduction/00-vue-d-ensemble-du-systeme.md`
5. `docs/architecture/00-introduction/01-glossaire.md`
6. `docs/architecture/00-introduction/02-guide-de-lecture.md`
7. `docs/architecture/10-fondations/10-principes-d-architecture.md`
8. `docs/architecture/10-fondations/11-modele-de-classification.md`
9. `docs/architecture/10-fondations/12-frontieres-et-responsabilites.md`
10. `docs/architecture/20-structure/20-cartographie-du-systeme.md`
11. `docs/architecture/20-structure/21-domaines-coeur.md`
12. `docs/architecture/20-structure/22-capacites-optionnelles.md`
13. `docs/architecture/20-structure/23-systemes-externes-et-satellites.md`
14. `docs/architecture/20-structure/24-preoccupations-transverses.md`
15. `docs/domains/README.md`
16. `docs/testing/` si la demande touche validation, robustesse ou stratégie de tests

Ensuite seulement, lire la documentation ciblée par la demande :

- fiche précise dans `docs/domains/`
- document précis dans `docs/testing/`

---

## Règles opérationnelles globales

- Toujours appliquer `AGENTS.md` comme doctrine canonique.
- Toujours rester dans le périmètre demandé.
- Toujours privilégier les plus petits changements sûrs.
- Ne jamais faire de refactor opportuniste hors périmètre.
- Ne jamais remplacer une contrainte projet par une préférence générique.
- Ne jamais traiter Creatyss comme une site-factory ou une plateforme multi-tenant sans demande explicite.
- Ne jamais réintroduire une architecture legacy sans validation explicite de la doctrine courante.
- Ne jamais modifier silencieusement un contrat public, une signature runtime ou une sémantique métier.
- En cas de doute, préférer la compatibilité, la lisibilité et la solution la plus simple.

---

## Politique de routage des agents

Quand la demande concerne :

- un audit ;
- un plan ;
- une décision d’architecture ;
- une ambiguïté de périmètre ;
- une revue de doctrine ;
- une cohérence entre code et documentation,

utiliser en priorité `architect-review`.

Quand la demande consiste à :

- exécuter un lot défini ;
- modifier du code ;
- refactorer un périmètre clair ;
- extraire des fichiers internes dans une architecture déjà cadrée,

utiliser en priorité `repo-refactor`.

Quand la demande consiste à :

- vérifier un lot terminé ;
- relire un diff ;
- contrôler la dérive de périmètre ;
- valider les risques ;
- décider si un lot est réellement fini,

utiliser en priorité `quality-gate`.

Quand la demande concerne uniquement :

- `docs/architecture/**`
- `docs/domains/**`
- `docs/testing/**`
- `README.md`
- `AGENTS.md`
- fichiers d’instructions IA du repo

utiliser en priorité `docs-keeper`.

Quand la demande concerne :

- `prisma/**`
- Prisma
- PostgreSQL
- relations
- contraintes
- taxonomie Prisma
- migrations ou réalignement de schéma

utiliser en priorité `prisma-architect`.

Quand la demande concerne une implémentation Next.js bornée hors Prisma :

- feature applicative ;
- sous-lot technique localisé ;
- action / query / service / composant lié à une feature ;

utiliser en priorité `next-feature-builder`.

Quand la demande concerne une UI admin :

- écran admin ;
- formulaire admin ;
- table admin ;
- responsive admin ;
- cohérence visuelle admin ;

utiliser en priorité `next-admin-ui-builder`.

Quand la demande consiste à contrôler une UI admin déjà modifiée :

- respect des tokens ;
- responsive ;
- absence de logique métier dans l’UI ;
- non-régression visuelle ou structurelle ;

utiliser en priorité `next-admin-ui-quality-gate`.

Quand la demande consiste à contrôler une feature Next déjà modifiée :

- périmètre ;
- boundaries ;
- contrats publics ;
- lint / typecheck / non-régression ;

utiliser en priorité `next-feature-quality-gate`.

---

## Règles de séquencement

Appliquer les séquences suivantes par défaut.

### 1. Demande ambiguë ou non cadrée

- commencer par `architect-review` ;
- ne pas partir directement en implémentation.

### 2. Demande mêlant plan et implémentation

- commencer par `architect-review` ;
- exécuter ensuite avec l’agent d’implémentation adapté ;
- finir par un quality gate adapté si le lot est significatif.

### 3. Demande mêlant code et documentation

- traiter d’abord le code avec l’agent d’implémentation adapté ;
- traiter ensuite la documentation avec `docs-keeper` ;
- ne pas réaligner la doc avant d’avoir stabilisé le code concerné.

### 4. Demande Prisma avec impact doctrine ou taxonomie

- commencer par `architect-review` si l’impact structurel est ambigu ;
- sinon utiliser `prisma-architect` ;
- terminer par `quality-gate` si le lot est large ou structurant.

### 5. Lot d’implémentation non trivial

- cadrage si nécessaire ;
- implémentation ;
- vérification ;
- documentation si impactée.

---

## Frontières entre agents

- `architect-review` cadre ; il n’implémente pas par défaut.
- `repo-refactor` ou les builders implémentent ; ils ne décident pas seuls de l’architecture.
- `docs-keeper` maintient la cohérence documentaire ; il ne modifie pas le code.
- `quality-gate` et les quality gates spécialisés vérifient ; ils n’implémentent pas.
- `prisma-architect` travaille sur la persistance ; il n’étend pas son périmètre à l’UI ou à des refactors applicatifs larges sans demande explicite.

En cas d’ambiguïté entre plusieurs agents, préférer :

1. l’agent le plus spécialisé ;
2. sinon `architect-review` pour cadrer ;
3. sinon l’agent le plus local au périmètre demandé.

---

## Règles d’annonce et de sortie

Quand l’usage d’un agent est pertinent, l’annoncer explicitement au début de la réponse.

Cette annonce doit rester simple et utile.
Ne pas transformer le routage en formalisme lourd si aucun gain réel n’en découle.

Quand un lot est exécuté, rendre un compte-rendu précis comprenant, si pertinent :

- fichiers modifiés ;
- ce qui a changé ;
- ce qui n’a pas changé ;
- risques ou limites éventuelles ;
- vérifications effectuées ;
- points restant hors périmètre.

Quand une vérification n’a pas été exécutée, le dire explicitement.
Ne jamais supposer qu’un contrôle a eu lieu s’il n’a pas été montré.

---

## Règles de prudence

Avant toute modification :

- auditer le périmètre réel ;
- identifier les fichiers concernés ;
- identifier les contrats et imports impactés ;
- expliciter les invariants à préserver ;
- signaler toute ambiguïté structurante.

Pendant le lot :

- limiter le churn ;
- éviter les renommages sans gain net ;
- préserver les contrats publics sauf demande explicite ;
- éviter les restructurations larges non demandées.

Après le lot :

- exécuter les vérifications pertinentes ;
- distinguer clairement validé / non validé ;
- signaler les écarts doctrine / code / documentation si détectés.

---

## Cohérence avec le repo

Si un écart est détecté entre :

- `AGENTS.md`
- `.claude/CLAUDE.md`
- `docs/architecture/**`
- `docs/domains/**`
- `docs/testing/**`
- code réel

ne pas choisir silencieusement.

Il faut :

1. signaler l’écart ;
2. identifier la source la plus structurante pour la tâche en cours ;
3. rester aligné sur la doctrine canonique ;
4. éviter toute dérive implicite.

---

## Principe final

Sur Creatyss, Claude Code doit se comporter comme un exécutant discipliné de la doctrine du dépôt.

La priorité n’est pas de produire vite une réponse générique.
La priorité est de produire une réponse fidèle au repo, bornée, maintenable, claire et vérifiable.
