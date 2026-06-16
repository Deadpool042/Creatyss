# Cadrage - `catalog.products.media` niveau `automation`

**Date :** 2026-06-16
**Statut :** cadrage court + lot borné exécuté (2026-06-16)

## Objectif

Donner un effet fonctionnel au niveau `automation` sans ouvrir de worker, de
pipeline IA ou de traitement media transverse.

## Perimetre

- actions serveur media produit (`upload`, `attach`)
- services media produit associes
- retour UI local dans l'onglet medias
- doc domaine et roadmap

## Hors perimetre

- regeneration sur lecture de page
- reordonnancement automatique des textes alternatifs apres deplacement
- recompression / remplacement d'images
- `MediaVariant`
- batch planifie / worker
- IA / provider externe

## Capacites gatees

### `generation`

- bouton manuel pour completer les `altText` manquants

### `automation`

- a l'upload: si aucun `altText` n'est fourni, les nouvelles images produit
  recoivent automatiquement un texte alternatif local et deterministe
- a l'attachement depuis la mediatheque: les assets rattaches sans `altText`
  sont completes automatiquement
- aucun `altText` deja present n'est modifie

## Invariants

- jamais d'ecrasement d'un texte alternatif existant
- pas d'effet de bord sur les actions de lecture
- comportement borne au produit courant et a la mutation courante
- la saisie manuelle reste prioritaire
