# Doctrine design system public — V9

## Principe fondateur

Le front public Creatyss est un espace distinct de l'admin. Il dispose de son propre namespace CSS, de ses propres patterns structurels, et n'emprunte pas aux classes admin.

Cette séparation n'est pas cosmétique : elle garantit que les évolutions de l'admin n'ont pas d'effet de bord sur le public, et que le nettoyage CSS d'un côté ne risque pas de casser l'autre.

## Les cinq principes directeurs

### 1. Namespace clair avant tout

Aucune classe CSS préfixée `admin-*` ne doit apparaître dans une page ou composant public. Le front public a son propre namespace, sans règle implicite d'héritage depuis l'admin.

Un formulaire public utilise `.form-field`, pas `.admin-field`. Un message d'erreur public utilise `.notice-error`, pas `.admin-alert`. Le nom doit décrire la fonction dans le contexte public.

### 2. Token V8 avant valeur arbitraire

Les tokens CSS posés en V8 sont disponibles : `--brand`, `--background`, `--foreground`, `--muted-foreground`, `--border`, `--ring`, etc. Toute couleur, fond ou bordure récurrente dans le public doit utiliser un token plutôt qu'une valeur RGBA ou hexadécimale codée en dur.

Ce principe s'applique en particulier aux composants persistants comme le shell public.

### 3. Simplicité structurelle

Une page publique V9-compliant n'a pas besoin d'abstractions. Les patterns récurrents — en-tête de page, grille de cartes, état vide, section, formulaire — sont définis une fois dans `globals.css` et réutilisés directement dans les pages, sans composant wrapper intermédiaire si ce n'est pas nécessaire.

Ne pas créer de composant public pour quelque chose qui est, dans les faits, un pattern CSS réutilisable.

### 4. Lisibilité du balisage

Le nom d'une classe CSS publique doit être immédiatement lisible par quelqu'un qui ne connaît pas l'admin. `.form-field` est lisible. `.form-section` est lisible. `.admin-homepage-section` dans une page de checkout ne l'est pas.

La lisibilité bénéficie à la maintenance : on peut renommer ou supprimer une classe admin sans chercher si elle est utilisée dans le public.

### 5. Cohérence structurelle

Les pages publiques partagent les mêmes patterns d'en-tête, de section, de grille et d'état vide. Ces patterns sont documentés. Une nouvelle page ou une modification doit respecter les patterns existants plutôt qu'en inventer de nouveaux.

## Critères de conformité V9 pour une page publique

Une page ou composant public est V9-compliant si :

- [ ] Il n'utilise aucune classe `admin-*`
- [ ] Il n'utilise aucune valeur de couleur codée en dur (`#xxx`, `rgb(...)`, `rgba(...)`) là où un token CSS est disponible
- [ ] Les messages de feedback utilisent `.notice-success` et `.notice-error` (avec `role="alert"` sur les erreurs)
- [ ] Les champs de formulaire utilisent les classes publiques définies : `.form-field`, `.form-input`, `.form-checkbox`, `.form-section`, `.form-panels`, `.form-actions`, `.form-note`
- [ ] Les patterns structurels respectent les classes documentées : `.page-header`, `.section`, `.section-header`, `.card-grid`, `.store-card`, `.empty-state`
- [ ] Les badges de statut utilisent `.status-tag` et `.status-tag-group`

## Ce que la doctrine V9 ne prescrit pas

**Shadcn dans le public :** le shell public utilise déjà Button et Sheet. V9 ne prescrit pas de généraliser l'usage de shadcn dans les pages publiques, mais ne l'interdit pas non plus. La décision se fait au cas par cas selon la complexité du composant.

**Dark mode public :** hors périmètre V9. Le public n'a pas de ThemeProvider ; l'introduire est un scope distinct, non trivial.

**Composants publics extraits :** V9 ne demande pas d'extraire des composants React depuis les pages publiques. Si un pattern CSS suffit, un composant n'est pas nécessaire.

## Hiérarchie de décision pour une classe CSS publique

1. Pattern documenté dans `globals.css` (`.form-field`, `.store-card`, `.page-header`, etc.)
2. Classe Tailwind utilitaire directe
3. Token CSS via `var(--xxx)`
4. Nouvelle classe publique dans `globals.css` si le pattern est récurrent
5. Valeur arbitraire Tailwind (`[...]`) uniquement en dernier recours et pour des cas non thémables

## Relation avec V8

V9 ne modifie pas le système de tokens V8 ni les composants admin. Il consomme les tokens existants sans les altérer. La règle est : V9 prolonge V8, ne le contredit pas.
