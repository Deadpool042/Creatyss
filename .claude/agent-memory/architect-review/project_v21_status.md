---
name: project_v21_status
description: État réel de V21 au 2026-03-20 — V21 TERMINÉ, structure réelle, dettes connues
type: project
---

V21 est ENTIÈREMENT TERMINÉ au 2026-03-20. Tous les lots V21-1 à V21-5 + final-state sont livrés.

**Why:** V21 visait la modularisation interne de db/repositories/ sans changer les contrats publics. Séquence : catalog → order → products → petits domaines.

**How to apply:** Toute demande de refactor db/ doit partir de cet état final figé. Aucun lot V21 n'est en cours. Une nouvelle version (V22 ou autre) serait nécessaire pour tout travail supplémentaire.

**Tailles réelles des façades au 2026-03-20 :**
- order.repository.ts : 166 lignes (réduit depuis 728)
- catalog/catalog.repository.ts : 221 lignes
- products/admin-product.repository.ts : 544 lignes
- products/admin-product-variant.repository.ts : 262 lignes
- products/admin-product-image.repository.ts : 302 lignes
- admin-category.repository.ts : 213 lignes
- admin-homepage.repository.ts : 167 lignes
- guest-cart.repository.ts : 271 lignes
- payment.repository.ts : 167 lignes (NO-GO V21)
- admin-blog.repository.ts : 220 lignes (NO-GO V21)
- order-email.repository.ts : 118 lignes (NO-GO V21)
- admin-users.repository.ts : 59 lignes (NO-GO V21)
- admin-media.repository.ts : 69 lignes (NO-GO V21)

**Dettes connues et gelées :**
1. AdminProductImageRepositoryError — constructeur sans `code` paramètre (hardcodé "variant_missing"). Gelé T-4.
2. transaction-guards.ts (admin-homepage) importe AdminHomepageRepositoryError depuis ../../admin-homepage.types (façade publique) — violation doctrine import interne.
3. guest-cart/helpers/mappers.ts et cart-builder.ts importent depuis ../../guest-cart.types (façade publique) — même violation.
4. ~~orders/types/public.ts importe OrderEmailEvent~~ — RÉSOLU au 2026-03-20. AdminOrderDetail repositionné dans order.types.ts (façade).
5. loadAdminProductDetailInTx — dupliqué avec findAdminProductById (~80 lignes identiques). Décision volontaire T-3 / complexité.
6. catalog.mappers.ts (190 lignes) non découpé — volontaire V21.
