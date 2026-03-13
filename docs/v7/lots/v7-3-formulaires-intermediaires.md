# Lot V7-3 — Formulaires intermédiaires

Cadre général : `docs/v7/admin-ui-ux-doctrine.md`
Roadmap : `docs/v7/admin-ui-ux-roadmap.md`

---

## Objectif

Découper les pages formulaires intermédiaires en composants de section colocalisés. Poser une base de formulaire admin sobre et réutilisable dans `components/admin/`.

Les 5 sections de `homepage/page.tsx` sont déjà extraites. Les composants de base (`AdminFormField`, `AdminFormSection`, `AdminFormActions`) existent déjà. Ce lot vise à stabiliser et compléter cet ensemble.

---

## Périmètre

- `app/admin/(protected)/homepage/page.tsx` — 5 sections extraites en composants colocalisés ; `page.tsx` réduit à l'orchestration
- `app/admin/(protected)/products/new/page.tsx` — page déjà claire ; usage cohérent des composants admin de formulaire
- Composants de formulaire admin dans `components/admin/` : `AdminFormField`, `AdminFormSection`, `AdminFormActions`

### Sections de `homepage/page.tsx`

- Bannière principale (titre, texte, image)
- Bloc éditorial
- Produits mis en avant
- Catégories mises en avant
- Articles mis en avant

### Responsabilités de `page.tsx`

Le `page.tsx` de chaque page formulaire doit se limiter à :

- charger les données (repositories ou features)
- résoudre les search params
- mapper les messages de statut ou d'erreur
- préparer les données nécessaires à l'orchestration
- composer les sections

Il ne doit pas contenir le JSX des sections elles-mêmes.

---

## Hors périmètre

- Aucun changement de comportement
- Aucun changement de wording
- Aucune modification de repository, de schéma ou de Server Action
- Aucun framework de formulaire maison
- Pas d'abstraction générique non justifiée par un usage réel immédiat

---

## Règles de composition formulaire

### Composants admin de formulaire

Créer un composant admin de formulaire uniquement si le gain est immédiat et l'usage réel. Exemples justifiés :

- `AdminFormField` — label + contrôle, pattern répété dans tous les formulaires
- `AdminFormSection` — section visuelle de formulaire avec card-like container
- `AdminFormActions` — zone d'actions de soumission (`div.admin-actions`)

Ne pas abstraire les patterns sémantiques déjà lisibles (`fieldset`, `legend`, checkbox simple, note contextuelle) si le HTML natif est plus direct.

### Usage des primitives shadcn

Utiliser une primitive shadcn si elle améliore réellement la cohérence ou la lisibilité immédiate.

Primitives pertinentes pour ce lot : `Label`, `Input`, `Textarea`, `Select`, `Checkbox`, `Separator`.

Ne pas migrer vers shadcn si :

- l'introduction complique le code ou augmente le diff sans valeur réelle
- les classes `admin-input`, `admin-field` suffisent et sont déjà lisibles
- le composant shadcn casse la robustesse des Server Action forms

### `components/admin/` compose `components/ui/`

Les composants admin de formulaire ne doivent pas dupliquer la responsabilité des primitives `components/ui/`. Ils les composent.

---

## Vérifications

```bash
pnpm run typecheck
pnpm exec playwright test tests/e2e/admin/homepage.spec.ts tests/e2e/admin/product-new.spec.ts
```

---

## Critères de validation

- Le comportement de chaque formulaire est identique avant et après
- Aucun heading métier visible n'est renommé
- Les sections extraites améliorent la lisibilité sans changer le métier
- `page.tsx` se limite à l'orchestration
- Les composants admin de formulaire sont cohérents entre les deux pages
- `pnpm run typecheck` passe sans erreur
- Les tests e2e ciblés passent sans régression
