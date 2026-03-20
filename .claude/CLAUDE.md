# Claude Code – Creatyss

## Source de vérité

Lire en priorité, selon le périmètre du lot :

1. `AGENTS.md`
2. `README.md`
3. `docs/v6/scope.md`
4. `docs/v6/data-model.md`
5. `docs/v6/roadmap.md`
6. `docs/v6/admin-language-and-ux.md`
7. `docs/v6/glossary.md`

Compléter obligatoirement avec la documentation récente quand le sujet est concerné :

8. `docs/v19/README.md`
9. `docs/v20/README.md`
10. `docs/v21/README.md`
11. `docs/v21/doctrine.md`
12. `docs/v21/roadmap.md`
13. `docs/v21/scope.md`

## Contexte projet

Creatyss est une boutique e-commerce custom.

Stack cible :

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Prisma
- Docker / Docker Compose en local
- déploiement futur sur VPS OVH

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

## Doctrine architecture

- Séparer clairement :
  - domaine métier
  - accès aux données
  - logique serveur
  - UI
- Ne pas mélanger logique métier et composants de présentation.
- Les règles métier restent dans `entities/` ou dans la couche métier dédiée, pas dans les composants UI.
- La couche `db/` doit rester lisible, modulaire et explicite.
- Prisma ORM uniquement dans `db/`.
- Pas de SQL runtime brut.
- Les repositories publics restent les points d’entrée stables.
- Les helpers internes, queries internes et types internes doivent rester locaux au domaine quand c’est pertinent.
- Préserver les chemins publics existants tant qu’un lot ne demande pas explicitement de les changer.

## Doctrine documentation

- La documentation doit refléter le code réel.
- Ne jamais documenter une architecture future comme si elle existait déjà.
- Toujours distinguer :
  - état réel actuel
  - cible visée
  - hors périmètre
- Quand un repository est une façade de lecture agrégée, ne pas le documenter comme domaine métier.
- Toute doc de lot doit préciser :
  - objectif
  - périmètre
  - hors périmètre
  - invariants
  - risques
  - vérifications
  - critères de fin

## Politique de routage des agents

Quand la demande concerne un audit, un plan, une décision d’architecture, une ambiguïté de périmètre, une revue de doctrine, ou la cohérence entre code et documentation, utiliser en priorité `architect-review`.

Quand la demande consiste à exécuter un lot défini, modifier du code, refactorer un périmètre clair, ou extraire des fichiers internes dans une architecture déjà cadrée, utiliser en priorité `repo-refactor`.

Quand la demande consiste à vérifier un lot terminé, relire un diff, contrôler la dérive de périmètre, valider les risques, ou décider si un lot est réellement fini, utiliser en priorité `quality-gate`.

Quand la demande concerne uniquement la documentation, la rédaction ou la mise à jour de `docs/v19/**`, `docs/v20/**` ou `docs/v21/**`, utiliser en priorité `docs-keeper`.

Règles supplémentaires :

- Si la demande mélange plan et implémentation, commencer par `architect-review`.
- Si la demande mélange code et documentation, traiter d’abord le code avec `repo-refactor`, puis la documentation avec `docs-keeper`.
- Si la demande est ambiguë ou si le périmètre n’est pas clair, commencer par `architect-review`.
- `repo-refactor` ne doit pas être utilisé pour décider de l’architecture.
- `docs-keeper` ne doit pas modifier le code.
- `quality-gate` ne doit pas implémenter de changements.

## Sélection obligatoire d’agent

Avant toute réponse, déterminer explicitement quel agent doit être utilisé selon la politique de routage.

Toujours :

1. Identifier le type de demande
2. Choisir l’agent le plus adapté
3. Annoncer le choix d’agent en début de réponse

Format attendu :

Agent choisi : <nom-agent>

Ensuite seulement produire la réponse.

Si plusieurs agents sont nécessaires :

- commencer par celui qui cadre (souvent `architect-review`)
- puis enchaîner logiquement
- expliciter la transition

Aucune réponse ne doit être produite sans sélection d’agent préalable.

## Méthode de travail

Avant de modifier :

- auditer le périmètre réel
- identifier les fichiers réellement concernés
- identifier les imports impactés
- expliciter les invariants à préserver
- signaler les ambiguïtés avant exécution

Pendant le lot :

- faire les changements les plus locaux possibles
- préserver la compatibilité publique
- éviter le churn inutile
- éviter les renommages si le gain n’est pas net

Après le lot :

- exécuter les vérifications pertinentes :
  - `pnpm run typecheck`
  - `pnpm run lint`
  - tests ciblés si pertinent
  - e2e ciblés si le lot touche l’UI ou un parcours critique
- rendre un compte-rendu précis :
  - fichiers modifiés
  - ce qui a changé
  - ce qui n’a pas changé
  - risques ou écarts éventuels
  - résultat des vérifications

## Règle de prudence

En cas de doute :

- préférer la solution la plus simple
- préférer la compatibilité au redesign
- préférer une extraction interne locale à une refonte publique
- demander validation avant tout changement de sémantique ou de contrat
