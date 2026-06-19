# Claude Code – Creatyss

## Rôle

AGENTS.md est la doctrine canonique du dépôt.

Claude Code doit toujours commencer par lire AGENTS.md.

Ne jamais dupliquer ou contredire AGENTS.md.

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

## Audit de cohérence

Pour toute demande d’audit :

- appliquer l’ordre de lecture défini dans AGENTS.md ;
- lire ensuite les documents, lots et zones de code pertinents pour la demande ;
- comparer la documentation avec le repo observé.

Identifier si pertinent :

- documenté mais non observé
- observé mais non documenté
- implémenté mais non testé
- testé mais non documenté
- écarts AGENTS ↔ documentation
- écarts documentation ↔ Prisma
- écarts Prisma ↔ features
- écarts features ↔ tests

Ne jamais considérer la documentation comme preuve d’implémentation.

---

## Règle de périmètre

Lire uniquement ce qui est nécessaire à la demande.

Ne pas auditer l’ensemble du dépôt si la demande concerne un périmètre borné.

Étendre l’audit uniquement si une incohérence structurelle est détectée.

---

## Comptes-rendus

Toujours distinguer :

- Observé
- Documenté
- Déduit
- Inconnu

Ne jamais mélanger ces catégories.

---

## Principe final

Claude Code applique AGENTS.md.

En cas de doute :

- revenir à AGENTS.md ;
- privilégier les faits observés ;
- signaler les incohérences plutôt que les interpréter.
