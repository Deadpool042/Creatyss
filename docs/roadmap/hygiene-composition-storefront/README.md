# Hygiène de composition storefront

Chantier cross-cutting, hors séquence H1-H4 de valeur métier. Déclenché par une demande initiale de traiter le storefront public "façon macOS", sur le modèle du chantier admin `docs/roadmap/admin-design-macos/README.md`. Un audit préalable (2026-07-07) a écarté ce vocabulaire : le storefront n'a pas d'écrans comparables (listes avec tri/sélection/bulk actions, navigation de réglages) à ceux que le pattern macOS traite. Il a en revanche révélé de vrais écarts de composition et de discipline design-system, indépendants de toute question d'esthétique "macOS" — ce chantier les cadre sous son propre nom.

## Ce que ce chantier touche — et ce qu'il ne touche pas

- **Touche** : composition et hygiène des classes utilitaires déjà couvertes par le design system (empty states, formulaires, remplacement de valeurs Tailwind arbitraires par les tokens/scales existants).
- **Ne touche pas** : l'identité visuelle storefront elle-même (typographie serif des titres, ton "atelier", ambiance chaleureuse — observée cohérente sur `a-propos`, `les-marches`, `compte`, `categories`, `contact`) ni le système de tokens (`app/styles/theme.css`, `themes/creatyss.*.css`). Aucune modification prévue de ces fichiers dans ce chantier — cf. garde-fou V2, `docs/architecture/90-reference/design-system.md`, section "Règle de maintenance" ("ne plus lancer de lot design system large sans problème transversal démontré").

## État observé (2026-07-07, audit `architect-review`)

Deux registres distincts coexistent sur `app/(public)/**` :

**Déjà cohérent** :

- Header serif partagé (`font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl`) sur les pages éditoriales (`a-propos/page.tsx:27`, `les-marches/page.tsx:28`, `compte/page.tsx:19`, `contact/page.tsx`).
- Pages légales (mentions légales, CGV, confidentialité, politique de retour) : composant partagé `LegalPageTemplate` (`components/storefront/legal/legal-page-template.tsx`).
- Liens "Retour" du tunnel panier/checkout : classe strictement identique sur les 3 occurrences (`panier/page.tsx:175-179`, `checkout/page.tsx:495-499`, `:706-710`).

**Écarts réels** :

- **Empty states** : au moins 5 implémentations différentes, aucun composant partagé. `panier`/`checkout` utilisent une classe `.empty-state` **introuvable dans tout fichier CSS du repo** — probablement un vestige de l'ancien `boutique.css` supprimé lors de la migration Tailwind (`design-system.md:59-62`). `favoris`, `categories`, `blog` ont chacun leur markup ad hoc. `boutique` a un composant dédié (`BoutiqueEmptyState`) non réutilisé ailleurs. À comparer à l'admin, qui a un `AdminEmptyState` unique réutilisé sur 9+ écrans.
- **Formulaires** : le formulaire de contact (`contact/page.tsx`) construit ses champs en `<label>`/`<input>` HTML brut ; `panier`/`checkout` sont les seuls écrans storefront à utiliser le composant `<Label>` du design system. Deux structures différentes pour un même besoin.
- **Valeurs Tailwind arbitraires** (interdit explicite, `design-system.md` "Interdits absolus" et tableau "Alias dépréciés/à éviter") : `text-[0.72rem]`, `text-[13px]`, `text-[11px]`, `text-[0.95rem]`, `text-[0.62rem]`, `text-[0.68rem]` — dizaine d'occurrences sur `panier`, `checkout`, `checkout/confirmation`, `contact`, `compte`, `blog`, `blog/[slug]`.
- **`bg-white/80`** en dur dans `checkout/page.tsx:236,292,356,516` — violation directe de l'alias déprécié documenté (`bg-white`/`bg-gray-*` → tokens `shell-surface`/`surface-panel`).

## Ce qui distingue ce chantier de la remédiation admin (macOS)

Contrairement à l'admin, le storefront a une identité typographique volontaire et déjà cohérente sur ses pages éditoriales — ce chantier ne cherche pas à imposer une signature de composition unique comme le "toolbar unifiée" macOS, mais à faire respecter des règles déjà documentées (tokens, scales) là où elles sont contournées, sans toucher au ton ni à la mise en page éditoriale.

## Proposition de découpage en lots (aucun engagement de calendrier, aucune implémentation dans ce document)

1. **Nettoyer la classe morte `.empty-state`** — supprimer la référence orpheline sur `panier`/`checkout`, vérifier qu'aucun style n'en dépendait réellement (probable no-op visuel, à confirmer en navigateur avant/après). **Livré (2026-07-07)** : ce n'était pas un no-op — les 3 empty states (panier vide, checkout vide, commande indisponible) rendaient en HTML non stylé (classe inexistante). Remplacés par le même habillage que `BoutiqueEmptyState` (`rounded-lg border border-surface-border-subtle/70 bg-surface-panel/30 p-6`, tokens existants, aucune valeur arbitraire). Vérifié en navigateur avant/après sur `/panier` et `/checkout`.
2. **Unifier les empty states** — un composant partagé équivalent à `AdminEmptyState`, adopté par `panier`, `checkout`, `favoris`, `categories`, `blog` (et `boutique` si `BoutiqueEmptyState` s'y prête sans régression). **Livré (2026-07-07)** : `components/storefront/storefront-empty-state.tsx` (eyebrow + titre serif + description + action), adopté sur les 7 occurrences (panier, checkout ×2, favoris, categories, blog, boutique via refactor de `BoutiqueEmptyState`). `<h2>` sans classe partout (bug latent, hérité du même défaut que la classe `.empty-state` du lot 1) désormais stylé. Vérifié en navigateur sur panier, checkout et blog ; categories/favoris confirmés par lecture de code (données seed non vides dans cette session, logique strictement identique aux écrans déjà vérifiés).
3. **Unifier les formulaires** — aligner `contact/page.tsx` sur les composants `<Label>`/`<Input>` déjà utilisés par `checkout`. **Livré (2026-07-07)** : `Label`/`Input`/`Textarea` du design system adoptés (prénom, nom, email, message) ; le champ Sujet reste un `<select>` natif (pas de `Select` shadcn câblé nulle part côté storefront — Radix Select ne soumet pas via `FormData` natif sans JS supplémentaire), stylé avec les mêmes classes tokens que `Input`. Vérifié en navigateur : rendu inchangé, soumission réelle testée (Mailpit) avec succès.
4. **Remplacer les valeurs Tailwind arbitraires** par les scales/tokens standard (`text-xs`/`text-sm` etc.) sur les fichiers listés ci-dessus. **Livré (2026-07-07)** : `text-[0.72rem]` → `text-xs`, `text-[0.95rem] text-foreground/68` → `text-sm text-muted-foreground` (déjà le pattern voisin identique dans les mêmes fichiers, ex. `panier/page.tsx:116`), `text-[13px]`/`text-[10px]`/`text-[0.62rem]`/`text-[0.68rem]` → `text-xs`/`text-sm`, sur `panier`, `checkout`, `checkout/confirmation`, `contact`, `compte`, `blog`, `blog/[slug]`. Tailles serif éditoriales (`text-[2.4rem]`, `text-[2.6rem]`, `text-[1.1rem]` des titres `blog`) laissées hors périmètre — identité typographique volontaire, non listée dans les écarts initiaux. Vérifié : typecheck + lint clean ; rendu navigateur inchangé sur `blog`, `contact`, `compte` (contenu visible directement) ; `panier`/`checkout` vérifiés par lecture de code et cohérence avec les classes identiques déjà présentes dans les mêmes fichiers — le panier n'a pas pu être peuplé dans cette session de navigateur pour capture directe des lignes de panier.
5. **Remplacer `bg-white/80`** par le token `surface-panel` (ou équivalent) dans `checkout/page.tsx`. **Livré (2026-07-07)** : `bg-surface-panel` (opacité pleine en light ≈ blanc quasi-opaque, ≈13% en dark) sur les 4 sections imbriquées (`checkout/page.tsx:237,293,357,517`) — reprend le même effet visuel qu'un fond quasi-blanc en light tout en s'adaptant au dark mode, contrairement au blanc en dur. Vérifié en navigateur, light et dark mode.

Aucun ordre imposé entre les lots 1-5 : aucune dépendance croisée identifiée. Le lot 1 est le plus isolé et le plus sûr pour démarrer.

## Risques

- Toute correction visuelle sur un tunnel de conversion (panier/checkout) doit être vérifiée en navigateur avant/après — pas seulement typecheck/lint, cf. `docs/roadmap/h1-boutique-vendable/lot-recette-complete.md` pour le niveau d'exigence attendu sur ce tunnel.
- Le remplacement de `bg-white/80` doit être vérifié en light **et** dark mode (le token cible doit couvrir les deux, cf. garde-fou V2).

## Hors périmètre de ce document

Toute implémentation. Chaque lot listé doit être vérifié et livré séparément.
