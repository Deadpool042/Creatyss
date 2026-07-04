# Audit design admin — 2026-07-03

## Objectif

Audit en lecture seule du design de `app/admin/(protected)/**`, demandé par le propriétaire produit suite au ressenti : "trop étriqué, trop de boîtes dans les boîtes, n'utilise pas l'espace disponible, pas mobile friendly". Aucune modification de code n'a été effectuée dans ce lot. Seul ce fichier a été créé.

## Périmètre

- Lecture des composants de layout partagés : `components/admin/layout/*`.
- Lecture de 7 écrans représentatifs : dashboard, commandes (liste + overview + détail `[id]`), tarification catalogue (`catalog/pricing`), réglages livraison (`commerce/shipping/settings`), prix produit (`catalog/products/[slug]/pricing`).
- Recherche de patterns `grid-cols-*` dans `app/admin`, `features/admin`, `components/admin`.
- Recherche de doctrine admin-UI dans `docs/domains/**` (rien de dédié — `dashboarding.md` porte sur l'agrégation de données de pilotage, pas sur le système de layout admin).
- Consultation du skill local `shadcn` (CLI-based, présent dans `.claude/skills/shadcn/SKILL.md`), pas de MCP shadcn distinct détecté.

Non observé dans ce lot : rendu visuel réel (aucun accès navigateur), le comportement à l'exécution des composants client (`use-admin-split-view-state.ts` non lu en détail), les autres ~100 pages admin non citées ci-dessous.

---

## 1. Verdict global

Le ressenti du propriétaire produit est **partiellement confirmé par le code**, avec des nuances importantes selon la zone :

- **"Boîtes dans des boîtes"** : Observé et généralisé. Confirmé sur dashboard, sur la vue d'ensemble commandes, et sur le détail de commande (`[id]`). C'est le motif dominant dans les zones "overview"/"dashboard"/"detail".
- **"N'utilise pas l'espace disponible"** : Observé, mais localisé. Confirmé sur `catalog/pricing` (grande zone vide sous une liste courte) — c'est un effet de contenu réel insuffisant plutôt qu'un défaut structurel du composant de layout lui-même. `réglages livraison` est au contraire un contre-exemple : sections plates, `space-y-8`, pas d'empilement de cartes.
- **"Duplication d'information"** : Observé et démontré précisément sur commandes (voir section 3). Pattern architectural (deux features différentes affichant deux vues de la même donnée métier), pas un bug isolé de copier-coller.
- **"Pas mobile friendly"** : **Non confirmé comme verdict global — évidence mixte.** Le shell (sidebar → bottom nav) et le split-view (liste/détail en mode "slide" mobile) sont des systèmes responsive réels et soignés, avec gestion des safe-areas et du mode paysage compact. En revanche, plusieurs grilles de contenu à l'intérieur des pages (`grid-cols-3` sans préfixe `sm:`/`md:`) ne repassent jamais en colonne unique et sont un vrai défaut mobile, localisé à certaines pages, pas à l'architecture globale.

---

## 2. Système de layout actuel observé

### Composants et rôles (Observé, `components/admin/layout/*`)

| Composant                                                                                | Rôle                                                                                                                                                                                                                                                                  |
| ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `AdminShell`                                                                             | Structure générale : topbar, sidebar desktop (`hidden lg:block`), zone de contenu, bottom nav mobile.                                                                                                                                                                 |
| `AdminPageShell`                                                                         | Scroll de page + wrapper de contenu ; applique `contentPreset` (padding/largeur). Doctrine explicite en commentaire dans `admin-content-classnames.ts` : "Les features ne doivent pas ajouter de padding ou de max-width pour corriger le cadrage global d'une page." |
| `AdminSplitPageShell` / `AdminSplitPaneShell`                                            | Variantes de `AdminPageShell` pour les vues split (liste + détail), scroll délégué aux enfants (`scrollBehavior="external"`).                                                                                                                                         |
| `AdminSplitView`                                                                         | Le split liste/détail lui-même : gère largeur redimensionnable/collapsible desktop, et bascule "slide" mobile (`hidden`/`flex` par route active) avec préfixes `tablet:`/`laptop:` selon `compactSplit`.                                                              |
| `AdminSplitListPane`                                                                     | Colonne de liste : header sticky + zone de résultats scrollable.                                                                                                                                                                                                      |
| `AdminSplitDetailOverviewShell`                                                          | Conteneur de la page "overview" dans le panneau détail (hero + grille de cartes).                                                                                                                                                                                     |
| `AdminSplitDetailSectionCard` / `AdminSplitDetailSectionHeader` / `AdminSplitDetailFact` | Primitives de carte bordée réutilisées pour construire les sections "overview".                                                                                                                                                                                       |
| `AdminOverviewHero`                                                                      | Hero avec eyebrow + titre + description + jusqu'à 4 stat tiles internes (déjà responsive : `sm:grid-cols-2 xl:grid-cols-4`).                                                                                                                                          |

### Niveaux d'imbrication de conteneurs bordés (Observé)

Sur le dashboard (`components/admin/dashboard/admin-dashboard-sections.tsx`), le niveau d'imbrication réel est :

```
section (grid)
  └─ Card (rounded-2xl/3xl, border, shadow)
       └─ CardContent (grid ou space-y)
            └─ div (rounded-xl, border) — un par item (metric, priority, readiness track, vigilance)
```

C'est-à-dire **3 niveaux de conteneurs bordés empilés** avant d'atteindre le texte réel, répétés 4 fois (hero+priorités, readiness+vigilance) plus une grille de 6 `Card` "accès rapides". Le même motif (carte bordée contenant des div bordées) se retrouve dans `AdminOverviewHero` (section → 4 stat tiles bordées) et dans `AdminSplitDetailSectionCard` (carte bordée contenant des `AdminSplitDetailFact` bordées, cf. `admin-orders-detail-overview.tsx`).

Sur le détail de commande (`@detail/[id]/page.tsx`), le motif diffère légèrement : ce n'est pas de l'imbrication multi-niveaux mais un **empilement séquentiel** de ~11 cartes indépendantes (`OrderDetailSummaryCard`, `OrderDetailActionsCard`, `OrderDetailCustomerCard`, `OrderDetailShippingCard`, `OrderDetailPaymentCard`, `OrderDetailShippingAddressCard`, `OrderDetailBillingAddressCard`, `OrderDetailLinesPanel`, `OrderDetailStatusHistoryCard`, `OrderDetailFulfillmentCard`, `OrderDetailReturnCard`, `OrderDetailDocumentsCard`, `OrderDetailEmailEventsCard`), chacune probablement avec sa propre bordure (contenu des composants `OrderDetail*Card` non lu en détail dans ce lot — **Inconnu** si chacune réutilise `AdminSplitDetailSectionCard`, **Déduit** que oui vu le nom du fichier `admin-split-detail-section-card.tsx` et son usage confirmé ailleurs).

Contre-exemple observé : `commerce/shipping/settings/page.tsx` n'empile pas de cartes bordées — c'est un `space-y-8` de blocs plats (titre, notices, formulaires). Le motif "boîte dans la boîte" **n'est donc pas universel**, il domine sur les écrans overview/dashboard/detail construits avec les primitives split-detail, mais pas sur tous les formulaires de réglages.

### Largeurs et espacements (Observé, `admin-content-classnames.ts`)

```
dashboard : max-w-7xl (mx-auto), gap-4→6, pt-4→pt-6
overview  : max-w-7xl (mx-auto), gap-4→6
table     : PAS de max-width (pleine largeur), gap-4→6
form      : max-w-3xl (mx-auto), gap-4→6
detail    : max-w-7xl (mx-auto), gap-4→6
```

Point notable : le preset `table` (utilisé par `catalog/pricing`) n'a **aucune contrainte de largeur maximale**, contrairement à `overview`/`detail`/`dashboard` qui sont plafonnés à `max-w-7xl` (~1280px). Sur un écran de 1512px+, une page `table` avec peu de contenu (ex. `catalog/pricing`, 3 stat tiles + 2 listes) ne bénéficie donc d'aucun recentrage ni d'aucune limite — le contenu réel occupe une bande étroite en haut, suivi d'un vide jusqu'en bas de la page. C'est cohérent avec l'observation initiale sur `/admin/catalog/pricing`.

---

## 3. Duplication d'information observée

### Cas confirmé : commandes récentes (dashboard vs overview commandes)

- `app/admin/(protected)/commerce/orders/@list/page.tsx` et `@list/overview/page.tsx` rendent tous deux `OrdersListPage` (liste paginée complète avec filtres, `features/admin/commerce/orders/routes/orders-list-page.tsx` → `OrdersPanelList`).
- `app/admin/(protected)/commerce/orders/@detail/overview/page.tsx` rend `AdminOrdersDetailOverview` (`features/admin/commerce/orders/overview/components/admin-orders-detail-overview.tsx`), qui affiche un bloc "Dernières commandes" listant `stats.recentOrders` (issu d'une requête **différente**, `getAdminOrdersOverview`, distincte de celle qui alimente la colonne liste).

Concrètement, à l'URL `/admin/commerce/orders/overview`, l'utilisateur voit dans la **même page** :

- à gauche : la colonne liste (`AdminSplitListPane` + `OrdersPanelList`) avec toutes les commandes, filtrable ;
- à droite : un panneau "Dernières commandes" (`AdminSplitDetailSectionCard`) montrant un sous-ensemble des mêmes commandes récentes, dans un style de carte différent, alimenté par une requête séparée.

Ce n'est pas une simple coïncidence visuelle : deux requêtes distinctes (`list-admin-orders.query.ts` côté liste, `get-admin-orders-overview.query.ts` côté détail-overview) produisent des vues qui se recouvrent partiellement sur les mêmes données. Le même motif structurel (un panneau détail-overview avec sa propre mini-liste "récentes/dernières") est répliqué par construction pour tout autre domaine qui adopterait `AdminSplitDetailOverviewShell` + un bloc "dernières X" — **Déduit**, non vérifié système par système dans ce lot faute de budget de lecture, mais le composant `AdminSplitDetailSectionCard` et le pattern "hero + carte dernières entrées + carte points d'attention" sont conçus comme un template générique réutilisable (cf. doctrine du composant), donc le risque de duplication se reproduit à chaque nouvel écran overview de ce type tant que la liste de gauche et la mini-liste de droite sont alimentées par deux requêtes indépendantes plutôt qu'une source commune.

Aucun autre cas de duplication n'a été vérifié directement par lecture de code dans ce lot (recherche limitée aux fichiers cités) — **Inconnu** pour les autres domaines split-view (catégories, réglages avancés/flags).

---

## 4. Stratégie mobile observée

### Ce qui est réellement responsive (Observé)

- `AdminShell` : sidebar desktop cachée sous `ADMIN_SIDEBAR_MOBILE_BREAKPOINT` (= `BREAKPOINTS.laptop`, `lib/breakpoints.ts`), remplacée par `AdminMobileBottomNav` (`lg:hidden`), une nav basse à 5 slots avec gestion de safe-area iOS (`admin-mobile-bottom-nav-frame`) et masquage en paysage compact (`max-height:480px`).
- `AdminSplitView` : sur mobile, liste et détail sont deux panneaux en `hidden`/`flex` selon la route active (comportement "slide" par navigation plutôt que CSS transform), avec un lien "retour à la liste" dédié mobile (`mobileBackToListLabel`). Les préfixes `tablet:`/`laptop:` pilotent la bascule vers le split desktop à deux colonnes.
- `AdminOverviewHero` : grille de stat tiles `sm:grid-cols-2 xl:grid-cols-4` — repasse bien en 1-2 colonnes sur mobile.
- `AdminPageContextBar` : `flex-col sm:flex-row` pour empiler breadcrumbs/action en mobile.
- Détail de commande (`@detail/[id]/page.tsx`) : grilles internes avec préfixes explicites (`md:grid-cols-2`, `xl:grid-cols-[...]`) — repasse en 1 colonne sous `md`/`xl`.

### Ce qui ne l'est pas (Observé)

Grilles à colonnes fixes sans breakpoint responsive, qui ne repasseront jamais en 1 colonne sur mobile :

- `app/admin/(protected)/catalog/pricing/page.tsx:91` — `grid grid-cols-3 gap-3` (stats).
- `app/admin/(protected)/settings/team/page.tsx:99` — `grid grid-cols-3 gap-3`.
- `app/admin/(protected)/settings/api-clients/page.tsx:78` — `grid grid-cols-3 gap-3`.
- `app/admin/(protected)/content/blog/page.tsx:81` — `grid grid-cols-3 gap-3`.

Ces 4 pages afficheront 3 colonnes serrées sur un viewport mobile (~375-430px), avec un risque réel de texte tronqué ou de débordement horizontal, faute de vérification visuelle directe — **Déduit** du code, **Inconnu** l'impact exact au rendu sans capture mobile.

Cas à vérifier plus tard, non tranchable ici : `features/admin/pilotage/components/settings-advanced/governance-panel-primitives.tsx` définit une map `{2: "grid-cols-2", 3: "grid-cols-3", 4: "grid-cols-4"}` paramétrée par une prop numérique — le nombre de colonnes effectif dépend des appelants, non audités dans ce lot. **Inconnu**, ne pas compter comme preuve de bug mobile sans vérifier les sites d'appel.

Non retenu comme évidence : `admin-mobile-bottom-nav.tsx` utilise `grid-cols-5`, mais c'est un composant mobile-only à 5 emplacements fixes par conception (pas un grid de contenu destiné à reflow) — exclu de la liste des grilles non responsive.

### Verdict mobile

Ni "confirmé" ni "infirmé" globalement : l'architecture de navigation et le split-view sont conçus et implémentés avec un vrai soin mobile (safe-areas, breakpoints nommés, bascule de navigation). Le défaut mobile réel se situe **au niveau du contenu de certaines pages** (grilles à 3 colonnes fixes sur `pricing`, `team`, `api-clients`, `blog`), pas au niveau du système de layout partagé.

---

## 5. Pistes de composants shadcn pertinentes

Skill `shadcn` local disponible (CLI-based, `.claude/skills/shadcn/SKILL.md`), pas de MCP séparé détecté dans l'environnement de session. Sans maquette, à valider avec le propriétaire produit avant toute mise en œuvre :

- **`Tabs`** pour remplacer l'empilement séquentiel de ~11 cartes du détail de commande (Résumé, Client, Livraison, Paiement, Adresses, Lignes, Historique, Fulfillment, Retour, Documents, Emails) par des onglets groupés (ex. "Résumé", "Client & adresses", "Paiement & livraison", "Historique & emails"), réduisant la hauteur de scroll sans supprimer d'information.
- **`Table`** (native, avec `TableHeader`/`TableRow`/`TableCell`) pour remplacer les listes de `div` bordées répétées dans `catalog/pricing` (liste de price lists), `content/blog`, `settings/team`, `settings/api-clients` — plus dense qu'un empilement de cartes, et permettrait un vrai `overflow-x-auto` propre sur mobile plutôt qu'un `grid-cols-3` figé.
- **`Card` en composition complète** (`CardHeader`/`CardTitle`/`CardDescription`/`CardContent`/`CardFooter`) : le dashboard utilise déjà `Card`/`CardHeader`/`CardContent`, mais réintroduit une div bordée manuelle à l'intérieur de `CardContent` pour chaque item — le skill recommande explicitement d'utiliser la composition complète plutôt que d'empiler des `div` stylées à la main, ce qui va dans le sens du signalement "boîtes dans les boîtes".
- **`Empty`** pour les états vides actuellement en `div` stylée manuellement (ex. `AdminSplitDetailOverviewEmptyState`, `AdminEmptyState`) — cohérence de vocabulaire, pas un changement structurel.
- **`Separator`** au lieu des `border-t`/`divide-y` manuels observés (ex. `catalog/pricing` : `divide-y divide-surface-border/40`) — piste mineure de cohérence, pas un chantier en soi.
- **Layout 12 colonnes / zones de contenu variables** : le hero + stat tiles du dashboard et l'overview commandes utilisent des grilles fixes (`xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,0.7fr)]`) déjà proches d'un système à proportions variables — la piste n'est pas de réinventer un système 12 colonnes, mais de généraliser ce motif de grille à proportions (`minmax`) plutôt que les grilles à colonnes égales fixes repérées comme non responsive.

Aucune de ces pistes n'a été vérifiée par récupération effective de composants (`npx shadcn@latest add/docs`) dans ce lot — audit uniquement, pas d'implémentation.

---

## 6. Découpage proposé en micro-lots pour une refonte ultérieure

À valider avec le propriétaire produit avant tout démarrage. Découpage par zone, sans détail interne à chaque lot :

1. **Dashboard** (`components/admin/dashboard/admin-dashboard-sections.tsx`) — aplatir le niveau d'imbrication carte-dans-carte, remplacer les `div` bordées manuelles par une composition `Card` cohérente ou par une liste/table.
2. **Listes et vues overview split-detail** (`orders`, potentiellement `categories`, `settings/advanced`) — traiter la duplication liste/mini-liste en unifiant la source de données ou en supprimant le doublon visuel, avant tout retouche esthétique.
3. **Formulaires de réglages** (`commerce/shipping/settings` et familles `settings/*`) — déjà plus proches d'un bon niveau d'aération (contre-exemple positif). **Vérifié le 2026-07-04** : `general`, `store`, `team`, `api-clients`, `webhooks`, `search`, `channels`, `integrations`, `ai` suivent tous le même motif plat (une boîte bordée + `divide-y` pour les listes, pas d'imbrication carte-dans-carte). Aucune correction nécessaire — le motif est déjà généralisé sur cette famille.
4. **Vues détail à cartes multiples** (`orders/[id]`, potentiellement `products/[slug]/*`) — évaluer un passage à `Tabs` pour réduire la longueur de scroll, en préservant l'accès direct à chaque section.
5. **Pages listes tabulaires denses** (`catalog/pricing`, `content/blog`, `settings/team`, `settings/api-clients`) — traiter en priorité les `grid-cols-3` non responsive (mobile) et évaluer un passage à `Table` native pour la densité desktop et la largeur non exploitée.

---

## Fichiers lus

- `AGENTS.md`
- `.claude/CLAUDE.md` (contexte système)
- `docs/architecture/**` (non relu intégralement — RAG/mémoire non mobilisés pour ce lot ciblé ; lecture directe des fichiers admin jugée suffisante par la doctrine de périmètre)
- `docs/domains/README.md` (grep ciblé, pas de doctrine admin-UI dédiée trouvée)
- `components/admin/layout/admin-page-shell.tsx`
- `components/admin/layout/admin-split-page-shell.tsx`
- `components/admin/layout/admin-overview-hero.tsx`
- `components/admin/layout/admin-shell.tsx`
- `components/admin/layout/admin-split-detail-section-card.tsx`
- `components/admin/layout/admin-split-view.tsx`
- `components/admin/layout/admin-split-list-pane.tsx`
- `components/admin/layout/admin-content-classnames.ts`
- `components/admin/layout/admin-split-pane-shell.tsx`
- `components/admin/layout/admin-split-detail-overview-shell.tsx`
- `components/admin/dashboard/admin-dashboard-sections.tsx`
- `components/admin/navigation/mobile/admin-mobile-bottom-nav.tsx`
- `app/admin/(protected)/page.tsx`
- `app/admin/(protected)/commerce/orders/@list/overview/page.tsx`
- `app/admin/(protected)/commerce/orders/@list/page.tsx`
- `app/admin/(protected)/commerce/orders/[id]/page.tsx`
- `app/admin/(protected)/commerce/orders/@detail/[id]/page.tsx`
- `app/admin/(protected)/catalog/pricing/page.tsx`
- `app/admin/(protected)/catalog/products/[slug]/pricing/page.tsx`
- `app/admin/(protected)/commerce/shipping/settings/page.tsx`
- `features/admin/commerce/orders/overview/components/admin-orders-detail-overview.tsx`
- `features/admin/commerce/orders/components/orders-panel-list.tsx` (partiel)
- `lib/breakpoints.ts` (grep ciblé)
- `.claude/skills/shadcn/SKILL.md`

## Validations exécutées

Aucune (lot documentaire pur, aucune modification de code). `pnpm run typecheck`/`pnpm run lint` non exécutés — non pertinents pour un ajout de fichier markdown seul, conformément à la doctrine de proportionnalité des validations.

## Validations non exécutées

- Rendu visuel mobile réel (aucun accès navigateur dans cette session).
- Vérification des sites d'appel de `governance-panel-primitives.tsx` (grid paramétrée).
- Lecture du contenu détaillé des composants `OrderDetail*Card` (bordures effectives non confirmées une par une).
- Vérification des autres écrans split-view (catégories, réglages avancés) pour la duplication liste/overview.

## Risques éventuels

- Le motif de duplication liste/overview (section 3) est un risque architectural qui se reproduira sur tout nouvel écran adoptant `AdminSplitDetailOverviewShell` avec un bloc "dernières entrées" tant que la source de données de la liste de gauche et celle du panneau overview restent deux requêtes indépendantes.
- Le preset `table` sans `max-w` (section 2) peut donner une impression de vide sur des écrans larges dès que le contenu réel est court — à traiter au cas par cas plutôt que par un changement global de preset, pour ne pas casser les pages `table` qui ont réellement besoin de pleine largeur (ex. tableaux volumineux).
