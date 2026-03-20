---
name: project_v21_status
description: État réel de V21 au 2026-03-19 — lots réalisés, tailles réelles des fichiers, dossiers créés
type: project
---

V21 est la phase de modularisation interne de db/repositories/. Objectif : réduire les gros fichiers sans changer les contrats publics ni les chemins.

**Lots réalisés :**
- V21-1 : cadrage et audit (aucun code modifié)
- V21-2A : modularisation partielle de db/repositories/catalog/ — types/, queries/, helpers/ créés

**Lots non réalisés :** V21-2B, V21-3, V21-4A, V21-4B, V21-5, V21-final-state

**Tailles réelles des fichiers au 2026-03-19 :**
- order.repository.ts : 728 lignes (inchangé depuis le cadrage)
- admin-product.repository.ts : 592 lignes
- catalog.repository.ts : 570 lignes (réduit depuis 878 par V21-2A)
- guest-cart.repository.ts : 449 lignes
- admin-homepage.repository.ts : 425 lignes
- admin-category.repository.ts : 365 lignes
- admin-product-image.repository.ts : 345 lignes
- admin-product-variant.repository.ts : 303 lignes
- catalog.mappers.ts : 190 lignes
- payment.repository.ts : 167 lignes
- admin-blog.repository.ts : 220 lignes (NON mentionné dans les lots V21)
- order-email.repository.ts : 118 lignes
- admin-users.repository.ts : 59 lignes
- admin-media.repository.ts : 69 lignes

**Anomalie structurelle :** db/repositories/orders/ existe mais est vide (créé par anticipation, non documenté)

**Why:** V21-2A a posé la structure pilote sur catalog. Les lots suivants doivent reproduire ce pattern sur order, products et petits domaines.

**How to apply:** Avant tout lot V21, vérifier les tailles réelles de fichiers — elles peuvent avoir évolué depuis les chiffres figés dans la doc.
