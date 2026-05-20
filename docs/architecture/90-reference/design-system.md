# Référence design system — Creatyss

## Rôle de ce document

Source de vérité opérationnelle pour travailler avec les styles de Creatyss.
Couvre storefront et admin. Exploitable par les humains et par l'IA.

## État stabilisé V2 / V2-T (clôture)

Le design system est maintenant stabilisé autour de :

- la taxonomie tokens V2 (surfaces, borders, controls, interactifs, shadows) ;
- la famille floating/overlay dédiée (`surface-floating`, `border-floating`, `shadow-floating`) ;
- les primitives UI principales alignées sur cette hiérarchie (contrôles, overlays, surfaces standards) ;
- ~~le mini-système typo V2-T (`text-title-*`, `text-price-*`, `text-meta-label`, `text-secondary-copy`, `text-micro-copy`, `reading-*`)~~ — **supprimé** avec `typography.css` ; remplacé par des compositions Tailwind inline (voir section _Patterns typographiques recommandés_).

Conséquence : la base par défaut est V2. Le mini-système typo V2-T a été supprimé lors de la migration Tailwind.
Les évolutions restantes doivent être traitées par micro-lots locaux, sans relancer une refonte large.

---

## Architecture des fichiers de styles

### Chaîne d'import réelle (ordre de cascade)

```
app/globals.css
  → tailwindcss
  → shadcn/tailwind.css
  → @plugin "@tailwindcss/typography"
  → app/styles/theme.css          ← importe les 3 splits du thème actif + définit @theme inline
  → app/styles/base.css
  → app/styles/shell.css
  → app/styles/motion.css
  → app/styles/animation.css
```

> `typography.css` a été supprimé. Le plugin `@tailwindcss/typography` est activé via `@plugin` dans `globals.css` et consommé via les classes `prose` dans les composants.

### Rôle de chaque fichier

| Fichier                     | Rôle                                                                                                                                                                      | Nature          |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| `themes/creatyss.core.css`  | Tokens structurels partagés, indépendants du mode (`:root`) : `--radius`, tokens `--band-*` always-dark                                                                   | Thème CSS pur   |
| `themes/creatyss.light.css` | Valeurs light mode (`:root`) — palette warm, ivoire, terracotta                                                                                                           | Thème CSS pur   |
| `themes/creatyss.dark.css`  | Valeurs dark mode (`.dark`) — palette warm dark cacao                                                                                                                     | Thème CSS pur   |
| `themes/novamart.css`       | Thème alternatif de référence (cool, corporate, indigo) — non actif, non importé (template client fictif)                                                                 | Thème CSS pur   |
| `theme.css`                 | Point d'activation du thème : importe les 3 splits Creatyss + mapping Tailwind (`@theme inline`) + `@custom-variant dark`                                                 | Config Tailwind |
| `base.css`                  | Reset CSS global (box-sizing, body background) + `@layer base` Tailwind (html, body, headings)                                                                            | Reset + base    |
| `shell.css`                 | Primitive `.site-header-blur` uniquement — backdrop-filter avec fallback opaque, consomme `--shell-surface` et `--shell-surface-blur` (avec `@supports` et vendor prefix) | CSS classes     |
| `motion.css`                | Animations et transitions globales                                                                                                                                        | CSS classes     |
| `animation.css`             | Keyframes accordéon via `@theme {}`                                                                                                                                       | Keyframes       |

**Fichiers supprimés (ne pas réintroduire) :**

| Fichier supprimé              | Remplacé par                                                                           |
| ----------------------------- | -------------------------------------------------------------------------------------- |
| `typography.css`              | Tailwind natif inline dans les composants + plugin `@tailwindcss/typography` (`prose`) |
| `boutique.css`                | Classes Tailwind inline dans les composants boutique                                   |
| `boutique-controls.css`       | Classes Tailwind inline                                                                |
| `boutique-products.css`       | Classes Tailwind inline                                                                |
| `creatyss.css` (monolithique) | Splits `creatyss.core.css` / `creatyss.light.css` / `creatyss.dark.css`                |

---

## Source de vérité thème vs mapping

**`themes/creatyss.core.css`** + **`themes/creatyss.light.css`** + **`themes/creatyss.dark.css`** = source de vérité du thème actif.
Ces trois fichiers définissent ensemble toutes les valeurs concrètes des CSS custom properties (`oklch(...)`, `rgb(...)`).

- `creatyss.core.css` : tokens structurels partagés entre les deux modes (`:root`) — `--radius`, tokens `--band-*` always-dark.
- `creatyss.light.css` : toutes les valeurs light mode (`:root`).
- `creatyss.dark.css` : toutes les valeurs dark mode (`.dark`).

C'est dans ces trois fichiers qu'il faut intervenir pour modifier l'identité visuelle du projet.

**`theme.css`** = point d'activation et mapping.
Il importe les trois splits du thème actif, expose leurs variables au système Tailwind via `@theme inline`, et définit `@custom-variant dark`.
Il ne définit aucune valeur concrète — seulement des `var(--foo)` pointant vers le thème.

**Règle :** ne jamais mettre de valeur concrète dans `theme.css`.
Ne jamais mettre de directive Tailwind dans un fichier `themes/*.css`.

---

## Contrat de thème

Un fichier de thème valide doit impérativement définir les familles de tokens suivantes dans `:root` **et** `.dark` :

| Famille               | Tokens attendus                                                                                                                                                                                                                                                                              | Obligatoire |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Core semantic         | `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`, `border`, `input`, `ring` | ✅          |
| Geometry              | `--radius`                                                                                                                                                                                                                                                                                   | ✅          |
| Brand                 | `--brand`, `--brand-foreground`                                                                                                                                                                                                                                                              | ✅          |
| Page identity         | `--page-bg`, `--page-foreground`, `--body-background`                                                                                                                                                                                                                                        | ✅          |
| Overlay / interaction | `--overlay-scrim`, `--overlay-scrim-strong`, `--interactive-{hover,hover-strong,selected,selected-hover,pressed,selected-foreground,disabled,disabled-foreground}`, `--focus-ring`, `--focus-ring-offset-surface`                                                                            | ✅          |
| Feedback              | `--feedback-{info,success,warning,error}` × `{foreground,surface,border}` + `--feedback-error-surface-strong`                                                                                                                                                                                | ✅          |
| Shared surfaces       | `--surface-{panel,panel-soft,subtle,border-subtle,border,border-strong}`                                                                                                                                                                                                                     | ✅          |
| Controls              | `--control-{surface,surface-hover,surface-active,surface-selected,border,border-strong}`                                                                                                                                                                                                     | ✅          |
| Secondary text        | `--text-muted-{strong,soft}`                                                                                                                                                                                                                                                                 | ✅          |
| Shadows               | `--shadow-{soft,card,raised,control,control-hover,control-pressed,overlay,inset-soft}`                                                                                                                                                                                                       | ✅          |
| Shell public          | `--shell-{surface,surface-blur,drawer,drawer-blur,border,border-strong}`                                                                                                                                                                                                                     | ✅          |
| Media                 | `--media-surface`, `--media-foreground`, `--media-overlay`                                                                                                                                                                                                                                   | ✅          |
| Sidebar admin         | `--sidebar`, `--sidebar-{foreground,primary,primary-foreground,accent,accent-foreground,border,ring}`                                                                                                                                                                                        | ✅          |
| Charts                | `--chart-{1,2,3,4,5}`                                                                                                                                                                                                                                                                        | ✅          |
| Hero editorial        | `--hero-{bg,bg-media,ink,ink-soft,ink-muted,border,vignette}`                                                                                                                                                                                                                                | ✅          |
| Band                  | `--band-{bg,border,foreground,foreground-muted,icon,eyebrow,form-border}`                                                                                                                                                                                                                    | ✅          |

**Note `--body-background` :** ce token est une valeur CSS complète (peut inclure un gradient + une couleur). Ce n'est pas un simple token de couleur.

**Note `--band-*` :** ces tokens sont toujours identiques en `:root` et `.dark` (bande always-dark by design). Un thème ne doit pas y différencier les modes.

---

## Workflow — activer un thème

Le thème actif est sélectionné dans `app/styles/theme.css` via les lignes `@import` en haut du fichier.

**Pour switcher de thème :**

1. Ouvrir `app/styles/theme.css`
2. Remplacer les trois imports du thème actif par les imports du nouveau thème (ou par un import unique si le thème alternatif est monolithique) :

   ```css
   /* Avant — thème Creatyss splitté */
   @import "./themes/creatyss.core.css";
   @import "./themes/creatyss.light.css";
   @import "./themes/creatyss.dark.css";

   /* Après — exemple avec un thème monolithique */
   @import "./themes/novamart.css";
   ```

3. Relancer le build local (`make dev` ou `pnpm dev`)
4. Vérifier visuellement les deux modes light et dark
5. S'assurer que le thème activé implémente le contrat complet (toutes les familles ci-dessus)

**Thèmes disponibles :**

| Fichier(s)                                                                            | Statut                  | Identité                                                         |
| ------------------------------------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------- |
| `themes/creatyss.core.css` + `themes/creatyss.light.css` + `themes/creatyss.dark.css` | Actif par défaut        | Artisanal, chaud, ivoire, terracotta, premium                    |
| `themes/novamart.css`                                                                 | Disponible, non importé | Cool, corporate, indigo, sidebar sombre (template client fictif) |

---

## Workflow — créer un nouveau thème

1. **Créer** trois fichiers dans `app/styles/themes/` : `{nom}.core.css`, `{nom}.light.css`, `{nom}.dark.css`
   (ou un fichier unique `{nom}.css` si le thème ne nécessite pas de split, en conservant `:root` + `.dark`)
2. **S'inspirer** des splits Creatyss comme référence structurelle
3. **Conserver** exactement les mêmes noms de CSS custom properties (le contrat est fixe)
4. **Remplacer uniquement** les valeurs concrètes (`oklch(...)`, `rgb(...)`, `rem`)
5. **Couvrir impérativement** toutes les familles du contrat de thème ci-dessus
6. **Couvrir les deux modes** — `:root` (light) et `.dark`
7. **Documenter** l'identité visuelle dans le header du ou des fichiers CSS
8. **Activer** en suivant le workflow ci-dessus

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

1. Le token existe-t-il déjà dans les fichiers de thème (`themes/creatyss.core.css`, `themes/creatyss.light.css`, `themes/creatyss.dark.css`) ? → l'utiliser
2. La classe utilitaire existe-t-elle dans `shell.css` ? → l'utiliser
3. La composition est triviale (≤ 3 classes Tailwind token-driven) ? → l'écrire inline dans le composant
4. Besoin global non trivial (backdrop-filter, vendor prefix, `@supports`, taille hors-Tailwind) ? → ajouter dans `shell.css`
5. Nouveau token systémique ? → ajouter dans le fichier de thème approprié (`creatyss.core.css` si partagé entre modes, `creatyss.light.css` et `creatyss.dark.css` si différencié) + mapper dans `theme.css`

**Frontière CSS custom vs Tailwind inline :**

| Couche          | Ce qui y vit                                                                                                                                              |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `themes/*.css`  | Valeurs concrètes des CSS custom properties (source de vérité)                                                                                            |
| `theme.css`     | Mapping Tailwind + activation du thème — aucune valeur concrète                                                                                           |
| `base.css`      | Reset global, fondations HTML/body                                                                                                                        |
| `shell.css`     | Uniquement ce que Tailwind ne peut pas exprimer proprement : vendor prefixes, `@supports`, valeurs hors-scale — actuellement limité à `.site-header-blur` |
| Tailwind inline | Toute composition locale simple : surfaces, bordures, radius, shadows, gaps, paddings — tant que les tokens du design system sont utilisés                |

**Interdit : valeurs arbitraires inline (`shadow-[...]`, `rounded-[...]`, `text-[11px]`) quand un token ou utilitaire existe.**

---

## Familles de tokens disponibles

### Couleurs sémantiques (core)

| Token                                | Usage                                       |
| ------------------------------------ | ------------------------------------------- |
| `foreground` / `background`          | texte/fond UI principal (dialogs, popovers) |
| `muted` / `muted-foreground`         | états atténués, labels secondaires          |
| `primary` / `primary-foreground`     | CTA principal                               |
| `secondary` / `secondary-foreground` | actions secondaires                         |
| `accent` / `accent-foreground`       | accents UI discrets                         |
| `destructive`                        | états d'erreur destructifs                  |
| `brand` / `brand-foreground`         | identité de marque                          |

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

| Token                                           | Usage                          |
| ----------------------------------------------- | ------------------------------ |
| `hero-bg` / `hero-bg-media`                     | fond de zones hero éditoriales |
| `hero-ink` / `hero-ink-soft` / `hero-ink-muted` | texte dans contexte hero       |
| `hero-border`                                   | bordure dans contexte hero     |
| `hero-vignette`                                 | overlay vignette média         |

### Tokens band

Tokens `band-*` : zone éditoriale always-dark (fond sombre fixe, indépendant du mode light/dark).
Ces tokens sont intentionnellement identiques en `:root` et `.dark`.

| Token                                       | Usage                                 |
| ------------------------------------------- | ------------------------------------- |
| `band-bg`                                   | fond de la bande (toujours sombre)    |
| `band-foreground` / `band-foreground-muted` | texte principal / atténué             |
| `band-border`                               | bordure de la bande                   |
| `band-icon`                                 | couleur d'icône dans la bande         |
| `band-eyebrow`                              | labels eyebrow dans la bande          |
| `band-form-border`                          | bordures de formulaires dans la bande |

### Bordures

| Token                   | Usage                                                             |
| ----------------------- | ----------------------------------------------------------------- |
| `shell-border`          | **bordure externe** d'un conteneur entier (section, card, hero)   |
| `shell-border-strong`   | **bordure externe renforcée** pour conteneur premium / état actif |
| `surface-border-subtle` | séparateurs internes de faible contraste (micro-rythme)           |
| `surface-border`        | **séparateurs internes** — dividers à l'intérieur d'une surface   |
| `surface-border-strong` | séparateurs internes à fort contraste (tableaux, focus zones)     |
| `border`                | bordures génériques shadcn/ui                                     |

**Règle :** `shell-border` entoure, `surface-border` divise.

### Shadows (élévation)

Du plus doux au plus fort :

| Token                    | Usage                                                             |
| ------------------------ | ----------------------------------------------------------------- |
| `shadow-soft`            | sections/pages entières — grande, très diffuse, non directive     |
| `shadow-card`            | cards autonomes — légèrement plus compacte que soft               |
| `shadow-raised`          | éléments flottants dans une surface (ex: image produit dans hero) |
| `shadow-control`         | contrôles au repos (boutons, pills, toggles)                      |
| `shadow-control-hover`   | contrôles au survol (élévation courte)                            |
| `shadow-control-pressed` | contrôles pressés (inset tactile)                                 |
| `shadow-overlay`         | modals, drawers, overlays critiques                               |
| `shadow-inset-soft`      | séparateurs ou reliefs intérieurs subtils                         |

**Règle :** ne pas monter plus haut que nécessaire. Une section standard = `shadow-soft`. Une image dans une section = `shadow-raised`.

### Contrôles (surfaces dédiées)

| Token                      | Usage                                                  |
| -------------------------- | ------------------------------------------------------ |
| `control-surface`          | fond d'un contrôle au repos                            |
| `control-surface-hover`    | fond d'un contrôle au survol                           |
| `control-surface-active`   | fond d'un contrôle pressé                              |
| `control-surface-selected` | fond d'un contrôle sélectionné                         |
| `control-border`           | contour standard d'un contrôle                         |
| `control-border-strong`    | contour renforcé (focus, sélection, contraste premium) |

### Texte secondaire (hiérarchie)

| Token               | Usage                                         |
| ------------------- | --------------------------------------------- |
| `text-muted-strong` | texte secondaire important (labels, metadata) |
| `text-muted-soft`   | texte secondaire discret (micro-copy, hints)  |

### Radius scale

Le `--radius` de base varie selon le thème (`0.9rem` pour Creatyss, `0.5rem` pour Novamart).
Les classes Tailwind ci-dessous sont calculées relativement à ce `--radius`.

| Classe Tailwind | Multiplicateur       | Usage                                  |
| --------------- | -------------------- | -------------------------------------- |
| `rounded-sm`    | `× 0.6`              | petits éléments (badges, pills)        |
| `rounded-md`    | `× 0.8`              | boutons, inputs                        |
| `rounded-lg`    | `× 1` (= `--radius`) | sections, cards standard               |
| `rounded-xl`    | `× 1.4`              | containers intermédiaires              |
| `rounded-2xl`   | `× 1.8`              | éléments premium moyens                |
| `rounded-3xl`   | `× 2.2`              | images flottantes, zones média premium |
| `rounded-4xl`   | `× 2.6`              | cas exceptionnels                      |

**Règle :** ne pas hardcoder `rounded-[1.75rem]` — choisir le step le plus proche.

### Feedback

Tokens `feedback-{info,success,warning,error}` × `{foreground,surface,border}` — ne pas les détourner pour d'autres usages.

### Focus

`focus-ring` pour les états de focus — ne pas utiliser `ring` directement (alias de compatibilité uniquement).

---

## Utilitaires composites disponibles

### Mini-système typographique global (V2-T1) — OBSOLÈTE

> **Ces classes n'existent plus.** `typography.css` a été supprimé. Ne pas les recréer.
> Les utiliser dans un composant constitue une erreur — elles ne produiront aucun style.
>
> Remplacements : voir la section **Patterns typographiques recommandés** ci-dessous.

<details>
<summary>Référence historique (V2-T1, supprimée)</summary>

| Classe supprimée       | Pattern de remplacement inline                                             |
| ---------------------- | -------------------------------------------------------------------------- |
| `.text-title-page`     | Séquence Tailwind native selon contexte                                    |
| `.text-title-section`  | Séquence Tailwind native selon contexte                                    |
| `.text-title-compact`  | Séquence Tailwind native selon contexte                                    |
| `.text-price-display`  | `text-3xl md:text-4xl font-bold leading-none tracking-tight tabular-nums`  |
| `.text-price-compact`  | `text-2xl md:text-3xl font-bold leading-tight tracking-tight tabular-nums` |
| `.text-meta-label`     | `text-xs font-semibold uppercase tracking-widest leading-snug`             |
| `.text-secondary-copy` | Tailwind natif selon contexte                                              |
| `.text-micro-copy`     | Tailwind natif selon contexte                                              |
| `.reading-compact`     | Tailwind natif selon contexte                                              |
| `.reading-relaxed`     | Tailwind natif selon contexte                                              |
| `.text-eyebrow`        | `text-xs font-semibold uppercase tracking-widest leading-snug`             |

</details>

### `.site-header-blur` (`shell.css`)

Surface avec backdrop-filter pour le header public. Ne pas reproduire le pattern `backdrop-blur` manuellement — utiliser cette classe.

---

## Conventions d'usage

### Principes d'usage post-stabilisation

- préférer les primitives UI déjà alignées V2 plutôt qu’une surcharge locale ad hoc ;
- utiliser les compositions Tailwind inline recommandées pour la typographie (les classes V2-T sont supprimées) ;
- éviter de recréer localement relief/profondeur si les tokens ou primitives V2 le couvrent déjà ;
- traiter les écarts résiduels au fil de l’eau par micro-corrections ciblées.

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

| À éviter                                     | Remplacer par                                                                                             |
| -------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `border-border-soft`                         | `border-surface-border`                                                                                   |
| `bg-white` / `bg-gray-*`                     | tokens `shell-surface`, `surface-panel`, etc.                                                             |
| `bg-muted/10`                                | `bg-surface-panel-soft` ou `bg-surface-subtle` selon le niveau                                            |
| `border-border/60` ou `border-border/70`     | `border-surface-border-subtle`, `border-surface-border` ou `border-shell-border-strong` selon le contexte |
| `text-gray-*`                                | `text-muted-foreground`, `text-hero-ink-soft`, etc.                                                       |
| `text-muted-foreground` utilisé partout      | `text-text-muted-strong` / `text-text-muted-soft` quand un niveau V2 explicite existe                     |
| Valeurs arbitraires shadow (`shadow-[...]`)  | `shadow-{soft,card,raised,overlay}`                                                                       |
| Valeurs arbitraires radius (`rounded-[...]`) | steps du radius scale                                                                                     |
| Valeurs arbitraires texte (`text-[11px]`)    | Compositions Tailwind inline recommandées (voir section _Patterns typographiques recommandés_)            |

---

## Dark mode

Tous les tokens sont définis pour `:root` (light) et `.dark` dans le fichier de thème actif.
Ne jamais hardcoder des valeurs dark (`dark:bg-gray-900`) — utiliser les tokens qui s'adaptent automatiquement.

Exception : les tokens `--band-*` sont always-dark par design — intentionnellement identiques en `:root` et `.dark`.

---

## Interdits absolus

- Hardcodes inline arbitraires (`shadow-[0_18px_45px_rgba(...)]`, `rounded-[1.75rem]`, `text-[9px]`)
- Duplication d'un pattern déjà couvert par une classe utilitaire
- Surcouches locales de relief/profondeur quand les tokens V2 couvrent déjà le besoin
- Token de couleur utilisé comme shadow
- Création de token sans besoin systémique documenté
- Logique métier dans les composants de présentation
- Modification du thème actif sans couvrir les deux modes light + dark
- Valeurs concrètes dans `theme.css` — ce fichier mappe, il ne définit pas
- Directives Tailwind (`@apply`, `@theme`) dans un fichier `themes/*.css`
- Recréer `typography.css` ou tout fichier CSS dédié à la typographie
- Créer des fichiers CSS par feature (`boutique.css`, `product-card.css`, `checkout.css`, etc.)
- Utiliser les classes V2-T supprimées (`.text-title-*`, `.text-price-*`, `.text-eyebrow`, etc.)
- Ajouter des tokens typo custom (`--text-eyebrow`, `--leading-price`, `--font-eyebrow`, etc.) sans décision explicite
- Utiliser `dark:prose-invert` — les tokens du design system gèrent le dark mode automatiquement
- Disperser `color-mix(...)` dans les composants si un token existant suffit
- Utiliser des valeurs arbitraires (`text-[11px]`, `tracking-[0.1em]`) si une scale Tailwind standard couvre le besoin
- Supprimer les tokens `--chart-*` tant que `recharts` est dans les dépendances
- Modifier `novamart.css` sans demande explicite

## Règle de maintenance

- ne plus lancer de lot design system large sans problème transversal démontré ;
- privilégier les micro-corrections locales quand un écran justifie un ajustement ;
- pour toute nouvelle feature, partir par défaut des primitives V2 et des tokens du design system — les classes V2-T sont supprimées, utiliser Tailwind natif.

---

## Doctrine CSS pour agents IA

Règles courtes et actionnables. Un agent IA doit les appliquer sans interprétation.

- Ne pas créer de fichier CSS feature sans justification forte et validation explicite.
- Ne pas réintroduire `typography.css` ou tout équivalent.
- Ne pas créer de classes CSS globales comme `.eyebrow`, `.price`, `.product-card` si Tailwind natif suffit.
- Utiliser Tailwind inline pour tous les composants UI.
- Utiliser `prose` uniquement pour contenu riche éditorial ou CMS (descriptions produit, articles, blocs markdown).
- Utiliser `theme.css` uniquement pour exposer des tokens via `@theme inline` — pas pour créer une échelle typo maison, pas de valeurs concrètes.
- Utiliser les fichiers `themes/creatyss.*.css` pour toutes les valeurs de thème (couleurs, radius, shadows).
- Ne pas modifier `novamart.css` sans demande explicite.

---

## Choisir le bon endroit

Tableau décisionnel avant toute intervention sur les styles.

| Besoin                                            | Fichier / Approche                                                           |
| ------------------------------------------------- | ---------------------------------------------------------------------------- |
| Couleur / surface / radius / shadow / breakpoint  | `themes/creatyss.*.css` + mapping `theme.css` si utility Tailwind nécessaire |
| Reset HTML global                                 | `base.css`                                                                   |
| Contenu éditorial riche (CMS, markdown, articles) | `prose` via `@tailwindcss/typography` — dans le TSX du composant             |
| Composants UI                                     | Classes Tailwind dans le TSX                                                 |
| Backdrop/blur shell (header public)               | `shell.css` — utiliser `.site-header-blur`, ne pas reproduire le pattern     |
| Motion globale                                    | `motion.css`                                                                 |
| Keyframes                                         | `animation.css`                                                              |
| Nouvelle classe CSS globale                       | Refuser sauf besoin démontré non couvrable par Tailwind                      |

---

## Patterns typographiques recommandés

Ces patterns sont des **compositions Tailwind inline** à utiliser dans les composants.
Ce ne sont pas des classes globales — elles n'existent dans aucun fichier CSS.

**Eyebrow / overline :**

```tsx
className = "text-xs font-semibold uppercase tracking-widest leading-snug";
```

Toujours associé à un token de couleur contextuel (`text-brand`, `text-text-muted-soft`, `text-band-eyebrow`, etc.).

**Prix hero :**

```tsx
className = "text-3xl md:text-4xl font-bold leading-none tracking-tight tabular-nums";
```

**Prix compact :**

```tsx
className = "text-2xl md:text-3xl font-bold leading-tight tracking-tight tabular-nums";
```

**Contenu riche (CMS, descriptions produit, markdown) :**

```tsx
className =
  "prose prose-sm max-w-none text-foreground [&_p:first-child]:mt-0 [&_p:last-child]:mb-0";
```

Utiliser `max-w-[68ch]` pour les descriptions longues.
Ne pas utiliser `dark:prose-invert` — les tokens du design system gèrent le dark mode automatiquement.

---

## Checklist avant validation CSS

Commandes à exécuter depuis la racine du repo avant de valider un lot CSS.

```bash
# Vérifier qu'aucun fichier supprimé n'a été réintroduit
rg "typography\.css|boutique-controls|boutique-products|creatyss\.css" app docs --no-ignore

# Vérifier l'absence de classes CSS custom réintroduites
rg "text-eyebrow|text-price|tracking-eyebrow|leading-eyebrow|\.eyebrow|\.price\b" app components features docs --no-ignore

# Build statique
pnpm exec tsc --noEmit
pnpm lint
```

Vérification visuelle obligatoire si un changement impacte des composants storefront ou admin.
