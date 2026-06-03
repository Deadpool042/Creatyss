# Checklist lot — admin products runtime consolidation

## Préflight

- [x] relire `AGENTS.md`
- [x] relire la roadmap `2026-05-27-admin-products-runtime-consolidation-roadmap.md`
- [x] confirmer que le lot reste sans changement métier

---

## Audit d'entrée

- [x] identifier les pages encore branchées sur `readAdminProductEditorBySlug`
- [x] identifier les données minimales réellement requises par route
- [x] vérifier les patterns repo pour `featureFlags` et `capabilities`

---

## Exécution

- [x] créer la query légère de contexte produit
- [x] rebrancher le layout `[slug]`
- [x] rebrancher `pricing`
- [x] rebrancher `availability`
- [x] rebrancher `inventory`
- [x] rebrancher `media`
- [x] rebrancher `variants`
- [x] durcir `product-module-capabilities`

---

## Vérifications

- [x] lancer `pnpm run typecheck`
- [x] lancer `pnpm run lint`

---

## Livraison

- [x] compléter la roadmap
