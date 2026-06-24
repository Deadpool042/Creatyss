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

---

## Principe final

Claude Code applique AGENTS.md.

En cas de doute :

- revenir à AGENTS.md ;
- privilégier les faits observés ;
- signaler les incohérences plutôt que les interpréter.

