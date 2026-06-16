# Cadrage - `ai.core` niveau `assistant` sur le blog

## Objectif

Ouvrir le niveau `assistant` de `ai.core` par extension du pattern SEO deja
present sur la fiche produit, cette fois sur l'edition d'un article de blog
existant.

## Perimetre

- service local de suggestion SEO pour `BLOG_POST`
- action admin dediee
- panneau local sur la page d'edition d'un article existant
- traçabilite `AiTask`
- doc domaine / roadmap

## Hors perimetre

- creation d'article
- publication automatique
- workflow d'acceptation transverse
- Open Graph / Twitter
- provider SDK externe
- assistant global multi-ecrans

## Invariants

- aucune sortie IA n'est sauvegardee sans action explicite de l'operateur
- aucune publication implicite
- meme strategie locale bornee que le lot produit
- tracabilite `AiTask` obligatoire
