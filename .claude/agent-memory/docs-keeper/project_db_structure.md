---
name: Current db/repositories structure post-V21
description: The real structure of db/repositories after V21 — diverges from V21 doc file paths
type: project
---

The actual `db/repositories/` structure has evolved significantly beyond what V21 docs describe. Key facts as of 2026-03-22:

- Every domain has a dedicated top-level folder in `db/repositories/<domain>/`
- No files exist at the `db/repositories/` root level (no flat `*.repository.ts` at root)
- `orders/` contains `order.repository.ts` + `order.types.ts` as public facades (matches V21 intent)
- `products/` is heavily restructured: `admin/product/`, `admin/variant/`, `admin/image/`, `admin/deliverable/`, `admin/pattern/`, `public/`, with shared `helpers/`, `queries/`, `types/`
- `catalog/` under products is an empty placeholder directory
- `categories/` is a top-level domain with its own repositories (`category.repository.ts`, `admin-category.repository.ts`)
- `cart/` has sub-domains: `core/`, `guest/`, `customer/`, `checkout/`, `discounts/`, `pricing/`, `shipping/`, `taxation/`, `merge/`, `capabilities/`
- `users/` includes `role.repository.ts` and `admin-user.repository.ts`
- `email/` includes `newsletter.repository.ts`, `email-template.repository.ts`, `order-email.repository.ts`
- `auth` has a Prisma schema (`prisma/auth.prisma`) but no repository folder in `db/repositories/` yet
- Many placeholder empty dirs: `products/catalog/`, `products/categories/`, `products/images/`, `products/variants/`, `products/deliverables/`, `products/publication/`, `users/accounts/`

**Why:** The refactor went further than V21 scope — V21 docs reference `admin-product.repository.ts`, `catalog.repository.ts` which no longer exist at those paths.

**How to apply:** When documenting db/ structure, always verify actual file paths. V21 docs are historical records of a refactoring process, not the current state.
