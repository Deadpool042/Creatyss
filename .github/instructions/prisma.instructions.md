---
applyTo: "prisma/**/*.prisma,prisma/**/*.ts,src/generated/prisma/**/*.ts,src/generated/prisma/**/*.d.ts"
---

# Prisma and schema instructions

- Respect the canonical taxonomy under `prisma/core`, `prisma/optional`, `prisma/cross-cutting`, and `prisma/satellites`.
- Each Prisma model, enum, or type must have a single owner.
- Do not keep empty `.prisma` files.
- Use explicit migrations for schema changes.
- Preserve clear names, stable relations, useful indexes, unique slugs when needed, and systematic timestamps.
- Do not delete tables, columns, constraints, or indexes silently.
- Align schema work with the current doctrine in `AGENTS.md` and `docs/architecture/**`.
