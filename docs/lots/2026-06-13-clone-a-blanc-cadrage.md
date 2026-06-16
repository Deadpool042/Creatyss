<!-- docs/lots/2026-06-13-clone-a-blanc-cadrage.md -->

# Cadrage — Validation « Clone à blanc » (Horizon 4, proposition à valider)

> **Statut : validé (2026-06-16).** Cf. `docs/audit/clone-a-blanc-validation-2026-06-16.md`.
> Référence : `docs/roadmap/projet-creatyss.md` (Horizon 4, dernière case
> non cochée), `docs/audit/audit-clonabilite-2026-06-12.md`,
> `docs/architecture/10-fondations/10-principes-d-architecture.md`.

## Objectif

La case roadmap « Clone à blanc : repo cloné, marque/contenu/config
changés, boutique fonctionnelle sans modification du cœur » est le dernier
item non cadré d'Horizon 4. Ce document fait l'état des lieux des
recommandations R1-R6 (toutes traitées au 2026-06-13), identifie les points
de configuration « instance » résiduels non couverts par le pattern établi,
et propose une décision préalable avant tout sous-lot.

## Acquis (R1-R6, traités au 2026-06-13)

- **R1** — `core/config/brand.ts` : source de marque unique, consommée par
  `app/layout.tsx` (metadata), `footer-public.tsx`, et désormais
  `boutique-reassurance-items.ts` et `app/(public)/categories/page.tsx`
  (R3, ce jour). Garde anti-régression `brand-copy-guard.test.ts`.
- **R2** — Pages de contenu (`a-propos`, `les-marches`, `contact`) en
  copy/config, cible « pages à blocs » tracée pour plus tard.
- **R3** — Copy storefront restant extrait vers `brandConfig` (ce jour).
- **R4** — `scripts/import-woocommerce/README.md` documente le statut
  bootstrap Creatyss-only, `WC_*` hors runtime, couplage `seed:dev`.
- **R5** — Résolution de boutique unifiée (« premier store »,
  `findFirst orderBy createdAt`), `CANONICAL_STORE_CODE` éliminé du code
  applicatif (résiduel dans `ensure-store.ts`, couvert par R4).
- **R6** — `core/config/instance-redirects.ts` : redirects historiques
  Woo/WordPress extraits de `next.config.ts`, avec commentaire explicite
  « pour un clone, vider ce tableau ».

`core/config/instance-redirects.ts` établit déjà le **pattern de
référence** pour ce qu'un clone édite : un fichier sous `core/config/`,
commenté, qui documente quoi changer et quoi vider.

## État des lieux — points de configuration « instance » non couverts par le pattern

1. **Identité du store au premier seed** —
   `scripts/helpers/admin-bootstrap.ts` (`ensureDefaultStore`) crée, si
   aucun store n'existe, un `Store` avec `code/slug: "creatyss"`,
   `name/legalName: "Creatyss"`, et `DEV_ADMINS` contient
   `admin@creatyss.local`. Utilisé par `seed:dev`, `seed:variables`,
   `bootstrap:store-admin`. Ce n'est pas `core/config/brand.ts` qui pilote
   cette création — duplication d'identité entre deux endroits.
   - Le modèle `Store` est éditable en admin (`/admin/settings/general` —
     `name`, `legalName`, `slug`, etc.), donc un clone peut renommer la
     boutique **après** le premier seed sans toucher au code. Mais le seed
     initial reste « Creatyss » par défaut, et l'email admin de dev est
     `@creatyss.local`.

2. **`<html lang="fr">` codé en dur** (`app/layout.tsx`) — déjà identifié
   dans le cadrage L3 (`docs/lots/2026-06-13-localization-l3-cadrage.md`)
   comme un sujet multilingue. Pour un clone mono-langue (toute locale,
   pas seulement `fr`), c'est aussi un point de configuration : la langue
   de la boutique clonée n'est pas forcément le français.

3. **Thème / polices** — `app/styles/theme.css` (tokens Tailwind v4) porte
   la palette ; `app/layout.tsx` importe directement les polices Google
   (`Cormorant_Garamond`, `Jost`) en dur. Non audité dans ce cadrage : un
   re-skin complet (couleurs + typographie) nécessite-t-il de toucher
   `app/layout.tsx`, ou seulement `theme.css` ? Si la police fait partie de
   l'identité de marque, `app/layout.tsx` n'est pas un fichier « cœur » au
   sens strict mais devient un point de configuration à documenter.

4. **Logo** — référencé en chemin statique `/uploads/logo.svg` dans 5
   fichiers (`footer-public.tsx`, `mobile-menu-drawer.tsx`,
   `topbar-public.tsx`, `admin-topbar.tsx`, `login-form.tsx`). C'est un
   chemin d'upload, pas un asset commité : un clone remplace le fichier
   servi à ce chemin, **aucun changement de code**. Point déjà clonable,
   à documenter explicitement pour éviter qu'un futur lot ne le considère
   comme un gap.

5. **Contenu légal seedé** — `prisma/seed/legal-pages.seed.ts` contient le
   texte intégral des CGV/politique de confidentialité **repris de
   creatyss.com** (35 occurrences de « Creatyss », SIRET-like, email
   `creatyss@laposte.net`). R2 a acté que les pages légales vivent en DB
   (clone édite en admin) — mais le **seed initial** fournit un contenu
   juridique propre à Creatyss comme valeur par défaut d'un clone. Statut
   actuel : c'est un contenu de démonstration/bootstrap, pas un contrat de
   socle — même famille que R4 (Woo bootstrap), mais non documenté comme
   tel.

## Décisions à trancher avant de découper en sous-lots

1. **Périmètre de « sans modification du cœur »** : les scripts de
   `scripts/` (seed/bootstrap dev) comptent-ils comme « cœur » ? Si non
   (probable, cohérent avec le traitement de R4), la procédure de clone
   doit lister explicitement les fichiers `scripts/`/`prisma/seed/`/
   `core/config/` qu'un clone édite avant ou après le premier seed —
   distinct des composants applicatifs.

2. **Centraliser ou documenter ?** Pour le point 1 (identité du store au
   seed) : étendre `ensureDefaultStore` pour lire `core/config/brand.ts`
   (petit refactor ciblé, cohérent avec R1 — une seule source pour
   `name`/`code`/`slug`), ou se contenter de documenter que la boutique
   seedée s'appelle « Creatyss » par défaut et se renomme ensuite en admin ?

3. **Nature de la validation** : exécution ponctuelle (cloner, ajuster,
   constater, documenter le résultat dans un doc daté — comme l'audit
   clonabilité), ou procédure répétable/scriptée (pas de CI proposée à ce
   stade, hors périmètre sauf décision explicite) ?

4. **Niveau de « fonctionnel » attendu** : storefront + admin de base
   suffisent (catalogue vide ou minimal), ou un parcours commerce complet
   (Horizon 2 : panier → checkout → commande) sur l'instance clonée ?

5. **Contenu légal seedé (point 5)** : traiter comme R4 (documenter le
   statut « contenu de bootstrap Creatyss, à remplacer en admin par le
   clone ») suffit-il, ou faut-il un seed générique neutre en plus ?

## Proposition de sous-lots (après décisions ci-dessus)

1. **Petit** — Inventaire écrit des points de configuration instance
   (`core/config/brand.ts`, `core/config/instance-redirects.ts`, identité
   store au seed, `<html lang>`, polices/theme, logo, contenu légal seedé)
   dans un document unique (`docs/exploitation/` ou
   `docs/architecture/`) — zéro code, sert de checklist au sous-lot 3.

2. **Selon décision 2** — Si centralisation retenue : faire lire
   `ensureDefaultStore` depuis `core/config/brand.ts` pour `name`/
   `code`/`slug` (et éventuellement documenter `DEV_ADMINS` comme
   config dev, pas identité de boutique).

3. **Selon décision 5** — Documenter le contenu légal seedé comme contenu
   de bootstrap Creatyss (note dans `prisma/seed/legal-pages.seed.ts` et/ou
   fiche domaine `pages`/`legal`), sur le modèle du README R4.

4. **Gros** — Exécuter la validation « clone à blanc » : cloner le repo
   dans un répertoire/branche temporaire, appliquer uniquement les
   changements listés au sous-lot 1, lancer le flux local natif
   (`pnpm install`, `db:push`, `bootstrap:store-admin`, `pnpm dev`),
   vérifier storefront + admin fonctionnels sous la nouvelle identité, et
   constater l'absence de diff hors fichiers de configuration. Documenter
   le résultat (réussite ou écarts) dans un doc daté, puis cocher la case
   roadmap.

## Hors périmètre (rappel)

- Import générique CSV (capacité optionnelle séparée, non implémentée).
- Routing localisé / multilingue (cadrage L3, en pause).
- Toute automatisation CI du clone, sauf décision explicite (point 3).

## Prochaine étape proposée

Trancher les points 1-5 ci-dessus (échange produit, pas un cadrage
technique supplémentaire), puis revenir à `architect-review` pour
découper et séquencer les sous-lots retenus.
