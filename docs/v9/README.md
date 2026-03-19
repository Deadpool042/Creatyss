# V9 — Consolidation du front public

## Positionnement

V8 a stabilisé le design system admin : tokens de marque, dark mode, shell premium, migration des composants, cohérence des pages haute fréquence, nettoyage du CSS legacy côté admin.

V9 est son pendant côté public. Le front public Creatyss doit atteindre le même niveau de rigueur architecturale : namespace CSS propre, utilisation des tokens posés en V8, cohérence structurelle des pages publiques.

V9 n'est pas une refonte visuelle. C'est une consolidation technique.

## Ce que V8 a laissé en suspens côté public

V8-5 a supprimé les classes CSS admin orphelines — mais n'a pu toucher qu'aux classes qui n'étaient plus référencées nulle part. À l'issue de V8, les classes `admin-*` sont encore utilisées dans cinq pages publiques :

| Page                                             | Classes `admin-*` présentes                                                                                                                                                                  |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `app/boutique/page.tsx`                          | `.admin-field`, `.admin-input`, `.admin-checkbox`                                                                                                                                            |
| `app/boutique/[slug]/page.tsx`                   | `.admin-field`, `.admin-input`, `.admin-inline-actions`, `.admin-success`, `.admin-alert`                                                                                                    |
| `app/panier/page.tsx`                            | `.admin-success`, `.admin-alert`, `.admin-field`, `.admin-input`, `.admin-inline-actions`                                                                                                    |
| `app/checkout/page.tsx`                          | `.admin-form`, `.admin-homepage-section`, `.admin-panels`, `.admin-field`, `.admin-input`, `.admin-checkbox`, `.admin-muted-note`, `.admin-inline-actions`, `.admin-success`, `.admin-alert` |
| `app/checkout/confirmation/[reference]/page.tsx` | `.admin-chip`, `.admin-product-tags`, `.admin-muted-note`, `.admin-inline-actions`, `.admin-success`, `.admin-alert`                                                                         |

Par ailleurs, le shell public (`components/public/public-site-shell.tsx`) utilise des valeurs RGBA codées en dur pour les fonds du header et du drawer, sans bénéficier des tokens CSS posés en V8-1.

Il n'existe pas non plus de doctrine CSS propre au front public : pas de critères de conformité, pas de namespace documenté, pas de règles de nommage.

## Objectifs V9

1. **Découplage CSS admin/public** — créer des classes CSS publiques pour remplacer chaque usage de `admin-*` dans les pages publiques.
2. **Alignement tokens** — aligner le shell public sur les tokens CSS déjà disponibles (V8-1).
3. **Cohérence structurelle** — harmoniser les patterns de pages publiques (en-têtes, grilles, états vides).

## Ce que V9 n'est pas

- Pas de refonte visuelle ni de redesign du public.
- Pas d'ajout de features, de pages ou de parcours.
- Pas de dark mode côté public (pas de ThemeProvider public ; scope distinct et non trivial).
- Pas de modifications admin (traité par V8).
- Pas de refonte de la logique checkout (les Server Actions, la validation et le comportement ne changent pas).
- Pas de i18n, SEO avancé, ni d'optimisations de performance.

## Lots

| Lot  | Titre                         | Prérequis              |
| ---- | ----------------------------- | ---------------------- |
| V9-1 | Découplage CSS public/admin   | —                      |
| V9-2 | Shell public et tokens V8     | V8-1 complété (acquis) |
| V9-3 | Cohérence des pages publiques | V9-1 complété          |

**Séquence :**

```
V9-1 ──────────────────────────────▶ V9-3
  │
V9-2 (parallèle possible avec V9-1)
```

V9-2 est indépendant de V9-1 et peut être traité simultanément — il ne concerne que le shell.
V9-3 dépend de V9-1 : il s'appuie sur les classes publiques créées dans ce premier lot.

## Lecture recommandée

1. `docs/v9/public-ui-doctrine.md` — doctrine et critères de conformité
2. `docs/v9/public-ui-roadmap.md` — inventaire détaillé, dépendances, critères de clôture
3. `docs/v9/lots/v9-1-decouplage-css-public.md`
4. `docs/v9/lots/v9-2-public-shell-tokens.md`
5. `docs/v9/lots/v9-3-public-pages-coherence.md`
