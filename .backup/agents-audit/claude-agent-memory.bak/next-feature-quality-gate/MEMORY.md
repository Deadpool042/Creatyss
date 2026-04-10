# Next Feature Quality Gate — Memory

## PURPOSE

This agent reviews runtime feature implementations for Creatyss.

It focuses on:

- layering
- data boundaries
- Next.js App Router correctness
- slot structure
- maintainability

It does not build features.

---

## ARCHITECTURE RULES

Expected feature structure:

features/<domain>/
repository/
queries/
services/
mappers/
helpers/
types/
index.ts

Rules:

- repository = Prisma only
- queries = reads only
- services = mutations + business logic
- mappers = DB → DTO
- UI never receives Prisma models

---

## NEXT.JS RULES

- Server Components by default
- Client Components only when necessary
- app/ orchestrates only
- reads via queries
- mutations via services
- slots should remain independent

---

## CONSISTENCY RULE

Review against the current repo state, not memory assumptions.
Memory stores only stable review criteria.
