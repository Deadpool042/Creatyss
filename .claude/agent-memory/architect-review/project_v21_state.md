---
name: v21_state
description: État réel du repository après V21 — structure db/repositories/, dettes connues, écarts doctrine
type: project
---

V21 est entièrement terminé. Tous les lots (V21-1 à V21-5 + final-state) sont livrés et documentés.

**Why:** V21 visait la modularisation interne de db/repositories/ sans changer les contrats publics. Séquence : catalog → order → products → petits domaines.

**How to apply:** Toute demande de refactor db/ doit partir de cet état final figé. Aucun lot V21 n'est en cours.

## Structure réelle après V21

Domaines modularisés (sous-dossiers internes) :
- catalog/ : types/, queries/ (5 fichiers), helpers/ (3 fichiers), catalog.mappers.ts toujours plat
- orders/ : types/internal.ts + types/public.ts, queries/, helpers/ (3 fichiers)
- products/ : types/tx-client.ts + product-type-row.ts, queries/ (4 fichiers), helpers/ (4 fichiers)
- admin-category/ : queries/, helpers/ (façade .repository.ts reste plat à la racine)
- admin-homepage/ : types/tx.ts, queries/ (2), helpers/ (2)
- guest-cart/ : helpers/ (3 fichiers, pas de types/ ni queries/)

Domaines plats (NO-GO V21) :
- payment, order-email, admin-blog, admin-users, admin-media

## Dettes connues et gelées

1. AdminProductImageRepositoryError — constructeur sans `code` paramètre (code hardcodé à "variant_missing"), incohérent avec les autres error classes du domaine. Gelé T-4 V21.
2. transaction-guards.ts (admin-homepage) importe AdminHomepageRepositoryError depuis la façade publique ../../admin-homepage.types — violation doctrine V21 (import interne depuis façade publique). Toléré dans V21 car error class non dupliquée.
3. orders/types/public.ts importe OrderEmailEvent depuis @/db/repositories/order-email.types — couplage inter-domaine dans un fichier de types internes.
4. catalog.mappers.ts (190 lignes) non touché dans V21 — volontaire mais reste dense.
5. loadAdminProductDetailInTx (admin-product.repository.ts) — logique complexe en façade, dupliquée avec findAdminProductById (même corps ~80 lignes).
6. guest-cart helpers importent depuis ../../guest-cart.types (façade publique) — même pattern violation que admin-homepage.
7. isValidNumericId dupliqué dans 5+ fichiers (T-1 assumé).

## Tailles des façades après V21

- order.repository.ts : 166 lignes (réduit depuis 728)
- catalog/catalog.repository.ts : 221 lignes
- products/admin-product.repository.ts : 544 lignes
- products/admin-product-variant.repository.ts : 262 lignes
- products/admin-product-image.repository.ts : 302 lignes
- admin-category.repository.ts : 213 lignes
- admin-homepage.repository.ts : 167 lignes
- guest-cart.repository.ts : 271 lignes
