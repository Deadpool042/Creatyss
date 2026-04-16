# Creatyss — GitHub Copilot repository instructions

`AGENTS.md` is the canonical doctrine of this repository.

These instructions are intentionally short.
They complement `AGENTS.md` for GitHub Copilot usage and must not replace or contradict the repository doctrine.

## Project context

Creatyss is a custom e-commerce foundation built to be:

- local-first with Docker Compose
- maintainable
- strictly typed
- simple, modular, and production-ready
- deployable later on an OVH VPS

It is a single codebase with reusable modular architecture.

It is not, at this stage:

- a site factory
- a multi-tenant platform
- a runtime plugin system
- a generic provisioning engine

## Source of truth

Always align with, in this order:

1. `AGENTS.md`
2. `README.md`
3. `docs/architecture/README.md`
4. `docs/architecture/00-introduction/**`
5. `docs/architecture/10-fondations/**`
6. `docs/architecture/20-structure/**`
7. `docs/domains/README.md`
8. `docs/domains/**` relevant to the task
9. `docs/testing/**` when tests or validation are involved

## Core rules

- Stay strictly within the requested scope.
- Prefer the real repository structure over generic templates.
- Prefer small safe increments over broad redesigns.
- Keep business logic out of UI components.
- Do not reintroduce legacy patterns without explicit confirmation from the current doctrine.
- Preserve public contracts unless the task explicitly requires changing them.
- Do not add unnecessary dependencies.
- Do not use `any` unless explicitly justified.
- Do not over-architect.
- Do not introduce WordPress, WooCommerce, Shopify, Supabase, or Vercel.

## Technical constraints

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker Compose
- Makefile

## Working rule

When documentation, code, and request appear to diverge:

- do not choose silently;
- identify the most relevant project source for the current task;
- stay aligned with repository doctrine;
- make assumptions explicit when needed.
