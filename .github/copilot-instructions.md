# Creatyss — GitHub Copilot repository instructions

## Project context

Creatyss is a custom e-commerce foundation.

Prioritize:

- local-first development with Docker Compose
- strict TypeScript
- clear separation between UI, domain logic, validation, and data access
- simple, maintainable, production-ready code
- small safe increments
- fidelity to the current repository doctrine

## Source of truth

Always align with:

1. `AGENTS.md`
2. `README.md`
3. `docs/architecture/README.md`
4. `docs/architecture/00-introduction/**`
5. `docs/architecture/10-fondations/**`
6. `docs/architecture/20-structure/**`
7. `docs/domains/README.md`
8. `docs/domains/**` relevant to the task
9. `docs/testing/**` when tests or validation are involved

Do not use `docs/v*` or old flat `docs/architecture/*.md` files as the default source of truth.

## Core rules

- Do not introduce WordPress, WooCommerce, Shopify, Supabase, or Vercel.
- Do not add unnecessary dependencies.
- Do not use `any` unless explicitly justified.
- Do not over-architect.
- Do not reintroduce legacy `db/repositories` patterns without explicit confirmation from the current doctrine.
- Respect the real repository structure before applying any generic template.
- Keep business logic out of UI components.
- Preserve public contracts unless the task explicitly requires changing them.

## Stack

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker Compose
- Makefile
