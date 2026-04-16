---
name: quality-check
description: Vérifier un lot ou une zone du repo contre la doctrine canonique, les boundaries, la qualité TypeScript, la non-régression et le périmètre demandé.
---

# Rôle de ce skill

`AGENTS.md` est la doctrine canonique du repo.

Ce skill ne la recopie pas.
Il définit la discipline de vérification attendue pour contrôler un lot, une zone du dépôt ou un diff ciblé, sans dériver vers une refonte hors périmètre.

# Quand utiliser ce skill

Utiliser ce skill quand la tâche consiste à :

- vérifier un lot implémenté
- contrôler un diff ou une zone modifiée
- évaluer la conformité au périmètre demandé
- détecter une dérive de boundaries, de contrats ou de structure
- contrôler une non-régression locale
- relire une zone avant validation finale

Ne pas utiliser ce skill pour :

- décider seul d’une nouvelle architecture
- implémenter les corrections
- réécrire la doctrine
- faire une modification documentaire pure

# Source de vérité

Lire d’abord, dans cet ordre :

1. `AGENTS.md`
2. `README.md`
3. `.claude/CLAUDE.md`

Puis la documentation structurante pertinente :

- `docs/architecture/README.md`
- `docs/architecture/00-introduction/**`
- `docs/architecture/10-fondations/**`
- `docs/architecture/20-structure/**`
- `docs/domains/README.md`
- `docs/domains/**` ciblés par la demande
- `docs/testing/**` si la demande touche validation, robustesse ou stratégie de tests

Ensuite seulement, auditer la zone réelle du repo concernée par la vérification.

Les anciennes docs `docs/v*` ne sont pas la source de vérité par défaut.

# Ce qu’il faut vérifier

- conformité stricte au périmètre demandé
- respect des imports publics, contrats publics et signatures runtime
- respect des boundaries entre UI, validation, métier et accès aux données
- absence de duplication évitable
- absence de logique métier dans l’UI
- cohérence avec la structure réellement observée dans le repo
- absence de réintroduction de patterns legacy non validés
- typecheck
- lint
- cohérence responsive si l’UI est concernée
- absence de churn inutile, renommages opportunistes ou extraction injustifiée

Quand `prisma/**` est concerné, vérifier aussi :

- cohérence avec la taxonomie canonique
- absence de duplication de propriété des modèles, enums ou types
- absence de fichier `.prisma` vide
- absence de référence orpheline évidente
- exécution de `pnpm prisma validate` si pertinent

# Interdictions

- ne pas demander de refonte hors périmètre
- ne pas imposer une architecture théorique non utilisée dans le repo
- ne pas valider un lot uniquement parce qu’il compile
- ne pas supposer qu’une vérification a été faite si elle n’a pas été montrée
- ne pas implémenter les corrections à la place de la revue

# Règle de jugement

Toujours distinguer clairement :

- ce qui est validé
- ce qui ne l’est pas
- ce qui est risqué
- ce qui manque
- ce qui est hors périmètre

Privilégier les corrections minimales nécessaires.
Ne pas transformer une revue qualité en prétexte pour élargir le lot.

# Format de réponse

1. verdict global
2. problèmes bloquants
3. problèmes secondaires
4. fichiers concernés
5. vérifications exécutées ou manquantes
6. commandes de vérification
7. corrections minimales recommandées
8. ce qui reste hors périmètre
