---
name: quality-check
description: Vérifier un lot ou une zone du repo contre la doctrine courante, les boundaries, la qualité TypeScript, la non-régression et le périmètre demandé.
---

# Source de vérité

Lire d'abord :

1. README.md
2. AGENTS.md
3. .claude/CLAUDE.md
4. .meta/agent-doctrine.md
5. .meta/agent-routing.md

Puis la doctrine architecture courante et la doc ciblée par la demande.

# Ce qu'il faut vérifier

- conformité au périmètre
- respect des imports publics et des boundaries
- absence de duplication évitable
- absence de logique métier dans l’UI
- cohérence avec la structure réelle du repo
- typecheck
- lint
- cohérence responsive si UI concernée
- absence de réintroduction de patterns legacy non validés

# Interdictions

- ne pas demander de refonte hors périmètre
- ne pas imposer une architecture théorique non utilisée dans le repo
- ne pas considérer `docs/v*` comme source canonique par défaut

# Format de réponse

1. verdict global
2. problèmes bloquants
3. problèmes secondaires
4. fichiers concernés
5. commandes de vérification
6. corrections minimales recommandées
