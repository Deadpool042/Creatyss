# V8-3 — Migration Composants Admin

## Objectif

Migrer les cinq composants admin qui mélangent encore des classes CSS legacy avec Tailwind. À l'issue de ce lot, ces composants n'ont plus la CSS legacy comme source de vérité pour leur rendu — ils sont conformes aux standards V7/V8 et dark compliant par construction.

## Prérequis

V8-1 terminé. Les tokens `--brand` et la couverture dark mode sont disponibles. V8-2 peut être en parallèle.

## Périmètre strict

**In scope :**

- `AdminProductCard` : migration hors `.store-card`, `.admin-product-card`, `.admin-chip`
- `AdminOrderCard` : migration hors `.admin-chip` pour les statuts
- `AdminBlogPostCard` : migration hors `.admin-chip`
- `AdminCategoryCard` : migration hors `.store-card`
- `AdminEmptyState` : migration hors `.empty-state`

**Out of scope :**

- `AdminFormField`, `AdminFormSection`, `AdminFormActions` — déjà conformes, ne pas toucher
- Ajout de nouvelles fonctionnalités aux composants (nouvelles actions, nouveaux champs)
- Modification de la logique de rendu ou des données affichées

## Ce que ce lot résout

### Le problème de la coexistence

Ces composants utilisent actuellement deux systèmes en tension : des classes CSS legacy issues de `styles/` et des classes Tailwind utilitaires. Cette coexistence rend le style difficile à comprendre et à corriger, et crée des surfaces dark mode incohérentes (les classes legacy ignorent les tokens dark, les classes Tailwind sémantiques les respectent).

### Composant `Badge`

Le composant `Badge` de shadcn (`components/ui/badge.tsx`) est la cible de remplacement pour toutes les utilisations de `.admin-chip`. Il propose des variants sémantiques (`default`, `secondary`, `destructive`, `outline`) et est dark compliant via les tokens shadcn.

Le choix du variant doit refléter la sémantique du contenu :

- Tag de catégorie, label neutre → `secondary` ou `outline`
- Statut actif / publié → `default`
- Statut erreur / annulé → `destructive`
- Statut brouillon / inactif → `outline` ou `secondary`

### Composant `Card`

Le composant `Card` de shadcn (`components/ui/card.tsx`) est la base de remplacement pour `.store-card`. Il utilise les tokens `--card` et `--card-foreground`, ce qui le rend dark compliant.

### `AdminEmptyState`

La classe `.empty-state` doit être remplacée par une structure Tailwind tokenisée. Le composant peut rester simple : un conteneur centré avec texte muted. Si une icône ou un bouton d'action est nécessaire, c'est dans le périmètre de ce lot uniquement si c'est requis pour supprimer la dépendance legacy — sinon, reporter en V8-4.

## Analyse préalable obligatoire

Avant d'implémenter, lire chaque composant cible pour inventorier précisément les classes legacy présentes. L'inventaire peut révéler des classes non listées ici.

```bash
grep -n "admin-chip\|store-card\|admin-product-card\|admin-order\|admin-blog\|admin-category\|empty-state" \
  components/admin/admin-product-card.tsx \
  components/admin/admin-order-card.tsx \
  components/admin/admin-blog-post-card.tsx \
  components/admin/admin-category-card.tsx \
  components/admin/admin-empty-state.tsx
```

## Critères de qualité

Un composant est considéré migré dans ce lot quand :

- aucune classe CSS legacy n'est la source de vérité pour son rendu visuel
- il utilise `Badge` pour les statuts et tags, `Card` pour la structure si applicable
- il est dark compliant : son rendu en dark mode repose sur des tokens, pas sur des valeurs codées
- typecheck passe sans nouvelle erreur

## Vérifications de fin de lot

```bash
# Vérifier que les classes legacy ne sont plus dans ces 5 fichiers
grep -n "admin-chip\|store-card\|admin-product-card\|empty-state" \
  components/admin/admin-product-card.tsx \
  components/admin/admin-order-card.tsx \
  components/admin/admin-blog-post-card.tsx \
  components/admin/admin-category-card.tsx \
  components/admin/admin-empty-state.tsx

pnpm run typecheck
pnpm exec playwright test --grep "admin"
```

Tester dark mode manuellement sur les pages liste concernées (produits, commandes, blog, catégories).

## Fichiers attendus modifiés

- `components/admin/admin-product-card.tsx`
- `components/admin/admin-order-card.tsx`
- `components/admin/admin-blog-post-card.tsx`
- `components/admin/admin-category-card.tsx`
- `components/admin/admin-empty-state.tsx`
