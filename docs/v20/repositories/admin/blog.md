# Repository admin `blog`

## Rôle

`admin-blog.repository.ts` gère le back-office blog :

- listing admin
- détail admin
- création
- mise à jour
- changement de statut
- suppression

## Structure actuelle

Fichiers :

- `admin-blog.repository.ts`
- `admin-blog.types.ts`

Contrats publics :

- `AdminBlogPostSummary`
- `AdminBlogPostDetail`
- `CreateAdminBlogPostInput`
- `UpdateAdminBlogPostInput`
- `AdminBlogRepositoryError`

## Fonctions publiques actuelles

- `listAdminBlogPosts()`
- `findAdminBlogPostById(id)`
- `createAdminBlogPost(input)`
- `updateAdminBlogPost(input)`
- `toggleAdminBlogPostStatus(id)`
- `deleteAdminBlogPost(id)`

## Comportements importants

### Publication

Le domaine gère `published_at` explicitement :

- création en `published` : `published_at = now()`
- mise à jour en `published` : préserve la date existante si elle existe déjà
- retour en `draft` : `published_at = null`

### `hasContent`

`hasContent` n'est pas un champ stocké. Il est dérivé dans le mapper public.

### Erreurs publiques

Le repository re-mappe :

- `P2002` → `slug_taken`
- `P2003` → `blog_post_referenced`

## Points complexes réels

Le domaine reste relativement simple. Le seul comportement non trivial est la gestion stable de `published_at`.

## Limites actuelles

- le mapping et le remapping d'erreurs vivent encore dans le même fichier que la façade publique
- pas de séparation `queries` / `helpers`

## Lecture V20

`admin-blog` est un bon candidat pour rester compact.

Un éventuel découpage V20 ne devrait sortir que :

- les mappers privés
- le remapping d'erreurs

et seulement si cela améliore réellement la lisibilité.
