# Lot `ai.core` advanced - historique SEO reutilisable

**Date :** 2026-06-16
**Statut :** cadrage court + lot borné exécuté (2026-06-16)

## Objectif

Donner un effet metier explicite au niveau `advanced` de `ai.core` sur les ecrans SEO admin deja equipes en niveau `assistant`.

## Perimetre

- SEO produit admin
- SEO article de blog admin
- lecture gouvernee de l'historique `AiTask` pour les suggestions `SEO_SUGGESTION`

## Hors perimetre

- changement de provider IA
- parametrage fin des prompts ou strategies
- auto-application des suggestions
- publication automatique du contenu genere

## Gradation par niveau

- `basic`
  - aucun outil SEO assiste
- `assistant`
  - generation manuelle d'une suggestion SEO
  - application manuelle dans le formulaire avant sauvegarde explicite
- `advanced`
  - consultation de l'historique recent des suggestions SEO deja tracees pour le meme sujet
  - reutilisation manuelle d'une suggestion precedente sans regeneration

## Invariants

- `AiTask` reste la trace unique des suggestions SEO
- aucune suggestion n'est appliquee automatiquement
- le formulaire reste la source de verite finale
- seuls les sujets reellement lies a la page courante sont exposes

## Risques

- `outputJson` historique incomplet ou invalide
- confusion si `assistant` et `advanced` ne sont pas lus separement

## Verifications

- typecheck cible repo
- verification navigateur sur admin settings et ecrans SEO produit/blog

## Critere de fin

Le niveau `advanced` de `ai.core` modifie effectivement les ecrans SEO admin en ajoutant un historique reutilisable des suggestions, sans changer les contrats metier existants.
