# Roadmap — Admin pilotage & vues de données (V10)

## État actuel des pages admin (avant V10)

### Dashboard — `app/admin/page.tsx`

Actuellement : 2 boutons de navigation (Produits, Commandes). Aucune donnée opérationnelle. Page fonctionnelle mais vide de sens.

| Signal attendu          | État actuel | Lot   |
| ----------------------- | ----------- | ----- |
| Commandes en attente    | Absent      | V10-1 |
| Paiements non confirmés | Absent      | V10-1 |
| Stocks bas              | Absent      | V10-1 |
| Total commandes du mois | Absent      | V10-1 |

### Page commandes — `app/admin/commandes/page.tsx`

Actuellement : grille de cartes `AdminOrderCard`. Pas de tri, pas de filtre.

| Besoin                     | État actuel | Lot   |
| -------------------------- | ----------- | ----- |
| Vue tabulaire dense        | Absent      | V10-3 |
| Filtre par statut commande | Absent      | V10-3 |
| Filtre par statut paiement | Absent      | V10-3 |
| Tri par date               | Absent      | V10-3 |
| Pagination                 | Absent      | V10-3 |

### Page produits — `app/admin/produits/page.tsx`

Actuellement : grille de cartes `AdminProductCard`. Filtre par catégorie présent (searchParams).

| Besoin               | État actuel                   | Lot       |
| -------------------- | ----------------------------- | --------- |
| Vue tabulaire dense  | Absent                        | V10-3     |
| Filtre par catégorie | Présent (searchParams)        | Conserver |
| Tri par nom          | Absent                        | V10-3     |
| Tri par prix         | Absent                        | V10-3     |
| Indicateur stock     | Présent dans AdminProductCard | Migrer    |

### Page articles — `app/admin/blog/page.tsx`

Actuellement : grille de cartes `AdminBlogPostCard`.

| Besoin               | État actuel | Lot   |
| -------------------- | ----------- | ----- |
| Vue tabulaire légère | Absent      | V10-4 |
| Filtre statut publié | Absent      | V10-4 |

### Page catégories — `app/admin/categories/page.tsx`

Actuellement : grille de cartes `AdminCategoryCard`. Volume très faible (< 20 items).

**Décision : inchangée en V10.** Les cartes sont suffisantes pour ce volume.

## Socle technique requis

### Composants à ajouter

```
components/ui/
├── table.tsx           ← shadcn add table (généré)
└── data-table.tsx      ← wrapper TanStack (à écrire)
```

### Dépendances à installer

```bash
npx shadcn@latest add table
pnpm add @tanstack/react-table
```

### Fichiers `columns.tsx` à créer

```
features/orders/columns.tsx      ← ColumnDef<AdminOrder>[]
features/products/columns.tsx    ← ColumnDef<AdminProduct>[]
features/blog/columns.tsx        ← (optionnel — Table simple, pas TanStack)
```

## Séquence des lots

```
V10-1  Dashboard foundation         ─── (standalone)
V10-2  Table pattern foundation     ─── (standalone)
         │
         ├── V10-3  Orders + products list views
         └── V10-4  Blog + categories list views
```

### Lot V10-1 — Dashboard foundation

- Nouvelles requêtes DB (ou réutilisation des repositories existants)
- Composants de signal sur le dashboard
- Aucune dépendance sur V10-2

### Lot V10-2 — Table pattern foundation

- Installation `table.tsx` via CLI
- Installation `@tanstack/react-table`
- Écriture de `data-table.tsx` générique
- Aucune page migrée dans ce lot — uniquement le socle

### Lot V10-3 — Orders + products list views

- Migration page commandes : DataTable + `columns.tsx` commandes
- Migration page produits : DataTable + `columns.tsx` produits
- Suppression des cartes correspondantes ou cohabitation temporaire

### Lot V10-4 — Blog + categories list views

- Migration page articles : Table simple shadcn (pas TanStack)
- Page catégories : aucune modification
- Suppression de `AdminBlogPostCard` si plus utilisée

## Critères de clôture V10

- [ ] Dashboard : au moins 3 signaux opérationnels avec données réelles
- [ ] `components/ui/table.tsx` et `components/ui/data-table.tsx` présents
- [ ] Page commandes en DataTable avec filtre statut
- [ ] Page produits en DataTable avec tri nom/prix
- [ ] Page articles en Table simple
- [ ] Page catégories inchangée
- [ ] `pnpm run typecheck` passe sur tous les fichiers modifiés
- [ ] Tests e2e admin passent (si existants)
