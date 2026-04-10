---
name: lot-implementation
description: Implémenter un lot borné en respectant strictement le périmètre demandé, la doctrine courante du repo, les contrats publics existants et la structure réellement observée.
---

# Quand utiliser ce skill

Utiliser ce skill quand la tâche demande une implémentation clairement bornée dans le repo :

- verticale admin ciblée
- évolution locale d’un domaine
- extraction limitée de types, helpers, queries ou composants
- adaptation d’un flux serveur, UI ou accès aux données déjà cadré

# Source de vérité

Lire d'abord, dans cet ordre :

1. README.md
2. AGENTS.md
3. .claude/CLAUDE.md
4. .meta/agent-doctrine.md
5. .meta/agent-routing.md

Ensuite seulement, la doctrine architecture courante :

- docs/architecture/README.md
- docs/architecture/00-introduction/**
- docs/architecture/10-fondations/**
- docs/architecture/20-structure/**
- docs/domains/README.md
- docs/domains/** ciblés par la demande
- docs/testing/** si la demande touche les tests

Les anciennes docs `docs/v*` ne sont pas la source de vérité par défaut.

# Règles d’implémentation

- Auditer d'abord, éditer ensuite.
- Rester strictement dans le périmètre demandé.
- Modifier uniquement les fichiers nécessaires.
- Préserver les contrats publics, imports publics et signatures runtime sauf demande explicite.
- Respecter la structure réelle du repo avant tout.
- Ne jamais imposer un template fixe `repository/queries/services/helpers/mappers/types` si le repo réel n'utilise pas cette structure.
- Ne jamais réintroduire une couche `db/repositories` sans validation explicite de la doctrine courante.
- Toujours privilégier la solution la plus simple, lisible et robuste.
- Toujours vérifier les boundaries entre UI, validation, métier et accès aux données.

# Contraintes projet

- Next.js App Router
- TypeScript strict
- Server Components par défaut
- Client Components seulement si nécessaire
- pas de logique métier dans les composants UI
- pas de `any` sauf justification explicite
- pas de dépendance inutile
- pas de sur-architecture
- token-driven pour l’UI si système existant

# Format de livraison attendu

1. résumé bref
2. fichiers modifiés/créés
3. code complet ou patchs
4. variables d’environnement nécessaires
5. commandes de vérification
6. vérification manuelle attendue
7. ce qui reste hors périmètre
