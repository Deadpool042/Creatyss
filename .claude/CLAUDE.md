# Claude Code – Creatyss

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
- document de lot explicitement visé
- ancienne documentation seulement si la demande la vise explicitement

Les anciennes docs `docs/v*` et les anciens chemins plats de `docs/architecture/` ne sont plus la source de vérité courante.

---

## Contexte projet

Creatyss est un socle e-commerce custom.

Le projet est conçu pour être :

- local-first via Docker Compose ;
- maintenable ;
- lisible ;
- strictement typé ;
- documenté ;
- déployable ensuite sur un VPS OVH ;
- réutilisable pour d'autres projets e-commerce au-delà du seul cas Creatyss.

Stack cible :

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker / Docker Compose
- Makefile

---

## Doctrine repo

Le repo est désormais structuré autour d’une doctrine explicite portée par `docs/architecture/`.

La colonne vertébrale documentaire est :

- `00-introduction/`
- `10-fondations/`
- `20-structure/`
- `30-execution/`
- `40-exploitation/`
- `90-reference/`

La documentation détaillée des domaines se trouve dans `docs/domains/`.

La stratégie de validation se trouve dans `docs/testing/`.

---

## Taxonomie documentaire

La taxonomie documentaire reconnue dans `docs/domains/` est :

- `core/`
- `optional/`
- `cross-cutting/`
- `satellites/`

Ne jamais confondre :

- catégorie documentaire ;
- criticité architecturale ;
- activabilité ;
- source de vérité.

Points doctrinaux importants déjà stabilisés :

- `availability` porte la disponibilité vendable ;
- `inventory` porte la vérité de stock ;
- `fulfillment` porte l’exécution logistique ;
- `shipping` porte l’expédition et le suivi de livraison ;
- `auth`, `users`, `roles`, `permissions` relèvent d’un coeur structurel ;
- `customers` porte le client métier ;
- `events` dans `cross-cutting/` peut être un vrai domaine métier transverse et ne doit pas être confondu avec les domain events internes.

---

## Règles absolues

- Toujours rester dans le périmètre demandé.
- Toujours proposer un plan avant un lot non trivial.
- Ne jamais faire de refactor opportuniste hors périmètre.
- Ne pas ajouter de dépendance sans nécessité explicite.
- Ne pas modifier le comportement métier sans demande explicite.
- Ne pas changer les contrats publics ou signatures runtime sans l’annoncer explicitement.
- Ne pas introduire de nouvelle abstraction si une extraction locale suffit.
- Ne pas utiliser `any` sauf justification explicite.
- Toujours privilégier de petits lots sûrs.
- Ne jamais faire dériver la doctrine courante à partir d’un ancien document isolé sans validation explicite.
- Ne jamais contourner `docs/architecture/` au nom de la vitesse.

---

## Doctrine architecture

- Le métier passe avant la technique.
- Le coeur doit rester identifiable.
- Les capacités optionnelles doivent rester bornées.
- Les dépendances externes doivent être encapsulées.
- La source de vérité doit être explicite.
- Les événements expriment des faits ; ils ne corrigent pas une mauvaise modélisation.
- Les préoccupations transverses doivent être traitées explicitement.
- Les frontières doivent être compréhensibles.
- Le système doit rester testable par responsabilité.
- La documentation doit refléter la structure réelle.

Séparer clairement :

- domaine métier ;
- structure d’accès ;
- intégration ;
- exécution ;
- données ;
- UI.

Ne pas mélanger logique métier et composants de présentation.

---

## Doctrine documentation

- La documentation doit refléter le code réel.
- Ne jamais documenter une architecture future comme si elle existait déjà.
- Toujours distinguer :
  - état réel actuel ;
  - cible visée ;
  - hors périmètre.
- Toute fiche domaine doit rester cohérente avec :
  - `docs/architecture/`
  - `docs/domains/README.md`
  - `docs/domains/_template.md`
  - `docs/domains/_migration-audit.md` si le lot touche une zone en migration.
- Toute doc de lot doit préciser :
  - objectif ;
  - périmètre ;
  - hors périmètre ;
  - invariants ;
  - risques ;
  - vérifications ;
  - critères de fin.

Si une modification touche la doctrine, vérifier la cohérence entre :

- `README.md`
- `AGENTS.md`
- `.claude/CLAUDE.md`
- `docs/architecture/`
- `docs/domains/`
- `docs/testing/`

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

Règles supplémentaires :

- si la demande mélange plan et implémentation, commencer par `architect-review` ;
- si la demande mélange code et documentation, traiter d’abord le code avec `repo-refactor`, puis la documentation avec `docs-keeper` ;
- si la demande est ambiguë, commencer par `architect-review` ;
- `repo-refactor` ne décide pas seul de l’architecture ;
- `docs-keeper` ne modifie pas le code ;
- `quality-gate` n’implémente pas de changements.

Quand l’usage d’un agent est pertinent, l’annoncer explicitement au début de la réponse.
Ne pas transformer cette règle en formalisme rigide inutile si aucun routage n’est réellement nécessaire.

---

## Méthode de travail

Avant de modifier :

- auditer le périmètre réel ;
- identifier les fichiers réellement concernés ;
- identifier les imports, contrats et docs impactés ;
- expliciter les invariants à préserver ;
- signaler les ambiguïtés avant exécution.

Pendant le lot :

- faire les changements les plus locaux possibles ;
- préserver la compatibilité publique ;
- éviter le churn inutile ;
- éviter les renommages si le gain n’est pas net.

Après le lot :

- exécuter les vérifications pertinentes :
  - `pnpm run typecheck`
  - `pnpm run lint`
  - tests ciblés si pertinent
  - e2e ciblés si le lot touche l’UI ou un parcours critique
- rendre un compte-rendu précis :
  - fichiers modifiés ;
  - ce qui a changé ;
  - ce qui n’a pas changé ;
  - risques ou écarts éventuels ;
  - résultat des vérifications.

---

## Règle de prudence

En cas de doute :

- préférer la solution la plus simple ;
- préférer la compatibilité au redesign ;
- préférer une extraction interne locale à une refonte publique ;
- revenir à `docs/architecture/` ;
- clarifier la source de vérité ;
- clarifier la frontière du domaine ;
- demander validation avant tout changement de sémantique ou de contrat.
