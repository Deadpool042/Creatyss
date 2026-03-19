# V10-4 — Blog + categories list views

## Prérequis

V10-2 terminé : `components/ui/table.tsx` présent dans le projet.

## Objectif

Migrer la page articles de blog vers une Table simple shadcn. Maintenir la page catégories inchangée. Ce lot illustre délibérément la doctrine V10 : **on ne met pas de DataTable partout**.

## Lot 1 — Page articles de blog

### Décision : Table simple (pas DataTable)

La page articles ne justifie pas TanStack Table :

- Volume faible (< 50 articles sur la majorité des boutiques)
- Pas de filtre multi-critères nécessaire
- Pas de pagination dans l'immédiat
- L'action principale est d'accéder à la fiche article, pas de comparer des lignes

Une Table simple shadcn (`Table`, `TableHeader`, `TableRow`, `TableCell`) est suffisante, plus rapide à implémenter, et ne crée pas de dette technique inutile.

### État avant

`app/admin/blog/page.tsx` : grille de cartes `AdminBlogPostCard`.

### État cible

Table HTML rendue côté serveur avec les composants shadcn Table. Pas de `"use client"`, pas de `ColumnDef`, pas de `useReactTable`.

### Colonnes

| Colonne | Source             | Notes                        |
| ------- | ------------------ | ---------------------------- |
| Titre   | `post.title`       | Lien vers `/admin/blog/[id]` |
| Slug    | `post.slug`        |                              |
| Statut  | `post.isPublished` | "Publié" / "Brouillon"       |
| Date    | `post.publishedAt` | Formatée, ou "—" si nulle    |
| Actions | —                  | Lien "Modifier"              |

### Structure cible

```tsx
// app/admin/blog/page.tsx (structure cible)
import Link from "next/link";
import { findAdminBlogPostList } from "@/db/repositories/blog.repository";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const dateFormatter = new Intl.DateTimeFormat("fr-FR", { dateStyle: "short" });

export default async function AdminBlogPage() {
  const posts = await findAdminBlogPostList();

  return (
    <div className="admin-page">
      {/* header et actions existants conservés */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titre</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Publié le</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <Link href={`/admin/blog/${post.id}`} className="link">
                  {post.title}
                </Link>
              </TableCell>
              <TableCell className="form-note">{post.slug}</TableCell>
              <TableCell>{post.isPublished ? "Publié" : "Brouillon"}</TableCell>
              <TableCell>
                {post.publishedAt ? dateFormatter.format(new Date(post.publishedAt)) : "—"}
              </TableCell>
              <TableCell>
                <Link href={`/admin/blog/${post.id}`} className="link link-subtle">
                  Modifier
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {posts.length === 0 ? (
        <div className="admin-empty-state">{/* empty state existant conservé */}</div>
      ) : null}
    </div>
  );
}
```

### Type de données

Vérifier si le repository blog expose déjà une fonction de liste. Adapter si nécessaire :

```typescript
// db/repositories/blog.repository.ts
export async function findAdminBlogPostList(): Promise<AdminBlogPostListItem[]>;

type AdminBlogPostListItem = {
  id: string;
  slug: string;
  title: string;
  isPublished: boolean;
  publishedAt: Date | null;
};
```

---

## Lot 2 — Page catégories

### Décision : inchangée

La page catégories reste avec sa grille de cartes `AdminCategoryCard`.

Justification :

- Volume maximal prévisible : < 20 catégories
- Pas de filtre ni de tri nécessaire
- Les cartes permettent une lecture visuelle rapide (nom + image)
- Aucun gain opérationnel à migrer vers une table

Cette décision est explicite. Elle n'est pas un oubli ni un défaut de motivation — c'est le bon outil pour ce volume et ce type de contenu.

**Aucune modification à apporter à `app/admin/categories/page.tsx`.**

---

## Travail à réaliser

### Articles de blog

1. Vérifier/adapter le type `AdminBlogPostListItem` dans le repository
2. Modifier `app/admin/blog/page.tsx` pour utiliser les composants `Table*`
3. Supprimer `AdminBlogPostCard` si plus utilisée ailleurs (vérifier avec grep)
4. **Ne pas** importer `@tanstack/react-table` dans ce fichier

### Catégories

- Aucune modification requise

### Vérifications

- `pnpm run typecheck`
- Navigation manuelle vers `/admin/blog`
- Vérifier que les liens vers les fiches articles fonctionnent
- Vérifier l'affichage du statut publié/brouillon
- Vérifier l'empty state si aucun article

## Risques et garde-fous

- **`AdminBlogPostCard`** : vérifier avec grep avant de supprimer — elle peut être utilisée sur la page de liste ou ailleurs.
- **Repository blog** : la fonction de liste peut ne pas exister ou retourner un type incompatible. Lire le repository avant d'implémenter.
- **Pas de TanStack** : si quelqu'un propose d'ajouter `useReactTable` pour la Table blog "au cas où", refuser. Ce n'est pas justifié.

## Non-inclus dans ce lot

- Filtre ou tri sur les articles
- Pagination des articles
- Modification de la page catégories
- Actions bulk sur les articles
