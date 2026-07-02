# Lot — Décision information architecture admin

## Statut

Validé — 2026-07-02. Séquence retenue : B (resync + labels) en premier micro-lot, A (fusion des 6 duplications) ensuite par sous-lots domaine, C (réduction 8→6 groupes) indépendante et cumulable.

Ce lot n'est explicitement PAS un lot de code. Aucune implémentation ne doit démarrer sur la base de ce document sans validation humaine préalable.

## Objectif

À partir de la cartographie produite par `lot-audit-navigation-admin.md` (livrable : `docs/audit/2026-07-02-audit-navigation-admin.md`), proposer 2 à 3 options concrètes de restructuration de l'information architecture de la navigation admin. Ces options sont des pistes à arbitrer, pas une décision actée.

## Options proposées

### Option A — Fusionner les 6 duplications confirmées gestion/configuration

L'audit (section 3.2) a confirmé 6 paires où une page domaine (`gestion`) et une page `settings/*` (`configuration`) coexistent pour le même sujet : catalogue, commandes, clients, médias, paiements, livraisons. Cette option fusionne chaque paire en un seul écran domaine avec un onglet ou une section "Configuration" intégrée, et retire l'entrée correspondante du groupe `Réglages`.

- **Ce qui reste inchangé :** les 13 routes `settings/*` qui n'ont pas d'équivalent domaine (Général, Équipe, API clients, Notifications, SEO, Avancé, IA, Canaux, Intégrations, Recherche, Webhooks, Localisation) restent dans `Réglages` — elles sont légitimement des réglages purs, pas des duplications.
- **Gain :** élimine les 6 duplications identifiées à la racine, plutôt que de les masquer. Le groupe `Réglages` passe de 7 items à un noyau plus restreint de réglages transverses.
- **Coût :** touche à la structure de routes de 6 domaines (redirects nécessaires depuis les anciennes URLs `settings/{catalog,orders,customers,media,payments,shipping}`), et à la structure interne des 6 écrans domaine concernés (ajout d'un onglet). C'est le changement le plus profond des trois options.
- **Capabilities/flags :** aucune capability n'est supprimée — `settings.catalogRead` etc. deviennent des sous-capabilities de l'onglet "Configuration" du domaine, gouvernant l'affichage de cet onglet précis plutôt qu'une route séparée.

### Option B — Resynchroniser sans fusionner (correctif de surface)

Ne change pas la séparation gestion/configuration. Corrige uniquement les incohérences observées :

- Synchroniser le hub `/admin/settings` (`SETTINGS_CARDS`, 13 cartes en dur) avec `adminNavigationItems` — soit en générant les cartes du hub depuis la même source de données que la sidebar, soit en complétant la sidebar pour qu'elle expose les 13 routes actuellement orphelines (audit section 2.1).
- Renommer les 5 "Vue d'ensemble" pour qu'elles portent le nom du domaine (ex. "Vue d'ensemble — Catalogue"), ou les supprimer si elles font doublon avec la page racine du groupe.
- Clarifier visuellement l'intitulé/sous-titre des écrans `settings/*` qui dupliquent un domaine, pour que la distinction "gérer" vs "configurer" soit explicite même sans fusion.

- **Gain :** risque très faible, aucune route supprimée ni déplacée, aucun redirect nécessaire. Corrige la désynchronisation sidebar/hub et l'ambiguïté des labels, qui sont deux irritants concrets indépendants de la question de fusion.
- **Coût :** ne résout pas la duplication structurelle elle-même — les 6 paires gestion/configuration continuent de coexister, seulement mieux nommées et mieux reliées entre elles.

### Option C — Réduire le nombre de groupes top-level

Indépendante des options A et B, cumulable avec l'une ou l'autre. Le groupe `Pilotage` ne contient qu'un seul item (`Analyses`) — l'audit ne montre aucune justification structurelle à un groupe dédié pour un seul écran. Le groupe `Maintenance` (3 items, tous `internalOnly`) pourrait rejoindre `Réglages > Avancé` plutôt que rester un groupe séparé, ce qui le rapprocherait de sa nature réelle (outillage technique interne, pas un domaine métier au même titre que Catalogue ou Commerce).

- **Gain :** réduit le nombre de groupes de 8 à 6, sans toucher à la structure interne d'aucun domaine.
- **Coût :** change l'emplacement de 4 items dans le menu (Analyses, Logs, Monitoring, Observabilité) — impact utilisateur mineur mais réel si ces écrans sont consultés fréquemment par habitude de placement.

## Recommandation (non actée)

Séquencer B puis A, C en option indépendante :

1. **B d'abord** — risque quasi nul, corrige deux irritants concrets (désynchronisation hub/sidebar, labels "Vue d'ensemble" ambigus) sans toucher une seule route. Peut être livré en un micro-lot isolé rapidement.
2. **A ensuite** — traite la cause structurelle (duplication gestion/configuration), mais demande un vrai sous-découpage par domaine (cf. `lot-implementation-nav-admin.md`, un sous-lot par groupe) à cause du risque de régression transversal déjà signalé dans l'audit.
3. **C à part** — à faire quand c'est commode, sans dépendance avec A ou B ; le gain (2 groupes en moins) est réel mais secondaire par rapport à la duplication.

Cette séquence n'est qu'une recommandation : elle n'est pas actée tant que la case de validation ci-dessous n'est pas cochée par l'humain.

## Périmètre

- Analyse comparative des options proposées : impact sur le nombre de clics, impact sur les capabilities/flags existants, impact sur les redirects nécessaires.
- Formulation d'une recommandation argumentée parmi les options, sans l'imposer.
- Présentation des options à l'humain pour validation explicite.

## Hors périmètre

- Toute implémentation de code.
- Toute modification de `features/admin/navigation/**` ou de `app/admin/(protected)/**`.
- Toute décision actée sans validation humaine explicite.

## Invariants

- Aucune capability ou feature flag existant ne doit être supprimé ou modifié dans les options proposées — seule la structure de présentation/regroupement est en jeu.
- Les options doivent rester compatibles avec le pattern de navigation existant (`AdminNavigationItem`, `AdminNavigationGroupDefinition`) sans proposer une refonte du modèle de données de navigation, sauf si l'audit démontre un blocage structurel.

## Risques

- Risque de sur-ingénierie si les options proposées introduisent une abstraction de navigation non justifiée par le besoin observé.
- Risque de decision paralysis si trop d'options sont proposées sans recommandation claire — se limiter à 2-3 options argumentées.

## Critères de fin

- 2 à 3 options concrètes sont documentées avec leurs avantages/inconvénients respectifs.
- Une recommandation est formulée mais explicitement présentée comme non actée.
- [x] Validation humaine explicite obtenue le 2026-07-02 : séquence B → A validée, C indépendante, cumulable quand commode.

## Agent recommandé

`architect-review` pour la proposition des options. Validation humaine ensuite, obligatoire avant toute suite.
