# Roadmap V9 — Consolidation du front public

## Vue d'ensemble des lots

| Lot | Titre | Risque si ignoré |
|-----|-------|-----------------|
| V9-1 | Découplage CSS public/admin | CSS admin indéfiniment partagé, nettoyage V8-5 structurellement incomplet, modifications admin à risque de régressions public |
| V9-2 | Shell public et tokens V8 | Valeurs RGBA en dur s'accumulent, tokens V8 sous-utilisés côté public, maintenance du shell fragile |
| V9-3 | Cohérence des pages publiques | Structure des pages hétérogène, critères de conformité inapplicables, dette structurelle progressive |

## Séquence et dépendances

```
V9-1 ──────────────────────────────▶ V9-3
  │
V9-2 (parallèle possible avec V9-1)
```

- **V9-1** est le prérequis de V9-3. Il crée le namespace CSS public qui sera utilisé et stabilisé en V9-3.
- **V9-2** est indépendant. Il ne touche qu'au shell (`components/public/public-site-shell.tsx`) et peut être traité en parallèle de V9-1.
- **V9-3** dépend de V9-1. Il vérifie et uniformise les patterns une fois le namespace public posé.

## Inventaire complet — classes `admin-*` dans le public

### Classes de formulaire

| Classe admin actuelle | Classe publique V9 | Description |
|----------------------|--------------------|-------------|
| `.admin-field` | `.form-field` | Conteneur label + input |
| `.admin-input` | `.form-input` | Input, select, textarea |
| `.admin-checkbox` | `.form-checkbox` | Conteneur label + checkbox |
| `.admin-panels` | `.form-panels` | Grille de champs côte à côte |
| `.admin-form` | `.form` | Wrapper de formulaire |
| `.admin-homepage-section` | `.form-section` | Section de formulaire avec titre |
| `.admin-inline-actions` | `.form-actions` | Groupe de boutons d'action |
| `.admin-muted-note` | `.form-note` | Note contextuelle atténuée |

### Classes de feedback

| Classe admin actuelle | Classe publique V9 | Description |
|----------------------|--------------------|-------------|
| `.admin-success` | `.notice-success` | Message de confirmation/succès |
| `.admin-alert` | `.notice-error` | Message d'erreur (avec `role="alert"`) |

### Classes de statut et badge

| Classe admin actuelle | Classe publique V9 | Description |
|----------------------|--------------------|-------------|
| `.admin-chip` | `.status-tag` | Badge de statut individuel |
| `.admin-product-tags` | `.status-tag-group` | Groupe de badges de statut |

### Pages concernées par lot de classes

| Classe | boutique | boutique/[slug] | panier | checkout | confirmation |
|--------|----------|-----------------|--------|----------|--------------|
| `.admin-field` | ✓ | ✓ | ✓ | ✓ | — |
| `.admin-input` | ✓ | ✓ | ✓ | ✓ | — |
| `.admin-checkbox` | ✓ | — | — | ✓ | — |
| `.admin-panels` | — | — | — | ✓ | — |
| `.admin-form` | — | — | — | ✓ | — |
| `.admin-homepage-section` | — | — | — | ✓ | — |
| `.admin-inline-actions` | — | ✓ | ✓ | ✓ | ✓ |
| `.admin-muted-note` | — | — | — | ✓ | ✓ |
| `.admin-success` | — | ✓ | ✓ | ✓ | ✓ |
| `.admin-alert` | — | ✓ | ✓ | ✓ | ✓ |
| `.admin-chip` | — | — | — | — | ✓ |
| `.admin-product-tags` | — | — | — | — | ✓ |

## Inventaire — valeurs arbitraires dans le shell public

Fichier : `components/public/public-site-shell.tsx`

| Valeur actuelle | Contexte | Remplacement cible |
|----------------|----------|--------------------|
| `bg-[rgba(245,242,234,0.92)]` | Header desktop | Token ou variable CSS |
| `supports-[backdrop-filter]:bg-[rgba(245,242,234,0.84)]` | Header avec blur | Token ou variable CSS |
| `bg-[rgba(245,242,234,0.98)]` | Drawer mobile | Token ou variable CSS |
| `supports-[backdrop-filter]:bg-[rgba(245,242,234,0.94)]` | Drawer mobile avec blur | Token ou variable CSS |

## Critères de clôture V9

### Clôture V9-1
```bash
grep -r "admin-" app/boutique app/panier app/checkout
# doit retourner zéro résultat sur des noms de classe CSS
pnpm run typecheck
```
Vérification visuelle : boutique, boutique/[slug], panier, checkout, confirmation — aucune régression.

### Clôture V9-2
```bash
grep -n "rgba" components/public/public-site-shell.tsx
# doit retourner zéro résultat
pnpm run typecheck
```
Vérification visuelle : header flottant et drawer mobile s'affichent correctement sur toutes les pages publiques.

### Clôture V9-3
- Chaque page publique principale a un `.page-header` avec `.eyebrow` et `h1`.
- Les états vides suivent le pattern `.empty-state` documenté.
- Les messages d'erreur ont `role="alert"`.
- `pnpm run typecheck` passe.
- Vérification visuelle sur toutes les routes publiques.

### Clôture V9 globale
```bash
grep -r "admin-" app/boutique app/panier app/checkout components/public
# zéro résultat CSS
grep -rn "rgba" components/public/public-site-shell.tsx
# zéro résultat
pnpm run typecheck
pnpm exec playwright test --grep "public"
```
