# Responsive Breakpoints Storefront

## Objectif

Poser une convention de breakpoints métier pour les layouts storefront (notamment `/boutique`) dans Tailwind v4, sans remplacer les breakpoints standards.

## Source technique

Les alias sont définis dans :

- `/Users/laurent/Desktop/CREATYSS/app/styles/theme.css`

via `@theme inline` et les tokens `--breakpoint-*`.

## Breakpoints métier ajoutés

- `laptop`: `64rem` (1024px)
- `desktop`: `75rem` (1200px)
- `wide`: `90.0625rem` (1441px)
- `ultrawide`: `100rem` (1600px)
- `2k`: `120rem` (1920px)
- `4k`: `160rem` (2560px)

Ces alias sont additionnels.  
Les breakpoints standards Tailwind (`sm`, `md`, `lg`, `xl`, `2xl`) restent utilisés pour les composants génériques.

## Règles d’usage

- Utiliser `sm/md/lg/xl/2xl` pour les composants UI transverses.
- Utiliser `laptop/desktop/wide/ultrawide/2k/4k` pour les layouts storefront et les matrices de page.
- Éviter d’ajouter de nouveaux `min-[...]` si un alias métier couvre déjà le besoin.
- Garder les breakpoints arbitraires uniquement pour des micro-ajustements locaux (ex: ratio média spécifique à une card).

## Matrice cible boutique

- `<1024` : filtres bottom sheet, pas d’aside, pas de sidebar fixe.
- `1024–1440` : filtres off-canvas gauche, aside discret.
- `>1440` : sidebar filtres fixe + aside affirmée.
- `>=1200` : auto-load desktop possible.
- `<1200` : chargement via bouton `Voir plus` uniquement.

## Stratégie 2K / 4K

- Ne pas scaler globalement `html`/root font-size.
- Ajuster d’abord :
  - la structure de layout (colonnes),
  - la largeur utile,
  - la respiration (gaps/padding),
  - la densité de grille.
- Éviter d’étirer les cards sans limite : privilégier plus de colonnes contrôlées plutôt que des cartes massives.
