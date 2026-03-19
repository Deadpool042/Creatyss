# V9-2 — Shell public et tokens V8

**Prérequis :** V8-1 complété (acquis à l'entrée de V9)
**Peut aller en parallèle de :** V9-1

## Objectif

Supprimer les valeurs RGBA codées en dur dans le shell public et les remplacer par des tokens CSS ou des variables référençant les propriétés posées en V8-1.

## Contexte

Le shell public (`components/public/public-site-shell.tsx`) a été partiellement migré vers shadcn lors de versions antérieures : il utilise `Button` et `Sheet`. Cependant, les fonds du header et du drawer mobile restent exprimés en valeurs RGBA littérales :

```tsx
// Header
className =
  "... bg-[rgba(245,242,234,0.92)] supports-[backdrop-filter]:bg-[rgba(245,242,234,0.84)] ...";

// Drawer mobile
className =
  "... bg-[rgba(245,242,234,0.98)] supports-[backdrop-filter]:bg-[rgba(245,242,234,0.94)]";
```

Ces quatre valeurs RGBA codent toutes la même couleur de fond (`245,242,234` — la teinte chaude de l'arrière-plan public) avec différents niveaux d'opacité selon le contexte :

| Valeur                    | Opacité | Contexte                                   |
| ------------------------- | ------- | ------------------------------------------ |
| `rgba(245,242,234, 0.92)` | 92 %    | Header par défaut                          |
| `rgba(245,242,234, 0.84)` | 84 %    | Header avec `backdrop-filter` actif        |
| `rgba(245,242,234, 0.98)` | 98 %    | Drawer mobile par défaut                   |
| `rgba(245,242,234, 0.94)` | 94 %    | Drawer mobile avec `backdrop-filter` actif |

V8-1 a posé le token `--background` en OKLCH. La couleur de fond RGB n'est pas encore exposée comme composante séparable. Ce lot doit résoudre ce décalage.

## Approche recommandée

### Option A — Variables CSS dédiées au shell (recommandée)

Définir dans `globals.css`, dans un bloc `/* Public — shell */`, des custom properties pour les quatre variantes de fond :

```css
/* Public — shell */
--shell-header-bg: rgba(245, 242, 234, 0.92);
--shell-header-bg-blur: rgba(245, 242, 234, 0.84);
--shell-drawer-bg: rgba(245, 242, 234, 0.98);
--shell-drawer-bg-blur: rgba(245, 242, 234, 0.94);
```

Puis dans le composant, remplacer les classes Tailwind arbitraires par des références à ces variables :

```tsx
style={{ background: "var(--shell-header-bg)" }}
// ou via une classe utilitaire définie dans globals.css
```

Cette option centralise les valeurs dans `globals.css`, les nomme explicitement, et les rend modifiables en un seul endroit si la couleur de fond évolue.

### Option B — Classes utilitaires dans `globals.css`

Définir des classes CSS `.shell-header-bg` et `.shell-drawer-bg` dans `globals.css` avec les styles de fond complets, et les appliquer dans le composant à la place des classes Tailwind arbitraires.

Cette option simplifie le JSX et encapsule mieux les styles du shell.

### Option C — `color-mix()` ou canal alpha OKLCH (si compatible)

Si la compatibilité navigateur le permet et que le token `--background` est exprimé en OKLCH, utiliser `color-mix(in oklch, var(--background) 92%, transparent)`. Cette option est plus proche d'une vraie thémisation mais plus complexe à valider visuellement.

**Recommandation :** privilégier l'option A ou B. L'option C est une amélioration future hors périmètre V9.

## Travail attendu

1. Choisir l'option d'implémentation (A ou B recommandé).
2. Ajouter le bloc `/* Public — shell */` dans `globals.css` avec les définitions retenues.
3. Mettre à jour `components/public/public-site-shell.tsx` pour supprimer les quatre valeurs RGBA arbitraires.
4. Vérifier.

## Vérification

```bash
grep -n "rgba" components/public/public-site-shell.tsx
# doit retourner zéro résultat

pnpm run typecheck
```

Vérification visuelle :

- Le header est translucide et flotte correctement sur toutes les pages publiques (accueil, boutique, blog, panier).
- L'effet `backdrop-blur` fonctionne sur les navigateurs compatibles.
- Le drawer mobile s'affiche avec le bon fond sur mobile.

## Ce que ce lot ne fait pas

- Il ne modifie pas la structure HTML du shell.
- Il ne change pas les liens de navigation ni leur comportement.
- Il n'introduit pas de dark mode côté public.
- Il ne migre pas les composants shadcn existants (Button, Sheet) — ils restent en l'état.
- Il ne touche pas à l'admin ni aux composants partagés.
