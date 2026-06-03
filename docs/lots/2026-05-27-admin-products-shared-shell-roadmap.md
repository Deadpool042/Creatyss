# Lot 6 — Admin products shared page shell

## Objectif

Introduire un wrapper shared pour les pages produit admin afin d'unifier le shell, les breadcrumbs, la navigation de retour, le header et les actions standard, sans modifier le métier des modules déjà extraits.

---

## Périmètre

Inclus dans ce lot :

- création d'un wrapper shared pour les pages produit admin
- adoption de ce wrapper par `/edit` et les routes modules déjà créées
- unification des breadcrumbs, titres et actions header
- réduction de la duplication de shell dans les pages produit

---

## Hors périmètre

Explicitement exclus :

- modification du métier des formulaires
- refonte des queries
- refonte Prisma
- refonte globale du shell admin hors produit
- browser verification

---

## Invariants

- aucun changement métier
- aucun changement Prisma
- les routes existantes restent inchangées
- les formulaires et actions existants gardent leur comportement

---

## Plan d'exécution

1. créer un wrapper shared page produit
2. lui faire porter breadcrumbs, titre, description, actions standard
3. rebrancher `/edit` non archivé
4. rebrancher les routes modules produits
5. vérifier typecheck et lint

---

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`

---

## Critères de fin

- wrapper shared en place
- duplication de shell réduite sur les pages produit
- routes inchangées
- aucun changement métier

---

## Notes de livraison

- wrapper shared ajoute dans `features/admin/products/components/shared/product-module-page-shell.tsx`
- wrapper rebranche :
  - `/edit` non archive
  - `/media`
  - `/seo`
  - `/pricing`
  - `/availability`
  - `/inventory`
  - `/variants`
  - `/categories`
  - `/related`
- shell shared porte maintenant :
  - `AdminPageShell`
  - header produit
  - breadcrumbs coherents
  - action standard `nouvelle fiche produit`
  - navigation retour vers la liste
- etat archive conserve a part pour ne pas melanger la logique de fallback avec le wrapper nominal
- aucun changement metier, uniquement consolidation de presentation et de composition
