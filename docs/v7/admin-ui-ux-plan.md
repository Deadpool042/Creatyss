# V7 — Plan UI/UX admin

## Documents de référence prolongés

Ce document prolonge directement :

- `docs/v6/admin-language-and-ux.md` — vocabulaire, structure d'écran, règles de formulation
- `docs/v6/glossary.md` — terminologie métier officielle
- `docs/v6/tailwind-shadcn-migration.md` — règles d'usage de shadcn/ui et Tailwind dans l'admin

Il ne les contredit pas. Il en constitue la suite structurelle.

---

## 1. Objectif de V7

V7 est un prolongement de la V6 centré sur l'amélioration de l'interface de gestion interne.

Son périmètre est strictement limité à l'admin (`app/admin/`). Il ne touche pas au front public, au tunnel d'achat, au paiement, ni aux règles métier.

Trois axes principaux :

1. **Shell admin** — remplacer la navigation horizontale actuelle par une sidebar fixe, plus intuitive et extensible.
2. **Composants admin** — introduire une couche `components/admin/` qui compose les primitives de `components/ui/`, pour extraire la logique de présentation récurrente des pages.
3. **Découpage des pages volumineuses** — réduire `page.tsx` à un rôle d'orchestration, en déléguant les sections à des composants dédiés.

V7 ne change aucune règle métier, aucune validation, aucun repository, aucun schéma de base de données.

---

## 2. Constat sur l'état actuel de l'admin

### Shell

`app/admin/(protected)/layout.tsx` est un shell minimal : une barre en haut avec l'identité de l'admin connecté, un bouton de déconnexion, et une `<nav>` horizontale avec 7 liens plats.

Il n'y a pas de séparation visuelle entre la zone de navigation et la zone de contenu. La nav est positionnée avant le `{children}` dans un `<section className="admin-shell">`.

### Navigation actuelle

7 liens dans une `<nav>` sans groupe :

- Accueil admin
- Page d'accueil
- Blog
- Catégories
- Produits
- Commandes
- Médias

Aucune indication de la page active. Aucun regroupement sémantique.

### Composants UI en place

Cinq composants dans `components/ui/` :

| Composant      | Origine   | Usage actuel                                      |
| -------------- | --------- | ------------------------------------------------- |
| `Button`       | shadcn/ui | Formulaires soumission, actions danger            |
| `Card`         | shadcn/ui | Sections upload, grilles médias, options homepage |
| `PageHeader`   | maison    | En-tête de toutes les pages admin migrées         |
| `Notice`       | maison    | Messages système (succès, alerte, note)           |
| `SectionIntro` | maison    | En-tête de section dans les pages détail          |

La migration V6 a homogénéisé l'usage de ces cinq composants sur toutes les pages admin. C'est une base solide.

### Pages et volumes

| Page                     | Lignes | État                          |
| ------------------------ | ------ | ----------------------------- |
| `page.tsx` (dashboard)   | 102    | raisonnable                   |
| `orders/page.tsx`        | 109    | raisonnable                   |
| `categories/page.tsx`    | 108    | raisonnable                   |
| `blog/page.tsx`          | 119    | raisonnable                   |
| `products/page.tsx`      | 130    | raisonnable                   |
| `products/new/page.tsx`  | 164    | raisonnable                   |
| `orders/[id]/page.tsx`   | 441    | trop volumineuse              |
| `homepage/page.tsx`      | 449    | trop volumineuse              |
| `products/[id]/page.tsx` | 1 663  | très volumineuse — priorité 1 |

---

## 3. Problèmes UX/UI à corriger

### Navigation peu intuitive

La nav horizontale oblige à scanner une liste de liens sans repère visuel ni regroupement. Elle ne s'adapte pas bien à l'ajout futur de sections. Elle ne signale pas la page active.

Une sidebar fixe est plus naturelle pour un back-office : elle expose en permanence la structure de l'espace, signale l'emplacement courant, et peut accueillir des groupes métier (catalogue, contenu, opérations) sans perdre en lisibilité.

### Dashboard redondant avec la nav

La page `page.tsx` actuelle (dashboard admin) reproduit les 7 destinations déjà présentes dans la nav, sous forme de cartes. Avec une sidebar permanente, cette redondance perd de son utilité. Le dashboard peut être simplifié ou remplacé par un récapitulatif plus utile.

### Pages trop volumineuses

`products/[id]/page.tsx` (1 663 lignes), `homepage/page.tsx` (449 lignes) et `orders/[id]/page.tsx` (441 lignes) concentrent dans un seul fichier : chargement de données, logique de transformation, helpers de présentation, et JSX de toutes les sections. Le fichier devient difficile à lire, à tester et à faire évoluer.

Un `page.tsx` doit se limiter à orchestrer : charger les données, résoudre les params, puis déléguer chaque section à un composant dédié. La logique de présentation locale à une section appartient à ce composant, pas à la page.

### Absence de couche composants admin

Il n'existe pas de répertoire `components/admin/`. Les patterns récurrents (liste d'articles avec chips et lien, bloc de section avec intro et champ, formulaire inline d'action) sont répétés directement dans chaque `page.tsx`. Une couche `components/admin/` permettrait de centraliser ces patterns sans dupliquer la responsabilité de `components/ui/`.

---

## 4. Principes structurants V7

### Pas de changement métier

V7 ne modifie aucune règle de gestion, aucune validation, aucun repository, aucun schéma. Tout changement qui aurait un impact sur le comportement métier est hors périmètre.

### Migration progressive, page par page

V7 avance par lots. Chaque lot est autonome et laisse l'admin dans un état fonctionnel. On ne migre pas toutes les pages d'un coup.

### Maintien des headings métier existants

Les headings (`h1`, `h2`) visibles dans les pages ne doivent pas être renommés sans besoin explicite. Les tests e2e ciblent souvent les headings pour localiser les pages et les sections. Renommer en masse créerait du bruit dans les tests sans bénéfice UX réel.

### Admin interne uniquement

V7 concerne exclusivement l'admin interne (`app/admin/`). Le front public, le catalogue, le blog public, le tunnel d'achat et les pages d'authentification (`/admin/login`, `/admin/logout`) ne font pas partie de ce périmètre.

### `components/admin/` compose, ne duplique pas

Les composants dans `components/admin/` doivent composer les primitives de `components/ui/` et ne jamais en dupliquer la responsabilité. Un composant admin peut utiliser `Button`, `Card`, `Notice`, `PageHeader`, `SectionIntro` — il ne les réimplémente pas.

---

## 5. Architecture cible des composants admin

### `components/ui/` — primitives partagées

Cette couche existe déjà. Elle est stable. Les règles V6 s'appliquent : seuls `Button` et `Card` viennent de shadcn/ui. `PageHeader`, `Notice`, `SectionIntro` sont maison.

Aucune primitive de cette couche ne porte de logique spécifique à l'admin. Elle reste générique.

### `components/admin/` — couche admin

Cette couche est à créer en V7. Elle contient des composants qui :

- ne sont utilisés que dans l'admin
- composent des primitives de `components/ui/`
- extraient des patterns récurrents des pages volumineuses
- portent une logique de présentation propre à l'admin

Exemples de composants attendus dans cette couche :

- **Shell et navigation** : `AdminSidebar`, `AdminSidebarLink`, `AdminSidebarGroup`
- **Patterns de page** : composants de section extraits des pages détail volumineuses
- **Patterns de liste** : composants de carte récurrents dans les listes

Un composant dans `components/admin/` ne doit jamais accéder à la base de données, ni importer de repository, ni contenir de Server Action. Ces responsabilités restent dans `app/admin/` et `features/`.

---

## 6. Règles de découpage des pages

### Règle d'orchestration

Un `page.tsx` a un rôle d'orchestration. Il doit :

1. résoudre les paramètres (`params`, `searchParams`)
2. charger les données (appels aux repositories ou features)
3. mapper les messages de statut ou d'erreur
4. déléguer le rendu de chaque section à des composants dédiés

Il ne doit pas contenir du JSX de sections entières. À partir de 250 lignes, un `page.tsx` est candidat à un découpage.

### Règle de seuil

- En dessous de 200 lignes : pas de découpage requis.
- Entre 200 et 350 lignes : découpage optionnel si des sections identifiables se répètent.
- Au-delà de 350 lignes : découpage requis avant toute évolution de la page.

### Règle de localité

Un composant extrait d'une page reste colocalisé avec elle s'il n'est utilisé que sur cette page. Par exemple, un composant propre à `products/[id]` peut vivre dans `app/admin/(protected)/products/[id]/` plutôt que dans `components/admin/` — il migre vers `components/admin/` s'il devient réutilisable sur plusieurs pages.

### Règle d'unicité de responsabilité

Un composant extrait ne doit porter qu'une seule section ou qu'un seul pattern. Ne pas extraire un composant "mega-page" qui déplace simplement le problème.

### Application prioritaire

Quatre niveaux de priorité pour le découpage en V7, du plus simple au plus complexe :

1. **Pages listes simples** (108–130 lignes) — `orders/page.tsx`, `categories/page.tsx`, `blog/page.tsx`, `products/page.tsx` — extraction de patterns de carte récurrents vers `components/admin/`
2. **Pages formulaires intermédiaires** (164–449 lignes) — `products/new/page.tsx`, `homepage/page.tsx` et les formulaires d'édition simples — découpage des sections de formulaire
3. **Détail commande** — `orders/[id]/page.tsx` (441 lignes) — sections : synthèse, état et actions, expédition, paiement, emails, client, livraison, facturation, récapitulatif
4. **Détail produit** — `products/[id]/page.tsx` (1 663 lignes) — sections : informations générales, images, organisation, informations de vente / déclinaisons, publication, SEO, actions dangereuses

---

## 7. Règles d'usage de shadcn/ui et Tailwind dans l'admin

Ces règles prolongent `docs/v6/tailwind-shadcn-migration.md` et s'y conforment strictement.

### Composants shadcn admis

En V7, les composants shadcn admissibles dans l'admin sont ceux déjà présents plus ceux nécessaires au shell sidebar :

- `Button` — déjà en place
- `Card` — déjà en place
- `Separator` — utile pour les groupes sidebar (si introduit, le documenter dans ce fichier)
- `Tooltip` — utile pour les labels de liens sidebar en mode replié (si introduit, le documenter)

Tout autre composant shadcn nécessite une demande explicite et une mise à jour de ce document.

### Règle d'introduction d'un nouveau composant shadcn

Avant d'introduire un composant shadcn non encore présent :

1. vérifier qu'une solution maison avec les classes CSS existantes et Tailwind ne suffit pas
2. documenter le composant dans la section "Composants admis" de ce fichier
3. ne pas introduire de composant shadcn directement dans un `page.tsx` — passer par `components/ui/` ou `components/admin/`

### Règle des classes CSS existantes

Les classes CSS existantes dans `app/globals.css` (`.admin-shell`, `.admin-toolbar`, `.admin-nav`, `.store-card`, `.button`, `.admin-chip`, etc.) ne sont pas supprimées. La migration Tailwind se fait par ajout et composition, pas par remplacement brutal.

### Règle Tailwind pur

Les composants construits en V7 sans équivalent CSS existant peuvent utiliser Tailwind pur. Les composants qui migrent un existant doivent conserver les classes existantes (cascade CSS prime).

### Règle globals.css

`app/globals.css` n'est pas modifié dans le cadre d'un lot V7, sauf nécessité stricte déjà prouvée et explicitement validée, conformément à la règle V6.

---

## 8. Règles de navigation admin (sidebar, header, groupes)

### Pourquoi une sidebar

La sidebar améliore l'intuitivité d'un back-office pour plusieurs raisons :

- Elle est **permanente** : l'utilisatrice sait toujours où elle se trouve et où elle peut aller, sans avoir à chercher la navigation.
- Elle **signale l'état courant** : le lien actif est visible en permanence.
- Elle permet des **groupes sémantiques** : les destinations peuvent être regroupées par domaine métier sans surcharger visuellement.
- Elle **libère la zone de contenu** : la nav n'occupe plus l'espace horizontal au-dessus du contenu, ce qui améliore la densité utile de chaque page.
- Elle est **extensible** : ajouter une section ne dégrade pas l'affichage des autres.

### Structure cible du shell

```
┌─────────────────────────────────────────────────────┐
│ [Sidebar]           │ [Zone de contenu]              │
│                     │                                │
│  Admin              │  {children}                    │
│  Nom · email        │                                │
│                     │                                │
│  — Accueil          │                                │
│                     │                                │
│  Catalogue          │                                │
│    Produits         │                                │
│    Catégories       │                                │
│                     │                                │
│  Contenu            │                                │
│    Page d'accueil   │                                │
│    Blog             │                                │
│                     │                                │
│  Opérations         │                                │
│    Commandes        │                                │
│    Médias           │                                │
│                     │                                │
│  [Se déconnecter]   │                                │
└─────────────────────────────────────────────────────┘
```

### Groupes de navigation

Trois groupes métier :

| Groupe     | Destinations         |
| ---------- | -------------------- |
| Catalogue  | Produits, Catégories |
| Contenu    | Page d'accueil, Blog |
| Opérations | Commandes, Médias    |

"Accueil admin" reste un lien solo au-dessus des groupes.

### Lien actif

Le lien courant doit être visuellement distingué (classe active). La détection du lien actif se fait côté client via `usePathname()` — cela impose que la sidebar ou ses liens soient des Client Components. Le reste du shell peut rester Server Component.

### Header minimal

Le header de la sidebar contient :

- le nom de l'admin connecté (`admin.displayName`)
- l'email (`admin.email`)
- le bouton "Se déconnecter"

Ces informations viennent du Server Component parent et sont passées en props aux composants client de la sidebar.

### Règle sur le label "Bibliothèque médias"

Dans la nav actuelle, le lien porte le label "Bibliothèque médias". En sidebar, le libellé court "Médias" est suffisant et correspond au vocabulaire officiel (`docs/v6/glossary.md`). Le label de la page (`PageHeader`) reste "Bibliothèque médias".

---

## 9. Stratégie de migration progressive

### Ordre des chantiers

1. **Shell admin + sidebar** — premier lot V7, traité isolément. Remplace `layout.tsx`. Ne touche à aucune page.
2. **Pages listes simples** — extraction de patterns récurrents sur les pages liste vers `components/admin/`.
3. **Pages formulaires intermédiaires** — découpage des sections sur les formulaires de complexité moyenne.
4. **Détail commande** — découpage de `orders/[id]/page.tsx`.
5. **Détail produit** — découpage de `products/[id]/page.tsx`, le chantier le plus lourd (1 663 lignes).

Les composants admin réutilisables émergent au fil des lots 2 à 5 et sont promus dans `components/admin/` dès qu'ils s'appliquent à plusieurs pages.

### Règle de non-régression

Chaque lot doit passer :

- `pnpm run typecheck`
- les tests unitaires ciblés si le lot touche des entités
- les tests e2e ciblés sur les pages modifiées

Les headings métier et les sélecteurs e2e existants doivent être préservés sauf demande explicite.

### Règle de stabilité des tests e2e

Les tests e2e ciblent les headings, les liens, les boutons et les rôles (`getByRole("article")`). Ne pas renommer ces éléments dans un lot de découpage structurel. Si un renommage est nécessaire, il fait l'objet d'un lot séparé dédié au wording, pas au découpage.

### Règle d'introduction de `components/admin/`

Le répertoire `components/admin/` est créé lors du premier lot qui justifie l'extraction d'un composant admin réutilisable. Il n'est pas créé à vide en anticipation.

---

## 10. Découpage en lots V7

### Lot V7-1 — Shell admin + sidebar + dashboard

**Périmètre :**

- Créer `components/admin/AdminSidebar` et les composants de navigation associés
- Modifier `app/admin/(protected)/layout.tsx` pour intégrer la sidebar
- Simplifier `app/admin/(protected)/page.tsx` (dashboard) maintenant que la nav est permanente
- Créer `components/admin/` si ce n'est pas encore fait

**Contenu attendu :**

- `components/admin/AdminSidebar` — composant sidebar avec identité admin, groupes de liens, lien actif, déconnexion
- `components/admin/AdminSidebarLink` (ou équivalent) — lien avec détection d'état actif via `usePathname()`
- `app/admin/(protected)/layout.tsx` — shell mis à jour : sidebar + zone de contenu en deux colonnes
- `app/admin/(protected)/page.tsx` — dashboard simplifié, allégé de la redondance avec la sidebar

**Hors périmètre de ce lot :** toutes les autres pages admin.

**Vérifications :**

- `pnpm run typecheck`
- `pnpm exec playwright test tests/e2e/admin/auth.spec.ts tests/e2e/admin/products.spec.ts tests/e2e/admin/categories.spec.ts tests/e2e/admin/orders.spec.ts`

---

### Lot V7-2 — Pages listes simples

**Périmètre :**

- `orders/page.tsx` (109 lignes), `categories/page.tsx` (108 lignes), `blog/page.tsx` (119 lignes), `products/page.tsx` (130 lignes)
- Extraire les patterns de carte récurrents (article avec chips et lien) vers des composants dans `components/admin/`
- `page.tsx` conserve l'orchestration ; le JSX de chaque carte passe dans un composant dédié

**Hors périmètre :** aucun changement de comportement, aucun changement de wording, aucune modification de repository. Les `<article>` sémantiques et leurs attributs sont préservés (`getByRole("article")` ciblé dans les tests).

**Vérifications :**

- `pnpm run typecheck`
- `pnpm exec playwright test tests/e2e/admin/products.spec.ts tests/e2e/admin/categories.spec.ts tests/e2e/admin/orders.spec.ts tests/e2e/admin/blog.spec.ts`

---

### Lot V7-3 — Pages formulaires intermédiaires

**Périmètre :**

- `homepage/page.tsx` (449 lignes) — extraire les 5 sections du formulaire en composants colocalisés ; `page.tsx` réduit à l'orchestration
- `products/new/page.tsx` (164 lignes) — si des sections extractibles sont identifiées à la planification du lot
- Les formulaires d'édition simples existants (catégories, articles) — si au-delà du seuil à la planification

**Sections cibles de `homepage/page.tsx` :**

- Bannière principale (titre, texte, image)
- Bloc éditorial
- Produits mis en avant
- Catégories mises en avant
- Articles mis en avant

**Hors périmètre :** aucun changement de comportement, aucun changement de wording, aucune modification de repository.

**Vérifications :**

- `pnpm run typecheck`
- `pnpm exec playwright test tests/e2e/admin/homepage.spec.ts tests/e2e/admin/product-new.spec.ts`

---

### Lot V7-4 — Détail commande

**Périmètre :**

- `orders/[id]/page.tsx` (441 lignes)
- Extraire chaque section en composants colocalisés ; `page.tsx` réduit à l'orchestration

**Sections cibles :**

- Synthèse et état
- Actions disponibles (expédition, transitions)
- Expédition et suivi
- Paiement
- Emails transactionnels
- Informations cliente
- Adresses de livraison et de facturation
- Récapitulatif des lignes

**Hors périmètre :** aucun changement de comportement, aucun changement de wording, aucune modification de repository.

**Vérifications :**

- `pnpm run typecheck`
- `pnpm exec playwright test tests/e2e/admin/orders.spec.ts`

---

### Lot V7-5 — Détail produit

**Périmètre :**

- `products/[id]/page.tsx` (1 663 lignes) — le chantier le plus important de V7
- Extraire chaque section en composants colocalisés ; `page.tsx` réduit à l'orchestration
- Les composants communs avec d'autres pages sont promus dans `components/admin/`

**Sections cibles :**

- Informations générales (nom, slug, description courte, description longue)
- Images (image principale, galerie)
- Organisation (catégories, mise en avant)
- Informations de vente (produit simple) / Déclinaisons (produit avec déclinaisons)
- Publication et SEO
- Actions dangereuses (suppression du produit)

**Hors périmètre :** aucun changement de comportement, aucun changement de wording, aucune modification de repository. Les `<article>` de déclinaisons et d'images sont préservés.

**Vérifications :**

- `pnpm run typecheck`
- `pnpm exec playwright test tests/e2e/admin/product-stock.spec.ts tests/e2e/admin/product-type.spec.ts tests/e2e/admin/product-images.spec.ts`

---

### Lots V7-6+ — Cohérence et finitions

À définir selon les besoins constatés après les lots 1 à 5 :

- Harmonisation des patterns communs restants vers `components/admin/`
- Éventuellement : nouveaux composants shadcn si un besoin concret est identifié
- Ajustements de l'espace dashboard après retour d'usage

Ces lots ne sont pas planifiés en détail à ce stade.

---

## 11. Hors périmètre de V7

Les éléments suivants ne font pas partie de V7 :

- Front public (catalogue, blog, homepage publique)
- Tunnel d'achat et paiement
- Logique métier, repositories, schéma de base de données
- Authentification admin (`/admin/login`, `/admin/logout`)
- Galerie d'images complète ou refonte du module média
- Refonte globale du CSS ou de `app/globals.css` sans nécessité prouvée
- Introduction de composants shadcn non listés dans la section 7 sans validation explicite
- Pages publiques de produit, de catégorie, de blog
- Tout ce qui n'est pas `app/admin/` ou ses composants directs

`app/admin/(protected)/media/page.tsx` est une référence utile pour l'usage de `Button`, `Card` et le pattern upload, mais elle n'est pas le premier chantier V7 et ne nécessite pas de découpage prioritaire.

---

## 12. Critères de validation

### Lot V7-1 (Shell + sidebar)

- La sidebar est visible sur toutes les pages admin protégées
- Le lien courant est visuellement distingué
- Les 7 destinations sont accessibles depuis la sidebar
- Les 3 groupes (Catalogue, Contenu, Opérations) sont présents
- La déconnexion fonctionne
- `pnpm run typecheck` passe sans erreur
- `pnpm exec playwright test tests/e2e/admin/auth.spec.ts tests/e2e/admin/products.spec.ts tests/e2e/admin/categories.spec.ts tests/e2e/admin/orders.spec.ts` passe sans régression

### Lot V7-2 (Pages listes simples)

- Le comportement de chaque page liste est identique avant et après
- Les `<article>` sémantiques sont préservés ; `getByRole("article")` continue de fonctionner
- `pnpm run typecheck` passe sans erreur
- `pnpm exec playwright test tests/e2e/admin/products.spec.ts tests/e2e/admin/categories.spec.ts tests/e2e/admin/orders.spec.ts tests/e2e/admin/blog.spec.ts` passe sans régression

### Lot V7-3 (Formulaires intermédiaires)

- Le comportement de chaque formulaire est identique avant et après
- Aucun heading métier visible n'est renommé
- `pnpm run typecheck` passe sans erreur
- `pnpm exec playwright test tests/e2e/admin/homepage.spec.ts tests/e2e/admin/product-new.spec.ts` passe sans régression

### Lot V7-4 (Détail commande)

- Le comportement de la page est identique avant et après le découpage
- Aucun heading métier visible n'est renommé
- `pnpm run typecheck` passe sans erreur
- `pnpm exec playwright test tests/e2e/admin/orders.spec.ts` passe sans régression

### Lot V7-5 (Détail produit)

- Le comportement de la page est identique avant et après le découpage
- Aucun heading métier visible n'est renommé
- Les `<article>` de déclinaisons et d'images sont préservés
- `pnpm run typecheck` passe sans erreur
- `pnpm exec playwright test tests/e2e/admin/product-stock.spec.ts tests/e2e/admin/product-type.spec.ts tests/e2e/admin/product-images.spec.ts` passe sans régression
- `products/[id]/page.tsx` fait moins de 200 lignes après le lot

### Critères globaux V7

- Aucun fichier de repository, d'entité ou de migration n'est modifié
- Aucune règle de `docs/v6/tailwind-shadcn-migration.md` n'est contredite
- Le vocabulaire visible respecte `docs/v6/glossary.md` et `docs/v6/admin-language-and-ux.md`
- La séparation `components/ui/` (primitives) / `components/admin/` (patterns admin) est respectée
- `components/admin/` ne contient aucun accès base de données ni Server Action
