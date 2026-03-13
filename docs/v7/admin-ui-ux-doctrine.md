# V7 — Doctrine UI/UX admin

Ce document contient le cadre général, stable et transversal de V7.

Il prolonge directement :

- `docs/v6/admin-language-and-ux.md` — vocabulaire, structure d'écran, règles de formulation
- `docs/v6/glossary.md` — terminologie métier officielle
- `docs/v6/tailwind-shadcn-migration.md` — règles d'usage de shadcn/ui et Tailwind dans l'admin

Il ne les contredit pas. Il en constitue la suite structurelle.

---

## 1. Objectif de V7

V7 est un prolongement de V6 centré sur la modernisation de l'interface de gestion interne et sur l'élévation de sa qualité perçue.

Son périmètre est strictement limité à l'admin (`app/admin/`). Il ne touche pas au front public, au tunnel d'achat, au paiement, ni aux règles métier.

Trois axes principaux :

1. **Shell admin** — faire du shell une structure premium, moderne et mobile-first, avec sidebar fixe sur desktop, header fixe, contenu scrollable et navigation mobile dédiée.
2. **Composants admin** — faire de `components/admin/` la couche de référence pour les patterns admin, construits prioritairement avec `components/ui/`, shadcn/ui et Tailwind.
3. **Découpage des pages volumineuses** — réduire `page.tsx` à un rôle d'orchestration, en déléguant les sections à des composants dédiés.

V7 ne change aucune règle métier, aucune validation, aucun repository, aucun schéma de base de données.

---

## 2. Principes UI/UX de l'admin Creatyss

V7 vise un admin Creatyss plus intuitif, plus lisible, plus rapide à parcourir et plus agréable à utiliser.

L'objectif est un back-office artisanal premium :

- structuré
- rassurant
- sobre
- moderne
- rapide à parcourir
- orienté tâches
- pensé pour une utilisatrice non technique

Le terme **premium** renvoie à des critères concrets :

- lisibilité immédiate
- vitesse perçue élevée
- densité maîtrisée
- cohérence visuelle et comportementale
- confort d'usage quotidien

Principes directeurs :

- navigation persistante et repérage immédiat
- hiérarchie visuelle claire et contrastes lisibles
- densité maîtrisée : plus d'information utile, moins de bruit visuel
- vitesse perçue : actions visibles, feedbacks nets, parcours directs
- pages orientées action
- formulaires compréhensibles
- cohérence des composants, espacements, états et rythmes visuels
- confort d'usage sur desktop comme sur mobile
- sobriété plutôt qu'effet
- composants au service de la cohérence
- aucun déplacement du métier dans l'UI

V7 ne cherche pas à produire un dashboard démonstratif, mais un espace de gestion plus fluide, plus élégant, plus cohérent et plus confortable, au service des tâches métier déjà présentes.

---

## 3. État de référence de l'admin

### Shell

La base V7 du shell existe déjà : `app/admin/(protected)/layout.tsx` s'appuie sur une sidebar latérale et une zone de contenu distincte.

Cette base améliore nettement le repérage, mais n'atteint pas encore la cible doctrinale complète : le header fixe du shell n'est pas encore posé comme référence, le comportement de scroll n'est pas formalisé à l'échelle du shell, et la stratégie mobile doit converger vers un vrai pattern dédié.

### Navigation

Les 7 destinations sont déjà regroupées dans une navigation latérale :

- Accueil admin
- Catalogue : Produits, Catégories
- Contenu : Page d'accueil, Blog
- Opérations : Commandes, Médias

Le lien actif est déjà signalé. La doctrine mobile doit être clarifiée : une navigation horizontale scrollable n'est pas une cible acceptable.

### Base UI disponible

Le répertoire `components/ui/` contient un ensemble étendu de primitives shadcn installées et disponibles.

Dans l'admin, les composants constituant la base stable effectivement utilisée :

| Composant | Origine | Usage actuel principal |
| --- | --- | --- |
| `Button` | shadcn/ui | Formulaires de soumission, actions principales |
| `Card` | shadcn/ui | Sections de contenu, upload, grilles, surfaces |
| `PageHeader` | maison | En-tête des pages admin migrées |
| `Notice` | maison | Messages système (succès, alerte, note) |
| `SectionIntro` | maison | En-tête de section dans les pages détail et formulaires |

D'autres primitives shadcn sont présentes (`Sidebar`, `Sheet`, `ScrollArea`, `Separator`, `Tooltip`, `Label`, `Input`, `Textarea`, `Select`, `Checkbox`, etc.) mais pas encore toutes utilisées de manière homogène dans l'admin.

L'objectif V7 n'est pas d'introduire shadcn/ui dans l'admin — il y est déjà. Il s'agit d'en faire la base prioritaire et cohérente des prochains lots, en articulation avec `components/admin/`.

### Couche `components/admin/`

Une première couche `components/admin/` existe déjà : shell, liens de sidebar, cartes de liste, helpers de formulaire.

Cette couche reste incomplète et encore hétérogène. V7 doit en faire la couche de référence pour les patterns admin réutilisables, avec une base prioritaire shadcn/ui + Tailwind.

---

## 4. Principes structurants

### Pas de changement métier

V7 ne modifie aucune règle de gestion, aucune validation, aucun repository, aucun schéma. Tout changement ayant un impact sur le comportement métier est hors périmètre.

### Migration progressive, page par page

V7 avance par lots. Chaque lot est autonome et laisse l'admin dans un état fonctionnel. On ne migre pas toutes les pages d'un coup.

### Maintien des headings métier existants

Les headings (`h1`, `h2`) visibles dans les pages ne doivent pas être renommés sans besoin explicite. Les tests e2e ciblent souvent les headings. Renommer en masse créerait du bruit sans bénéfice UX réel.

### Admin interne uniquement

V7 concerne exclusivement l'admin interne (`app/admin/`). Le front public, le catalogue, le blog public, le tunnel d'achat et les pages d'authentification (`/admin/login`, `/admin/logout`) ne font pas partie de ce périmètre.

### `components/admin/` compose, ne duplique pas

Les composants dans `components/admin/` doivent composer les primitives de `components/ui/` et ne jamais en dupliquer la responsabilité. Un composant admin peut utiliser `Button`, `Card`, `Notice`, `PageHeader`, `SectionIntro` — il ne les réimplémente pas.

### Base UI prioritaire

Le shell admin et les nouveaux composants admin V7 se construisent prioritairement avec shadcn/ui + Tailwind via `components/ui/` et `components/admin/`.

Les classes CSS custom admin existantes restent disponibles pour préserver l'existant, mais elles deviennent une compatibilité transitoire, pas la cible de référence.

---

## 5. Architecture des composants admin

### `components/ui/` — primitives partagées

Cette couche existe déjà. Elle reste la source des primitives partagées de référence.

Certaines primitives restent maison (`PageHeader`, `Notice`, `SectionIntro`), d'autres viennent de shadcn/ui (`Button`, `Card` et les primitives admises en section 7).

Aucune primitive de cette couche ne porte de logique spécifique à l'admin. Elle reste générique.

### `components/admin/` — couche admin

Cette couche est déjà engagée dans V7. Elle est la couche de référence pour les patterns propres à l'admin. Elle contient des composants qui :

- ne sont utilisés que dans l'admin
- composent des primitives de `components/ui/`
- utilisent prioritairement Tailwind pour le layout, l'espacement et les états
- extraient des patterns récurrents des pages volumineuses
- portent une logique de présentation propre à l'admin

Exemples de composants attendus dans cette couche :

- **Shell et navigation** : `AdminSidebar`, `AdminSidebarLink`
- **Patterns de page** : composants de section extraits des pages détail volumineuses
- **Patterns de liste** : composants de carte récurrents dans les listes
- **Patterns de formulaire** : `AdminFormField`, `AdminFormSection`, `AdminFormActions`

Un composant dans `components/admin/` ne doit jamais accéder à la base de données, ni importer de repository, ni contenir de Server Action. Ces responsabilités restent dans `app/admin/` et `features/`.

---

## 6. Règles de découpage des pages

### Règle d'orchestration

Un `page.tsx` a un rôle d'orchestration. Il doit :

1. résoudre les paramètres (`params`, `searchParams`)
2. charger les données (appels aux repositories ou features)
3. mapper les messages de statut ou d'erreur
4. déléguer le rendu de chaque section à des composants dédiés

Il ne doit pas contenir du JSX de sections entières.

### Règle de seuil

- En dessous de 200 lignes : pas de découpage requis.
- Entre 200 et 350 lignes : découpage optionnel si des sections identifiables se répètent.
- Au-delà de 350 lignes : découpage requis avant toute évolution de la page.

### Règle de localité

Un composant extrait d'une page reste colocalisé avec elle s'il n'est utilisé que sur cette page. Il migre vers `components/admin/` s'il devient réutilisable sur plusieurs pages.

### Règle d'unicité de responsabilité

Un composant extrait ne doit porter qu'une seule section ou qu'un seul pattern. Ne pas extraire un composant "mega-page" qui déplace simplement le problème.

---

## 7. Règles d'usage de shadcn/ui et Tailwind

### Base prioritaire

Le shell admin V7 et les nouveaux composants de `components/admin/` se construisent en priorité avec :

- les primitives disponibles dans `components/ui/`
- les composants shadcn déjà installés et pertinents pour l'admin
- Tailwind pour le layout, les espacements, la densité, les états et le responsive

Les classes CSS custom admin historiques restent disponibles pour préserver l'existant, mais elles ne constituent plus la cible de référence du shell admin ni des nouveaux composants admin.

### Composants shadcn prioritaires pour V7 admin

#### Shell, navigation et structure

- `Sidebar`, `Sheet`, `ScrollArea`, `Separator`, `Tooltip`, `Collapsible`, `Breadcrumb`

Utilisés en priorité pour : sidebar desktop, navigation mobile via drawer, groupes de navigation, zones scrollables contrôlées, séparations visuelles.

#### Actions, surfaces et feedback

- `Button`, `Card`, `Badge`, `Alert`, `AlertDialog`, `DropdownMenu`, `Skeleton`, `Spinner`

Utilisés en priorité pour : surfaces de contenu admin, actions principales et dangereuses, états de chargement, messages de feedback, menus contextuels.

#### Formulaires

- `Label`, `Input`, `Textarea`, `Select`, `Checkbox`, `Field`, `InputGroup`

Utilisés en priorité pour : champs de formulaire, blocs de saisie, structures label + contrôle + aide, groupes réutilisables dans `components/admin/`.

### Composants disponibles mais non imposés

Le repo contient d'autres composants shadcn (`Dialog`, `Drawer`, `Popover`, `Combobox`, `Switch`, `Tabs`, `Calendar`, `Chart`, `Pagination`, `RadioGroup`, `Sonner`, `Toggle`, etc.).

Leur présence ne rend pas leur usage automatique. Ils ne doivent être utilisés que si :

- le besoin du lot est clair
- le composant améliore réellement l'UX admin
- il évite une réimplémentation ad hoc inutile
- son introduction reste cohérente avec la sobriété et la lisibilité attendues de V7

### Règle de préférence

Lorsqu'un composant shadcn couvre proprement le besoin d'un lot V7, il doit être préféré :

1. à l'ajout d'une nouvelle classe CSS custom admin
2. à une réimplémentation locale ad hoc
3. à une structure HTML répétée sans gain de lisibilité

Cette préférence ne s'applique qu'aux composants pertinents pour le besoin réel du lot.

### Règle d'introduction dans un lot V7

Avant d'utiliser un composant shadcn dans un lot :

1. vérifier qu'il répond clairement au besoin structurel ou interactif du lot
2. vérifier qu'il améliore réellement la cohérence, la lisibilité ou le confort d'usage
3. vérifier qu'il est introduit via `components/ui/` ou `components/admin/`, et non directement dans un `page.tsx`
4. éviter toute introduction purement décorative ou gadget

### Règle de composition

`components/ui/` reste la couche de primitives.
`components/admin/` compose ces primitives pour créer des patterns propres à l'admin.

Un composant admin peut assembler `Card`, `Button`, `Badge`, `Field`, `Input`, `Select`, `Sidebar`, `Sheet`, `ScrollArea`, etc. Il ne duplique pas la responsabilité d'une primitive déjà disponible.

### Règle des classes CSS existantes

Les classes CSS existantes dans `app/globals.css` (`.store-card`, `.button`, `.admin-chip`, `.admin-field`, etc.) ne sont pas supprimées brutalement.

Elles restent disponibles pour préserver l'existant et accompagner une migration progressive. En revanche :

- elles deviennent une compatibilité transitoire
- elles ne doivent plus dicter la forme des nouveaux composants admin
- elles ne doivent plus être le premier réflexe pour construire un nouveau shell ou un nouveau pattern de formulaire

### Règle des nouvelles classes CSS custom admin

Créer une nouvelle classe CSS custom admin est une exception. Ce n'est acceptable que si :

1. un assemblage Tailwind lisible ne suffit pas
2. aucun composant `components/ui/` ou `components/admin/` existant ne couvre proprement le besoin
3. le pattern est stable, partagé et justifié
4. l'ajout est documenté dans le lot concerné

### Règle Tailwind prioritaire

Tout nouveau shell, layout, conteneur, zone de navigation, structure de formulaire, bloc de contenu ou pattern admin conçu en V7 doit utiliser Tailwind en priorité.

### Règle globals.css

`app/globals.css` n'est pas modifié dans le cadre d'un lot V7, sauf nécessité stricte déjà prouvée et explicitement validée.

---

## 8. Règles de navigation admin

### Pourquoi une sidebar

La sidebar améliore l'intuitivité d'un back-office :

- elle est **permanente** : l'utilisatrice sait toujours où elle se trouve
- elle **signale l'état courant** : le lien actif est visible en permanence
- elle permet des **groupes sémantiques** par domaine métier
- elle **libère la zone de contenu**
- elle est **extensible** : ajouter une section ne dégrade pas l'affichage des autres

### Structure cible du shell

```text
┌──────────────────────┬──────────────────────────────────────────┐
│ Sidebar fixe desktop │ Header fixe                              │
│                      ├──────────────────────────────────────────┤
│  Navigation          │ Zone de contenu scrollable               │
│  Identité admin      │                                          │
│  Déconnexion         │  {children}                              │
│                      │                                          │
└──────────────────────┴──────────────────────────────────────────┘
```

Règles structurantes :

- sur desktop, la sidebar est fixe et visible en permanence
- le header du shell est fixe
- le contenu principal est la zone scrollable de référence
- le `PageHeader` métier de chaque page reste dans le contenu ; le header fixe du shell ne le remplace pas

### Mobile-first réel

La cible V7 est mobile-first. Règles explicites :

- la navigation horizontale scrollable n'est plus une cible acceptable sur mobile
- le pattern prioritaire est un `Sheet` / drawer piloté depuis le header fixe
- une navigation basse fixe n'est acceptable que pour 3 à 5 actions principales au maximum
- pour l'admin Creatyss (7 destinations, groupes métier), la navigation mobile de référence est le `Sheet` / drawer

### Groupes de navigation

| Groupe | Destinations |
| --- | --- |
| Catalogue | Produits, Catégories |
| Contenu | Page d'accueil, Blog |
| Opérations | Commandes, Médias |

"Accueil admin" reste un lien solo au-dessus des groupes.

### Lien actif

Le lien courant doit être visuellement distingué. La détection se fait via `usePathname()` — la sidebar ou ses liens sont des Client Components. Le reste du shell peut rester Server Component.

### Header fixe

Le shell cible comporte un header fixe, distinct du `PageHeader` métier rendu dans la page.

Ce header peut contenir :

- le déclencheur d'ouverture du `Sheet` / drawer sur mobile
- un repère court de contexte ou de page si utile
- des actions globales de shell si elles existent

Il ne remplace pas le `h1` métier de la page.

### Identité admin et déconnexion

L'identité de l'admin et la déconnexion sont des éléments structurels du shell :

- le nom de l'admin connecté (`admin.displayName`)
- l'email (`admin.email`)
- le bouton "Se déconnecter"

Ces informations viennent du Server Component parent et sont passées en props aux composants client du shell. Sur desktop, elles trouvent naturellement leur place dans la sidebar.

### Libellé "Médias" en sidebar

Le lien en sidebar porte le libellé court "Médias". Le label de la page (`PageHeader`) reste "Bibliothèque médias".

---

## 9. Hors périmètre de V7

- Front public (catalogue, blog, homepage publique)
- Tunnel d'achat et paiement
- Logique métier, repositories, schéma de base de données
- Authentification admin (`/admin/login`, `/admin/logout`)
- Galerie d'images complète ou refonte du module média
- Refonte globale du CSS ou de `app/globals.css` sans nécessité prouvée
- Suppression brutale des classes CSS historiques sans lot dédié et validation explicite
- Introduction de composants shadcn non listés en section 7 sans validation explicite
- Pages publiques de produit, de catégorie, de blog
- Tout ce qui n'est pas `app/admin/` ou ses composants directs

---

## 10. Critères globaux V7

- Aucun fichier de repository, d'entité ou de migration n'est modifié
- Aucune règle de `docs/v6/tailwind-shadcn-migration.md` n'est contredite
- Le vocabulaire visible respecte `docs/v6/glossary.md` et `docs/v6/admin-language-and-ux.md`
- La séparation `components/ui/` (primitives) / `components/admin/` (patterns admin) est respectée
- `components/admin/` ne contient aucun accès base de données ni Server Action
- Le shell admin et les nouveaux composants admin utilisent prioritairement shadcn/ui + Tailwind
- Les classes CSS custom admin existantes restent une compatibilité transitoire ; toute nouvelle classe custom relève d'une exception justifiée
- La navigation mobile n'utilise pas de navigation horizontale scrollable comme cible
- Le terme "premium" renvoie à des critères concrets : lisibilité, vitesse perçue, densité maîtrisée, cohérence et confort d'usage
