# Référence design system — Creatyss

## Rôle de ce document

Source de vérité opérationnelle pour travailler avec les styles de Creatyss.
Couvre storefront et admin. Exploitable par les humains et par l'IA.

---

## Architecture des fichiers de styles

### Chaîne d'import réelle (ordre de cascade)

```
app/globals.css
  → tailwindcss
  → shadcn/tailwind.css
  → app/styles/theme.css          ← importe aussi ./themes/creatyss.css
  → app/styles/base.css
  → app/styles/shell.css
  → app/styles/storefront.css
  → app/styles/animation.css
```

### Rôle de chaque fichier

| Fichier | Rôle | Nature |
| --- | --- | --- |
| `themes/creatyss.css` | Source de vérité du thème actif — toutes les CSS custom properties (`:root` + `.dark`) | Thème CSS pur |
| `themes/novamart.css` | Thème alternatif de référence (cool, corporate, indigo) — non actif, non importé | Thème CSS pur |
| `theme.css` | Point d'activation du thème + mapping Tailwind (`@theme inline`) + `@custom-variant dark` | Config Tailwind |
| `base.css` | Reset CSS global (box-sizing, body background) + `@layer base` Tailwind (html, body, headings) | Reset + base |
| `shell.css` | Classes structurelles layout (`@supports` backdrop-filter) + utilitaires composites globaux (`.text-eyebrow`) | CSS classes |
| `storefront.css` | Utilitaires CSS survivants storefront (blog, cart, checkout) non convertibles en Tailwind | CSS classes |
| `animation.css` | Keyframes accordéon via `@theme {}` | Keyframes |

---

## Source de vérité thème vs mapping

**`themes/creatyss.css`** = source de vérité du thème.  
Il définit les valeurs concrètes des CSS custom properties (`oklch(...)`, `rgb(...)`).  
C'est la seule chose à changer pour modifier l'identité visuelle du projet.

**`theme.css`** = point d'activation et mapping.  
Il importe le thème actif, expose ses variables au système Tailwind via `@theme inline`, et définit `@custom-variant dark`.  
Il ne définit aucune valeur concrète — seulement des `var(--foo)` pointant vers le thème.

**Règle :** ne jamais mettre de valeur concrète dans `theme.css`.  
Ne jamais mettre de directive Tailwind dans un fichier `themes/*.css`.

---

## Contrat de thème

Un fichier de thème valide doit impérativement définir les familles de tokens suivantes dans `:root` **et** `.dark` :

| Famille | Tokens attendus | Obligatoire |
| --- | --- | --- |
| Core semantic | `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`, `border`, `input`, `ring` | ✅ |
| Geometry | `--radius` | ✅ |
| Brand | `--brand`, `--brand-foreground` | ✅ |
| Page identity | `--page-bg`, `--page-foreground`, `--body-background` | ✅ |
| Overlay / interaction | `--overlay-scrim`, `--overlay-scrim-strong`, `--interactive-{hover,hover-strong,selected,selected-foreground,disabled,disabled-foreground}`, `--focus-ring`, `--focus-ring-offset-surface` | ✅ |
| Feedback | `--feedback-{info,success,warning,error}` × `{foreground,surface,border}` + `--feedback-error-surface-strong` | ✅ |
| Shared surfaces | `--surface-{panel,panel-soft,subtle,border,border-strong}` | ✅ |
| Shadows | `--shadow-{soft,card,raised,overlay,inset-soft}` | ✅ |
| Shell public | `--shell-{surface,surface-blur,drawer,drawer-blur,border}` | ✅ |
| Media | `--media-surface`, `--media-foreground`, `--media-overlay` | ✅ |
| Sidebar admin | `--sidebar`, `--sidebar-{foreground,primary,primary-foreground,accent,accent-foreground,border,ring}` | ✅ |
| Charts | `--chart-{1,2,3,4,5}` | ✅ |
| Hero editorial | `--hero-{bg,bg-media,ink,ink-soft,ink-muted,border,vignette}` | ✅ |
| Band | `--band-{bg,border,foreground,foreground-muted,icon,eyebrow,form-border}` | ✅ |

**Note `--body-background` :** ce token est une valeur CSS complète (peut inclure un gradient + une couleur). Ce n'est pas un simple token de couleur.

**Note `--band-*` :** ces tokens sont toujours identiques en `:root` et `.dark` (bande always-dark by design). Un thème ne doit pas y différencier les modes.

---

## Workflow — activer un thème

Le thème actif est sélectionné dans `app/styles/theme.css`, ligne `@import` en haut du fichier.

**Pour switcher de thème :**

1. Ouvrir `app/styles/theme.css`
2. Remplacer la ligne d'import :
   ```css
   /* Avant */
   @import "./themes/creatyss.css";

   /* Après */
   @import "./themes/novamart.css";
   ```
3. Relancer le build local (`make dev` ou `pnpm dev`)
4. Vérifier visuellement les deux modes light et dark
5. S'assurer que le thème activé implémente le contrat complet (toutes les familles ci-dessus)

**Thèmes disponibles :**

| Fichier | Statut | Identité |
| --- | --- | --- |
| `themes/creatyss.css` | ✅ Actif par défaut | Artisanal, chaud, ivoire, terracotta, premium |
| `themes/novamart.css` | 📦 Disponible, non actif | Cool, corporate, indigo, sidebar sombre |

---

## Workflow — créer un nouveau thème

1. **Dupliquer** `app/styles/themes/creatyss.css` vers `app/styles/themes/{nom}.css`
2. **Conserver** exactement les mêmes noms de CSS custom properties (le contrat est fixe)
3. **Remplacer uniquement** les valeurs concrètes (`oklch(...)`, `rgb(...)`, `rem`)
4. **Couvrir impérativement** toutes les familles du contrat de thème ci-dessus
5. **Couvrir les deux modes** — `:root` (light) et `.dark`
6. **Documenter** l'identité visuelle dans le header du fichier CSS
7. **Activer** en suivant le workflow ci-dessus

**Ce qu'un thème peut varier :**
- Géométrie (`--radius`) — rayon de courbure global
- Palette de couleurs complète (page, brand, sidebar, hero, band, charts...)
- `--body-background` (gradient composite ou couleur plate)

**Ce qu'un thème ne doit pas modifier :**
- Les noms des propriétés CSS (le contrat est fixe)
- La structure `:root` / `.dark`
- La sémantique des tokens `feedback-*` (fonctionnelle, universelle)
- La logique always-dark des `--band-*`

---

## Hiérarchie des couches de styles

### Règle d'extension

Avant de toucher un fichier de styles :

1. Le token existe-t-il déjà dans `themes/creatyss.css` ? → l'utiliser
2. La classe utilitaire existe-t-elle dans `shell.css` ou `storefront.css` ? → l'utiliser
3. Besoin global (storefront + admin) ? → ajouter dans `shell.css`
4. Besoin strictement storefront ? → ajouter dans `storefront.css`
5. Nouveau token systémique ? → ajouter dans `themes/creatyss.css` + mapper dans `theme.css`

**Interdit : valeurs arbitraires inline (`shadow-[...]`, `rounded-[...]`, `text-[11px]`) quand un token ou utilitaire existe.**

---

## Familles de tokens disponibles

### Couleurs sémantiques (core)

| Token | Usage |
| --- | --- |
| `foreground` / `background` | texte/fond UI principal (dialogs, popovers) |
| `muted` / `muted-foreground` | états atténués, labels secondaires |
| `primary` / `primary-foreground` | CTA principal |
| `secondary` / `secondary-foreground` | actions secondaires |
| `accent` / `accent-foreground` | accents UI discrets |
| `destructive` | états d'erreur destructifs |
| `brand` / `brand-foreground` | identité de marque |

### Surfaces (hiérarchie de fond)

```
page-background        ← fond global de page
  └── shell-surface    ← fond des sections/cards (légèrement plus clair)
        └── surface-panel      ← panneaux intérieurs
        └── surface-panel-soft ← variante plus transparente
        └── surface-subtle     ← teinte très légère (hover, zone inactive)
  └── media-surface    ← fond des zones image/média
```

**Règle :** descendre la hiérarchie — ne pas mettre `shell-surface` là où `surface-panel` est attendu, ni l'inverse.

### Surfaces hero-editorial

Tokens `hero-*` : réservés aux zones éditoriales à fort contraste ou à fond propre.

| Token | Usage |
| --- | --- |
| `hero-bg` / `hero-bg-media` | fond de zones hero éditoriales |
| `hero-ink` / `hero-ink-soft` / `hero-ink-muted` | texte dans contexte hero |
| `hero-border` | bordure dans contexte hero |
| `hero-vignette` | overlay vignette média |

### Tokens band

Tokens `band-*` : zone éditoriale always-dark (fond sombre fixe, indépendant du mode light/dark).  
Ces tokens sont intentionnellement identiques en `:root` et `.dark`.

| Token | Usage |
| --- | --- |
| `band-bg` | fond de la bande (toujours sombre) |
| `band-foreground` / `band-foreground-muted` | texte principal / atténué |
| `band-border` | bordure de la bande |
| `band-icon` | couleur d'icône dans la bande |
| `band-eyebrow` | labels eyebrow dans la bande |
| `band-form-border` | bordures de formulaires dans la bande |

### Bordures

| Token | Usage |
| --- | --- |
| `shell-border` | **bordure externe** d'un conteneur entier (section, card, hero) |
| `surface-border` | **séparateurs internes** — dividers à l'intérieur d'une surface |
| `surface-border-strong` | séparateurs internes à fort contraste (tableaux, focus zones) |
| `border` | bordures génériques shadcn/ui |

**Règle :** `shell-border` entoure, `surface-border` divise.

### Shadows (élévation)

Du plus doux au plus fort :

| Token | Usage |
| --- | --- |
| `shadow-soft` | sections/pages entières — grande, très diffuse, non directive |
| `shadow-card` | cards autonomes — légèrement plus compacte que soft |
| `shadow-raised` | éléments flottants dans une surface (ex: image produit dans hero) |
| `shadow-overlay` | modals, drawers, overlays critiques |
| `shadow-inset-soft` | séparateurs ou reliefs intérieurs subtils |

**Règle :** ne pas monter plus haut que nécessaire. Une section standard = `shadow-soft`. Une image dans une section = `shadow-raised`.

### Radius scale

Le `--radius` de base varie selon le thème (`0.9rem` pour Creatyss, `0.5rem` pour Novamart).  
Les classes Tailwind ci-dessous sont calculées relativement à ce `--radius`.

| Classe Tailwind | Multiplicateur | Usage |
| --- | --- | --- |
| `rounded-sm` | `× 0.6` | petits éléments (badges, pills) |
| `rounded-md` | `× 0.8` | boutons, inputs |
| `rounded-lg` | `× 1` (= `--radius`) | sections, cards standard |
| `rounded-xl` | `× 1.4` | containers intermédiaires |
| `rounded-2xl` | `× 1.8` | éléments premium moyens |
| `rounded-3xl` | `× 2.2` | images flottantes, zones média premium |
| `rounded-4xl` | `× 2.6` | cas exceptionnels |

**Règle :** ne pas hardcoder `rounded-[1.75rem]` — choisir le step le plus proche.

### Feedback

Tokens `feedback-{info,success,warning,error}` × `{foreground,surface,border}` — ne pas les détourner pour d'autres usages.

### Focus

`focus-ring` pour les états de focus — ne pas utiliser `ring` directement (alias de compatibilité uniquement).

---

## Utilitaires composites disponibles

### `.text-eyebrow` (`shell.css`)

Pattern typographique pour overlines et labels de section.

```css
font-size: 0.6875rem;
font-weight: 600;
text-transform: uppercase;
letter-spacing: 0.1em;
```

Usage :

```tsx
<p className="text-eyebrow text-muted-foreground">Disponibilité</p>
<p className="text-eyebrow text-brand">Description</p>
```

**Ne pas inclure la couleur dans la classe** — elle est toujours contextuelle.

### `.site-header-blur` / `.shell-drawer` (`shell.css`)

Surfaces avec backdrop-filter pour header et drawer. Ne pas reproduire le pattern `backdrop-blur` manuellement — utiliser ces classes.

---

## Conventions d'usage

### Quand utiliser un token vs une valeur Tailwind standard ?

- Couleurs → toujours les tokens du design system (jamais `bg-white`, `text-gray-500`, etc.)
- Shadows → toujours `shadow-{soft,card,raised,overlay,inset-soft}`
- Radius → les steps Tailwind mappés (`rounded-lg`, `rounded-xl`, etc.) — jamais de valeur arbitraire
- Borders → `border-shell-border` ou `border-surface-border` selon contexte

### Quand créer un utilitaire composite ?

Uniquement si :

1. Le pattern est répété ≥ 3 fois à l'identique dans des contextes différents
2. Il ne s'agit pas simplement d'une composition de 2 classes Tailwind
3. La classe composite a un nom sémantique clair (pas `.flex-row-gap-2`)

### Quand créer un nouveau token ?

Uniquement si :

1. Le besoin ne peut pas être couvert par un token existant
2. Le besoin est systémique (plusieurs composants, storefront + admin)
3. Le token a une sémantique claire et non ambiguë

**Ne pas créer de token pour un besoin local à un seul composant.**

---

## Alias dépréciés / à éviter

| À éviter | Remplacer par |
| --- | --- |
| `border-border-soft` | `border-surface-border` |
| `bg-white` / `bg-gray-*` | tokens `shell-surface`, `surface-panel`, etc. |
| `text-gray-*` | `text-muted-foreground`, `text-hero-ink-soft`, etc. |
| Valeurs arbitraires shadow (`shadow-[...]`) | `shadow-{soft,card,raised,overlay}` |
| Valeurs arbitraires radius (`rounded-[...]`) | steps du radius scale |
| Valeurs arbitraires texte (`text-[11px]`) | `.text-eyebrow` ou classes Tailwind standards |

---

## Dark mode

Tous les tokens sont définis pour `:root` (light) et `.dark` dans le fichier de thème actif.  
Ne jamais hardcoder des valeurs dark (`dark:bg-gray-900`) — utiliser les tokens qui s'adaptent automatiquement.

Exception : les tokens `--band-*` sont always-dark par design — intentionnellement identiques en `:root` et `.dark`.

---

## Interdits absolus

- Hardcodes inline arbitraires (`shadow-[0_18px_45px_rgba(...)]`, `rounded-[1.75rem]`, `text-[9px]`)
- Duplication d'un pattern déjà couvert par une classe utilitaire (`text-eyebrow`)
- Token de couleur utilisé comme shadow
- Création de token sans besoin systémique documenté
- Logique métier dans les composants de présentation
- Modification du thème actif sans couvrir les deux modes light + dark
- Valeurs concrètes dans `theme.css` — ce fichier mappe, il ne définit pas
- Directives Tailwind (`@apply`, `@theme`) dans un fichier `themes/*.css`
