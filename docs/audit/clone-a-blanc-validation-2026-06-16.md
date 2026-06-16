<!-- docs/audit/clone-a-blanc-validation-2026-06-16.md -->

# Validation « Clone à blanc » — 2026-06-16

**Statut : réussi.**
Référence : `docs/lots/2026-06-13-clone-a-blanc-cadrage.md`, sous-lot 4.

## Contexte

Dernière case non cochée d'Horizon 4 :
> « Clone à blanc : repo cloné, marque/contenu/config changés, boutique
> fonctionnelle sans modification du cœur. »

## Procédure exécutée

Branche : `validation/clone-a-blanc` (à ne pas merger sur `main`).

**Fichiers modifiés (config instance uniquement) :**

- `core/config/brand.ts` : marque fictive « AtelierXX », storeCode/storeSlug
  `atelierxx`, copy storefront adapté (baseline, tagline, items atelier,
  metadata, etc.).
- `core/config/instance-redirects.ts` : tableau vidé (aucun redirect héritage
  pour ce clone).

**Aucun autre fichier applicatif modifié.**

**Validation statique :**

- `npx tsc --noEmit` : zéro erreur TypeScript avec la marque fictive.

**Validation runtime :**

- DB de clone isolée (`creatyss_clone_test`, `localhost:5434`), `DATABASE_URL`
  surchargée dans `.env.local`.
- `pnpm db:push` → schéma appliqué sur base vide.
- `pnpm run bootstrap:store-admin` → store créé avec `name: "AtelierXX"`,
  `code: "atelierxx"`, `slug: "atelierxx"` — lus depuis `brand.ts` sans
  intervention manuelle (`ensureDefaultStore` centralisé, R1/R5).
- `pnpm dev` → démarrage sans erreur.
- Storefront : titre onglet et marque affichés « AtelierXX ».
- Admin : store visible sous « AtelierXX » dans settings/general.

## Résultat

**Clone à blanc validé.** Un clone du repo n'a besoin de toucher que les
fichiers listés dans `docs/exploitation/05-clonage-instance.md` pour obtenir
une boutique fonctionnelle sous une autre identité, sans modifier le cœur
applicatif.

Points non testés dans cette validation (hors périmètre retenu) :

- Remplacement du logo (`/uploads/logo.svg`) — mécanisme connu, pas de code à
  changer.
- Remplacement du contenu légal en admin — documenté dans
  `prisma/seed/legal-pages.seed.ts`.
- Changement de la locale `<html lang>` — sujet L3 localisation, non résolu
  tant que `platform.localization` reste au niveau `managed`.
- Thème / polices — `theme.css` + `app/layout.tsx`, à valider lors d'un
  re-skin complet (hors périmètre H4).

## Prochaine étape

Case Horizon 4 cochée. Branche `validation/clone-a-blanc` à supprimer après
merge ou abandon (ne pas merger les valeurs « AtelierXX » sur `main`).
