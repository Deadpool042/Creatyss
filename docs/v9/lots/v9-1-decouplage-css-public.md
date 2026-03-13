# V9-1 — Découplage CSS public/admin

**Prérequis :** aucun
**Peut aller en parallèle de :** V9-2

## Objectif

Remplacer toutes les classes CSS préfixées `admin-*` utilisées dans les pages publiques par des classes propres au namespace public. Créer les définitions CSS correspondantes dans `globals.css`.

À l'issue de ce lot, aucune page publique ne référence une classe `admin-*`. Le CSS admin peut évoluer sans risque de régression sur le public.

## Contexte

À la fin de V8, le nettoyage CSS (V8-5) a supprimé les classes admin orphelines côté admin. Mais cinq pages publiques utilisent encore des classes `admin-*`, ce qui a empêché leur suppression complète.

La situation actuelle est la suivante : les namespaces admin et public partagent les mêmes classes CSS. Modifier une classe admin peut avoir un effet de bord sur le public. Ce lot coupe ce couplage.

**Note sur le checkout :** ce lot inclut les pages `/checkout` et `/checkout/confirmation` car elles sont parmi les plus touchées par le saignement de namespace. Seul le CSS est concerné — la logique métier (Server Actions, validation, données) n'est pas modifiée.

## Pages concernées

| Page | Classes `admin-*` présentes |
|------|-----------------------------|
| `app/boutique/page.tsx` | `.admin-field`, `.admin-input`, `.admin-checkbox` |
| `app/boutique/[slug]/page.tsx` | `.admin-field`, `.admin-input`, `.admin-inline-actions`, `.admin-success`, `.admin-alert` |
| `app/panier/page.tsx` | `.admin-success`, `.admin-alert`, `.admin-field`, `.admin-input`, `.admin-inline-actions` |
| `app/checkout/page.tsx` | `.admin-form`, `.admin-homepage-section`, `.admin-panels`, `.admin-field`, `.admin-input`, `.admin-checkbox`, `.admin-muted-note`, `.admin-inline-actions`, `.admin-success`, `.admin-alert` |
| `app/checkout/confirmation/[reference]/page.tsx` | `.admin-chip`, `.admin-product-tags`, `.admin-muted-note`, `.admin-inline-actions`, `.admin-success`, `.admin-alert` |

## Table de correspondance

| Classe admin actuelle | Classe publique V9 | Nature |
|----------------------|-------------------|--------|
| `.admin-field` | `.form-field` | Conteneur label + input |
| `.admin-input` | `.form-input` | Input, select, textarea |
| `.admin-checkbox` | `.form-checkbox` | Conteneur label + checkbox |
| `.admin-panels` | `.form-panels` | Grille de champs côte à côte |
| `.admin-form` | `.form` | Wrapper de formulaire |
| `.admin-homepage-section` | `.form-section` | Section de formulaire avec titre |
| `.admin-inline-actions` | `.form-actions` | Groupe de boutons d'action |
| `.admin-muted-note` | `.form-note` | Note contextuelle atténuée |
| `.admin-success` | `.notice-success` | Message de confirmation/succès |
| `.admin-alert` | `.notice-error` | Message d'erreur |
| `.admin-chip` | `.status-tag` | Badge de statut individuel |
| `.admin-product-tags` | `.status-tag-group` | Groupe de badges de statut |

## Travail attendu

### Étape 1 — Définir les classes publiques dans `globals.css`

Ajouter deux blocs commentés dans `globals.css`, après les blocs existants :

**Bloc 1 : `/* Public — formulaires */`**
Définir `.form-field`, `.form-input`, `.form-checkbox`, `.form-panels`, `.form`, `.form-section`, `.form-actions`, `.form-note`.

Les styles doivent être visuellement équivalents aux classes admin correspondantes (pas de régression). Utiliser les tokens CSS disponibles (`--border`, `--foreground`, `--muted-foreground`, `--input`, `--ring`, etc.) plutôt que des valeurs codées en dur.

**Bloc 2 : `/* Public — feedback */`**
Définir `.notice-success` et `.notice-error`.

Visuellement équivalents à `.admin-success` et `.admin-alert`. Utiliser les tokens sémantiques disponibles (`--destructive`, `--destructive-foreground`, etc.).

**Bloc 3 : `/* Public — statuts */`**
Définir `.status-tag` et `.status-tag-group`.

Visuellement équivalents à `.admin-chip` et `.admin-product-tags`. Ces classes sont utilisées uniquement dans la page de confirmation de commande pour afficher le statut de commande et de paiement.

### Étape 2 — Mettre à jour les cinq pages publiques

Remplacer chaque occurrence de classe `admin-*` dans les pages listées par la classe publique correspondante selon la table de correspondance.

Point d'attention : les classes `.admin-field` et `.admin-input` apparaissent aussi avec des classes modificatrices (ex. `.admin-field.cart-quantity-field`, `.admin-input` avec des attributs de nombre). Ces classes modificatrices (`cart-quantity-field`, `catalog-filter-checkbox`) restent inchangées — seule la classe de base change.

### Étape 3 — Vérification

```bash
# Aucun résultat attendu sur des noms de classe CSS admin-*
grep -rn "admin-field\|admin-input\|admin-checkbox\|admin-panels\|admin-form\|admin-homepage-section\|admin-inline-actions\|admin-muted-note\|admin-success\|admin-alert\|admin-chip\|admin-product-tags" \
  app/boutique app/panier app/checkout

pnpm run typecheck
```

Vérification visuelle sur chaque page : boutique, fiche produit, panier, checkout, confirmation de commande. Aucune régression de rendu.

## Ce que ce lot ne fait pas

- Il ne modifie pas les définitions des classes `admin-*` dans `globals.css` (elles restent pour l'admin).
- Il ne touche à aucun composant admin.
- Il ne refactorise pas la logique des formulaires (Server Actions, validation, champs).
- Il ne change pas le rendu visuel — uniquement le nommage CSS.
- Il ne supprime pas les classes admin de `globals.css` : cette suppression, si elle devient possible après ce lot, relève d'un nettoyage ultérieur (hors V9).

## Critère de conformité V9-1

Une page est V9-1-compliant si `grep "admin-" <page>` retourne zéro résultat sur des noms de classe CSS.
