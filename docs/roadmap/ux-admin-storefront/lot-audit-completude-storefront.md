# Lot — Audit complétude storefront

## Statut

Livré — 2026-07-03. Rapport : `docs/audit/2026-07-03-audit-completude-storefront.md`.

Constat principal : le badge "À venir" sur l'espace client complet (`/compte`) est cohérent avec la doc — ni le code ni la roadmap H1-H4 ne le revendiquent comme livré. Le SEO storefront "en consolidation" (`projet-creatyss.md`) est confirmé exact, non obsolète.

**Écart corrigé pendant ce lot** (hors périmètre initial de l'audit, mais bug confirmé et isolé) : le formulaire "Suivre une commande" sur `/compte` soumettait en GET vers `/checkout/confirmation?reference=...`, une URL qui ne correspond à aucune route existante (seule `[reference]/page.tsx` existe, en segment de chemin) — 404 systématique. Corrigé via `OrderTrackingForm` (composant client), vérifié en conditions réelles.

Autres écarts observés, non corrigés (hors périmètre de ce lot, pas de plan de remédiation) : `/categories` absente du sitemap, `favoris` implémentée sans trace dans la roadmap H1-H4, formulaire de contact non câblé (déjà auto-déclaré "en cours d'activation" dans le code).

## Objectif

Vérifier systématiquement chaque page publique de `app/(public)/**` contre l'état déclaré "livré" dans les horizons H1-H4 (`docs/roadmap/projet-creatyss.md`, `docs/roadmap/h1-boutique-vendable/`, et les autres horizons applicables), afin d'identifier les écarts entre ce qui est documenté comme fait et ce qui est réellement complet.

## Périmètre

- Passage en revue de chaque route publique observée : `boutique`, `boutique/[slug]`, `categories`, `blog`, `blog/[slug]`, `checkout`, `checkout/confirmation`, `panier`, `favoris`, `contact`, `compte`, `mentions-legales`, `conditions-generales-de-vente`, `politique-confidentialite`, `politique-retour`, `a-propos`, `les-marches`.
- Point de départ déjà identifié : `app/(public)/compte/page.tsx` — la section "Espace client complet" est marquée "À venir" dans le code (badge + texte "Disponible prochainement"), seule la recherche de commande par référence (formulaire GET vers `/checkout/confirmation`) est fonctionnelle.
- Vérification de l'état réel du SEO storefront (balises meta, canonicals, sitemap) mentionné "en consolidation" dans `projet-creatyss.md`, pour confirmer si ce point est toujours ouvert ou déjà clos — la documentation peut être obsolète sur ce point.
- Croisement systématique documentation (roadmap H1-H4) vs code observé, sans se limiter au périmètre déjà connu (compte client).

## Hors périmètre

- Toute proposition de lot de correction — l'audit livre une liste d'écarts, pas un plan de remédiation. Un lot de correction ultérieur (probable `lot-espace-client.md`) pourra être cadré une fois l'audit connu, mais n'est pas créé dans ce lot.
- Le volet navigation admin (traité par les lots dédiés du même chantier).
- Toute modification de code.

## Invariants

- Chaque écart signalé doit être rattaché à un fichier de code observé et à une mention documentaire précise (fichier + section), afin de distinguer clairement observé, documenté, déduit et inconnu.
- Ne pas modifier `docs/roadmap/projet-creatyss.md` — toute anomalie documentaire y relative doit être signalée dans le livrable de ce lot, pas corrigée directement dans ce fichier.

## Risques

- Risque de confondre "documenté comme livré" et "réellement complet" — le lot doit explicitement croiser les deux sources.
- Le volet SEO storefront peut nécessiter une vérification technique (rendu des balises, sitemap généré) au-delà de la seule lecture de code, à cadrer si l'audit le justifie.

## Critères de fin

- Chaque page publique listée a été vérifiée contre son statut documenté dans les horizons H1-H4.
- La liste des écarts observés (documenté vs réel) est produite, avec référence fichier de code + référence documentaire pour chacun.
- Le statut réel du SEO storefront (ouvert / clos / partiellement clos) est établi avec preuve à l'appui.
- Aucun lot de correction n'est créé dans ce lot ; la suite probable (`lot-espace-client.md` ou équivalent) est mentionnée comme piste, pas actée.

## Agent recommandé

`docs-keeper` pour la vérification croisée documentation/code. `next-feature-builder` pour la suite éventuelle, hors périmètre de ce lot.
