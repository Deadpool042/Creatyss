# Lot — Recadrage des médias + UX onglet Médias produit

## Statut

Livré — 2026-07-04. `typecheck` et `lint` passent.

## Notes de livraison

- Recadrage vérifié de bout en bout dans le navigateur : image produit "À recadrer (hors 4:5)" recadrée au preset 4:5 → carte repasse "Conforme 4:5 (hero-ready)" (833×1041 px), compteurs de conformité mis à jour, page rafraîchie via `refresh()`, aucune erreur console.
- Médiathèque globale : bouton "Recadrer" présent sur chaque carte (slot `actions` neutre ajouté à `AdminMediaAssetCard` pour respecter la frontière components/ ↔ features/).
- UX onglet Médias produit réorganisée : intro → actions d'import → galerie → convention repliée (`<details>`) → compteurs/conformité → image principale → outils alt text.
- La région de crop transite en fractions de l'image source (0-1), indépendante de la résolution d'affichage (`react-easy-crop` fournit des pourcentages source natifs).

## Contexte

Demande du propriétaire produit (revue visuelle du pilote `products/*`, chantier design macOS) : l'onglet Médias produit n'est pas intuitif, et l'admin signale des images "À recadrer (hors 4:5)" (convention galerie produit) sans offrir aucun outil de recadrage.

Décisions propriétaire produit (2026-07-04) :

- le recadrage **remplace** l'image de l'asset (in-place, nouvelle URL pour le cache) — pas de copie dérivée ;
- UI de sélection du cadre : **react-easy-crop** (dépendance ajoutée) ;
- périmètre : recadrage partagé **et** retouche UX de l'onglet Médias produit dans le même lot.

## État observé

- Les images produit sont des `MediaAsset` (+ `MediaReference` role GALLERY) — pas de modèle image dédié : un crop de l'asset se propage naturellement partout.
- Pipeline image centralisé : `core/uploads/image-processing.ts` (sharp → WebP q82, max 2000px), stockage FS local (`storageKey`/`publicUrl`).
- `ProductImageItem` calcule déjà la conformité 4:5 et affiche "À recadrer" sans action associée.
- L'onglet Médias produit ouvre sur un bloc "Convention média" (~15 lignes) + stats avant la première image.

## Périmètre

- `core/uploads/image-processing.ts` : fonction de crop (sharp `extract` + pipeline WebP existant).
- `features/admin/media/services/crop-admin-media.service.ts` : service partagé (lecture fichier, crop, écriture nouveau fichier, update asset, suppression ancien fichier).
- Server action partagée (guard admin + revalidation).
- `features/admin/media/components/media-crop-dialog.tsx` : dialog client react-easy-crop, presets ratio (4:5 par défaut — convention produit, 1:1, 3:2, 16:9).
- Intégration : carte image produit (`ProductImageItem`) + carte médiathèque globale.
- UX onglet Médias produit : galerie en premier, convention repliée (disclosure), stats compactes.

## Hors périmètre

- Variantes/dérivés d'image (`MediaVariant`), historique de versions, restauration de l'original.
- Rotation, filtres, retouche colorimétrique.
- Prisma (aucun changement de schéma — champs existants suffisants).

## Invariants

- Aucun changement Prisma.
- Le crop produit toujours du WebP via le pipeline commun (qualité/limites identiques à l'upload).
- URL changée après crop (cache-busting) ; les références (produit, catégories, SEO…) suivent l'asset par id, donc aucune migration de références.
- Comportement upload/attach/reorder/alt existant non régressé.

## Vérifications

- `pnpm run typecheck`, `pnpm run lint`
- Recadrage réel dans le navigateur sur une image "À recadrer" → passe "Conforme 4:5", fichier remplacé, ancienne URL morte, nouvelle serviable.
- Médiathèque globale : recadrage fonctionnel sur un asset.
- Onglet Médias produit : galerie visible sans scroll, convention repliée.
