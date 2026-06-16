# Cadrage - `catalog.products.media` niveau `generation`

## Objectif

Donner un effet fonctionnel reel au niveau `generation` de `catalog.products.media`
dans l'editeur produit, sans ouvrir de pipeline IA, de traitement asynchrone ou
d'automatisation media.

## Perimetre

- onglet medias de `app/admin/(protected)/catalog/products/[slug]/media/page.tsx`
- services/actions `features/admin/products/editor/**`
- documentation domaine/roadmap liee au lot

## Hors perimetre

- recompression ou remplacement des images existantes
- generation de variantes responsive (`MediaVariant`)
- verification automatique de l'ordre editorial de galerie
- automation batch ou traitement planifie
- IA / provider externe

## Capacites gatees par niveau

### `basic`

- upload d'images
- rattachement depuis la mediathque
- suppression, ordre, image principale
- edition manuelle du texte alternatif
- diagnostic ratio 4:5 existant

### `optimization`

- compteur agrege des images sans texte alternatif

### `generation`

- action admin explicite pour completer uniquement les `altText` manquants
- generation locale, deterministe, synchrone
- aucun ecrasement d'un texte alternatif deja renseigne

### `automation`

- reste non cable

## Invariants

- ne jamais modifier un `altText` deja present
- rester borne au produit courant
- conserver la priorite a l'edition manuelle
- ne pas introduire de dependance externe ni de nouvelle abstraction transverse

## Verification attendue

- typecheck TS strict
- verification manuelle de l'affichage du bloc `generation` seulement si le niveau effectif
  atteint `generation`
