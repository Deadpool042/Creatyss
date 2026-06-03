# Checklist lot — admin products runtime access

## Préflight

- [x] relire `AGENTS.md`
- [x] relire la roadmap `2026-05-27-admin-products-runtime-access-roadmap.md`
- [x] confirmer que le lot reste sans changement métier

---

## Audit d'entrée

- [x] identifier le flux auth admin existant
- [x] identifier le flux capabilities/feature flags existant
- [x] vérifier l'absence actuelle de policy produit dédiée

---

## Exécution

- [x] créer la policy runtime produit
- [x] créer la lecture effective des feature flags produit
- [x] brancher le layout produit sur le contexte admin runtime
- [x] faire évoluer le resolver produit

---

## Vérifications

- [x] lancer `pnpm run typecheck`
- [x] lancer `pnpm run lint`

---

## Livraison

- [x] compléter la roadmap
