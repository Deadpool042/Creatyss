Audit Repo

Objectif

Réaliser un audit factuel du dépôt en comparant :

* documentation
* Prisma
* features
* routes
* tests

Source de vérité

Lire dans cet ordre :

1. AGENTS.md
2. README.md
3. .claude/CLAUDE.md

Puis la documentation concernée.

Règle de factualité

Toujours distinguer :

* Observé
* Documenté
* Déduit
* Inconnu

Ne jamais présenter une hypothèse comme un fait.

Règle de preuve

La documentation permet uniquement de conclure :

* documenté
* décrit
* spécifié

Elle ne permet jamais de conclure :

* implémenté
* actif
* utilisé
* opérationnel

sans preuve complémentaire.

Vérifications

Identifier :

* documenté mais non observé
* observé mais non documenté
* implémenté mais non testé
* testé mais non documenté
* écarts AGENTS ↔ documentation
* écarts documentation ↔ Prisma
* écarts Prisma ↔ features
* écarts features ↔ tests

Sortie attendue

Pour chaque constat :

* constat
* statut (Observé / Documenté / Déduit / Inconnu)
* preuve

Ne jamais extrapoler.
