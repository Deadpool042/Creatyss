# Doctrine — Admin pilotage & vues de données (V10)

## 1. Le dashboard est un poste de pilotage, pas un tableau de bord analytics

Le dashboard V10 doit répondre à une question simple : **qu'est-ce qui se passe en ce moment dans la boutique ?**

Signaux concrets attendus :

- Commandes en attente de traitement (statut `pending` ou `processing`)
- Paiements non confirmés
- Produits avec stock bas ou épuisé
- Total du mois en cours (chiffre brut, pas un graphique)

Ce que le dashboard ne fait pas :

- Courbes d'évolution dans le temps
- Comparaisons sur N périodes
- Graphiques en secteurs ou en barres
- "Insights" générés automatiquement

Sobriété délibérée : un dashboard opérationnel qui tient en une page, sans scroll, sur un écran standard, est plus utile qu'un tableau de bord complet mais jamais lu.

## 2. La DataTable est un outil ciblé, pas un standard universel

La DataTable (TanStack Table + shadcn `data-table.tsx`) apporte de la valeur là où :

- Le volume de lignes dépasse ~30 (tri, pagination nécessaires)
- Un filtre par statut ou par critère est une action fréquente
- L'utilisateur doit comparer plusieurs lignes simultanément

Elle n'a pas de valeur là où :

- La liste est courte et stable (< 20 items)
- L'entité est principalement gérée via une fiche individuelle
- Les cartes actuelles suffisent à la navigation

**Décision par entité :**

| Entité     | Pattern cible     | Justification                                        |
| ---------- | ----------------- | ---------------------------------------------------- |
| Commandes  | DataTable         | Volume variable, filtre par statut = usage quotidien |
| Produits   | DataTable         | Tri par nom/prix utile, évolutif                     |
| Articles   | Table simple      | Volume faible, pas de filtre nécessaire              |
| Catégories | Cartes (inchangé) | < 20 items, navigation suffisante                    |

Cette décision est explicite et assumée. Elle peut évoluer en V11 si le besoin change.

## 3. La Table simple est un outil légitime

Pour les entités à faible volume et faible besoin interactif, `shadcn/ui` fournit des composants `Table`, `TableHeader`, `TableRow`, etc. directement utilisables sans TanStack Table.

Une Table simple :

- Ne nécessite pas `@tanstack/react-table`
- Ne nécessite pas de `ColumnDef<T>`
- Ne nécessite pas de fichier `columns.tsx` colocalisé
- Est un composant React classique avec des données mappées directement

Utiliser TanStack Table pour 8 articles de blog serait une sur-ingénierie inutile.

## 4. Architecture DataTable : légère et colocalisée

Quand DataTable est justifiée, l'architecture suit ce schéma minimal :

```
features/<entity>/
└── columns.tsx     ← ColumnDef<T>[] colocalisés avec l'entité

components/ui/
├── table.tsx       ← composants shadcn de base (généré par CLI)
└── data-table.tsx  ← wrapper TanStack générique (thin, pas de logique métier)
```

`data-table.tsx` est **générique** : il reçoit `columns` et `data` en props, gère la pagination et les filtres de colonne. Il ne connaît pas les entités métier.

La logique métier (quelles colonnes, quels filtres) vit dans `columns.tsx` colocalisé avec l'entité, pas dans le composant générique.

## 5. Transparence sur les sources techniques

La décision d'utiliser TanStack Table via le pattern shadcn DataTable a été éclairée par :

- La documentation officielle shadcn/ui sur les composants Table et DataTable (consultée via le MCP shadcn disponible en session)
- L'analyse des patterns officiels : `ColumnDef`, `useReactTable`, `flexRender`
- La comparaison Table simple vs DataTable selon le volume et l'interactivité

**Ce que le MCP shadcn a fourni :** confirmation de la structure `columns.tsx` + `data-table.tsx`, interface `ColumnDef<T>`, hook `useReactTable`, rendu via `flexRender`.

**Ce qui n'a pas été exécuté :** `npx shadcn@latest add table` et `pnpm add @tanstack/react-table` n'ont pas été lancés en session de documentation. Ils font partie des étapes V10-2. La doc décrit le résultat attendu, pas un état déjà installé.

## Critères de conformité V10

Une page admin est conforme V10 si elle satisfait au moins les critères applicables à son type :

**Dashboard :**

- [ ] Affiche des données réelles issues de la base (pas de chiffres hardcodés)
- [ ] Signaux d'alerte visibles sans scroll (commandes en attente, stocks bas)
- [ ] Aucun graphique ou visualisation complexe
- [ ] Actions rapides vers les pages de gestion concernées

**Page liste avec DataTable :**

- [ ] `table.tsx` et `data-table.tsx` présents dans `components/ui/`
- [ ] `columns.tsx` colocalisé dans `features/<entity>/`
- [ ] Filtre ou tri fonctionnel (au moins un)
- [ ] Pagination fonctionnelle si > 20 lignes
- [ ] `pnpm run typecheck` passe

**Page liste avec Table simple :**

- [ ] Composants `Table*` shadcn utilisés (pas de `<table>` HTML brut)
- [ ] Pas de `@tanstack/react-table` importé
- [ ] Données lues depuis le repository existant

**Page liste conservée en cartes :**

- [ ] Aucune modification requise
