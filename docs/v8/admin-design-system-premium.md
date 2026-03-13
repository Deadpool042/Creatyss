# V8 — Doctrine Design System Premium Admin

## Positionnement

V8 est une phase d'élévation qualitative. Elle ne refondit pas l'architecture ni la logique métier — elle nettoie, consolide et affine l'interface admin bâtie en V7.

"Premium" ne signifie pas plus de complexité. Il signifie :
- **cohérence** : mêmes tokens, mêmes composants, mêmes comportements dans toute l'interface
- **sobriété** : rien d'inutile, rien de décoratif sans raison
- **contrôle** : chaque décision visuelle est traçable — un token, un composant, une règle

Le résultat attendu est une interface admin qui se tient visuellement, qui fonctionne correctement en dark mode, dont le shell est ergonomique sur desktop, et dont la base de code ne mélange plus deux systèmes de style en tension.

---

## Principes directeurs

### 1. Le token avant la valeur arbitraire
Toute valeur visuelle récurrente (couleur, rayon, espacement significatif) doit être un token CSS. Une valeur arbitraire Tailwind est acceptable pour un usage unique et contextuel. Elle devient une dette dès qu'elle se répète.

### 2. Le composant shadcn avant la classe CSS
Quand un composant shadcn/ui couvre le besoin, on l'utilise. On ne crée pas de composant custom si un primitif existant suffit. On n'utilise pas une classe CSS legacy si un composant shadcn remplit la même fonction.

### 3. La migration avant le nettoyage
On ne supprime pas une classe CSS legacy avant que tous ses usages aient été migrés. La coexistence temporaire est préférable à une suppression prématurée qui casse le rendu.

### 4. Le dark mode n'est pas un bonus
Le dark mode est un sous-système de cohérence UX, pas une vérification optionnelle. Chaque surface qui repose sur un token est dark compliant par construction. Chaque surface qui repose sur une valeur codée en dur est une dette dark mode.

### 5. Pas de dépendance sans besoin démontré
Aucune nouvelle dépendance npm n'est introduite en V8 sans nécessité explicite. Les composants shadcn déjà présents dans `components/ui/` mais non installés (recharts, calendar, etc.) restent en l'état.

---

## Critères de qualité V8

Un composant est considéré **V8-conforme** quand :
- il ne contient aucune valeur de couleur en dur (hex, rgb, hsl) — uniquement des tokens ou des utilities Tailwind sémantiques
- il n'importe aucune classe CSS legacy comme source de vérité pour son rendu visuel
- il fonctionne en dark mode sans ajustement manuel supplémentaire
- il utilise les primitives `components/ui/` disponibles plutôt que de les recréer

Une page est **V8-conforme** quand tous ses composants le sont, et quand sa mise en page est cohérente avec les autres pages admin (structure d'en-tête, espacements, hiérarchie typographique).

---

## Hiérarchie de décision

Face à un besoin de style ou de composant, l'ordre d'évaluation est :

1. **shadcn/ui** — un primitif dans `components/ui/` couvre-t-il le besoin ?
2. **Tailwind utilities** — une combinaison de classes utilitaires suffit-elle ?
3. **CSS custom property** — la valeur doit-elle être un token réutilisable ?
4. **Composant admin custom** (`components/admin/`) — le besoin est-il spécifique à l'admin et récurrent ?
5. **CSS legacy toléré provisoirement** — uniquement si la migration n'est pas encore réalisée dans ce lot

Descendre dans cette hiérarchie se justifie. Sauter une étape sans raison ne se justifie pas.

---

## V8 et shadcn/ui — ce que le MCP apporte

V8 s'appuie sur une consultation explicite des blocks, de la documentation et des patterns shadcn/ui via le MCP. Ce n'est pas une reprise mécanique — c'est une référence de direction que Creatyss adapte à son contexte.

### Ce qui a été consulté

- Block `sidebar-07` : sidebar icon-collapse avec `SidebarRail`, `SidebarMenuButton` tooltip, état persisté via cookie
- Block `sidebar-16` : sidebar avec header intégré, gestion de l'identité utilisateur
- Documentation tokens OKLCH : variables `--sidebar-*`, stratégie light/dark dans `globals.css`
- Block `card` avec `CardAction` : slot d'action inline dans les cards
- Documentation dark mode shadcn : stratégie `.dark {}` + `next-themes`, variables sémantiques
- Blocks démonstratifs (dashboard avec recharts, calendar, drawer, command palette)

### Ce qu'on retient

| Élément | Pourquoi |
|---|---|
| Pattern `sidebar-07` (icon-collapse + `SidebarRail`) | Correspond exactement au besoin ergonomique desktop : sidebar réductible, tooltips en mode icon, handle visuel |
| `SidebarMenuButton` avec prop `tooltip` | API native shadcn, s'active automatiquement en mode icon — zéro code supplémentaire |
| Namespace `--sidebar-*` pour tous les tokens sidebar | Cohérence avec shadcn, dark mode natif si les tokens sont bien déclarés dans `.dark {}` |
| Tokens OKLCH dans `globals.css` (stratégie `:root` / `.dark`) | Bon modèle pour introduire `--brand` sur la même logique |
| Stratégie dark mode via classe `.dark` sur `<html>` | Compatible `next-themes`, simple, fiable |

### Ce qu'on adapte

| Élément | Adaptation |
|---|---|
| Token `--brand` | N'existe pas dans shadcn — on l'introduit sur le même modèle que les autres tokens OKLCH, avec valeur light et dark distinctes si nécessaire |
| Block `sidebar-16` (user card dans header) | On s'en inspire pour le positionnement de l'info utilisateur, mais on garde la structure admin actuelle — pas de reprise verbatim du block |
| `CardAction` | Introduit seulement là où une action inline sur card est utile — pas ajouté systématiquement |
| Persistance état sidebar | shadcn utilise un cookie (`SIDEBAR_COOKIE_NAME`) — on laisse ce mécanisme natif fonctionner sans le surcharger |

### Ce qu'on écarte et pourquoi

| Élément | Raison |
|---|---|
| **Recharts** (`chart.tsx`) | Dépendance lourde (~500 Ko), aucun graphique dans l'admin actuellement, pas de besoin démontré |
| **react-day-picker** (`calendar.tsx`) | Idem — aucun sélecteur de date dans les formulaires actifs |
| **Sonner** (`sonner.tsx`) | Notifications toast non utilisées — pas de comportement asynchrone visible nécessitant une notification |
| **Vaul** (`drawer.tsx`) | Drawer non nécessaire dans les parcours admin actuels |
| **Command palette** | Trop complexe, trop démonstratif, hors besoin actuel |
| **Nested sidebars** | Sur-ingénierie pour un admin à navigation plate |
| **RHF / TanStack Form** | Pas de framework de formulaires — les formulaires admin sont gérés via Server Actions + HTML natif |

La règle : on n'introduit pas une dépendance parce qu'elle est présente dans un block shadcn. On l'introduit seulement si le besoin est présent dans l'interface Creatyss.

---

## Dark mode — sous-système de cohérence UX

Le dark mode n'est pas une vérification de fin de lot. C'est un chantier de cohérence qui traverse toute la phase V8.

### Stratégie technique

- Classe `.dark` sur `<html>` via `next-themes`
- Toutes les valeurs visuelles passent par des tokens CSS sémantiques déclarés dans `:root {}` et `.dark {}`
- Aucune valeur codée en dur (`#hex`, `rgb()`, `hsl()` fixes) dans les composants actifs

### Surfaces à couvrir

| Surface | Tokens concernés |
|---|---|
| Fond page | `--background`, `--foreground` |
| Sidebar | `--sidebar-background`, `--sidebar-foreground`, `--sidebar-border`, `--sidebar-accent` |
| Cards et panneaux | `--card`, `--card-foreground`, `--border` |
| Formulaires (champs, labels) | `--input`, `--ring`, `--muted`, `--muted-foreground` |
| Boutons | `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground` |
| États destructifs | `--destructive`, `--destructive-foreground` |
| Couleur de marque | `--brand` — doit être lisible sur fond dark |
| Hover et focus | `--accent`, `--accent-foreground`, `--ring` |
| Badges et statuts | Variants `Badge` — vérifier contraste en dark |
| États vides | `--muted-foreground` suffisant si composant tokenisé |

### Critère de validation dark mode

Une surface est **dark compliant** quand elle affiche correctement sans aucune valeur codée en dur, uniquement via les tokens ci-dessus. Le test minimal : activer dark mode via `next-themes`, parcourir chaque surface listée, vérifier lisibilité et contraste.

---

## Stratégie de sortie du CSS legacy

### Principe : progressive et contrôlée

La sortie du CSS legacy n'est pas un objectif immédiat — c'est la conséquence des migrations. On ne supprime pas parce qu'on veut nettoyer : on supprime parce qu'un composant a été migré et que la classe est devenue orpheline.

### Les trois stades

| Stade | Signification | Condition |
|---|---|---|
| **Coexistence** | Classe legacy présente dans le CSS et dans le composant | Composant non encore migré — état normal en V8-3/V8-4 |
| **Désactivation** | Classe legacy présente dans le CSS, absente des composants | Composant migré, nettoyage CSS pas encore fait |
| **Suppression** | Classe retirée du fichier CSS | Vérifié : zéro usage dans `app/` et `components/` |

### Condition de suppression

Avant de retirer une règle CSS legacy :
1. Grep d'absence : aucune occurrence dans `app/`, `components/`, `styles/` (hors définition CSS elle-même)
2. Test visuel : les pages qui utilisaient ce composant s'affichent identiquement
3. Typecheck passe

La suppression se fait par **bloc logique** (une classe et ses variantes, hover, media queries associées), jamais ligne à ligne.

### Cibles connues

Les classes identifiées comme candidates à la suppression en V8-5, après migration :

| Classe | Dépend de |
|---|---|
| `.admin-chip` | Migration V8-3 (cards) |
| `.admin-product-card`, `.admin-product-tags` | Migration V8-3 |
| `.admin-order-card` | Migration V8-3 |
| `.store-card` | Migration V8-3 |
| `.empty-state` | Migration V8-3 |
| `.admin-shell`, `.admin-nav` | Migration V8-2 |
| `.admin-input` | Migration V8-4 |
| `.admin-homepage-*` | Migration V8-4 |

Cette liste n'est pas exhaustive. Un inventaire final par grep précède V8-5.

---

## Périmètre admin / public léger

### V8 cible d'abord l'admin

La totalité des 5 lots V8 porte sur l'interface d'administration (`app/admin/`, `components/admin/`). C'est là que la dette de cohérence visuelle est la plus forte et la plus impactante.

### Dimension public léger

Certains principes V8 s'appliquent mécaniquement au shell public par construction :
- Les tokens CSS `--brand`, `--background`, `--foreground` sont globaux — le front public en bénéficie dès V8-1
- Le dark mode (stratégie `.dark {}` + `next-themes`) s'applique aux deux interfaces si activé
- Les composants `components/ui/` migrés ou utilisés en V8 sont partagés

Ce n'est pas une refonte du front public. Les pages marketing, le catalogue produit, le panier — tout cela reste hors périmètre V8. Ce qui est inclus côté public : uniquement ce qui est une conséquence naturelle de la normalisation des tokens globaux.

---

## Validation

Chaque lot V8 se termine par :

```bash
pnpm run typecheck
```

Si le lot touche l'UI (tous les lots V8 sauf V8-5 potentiellement) :

```bash
pnpm exec playwright test --grep "admin"
```

Les erreurs typecheck pré-existantes dans les composants shadcn non installés (`calendar.tsx`, `chart.tsx`, `combobox.tsx`, `drawer.tsx`, `dropdown-menu.tsx`, `sonner.tsx`) sont connues, documentées, et ne bloquent pas V8.
