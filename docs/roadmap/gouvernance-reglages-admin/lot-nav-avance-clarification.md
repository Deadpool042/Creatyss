# Lot — Clarification navigation "Avancé"

## Statut

À faire.

## Objectif

Signaler visuellement, dans la navigation admin, que la section "Avancé" (`/admin/settings/advanced/**`) est un panneau de **gouvernance technique des fonctionnalités**, distinct des écrans de configuration de valeurs métier (tarifs, livraison, taxes, informations boutique). Un utilisateur non technique doit comprendre, avant même d'y entrer, qu'il n'y trouvera pas de réglage de valeur mais un pilotage d'activation/niveau.

## Contexte

Confirmé par l'audit du 2026-07-03 (cf. `README.md` du chantier) : l'utilisateur a visité `/admin/settings/advanced/core/*` en s'attendant à un écran de réglages métier classique, et a été dérouté par un contenu de gouvernance (toggles, niveaux, statistiques). Le lien "Tarification" présent sur cet écran renvoie bien vers l'écran métier réel (`/admin/catalog/pricing`), mais rien ne l'indique avant le clic.

Item de navigation concerné : `advanced-settings` dans `features/admin/navigation/utils/admin-navigation.data.ts`. Doctrine de référence : `docs/domains/cross-cutting/feature-governance.md`, section "Réglages avancés".

## Périmètre

- Étudier un renommage du libellé de navigation "Avancé" pour un intitulé qui évoque explicitement la gouvernance/pilotage plutôt qu'un synonyme vague de "réglages poussés" (ex. "Modules & fonctionnalités", à valider avec le propriétaire produit — ne pas trancher unilatéralement le libellé final dans ce lot).
- Ajouter un texte de contexte en tête de l'écran `/admin/settings/advanced` expliquant en une phrase la distinction gouvernance / configuration, à destination d'une utilisatrice non technique.
- Vérifier si la distinction "Boutique" (`/admin/settings/store` — statut, domaines) vs "Général" (`/admin/settings/general` — identité, légal, contact) mérite aussi clarification ou fusion, ces deux écrans ayant un chevauchement thématique observé lors de l'audit.

## Hors périmètre

- Toute modification du contenu ou du comportement du panneau de gouvernance lui-même — cf. `lot-gouvernance-lisibilite-niveaux.md`.
- Toute réorganisation structurelle plus large de la navigation admin — déjà traitée par le chantier `docs/roadmap/ux-admin-storefront/` (terminé).
- Toute décision actée sans validation du propriétaire produit sur le libellé final.

## Invariants

- Aucune capability ni feature flag ne doit être modifié — changement de libellé et de copy uniquement.
- Aucune route ne doit changer d'URL sans redirect, si un renommage de route s'avérait nécessaire (peu probable pour ce lot, qui reste sur du libellé/contenu).

## Risques

- Risque de sur-interprétation : ce lot ne doit pas dériver vers une restructuration de la navigation déjà stabilisée par le chantier `ux-admin-storefront`.

## Critères de fin

- Le libellé de navigation et/ou le texte d'en-tête de l'écran "Avancé" distinguent explicitement gouvernance et configuration, validés par le propriétaire produit avant livraison.
- `pnpm run typecheck` et `pnpm run lint` passent.

## Agent recommandé

`next-admin-ui-builder`
