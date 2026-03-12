# V6 — Migration Tailwind/shadcn admin

## Objectif

Ce document fixe les règles d'usage issues des pilotes Tailwind/shadcn conduits sur les pages admin V6.

Il sert de référence pour tous les lots qui étendent la migration à de nouvelles pages.

## Composants admis dans la migration

Seuls deux composants shadcn sont introduits à ce stade :

- `Button` — `components/ui/button.tsx`
- `Card` — `components/ui/card.tsx`

Aucun autre composant shadcn ne doit être introduit sans demande explicite et plan validé.

## Composants maison conservés

Ces composants ne sont pas migrés vers shadcn. Ils restent intacts sur toutes les pages :

- `PageHeader` — `components/ui/page-header.tsx`
- `Notice` — `components/ui/notice.tsx`
- `SectionIntro` — `components/ui/section-intro.tsx`

## Règle Button

Remplacer `<button className="[classes existantes]" type="submit">` par `<Button className="[classes existantes]" type="submit">`.

- Conserver **toutes** les classes CSS existantes sur le composant `Button`.
- Ne pas substituer par un variant shadcn (`variant="outline"`, `variant="default"`, etc.).
- Les classes CSS existantes (`.button`, `.admin-danger-button`, etc.) priment sur les utilitaires Tailwind du composant via la cascade — le rendu visuel est préservé.
- Conserver strictement tous les autres attributs du bouton d'origine (`type`, `name`, `disabled`, etc.).

**Cas hors périmètre d'un lot :**

- Les `<button>` à l'intérieur de boucles `.map()` sur des zones métier sensibles (déclinaisons, images) sont migrés séparément, dans un lot dédié.
- Les `<Link>` avec une classe `.button` ne sont pas des `<button>` — ne pas les remplacer par `<Button>`.

## Règle Card

`Card` peut être utilisé dans deux modes :

**Mode 1 — migration d'un élément existant avec classe `.store-card`**
Remplacer `<div className="store-card [autres-classes]">` par `<Card className="store-card [autres-classes]">`.
Conserver toutes les classes existantes. Les styles CSS priment via la cascade.

**Mode 2 — élément conçu proprement avec Tailwind**
`<Card className="p-5 grid gap-3 content-start">` — utilitaires Tailwind purs, sans classe CSS existante.
Valide uniquement pour les éléments construits de zéro dans un lot, pas pour migrer un existant.

## Règle balises sémantiques

Ne pas remplacer une balise HTML sémantique par `<Card>` si elle porte une sémantique utile.

- `<article>` : rôle ARIA implicite "article". Ciblé par `getByRole("article")` dans les tests e2e. **Conserver.**
- `<section>` : regroupe des champs de formulaire ou des zones logiques. **Conserver si doute.**
- `<aside>` : contenu complémentaire. **Conserver.**

Lorsque le doute existe sur une `<section>`, garder la balise et ne pas imbriquer `<Card>` à l'intérieur — cela ajouterait un double contour visuel non souhaité.

## Règle globals.css

Ne pas modifier `app/globals.css` dans le cadre de la migration Tailwind/shadcn, sauf nécessité stricte déjà prouvée et explicitement validée.

Toutes les classes existantes (`.button`, `.store-card`, `.admin-homepage-section`, etc.) restent définies et disponibles.

## État des pages migrées

### `app/admin/(protected)/media/page.tsx`

| Élément | Avant | Après |
|---|---|---|
| Section upload | `<section className="store-card admin-upload-card">` | `<Card className="store-card admin-upload-card">` |
| Cards de la grille médias | construites avec Tailwind | `<Card className="p-5 grid gap-3 content-start">` |
| Bouton upload | `<button className="button">` | `<Button className="button">` |

### `app/admin/(protected)/homepage/page.tsx`

| Élément | Avant | Après |
|---|---|---|
| Items produits/catégories/articles | `<div className="store-card admin-homepage-option">` | `<Card className="store-card admin-homepage-option">` |
| Bouton enregistrement | `<button className="button">` | `<Button className="button">` |
| 5 `<section className="admin-homepage-section">` | conservées | conservées (sémantique de groupement de champs) |

### `app/admin/(protected)/orders/[id]/page.tsx`

| Élément | Avant | Après |
|---|---|---|
| Bouton "Marquer comme expédiée" | `<button className="button">` | `<Button className="button">` |
| Bouton de transition (conditionnel) | `<button className="button [admin-danger-button]">` | `<Button className="button [admin-danger-button]">` |
| 8 `<article className="store-card checkout-line">` | conservés | conservés (`getByRole("article")` dans les tests) |

### `app/admin/(protected)/products/[id]/page.tsx`

| Élément | Avant | Après |
|---|---|---|
| Bouton "Enregistrer le produit" | `<button className="button">` | `<Button className="button">` |
| Bouton "Enregistrer les informations de vente" | `<button className="button">` | `<Button className="button">` |
| Bouton "Supprimer le produit" | `<button className="button admin-danger-button">` | `<Button className="button admin-danger-button">` |
| `<article>` (variant cards, image cards) | conservés | conservés (`getByRole("article")` dans les tests) |
| Boutons dans `.map()` (déclinaisons, images) | non migrés | hors périmètre — lot dédié à prévoir |

### `app/admin/(protected)/orders/page.tsx`

Lot de cohérence UI — `Button` et `Card` ne sont pas migrés sur cette page.

| Élément | Avant | Après |
|---|---|---|
| Header inline | `<div className="page-header">` + HTML manuel | `<PageHeader>` (composant maison) |
| Alerte inline | `<p className="admin-alert">` | `<Notice tone="alert">` (composant maison) |
| `<article className="store-card">` dans `.map()` | conservé | conservé — sémantique `article` utile, `getByRole("article")` ciblé par `orders.spec.ts` |
| `Button` | — | non applicable — aucun `<button>` dans cette page |
| `Card` | — | non applicable — le seul `store-card` est un `<article>`, préservé |

## Éléments délibérément hors périmètre à ce stade

- Boutons dans les boucles `.map()` sur les déclinaisons et les images produit (`products/[id]/page.tsx`)
- Pages non encore touchées : `/admin/categories`, `/admin/products` (liste), `/admin/blog`, `/admin/products/new`
- `<article className="store-card">` sur `orders/page.tsx` — sémantique article préservée, `getByRole("article")` dépendant dans les tests
- `<Link>` stylés avec `.button` (ex : "Retour à la liste")
