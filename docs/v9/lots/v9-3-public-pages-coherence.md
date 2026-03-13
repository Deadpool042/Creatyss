# V9-3 — Cohérence des pages publiques

**Prérequis :** V9-1 complété

## Objectif

Vérifier et uniformiser les patterns structurels des pages publiques pour qu'ils soient conformes à la doctrine V9 et cohérents entre eux : en-têtes de page, sections, grilles de cartes, états vides, et feedback.

## Contexte

Après V9-1, les pages publiques utilisent un namespace CSS propre. Il reste à s'assurer que les patterns récurrents sont appliqués de façon homogène sur l'ensemble des routes publiques.

Ce lot ne change pas le contenu, les libellés, ni la logique. Il aligne la structure.

## Pages concernées

| Route | Priorité | Raison |
|-------|----------|--------|
| `/` | Haute | Première page visitée |
| `/boutique` | Haute | Page catalogue principale |
| `/boutique/[slug]` | Haute | Fiche produit, page transactionnelle |
| `/panier` | Haute | Parcours d'achat |
| `/checkout` | Haute | Parcours d'achat |
| `/checkout/confirmation/[reference]` | Haute | Fin de parcours |
| `/blog` | Moyenne | Page listant les articles |
| `/blog/[slug]` | Moyenne | Article individuel |

## Patterns à vérifier

### Pattern 1 — En-tête de page (`.page-header`)

Toute page principale doit ouvrir avec un bloc `.page-header` contenant au minimum :

```html
<div class="page-header">
  <div>
    <p class="eyebrow">Contexte court</p>
    <h1>Titre de la page</h1>
    <!-- optionnel : <p class="lead">Sous-titre</p> -->
  </div>
</div>
```

Vérifier que chaque page a bien ce bloc. Corriger les pages où l'en-tête est incomplet, absent, ou structurellement différent sans raison.

### Pattern 2 — Section (`.section`, `.section-header`)

Les sections de contenu utilisent `.section`. Quand une section a un titre visible et des actions associées (ex. : "Voir toute la boutique"), elle utilise `.section-header` :

```html
<div class="section-header">
  <div>
    <p class="eyebrow">...</p>
    <h2>...</h2>
  </div>
  <a class="link link-subtle" href="...">Action</a>
</div>
```

Vérifier la cohérence d'usage entre les pages.

### Pattern 3 — Grille de cartes (`.card-grid`, `.store-card`)

Les listes de produits, articles et catégories utilisent `.card-grid` comme conteneur et `.store-card` pour chaque élément. Vérifier la conformité entre boutique, blog et accueil.

Vérifier également les classes modificatrices utilisées dans `.store-card` (`.store-card-header`, `.store-card-badges`, `.store-card-badge`) pour qu'elles soient cohérentes entre boutique et accueil.

### Pattern 4 — État vide (`.empty-state`)

Chaque liste susceptible d'être vide expose un état vide selon ce pattern :

```html
<div class="empty-state">
  <p class="eyebrow">Contexte</p>
  <h2>Titre descriptif</h2>
  <p class="card-copy">Message d'aide</p>
  <!-- optionnel : lien ou bouton -->
</div>
```

Vérifier la présence et la conformité de ce pattern sur toutes les pages listant des données (boutique, blog, panier, checkout).

### Pattern 5 — Feedback (`.notice-success`, `.notice-error`)

Après V9-1, ces classes remplacent `.admin-success` et `.admin-alert`. Vérifier :

- `.notice-error` a bien `role="alert"` sur toutes les occurrences.
- `.notice-success` est utilisé de façon cohérente (message de confirmation, pas de titre).
- Les messages de feedback dans la fiche produit, le panier, le checkout et la confirmation sont bien encadrés dans ces classes.

## Travail attendu

Pour chaque page de la liste :

1. Lire le JSX actuel.
2. Identifier les déviations par rapport aux cinq patterns documentés.
3. Corriger sans changer les textes, les libellés, le comportement ni la logique.

Les corrections attendues sont principalement :
- Ajouter un `.eyebrow` manquant dans un `.page-header`.
- Ajouter un `role="alert"` manquant sur un `.notice-error`.
- Aligner un état vide qui s'écarterait du pattern (ex. : titre `h2` au lieu de `h2`, ou classe manquante).
- Harmoniser un `.section-header` dont la structure serait légèrement différente d'une page à l'autre.

## Ce que ce lot ne fait pas

- Il ne change pas les textes (libellés, messages d'erreur, contenus éditoriaux).
- Il n'ajoute pas de nouvelles sections, de nouveaux contenus ni de nouvelles features.
- Il ne modifie pas la logique métier (requêtes DB, Server Actions, validation).
- Il ne touche pas à l'admin.
- Il ne crée pas de nouveaux composants React : les corrections sont des ajustements de balisage dans les pages existantes.

## Critères de clôture

- Chaque page publique prioritaire a un `.page-header` avec `.eyebrow` et `h1`.
- Les états vides suivent le pattern documenté (`.empty-state` avec `.eyebrow`, `h2`, `.card-copy`).
- Toutes les occurrences de `.notice-error` ont `role="alert"`.
- `pnpm run typecheck` passe.
- Vérification visuelle sur les huit routes listées : aucune régression.
