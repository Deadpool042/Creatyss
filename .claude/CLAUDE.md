# Claude Code – Creatyss

## Source canonique

AGENTS.md est la doctrine canonique du dépôt.

Toujours commencer par lire AGENTS.md.

Ne jamais :

- contourner AGENTS.md ;
- dupliquer AGENTS.md ;
- contredire AGENTS.md.

En cas de conflit :

1. AGENTS.md
2. docs/architecture/**
3. docs/domains/**
4. documentation locale

`.claude/CLAUDE.md` est la base opératoire versionnée pour les assistants sur Creatyss.

Les couches `.github/**`, `.codex/**` et `.agents/**` doivent la compléter ou la décliner, jamais définir une doctrine concurrente.

---

## Utilisation du RAG

Utiliser creatyss-rag lorsque :

- le périmètre documentaire est inconnu ;
- plusieurs domaines peuvent être concernés ;
- un audit transversal est demandé ;
- il faut retrouver rapidement les fichiers pertinents.

Ne pas utiliser le RAG comme preuve.

Le RAG sert à :

- orienter ;
- localiser ;
- réduire la lecture inutile.

Toute affirmation finale doit être basée sur :

- fichiers lus ;
- code observé ;
- Prisma observé ;
- tests observés.

---

## Utilisation de MemPalace

Utiliser MemPalace lorsque :

- la demande implique historique, décisions passées, lots précédents ou contexte inter-session ;
- il faut retrouver un choix antérieur avant de relire le repo ;
- il faut compléter le cadrage avec de la mémoire projet non portée par la documentation canonique.

Ne pas utiliser MemPalace comme preuve d'implémentation.

MemPalace sert à :

- rappeler le contexte inter-session ;
- retrouver des décisions ou lots antérieurs ;
- orienter les lectures utiles avant vérification.

Pour Creatyss, les deux outils coexistent avec des rôles distincts :

- MemPalace → historique, continuité, décisions passées ;
- creatyss-rag → cadrage repo, localisation rapide de fichiers et documentation ;
- lecture directe du repo → preuve finale.

---

## Priorité outillage

Pour Creatyss :

- `pnpm dev` reste la commande canonique de développement local natif ;
- quand un `Makefile` fournit déjà une cible claire pour un workflow utilitaire, conteneurisé ou répétitif, préférer `make <target>` plutôt que réécrire la commande brute ;
- Docker Compose ne devient pas la source de vérité du développement local pour autant ; il reste réservé au prod-like local, à l’intégration et aux vérifications conteneurisées.

---

## Routage des agents

audit / architecture
→ architect-review

implémentation générique
→ repo-refactor

feature Next.js (app/**, features/**)
→ next-feature-builder

Prisma
→ prisma-architect

documentation
→ docs-keeper

UI admin
→ next-admin-ui-builder

quality gate
→ quality-gate

tests (Vitest, Playwright)
→ test-engineer

---

## Délégation

Préférer un agent spécialisé lorsque :

- le lot touche plusieurs fichiers ;
- un audit complet est demandé ;
- des tests doivent être créés ;
- une revue architecturale est nécessaire.

Éviter de réaliser tout le travail dans le thread principal si un agent spécialisé est plus adapté.

---

## Skills globales

Utiliser uniquement lorsqu'elles apportent une valeur réelle.

context7-mcp
→ documentation framework ou librairie externe.

debug-error
→ erreur TypeScript, Prisma, Next.js, build ou runtime.

webapp-testing
→ validation UI, Playwright, recette navigateur.

frontend-design
→ conception ou refonte visuelle.

skill-creator
→ création ou amélioration de skills.

find-skills
→ recherche de skills externes.

Ne pas utiliser une skill externe lorsqu'une lecture locale du repo suffit.

---

## Audit de cohérence

Pour toute demande d’audit :

- appliquer l’ordre de lecture défini dans AGENTS.md ;
- lire uniquement les zones pertinentes ;
- comparer documentation, Prisma, code et tests.

Identifier si pertinent :

- documenté mais non observé ;
- observé mais non documenté ;
- implémenté mais non testé ;
- testé mais non documenté ;
- écarts AGENTS ↔ documentation ;
- écarts documentation ↔ Prisma ;
- écarts Prisma ↔ features ;
- écarts features ↔ tests.

Ne jamais considérer la documentation comme preuve d’implémentation.

---

## Règle de périmètre

Lire uniquement ce qui est nécessaire.

Ne pas charger :

- toute l’architecture ;
- tous les domaines ;
- toute la documentation ;

si la demande concerne un périmètre local.

Étendre la lecture uniquement lorsqu'une incohérence structurelle est détectée.

---

## Micro-lots

Toujours privilégier :

- le plus petit changement fiable ;
- les modifications locales ;
- la compatibilité existante ;
- les refactors progressifs.

Éviter :

- les réécritures massives ;
- les renommages inutiles ;
- les abstractions prématurées.

---

## Validation

Après modification :

- pnpm run typecheck
- pnpm run lint

Ajouter :

- tests ciblés ;
- Playwright ciblé ;
- db:validate

uniquement lorsque le lot le justifie.

---

## Comptes-rendus

Toujours distinguer :

- Observé
- Documenté
- Déduit
- Inconnu

Ne jamais mélanger ces catégories.

Toujours préciser :

- fichiers lus ;
- fichiers modifiés ;
- validations exécutées ;
- validations non exécutées ;
- risques éventuels.


## Git Workflow

Pour tout lot non trivial :

### Branche

Ne pas travailler directement sur `main`.

Créer une branche dédiée :

- feature/<scope>-<topic>
- fix/<scope>-<topic>
- refactor/<scope>-<topic>
- docs/<topic>
- test/<topic>

### Auto-review

Avant commit :

- vérifier les violations AGENTS.md ;
- vérifier les duplications introduites ;
- vérifier les abstractions prématurées ;
- supprimer le code mort observé ;
- supprimer les imports inutilisés observés.

### Commit

Utiliser les Conventional Commits :

- feat(scope): ...
- fix(scope): ...
- refactor(scope): ...
- docs(scope): ...
- test(scope): ...

### Livraison

Pour tout lot non trivial, fournir :

- résumé ;
- fichiers modifiés ;
- impact architecture ;
- validations exécutées ;
- validations non exécutées ;
- risques éventuels.

### Reviewnon 

Avant de considérer le lot terminé :

- relire le changement comme un reviewer indépendant ;
- challenger la complexité ajoutée ;
- vérifier la cohérence avec AGENTS.md et la documentation applicable.

---

## Principe final

Claude Code applique AGENTS.md.

En cas de doute :

- revenir à AGENTS.md ;
- privilégier les faits observés ;
- signaler les incohérences plutôt que les interpréter.
