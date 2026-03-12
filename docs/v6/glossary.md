# V6 — Glossaire projet et source de vérité

## Objectif

Ce document fixe le vocabulaire métier officiel du projet, les termes UI autorisés ou à éviter, ainsi que les documents qui font foi aujourd'hui.

Il complète `AGENTS.md`, `README.md` et `docs/v6/admin-language-and-ux.md`.

## Docs qui font foi aujourd'hui

- `AGENTS.md` : règles de travail, structure du repo, discipline de modification et exigences de lisibilité.
- `README.md` : entrée projet, lancement local, commandes utiles et vue d'ensemble courante.
- `docs/v6/scope.md` : périmètre fonctionnel V6.
- `docs/v6/data-model.md` : modèle métier V6, surtout pour le domaine produit.
- `docs/v6/roadmap.md` : découpage des lots V6 et ordre d'avancement.
- `docs/v6/admin-language-and-ux.md` : langage visible et UX admin produit.
- `docs/v6/glossary.md` : terminologie projet, termes UI autorisés ou à éviter, et rappel de hiérarchie documentaire.

## Règle de priorité documentaire

- Un lot suit d'abord les documents explicitement cités dans la demande.
- À défaut, `AGENTS.md`, `README.md` et les documents V6 ci-dessus font foi.
- Les docs V1 à V5, `docs/architecture-v1.md`, `docs/roadmap-v1.md` et `docs/testing/` restent utiles comme contexte historique, pas comme source de vérité courante, sauf demande explicite.

## Vocabulaire métier officiel

### Noyau transversal

- Produit simple
- Produit avec déclinaisons
- Informations de vente
- Déclinaison
- Référence
- Prix
- Prix barré
- Stock
- Publication
- Catégorie
- Page d'accueil
- Médias
- Boutique
- Panier
- Commande
- Paiement

### Règles de formulation

- Préférer des termes français, courts et directement métier.
- Préférer `Produit avec déclinaisons` à `Produit variable` dans l'UI visible.
- Préférer `Prix barré` à `prix comparé` ou `prix compare`.
- Préférer `Médias` à `Bibliothèque médias` quand un libellé court suffit.
- Garder `Slug` et `SEO` comme termes assumés du projet.

## Termes UI interdits ou à éviter

Ne pas utiliser comme chemin principal dans l'UI ou dans une documentation métier courte :

- produit parent
- produit vendable
- variante technique
- compatibilité legacy
- fallback
- compareAtPrice
- simpleOffer
- product_variants
- lecture native
- compatibilité transitoire
- produit variable
- prix comparé

## Vocabulaire interne toléré

Les termes techniques comme `simpleOffer`, `compareAtPrice`, `product_variants`, `legacy` ou `fallback` peuvent exister dans le code, les migrations ou des commentaires techniques ciblés quand ils sont utiles.

Ils ne doivent pas structurer l'UI principale, les messages visibles, ni la documentation courte destinée à décrire le métier ou le fonctionnement courant du projet.
