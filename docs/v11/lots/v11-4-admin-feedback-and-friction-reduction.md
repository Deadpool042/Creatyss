# V11-4 — Feedback admin et réduction de friction résiduelle

## Prérequis

V11-1 terminé : patterns `AlertDialog` et `DropdownMenu` en place.
V11-2 et V11-3 peuvent être parallèles ou terminés — V11-4 est indépendant des commandes et produits.

## Objectif

Compléter V11 sur deux axes :
1. **Blog** — exposer un toggle de statut depuis la Table (même logique que V11-3 pour les produits)
2. **Feedback** — documenter et stabiliser le pattern de feedback admin pour éviter la divergence à l'avenir

## Lot 1 — Blog : toggle de statut depuis la Table

### État actuel

`app/admin/(protected)/blog/page.tsx` — Table simple Server Component. Colonne "Actions" : lien "Modifier l'article". Publier ou dépublier un article nécessite d'aller sur la fiche, modifier le select de statut, et sauvegarder.

### Cible

Remplacer la colonne "Actions" par deux éléments :
- Lien "Modifier l'article" (conservé)
- Bouton "Publier" ou "Passer en brouillon" selon le statut actuel

La Table blog est un Server Component rendu côté serveur — pas de DataTable, pas de `"use client"`. L'action de toggle doit donc être un formulaire HTML simple dans une cellule, ce qui est compatible avec un Server Component.

### Structure cible

Pas de nouveau Client Component nécessaire si l'on évite l'AlertDialog (le toggle de statut d'un article est une action sûre et réversible, pas destructive).

```tsx
// Dans app/admin/(protected)/blog/page.tsx
// Cellule Actions — remplace la cellule simple actuelle

<TableCell>
  <div className="flex items-center gap-3">
    <Link
      className="text-sm font-medium text-foreground/80 underline-offset-4 transition-colors hover:text-foreground hover:underline"
      href={`/admin/blog/${post.id}`}>
      Modifier l&apos;article
    </Link>

    <form action={toggleBlogPostStatusAction}>
      <input type="hidden" name="postId" value={post.id} />
      <button
        className="text-sm text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline"
        type="submit">
        {post.status === "published" ? "Passer en brouillon" : "Publier"}
      </button>
    </form>
  </div>
</TableCell>
```

### Nouveau Server Action : `toggleBlogPostStatusAction`

```typescript
// features/admin/blog/actions/toggle-blog-post-status-action.ts
"use server";

// Entrée : postId (FormData)
// Comportement : lit le statut actuel, bascule draft↔published
//   Si passage à published et published_at est null : définit published_at = now()
//   Si passage à draft : met published_at à null (cohérent avec updateAdminBlogPost)
// Sortie : redirect vers /admin/blog/${postId}?status=updated
//          ou /admin/blog?error=missing_blog_post si article introuvable

export async function toggleBlogPostStatusAction(formData: FormData): Promise<void>
```

La logique de `published_at` respecte le comportement existant de `updateAdminBlogPost` :
- Premier passage à published → `published_at = now()`
- Republication après dépublication → `published_at` ne change pas (`coalesce` existant)
- Passage à draft → `published_at = null`

### Repository

Ajouter dans `admin-blog.repository.ts` :

```typescript
export async function toggleAdminBlogPostStatus(
  id: string
): Promise<"draft" | "published" | null>
```

Même principe que `toggleAdminProductStatus` en V11-3 — action légère sans charger le formulaire complet.

### Pas d'AlertDialog pour le toggle blog

Le toggle de statut d'un article est **réversible** (on peut republier après avoir dépublié). Il ne détruit pas de données. Un formulaire direct avec feedback via redirect est suffisant.

La suppression d'un article, en revanche, pourrait mériter un AlertDialog si elle était exposée depuis la liste. Elle ne l'est pas dans ce lot — la suppression reste sur la fiche uniquement.

## Lot 2 — Revue et documentation du pattern de feedback

### Pattern actuel

Le feedback admin repose sur des redirects avec searchParams. Ce pattern est utilisé uniformément depuis les origines du projet :

```
/admin/orders/${id}?order_status=updated
/admin/products?status=deleted
/admin/blog?error=missing_blog_post
```

Chaque page décode ces paramètres dans sa fonction `getStatusMessage` / `getErrorMessage` et affiche un `<Notice tone="success|alert">`.

**Forces du pattern actuel :**
- Server-safe : aucune hydratation client nécessaire
- Persistant au refresh : le paramètre reste dans l'URL jusqu'à navigation
- Simple à tester (e2e : `expect(page.getByText("..."))`toBeVisible())
- Cohérent avec l'architecture Server Components

**Limites du pattern actuel :**
- Invisible si l'utilisateur navigue directement sur une URL avec paramètre sans context
- Peu adapté pour des feedbacks multiples simultanés (rare en contexte Creatyss)
- Légèrement verbeux côté paramètre URL (mais acceptable)

### Rôle de Sonner (toast)

`sonner.tsx` est installé dans `components/ui/`. Il n'est actuellement utilisé nulle part dans l'admin.

**Sonner est approprié pour :**
- Une action rapide depuis la liste dont le résultat est secondaire
- Un feedback "léger" qui ne nécessite pas de persister dans l'URL
- Exemple : toggle de statut depuis la liste — si l'admin le fait en passant, un toast discret est plus fluide qu'un redirect vers la fiche

**Sonner est inapproprié pour :**
- Les actions critiques (annulation de commande, suppression)
- Les erreurs importantes qui méritent l'attention
- Les succès dont l'admin a besoin de voir le résultat détaillé sur la fiche

**Décision V11 :**

Le pattern `redirect + searchParams + Notice` reste le standard par défaut. Sonner peut être introduit **optionnellement** dans V11-4 pour les toggles de statut depuis les listes, si l'équipe juge cela plus confortable. Ce n'est pas une obligation — sa valeur dépend de la fréquence d'utilisation.

Si Sonner est introduit, il nécessite :
- Un `<Toaster />` dans le layout admin (`app/admin/layout.tsx`)
- Un pattern de déclenchement depuis un Client Component (le toast ne peut pas être déclenché depuis un Server Action directement)

Ce dernier point est la principale complexité : les toggles de statut sont aujourd'hui des Server Actions qui redirigent. Pour afficher un toast à la place du redirect, il faut soit :
- Conserver le redirect et afficher le toast à l'arrivée (lecture d'un searchParam dans un Client Component)
- Gérer l'action côté client avec `startTransition` + `useActionState` (plus complexe)

La première approche (redirect + toast déclenché à la lecture d'un searchParam) est compatible avec l'architecture actuelle sans sur-ingénierie.

### Règles documentées

À la clôture de V11, ces règles sont la référence pour les équipes futures :

| Cas | Pattern recommandé |
|-----|--------------------|
| Succès d'action critique (annulation, suppression) | `redirect + searchParams + Notice` sur la page cible |
| Erreur d'action | `redirect + searchParams + Notice` sur la page cible |
| Succès d'action sûre et fréquente depuis liste | `redirect + searchParams + Notice` ou `Sonner` optionnel |
| Confirmation avant action destructive | `AlertDialog` — toujours |

## Travail à réaliser

### Blog

1. Créer `toggle-blog-post-status-action.ts` dans `features/admin/blog/actions/`
2. Ajouter `toggleAdminBlogPostStatus` dans `admin-blog.repository.ts`
3. Modifier `app/admin/(protected)/blog/page.tsx` — ajouter le bouton toggle dans la cellule Actions
4. Décider si le toggle redirige vers la fiche ou reste sur la liste (recommandé : liste avec notice)

### Feedback

5. Documenter les règles de feedback dans ce fichier (fait ci-dessus)
6. Décider si Sonner est introduit dans ce lot ou reporté — et agir en conséquence
7. Si Sonner est introduit : ajouter `<Toaster />` dans `app/admin/layout.tsx`

## Vérifications

- `pnpm run typecheck`
- `pnpm exec playwright test tests/e2e/admin/blog.spec.ts`
- Navigation manuelle `/admin/blog` :
  - Article publié : colonne Actions expose "Modifier l'article" + "Passer en brouillon"
  - Article brouillon : colonne Actions expose "Modifier l'article" + "Publier"
  - Le toggle met à jour le badge dans la table après redirect
- Navigation manuelle : vérifier que `<Toaster />` ne produit pas de double feedback

## Non-inclus dans ce lot

- Suppression d'article depuis la liste (reste sur la fiche)
- Pagination blog
- Filtres ou tri sur la Table blog
- Dashboard V10 (inchangé)
- Modification des pages détail (hors corrections V11-1)
