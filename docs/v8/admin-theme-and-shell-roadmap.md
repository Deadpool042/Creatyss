# V8 — Roadmap Thème et Shell Admin

## Vue d'ensemble

| Lot | Titre | Risque si non fait |
|---|---|---|
| V8-1 | Fondations thème : tokens et dark mode | Valeurs en dur se multiplient, dark mode incohérent |
| V8-2 | Shell admin premium (icon-collapse) | Shell figé, peu ergonomique desktop, état non persisté |
| V8-3 | Migration composants cards et états | Deux systèmes de style en tension indéfiniment |
| V8-4 | Cohérence pages haute visibilité | Expérience fragmentée sur les pages les plus consultées |
| V8-5 | Retrait contrôlé du CSS legacy | Dette CSS permanente, risques de régressions croisées |

---

## V8-1 — Fondations thème : tokens et dark mode

### Pourquoi en premier

Tout le reste de V8 s'appuie sur des tokens normalisés. Si V8-2 remplace le shell avant que `--brand` existe, le remplacement introduit encore des valeurs en dur. V8-1 pose le socle commun.

### Ce que ce lot résout

La couleur de marque Creatyss (`#8f5d2d`) est actuellement inlinée comme valeur arbitraire Tailwind dans plusieurs composants. À chaque ajout de composant qui utilise cette couleur, la valeur se propage. V8-1 en fait un token, une seule source de vérité.

Le dark mode est actuellement partiel : les tokens `--sidebar-*` existent probablement en light, mais leur déclinaison dark n'est peut-être pas complète. V8-1 est le moment d'établir une couverture systématique des surfaces principales.

### Résultat attendu

- Token `--brand` déclaré, utilisable dans toute l'interface
- Dark mode couvrant les surfaces principales : fond page, sidebar, cards, formulaires, boutons, badges, états, focus/hover
- Aucune valeur de couleur en dur dans les composants actifs modifiés
- Base stable pour V8-2, V8-3, V8-4

### Dépendances

Aucun prérequis. Ce lot peut démarrer immédiatement.

---

## V8-2 — Shell admin premium (icon-collapse)

### Pourquoi après V8-1

Les tokens `--brand` et `--sidebar-*` dark sont nécessaires pour que le shell refactorisé soit d'emblée correct visuellement. Commencer V8-2 avant V8-1 reviendrait à introduire de nouvelles valeurs en dur dans du code qu'on vient de réécrire.

### Ce que ce lot résout

Le shell actuel a plusieurs limitations ergonomiques :
- La sidebar ne se réduit pas sur desktop — elle est soit pleine, soit absente
- L'état ouvert/fermé est verrouillé (`open={true}`), il ne se persiste pas entre navigations
- Il n'y a pas de handle visuel pour réduire/agrandir (pas de `SidebarRail`)
- `AdminShell` est client (`"use client"`) sans raison apparente
- Le layout compensatoire (classes négatives) est fragile

Le pattern shadcn `sidebar-07`, consulté via MCP, répond exactement à ce besoin : icon-collapse, `SidebarRail`, tooltips natifs sur `SidebarMenuButton` en mode icon, état persisté via cookie sans code supplémentaire.

### Résultat attendu

- Sidebar desktop réductible en mode icônes avec tooltips au hover
- État de la sidebar persisté entre navigations
- Handle visuel (`SidebarRail`) remplaçant le trigger hardcodé desktop
- Layout sans compensation négative
- `AdminShell` server component si possible

### Dépendances

V8-1 terminé.

---

## V8-3 — Migration composants cards et états

### Pourquoi ce lot

Les composants cards admin (`AdminProductCard`, `AdminOrderCard`, `AdminBlogPostCard`, `AdminCategoryCard`) et `AdminEmptyState` mélangent des classes CSS legacy avec des classes Tailwind. Ce mélange crée une tension : corriger le style d'un composant nécessite de comprendre deux systèmes en même temps. La dark mode coverage de ces composants dépend du bon système gagnant.

### Ce que ce lot résout

- `.admin-chip` remplacé par `Badge` shadcn — variant sémantique, dark mode natif
- `.store-card` et `.admin-*-card` remplacés par `Card` shadcn + Tailwind pur
- `.empty-state` remplacé par une structure Tailwind tokenisée

Ces composants sont les plus visibles dans les pages liste (produits, commandes, blog, catégories). Leur migration rend V8-4 plus simple et V8-5 possible.

### Résultat attendu

- Cinq composants sans aucune importation de classe CSS legacy
- `Badge` utilisé pour tous les statuts et tags
- `Card` shadcn comme base des cards
- Composants dark compliant par construction via tokens

### Dépendances

V8-1 terminé. V8-2 peut être en parallèle.

---

## V8-4 — Cohérence pages haute visibilité

### Pourquoi ce lot

Même avec des composants migrés et un shell amélioré, les pages peuvent rester incohérentes dans leur structure (en-têtes, espacements, hiérarchie). Les pages les plus consultées — dashboard, homepage admin, détail produit, détail commande — méritent une passe de cohérence.

### Ce que ce lot résout

- En-têtes de pages structurés de manière cohérente (titre, description, actions)
- Utilisation systématique de `AdminFormSection`, `AdminFormField`, `AdminFormActions` là où ils s'appliquent
- Hiérarchie visuelle lisible sans effort de lecture

Ce lot ne touche pas à la logique métier ni aux données affichées. Il affine la mise en page et la composition.

### Résultat attendu

- Pages haute visibilité avec structure d'en-tête homogène
- Aucun composant legacy dans ces pages
- Cohérence avec les standards V7/V8

### Dépendances

V8-1 terminé. V8-3 terminé ou en cours (les composants migrés doivent être disponibles).

---

## V8-5 — Retrait contrôlé du CSS legacy

### Pourquoi en dernier

Le CSS legacy ne peut être retiré qu'une fois ses usages migrés. Agir avant crée des régressions visuelles. Agir après garantit que le retrait est sans risque.

### Ce que ce lot résout

Après V8-2, V8-3 et V8-4, un ensemble de classes CSS legacy est devenu orphelin — présent dans les fichiers `.css` mais non utilisé dans l'application. V8-5 les retire proprement, bloc par bloc, après vérification systématique.

La cible finale n'est pas un fichier CSS vide : c'est un fichier CSS sans règles orphelines et sans dette active. Les styles globaux légitimes (reset, variables, bases typographiques) restent.

### Résultat attendu

- Classes identifiées en V8-3/V8-4 retirées des fichiers CSS
- Aucune régression visuelle vérifiable
- Fichiers CSS allégés et cohérents avec ce qui est réellement utilisé

### Dépendances

V8-2, V8-3 et V8-4 terminés.

---

## Critères de succès V8 (récapitulatif)

- [ ] Token `--brand` déclaré, zéro valeur `#8f5d2d` en dur dans les composants actifs
- [ ] Dark mode couvre toutes les surfaces principales sans valeur codée en dur
- [ ] Sidebar desktop réductible en mode icon avec tooltips
- [ ] `SidebarRail` présent et fonctionnel
- [ ] État sidebar persisté entre navigations
- [ ] Cinq composants cards/états migrés, `Badge` pour tous les statuts
- [ ] Pages haute visibilité avec structure cohérente
- [ ] Classes CSS legacy orphelines retirées
- [ ] `pnpm run typecheck` : zéro erreur imputable à V8
- [ ] Tests e2e admin passants
