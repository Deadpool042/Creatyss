# Lot `ai.core` automation - suggestion SEO preparee automatiquement

## Objectif

Donner un effet metier explicite au niveau `automation` de `ai.core` sans introduire de provider externe, de publication implicite ni d'acceptation silencieuse.

## Perimetre

- SEO produit admin
- SEO article de blog admin
- auto-declenchement borne d'une suggestion `SEO_SUGGESTION`

## Hors perimetre

- sauvegarde automatique des champs SEO
- publication automatique
- regeneration continue selon les changements de contenu
- workflow transverse d'acceptation/rejet

## Gradation par niveau

- `assistant`
  - suggestion manuelle sur demande
- `advanced`
  - historique local reutilisable
- `automation`
  - si aucun historique n'existe encore pour le sujet courant, une premiere suggestion est preparee automatiquement a l'ouverture de l'ecran
  - l'operateur doit toujours choisir d'appliquer la suggestion puis d'enregistrer

## Invariants

- `AiTask` reste la trace unique
- aucun champ SEO n'est modifie sans action explicite de l'operateur
- l'auto-declenchement ne se produit qu'en absence d'historique

## Risques

- confusion entre suggestion preparee et suggestion deja appliquee
- non-regeneration si le contenu source change apres une premiere suggestion

## Verifications

- typecheck repo
- verification navigateur sur SEO produit et blog avec niveau `automation`

## Critere de fin

Le niveau `automation` prepare automatiquement une suggestion initiale visible et traçable sur les ecrans SEO admin concernes, sans changer la source de verite finale du formulaire.
