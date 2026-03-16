# V15-5 — Selective public registry extraction

## Statut

**Validé. Extraction ultra-sélective : 2 items extraits. Storefront local conservé.**

---

## Objectif du lot

Déterminer s'il existe dans le repo un très petit nombre de patterns publics réellement neutres, sobres et réutilisables, qui méritent de sortir en registry sans figer le storefront Creatyss.

---

## Audit des candidats publics

### Méthode

Analyse de tous les fichiers sous `components/` (hors `components/admin/` et `components/ui/`) et sous `components/ui/` pour identifier les patterns sans couplage Creatyss.

### Résultats de l'audit

#### Storefront public — 0 pattern extractible

| Composant | Raison du refus |
|-----------|----------------|
| `components/public/public-site-shell.tsx` | Nom "Creatyss" hardcodé, logo `/uploads/logo.svg`, nav links hardcodés ("Accueil", "Boutique", "Blog"), labels français, variables CSS `--shell-*` spécifiques |
| `app/page.tsx` (homepage) | Storytelling Creatyss, données catalogue, labels français, classes CSS spécifiques |
| `app/boutique/` | Catalogue Creatyss, modèle de données spécifique, français |
| `app/blog/` | Narration éditoriale Creatyss, français |
| `app/panier/` `app/checkout/` | Logique métier panier/commande, "France" hardcodé |

**Conclusion storefront** : rien n'est extractible tel quel. Tout le storefront est couplé au projet Creatyss.

#### `components/ui/` — candidats génériques

| Composant | Extractible ? | Raison |
|-----------|---------------|--------|
| `empty.tsx` | **OUI** | Compound empty state, zéro couplage, 100% token-driven, API propre |
| `spinner.tsx` | **OUI** | Trivial, universel, zéro couplage |
| `item.tsx` | Pas dans V15-5 | Excellente primitive liste, mais pas un pattern public storefront — V15-6 |
| `field.tsx` | Pas dans V15-5 | Excellente primitive formulaire, idem — V15-6 |
| `input-group.tsx` | Pas dans V15-5 | Primitive formulaire — V15-6 |
| `data-table.tsx` | NON | Strings français hardcodées ("Filtrer...", "Aucun résultat.", "Précédent", "Suivant") |
| `combobox.tsx` | NON | Dépendance `@base-ui/react` non standard, complexité élevée |

#### Artefacts scaffold (hors périmètre)

- `components/section-cards.tsx` — aucune prop, données hardcodées, résidu shadcn scaffold
- `components/site-header.tsx` — lien GitHub shadcn hardcodé, "Documents", résidu scaffold

---

## Patterns retenus

### `empty` — Compound empty state

**Fichier** : `components/ui/empty.tsx`

**Pourquoi** :
- Explicitement mentionné comme cible probable dans le roadmap V15-5
- Composant compound : `Empty`, `EmptyHeader`, `EmptyMedia`, `EmptyTitle`, `EmptyDescription`, `EmptyContent`
- Zéro contenu Creatyss
- 100% token-driven : `bg-muted`, `text-muted-foreground`, `text-foreground`, `text-primary`
- API simple et extensible via `className`
- CVA pour les variants `EmptyMedia` (`default` / `icon`)
- Utilisable dans n'importe quel projet : panier vide, résultats vides, erreurs, états initiaux

**Compatible thèmes** : oui — `creatyss.css` et `novamart.css` utilisent les mêmes tokens.

### `spinner` — Loading spinner

**Fichier** : `components/ui/spinner.tsx`

**Pourquoi** :
- Composant trivial, universellement utile
- Zéro couplage, zéro contenu projet
- `role="status"` + `aria-label="Loading"` corrects
- `currentColor` via lucide — s'adapte automatiquement au contexte
- 7 lignes, aucune surprise

**Compatible thèmes** : oui — hérite de `currentColor`, aucun token spécifique requis.

---

## Patterns explicitement refusés

### Storefront public

Tout le storefront public est refusé. La raison est simple et systématique : **chaque composant public porte l'identité narrative de Creatyss** — nom de marque, langue française, liens catalogue, variables CSS spécifiques, ou logique métier propre au projet.

Extraire quoi que ce soit du storefront public tel quel reviendrait à extraire Creatyss, pas un pattern réutilisable.

### `item`, `field`, `input-group`

Ces composants sont d'excellentes primitives UI génériques. Ils sont cependant :
- des primitives transverses (admin + public), pas des patterns publics storefront spécifiques
- mieux placés dans un lot de consolidation des primitives UI (V15-6)

Leur exclusion de V15-5 n'est pas un refus — c'est un report au bon lot.

### `data-table`

Strings français hardcodées dans la pagination et les états vides. Pas extractible sans ajouter une couche i18n ou des props de texte, ce qui sort du périmètre.

### `auth-shell`

Une couleur warm amber hardcodée (`rgba(217,119,6,0.14)`) dans un dégradé décoratif. Techniquement mineur, mais aussi hors du périmètre "public storefront" de V15-5.

---

## Modifications appliquées

### Nouveaux fichiers registry

- `registry/items/empty.json` — item avec contenu inline, type `registry:ui`
- `registry/items/spinner.json` — item avec contenu inline, type `registry:ui`

### `registry/index.json`

Ajout des deux entrées `empty` et `spinner`.

### Aucune modification du code applicatif

Les fichiers `components/ui/empty.tsx` et `components/ui/spinner.tsx` sont inchangés. L'extraction est additive.

---

## Typecheck

```
pnpm run typecheck → clean (0 erreur)
```

---

## Impact sur le registry

Le registry passe de 6 à 8 items :

| # | Nom | Type | Couche |
|---|-----|------|--------|
| 1 | `notice` | `registry:component` | Transverse |
| 2 | `section-intro` | `registry:component` | Transverse |
| 3 | `admin-form-actions` | `registry:component` | Admin |
| 4 | `admin-form-field` | `registry:component` | Admin |
| 5 | `admin-page-shell` | `registry:component` | Admin |
| 6 | `admin-form-section` | `registry:component` | Admin |
| 7 | `empty` | `registry:ui` | Transverse |
| 8 | `spinner` | `registry:ui` | Transverse |

---

## Impact sur le theming

Les deux items extraits sont entièrement pilotés par tokens :

- `empty` : `bg-muted`, `text-muted-foreground`, `text-foreground`, `text-primary` — tokens présents dans `creatyss.css` et `novamart.css`
- `spinner` : hérite de `currentColor` — aucun token spécifique requis

**Les deux items fonctionnent sans modification sur les deux thèmes.**

---

## Conclusion

### Extraction publique utile, mais limitée

L'extraction publique de V15-5 produit 2 items.

Ce chiffre est volontaire et honnête.

Le storefront Creatyss est trop couplé à l'identité du projet pour en sortir des patterns génériques sans réécriture. Ce n'est pas un problème — c'est la nature normale d'un storefront e-commerce.

Les seuls patterns publics réellement neutres et extractibles en l'état sont `empty` et `spinner`, deux composants sans aucun contenu Creatyss, entièrement pilotés par les tokens du thème.

### Ce qui attend V15-6

Les primitives UI génériques `item`, `field`, `input-group` sont des candidats forts pour V15-6 (consolidation registry). Elles n'ont pas été extraites ici car elles sont des primitives transverses, pas des patterns publics storefront.

---

## Suite logique

V15-5 étant clos, la suite est **V15-6 — Registry consolidation and documentation**.
