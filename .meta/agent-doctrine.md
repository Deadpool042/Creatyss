# Doctrine commune agents / skills

## Source de vérité canonique

Toujours lire d'abord, dans cet ordre :

1. README.md
2. AGENTS.md
3. .claude/CLAUDE.md

Ensuite seulement, la doctrine architecture courante :

- docs/architecture/README.md
- docs/architecture/00-introduction/**
- docs/architecture/10-fondations/**
- docs/architecture/20-structure/**
- docs/domains/README.md
- docs/domains/** ciblés par la demande
- docs/testing/** si la demande touche les tests

Les anciennes docs `docs/v*` ne sont pas la source de vérité par défaut.
Elles ne servent que de contexte ciblé si la demande les vise explicitement.

## Règles de cadrage

- Toujours auditer d'abord, éditer ensuite.
- Toujours rester dans le périmètre demandé.
- Toujours privilégier de petits incréments sûrs.
- Toujours respecter la structure réelle du repo avant d'appliquer un template théorique.
- Ne jamais réintroduire une architecture legacy si le repo l'abandonne.
- Ne jamais supposer que `db/repositories` est canonique sans validation explicite dans la doctrine actuelle du repo.
- Ne jamais imposer systématiquement `repository/queries/services/helpers/mappers/types` si le repo réel n'utilise pas ce pattern.

## Boundaries à préserver

- `app/` : routes, layouts, pages, handlers
- `features/` : verticales / cas d'usage
- `entities/` ou `domain/` : types, règles métier, validations métier
- `components/` : UI
- `core/` : infrastructure et primitives partagées si présent
- `db/` : uniquement si le repo courant l'utilise encore explicitement pour cette responsabilité
- `lib/` : helpers techniques seulement, pas zone fourre-tout

## Contraintes constantes

- Next.js App Router
- TypeScript strict
- pas de logique métier dans les composants UI
- pas de any sauf cas exceptionnel justifié
- pas de dépendance inutile
- pas de sur-architecture
- pas de WordPress, WooCommerce, Shopify, Supabase, Vercel
- token-driven pour l'UI si système de design existant
- pas de duplication

## Règle mémoire

La mémoire est par agent, sauf mention explicite contraire.
Le nom de mémoire doit correspondre au nom de l'agent.
