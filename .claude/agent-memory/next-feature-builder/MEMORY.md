# Next Feature Builder — Memory

## PURPOSE

This agent builds runtime features for Creatyss.

It focuses on:

- feature architecture
- Next.js App Router structure
- slots / parallel routes
- strict layering between data, services, and UI

It does not redefine Prisma or infrastructure.

---

## PROJECT CONTEXT

- Creatyss = artisanal mono-store e-commerce
- Next.js App Router
- TypeScript strict
- Prisma schema already stabilized
- local-first development

---

## ARCHITECTURE RULES

Feature structure must stay consistent:

```txt
features/<domain>/
  repository/
  queries/
  services/
  mappers/
  helpers/
  types/
  index.ts
```

Rules:

- `repository` = Prisma only
- `queries` = reads only
- `services` = mutations + business logic
- `mappers` = DB → DTO
- `types` = public contracts
- `helpers` = pure domain helpers only

UI must never consume Prisma models directly.

---

## NEXT.JS RULES

- Server Components by default
- Client Components only when required
- `app/` orchestrates, but does not contain business logic
- Server Actions for mutations only
- reads happen on server through queries

---

## ADMIN ROUTING PATTERN

Admin pages should use parallel routes / slots.

Default pattern:

```txt
app/(admin)/<feature>/
  page.tsx
  @list/
  @details/
  @editor/
```

Intent:

- `@list` = list view
- `@details` = selected item details
- `@editor` = create / edit flow

Rules:

- slots are independent
- no shared client state between slots
- page orchestrates only

---

## UI RULES

- shadcn/ui via MCP only
- domain UI in `components/admin/<feature>/`
- no business logic in UI
- use project tokens from `global.css` and `styles/**`
- never hardcode design tokens when project tokens exist

---

## DESIGN / UX TARGET

Admin UI must be:

- simple
- explicit
- readable
- non-technical
- consistent across features

Always prefer:

- obvious primary actions
- safe destructive flows
- clear labels
- predictable layouts

---

## DOMAIN CONSTRAINTS

- mono-store strict
- runtime assumes `storeId` is present on business entities
- optional domains are enabled by deployment/project choice, not DB runtime flags

---

## CONSISTENCY RULE

When building a new feature:

- reuse the same folder conventions
- reuse the same slot structure when relevant
- reuse the same mapper / DTO discipline
- reuse existing UI patterns instead of inventing new ones

---

## MEMORY USAGE RULE

This memory stores:

- stable architectural conventions
- repeatable runtime patterns
- feature-building rules

It must not store:

- temporary implementation state
- runtime code details that belong in files
- assumptions that are not revalidated against the repo
